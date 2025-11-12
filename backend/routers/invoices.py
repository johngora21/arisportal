from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import Response
from sqlalchemy.orm import Session
from database import get_db
from models.invoice import Invoice, InvoiceStatus
from models.card import Card
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import jwt
from routers.clickpesa import get_clickpesa_token
from services.clickpesa_service import ClickPesaService
import httpx
import json
import random
import time
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import base64

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

# ============ Models ============
class InvoiceItem(BaseModel):
    id: str
    type: Optional[str] = "item"
    description: str
    quantity: float
    unit: Optional[str] = ""
    rate: float
    amount: float

class InvoiceCreate(BaseModel):
    invoice_number: Optional[str] = None  # Will be auto-generated as control number
    issue_date: str  # ISO format date string
    due_date: Optional[str] = None
    client_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    client_address: Optional[str] = None
    items: List[InvoiceItem]
    subtotal: float
    tax_rate: Optional[float] = 0.0
    tax_amount: float = 0.0
    discount: Optional[float] = 0.0
    discount_rate: Optional[float] = 0.0
    total: float
    currency: Optional[str] = "TZS"  # Currency from frontend
    notes: Optional[str] = None
    status: Optional[str] = "PENDING"

class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    control_number: str
    issue_date: str
    due_date: Optional[str] = None
    client_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    client_address: Optional[str] = None
    items: Optional[List] = None
    subtotal: float
    tax_rate: Optional[float] = 0.0
    tax_amount: float = 0.0
    discount: Optional[float] = 0.0
    discount_rate: Optional[float] = 0.0
    total: float
    amount_paid: float = 0.0
    currency: str = "TZS"
    status: str
    notes: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    paid_at: Optional[str] = None
    
    class Config:
        from_attributes = True

