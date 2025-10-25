from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date, timedelta
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

# Financial Statements Endpoints

@router.get("/statements/income")
async def get_income_statement(
    month: str = Query(..., description="Month in YYYY-MM format"),
    db: Session = Depends(get_db)
):
    """Get Income Statement for a specific month"""
    try:
        # Parse month and get date range
        year, month_num = month.split('-')
        start_date = datetime(int(year), int(month_num), 1)
        
        # Get last day of month
        if int(month_num) == 12:
            end_date = datetime(int(year) + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = datetime(int(year), int(month_num) + 1, 1) - timedelta(days=1)
        
        # Get transactions for the month
        transactions = db.query(Transaction).filter(
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date <= end_date
        ).all()
        
        # Calculate income statement components
        revenue = sum(t.amount for t in transactions if t.type == TransactionType.REVENUE)
        
        # Categorize expenses
        cost_of_goods_sold = 0
        operating_expenses = 0
        interest_expense = 0
        income_tax = 0
        
        for t in transactions:
            if t.type == TransactionType.EXPENSE:
                category = (t.category or '').lower()
                if any(keyword in category for keyword in ['cost', 'goods', 'inventory', 'materials']):
                    cost_of_goods_sold += t.amount
                elif any(keyword in category for keyword in ['interest']):
                    interest_expense += t.amount
                elif any(keyword in category for keyword in ['tax']):
                    income_tax += t.amount
                else:
                    operating_expenses += t.amount
        
        gross_profit = revenue - cost_of_goods_sold
        operating_income = gross_profit - operating_expenses
        net_income = operating_income - interest_expense - income_tax
        
        return {
            "period": month,
            "revenue": revenue,
            "cost_of_goods_sold": cost_of_goods_sold,
            "gross_profit": gross_profit,
            "operating_expenses": operating_expenses,
            "operating_income": operating_income,
            "interest_expense": interest_expense,
            "income_tax": income_tax,
            "net_income": net_income,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating income statement: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate income statement: {str(e)}"
        )

@router.get("/statements/balance-sheet")
async def get_balance_sheet(
    month: str = Query(..., description="Month in YYYY-MM format"),
    db: Session = Depends(get_db)
):
    """Get Balance Sheet as of end of specific month"""
    try:
        # Parse month and get date range (all transactions up to end of month)
        year, month_num = month.split('-')
        
        # Get last day of month
        if int(month_num) == 12:
            end_date = datetime(int(year) + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = datetime(int(year), int(month_num) + 1, 1) - timedelta(days=1)
        
        # Get all transactions up to end of month
        transactions = db.query(Transaction).filter(
            Transaction.transaction_date <= end_date
        ).all()
        
        # Calculate assets
        current_assets = 0
        fixed_assets = 0
        
        for t in transactions:
            if t.type == TransactionType.ASSET:
                category = (t.category or '').lower()
                if any(keyword in category for keyword in ['cash', 'bank', 'receivable', 'inventory', 'prepaid']):
                    current_assets += t.amount
                else:
                    fixed_assets += t.amount
        
        total_assets = current_assets + fixed_assets
        
        # Calculate liabilities
        current_liabilities = 0
        long_term_liabilities = 0
        
        for t in transactions:
            if t.type == TransactionType.LIABILITY:
                category = (t.category or '').lower()
                if any(keyword in category for keyword in ['payable', 'short', 'accrued']):
                    current_liabilities += t.amount
                else:
                    long_term_liabilities += t.amount
        
        total_liabilities = current_liabilities + long_term_liabilities
        
        # Calculate equity
        owner_equity = 0
        retained_earnings = 0
        
        for t in transactions:
            if t.type == TransactionType.EQUITY:
                category = (t.category or '').lower()
                if any(keyword in category for keyword in ['capital', 'owner']):
                    owner_equity += t.amount
                else:
                    retained_earnings += t.amount
            elif t.type == TransactionType.REVENUE:
                retained_earnings += t.amount
            elif t.type == TransactionType.EXPENSE:
                retained_earnings -= t.amount
        
        total_equity = owner_equity + retained_earnings
        
        return {
            "as_of_date": end_date.isoformat(),
            "assets": {
                "current_assets": current_assets,
                "fixed_assets": fixed_assets,
                "total_assets": total_assets
            },
            "liabilities": {
                "current_liabilities": current_liabilities,
                "long_term_liabilities": long_term_liabilities,
                "total_liabilities": total_liabilities
            },
            "equity": {
                "owner_equity": owner_equity,
                "retained_earnings": retained_earnings,
                "total_equity": total_equity
            },
            "total_liabilities_and_equity": total_liabilities + total_equity,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating balance sheet: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate balance sheet: {str(e)}"
        )

@router.get("/statements/cash-flow")
async def get_cash_flow_statement(
    month: str = Query(..., description="Month in YYYY-MM format"),
    db: Session = Depends(get_db)
):
    """Get Cash Flow Statement for a specific month"""
    try:
        # Parse month and get date range
        year, month_num = month.split('-')
        start_date = datetime(int(year), int(month_num), 1)
        
        # Get last day of month
        if int(month_num) == 12:
            end_date = datetime(int(year) + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = datetime(int(year), int(month_num) + 1, 1) - timedelta(days=1)
        
        # Get transactions for the month
        transactions = db.query(Transaction).filter(
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date <= end_date
        ).all()
        
        # Operating Activities
        net_income = 0
        depreciation = 0
        accounts_receivable = 0
        inventory = 0
        accounts_payable = 0
        
        # Investing Activities
        equipment_purchases = 0
        asset_sales = 0
        
        # Financing Activities
        loan_proceeds = 0
        loan_payments = 0
        owner_withdrawals = 0
        
        for t in transactions:
            category = (t.category or '').lower()
            
            if t.type == TransactionType.REVENUE:
                net_income += t.amount
            elif t.type == TransactionType.EXPENSE:
                net_income -= t.amount
                if 'depreciation' in category:
                    depreciation += t.amount
            elif t.type == TransactionType.ASSET:
                if 'receivable' in category:
                    accounts_receivable += t.amount
                elif 'inventory' in category:
                    inventory += t.amount
                elif any(keyword in category for keyword in ['equipment', 'machinery']):
                    equipment_purchases += t.amount
            elif t.type == TransactionType.LIABILITY:
                if 'payable' in category:
                    accounts_payable += t.amount
                elif 'loan' in category:
                    loan_proceeds += t.amount
            elif t.type == TransactionType.EQUITY:
                if any(keyword in category for keyword in ['withdrawal', 'drawing']):
                    owner_withdrawals += t.amount
        
        # Calculate cash flows
        net_operating_cash = net_income + depreciation - accounts_receivable - inventory + accounts_payable
        net_investing_cash = -equipment_purchases + asset_sales
        net_financing_cash = loan_proceeds - loan_payments - owner_withdrawals
        net_cash_flow = net_operating_cash + net_investing_cash + net_financing_cash
        
        return {
            "period": month,
            "operating_activities": {
                "net_income": net_income,
                "depreciation": depreciation,
                "accounts_receivable": -accounts_receivable,
                "inventory": -inventory,
                "accounts_payable": accounts_payable,
                "net_operating_cash": net_operating_cash
            },
            "investing_activities": {
                "equipment_purchases": -equipment_purchases,
                "asset_sales": asset_sales,
                "net_investing_cash": net_investing_cash
            },
            "financing_activities": {
                "loan_proceeds": loan_proceeds,
                "loan_payments": -loan_payments,
                "owner_withdrawals": -owner_withdrawals,
                "net_financing_cash": net_financing_cash
            },
            "net_cash_flow": net_cash_flow,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating cash flow statement: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate cash flow statement: {str(e)}"
        )

# Cash Flow Analytics Endpoint
@router.get("/analytics/cash-flow")
async def get_cash_flow_analytics(
    months: int = Query(6, ge=1, le=12, description="Number of months to analyze"),
    db: Session = Depends(get_db)
):
    """Get cash flow analytics for multiple months"""
    try:
        # Get data for the last N months
        end_date = datetime.now()
        start_date = end_date - timedelta(days=months * 30)  # Approximate months
        
        transactions = db.query(Transaction).filter(
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date <= end_date
        ).all()
        
        # Group by month and calculate cash flows
        monthly_data = {}
        
        for t in transactions:
            month_key = t.transaction_date.strftime('%Y-%m')
            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    'operating': 0,
                    'investing': 0,
                    'financing': 0,
                    'net': 0
                }
            
            category = (t.category or '').lower()
            
            if t.type == TransactionType.REVENUE:
                monthly_data[month_key]['operating'] += t.amount
            elif t.type == TransactionType.EXPENSE:
                monthly_data[month_key]['operating'] -= t.amount
                if 'depreciation' in category:
                    monthly_data[month_key]['operating'] += t.amount  # Add back depreciation
            elif t.type == TransactionType.ASSET:
                if any(keyword in category for keyword in ['equipment', 'machinery', 'building', 'vehicle']):
                    monthly_data[month_key]['investing'] -= t.amount
            elif t.type == TransactionType.LIABILITY:
                if 'loan' in category:
                    monthly_data[month_key]['financing'] += t.amount
            elif t.type == TransactionType.EQUITY:
                if any(keyword in category for keyword in ['withdrawal', 'drawing']):
                    monthly_data[month_key]['financing'] -= t.amount
        
        # Calculate net cash flow for each month
        for month in monthly_data:
            monthly_data[month]['net'] = (
                monthly_data[month]['operating'] + 
                monthly_data[month]['investing'] + 
                monthly_data[month]['financing']
            )
        
        # Format for frontend
        cash_flow_data = []
        for month_key, data in sorted(monthly_data.items()):
            month_name = datetime.strptime(month_key, '%Y-%m').strftime('%b')
            cash_flow_data.append({
                'month': month_name,
                'operating': data['operating'],
                'investing': data['investing'],
                'financing': data['financing'],
                'net': data['net']
            })
        
        # Calculate totals
        total_operating = sum(d['operating'] for d in monthly_data.values())
        total_investing = sum(d['investing'] for d in monthly_data.values())
        total_financing = sum(d['financing'] for d in monthly_data.values())
        total_net = sum(d['net'] for d in monthly_data.values())
        
        # Calculate percentages
        total_abs = abs(total_operating) + abs(total_investing) + abs(total_financing)
        
        cash_flow_categories = [
            {
                'category': 'Operating Activities',
                'amount': total_operating,
                'percentage': (total_operating / total_abs * 100) if total_abs > 0 else 0,
                'color': '#10b981'
            },
            {
                'category': 'Investing Activities',
                'amount': total_investing,
                'percentage': (total_investing / total_abs * 100) if total_abs > 0 else 0,
                'color': '#ef4444'
            },
            {
                'category': 'Financing Activities',
                'amount': total_financing,
                'percentage': (total_financing / total_abs * 100) if total_abs > 0 else 0,
                'color': '#3b82f6'
            }
        ]
        
        return {
            'cash_flow_data': cash_flow_data,
            'cash_flow_categories': cash_flow_categories,
            'total_net_cash_flow': total_net,
            'period': f"Last {months} months",
            'generated_at': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating cash flow analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate cash flow analytics: {str(e)}"
        )

# Revenue Analytics Endpoint
@router.get("/analytics/revenue")
async def get_revenue_analytics(
    months: int = Query(6, ge=1, le=12, description="Number of months to analyze"),
    db: Session = Depends(get_db)
):
    """Get revenue analytics for multiple months"""
    try:
        # Get data for the last N months
        end_date = datetime.now()
        start_date = end_date - timedelta(days=months * 30)  # Approximate months
        
        transactions = db.query(Transaction).filter(
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date <= end_date
        ).all()
        
        # Group by month and calculate revenue/expenses
        monthly_data = {}
        revenue_sources = {}
        
        for t in transactions:
            month_key = t.transaction_date.strftime('%Y-%m')
            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    'revenue': 0,
                    'expenses': 0,
                    'profit': 0
                }
            
            if t.type == TransactionType.REVENUE:
                monthly_data[month_key]['revenue'] += t.amount
                
                # Track revenue sources
                category = t.category or 'Other'
                if category not in revenue_sources:
                    revenue_sources[category] = 0
                revenue_sources[category] += t.amount
                
            elif t.type == TransactionType.EXPENSE:
                monthly_data[month_key]['expenses'] += t.amount
        
        # Calculate profit for each month
        for month in monthly_data:
            monthly_data[month]['profit'] = (
                monthly_data[month]['revenue'] - 
                monthly_data[month]['expenses']
            )
        
        # Format for frontend
        revenue_data = []
        for month_key, data in sorted(monthly_data.items()):
            month_name = datetime.strptime(month_key, '%Y-%m').strftime('%b')
            revenue_data.append({
                'month': month_name,
                'revenue': data['revenue'],
                'expenses': data['expenses'],
                'profit': data['profit']
            })
        
        # Calculate revenue source percentages
        total_revenue = sum(d['revenue'] for d in monthly_data.values())
        
        revenue_sources_data = []
        colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16']
        
        for i, (source, amount) in enumerate(revenue_sources.items()):
            percentage = (amount / total_revenue * 100) if total_revenue > 0 else 0
            revenue_sources_data.append({
                'source': source,
                'amount': amount,
                'percentage': percentage,
                'color': colors[i % len(colors)]
            })
        
        # Sort by amount descending
        revenue_sources_data.sort(key=lambda x: x['amount'], reverse=True)
        
        # Calculate totals
        total_expenses = sum(d['expenses'] for d in monthly_data.values())
        total_profit = sum(d['profit'] for d in monthly_data.values())
        
        return {
            'revenue_data': revenue_data,
            'revenue_sources': revenue_sources_data,
            'total_revenue': total_revenue,
            'total_expenses': total_expenses,
            'total_profit': total_profit,
            'period': f"Last {months} months",
            'generated_at': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating revenue analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate revenue analytics: {str(e)}"
        )
