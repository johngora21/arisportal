#!/usr/bin/env python3
"""
Script to insert sample real estate data into the database
"""

import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv(
    'DATABASE_URL', 
    'mysql+pymysql://root@localhost:3306/arisportal'
)

def insert_sample_data():
    """Insert sample real estate data"""
    
    engine = create_engine(DATABASE_URL)
    
    # Sample properties data
    sample_properties = [
        {
            'title': 'Prime Commercial Plot - Kinondoni',
            'description': 'Prime commercial plot in Kinondoni with excellent road access and utilities nearby. Perfect for commercial development.',
            'property_type': 'plot',
            'status': 'available',
            'verification_status': 'approved',
            'region': 'Dar es Salaam',
            'district': 'Kinondoni',
            'council': 'Kinondoni',
            'locality': 'Kinondoni',
            'street': 'Kinondoni Road',
            'price': 250000000,
            'size': 2500,
            'contact_name': 'John Mwalimu',
            'contact_role': 'Property Owner',
            'contact_phone': '+255 754 123 456',
            'contact_email': 'john.mwalimu@email.com',
            'owner_id': 1,
            'latitude': -6.7924,
            'longitude': 39.2083,
            'features': 'Road Access, Utilities Nearby, Commercial Zone',
            'utilities': 'Water, Electricity, Security'
        },
        {
            'title': 'Residential Plot - Masaki',
            'description': 'Beautiful residential plot in Masaki with ocean views. Ideal for luxury home construction.',
            'property_type': 'plot',
            'status': 'available',
            'verification_status': 'approved',
            'region': 'Dar es Salaam',
            'district': 'Kinondoni',
            'council': 'Kinondoni',
            'locality': 'Masaki',
            'street': 'Masaki Road',
            'price': 180000000,
            'size': 1200,
            'contact_name': 'Sarah Kimaro',
            'contact_role': 'Real Estate Agent',
            'contact_phone': '+255 755 987 654',
            'contact_email': 'sarah.kimaro@email.com',
            'owner_id': 1,
            'latitude': -6.7789,
            'longitude': 39.2567,
            'features': 'Ocean Views, Quiet Neighborhood, Luxury Area',
            'utilities': 'Water, Electricity, Security, Gated Community'
        },
        {
            'title': 'Modern Office Complex - CBD',
            'description': 'Modern 8-story office complex in the heart of CBD with premium finishes and modern amenities.',
            'property_type': 'commercial',
            'status': 'available',
            'verification_status': 'approved',
            'region': 'Dar es Salaam',
            'district': 'Ilala',
            'council': 'Ilala',
            'locality': 'CBD',
            'street': 'CBD Street',
            'price': 450000000,
            'size': 3200,
            'bedrooms': 0,
            'bathrooms': 8,
            'kitchen': '2',
            'contact_name': 'David Mwamba',
            'contact_role': 'Property Developer',
            'contact_phone': '+255 754 111 222',
            'contact_email': 'david.mwamba@email.com',
            'owner_id': 1,
            'latitude': -6.7924,
            'longitude': 39.2083,
            'features': 'Modern Design, Premium Location, High-Speed Elevators',
            'utilities': 'Parking, Security, Air Conditioning, Generator'
        },
        {
            'title': 'Luxury Apartment Building - Masaki',
            'description': 'Luxury 6-story apartment building with ocean views and premium amenities in Masaki.',
            'property_type': 'apartment',
            'status': 'available',
            'verification_status': 'approved',
            'region': 'Dar es Salaam',
            'district': 'Kinondoni',
            'council': 'Kinondoni',
            'locality': 'Masaki',
            'street': 'Masaki Road',
            'price': 380000000,
            'size': 2800,
            'bedrooms': 24,
            'bathrooms': 24,
            'kitchen': '24',
            'contact_name': 'Grace Mwangi',
            'contact_role': 'Real Estate Agent',
            'contact_phone': '+255 755 333 444',
            'contact_email': 'grace.mwangi@email.com',
            'owner_id': 1,
            'latitude': -6.7789,
            'longitude': 39.2567,
            'features': 'Ocean Views, Luxury Finishes, Modern Design',
            'utilities': 'Swimming Pool, Gym, Parking, Security, Generator'
        },
        {
            'title': 'Industrial Land - Kigamboni',
            'description': 'Large industrial plot in Kigamboni with excellent port access. Perfect for manufacturing or warehousing.',
            'property_type': 'plot',
            'status': 'available',
            'verification_status': 'approved',
            'region': 'Dar es Salaam',
            'district': 'Temeke',
            'council': 'Temeke',
            'locality': 'Kigamboni',
            'street': 'Kigamboni Road',
            'price': 320000000,
            'size': 5000,
            'contact_name': 'Ahmed Hassan',
            'contact_role': 'Property Developer',
            'contact_phone': '+255 756 456 789',
            'contact_email': 'ahmed.hassan@email.com',
            'owner_id': 1,
            'latitude': -6.8234,
            'longitude': 39.3456,
            'features': 'Port Access, Industrial Zone, Heavy Duty Access',
            'utilities': 'Water, Electricity, Rail Access'
        }
    ]

    # Sample investment projects data
    sample_projects = [
        {
            'title': 'Masaki Commercial Complex',
            'description': 'Modern commercial complex with retail spaces, offices, and parking facilities in prime Masaki location.',
            'category': 'commercial',
            'location': 'Masaki, Dar es Salaam',
            'status': 'active',
            'total_project_value': 500000000,
            'minimum_investment': 5000000,
            'current_investors': 12,
            'target_investors': 50,
            'funding_progress': 24.0,
            'expected_roi': 15.0,
            'duration': '24 months',
            'project_manager_id': 1,
            'contact_name': 'John Mwalimu',
            'contact_role': 'Project Manager',
            'contact_phone': '+255 754 123 456',
            'contact_email': 'john.mwalimu@email.com',
            'latitude': -6.7789,
            'longitude': 39.2567
        },
        {
            'title': 'Kinondoni Residential Development',
            'description': 'Affordable housing development with 50 units targeting middle-income families.',
            'category': 'residential',
            'location': 'Kinondoni, Dar es Salaam',
            'status': 'active',
            'total_project_value': 300000000,
            'minimum_investment': 2000000,
            'current_investors': 8,
            'target_investors': 30,
            'funding_progress': 27.0,
            'expected_roi': 12.0,
            'duration': '18 months',
            'project_manager_id': 1,
            'contact_name': 'Sarah Kimaro',
            'contact_role': 'Project Manager',
            'contact_phone': '+255 755 987 654',
            'contact_email': 'sarah.kimaro@email.com',
            'latitude': -6.7924,
            'longitude': 39.2083
        },
        {
            'title': 'CBD Office Tower',
            'description': 'Premium office tower with modern amenities and prime CBD location.',
            'category': 'commercial',
            'location': 'CBD, Dar es Salaam',
            'status': 'active',
            'total_project_value': 800000000,
            'minimum_investment': 10000000,
            'current_investors': 25,
            'target_investors': 40,
            'funding_progress': 63.0,
            'expected_roi': 18.0,
            'duration': '36 months',
            'project_manager_id': 1,
            'contact_name': 'David Mwamba',
            'contact_role': 'Project Manager',
            'contact_phone': '+255 754 111 222',
            'contact_email': 'david.mwamba@email.com',
            'latitude': -6.7924,
            'longitude': 39.2083
        }
    ]

    try:
        with engine.connect() as connection:
            print("Inserting sample properties...")
            
            # Insert properties
            for prop in sample_properties:
                # Handle optional fields
                bedrooms = prop.get('bedrooms', None)
                bathrooms = prop.get('bathrooms', None)
                kitchen = prop.get('kitchen', None)
                
                insert_property_sql = """
                INSERT INTO properties (
                    title, description, property_type, status, verification_status,
                    region, district, council, locality, street, price, size,
                    bedrooms, bathrooms, kitchen, contact_name, contact_role,
                    contact_phone, contact_email, owner_id, latitude, longitude,
                    features, utilities, created_at, updated_at
                ) VALUES (
                    :title, :description, :property_type, :status, :verification_status,
                    :region, :district, :council, :locality, :street, :price, :size,
                    :bedrooms, :bathrooms, :kitchen, :contact_name, :contact_role,
                    :contact_phone, :contact_email, :owner_id, :latitude, :longitude,
                    :features, :utilities, NOW(), NOW()
                )
                """
                
                # Add optional fields to the data
                prop_data = {
                    **prop,
                    'bedrooms': bedrooms,
                    'bathrooms': bathrooms,
                    'kitchen': kitchen
                }
                
                connection.execute(text(insert_property_sql), prop_data)
            
            print("Inserting sample investment projects...")
            
            # Insert investment projects
            for project in sample_projects:
                insert_project_sql = """
                INSERT INTO investment_projects (
                    title, description, category, location, status,
                    total_project_value, minimum_investment, current_investors,
                    target_investors, funding_progress, expected_roi, duration,
                    project_manager_id, contact_name, contact_role,
                    contact_phone, contact_email, latitude, longitude,
                    created_at, updated_at
                ) VALUES (
                    :title, :description, :category, :location, :status,
                    :total_project_value, :minimum_investment, :current_investors,
                    :target_investors, :funding_progress, :expected_roi, :duration,
                    :project_manager_id, :contact_name, :contact_role,
                    :contact_phone, :contact_email, :latitude, :longitude,
                    NOW(), NOW()
                )
                """
                connection.execute(text(insert_project_sql), project)
            
            connection.commit()
            print("✅ Sample data inserted successfully!")
            
            # Verify data
            result = connection.execute(text("SELECT COUNT(*) FROM properties"))
            prop_count = result.fetchone()[0]
            print(f"Properties in database: {prop_count}")
            
            result = connection.execute(text("SELECT COUNT(*) FROM investment_projects"))
            project_count = result.fetchone()[0]
            print(f"Investment projects in database: {project_count}")
            
    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Inserting sample real estate data...")
    
    if insert_sample_data():
        print("🎉 Sample data insertion completed successfully!")
    else:
        print("💥 Sample data insertion failed!")
        sys.exit(1)
