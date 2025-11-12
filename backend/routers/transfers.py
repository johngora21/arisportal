from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models.card import Card
from models.card_ledger import CardLedgerEntry, LedgerEntryType, LedgerEntrySource
from models.transfer import Transfer, BulkTransferRecipient, TransferType, TransferMethod, TransferStatus
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid
import jwt
import json
from services.clickpesa_service import ClickPesaService
from sqlalchemy import func

router = APIRouter()
security = HTTPBearer()

# ClickPesa bank metadata (BIC codes and defaults)
BANKS_METADATA = {
    "crdb": {"bic": "CORUTZTZ", "name": "CRDB Bank", "transfer_type": "ACH"},
    "nmb": {"bic": "NMBBTZTZ", "name": "NMB Bank", "transfer_type": "ACH"},
    "equity": {"bic": "EQBLTZTZ", "name": "Equity Bank Tanzania", "transfer_type": "ACH"},
    "absa": {"bic": "BARCTZTZ", "name": "Absa Bank Tanzania", "transfer_type": "ACH"},
    "stanbic": {"bic": "SBICTZTX", "name": "Stanbic Bank Tanzania", "transfer_type": "ACH"},
    "exim": {"bic": "EXIMTZTZ", "name": "Exim Bank Tanzania", "transfer_type": "ACH"},
    "diamond": {"bic": "DTKETZTZ", "name": "Diamond Trust Bank", "transfer_type": "ACH"},
    "kcb": {"bic": "KCBLTZTZ", "name": "KCB Bank Tanzania", "transfer_type": "ACH"},
    "national": {"bic": "NCBKTZTZ", "name": "National Bank of Commerce", "transfer_type": "ACH"},
    "barclays": {"bic": "BARCTZTZ", "name": "Barclays Bank Tanzania", "transfer_type": "ACH"},
}

# JWT Configuration
JWT_SECRET_KEY = "jwt-secret-string"
ALGORITHM = "HS256"

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user ID from JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
        return int(user_id)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# ============ Models ============
class CardTransferRequest(BaseModel):
    from_card_id: int
    to_card_id: int
    amount: float
    description: Optional[str] = None

class PeerTransferRequest(BaseModel):
    from_card_id: Optional[int] = None
    transfer_mode: str  # 'card' or 'external'
    transfer_method: str  # 'bank' or 'mno'
    recipient_name: str
    recipient_account: str  # Bank account or phone number
    recipient_bank: Optional[str] = None
    recipient_mno: Optional[str] = None
    amount: float
    description: Optional[str] = None

class BulkTransferRecipientRequest(BaseModel):
    recipient_name: str
    recipient_account: str
    amount: float
    bank_id: Optional[str] = None
    mno_id: Optional[str] = None

class BulkTransferRequest(BaseModel):
    from_card_id: Optional[int] = None
    transfer_mode: str  # 'card' or 'external'
    transfer_method: str  # 'bank' or 'mno'
    recipients: List[BulkTransferRecipientRequest]
    description: Optional[str] = None

class TransferResponse(BaseModel):
    id: int
    transfer_type: str
    status: str
    amount: float
    currency: str
    description: Optional[str] = None
    from_card_id: Optional[int] = None
    to_card_id: Optional[int] = None
    transfer_mode: Optional[str] = None
    transfer_method: Optional[str] = None
    recipient_name: Optional[str] = None
    recipient_account: Optional[str] = None
    recipient_bank: Optional[str] = None
    recipient_mno: Optional[str] = None
    created_at: datetime
    clickpesa_reference: Optional[str] = None
    transfer_summary: Optional[dict] = None
    
    class Config:
        from_attributes = True

# ============ Endpoints ============

