#!/usr/bin/env python3
"""
Database migration script for Real Estate tables
Run this script to create all the necessary tables for the real estate module
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

def create_real_estate_tables():
    """Create all real estate related tables"""
    
    engine = create_engine(DATABASE_URL)
    
    # SQL statements to create tables
    create_tables_sql = [
        """
        CREATE TABLE IF NOT EXISTS properties (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            property_type ENUM('plot', 'house', 'apartment', 'commercial', 'office', 'warehouse', 'shop') NOT NULL,
            status ENUM('available', 'sold', 'rented', 'pending', 'off_market') DEFAULT 'available',
            verification_status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
            
            -- Location Details
            region VARCHAR(100) NOT NULL,
            district VARCHAR(100) NOT NULL,
            council VARCHAR(100) NOT NULL,
            locality VARCHAR(100) NOT NULL,
            street VARCHAR(200),
            ward VARCHAR(100),
            postal_code VARCHAR(20),
            latitude FLOAT,
            longitude FLOAT,
            
            -- Pricing
            price FLOAT NOT NULL,
            estimated_value FLOAT,
            
            -- Property Details
            size FLOAT,
            area FLOAT,
            bedrooms INT,
            bathrooms INT,
            kitchen VARCHAR(50),
            year_built INT,
            `condition` VARCHAR(50),
            furnishing ENUM('Furnished', 'Semi-furnished', 'Unfurnished'),
            parking VARCHAR(100),
            security VARCHAR(100),
            utilities VARCHAR(200),
            features TEXT,
            
            -- Plot Specific Fields
            lot_number VARCHAR(50),
            legal_area VARCHAR(100),
            lot_type VARCHAR(50),
            lot_use ENUM('Mixed Use', 'Residential', 'Commercial', 'Industrial', 'Agricultural', 'Recreational'),
            block VARCHAR(50),
            
            -- Building Specific Fields
            total_area FLOAT,
            nearby_landmarks VARCHAR(200),
            access_road VARCHAR(100),
            
            -- Ownership and Contact
            owner_id INT NOT NULL,
            contact_name VARCHAR(100) NOT NULL,
            contact_role VARCHAR(50) NOT NULL,
            contact_phone VARCHAR(20) NOT NULL,
            contact_email VARCHAR(100) NOT NULL,
            
            -- Documents
            national_id_number VARCHAR(50),
            national_id_photo_path VARCHAR(500),
            supporting_document_type VARCHAR(100),
            supporting_document_path VARCHAR(500),
            title_deed_path VARCHAR(500),
            
            -- GPS Boundary Mapping
            boundary_points INT DEFAULT 0,
            boundary_distance FLOAT DEFAULT 0.0,
            boundary_coordinates JSON,
            
            -- Timestamps
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            INDEX idx_owner_id (owner_id),
            INDEX idx_property_type (property_type),
            INDEX idx_status (status),
            INDEX idx_region (region),
            INDEX idx_district (district),
            INDEX idx_price (price),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        
        """
        CREATE TABLE IF NOT EXISTS property_images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            property_id INT NOT NULL,
            image_path VARCHAR(500) NOT NULL,
            image_type VARCHAR(50) DEFAULT 'property',
            is_primary BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
            INDEX idx_property_id (property_id),
            INDEX idx_image_type (image_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        
        """
        CREATE TABLE IF NOT EXISTS property_listings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            property_id INT NOT NULL,
            listing_type VARCHAR(50) DEFAULT 'sale',
            listing_price FLOAT NOT NULL,
            listing_description TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            listing_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            listing_end_date TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
            INDEX idx_property_id (property_id),
            INDEX idx_listing_type (listing_type),
            INDEX idx_is_active (is_active),
            INDEX idx_listing_price (listing_price)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        
        """
        CREATE TABLE IF NOT EXISTS investment_projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            category VARCHAR(50) NOT NULL,
            location VARCHAR(200) NOT NULL,
            
            -- Project Details
            land_size VARCHAR(100),
            zoning VARCHAR(100),
            access VARCHAR(100),
            duration VARCHAR(50),
            development_stage VARCHAR(50),
            status VARCHAR(50) DEFAULT 'active',
            
            -- Financial Details
            total_project_value FLOAT NOT NULL,
            minimum_investment FLOAT NOT NULL,
            current_investors INT DEFAULT 0,
            target_investors INT NOT NULL,
            funding_progress FLOAT DEFAULT 0.0,
            expected_roi FLOAT NOT NULL,
            investment_deadline VARCHAR(50),
            
            -- Location Coordinates
            latitude FLOAT,
            longitude FLOAT,
            
            -- Project Features
            features JSON,
            
            -- Ownership
            project_manager_id INT NOT NULL,
            contact_name VARCHAR(100) NOT NULL,
            contact_role VARCHAR(50) NOT NULL,
            contact_phone VARCHAR(20) NOT NULL,
            contact_email VARCHAR(100) NOT NULL,
            
            -- Timestamps
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            INDEX idx_project_manager_id (project_manager_id),
            INDEX idx_category (category),
            INDEX idx_status (status),
            INDEX idx_minimum_investment (minimum_investment),
            INDEX idx_expected_roi (expected_roi),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        
        """
        CREATE TABLE IF NOT EXISTS project_investments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            project_id INT NOT NULL,
            investor_id INT NOT NULL,
            investment_amount FLOAT NOT NULL,
            investment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(50) DEFAULT 'active',
            expected_return FLOAT,
            actual_return FLOAT,
            
            FOREIGN KEY (project_id) REFERENCES investment_projects(id) ON DELETE CASCADE,
            INDEX idx_project_id (project_id),
            INDEX idx_investor_id (investor_id),
            INDEX idx_investment_date (investment_date),
            INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        
        """
        CREATE TABLE IF NOT EXISTS project_images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            project_id INT NOT NULL,
            image_path VARCHAR(500) NOT NULL,
            image_type VARCHAR(50) DEFAULT 'project',
            is_primary BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (project_id) REFERENCES investment_projects(id) ON DELETE CASCADE,
            INDEX idx_project_id (project_id),
            INDEX idx_image_type (image_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        
        """
        CREATE TABLE IF NOT EXISTS user_properties (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            property_id INT NOT NULL,
            acquisition_date TIMESTAMP NOT NULL,
            acquisition_price FLOAT NOT NULL,
            current_value FLOAT,
            verification_status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
            is_for_sale BOOLEAN DEFAULT FALSE,
            is_for_rent BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_property_id (property_id),
            INDEX idx_verification_status (verification_status),
            INDEX idx_is_for_sale (is_for_sale),
            INDEX idx_is_for_rent (is_for_rent)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """
    ]
    
    try:
        with engine.connect() as connection:
            print("Creating real estate tables...")
            
            for i, sql in enumerate(create_tables_sql, 1):
                print(f"Creating table {i}/{len(create_tables_sql)}...")
                connection.execute(text(sql))
                connection.commit()
            
            print("✅ All real estate tables created successfully!")
            
            # Verify tables were created
            result = connection.execute(text("SHOW TABLES"))
            tables = result.fetchall()
            real_estate_tables = [table[0] for table in tables if any(keyword in table[0] for keyword in ['properties', 'investment', 'project'])]
            print(f"Created tables: {real_estate_tables}")
            
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False
    
    return True

def create_upload_directories():
    """Create necessary upload directories"""
    directories = [
        "uploads",
        "uploads/properties",
        "uploads/properties/images",
        "uploads/properties/documents",
        "uploads/projects",
        "uploads/projects/images"
    ]
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Created directory: {directory}")
        else:
            print(f"Directory already exists: {directory}")

if __name__ == "__main__":
    print("🚀 Starting Real Estate Database Migration...")
    
    # Create upload directories
    create_upload_directories()
    
    # Create database tables
    if create_real_estate_tables():
        print("🎉 Migration completed successfully!")
    else:
        print("💥 Migration failed!")
        sys.exit(1)
