from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, origins=["http://localhost:3002"], supports_credentials=True)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'mysql+pymysql://root:password@localhost:3306/arisportal'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import models
from models.user import User
from models.property import Property
from models.investment import InvestmentProject
from models.transaction import Transaction
from models.supplier import Supplier

# Import routes
from routes.auth import auth_bp
from routes.properties import properties_bp
from routes.investments import investments_bp
from routes.finance import finance_bp
from routes.inventory import inventory_bp
from routes.suppliers import suppliers_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
app.register_blueprint(properties_bp, url_prefix='/api/v1/properties')
app.register_blueprint(investments_bp, url_prefix='/api/v1/investments')
app.register_blueprint(finance_bp, url_prefix='/api/v1/finance')
app.register_blueprint(inventory_bp, url_prefix='/api/v1/inventory')
app.register_blueprint(suppliers_bp, url_prefix='/api/v1/suppliers')

@app.route('/api/v1/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'database': 'connected' if db.engine.execute('SELECT 1').fetchone() else 'disconnected'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
