from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from database import get_db
from models.crm import Contact, Deal, ContactCreate, ContactUpdate, DealCreate, DealUpdate
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Contact endpoints
@router.get("/contacts", response_model=List[dict])
def get_contacts(db: Session = Depends(get_db)):
    """Get all contacts"""
    try:
        contacts = db.query(Contact).all()
        return [contact.to_dict() for contact in contacts]
    except Exception as e:
        logger.error(f"Error fetching contacts: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/contacts", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    """Create a new contact"""
    try:
        db_contact = Contact(**contact.dict())
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return {"contact": db_contact.to_dict()}
    except Exception as e:
        logger.error(f"Error creating contact: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/contacts/{contact_id}", response_model=dict)
def update_contact(contact_id: int, contact: ContactUpdate, db: Session = Depends(get_db)):
    """Update a contact"""
    try:
        db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
        if not db_contact:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
        
        for field, value in contact.dict(exclude_unset=True).items():
            setattr(db_contact, field, value)
        
        db.commit()
        db.refresh(db_contact)
        return {"contact": db_contact.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating contact: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    """Delete a contact and all associated deals"""
    try:
        # First, delete all associated deals
        db.execute(text("DELETE FROM deal WHERE contact_id = :contact_id"), {"contact_id": contact_id})
        
        # Then delete the contact
        db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
        if not db_contact:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
        
        db.delete(db_contact)
        db.commit()
        return {"message": "Contact and all associated deals deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting contact: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# Deal endpoints
@router.get("/deals", response_model=List[dict])
def get_deals(db: Session = Depends(get_db)):
    """Get all deals"""
    try:
        deals = db.query(Deal).all()
        return [deal.to_dict() for deal in deals]
    except Exception as e:
        logger.error(f"Error fetching deals: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/deals", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_deal(deal: DealCreate, db: Session = Depends(get_db)):
    """Create a new deal"""
    try:
        db_deal = Deal(**deal.dict())
        db.add(db_deal)
        db.commit()
        db.refresh(db_deal)
        return {"deal": db_deal.to_dict()}
    except Exception as e:
        logger.error(f"Error creating deal: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/deals/{deal_id}", response_model=dict)
def update_deal(deal_id: int, deal: DealUpdate, db: Session = Depends(get_db)):
    """Update a deal"""
    try:
        db_deal = db.query(Deal).filter(Deal.id == deal_id).first()
        if not db_deal:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")
        
        for field, value in deal.dict(exclude_unset=True).items():
            setattr(db_deal, field, value)
        
        db.commit()
        db.refresh(db_deal)
        return {"deal": db_deal.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating deal: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/deals/{deal_id}")
def delete_deal(deal_id: int, db: Session = Depends(get_db)):
    """Delete a deal"""
    try:
        db_deal = db.query(Deal).filter(Deal.id == deal_id).first()
        if not db_deal:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")
        
        db.delete(db_deal)
        db.commit()
        return {"message": "Deal deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting deal: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
