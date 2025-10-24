from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

class EscrowStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    DISPUTED = "DISPUTED"

class PaymentType(str, enum.Enum):
    FULL = "FULL"
    MILESTONE = "MILESTONE"

class Escrow(Base):
    __tablename__ = "escrows"

    id = Column(Integer, primary_key=True, index=True)
    escrow_id = Column(String(50), unique=True, index=True, nullable=False)  # ESC-001 format
    
    # Transaction Details
    title = Column(String(255), nullable=False)
    description = Column(Text)
    
    # Payer Information (person putting money into escrow)
    payer_name = Column(String(255), nullable=False)
    payer_email = Column(String(255), nullable=False)
    payer_phone = Column(String(50), nullable=False)
    
    # Payee Information (person who will receive money)
    payee_name = Column(String(255), nullable=False)
    payee_email = Column(String(255), nullable=False)
    payee_phone = Column(String(50), nullable=False)
    
    # Payment Information
    total_amount = Column(Float, nullable=False)
    payment_type = Column(Enum(PaymentType), default=PaymentType.FULL)
    release_date = Column(DateTime)
    
    # Terms and Conditions
    terms = Column(Text)
    additional_notes = Column(Text)
    
    # Status and Tracking
    status = Column(Enum(EscrowStatus), default=EscrowStatus.PENDING)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Milestone Information (if payment_type is milestone)
    milestones = Column(Text)  # JSON string of milestone data
    
    # Additional tracking fields
    created_by = Column(String(255))  # User who created the escrow
    completed_at = Column(DateTime)
    cancelled_at = Column(DateTime)
    cancelled_reason = Column(Text)

    def to_dict(self):
        """Convert the escrow object to a dictionary"""
        return {
            "id": self.id,
            "escrow_id": self.escrow_id,
            "title": self.title,
            "description": self.description,
            "payer_name": self.payer_name,
            "payer_email": self.payer_email,
            "payer_phone": self.payer_phone,
            "payee_name": self.payee_name,
            "payee_email": self.payee_email,
            "payee_phone": self.payee_phone,
            "total_amount": self.total_amount,
            "payment_type": self.payment_type.value if self.payment_type else None,
            "release_date": self.release_date.isoformat() if self.release_date else None,
            "terms": self.terms,
            "additional_notes": self.additional_notes,
            "status": self.status.value if self.status else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "milestones": self.milestones,
            "created_by": self.created_by,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "cancelled_at": self.cancelled_at.isoformat() if self.cancelled_at else None,
            "cancelled_reason": self.cancelled_reason
        }

class EscrowMilestone(Base):
    __tablename__ = "escrow_milestones"

    id = Column(Integer, primary_key=True, index=True)
    escrow_id = Column(Integer, nullable=False)  # Foreign key to escrows table
    milestone_number = Column(Integer, nullable=False)
    description = Column(String(500), nullable=False)
    amount = Column(Float, nullable=False)
    completion_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="pending")  # pending, completed, overdue
    completed_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def to_dict(self):
        """Convert the milestone object to a dictionary"""
        return {
            "id": self.id,
            "escrow_id": self.escrow_id,
            "milestone_number": self.milestone_number,
            "description": self.description,
            "amount": self.amount,
            "completion_date": self.completion_date.isoformat() if self.completion_date else None,
            "status": self.status,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
