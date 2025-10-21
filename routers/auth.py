from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import jwt
from datetime import datetime, timedelta
from database import get_db
from models.user import User
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

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
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
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already exists"
            )
        
        # Create new user
        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            role=user_data.role,
            password_hash=hash_password(user_data.password)
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            is_active=user.is_active,
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
        user = db.query(User).filter(User.email == user_data.email).first()
        
        if not user or not verify_password(user_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id), "role": user.role}, 
            expires_delta=access_token_expires
        )
        
        return Token(access_token=access_token, token_type="bearer")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging in user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current user information"""
    try:
        user = db.query(User).filter(User.id == int(current_user_id)).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            is_active=user.is_active,
            created_at=user.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: UserProfile, 
    current_user_id: str = Depends(verify_token), 
    db: Session = Depends(get_db)
):
    """Update user profile"""
    try:
        user = db.query(User).filter(User.id == int(current_user_id)).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if profile_data.full_name is not None:
            user.full_name = profile_data.full_name
        
        if profile_data.email is not None and profile_data.email != user.email:
            # Check if new email already exists
            existing_user = db.query(User).filter(User.email == profile_data.email).first()
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
            role=user.role,
            is_active=user.is_active,
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
