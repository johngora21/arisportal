"""
Wise Remittance Router
Handles international remittance endpoints using Wise API
"""
from fastapi import APIRouter, HTTPException, Depends, status, Request
from sqlalchemy.orm import Session
from database import get_db
from models.remittance import Remittance, RemittanceProvider, RemittanceStatus
from services.unified_payment_service import UnifiedPaymentService
from services.payment_provider import PaymentProvider
from services.wise_service import WiseService
from services.clickpesa_service import ClickPesaService
from routers.clickpesa import get_clickpesa_token
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid
import httpx
import os

router = APIRouter()
payment_service = UnifiedPaymentService()
clickpesa_service = ClickPesaService()

# Lazy initialization of WiseService - only when actually needed
def get_wise_service():
    """Get WiseService instance, raises error if not configured"""
    try:
        return WiseService()
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=503,
            detail="Wise service is not configured. Please set WISE_API_TOKEN in your .env file."
        )

# Get ClickPesa BillPay merchant number
SHARED_BILLPAY_NAMBA = os.getenv('CLICKPESA_BILLPAY_NAMBA', '1234')
CLICKPESA_BASE_URL = "https://api.clickpesa.com"

# ============ Request Models ============
class RemittanceCreate(BaseModel):
    """Create remittance request"""
    amount: float
    currency: str = "USD"
    recipient_name: str
    recipient_account: str
    recipient_country: str  # ISO country code (e.g., "US", "KE", "UG")
    recipient_currency: Optional[str] = None
    recipient_email: Optional[EmailStr] = None
    recipient_phone: Optional[str] = None
    recipient_address: Optional[str] = None
    recipient_city: Optional[str] = None
    recipient_postal_code: Optional[str] = None
    recipient_iban: Optional[str] = None
    recipient_swift: Optional[str] = None
    recipient_routing_number: Optional[str] = None
    reference: Optional[str] = None
    provider: Optional[RemittanceProvider] = None  # Auto-select if not provided
    purpose: Optional[str] = "remittance"
    source_of_funds: Optional[str] = "other"

class RemittanceResponse(BaseModel):
    """Remittance response"""
    id: int
    remittance_id: str
    provider: str
    amount: float
    currency: str
    recipient_name: str
    recipient_country: str
    status: str
    reference: str
    provider_transfer_id: Optional[str] = None
    created_at: str
    # Optional fields for Wise remittances
    clickpesa_control_number: Optional[str] = None
    clickpesa_billpay_namba: Optional[str] = None
    tzs_amount: Optional[float] = None
    message: Optional[str] = None
    
    class Config:
        extra = "allow"  # Allow additional fields

