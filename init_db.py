#!/usr/bin/env python3
"""
Database initialization script for Aris Portal
Creates the MySQL database and tables
"""

import pymysql
import os
from dotenv import load_dotenv

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
            password=os.getenv('MYSQL_PASSWORD', 'password'),
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # Create database
            database_name = os.getenv('MYSQL_DATABASE', 'arisportal')
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
            print(f"Database '{database_name}' created successfully")
            
            # Use the database
            cursor.execute(f"USE {database_name}")
            
            # Create tables
            create_tables(cursor)
            
        connection.close()
        print("Database initialization completed successfully!")
        
    except Exception as e:
        print(f"Error creating database: {e}")

def create_tables(cursor):
    """Create all necessary tables"""
    
    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(120) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            role ENUM('admin', 'mentor', 'investor', 'entrepreneur') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        )
    """)
    print("Users table created")
    
    # Properties table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS properties (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            property_type ENUM('house', 'apartment', 'commercial', 'land') NOT NULL,
            price DECIMAL(15,2) NOT NULL,
            location VARCHAR(200) NOT NULL,
            area FLOAT,
            bedrooms INT,
            bathrooms INT,
            status ENUM('available', 'sold', 'rented', 'pending') DEFAULT 'available',
            owner_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)
    print("Properties table created")
    
    # Investment projects table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS investment_projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            category ENUM('agriculture', 'energy', 'infrastructure', 'real_estate') NOT NULL,
            location VARCHAR(200) NOT NULL,
            total_value DECIMAL(15,2) NOT NULL,
            minimum_investment DECIMAL(15,2) NOT NULL,
            expected_roi FLOAT,
            duration VARCHAR(100),
            status ENUM('active', 'funded', 'completed', 'cancelled') DEFAULT 'active',
            funding_progress FLOAT DEFAULT 0.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    """)
    print("Investment projects table created")
    
    # Investments table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS investments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            investor_id INT NOT NULL,
            project_id INT NOT NULL,
            amount DECIMAL(15,2) NOT NULL,
            status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (investor_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (project_id) REFERENCES investment_projects(id) ON DELETE CASCADE
        )
    """)
    print("Investments table created")
    
    # Transactions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            amount DECIMAL(15,2) NOT NULL,
            transaction_type ENUM('deposit', 'withdrawal', 'investment', 'payment') NOT NULL,
            description VARCHAR(500),
            status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
            reference_id VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)
    print("Transactions table created")

if __name__ == '__main__':
    create_database()
