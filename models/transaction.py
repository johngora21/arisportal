from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

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
