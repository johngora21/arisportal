from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
import logging
import uuid

from database import get_db
from models.transaction import Transaction, TransactionType, PaymentMethod

logger = logging.getLogger(__name__)
router = APIRouter()

def generate_transaction_id(db: Session) -> str:
    """Generate unique transaction ID"""
    while True:
        transaction_id = f"TXN-{str(uuid.uuid4())[:8].upper()}"
        existing = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
        if not existing:
            return transaction_id

# Create Transaction
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction_data: dict,
    db: Session = Depends(get_db)
):
    """Create a new transaction"""
    try:
        # Validate required fields
        required_fields = ["description", "type", "amount", "paymentMethod"]
        for field in required_fields:
            if not transaction_data.get(field):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Missing required field: {field}"
                )
        
        # Parse amount safely
        try:
            amount = float(transaction_data.get("amount", 0))
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid amount format"
            )
        
        # Parse transaction date safely
        transaction_date = datetime.now()
        if transaction_data.get("transactionDate"):
            try:
                transaction_date = datetime.fromisoformat(transaction_data.get("transactionDate"))
            except (ValueError, TypeError):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid transaction date format"
                )
        
        # Generate unique transaction ID
        transaction_id = generate_transaction_id(db)
        
        # Create transaction record
        transaction = Transaction(
            transaction_id=transaction_id,
            description=transaction_data.get("description"),
            type=TransactionType(transaction_data.get("type").upper()),
            category=transaction_data.get("category") or None,
            amount=amount,
            payment_method=PaymentMethod(transaction_data.get("paymentMethod").upper()),
            reference=transaction_data.get("reference") or None,
            account=transaction_data.get("account") or None,
            notes=transaction_data.get("notes") or None,
            created_by=transaction_data.get("createdBy", "system"),
            transaction_date=transaction_date
        )
        
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        
        return {
            "message": "Transaction created successfully",
            "transaction": transaction.to_dict()
        }
        
    except Exception as e:
        logger.error(f"Error creating transaction: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create transaction: {str(e)}"
        )

# Get All Transactions
@router.get("/", response_model=List[dict])
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    type_filter: Optional[TransactionType] = Query(None),
    payment_method_filter: Optional[PaymentMethod] = Query(None),
    search: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all transactions with optional filtering"""
    try:
        query = db.query(Transaction)
        
        # Apply filters
        if type_filter:
            query = query.filter(Transaction.type == type_filter)
        
        if payment_method_filter:
            query = query.filter(Transaction.payment_method == payment_method_filter)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                Transaction.description.ilike(search_term) |
                Transaction.reference.ilike(search_term) |
                Transaction.category.ilike(search_term)
            )
        
        if start_date:
            try:
                start_dt = datetime.fromisoformat(start_date)
                query = query.filter(Transaction.transaction_date >= start_dt)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid start_date format"
                )
        
        if end_date:
            try:
                end_dt = datetime.fromisoformat(end_date)
                query = query.filter(Transaction.transaction_date <= end_dt)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid end_date format"
                )
        
        # Order by transaction date (newest first)
        query = query.order_by(Transaction.transaction_date.desc())
        
        # Apply pagination
        transactions = query.offset(skip).limit(limit).all()
        
        return [transaction.to_dict() for transaction in transactions]
        
    except Exception as e:
        logger.error(f"Error fetching transactions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch transactions: {str(e)}"
        )

# Get Transaction by ID
@router.get("/{transaction_id}", response_model=dict)
async def get_transaction(
    transaction_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific transaction by ID"""
    try:
        transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
        
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )
        
        return transaction.to_dict()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching transaction {transaction_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch transaction: {str(e)}"
        )

# Update Transaction
@router.put("/{transaction_id}", response_model=dict)
async def update_transaction(
    transaction_id: str,
    transaction_data: dict,
    db: Session = Depends(get_db)
):
    """Update a transaction"""
    try:
        transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
        
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )
        
        # Update fields
        if "description" in transaction_data:
            transaction.description = transaction_data["description"]
        
        if "type" in transaction_data:
            transaction.type = TransactionType(transaction_data["type"])
        
        if "category" in transaction_data:
            transaction.category = transaction_data["category"]
        
        if "amount" in transaction_data:
            try:
                transaction.amount = float(transaction_data["amount"])
            except (ValueError, TypeError):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid amount format"
                )
        
        if "paymentMethod" in transaction_data:
            transaction.payment_method = PaymentMethod(transaction_data["paymentMethod"])
        
        if "reference" in transaction_data:
            transaction.reference = transaction_data["reference"]
        
        if "account" in transaction_data:
            transaction.account = transaction_data["account"]
        
        if "notes" in transaction_data:
            transaction.notes = transaction_data["notes"]
        
        if "transactionDate" in transaction_data:
            try:
                transaction.transaction_date = datetime.fromisoformat(transaction_data["transactionDate"])
            except (ValueError, TypeError):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid transaction date format"
                )
        
        transaction.updated_at = datetime.now()
        
        db.commit()
        db.refresh(transaction)
        
        return {
            "message": "Transaction updated successfully",
            "transaction": transaction.to_dict()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating transaction {transaction_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update transaction: {str(e)}"
        )

# Delete Transaction
@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    db: Session = Depends(get_db)
):
    """Delete a transaction"""
    try:
        transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
        
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )
        
        db.delete(transaction)
        db.commit()
        
        return {"message": "Transaction deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting transaction {transaction_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete transaction: {str(e)}"
        )

# Get Transaction Statistics
@router.get("/stats/summary")
async def get_transaction_stats(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get transaction statistics"""
    try:
        query = db.query(Transaction)
        
        # Apply date filters
        if start_date:
            try:
                start_dt = datetime.fromisoformat(start_date)
                query = query.filter(Transaction.transaction_date >= start_dt)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid start_date format"
                )
        
        if end_date:
            try:
                end_dt = datetime.fromisoformat(end_date)
                query = query.filter(Transaction.transaction_date <= end_dt)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid end_date format"
                )
        
        transactions = query.all()
        
        # Calculate statistics
        total_revenue = sum(t.amount for t in transactions if t.type == TransactionType.REVENUE)
        total_expenses = sum(t.amount for t in transactions if t.type == TransactionType.EXPENSE)
        total_assets = sum(t.amount for t in transactions if t.type == TransactionType.ASSET)
        total_liabilities = sum(t.amount for t in transactions if t.type == TransactionType.LIABILITY)
        
        net_income = total_revenue - total_expenses
        
        return {
            "total_transactions": len(transactions),
            "total_revenue": total_revenue,
            "total_expenses": total_expenses,
            "total_assets": total_assets,
            "total_liabilities": total_liabilities,
            "net_income": net_income,
            "period": {
                "start_date": start_date,
                "end_date": end_date
            }
        }
        
    except Exception as e:
        logger.error(f"Error fetching transaction stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch transaction statistics: {str(e)}"
        )