# ============ Endpoints ============
@router.post("/", response_model=RemittanceResponse, status_code=status.HTTP_201_CREATED)
async def create_remittance(
    remittance_data: RemittanceCreate,
    sender_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Create a new remittance (international or domestic)
    
    For international remittances (Wise):
    - Creates Wise transfer
    - Generates ClickPesa BillPay control number for customer to pay in TZS
    - Customer pays via ClickPesa (simple control number)
    - Payment is automatically routed to Wise when received
    
    For domestic remittances (ClickPesa):
    - Uses ClickPesa directly
    """
    try:
        # Generate remittance ID
        remittance_id = f"REM-{uuid.uuid4().hex[:8].upper()}"
        reference = remittance_data.reference or f"REF-{remittance_id}"
        
        # Determine provider (default to Wise for international, ClickPesa for Tanzania)
        provider_enum = None
        if remittance_data.provider:
            provider_enum = PaymentProvider(remittance_data.provider.value)
        elif remittance_data.recipient_country and remittance_data.recipient_country.upper() == 'TZ':
            provider_enum = PaymentProvider.CLICKPESA
        else:
            provider_enum = PaymentProvider.WISE  # Default to Wise for international
        
        # Prepare recipient data
        recipient = {
            'name': remittance_data.recipient_name,
            'account_number': remittance_data.recipient_account,
            'country': remittance_data.recipient_country,
            'currency': remittance_data.recipient_currency or remittance_data.currency,
            'email': remittance_data.recipient_email,
            'phone': remittance_data.recipient_phone,
            'address': remittance_data.recipient_address,
            'city': remittance_data.recipient_city,
            'postal_code': remittance_data.recipient_postal_code,
            'iban': remittance_data.recipient_iban,
            'swift': remittance_data.recipient_swift,
            'routing_number': remittance_data.recipient_routing_number,
            'purpose': remittance_data.purpose,
            'source_of_funds': remittance_data.source_of_funds,
            'legal_type': 'PRIVATE'  # Default, can be overridden
        }
        
        clickpesa_control_number = None
        tzs_amount = None
        
        # If Wise provider: Create Wise transfer + ClickPesa control number
        if provider_enum == PaymentProvider.WISE:
            # For Wise transfers, customer pays in TZS via ClickPesa
            # The amount specified is what recipient should receive (target amount)
            target_currency = remittance_data.recipient_currency or remittance_data.currency
            target_amount = remittance_data.amount  # Amount recipient should receive
            
            # Step 1: Create Wise transfer (TZS → Target Currency)
            # Use targetAmount so Wise calculates how much TZS we need
            wise_service = get_wise_service()  # Lazy initialization
            wise_transfer_result = wise_service.create_transfer(
                amount=target_amount,
                currency='TZS',  # Source currency is always TZS (customer pays in TZS)
                recipient=recipient,
                reference=reference,
                use_target_amount=True  # amount is target amount (what recipient gets)
            )
            
            wise_transfer_id = wise_transfer_result['transfer_id']
            wise_source_amount = wise_transfer_result.get('source_amount') or wise_transfer_result.get('amount')
            tzs_amount = wise_source_amount  # This is the TZS amount customer needs to pay
            
            # Step 4: Generate ClickPesa BillPay control number
            try:
                token = get_clickpesa_token()
                payment_reference = f"REM{remittance_id[:8]}"
                
                billpay_request = {
                    "customerName": remittance_data.recipient_name or "Remittance Customer",
                    "billDescription": f"International remittance {remittance_id}",
                    "billPaymentMode": "ALLOW_PARTIAL_AND_OVER_PAYMENT",
                    "billAmount": float(tzs_amount),
                    "billReference": payment_reference
                }
                
                if remittance_data.recipient_phone:
                    billpay_request["customerPhone"] = remittance_data.recipient_phone
                if remittance_data.recipient_email:
                    billpay_request["customerEmail"] = remittance_data.recipient_email
                
                response = httpx.post(
                    f"{CLICKPESA_BASE_URL}/third-parties/billpay/create-customer-control-number",
                    headers={
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    json=billpay_request,
                    timeout=10.0
                )
                response.raise_for_status()
                billpay_response = response.json()
                clickpesa_control_number = billpay_response.get('billPayNumber')
                
            except Exception as e:
                # If ClickPesa fails, we can still create the remittance
                # but customer will need to fund Wise transfer manually
                print(f"Warning: Failed to create ClickPesa control number: {str(e)}")
                clickpesa_control_number = None
            
            # Create remittance record
            remittance = Remittance(
                remittance_id=remittance_id,
                provider=RemittanceProvider.WISE,
                amount=wise_source_amount,
                currency='TZS',  # Source currency is TZS (customer pays in TZS)
                recipient_amount=wise_transfer_result.get('target_amount'),
                recipient_name=remittance_data.recipient_name,
                recipient_account=remittance_data.recipient_account,
                recipient_country=remittance_data.recipient_country,
                recipient_currency=target_currency,
                recipient_email=remittance_data.recipient_email,
                recipient_phone=remittance_data.recipient_phone,
                sender_id=sender_id,
                reference=reference,
                provider_transfer_id=wise_transfer_id,
                provider_control_number=clickpesa_control_number,  # ClickPesa control number
                status=RemittanceStatus.PENDING,
                provider_response=str(wise_transfer_result),
                exchange_rate=wise_transfer_result.get('rate'),
                fee=wise_transfer_result.get('fee')
            )
        
        else:
            # ClickPesa provider (domestic)
            transfer_result = payment_service.create_remittance(
                amount=remittance_data.amount,
                currency=remittance_data.currency,
                recipient=recipient,
                reference=reference,
                destination_country=remittance_data.recipient_country,
                provider=provider_enum
            )
            
            remittance = Remittance(
                remittance_id=remittance_id,
                provider=RemittanceProvider.CLICKPESA,
                amount=remittance_data.amount,
                currency=remittance_data.currency,
                recipient_amount=transfer_result.get('recipient_amount'),
                recipient_name=remittance_data.recipient_name,
                recipient_account=remittance_data.recipient_account,
                recipient_country=remittance_data.recipient_country,
                recipient_currency=remittance_data.recipient_currency or remittance_data.currency,
                recipient_email=remittance_data.recipient_email,
                recipient_phone=remittance_data.recipient_phone,
                sender_id=sender_id,
                reference=reference,
                provider_transfer_id=transfer_result.get('transfer_id'),
                provider_control_number=transfer_result.get('control_number'),
                status=RemittanceStatus.PENDING,
                provider_response=str(transfer_result)
            )
        
        db.add(remittance)
        db.commit()
        db.refresh(remittance)
        
        # Build response
        response_data = {
            'id': remittance.id,
            'remittance_id': remittance.remittance_id,
            'provider': remittance.provider.value,
            'amount': remittance.amount,
            'currency': remittance.currency,
            'recipient_name': remittance.recipient_name,
            'recipient_country': remittance.recipient_country,
            'status': remittance.status.value,
            'reference': remittance.reference,
            'provider_transfer_id': remittance.provider_transfer_id,
            'created_at': remittance.created_at.isoformat() if remittance.created_at else None,
            # Optional fields - set to None initially
            'clickpesa_control_number': None,
            'clickpesa_billpay_namba': None,
            'tzs_amount': None,
            'message': None
        }
        
        # Add ClickPesa control number for Wise remittances
        if provider_enum == PaymentProvider.WISE and clickpesa_control_number and tzs_amount:
            response_data['clickpesa_control_number'] = clickpesa_control_number
            response_data['clickpesa_billpay_namba'] = SHARED_BILLPAY_NAMBA
            response_data['tzs_amount'] = float(tzs_amount)
            response_data['message'] = f"Pay {tzs_amount:.2f} TZS using control number {clickpesa_control_number} and merchant number {SHARED_BILLPAY_NAMBA}"
        
        return RemittanceResponse(**response_data)
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create remittance: {str(e)}"
        )

@router.get("/", response_model=List[dict])
async def get_remittances(
    skip: int = 0,
    limit: int = 100,
    provider: Optional[RemittanceProvider] = None,
    status_filter: Optional[RemittanceStatus] = None,
    db: Session = Depends(get_db)
):
    """Get all remittances with optional filtering"""
    try:
        query = db.query(Remittance)
        
        if provider:
            query = query.filter(Remittance.provider == provider)
        
        if status_filter:
            query = query.filter(Remittance.status == status_filter)
        
        remittances = query.order_by(Remittance.created_at.desc()).offset(skip).limit(limit).all()
        
        return [remittance.to_dict() for remittance in remittances]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch remittances: {str(e)}"
        )

@router.get("/{remittance_id}", response_model=dict)
async def get_remittance(
    remittance_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific remittance by ID"""
    try:
        remittance = db.query(Remittance).filter(Remittance.remittance_id == remittance_id).first()
        
        if not remittance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Remittance not found"
            )
        
        # Update status from provider if needed
        if remittance.provider_transfer_id and remittance.status == RemittanceStatus.PENDING:
            try:
                provider_enum = PaymentProvider(remittance.provider.value)
                status_result = payment_service.get_transfer_status(
                    remittance.provider_transfer_id,
                    provider_enum
                )
                
                # Update status if changed
                if status_result.get('status'):
                    if status_result['status'] in ['completed', 'paid_out']:
                        remittance.status = RemittanceStatus.COMPLETED
                        remittance.completed_at = datetime.now()
                    elif status_result['status'] in ['failed', 'cancelled']:
                        remittance.status = RemittanceStatus.FAILED
                    
                    db.commit()
                    db.refresh(remittance)
            except Exception as e:
                # Log error but don't fail the request
                print(f"Error updating status: {str(e)}")
        
        return remittance.to_dict()
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch remittance: {str(e)}"
        )

