#!/usr/bin/env python3
"""
Initialize supplier database with sample data
"""

from app import app, db
from models.supplier import Supplier
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_supplier_db():
    """Initialize supplier database with sample data"""
    with app.app_context():
        try:
            # Create tables
            db.create_all()
            logger.info("Database tables created successfully")
            
            # Check if suppliers already exist
            existing_suppliers = Supplier.query.count()
            if existing_suppliers > 0:
                logger.info(f"Suppliers already exist ({existing_suppliers} found). Skipping sample data.")
                return
            
            # Sample supplier data
            sample_suppliers = [
                {
                    "name": "TechHub Ltd",
                    "category": "Electronics",
                    "location": "Dar es Salaam",
                    "country": "Tanzania",
                    "contact": {
                        "phone": "+255 22 123 4567",
                        "email": "info@techhub.co.tz",
                        "website": "https://techhub.co.tz",
                        "address": "Kariakoo Market, Dar es Salaam"
                    },
                    "priceRange": "TZS 45,000 - 120,000",
                    "bulkDiscount": "10% off 100+ units",
                    "minOrder": "50 units",
                    "leadTime": "7 days",
                    "tags": ["Laptops", "Phones", "Tablets", "Accessories"],
                    "specialties": ["Custom Electronics", "Bulk Orders", "Technical Support"],
                    "paymentMethods": ["Bank Transfer", "Mobile Money", "Credit Card"],
                    "deliveryAreas": ["Dar es Salaam", "Arusha", "Mwanza"],
                    "coordinates": {"lat": -6.7789, "lng": 39.2567},
                    "isVerified": True
                },
                {
                    "name": "OfficePro Furniture",
                    "category": "Furniture",
                    "location": "Arusha",
                    "country": "Tanzania",
                    "contact": {
                        "phone": "+255 27 987 6543",
                        "email": "sales@officepro.co.tz",
                        "website": "https://officepro.co.tz",
                        "address": "Industrial Area, Arusha"
                    },
                    "priceRange": "TZS 85,000 - 250,000",
                    "bulkDiscount": "15% off 50+ units",
                    "minOrder": "20 units",
                    "leadTime": "14 days",
                    "tags": ["Desks", "Chairs", "Storage", "Office Equipment"],
                    "specialties": ["Custom Furniture", "Office Setup", "Bulk Orders"],
                    "paymentMethods": ["Bank Transfer", "Mobile Money"],
                    "deliveryAreas": ["Arusha", "Dar es Salaam", "Dodoma"],
                    "coordinates": {"lat": -3.3869, "lng": 36.6830},
                    "isVerified": True
                },
                {
                    "name": "SoundMax Electronics",
                    "category": "Electronics",
                    "location": "Mwanza",
                    "country": "Tanzania",
                    "contact": {
                        "phone": "+255 28 555 1234",
                        "email": "info@soundmax.co.tz",
                        "website": "https://soundmax.co.tz",
                        "address": "City Center, Mwanza"
                    },
                    "priceRange": "TZS 35,000 - 95,000",
                    "bulkDiscount": "12% off 200+ units",
                    "minOrder": "100 units",
                    "leadTime": "5 days",
                    "tags": ["Speakers", "Headphones", "Audio Systems", "Microphones"],
                    "specialties": ["Audio Equipment", "Sound Systems", "Bulk Orders"],
                    "paymentMethods": ["Bank Transfer", "Mobile Money", "Cash"],
                    "deliveryAreas": ["Mwanza", "Dar es Salaam", "Arusha"],
                    "coordinates": {"lat": -2.5164, "lng": 32.9176},
                    "isVerified": True
                },
                {
                    "name": "ComfortZone Furniture",
                    "category": "Furniture",
                    "location": "Dodoma",
                    "country": "Tanzania",
                    "contact": {
                        "phone": "+255 26 777 8888",
                        "email": "orders@comfortzone.co.tz",
                        "website": "https://comfortzone.co.tz",
                        "address": "Commercial Street, Dodoma"
                    },
                    "priceRange": "TZS 95,000 - 280,000",
                    "bulkDiscount": "8% off 30+ units",
                    "minOrder": "15 units",
                    "leadTime": "21 days",
                    "tags": ["Sofas", "Tables", "Beds", "Living Room"],
                    "specialties": ["Home Furniture", "Custom Design", "Bulk Orders"],
                    "paymentMethods": ["Bank Transfer", "Mobile Money"],
                    "deliveryAreas": ["Dodoma", "Dar es Salaam", "Arusha"],
                    "coordinates": {"lat": -6.1630, "lng": 35.7516},
                    "isVerified": False
                }
            ]
            
            # Create suppliers
            for supplier_data in sample_suppliers:
                supplier = Supplier.from_dict(supplier_data)
                db.session.add(supplier)
            
            db.session.commit()
            logger.info(f"Successfully created {len(sample_suppliers)} sample suppliers")
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error initializing supplier database: {str(e)}")
            raise e

if __name__ == "__main__":
    init_supplier_db()
