#!/usr/bin/env python3
"""
Script to create sample transactions in the database
Run this script to populate the database with sample transaction data
"""

import sys
import os
from datetime import datetime
from sqlalchemy.orm import Session

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db
from models.transaction import Transaction, TransactionType, PaymentMethod

def create_sample_transactions():
    """Create sample transactions in the database"""
    
    # Get database session
    db = next(get_db())
    
    try:
        # Sample transactions data
        sample_transactions = [
            {
                "description": "Client Payment - Project Alpha",
                "type": "REVENUE",
                "category": "Services",
                "amount": 750000.0,
                "payment_method": "BANK",
                "reference": "INV-2024-001",
                "account": "Business Account",
                "notes": "Payment for completed project",
                "created_by": "sample-data-script"
            },
            {
                "description": "Office Rent Payment",
                "type": "EXPENSE",
                "category": "Rent",
                "amount": 250000.0,
                "payment_method": "BANK",
                "reference": "RENT-001",
                "account": "Business Account",
                "notes": "Monthly office rent",
                "created_by": "sample-data-script"
            },
            {
                "description": "Software License Renewal",
                "type": "EXPENSE",
                "category": "Software",
                "amount": 120000.0,
                "payment_method": "CASH",
                "reference": "SOFT-2024",
                "account": "Business Account",
                "notes": "Annual software license renewal",
                "created_by": "sample-data-script"
            },
            {
                "description": "Bank Transfer to Savings",
                "type": "TRANSFER",
                "category": "Transfer",
                "amount": 500000.0,
                "payment_method": "BANK",
                "reference": "TRF-001",
                "account": "Savings Account",
                "notes": "Transfer to savings account",
                "created_by": "sample-data-script"
            },
            {
                "description": "Equipment Purchase",
                "type": "ASSET",
                "category": "Equipment",
                "amount": 180000.0,
                "payment_method": "BANK",
                "reference": "EQ-001",
                "account": "Business Account",
                "notes": "New office equipment",
                "created_by": "sample-data-script"
            },
            {
                "description": "Client Payment - Project Beta",
                "type": "REVENUE",
                "category": "Services",
                "amount": 450000.0,
                "payment_method": "BANK",
                "reference": "INV-2024-002",
                "account": "Business Account",
                "notes": "Payment for project completion",
                "created_by": "sample-data-script"
            },
            {
                "description": "Employee Salary Payment",
                "type": "EXPENSE",
                "category": "Payroll",
                "amount": 320000.0,
                "payment_method": "BANK",
                "reference": "PAY-001",
                "account": "Business Account",
                "notes": "Monthly salary payment",
                "created_by": "sample-data-script"
            },
            {
                "description": "Bank Loan Disbursement",
                "type": "LIABILITY",
                "category": "Financing",
                "amount": 2000000.0,
                "payment_method": "BANK",
                "reference": "LOAN-001",
                "account": "Business Account",
                "notes": "Business loan disbursement",
                "created_by": "sample-data-script"
            },
            {
                "description": "Marketing Campaign Payment",
                "type": "EXPENSE",
                "category": "Marketing",
                "amount": 85000.0,
                "payment_method": "CASH",
                "reference": "MKT-001",
                "account": "Business Account",
                "notes": "Digital marketing campaign",
                "created_by": "sample-data-script"
            },
            {
                "description": "Interest Earned on Savings",
                "type": "REVENUE",
                "category": "Investment",
                "amount": 15000.0,
                "payment_method": "BANK",
                "reference": "INT-001",
                "account": "Savings Account",
                "notes": "Monthly interest earned",
                "created_by": "sample-data-script"
            }
        ]
        
        # Generate unique transaction IDs
        import uuid
        transaction_id_counter = 1
        
        for transaction_data in sample_transactions:
            # Generate unique transaction ID
            transaction_id = f"TXN-{str(uuid.uuid4())[:8].upper()}"
            
            # Check if transaction ID already exists
            while db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first():
                transaction_id = f"TXN-{str(uuid.uuid4())[:8].upper()}"
            
            # Create transaction object
            transaction = Transaction(
                transaction_id=transaction_id,
                description=transaction_data["description"],
                type=TransactionType(transaction_data["type"]),
                category=transaction_data["category"],
                amount=transaction_data["amount"],
                payment_method=PaymentMethod(transaction_data["payment_method"]),
                reference=transaction_data["reference"],
                account=transaction_data["account"],
                notes=transaction_data["notes"],
                created_by=transaction_data["created_by"],
                transaction_date=datetime.now()
            )
            
            # Add to database
            db.add(transaction)
            print(f"Added transaction: {transaction_data['description']} - {transaction_id}")
        
        # Commit all transactions
        db.commit()
        print(f"\n✅ Successfully created {len(sample_transactions)} sample transactions in the database!")
        
    except Exception as e:
        print(f"❌ Error creating sample transactions: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating sample transactions in the database...")
    create_sample_transactions()
    print("Done!")
