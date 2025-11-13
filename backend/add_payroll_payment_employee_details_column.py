"""
Migration script to add employee_payout_details column to payroll_payments table
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine
from sqlalchemy import text

def add_employee_payout_details_column():
    """Add employee_payout_details JSON column to payroll_payments table"""
    try:
        with engine.connect() as conn:
            # Check if column already exists
            check_query = text("""
                SELECT COUNT(*) as count
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'payroll_payments'
                AND COLUMN_NAME = 'employee_payout_details'
            """)
            result = conn.execute(check_query).fetchone()
            
            if result and result[0] > 0:
                print("✅ Column 'employee_payout_details' already exists in payroll_payments table")
                return
            
            # Add the column
            alter_query = text("""
                ALTER TABLE payroll_payments
                ADD COLUMN employee_payout_details JSON NULL
                AFTER clickpesa_response
            """)
            
            conn.execute(alter_query)
            conn.commit()
            print("✅ Successfully added 'employee_payout_details' column to payroll_payments table")
            
    except Exception as e:
        print(f"❌ Error adding column: {str(e)}")
        raise

if __name__ == "__main__":
    print("🔄 Adding employee_payout_details column to payroll_payments table...")
    add_employee_payout_details_column()
    print("✅ Migration completed!")