def _get_card_balance(card_id: int, db: Session) -> float:
    credits = db.query(
        func.coalesce(func.sum(CardLedgerEntry.amount), 0.0)
    ).filter(
        CardLedgerEntry.card_id == card_id,
        CardLedgerEntry.entry_type == LedgerEntryType.CREDIT
    ).scalar() or 0.0

    debits = db.query(
        func.coalesce(func.sum(CardLedgerEntry.amount), 0.0)
    ).filter(
        CardLedgerEntry.card_id == card_id,
        CardLedgerEntry.entry_type == LedgerEntryType.DEBIT
    ).scalar() or 0.0

    balance = float(credits) - float(debits)

    # Fallback to cards table balance only when ledger has no activity
    if credits == 0 and debits == 0:
        card = db.query(Card).filter(Card.id == card_id).first()
        return float(card.balance) if card and card.balance is not None else 0.0

    return balance


def _recalculate_and_update_card_balance(card: Card, db: Session) -> None:
    balance = _get_card_balance(card.id, db)
    card.balance = balance
    db.flush()


def _create_ledger_entry(
    *,
    card_id: int,
    user_id: int,
    entry_type: LedgerEntryType,
    entry_source: LedgerEntrySource,
    amount: float,
    description: Optional[str],
    related_card_id: Optional[int],
    reference: str,
    db: Session
) -> CardLedgerEntry:
    entry = CardLedgerEntry(
        card_id=card_id,
        user_id=user_id,
        entry_type=entry_type,
        entry_source=entry_source,
        amount=amount,
        currency="TZS",
        description=description,
        related_card_id=related_card_id,
        reference=reference
    )
    db.add(entry)
    db.flush()
    return entry


def _normalize_phone_number(phone: str) -> str:
    """Normalize phone numbers to MSISDN format (e.g., 2557XXXXXXXX)."""
    digits = "".join(ch for ch in phone if ch.isdigit())
    if not digits:
        return digits

    if digits.startswith("255"):
        # Ensure standard length for Tanzanian MSISDN (12 digits)
        return digits[:12]

    if digits.startswith("0") and len(digits) >= 10:
        return "255" + digits[1:]

    if len(digits) == 9:
        # Assume missing leading zero but already without 255
        return "255" + digits

    return digits


def _resolve_bank_details(bank_identifier: Optional[str]) -> Optional[dict]:
    """
    Attempt to resolve bank metadata (primarily BIC and transfer type) from the identifier
    provided by the client. The identifier can be:
      - A known short code (e.g., 'crdb') mapped in BANKS_METADATA
      - A raw BIC (e.g., 'CORUTZTZ')
      - A string formatted as '<BIC>|<Name>'
    """
    if not bank_identifier:
        return None

    raw_value = bank_identifier.strip()
    if not raw_value:
        return None

    # Allow a composite value "BIC|Name"
    composite_parts = raw_value.split("|", 1)
    if len(composite_parts) == 2:
        bic_candidate = composite_parts[0].strip().upper()
        name_candidate = composite_parts[1].strip()
        if bic_candidate:
            return {
                "bic": bic_candidate,
                "transfer_type": "ACH",
                "name": name_candidate or raw_value,
            }

    normalized_key = raw_value.lower()
    metadata = BANKS_METADATA.get(normalized_key)
    if metadata:
        return {
            "bic": metadata.get("bic", raw_value.upper()),
            "transfer_type": metadata.get("transfer_type", "ACH"),
            "name": metadata.get("name") or raw_value,
        }

    # Treat raw value as BIC if it looks like one (8 or 11 characters, alphanumeric)
    bic_candidate = raw_value.replace(" ", "").upper()
    if len(bic_candidate) in (8, 11):
        return {
            "bic": bic_candidate,
            "transfer_type": "ACH",
            "name": raw_value,
        }

    # Fallback – still return something but require caller to validate BIC presence
    return {
        "bic": bic_candidate,
        "transfer_type": "ACH",
        "name": raw_value,
    }


