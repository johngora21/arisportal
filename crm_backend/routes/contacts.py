from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.contact import Contact, db
from models.user import User
from models.tag import Tag, ContactTag
from datetime import datetime
import re

contacts_bp = Blueprint('contacts', __name__)

def validate_email(email):
    """Validate email format"""
    if not email:
        return True  # Email is optional
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@contacts_bp.route('/', methods=['GET'])
@jwt_required()
def get_contacts():
    """Get all contacts with filtering and pagination"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        status = request.args.get('status', '')
        source = request.args.get('source', '')
        owner_id = request.args.get('owner_id', type=int)
        
        # Build query
        query = Contact.query
        
        # Apply user permissions
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Contact.owner_id == user_id)
        
        # Apply filters
        if search:
            query = query.filter(
                db.or_(
                    Contact.name.ilike(f'%{search}%'),
                    Contact.company.ilike(f'%{search}%'),
                    Contact.email.ilike(f'%{search}%')
                )
            )
        
        if status:
            query = query.filter(Contact.status == status)
            
        if source:
            query = query.filter(Contact.source == source)
            
        if owner_id:
            query = query.filter(Contact.owner_id == owner_id)
        
        # Paginate results
        contacts = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'contacts': [contact.to_dict() for contact in contacts.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': contacts.total,
                'pages': contacts.pages,
                'has_next': contacts.has_next,
                'has_prev': contacts.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contacts_bp.route('/<int:contact_id>', methods=['GET'])
@jwt_required()
def get_contact(contact_id):
    """Get a specific contact by ID"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        contact = Contact.query.get_or_404(contact_id)
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and contact.owner_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        # Log activity
        # Activity.log_activity(
        #     user_id=user_id,
        #     activity_type='viewed',
        #     entity_type='contact',
        #     entity_id=contact_id,
        #     description=f'Viewed contact {contact.name}'
        # )
        
        return jsonify({
            'contact': contact.to_dict(include_relationships=True)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contacts_bp.route('/', methods=['POST'])
@jwt_required()
def create_contact():
    """Create a new contact"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400
        
        # Validate email if provided
        if data.get('email') and not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Create new contact
        contact = Contact(
            name=data['name'],
            company=data.get('company'),
            job_title=data.get('job_title'),
            email=data.get('email'),
            phone=data.get('phone'),
            whatsapp=data.get('whatsapp'),
            address=data.get('address'),
            city=data.get('city'),
            state=data.get('state'),
            country=data.get('country'),
            postal_code=data.get('postal_code'),
            website=data.get('website'),
            linkedin_url=data.get('linkedin_url'),
            status=data.get('status', 'lead'),
            source=data.get('source', 'other'),
            estimated_value=data.get('estimated_value', 0),
            owner_id=data.get('owner_id', user_id),
            created_by=user_id
        )
        
        db.session.add(contact)
        db.session.commit()
        
        # Calculate lead score
        contact.calculate_lead_score()
        
        # Log activity
        # Activity.log_activity(
        #     user_id=user_id,
        #     activity_type='created',
        #     entity_type='contact',
        #     entity_id=contact.id,
        #     description=f'Created contact {contact.name}'
        # )
        
        return jsonify({
            'message': 'Contact created successfully',
            'contact': contact.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@contacts_bp.route('/<int:contact_id>', methods=['PUT'])
@jwt_required()
def update_contact(contact_id):
    """Update a contact"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        contact = Contact.query.get_or_404(contact_id)
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and contact.owner_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        old_values = contact.to_dict()
        
        # Validate email if provided
        if data.get('email') and not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Update fields
        updatable_fields = [
            'name', 'company', 'job_title', 'email', 'phone', 'whatsapp',
            'address', 'city', 'state', 'country', 'postal_code', 'website',
            'linkedin_url', 'status', 'source', 'estimated_value', 'owner_id'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(contact, field, data[field])
        
        # Update last contact date if status changed
        if 'status' in data and data['status'] != old_values['status']:
            contact.last_contact_date = datetime.utcnow()
        
        db.session.commit()
        
        # Recalculate lead score
        contact.calculate_lead_score()
        
        # Log activity
        # Activity.log_activity(
        #     user_id=user_id,
        #     activity_type='updated',
        #     entity_type='contact',
        #     entity_id=contact_id,
        #     description=f'Updated contact {contact.name}',
        #     old_values=old_values,
        #     new_values=contact.to_dict()
        # )
        
        return jsonify({
            'message': 'Contact updated successfully',
            'contact': contact.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@contacts_bp.route('/<int:contact_id>', methods=['DELETE'])
@jwt_required()
def delete_contact(contact_id):
    """Delete a contact"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        contact = Contact.query.get_or_404(contact_id)
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and contact.owner_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        contact_name = contact.name
        
        # Log activity before deletion
        # Activity.log_activity(
        #     user_id=user_id,
        #     activity_type='deleted',
        #     entity_type='contact',
        #     entity_id=contact_id,
        #     description=f'Deleted contact {contact_name}'
        # )
        
        db.session.delete(contact)
        db.session.commit()
        
        return jsonify({
            'message': 'Contact deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@contacts_bp.route('/<int:contact_id>/tags', methods=['POST'])
@jwt_required()
def add_contact_tag(contact_id):
    """Add a tag to a contact"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        contact = Contact.query.get_or_404(contact_id)
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and contact.owner_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        tag_name = data.get('tag_name')
        
        if not tag_name:
            return jsonify({'error': 'Tag name is required'}), 400
        
        # Get or create tag
        tag = Tag.get_or_create(tag_name, 'contact', created_by=user_id)
        
        # Check if tag already exists for this contact
        existing_tag = ContactTag.query.filter_by(
            contact_id=contact_id, tag_id=tag.id
        ).first()
        
        if existing_tag:
            return jsonify({'error': 'Tag already exists for this contact'}), 400
        
        # Add tag
        contact_tag = ContactTag(contact_id=contact_id, tag_id=tag.id)
        db.session.add(contact_tag)
        db.session.commit()
        
        return jsonify({
            'message': 'Tag added successfully',
            'tag': tag.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@contacts_bp.route('/<int:contact_id>/tags/<int:tag_id>', methods=['DELETE'])
@jwt_required()
def remove_contact_tag(contact_id, tag_id):
    """Remove a tag from a contact"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        contact = Contact.query.get_or_404(contact_id)
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and contact.owner_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        contact_tag = ContactTag.query.filter_by(
            contact_id=contact_id, tag_id=tag_id
        ).first()
        
        if not contact_tag:
            return jsonify({'error': 'Tag not found for this contact'}), 404
        
        db.session.delete(contact_tag)
        db.session.commit()
        
        return jsonify({
            'message': 'Tag removed successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@contacts_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_contact_stats():
    """Get contact statistics"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        # Build base query
        query = Contact.query
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Contact.owner_id == user_id)
        
        # Get counts by status
        status_counts = {}
        for status in ['lead', 'prospect', 'customer', 'inactive', 'qualified', 'unqualified']:
            status_counts[status] = query.filter_by(status=status).count()
        
        # Get total contacts
        total_contacts = query.count()
        
        # Get total estimated value
        total_value = db.session.query(db.func.sum(Contact.estimated_value)).filter(
            Contact.owner_id == user_id if current_user.role not in ['admin', 'manager'] else True
        ).scalar() or 0
        
        return jsonify({
            'total_contacts': total_contacts,
            'status_counts': status_counts,
            'total_estimated_value': float(total_value)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
