from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# Import User to ensure it's available for relationships
from models.user import User

# Enums
class PropertyType(str, Enum):
    PLOT = "plot"
    HOUSE = "house"
    APARTMENT = "apartment"
    COMMERCIAL = "commercial"
    OFFICE = "office"
    WAREHOUSE = "warehouse"
    SHOP = "shop"

class PropertyStatus(str, Enum):
    AVAILABLE = "available"
    SOLD = "sold"
    RENTED = "rented"
    PENDING = "pending"
    OFF_MARKET = "off_market"

class VerificationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    UNDER_REVIEW = "under_review"

class LotUse(str, Enum):
    MIXED_USE = "Mixed Use"
    RESIDENTIAL = "Residential"
    COMMERCIAL = "Commercial"
    INDUSTRIAL = "Industrial"
    AGRICULTURAL = "Agricultural"
    RECREATIONAL = "Recreational"

class FurnishingType(str, Enum):
    FURNISHED = "Furnished"
    SEMI_FURNISHED = "Semi-furnished"
    UNFURNISHED = "Unfurnished"

# Base schemas
class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    property_type: PropertyType
    region: str
    district: str
    council: str
    locality: str
    street: Optional[str] = None
    ward: Optional[str] = None
    postal_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price: float
    estimated_value: Optional[float] = None
    size: Optional[float] = None
    area: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    kitchen: Optional[str] = None
    year_built: Optional[int] = None
    condition: Optional[str] = None
    furnishing: Optional[FurnishingType] = None
    parking: Optional[str] = None
    security: Optional[str] = None
    utilities: Optional[str] = None
    features: Optional[str] = None
    
    # Plot specific
    lot_number: Optional[str] = None
    legal_area: Optional[str] = None
    lot_type: Optional[str] = None
    lot_use: Optional[LotUse] = None
    block: Optional[str] = None
    
    # Building specific
    total_area: Optional[float] = None
    nearby_landmarks: Optional[str] = None
    access_road: Optional[str] = None
    
    # Contact information
    contact_name: str
    contact_role: str
    contact_phone: str
    contact_email: str
    
    # Documents
    national_id_number: Optional[str] = None
    supporting_document_type: Optional[str] = None
    
    # GPS Boundary
    boundary_points: Optional[int] = 0
    boundary_distance: Optional[float] = 0.0
    boundary_coordinates: Optional[List[Dict[str, float]]] = None

class PropertyCreate(PropertyBase):
    owner_id: int

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[PropertyStatus] = None
    verification_status: Optional[VerificationStatus] = None
    price: Optional[float] = None
    estimated_value: Optional[float] = None
    contact_name: Optional[str] = None
    contact_role: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    features: Optional[str] = None

class PropertyResponse(PropertyBase):
    id: int
    status: PropertyStatus
    verification_status: VerificationStatus
    owner_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PropertyImageCreate(BaseModel):
    property_id: int
    image_type: str = "property"
    is_primary: bool = False

class PropertyImageResponse(BaseModel):
    id: int
    property_id: int
    image_path: str
    image_type: str
    is_primary: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class PropertyListingCreate(BaseModel):
    property_id: int
    listing_type: str = "sale"
    listing_price: float
    listing_description: Optional[str] = None
    listing_end_date: Optional[datetime] = None

class PropertyListingResponse(BaseModel):
    id: int
    property_id: int
    listing_type: str
    listing_price: float
    listing_description: Optional[str] = None
    is_active: bool
    listing_start_date: datetime
    listing_end_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class InvestmentProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    location: str
    land_size: Optional[str] = None
    zoning: Optional[str] = None
    access: Optional[str] = None
    duration: Optional[str] = None
    development_stage: Optional[str] = None
    status: str = "active"
    total_project_value: float
    minimum_investment: float
    target_investors: int
    expected_roi: float
    investment_deadline: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    features: Optional[List[str]] = None
    project_manager_id: int
    contact_name: str
    contact_role: str
    contact_phone: str
    contact_email: str

class InvestmentProjectCreate(InvestmentProjectBase):
    pass

class InvestmentProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    development_stage: Optional[str] = None
    total_project_value: Optional[float] = None
    minimum_investment: Optional[float] = None
    target_investors: Optional[int] = None
    expected_roi: Optional[float] = None
    contact_name: Optional[str] = None
    contact_role: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    features: Optional[List[str]] = None

class InvestmentProjectResponse(InvestmentProjectBase):
    id: int
    current_investors: int
    funding_progress: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProjectInvestmentCreate(BaseModel):
    project_id: int
    investor_id: int
    investment_amount: float

class ProjectInvestmentResponse(BaseModel):
    id: int
    project_id: int
    investor_id: int
    investment_amount: float
    investment_date: datetime
    status: str
    expected_return: Optional[float] = None
    actual_return: Optional[float] = None
    
    class Config:
        from_attributes = True

class UserPropertyCreate(BaseModel):
    user_id: int
    property_id: int
    acquisition_date: datetime
    acquisition_price: float
    current_value: Optional[float] = None
    is_for_sale: bool = False
    is_for_rent: bool = False

class UserPropertyResponse(BaseModel):
    id: int
    user_id: int
    property_id: int
    acquisition_date: datetime
    acquisition_price: float
    current_value: Optional[float] = None
    verification_status: VerificationStatus
    is_for_sale: bool
    is_for_rent: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Search and filter schemas
class PropertySearch(BaseModel):
    search_term: Optional[str] = None
    property_type: Optional[str] = None
    region: Optional[str] = None
    district: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_size: Optional[float] = None
    max_size: Optional[float] = None
    status: Optional[str] = None
    verification_status: Optional[str] = None
    limit: int = 20
    offset: int = 0

class InvestmentProjectSearch(BaseModel):
    search_term: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    min_investment: Optional[float] = None
    max_investment: Optional[float] = None
    min_roi: Optional[float] = None
    max_roi: Optional[float] = None
    status: Optional[str] = None
    development_stage: Optional[str] = None
    limit: int = 20
    offset: int = 0
