#!/usr/bin/env python3
"""
Add payout and Web3 release tracking columns to the escrows table
Run this script to update the escrows table with new columns for payout configuration
"""
import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from database import engine
from sqlalchemy import text

def add_escrow_payout_columns():
    """Add payout and Web3 release tracking columns to escrows table"""
    try:
        with engine.connect() as conn:
            # Check which columns exist
            result = conn.execute(text("""
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'escrows'
            """))
            existing_columns = [row[0] for row in result]
            print(f"Existing columns in escrows table: {existing_columns}")
            
            # Add missing columns
            alterations = []
            
            # ClickPesa Payment Control Number (if not already added)
            if 'control_number' not in existing_columns:
                alterations.append("ADD COLUMN control_number VARCHAR(100) NULL COMMENT 'ClickPesa billpay control number for payment'")
            
            # Payee payout configuration and release tracking
            if 'payout_method' not in existing_columns:
                alterations.append("ADD COLUMN payout_method VARCHAR(50) NULL COMMENT 'bank or mno'")
            
            if 'payout_details' not in existing_columns:
                alterations.append("ADD COLUMN payout_details TEXT NULL COMMENT 'JSON payload with bank/MNO metadata'")
            
            if 'payout_status' not in existing_columns:
                alterations.append("ADD COLUMN payout_status VARCHAR(50) NULL COMMENT 'PENDING, PROCESSING, SUCCESS, FAILED'")
            
            if 'payout_reference' not in existing_columns:
                alterations.append("ADD COLUMN payout_reference VARCHAR(100) NULL COMMENT 'Reference used with provider'")
            
            if 'payout_provider_response' not in existing_columns:
                alterations.append("ADD COLUMN payout_provider_response TEXT NULL COMMENT 'Raw provider response payload for audit'")
            
            # Web3/Blockchain release tracking
            if 'release_transaction_hash' not in existing_columns:
                alterations.append("ADD COLUMN release_transaction_hash VARCHAR(100) NULL COMMENT 'Blockchain tx hash recorded via web3'")
            
            if 'release_block_number' not in existing_columns:
                alterations.append("ADD COLUMN release_block_number INT NULL COMMENT 'Blockchain block number when release recorded'")
            
            if 'released_via_web3' not in existing_columns:
                alterations.append("ADD COLUMN released_via_web3 BOOLEAN DEFAULT FALSE COMMENT 'Whether release was recorded on blockchain'")
            
            if alterations:
                alter_sql = f"ALTER TABLE escrows {', '.join(alterations)}"
                print(f"\nExecuting: {alter_sql}")
                conn.execute(text(alter_sql))
                conn.commit()
                print("✅ Successfully added payout and Web3 columns to escrows table!")
                
                # Show updated column list
                result = conn.execute(text("""
                    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = DATABASE() 
                    AND TABLE_NAME = 'escrows'
                    AND COLUMN_NAME IN ('control_number', 'payout_method', 'payout_details', 'payout_status', 
                                       'payout_reference', 'payout_provider_response', 'release_transaction_hash', 
                                       'release_block_number', 'released_via_web3')
                    ORDER BY ORDINAL_POSITION
                """))
                print("\nNew/Updated columns:")
                for row in result:
                    print(f"  - {row[0]} ({row[1]}) - {row[4] or 'No comment'}")
            else:
                print("✅ All payout and Web3 columns already exist!")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Adding payout and Web3 columns to escrows table...")
    if add_escrow_payout_columns():
        print("🎉 Migration completed successfully!")
    else:
        print("💥 Migration failed!")
        sys.exit(1)

