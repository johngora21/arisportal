from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Communication(db.Model):
    __tablename__ = 'communications'
    
    id = db.Column(db.Integer, primary_key=True)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), index=True)
    deal_id = db.Column(db.Integer, db.ForeignKey('deals.id'), index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    type = db.Column(db.Enum('email', 'phone', 'meeting', 'note', 'task', 'sms', 'whatsapp'), 
                    nullable=False, index=True)
    direction = db.Column(db.Enum('inbound', 'outbound'), default='outbound', index=True)
    subject = db.Column(db.String(255))
    content = db.Column(db.Text)
    status = db.Column(db.Enum('sent', 'delivered', 'read', 'replied', 'failed', 'pending'), 
                      default='sent', index=True)
    scheduled_at = db.Column(db.DateTime, index=True)
    completed_at = db.Column(db.DateTime, index=True)
    duration_minutes = db.Column(db.Integer, default=0)
    outcome = db.Column(db.Enum('positive', 'neutral', 'negative', 'no_response'), default='neutral')
    follow_up_required = db.Column(db.Boolean, default=False)
    follow_up_date = db.Column(db.DateTime, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert communication to dictionary"""
        return {
            'id': self.id,
            'contact_id': self.contact_id,
            'deal_id': self.deal_id,
            'user_id': self.user_id,
            'type': self.type,
            'direction': self.direction,
            'subject': self.subject,
            'content': self.content,
            'status': self.status,
            'scheduled_at': self.scheduled_at.isoformat() if self.scheduled_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'duration_minutes': self.duration_minutes,
            'outcome': self.outcome,
            'follow_up_required': self.follow_up_required,
            'follow_up_date': self.follow_up_date.isoformat() if self.follow_up_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def mark_completed(self, outcome='neutral', duration_minutes=0):
        """Mark communication as completed"""
        self.completed_at = datetime.utcnow()
        self.status = 'delivered'
        self.outcome = outcome
        self.duration_minutes = duration_minutes
        db.session.commit()
    
    def schedule_follow_up(self, follow_up_date):
        """Schedule a follow-up"""
        self.follow_up_required = True
        self.follow_up_date = follow_up_date
        db.session.commit()
    
    @staticmethod
    def get_scheduled_communications():
        """Get communications scheduled for today or overdue"""
        return Communication.query.filter(
            Communication.scheduled_at <= datetime.utcnow(),
            Communication.status == 'pending'
        ).all()
    
    @staticmethod
    def get_follow_ups_due():
        """Get communications with follow-ups due"""
        return Communication.query.filter(
            Communication.follow_up_date <= datetime.utcnow(),
            Communication.follow_up_required == True
        ).all()
    
    def __repr__(self):
        return f'<Communication {self.type} - {self.subject}>'

class Note(db.Model):
    __tablename__ = 'notes'
    
    id = db.Column(db.Integer, primary_key=True)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), index=True)
    deal_id = db.Column(db.Integer, db.ForeignKey('deals.id'), index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    title = db.Column(db.String(255))
    content = db.Column(db.Text, nullable=False)
    is_private = db.Column(db.Boolean, default=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert note to dictionary"""
        return {
            'id': self.id,
            'contact_id': self.contact_id,
            'deal_id': self.deal_id,
            'user_id': self.user_id,
            'title': self.title,
            'content': self.content,
            'is_private': self.is_private,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Note {self.title or "Untitled"}>'

class Activity(db.Model):
    __tablename__ = 'activities'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), index=True)
    deal_id = db.Column(db.Integer, db.ForeignKey('deals.id'), index=True)
    activity_type = db.Column(db.Enum('created', 'updated', 'deleted', 'viewed', 'emailed', 'called', 'met', 'task_completed'), 
                             nullable=False, index=True)
    entity_type = db.Column(db.Enum('contact', 'deal', 'communication', 'note', 'user'), 
                           nullable=False, index=True)
    entity_id = db.Column(db.Integer, index=True)
    description = db.Column(db.Text)
    old_values = db.Column(db.JSON)
    new_values = db.Column(db.JSON)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert activity to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'contact_id': self.contact_id,
            'deal_id': self.deal_id,
            'activity_type': self.activity_type,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'description': self.description,
            'old_values': self.old_values,
            'new_values': self.new_values,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'created_at': self.created_at.isoformat()
        }
    
    @staticmethod
    def log_activity(user_id, activity_type, entity_type, entity_id, description=None, 
                    old_values=None, new_values=None, contact_id=None, deal_id=None):
        """Log an activity"""
        activity = Activity(
            user_id=user_id,
            contact_id=contact_id,
            deal_id=deal_id,
            activity_type=activity_type,
            entity_type=entity_type,
            entity_id=entity_id,
            description=description,
            old_values=old_values,
            new_values=new_values
        )
        db.session.add(activity)
        db.session.commit()
        return activity
    
    def __repr__(self):
        return f'<Activity {self.activity_type} - {self.entity_type}>'
