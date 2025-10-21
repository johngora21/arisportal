from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.deal import Deal, DealItem, db
from models.contact import Contact
from models.user import User
from models.tag import Tag, DealTag
from datetime import datetime, date
import json

deals_bp = Blueprint('deals', __name__)

@deals_bp.route('/', methods=['GET'])
@jwt_required()
def get_deals():
    """Get all deals with optional filtering and pagination"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        stage = request.args.get('stage')
        status = request.args.get('status')
        owner_id = request.args.get('owner_id', type=int)
        contact_id = request.args.get('contact_id', type=int)
        
        # Build query
        query = Deal.query
        
        # Apply filters based on user role
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Deal.owner_id == user_id)
        elif owner_id:
            query = query.filter(Deal.owner_id == owner_id)
            
        if contact_id:
            query = query.filter(Deal.contact_id == contact_id)
        
        # Paginate results
        deals = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'deals': [deal.to_dict() for deal in deals.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': deals.total,
                'pages': deals.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@deals_bp.route('/<int:deal_id>', methods=['GET'])
@jwt_required()
def get_deal(deal_id):
    """Get a specific deal by ID"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        deal = Deal.query.get(deal_id)
        if not deal:
            return jsonify({'error': 'Deal not found'}), 404
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and deal.owner_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({
            'deal': deal.to_dict(include_relationships=True)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@deals_bp.route('/', methods=['POST'])
@jwt_required()
def create_deal():
    """Create a new deal"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['deal_name', 'contact_id']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if not data['contact_id']:
            return jsonify({'error': 'Contact ID is required'}), 400
        
        # Verify contact exists
        contact = Contact.query.get(data['contact_id'])
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404
        
        # Create new deal
        deal = Deal(
            deal_name=data['deal_name'],
            description=data.get('description'),
            contact_id=data['contact_id'],
            owner_id=data.get('owner_id', user_id),
            stage=data.get('stage', 'lead'),
            probability=data.get('probability', 0),
            estimated_value=data.get('estimated_value', 0),
            currency=data.get('currency', 'USD'),
            expected_close_date=datetime.strptime(data['expected_close_date'], '%Y-%m-%d').date() if data.get('expected_close_date') else None,
            deal_type=data.get('deal_type', 'new_business'),
            priority=data.get('priority', 'medium'),
            status=data.get('status', 'active')
        )
        
        db.session.add(deal)
        db.session.commit()
        
        return jsonify({
            'message': 'Deal created successfully',
            'deal': deal.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@deals_bp.route('/<int:deal_id>', methods=['PUT'])
@jwt_required()
def update_deal(deal_id):
    """Update an existing deal"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        deal = Deal.query.get(deal_id)
        if not deal:
            return jsonify({'error': 'Deal not found'}), 404
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and deal.owner_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        
        # Update deal fields
        if 'deal_name' in data:
            deal.deal_name = data['deal_name']
        if 'description' in data:
            deal.description = data['description']
        if 'stage' in data:
            deal.stage = data['stage']
        if 'probability' in data:
            deal.probability = data['probability']
        if 'estimated_value' in data:
            deal.estimated_value = data['estimated_value']
        if 'currency' in data:
            deal.currency = data['currency']
        if 'expected_close_date' in data:
            deal.expected_close_date = datetime.strptime(data['expected_close_date'], '%Y-%m-%d').date() if data['expected_close_date'] else None
        if 'deal_type' in data:
            deal.deal_type = data['deal_type']
        if 'priority' in data:
            deal.priority = data['priority']
        if 'status' in data:
            deal.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Deal updated successfully',
            'deal': deal.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@deals_bp.route('/<int:deal_id>', methods=['DELETE'])
@jwt_required()
def delete_deal(deal_id):
    """Delete a deal"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        deal = Deal.query.get(deal_id)
        if not deal:
            return jsonify({'error': 'Deal not found'}), 404
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and deal.owner_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        deal_name = deal.deal_name
        
        db.session.delete(deal)
        db.session.commit()
        
        return jsonify({
            'message': f'Deal {deal_name} deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500