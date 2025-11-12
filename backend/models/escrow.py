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
    
    # Supporting Documents
    documents = Column(Text)  # JSON string of uploaded documents
    
    # Additional tracking fields
    created_by = Column(String(255))  # User who created the escrow
    created_by_role = Column(String(50))  # Role of creator: PAYER, PAYEE, BUYER, SELLER, etc.
    release_authority = Column(String(50))  # Who can release: 'CREATOR', 'PAYER', 'PAYEE'
    completed_at = Column(DateTime)
    cancelled_at = Column(DateTime)
    cancelled_reason = Column(Text)
    
    # ClickPesa Payment Control Number
    control_number = Column(String(100))  # ClickPesa billpay control number for payment

    # Payee payout configuration and release tracking
    payout_method = Column(String(50))  # 'bank' or 'mno'
    payout_details = Column(Text)  # JSON payload with bank/MNO metadata
    payout_status = Column(String(50))  # PENDING, PROCESSING, SUCCESS, FAILED
    payout_reference = Column(String(100))  # Reference used with provider
    payout_provider_response = Column(Text)  # Raw provider response payload for audit
    release_transaction_hash = Column(String(100))  # Blockchain tx hash recorded via web3
    release_block_number = Column(Integer)  # Blockchain block number when release recorded
    released_via_web3 = Column(Boolean, default=False)

    def to_dict(self):
        """Convert the escrow object to a dictionary"""
        import json
        
        # Parse milestones if it's a JSON string (milestones are stored in separate table, so this is usually empty)
        milestones_list = []
        if self.milestones:
            try:
                milestones_list = json.loads(self.milestones)
            except:
                pass
        
        # Parse documents if it's a JSON string
        documents_list = []
        if self.documents:
            try:
                documents_list = json.loads(self.documents)
            except:
                pass

        payout_details = None
        if self.payout_details:
            try:
                payout_details = json.loads(self.payout_details)
            except:
                payout_details = self.payout_details

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
            "milestones": milestones_list,
            "documents": documents_list,
            "created_by": self.created_by,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "cancelled_at": self.cancelled_at.isoformat() if self.cancelled_at else None,
            "cancelled_reason": self.cancelled_reason,
            "created_by_role": self.created_by_role,
            "release_authority": self.release_authority,
            "control_number": self.control_number,
            "payout_method": self.payout_method,
            "payout_details": payout_details,
            "payout_status": self.payout_status,
            "payout_reference": self.payout_reference,
            "payout_provider_response": self.payout_provider_response,
            "release_transaction_hash": self.release_transaction_hash,
            "release_block_number": self.release_block_number,
            "released_via_web3": self.released_via_web3
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
