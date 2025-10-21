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
CORS(app)

# Set db in models module
import models.inventory
models.inventory.db = db

# Import models after setting db
from models.inventory import InventoryCategory, Supplier, InventoryItem, StockMovement

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
        return {'error': 'Cannot delete category with existing items'}, 400
    
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
        secondary_contact_name=data.get('contact', {}).get('secondaryContact', {}).get('name') if data.get('contact', {}).get('secondaryContact') else None,
        secondary_contact_title=data.get('contact', {}).get('secondaryContact', {}).get('title') if data.get('contact', {}).get('secondaryContact') else None,
        secondary_contact_phone=data.get('contact', {}).get('secondaryContact', {}).get('phone') if data.get('contact', {}).get('secondaryContact') else None,
        secondary_contact_email=data.get('contact', {}).get('secondaryContact', {}).get('email') if data.get('contact', {}).get('secondaryContact') else None,
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
    
    # Check if SKU already exists
    existing_item = InventoryItem.query.filter_by(sku=data['sku']).first()
    if existing_item:
        return {'error': 'SKU already exists'}, 400
    
    # Find category by name
    category = InventoryCategory.query.filter_by(name=data['category']).first()
    if not category:
        return {'error': 'Category not found'}, 400
    
    # Find supplier by name (optional)
    supplier = None
    if data.get('supplier'):
        supplier = Supplier.query.filter_by(name=data['supplier']).first()
    
    new_item = InventoryItem(
        name=data['name'],
        sku=data['sku'],
        description=data.get('description', ''),
        category_id=category.id,
        supplier_id=supplier.id if supplier else None,
        unit=data['unit'],
        quantity=int(data['quantity']),
        min_quantity=int(data.get('minQuantity', 0)),
        max_quantity=int(data.get('maxQuantity', 0)),
        unit_price=float(data['unitPrice']),
        location=data.get('location', '')
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
