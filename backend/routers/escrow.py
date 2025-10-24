from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from database import get_db
from models.escrow import Escrow, EscrowMilestone, EscrowStatus, PaymentType
from typing import List, Optional
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Helper function to generate escrow ID
def generate_escrow_id(db: Session) -> str:
    """Generate a unique escrow ID in ESC-XXX format"""
    last_escrow = db.query(Escrow).order_by(Escrow.id.desc()).first()
    if last_escrow:
        # Extract number from existing escrow_id and increment
        try:
            last_number = int(last_escrow.escrow_id.split('-')[1])
            new_number = last_number + 1
        except (IndexError, ValueError):
            new_number = 1
    else:
        new_number = 1
    
    return f"ESC-{new_number:03d}"

# Create Escrow
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_escrow(
    escrow_data: dict,
    db: Session = Depends(get_db)
):
    """Create a new escrow account"""
    try:
        # Generate unique escrow ID
        escrow_id = generate_escrow_id(db)
        
        # Validate required fields
        required_fields = ["title", "payerName", "payerEmail", "payerPhone", "payeeName", "payeeEmail", "payeePhone", "totalAmount"]
        for field in required_fields:
            if not escrow_data.get(field):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Missing required field: {field}"
                )
        
        # Parse total amount safely
        try:
            total_amount = float(escrow_data.get("totalAmount", 0))
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid total amount format"
            )
        
        # Parse release date safely
        release_date = None
        if escrow_data.get("releaseDate"):
            try:
                release_date = datetime.fromisoformat(escrow_data.get("releaseDate"))
            except (ValueError, TypeError):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid release date format"
                )
        
        # Create escrow record
        escrow = Escrow(
            escrow_id=escrow_id,
            title=escrow_data.get("title"),
            description=escrow_data.get("description"),
            payer_name=escrow_data.get("payerName"),
            payer_email=escrow_data.get("payerEmail"),
            payer_phone=escrow_data.get("payerPhone"),
            payee_name=escrow_data.get("payeeName"),
            payee_email=escrow_data.get("payeeEmail"),
            payee_phone=escrow_data.get("payeePhone"),
            total_amount=total_amount,
            payment_type=PaymentType(escrow_data.get("paymentType", "FULL")),
            release_date=release_date,
            terms=escrow_data.get("terms"),
            additional_notes=escrow_data.get("additionalNotes"),
            status=EscrowStatus.PENDING,
            created_by=escrow_data.get("createdBy", "system")
        )
        
        db.add(escrow)
        db.commit()
        db.refresh(escrow)
        
        # Handle milestones if payment type is milestone
        if escrow_data.get("paymentType") == "MILESTONE" and escrow_data.get("milestones"):
            milestones_data = escrow_data.get("milestones", [])
            for i, milestone in enumerate(milestones_data, 1):
                milestone_record = EscrowMilestone(
                    escrow_id=escrow.id,
                    milestone_number=i,
                    description=milestone.get("description"),
                    amount=float(milestone.get("amount", 0)),
                    completion_date=datetime.fromisoformat(milestone.get("completionDate"))
                )
                db.add(milestone_record)
            
            db.commit()
        
        return {
            "message": "Escrow created successfully",
            "escrow": escrow.to_dict()
        }
        
    except Exception as e:
        logger.error(f"Error creating escrow: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create escrow: {str(e)}"
        )

