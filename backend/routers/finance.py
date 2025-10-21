from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
async def get_finance_data(db: Session = Depends(get_db)):
    """Get finance data"""
    # TODO: Implement finance endpoints
    return {"message": "Finance endpoint - to be implemented"}

@router.post("/")
async def create_transaction(db: Session = Depends(get_db)):
    """Create a new transaction"""
    # TODO: Implement transaction creation
    return {"message": "Create transaction endpoint - to be implemented"}
