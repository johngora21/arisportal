from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

class UserStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"
    SUSPENDED = "suspended"

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Authentication fields
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    # Personal Information
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    nationality = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    national_id_number = Column(String(50), nullable=True)
    national_id_document = Column(String(255), nullable=True)  # File path
    
    # Business Information
    business_name = Column(String(255), nullable=True)
    business_type = Column(String(100), nullable=True)
    business_email = Column(String(255), nullable=True)
    business_phone = Column(String(20), nullable=True)
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    business_address = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)
    registration_number = Column(String(100), nullable=True)
    tax_id = Column(String(100), nullable=True)
    business_license_document = Column(String(255), nullable=True)  # File path
    registration_certificate_document = Column(String(255), nullable=True)  # File path
    tax_certificate_document = Column(String(255), nullable=True)  # File path
    
    # System fields
    status = Column(Enum(UserStatus), default=UserStatus.ACTIVE)
    email_verified = Column(Boolean, default=False)
    profile_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Computed properties
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def initials(self):
        return f"{self.first_name[0] if self.first_name else ''}{self.last_name[0] if self.last_name else ''}"
    
    @property
    def business_initials(self):
        if not self.business_name:
            return ""
        words = self.business_name.split()
        return "".join([word[0] for word in words[:2]])
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": self.full_name,
            "initials": self.initials,
            "phone": self.phone,
            "nationality": self.nationality,
            "address": self.address,
            "national_id_number": self.national_id_number,
            "national_id_document": self.national_id_document,
            "business_name": self.business_name,
            "business_type": self.business_type,
            "business_email": self.business_email,
            "business_phone": self.business_phone,
            "country": self.country,
            "city": self.city,
            "business_address": self.business_address,
            "website": self.website,
            "registration_number": self.registration_number,
            "tax_id": self.tax_id,
            "business_license_document": self.business_license_document,
            "registration_certificate_document": self.registration_certificate_document,
            "tax_certificate_document": self.tax_certificate_document,
            "status": self.status.value if self.status else None,
            "email_verified": self.email_verified,
            "profile_completed": self.profile_completed,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None
        }