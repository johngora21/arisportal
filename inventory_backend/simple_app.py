from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/inventory_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize extensions
db = SQLAlchemy(app)
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'])

# Models
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
    
    # Business information
    established_year = db.Column(db.Integer)
    employee_count = db.Column(db.String(50))
    annual_revenue = db.Column(db.String(50))
    
    # Status
    status = db.Column(db.String(50), default='active')
    verification_status = db.Column(db.String(50), default='pending')
    
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
                }
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
    unit = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, default=0)
    min_quantity = db.Column(db.Integer, default=0)
    max_quantity = db.Column(db.Integer, default=0)
    unit_price = db.Column(db.Float, default=0.0)
    
    # Location and status
    location = db.Column(db.String(200))
    status = db.Column(db.String(50), default='in_stock')
    
    # Supplier contact information
    supplier_name = db.Column(db.String(200))
    supplier_phone = db.Column(db.String(50))
    supplier_social = db.Column(db.Text)
    
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
            'supplier': self.supplier_name,
            'supplierContact': self.supplier_phone,
            'supplierSocial': self.supplier_social,
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
    movement_type = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.String(200))
    destination = db.Column(db.String(200))
    notes = db.Column(db.Text)
    
    # Reference information
    reference_number = db.Column(db.String(100))
    reference_type = db.Column(db.String(50))
    
    # User who made the movement
    user_id = db.Column(db.Integer, default=1)
    
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

# Routes
@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return {'status': 'healthy', 'message': 'Inventory API is running'}, 200

# Categories routes
@app.route('/api/v1/categories', methods=['GET'])
def get_categories():
    categories = InventoryCategory.query.all()
    return [category.to_dict() for category in categories], 200

