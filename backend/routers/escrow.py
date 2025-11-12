from fastapi import APIRouter, Depends, HTTPException, Query, status, Body
from sqlalchemy.orm import Session
from database import get_db
from models.escrow import Escrow, EscrowMilestone, EscrowStatus, PaymentType
from services.escrow_smart_contract import escrow_smart_contract
from services.clickpesa_service import ClickPesaService
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import logging
import time
import random

# Lazy import of document_generator (only when needed)
def get_document_generator():
    try:
        from services.document_generator import document_generator
        return document_generator
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="Document generator service is not available. Please install reportlab: pip install reportlab"
        )

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

def _normalize_payout_details(payout_method: Optional[str], payout_details: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Validate and normalise payout details for ClickPesa payouts."""
    if not payout_method:
        return None

    method = payout_method.strip().lower()
    if method not in {"mno", "bank"}:
        raise HTTPException(status_code=400, detail=f"Unsupported payout method '{payout_method}'. Use 'mno' or 'bank'.")

    if not payout_details or not isinstance(payout_details, dict):
        raise HTTPException(status_code=400, detail="Payout details must be provided as an object.")

    normalized: Dict[str, Any] = {"method": method}

    if method == "mno":
        mno = (payout_details.get("mno") or payout_details.get("operator") or payout_details.get("provider") or "").strip().lower()
        if mno not in ClickPesaService.MNO_CHANNEL_MAP:
            raise HTTPException(status_code=400, detail=f"Unsupported mobile network '{mno}'. Supported: {', '.join(ClickPesaService.MNO_CHANNEL_MAP.keys())}")

        phone = payout_details.get("phone") or payout_details.get("phoneNumber") or payout_details.get("msisdn")
        if not phone:
            raise HTTPException(status_code=400, detail="Phone number is required for MNO payouts.")
        try:
            normalized_phone = ClickPesaService.normalize_msisdn(str(phone))
        except ValueError as phone_error:
            raise HTTPException(status_code=400, detail=f"Invalid phone number: {phone_error}")

        normalized.update(
            {
                "mno": mno,
                "phone": normalized_phone,
                "recipient_name": payout_details.get("payeeName") or payout_details.get("recipientName") or payout_details.get("accountName") or "",
            }
        )

        wallet_address = payout_details.get("walletAddress") or payout_details.get("payeeWallet")
        if wallet_address:
            normalized["walletAddress"] = wallet_address

    else:  # bank payout
        bank_key = (payout_details.get("bankKey") or payout_details.get("bank") or payout_details.get("bank_code") or "").strip().lower()
        try:
            normalized_bank_key = ClickPesaService.normalize_bank_key(bank_key)
        except ValueError as bank_error:
            raise HTTPException(status_code=400, detail=str(bank_error))

        account_number = payout_details.get("accountNumber") or payout_details.get("account")
        account_name = payout_details.get("accountName") or payout_details.get("recipientName") or payout_details.get("payeeName")

        if not account_number or not account_name:
            raise HTTPException(status_code=400, detail="Bank payouts require 'accountNumber' and 'accountName'.")

        normalized.update(
            {
                "bankKey": normalized_bank_key,
                "accountNumber": str(account_number).strip(),
                "accountName": str(account_name).strip(),
            }
        )

        branch_code = payout_details.get("branchCode") or payout_details.get("bankBranchCode")
        if branch_code:
            normalized["branchCode"] = str(branch_code).strip()

        wallet_address = payout_details.get("walletAddress") or payout_details.get("payeeWallet")
        if wallet_address:
            normalized["walletAddress"] = wallet_address

    return normalized

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
        
        # Determine release authority based on creator role
        user_role = escrow_data.get("userRole", "")
        release_authority = "PAYER"  # Default to payer controls release
        
        # If creator is PAYER, they control release
        if user_role == "PAYER":
            release_authority = "PAYER"
        # If creator is PAYEE, they need payer approval
        elif user_role == "PAYEE":
            release_authority = "PAYEE_REQUIRES_APPROVAL"
        
        # Handle documents - convert to JSON string
        documents_json = '[]'
        if escrow_data.get("documents"):
            import json
            documents_json = json.dumps(escrow_data.get("documents", []))
        
        # Optional payout configuration supplied at creation
        payout_method = escrow_data.get("payoutMethod") or escrow_data.get("payout_method")
        payout_details_payload = escrow_data.get("payoutDetails") or escrow_data.get("payout_details")
        normalized_payout_details = None
        if payout_method:
            normalized_payout_details = _normalize_payout_details(payout_method, payout_details_payload or {})

        # Generate ClickPesa control number for payment - REQUIRED
        control_number = None
        
        # Format payer phone number for ClickPesa (must be 255XXXXXXXXX format, no +, no spaces)
        formatted_payer_phone = None
        payer_phone = escrow_data.get("payerPhone")
        if payer_phone:
            try:
                formatted_payer_phone = ClickPesaService.normalize_msisdn(payer_phone)
            except ValueError as phone_error:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid payer phone number: {phone_error}"
                )
        
        # ClickPesa requires at least phone OR email for the customer
        if not formatted_payer_phone and not escrow_data.get("payerEmail"):
            raise HTTPException(
                status_code=400,
                detail="Payer phone number or email is required to generate payment control number. ClickPesa requires customer contact information."
            )
        
        try:
            # Create ClickPesa BillPay control number
            print(f"⏱️ [Escrow] Starting ClickPesa API call at {time.time()}")
            clickpesa_service = ClickPesaService()
            
            # Prepare recipient info for ClickPesa (payer is the one making payment)
            recipient = {
                'name': escrow_data.get("payerName") or 'Customer',
                'phone': formatted_payer_phone,
                'email': escrow_data.get("payerEmail"),
                'description': f"Escrow {escrow_id} - {escrow_data.get('title', 'Escrow Payment')}"
            }
            
            # Generate reference (max 20 chars for ClickPesa API requirement)
            # Use short format: ESC + last 6 digits of timestamp + 4 digit random = 13 chars
            timestamp_suffix = str(int(time.time()))[-6:]  # Last 6 digits of timestamp
            random_suffix = str(random.randint(1000, 9999))  # 4 digit random
            bill_reference = f"ESC{timestamp_suffix}{random_suffix}"  # Total: 3 + 6 + 4 = 13 chars (well under 20)
            
            print(f"📞 [Escrow] Calling ClickPesa API to create control number for escrow {escrow_id}")
            print(f"   Recipient: {recipient.get('name')}, Phone: {recipient.get('phone')}, Email: {recipient.get('email')}")
            print(f"   Amount: {total_amount} TZS")
            print(f"   Reference: {bill_reference}")
            
            # Create BillPay control number
            clickpesa_response = clickpesa_service.create_transfer(
                amount=total_amount,
                currency="TZS",
                recipient=recipient,
                reference=bill_reference
            )
            
            print(f"📦 [Escrow] ClickPesa Service Response: {clickpesa_response}")
            print(f"📦 [Escrow] ClickPesa Service Response Keys: {list(clickpesa_response.keys()) if isinstance(clickpesa_response, dict) else 'Not a dict'}")
            
            # Extract control number from response (check multiple possible fields)
            control_number = (
                clickpesa_response.get('control_number') or 
                clickpesa_response.get('billPayNumber') or 
                clickpesa_response.get('transfer_id') or
                clickpesa_response.get('response', {}).get('billPayNumber') or
                clickpesa_response.get('data', {}).get('billPayNumber') or
                clickpesa_response.get('data', {}).get('control_number')
            )
            
            print(f"🔍 [Escrow] Extracted control_number: {control_number}")
            
            if not control_number:
                error_msg = f"ClickPesa API did not return a control number. Full response: {clickpesa_response}"
                print(f"❌ [Escrow] {error_msg}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to generate payment control number: {error_msg}"
                )
            
            print(f"✅ [Escrow] ClickPesa control number generated successfully: {control_number} for escrow {escrow_id}")
            print(f"✅ [Escrow] Control number will be saved to database: {control_number}")
                
        except HTTPException:
            # Re-raise HTTP exceptions (like 400, 500, etc.)
            raise
        except Exception as clickpesa_error:
            # ClickPesa API call failed - log detailed error and fail escrow creation
            import traceback
            error_trace = traceback.format_exc()
            error_msg = f"Failed to create ClickPesa control number: {str(clickpesa_error)}"
            print(f"❌ [Escrow] {error_msg}")
            print(f"❌ [Escrow] Error trace: {error_trace}")
            
            # FAIL the escrow creation - don't create escrows without control numbers
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate payment control number from ClickPesa. Please check your ClickPesa API credentials and try again. Error: {str(clickpesa_error)}"
            )
        
        # CRITICAL VALIDATION: Ensure control_number is valid before creating escrow
        print(f"🔒 [Escrow] VALIDATING control_number before creating escrow: {control_number} (type: {type(control_number)})")
        
        if control_number is None:
            raise HTTPException(
                status_code=500,
                detail="CRITICAL ERROR: Control number is None. Escrow creation aborted. ClickPesa API did not return a control number."
            )
        
        if isinstance(control_number, str) and control_number.startswith('NOCTRL'):
            raise HTTPException(
                status_code=500,
                detail=f"CRITICAL ERROR: Invalid placeholder control number detected: {control_number}. Escrow creation aborted."
            )
        
        if not isinstance(control_number, str):
            raise HTTPException(
                status_code=500,
                detail=f"CRITICAL ERROR: Control number is not a string: {type(control_number)} = {control_number}. Escrow creation aborted."
            )
        
        if len(control_number.strip()) == 0:
            raise HTTPException(
                status_code=500,
                detail=f"CRITICAL ERROR: Control number is empty string. Escrow creation aborted."
            )
        
        print(f"🔒 [Escrow] VALIDATION PASSED: Control number is valid: '{control_number}' (length: {len(control_number)})")
        
        # Create escrow record - control_number is guaranteed to be valid at this point
        print(f"🔒 [Escrow] Creating Escrow object with control_number: '{control_number}'")
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
            documents=documents_json,
            status=EscrowStatus.PENDING,
            created_by=escrow_data.get("createdBy", "system"),
            created_by_role=user_role,
            release_authority=release_authority,
            control_number=str(control_number).strip(),
            payout_method=normalized_payout_details.get("method") if normalized_payout_details else None,
            payout_details=json.dumps(normalized_payout_details) if normalized_payout_details else None,
            payout_status="PENDING" if normalized_payout_details else None
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
        
        # Deploy blockchain smart contract for escrow
        smart_contract = escrow_smart_contract.deploy_escrow_contract(
            escrow_id=escrow_id,
            total_amount=total_amount
        )
        
        if smart_contract.get("success"):
            print(f"✅ Escrow smart contract deployed: {smart_contract.get('contract_address')}")
        
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
        
        # Check release authority
        if new_status == EscrowStatus.COMPLETED:
            if escrow.release_authority == "PAYEE_REQUIRES_APPROVAL":
                # Payee created, they can only request release
                # TODO: Send email notification to payer for approval
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Payee cannot release funds directly. Payment release request has been sent to the payer for approval."
                )
        
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

# Document Endpoints
@router.get("/contract/document")
async def get_escrow_document(
    escrow_id: Optional[str] = Query(None),
    document_type: str = Query("legal", regex="^(legal|smart_contract)$"),
    db: Session = Depends(get_db)
):
    """
    Get escrow document - either legal agreement or smart contract code
    
    Args:
        escrow_id: Optional escrow ID to get specific agreement
        document_type: 'legal' for legal document or 'smart_contract' for code
    """
    try:
        if document_type == "smart_contract":
            # Return smart contract code
            import os
            current_dir = os.path.dirname(__file__)
            contract_path = os.path.join(current_dir, '..', 'smart_contracts', 'EscrowContract.sol')
            
            with open(contract_path, 'r') as f:
                contract_code = f.read()
            
            return {
                "contract_name": "EscrowContract.sol",
                "solidity_version": "^0.8.0",
                "license": "MIT",
                "code": contract_code,
                "description": "Blockchain smart contract code for escrow management",
                "features": [
                    "Full payment escrow",
                    "Milestone-based payments",
                    "Dispute resolution",
                    "Automatic refunds",
                    "Role-based access control",
                    "Event logging"
                ]
            }
        
        else:
            # Return legal agreement
            if escrow_id:
                # Get specific escrow data
                escrow = db.query(Escrow).filter(Escrow.escrow_id == escrow_id).first()
                if not escrow:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Escrow not found"
                    )
                escrow_data = escrow.to_dict()
                
                # Ensure payment_type is a string (not enum) for document generator
                if escrow_data.get('payment_type'):
                    if hasattr(escrow_data['payment_type'], 'value'):
                        escrow_data['payment_type'] = escrow_data['payment_type'].value
                
                # Add milestones if payment type is milestone
                if escrow.payment_type == PaymentType.MILESTONE:
                    milestones = db.query(EscrowMilestone).filter(
                        EscrowMilestone.escrow_id == escrow.id
                    ).order_by(EscrowMilestone.milestone_number).all()
                    # Convert milestones to the format expected by document generator
                    escrow_data["milestones"] = [
                        {
                            "description": milestone.description,
                            "amount": milestone.amount,
                            "completion_date": milestone.completion_date.isoformat() if milestone.completion_date else None
                        }
                        for milestone in milestones
                    ]
            else:
                # Return template with placeholder data
                escrow_data = {
                    'escrow_id': 'TEMPLATE',
                    'title': 'Sample Escrow Transaction',
                    'description': 'Template document - replace with actual transaction details',
                    'payer_name': '[PAYER NAME]',
                    'payer_email': '[PAYER EMAIL]',
                    'payer_phone': '[PAYER PHONE]',
                    'payee_name': '[PAYEE NAME]',
                    'payee_email': '[PAYEE EMAIL]',
                    'payee_phone': '[PAYEE PHONE]',
                    'total_amount': 0,
                    'payment_type': 'Full Payment',
                    'release_date': None,
                    'terms': 'No additional terms',
                    'additional_notes': 'No additional notes'
                }
            
            # Use the PDF generator response
            document_generator = get_document_generator()
            return document_generator.generate_contract_response(escrow_data, "agreement")
            
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Smart contract file not found"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating document: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate document: {str(e)}"
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

@router.patch("/{escrow_id}/payout-method")
async def update_escrow_payout_method(
    escrow_id: str,
    payout_payload: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """Set or update payout configuration (bank/MNO) for an escrow."""
    try:
        escrow = db.query(Escrow).filter(Escrow.escrow_id == escrow_id).first()
        if not escrow:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Escrow not found")

        payout_method = payout_payload.get("payoutMethod") or payout_payload.get("method")
        payout_details = payout_payload.get("payoutDetails") or payout_payload.get("details")
        normalized = _normalize_payout_details(payout_method, payout_details)

        import json
        escrow.payout_method = normalized.get("method") if normalized else None
        escrow.payout_details = json.dumps(normalized) if normalized else None
        escrow.payout_status = "PENDING" if normalized else None
        escrow.payout_reference = None
        escrow.payout_provider_response = None
        escrow.updated_at = datetime.now()

        db.commit()
        db.refresh(escrow)

        return {
            "message": "Payout method updated successfully",
            "escrow": escrow.to_dict()
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating payout method for escrow {escrow_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update payout method: {str(e)}")

@router.post("/{escrow_id}/release")
async def release_escrow_funds(
    escrow_id: str,
    release_payload: Dict[str, Any] = Body(default={}),
    db: Session = Depends(get_db)
):
    """Release escrow funds via ClickPesa payout and record on blockchain."""
    try:
        escrow = db.query(Escrow).filter(Escrow.escrow_id == escrow_id).first()
        if not escrow:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Escrow not found")

        if escrow.status == EscrowStatus.COMPLETED:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Escrow already completed")

        import json

        existing_details = None
        if escrow.payout_details:
            try:
                existing_details = json.loads(escrow.payout_details)
            except Exception:
                existing_details = escrow.payout_details

        payout_method = release_payload.get("payoutMethod") or release_payload.get("method") or escrow.payout_method
        provided_details = release_payload.get("payoutDetails") or release_payload.get("details") or {}

        combined_details: Dict[str, Any] = {}
        if isinstance(existing_details, dict):
            combined_details.update(existing_details)
        if isinstance(provided_details, dict):
            combined_details.update(provided_details)

        normalized_details = _normalize_payout_details(payout_method, combined_details)
        if not normalized_details:
            raise HTTPException(status_code=400, detail="Payout configuration is required before releasing escrow funds.")

        clickpesa_service = ClickPesaService()
        payout_reference = (
            release_payload.get("payoutReference")
            or escrow.payout_reference
            or f"ESC{escrow.id}{int(time.time())}{random.randint(1000, 9999)}"
        )

        provider_response: Dict[str, Any] = {}
        provider_status: str = "PROCESSING"

        try:
            if normalized_details["method"] == "mno":
                provider_response = clickpesa_service.create_mobile_money_payout(
                    amount=escrow.total_amount,
                    currency="TZS",
                    phone_number=normalized_details["phone"],
                    order_reference=payout_reference,
                )
                provider_status = (provider_response.get("status") or "PROCESSING").upper()
                payout_reference = (
                    provider_response.get("id")
                    or provider_response.get("orderReference")
                    or provider_response.get("reference")
                    or payout_reference
                )

                if provider_status not in {"SUCCESS", "FAILED", "REVERSED"} and payout_reference:
                    poll_result = clickpesa_service.poll_mobile_money_payout_success(
                        payout_reference,
                        max_attempts=5,
                        interval_seconds=2.5
                    )
                    provider_response["poll_result"] = poll_result
                    polled_status = (poll_result.get("status") or "").upper()
                    if polled_status:
                        provider_status = polled_status
            else:
                provider_response = clickpesa_service.create_bank_payout(
                    amount=escrow.total_amount,
                    currency="TZS",
                    bank_key=normalized_details["bankKey"],
                    account_number=normalized_details["accountNumber"],
                    account_name=normalized_details["accountName"],
                    branch_code=normalized_details.get("branchCode"),
                    order_reference=payout_reference,
                    description=f"Escrow {escrow.escrow_id} release"
                )
                provider_status = (provider_response.get("status") or "PROCESSING").upper()
                payout_reference = (
                    provider_response.get("id")
                    or provider_response.get("orderReference")
                    or provider_response.get("reference")
                    or payout_reference
                )
        except HTTPException:
            raise
        except Exception as payout_error:
            raise HTTPException(status_code=502, detail=f"ClickPesa payout failed: {payout_error}")

        web3_result: Dict[str, Any] = {"success": False, "error": "web3 not configured"}
        payee_wallet = normalized_details.get("walletAddress")
        try:
            if payee_wallet:
                web3_result = escrow_smart_contract.release_payment(
                    escrow_id=escrow.escrow_id,
                    amount=escrow.total_amount,
                    payee_address=payee_wallet
                )
            else:
                web3_result = escrow_smart_contract.release_payment(
                    escrow_id=escrow.escrow_id,
                    amount=escrow.total_amount,
                    payee_address=""
                )
        except Exception as web3_error:
            web3_result = {"success": False, "error": str(web3_error)}

        escrow.payout_method = normalized_details["method"]
        escrow.payout_details = json.dumps(normalized_details)
        escrow.payout_status = provider_status
        escrow.payout_reference = payout_reference
        escrow.payout_provider_response = json.dumps(provider_response)
        escrow.updated_at = datetime.now()

        if web3_result.get("success"):
            escrow.released_via_web3 = True
            escrow.release_transaction_hash = web3_result.get("transaction_hash")
            escrow.release_block_number = web3_result.get("block_number")
        else:
            escrow.released_via_web3 = False

        if provider_status == "SUCCESS":
            escrow.status = EscrowStatus.COMPLETED
            escrow.completed_at = datetime.now()
        elif provider_status in {"FAILED", "REVERSED"}:
            escrow.status = EscrowStatus.ACTIVE
        else:
            if escrow.status == EscrowStatus.PENDING:
                escrow.status = EscrowStatus.ACTIVE

        db.commit()
        db.refresh(escrow)

        return {
            "message": "Escrow release initiated",
            "payout_status": provider_status,
            "escrow": escrow.to_dict(),
            "web3": web3_result
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error releasing escrow {escrow_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to release escrow: {str(e)}")
