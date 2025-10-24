#!/usr/bin/env python3
"""
Script to create database tables for the escrow system
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv(
    'DATABASE_URL', 
    'mysql+pymysql://root@localhost:3306/arisportal'
)

# Create engine
engine = create_engine(DATABASE_URL)

# Create base class for models
Base = declarative_base()

# Import all models to ensure they are registered
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.escrow import Escrow, EscrowMilestone

def create_tables():
    """Create all database tables"""
    try:
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # List created tables
        print("\nCreated tables:")
        for table_name in Base.metadata.tables.keys():
            print(f"  - {table_name}")
            
    except Exception as e:
        print(f"❌ Error creating tables: {str(e)}")

if __name__ == "__main__":
    create_tables()
