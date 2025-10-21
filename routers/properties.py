from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
async def get_properties(db: Session = Depends(get_db)):
    """Get all properties"""
    # TODO: Implement property endpoints
    return {"message": "Properties endpoint - to be implemented"}

@router.post("/")
async def create_property(db: Session = Depends(get_db)):
    """Create a new property"""
    # TODO: Implement property creation
    return {"message": "Create property endpoint - to be implemented"}
