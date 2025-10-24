from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import enum

Base = declarative_base()

class TransactionType(str, enum.Enum):
    REVENUE = "REVENUE"
    EXPENSE = "EXPENSE"
    ASSET = "ASSET"
    LIABILITY = "LIABILITY"
    EQUITY = "EQUITY"
    TRANSFER = "TRANSFER"
    REVERSAL = "REVERSAL"
    OTHER = "OTHER"

class PaymentMethod(str, enum.Enum):
    CASH = "CASH"
    BANK = "BANK"
    CARD = "CARD"
    MOBILE_MONEY = "MOBILE_MONEY"
    OTHER = "OTHER"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    category = Column(String(100), nullable=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    reference = Column(String(100), nullable=True)
    account = Column(String(100), nullable=True)
    
    # Additional fields
    notes = Column(Text, nullable=True)
    created_by = Column(String(100), nullable=True)
    is_reconciled = Column(Boolean, default=False)
    reconciled_at = Column(DateTime, nullable=True)
    reconciled_by = Column(String(100), nullable=True)
    
    # Timestamps
    transaction_date = Column(DateTime, nullable=False, default=func.now())
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "transaction_id": self.transaction_id,
            "description": self.description,
            "type": self.type.value if self.type else None,
            "category": self.category,
            "amount": self.amount,
            "payment_method": self.payment_method.value if self.payment_method else None,
            "reference": self.reference,
            "account": self.account,
            "notes": self.notes,
            "created_by": self.created_by,
            "is_reconciled": self.is_reconciled,
            "reconciled_at": self.reconciled_at.isoformat() if self.reconciled_at else None,
            "reconciled_by": self.reconciled_by,
            "transaction_date": self.transaction_date.isoformat() if self.transaction_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }