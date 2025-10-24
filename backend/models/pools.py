from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class BulkOrderPool(Base):
    __tablename__ = "bulk_order_pools"
    
    id = Column(String(36), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text)
    image = Column(String(500))  # Main image URL
    images = Column(JSON)  # Array of additional image URLs
    videos = Column(JSON)  # Array of video URLs
    tags = Column(JSON)  # Array of tags
    
    # Supplier details
    manufacturer = Column(String(255))
    supplier_contact_name = Column(String(255))
    supplier_contact_phone = Column(String(50))
    supplier_contact_email = Column(String(255))
    supplier_location = Column(String(255))
    supplier_website = Column(String(500))
    supplier_facebook = Column(String(500))
    supplier_twitter = Column(String(500))
    supplier_linkedin = Column(String(500))
    
    # Organizer details
    organizer = Column(String(255), nullable=False)
    organizer_contact_name = Column(String(255))
    organizer_contact_phone = Column(String(50))
    organizer_contact_email = Column(String(255))
    organizer_location = Column(String(255))
    organizer_website = Column(String(500))
    organizer_facebook = Column(String(500))
    organizer_twitter = Column(String(500))
    organizer_linkedin = Column(String(500))
    organizer_rating = Column(Float)
    
    # Product details
    specs = Column(JSON)  # Array of specifications
    included = Column(JSON)  # Array of included items
    lead_time_days = Column(Integer)
    payment_terms = Column(String(500))
    return_policy = Column(String(1000))
    logistics_delivery = Column(JSON)  # Array of delivery options
    logistics_pickup = Column(JSON)  # Array of pickup locations
    
    # Pool details
    target_quantity = Column(Integer, nullable=False)
    price_per_unit = Column(Float, nullable=False)
    deadline = Column(String(50), nullable=False)
    status = Column(String(50), default="active")
    current_quantity = Column(Integer, default=0)
    participants = Column(JSON, default=list)  # Array of participant data
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    participants_rel = relationship("BulkOrderParticipant", back_populates="pool")

class BulkOrderParticipant(Base):
    __tablename__ = "bulk_order_participants"
    
    id = Column(String(36), primary_key=True, index=True)
    pool_id = Column(String(36), ForeignKey("bulk_order_pools.id"))
    name = Column(String(255), nullable=False)
    company = Column(String(255))
    quantity = Column(Integer, nullable=False)
    joined_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default="pending")  # 'pending' | 'confirmed' | 'cancelled'
    email = Column(String(255))
    phone = Column(String(50))
    
    # Relationships
    pool = relationship("BulkOrderPool", back_populates="participants_rel")

class PoolPayment(Base):
    __tablename__ = "pool_payments"
    
    id = Column(String(36), primary_key=True, index=True)
    pool_id = Column(String(36), ForeignKey("bulk_order_pools.id"))
    participant_id = Column(String(36), ForeignKey("bulk_order_participants.id"))
    amount = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    payment_method = Column(String(50), nullable=False)  # 'mno' | 'card' | 'control'
    payment_status = Column(String(50), default="pending")  # 'pending' | 'completed' | 'failed'
    transaction_id = Column(String(100))
    payment_reference = Column(String(100))
    control_number = Column(String(100))
    paid_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())