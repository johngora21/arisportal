from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models.card import Card, CardTransaction
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
            ORDER BY created_at DESC
        """)
        rows = db.execute(query, {"user_id": user_id}).fetchall()
        
        # Convert to dict format for response
        result = []
        for row in rows:
            control_number = row.topup_control_number if hasattr(row, 'topup_control_number') else None
            
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
                'balance': float(row.balance) if row.balance else 0.0,
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
    
    # Extract payment details from webhook
    payment_reference = data.get('paymentReference') or data.get('reference')
    billpay_number = data.get('billPayNumber') or data.get('controlNumber')
    amount = data.get('amount', 0)
    status = data.get('status', 'pending')
    
    # First, check if this is a remittance payment
    from models.remittance import Remittance, RemittanceProvider, RemittanceStatus
    from services.wise_service import WiseService
    
    remittance = db.query(Remittance).filter(
        Remittance.provider_control_number == billpay_number,
        Remittance.provider == RemittanceProvider.WISE
    ).first()
    
    if remittance and status == 'completed':
        # This is a Wise remittance payment
        # Route payment to Wise by funding the transfer
        try:
            wise_service = WiseService()
            
            # Fund the Wise transfer from balance
            # Note: This assumes you have Wise balance. If not, you'll need to:
            # 1. Add funds to Wise balance first (via bank transfer with reference T{transfer_id})
            # 2. Then fund the transfer from balance
            
            # For now, we'll update the remittance status
            remittance.status = RemittanceStatus.PROCESSING
            remittance.status_message = f"Payment received via ClickPesa: {amount} TZS"
            db.commit()
            
            # TODO: Implement actual funding to Wise
            # Option 1: If you have Wise balance, fund directly:
            # funding_result = wise_service.fund_transfer_from_balance(remittance.provider_transfer_id)
            
            # Option 2: Route to Wise bank account with reference T{transfer_id}
            # This requires sending money to Wise's bank account
            # The reference must be T{transfer_id} for Wise to match the payment
            
            print(f"Remittance {remittance.remittance_id} payment received. Transfer ID: {remittance.provider_transfer_id}")
            print(f"TODO: Fund Wise transfer {remittance.provider_transfer_id} with {amount} TZS")
            
        except Exception as e:
            print(f"Error routing remittance payment to Wise: {str(e)}")
            # Don't fail the webhook, just log the error
        
        return {"status": "success", "type": "remittance"}
    
    # Check if this is a card top-up (payment to card's topup_control_number)
    card = db.query(Card).filter(
        Card.topup_control_number == billpay_number
    ).first()
    
    if card and status == 'completed':
        # This is a top-up payment - credit the card balance
        card.balance += amount
        db.commit()
        
        # Log the top-up transaction
        topup_transaction = CardTransaction(
            card_id=card.id,
            user_id=card.user_id,
            amount=amount,
            currency="TZS",
            customer_billpay_control_number=billpay_number,
            payment_reference=payment_reference or f"TOPUP-{billpay_number}",
            description=f"Top-up payment for {card.cardholder_name or card.card_type} card",
            status="completed",
            transaction_type="deposit",
            clickpesa_response=str(data)
        )
        db.add(topup_transaction)
        db.commit()
        
        return {"status": "success", "type": "card_topup", "card_id": card.id, "new_balance": card.balance}
    
    # Check if this is a customer payment transaction
    transaction = db.query(CardTransaction).filter(
        CardTransaction.customer_billpay_control_number == billpay_number
    ).first()
    
    if transaction:
        # Update transaction status
        transaction.status = status
        transaction.payment_reference = payment_reference
        transaction.clickpesa_response = str(data)
        
        if status == 'completed':
            # Credit the business account
            card = db.query(Card).filter(Card.id == transaction.card_id).first()
            if card:
                card.balance += amount
                db.commit()
    
        return {"status": "success", "type": "card_transaction"}
    
    # No matching payment found
    print(f"Payment not found for control number: {billpay_number}")
    return {"status": "not_found", "control_number": billpay_number}

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

@router.get("/shared-billpay-namba")
async def get_shared_billpay_namba():
    """Get the shared BillPay-Namba that all businesses use"""
    return {
        "billpay_namba": SHARED_BILLPAY_NAMBA,
        "message": "This is the shared merchant number for all top-ups"
    }