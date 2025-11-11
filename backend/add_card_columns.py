#!/usr/bin/env python3
"""
Add missing columns to the cards table
"""
import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from database import engine
from sqlalchemy import text

def add_card_columns():
    """Add missing columns to cards table"""
    try:
        with engine.connect() as conn:
            # Check which columns exist
            result = conn.execute(text("""
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'cards'
            """))
            existing_columns = [row[0] for row in result]
            print(f"Existing columns: {existing_columns}")
            
            # Add missing columns
            alterations = []
            
            if 'cardholder_name' not in existing_columns:
                alterations.append("ADD COLUMN cardholder_name VARCHAR(100)")
            
            if 'is_active' not in existing_columns:
                alterations.append("ADD COLUMN is_active BOOLEAN DEFAULT TRUE")
            
            if 'is_default' not in existing_columns:
                alterations.append("ADD COLUMN is_default BOOLEAN DEFAULT FALSE")
            
            if 'balance' not in existing_columns:
                alterations.append("ADD COLUMN balance FLOAT DEFAULT 0.0")
            
            if 'topup_control_number' not in existing_columns:
                alterations.append("ADD COLUMN topup_control_number VARCHAR(50) UNIQUE")
            
            if 'created_at' not in existing_columns:
                alterations.append("ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
            
            if 'updated_at' not in existing_columns:
                alterations.append("ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
            
            if alterations:
                alter_sql = f"ALTER TABLE cards {', '.join(alterations)}"
                print(f"\nExecuting: {alter_sql}")
                conn.execute(text(alter_sql))
                conn.commit()
                print("✅ Successfully added missing columns to cards table!")
            else:
                print("✅ All columns already exist!")
            
            # Optionally remove last_four if not needed
            if 'last_four' in existing_columns:
                response = input("\nDo you want to remove the 'last_four' column? (y/n): ")
                if response.lower() == 'y':
                    conn.execute(text("ALTER TABLE cards DROP COLUMN last_four"))
                    conn.commit()
                    print("✅ Removed last_four column")
                else:
                    print("ℹ️  Keeping last_four column")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    add_card_columns()

