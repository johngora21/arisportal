from fastapi import APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models.card import Card, CardTransaction
from models.card_ledger import CardLedgerEntry, LedgerEntryType, LedgerEntrySource
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid
import jwt
from routers.clickpesa import get_clickpesa_token
import httpx

router = APIRouter()
security = HTTPBearer()

# JWT Configuration (should match auth.py)
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

# Environment variable for shared BillPay-Namba
import os
SHARED_BILLPAY_NAMBA = os.getenv('CLICKPESA_BILLPAY_NAMBA', '3864')  # Your ClickPesa merchant number

# ============ Models ============
class CardCreate(BaseModel):
    card_type: str
    cardholder_name: str
    # Note: last_four removed - not needed for control-number based cards

class CardResponse(BaseModel):
    id: int
    card_type: str
    card_number: Optional[str] = None  # Control number (for top-ups) - this is the actual ClickPesa control number
    control_number: Optional[str] = None  # Also include control_number separately for clarity
    expiry_month: Optional[str] = None  # Not in database, always None
    expiry_year: Optional[str] = None   # Not in database, always None
    cardholder_name: Optional[str] = None
    is_active: bool
    is_default: bool
    balance: float
    created_at: Optional[str] = None
    
    class Config:
        from_attributes = True

class CreateCustomerPaymentRequest(BaseModel):
    amount: float
    currency: str = "TZS"
    description: Optional[str] = None
    customer_name: str
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None

class SyncPaymentRequest(BaseModel):
    """Request model for manual payment sync"""
    order_ids: Optional[List[str]] = None  # Optional: specific Order IDs to sync (e.g., ["92727335-8943", "92726196-2838"])
    # If not provided, will sync all cards


# ============ Helper Functions ============
def calculate_card_balance(card_id: int, db: Session) -> float:
    """
    Calculate card balance from ledger entries (debit/credit).
    Balance = Sum of CREDITS - Sum of DEBITS
    If no ledger entries exist, returns the current balance from cards table (for backward compatibility).
    """
    from sqlalchemy import text
    
    # Check if table exists and has entries
    try:
        balance_query = text("""
            SELECT 
                COALESCE(SUM(CASE WHEN entry_type = 'CREDIT' THEN amount ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN entry_type = 'DEBIT' THEN amount ELSE 0 END), 0) as balance
            FROM card_ledger_entries
            WHERE card_id = :card_id
        """)
        result = db.execute(balance_query, {"card_id": card_id}).fetchone()
        balance = float(result[0]) if result and result[0] is not None else 0.0
    except Exception as e:
        # If ledger table doesn't exist or has issues, fallback to cards.balance
        print(f"⚠️ Error calculating balance from ledger: {str(e)}, using cards.balance")
        fallback_query = text("SELECT balance FROM cards WHERE id = :card_id")
        fallback_result = db.execute(fallback_query, {"card_id": card_id}).fetchone()
        balance = float(fallback_result[0]) if fallback_result and fallback_result[0] is not None else 0.0
    
    # Update the card's balance field (for backward compatibility and quick access)
    try:
        update_query = text("""
            UPDATE cards 
            SET balance = :balance, updated_at = NOW()
            WHERE id = :card_id
        """)
        db.execute(update_query, {"balance": balance, "card_id": card_id})
        db.commit()
    except Exception as e:
        print(f"⚠️ Error updating card balance: {str(e)}")
        db.rollback()
    
    return balance

def create_ledger_entry(
    card_id: int,
    user_id: int,
    entry_type: LedgerEntryType,
    entry_source: LedgerEntrySource,
    amount: float,
    currency: str = "TZS",
    reference: Optional[str] = None,
    description: Optional[str] = None,
    clickpesa_order_id: Optional[str] = None,
    clickpesa_control_number: Optional[str] = None,
    clickpesa_response: Optional[str] = None,
    related_transaction_id: Optional[int] = None,
    related_card_id: Optional[int] = None,
    db: Session = None
) -> CardLedgerEntry:
    """
    Create a ledger entry (debit or credit) and update card balance.
    """
    ledger_entry = CardLedgerEntry(
        card_id=card_id,
        user_id=user_id,
        entry_type=entry_type,
        entry_source=entry_source,
        amount=amount,
        currency=currency,
        reference=reference,
        description=description,
        clickpesa_order_id=clickpesa_order_id,
        clickpesa_control_number=clickpesa_control_number,
        clickpesa_response=clickpesa_response,
        related_transaction_id=related_transaction_id,
        related_card_id=related_card_id
    )
    
    db.add(ledger_entry)
    db.commit()
    db.refresh(ledger_entry)
    
    # Recalculate and update card balance
    calculate_card_balance(card_id, db)
    
    return ledger_entry

