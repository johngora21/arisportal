from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
import os
from datetime import datetime

from database import get_db
from models.user import UserProfile, UserStatus
from schemas.profile import (
    PersonalInfoUpdate, BusinessInfoUpdate, ProfileResponse, PersonalInfo, BusinessInfo
)

router = APIRouter()
security = HTTPBearer()

# Helper function to get current user (similar to auth.py)
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Get current user from JWT token"""
    try:
        import jwt
        JWT_SECRET_KEY = "jwt-secret-string"
        ALGORITHM = "HS256"
        
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user = db.query(UserProfile).filter(UserProfile.id == int(user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if user.status != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is not active"
            )
        
        return user
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/profile", response_model=ProfileResponse)
async def get_profile(
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user profile"""
    try:
        user = current_user
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        personal_info = PersonalInfo(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            phone=user.phone,
            nationality=user.nationality,
            address=user.address,
            national_id_number=user.national_id_number,
            national_id_document=user.national_id_document
        )
        
        business_info = BusinessInfo(
            business_name=user.business_name,
            business_type=user.business_type,
            business_email=user.business_email,
            business_phone=user.business_phone,
            country=user.country,
            city=user.city,
            business_address=user.business_address,
            website=user.website,
            registration_number=user.registration_number,
            tax_id=user.tax_id,
            business_license_document=user.business_license_document,
            registration_certificate_document=user.registration_certificate_document,
            tax_certificate_document=user.tax_certificate_document
        )
        
        return ProfileResponse(
            personal_info=personal_info,
            business_info=business_info,
            profile_completed=user.profile_completed,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/profile/personal")
async def update_personal_info(
    personal_data: PersonalInfoUpdate,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update personal information"""
    try:
        user = current_user
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if personal_data.first_name is not None:
            user.first_name = personal_data.first_name
        if personal_data.last_name is not None:
            user.last_name = personal_data.last_name
        if personal_data.email is not None:
            user.email = personal_data.email
        if personal_data.phone is not None:
            user.phone = personal_data.phone
        if personal_data.nationality is not None:
            user.nationality = personal_data.nationality
        if personal_data.address is not None:
            user.address = personal_data.address
        if personal_data.national_id_number is not None:
            user.national_id_number = personal_data.national_id_number
        
        db.commit()
        db.refresh(user)
        
        return {"message": "Personal information updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/profile/business")
async def update_business_info(
    business_data: BusinessInfoUpdate,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update business information"""
    try:
        user = current_user
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if business_data.business_name is not None:
            user.business_name = business_data.business_name
        if business_data.business_type is not None:
            user.business_type = business_data.business_type
        if business_data.business_email is not None:
            user.business_email = business_data.business_email
        if business_data.business_phone is not None:
            user.business_phone = business_data.business_phone
        if business_data.country is not None:
            user.country = business_data.country
        if business_data.city is not None:
            user.city = business_data.city
        if business_data.business_address is not None:
            user.business_address = business_data.business_address
        if business_data.website is not None:
            user.website = business_data.website
        if business_data.registration_number is not None:
            user.registration_number = business_data.registration_number
        if business_data.tax_id is not None:
            user.tax_id = business_data.tax_id
        
        db.commit()
        db.refresh(user)
        
        return {"message": "Business information updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/profile/upload/national-id")
async def upload_national_id(
    file: UploadFile = File(...), 
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload national ID document"""
    return await upload_document(file, "national_id", current_user, db)

@router.post("/profile/upload/business-license")
async def upload_business_license(
    file: UploadFile = File(...),
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload business license document"""
    return await upload_document(file, "business_license", current_user, db)

@router.post("/profile/upload/registration-certificate")
async def upload_registration_certificate(
    file: UploadFile = File(...),
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload registration certificate document"""
    return await upload_document(file, "registration_certificate", current_user, db)

@router.post("/profile/upload/tax-certificate")
async def upload_tax_certificate(
    file: UploadFile = File(...),
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload tax certificate document"""
    return await upload_document(file, "tax_certificate", current_user, db)

async def upload_document(file: UploadFile, document_type: str, current_user: UserProfile, db: Session):
    """Helper function to handle document uploads"""
    try:
        user = current_user
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Create uploads directory if it doesn't exist
        upload_dir = f"uploads/profile_documents/{user.id}"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        # Get file extension from original filename
        file_extension = os.path.splitext(file.filename)[1] if '.' in file.filename else '.pdf'
        filename = f"{document_type}_{timestamp}{file_extension}"
        filepath = os.path.join(upload_dir, filename)
        
        with open(filepath, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Update user record
        relative_path = f"profile_documents/{user.id}/{filename}"
        if document_type == "national_id":
            user.national_id_document = relative_path
        elif document_type == "business_license":
            user.business_license_document = relative_path
        elif document_type == "registration_certificate":
            user.registration_certificate_document = relative_path
        elif document_type == "tax_certificate":
            user.tax_certificate_document = relative_path
        
        db.commit()
        
        return {"message": "Document uploaded successfully", "file_path": relative_path}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/profile/stats")
async def get_profile_stats(
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get profile completion stats"""
    try:
        user = current_user
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Calculate completion stats
        personal_fields = 7
        business_fields = 10
        document_fields = 4
        
        personal_completed = sum([
            1 if user.first_name else 0,
            1 if user.last_name else 0,
            1 if user.email else 0,
            1 if user.phone else 0,
            1 if user.nationality else 0,
            1 if user.address else 0,
            1 if user.national_id_number else 0
        ])
        
        business_completed = sum([
            1 if user.business_name else 0,
            1 if user.business_type else 0,
            1 if user.business_email else 0,
            1 if user.business_phone else 0,
            1 if user.country else 0,
            1 if user.city else 0,
            1 if user.business_address else 0,
            1 if user.website else 0,
            1 if user.registration_number else 0,
            1 if user.tax_id else 0
        ])
        
        documents_completed = sum([
            1 if user.national_id_document else 0,
            1 if user.business_license_document else 0,
            1 if user.registration_certificate_document else 0,
            1 if user.tax_certificate_document else 0
        ])
        
        total_fields = personal_fields + business_fields + document_fields
        total_completed = personal_completed + business_completed + documents_completed
        
        return {
            "personal_info": {
                "completed": personal_completed,
                "total": personal_fields,
                "percentage": round((personal_completed / personal_fields) * 100, 1)
            },
            "business_info": {
                "completed": business_completed,
                "total": business_fields,
                "percentage": round((business_completed / business_fields) * 100, 1)
            },
            "documents": {
                "completed": documents_completed,
                "total": document_fields,
                "percentage": round((documents_completed / document_fields) * 100, 1)
            },
            "overall": {
                "completed": total_completed,
                "total": total_fields,
                "percentage": round((total_completed / total_fields) * 100, 1)
            },
            "profile_completed": user.profile_completed
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 