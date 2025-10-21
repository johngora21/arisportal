from flask import Blueprint, request, jsonify, session
from models.property import Property, db
from models.user import User
from functools import wraps

properties_bp = Blueprint('properties', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

@properties_bp.route('/', methods=['GET'])
def get_properties():
    """Get all properties with optional filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        property_type = request.args.get('type')
        status = request.args.get('status')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        
        query = Property.query
        
        # Apply filters
        if property_type:
            query = query.filter(Property.property_type == property_type)
        if status:
            query = query.filter(Property.status == status)
        if min_price:
            query = query.filter(Property.price >= min_price)
        if max_price:
            query = query.filter(Property.price <= max_price)
        
        # Pagination
        properties = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'data': [property.to_dict() for property in properties.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': properties.total,
                'pages': properties.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/<int:property_id>', methods=['GET'])
def get_property(property_id):
    """Get a specific property by ID"""
    try:
        property = Property.query.get_or_404(property_id)
        return jsonify({'data': property.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/', methods=['POST'])
@login_required
def create_property():
    """Create a new property"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'property_type', 'price', 'location']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new property
        property = Property(
            title=data['title'],
            description=data.get('description', ''),
            property_type=data['property_type'],
            price=data['price'],
            location=data['location'],
            area=data.get('area'),
            bedrooms=data.get('bedrooms'),
            bathrooms=data.get('bathrooms'),
            owner_id=session['user_id']
        )
        
        db.session.add(property)
        db.session.commit()
        
        return jsonify({
            'message': 'Property created successfully',
            'data': property.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/<int:property_id>', methods=['PUT'])
@login_required
def update_property(property_id):
    """Update a property"""
    try:
        property = Property.query.get_or_404(property_id)
        
        # Check ownership
        if property.owner_id != session['user_id']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            property.title = data['title']
        if 'description' in data:
            property.description = data['description']
        if 'property_type' in data:
            property.property_type = data['property_type']
        if 'price' in data:
            property.price = data['price']
        if 'location' in data:
            property.location = data['location']
        if 'area' in data:
            property.area = data['area']
        if 'bedrooms' in data:
            property.bedrooms = data['bedrooms']
        if 'bathrooms' in data:
            property.bathrooms = data['bathrooms']
        if 'status' in data:
            property.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Property updated successfully',
            'data': property.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/<int:property_id>', methods=['DELETE'])
@login_required
def delete_property(property_id):
    """Delete a property"""
    try:
        property = Property.query.get_or_404(property_id)
        
        # Check ownership
        if property.owner_id != session['user_id']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        db.session.delete(property)
        db.session.commit()
        
        return jsonify({'message': 'Property deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/my-properties', methods=['GET'])
@login_required
def get_my_properties():
    """Get current user's properties"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        properties = Property.query.filter_by(owner_id=session['user_id']).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'data': [property.to_dict() for property in properties.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': properties.total,
                'pages': properties.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