# ============ Endpoints ============
@router.get("", response_model=List[CardResponse])
async def get_user_cards(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all cards for the current user"""
    try:
        # Use raw SQL to select only columns that exist in the database
        from sqlalchemy import text
        query = text("""
            SELECT id, user_id, card_type, cardholder_name, 
                   is_active, is_default, balance, topup_control_number, 
                   expiry_month, expiry_year, created_at
            FROM cards
            WHERE user_id = :user_id
              AND (is_active = 1 OR is_active IS NULL)
            ORDER BY created_at DESC
        """)
        rows = db.execute(query, {"user_id": user_id}).fetchall()
        
        # Convert to dict format for response
        result = []
        for row in rows:
            control_number = row.topup_control_number if hasattr(row, 'topup_control_number') else None
            
            # Recalculate balance from ledger entries
            card_balance = calculate_card_balance(row.id, db)
            
            result.append({
                'id': row.id,
                'card_type': row.card_type,
                'card_number': control_number,  # Control number is the card number (for top-ups)
                'control_number': control_number,  # Also include separately for clarity
                'expiry_month': row.expiry_month if hasattr(row, 'expiry_month') and row.expiry_month else None,
                'expiry_year': row.expiry_year if hasattr(row, 'expiry_year') and row.expiry_year else None,
                'cardholder_name': row.cardholder_name,
                'is_active': bool(row.is_active),
                'is_default': bool(row.is_default),
                'balance': card_balance,  # Calculate from ledger entries (not from cards.balance)
                'created_at': row.created_at.isoformat() if row.created_at else None
            })
        
        return result
    except Exception as e:
        import traceback
        print(f"Error fetching cards: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error fetching cards: {str(e)}")

@router.post("", response_model=CardResponse)
async def create_card(
    card_data: CardCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Create a new card for business. 
    - Card number is auto-generated
    - ClickPesa BillPay control number is auto-generated for top-ups (no expiry, no fixed amount)
    """
    try:
        # Check if this is the first card, make it default
        # Use raw SQL to avoid loading non-existent columns
        from sqlalchemy import text
        count_query = text("SELECT COUNT(*) as count FROM cards WHERE user_id = :user_id")
        result = db.execute(count_query, {"user_id": user_id}).fetchone()
        existing_cards = result[0] if result else 0
        is_default = existing_cards == 0
        
        # Calculate expiry date (3 years from now)
        from datetime import datetime, timedelta
        expiry_date = datetime.now() + timedelta(days=3*365)  # 3 years
        expiry_month = expiry_date.strftime("%m")  # MM format (01-12)
        expiry_year = expiry_date.strftime("%Y")   # YYYY format
        
        # Get user profile for phone/email (ClickPesa API requires customerPhone OR customerEmail)
        # ClickPesa wants the END CUSTOMER's (payer's) contact info, not the merchant's
        # In our case: Customer = ArisPortal user (card owner who will top up), Merchant = ArisPortal
        from models.user import UserProfile
        user_profile = db.query(UserProfile).filter(UserProfile.id == user_id).first()
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Use ArisPortal user's phone/email (they are the customer/payer for this control number)
        # Prefer business contact, fallback to personal contact
        customer_phone = user_profile.business_phone or user_profile.phone
        customer_email = user_profile.business_email or user_profile.email
        
        # Users always have email (required for registration), so this should always work
        if not customer_email:
            customer_email = user_profile.email  # Login email (always exists)
        
        # Format phone number for ClickPesa (must start with country code, no plus sign, no spaces)
        # Example: +255 123 456 789 -> 255123456789
        if customer_phone:
            # Remove plus sign, spaces, dashes, parentheses
            formatted_phone = customer_phone.replace('+', '').replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
            # If it doesn't start with country code (255 for Tanzania), add it
            if not formatted_phone.startswith('255'):
                # If it starts with 0, replace with 255 (Tanzanian format: 0xxx -> 255xxx)
                if formatted_phone.startswith('0'):
                    formatted_phone = '255' + formatted_phone[1:]
                # If it's just digits without country code, assume Tanzania and add 255
                elif formatted_phone.isdigit() and len(formatted_phone) == 9:
                    formatted_phone = '255' + formatted_phone
            customer_phone = formatted_phone
        
        # ClickPesa requires at least phone OR email - verify we have one
        if not customer_phone and not customer_email:
            raise HTTPException(
                status_code=400,
                detail="Please add a phone number or email address to your profile to create a card. ClickPesa requires customer contact information."
            )
    
        # Generate ClickPesa Order BillPay Control Number for card top-ups via API ONLY
        # Requirements:
        # - Generated via Order BillPay API ONLY (no manual generation, no fallbacks)
        # - Expires when card expires (3 years from now - same as card expiry)
        # - Allows any amount at any time until expiration (ALLOW_PARTIAL_AND_OVER_PAYMENT)
        # - No fixed amount (very high billAmount)
        topup_control_number = None
        try:
            token = get_clickpesa_token()
            
            # Generate unique order reference (numeric)
            import random
            import time
            order_reference = f"{user_id}{int(time.time()) % 10000000}{random.randint(1000, 9999)}"
            order_reference = order_reference[:12]  # Limit to 12 digits for reference
            
            # ⚠️ CRITICAL LIMITATION: Customer Name CANNOT Appear in MNO/Bank Apps
            # 
            # What appears in MNO/bank apps (Vodacom, Airtel, Tigo, Halopesa, CRDB, NMB, etc.):
            # - Merchant Name: "Clickpesa Tanzania" (FIXED at ClickPesa account level)
            # - Control Number: [The control number] (numeric)
            # - Amount: [Payment amount]
            # 
            # ❌ Customer name/profile username WILL NOT appear in MNO/bank apps
            # ❌ The customerName field we send is ONLY for ClickPesa's internal records
            # ❌ ClickPesa API does NOT support custom merchant names per transaction
            # ❌ MNO apps ONLY show the account-level merchant name, not API fields
            # 
            # ✅ SOLUTION: Control number is the ONLY identifier that appears
            # - Each card has a UNIQUE control number
            # - Customer must verify control number matches their card before paying
            # - After payment, customer verifies by checking card balance in ArisPortal app
            # 
            # 📞 TO CHANGE WHAT APPEARS: Contact ClickPesa support to update account-level merchant name
            # (Note: This would change merchant name for ALL transactions, not per customer)
            #
            
            card_name = card_data.cardholder_name or f"{card_data.card_type.title()} Card"
            card_type_display = card_data.card_type.replace("_", " ").title()
            
            # Create Customer BillPay Control Number via ClickPesa API
            # Customer BillPay creates customer records that show up in ClickPesa dashboard
            # This allows reusable control numbers for card top-ups (any amount, any time)
            customer_name = card_data.cardholder_name or f"{card_data.card_type.replace('_', ' ').title()} Card"
            
            billpay_request = {
                "customerName": customer_name,
                "billDescription": f"Card top-up: {card_name}",
                "billPaymentMode": "ALLOW_PARTIAL_AND_OVER_PAYMENT",
                "billAmount": 999999999.0,  # High amount to allow any top-up amount
                "billReference": order_reference
            }
            
            # REQUIRED: Phone and/or email for customer identification
            # ClickPesa uses this to create customer record and associate control number
            if customer_phone:
                billpay_request["customerPhone"] = customer_phone
            if customer_email:
                billpay_request["customerEmail"] = customer_email
            
            # Use Customer BillPay API (creates customer record, shows in dashboard)
            response = httpx.post(
                "https://api.clickpesa.com/third-parties/billpay/create-customer-control-number",
                headers={
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                json=billpay_request,
                timeout=10.0
            )
            response.raise_for_status()
            billpay_response = response.json()
            print(f"ClickPesa Customer BillPay API Response: {billpay_response}")
            
            # ClickPesa returns control number - check various possible field names
            topup_control_number = (
                billpay_response.get('billPayNumber') or 
                billpay_response.get('controlNumber') or 
                billpay_response.get('orderControlNumber') or
                billpay_response.get('billPayControlNumber') or
                billpay_response.get('data', {}).get('billPayNumber') or
                billpay_response.get('data', {}).get('controlNumber') or
                billpay_response.get('result', {}).get('billPayNumber') or
                billpay_response.get('result', {}).get('controlNumber')
            )
            
            if not topup_control_number:
                # Log full response for debugging
                error_msg = (
                    f"ClickPesa Customer BillPay API did not return a control number. "
                    f"Response: {billpay_response}. "
                    f"Please check ClickPesa API documentation for the correct response format."
                )
                print(f"❌ {error_msg}")
                raise ValueError(error_msg)
            
            print(f"✅ Generated control number via Customer BillPay API: {topup_control_number}")
            print(f"   Control number length: {len(topup_control_number)} digits")
            print(f"   Customer name: {customer_name}")
            print(f"   Card: {card_name}")
            print(f"   Allows: Any amount, any time")
            print(f"   ✅ Customer record created in ClickPesa dashboard")
                
        except httpx.HTTPStatusError as e:
            error_detail = f"ClickPesa API error: {e.response.status_code}"
            try:
                error_body = e.response.json()
                error_detail = error_body.get('message', error_detail)
                print(f"❌ ClickPesa API Error Response: {error_body}")
            except:
                pass
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create ClickPesa control number: {error_detail}. Please check your ClickPesa credentials and try again."
            )
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"❌ Error creating control number: {str(e)}")
            print(error_trace)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create control number: {str(e)}. Control number is required for card creation."
            )
        
        # CONTROL NUMBER IS REQUIRED - don't create card without it
        if not topup_control_number:
            raise HTTPException(
                status_code=500,
                detail="Control number generation failed. Card cannot be created without a control number."
            )
        
        # Create card with control number and expiry date
        card = Card(
            user_id=user_id,
            card_type=card_data.card_type,
            cardholder_name=card_data.cardholder_name,
            is_default=is_default,
            balance=0.0,
            topup_control_number=topup_control_number,  # Store the control number for top-ups
            expiry_month=expiry_month,  # MM format (e.g., "12")
            expiry_year=expiry_year     # YYYY format (e.g., "2027")
        )
        
        db.add(card)
        db.commit()
        # Don't use db.refresh() - it might try to load non-existent columns
        # Instead, get the card ID from the committed object
        
        card_id = card.id  # Get ID before we lose the object reference
        
        # Return as dict using data we already have (avoid querying database again)
        # The card_number is the control number (for top-ups)
        return {
            'id': card_id,
            'card_type': card_data.card_type,
            'card_number': topup_control_number,  # Control number is the card number (REQUIRED)
            'control_number': topup_control_number,  # ClickPesa control number for top-ups
            'expiry_month': expiry_month,  # MM format (e.g., "12")
            'expiry_year': expiry_year,    # YYYY format (e.g., "2027")
            'cardholder_name': card_data.cardholder_name,
            'is_active': True,  # Default is_active value
            'is_default': is_default,
            'balance': 0.0,
            'created_at': None  # Will be set by database, but we're not querying it back
        }
    except HTTPException:
        # Re-raise HTTP exceptions (like 401, 404, etc.)
        raise
    except Exception as e:
        # Log the error and return a proper error response
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error creating card: {str(e)}")
        print(error_trace)
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create card: {str(e)}"
        )

