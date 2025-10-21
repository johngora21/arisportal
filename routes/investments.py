from flask import Blueprint, request, jsonify, session
from models.investment import InvestmentProject, Investment, db
from functools import wraps

investments_bp = Blueprint('investments', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

@investments_bp.route('/projects', methods=['GET'])
def get_investment_projects():
    """Get all investment projects"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category = request.args.get('category')
        status = request.args.get('status')
        
        query = InvestmentProject.query
        
        if category:
            query = query.filter(InvestmentProject.category == category)
        if status:
            query = query.filter(InvestmentProject.status == status)
        
        projects = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'data': [project.to_dict() for project in projects.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': projects.total,
                'pages': projects.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@investments_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_investment_project(project_id):
    """Get a specific investment project"""
    try:
        project = InvestmentProject.query.get_or_404(project_id)
        return jsonify({'data': project.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@investments_bp.route('/projects', methods=['POST'])
@login_required
def create_investment_project():
    """Create a new investment project"""
    try:
        data = request.get_json()
        
        required_fields = ['title', 'category', 'location', 'total_value', 'minimum_investment']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        project = InvestmentProject(
            title=data['title'],
            description=data.get('description', ''),
            category=data['category'],
            location=data['location'],
            total_value=data['total_value'],
            minimum_investment=data['minimum_investment'],
            expected_roi=data.get('expected_roi'),
            duration=data.get('duration')
        )
        
        db.session.add(project)
        db.session.commit()
        
        return jsonify({
            'message': 'Investment project created successfully',
            'data': project.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@investments_bp.route('/invest', methods=['POST'])
@login_required
def make_investment():
    """Make an investment in a project"""
    try:
        data = request.get_json()
        
        if not data.get('project_id') or not data.get('amount'):
            return jsonify({'error': 'project_id and amount are required'}), 400
        
        project = InvestmentProject.query.get_or_404(data['project_id'])
        
        if project.status != 'active':
            return jsonify({'error': 'Project is not available for investment'}), 400
        
        if data['amount'] < project.minimum_investment:
            return jsonify({'error': f'Minimum investment is {project.minimum_investment}'}), 400
        
        investment = Investment(
            investor_id=session['user_id'],
            project_id=data['project_id'],
            amount=data['amount']
        )
        
        db.session.add(investment)
        db.session.commit()
        
        return jsonify({
            'message': 'Investment created successfully',
            'data': investment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@investments_bp.route('/my-investments', methods=['GET'])
@login_required
def get_my_investments():
    """Get current user's investments"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        investments = Investment.query.filter_by(investor_id=session['user_id']).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'data': [investment.to_dict() for investment in investments.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': investments.total,
                'pages': investments.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
