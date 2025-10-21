from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.tag import Tag, ContactTag, DealTag, db
from models.user import User
from datetime import datetime

tags_bp = Blueprint('tags', __name__)

@tags_bp.route('/', methods=['GET'])
@jwt_required()
def get_tags():
    """Get all tags"""
    try:
        category = request.args.get('category', '')
        
        query = Tag.query
        if category:
            query = query.filter(Tag.category == category)
        
        tags = query.all()
        
        return jsonify({
            'tags': [tag.to_dict() for tag in tags]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tags_bp.route('/', methods=['POST'])
@jwt_required()
def create_tag():
    """Create a new tag"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Tag name is required'}), 400
        
        # Check if tag already exists
        existing_tag = Tag.query.filter_by(
            name=data['name'], 
            category=data.get('category', 'general')
        ).first()
        
        if existing_tag:
            return jsonify({'error': 'Tag already exists'}), 409
        
        # Create new tag
        tag = Tag(
            name=data['name'],
            color=data.get('color', '#3B82F6'),
            description=data.get('description'),
            category=data.get('category', 'general'),
            created_by=user_id
        )
        
        db.session.add(tag)
        db.session.commit()
        
        return jsonify({
            'message': 'Tag created successfully',
            'tag': tag.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tags_bp.route('/<int:tag_id>', methods=['PUT'])
@jwt_required()
def update_tag(tag_id):
    """Update a tag"""
    try:
        tag = Tag.query.get_or_404(tag_id)
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            tag.name = data['name']
        if 'color' in data:
            tag.color = data['color']
        if 'description' in data:
            tag.description = data['description']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Tag updated successfully',
            'tag': tag.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tags_bp.route('/<int:tag_id>', methods=['DELETE'])
@jwt_required()
def delete_tag(tag_id):
    """Delete a tag"""
    try:
        tag = Tag.query.get_or_404(tag_id)
        
        db.session.delete(tag)
        db.session.commit()
        
        return jsonify({
            'message': 'Tag deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