@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_card(
    card_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Soft delete a card after ensuring it has zero balance."""
    card = db.query(Card).filter(Card.id == card_id, Card.user_id == user_id).first()
    if not card or not card.is_active:
        raise HTTPException(status_code=404, detail="Card not found")

    balance = calculate_card_balance(card.id, db)
    if balance > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a card with a remaining balance. Please move or withdraw funds first."
        )

    try:
        card.is_active = False
        card.is_default = False
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete card: {str(e)}")


@router.put("/{card_id}/default", status_code=status.HTTP_200_OK)
async def set_default_card(
    card_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Set the specified card as the default card for the user."""
    card = db.query(Card).filter(Card.id == card_id, Card.user_id == user_id, Card.is_active == True).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    try:
        # Unset existing default card(s)
        db.query(Card).filter(Card.user_id == user_id, Card.is_default == True).update({Card.is_default: False})
        # Set this card as default
        card.is_default = True
        db.commit()
        return {"success": True, "message": "Default card updated"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to set default card: {str(e)}")


@router.post("/{card_id}/create-customer-payment")
async def create_customer_payment(
    card_id: int,
    payment_data: CreateCustomerPaymentRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Create a customer payment for this business.
    Generates a Customer BillPay Control Number for the customer to pay.
    """
    # Verify card belongs to user
    card = db.query(Card).filter(
        Card.id == card_id,
        Card.user_id == user_id
    ).first()
    
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    # Generate unique Customer BillPay Control Number for this business
    customer_billpay_control_number = None
    try:
        token = get_clickpesa_token()
        payment_reference = f"PAY{card_id}{uuid.uuid4().hex[:12].upper()}"
        
        # Create Customer BillPay Control Number via ClickPesa API
        billpay_request = {
            "customerName": payment_data.customer_name,
            "billDescription": payment_data.description or f"Payment to {card.cardholder_name}",
            "billPaymentMode": "ALLOW_PARTIAL_AND_OVER_PAYMENT",
            "billAmount": payment_data.amount,
            "billReference": payment_reference
        }
        
        if payment_data.customer_phone:
            billpay_request["customerPhone"] = payment_data.customer_phone
        if payment_data.customer_email:
            billpay_request["customerEmail"] = payment_data.customer_email
        
        response = httpx.post(
            "https://api.clickpesa.com/third-parties/billpay/create-customer-control-number",
            headers={
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            json=billpay_request,
            timeout=10.0
        )
        response.raise_for_status()
        billpay_response = response.json()
        customer_billpay_control_number = billpay_response.get('billPayNumber')
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating Customer BillPay Control Number: {str(e)}")
    
    # Create transaction record
    transaction = CardTransaction(
        card_id=card_id,
        user_id=user_id,
        amount=payment_data.amount,
        currency=payment_data.currency,
        customer_billpay_control_number=customer_billpay_control_number,
        payment_reference=payment_reference,
        customer_name=payment_data.customer_name,
        customer_phone=payment_data.customer_phone,
        customer_email=payment_data.customer_email,
        description=payment_data.description or f"Payment from {payment_data.customer_name}",
        status="pending",
        transaction_type="customer_payment"
    )
    
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    
    return {
        "success": True,
        "transaction_id": transaction.id,
        "customer_billpay_control_number": customer_billpay_control_number,
        "shared_billpay_namba": SHARED_BILLPAY_NAMBA,
        "payment_reference": payment_reference,
        "amount": payment_data.amount,
        "currency": payment_data.currency,
        "message": f"Share the control number {customer_billpay_control_number} with your customer. They should use merchant number {SHARED_BILLPAY_NAMBA} when paying."
    }

@router.post("/webhook/payment")
async def payment_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook endpoint to receive payment notifications from ClickPesa
    Handles three types of payments:
    1. Card top-ups (via topup_control_number) - credits card balance
    2. Customer payments (via customer_billpay_control_number) - credits card balance
    3. Remittance payments - routes to Wise when payment is received
    """
    data = await request.json()
    print(f"🔔 ClickPesa Webhook Received: {data}")
    
    # Extract payment details from webhook
    payment_reference = data.get('paymentReference') or data.get('reference')
    billpay_number = data.get('billPayNumber') or data.get('controlNumber') or data.get('billpayNumber')
    order_id = data.get('orderId') or data.get('order_id') or data.get('orderID')
    amount = float(data.get('amount', 0) or data.get('amountReceived', 0) or 0)
    status = data.get('status', 'pending')
    
    # Normalize control number: remove dashes, spaces, and convert to string
    def normalize_control_number(control_num):
        if not control_num:
            return None
        # Remove dashes, spaces, and any non-digit characters
        normalized = str(control_num).replace('-', '').replace(' ', '').replace('_', '')
        # Extract only digits
        normalized = ''.join(filter(str.isdigit, normalized))
        return normalized if normalized else None
    
    # Try to extract control number from Order ID if provided
    # Order ID format: "92727335-8943" or "927273358943"
    if order_id and not billpay_number:
        # Order ID might contain the control number
        billpay_number = normalize_control_number(order_id)
        print(f"📋 Extracted control number from Order ID: {order_id} -> {billpay_number}")
    
    # Normalize the control number for matching
    normalized_control_number = normalize_control_number(billpay_number)
    print(f"🔍 Normalized control number: {billpay_number} -> {normalized_control_number}")
    
    if not normalized_control_number:
        print(f"❌ No control number found in webhook data")
        return {"status": "error", "message": "No control number found"}
    
    # First, check if this is a remittance payment
    from models.remittance import Remittance, RemittanceProvider, RemittanceStatus
    from services.wise_service import WiseService
    
    # Match remittances by normalized control number
    remittance_query = text("""
        SELECT id, remittance_id, provider_control_number, provider
        FROM remittances
        WHERE provider = 'WISE' AND provider_control_number IS NOT NULL
    """)
    all_remittances = db.execute(remittance_query).fetchall()
    
    matched_remittance = None
    for rem_row in all_remittances:
        rem_control_number = normalize_control_number(rem_row.provider_control_number)
        if rem_control_number == normalized_control_number:
            matched_remittance = rem_row
            print(f"✅ Matched remittance {rem_row.remittance_id} with control number {rem_control_number}")
            break
    
    if matched_remittance and status in ['completed', 'SUCCESS', 'SETTLED']:
        # This is a Wise remittance payment
        # Route payment to Wise by funding the transfer
        try:
            # Update remittance status
            update_remittance_query = text("""
                UPDATE remittances
                SET status = 'PROCESSING',
                    status_message = :status_message,
                    updated_at = NOW()
                WHERE id = :remittance_id
            """)
            db.execute(update_remittance_query, {
                "status_message": f"Payment received via ClickPesa: {amount} TZS",
                "remittance_id": matched_remittance.id
            })
            db.commit()
            
            # TODO: Implement actual funding to Wise
            # Option 1: If you have Wise balance, fund directly:
            # wise_service = WiseService()
            # funding_result = wise_service.fund_transfer_from_balance(matched_remittance.provider_transfer_id)
            
            # Option 2: Route to Wise bank account with reference T{transfer_id}
            # This requires sending money to Wise's bank account
            # The reference must be T{transfer_id} for Wise to match the payment
            
            print(f"💰 Remittance {matched_remittance.remittance_id} payment received: {amount} TZS")
            print(f"📋 Transfer ID: {matched_remittance.provider_transfer_id}")
            
        except Exception as e:
            print(f"❌ Error routing remittance payment to Wise: {str(e)}")
            # Don't fail the webhook, just log the error
        
        return {"status": "success", "type": "remittance", "remittance_id": matched_remittance.remittance_id}
    
    # Check if this is a card top-up (payment to card's topup_control_number)
    # Match by normalized control number (remove dashes/spaces for comparison)
    from sqlalchemy import text
    
    # Query cards and normalize control numbers for comparison
    cards_query = text("""
        SELECT id, user_id, card_type, cardholder_name, balance, topup_control_number
        FROM cards
        WHERE topup_control_number IS NOT NULL
    """)
    all_cards = db.execute(cards_query).fetchall()
    
    print(f"🔍 Searching through {len(all_cards)} cards for control number: {normalized_control_number}")
    matched_card = None
    for card_row in all_cards:
        card_control_number = normalize_control_number(card_row.topup_control_number)
        print(f"   Card ID {card_row.id} ({card_row.cardholder_name}): stored='{card_row.topup_control_number}' -> normalized='{card_control_number}'")
        if card_control_number == normalized_control_number:
            matched_card = card_row
            print(f"✅ MATCHED! Card ID {card_row.id} ({card_row.cardholder_name}) with control number {card_control_number}")
            break
    
    if not matched_card:
        print(f"❌ No card found matching control number: {normalized_control_number}")
        print(f"   Available control numbers: {[normalize_control_number(c.topup_control_number) for c in all_cards if c.topup_control_number]}")
    
    if matched_card and status in ['completed', 'SUCCESS', 'SETTLED']:
        # This is a top-up payment - create CREDIT ledger entry
        # Check if this payment was already processed (avoid duplicates)
        existing_ledger_query = text("""
            SELECT id FROM card_ledger_entries
            WHERE card_id = :card_id
            AND entry_type = 'CREDIT'
            AND entry_source = 'CLICKPESA_TOPUP'
            AND clickpesa_control_number = :control_number
            AND amount = :amount
            LIMIT 1
        """)
        existing_ledger = db.execute(existing_ledger_query, {
            "card_id": matched_card.id,
            "control_number": normalized_control_number,
            "amount": amount
        }).fetchone()
        
        if existing_ledger:
            print(f"⏭️ Payment already processed, skipping duplicate")
            new_balance = calculate_card_balance(matched_card.id, db)
            return {
                "status": "success", 
                "type": "card_topup", 
                "message": "Payment already processed",
                "card_id": matched_card.id,
                "new_balance": new_balance
            }
        
        # Create CREDIT ledger entry for top-up
        ledger_entry = create_ledger_entry(
            card_id=matched_card.id,
            user_id=matched_card.user_id,
            entry_type=LedgerEntryType.CREDIT,
            entry_source=LedgerEntrySource.CLICKPESA_TOPUP,
            amount=amount,
            currency="TZS",
            reference=payment_reference or f"TOPUP-{normalized_control_number}",
            description=f"Top-up payment for {matched_card.cardholder_name or matched_card.card_type} card",
            clickpesa_order_id=order_id,
            clickpesa_control_number=normalized_control_number,
            clickpesa_response=str(data),
            db=db
        )
        
        # Also log the transaction (for transaction history)
        transaction_query = text("""
            INSERT INTO card_transactions 
            (card_id, user_id, amount, currency, customer_billpay_control_number, 
             payment_reference, description, status, transaction_type, clickpesa_response, created_at)
            VALUES 
            (:card_id, :user_id, :amount, :currency, :control_number, 
             :payment_reference, :description, :status, :transaction_type, :clickpesa_response, NOW())
        """)
        db.execute(transaction_query, {
            "card_id": matched_card.id,
            "user_id": matched_card.user_id,
            "amount": amount,
            "currency": "TZS",
            "control_number": normalized_control_number,
            "payment_reference": payment_reference or f"TOPUP-{normalized_control_number}",
            "description": f"Top-up payment for {matched_card.cardholder_name or matched_card.card_type} card",
            "status": "completed",
            "transaction_type": "deposit",
            "clickpesa_response": str(data)
        })
        db.commit()
        
        # Get updated balance (calculated from ledger)
        new_balance = calculate_card_balance(matched_card.id, db)
        
        print(f"💰 Created CREDIT ledger entry: {amount} TZS to card ID {matched_card.id}. New balance: {new_balance}")
        return {
            "status": "success", 
            "type": "card_topup", 
            "card_id": matched_card.id, 
            "amount": amount,
            "new_balance": new_balance,
            "ledger_entry_id": ledger_entry.id
        }
    
    # Check if this is a customer payment transaction (pending transactions)
    transaction_query = text("""
        SELECT id, card_id, user_id, customer_billpay_control_number
        FROM card_transactions
        WHERE customer_billpay_control_number IS NOT NULL
    """)
    all_transactions = db.execute(transaction_query).fetchall()
    
    matched_transaction = None
    for trans_row in all_transactions:
        trans_control_number = normalize_control_number(trans_row.customer_billpay_control_number)
        if trans_control_number == normalized_control_number:
            matched_transaction = trans_row
            print(f"✅ Matched transaction ID {trans_row.id} with control number {trans_control_number}")
            break
    
    if matched_transaction and status in ['completed', 'SUCCESS', 'SETTLED']:
        # Check if this payment was already processed (avoid duplicates)
        existing_ledger_query = text("""
            SELECT id FROM card_ledger_entries
            WHERE card_id = :card_id
            AND entry_type = 'CREDIT'
            AND entry_source = 'CLICKPESA_TOPUP'
            AND clickpesa_control_number = :control_number
            AND amount = :amount
            LIMIT 1
        """)
        existing_ledger = db.execute(existing_ledger_query, {
            "card_id": matched_transaction.card_id,
            "control_number": normalized_control_number,
            "amount": amount
        }).fetchone()
        
        if existing_ledger:
            print(f"⏭️ Customer payment already processed, skipping duplicate")
            # Update transaction status anyway
            update_trans_query = text("""
                UPDATE card_transactions
                SET status = 'completed',
                    payment_reference = :payment_reference,
                    clickpesa_response = :clickpesa_response,
                    updated_at = NOW()
                WHERE id = :transaction_id
            """)
            db.execute(update_trans_query, {
                "payment_reference": payment_reference or f"PAY-{normalized_control_number}",
                "clickpesa_response": str(data),
                "transaction_id": matched_transaction.id
            })
            db.commit()
            new_balance = calculate_card_balance(matched_transaction.card_id, db)
            return {
                "status": "success",
                "type": "customer_payment",
                "message": "Payment already processed",
                "card_id": matched_transaction.card_id,
                "new_balance": new_balance
            }
        
        # Update transaction status
        update_trans_query = text("""
            UPDATE card_transactions
            SET status = 'completed',
                payment_reference = :payment_reference,
                clickpesa_response = :clickpesa_response,
                updated_at = NOW()
            WHERE id = :transaction_id
        """)
        db.execute(update_trans_query, {
            "payment_reference": payment_reference or f"PAY-{normalized_control_number}",
            "clickpesa_response": str(data),
            "transaction_id": matched_transaction.id
        })
        
        # Create CREDIT ledger entry for customer payment
        ledger_entry = create_ledger_entry(
            card_id=matched_transaction.card_id,
            user_id=matched_transaction.user_id,
            entry_type=LedgerEntryType.CREDIT,
            entry_source=LedgerEntrySource.CLICKPESA_TOPUP,
            amount=amount,
            currency="TZS",
            reference=payment_reference or f"PAY-{normalized_control_number}",
            description=f"Customer payment received",
            clickpesa_order_id=order_id,
            clickpesa_control_number=normalized_control_number,
            clickpesa_response=str(data),
            related_transaction_id=matched_transaction.id,
            db=db
        )
        
        # Get updated balance (calculated from ledger)
        new_balance = calculate_card_balance(matched_transaction.card_id, db)
        
        print(f"💰 Created CREDIT ledger entry for customer payment: {amount} TZS to card ID {matched_transaction.card_id}. New balance: {new_balance}")
        return {
            "status": "success",
            "type": "customer_payment",
            "card_id": matched_transaction.card_id,
            "amount": amount,
            "new_balance": new_balance,
            "ledger_entry_id": ledger_entry.id
        }
    
    # No matching payment found
    print(f"❌ Payment not found for control number: {normalized_control_number} (original: {billpay_number})")
    print(f"📋 Full webhook data: {data}")
    return {
        "status": "not_found", 
        "message": f"Payment not found for control number: {normalized_control_number}",
        "control_number": normalized_control_number,
        "order_id": order_id
    }

@router.get("/debug/control-numbers")
async def debug_control_numbers(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Debug endpoint to check stored control numbers"""
    from sqlalchemy import text
    query = text("""
        SELECT id, cardholder_name, topup_control_number, balance
        FROM cards
        WHERE user_id = :user_id
        ORDER BY id
    """)
    rows = db.execute(query, {"user_id": user_id}).fetchall()
    
    result = []
    for row in rows:
        result.append({
            "card_id": row.id,
            "card_name": row.cardholder_name,
            "control_number": row.topup_control_number,
            "control_number_length": len(row.topup_control_number) if row.topup_control_number else 0,
            "balance": float(row.balance) if row.balance else 0.0
        })
    
    return {"cards": result}

@router.get("/{card_id}/transactions")
async def get_card_transactions(
    card_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all transactions for a specific card"""
    transactions = db.query(CardTransaction).filter(
        CardTransaction.card_id == card_id,
        CardTransaction.user_id == user_id
    ).order_by(CardTransaction.created_at.desc()).all()
    
    return transactions

@router.post("/sync-payments")
async def sync_payments_from_clickpesa(
    sync_request: Optional[SyncPaymentRequest] = None,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Manually sync payments from ClickPesa API.
    
    Option 1: If order_ids provided, syncs those specific payments
    Option 2: If no order_ids, queries each card's control number from ClickPesa API
    
    Only processes payments with status "SETTLED" or "SUCCESS".
    """
    try:
        from sqlalchemy import text
        import httpx
        from routers.clickpesa import get_clickpesa_token
        
        # Normalize control number helper function
        def normalize_control_number(control_num):
            if not control_num:
                return None
            normalized = str(control_num).replace('-', '').replace(' ', '').replace('_', '')
            normalized = ''.join(filter(str.isdigit, normalized))
            return normalized if normalized else None
        
        # Get ClickPesa token
        token = get_clickpesa_token()
        
        # Get all cards for this user
        cards_query = text("""
            SELECT id, user_id, card_type, cardholder_name, balance, topup_control_number
            FROM cards
            WHERE user_id = :user_id AND topup_control_number IS NOT NULL
        """)
        user_cards = db.execute(cards_query, {"user_id": user_id}).fetchall()
        
        if not user_cards:
            return {
                "status": "no_cards",
                "message": "No cards found with control numbers for this user"
            }
        
        synced_count = 0
        updated_cards = []
        errors = []
        payments_to_process = []
        
        # If order_ids provided, process those specific payments
        if sync_request and sync_request.order_ids:
            print(f"📋 Syncing specific Order IDs: {sync_request.order_ids}")
            for order_id in sync_request.order_ids:
                # Normalize order ID to get control number
                normalized_order_id = normalize_control_number(order_id)
                if not normalized_order_id:
                    errors.append(f"Order ID {order_id}: Invalid format")
                    continue
                
                # Find matching card
                matched_card = None
                for card_row in user_cards:
                    card_control_number = normalize_control_number(card_row.topup_control_number)
                    if card_control_number == normalized_order_id:
                        matched_card = card_row
                        break
                
                if not matched_card:
                    errors.append(f"Order ID {order_id}: No card found matching control number {normalized_order_id}")
                    continue
                
                # Query ClickPesa API for this payment
                # Try different endpoints
                endpoints_to_try = [
                    f"/third-parties/billpay/payments/{normalized_order_id}",
                    f"/third-parties/billpay/payment/{normalized_order_id}",
                    f"/third-parties/payments/{normalized_order_id}",
                    f"/payments/{order_id}",  # Try with original order_id format
                    f"/payments/{normalized_order_id}",
                ]
                
                payment_data = None
                for endpoint in endpoints_to_try:
                    try:
                        response = httpx.get(
                            f"https://api.clickpesa.com{endpoint}",
                            headers={
                                'Authorization': token,
                                'Content-Type': 'application/json'
                            },
                            timeout=10.0
                        )
                        
                        if response.status_code == 200:
                            payment_data = response.json()
                            if isinstance(payment_data, dict) and 'data' in payment_data:
                                payment_data = payment_data['data']
                            print(f"✅ Found payment for Order ID {order_id} from endpoint: {endpoint}")
                            break
                    except httpx.HTTPStatusError as e:
                        if e.response.status_code == 404:
                            continue
                    except Exception as e:
                        continue
                
                if payment_data:
                    payments_to_process.append({
                        "card": matched_card,
                        "payment_data": payment_data,
                        "order_id": order_id,
                        "control_number": normalized_order_id
                    })
                else:
                    errors.append(f"Order ID {order_id}: Payment not found in ClickPesa API")
        else:
            # Fetch all transactions from ClickPesa API using the account statement endpoint
            print(f"📋 Fetching all transactions from ClickPesa account statement...")
            
            all_transactions = []
            
            # Use ClickPesa's account statement endpoint to get ALL transactions
            # This is the correct endpoint according to ClickPesa API docs
            try:
                from datetime import datetime, timedelta
                # Get transactions from last 90 days (to catch all recent payments)
                end_date = datetime.now()
                start_date = end_date - timedelta(days=90)
                
                # Format dates as YYYY-MM-DD
                start_date_str = start_date.strftime('%Y-%m-%d')
                end_date_str = end_date.strftime('%Y-%m-%d')
                
                response = httpx.get(
                    "https://api.clickpesa.com/third-parties/account/statement",
                    headers={
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    params={
                        'startDate': start_date_str,
                        'endDate': end_date_str,
                        'currency': 'TZS'
                    },
                    timeout=15.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    # Debug: Print the response structure
                    print(f"🔍 Account statement response keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
                    
                    # Extract transactions from response
                    # Response format: { "accountDetails": {...}, "transactions": [...] }
                    if isinstance(data, dict):
                        transactions = data.get('transactions', [])
                        if transactions:
                            all_transactions = transactions if isinstance(transactions, list) else []
                            print(f"✅ Found {len(all_transactions)} transactions from account statement")
                            # Debug: Print first transaction structure
                            if all_transactions and len(all_transactions) > 0:
                                print(f"🔍 First transaction keys: {list(all_transactions[0].keys()) if isinstance(all_transactions[0], dict) else 'Not a dict'}")
                                print(f"🔍 First transaction sample: {str(all_transactions[0])[:500]}")
                        else:
                            print(f"⚠️ Account statement returned no transactions")
                            print(f"🔍 Full response: {str(data)[:1000]}")
                    else:
                        print(f"⚠️ Unexpected account statement response format: {type(data)}")
                        print(f"🔍 Response: {str(data)[:1000]}")
                elif response.status_code == 401:
                    print(f"❌ Authentication failed for account statement")
                    errors.append("ClickPesa authentication failed")
                else:
                    error_text = response.text[:500] if hasattr(response, 'text') else str(response.status_code)
                    print(f"⚠️ Account statement returned {response.status_code}: {error_text}")
                    errors.append(f"Failed to fetch account statement: {response.status_code}")
            except httpx.TimeoutException:
                print(f"⚠️ Account statement request timed out")
                errors.append("Account statement request timed out")
            except Exception as e:
                print(f"⚠️ Error fetching account statement: {str(e)}")
                errors.append(f"Error fetching account statement: {str(e)}")
            
            # If account statement didn't work or returned no transactions, try querying each card's control number
            if not all_transactions:
                print(f"📋 Account statement didn't return transactions, querying each card's control number...")
                for card_row in user_cards:
                    control_number = card_row.topup_control_number
                    normalized_control_number = normalize_control_number(control_number)
                    
                    if not normalized_control_number:
                        print(f"⚠️ Card {card_row.id}: Invalid control number {control_number}")
                        continue
                    
                    # Query BillPay number details using the correct endpoint
                    # GET /third-parties/billpay/{billPayNumber}
                    try:
                        billpay_response = httpx.get(
                            f"https://api.clickpesa.com/third-parties/billpay/{normalized_control_number}",
                            headers={
                                'Authorization': token,
                                'Content-Type': 'application/json'
                            },
                            timeout=10.0
                        )
                        
                        if billpay_response.status_code == 200:
                            billpay_data = billpay_response.json()
                            # This gives us the BillPay details, but we still need to find payments
                            # The billpay endpoint shows the control number details, not payment transactions
                            print(f"✅ Found BillPay details for {normalized_control_number}: {billpay_data.get('billDescription', 'N/A')}")
                            # Note: This endpoint gives BillPay details, not payment transactions
                            # We still need transactions from the account statement
                    except Exception as e:
                        print(f"⚠️ Error querying BillPay {normalized_control_number}: {str(e)}")
                        continue
            
            # Match transactions to cards by control number (billPayNumber)
            if all_transactions:
                print(f"📋 Matching {len(all_transactions)} transactions to {len(user_cards)} cards...")
                print(f"🔍 User cards control numbers: {[normalize_control_number(c.topup_control_number) for c in user_cards if c.topup_control_number]}")
                
                for idx, transaction in enumerate(all_transactions):
                    if idx < 3:  # Debug first 3 transactions
                        print(f"🔍 Transaction {idx} keys: {list(transaction.keys()) if isinstance(transaction, dict) else 'Not a dict'}")
                        print(f"🔍 Transaction {idx} sample: {str(transaction)[:500]}")
                    # Extract control number from transaction
                    # Account statement transactions should have billPayNumber field
                    transaction_billpay = (
                        transaction.get('billPayNumber') or 
                        transaction.get('billpayNumber') or 
                        transaction.get('controlNumber') or 
                        transaction.get('billPay') or
                        transaction.get('reference') or
                        transaction.get('orderId') or
                        transaction.get('order_id') or
                        transaction.get('orderReference') or
                        transaction.get('description') or  # Sometimes control number is in description
                        str(transaction.get('id', '')) or  # Sometimes ID contains control number
                        ''
                    )
                    
                    # Normalize the control number from transaction
                    transaction_control_number = normalize_control_number(transaction_billpay)
                    
                    if idx < 3:  # Debug first 3 transactions
                        print(f"🔍 Transaction {idx} billPayNumber field: {transaction_billpay}")
                        print(f"🔍 Transaction {idx} normalized control: {transaction_control_number}")
                    
                    if not transaction_control_number:
                        # Skip transactions without control numbers
                        if idx < 3:
                            print(f"⚠️ Transaction {idx} has no control number - skipping")
                        continue
                    
                    # Find matching card by control number
                    matched_card = None
                    for card_row in user_cards:
                        card_control_number = normalize_control_number(card_row.topup_control_number)
                        # Match by exact control number
                        if card_control_number and transaction_control_number:
                            if card_control_number == transaction_control_number:
                                matched_card = card_row
                                if idx < 3:
                                    print(f"✅ EXACT MATCH: Transaction {idx} control {transaction_control_number} = Card {card_row.id} control {card_control_number}")
                                break
                            # Also check if transaction control number contains card control number (for partial matches)
                            if card_control_number in transaction_control_number or transaction_control_number in card_control_number:
                                matched_card = card_row
                                if idx < 3:
                                    print(f"✅ PARTIAL MATCH: Transaction {idx} control {transaction_control_number} contains Card {card_row.id} control {card_control_number}")
                                break
                    
                    if idx < 3 and not matched_card:
                        print(f"❌ NO MATCH: Transaction {idx} control {transaction_control_number} doesn't match any card")
                    
                    if matched_card:
                        # Extract transaction details
                        transaction_status = (transaction.get('status') or transaction.get('Status') or transaction.get('transactionStatus') or '').upper()
                        transaction_order_id = transaction.get('orderId') or transaction.get('order_id') or transaction.get('orderID') or transaction.get('reference') or transaction_billpay
                        
                        # Process all transactions (no status filter)
                        payments_to_process.append({
                            "card": matched_card,
                            "payment_data": transaction,
                            "order_id": transaction_order_id,
                            "control_number": transaction_control_number
                        })
                        print(f"✅ Matched transaction {transaction_order_id} (control: {transaction_control_number}) to card {matched_card.id} ({matched_card.cardholder_name}) - Status: {transaction_status}")
                    else:
                        # Log unmatched transactions for debugging (only first few to avoid spam)
                        if len([p for p in payments_to_process if p.get('control_number') == transaction_control_number]) == 0:
                            print(f"⚠️ No card found for transaction control number: {transaction_control_number} (transaction: {transaction.get('orderId', transaction.get('reference', 'N/A'))})")
            else:
                errors.append("No transactions found in ClickPesa account statement. Payments may sync automatically via webhook.")
        
        # Process each payment
        for payment_info in payments_to_process:
            try:
                card_row = payment_info["card"]
                payment_data = payment_info["payment_data"]
                order_id = payment_info["order_id"]
                normalized_control_number = payment_info["control_number"]
                
                # Extract payment details - ClickPesa account statement uses various field names
                payment_status = (
                    payment_data.get('status') or 
                    payment_data.get('Status') or 
                    payment_data.get('transactionStatus') or 
                    payment_data.get('paymentStatus') or 
                    payment_data.get('state') or
                    ''
                ).upper()
                
                # Extract amount - account statement transactions might use different field names
                amount = float(
                    payment_data.get('amount') or 
                    payment_data.get('amountReceived') or 
                    payment_data.get('collectedAmount') or 
                    payment_data.get('Amount') or 
                    payment_data.get('Amount Received') or
                    payment_data.get('AmountReceived') or
                    payment_data.get('transactionAmount') or
                    payment_data.get('creditAmount') or
                    payment_data.get('debitAmount') or
                    payment_data.get('value') or
                    0
                )
                
                # For account statement, amount might be negative for debits, so take absolute value if it's a credit transaction
                if amount < 0 and payment_status in ['SETTLED', 'SUCCESS', 'COMPLETED', 'PAID']:
                    # This might be a debit, but if status is SUCCESS it could be a payment received
                    # Check transaction type if available
                    transaction_type = payment_data.get('type') or payment_data.get('transactionType') or ''
                    if 'credit' in transaction_type.lower() or 'payment' in transaction_type.lower():
                        amount = abs(amount)
                order_id_from_api = (
                    payment_data.get('orderId') or 
                    payment_data.get('order_id') or 
                    payment_data.get('orderReference') or 
                    payment_data.get('orderID') or 
                    payment_data.get('Order ID') or
                    payment_data.get('OrderID') or
                    order_id
                )
                
                # Also try to extract control number from Order ID if it contains it
                # Order ID format might be like "92727335-8943" where the control number is embedded
                if order_id_from_api and not normalized_control_number:
                    # Remove dashes and extract digits
                    normalized_from_order = normalize_control_number(order_id_from_api)
                    if normalized_from_order:
                        normalized_control_number = normalized_from_order
                
                # Process all payments regardless of status
                # (Status check removed - process all transactions)
                
                if amount <= 0:
                    errors.append(f"Card {card_row.id}: Invalid amount {amount}")
                    continue
                
                # Extract unique payment ID from transaction
                # Each payment has a unique ID (e.g., "927273358943LCP3350", "927273358943LCP5488")
                # This is different from order_id which can be reused for multiple top-ups
                # ClickPesa account statement returns 'id' field with unique payment ID
                payment_id = (
                    payment_data.get('id') or  # This is the unique payment ID from ClickPesa
                    payment_data.get('paymentId') or 
                    payment_data.get('transactionId') or 
                    payment_data.get('ID') or
                    payment_data.get('transaction_id') or
                    None  # Don't fallback to order_id - we need the unique ID
                )
                
                # If no unique payment ID, skip this transaction (it's not a valid payment)
                if not payment_id or payment_id == order_id_from_api:
                    print(f"⚠️ Card {card_row.id}: No unique payment ID found for transaction, skipping")
                    continue
                
                # Check if this EXACT payment (by unique payment ID) was already processed
                # Each payment has a unique ID (e.g., "927273358943LCP3350") - use that to prevent duplicates
                ledger_check = text("""
                    SELECT id FROM card_ledger_entries
                    WHERE card_id = :card_id
                    AND entry_type = 'CREDIT'
                    AND entry_source = 'CLICKPESA_TOPUP'
                    AND clickpesa_order_id = :payment_id
                    LIMIT 1
                """)
                existing_ledger = db.execute(ledger_check, {
                    "card_id": card_row.id,
                    "payment_id": payment_id
                }).fetchone()
                
                if existing_ledger:
                    print(f"⏭️ Card {card_row.id}: Payment with ID {payment_id} already processed, skipping duplicate")
                    continue
                
                # Create CREDIT ledger entry for synced payment
                # Always use unique payment ID (e.g., "927273358943LCP3350") as clickpesa_order_id
                unique_payment_id = payment_id  # This is the unique payment ID from ClickPesa
                
                ledger_entry = create_ledger_entry(
                    card_id=card_row.id,
                    user_id=card_row.user_id,
                    entry_type=LedgerEntryType.CREDIT,
                    entry_source=LedgerEntrySource.CLICKPESA_TOPUP,
                    amount=amount,
                    currency="TZS",
                    reference=unique_payment_id or f"SYNC-{normalized_control_number}",
                    description=f"Synced payment for {card_row.cardholder_name or card_row.card_type} card",
                    clickpesa_order_id=unique_payment_id,  # Store unique payment ID
                    clickpesa_control_number=normalized_control_number,
                    clickpesa_response=str(payment_data),
                    db=db
                )
                
                # Also log the transaction (for transaction history)
                # Skip if card_transactions table has foreign key issues - ledger is the source of truth
                try:
                    transaction_query = text("""
                        INSERT INTO card_transactions 
                        (card_id, user_id, amount, currency, customer_billpay_control_number, 
                         payment_reference, description, status, transaction_type, clickpesa_response, created_at)
                        VALUES 
                        (:card_id, :user_id, :amount, :currency, :control_number, 
                         :payment_reference, :description, :status, :transaction_type, :clickpesa_response, NOW())
                    """)
                    db.execute(transaction_query, {
                        "card_id": card_row.id,
                        "user_id": card_row.user_id,
                        "amount": amount,
                        "currency": "TZS",
                        "control_number": normalized_control_number,
                        "payment_reference": unique_payment_id or f"SYNC-{normalized_control_number}",
                        "description": f"Synced payment for {card_row.cardholder_name or card_row.card_type} card",
                        "status": "completed",
                        "transaction_type": "deposit",
                        "clickpesa_response": str(payment_data)
                    })
                except Exception as trans_error:
                    # Transaction logging failed, but ledger entry was created - that's OK
                    # Ledger is the source of truth for balances
                    print(f"⚠️ Failed to log transaction (non-critical): {str(trans_error)}")
                    pass
                
                # Get updated balance (calculated from ledger)
                new_balance = calculate_card_balance(card_row.id, db)
                
                synced_count += 1
                updated_cards.append({
                    "card_id": card_row.id,
                    "card_name": card_row.cardholder_name,
                    "control_number": normalized_control_number,
                    "amount": amount,
                    "status": payment_status,
                    "new_balance": new_balance,
                    "order_id": order_id_from_api
                })
                
                print(f"✅ Synced payment: {amount} TZS to card {card_row.id} ({card_row.cardholder_name}). New balance: {new_balance}")
                
            except Exception as e:
                import traceback
                error_trace = traceback.format_exc()
                errors.append(f"Card {card_row.id}: {str(e)}")
                print(f"❌ Error processing payment: {str(e)}")
                print(error_trace)
                continue
        
        db.commit()
        
        return {
            "status": "success",
            "synced_count": synced_count,
            "updated_cards": updated_cards,
            "errors": errors if errors else None,
            "message": f"Successfully synced {synced_count} payment(s) and updated card balances"
        }
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ Error syncing payments: {str(e)}")
        print(error_trace)
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to sync payments: {str(e)}"
        )

@router.get("/shared-billpay-namba")
async def get_shared_billpay_namba():
    """Get the shared BillPay-Namba that all businesses use"""
    return {
        "billpay_namba": SHARED_BILLPAY_NAMBA,
        "message": "This is the shared merchant number for all top-ups"
    }