from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import JSON

# This will be initialized in the main app
db = None

class InventoryCategory(db.Model):
    __tablename__ = 'inventory_categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    item_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('InventoryItem', backref='category_ref', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'itemCount': self.item_count,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    legal_name = db.Column(db.String(200))
    registration_number = db.Column(db.String(100))
    tax_id = db.Column(db.String(100))
    website = db.Column(db.String(255))
    
    # Location information
    city = db.Column(db.String(100))
    region = db.Column(db.String(100))
    country = db.Column(db.String(100))
    address = db.Column(db.Text)
    
    # Contact information
    primary_contact_name = db.Column(db.String(100))
    primary_contact_title = db.Column(db.String(100))
    primary_contact_phone = db.Column(db.String(50))
    primary_contact_email = db.Column(db.String(255))
    
    secondary_contact_name = db.Column(db.String(100))
    secondary_contact_title = db.Column(db.String(100))
    secondary_contact_phone = db.Column(db.String(50))
    secondary_contact_email = db.Column(db.String(255))
    
    # Business information
    established_year = db.Column(db.Integer)
    employee_count = db.Column(db.String(50))
    annual_revenue = db.Column(db.String(50))
    
    # Status
    status = db.Column(db.String(50), default='active')  # active, inactive, suspended
    verification_status = db.Column(db.String(50), default='pending')  # verified, pending, rejected
    
    # Performance metrics
    overall_rating = db.Column(db.Float, default=0.0)
    quality_rating = db.Column(db.Float, default=0.0)
    delivery_rating = db.Column(db.Float, default=0.0)
    communication_rating = db.Column(db.Float, default=0.0)
    pricing_rating = db.Column(db.Float, default=0.0)
    total_reviews = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_contact_date = db.Column(db.DateTime)
    
    # Relationships
    items = db.relationship('InventoryItem', backref='supplier_ref', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'legalName': self.legal_name,
            'registrationNumber': self.registration_number,
            'taxId': self.tax_id,
            'website': self.website,
            'location': {
                'city': self.city,
                'region': self.region,
                'country': self.country,
                'address': self.address
            },
            'contact': {
                'primaryContact': {
                    'name': self.primary_contact_name,
                    'title': self.primary_contact_title,
                    'phone': self.primary_contact_phone,
                    'email': self.primary_contact_email
                },
                'secondaryContact': {
                    'name': self.secondary_contact_name,
                    'title': self.secondary_contact_title,
                    'phone': self.secondary_contact_phone,
                    'email': self.secondary_contact_email
                } if self.secondary_contact_name else None
            },
            'establishedYear': self.established_year,
            'employeeCount': self.employee_count,
            'annualRevenue': self.annual_revenue,
            'status': self.status,
            'verificationStatus': self.verification_status,
            'rating': {
                'overall': self.overall_rating,
                'quality': self.quality_rating,
                'delivery': self.delivery_rating,
                'communication': self.communication_rating,
                'pricing': self.pricing_rating,
                'totalReviews': self.total_reviews
            },
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
            'lastContactDate': self.last_contact_date.isoformat() if self.last_contact_date else None
        }

class InventoryItem(db.Model):
    __tablename__ = 'inventory_items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    sku = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    
    # Category and Supplier relationships
    category_id = db.Column(db.Integer, db.ForeignKey('inventory_categories.id'))
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'))
    
    # Inventory details
    unit = db.Column(db.String(50), nullable=False)  # pieces, kg, liters, etc.
    quantity = db.Column(db.Integer, default=0)
    min_quantity = db.Column(db.Integer, default=0)
    max_quantity = db.Column(db.Integer, default=0)
    unit_price = db.Column(db.Float, default=0.0)
    
    # Location and status
    location = db.Column(db.String(200))
    status = db.Column(db.String(50), default='in_stock')  # in_stock, low_stock, out_of_stock
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    stock_movements = db.relationship('StockMovement', backref='item_ref', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'sku': self.sku,
            'category': self.category_ref.name if self.category_ref else None,
            'description': self.description,
            'supplier': self.supplier_ref.name if self.supplier_ref else None,
            'unit': self.unit,
            'quantity': self.quantity,
            'minQuantity': self.min_quantity,
            'maxQuantity': self.max_quantity,
            'unitPrice': self.unit_price,
            'location': self.location,
            'status': self.status,
            'lastUpdated': self.last_updated.isoformat() if self.last_updated else None,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def update_status(self):
        """Update status based on current quantity"""
        if self.quantity == 0:
            self.status = 'out_of_stock'
        elif self.quantity <= self.min_quantity:
            self.status = 'low_stock'
        else:
            self.status = 'in_stock'
        self.last_updated = datetime.utcnow()

class StockMovement(db.Model):
    __tablename__ = 'stock_movements'
    
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('inventory_items.id'), nullable=False)
    
    # Movement details
    movement_type = db.Column(db.String(50), nullable=False)  # in, out, adjustment
    quantity = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.String(200))
    destination = db.Column(db.String(200))
    notes = db.Column(db.Text)
    
    # Reference information
    reference_number = db.Column(db.String(100))  # PO number, invoice number, etc.
    reference_type = db.Column(db.String(50))  # purchase_order, sale, adjustment, etc.
    
    # User who made the movement
    user_id = db.Column(db.Integer, default=1)  # Default to user ID 1
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'itemId': self.item_id,
            'itemName': self.item_ref.name if self.item_ref else None,
            'movementType': self.movement_type,
            'quantity': self.quantity,
            'reason': self.reason,
            'destination': self.destination,
            'notes': self.notes,
            'referenceNumber': self.reference_number,
            'referenceType': self.reference_type,
            'userId': self.user_id,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
