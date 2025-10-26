#!/usr/bin/env python3
"""
Database migration script to create users table
Run this script to set up the users table in your database
"""

import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models.user import Base, UserProfile, UserStatus
from database import DATABASE_URL

def create_tables():
    """Create all tables"""
    engine = create_engine(DATABASE_URL)
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Users table created successfully!")
        
        # Create sample user data
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        try:
            # Check if sample user already exists
            existing_user = db.query(UserProfile).filter(UserProfile.email == "john.doe@company.com").first()
            
            if not existing_user:
                # Create sample user
                sample_user = UserProfile(
                    email="john.doe@company.com",
                    password_hash="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K",  # "password123"
                    first_name="John",
                    last_name="Doe",
                    phone="+255 123 456 789",
                    nationality="Tanzanian",
                    address="Masaki, Dar es Salaam",
                    national_id_number="1234567890123456",
                    business_name="My Company Ltd",
                    business_type="Technology",
                    business_email="info@mycompany.com",
                    business_phone="+255 987 654 321",
                    country="Tanzania, United Republic of",
                    city="Dar es Salaam",
                    business_address="CBD, Dar es Salaam",
                    website="https://mycompany.com",
                    registration_number="REG123456789",
                    tax_id="TAX987654321",
                    status=UserStatus.ACTIVE,
                    email_verified=True,
                    profile_completed=True
                )
                
                db.add(sample_user)
                db.commit()
                print("✅ Sample user created successfully!")
                print(f"   Email: {sample_user.email}")
                print(f"   Name: {sample_user.full_name}")
                print(f"   Business: {sample_user.business_name}")
            else:
                print("ℹ️  Sample user already exists")
                
        except Exception as e:
            print(f"❌ Error creating sample user: {e}")
            db.rollback()
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False
    
    return True

def drop_tables():
    """Drop all tables (use with caution!)"""
    engine = create_engine(DATABASE_URL)
    
    try:
        Base.metadata.drop_all(bind=engine)
        print("✅ Users table dropped successfully!")
        return True
    except Exception as e:
        print(f"❌ Error dropping tables: {e}")
        return False

def show_tables():
    """Show all tables in the database"""
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """))
            
            tables = result.fetchall()
            print("📋 Current tables in database:")
            for table in tables:
                print(f"   - {table[0]}")
                
    except Exception as e:
        print(f"❌ Error showing tables: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "create":
            create_tables()
        elif command == "drop":
            confirm = input("⚠️  Are you sure you want to drop all tables? This will delete all data! (yes/no): ")
            if confirm.lower() == "yes":
                drop_tables()
            else:
                print("❌ Operation cancelled")
        elif command == "show":
            show_tables()
        else:
            print("❌ Unknown command. Use: create, drop, or show")
    else:
        print("🔧 Database Migration Tool")
        print("Usage: python create_users_table.py [command]")
        print("Commands:")
        print("  create  - Create users table and sample data")
        print("  drop    - Drop users table (DANGER: deletes all data)")
        print("  show    - Show all tables in database")
