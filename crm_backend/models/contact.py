from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Contact(db.Model):
    __tablename__ = 'contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    company = db.Column(db.String(200), index=True)
    job_title = db.Column(db.String(100))
    email = db.Column(db.String(120), index=True)
    phone = db.Column(db.String(20))
    whatsapp = db.Column(db.String(20))
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    country = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    website = db.Column(db.String(255))
    linkedin_url = db.Column(db.String(255))
    status = db.Column(db.Enum('lead', 'prospect', 'customer', 'inactive', 'qualified', 'unqualified'), 
                      default='lead', index=True)
    source = db.Column(db.Enum('website', 'referral', 'cold_call', 'email', 'social_media', 'trade_show', 'other'), 
                      default='other', index=True)
    lead_score = db.Column(db.Integer, default=0)
    estimated_value = db.Column(db.Numeric(15, 2), default=0.00)
    last_contact_date = db.Column(db.DateTime, index=True)
    next_follow_up = db.Column(db.DateTime, index=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    deals = db.relationship('Deal', backref='contact', lazy=True, cascade='all, delete-orphan')
    communications = db.relationship('Communication', backref='contact', lazy=True, cascade='all, delete-orphan')
    notes = db.relationship('Note', backref='contact', lazy=True, cascade='all, delete-orphan')
    activities = db.relationship('Activity', backref='contact', lazy=True, cascade='all, delete-orphan')
    tags = db.relationship('ContactTag', backref='contact', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_relationships=False):
        """Convert contact to dictionary"""
        data = {
            'id': self.id,
            'name': self.name,
            'company': self.company,
            'job_title': self.job_title,
            'email': self.email,
            'phone': self.phone,
            'whatsapp': self.whatsapp,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'postal_code': self.postal_code,
            'website': self.website,
            'linkedin_url': self.linkedin_url,
            'status': self.status,
            'source': self.source,
            'lead_score': self.lead_score,
            'estimated_value': float(self.estimated_value) if self.estimated_value else 0.0,
            'last_contact_date': self.last_contact_date.isoformat() if self.last_contact_date else None,
            'next_follow_up': self.next_follow_up.isoformat() if self.next_follow_up else None,
            'owner_id': self.owner_id,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_relationships:
            data['deals'] = [deal.to_dict() for deal in self.deals]
            data['communications'] = [comm.to_dict() for comm in self.communications]
            data['notes'] = [note.to_dict() for note in self.notes]
            data['tags'] = [tag.tag.to_dict() for tag in self.tags]
            
        return data
    
    def update_last_contact(self):
        """Update last contact date"""
        self.last_contact_date = datetime.utcnow()
        db.session.commit()
    
    def calculate_lead_score(self):
        """Calculate lead score based on various factors"""
        score = 0
        
        # Email presence
        if self.email:
            score += 10
            
        # Phone presence
        if self.phone:
            score += 10
            
        # Company presence
        if self.company:
            score += 15
            
        # Job title presence
        if self.job_title:
            score += 10
            
        # Website presence
        if self.website:
            score += 5
            
        # LinkedIn presence
        if self.linkedin_url:
            score += 10
            
        # Status bonus
        if self.status == 'qualified':
            score += 20
        elif self.status == 'prospect':
            score += 15
        elif self.status == 'customer':
            score += 25
            
        # Source bonus
        if self.source == 'referral':
            score += 15
        elif self.source == 'website':
            score += 10
            
        self.lead_score = min(score, 100)  # Cap at 100
        db.session.commit()
        
        return self.lead_score
    
    @staticmethod
    def search_contacts(query, user_id=None):
        """Search contacts by name, company, or email"""
        search_filter = db.or_(
            Contact.name.ilike(f'%{query}%'),
            Contact.company.ilike(f'%{query}%'),
            Contact.email.ilike(f'%{query}%')
        )
        
        if user_id:
            return Contact.query.filter(search_filter, Contact.owner_id == user_id).all()
        return Contact.query.filter(search_filter).all()
    
    @staticmethod
    def get_by_status(status):
        """Get contacts by status"""
        return Contact.query.filter_by(status=status).all()
    
    @staticmethod
    def get_overdue_followups():
        """Get contacts with overdue follow-ups"""
        return Contact.query.filter(
            Contact.next_follow_up < datetime.utcnow(),
            Contact.next_follow_up.isnot(None)
        ).all()
    
    def __repr__(self):
        return f'<Contact {self.name}>'