@router.get("/exchange-rate/{source_currency}/{target_currency}", response_model=dict)
async def get_exchange_rate(
    source_currency: str,
    target_currency: str
):
    """Get exchange rate from Wise"""
    try:
        rate = payment_service.get_exchange_rate(source_currency, target_currency)
        return rate
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get exchange rate: {str(e)}"
        )

@router.get("/currencies/{provider}", response_model=dict)
async def get_supported_currencies(
    provider: RemittanceProvider
):
    """Get supported currencies for a provider"""
    try:
        provider_enum = PaymentProvider(provider.value)
        currencies = payment_service.get_supported_currencies(provider_enum)
        return {
            'provider': provider.value,
            'currencies': currencies
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get currencies: {str(e)}"
        )

@router.post("/webhook/wise")
async def wise_webhook(request: Request, db: Session = Depends(get_db)):
    """Webhook endpoint for Wise transfer status updates"""
    try:
        data = await request.json()
        
        # Extract transfer details
        transfer_id = data.get('data', {}).get('resource', {}).get('id')
        status = data.get('data', {}).get('current_state')
        event_type = data.get('event_type')
        
        if not transfer_id:
            return {"status": "ignored", "reason": "No transfer ID"}
        
        # Find remittance by provider transfer ID
        remittance = db.query(Remittance).filter(
            Remittance.provider_transfer_id == transfer_id,
            Remittance.provider == RemittanceProvider.WISE
        ).first()
        
        if not remittance:
            return {"status": "not_found"}
        
        # Update status based on Wise event
        if event_type == 'transfers#state-change':
            if status in ['outgoing_payment_sent', 'funds_converted', 'funded']:
                remittance.status = RemittanceStatus.PROCESSING
            elif status == 'outgoing_payment_sent':
                remittance.status = RemittanceStatus.COMPLETED
                remittance.completed_at = datetime.now()
            elif status in ['cancelled', 'bounced_back']:
                remittance.status = RemittanceStatus.FAILED
        
        remittance.provider_response = str(data)
        remittance.status_message = f"Status: {status}"
        db.commit()
        
        return {"status": "success"}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

