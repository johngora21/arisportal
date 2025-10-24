from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid
import os
import shutil
from pathlib import Path
from models.pools import BulkOrderPool as PoolModel, BulkOrderParticipant as ParticipantModel, PoolPayment as PaymentModel

router = APIRouter()

# Pydantic models matching the frontend exactly
class BulkOrderParticipant(BaseModel):
    id: str
    name: str
    company: Optional[str] = None
    quantity: int
    joinedDate: str
    status: str = "pending"  # 'pending' | 'confirmed' | 'cancelled'
    email: Optional[str] = None
    phone: Optional[str] = None

class PoolPayment(BaseModel):
    id: str
    amount: float
    quantity: int
    paymentMethod: str  # 'mno' | 'card' | 'control'
    paymentStatus: str = "pending"  # 'pending' | 'completed' | 'failed' | 'refunded'
    mnoPhone: Optional[str] = None
    cardName: Optional[str] = None
    cardNumber: Optional[str] = None
    cardExpiry: Optional[str] = None
    cardCvv: Optional[str] = None
    controlNumber: Optional[str] = None
    transactionId: Optional[str] = None
    paymentReference: Optional[str] = None
    createdAt: Optional[str] = None
    paidAt: Optional[str] = None

class CreatePoolData(BaseModel):
    title: str
    category: str
    description: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = []
    videos: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    manufacturer: Optional[str] = None
    supplierContactName: Optional[str] = None
    supplierContactPhone: Optional[str] = None
    supplierContactEmail: Optional[str] = None
    supplierLocation: Optional[str] = None
    supplierWebsite: Optional[str] = None
    supplierFacebook: Optional[str] = None
    supplierTwitter: Optional[str] = None
    supplierLinkedIn: Optional[str] = None
    organizer: str
    organizerContactName: Optional[str] = None
    organizerContactPhone: Optional[str] = None
    organizerContactEmail: Optional[str] = None
    organizerLocation: Optional[str] = None
    organizerWebsite: Optional[str] = None
    organizerFacebook: Optional[str] = None
    organizerTwitter: Optional[str] = None
    organizerLinkedIn: Optional[str] = None
    organizerRating: Optional[float] = None
    specs: Optional[List[str]] = []
    included: Optional[List[str]] = []
    leadTimeDays: Optional[int] = None
    paymentTerms: Optional[str] = None
    returnPolicy: Optional[str] = None
    logisticsDelivery: Optional[List[str]] = []
    logisticsPickup: Optional[List[str]] = []
    targetQuantity: int
    pricePerUnit: float
    deadline: str
    status: Optional[str] = "active"  # 'active' | 'closed' | 'ready'

class JoinPoolData(BaseModel):
    name: str
    company: Optional[str] = None
    quantity: int
    email: Optional[str] = None
    phone: Optional[str] = None

class PaymentData(BaseModel):
    poolId: str
    quantity: int
    paymentMethod: str  # 'mno' | 'card' | 'control'
    mnoPhone: Optional[str] = None
    cardName: Optional[str] = None
    cardNumber: Optional[str] = None
    cardExpiry: Optional[str] = None
    cardCvv: Optional[str] = None
    controlNumber: Optional[str] = None

class BulkOrderPool(BaseModel):
    id: str
    title: str
    category: str
    description: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = []
    videos: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    manufacturer: Optional[str] = None
    supplierContactName: Optional[str] = None
    supplierContactPhone: Optional[str] = None
    supplierContactEmail: Optional[str] = None
    supplierLocation: Optional[str] = None
    supplierWebsite: Optional[str] = None
    supplierFacebook: Optional[str] = None
    supplierTwitter: Optional[str] = None
    supplierLinkedIn: Optional[str] = None
    organizer: str
    organizerContactName: Optional[str] = None
    organizerContactPhone: Optional[str] = None
    organizerContactEmail: Optional[str] = None
    organizerLocation: Optional[str] = None
    organizerWebsite: Optional[str] = None
    organizerFacebook: Optional[str] = None
    organizerTwitter: Optional[str] = None
    organizerLinkedIn: Optional[str] = None
    organizerRating: Optional[float] = None
    specs: Optional[List[str]] = []
    included: Optional[List[str]] = []
    leadTimeDays: Optional[int] = None
    paymentTerms: Optional[str] = None
    returnPolicy: Optional[str] = None
    logisticsDelivery: Optional[List[str]] = []
    logisticsPickup: Optional[List[str]] = []
    targetQuantity: int
    pricePerUnit: float
    deadline: str
    status: str = "active"
    participants: Optional[List[BulkOrderParticipant]] = []
    currentQuantity: int = 0
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

# Mock data storage - in production this would be in database
mock_pools: List[dict] = []
mock_payments: List[dict] = []