# Get All Escrows
@router.get("/", response_model=List[dict])
async def get_escrows(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status_filter: Optional[EscrowStatus] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all escrow accounts with optional filtering"""
    try:
        query = db.query(Escrow)
        
        # Apply status filter
        if status_filter:
            query = query.filter(Escrow.status == status_filter)
        
        # Apply search filter
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                Escrow.title.ilike(search_term) |
                Escrow.payer_name.ilike(search_term) |
                Escrow.payee_name.ilike(search_term) |
                Escrow.escrow_id.ilike(search_term)
            )
        
        # Apply pagination
        escrows = query.offset(skip).limit(limit).all()
        
        # Convert to dictionaries and include milestones for milestone payments
        result = []
        for escrow in escrows:
            escrow_dict = escrow.to_dict()
            
            # Add milestones if payment type is milestone
            if escrow.payment_type == PaymentType.MILESTONE:
                milestones = db.query(EscrowMilestone).filter(
                    EscrowMilestone.escrow_id == escrow.id
                ).order_by(EscrowMilestone.milestone_number).all()
                escrow_dict["milestones"] = [milestone.to_dict() for milestone in milestones]
            
            result.append(escrow_dict)
        
        return result
        
    except Exception as e:
        logger.error(f"Error fetching escrows: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch escrows: {str(e)}"
        )

# Get Single Escrow
@router.get("/{escrow_id}", response_model=dict)
async def get_escrow(
    escrow_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific escrow account by ID"""
    try:
        escrow = db.query(Escrow).filter(Escrow.escrow_id == escrow_id).first()
        
        if not escrow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Escrow not found"
            )
        
        escrow_dict = escrow.to_dict()
        
        # Add milestones if payment type is milestone
        if escrow.payment_type == PaymentType.MILESTONE:
            milestones = db.query(EscrowMilestone).filter(
                EscrowMilestone.escrow_id == escrow.id
            ).order_by(EscrowMilestone.milestone_number).all()
            escrow_dict["milestones"] = [milestone.to_dict() for milestone in milestones]
        
        return escrow_dict
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching escrow {escrow_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch escrow: {str(e)}"
        )

# Update Escrow Status
@router.patch("/{escrow_id}/status")
async def update_escrow_status(
    escrow_id: str,
    status_data: dict,
    db: Session = Depends(get_db)
):
    """Update escrow status"""
    try:
        escrow = db.query(Escrow).filter(Escrow.escrow_id == escrow_id).first()
        
        if not escrow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Escrow not found"
            )
        
        new_status = EscrowStatus(status_data.get("status"))
        escrow.status = new_status
        
        # Update timestamps based on status
        if new_status == EscrowStatus.COMPLETED:
            escrow.completed_at = datetime.now()
        elif new_status == EscrowStatus.CANCELLED:
            escrow.cancelled_at = datetime.now()
            escrow.cancelled_reason = status_data.get("reason")
        
        escrow.updated_at = datetime.now()
        
        db.commit()
        db.refresh(escrow)
        
        return {
            "message": "Escrow status updated successfully",
            "escrow": escrow.to_dict()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating escrow status {escrow_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update escrow status: {str(e)}"
        )

# Update Escrow
@router.put("/{escrow_id}")
async def update_escrow(
    escrow_id: str,
    escrow_data: dict,
    db: Session = Depends(get_db)
):
    """Update escrow account details"""
    try:
        escrow = db.query(Escrow).filter(Escrow.escrow_id == escrow_id).first()
        
        if not escrow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Escrow not found"
            )
        
        # Update fields
        if "title" in escrow_data:
            escrow.title = escrow_data["title"]
        if "description" in escrow_data:
            escrow.description = escrow_data["description"]
        if "payerName" in escrow_data:
            escrow.payer_name = escrow_data["payerName"]
        if "payerEmail" in escrow_data:
            escrow.payer_email = escrow_data["payerEmail"]
        if "payerPhone" in escrow_data:
            escrow.payer_phone = escrow_data["payerPhone"]
        if "payeeName" in escrow_data:
            escrow.payee_name = escrow_data["payeeName"]
        if "payeeEmail" in escrow_data:
            escrow.payee_email = escrow_data["payeeEmail"]
        if "payeePhone" in escrow_data:
            escrow.payee_phone = escrow_data["payeePhone"]
        if "totalAmount" in escrow_data:
            escrow.total_amount = float(escrow_data["totalAmount"])
        if "paymentType" in escrow_data:
            escrow.payment_type = PaymentType(escrow_data["paymentType"])
        if "releaseDate" in escrow_data:
            escrow.release_date = datetime.fromisoformat(escrow_data["releaseDate"]) if escrow_data["releaseDate"] else None
        if "terms" in escrow_data:
            escrow.terms = escrow_data["terms"]
        if "additionalNotes" in escrow_data:
            escrow.additional_notes = escrow_data["additionalNotes"]
        
        escrow.updated_at = datetime.now()
        
        db.commit()
        db.refresh(escrow)
        
        return {
            "message": "Escrow updated successfully",
            "escrow": escrow.to_dict()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating escrow {escrow_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update escrow: {str(e)}"
        )

# Delete Escrow
@router.delete("/{escrow_id}")
async def delete_escrow(
    escrow_id: str,
    db: Session = Depends(get_db)
):
    """Delete an escrow account"""
    try:
        escrow = db.query(Escrow).filter(Escrow.escrow_id == escrow_id).first()
        
        if not escrow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Escrow not found"
            )
        
        # Delete associated milestones first
        db.query(EscrowMilestone).filter(EscrowMilestone.escrow_id == escrow.id).delete()
        
        # Delete escrow
        db.delete(escrow)
        db.commit()
        
        return {
            "message": "Escrow deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting escrow {escrow_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete escrow: {str(e)}"
        )

