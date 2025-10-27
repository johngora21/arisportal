from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Card(Base):
    __tablename__ = "cards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    card_type = Column(String(50), nullable=False)
    last_four = Column(String(4), nullable=False)
    expiry_month = Column(String(2))
    expiry_year = Column(String(4))
    cardholder_name = Column(String(100))
    is_active = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    
    # Current balance for this business (blockchain tracked within shared pool)
    balance = Column(Float, default=0.0)
    
    # Customer BillPay Control Number for top-ups to this card
    topup_control_number = Column(String(50), unique=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class CardTransaction(Base):
    __tablename__ = "card_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Transaction details
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="TZS")
    
    # Customer BillPay Control Number - generated per payment, used to identify which business
    customer_billpay_control_number = Column(String(50), nullable=False)
    
    # Payment reference - unique for each transaction
    payment_reference = Column(String(100), unique=True, nullable=False)
    
    # Customer details (optional)
    customer_name = Column(String(200))
    customer_phone = Column(String(50))
    customer_email = Column(String(200))
    
    description = Column(Text)
    
    # Transaction status
    status = Column(String(50), default="pending")  # pending, completed, failed
    transaction_type = Column(String(50))  # deposit, withdrawal, customer_payment
    
    # ClickPesa details
    clickpesa_transaction_id = Column(String(100))
    clickpesa_payout_id = Column(String(100))
    clickpesa_response = Column(Text)
    
    # Blockchain tracking
    blockchain_hash = Column(String(255))
    blockchain_block = Column(Integer)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 