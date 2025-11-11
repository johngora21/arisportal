#!/usr/bin/env python3
"""
Migration script to update InvoiceStatus enum to include PARTIAL_PAID
Run this script to update the database enum for invoice statuses.
"""

import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'arisportal')

def update_invoice_status_enum():
    """Update the InvoiceStatus enum in the database to include PARTIAL_PAID"""
    try:
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            print("🔄 Updating InvoiceStatus enum to include PARTIAL_PAID...")
            
            # Check current enum values
            cursor.execute("""
                SELECT COLUMN_TYPE 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = %s 
                AND TABLE_NAME = 'invoices' 
                AND COLUMN_NAME = 'status'
            """, (DB_NAME,))
            
            result = cursor.fetchone()
            if result:
                current_enum = result[0]
                print(f"📋 Current enum: {current_enum}")
                
                # Check if PARTIAL_PAID already exists
                if 'PARTIAL_PAID' in current_enum:
                    print("✅ PARTIAL_PAID already exists in enum. No changes needed.")
                    return
                
                # Update enum to include PARTIAL_PAID
                # MySQL requires altering the enum with all values
                print("🔧 Altering enum to include PARTIAL_PAID...")
                cursor.execute("""
                    ALTER TABLE invoices 
                    MODIFY COLUMN status ENUM(
                        'DRAFT', 
                        'PENDING', 
                        'PARTIAL_PAID', 
                        'PAID', 
                        'OVERDUE', 
                        'CANCELLED'
                    ) NOT NULL DEFAULT 'PENDING'
                """)
                
                connection.commit()
                print("✅ Successfully updated InvoiceStatus enum to include PARTIAL_PAID")
                
                # Verify the update
                cursor.execute("""
                    SELECT COLUMN_TYPE 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = %s 
                    AND TABLE_NAME = 'invoices' 
                    AND COLUMN_NAME = 'status'
                """, (DB_NAME,))
                
                result = cursor.fetchone()
                if result:
                    updated_enum = result[0]
                    print(f"📋 Updated enum: {updated_enum}")
                    
                    # Update existing invoices with partial payments to PARTIAL_PAID status
                    print("🔧 Updating existing invoices with partial payments...")
                    cursor.execute("""
                        UPDATE invoices 
                        SET status = 'PARTIAL_PAID'
                        WHERE amount_paid > 0 
                        AND amount_paid < total 
                        AND status = 'PENDING'
                    """)
                    
                    rows_updated = cursor.rowcount
                    connection.commit()
                    print(f"✅ Updated {rows_updated} invoices to PARTIAL_PAID status")
                    
            else:
                print("❌ Could not find status column in invoices table")
        
        connection.close()
        print("✅ Migration completed successfully")
        
    except Exception as e:
        print(f"❌ Error updating enum: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    update_invoice_status_enum()

