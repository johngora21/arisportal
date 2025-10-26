from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

class PersonalInfoUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    nationality: Optional[str] = None
    address: Optional[str] = None
    national_id_number: Optional[str] = None
    
    @validator('first_name', 'last_name')
    def validate_names(cls, v):
        if v is not None and len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip() if v else v
    
    @validator('phone')
    def validate_phone(cls, v):
        if v is not None:
            # Remove all non-digit characters for validation
            digits_only = ''.join(filter(str.isdigit, v))
            if len(digits_only) < 10:
                raise ValueError('Phone number must be at least 10 digits')
        return v
    
    @validator('national_id_number')
    def validate_national_id(cls, v):
        if v is not None:
            # Remove all non-digit characters for validation
            digits_only = ''.join(filter(str.isdigit, v))
            if len(digits_only) < 8:
                raise ValueError('National ID must be at least 8 digits')
        return v

class BusinessInfoUpdate(BaseModel):
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    business_email: Optional[EmailStr] = None
    business_phone: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    business_address: Optional[str] = None
    website: Optional[str] = None
    registration_number: Optional[str] = None
    tax_id: Optional[str] = None
    
    @validator('business_name')
    def validate_business_name(cls, v):
        if v is not None and len(v.strip()) < 2:
            raise ValueError('Business name must be at least 2 characters long')
        return v.strip() if v else v
    
    @validator('business_phone')
    def validate_business_phone(cls, v):
        if v is not None:
            # Remove all non-digit characters for validation
            digits_only = ''.join(filter(str.isdigit, v))
            if len(digits_only) < 10:
                raise ValueError('Business phone must be at least 10 digits')
        return v
    
    @validator('website')
    def validate_website(cls, v):
        if v is not None and v.strip():
            if not v.startswith(('http://', 'https://')):
                v = 'https://' + v
        return v.strip() if v else v

class PersonalInfo(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    nationality: Optional[str] = None
    address: Optional[str] = None
    national_id_number: Optional[str] = None
    national_id_document: Optional[str] = None

class BusinessInfo(BaseModel):
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    business_email: Optional[str] = None
    business_phone: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    business_address: Optional[str] = None
    website: Optional[str] = None
    registration_number: Optional[str] = None
    tax_id: Optional[str] = None
    business_license_document: Optional[str] = None
    registration_certificate_document: Optional[str] = None
    tax_certificate_document: Optional[str] = None

class ProfileResponse(BaseModel):
    personal_info: PersonalInfo
    business_info: BusinessInfo
    profile_completed: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    full_name: str
    initials: str
    phone: Optional[str] = None
    nationality: Optional[str] = None
    address: Optional[str] = None
    national_id_number: Optional[str] = None
    national_id_document: Optional[str] = None
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    business_email: Optional[str] = None
    business_phone: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    business_address: Optional[str] = None
    website: Optional[str] = None
    registration_number: Optional[str] = None
    tax_id: Optional[str] = None
    business_license_document: Optional[str] = None
    registration_certificate_document: Optional[str] = None
    tax_certificate_document: Optional[str] = None
    status: Optional[str] = None
    email_verified: bool
    profile_completed: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class FileUploadResponse(BaseModel):
    success: bool
    message: str
    file_path: Optional[str] = None
    filename: Optional[str] = None

class ProfileStatsResponse(BaseModel):
    personal_info: dict
    business_info: dict
    documents: dict
    overall: dict
    profile_completed: bool
