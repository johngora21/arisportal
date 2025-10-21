from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.communication import Communication, Note, Activity, db
from models.contact import Contact
from models.deal import Deal
from models.user import User
from datetime import datetime

communications_bp = Blueprint('communications', __name__)

@communications_bp.route('/', methods=['GET'])
@jwt_required()
def get_communications():
    """Get all communications with filtering"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        contact_id = request.args.get('contact_id', type=int)
        deal_id = request.args.get('deal_id', type=int)
        comm_type = request.args.get('type', '')
        
        # Build query
        query = Communication.query
        
        # Apply user permissions
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Communication.user_id == user_id)
        
        # Apply filters
        if contact_id:
            query = query.filter(Communication.contact_id == contact_id)
            
        if deal_id:
            query = query.filter(Communication.deal_id == deal_id)
            
        if comm_type:
            query = query.filter(Communication.type == comm_type)
        
        # Paginate results
        communications = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'communications': [comm.to_dict() for comm in communications.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': communications.total,
                'pages': communications.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@communications_bp.route('/', methods=['POST'])
@jwt_required()
def create_communication():
    """Create a new communication"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('type'):
            return jsonify({'error': 'Communication type is required'}), 400
        
        # Create new communication
        communication = Communication(
            contact_id=data.get('contact_id'),
            deal_id=data.get('deal_id'),
            user_id=user_id,
            type=data['type'],
            direction=data.get('direction', 'outbound'),
            subject=data.get('subject'),
            content=data.get('content'),
            status=data.get('status', 'sent'),
            scheduled_at=datetime.fromisoformat(data['scheduled_at']) if data.get('scheduled_at') else None,
            follow_up_required=data.get('follow_up_required', False),
            follow_up_date=datetime.fromisoformat(data['follow_up_date']) if data.get('follow_up_date') else None
        )
        
        db.session.add(communication)
        db.session.commit()
        
        # Log activity
        Activity.log_activity(
            user_id=user_id,
            activity_type='created',
            entity_type='communication',
            entity_id=communication.id,
            description=f'Created {communication.type} communication'
        )
        
        return jsonify({
            'message': 'Communication created successfully',
            'communication': communication.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@communications_bp.route('/notes', methods=['POST'])
@jwt_required()
def create_note():
    """Create a new note"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('content'):
            return jsonify({'error': 'Note content is required'}), 400
        
        # Create new note
        note = Note(
            contact_id=data.get('contact_id'),
            deal_id=data.get('deal_id'),
            user_id=user_id,
            title=data.get('title'),
            content=data['content'],
            is_private=data.get('is_private', False)
        )
        
        db.session.add(note)
        db.session.commit()
        
        # Log activity
        Activity.log_activity(
            user_id=user_id,
            activity_type='created',
            entity_type='note',
            entity_id=note.id,
            description=f'Created note: {note.title or "Untitled"}'
        )
        
        return jsonify({
            'message': 'Note created successfully',
            'note': note.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@communications_bp.route('/scheduled', methods=['GET'])
@jwt_required()
def get_scheduled_communications():
    """Get scheduled communications"""
    try:
        user_id = get_jwt_identity()
        
        communications = Communication.get_scheduled_communications()
        
        return jsonify({
            'communications': [comm.to_dict() for comm in communications]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@communications_bp.route('/follow-ups', methods=['GET'])
@jwt_required()
def get_follow_ups():
    """Get follow-ups due"""
    try:
        user_id = get_jwt_identity()
        
        communications = Communication.get_follow_ups_due()
        
        return jsonify({
            'communications': [comm.to_dict() for comm in communications]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
