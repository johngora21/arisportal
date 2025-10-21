from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3002"])

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost:3306/arisportal_crm'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize database
db = SQLAlchemy(app)

# Simple User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), default='crm_user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

# Simple Contact model
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), default='lead')
    value = db.Column(db.Float, default=0.0)
    notes = db.Column(db.Text, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'company': self.company,
            'email': self.email,
            'phone': self.phone,
            'location': self.location,
            'status': self.status,
            'value': self.value,
            'notes': self.notes,
            'owner_id': self.owner_id,
            'created_at': self.created_at.isoformat()
        }

# Simple Deal model
class Deal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(255), nullable=False)
    product_category = db.Column(db.String(100), nullable=True)
    buyer_name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id'), nullable=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'product_name': self.product_name,
            'product_category': self.product_category,
            'buyer_name': self.buyer_name,
            'address': self.address,
            'email': self.email,
            'phone': self.phone,
            'order_date': self.order_date.isoformat(),
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'total_price': self.quantity * self.unit_price,
            'status': self.status,
            'contact_id': self.contact_id,
            'creator_id': self.creator_id,
            'created_at': self.created_at.isoformat()
        }

# Routes
@app.route('/')
def home():
    return "CRM Backend is running!"

@app.route('/api/v1/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'message': 'CRM Backend is running!'}), 200

# User routes
@app.route('/api/v1/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    new_user = User(
        full_name=data['full_name'],
        email=data['email'],
        password_hash=data['password'],  # In production, hash this
        role=data.get('role', 'crm_user')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        'message': 'User created successfully',
        'user': new_user.to_dict()
    }), 201

# Contact routes
@app.route('/api/v1/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    return jsonify([contact.to_dict() for contact in contacts]), 200

@app.route('/api/v1/contacts', methods=['POST'])
def create_contact():
    data = request.get_json()
    
    new_contact = Contact(
        name=data['name'],
        company=data.get('company'),
        email=data.get('email'),
        phone=data.get('phone'),
        location=data.get('location'),
        status=data.get('status', 'lead'),
        value=data.get('value', 0.0),
        notes=data.get('notes'),
        owner_id=data.get('owner_id', 1)  # Default to user ID 1
    )
    
    db.session.add(new_contact)
    db.session.commit()
    
    return jsonify({
        'message': 'Contact created successfully',
        'contact': new_contact.to_dict()
    }), 201

# Deal routes
@app.route('/api/v1/deals', methods=['GET'])
def get_deals():
    deals = Deal.query.all()
    return jsonify([deal.to_dict() for deal in deals]), 200

@app.route('/api/v1/deals', methods=['POST'])
def create_deal():
    data = request.get_json()
    
    # First, check if contact exists, if not create one
    contact_id = data.get('contact_id')
    if not contact_id and data.get('buyer_name'):
        # Check if contact already exists by name and email
        existing_contact = Contact.query.filter_by(
            name=data['buyer_name'],
            email=data.get('email', '')
        ).first()
        
        if not existing_contact:
            # Create new contact from deal information
            new_contact = Contact(
                name=data['buyer_name'],
                company=data.get('company', ''),
                email=data.get('email', ''),
                phone=data.get('phone', ''),
                location=data.get('address', '').split(',')[0] if data.get('address') else '',
                status='customer',  # If they're buying, they're a customer
                value=data['quantity'] * data['unit_price'],
                notes=f'Created from deal: {data["product_name"]}',
                owner_id=data.get('creator_id', 1)
            )
            db.session.add(new_contact)
            db.session.flush()  # Get the ID without committing
            contact_id = new_contact.id
        else:
            contact_id = existing_contact.id
    
    new_deal = Deal(
        product_name=data['product_name'],
        product_category=data.get('product_category'),
        buyer_name=data['buyer_name'],
        address=data['address'],
        email=data.get('email'),
        phone=data.get('phone'),
        order_date=datetime.fromisoformat(data['order_date']) if data.get('order_date') else datetime.utcnow(),
        quantity=data['quantity'],
        unit_price=data['unit_price'],
        status=data.get('status', 'pending'),
        contact_id=contact_id,
        creator_id=data.get('creator_id', 1)  # Default to user ID 1
    )
    
    db.session.add(new_deal)
    db.session.commit()
    
    return jsonify({
        'message': 'Deal created successfully',
        'deal': new_deal.to_dict()
    }), 201

@app.route('/api/v1/sync-deals-to-contacts', methods=['POST'])
def sync_deals_to_contacts():
    """Sync existing deals to create contacts"""
    deals = Deal.query.filter_by(contact_id=None).all()
    created_contacts = []
    
    for deal in deals:
        if deal.buyer_name:
            # Check if contact already exists
            existing_contact = Contact.query.filter_by(
                name=deal.buyer_name,
                email=deal.email or ''
            ).first()
            
            if not existing_contact:
                # Create new contact from deal information
                new_contact = Contact(
                    name=deal.buyer_name,
                    company='',
                    email=deal.email or '',
                    phone=deal.phone or '',
                    location=deal.address.split(',')[0] if deal.address else '',
                    status='customer',
                    value=deal.quantity * deal.unit_price,
                    notes=f'Created from deal: {deal.product_name}',
                    owner_id=deal.creator_id
                )
                db.session.add(new_contact)
                db.session.flush()  # Get the ID without committing
                deal.contact_id = new_contact.id
                created_contacts.append(new_contact.to_dict())
            else:
                deal.contact_id = existing_contact.id
    
    db.session.commit()
    
    return jsonify({
        'message': f'Synced {len(created_contacts)} deals to contacts',
        'created_contacts': created_contacts
    }), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database tables created!")
    
    app.run(debug=True, port=5000)
