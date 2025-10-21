from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Enum('admin', 'mentor', 'investor', 'entrepreneur'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    properties = db.relationship('Property', backref='owner', lazy=True)
    investments = db.relationship('Investment', backref='investor', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }

class Property(db.Model):
    __tablename__ = 'properties'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    property_type = db.Column(db.Enum('house', 'apartment', 'commercial', 'land'), nullable=False)
    price = db.Column(db.Decimal(15, 2), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    area = db.Column(db.Float)  # in square meters
    bedrooms = db.Column(db.Integer)
    bathrooms = db.Column(db.Integer)
    status = db.Column(db.Enum('available', 'sold', 'rented', 'pending'), default='available')
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'property_type': self.property_type,
            'price': float(self.price),
            'location': self.location,
            'area': self.area,
            'bedrooms': self.bedrooms,
            'bathrooms': self.bathrooms,
            'status': self.status,
            'owner_id': self.owner_id,
            'created_at': self.created_at.isoformat()
        }

class InvestmentProject(db.Model):
    __tablename__ = 'investment_projects'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.Enum('agriculture', 'energy', 'infrastructure', 'real_estate'), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    total_value = db.Column(db.Decimal(15, 2), nullable=False)
    minimum_investment = db.Column(db.Decimal(15, 2), nullable=False)
    expected_roi = db.Column(db.Float)  # percentage
    duration = db.Column(db.String(100))
    status = db.Column(db.Enum('active', 'funded', 'completed', 'cancelled'), default='active')
    funding_progress = db.Column(db.Float, default=0.0)  # percentage
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    investments = db.relationship('Investment', backref='project', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'location': self.location,
            'total_value': float(self.total_value),
            'minimum_investment': float(self.minimum_investment),
            'expected_roi': self.expected_roi,
            'duration': self.duration,
            'status': self.status,
            'funding_progress': self.funding_progress,
            'created_at': self.created_at.isoformat()
        }

class Investment(db.Model):
    __tablename__ = 'investments'
    
    id = db.Column(db.Integer, primary_key=True)
    investor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('investment_projects.id'), nullable=False)
    amount = db.Column(db.Decimal(15, 2), nullable=False)
    status = db.Column(db.Enum('pending', 'approved', 'rejected', 'completed'), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'investor_id': self.investor_id,
            'project_id': self.project_id,
            'amount': float(self.amount),
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Decimal(15, 2), nullable=False)
    transaction_type = db.Column(db.Enum('deposit', 'withdrawal', 'investment', 'payment'), nullable=False)
    description = db.Column(db.String(500))
    status = db.Column(db.Enum('pending', 'completed', 'failed', 'cancelled'), default='pending')
    reference_id = db.Column(db.String(100))  # External payment reference
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': float(self.amount),
            'transaction_type': self.transaction_type,
            'description': self.description,
            'status': self.status,
            'reference_id': self.reference_id,
            'created_at': self.created_at.isoformat()
        }
