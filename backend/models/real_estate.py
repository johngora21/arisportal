from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum
from datetime import datetime

class PropertyType(str, enum.Enum):
    PLOT = "plot"
    HOUSE = "house"
    APARTMENT = "apartment"
    COMMERCIAL = "commercial"
    OFFICE = "office"
    WAREHOUSE = "warehouse"
    SHOP = "shop"

class PropertyStatus(str, enum.Enum):
    AVAILABLE = "available"
    SOLD = "sold"
    RENTED = "rented"
    PENDING = "pending"
    OFF_MARKET = "off_market"

class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    UNDER_REVIEW = "under_review"

class LotUse(str, enum.Enum):
    MIXED_USE = "Mixed Use"
    RESIDENTIAL = "Residential"
    COMMERCIAL = "Commercial"
    INDUSTRIAL = "Industrial"
    AGRICULTURAL = "Agricultural"
    RECREATIONAL = "Recreational"

class FurnishingType(str, enum.Enum):
    FURNISHED = "Furnished"
    SEMI_FURNISHED = "Semi-furnished"
    UNFURNISHED = "Unfurnished"

class Property(Base):
    __tablename__ = "properties"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    property_type = Column(String(50), nullable=False)
    status = Column(String(50), default="available")
    verification_status = Column(String(50), default="pending")
    
    # Location Details
    region = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    council = Column(String(100), nullable=False)
    locality = Column(String(100), nullable=False)
    street = Column(String(200))
    ward = Column(String(100))
    postal_code = Column(String(20))
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Pricing
    price = Column(Float, nullable=False)
    estimated_value = Column(Float)
    
    # Property Details
    size = Column(Float)  # in square meters
    area = Column(Float)  # total area
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    kitchen = Column(String(50))
    year_built = Column(Integer)
    condition = Column(String(50))
    furnishing = Column(String(50))
    parking = Column(String(100))
    security = Column(String(100))
    utilities = Column(String(200))
    features = Column(Text)
    
    # Plot Specific Fields
    lot_number = Column(String(50))
    legal_area = Column(String(100))
    lot_type = Column(String(50))
    lot_use = Column(String(50))
    block = Column(String(50))
    
    # Building Specific Fields
    total_area = Column(Float)
    nearby_landmarks = Column(String(200))
    access_road = Column(String(100))
    
    # Ownership and Contact
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    contact_name = Column(String(100), nullable=False)
    contact_role = Column(String(50), nullable=False)
    contact_phone = Column(String(20), nullable=False)
    contact_email = Column(String(100), nullable=False)
    
    # Documents
    national_id_number = Column(String(50))
    national_id_photo_path = Column(String(500))
    supporting_document_type = Column(String(100))
    supporting_document_path = Column(String(500))
    title_deed_path = Column(String(500))
    
    # GPS Boundary Mapping
    boundary_points = Column(Integer, default=0)
    boundary_distance = Column(Float, default=0.0)
    boundary_coordinates = Column(JSON)  # Store polygon coordinates
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="properties")
    images = relationship("PropertyImage", back_populates="property", cascade="all, delete-orphan")
    listings = relationship("PropertyListing", back_populates="property", cascade="all, delete-orphan")

class PropertyImage(Base):
    __tablename__ = "property_images"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    image_path = Column(String(500), nullable=False)
    image_type = Column(String(50), default="property")  # property, document, etc.
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    property = relationship("Property", back_populates="images")

class PropertyListing(Base):
    __tablename__ = "property_listings"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    listing_type = Column(String(50), default="sale")  # sale, rent, auction
    listing_price = Column(Float, nullable=False)
    listing_description = Column(Text)
    is_active = Column(Boolean, default=True)
    listing_start_date = Column(DateTime, default=func.now())
    listing_end_date = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    property = relationship("Property", back_populates="listings")

class InvestmentProject(Base):
    __tablename__ = "investment_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    category = Column(String(50), nullable=False)  # commercial, residential, mixed-use
    location = Column(String(200), nullable=False)
    
    # Project Details
    land_size = Column(String(100))
    zoning = Column(String(100))
    access = Column(String(100))
    duration = Column(String(50))  # e.g., "24 months"
    development_stage = Column(String(50))  # planning, construction, completed
    status = Column(String(50), default="active")  # active, completed, cancelled
    
    # Financial Details
    total_project_value = Column(Float, nullable=False)
    minimum_investment = Column(Float, nullable=False)
    current_investors = Column(Integer, default=0)
    target_investors = Column(Integer, nullable=False)
    funding_progress = Column(Float, default=0.0)  # percentage
    expected_roi = Column(Float, nullable=False)  # percentage
    investment_deadline = Column(String(50))
    
    # Location Coordinates
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Project Features
    features = Column(JSON)  # Store array of features
    
    # Ownership
    project_manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    contact_name = Column(String(100), nullable=False)
    contact_role = Column(String(50), nullable=False)
    contact_phone = Column(String(20), nullable=False)
    contact_email = Column(String(100), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    project_manager = relationship("User")
    investments = relationship("ProjectInvestment", back_populates="project", cascade="all, delete-orphan")
    images = relationship("ProjectImage", back_populates="project", cascade="all, delete-orphan")

class ProjectInvestment(Base):
    __tablename__ = "project_investments"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("investment_projects.id"), nullable=False)
    investor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    investment_amount = Column(Float, nullable=False)
    investment_date = Column(DateTime, default=func.now())
    status = Column(String(50), default="active")  # active, completed, cancelled
    expected_return = Column(Float)
    actual_return = Column(Float)
    
    # Relationships
    project = relationship("InvestmentProject", back_populates="investments")
    investor = relationship("User")

class ProjectImage(Base):
    __tablename__ = "project_images"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("investment_projects.id"), nullable=False)
    image_path = Column(String(500), nullable=False)
    image_type = Column(String(50), default="project")
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    project = relationship("InvestmentProject", back_populates="images")

class UserProperty(Base):
    __tablename__ = "user_properties"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    acquisition_date = Column(DateTime, nullable=False)
    acquisition_price = Column(Float, nullable=False)
    current_value = Column(Float)
    verification_status = Column(String(50), default="pending")
    is_for_sale = Column(Boolean, default=False)
    is_for_rent = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    property = relationship("Property")
