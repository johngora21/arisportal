"""
Create card_ledger_entries table for accounting debit/credit entries
"""
from database import engine, Base
from models.card_ledger import CardLedgerEntry
from sqlalchemy import text

def create_card_ledger_table():
    """Create the card_ledger_entries table"""
    try:
        # Create the table
        CardLedgerEntry.__table__.create(bind=engine, checkfirst=True)
        print("✅ card_ledger_entries table created successfully")
        
        # Verify table exists
        with engine.connect() as conn:
            result = conn.execute(text("SHOW TABLES LIKE 'card_ledger_entries'"))
            if result.fetchone():
                print("✅ Verified: card_ledger_entries table exists")
            else:
                print("❌ Warning: card_ledger_entries table not found")
                
    except Exception as e:
        print(f"❌ Error creating card_ledger_entries table: {str(e)}")
        raise

if __name__ == "__main__":
    create_card_ledger_table()

