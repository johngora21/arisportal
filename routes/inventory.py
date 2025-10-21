from flask import Blueprint, request, jsonify, session
from functools import wraps

inventory_bp = Blueprint('inventory', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

@inventory_bp.route('/suppliers', methods=['GET'])
@login_required
def get_suppliers():
    """Get suppliers list"""
    try:
        # Mock data for now - replace with actual database queries
        suppliers = [
            {
                'id': 1,
                'name': 'ABC Supplies Ltd',
                'contact_person': 'John Doe',
                'email': 'john@abcsupplies.com',
                'phone': '+1234567890',
                'address': '123 Supply Street, City',
                'status': 'active'
            },
            {
                'id': 2,
                'name': 'XYZ Materials Inc',
                'contact_person': 'Jane Smith',
                'email': 'jane@xyzmaterials.com',
                'phone': '+0987654321',
                'address': '456 Material Ave, Town',
                'status': 'active'
            }
        ]
        
        return jsonify({'data': suppliers}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/products', methods=['GET'])
@login_required
def get_products():
    """Get products list"""
    try:
        # Mock data for now - replace with actual database queries
        products = [
            {
                'id': 1,
                'name': 'Steel Rods',
                'category': 'Construction',
                'quantity': 100,
                'unit_price': 25.50,
                'supplier_id': 1
            },
            {
                'id': 2,
                'name': 'Cement Bags',
                'category': 'Construction',
                'quantity': 50,
                'unit_price': 15.75,
                'supplier_id': 2
            }
        ]
        
        return jsonify({'data': products}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/orders', methods=['GET'])
@login_required
def get_orders():
    """Get orders list"""
    try:
        # Mock data for now - replace with actual database queries
        orders = [
            {
                'id': 1,
                'order_number': 'ORD-001',
                'supplier_id': 1,
                'total_amount': 2550.00,
                'status': 'pending',
                'created_at': '2024-01-15T10:30:00Z'
            },
            {
                'id': 2,
                'order_number': 'ORD-002',
                'supplier_id': 2,
                'total_amount': 787.50,
                'status': 'completed',
                'created_at': '2024-01-14T14:20:00Z'
            }
        ]
        
        return jsonify({'data': orders}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
