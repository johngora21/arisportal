from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, String, Text, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv(
    'DATABASE_URL', 
    'mysql+pymysql://root:password@localhost:3306/arisportal'
)

# Create FastAPI app
app = FastAPI(
    title="ArisPortal Suppliers API",
    description="Supplier management API for ArisPortal",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models for request/response validation
class ContactInfo(BaseModel):
    phone: str
    email: str
    website: Optional[str] = None
    address: str

class Coordinates(BaseModel):
    lat: Optional[float] = None
    lng: Optional[float] = None

class SupplierCreate(BaseModel):
    name: str
    category: str
    location: str
    country: str
    contact: ContactInfo
    priceRange: str
    bulkDiscount: Optional[str] = None
    minOrder: str
    leadTime: str
    tags: Optional[List[str]] = []
    specialties: Optional[List[str]] = []
    paymentMethods: Optional[List[str]] = []
    deliveryAreas: Optional[List[str]] = []
    coordinates: Optional[Coordinates] = None

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    contact: Optional[ContactInfo] = None
    priceRange: Optional[str] = None
    bulkDiscount: Optional[str] = None
    minOrder: Optional[str] = None
    leadTime: Optional[str] = None
    tags: Optional[List[str]] = None
    specialties: Optional[List[str]] = None
    paymentMethods: Optional[List[str]] = None
    deliveryAreas: Optional[List[str]] = None
    coordinates: Optional[Coordinates] = None

class SupplierResponse(BaseModel):
    id: int
    name: str
    category: str
    location: str
    country: str
    contact: ContactInfo
    priceRange: str
    bulkDiscount: Optional[str] = None
    minOrder: str
    leadTime: str
    tags: List[str]
    specialties: List[str]
    paymentMethods: List[str]
    deliveryAreas: List[str]
    coordinates: Optional[Coordinates] = None
    isVerified: bool
    isActive: bool
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True

# Database model
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
    tags = Column(Text, nullable=True)
    specialties = Column(Text, nullable=True)
    payment_methods = Column(Text, nullable=True)
    delivery_areas = Column(Text, nullable=True)
    
    # Location Coordinates
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Metadata
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# API Routes
@app.post("/api/v1/suppliers/", response_model=SupplierResponse)
async def create_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    """Create a new supplier"""
    try:
        db_supplier = Supplier(
            name=supplier.name,
            category=supplier.category,
            location=supplier.location,
            country=supplier.country,
            phone=supplier.contact.phone,
            email=supplier.contact.email,
            website=supplier.contact.website,
            address=supplier.contact.address,
            price_range=supplier.priceRange,
            bulk_discount=supplier.bulkDiscount,
            min_order=supplier.minOrder,
            lead_time=supplier.leadTime,
            tags=','.join(supplier.tags) if supplier.tags else None,
            specialties=','.join(supplier.specialties) if supplier.specialties else None,
            payment_methods=','.join(supplier.paymentMethods) if supplier.paymentMethods else None,
            delivery_areas=','.join(supplier.deliveryAreas) if supplier.deliveryAreas else None,
            latitude=supplier.coordinates.lat if supplier.coordinates else None,
            longitude=supplier.coordinates.lng if supplier.coordinates else None
        )
        
        db.add(db_supplier)
        db.commit()
        db.refresh(db_supplier)
        
        return SupplierResponse(
            id=db_supplier.id,
            name=db_supplier.name,
            category=db_supplier.category,
            location=db_supplier.location,
            country=db_supplier.country,
            contact=ContactInfo(
                phone=db_supplier.phone,
                email=db_supplier.email,
                website=db_supplier.website,
                address=db_supplier.address
            ),
            priceRange=db_supplier.price_range,
            bulkDiscount=db_supplier.bulk_discount,
            minOrder=db_supplier.min_order,
            leadTime=db_supplier.lead_time,
            tags=db_supplier.tags.split(',') if db_supplier.tags else [],
            specialties=db_supplier.specialties.split(',') if db_supplier.specialties else [],
            paymentMethods=db_supplier.payment_methods.split(',') if db_supplier.payment_methods else [],
            deliveryAreas=db_supplier.delivery_areas.split(',') if db_supplier.delivery_areas else [],
            coordinates=Coordinates(lat=db_supplier.latitude, lng=db_supplier.longitude) if db_supplier.latitude else None,
            isVerified=db_supplier.is_verified,
            isActive=db_supplier.is_active,
            createdAt=db_supplier.created_at,
            updatedAt=db_supplier.updated_at
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/suppliers/", response_model=List[SupplierResponse])
async def get_suppliers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    country: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get suppliers with optional filtering"""
    try:
        query = db.query(Supplier).filter(Supplier.is_active == True)
        
        if country:
            query = query.filter(Supplier.country == country)
        
        if category:
            query = query.filter(Supplier.category == category)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                Supplier.name.ilike(search_term) |
                Supplier.location.ilike(search_term) |
                Supplier.tags.ilike(search_term) |
                Supplier.specialties.ilike(search_term)
            )
        
        suppliers = query.offset(skip).limit(limit).all()
        
        return [
            SupplierResponse(
                id=s.id,
                name=s.name,
                category=s.category,
                location=s.location,
                country=s.country,
                contact=ContactInfo(
                    phone=s.phone,
                    email=s.email,
                    website=s.website,
                    address=s.address
                ),
                priceRange=s.price_range,
                bulkDiscount=s.bulk_discount,
                minOrder=s.min_order,
                leadTime=s.lead_time,
                tags=s.tags.split(',') if s.tags else [],
                specialties=s.specialties.split(',') if s.specialties else [],
                paymentMethods=s.payment_methods.split(',') if s.payment_methods else [],
                deliveryAreas=s.delivery_areas.split(',') if s.delivery_areas else [],
                coordinates=Coordinates(lat=s.latitude, lng=s.longitude) if s.latitude else None,
                isVerified=s.is_verified,
                isActive=s.is_active,
                createdAt=s.created_at,
                updatedAt=s.updated_at
            ) for s in suppliers
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/suppliers/{supplier_id}", response_model=SupplierResponse)
async def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """Get a specific supplier by ID"""
    try:
        supplier = db.query(Supplier).filter(
            Supplier.id == supplier_id,
            Supplier.is_active == True
        ).first()
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        return SupplierResponse(
            id=supplier.id,
            name=supplier.name,
            category=supplier.category,
            location=supplier.location,
            country=supplier.country,
            contact=ContactInfo(
                phone=supplier.phone,
                email=supplier.email,
                website=supplier.website,
                address=supplier.address
            ),
            priceRange=supplier.price_range,
            bulkDiscount=supplier.bulk_discount,
            minOrder=supplier.min_order,
            leadTime=supplier.lead_time,
            tags=supplier.tags.split(',') if supplier.tags else [],
            specialties=supplier.specialties.split(',') if supplier.specialties else [],
            paymentMethods=supplier.payment_methods.split(',') if supplier.payment_methods else [],
            deliveryAreas=supplier.delivery_areas.split(',') if supplier.delivery_areas else [],
            coordinates=Coordinates(lat=supplier.latitude, lng=supplier.longitude) if supplier.latitude else None,
            isVerified=supplier.is_verified,
            isActive=supplier.is_active,
            createdAt=supplier.created_at,
            updatedAt=supplier.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/v1/suppliers/{supplier_id}", response_model=SupplierResponse)
async def update_supplier(supplier_id: int, supplier: SupplierUpdate, db: Session = Depends(get_db)):
    """Update a supplier"""
    try:
        db_supplier = db.query(Supplier).filter(
            Supplier.id == supplier_id,
            Supplier.is_active == True
        ).first()
        
        if not db_supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        # Update fields
        if supplier.name is not None:
            db_supplier.name = supplier.name
        if supplier.category is not None:
            db_supplier.category = supplier.category
        if supplier.location is not None:
            db_supplier.location = supplier.location
        if supplier.country is not None:
            db_supplier.country = supplier.country
        
        if supplier.contact is not None:
            if supplier.contact.phone is not None:
                db_supplier.phone = supplier.contact.phone
            if supplier.contact.email is not None:
                db_supplier.email = supplier.contact.email
            if supplier.contact.website is not None:
                db_supplier.website = supplier.contact.website
            if supplier.contact.address is not None:
                db_supplier.address = supplier.contact.address
        
        if supplier.priceRange is not None:
            db_supplier.price_range = supplier.priceRange
        if supplier.bulkDiscount is not None:
            db_supplier.bulk_discount = supplier.bulkDiscount
        if supplier.minOrder is not None:
            db_supplier.min_order = supplier.minOrder
        if supplier.leadTime is not None:
            db_supplier.lead_time = supplier.leadTime
        
        if supplier.tags is not None:
            db_supplier.tags = ','.join(supplier.tags) if supplier.tags else None
        if supplier.specialties is not None:
            db_supplier.specialties = ','.join(supplier.specialties) if supplier.specialties else None
        if supplier.paymentMethods is not None:
            db_supplier.payment_methods = ','.join(supplier.paymentMethods) if supplier.paymentMethods else None
        if supplier.deliveryAreas is not None:
            db_supplier.delivery_areas = ','.join(supplier.deliveryAreas) if supplier.deliveryAreas else None
        
        if supplier.coordinates is not None:
            db_supplier.latitude = supplier.coordinates.lat
            db_supplier.longitude = supplier.coordinates.lng
        
        db.commit()
        db.refresh(db_supplier)
        
        return SupplierResponse(
            id=db_supplier.id,
            name=db_supplier.name,
            category=db_supplier.category,
            location=db_supplier.location,
            country=db_supplier.country,
            contact=ContactInfo(
                phone=db_supplier.phone,
                email=db_supplier.email,
                website=db_supplier.website,
                address=db_supplier.address
            ),
            priceRange=db_supplier.price_range,
            bulkDiscount=db_supplier.bulk_discount,
            minOrder=db_supplier.min_order,
            leadTime=db_supplier.lead_time,
            tags=db_supplier.tags.split(',') if db_supplier.tags else [],
            specialties=db_supplier.specialties.split(',') if db_supplier.specialties else [],
            paymentMethods=db_supplier.payment_methods.split(',') if db_supplier.payment_methods else [],
            deliveryAreas=db_supplier.delivery_areas.split(',') if db_supplier.delivery_areas else [],
            coordinates=Coordinates(lat=db_supplier.latitude, lng=db_supplier.longitude) if db_supplier.latitude else None,
            isVerified=db_supplier.is_verified,
            isActive=db_supplier.is_active,
            createdAt=db_supplier.created_at,
            updatedAt=db_supplier.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/v1/suppliers/{supplier_id}")
async def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """Delete a supplier (soft delete)"""
    try:
        supplier = db.query(Supplier).filter(
            Supplier.id == supplier_id,
            Supplier.is_active == True
        ).first()
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        supplier.is_active = False
        db.commit()
        
        return {"message": "Supplier deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/v1/suppliers/{supplier_id}/verify", response_model=SupplierResponse)
async def verify_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """Verify a supplier"""
    try:
        supplier = db.query(Supplier).filter(
            Supplier.id == supplier_id,
            Supplier.is_active == True
        ).first()
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        supplier.is_verified = True
        db.commit()
        db.refresh(supplier)
        
        return SupplierResponse(
            id=supplier.id,
            name=supplier.name,
            category=supplier.category,
            location=supplier.location,
            country=supplier.country,
            contact=ContactInfo(
                phone=supplier.phone,
                email=supplier.email,
                website=supplier.website,
                address=supplier.address
            ),
            priceRange=supplier.price_range,
            bulkDiscount=supplier.bulk_discount,
            minOrder=supplier.min_order,
            leadTime=supplier.lead_time,
            tags=supplier.tags.split(',') if supplier.tags else [],
            specialties=supplier.specialties.split(',') if supplier.specialties else [],
            paymentMethods=supplier.payment_methods.split(',') if supplier.payment_methods else [],
            deliveryAreas=supplier.delivery_areas.split(',') if supplier.delivery_areas else [],
            coordinates=Coordinates(lat=supplier.latitude, lng=supplier.longitude) if supplier.latitude else None,
            isVerified=supplier.is_verified,
            isActive=supplier.is_active,
            createdAt=supplier.created_at,
            updatedAt=supplier.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/suppliers/meta/categories")
async def get_supplier_categories(db: Session = Depends(get_db)):
    """Get all supplier categories"""
    try:
        categories = db.query(Supplier.category).filter(
            Supplier.is_active == True
        ).distinct().all()
        return {"data": [category[0] for category in categories if category[0]]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/suppliers/meta/countries")
async def get_supplier_countries(db: Session = Depends(get_db)):
    """Get all supplier countries"""
    try:
        countries = db.query(Supplier.country).filter(
            Supplier.is_active == True
        ).distinct().all()
        return {"data": [country[0] for country in countries if country[0]]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/suppliers/meta/stats")
async def get_supplier_stats(db: Session = Depends(get_db)):
    """Get supplier statistics"""
    try:
        total_suppliers = db.query(Supplier).filter(Supplier.is_active == True).count()
        verified_suppliers = db.query(Supplier).filter(
            Supplier.is_active == True,
            Supplier.is_verified == True
        ).count()
        
        categories = db.query(Supplier.category).filter(
            Supplier.is_active == True
        ).distinct().all()
        
        countries = db.query(Supplier.country).filter(
            Supplier.is_active == True
        ).distinct().all()
        
        return {
            "data": {
                "totalSuppliers": total_suppliers,
                "verifiedSuppliers": verified_suppliers,
                "totalCategories": len(categories),
                "totalCountries": len(countries),
                "categories": [category[0] for category in categories if category[0]],
                "countries": [country[0] for country in countries if country[0]]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "message": "Suppliers API is running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
