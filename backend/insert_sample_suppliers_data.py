#!/usr/bin/env python3
"""
Script to insert sample suppliers data into the database
"""

import os
import sys
import json
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
    """Insert sample suppliers data"""
    
    engine = create_engine(DATABASE_URL)
    
    # Sample supplier categories
    sample_categories = [
        {
            'name': 'Electronics',
            'description': 'Electronic devices and components',
            'is_active': True
        },
        {
            'name': 'Fashion & Apparel',
            'description': 'Clothing, shoes, and fashion accessories',
            'is_active': True
        },
        {
            'name': 'Home & Garden',
            'description': 'Home improvement and garden supplies',
            'is_active': True
        },
        {
            'name': 'Automotive',
            'description': 'Car parts and automotive accessories',
            'is_active': True
        },
        {
            'name': 'Health & Beauty',
            'description': 'Health products and beauty supplies',
            'is_active': True
        }
    ]

    # Sample suppliers data
    sample_suppliers = [
        {
            'name': 'TechWorld Solutions',
            'legal_name': 'TechWorld Solutions Ltd',
            'registration_number': 'REG-TWS-2024-001',
            'tax_id': 'TAX-TWS-2024-001',
            'city': 'Dar es Salaam',
            'region': 'Dar es Salaam',
            'country': 'Tanzania',
            'address': 'Mikocheni Industrial Area, Dar es Salaam',
            'website': 'https://techworld.co.tz',
            'primary_contact_name': 'John Mwalimu',
            'primary_contact_title': 'Sales Manager',
            'primary_contact_phone': '+255 754 123 456',
            'primary_contact_email': 'john@techworld.co.tz',
            'categories': ['Electronics'],
            'specialties': ['Laptops', 'Smartphones', 'Tablets', 'Accessories'],
            'payment_methods': ['Bank Transfer', 'Mobile Money', 'Credit Card'],
            'delivery_methods': ['Express Delivery', 'Standard Shipping'],
            'minimum_order_quantity': 10,
            'minimum_order_unit': 'units',
            'standard_lead_time_days': 7,
            'return_policy': '30 days return policy',
            'warranty': '1 year manufacturer warranty',
            'delivery_terms': 'FOB Dar es Salaam',
            'pricing_tiers': ['TZS 45,000 - 120,000'],
            'bulk_discounts': ['10% off 100+ units', '15% off 500+ units'],
            'images': ['/uploads/suppliers/techworld-1.jpg', '/uploads/suppliers/techworld-2.jpg'],
            'videos': ['/uploads/suppliers/techworld-demo.mp4'],
            'status': 'active',
            'verification_status': 'verified'
        },
        {
            'name': 'Fashion Forward Ltd',
            'legal_name': 'Fashion Forward Limited',
            'registration_number': 'REG-FF-2024-002',
            'tax_id': 'TAX-FF-2024-002',
            'city': 'Arusha',
            'region': 'Arusha',
            'country': 'Tanzania',
            'address': 'Njiro Commercial Complex, Arusha',
            'website': 'https://fashionforward.co.tz',
            'primary_contact_name': 'Sarah Kimaro',
            'primary_contact_title': 'Business Development Manager',
            'primary_contact_phone': '+255 755 987 654',
            'primary_contact_email': 'sarah@fashionforward.co.tz',
            'categories': ['Fashion & Apparel'],
            'specialties': ['Women\'s Clothing', 'Men\'s Clothing', 'Shoes', 'Accessories'],
            'payment_methods': ['Bank Transfer', 'Mobile Money'],
            'delivery_methods': ['Standard Shipping', 'Express Delivery'],
            'minimum_order_quantity': 25,
            'minimum_order_unit': 'pieces',
            'standard_lead_time_days': 14,
            'return_policy': '14 days return policy',
            'warranty': 'Quality guarantee',
            'delivery_terms': 'CIF Tanzania',
            'pricing_tiers': ['TZS 25,000 - 85,000'],
            'bulk_discounts': ['5% off 50+ pieces', '12% off 200+ pieces'],
            'images': ['/uploads/suppliers/fashion-1.jpg', '/uploads/suppliers/fashion-2.jpg'],
            'videos': [],
            'status': 'active',
            'verification_status': 'verified'
        },
        {
            'name': 'HomeMax Supplies',
            'legal_name': 'HomeMax Supplies Co.',
            'registration_number': 'REG-HM-2024-003',
            'tax_id': 'TAX-HM-2024-003',
            'city': 'Mwanza',
            'region': 'Mwanza',
            'country': 'Tanzania',
            'address': 'Nyamagana Industrial Zone, Mwanza',
            'website': 'https://homemax.co.tz',
            'primary_contact_name': 'David Mwamba',
            'primary_contact_title': 'Operations Manager',
            'primary_contact_phone': '+255 754 111 222',
            'primary_contact_email': 'david@homemax.co.tz',
            'categories': ['Home & Garden'],
            'specialties': ['Furniture', 'Kitchen Appliances', 'Garden Tools', 'Home Decor'],
            'payment_methods': ['Bank Transfer', 'Mobile Money', 'Cash on Delivery'],
            'delivery_methods': ['Standard Shipping', 'White Glove Delivery'],
            'minimum_order_quantity': 5,
            'minimum_order_unit': 'items',
            'standard_lead_time_days': 21,
            'return_policy': '60 days return policy',
            'warranty': '2 years warranty',
            'delivery_terms': 'EXW Mwanza',
            'pricing_tiers': ['TZS 150,000 - 500,000'],
            'bulk_discounts': ['8% off 20+ items', '15% off 100+ items'],
            'images': ['/uploads/suppliers/homemax-1.jpg'],
            'videos': ['/uploads/suppliers/homemax-tour.mp4'],
            'status': 'active',
            'verification_status': 'verified'
        },
        {
            'name': 'AutoParts Pro',
            'legal_name': 'AutoParts Professional Ltd',
            'registration_number': 'REG-AP-2024-004',
            'tax_id': 'TAX-AP-2024-004',
            'city': 'Dodoma',
            'region': 'Dodoma',
            'country': 'Tanzania',
            'address': 'Dodoma Industrial Area, Dodoma',
            'website': 'https://autopartspro.co.tz',
            'primary_contact_name': 'Grace Mwangi',
            'primary_contact_title': 'Sales Director',
            'primary_contact_phone': '+255 755 333 444',
            'primary_contact_email': 'grace@autopartspro.co.tz',
            'categories': ['Automotive'],
            'specialties': ['Engine Parts', 'Brake Systems', 'Suspension', 'Electrical Components'],
            'payment_methods': ['Bank Transfer', 'Mobile Money'],
            'delivery_methods': ['Express Delivery', 'Standard Shipping'],
            'minimum_order_quantity': 15,
            'minimum_order_unit': 'parts',
            'standard_lead_time_days': 10,
            'return_policy': '90 days return policy',
            'warranty': '6 months warranty',
            'delivery_terms': 'FOB Dodoma',
            'pricing_tiers': ['TZS 80,000 - 300,000'],
            'bulk_discounts': ['12% off 50+ parts', '20% off 200+ parts'],
            'images': ['/uploads/suppliers/autoparts-1.jpg', '/uploads/suppliers/autoparts-2.jpg'],
            'videos': [],
            'status': 'active',
            'verification_status': 'verified'
        },
        {
            'name': 'Beauty Essentials',
            'legal_name': 'Beauty Essentials Tanzania',
            'registration_number': 'REG-BE-2024-005',
            'tax_id': 'TAX-BE-2024-005',
            'city': 'Tanga',
            'region': 'Tanga',
            'country': 'Tanzania',
            'address': 'Tanga Port Area, Tanga',
            'website': 'https://beautyessentials.co.tz',
            'primary_contact_name': 'Ahmed Hassan',
            'primary_contact_title': 'Import Manager',
            'primary_contact_phone': '+255 756 456 789',
            'primary_contact_email': 'ahmed@beautyessentials.co.tz',
            'categories': ['Health & Beauty'],
            'specialties': ['Skincare', 'Hair Care', 'Makeup', 'Health Supplements'],
            'payment_methods': ['Bank Transfer', 'Mobile Money', 'Credit Card'],
            'delivery_methods': ['Standard Shipping', 'Express Delivery'],
            'minimum_order_quantity': 20,
            'minimum_order_unit': 'units',
            'standard_lead_time_days': 5,
            'return_policy': '45 days return policy',
            'warranty': 'Quality guarantee',
            'delivery_terms': 'CIF Tanzania',
            'pricing_tiers': ['TZS 15,000 - 75,000'],
            'bulk_discounts': ['7% off 100+ units', '18% off 500+ units'],
            'images': ['/uploads/suppliers/beauty-1.jpg'],
            'videos': ['/uploads/suppliers/beauty-demo.mp4'],
            'status': 'active',
            'verification_status': 'verified'
        }
    ]

    try:
        with engine.connect() as connection:
            print("Checking existing supplier categories...")
            
            # Check if categories already exist
            result = connection.execute(text("SELECT COUNT(*) FROM supplier_categories"))
            existing_categories = result.fetchone()[0]
            
            if existing_categories == 0:
                print("Inserting sample supplier categories...")
                # Insert categories
                for category in sample_categories:
                    insert_category_sql = """
                    INSERT INTO supplier_categories (
                        name, description, is_active, created_at, updated_at
                    ) VALUES (
                        :name, :description, :is_active, NOW(), NOW()
                    )
                    """
                    connection.execute(text(insert_category_sql), category)
            else:
                print(f"Found {existing_categories} existing categories, skipping category insertion.")
            
            print("Inserting sample suppliers...")
            
            # Insert suppliers
            for supplier in sample_suppliers:
                insert_supplier_sql = """
                INSERT INTO suppliers (
                    name, legal_name, registration_number, tax_id, city, region, country,
                    address, website, primary_contact_name, primary_contact_title,
                    primary_contact_phone, primary_contact_email, categories, specialties,
                    payment_methods, delivery_methods, minimum_order_quantity, minimum_order_unit,
                    standard_lead_time_days, return_policy, warranty, delivery_terms,
                    pricing_tiers, bulk_discounts, images, videos, status, verification_status,
                    created_at, updated_at
                ) VALUES (
                    :name, :legal_name, :registration_number, :tax_id, :city, :region, :country,
                    :address, :website, :primary_contact_name, :primary_contact_title,
                    :primary_contact_phone, :primary_contact_email, :categories, :specialties,
                    :payment_methods, :delivery_methods, :minimum_order_quantity, :minimum_order_unit,
                    :standard_lead_time_days, :return_policy, :warranty, :delivery_terms,
                    :pricing_tiers, :bulk_discounts, :images, :videos, :status, :verification_status,
                    NOW(), NOW()
                )
                """
                
                # Convert arrays to JSON strings for MySQL
                supplier_data = {
                    **supplier,
                    'categories': json.dumps(supplier['categories']),
                    'specialties': json.dumps(supplier['specialties']),
                    'payment_methods': json.dumps(supplier['payment_methods']),
                    'delivery_methods': json.dumps(supplier['delivery_methods']),
                    'pricing_tiers': json.dumps(supplier['pricing_tiers']),
                    'bulk_discounts': json.dumps(supplier['bulk_discounts']),
                    'images': json.dumps(supplier['images']),
                    'videos': json.dumps(supplier['videos'])
                }
                
                connection.execute(text(insert_supplier_sql), supplier_data)
            
            connection.commit()
            print("✅ Sample suppliers data inserted successfully!")
            
            # Verify data
            result = connection.execute(text("SELECT COUNT(*) FROM supplier_categories"))
            category_count = result.fetchone()[0]
            print(f"Supplier categories in database: {category_count}")
            
            result = connection.execute(text("SELECT COUNT(*) FROM suppliers"))
            supplier_count = result.fetchone()[0]
            print(f"Suppliers in database: {supplier_count}")
            
    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Inserting sample suppliers data...")
    
    if insert_sample_data():
        print("🎉 Sample suppliers data insertion completed successfully!")
    else:
        print("💥 Sample suppliers data insertion failed!")
        sys.exit(1)