@router.post("/card-to-card", response_model=TransferResponse)
async def create_card_to_card_transfer(
    transfer_data: CardTransferRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Transfer money between two cards (internal transfer)
    """
    if transfer_data.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    # Verify both cards belong to user
    from_card = db.query(Card).filter(
        Card.id == transfer_data.from_card_id,
        Card.user_id == user_id,
        Card.is_active == True
    ).first()
    
    to_card = db.query(Card).filter(
        Card.id == transfer_data.to_card_id,
        Card.user_id == user_id,
        Card.is_active == True
    ).first()
    
    if not from_card:
        raise HTTPException(status_code=404, detail="Source card not found")
    if not to_card:
        raise HTTPException(status_code=404, detail="Destination card not found")
    if from_card.id == to_card.id:
        raise HTTPException(status_code=400, detail="Cannot transfer to the same card")
    
    current_balance = _get_card_balance(from_card.id, db)
    if current_balance < transfer_data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Create transfer record
    transfer = Transfer(
        user_id=user_id,
        transfer_type=TransferType.CARD_TO_CARD,
        from_card_id=from_card.id,
        to_card_id=to_card.id,
        amount=transfer_data.amount,
        currency="TZS",
        description=transfer_data.description,
        status=TransferStatus.PROCESSING,
        transfer_mode="card"
    )
    
    db.add(transfer)
    
    try:
        reference = f"TRF-{uuid.uuid4().hex[:12].upper()}"

        # Debit source card
        _create_ledger_entry(
            card_id=from_card.id,
            user_id=user_id,
            entry_type=LedgerEntryType.DEBIT,
            entry_source=LedgerEntrySource.TRANSFER_OUT,
            amount=transfer_data.amount,
            description=transfer_data.description or f"Transfer to card {to_card.id}",
            related_card_id=to_card.id,
            reference=reference,
            db=db
        )

        # Credit destination card
        _create_ledger_entry(
            card_id=to_card.id,
            user_id=user_id,
            entry_type=LedgerEntryType.CREDIT,
            entry_source=LedgerEntrySource.TRANSFER_IN,
            amount=transfer_data.amount,
            description=transfer_data.description or f"Transfer from card {from_card.id}",
            related_card_id=from_card.id,
            reference=reference,
            db=db
        )

        # Update card balances to reflect new ledger totals
        _recalculate_and_update_card_balance(from_card, db)
        _recalculate_and_update_card_balance(to_card, db)
        
        # Update transfer status
        transfer.status = TransferStatus.COMPLETED
        
        db.commit()
        db.refresh(transfer)
        
        return transfer
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Transfer failed: {str(e)}")

@router.post("/local-peer", response_model=TransferResponse)
async def create_local_peer_transfer(
    transfer_data: PeerTransferRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Create a local peer transfer using ClickPesa (bank or MNO)
    """
    # Verify card belongs to user if transfer_mode is 'card'
    from_card = None
    if transfer_data.transfer_mode == 'card':
        if not transfer_data.from_card_id:
            raise HTTPException(status_code=400, detail="from_card_id is required when transfer_mode is 'card'")
        
        from_card = db.query(Card).filter(
            Card.id == transfer_data.from_card_id,
            Card.user_id == user_id
        ).first()
        
        if not from_card:
            raise HTTPException(status_code=404, detail="Source card not found")
        
        # Check balance (use ledger as source of truth)
        if _get_card_balance(from_card.id, db) < transfer_data.amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Create transfer record
    transfer = Transfer(
        user_id=user_id,
        transfer_type=TransferType.LOCAL_PEER,
        from_card_id=from_card.id if from_card else None,
        transfer_mode=transfer_data.transfer_mode,
        transfer_method=TransferMethod(transfer_data.transfer_method),
        recipient_name=transfer_data.recipient_name,
        recipient_account=transfer_data.recipient_account,
        recipient_bank=transfer_data.recipient_bank,
        recipient_mno=transfer_data.recipient_mno,
        amount=transfer_data.amount,
        currency="TZS",
        description=transfer_data.description,
        status=TransferStatus.PENDING
    )
    
    db.add(transfer)
    db.commit()
    db.refresh(transfer)
    
    # If MNO payout, process via ClickPesa and ledger
    if transfer_data.transfer_method == 'mno':
        # MNO payouts use card balance
        # External mode (control number) not supported for MNO yet
        if transfer_data.transfer_mode == 'external':
            raise HTTPException(status_code=400, detail="External source mode (control number) not yet implemented for MNO transfers")
        
        # For card mode, require a card and check balance
        if transfer_data.transfer_mode == 'card':
            if not from_card:
                raise HTTPException(status_code=400, detail="MNO payouts with card mode require a source card")
            # Balance check (ledger)
            current_balance = _get_card_balance(from_card.id, db)
            if current_balance < transfer_data.amount:
                raise HTTPException(status_code=400, detail="Insufficient balance")

        try:
            clickpesa_service = ClickPesaService()
            reference = f"TRF{transfer.id}{uuid.uuid4().hex[:8].upper()}"
            # Ensure phone format (no +, no spaces)
            phone = transfer_data.recipient_account.replace('+', '').replace(' ', '').replace('-', '')
            # If local format 0xxxxxxxxx, convert to 255xxxxxxxxx
            if phone.startswith('0') and len(phone) >= 10:
                phone = '255' + phone[1:]

            # Preferred: ClickPesa payouts API
            payout = clickpesa_service.create_mobile_money_payout(
                amount=transfer_data.amount,
                currency="TZS",
                phone_number=phone,
                order_reference=reference
            )

            # Map provider fields
            transfer.clickpesa_reference = payout.get('id') or payout.get('orderReference') or reference
            provider_status = (payout.get('status') or '').upper()
            print(f"[MNO PAYOUT] provider_status={provider_status} ref={transfer.clickpesa_reference} amount={transfer_data.amount} phone={phone}")

            if provider_status not in ["SUCCESS", "REVERSED"] and transfer.clickpesa_reference:
                # Poll payout status a few times to catch quick settlement
                polled = clickpesa_service.poll_mobile_money_payout_success(
                    transfer.clickpesa_reference,
                    max_attempts=5,
                    interval_seconds=2.5
                )
                polled_status = (polled.get('status') or '').upper()
                if polled_status:
                    provider_status = polled_status
                    print(f"[MNO PAYOUT] post-poll status={provider_status} ref={transfer.clickpesa_reference}")

            if provider_status in ["SUCCESS"]:
                # Confirmed success — debit from card only if using card mode
                if transfer_data.transfer_mode == 'card' and from_card:
                    _create_ledger_entry(
                        card_id=from_card.id,
                        user_id=user_id,
                        entry_type=LedgerEntryType.DEBIT,
                        entry_source=LedgerEntrySource.WITHDRAWAL,
                        amount=transfer_data.amount,
                        description=transfer_data.description or f"MNO payout to {transfer_data.recipient_name}",
                        related_card_id=None,
                        reference=transfer.clickpesa_reference,
                        db=db
                    )
                    _recalculate_and_update_card_balance(from_card, db)
                transfer.status = TransferStatus.COMPLETED
            elif provider_status in ["REVERSED"]:
                transfer.status = TransferStatus.FAILED
                print(f"[MNO PAYOUT] Payout reversed by provider. Status={provider_status}")
            else:
                # Pending/processing — do NOT debit yet
                transfer.status = TransferStatus.PROCESSING
                print(f"[MNO PAYOUT] Payout not confirmed, no debit. Status={provider_status}")

            db.commit()
            db.refresh(transfer)
            return transfer
        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            transfer.status = TransferStatus.FAILED
            db.add(transfer)
            db.commit()
            raise HTTPException(status_code=500, detail=f"ClickPesa MNO payout failed: {str(e)}")

    elif transfer_data.transfer_method == 'bank':
        # Bank payouts can use:
        # - transfer_mode='card': Debit from card balance, then ClickPesa routes to bank
        # - transfer_mode='external': Generate control number for external payment
        bank_details = _resolve_bank_details(transfer_data.recipient_bank)
        if not bank_details or not bank_details.get("bic"):
            raise HTTPException(status_code=400, detail="A valid bank selection (with BIC) is required for bank payouts")

        # For external mode, generate control number (different flow)
        if transfer_data.transfer_mode == 'external':
            # TODO: Implement control number generation for external payments
            raise HTTPException(status_code=400, detail="External source mode (control number) not yet implemented for bank transfers")

        try:
            clickpesa_service = ClickPesaService()
            reference = f"TRF{transfer.id}{uuid.uuid4().hex[:8].upper()}"

            # Create bank payout via ClickPesa
            # - If transfer_mode='card': We'll debit from card balance below
            # - If transfer_mode='external': Generate control number (not yet implemented for bank transfers)
            payout = clickpesa_service.create_bank_payout(
                amount=transfer_data.amount,
                account_number=transfer_data.recipient_account,
                account_name=transfer_data.recipient_name or transfer_data.recipient_account,
                currency="TZS",
                order_reference=reference,
                bic=bank_details["bic"],
                transfer_type=bank_details.get("transfer_type", "ACH"),
            )

            transfer.clickpesa_response = json.dumps(payout)
            transfer.clickpesa_reference = (
                payout.get("id")
                or payout.get("orderReference")
                or payout.get("reference")
                or reference
            )

            provider_status = (payout.get("status") or "").upper()

            if provider_status == "SUCCESS":
                transfer.status = TransferStatus.COMPLETED
            elif provider_status in {"AUTHORIZED", "PROCESSING"}:
                transfer.status = TransferStatus.PROCESSING
            elif provider_status in {"REVERSED", "FAILED"}:
                transfer.status = TransferStatus.FAILED
            else:
                transfer.status = TransferStatus.PROCESSING

            if from_card and transfer.status != TransferStatus.FAILED:
                _create_ledger_entry(
                    card_id=from_card.id,
                    user_id=user_id,
                    entry_type=LedgerEntryType.DEBIT,
                    entry_source=LedgerEntrySource.TRANSFER_OUT,
                    amount=transfer_data.amount,
                    description=transfer_data.description or f"Bank payout to {transfer_data.recipient_name}",
                    related_card_id=None,
                    reference=transfer.clickpesa_reference,
                    db=db,
                )
                _recalculate_and_update_card_balance(from_card, db)

            db.commit()
            db.refresh(transfer)
            return transfer
        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            transfer.status = TransferStatus.FAILED
            transfer.clickpesa_response = json.dumps({"error": str(e)})
            db.add(transfer)
            db.commit()
            raise HTTPException(status_code=500, detail=f"ClickPesa bank payout failed: {str(e)}")

    # Default fallback (should not be reached)
    transfer.status = TransferStatus.FAILED
    db.commit()
    raise HTTPException(status_code=400, detail="Unsupported transfer method")

@router.post("/local-bulk", response_model=TransferResponse)
async def create_local_bulk_transfer(
    transfer_data: BulkTransferRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Create a local bulk transfer using ClickPesa (multiple recipients)
    """
    if not transfer_data.recipients:
        raise HTTPException(status_code=400, detail="At least one recipient is required")
    
    # Verify card belongs to user if transfer_mode is 'card'
    from_card = None
    total_amount = sum(r.amount for r in transfer_data.recipients)
    
    if transfer_data.transfer_mode == 'card':
        if not transfer_data.from_card_id:
            raise HTTPException(status_code=400, detail="from_card_id is required when transfer_mode is 'card'")
        
        from_card = db.query(Card).filter(
            Card.id == transfer_data.from_card_id,
            Card.user_id == user_id
        ).first()
        
        if not from_card:
            raise HTTPException(status_code=404, detail="Source card not found")
        
        # Check balance
        if from_card.balance < total_amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Create transfer record
    transfer = Transfer(
        user_id=user_id,
        transfer_type=TransferType.LOCAL_BULK,
        from_card_id=from_card.id if from_card else None,
        transfer_mode=transfer_data.transfer_mode,
        transfer_method=TransferMethod(transfer_data.transfer_method),
        amount=total_amount,
        currency="TZS",
        description=transfer_data.description,
        status=TransferStatus.PENDING
    )
    
    db.add(transfer)
    db.flush()  # Get transfer ID
    
    # Create recipient records
    recipients = []
    for recipient_data in transfer_data.recipients:
        recipient = BulkTransferRecipient(
            transfer_id=transfer.id,
            recipient_name=recipient_data.recipient_name,
            recipient_account=recipient_data.recipient_account,
            amount=recipient_data.amount,
            bank_id=recipient_data.bank_id,
            mno_id=recipient_data.mno_id,
            status=TransferStatus.PENDING
        )
        db.add(recipient)
        recipients.append(recipient)
    
    db.commit()
    db.refresh(transfer)
    
    clickpesa_service = ClickPesaService()
    batch_reference = f"BULK{transfer.id}{uuid.uuid4().hex[:8].upper()}"
    transfer.clickpesa_reference = batch_reference

    summary_recipients = []
    any_failed = False
    all_completed = True
    any_processing = False

    try:
        for idx, recipient in enumerate(recipients, start=1):
            recipient_reference = f"{batch_reference}-R{idx:02d}"
            provider_payload = None

            try:
                if transfer.transfer_method == TransferMethod.MNO:
                    normalized_phone = _normalize_phone_number(recipient.recipient_account)
                    if not normalized_phone:
                        raise Exception("Invalid mobile phone number")

                    provider_payload = clickpesa_service.create_mobile_money_payout(
                        amount=recipient.amount,
                        currency="TZS",
                        phone_number=normalized_phone,
                        order_reference=recipient_reference,
                    )
                else:
                    # Bank payout
                    # - transfer_mode='card': Debit from card balance
                    # - transfer_mode='external': Generate control number (not implemented yet)
                    bank_details = _resolve_bank_details(recipient.bank_id)
                    if not bank_details or not bank_details.get("bic"):
                        raise Exception(f"Unsupported or missing bank mapping for '{recipient.bank_id}'")

                    # Create bank payout via ClickPesa
                    # - If transfer_mode='card': We'll debit from card balance below
                    # - If transfer_mode='external': Generate control number (not yet implemented for bank transfers)
                    provider_payload = clickpesa_service.create_bank_payout(
                        amount=recipient.amount,
                        account_number=recipient.recipient_account,
                        account_name=recipient.recipient_name or recipient.recipient_account,
                        currency="TZS",
                        order_reference=recipient_reference,
                        bic=bank_details["bic"],
                        transfer_type=bank_details.get("transfer_type", "ACH"),
                    )
            except Exception as recipient_error:
                recipient.status = TransferStatus.FAILED
                recipient.clickpesa_reference = recipient_reference
                recipient.clickpesa_response = json.dumps({"error": str(recipient_error)})

                summary_recipients.append({
                    "recipientId": recipient.id,
                    "recipientName": recipient.recipient_name,
                    "account": recipient.recipient_account,
                    "amount": recipient.amount,
                    "status": TransferStatus.FAILED.value,
                    "error": str(recipient_error),
                })

                any_failed = True
                all_completed = False
                continue

            provider_status = (provider_payload.get("status") or "").upper()
            provider_reference = (
                provider_payload.get("id")
                or provider_payload.get("orderReference")
                or provider_payload.get("reference")
                or recipient_reference
            )

            if provider_status == "SUCCESS":
                recipient.status = TransferStatus.COMPLETED
            elif provider_status in {"AUTHORIZED", "PROCESSING"}:
                recipient.status = TransferStatus.PROCESSING
                all_completed = False
                any_processing = True
            else:
                recipient.status = TransferStatus.PROCESSING
                all_completed = False
                any_processing = True

            recipient.clickpesa_reference = provider_reference
            recipient.clickpesa_response = json.dumps(provider_payload)

            summary_recipients.append({
                "recipientId": recipient.id,
                "recipientName": recipient.recipient_name,
                "account": recipient.recipient_account,
                "amount": recipient.amount,
                "status": recipient.status.value,
                "providerStatus": provider_status or "PROCESSING",
                "providerReference": provider_reference,
            })

            # Debit from card balance if transfer_mode='card'
            if from_card and recipient.status != TransferStatus.FAILED:
                _create_ledger_entry(
                    card_id=from_card.id,
                    user_id=user_id,
                    entry_type=LedgerEntryType.DEBIT,
                    entry_source=LedgerEntrySource.TRANSFER_OUT,
                    amount=recipient.amount,
                    description=transfer_data.description or f"Bulk payout to {recipient.recipient_name}",
                    related_card_id=None,
                    reference=provider_reference,
                    db=db,
                )

        if from_card:
            _recalculate_and_update_card_balance(from_card, db)

        if any_failed and not any_processing and not all_completed:
            transfer.status = TransferStatus.FAILED
        elif all_completed and not any_failed:
            transfer.status = TransferStatus.COMPLETED
        else:
            transfer.status = TransferStatus.PROCESSING

        summary_payload = {
            "batch_reference": batch_reference,
            "currency": "TZS",
            "counts": {
                "total": len(summary_recipients),
                "completed": sum(1 for item in summary_recipients if item["status"] == TransferStatus.COMPLETED.value),
                "processing": sum(1 for item in summary_recipients if item["status"] == TransferStatus.PROCESSING.value),
                "failed": sum(1 for item in summary_recipients if item["status"] == TransferStatus.FAILED.value),
            },
            "recipients": summary_recipients,
        }

        transfer.clickpesa_response = json.dumps(summary_payload)
        setattr(transfer, "transfer_summary", summary_payload)
        
        db.commit()
        db.refresh(transfer)
        return transfer
        
    except Exception as e:
        db.rollback()
        transfer.status = TransferStatus.FAILED
        transfer.clickpesa_response = json.dumps({
            "batch_reference": batch_reference,
            "error": str(e),
        })
        db.add(transfer)
        db.commit()
        db.refresh(transfer)
        raise HTTPException(status_code=500, detail=f"Bulk transfer failed: {str(e)}")

@router.get("/", response_model=List[TransferResponse])
async def get_user_transfers(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all transfers for a user"""
    try:
        transfers = db.query(Transfer).filter(
            Transfer.user_id == user_id
        ).order_by(Transfer.created_at.desc()).all()
        
        # Convert SQLAlchemy models to dict format for Pydantic
        result = []
        for transfer in transfers:
            result.append({
                "id": transfer.id,
                "transfer_type": transfer.transfer_type.value if hasattr(transfer.transfer_type, 'value') else str(transfer.transfer_type),
                "status": transfer.status.value if hasattr(transfer.status, 'value') else str(transfer.status),
                "amount": transfer.amount,
                "currency": transfer.currency,
                "description": transfer.description,
                "from_card_id": transfer.from_card_id,
                "to_card_id": transfer.to_card_id,
                "transfer_mode": transfer.transfer_mode,
                "transfer_method": transfer.transfer_method.value if transfer.transfer_method and hasattr(transfer.transfer_method, 'value') else (str(transfer.transfer_method) if transfer.transfer_method else None),
                "recipient_name": transfer.recipient_name,
                "recipient_account": transfer.recipient_account,
                "recipient_bank": transfer.recipient_bank,
                "recipient_mno": transfer.recipient_mno,
                "created_at": transfer.created_at,
                "clickpesa_reference": transfer.clickpesa_reference,
                "transfer_summary": None
            })
        
        return result
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ Error fetching transfers: {str(e)}")
        print(error_trace)
        raise HTTPException(status_code=500, detail=f"Failed to fetch transfers: {str(e)}")

@router.get("/{transfer_id}", response_model=TransferResponse)
async def get_transfer(
    transfer_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get a specific transfer"""
    transfer = db.query(Transfer).filter(
        Transfer.id == transfer_id,
        Transfer.user_id == user_id
    ).first()
    
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")
    
    return transfer

@router.get("/banks/list")
async def get_clickpesa_banks(
    user_id: int = Depends(get_current_user_id)
):
    """Get list of banks supported by ClickPesa for payouts"""
    try:
        clickpesa_service = ClickPesaService()
        banks = clickpesa_service.get_banks_list()
        return banks
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ Error fetching banks list: {str(e)}")
        print(f"❌ Traceback: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch banks: {str(e)}")

