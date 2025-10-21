#!/usr/bin/env python3
"""
CRM Database Schema - Well Organized MySQL Database
Creates all tables for the Customer Relationship Management system
"""

import pymysql
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

def create_database():
    """Create the MySQL database"""
    try:
        # Connect to MySQL server (without specifying database)
        connection = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', ''),
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # Create database
            database_name = os.getenv('MYSQL_DATABASE', 'arisportal_crm')
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
            print(f"Database '{database_name}' created successfully")
            
            # Use the database
            cursor.execute(f"USE {database_name}")
            
            # Create all tables
            create_users_table(cursor)
            create_contacts_table(cursor)
            create_deals_table(cursor)
            create_deal_items_table(cursor)
            create_communications_table(cursor)
            create_notes_table(cursor)
            create_activities_table(cursor)
            create_tags_table(cursor)
            create_contact_tags_table(cursor)
            create_deal_tags_table(cursor)
            create_analytics_views(cursor)
            
        connection.close()
        print("CRM Database initialization completed successfully!")
        
    except Exception as e:
        print(f"Error creating database: {e}")

def create_users_table(cursor):
    """Create users table for authentication and user management"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(120) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            role ENUM('admin', 'manager', 'sales_rep', 'viewer') NOT NULL DEFAULT 'sales_rep',
            department VARCHAR(50),
            phone VARCHAR(20),
            avatar_url VARCHAR(255),
            is_active BOOLEAN DEFAULT TRUE,
            last_login TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            INDEX idx_email (email),
            INDEX idx_role (role),
            INDEX idx_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)
    print("Users table created")

def create_contacts_table(cursor):
    """Create contacts table for customer/lead management"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            company VARCHAR(200),
            job_title VARCHAR(100),
            email VARCHAR(120),
            phone VARCHAR(20),
            whatsapp VARCHAR(20),
            address TEXT,
            city VARCHAR(100),
            state VARCHAR(100),
            country VARCHAR(100),
            postal_code VARCHAR(20),
            website VARCHAR(255),
            linkedin_url VARCHAR(255),
            status ENUM('lead', 'prospect', 'customer', 'inactive', 'qualified', 'unqualified') DEFAULT 'lead',
            source ENUM('website', 'referral', 'cold_call', 'email', 'social_media', 'trade_show', 'other') DEFAULT 'other',
            lead_score INT DEFAULT 0,
            estimated_value DECIMAL(15,2) DEFAULT 0.00,
            last_contact_date TIMESTAMP NULL,
            next_follow_up TIMESTAMP NULL,
            owner_id INT,
            created_by INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
            
            INDEX idx_name (name),
            INDEX idx_email (email),
            INDEX idx_company (company),
            INDEX idx_status (status),
            INDEX idx_source (source),
            INDEX idx_owner (owner_id),
            INDEX idx_created_by (created_by),
            INDEX idx_last_contact (last_contact_date),
            INDEX idx_next_followup (next_follow_up)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)
    print("Contacts table created")

def create_deals_table(cursor):
    """Create deals table for sales opportunity management"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS deals (
            id INT AUTO_INCREMENT PRIMARY KEY,
            deal_name VARCHAR(200) NOT NULL,
            description TEXT,
            contact_id INT NOT NULL,
            owner_id INT NOT NULL,
            stage ENUM('lead', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost') DEFAULT 'lead',
            probability INT DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
            estimated_value DECIMAL(15,2) NOT NULL DEFAULT 0.00,
            actual_value DECIMAL(15,2) DEFAULT 0.00,
            currency VARCHAR(3) DEFAULT 'USD',
            expected_close_date DATE,
            actual_close_date DATE,
            deal_type ENUM('new_business', 'upsell', 'cross_sell', 'renewal') DEFAULT 'new_business',
            priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
            status ENUM('active', 'on_hold', 'cancelled', 'completed') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
            FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT,
            
            INDEX idx_deal_name (deal_name),
            INDEX idx_contact (contact_id),
            INDEX idx_owner (owner_id),
            INDEX idx_stage (stage),
            INDEX idx_status (status),
            INDEX idx_priority (priority),
            INDEX idx_close_date (expected_close_date),
            INDEX idx_value (estimated_value)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)
    print("Deals table created")

def create_deal_items_table(cursor):
    """Create deal_items table for product/service line items"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS deal_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            deal_id INT NOT NULL,
            product_name VARCHAR(200) NOT NULL,
            product_category VARCHAR(100),
            description TEXT,
            quantity INT NOT NULL DEFAULT 1,
            unit_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
            discount_percentage DECIMAL(5,2) DEFAULT 0.00,
            tax_rate DECIMAL(5,2) DEFAULT 0.00,
            total_amount DECIMAL(15,2) GENERATED ALWAYS AS (
                quantity * unit_price * (1 - discount_percentage/100) * (1 + tax_rate/100)
            ) STORED,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
            
            INDEX idx_deal (deal_id),
            INDEX idx_product (product_name),
            INDEX idx_category (product_category)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)
    print("Deal items table created")

