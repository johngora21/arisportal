from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User, db
from datetime import datetime
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'full_name']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check password strength
        if len(data['password']) < 8:
            return jsonify({'error': 'Password must be at least 8 characters long'}), 400
        
        # Check if user already exists
        if User.get_by_email(data['email']):
            return jsonify({'error': 'User already exists'}), 409
        
        # Create new user
        user = User(
            email=data['email'],
            full_name=data['full_name'],
            role=data.get('role', 'sales_rep'),
            department=data.get('department'),
            phone=data.get('phone')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Activity logging removed for now
        
        # Generate token
        token = user.generate_token()
        
        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict(),
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.get_by_email(data['email'])
        
        if user and user.check_password(data['password']):
            if not user.is_active:
                return jsonify({'error': 'Account is deactivated'}), 403
            
            # Update last login
            user.update_last_login()
            
            # Log activity
            # Activity logging removed for now
            
            # Generate token
            token = user.generate_token()
            
            return jsonify({
                'message': 'Login successful',
                'user': user.to_dict(),
                'token': token
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        old_values = user.to_dict()
        
        # Update fields
        if 'full_name' in data:
            user.full_name = data['full_name']
        
        if 'department' in data:
            user.department = data['department']
            
        if 'phone' in data:
            user.phone = data['phone']
        
        if 'email' in data and data['email'] != user.email:
            if not validate_email(data['email']):
                return jsonify({'error': 'Invalid email format'}), 400
            # Check if new email already exists
            existing_user = User.get_by_email(data['email'])
            if existing_user:
                return jsonify({'error': 'Email already exists'}), 409
            user.email = data['email']
        
        db.session.commit()
        
        # Log activity
        # Activity.log_activity(
        #     user_id=user.id,
        #     activity_type='updated',
        #     entity_type='user',
        #     entity_id=user.id,
        #     description=f'User {user.full_name} updated profile',
        #     old_values=old_values,
        #     new_values=user.to_dict()
        # )
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        # Verify current password
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        # Validate new password
        if len(data['new_password']) < 8:
            return jsonify({'error': 'New password must be at least 8 characters long'}), 400
        
        # Set new password
        user.set_password(data['new_password'])
        db.session.commit()
        
        # Log activity
        # Activity.log_activity(
        #     user_id=user.id,
        #     activity_type='updated',
        #     entity_type='user',
        #     entity_id=user.id,
        #     description=f'User {user.full_name} changed password'
        # )
        
        return jsonify({
            'message': 'Password changed successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    """Get all users (admin only)"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        if not current_user or current_user.role not in ['admin', 'manager']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        users = User.query.all()
        
        return jsonify({
            'users': [user.to_dict() for user in users]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/users/<int:user_id>/toggle-status', methods=['POST'])
@jwt_required()
def toggle_user_status(user_id):
    """Toggle user active status (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user or current_user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.id == current_user.id:
            return jsonify({'error': 'Cannot deactivate your own account'}), 400
        
        user.is_active = not user.is_active
        db.session.commit()
        
        # Log activity
        # Activity.log_activity(
        #     user_id=current_user.id,
        #     activity_type='updated',
        #     entity_type='user',
        #     entity_id=user.id,
        #     description=f'User {user.full_name} status changed to {"active" if user.is_active else "inactive"}'
        # )
        
        return jsonify({
            'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
