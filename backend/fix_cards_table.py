#!/usr/bin/env python3
"""
Fix the cards table schema - add missing columns and remove last_four
"""
import sys
import os
from pathlib import Path

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from database import engine
from sqlalchemy import text

def fix_cards_table():
    """Fix the cards table schema"""
    try:
        with engine.connect() as conn:
            # Check existing columns
            result = conn.execute(text("SHOW COLUMNS FROM cards"))
            existing = [row[0] for row in result]
            print(f"Existing columns: {existing}")
            
            # Add missing columns one by one
            if 'cardholder_name' not in existing:
                conn.execute(text("ALTER TABLE cards ADD COLUMN cardholder_name VARCHAR(100)"))
                print("✅ Added cardholder_name")
            
            if 'is_active' not in existing:
                conn.execute(text("ALTER TABLE cards ADD COLUMN is_active BOOLEAN DEFAULT TRUE"))
                print("✅ Added is_active")
            
            if 'is_default' not in existing:
                conn.execute(text("ALTER TABLE cards ADD COLUMN is_default BOOLEAN DEFAULT FALSE"))
                print("✅ Added is_default")
            
            if 'balance' not in existing:
                conn.execute(text("ALTER TABLE cards ADD COLUMN balance FLOAT DEFAULT 0.0"))
                print("✅ Added balance")
            
            if 'topup_control_number' not in existing:
                conn.execute(text("ALTER TABLE cards ADD COLUMN topup_control_number VARCHAR(50)"))
                print("✅ Added topup_control_number")
                # Add unique index if it doesn't exist
                try:
                    conn.execute(text("ALTER TABLE cards ADD UNIQUE INDEX idx_topup_control (topup_control_number)"))
                    print("✅ Added unique index on topup_control_number")
                except:
                    print("ℹ️  Unique index might already exist")
            
            if 'created_at' not in existing:
                conn.execute(text("ALTER TABLE cards ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"))
                print("✅ Added created_at")
            
            if 'updated_at' not in existing:
                conn.execute(text("ALTER TABLE cards ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
                print("✅ Added updated_at")
            
            # Remove last_four (not needed for control-number cards)
            if 'last_four' in existing:
                conn.execute(text("ALTER TABLE cards DROP COLUMN last_four"))
                print("✅ Removed last_four column")
            
            conn.commit()
            print("\n✅ Cards table schema updated successfully!")
            
            # Verify final schema
            result = conn.execute(text("SHOW COLUMNS FROM cards"))
            final_columns = [row[0] for row in result]
            print(f"\nFinal columns: {final_columns}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    fix_cards_table()

