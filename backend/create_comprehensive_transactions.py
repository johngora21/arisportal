#!/usr/bin/env python3
"""
Comprehensive script to create realistic sample transactions for all accounting categories
This script creates transactions that will populate meaningful financial statements
"""

import sys
import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import random

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db
from models.transaction import Transaction, TransactionType, PaymentMethod

def create_comprehensive_transactions():
    """Create comprehensive sample transactions covering all accounting categories"""
    
    # Get database session
    db = next(get_db())
    
    try:
        # Clear existing transactions (optional - comment out if you want to keep existing data)
        print("Clearing existing transactions...")
        db.query(Transaction).delete()
        db.commit()
        
        # Generate transactions for the last 12 months
        base_date = datetime.now() - timedelta(days=365)
        
        # Comprehensive transaction data organized by type
        transactions_data = []
        
        # REVENUE TRANSACTIONS
        revenue_transactions = [
            # Product Sales
            {"description": "Product Sales - Electronics", "category": "Product Sales", "amount": 2500000, "payment_method": "BANK", "reference": "SALE-001"},
            {"description": "Product Sales - Clothing", "category": "Product Sales", "amount": 1800000, "payment_method": "CARD", "reference": "SALE-002"},
            {"description": "Product Sales - Furniture", "category": "Product Sales", "amount": 3200000, "payment_method": "BANK", "reference": "SALE-003"},
            {"description": "Product Sales - Books", "category": "Product Sales", "amount": 450000, "payment_method": "CASH", "reference": "SALE-004"},
            
            # Service Income
            {"description": "Consulting Services - Project Alpha", "category": "Service Income", "amount": 1500000, "payment_method": "BANK", "reference": "SVC-001"},
            {"description": "Consulting Services - Project Beta", "category": "Service Income", "amount": 2200000, "payment_method": "BANK", "reference": "SVC-002"},
            {"description": "Technical Support Services", "category": "Service Income", "amount": 800000, "payment_method": "BANK", "reference": "SVC-003"},
            {"description": "Training Services", "category": "Service Income", "amount": 600000, "payment_method": "BANK", "reference": "SVC-004"},
            
            # Subscription Fees
            {"description": "Monthly Subscription Revenue", "category": "Subscription Fees", "amount": 120000, "payment_method": "BANK", "reference": "SUB-001"},
            {"description": "Annual Subscription Revenue", "category": "Subscription Fees", "amount": 480000, "payment_method": "BANK", "reference": "SUB-002"},
            
            # Commission Income
            {"description": "Sales Commission", "category": "Commission Income", "amount": 300000, "payment_method": "BANK", "reference": "COM-001"},
            {"description": "Referral Commission", "category": "Commission Income", "amount": 150000, "payment_method": "BANK", "reference": "COM-002"},
            
            # Rental Income
            {"description": "Office Space Rental", "category": "Rental Income", "amount": 500000, "payment_method": "BANK", "reference": "RENT-001"},
            {"description": "Equipment Rental", "category": "Rental Income", "amount": 200000, "payment_method": "CASH", "reference": "RENT-002"},
            
            # Interest Income
            {"description": "Bank Interest Income", "category": "Interest Income", "amount": 75000, "payment_method": "BANK", "reference": "INT-001"},
            {"description": "Investment Interest", "category": "Interest Income", "amount": 120000, "payment_method": "BANK", "reference": "INT-002"},
        ]
        
        # EXPENSE TRANSACTIONS
        expense_transactions = [
            # Salaries & Wages
            {"description": "Employee Salaries - January", "category": "Salaries & Wages", "amount": 1800000, "payment_method": "BANK", "reference": "PAY-001"},
            {"description": "Employee Salaries - February", "category": "Salaries & Wages", "amount": 1800000, "payment_method": "BANK", "reference": "PAY-002"},
            {"description": "Employee Salaries - March", "category": "Salaries & Wages", "amount": 1900000, "payment_method": "BANK", "reference": "PAY-003"},
            {"description": "Overtime Payments", "category": "Salaries & Wages", "amount": 250000, "payment_method": "BANK", "reference": "PAY-004"},
            {"description": "Bonus Payments", "category": "Salaries & Wages", "amount": 400000, "payment_method": "BANK", "reference": "PAY-005"},
            
            # Rent
            {"description": "Office Rent - January", "category": "Rent", "amount": 400000, "payment_method": "BANK", "reference": "RENT-EXP-001"},
            {"description": "Office Rent - February", "category": "Rent", "amount": 400000, "payment_method": "BANK", "reference": "RENT-EXP-002"},
            {"description": "Office Rent - March", "category": "Rent", "amount": 400000, "payment_method": "BANK", "reference": "RENT-EXP-003"},
            {"description": "Warehouse Rent", "category": "Rent", "amount": 300000, "payment_method": "BANK", "reference": "RENT-EXP-004"},
            
            # Utilities
            {"description": "Electricity Bill", "category": "Utilities", "amount": 150000, "payment_method": "BANK", "reference": "UTIL-001"},
            {"description": "Water Bill", "category": "Utilities", "amount": 45000, "payment_method": "BANK", "reference": "UTIL-002"},
            {"description": "Internet & Phone", "category": "Utilities", "amount": 80000, "payment_method": "BANK", "reference": "UTIL-003"},
            {"description": "Gas Bill", "category": "Utilities", "amount": 60000, "payment_method": "BANK", "reference": "UTIL-004"},
            
            # Office Supplies
            {"description": "Office Stationery", "category": "Office Supplies", "amount": 75000, "payment_method": "CASH", "reference": "SUP-001"},
            {"description": "Computer Supplies", "category": "Office Supplies", "amount": 120000, "payment_method": "BANK", "reference": "SUP-002"},
            {"description": "Cleaning Supplies", "category": "Office Supplies", "amount": 35000, "payment_method": "CASH", "reference": "SUP-003"},
            
            # Marketing & Advertising
            {"description": "Digital Marketing Campaign", "category": "Marketing & Advertising", "amount": 300000, "payment_method": "BANK", "reference": "MKT-001"},
            {"description": "Print Advertising", "category": "Marketing & Advertising", "amount": 150000, "payment_method": "BANK", "reference": "MKT-002"},
            {"description": "Social Media Advertising", "category": "Marketing & Advertising", "amount": 200000, "payment_method": "BANK", "reference": "MKT-003"},
            
            # Transport & Travel
            {"description": "Business Travel Expenses", "category": "Transport & Travel", "amount": 180000, "payment_method": "CARD", "reference": "TRAV-001"},
            {"description": "Fuel Expenses", "category": "Transport & Travel", "amount": 120000, "payment_method": "CASH", "reference": "TRAV-002"},
            {"description": "Vehicle Maintenance", "category": "Transport & Travel", "amount": 95000, "payment_method": "BANK", "reference": "TRAV-003"},
            
            # Repairs & Maintenance
            {"description": "Office Equipment Repair", "category": "Repairs & Maintenance", "amount": 85000, "payment_method": "CASH", "reference": "REP-001"},
            {"description": "Building Maintenance", "category": "Repairs & Maintenance", "amount": 150000, "payment_method": "BANK", "reference": "REP-002"},
            {"description": "Computer Repair", "category": "Repairs & Maintenance", "amount": 45000, "payment_method": "CASH", "reference": "REP-003"},
            
            # Insurance
            {"description": "Business Insurance Premium", "category": "Insurance", "amount": 200000, "payment_method": "BANK", "reference": "INS-001"},
            {"description": "Vehicle Insurance", "category": "Insurance", "amount": 120000, "payment_method": "BANK", "reference": "INS-002"},
            {"description": "Equipment Insurance", "category": "Insurance", "amount": 80000, "payment_method": "BANK", "reference": "INS-003"},
            
            # Depreciation & Amortization
            {"description": "Equipment Depreciation", "category": "Depreciation & Amortization", "amount": 100000, "payment_method": "OTHER", "reference": "DEP-001"},
            {"description": "Software Amortization", "category": "Depreciation & Amortization", "amount": 60000, "payment_method": "OTHER", "reference": "DEP-002"},
            
            # Interest Expense
            {"description": "Bank Loan Interest", "category": "Interest Expense", "amount": 150000, "payment_method": "BANK", "reference": "INT-EXP-001"},
            {"description": "Credit Card Interest", "category": "Interest Expense", "amount": 25000, "payment_method": "BANK", "reference": "INT-EXP-002"},
            
            # Taxes & Licenses
            {"description": "Business License Renewal", "category": "Taxes & Licenses", "amount": 100000, "payment_method": "BANK", "reference": "TAX-001"},
            {"description": "Professional License", "category": "Taxes & Licenses", "amount": 75000, "payment_method": "BANK", "reference": "TAX-002"},
            {"description": "Property Tax", "category": "Taxes & Licenses", "amount": 200000, "payment_method": "BANK", "reference": "TAX-003"},
            
            # Miscellaneous Expenses
            {"description": "Bank Charges", "category": "Miscellaneous Expenses", "amount": 15000, "payment_method": "BANK", "reference": "MISC-001"},
            {"description": "Professional Fees", "category": "Miscellaneous Expenses", "amount": 180000, "payment_method": "BANK", "reference": "MISC-002"},
            {"description": "Legal Fees", "category": "Miscellaneous Expenses", "amount": 120000, "payment_method": "BANK", "reference": "MISC-003"},
        ]
        
        # ASSET TRANSACTIONS
        asset_transactions = [
            # Cash & Cash Equivalents
            {"description": "Cash Deposit", "category": "Cash & Cash Equivalents", "amount": 500000, "payment_method": "CASH", "reference": "CASH-001"},
            {"description": "Petty Cash Fund", "category": "Cash & Cash Equivalents", "amount": 100000, "payment_method": "CASH", "reference": "CASH-002"},
            
            # Bank Accounts
            {"description": "Bank Account Opening", "category": "Bank Accounts", "amount": 2000000, "payment_method": "BANK", "reference": "BANK-001"},
            {"description": "Savings Account Deposit", "category": "Bank Accounts", "amount": 1500000, "payment_method": "BANK", "reference": "BANK-002"},
            
            # Accounts Receivable
            {"description": "Customer Invoice - Outstanding", "category": "Accounts Receivable", "amount": 800000, "payment_method": "OTHER", "reference": "AR-001"},
            {"description": "Customer Invoice - Outstanding", "category": "Accounts Receivable", "amount": 450000, "payment_method": "OTHER", "reference": "AR-002"},
            
            # Inventory / Stock
            {"description": "Raw Materials Purchase", "category": "Inventory / Stock", "amount": 1200000, "payment_method": "BANK", "reference": "INV-001"},
            {"description": "Finished Goods Inventory", "category": "Inventory / Stock", "amount": 1800000, "payment_method": "BANK", "reference": "INV-002"},
            {"description": "Work in Progress", "category": "Work in Progress", "amount": 600000, "payment_method": "BANK", "reference": "INV-003"},
            
            # Prepaid Expenses
            {"description": "Prepaid Insurance", "category": "Prepaid Expenses", "amount": 120000, "payment_method": "BANK", "reference": "PRE-001"},
            {"description": "Prepaid Rent", "category": "Prepaid Expenses", "amount": 200000, "payment_method": "BANK", "reference": "PRE-002"},
            
            # Land & Buildings
            {"description": "Office Building Purchase", "category": "Land & Buildings", "amount": 15000000, "payment_method": "BANK", "reference": "BLD-001"},
            {"description": "Land Purchase", "category": "Land & Buildings", "amount": 8000000, "payment_method": "BANK", "reference": "BLD-002"},
            
            # Machinery & Equipment
            {"description": "Production Machinery", "category": "Machinery & Equipment", "amount": 5000000, "payment_method": "BANK", "reference": "MACH-001"},
            {"description": "Manufacturing Equipment", "category": "Machinery & Equipment", "amount": 3200000, "payment_method": "BANK", "reference": "MACH-002"},
            
            # Vehicles
            {"description": "Company Vehicle Purchase", "category": "Vehicles", "amount": 2500000, "payment_method": "BANK", "reference": "VEH-001"},
            {"description": "Delivery Truck", "category": "Vehicles", "amount": 1800000, "payment_method": "BANK", "reference": "VEH-002"},
            
            # Office Equipment
            {"description": "Office Furniture", "category": "Office Equipment", "amount": 800000, "payment_method": "BANK", "reference": "OFF-001"},
            {"description": "Office Equipment", "category": "Office Equipment", "amount": 600000, "payment_method": "BANK", "reference": "OFF-002"},
            
            # Computer Equipment
            {"description": "Computer Systems", "category": "Computer Equipment", "amount": 1200000, "payment_method": "BANK", "reference": "COMP-001"},
            {"description": "Network Equipment", "category": "Computer Equipment", "amount": 400000, "payment_method": "BANK", "reference": "COMP-002"},
            
            # Furniture & Fixtures
            {"description": "Office Furniture", "category": "Furniture & Fixtures", "amount": 500000, "payment_method": "BANK", "reference": "FURN-001"},
            {"description": "Display Fixtures", "category": "Furniture & Fixtures", "amount": 300000, "payment_method": "BANK", "reference": "FURN-002"},
            
            # Tools & Instruments
            {"description": "Professional Tools", "category": "Tools & Instruments", "amount": 200000, "payment_method": "BANK", "reference": "TOOL-001"},
            {"description": "Measurement Instruments", "category": "Tools & Instruments", "amount": 150000, "payment_method": "BANK", "reference": "TOOL-002"},
            
            # Intangible Assets
            {"description": "Software Development", "category": "Intangible Assets", "amount": 800000, "payment_method": "BANK", "reference": "INTAN-001"},
            {"description": "Brand Development", "category": "Intangible Assets", "amount": 500000, "payment_method": "BANK", "reference": "INTAN-002"},
            
            # Patents & Trademarks
            {"description": "Patent Registration", "category": "Patents & Trademarks", "amount": 300000, "payment_method": "BANK", "reference": "PAT-001"},
            {"description": "Trademark Registration", "category": "Patents & Trademarks", "amount": 200000, "payment_method": "BANK", "reference": "PAT-002"},
            
            # Software Licenses
            {"description": "Software License Purchase", "category": "Software Licenses", "amount": 400000, "payment_method": "BANK", "reference": "SOFT-001"},
            {"description": "Annual Software Renewal", "category": "Software Licenses", "amount": 150000, "payment_method": "BANK", "reference": "SOFT-002"},
            
            # Investments
            {"description": "Stock Investment", "category": "Investments", "amount": 2000000, "payment_method": "BANK", "reference": "INVEST-001"},
            {"description": "Bond Investment", "category": "Investments", "amount": 1500000, "payment_method": "BANK", "reference": "INVEST-002"},
            
            # Deposits & Guarantees
            {"description": "Security Deposit", "category": "Deposits & Guarantees", "amount": 300000, "payment_method": "BANK", "reference": "DEP-001"},
            {"description": "Performance Guarantee", "category": "Deposits & Guarantees", "amount": 500000, "payment_method": "BANK", "reference": "DEP-002"},
        ]
        
        # LIABILITY TRANSACTIONS
        liability_transactions = [
            # Accounts Payable
            {"description": "Supplier Invoice - Outstanding", "category": "Accounts Payable", "amount": 600000, "payment_method": "OTHER", "reference": "AP-001"},
            {"description": "Contractor Invoice - Outstanding", "category": "Accounts Payable", "amount": 400000, "payment_method": "OTHER", "reference": "AP-002"},
            
            # Short-Term Loans
            {"description": "Short-term Working Capital Loan", "category": "Short-Term Loans", "amount": 3000000, "payment_method": "BANK", "reference": "STL-001"},
            {"description": "Equipment Financing", "category": "Short-Term Loans", "amount": 2000000, "payment_method": "BANK", "reference": "STL-002"},
            
            # Accrued Expenses
            {"description": "Accrued Salaries", "category": "Accrued Expenses", "amount": 450000, "payment_method": "OTHER", "reference": "ACC-001"},
            {"description": "Accrued Interest", "category": "Accrued Expenses", "amount": 75000, "payment_method": "OTHER", "reference": "ACC-002"},
            {"description": "Accrued Utilities", "category": "Accrued Expenses", "amount": 120000, "payment_method": "OTHER", "reference": "ACC-003"},
            
            # Long-Term Loans
            {"description": "Business Term Loan", "category": "Long-Term Loans", "amount": 10000000, "payment_method": "BANK", "reference": "LTL-001"},
            {"description": "Mortgage Loan", "category": "Long-Term Loans", "amount": 15000000, "payment_method": "BANK", "reference": "LTL-002"},
            
            # Taxes Payable
            {"description": "Income Tax Payable", "category": "Taxes Payable", "amount": 800000, "payment_method": "OTHER", "reference": "TAX-PAY-001"},
            {"description": "VAT Payable", "category": "Taxes Payable", "amount": 300000, "payment_method": "OTHER", "reference": "TAX-PAY-002"},
            {"description": "Payroll Tax Payable", "category": "Taxes Payable", "amount": 200000, "payment_method": "OTHER", "reference": "TAX-PAY-003"},
            
            # Pension Obligations
            {"description": "Employee Pension Fund", "category": "Pension Obligations", "amount": 400000, "payment_method": "BANK", "reference": "PEN-001"},
            {"description": "Retirement Benefits", "category": "Pension Obligations", "amount": 250000, "payment_method": "BANK", "reference": "PEN-002"},
            
            # Lease Liabilities
            {"description": "Equipment Lease", "category": "Lease Liabilities", "amount": 1200000, "payment_method": "BANK", "reference": "LEASE-001"},
            {"description": "Vehicle Lease", "category": "Lease Liabilities", "amount": 800000, "payment_method": "BANK", "reference": "LEASE-002"},
            
            # Deferred Revenue
            {"description": "Prepaid Service Revenue", "category": "Deferred Revenue", "amount": 600000, "payment_method": "BANK", "reference": "DEF-001"},
            {"description": "Subscription Prepayment", "category": "Deferred Revenue", "amount": 300000, "payment_method": "BANK", "reference": "DEF-002"},
        ]
        
        # EQUITY TRANSACTIONS
        equity_transactions = [
            # Owner's Capital / Share Capital
            {"description": "Initial Capital Investment", "category": "Owner's Capital / Share Capital", "amount": 5000000, "payment_method": "BANK", "reference": "CAP-001"},
            {"description": "Additional Capital Investment", "category": "Owner's Capital / Share Capital", "amount": 2000000, "payment_method": "BANK", "reference": "CAP-002"},
            {"description": "Share Capital Increase", "category": "Owner's Capital / Share Capital", "amount": 3000000, "payment_method": "BANK", "reference": "CAP-003"},
            
            # Retained Earnings (These will be calculated from revenue - expenses)
            {"description": "Retained Earnings Transfer", "category": "Retained Earnings", "amount": 1500000, "payment_method": "OTHER", "reference": "RE-001"},
            
            # Current Year Profit / Loss
            {"description": "Current Year Profit", "category": "Current Year Profit / Loss", "amount": 2500000, "payment_method": "OTHER", "reference": "CYP-001"},
            
            # Drawings / Owner Withdrawals
            {"description": "Owner Personal Withdrawal", "category": "Drawings / Owner Withdrawals", "amount": 500000, "payment_method": "BANK", "reference": "DRAW-001"},
            {"description": "Owner Personal Withdrawal", "category": "Drawings / Owner Withdrawals", "amount": 300000, "payment_method": "CASH", "reference": "DRAW-002"},
            
            # Revaluation Surplus
            {"description": "Asset Revaluation Surplus", "category": "Revaluation Surplus", "amount": 800000, "payment_method": "OTHER", "reference": "REVAL-001"},
            
            # Reserves
            {"description": "General Reserve", "category": "Reserves", "amount": 1000000, "payment_method": "OTHER", "reference": "RES-001"},
            {"description": "Contingency Reserve", "category": "Reserves", "amount": 500000, "payment_method": "OTHER", "reference": "RES-002"},
        ]
        
        # TRANSFER TRANSACTIONS
        transfer_transactions = [
            {"description": "Bank to Bank Transfer", "category": "Bank to Bank Transfer", "amount": 1000000, "payment_method": "BANK", "reference": "TRF-001"},
            {"description": "Cash to Bank Transfer", "category": "Cash to Bank / Bank to Cash", "amount": 500000, "payment_method": "BANK", "reference": "TRF-002"},
            {"description": "Bank to Cash Transfer", "category": "Cash to Bank / Bank to Cash", "amount": 200000, "payment_method": "CASH", "reference": "TRF-003"},
            {"description": "Petty Cash Refill", "category": "Petty Cash Refill", "amount": 100000, "payment_method": "CASH", "reference": "TRF-004"},
            {"description": "Internal Account Adjustment", "category": "Internal Account Adjustment", "amount": 150000, "payment_method": "OTHER", "reference": "TRF-005"},
            {"description": "Currency Exchange Gain", "category": "Currency Exchange Gain/Loss", "amount": 50000, "payment_method": "BANK", "reference": "TRF-006"},
        ]
        
        # OTHER TRANSACTIONS
        other_transactions = [
            {"description": "Charitable Donation", "category": "Donations / Grants", "amount": 100000, "payment_method": "BANK", "reference": "DON-001"},
            {"description": "Asset Disposal Gain", "category": "Asset Disposal Gain or Loss", "amount": 150000, "payment_method": "BANK", "reference": "DIS-001"},
            {"description": "Late Payment Penalty", "category": "Penalties / Fines", "amount": 25000, "payment_method": "BANK", "reference": "PEN-001"},
            {"description": "Bad Debt Write-off", "category": "Write-offs", "amount": 75000, "payment_method": "OTHER", "reference": "WO-001"},
            {"description": "Rounding Adjustment", "category": "Rounding Differences", "amount": 5, "payment_method": "OTHER", "reference": "ROUND-001"},
            {"description": "Opening Balance Adjustment", "category": "Opening Balances", "amount": 1000000, "payment_method": "OTHER", "reference": "OPEN-001"},
            {"description": "Prior Year Adjustment", "category": "Prior Year Adjustments", "amount": 200000, "payment_method": "OTHER", "reference": "PYA-001"},
        ]
        
        # Combine all transactions
        all_transactions = []
        
        # Add revenue transactions
        for transaction in revenue_transactions:
            all_transactions.append({**transaction, "type": "REVENUE"})
        
        # Add expense transactions
        for transaction in expense_transactions:
            all_transactions.append({**transaction, "type": "EXPENSE"})
        
        # Add asset transactions
        for transaction in asset_transactions:
            all_transactions.append({**transaction, "type": "ASSET"})
        
        # Add liability transactions
        for transaction in liability_transactions:
            all_transactions.append({**transaction, "type": "LIABILITY"})
        
        # Add equity transactions
        for transaction in equity_transactions:
            all_transactions.append({**transaction, "type": "EQUITY"})
        
        # Add transfer transactions
        for transaction in transfer_transactions:
            all_transactions.append({**transaction, "type": "TRANSFER"})
        
        # Add other transactions
        for transaction in other_transactions:
            all_transactions.append({**transaction, "type": "OTHER"})
        
        # Generate unique transaction IDs and create transactions
        import uuid
        transaction_id_counter = 1
        
        for transaction_data in all_transactions:
            # Generate unique transaction ID
            transaction_id = f"TXN-{str(uuid.uuid4())[:8].upper()}"
            
            # Check if transaction ID already exists
            while db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first():
                transaction_id = f"TXN-{str(uuid.uuid4())[:8].upper()}"
            
            # Generate random date within the last 12 months
            random_days = random.randint(0, 365)
            transaction_date = base_date + timedelta(days=random_days)
            
            # Create transaction object
            transaction = Transaction(
                transaction_id=transaction_id,
                description=transaction_data["description"],
                type=TransactionType(transaction_data["type"]),
                category=transaction_data["category"],
                amount=transaction_data["amount"],
                payment_method=PaymentMethod(transaction_data["payment_method"]),
                reference=transaction_data["reference"],
                account="Business Account",
                notes=f"Sample transaction for {transaction_data['category']}",
                created_by="comprehensive-sample-script",
                transaction_date=transaction_date
            )
            
            # Add to database
            db.add(transaction)
            print(f"Added {transaction_data['type']}: {transaction_data['description']} - {transaction_id}")
        
        # Commit all transactions
        db.commit()
        print(f"\n✅ Successfully created {len(all_transactions)} comprehensive sample transactions!")
        print(f"📊 Transaction breakdown:")
        print(f"   - Revenue: {len(revenue_transactions)}")
        print(f"   - Expenses: {len(expense_transactions)}")
        print(f"   - Assets: {len(asset_transactions)}")
        print(f"   - Liabilities: {len(liability_transactions)}")
        print(f"   - Equity: {len(equity_transactions)}")
        print(f"   - Transfers: {len(transfer_transactions)}")
        print(f"   - Other: {len(other_transactions)}")
        
    except Exception as e:
        print(f"❌ Error creating comprehensive transactions: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating comprehensive sample transactions in the database...")
    print("This will create realistic transactions for all accounting categories...")
    create_comprehensive_transactions()
    print("Done! Your financial statements should now have meaningful data.")
