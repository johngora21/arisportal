from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

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
