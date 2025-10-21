from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Enum('admin', 'manager', 'sales_rep', 'viewer'), nullable=False, default='sales_rep')
    department = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    avatar_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True, index=True)
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owned_contacts = db.relationship('Contact', backref='owner', lazy=True, foreign_keys='Contact.owner_id')
    created_contacts = db.relationship('Contact', backref='creator', lazy=True, foreign_keys='Contact.created_by')
    owned_deals = db.relationship('Deal', backref='deal_owner', lazy=True)
    communications = db.relationship('Communication', backref='user', lazy=True)
    notes = db.relationship('Note', backref='note_user', lazy=True)
    activities = db.relationship('Activity', backref='activity_user', lazy=True)
    created_tags = db.relationship('Tag', backref='tag_creator', lazy=True)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def generate_token(self):
        """Generate JWT token for user"""
        return create_access_token(identity=self.id)
    
    def update_last_login(self):
        """Update last login timestamp"""
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary"""
        data = {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'department': self.department,
            'phone': self.phone,
            'avatar_url': self.avatar_url,
            'is_active': self.is_active,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_sensitive:
            data['password_hash'] = self.password_hash
            
        return data
    
    @staticmethod
    def get_by_email(email):
        """Get user by email"""
        return User.query.filter_by(email=email).first()
    
    @staticmethod
    def get_active_users():
        """Get all active users"""
        return User.query.filter_by(is_active=True).all()
    
    def __repr__(self):
        return f'<User {self.email}>'