# ============ Endpoints ============
@router.post("", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_invoice(
    invoice_data: InvoiceCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Create a new invoice and generate a ClickPesa BillPay control number.
    
    The invoice number is kept as provided by the user (or auto-generated).
    A separate ClickPesa control number is generated for payment processing.
    Customers can use the control number to pay the invoice via ClickPesa.
    
    IMPORTANT: If ClickPesa API fails, invoice creation will FAIL. 
    No placeholder control numbers are generated. A real control number from 
    ClickPesa is REQUIRED for invoice creation.
    """
    try:
        # Get user profile for business info
        from models.user import UserProfile
        user_profile = db.query(UserProfile).filter(UserProfile.id == user_id).first()
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Get user's default card (to credit payments)
        default_card = db.query(Card).filter(
            Card.user_id == user_id,
            Card.is_default == True,
            Card.is_active == True
        ).first()
        
        if not default_card:
            raise HTTPException(
                status_code=400,
                detail="No default card found. Please set a default card in your wallet before creating invoices."
            )
        
        # Get user's contact info for ClickPesa (business owner = merchant)
        customer_phone = user_profile.business_phone or user_profile.phone
        customer_email = user_profile.business_email or user_profile.email or user_profile.email
        
        # Format phone number for ClickPesa (must start with country code, no plus sign, no spaces)
        if customer_phone:
            formatted_phone = customer_phone.replace('+', '').replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
            if not formatted_phone.startswith('255'):
                if formatted_phone.startswith('0'):
                    formatted_phone = '255' + formatted_phone[1:]
                elif formatted_phone.isdigit() and len(formatted_phone) == 9:
                    formatted_phone = '255' + formatted_phone
            customer_phone = formatted_phone
        
        # ClickPesa requires at least phone OR email
        if not customer_phone and not customer_email:
            raise HTTPException(
                status_code=400,
                detail="Please add a phone number or email address to your profile to create invoices. ClickPesa requires merchant contact information."
            )
        
        # Parse dates (handle both ISO and YYYY-MM-DD). Provide safe defaults.
        try:
            if 'T' in invoice_data.issue_date or '+' in invoice_data.issue_date or 'Z' in invoice_data.issue_date:
                issue_date = datetime.fromisoformat(invoice_data.issue_date.replace('Z', '+00:00'))
            else:
                issue_date = datetime.strptime(invoice_data.issue_date, '%Y-%m-%d')
        except Exception:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid issue_date format: {invoice_data.issue_date}. Use YYYY-MM-DD or ISO format."
            )

        due_date = None
        if invoice_data.due_date:
            try:
                if 'T' in invoice_data.due_date or '+' in invoice_data.due_date or 'Z' in invoice_data.due_date:
                    due_date = datetime.fromisoformat(invoice_data.due_date.replace('Z', '+00:00'))
                else:
                    due_date = datetime.strptime(invoice_data.due_date, '%Y-%m-%d')
            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid due_date format: {invoice_data.due_date}. Use YYYY-MM-DD or ISO format."
                )
            
        # Keep the provided invoice number; do NOT replace it with control number
        # If not provided, generate a unique invoice number
        if invoice_data.invoice_number:
            invoice_number = invoice_data.invoice_number
            # Check if provided invoice number already exists
            existing = db.query(Invoice).filter(Invoice.invoice_number == invoice_number).first()
            if existing:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invoice number '{invoice_number}' already exists. Please use a different invoice number."
                )
        else:
            # Generate unique invoice number with retry logic
            max_attempts = 100
            for attempt in range(max_attempts):
                # Use timestamp with milliseconds + random for better uniqueness
                timestamp = datetime.utcnow()
                date_str = timestamp.strftime('%Y%m%d')
                # Add milliseconds and random component
                random_suffix = random.randint(1000, 9999)  # 4 digits instead of 3
                invoice_number = f"INV-{date_str}-{random_suffix}"
                
                # Check if this invoice number already exists
                existing = db.query(Invoice).filter(Invoice.invoice_number == invoice_number).first()
                if not existing:
                    break  # Found a unique number
                
                # If we've tried many times, add more randomness
                if attempt > 50:
                    time.sleep(0.001)  # Small delay to ensure timestamp difference
                    timestamp = datetime.utcnow()
                    date_str = timestamp.strftime('%Y%m%d')
                    random_suffix = random.randint(10000, 99999)  # 5 digits for more uniqueness
                    invoice_number = f"INV-{date_str}-{random_suffix}"
                    existing = db.query(Invoice).filter(Invoice.invoice_number == invoice_number).first()
                    if not existing:
                        break
            
            # Final check - if still not unique after all attempts, raise error
            existing = db.query(Invoice).filter(Invoice.invoice_number == invoice_number).first()
            if existing:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to generate unique invoice number. Please try again or provide a custom invoice number."
                )
        
        # Generate ClickPesa control number for payment - REQUIRED, no placeholders!
        control_number = None
        clickpesa_customer_name = None
        clickpesa_bill_description = None
        clickpesa_bill_reference = None
        
        # Format client phone number for ClickPesa (must be 255XXXXXXXXX format, no +, no spaces)
        formatted_client_phone = None
        if invoice_data.client_phone:
            formatted_client_phone = (
                invoice_data.client_phone.replace('+', '')
                .replace(' ', '')
                .replace('-', '')
                .replace('(', '')
                .replace(')', '')
            )
            # If it doesn't start with country code (255 for Tanzania), add it
            if not formatted_client_phone.startswith('255'):
                # If it starts with 0, replace with 255 (Tanzanian format: 0xxx -> 255xxx)
                if formatted_client_phone.startswith('0'):
                    formatted_client_phone = '255' + formatted_client_phone[1:]
                # If it's just digits without country code, assume Tanzania and add 255
                elif formatted_client_phone.isdigit() and len(formatted_client_phone) == 9:
                    formatted_client_phone = '255' + formatted_client_phone
        
        # ClickPesa requires at least phone OR email for the customer
        if not formatted_client_phone and not invoice_data.client_email:
            raise HTTPException(
                status_code=400,
                detail="Client phone number or email is required to generate payment control number. ClickPesa requires customer contact information."
            )
        
        try:
            # Create ClickPesa BillPay control number
            print(f"⏱️ Starting ClickPesa API call at {time.time()}")
            clickpesa_service = ClickPesaService()
            
            # Prepare recipient info for ClickPesa
            recipient = {
                'name': invoice_data.client_name or 'Customer',
                'phone': formatted_client_phone,
                'email': invoice_data.client_email,
                'description': f"Invoice {invoice_number} - {invoice_data.client_name}"
            }
            
            # Generate reference (max 20 chars for ClickPesa API requirement)
            # Use numbers only - no words/letters in reference
            # Format: timestamp (last 8 digits) + random (6 digits) = 14 chars
            timestamp_suffix = str(int(time.time()))[-8:]  # Last 8 digits of timestamp
            random_suffix = str(random.randint(100000, 999999))  # 6 digit random
            bill_reference = f"{timestamp_suffix}{random_suffix}"  # Total: 8 + 6 = 14 chars (numbers only)
            
            print(f"📞 Calling ClickPesa API to create control number for invoice {invoice_number}")
            print(f"   Recipient: {recipient.get('name')}, Phone: {recipient.get('phone')}, Email: {recipient.get('email')}")
            print(f"   Amount: {invoice_data.total} {invoice_data.currency or 'TZS'}")
            print(f"   Reference: {bill_reference}")
            
            # Create BillPay control number
            clickpesa_response = clickpesa_service.create_transfer(
                amount=invoice_data.total,
                currency=invoice_data.currency or "TZS",
                recipient=recipient,
                reference=bill_reference
            )
            
            print(f"📦 ClickPesa Service Response: {clickpesa_response}")
            print(f"📦 ClickPesa Service Response Keys: {list(clickpesa_response.keys()) if isinstance(clickpesa_response, dict) else 'Not a dict'}")
            
            # Extract control number from response (check multiple possible fields)
            # The service returns a dict with 'control_number' and 'billPayNumber' keys
            control_number = (
                clickpesa_response.get('control_number') or 
                clickpesa_response.get('billPayNumber') or 
                clickpesa_response.get('transfer_id') or
                clickpesa_response.get('response', {}).get('billPayNumber') or
                clickpesa_response.get('data', {}).get('billPayNumber') or
                clickpesa_response.get('data', {}).get('control_number')
            )
            
            print(f"🔍 Extracted control_number: {control_number}")
            
            clickpesa_customer_name = invoice_data.client_name
            clickpesa_bill_description = recipient.get('description', f"Invoice {invoice_number}")
            clickpesa_bill_reference = bill_reference
            
            if not control_number:
                error_msg = f"ClickPesa API did not return a control number. Full response: {clickpesa_response}"
                print(f"❌ {error_msg}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to generate payment control number: {error_msg}"
                )
            
            print(f"✅ ClickPesa control number generated successfully: {control_number} for invoice {invoice_number}")
            print(f"✅ Control number will be saved to database: {control_number}")
                
        except HTTPException:
            # Re-raise HTTP exceptions (like 400, 500, etc.)
            raise
        except Exception as clickpesa_error:
            # ClickPesa API call failed - log detailed error and fail invoice creation
            import traceback
            error_trace = traceback.format_exc()
            error_msg = f"Failed to create ClickPesa control number: {str(clickpesa_error)}"
            print(f"❌ {error_msg}")
            print(f"❌ Error trace: {error_trace}")
            
            # FAIL the invoice creation - don't create invoices with fake control numbers
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate payment control number from ClickPesa. Please check your ClickPesa API credentials and try again. Error: {str(clickpesa_error)}"
            )
        
        # CRITICAL VALIDATION: Ensure control_number is valid before creating invoice
        print(f"🔒 VALIDATING control_number before creating invoice: {control_number} (type: {type(control_number)})")
        
        # Validate that control number does NOT start with "INV"
        if isinstance(control_number, str) and control_number.strip().upper().startswith('INV'):
            raise HTTPException(
                status_code=500,
                detail=f"CRITICAL ERROR: Control number cannot start with 'INV'. Received: {control_number}. Please regenerate."
            )
        
        if control_number is None:
            raise HTTPException(
                status_code=500,
                detail="CRITICAL ERROR: Control number is None. Invoice creation aborted. ClickPesa API did not return a control number."
            )
        
        if isinstance(control_number, str) and control_number.startswith('NOCTRL'):
            raise HTTPException(
                status_code=500,
                detail=f"CRITICAL ERROR: Invalid placeholder control number detected: {control_number}. Invoice creation aborted."
            )
        
        if not isinstance(control_number, str):
            raise HTTPException(
                status_code=500,
                detail=f"CRITICAL ERROR: Control number is not a string: {type(control_number)} = {control_number}. Invoice creation aborted."
            )
        
        if len(control_number.strip()) == 0:
            raise HTTPException(
                status_code=500,
                detail=f"CRITICAL ERROR: Control number is empty string. Invoice creation aborted."
            )
        
        print(f"🔒 VALIDATION PASSED: Control number is valid: '{control_number}' (length: {len(control_number)})")
        
        # Parse invoice status
        invoice_status = InvoiceStatus.PENDING
        if invoice_data.status:
            try:
                invoice_status = InvoiceStatus[invoice_data.status.upper()]
            except KeyError:
                invoice_status = InvoiceStatus.PENDING
        
        # Create invoice record - control_number is guaranteed to be valid at this point
        print(f"🔒 Creating Invoice object with control_number: '{control_number}'")
        invoice = Invoice(
            user_id=user_id,
            invoice_number=invoice_number,
            control_number=str(control_number).strip(),  # Ensure it's a string and trimmed
            issue_date=issue_date,
            due_date=due_date,
            client_name=invoice_data.client_name,
            client_email=invoice_data.client_email,
            client_phone=invoice_data.client_phone,
            client_address=invoice_data.client_address,
            items=json.dumps([item.dict() for item in invoice_data.items]),  # Store as JSON string
            subtotal=invoice_data.subtotal,
            tax_rate=invoice_data.tax_rate or 0.0,
            tax_amount=invoice_data.tax_amount or 0.0,
            discount=invoice_data.discount or 0.0,
            discount_rate=invoice_data.discount_rate or 0.0,
            total=invoice_data.total,
            currency=invoice_data.currency or "TZS",  # Use currency from request
            status=invoice_status,
            notes=invoice_data.notes,
            clickpesa_customer_name=clickpesa_customer_name,
            clickpesa_bill_description=clickpesa_bill_description,
            clickpesa_bill_reference=clickpesa_bill_reference
        )
        
        db.add(invoice)
        db.commit()
        db.refresh(invoice)
        
        # DEBUG: Verify control_number was saved to database
        print(f"🔍 After commit - invoice.control_number: {invoice.control_number}")
        print(f"🔍 After commit - invoice.control_number type: {type(invoice.control_number)}")
        print(f"🔍 After commit - invoice.control_number is None: {invoice.control_number is None}")
        
        # Parse items for response
        invoice_items = []
        try:
            invoice_items = json.loads(invoice.items) if invoice.items else []
        except:
            invoice_items = []
        
        # DEBUG: Verify what we're returning
        response_control_number = invoice.control_number
        print(f"🔍 Returning control_number in response: {response_control_number}")
        print(f"🔍 Response control_number type: {type(response_control_number)}")
        
        return {
            'id': invoice.id,
            'invoice_number': invoice.invoice_number,
            'control_number': response_control_number,
            'issue_date': invoice.issue_date.isoformat() if invoice.issue_date else None,
            'due_date': invoice.due_date.isoformat() if invoice.due_date else None,
            'client_name': invoice.client_name,
            'client_email': invoice.client_email,
            'client_phone': invoice.client_phone,
            'client_address': invoice.client_address,
            'items': invoice_items,
            'subtotal': invoice.subtotal,
            'tax_rate': invoice.tax_rate,
            'tax_amount': invoice.tax_amount,
            'discount': invoice.discount,
            'discount_rate': invoice.discount_rate,
            'total': invoice.total,
            'amount_paid': invoice.amount_paid,
            'currency': invoice.currency,
            'status': invoice.status.value if hasattr(invoice.status, 'value') else str(invoice.status),
            'notes': invoice.notes,
            'created_at': invoice.created_at.isoformat() if invoice.created_at else None,
            'updated_at': invoice.updated_at.isoformat() if invoice.updated_at else None,
            'paid_at': invoice.paid_at.isoformat() if invoice.paid_at else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ Error creating invoice: {str(e)}")
        print(error_trace)
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create invoice: {str(e)}"
        )

@router.get("", response_model=List[InvoiceResponse])
async def get_invoices(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
    status: Optional[str] = None
):
    """Get all invoices for the current user"""
    try:
        query = db.query(Invoice).filter(Invoice.user_id == user_id)
        
        if status:
            try:
                invoice_status = InvoiceStatus[status.upper()]
                query = query.filter(Invoice.status == invoice_status)
            except KeyError:
                pass  # Invalid status, ignore filter
        
        invoices = query.order_by(Invoice.created_at.desc()).all()
        
        result = []
        for invoice in invoices:
            # Parse items
            invoice_items = []
            try:
                invoice_items = json.loads(invoice.items) if invoice.items else []
            except:
                invoice_items = []
            
            result.append({
                'id': invoice.id,
                'invoice_number': invoice.invoice_number,
                'control_number': invoice.control_number,
                'issue_date': invoice.issue_date.isoformat() if invoice.issue_date else None,
                'due_date': invoice.due_date.isoformat() if invoice.due_date else None,
                'client_name': invoice.client_name,
                'client_email': invoice.client_email,
                'client_phone': invoice.client_phone,
                'client_address': invoice.client_address,
                'items': invoice_items,
                'subtotal': invoice.subtotal,
                'tax_rate': invoice.tax_rate,
                'tax_amount': invoice.tax_amount,
                'discount': invoice.discount,
                'discount_rate': invoice.discount_rate,
                'total': invoice.total,
                'amount_paid': invoice.amount_paid,
                'currency': invoice.currency,
                'status': invoice.status.value if hasattr(invoice.status, 'value') else str(invoice.status),
                'notes': invoice.notes,
                'created_at': invoice.created_at.isoformat() if invoice.created_at else None,
                'updated_at': invoice.updated_at.isoformat() if invoice.updated_at else None,
                'paid_at': invoice.paid_at.isoformat() if invoice.paid_at else None
            })
        
        return result
        
    except Exception as e:
        import traceback
        print(f"Error fetching invoices: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error fetching invoices: {str(e)}")

@router.get("/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get a specific invoice by ID"""
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == user_id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Parse items
    invoice_items = []
    try:
        invoice_items = json.loads(invoice.items) if invoice.items else []
    except:
        invoice_items = []
    
    return {
        'id': invoice.id,
        'invoice_number': invoice.invoice_number,
        'control_number': invoice.control_number,
        'issue_date': invoice.issue_date.isoformat() if invoice.issue_date else None,
        'due_date': invoice.due_date.isoformat() if invoice.due_date else None,
        'client_name': invoice.client_name,
        'client_email': invoice.client_email,
        'client_phone': invoice.client_phone,
        'client_address': invoice.client_address,
        'items': invoice_items,
        'subtotal': invoice.subtotal,
        'tax_rate': invoice.tax_rate,
        'tax_amount': invoice.tax_amount,
        'discount': invoice.discount,
        'discount_rate': invoice.discount_rate,
        'total': invoice.total,
        'amount_paid': invoice.amount_paid,
        'currency': invoice.currency,
        'status': invoice.status.value if hasattr(invoice.status, 'value') else str(invoice.status),
        'notes': invoice.notes,
        'created_at': invoice.created_at.isoformat() if invoice.created_at else None,
        'updated_at': invoice.updated_at.isoformat() if invoice.updated_at else None,
        'paid_at': invoice.paid_at.isoformat() if invoice.paid_at else None
    }
class InvoiceUpdate(BaseModel):
    invoice_number: Optional[str] = None
    issue_date: Optional[str] = None
    due_date: Optional[str] = None
    client_name: Optional[str] = None
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    client_address: Optional[str] = None
    items: Optional[List[InvoiceItem]] = None
    subtotal: Optional[float] = None
    tax_rate: Optional[float] = None
    tax_amount: Optional[float] = None
    discount: Optional[float] = None
    discount_rate: Optional[float] = None
    total: Optional[float] = None
    currency: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

@router.put("/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: int,
    data: InvoiceUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update an existing invoice owned by current user"""
    try:
        invoice = db.query(Invoice).filter(
            Invoice.id == invoice_id,
            Invoice.user_id == user_id
        ).first()
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")
        
        # Apply updates
        if data.invoice_number is not None and data.invoice_number.strip():
            invoice.invoice_number = data.invoice_number.strip()
        if data.issue_date:
            if 'T' in data.issue_date or '+' in data.issue_date or 'Z' in data.issue_date:
                invoice.issue_date = datetime.fromisoformat(data.issue_date.replace('Z', '+00:00'))
            else:
                invoice.issue_date = datetime.strptime(data.issue_date, '%Y-%m-%d')
        if data.due_date:
            if 'T' in data.due_date or '+' in data.due_date or 'Z' in data.due_date:
                invoice.due_date = datetime.fromisoformat(data.due_date.replace('Z', '+00:00'))
            else:
                invoice.due_date = datetime.strptime(data.due_date, '%Y-%m-%d')
        if data.client_name is not None: invoice.client_name = data.client_name
        if data.client_email is not None: invoice.client_email = data.client_email
        if data.client_phone is not None: invoice.client_phone = data.client_phone
        if data.client_address is not None: invoice.client_address = data.client_address
        if data.items is not None:
            invoice.items = json.dumps([item.dict() for item in data.items])
        if data.subtotal is not None: invoice.subtotal = data.subtotal
        if data.tax_rate is not None: invoice.tax_rate = data.tax_rate
        if data.tax_amount is not None: invoice.tax_amount = data.tax_amount
        if data.discount is not None: invoice.discount = data.discount
        if data.discount_rate is not None: invoice.discount_rate = data.discount_rate
        if data.total is not None: invoice.total = data.total
        if data.currency is not None: invoice.currency = data.currency
        if data.status is not None:
            try:
                invoice.status = InvoiceStatus[data.status.upper()]
            except KeyError:
                pass
        if data.notes is not None: invoice.notes = data.notes
        
        db.commit()
        db.refresh(invoice)
        
        # Build response
        items = []
        try:
            items = json.loads(invoice.items) if invoice.items else []
        except:
            items = []
        return {
            'id': invoice.id,
            'invoice_number': invoice.invoice_number,
            'control_number': invoice.control_number,
            'issue_date': invoice.issue_date.isoformat() if invoice.issue_date else None,
            'due_date': invoice.due_date.isoformat() if invoice.due_date else None,
            'client_name': invoice.client_name,
            'client_email': invoice.client_email,
            'client_phone': invoice.client_phone,
            'client_address': invoice.client_address,
            'items': items,
            'subtotal': invoice.subtotal,
            'tax_rate': invoice.tax_rate,
            'tax_amount': invoice.tax_amount,
            'discount': invoice.discount,
            'discount_rate': invoice.discount_rate,
            'total': invoice.total,
            'amount_paid': invoice.amount_paid,
            'currency': invoice.currency,
            'status': invoice.status.value if hasattr(invoice.status, 'value') else str(invoice.status),
            'notes': invoice.notes,
            'created_at': invoice.created_at.isoformat() if invoice.created_at else None,
            'updated_at': invoice.updated_at.isoformat() if invoice.updated_at else None,
            'paid_at': invoice.paid_at.isoformat() if invoice.paid_at else None
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update invoice: {str(e)}")

@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_invoice(
    invoice_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Delete an invoice owned by the current user"""
    try:
        invoice = db.query(Invoice).filter(
            Invoice.id == invoice_id,
            Invoice.user_id == user_id
        ).first()
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")
        db.delete(invoice)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete invoice: {str(e)}")

@router.post("/{invoice_id}/regenerate-control-number", response_model=InvoiceResponse)
async def regenerate_control_number(
    invoice_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Regenerate ClickPesa control number for an existing invoice.
    Useful for fixing invoices that were created with placeholder control numbers.
    """
    try:
        # Get the invoice
        invoice = db.query(Invoice).filter(
            Invoice.id == invoice_id,
            Invoice.user_id == user_id
        ).first()
        
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")
        
        # Allow regeneration even if control number exists (needed when invoice is edited, especially amount changes)
        # The old control number will be replaced with a new one for the updated invoice
        
        # Format client phone number for ClickPesa
        formatted_client_phone = None
        if invoice.client_phone:
            formatted_client_phone = invoice.client_phone.replace('+', '').replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
            if not formatted_client_phone.startswith('255'):
                if formatted_client_phone.startswith('0'):
                    formatted_client_phone = '255' + formatted_client_phone[1:]
                elif formatted_client_phone.isdigit() and len(formatted_client_phone) == 9:
                    formatted_client_phone = '255' + formatted_client_phone
        
        # ClickPesa requires at least phone OR email
        if not formatted_client_phone and not invoice.client_email:
            raise HTTPException(
                status_code=400,
                detail="Client phone number or email is required to generate payment control number."
            )
        
        # Generate new control number via ClickPesa
        clickpesa_service = ClickPesaService()
        
        recipient = {
            'name': invoice.client_name or 'Customer',
            'phone': formatted_client_phone,
            'email': invoice.client_email,
            'description': f"Invoice {invoice.invoice_number} - {invoice.client_name}"
        }
        
        # Generate short reference (max 20 chars for ClickPesa API requirement)
        # Use numbers only - no words/letters in reference
        # Format: timestamp (last 8 digits) + random (6 digits) = 14 chars
        timestamp_suffix = str(int(time.time()))[-8:]  # Last 8 digits of timestamp
        random_suffix = str(random.randint(100000, 999999))  # 6 digit random
        bill_reference = f"{timestamp_suffix}{random_suffix}"  # Total: 8 + 6 = 14 chars (numbers only)
        
        print(f"🔄 Regenerating control number for invoice {invoice.invoice_number} (ID: {invoice_id})")
        
        clickpesa_response = clickpesa_service.create_transfer(
            amount=invoice.total,
            currency=invoice.currency or "TZS",
            recipient=recipient,
            reference=bill_reference
        )
        
        control_number = (
            clickpesa_response.get('control_number') or 
            clickpesa_response.get('billPayNumber') or 
            clickpesa_response.get('transfer_id')
        )
        
        if not control_number:
            raise HTTPException(
                status_code=500,
                detail=f"ClickPesa API did not return a control number. Response: {clickpesa_response}"
            )
        
        # Validate that control number does NOT start with "INV"
        if isinstance(control_number, str) and control_number.strip().upper().startswith('INV'):
            raise HTTPException(
                status_code=500,
                detail=f"CRITICAL ERROR: Control number cannot start with 'INV'. Received: {control_number}. Please try again."
            )
        
        # Update invoice with new control number
        invoice.control_number = control_number
        db.commit()
        db.refresh(invoice)
        
        print(f"✅ Control number regenerated: {control_number} for invoice {invoice.invoice_number}")
        
        # Build response
        items = []
        try:
            items = json.loads(invoice.items) if invoice.items else []
        except:
            items = []
        
        return {
            'id': invoice.id,
            'invoice_number': invoice.invoice_number,
            'control_number': invoice.control_number,
            'issue_date': invoice.issue_date.isoformat() if invoice.issue_date else None,
            'due_date': invoice.due_date.isoformat() if invoice.due_date else None,
            'client_name': invoice.client_name,
            'client_email': invoice.client_email,
            'client_phone': invoice.client_phone,
            'client_address': invoice.client_address,
            'items': items,
            'subtotal': invoice.subtotal,
            'tax_rate': invoice.tax_rate,
            'tax_amount': invoice.tax_amount,
            'discount': invoice.discount,
            'discount_rate': invoice.discount_rate,
            'total': invoice.total,
            'amount_paid': invoice.amount_paid,
            'currency': invoice.currency,
            'status': invoice.status.value if hasattr(invoice.status, 'value') else str(invoice.status),
            'notes': invoice.notes,
            'created_at': invoice.created_at.isoformat() if invoice.created_at else None,
            'updated_at': invoice.updated_at.isoformat() if invoice.updated_at else None,
            'paid_at': invoice.paid_at.isoformat() if invoice.paid_at else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ Error regenerating control number: {str(e)}")
        print(f"❌ Error trace: {error_trace}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to regenerate control number: {str(e)}"
        )

@router.post("/{invoice_id}/initiate-ussd-push", response_model=dict)
async def initiate_invoice_ussd_push(
    invoice_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Initiate a USSD push payment request for an invoice.
    This sends a payment request directly to the customer's phone.
    """
    try:
        # Get the invoice
        invoice = db.query(Invoice).filter(
            Invoice.id == invoice_id,
            Invoice.user_id == user_id
        ).first()
        
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")
        
        if not invoice.client_phone:
            raise HTTPException(status_code=400, detail="Customer phone number is required for USSD push")
        
        # Format phone number for ClickPesa (255XXXXXXXXX, no +, no spaces)
        phone_number = invoice.client_phone.replace('+', '').replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        if not phone_number.startswith('255'):
            if phone_number.startswith('0'):
                phone_number = '255' + phone_number[1:]
            elif phone_number.isdigit() and len(phone_number) == 9:
                phone_number = '255' + phone_number
        
        # Generate order reference
        order_reference = f"INV-{invoice.invoice_number}-{invoice_id}"
        
        # Initiate USSD push via ClickPesa
        clickpesa_service = ClickPesaService()
        ussd_response = clickpesa_service.initiate_ussd_push(
            amount=invoice.total,
            currency=invoice.currency or "TZS",
            phone_number=phone_number,
            order_reference=order_reference
        )
        
        return {
            'success': True,
            'message': 'USSD push payment request sent to customer',
            'ussd_push': ussd_response,
            'invoice_id': invoice_id,
            'phone_number': phone_number
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initiate USSD push: {str(e)}")