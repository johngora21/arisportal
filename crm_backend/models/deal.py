from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

db = SQLAlchemy()

class Deal(db.Model):
    __tablename__ = 'deals'
    
    id = db.Column(db.Integer, primary_key=True)
    deal_name = db.Column(db.String(200), nullable=False, index=True)
    description = db.Column(db.Text)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=False, index=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    stage = db.Column(db.Enum('lead', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'), 
                     default='lead', index=True)
    probability = db.Column(db.Integer, default=0)
    estimated_value = db.Column(db.Numeric(15, 2), nullable=False, default=0.00, index=True)
    actual_value = db.Column(db.Numeric(15, 2), default=0.00)
    currency = db.Column(db.String(3), default='USD')
    expected_close_date = db.Column(db.Date, index=True)
    actual_close_date = db.Column(db.Date, index=True)
    deal_type = db.Column(db.Enum('new_business', 'upsell', 'cross_sell', 'renewal'), default='new_business')
    priority = db.Column(db.Enum('low', 'medium', 'high', 'urgent'), default='medium', index=True)
    status = db.Column(db.Enum('active', 'on_hold', 'cancelled', 'completed'), default='active', index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('DealItem', backref='deal', lazy=True, cascade='all, delete-orphan')
    communications = db.relationship('Communication', backref='deal', lazy=True, cascade='all, delete-orphan')
    notes = db.relationship('Note', backref='deal', lazy=True, cascade='all, delete-orphan')
    activities = db.relationship('Activity', backref='deal', lazy=True, cascade='all, delete-orphan')
    tags = db.relationship('DealTag', backref='deal', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_relationships=False):
        """Convert deal to dictionary"""
        data = {
            'id': self.id,
            'deal_name': self.deal_name,
            'description': self.description,
            'contact_id': self.contact_id,
            'owner_id': self.owner_id,
            'stage': self.stage,
            'probability': self.probability,
            'estimated_value': float(self.estimated_value) if self.estimated_value else 0.0,
            'actual_value': float(self.actual_value) if self.actual_value else 0.0,
            'currency': self.currency,
            'expected_close_date': self.expected_close_date.isoformat() if self.expected_close_date else None,
            'actual_close_date': self.actual_close_date.isoformat() if self.actual_close_date else None,
            'deal_type': self.deal_type,
            'priority': self.priority,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'weighted_value': self.get_weighted_value()
        }
        
        if include_relationships:
            data['contact'] = self.contact.to_dict() if self.contact else None
            data['owner'] = self.deal_owner.to_dict() if self.deal_owner else None
            data['items'] = [item.to_dict() for item in self.items]
            data['communications'] = [comm.to_dict() for comm in self.communications]
            data['notes'] = [note.to_dict() for note in self.notes]
            data['tags'] = [tag.tag.to_dict() for tag in self.tags]
            
        return data
    
    def get_weighted_value(self):
        """Calculate weighted value based on probability"""
        if self.stage == 'closed_won':
            return float(self.actual_value) if self.actual_value else 0.0
        return float(self.estimated_value * (self.probability / 100)) if self.estimated_value else 0.0
    
    def calculate_total_value(self):
        """Calculate total value from deal items"""
        total = sum(item.total_amount for item in self.items)
        self.estimated_value = total
        db.session.commit()
        return total
    
    def close_deal(self, won=True, actual_value=None):
        """Close the deal as won or lost"""
        if won:
            self.stage = 'closed_won'
            if actual_value:
                self.actual_value = actual_value
        else:
            self.stage = 'closed_lost'
            
        self.actual_close_date = date.today()
        self.status = 'completed'
        db.session.commit()
    
    def move_to_stage(self, new_stage, probability=None):
        """Move deal to new stage"""
        self.stage = new_stage
        if probability is not None:
            self.probability = probability
        db.session.commit()
    
    def is_overdue(self):
        """Check if deal is overdue"""
        if not self.expected_close_date:
            return False
        return self.expected_close_date < date.today() and self.stage not in ['closed_won', 'closed_lost']
    
    @staticmethod
    def get_pipeline_summary():
        """Get pipeline summary by stage"""
        stages = ['lead', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost']
        summary = {}
        
        for stage in stages:
            deals = Deal.query.filter_by(stage=stage, status='active').all()
            summary[stage] = {
                'count': len(deals),
                'total_value': sum(deal.get_weighted_value() for deal in deals),
                'avg_value': sum(deal.get_weighted_value() for deal in deals) / len(deals) if deals else 0
            }
            
        return summary
    
    @staticmethod
    def get_overdue_deals():
        """Get deals that are overdue"""
        return Deal.query.filter(
            Deal.expected_close_date < date.today(),
            Deal.stage.notin_(['closed_won', 'closed_lost']),
            Deal.status == 'active'
        ).all()
    
    @staticmethod
    def get_deals_by_owner(owner_id):
        """Get deals by owner"""
        return Deal.query.filter_by(owner_id=owner_id).all()
    
    def __repr__(self):
        return f'<Deal {self.deal_name}>'

class DealItem(db.Model):
    __tablename__ = 'deal_items'
    
    id = db.Column(db.Integer, primary_key=True)
    deal_id = db.Column(db.Integer, db.ForeignKey('deals.id'), nullable=False, index=True)
    product_name = db.Column(db.String(200), nullable=False, index=True)
    product_category = db.Column(db.String(100), index=True)
    description = db.Column(db.Text)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    unit_price = db.Column(db.Numeric(15, 2), nullable=False, default=0.00)
    discount_percentage = db.Column(db.Numeric(5, 2), default=0.00)
    tax_rate = db.Column(db.Numeric(5, 2), default=0.00)
    total_amount = db.Column(db.Numeric(15, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert deal item to dictionary"""
        return {
            'id': self.id,
            'deal_id': self.deal_id,
            'product_name': self.product_name,
            'product_category': self.product_category,
            'description': self.description,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price) if self.unit_price else 0.0,
            'discount_percentage': float(self.discount_percentage) if self.discount_percentage else 0.0,
            'tax_rate': float(self.tax_rate) if self.tax_rate else 0.0,
            'total_amount': float(self.total_amount) if self.total_amount else 0.0,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def calculate_total(self):
        """Calculate total amount including discount and tax"""
        subtotal = self.quantity * self.unit_price
        discount_amount = subtotal * (self.discount_percentage / 100)
        after_discount = subtotal - discount_amount
        tax_amount = after_discount * (self.tax_rate / 100)
        self.total_amount = after_discount + tax_amount
        db.session.commit()
        return self.total_amount
    
    def __repr__(self):
        return f'<DealItem {self.product_name}>'
