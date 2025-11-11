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
import httpx
import json
import random
import time

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
    The control number becomes the invoice number.
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
            raise HTTPException(status_code=400, detail=f"Invalid issue_date format: {invoice_data.issue_date}. Use YYYY-MM-DD or ISO format.")
        
        due_date = None
        if invoice_data.due_date:
            try:
                if 'T' in invoice_data.due_date or '+' in invoice_data.due_date or 'Z' in invoice_data.due_date:
                    due_date = datetime.fromisoformat(invoice_data.due_date.replace('Z', '+00:00'))
                else:
                    due_date = datetime.strptime(invoice_data.due_date, '%Y-%m-%d')
            except Exception:
                raise HTTPException(status_code=400, detail=f"Invalid due_date format: {invoice_data.due_date}. Use YYYY-MM-DD or ISO format.")
        
        # Keep the provided invoice number; do NOT replace it with control number
        invoice_number = invoice_data.invoice_number or f"INV-{datetime.utcnow().strftime('%Y%m%d')}-{random.randint(100,999)}"
        # Generate a placeholder unique control number to satisfy DB constraint (not displayed)
        control_number = f"NOCTRL-{user_id}-{int(time.time())}-{random.randint(1000,9999)}"
        
        # Parse invoice status
        invoice_status = InvoiceStatus.PENDING
        if invoice_data.status:
            try:
                invoice_status = InvoiceStatus[invoice_data.status.upper()]
            except KeyError:
                invoice_status = InvoiceStatus.PENDING
        
        # Create invoice record
        invoice = Invoice(
            user_id=user_id,
            invoice_number=invoice_number,
            control_number=control_number,
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
            clickpesa_customer_name=None,
            clickpesa_bill_description=None,
            clickpesa_bill_reference=None
        )
        
        db.add(invoice)
        db.commit()
        db.refresh(invoice)
        
        # Parse items for response
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
