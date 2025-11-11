from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Enum
from sqlalchemy.sql import func
from database import Base
import enum

class InvoiceStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PENDING = "PENDING"
    PARTIAL_PAID = "PARTIAL_PAID"  # Partially paid (amount_paid > 0 but < total)
    PAID = "PAID"  # Fully paid (amount_paid >= total)
    OVERDUE = "OVERDUE"
    CANCELLED = "CANCELLED"

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    
    # Invoice number is the ClickPesa control number
    invoice_number = Column(String(50), unique=True, nullable=False, index=True)
    control_number = Column(String(50), unique=True, nullable=False, index=True)  # ClickPesa BillPay control number
    
    # Invoice details
    issue_date = Column(DateTime(timezone=True), nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=True)
    
    # Client information
    client_name = Column(String(255), nullable=False)
    client_email = Column(String(255), nullable=True)
    client_phone = Column(String(50), nullable=True)
    client_address = Column(Text, nullable=True)
    
    # Invoice items (stored as JSON)
    items = Column(Text, nullable=True)  # JSON string of invoice items
    
    # Amounts
    subtotal = Column(Float, nullable=False, default=0.0)
    tax_rate = Column(Float, nullable=True, default=0.0)
    tax_amount = Column(Float, nullable=False, default=0.0)
    discount = Column(Float, nullable=True, default=0.0)
    discount_rate = Column(Float, nullable=True, default=0.0)
    total = Column(Float, nullable=False, default=0.0)
    
    # Payment
    amount_paid = Column(Float, nullable=False, default=0.0)
    currency = Column(String(3), default="TZS")
    status = Column(Enum(InvoiceStatus), nullable=False, default=InvoiceStatus.PENDING)
    
    # ClickPesa details
    clickpesa_customer_name = Column(String(255), nullable=True)
    clickpesa_bill_description = Column(String(500), nullable=True)
    clickpesa_bill_reference = Column(String(100), nullable=True)
    
    # Notes
    notes = Column(Text, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    paid_at = Column(DateTime(timezone=True), nullable=True)