def create_communications_table(cursor):
    """Create communications table for tracking all interactions"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS communications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            contact_id INT,
            deal_id INT,
            user_id INT NOT NULL,
            type ENUM('email', 'phone', 'meeting', 'note', 'task', 'sms', 'whatsapp') NOT NULL,
            direction ENUM('inbound', 'outbound') DEFAULT 'outbound',
            subject VARCHAR(255),
            content TEXT,
            status ENUM('sent', 'delivered', 'read', 'replied', 'failed', 'pending') DEFAULT 'sent',
            scheduled_at TIMESTAMP NULL,
            completed_at TIMESTAMP NULL,
            duration_minutes INT DEFAULT 0,
            outcome ENUM('positive', 'neutral', 'negative', 'no_response') DEFAULT 'neutral',
            follow_up_required BOOLEAN DEFAULT FALSE,
            follow_up_date TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
            FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
            
            INDEX idx_contact (contact_id),
            INDEX idx_deal (deal_id),
            INDEX idx_user (user_id),
            INDEX idx_type (type),
            INDEX idx_direction (direction),
            INDEX idx_status (status),
            INDEX idx_scheduled (scheduled_at),
            INDEX idx_completed (completed_at),
            INDEX idx_followup (follow_up_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)
    print("Communications table created")

def create_notes_table(cursor):
    """Create notes table for general notes and comments"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            contact_id INT,
            deal_id INT,
            user_id INT NOT NULL,
            title VARCHAR(255),
            content TEXT NOT NULL,
            is_private BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
            FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
            
            INDEX idx_contact (contact_id),
            INDEX idx_deal (deal_id),
            INDEX idx_user (user_id),
            INDEX idx_private (is_private),
            INDEX idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)
    print("Notes table created")

def create_activities_table(cursor):
    """Create activities table for tracking user activities and system events"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS activities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            contact_id INT,
            deal_id INT,
            activity_type ENUM('created', 'updated', 'deleted', 'viewed', 'emailed', 'called', 'met', 'task_completed') NOT NULL,
            entity_type ENUM('contact', 'deal', 'communication', 'note', 'user') NOT NULL,
            entity_id INT,
            description TEXT,
            old_values JSON,
            new_values JSON,
            ip_address VARCHAR(45),
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
            FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
            
            INDEX idx_user (user_id),
            INDEX idx_contact (contact_id),
            INDEX idx_deal (deal_id),
            INDEX idx_activity_type (activity_type),
            INDEX idx_entity_type (entity_type),
            INDEX idx_entity_id (entity_id),
            INDEX idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)
    print("Activities table created")

def create_tags_table(cursor):
    """Create tags table for flexible tagging system"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL,
            color VARCHAR(7) DEFAULT '#3B82F6',
            description TEXT,
            category ENUM('contact', 'deal', 'general') DEFAULT 'general',
            created_by INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
            
            INDEX idx_name (name),
            INDEX idx_category (category),
            INDEX idx_created_by (created_by)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)
    print("Tags table created")

def create_contact_tags_table(cursor):
    """Create contact_tags junction table"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contact_tags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            contact_id INT NOT NULL,
            tag_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
            
            UNIQUE KEY unique_contact_tag (contact_id, tag_id),
            INDEX idx_contact (contact_id),
            INDEX idx_tag (tag_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)
    print("Contact tags table created")

def create_deal_tags_table(cursor):
    """Create deal_tags junction table"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS deal_tags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            deal_id INT NOT NULL,
            tag_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
            
            UNIQUE KEY unique_deal_tag (deal_id, tag_id),
            INDEX idx_deal (deal_id),
            INDEX idx_tag (tag_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)
    print("Deal tags table created")

def create_analytics_views(cursor):
    """Create views for analytics and reporting"""
    
    # Sales pipeline view
    cursor.execute("""
        CREATE OR REPLACE VIEW sales_pipeline AS
        SELECT 
            d.id,
            d.deal_name,
            d.stage,
            d.probability,
            d.estimated_value,
            d.expected_close_date,
            c.name as contact_name,
            c.company,
            u.full_name as owner_name,
            CASE 
                WHEN d.stage = 'closed_won' THEN d.actual_value
                ELSE d.estimated_value * (d.probability / 100)
            END as weighted_value
        FROM deals d
        JOIN contacts c ON d.contact_id = c.id
        JOIN users u ON d.owner_id = u.id
        WHERE d.status = 'active'
    """)
    
    # Contact activity summary view
    cursor.execute("""
        CREATE OR REPLACE VIEW contact_activity_summary AS
        SELECT 
            c.id as contact_id,
            c.name,
            c.company,
            c.status,
            COUNT(DISTINCT comm.id) as total_communications,
            COUNT(DISTINCT d.id) as total_deals,
            SUM(CASE WHEN d.stage = 'closed_won' THEN d.actual_value ELSE 0 END) as total_revenue,
            MAX(comm.created_at) as last_communication,
            MAX(d.updated_at) as last_deal_update
        FROM contacts c
        LEFT JOIN communications comm ON c.id = comm.contact_id
        LEFT JOIN deals d ON c.id = d.contact_id
        GROUP BY c.id, c.name, c.company, c.status
    """)
    
    # Monthly sales performance view
    cursor.execute("""
        CREATE OR REPLACE VIEW monthly_sales_performance AS
        SELECT 
            YEAR(d.actual_close_date) as year,
            MONTH(d.actual_close_date) as month,
            COUNT(*) as deals_closed,
            SUM(d.actual_value) as total_revenue,
            AVG(d.actual_value) as avg_deal_size,
            COUNT(DISTINCT d.owner_id) as active_sales_reps
        FROM deals d
        WHERE d.stage = 'closed_won' 
        AND d.actual_close_date IS NOT NULL
        GROUP BY YEAR(d.actual_close_date), MONTH(d.actual_close_date)
        ORDER BY year DESC, month DESC
    """)
    
    print("Analytics views created")

if __name__ == '__main__':
    create_database()