@app.route('/api/v1/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    
    # Check if category already exists
    existing_category = InventoryCategory.query.filter_by(name=data['name']).first()
    if existing_category:
        return {'error': 'Category already exists'}, 400
    
    new_category = InventoryCategory(
        name=data['name'],
        description=data.get('description', '')
    )
    
    db.session.add(new_category)
    db.session.commit()
    
    return new_category.to_dict(), 201

@app.route('/api/v1/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    category = InventoryCategory.query.get_or_404(category_id)
    data = request.get_json()
    
    category.name = data.get('name', category.name)
    category.description = data.get('description', category.description)
    category.updated_at = datetime.utcnow()
    
    db.session.commit()
    return category.to_dict(), 200

@app.route('/api/v1/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = InventoryCategory.query.get_or_404(category_id)
    
    # Check if category has items
    if category.items:
        return {'error': 'Cannot delete category with existing items. Please delete or move items first.'}, 400
    
    db.session.delete(category)
    db.session.commit()
    
    return {'message': 'Category deleted successfully'}, 200

# Suppliers routes
@app.route('/api/v1/suppliers', methods=['GET'])
def get_suppliers():
    suppliers = Supplier.query.all()
    return [supplier.to_dict() for supplier in suppliers], 200

@app.route('/api/v1/suppliers', methods=['POST'])
def create_supplier():
    data = request.get_json()
    
    new_supplier = Supplier(
        name=data['name'],
        legal_name=data.get('legalName'),
        registration_number=data.get('registrationNumber'),
        tax_id=data.get('taxId'),
        website=data.get('website'),
        city=data.get('location', {}).get('city'),
        region=data.get('location', {}).get('region'),
        country=data.get('location', {}).get('country'),
        address=data.get('location', {}).get('address'),
        primary_contact_name=data.get('contact', {}).get('primaryContact', {}).get('name'),
        primary_contact_title=data.get('contact', {}).get('primaryContact', {}).get('title'),
        primary_contact_phone=data.get('contact', {}).get('primaryContact', {}).get('phone'),
        primary_contact_email=data.get('contact', {}).get('primaryContact', {}).get('email'),
        established_year=data.get('establishedYear'),
        employee_count=data.get('employeeCount'),
        annual_revenue=data.get('annualRevenue'),
        status=data.get('status', 'active'),
        verification_status=data.get('verificationStatus', 'pending')
    )
    
    db.session.add(new_supplier)
    db.session.commit()
    
    return new_supplier.to_dict(), 201

# Inventory Items routes
@app.route('/api/v1/items', methods=['GET'])
def get_items():
    items = InventoryItem.query.all()
    return [item.to_dict() for item in items], 200

@app.route('/api/v1/items', methods=['POST'])
def create_item():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'sku', 'category', 'unit', 'quantity', 'unitPrice']
    for field in required_fields:
        if not data.get(field):
            return {'error': f'{field} is required'}, 400
    
    # Validate numeric fields
    try:
        quantity = int(data['quantity'])
        min_quantity = int(data.get('minQuantity', 0))
        max_quantity = int(data.get('maxQuantity', 0))
        unit_price = float(data['unitPrice'])
    except (ValueError, TypeError):
        return {'error': 'Invalid numeric values'}, 400
    
    # Check if SKU already exists
    existing_item = InventoryItem.query.filter_by(sku=data['sku']).first()
    if existing_item:
        return {'error': 'SKU already exists'}, 400
    
    # Find category by name
    category = InventoryCategory.query.filter_by(name=data['category']).first()
    if not category:
        return {'error': 'Category not found'}, 400
    
    new_item = InventoryItem(
        name=data['name'],
        sku=data['sku'],
        description=data.get('description', ''),
        category_id=category.id,
        supplier_id=None,  # We'll store supplier name directly in supplier_contact
        unit=data['unit'],
        quantity=quantity,
        min_quantity=min_quantity,
        max_quantity=max_quantity,
        unit_price=unit_price,
        location=data.get('location', ''),
        supplier_name=data.get('supplier', ''),
        supplier_phone=data.get('supplierContact', ''),
        supplier_social=data.get('supplierSocial', '')
    )
    
    # Update status based on quantity
    new_item.update_status()
    
    db.session.add(new_item)
    
    # Update category item count
    category.item_count += 1
    
    db.session.commit()
    
    return new_item.to_dict(), 201

@app.route('/api/v1/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    item = InventoryItem.query.get_or_404(item_id)
    data = request.get_json()
    
    # Update fields
    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    item.unit = data.get('unit', item.unit)
    item.quantity = int(data.get('quantity', item.quantity))
    item.min_quantity = int(data.get('minQuantity', item.min_quantity))
    item.max_quantity = int(data.get('maxQuantity', item.max_quantity))
    item.unit_price = float(data.get('unitPrice', item.unit_price))
    item.location = data.get('location', item.location)
    
    # Handle supplier information properly
    if 'supplier' in data:
        item.supplier_name = data.get('supplier', item.supplier_name)
    if 'supplierContact' in data:
        item.supplier_phone = data.get('supplierContact', item.supplier_phone)
    if 'supplierSocial' in data:
        item.supplier_social = data.get('supplierSocial', item.supplier_social)
    
    # Update timestamps
    item.updated_at = datetime.utcnow()
    item.last_updated = datetime.utcnow()
    
    # Update status
    item.update_status()
    
    db.session.commit()
    return item.to_dict(), 200

@app.route('/api/v1/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = InventoryItem.query.get_or_404(item_id)
    
    # Update category item count
    if item.category_ref:
        item.category_ref.item_count -= 1
    
    db.session.delete(item)
    db.session.commit()
    
    return {'message': 'Item deleted successfully'}, 200

# Stock Movements routes
@app.route('/api/v1/stock-movements', methods=['GET'])
def get_stock_movements():
    movements = StockMovement.query.order_by(StockMovement.created_at.desc()).all()
    return [movement.to_dict() for movement in movements], 200

@app.route('/api/v1/stock-movements', methods=['POST'])
def create_stock_movement():
    data = request.get_json()
    
    item = InventoryItem.query.get_or_404(data['itemId'])
    
    # Create stock movement
    movement = StockMovement(
        item_id=data['itemId'],
        movement_type=data['movementType'],
        quantity=int(data['quantity']),
        reason=data.get('reason', ''),
        destination=data.get('destination', ''),
        notes=data.get('notes', ''),
        reference_number=data.get('referenceNumber'),
        reference_type=data.get('referenceType'),
        user_id=data.get('userId', 1)
    )
    
    # Update item quantity
    if data['movementType'] == 'in':
        item.quantity += int(data['quantity'])
    elif data['movementType'] == 'out':
        item.quantity -= int(data['quantity'])
    elif data['movementType'] == 'adjustment':
        item.quantity = int(data['quantity'])
    
    # Update item status
    item.update_status()
    
    db.session.add(movement)
    db.session.commit()
    
    return movement.to_dict(), 201

# Analytics routes
@app.route('/api/v1/analytics/stats', methods=['GET'])
def get_inventory_stats():
    total_items = InventoryItem.query.count()
    total_value = db.session.query(db.func.sum(InventoryItem.quantity * InventoryItem.unit_price)).scalar() or 0
    low_stock_items = InventoryItem.query.filter(
        InventoryItem.quantity <= InventoryItem.min_quantity,
        InventoryItem.quantity > 0
    ).count()
    out_of_stock_items = InventoryItem.query.filter_by(quantity=0).count()
    categories_count = InventoryCategory.query.count()
    
    return {
        'totalItems': total_items,
        'totalValue': float(total_value),
        'lowStockItems': low_stock_items,
        'outOfStockItems': out_of_stock_items,
        'categories': categories_count
    }, 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Inventory database tables created!")
    
    app.run(debug=True, port=5001)
