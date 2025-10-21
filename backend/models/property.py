from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

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
