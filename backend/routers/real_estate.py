from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc
from typing import List, Optional
import os
import uuid
from datetime import datetime
import json

from database import get_db
from models.user import User  # Import User first to ensure it's available for relationships
from models.real_estate import (
    Property, PropertyImage, PropertyListing, InvestmentProject, 
    ProjectInvestment, ProjectImage, UserProperty, PropertyType, 
    PropertyStatus, VerificationStatus
)
from schemas.real_estate import (
    PropertyCreate, PropertyUpdate, PropertyResponse, PropertyImageResponse,
    PropertyListingCreate, PropertyListingResponse, InvestmentProjectCreate,
    InvestmentProjectUpdate, InvestmentProjectResponse, ProjectInvestmentCreate,
    ProjectInvestmentResponse, UserPropertyCreate, UserPropertyResponse,
    PropertySearch, InvestmentProjectSearch
)

router = APIRouter(tags=["Real Estate"])

# File upload directory
UPLOAD_DIR = "uploads/properties"

def ensure_upload_dir():
    """Ensure upload directory exists"""
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

def save_uploaded_file(file: UploadFile, subfolder: str = "") -> str:
    """Save uploaded file and return the file path"""
    ensure_upload_dir()
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # Create subfolder path
    folder_path = os.path.join(UPLOAD_DIR, subfolder) if subfolder else UPLOAD_DIR
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    file_path = os.path.join(folder_path, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = file.file.read()
        buffer.write(content)
    
    return file_path

# ==================== PROPERTIES (PLOTS & STRUCTURES) ====================

@router.get("/properties/simple")
async def get_properties_simple():
    """Simple test endpoint without database"""
    return {"message": "Properties endpoint is working", "count": 5}

@router.get("/properties", response_model=List[PropertyResponse])
async def get_properties(db: Session = Depends(get_db)):
    """Get all properties with search and filter options"""
    query = db.query(Property)
    properties = query.offset(0).limit(100).all()
    return properties

@router.get("/properties/{property_id}", response_model=PropertyResponse)
async def get_property(property_id: int, db: Session = Depends(get_db)):
    """Get a specific property by ID"""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

@router.post("/properties", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    db: Session = Depends(get_db)
):
    """Create a new property"""
    property = Property(**property_data.dict())
    db.add(property)
    db.commit()
    db.refresh(property)
    return property

@router.put("/properties/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    db: Session = Depends(get_db)
):
    """Update a property"""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    update_data = property_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(property, field, value)
    
    db.commit()
    db.refresh(property)
    return property

@router.delete("/properties/{property_id}")
async def delete_property(property_id: int, db: Session = Depends(get_db)):
    """Delete a property"""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    db.delete(property)
    db.commit()
    return {"message": "Property deleted successfully"}

# ==================== PROPERTY IMAGES ====================

@router.post("/properties/{property_id}/images", response_model=PropertyImageResponse)
async def upload_property_image(
    property_id: int,
    file: UploadFile = File(...),
    image_type: str = Form("property"),
    is_primary: bool = Form(False),
    db: Session = Depends(get_db)
):
    """Upload an image for a property"""
    # Verify property exists
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Save file
    file_path = save_uploaded_file(file, f"property_{property_id}")
    
    # Create image record
    image = PropertyImage(
        property_id=property_id,
        image_path=file_path,
        image_type=image_type,
        is_primary=is_primary
    )
    
    db.add(image)
    db.commit()
    db.refresh(image)
    return image

@router.get("/properties/{property_id}/images", response_model=List[PropertyImageResponse])
async def get_property_images(property_id: int, db: Session = Depends(get_db)):
    """Get all images for a property"""
    images = db.query(PropertyImage).filter(PropertyImage.property_id == property_id).all()
    return images

@router.delete("/images/{image_id}")
async def delete_property_image(image_id: int, db: Session = Depends(get_db)):
    """Delete a property image"""
    image = db.query(PropertyImage).filter(PropertyImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Delete file from filesystem
    if os.path.exists(image.image_path):
        os.remove(image.image_path)
    
    db.delete(image)
    db.commit()
    return {"message": "Image deleted successfully"}

# ==================== PROPERTY LISTINGS ====================

@router.post("/properties/{property_id}/listings", response_model=PropertyListingResponse)
async def create_property_listing(
    property_id: int,
    listing_data: PropertyListingCreate,
    db: Session = Depends(get_db)
):
    """Create a listing for a property"""
    # Verify property exists
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    listing = PropertyListing(**listing_data.dict())
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

@router.get("/properties/{property_id}/listings", response_model=List[PropertyListingResponse])
async def get_property_listings(property_id: int, db: Session = Depends(get_db)):
    """Get all listings for a property"""
    listings = db.query(PropertyListing).filter(PropertyListing.property_id == property_id).all()
    return listings

@router.get("/listings", response_model=List[PropertyListingResponse])
async def get_active_listings(
    listing_type: Optional[str] = Query(None),
    limit: int = Query(20),
    offset: int = Query(0),
    db: Session = Depends(get_db)
):
    """Get all active property listings"""
    query = db.query(PropertyListing).filter(PropertyListing.is_active == True)
    
    if listing_type:
        query = query.filter(PropertyListing.listing_type == listing_type)
    
    listings = query.offset(offset).limit(limit).all()
    return listings

# ==================== INVESTMENT PROJECTS ====================

@router.get("/investment-projects", response_model=List[InvestmentProjectResponse])
async def get_investment_projects(
    search: InvestmentProjectSearch = Depends(),
    db: Session = Depends(get_db)
):
    """Get all investment projects with search and filter options"""
    query = db.query(InvestmentProject)
    
    # Apply filters
    if search.search_term:
        search_filter = or_(
            InvestmentProject.title.ilike(f"%{search.search_term}%"),
            InvestmentProject.description.ilike(f"%{search.search_term}%"),
            InvestmentProject.location.ilike(f"%{search.search_term}%")
        )
        query = query.filter(search_filter)
    
    if search.category:
        query = query.filter(InvestmentProject.category == search.category)
    
    if search.location:
        query = query.filter(InvestmentProject.location.ilike(f"%{search.location}%"))
    
    if search.min_investment:
        query = query.filter(InvestmentProject.minimum_investment >= search.min_investment)
    
    if search.max_investment:
        query = query.filter(InvestmentProject.minimum_investment <= search.max_investment)
    
    if search.min_roi:
        query = query.filter(InvestmentProject.expected_roi >= search.min_roi)
    
    if search.max_roi:
        query = query.filter(InvestmentProject.expected_roi <= search.max_roi)
    
    if search.status:
        query = query.filter(InvestmentProject.status == search.status)
    
    if search.development_stage:
        query = query.filter(InvestmentProject.development_stage == search.development_stage)
    
    # Apply pagination
    projects = query.offset(search.offset).limit(search.limit).all()
    return projects

@router.get("/investment-projects/{project_id}", response_model=InvestmentProjectResponse)
async def get_investment_project(project_id: int, db: Session = Depends(get_db)):
    """Get a specific investment project by ID"""
    project = db.query(InvestmentProject).filter(InvestmentProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Investment project not found")
    return project

@router.post("/investment-projects", response_model=InvestmentProjectResponse)
async def create_investment_project(
    project_data: InvestmentProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a new investment project"""
    project = InvestmentProject(**project_data.dict())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/investment-projects/{project_id}", response_model=InvestmentProjectResponse)
async def update_investment_project(
    project_id: int,
    project_data: InvestmentProjectUpdate,
    db: Session = Depends(get_db)
):
    """Update an investment project"""
    project = db.query(InvestmentProject).filter(InvestmentProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Investment project not found")
    
    update_data = project_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    return project

@router.delete("/investment-projects/{project_id}")
async def delete_investment_project(project_id: int, db: Session = Depends(get_db)):
    """Delete an investment project"""
    project = db.query(InvestmentProject).filter(InvestmentProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Investment project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Investment project deleted successfully"}

# ==================== PROJECT INVESTMENTS ====================

@router.post("/investment-projects/{project_id}/invest", response_model=ProjectInvestmentResponse)
async def invest_in_project(
    project_id: int,
    investment_data: ProjectInvestmentCreate,
    db: Session = Depends(get_db)
):
    """Invest in a project"""
    # Verify project exists
    project = db.query(InvestmentProject).filter(InvestmentProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Investment project not found")
    
    # Check if investment amount meets minimum requirement
    if investment_data.investment_amount < project.minimum_investment:
        raise HTTPException(
            status_code=400, 
            detail=f"Investment amount must be at least {project.minimum_investment}"
        )
    
    # Create investment
    investment = ProjectInvestment(**investment_data.dict())
    db.add(investment)
    
    # Update project statistics
    project.current_investors += 1
    project.funding_progress = (project.current_investors / project.target_investors) * 100
    
    db.commit()
    db.refresh(investment)
    return investment

@router.get("/investment-projects/{project_id}/investments", response_model=List[ProjectInvestmentResponse])
async def get_project_investments(project_id: int, db: Session = Depends(get_db)):
    """Get all investments for a project"""
    investments = db.query(ProjectInvestment).filter(ProjectInvestment.project_id == project_id).all()
    return investments

# ==================== USER PROPERTIES ====================

@router.get("/users/{user_id}/properties", response_model=List[UserPropertyResponse])
async def get_user_properties(user_id: int, db: Session = Depends(get_db)):
    """Get all properties owned by a user"""
    user_properties = db.query(UserProperty).filter(UserProperty.user_id == user_id).all()
    return user_properties

@router.post("/users/{user_id}/properties", response_model=UserPropertyResponse)
async def add_user_property(
    user_id: int,
    property_data: UserPropertyCreate,
    db: Session = Depends(get_db)
):
    """Add a property to user's portfolio"""
    user_property = UserProperty(**property_data.dict())
    db.add(user_property)
    db.commit()
    db.refresh(user_property)
    return user_property

@router.put("/user-properties/{user_property_id}", response_model=UserPropertyResponse)
async def update_user_property(
    user_property_id: int,
    current_value: Optional[float] = None,
    is_for_sale: Optional[bool] = None,
    is_for_rent: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Update user property details"""
    user_property = db.query(UserProperty).filter(UserProperty.id == user_property_id).first()
    if not user_property:
        raise HTTPException(status_code=404, detail="User property not found")
    
    if current_value is not None:
        user_property.current_value = current_value
    if is_for_sale is not None:
        user_property.is_for_sale = is_for_sale
    if is_for_rent is not None:
        user_property.is_for_rent = is_for_rent
    
    db.commit()
    db.refresh(user_property)
    return user_property

# ==================== STATISTICS ====================

@router.get("/statistics")
async def get_real_estate_statistics(db: Session = Depends(get_db)):
    """Get real estate statistics"""
    total_properties = db.query(Property).count()
    total_projects = db.query(InvestmentProject).count()
    total_investments = db.query(ProjectInvestment).count()
    
    # Property type breakdown
    property_types = db.query(Property.property_type, db.func.count(Property.id)).group_by(Property.property_type).all()
    
    # Status breakdown
    property_statuses = db.query(Property.status, db.func.count(Property.id)).group_by(Property.status).all()
    
    return {
        "total_properties": total_properties,
        "total_projects": total_projects,
        "total_investments": total_investments,
        "property_types": dict(property_types),
        "property_statuses": dict(property_statuses)
    }
