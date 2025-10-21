from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, Text, Float
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from database import Base

class Contact(Base):
    __tablename__ = 'contact'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    company = Column(String(255))
    email = Column(String(255))
    phone = Column(String(50))
    whatsapp = Column(String(50))
    location = Column(String(255))
    status = Column(String(50))
    value = Column(Float)
    notes = Column(Text)
    owner_id = Column(Integer, nullable=False)
    created_at = Column(DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'company': self.company,
            'email': self.email,
            'phone': self.phone,
            'whatsapp': self.whatsapp,
            'location': self.location,
            'status': self.status,
            'value': self.value,
            'notes': self.notes,
            'owner_id': self.owner_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Deal(Base):
    __tablename__ = 'deal'
    
    id = Column(Integer, primary_key=True)
    product_name = Column(String(255), nullable=False)
    product_category = Column(String(100))
    buyer_name = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    order_date = Column(DateTime)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    status = Column(String(50))
    contact_id = Column(Integer)
    creator_id = Column(Integer, nullable=False)
    created_at = Column(DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_name': self.product_name,
            'product_category': self.product_category,
            'buyer_name': self.buyer_name,
            'address': self.address,
            'email': self.email,
            'phone': self.phone,
            'order_date': self.order_date.isoformat() if self.order_date else None,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'status': self.status,
            'contact_id': self.contact_id,
            'creator_id': self.creator_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Pydantic models for API
class ContactCreate(BaseModel):
    name: str
    company: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    status: str = 'lead'
    value: float = 0.0
    notes: Optional[str] = None
    owner_id: int

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    status: Optional[str] = None
    value: Optional[float] = None
    notes: Optional[str] = None
    owner_id: Optional[int] = None

class DealCreate(BaseModel):
    product_name: str
    product_category: Optional[str] = None
    buyer_name: str
    address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    order_date: Optional[datetime] = None
    quantity: int = 1
    unit_price: float
    status: str = 'pending'
    contact_id: Optional[int] = None
    creator_id: int

class DealUpdate(BaseModel):
    product_name: Optional[str] = None
    product_category: Optional[str] = None
    buyer_name: Optional[str] = None
    address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    order_date: Optional[datetime] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    status: Optional[str] = None
    contact_id: Optional[int] = None
