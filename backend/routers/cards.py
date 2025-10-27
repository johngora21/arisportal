from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from database import get_db
from models.card import Card, CardTransaction
from pydantic import BaseModel
from typing import Optional, List
import uuid
from routers.clickpesa import get_clickpesa_token
import httpx

router = APIRouter()

# Environment variable for shared BillPay-Namba
import os
SHARED_BILLPAY_NAMBA = os.getenv('CLICKPESA_BILLPAY_NAMBA', '1234')  # Default, should be set in .env

# ============ Models ============
class CardCreate(BaseModel):
    card_type: str
    last_four: str
    expiry_month: Optional[str] = None
    expiry_year: Optional[str] = None
    cardholder_name: Optional[str] = None

class CardResponse(BaseModel):
    id: int
    card_type: str
    last_four: str
    expiry_month: Optional[str]
    expiry_year: Optional[str]
    cardholder_name: Optional[str]
    is_active: bool
    is_default: bool
    balance: float
    created_at: str
    
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
@router.get("/", response_model=List[CardResponse])
async def get_user_cards(user_id: int, db: Session = Depends(get_db)):
    """Get all cards for a user"""
    cards = db.query(Card).filter(Card.user_id == user_id).all()
    return cards

@router.post("/", response_model=CardResponse)
async def create_card(
    card_data: CardCreate,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Create a new card for business"""
    # Check if this is the first card, make it default
    existing_cards = db.query(Card).filter(Card.user_id == user_id).count()
    is_default = existing_cards == 0
    
    card = Card(
        user_id=user_id,
        card_type=card_data.card_type,
        last_four=card_data.last_four,
        expiry_month=card_data.expiry_month,
        expiry_year=card_data.expiry_year,
        cardholder_name=card_data.cardholder_name,
        is_default=is_default,
        balance=0.0
    )
    
    db.add(card)
    db.commit()
    db.refresh(card)
    return card

@router.post("/{card_id}/create-customer-payment")
async def create_customer_payment(
    card_id: int,
    payment_data: CreateCustomerPaymentRequest,
    user_id: int,
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
    When a payment is received, we match the customer_billpay_control_number
    to find which business it belongs to and credit their account
    """
    data = await request.json()
    
    # Extract payment details from webhook
    payment_reference = data.get('paymentReference') or data.get('reference')
    billpay_number = data.get('billPayNumber') or data.get('controlNumber')
    amount = data.get('amount', 0)
    status = data.get('status', 'pending')
    
    # Find transaction by customer BillPay control number
    transaction = db.query(CardTransaction).filter(
        CardTransaction.customer_billpay_control_number == billpay_number
    ).first()
    
    if not transaction:
        print(f"Transaction not found for control number: {billpay_number}")
        return {"status": "not_found"}
    
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
    
    return {"status": "success"}

@router.get("/{card_id}/transactions")
async def get_card_transactions(
    card_id: int,
    user_id: int,
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
