"""
Card Ledger Model
Accounting entries for card transactions (debit/credit)
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class LedgerEntryType(str, enum.Enum):
    """Type of ledger entry"""
    DEBIT = "DEBIT"   # Money going out (withdrawal, transfer out)
    CREDIT = "CREDIT"  # Money coming in (top-up, transfer in)

class LedgerEntrySource(str, enum.Enum):
    """Source of the ledger entry"""
    CLICKPESA_TOPUP = "CLICKPESA_TOPUP"  # Top-up payment from ClickPesa
    TRANSFER_IN = "TRANSFER_IN"          # Transfer from another card
    TRANSFER_OUT = "TRANSFER_OUT"        # Transfer to another card
    WITHDRAWAL = "WITHDRAWAL"            # Withdrawal from card
    ADJUSTMENT = "ADJUSTMENT"            # Manual adjustment

class CardLedgerEntry(Base):
    """
    Accounting ledger for card transactions.
    Each entry represents a debit or credit to a card balance.
    """
    __tablename__ = "card_ledger_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False, index=True)
    
    # Entry type
    entry_type = Column(Enum(LedgerEntryType), nullable=False)  # DEBIT or CREDIT
    entry_source = Column(Enum(LedgerEntrySource), nullable=False)  # Source of entry
    
    # Amount
    amount = Column(Float, nullable=False)  # Always positive, type determines if debit or credit
    currency = Column(String(3), default="TZS")
    
    # Reference information
    reference = Column(String(100), nullable=True)  # Order ID, transaction ID, etc.
    description = Column(Text, nullable=True)
    
    # Related transaction (if applicable)
    related_transaction_id = Column(Integer, ForeignKey("card_transactions.id"), nullable=True)
    related_card_id = Column(Integer, ForeignKey("cards.id"), nullable=True)  # For transfers
    
    # ClickPesa details (if from ClickPesa)
    clickpesa_order_id = Column(String(100), nullable=True)
    clickpesa_control_number = Column(String(50), nullable=True)
    clickpesa_response = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    created_by = Column(Integer, ForeignKey("user_profiles.id"), nullable=True)  # User who created (for manual entries)
    
    # Relationships
    card = relationship("Card", foreign_keys=[card_id])
    user = relationship("UserProfile", foreign_keys=[user_id])
    related_transaction = relationship("CardTransaction", foreign_keys=[related_transaction_id])

