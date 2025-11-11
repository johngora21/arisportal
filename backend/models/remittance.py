"""
Remittance Model
Tracks international and domestic remittances with payment provider information
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()

class RemittanceProvider(str, enum.Enum):
    """Payment provider for remittance"""
    CLICKPESA = "CLICKPESA"
    WISE = "WISE"

class RemittanceStatus(str, enum.Enum):
    """Remittance status"""
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class Remittance(Base):
    """Remittance transaction model"""
    __tablename__ = "remittances"
    
    id = Column(Integer, primary_key=True, index=True)
    remittance_id = Column(String(50), unique=True, index=True, nullable=False)
    
    # Payment provider
    provider = Column(Enum(RemittanceProvider), nullable=False)
    
    # Transaction details
    amount = Column(Float, nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    exchange_rate = Column(Float, nullable=True)
    fee = Column(Float, nullable=True, default=0.0)
    recipient_amount = Column(Float, nullable=True)  # Amount received after conversion
    
    # Recipient information
    recipient_name = Column(String(255), nullable=False)
    recipient_account = Column(String(255), nullable=False)
    recipient_country = Column(String(2), nullable=False)  # ISO country code
    recipient_currency = Column(String(3), nullable=True)
    recipient_email = Column(String(255), nullable=True)
    recipient_phone = Column(String(50), nullable=True)
    
    # Sender information (optional, can link to user)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    sender_name = Column(String(255), nullable=True)
    sender_email = Column(String(255), nullable=True)
    
    # Transaction tracking
    reference = Column(String(100), unique=True, nullable=False)
    provider_transfer_id = Column(String(100), nullable=True)  # Provider's transfer ID
    provider_control_number = Column(String(100), nullable=True)  # For ClickPesa
    
    # Status and tracking
    status = Column(Enum(RemittanceStatus), default=RemittanceStatus.PENDING)
    status_message = Column(Text, nullable=True)
    provider_response = Column(Text, nullable=True)  # JSON response from provider
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id])
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": self.id,
            "remittance_id": self.remittance_id,
            "provider": self.provider.value if self.provider else None,
            "amount": self.amount,
            "currency": self.currency,
            "exchange_rate": self.exchange_rate,
            "fee": self.fee,
            "recipient_amount": self.recipient_amount,
            "recipient_name": self.recipient_name,
            "recipient_account": self.recipient_account,
            "recipient_country": self.recipient_country,
            "recipient_currency": self.recipient_currency,
            "recipient_email": self.recipient_email,
            "recipient_phone": self.recipient_phone,
            "sender_id": self.sender_id,
            "sender_name": self.sender_name,
            "sender_email": self.sender_email,
            "reference": self.reference,
            "provider_transfer_id": self.provider_transfer_id,
            "provider_control_number": self.provider_control_number,
            "status": self.status.value if self.status else None,
            "status_message": self.status_message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }

