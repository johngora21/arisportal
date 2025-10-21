from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Tag(db.Model):
    __tablename__ = 'tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False, index=True)
    color = db.Column(db.String(7), default='#3B82F6')
    description = db.Column(db.Text)
    category = db.Column(db.Enum('contact', 'deal', 'general'), default='general', index=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    contact_tags = db.relationship('ContactTag', backref='tag', lazy=True, cascade='all, delete-orphan')
    deal_tags = db.relationship('DealTag', backref='tag', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert tag to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'color': self.color,
            'description': self.description,
            'category': self.category,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat()
        }
    
    @staticmethod
    def get_by_category(category):
        """Get tags by category"""
        return Tag.query.filter_by(category=category).all()
    
    @staticmethod
    def get_or_create(name, category='general', color='#3B82F6', created_by=None):
        """Get existing tag or create new one"""
        tag = Tag.query.filter_by(name=name, category=category).first()
        if not tag:
            tag = Tag(
                name=name,
                category=category,
                color=color,
                created_by=created_by
            )
            db.session.add(tag)
            db.session.commit()
        return tag
    
    def __repr__(self):
        return f'<Tag {self.name}>'

class ContactTag(db.Model):
    __tablename__ = 'contact_tags'
    
    id = db.Column(db.Integer, primary_key=True)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=False, index=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('contact_id', 'tag_id', name='unique_contact_tag'),)
    
    def to_dict(self):
        """Convert contact tag to dictionary"""
        return {
            'id': self.id,
            'contact_id': self.contact_id,
            'tag_id': self.tag_id,
            'tag': self.tag.to_dict() if self.tag else None,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f'<ContactTag {self.contact_id} - {self.tag_id}>'

class DealTag(db.Model):
    __tablename__ = 'deal_tags'
    
    id = db.Column(db.Integer, primary_key=True)
    deal_id = db.Column(db.Integer, db.ForeignKey('deals.id'), nullable=False, index=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('deal_id', 'tag_id', name='unique_deal_tag'),)
    
    def to_dict(self):
        """Convert deal tag to dictionary"""
        return {
            'id': self.id,
            'deal_id': self.deal_id,
            'tag_id': self.tag_id,
            'tag': self.tag.to_dict() if self.tag else None,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f'<DealTag {self.deal_id} - {self.tag_id}>'
