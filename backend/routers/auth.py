from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel, EmailStr
from typing import Optional
import jwt
from datetime import datetime, timedelta
from database import get_db
from models.user import UserProfile as UserProfileModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = "your-secret-key-here"
JWT_SECRET_KEY = "jwt-secret-string"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str
    # Optional profile fields captured during registration
    phone: Optional[str] = None
    nationality: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    business_email: Optional[str] = None
    business_phone: Optional[str] = None
    business_address: Optional[str] = None
    website: Optional[str] = None
    registration_number: Optional[str] = None
    tax_id: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# JWT Token functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Password hashing
def hash_password(password: str) -> str:
    import bcrypt
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    import bcrypt
    try:
        if not password or not hashed_password:
            logger.warning("Password or hashed_password is empty")
            return False
        
        # Ensure hashed_password is bytes
        if isinstance(hashed_password, str):
            hashed_password_bytes = hashed_password.encode('utf-8')
        else:
            hashed_password_bytes = hashed_password
        
        # Check if it's a valid bcrypt hash
        if not hashed_password_bytes.startswith(b'$2b$') and not hashed_password_bytes.startswith(b'$2a$') and not hashed_password_bytes.startswith(b'$2y$'):
            logger.error(f"Invalid bcrypt hash format: {hashed_password[:20] if len(hashed_password) > 20 else hashed_password}")
            return False
        
        result = bcrypt.checkpw(password.encode('utf-8'), hashed_password_bytes)
        return result
    except Exception as e:
        logger.error(f"Error in verify_password: {str(e)}", exc_info=True)
        return False

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        # Log received data for debugging
        logger.info(f"Registration request received for: {user_data.email}")
        logger.info(f"Received data - phone: {user_data.phone}, country: {user_data.country}, city: {user_data.city}")
        logger.info(f"Received data - address: {user_data.address}, business_name: {user_data.business_name}, business_type: {user_data.business_type}")
        
        # Check if user already exists
        existing_user = db.query(UserProfileModel).filter(UserProfileModel.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already exists"
            )
        
        # Create new user - split full_name into first_name and last_name
        name_parts = user_data.full_name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""
        
        # Convert empty strings to None to avoid saving empty strings
        def clean_value(value):
            return value if value and value.strip() else None
        
        user = UserProfileModel(
            email=user_data.email,
            first_name=first_name,
            last_name=last_name,
            password_hash=hash_password(user_data.password),
            phone=clean_value(user_data.phone),
            nationality=clean_value(user_data.nationality),
            address=clean_value(user_data.address),
            country=clean_value(user_data.country),
            city=clean_value(user_data.city),
            business_name=clean_value(user_data.business_name),
            business_type=clean_value(user_data.business_type),
            business_email=clean_value(user_data.business_email),
            business_phone=clean_value(user_data.business_phone),
            business_address=clean_value(user_data.business_address),
            website=clean_value(user_data.website),
            registration_number=clean_value(user_data.registration_number),
            tax_id=clean_value(user_data.tax_id),
        )
        
        logger.info(f"Creating user with - phone: {user.phone}, country: {user.country}, city: {user.city}")
        logger.info(f"Creating user with - address: {user.address}, business_name: {user.business_name}, business_type: {user.business_type}")
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        logger.info(f"User created successfully: ID={user.id}, email={user.email}")
        logger.info(f"Saved data - phone: {user.phone}, country: {user.country}, city: {user.city}")
        logger.info(f"Saved data - address: {user.address}, business_name: {user.business_name}, business_type: {user.business_type}")
        
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role="user",
            is_active=True,
            created_at=user.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    try:
        logger.info(f"Login attempt for email: {user_data.email}")
        
        # Use case-insensitive email lookup
        user = db.query(UserProfileModel).filter(
            func.lower(UserProfileModel.email) == func.lower(user_data.email)
        ).first()
        
        if not user:
            logger.warning(f"User not found for email: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        logger.info(f"User found: id={user.id}, email={user.email}, has_password_hash={bool(user.password_hash)}")
        
        # Check if password_hash exists
        if not user.password_hash:
            logger.error(f"User {user.id} has no password_hash")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Verify password
        try:
            password_valid = verify_password(user_data.password, user.password_hash)
            logger.info(f"Password verification result: {password_valid}")
        except Exception as verify_error:
            logger.error(f"Error verifying password: {str(verify_error)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        if not password_valid:
            logger.warning(f"Invalid password for user: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        if user.status and user.status.value != 'active':
            logger.warning(f"Account deactivated for user: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id), "role": "user"}, 
            expires_delta=access_token_expires
        )
        
        logger.info(f"Login successful for user: {user.email}")
        return Token(access_token=access_token, token_type="bearer")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging in user: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current user information"""
    try:
        user = db.query(UserProfileModel).filter(UserProfileModel.id == int(current_user_id)).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role="user",
            is_active=True,
            created_at=user.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: UserProfileUpdate, 
    current_user_id: str = Depends(verify_token), 
    db: Session = Depends(get_db)
):
    """Update user profile"""
    try:
        user = db.query(UserProfileModel).filter(UserProfileModel.id == int(current_user_id)).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if profile_data.full_name is not None:
            # Split full_name into first_name and last_name
            name_parts = profile_data.full_name.split(' ', 1)
            user.first_name = name_parts[0]
            user.last_name = name_parts[1] if len(name_parts) > 1 else ""
        
        if profile_data.email is not None and profile_data.email != user.email:
            # Check if new email already exists
            existing_user = db.query(UserProfileModel).filter(UserProfileModel.email == profile_data.email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already exists"
                )
            user.email = profile_data.email
        
        db.commit()
        db.refresh(user)
        
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role="user",
            is_active=True,
            created_at=user.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout():
    """Logout user (client should remove token)"""
    return {"message": "Logout successful"}

