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
from services.clickpesa_service import ClickPesaService
from sqlalchemy import func

router = APIRouter()
security = HTTPBearer()

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
    created_at: datetime
    clickpesa_reference: Optional[str] = None
    
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
        # Only allow card-backed payouts for now
        if transfer_data.transfer_mode != 'card' or not from_card:
            raise HTTPException(status_code=400, detail="MNO payouts must use a source card")

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
                # Confirmed success — perform DEBIT and mark completed
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

    # Bank flow remains placeholder
    try:
        transfer.status = TransferStatus.PROCESSING
        db.commit()
        db.refresh(transfer)
        return transfer
    except Exception as e:
        db.rollback()
        transfer.status = TransferStatus.FAILED
        db.commit()
        raise HTTPException(status_code=500, detail=f"Transfer failed: {str(e)}")

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
    
    try:
        # Process each recipient via ClickPesa
        # TODO: Integrate with ClickPesa bulk payout API when available
        reference = f"BULK{transfer.id}{uuid.uuid4().hex[:8].upper()}"
        
        transfer.clickpesa_reference = reference
        transfer.status = TransferStatus.PROCESSING
        
        # If using card, deduct balance
        if from_card:
            from_card.balance -= total_amount
        
        # Update recipient statuses
        for recipient in recipients:
            recipient.status = TransferStatus.PROCESSING
            recipient.clickpesa_reference = f"{reference}-{recipient.id}"
        
        db.commit()
        db.refresh(transfer)
        
        return transfer
        
    except Exception as e:
        db.rollback()
        transfer.status = TransferStatus.FAILED
        db.commit()
        raise HTTPException(status_code=500, detail=f"Bulk transfer failed: {str(e)}")

@router.get("/", response_model=List[TransferResponse])
async def get_user_transfers(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all transfers for a user"""
    transfers = db.query(Transfer).filter(
        Transfer.user_id == user_id
    ).order_by(Transfer.created_at.desc()).all()
    
    return transfers

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