# Get Escrow Statistics
@router.get("/stats/summary")
async def get_escrow_stats(db: Session = Depends(get_db)):
    """Get escrow statistics summary"""
    try:
        total_escrows = db.query(Escrow).count()
        active_escrows = db.query(Escrow).filter(Escrow.status == EscrowStatus.ACTIVE).count()
        pending_escrows = db.query(Escrow).filter(Escrow.status == EscrowStatus.PENDING).count()
        completed_escrows = db.query(Escrow).filter(Escrow.status == EscrowStatus.COMPLETED).count()
        cancelled_escrows = db.query(Escrow).filter(Escrow.status == EscrowStatus.CANCELLED).count()
        
        # Calculate total amount in escrow
        total_amount_result = db.query(Escrow.total_amount).filter(
            Escrow.status.in_([EscrowStatus.ACTIVE, EscrowStatus.PENDING])
        ).all()
        total_amount = sum([row[0] for row in total_amount_result]) if total_amount_result else 0
        
        return {
            "total_escrows": total_escrows,
            "active_escrows": active_escrows,
            "pending_escrows": pending_escrows,
            "completed_escrows": completed_escrows,
            "cancelled_escrows": cancelled_escrows,
            "total_amount_in_escrow": total_amount
        }
        
    except Exception as e:
        logger.error(f"Error fetching escrow stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch escrow statistics: {str(e)}"
        )

# Milestone Management Endpoints

# Complete Milestone
@router.patch("/{escrow_id}/milestones/{milestone_id}/complete")
async def complete_milestone(
    escrow_id: str,
    milestone_id: int,
    db: Session = Depends(get_db)
):
    """Mark a milestone as completed"""
    try:
        # Verify escrow exists
        escrow = db.query(Escrow).filter(Escrow.escrow_id == escrow_id).first()
        if not escrow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Escrow not found"
            )
        
        # Find milestone
        milestone = db.query(EscrowMilestone).filter(
            EscrowMilestone.id == milestone_id,
            EscrowMilestone.escrow_id == escrow.id
        ).first()
        
        if not milestone:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Milestone not found"
            )
        
        milestone.status = "completed"
        milestone.completed_at = datetime.now()
        milestone.updated_at = datetime.now()
        
        db.commit()
        db.refresh(milestone)
        
        return {
            "message": "Milestone completed successfully",
            "milestone": milestone.to_dict()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error completing milestone {milestone_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete milestone: {str(e)}"
        )
