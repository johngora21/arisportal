from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from datetime import datetime

class BlockchainTransaction(Base):
    """
    Track all blockchain transactions for audit and security
    
    PURPOSE: Immutable records of ClickPesa transactions
    - ClickPesa handles actual payment processing
    - Blockchain ensures transaction integrity and audit trail
    - Prevents fraud and disputes in shared pool system
    """
    __tablename__ = "blockchain_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    transaction_hash = Column(String(255), unique=True, nullable=False)
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Transaction details
    transaction_type = Column(String(50), nullable=False)  # payment, topup, payout
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="TZS")
    
    # Blockchain metadata
    block_number = Column(Integer)
    block_hash = Column(String(255))
    gas_used = Column(Integer)
    gas_price = Column(String(50))
    
    # ClickPesa integration
    payment_reference = Column(String(100), unique=True, nullable=True)
    clickpesa_transaction_id = Column(String(100))
    
    # Smart contract info
    contract_address = Column(String(255))
    method_name = Column(String(100))  # e.g., "recordPayment", "updateBalance"
    
    # Status
    status = Column(String(50), default="pending")  # pending, confirmed, failed
    confirmation_count = Column(Integer, default=0)
    
    # Additional data
    metadata = Column(Text)  # JSON string for additional data
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    confirmed_at = Column(DateTime(timezone=True))

class CardBalanceLedger(Base):
    """
    Immutable ledger of all balance changes for audit and integrity verification
    
    PURPOSE: Track every balance change in shared ClickPesa pool
    - Ensures correct allocation to businesses
    - Verifies no funds are lost or duplicated
    - Provides complete audit trail
    """
    __tablename__ = "card_balance_ledger"
    
    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Balance change details
    previous_balance = Column(Float, nullable=False)
    transaction_amount = Column(Float, nullable=False)  # Can be positive (credit) or negative (debit)
    new_balance = Column(Float, nullable=False)
    currency = Column(String(3), default="TZS")
    
    # Transaction reference
    transaction_reference = Column(String(100), nullable=False)
    transaction_type = Column(String(50), nullable=False)
    
    # Blockchain sync
    blockchain_transaction_id = Column(Integer, ForeignKey("blockchain_transactions.id"), nullable=True)
    is_synced_to_blockchain = Column(Boolean, default=False)
    
    # Metadata
    description = Column(Text)
    metadata = Column(Text)  # JSON string
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
