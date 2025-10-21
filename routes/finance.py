from flask import Blueprint, request, jsonify, session
from models.transaction import Transaction, db
from functools import wraps

finance_bp = Blueprint('finance', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

@finance_bp.route('/transactions', methods=['GET'])
@login_required
def get_transactions():
    """Get user's transactions"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        transaction_type = request.args.get('type')
        status = request.args.get('status')
        
        query = Transaction.query.filter_by(user_id=session['user_id'])
        
        if transaction_type:
            query = query.filter(Transaction.transaction_type == transaction_type)
        if status:
            query = query.filter(Transaction.status == status)
        
        transactions = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'data': [transaction.to_dict() for transaction in transactions.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': transactions.total,
                'pages': transactions.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@finance_bp.route('/transactions', methods=['POST'])
@login_required
def create_transaction():
    """Create a new transaction"""
    try:
        data = request.get_json()
        
        required_fields = ['amount', 'transaction_type']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        transaction = Transaction(
            user_id=session['user_id'],
            amount=data['amount'],
            transaction_type=data['transaction_type'],
            description=data.get('description', ''),
            reference_id=data.get('reference_id')
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'message': 'Transaction created successfully',
            'data': transaction.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@finance_bp.route('/wallet', methods=['GET'])
@login_required
def get_wallet_balance():
    """Get user's wallet balance"""
    try:
        # Calculate balance from transactions
        deposits = db.session.query(db.func.sum(Transaction.amount)).filter(
            Transaction.user_id == session['user_id'],
            Transaction.transaction_type == 'deposit',
            Transaction.status == 'completed'
        ).scalar() or 0
        
        withdrawals = db.session.query(db.func.sum(Transaction.amount)).filter(
            Transaction.user_id == session['user_id'],
            Transaction.transaction_type == 'withdrawal',
            Transaction.status == 'completed'
        ).scalar() or 0
        
        investments = db.session.query(db.func.sum(Transaction.amount)).filter(
            Transaction.user_id == session['user_id'],
            Transaction.transaction_type == 'investment',
            Transaction.status == 'completed'
        ).scalar() or 0
        
        balance = float(deposits) - float(withdrawals) - float(investments)
        
        return jsonify({
            'data': {
                'balance': balance,
                'deposits': float(deposits),
                'withdrawals': float(withdrawals),
                'investments': float(investments)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
