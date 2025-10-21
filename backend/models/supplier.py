from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class Supplier(Base):
    __tablename__ = 'suppliers'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    location = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False, index=True)
    
    # Contact Information
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    website = Column(String(255), nullable=True)
    address = Column(Text, nullable=False)
    
    # Business Details
    price_range = Column(String(100), nullable=False)
    bulk_discount = Column(String(100), nullable=True)
    min_order = Column(String(100), nullable=False)
    lead_time = Column(String(100), nullable=False)
    
    # Products & Services
    tags = Column(Text, nullable=True)  # Comma-separated product tags
    specialties = Column(Text, nullable=True)  # Comma-separated specialties
    payment_methods = Column(Text, nullable=True)  # Comma-separated payment methods
    delivery_areas = Column(Text, nullable=True)  # Comma-separated delivery areas
    
    # Location Coordinates
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Metadata
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'location': self.location,
            'country': self.country,
            'contact': {
                'phone': self.phone,
                'email': self.email,
                'website': self.website,
                'address': self.address
            },
            'priceRange': self.price_range,
            'bulkDiscount': self.bulk_discount,
            'minOrder': self.min_order,
            'leadTime': self.lead_time,
            'tags': self.tags.split(',') if self.tags else [],
            'specialties': self.specialties.split(',') if self.specialties else [],
            'paymentMethods': self.payment_methods.split(',') if self.payment_methods else [],
            'deliveryAreas': self.delivery_areas.split(',') if self.delivery_areas else [],
            'coordinates': {
                'lat': self.latitude,
                'lng': self.longitude
            },
            'isVerified': self.is_verified,
            'isActive': self.is_active,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def from_dict(cls, data):
        supplier = cls()
        supplier.name = data.get('name')
        supplier.category = data.get('category')
        supplier.location = data.get('location')
        supplier.country = data.get('country')
        
        # Contact Information
        contact = data.get('contact', {})
        supplier.phone = contact.get('phone')
        supplier.email = contact.get('email')
        supplier.website = contact.get('website')
        supplier.address = contact.get('address')
        
        # Business Details
        supplier.price_range = data.get('priceRange')
        supplier.bulk_discount = data.get('bulkDiscount')
        supplier.min_order = data.get('minOrder')
        supplier.lead_time = data.get('leadTime')
        
        # Products & Services
        supplier.tags = ','.join(data.get('tags', [])) if data.get('tags') else None
        supplier.specialties = ','.join(data.get('specialties', [])) if data.get('specialties') else None
        supplier.payment_methods = ','.join(data.get('paymentMethods', [])) if data.get('paymentMethods') else None
        supplier.delivery_areas = ','.join(data.get('deliveryAreas', [])) if data.get('deliveryAreas') else None
        
        # Location Coordinates
        coordinates = data.get('coordinates', {})
        supplier.latitude = coordinates.get('lat')
        supplier.longitude = coordinates.get('lng')
        
        return supplier
