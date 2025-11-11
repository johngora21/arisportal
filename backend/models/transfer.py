from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class TransferType(str, enum.Enum):
    CARD_TO_CARD = "card_to_card"
    LOCAL_PEER = "local_peer"
    LOCAL_BULK = "local_bulk"

class TransferMethod(str, enum.Enum):
    BANK = "bank"
    MNO = "mno"

class TransferStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Transfer(Base):
    __tablename__ = "transfers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    
    # Transfer type
    transfer_type = Column(SQLEnum(TransferType), nullable=False)
    
    # Source details
    from_card_id = Column(Integer, ForeignKey("cards.id"), nullable=True)
    transfer_mode = Column(String(50))  # 'card' or 'external'
    
    # Destination details (for card-to-card)
    to_card_id = Column(Integer, ForeignKey("cards.id"), nullable=True)
    
    # Transfer method (for local transfers)
    transfer_method = Column(SQLEnum(TransferMethod), nullable=True)
    
    # Recipient details (for local transfers)
    recipient_name = Column(String(200))
    recipient_phone = Column(String(50))
    recipient_account = Column(String(100))  # Bank account or phone number
    recipient_bank = Column(String(100))  # Bank ID or name
    recipient_mno = Column(String(100))  # MNO ID or name
    
    # Amount and currency
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="TZS")
    
    # Description
    description = Column(Text)
    
    # Status
    status = Column(SQLEnum(TransferStatus), default=TransferStatus.PENDING)
    
    # ClickPesa details
    clickpesa_reference = Column(String(100))
    clickpesa_response = Column(Text)
    clickpesa_transaction_id = Column(String(100))
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class BulkTransferRecipient(Base):
    __tablename__ = "bulk_transfer_recipients"
    
    id = Column(Integer, primary_key=True, index=True)
    transfer_id = Column(Integer, ForeignKey("transfers.id"), nullable=False)
    
    # Recipient details
    recipient_name = Column(String(200), nullable=False)
    recipient_account = Column(String(100), nullable=False)  # Bank account or phone number
    amount = Column(Float, nullable=False)
    
    # Bank or MNO
    bank_id = Column(String(100), nullable=True)
    mno_id = Column(String(100), nullable=True)
    
    # Status
    status = Column(SQLEnum(TransferStatus), default=TransferStatus.PENDING)
    
    # ClickPesa details
    clickpesa_reference = Column(String(100))
    clickpesa_response = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