@router.get("/pools", response_model=List[BulkOrderPool])
async def get_pools(
    search: Optional[str] = None,
    country: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all bulk order pools with optional filtering"""
    query = db.query(PoolModel)
    
    if search:
        query = query.filter(PoolModel.title.ilike(f"%{search}%"))
    
    if country:
        query = query.filter(PoolModel.organizer_location.ilike(f"%{country}%"))
    
    if status:
        query = query.filter(PoolModel.status == status)
    
    pools = query.all()
    
    # Convert database models to response format
    result = []
    for pool in pools:
        pool_dict = {
            "id": pool.id,
            "title": pool.title,
            "category": pool.category,
            "description": pool.description,
            "image": pool.image,
            "images": pool.images or [],
            "videos": pool.videos or [],
            "tags": pool.tags or [],
            "manufacturer": pool.manufacturer,
            "supplierContactName": pool.supplier_contact_name,
            "supplierContactPhone": pool.supplier_contact_phone,
            "supplierContactEmail": pool.supplier_contact_email,
            "supplierLocation": pool.supplier_location,
            "supplierWebsite": pool.supplier_website,
            "supplierFacebook": pool.supplier_facebook,
            "supplierTwitter": pool.supplier_twitter,
            "supplierLinkedIn": pool.supplier_linkedin,
            "organizer": pool.organizer,
            "organizerContactName": pool.organizer_contact_name,
            "organizerContactPhone": pool.organizer_contact_phone,
            "organizerContactEmail": pool.organizer_contact_email,
            "organizerLocation": pool.organizer_location,
            "organizerWebsite": pool.organizer_website,
            "organizerFacebook": pool.organizer_facebook,
            "organizerTwitter": pool.organizer_twitter,
            "organizerLinkedIn": pool.organizer_linkedin,
            "organizerRating": pool.organizer_rating,
            "specs": pool.specs or [],
            "included": pool.included or [],
            "leadTimeDays": pool.lead_time_days,
            "paymentTerms": pool.payment_terms,
            "returnPolicy": pool.return_policy,
            "logisticsDelivery": pool.logistics_delivery or [],
            "logisticsPickup": pool.logistics_pickup or [],
            "targetQuantity": pool.target_quantity,
            "pricePerUnit": pool.price_per_unit,
            "deadline": pool.deadline,
            "status": pool.status,
            "participants": [],
            "currentQuantity": pool.current_quantity,
            "createdAt": pool.created_at.isoformat() if pool.created_at else None,
            "updatedAt": pool.updated_at.isoformat() if pool.updated_at else None
        }
        result.append(pool_dict)
    
    return result

@router.get("/pools/{pool_id}", response_model=BulkOrderPool)
async def get_pool(pool_id: str, db: Session = Depends(get_db)):
    """Get a specific bulk order pool by ID"""
    pool = next((p for p in mock_pools if p.get('id') == pool_id), None)
    if not pool:
        raise HTTPException(status_code=404, detail="Pool not found")
    return pool

@router.post("/pools", response_model=BulkOrderPool)
async def create_pool(pool_data: CreatePoolData, db: Session = Depends(get_db)):
    """Create a new bulk order pool"""
    new_pool = PoolModel(
        id=str(uuid.uuid4()),
        title=pool_data.title,
        category=pool_data.category,
        description=pool_data.description,
        image=pool_data.image,
        images=pool_data.images or [],
        videos=pool_data.videos or [],
        tags=pool_data.tags or [],
        manufacturer=pool_data.manufacturer,
        supplier_contact_name=pool_data.supplierContactName,
        supplier_contact_phone=pool_data.supplierContactPhone,
        supplier_contact_email=pool_data.supplierContactEmail,
        supplier_location=pool_data.supplierLocation,
        supplier_website=pool_data.supplierWebsite,
        supplier_facebook=pool_data.supplierFacebook,
        supplier_twitter=pool_data.supplierTwitter,
        supplier_linkedin=pool_data.supplierLinkedIn,
        organizer=pool_data.organizer,
        organizer_contact_name=pool_data.organizerContactName,
        organizer_contact_phone=pool_data.organizerContactPhone,
        organizer_contact_email=pool_data.organizerContactEmail,
        organizer_location=pool_data.organizerLocation,
        organizer_website=pool_data.organizerWebsite,
        organizer_facebook=pool_data.organizerFacebook,
        organizer_twitter=pool_data.organizerTwitter,
        organizer_linkedin=pool_data.organizerLinkedIn,
        organizer_rating=pool_data.organizerRating,
        specs=pool_data.specs or [],
        included=pool_data.included or [],
        lead_time_days=pool_data.leadTimeDays,
        payment_terms=pool_data.paymentTerms,
        return_policy=pool_data.returnPolicy,
        logistics_delivery=pool_data.logisticsDelivery or [],
        logistics_pickup=pool_data.logisticsPickup or [],
        target_quantity=pool_data.targetQuantity,
        price_per_unit=pool_data.pricePerUnit,
        deadline=pool_data.deadline,
        status=pool_data.status or "active",
        current_quantity=0
    )
    
    db.add(new_pool)
    db.commit()
    db.refresh(new_pool)
    
    # Convert to response format
    return {
        "id": new_pool.id,
        "title": new_pool.title,
        "category": new_pool.category,
        "description": new_pool.description,
        "image": new_pool.image,
        "images": new_pool.images or [],
        "videos": new_pool.videos or [],
        "tags": new_pool.tags or [],
        "manufacturer": new_pool.manufacturer,
        "supplierContactName": new_pool.supplier_contact_name,
        "supplierContactPhone": new_pool.supplier_contact_phone,
        "supplierContactEmail": new_pool.supplier_contact_email,
        "supplierLocation": new_pool.supplier_location,
        "supplierWebsite": new_pool.supplier_website,
        "supplierFacebook": new_pool.supplier_facebook,
        "supplierTwitter": new_pool.supplier_twitter,
        "supplierLinkedIn": new_pool.supplier_linkedin,
        "organizer": new_pool.organizer,
        "organizerContactName": new_pool.organizer_contact_name,
        "organizerContactPhone": new_pool.organizer_contact_phone,
        "organizerContactEmail": new_pool.organizer_contact_email,
        "organizerLocation": new_pool.organizer_location,
        "organizerWebsite": new_pool.organizer_website,
        "organizerFacebook": new_pool.organizer_facebook,
        "organizerTwitter": new_pool.organizer_twitter,
        "organizerLinkedIn": new_pool.organizer_linkedin,
        "organizerRating": new_pool.organizer_rating,
        "specs": new_pool.specs or [],
        "included": new_pool.included or [],
        "leadTimeDays": new_pool.lead_time_days,
        "paymentTerms": new_pool.payment_terms,
        "returnPolicy": new_pool.return_policy,
        "logisticsDelivery": new_pool.logistics_delivery or [],
        "logisticsPickup": new_pool.logistics_pickup or [],
        "targetQuantity": new_pool.target_quantity,
        "pricePerUnit": new_pool.price_per_unit,
        "deadline": new_pool.deadline,
        "status": new_pool.status,
        "participants": [],
        "currentQuantity": new_pool.current_quantity,
        "createdAt": new_pool.created_at.isoformat() if new_pool.created_at else None,
        "updatedAt": new_pool.updated_at.isoformat() if new_pool.updated_at else None
    }

@router.put("/pools/{pool_id}", response_model=BulkOrderPool)
async def update_pool(pool_id: str, pool_data: CreatePoolData, db: Session = Depends(get_db)):
    """Update a bulk order pool"""
    pool_index = next((i for i, p in enumerate(mock_pools) if p.get('id') == pool_id), None)
    if pool_index is None:
        raise HTTPException(status_code=404, detail="Pool not found")
    
    updated_pool = {
        **mock_pools[pool_index],
        "title": pool_data.title,
        "category": pool_data.category,
        "description": pool_data.description,
        "image": pool_data.image,
        "images": pool_data.images or [],
        "videos": pool_data.videos or [],
        "tags": pool_data.tags or [],
        "manufacturer": pool_data.manufacturer,
        "supplierContactName": pool_data.supplierContactName,
        "supplierContactPhone": pool_data.supplierContactPhone,
        "supplierContactEmail": pool_data.supplierContactEmail,
        "supplierLocation": pool_data.supplierLocation,
        "supplierWebsite": pool_data.supplierWebsite,
        "supplierFacebook": pool_data.supplierFacebook,
        "supplierTwitter": pool_data.supplierTwitter,
        "supplierLinkedIn": pool_data.supplierLinkedIn,
        "organizer": pool_data.organizer,
        "organizerContactName": pool_data.organizerContactName,
        "organizerContactPhone": pool_data.organizerContactPhone,
        "organizerContactEmail": pool_data.organizerContactEmail,
        "organizerLocation": pool_data.organizerLocation,
        "organizerWebsite": pool_data.organizerWebsite,
        "organizerFacebook": pool_data.organizerFacebook,
        "organizerTwitter": pool_data.organizerTwitter,
        "organizerLinkedIn": pool_data.organizerLinkedIn,
        "organizerRating": pool_data.organizerRating,
        "specs": pool_data.specs or [],
        "included": pool_data.included or [],
        "leadTimeDays": pool_data.leadTimeDays,
        "paymentTerms": pool_data.paymentTerms,
        "returnPolicy": pool_data.returnPolicy,
        "logisticsDelivery": pool_data.logisticsDelivery or [],
        "logisticsPickup": pool_data.logisticsPickup or [],
        "targetQuantity": pool_data.targetQuantity,
        "pricePerUnit": pool_data.pricePerUnit,
        "deadline": pool_data.deadline,
        "status": pool_data.status or "active",
        "updatedAt": datetime.utcnow().isoformat()
    }
    
    mock_pools[pool_index] = updated_pool
    return updated_pool

@router.delete("/pools/{pool_id}")
async def delete_pool(pool_id: str, db: Session = Depends(get_db)):
    """Delete a bulk order pool"""
    pool_index = next((i for i, p in enumerate(mock_pools) if p.get('id') == pool_id), None)
    if pool_index is None:
        raise HTTPException(status_code=404, detail="Pool not found")
    
    mock_pools.pop(pool_index)
    return {"message": "Pool deleted successfully"}

@router.post("/pools/{pool_id}/join")
async def join_pool(pool_id: str, join_data: JoinPoolData, db: Session = Depends(get_db)):
    """Join a bulk order pool"""
    pool_index = next((i for i, p in enumerate(mock_pools) if p.get('id') == pool_id), None)
    if pool_index is None:
        raise HTTPException(status_code=404, detail="Pool not found")
    
    pool = mock_pools[pool_index]
    
    # Create new participant
    participant = {
        "id": str(uuid.uuid4()),
        "name": join_data.name,
        "company": join_data.company,
        "quantity": join_data.quantity,
        "joinedDate": datetime.utcnow().isoformat(),
        "status": "pending",
        "email": join_data.email,
        "phone": join_data.phone
    }
    
    # Add participant to pool
    if "participants" not in pool:
        pool["participants"] = []
    pool["participants"].append(participant)
    
    # Update current quantity
    pool["currentQuantity"] = sum(p["quantity"] for p in pool["participants"])
    
    return {"message": "Successfully joined pool", "participant": participant}

@router.get("/pools/{pool_id}/payments", response_model=List[PoolPayment])
async def get_pool_payments(pool_id: str, db: Session = Depends(get_db)):
    """Get payments for a specific pool"""
    pool = next((p for p in mock_pools if p.get('id') == pool_id), None)
    if not pool:
        raise HTTPException(status_code=404, detail="Pool not found")
    
    # Filter payments for this pool
    pool_payments = [p for p in mock_payments if p.get('poolId') == pool_id]
    return pool_payments

@router.post("/pools/{pool_id}/payments", response_model=PoolPayment)
async def create_payment(pool_id: str, payment_data: PaymentData, db: Session = Depends(get_db)):
    """Create a payment for a pool"""
    pool = next((p for p in mock_pools if p.get('id') == pool_id), None)
    if not pool:
        raise HTTPException(status_code=404, detail="Pool not found")
    
    # Calculate amount
    amount = payment_data.quantity * pool["pricePerUnit"]
    
    new_payment = {
        "id": str(uuid.uuid4()),
        "poolId": pool_id,
        "amount": amount,
        "quantity": payment_data.quantity,
        "paymentMethod": payment_data.paymentMethod,
        "paymentStatus": "pending",
        "mnoPhone": payment_data.mnoPhone,
        "cardName": payment_data.cardName,
        "cardNumber": payment_data.cardNumber,
        "cardExpiry": payment_data.cardExpiry,
        "cardCvv": payment_data.cardCvv,
        "controlNumber": payment_data.controlNumber,
        "transactionId": None,
        "paymentReference": None,
        "createdAt": datetime.utcnow().isoformat(),
        "paidAt": None
    }
    
    mock_payments.append(new_payment)
    return new_payment

@router.post("/payments/{payment_id}/confirm")
async def confirm_payment(payment_id: str, db: Session = Depends(get_db)):
    """Confirm a payment"""
    payment_index = next((i for i, p in enumerate(mock_payments) if p.get('id') == payment_id), None)
    if payment_index is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    payment = mock_payments[payment_index]
    payment["paymentStatus"] = "completed"
    payment["paidAt"] = datetime.utcnow().isoformat()
    payment["transactionId"] = f"TXN_{uuid.uuid4().hex[:8].upper()}"
    payment["paymentReference"] = f"REF_{uuid.uuid4().hex[:8].upper()}"
    
    return {"message": "Payment confirmed", "payment": payment}

@router.get("/analytics/stats")
async def get_analytics_stats(db: Session = Depends(get_db)):
    """Get analytics statistics"""
    total_pools = db.query(PoolModel).count()
    active_pools = db.query(PoolModel).filter(PoolModel.status == 'active').count()
    total_participants = db.query(ParticipantModel).count()
    total_revenue = 0  # TODO: Calculate from payments table
    
    return {
        "totalPools": total_pools,
        "activePools": active_pools,
        "totalParticipants": total_participants,
        "totalRevenue": total_revenue
    }