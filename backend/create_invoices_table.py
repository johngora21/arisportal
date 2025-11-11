"""
Script to create the invoices table in the database.
Run this script to add the invoices table to your database.
"""
import pymysql
from database import engine
from sqlalchemy import text

def create_invoices_table():
    """Create the invoices table"""
    
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        invoice_number VARCHAR(50) NOT NULL UNIQUE,
        control_number VARCHAR(50) NOT NULL UNIQUE,
        issue_date DATETIME NOT NULL,
        due_date DATETIME NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NULL,
        client_phone VARCHAR(50) NULL,
        client_address TEXT NULL,
        items TEXT NULL,
        subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
        tax_rate DECIMAL(5, 2) NULL DEFAULT 0.00,
        tax_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
        discount DECIMAL(15, 2) NULL DEFAULT 0.00,
        discount_rate DECIMAL(5, 2) NULL DEFAULT 0.00,
        total DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
        amount_paid DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
        currency VARCHAR(3) DEFAULT 'TZS',
        status ENUM('DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
        clickpesa_customer_name VARCHAR(255) NULL,
        clickpesa_bill_description VARCHAR(500) NULL,
        clickpesa_bill_reference VARCHAR(100) NULL,
        notes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        paid_at DATETIME NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_invoice_number (invoice_number),
        INDEX idx_control_number (control_number),
        INDEX idx_status (status),
        FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    try:
        with engine.connect() as conn:
            conn.execute(text(create_table_sql))
            conn.commit()
            print("✅ Invoices table created successfully!")
    except Exception as e:
        print(f"❌ Error creating invoices table: {str(e)}")
        raise

if __name__ == "__main__":
    create_invoices_table()
