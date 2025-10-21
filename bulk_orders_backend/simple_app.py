from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bulk_orders_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize extensions
db = SQLAlchemy(app)
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'])

# Models
class BulkOrderPool(db.Model):
    __tablename__ = 'bulk_order_pools'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image = db.Column(db.Text)  # Base64 image data
    images = db.Column(db.JSON)  # Array of base64 image data
    videos = db.Column(db.JSON)  # Array of base64 video data
    tags = db.Column(db.JSON)   # Array of tags
    
    # Supplier details
    manufacturer = db.Column(db.String(200))
    supplier_contact_name = db.Column(db.String(100))
    supplier_contact_phone = db.Column(db.String(50))
    supplier_contact_email = db.Column(db.String(100))
    supplier_location = db.Column(db.String(200))
    supplier_website = db.Column(db.String(200))
    supplier_facebook = db.Column(db.String(200))
    supplier_twitter = db.Column(db.String(200))
    supplier_linkedin = db.Column(db.String(200))
    
    # Organizer details
    organizer = db.Column(db.String(200), nullable=False)
    organizer_contact_name = db.Column(db.String(100))
    organizer_contact_phone = db.Column(db.String(50))
    organizer_contact_email = db.Column(db.String(100))
    organizer_location = db.Column(db.String(200))
    organizer_website = db.Column(db.String(200))
    organizer_facebook = db.Column(db.String(200))
    organizer_twitter = db.Column(db.String(200))
    organizer_linkedin = db.Column(db.String(200))
    organizer_rating = db.Column(db.Float, default=0.0)
    
    # Product details
    specs = db.Column(db.JSON)  # Array of specifications
    included = db.Column(db.JSON)  # Array of included items
    lead_time_days = db.Column(db.Integer)
    payment_terms = db.Column(db.String(200))
    return_policy = db.Column(db.String(200))
    logistics_delivery = db.Column(db.JSON)  # Array of delivery options
    logistics_pickup = db.Column(db.JSON)   # Array of pickup locations
    
    # Pool details
    target_quantity = db.Column(db.Integer, nullable=False)
    price_per_unit = db.Column(db.Float, nullable=False)
    deadline = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='active')  # active, closed, ready
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    participants = db.relationship('PoolParticipant', backref='pool', lazy=True, cascade='all, delete-orphan')
    payments = db.relationship('PoolPayment', backref='pool', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        current_quantity = sum(p.quantity for p in self.participants)
        return {
            'id': str(self.id),
            'title': self.title,
            'category': self.category,
            'description': self.description,
            'image': self.image,
            'images': self.images or [],
            'videos': self.videos or [],
            'tags': self.tags or [],
            'manufacturer': self.manufacturer,
            'supplierContactName': self.supplier_contact_name,
            'supplierContactPhone': self.supplier_contact_phone,
            'supplierContactEmail': self.supplier_contact_email,
            'supplierLocation': self.supplier_location,
            'supplierWebsite': self.supplier_website,
            'supplierFacebook': self.supplier_facebook,
            'supplierTwitter': self.supplier_twitter,
            'supplierLinkedIn': self.supplier_linkedin,
            'organizer': self.organizer,
            'organizerContactName': self.organizer_contact_name,
            'organizerContactPhone': self.organizer_contact_phone,
            'organizerContactEmail': self.organizer_contact_email,
            'organizerLocation': self.organizer_location,
            'organizerWebsite': self.organizer_website,
            'organizerFacebook': self.organizer_facebook,
            'organizerTwitter': self.organizer_twitter,
            'organizerLinkedIn': self.organizer_linkedin,
            'organizerRating': self.organizer_rating,
            'specs': self.specs or [],
            'included': self.included or [],
            'leadTimeDays': self.lead_time_days,
            'paymentTerms': self.payment_terms,
            'returnPolicy': self.return_policy,
            'logisticsDelivery': self.logistics_delivery or [],
            'logisticsPickup': self.logistics_pickup or [],
            'targetQuantity': self.target_quantity,
            'pricePerUnit': self.price_per_unit,
            'deadline': self.deadline.strftime('%Y-%m-%d') if self.deadline else None,
            'status': self.status,
            'participants': [p.to_dict() for p in self.participants],
            'currentQuantity': current_quantity,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }

class PoolParticipant(db.Model):
    __tablename__ = 'pool_participants'
    
    id = db.Column(db.Integer, primary_key=True)
    pool_id = db.Column(db.Integer, db.ForeignKey('bulk_order_pools.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(200))
    quantity = db.Column(db.Integer, nullable=False)
    joined_date = db.Column(db.Date, default=datetime.utcnow().date)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, cancelled
    
    # Contact details
    email = db.Column(db.String(100))
    phone = db.Column(db.String(50))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'company': self.company,
            'quantity': self.quantity,
            'joinedDate': self.joined_date.strftime('%Y-%m-%d') if self.joined_date else None,
            'status': self.status,
            'email': self.email,
            'phone': self.phone
        }

class PoolPayment(db.Model):
    __tablename__ = 'pool_payments'
    
    id = db.Column(db.Integer, primary_key=True)
    pool_id = db.Column(db.Integer, db.ForeignKey('bulk_order_pools.id'), nullable=False)
    participant_id = db.Column(db.Integer, db.ForeignKey('pool_participants.id'), nullable=True)
    
    # Payment details
    amount = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)  # mno, card, control
    payment_status = db.Column(db.String(20), default='pending')  # pending, completed, failed, refunded
    
    # Payment method specific fields
    mno_phone = db.Column(db.String(50))
    card_name = db.Column(db.String(100))
    card_number = db.Column(db.String(50))
    card_expiry = db.Column(db.String(10))
    card_cvv = db.Column(db.String(10))
    control_number = db.Column(db.String(50))
    
    # Transaction details
    transaction_id = db.Column(db.String(100))
    payment_reference = db.Column(db.String(100))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    paid_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'amount': self.amount,
            'quantity': self.quantity,
            'paymentMethod': self.payment_method,
            'paymentStatus': self.payment_status,
            'mnoPhone': self.mno_phone,
            'cardName': self.card_name,
            'cardNumber': self.card_number,
            'cardExpiry': self.card_expiry,
            'cardCvv': self.card_cvv,
            'controlNumber': self.control_number,
            'transactionId': self.transaction_id,
            'paymentReference': self.payment_reference,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'paidAt': self.paid_at.isoformat() if self.paid_at else None
        }

# API Routes
@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'bulk-orders-backend'})

@app.route('/api/v1/pools', methods=['GET'])
def get_pools():
    """Get all bulk order pools with optional filtering"""
    try:
        # Query parameters
        search = request.args.get('search', '')
        country = request.args.get('country', '')
        status = request.args.get('status', '')
        
        query = BulkOrderPool.query
        
        # Apply filters
        if search:
            query = query.filter(
                db.or_(
                    BulkOrderPool.title.contains(search),
                    BulkOrderPool.organizer.contains(search),
                    BulkOrderPool.manufacturer.contains(search),
                    BulkOrderPool.description.contains(search)
                )
            )
        
        if country:
            query = query.filter(
                db.or_(
                    BulkOrderPool.supplier_location.contains(country),
                    BulkOrderPool.organizer_location.contains(country)
                )
            )
        
        if status:
            query = query.filter(BulkOrderPool.status == status)
        
        pools = query.order_by(BulkOrderPool.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [pool.to_dict() for pool in pools],
            'count': len(pools)
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools/<int:pool_id>', methods=['GET'])
def get_pool(pool_id):
    """Get a specific bulk order pool by ID"""
    try:
        pool = BulkOrderPool.query.get_or_404(pool_id)
        return jsonify({
            'success': True,
            'data': pool.to_dict()
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools', methods=['POST'])
def create_pool():
    """Create a new bulk order pool"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'category', 'organizer', 'targetQuantity', 'pricePerUnit', 'deadline']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        # Create new pool
        pool = BulkOrderPool(
            title=data['title'],
            category=data['category'],
            description=data.get('description'),
            image=data.get('image'),
            images=data.get('images', []),
            videos=data.get('videos', []),
            tags=data.get('tags', []),
            manufacturer=data.get('manufacturer'),
            supplier_contact_name=data.get('supplierContactName'),
            supplier_contact_phone=data.get('supplierContactPhone'),
            supplier_contact_email=data.get('supplierContactEmail'),
            supplier_location=data.get('supplierLocation'),
            supplier_website=data.get('supplierWebsite'),
            supplier_facebook=data.get('supplierFacebook'),
            supplier_twitter=data.get('supplierTwitter'),
            supplier_linkedin=data.get('supplierLinkedIn'),
            organizer=data['organizer'],
            organizer_contact_name=data.get('organizerContactName'),
            organizer_contact_phone=data.get('organizerContactPhone'),
            organizer_contact_email=data.get('organizerContactEmail'),
            organizer_location=data.get('organizerLocation'),
            organizer_website=data.get('organizerWebsite'),
            organizer_facebook=data.get('organizerFacebook'),
            organizer_twitter=data.get('organizerTwitter'),
            organizer_linkedin=data.get('organizerLinkedIn'),
            organizer_rating=data.get('organizerRating', 0.0),
            specs=data.get('specs', []),
            included=data.get('included', []),
            lead_time_days=data.get('leadTimeDays'),
            payment_terms=data.get('paymentTerms'),
            return_policy=data.get('returnPolicy'),
            logistics_delivery=data.get('logisticsDelivery', []),
            logistics_pickup=data.get('logisticsPickup', []),
            target_quantity=data['targetQuantity'],
            price_per_unit=data['pricePerUnit'],
            deadline=datetime.strptime(data['deadline'], '%Y-%m-%d').date(),
            status=data.get('status', 'active')
        )
        
        db.session.add(pool)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': pool.to_dict(),
            'message': 'Pool created successfully'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools/<int:pool_id>', methods=['PUT'])
def update_pool(pool_id):
    """Update a bulk order pool"""
    try:
        pool = BulkOrderPool.query.get_or_404(pool_id)
        data = request.get_json()
        
        # Update fields
        for field, value in data.items():
            if hasattr(pool, field):
                setattr(pool, field, value)
        
        pool.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': pool.to_dict(),
            'message': 'Pool updated successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools/<int:pool_id>', methods=['DELETE'])
def delete_pool(pool_id):
    """Delete a bulk order pool"""
    try:
        pool = BulkOrderPool.query.get_or_404(pool_id)
        db.session.delete(pool)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Pool deleted successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools/<int:pool_id>/join', methods=['POST'])
def join_pool(pool_id):
    """Join a bulk order pool"""
    try:
        pool = BulkOrderPool.query.get_or_404(pool_id)
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('quantity'):
            return jsonify({'success': False, 'error': 'Name and quantity are required'}), 400
        
        quantity = int(data['quantity'])
        
        # Check if pool is still active
        if pool.status != 'active':
            return jsonify({'success': False, 'error': 'Pool is not active'}), 400
        
        # Check if target quantity is reached
        current_quantity = sum(p.quantity for p in pool.participants)
        if current_quantity + quantity > pool.target_quantity:
            remaining = pool.target_quantity - current_quantity
            return jsonify({'success': False, 'error': f'Only {remaining} units remaining'}), 400
        
        # Create participant
        participant = PoolParticipant(
            pool_id=pool_id,
            name=data['name'],
            company=data.get('company', '—'),
            quantity=quantity,
            email=data.get('email'),
            phone=data.get('phone'),
            status='pending'
        )
        
        db.session.add(participant)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': participant.to_dict(),
            'message': f'Successfully joined pool with {quantity} unit(s)'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools/<int:pool_id>/payments', methods=['POST'])
def create_payment(pool_id):
    """Create a payment for joining a pool"""
    try:
        pool = BulkOrderPool.query.get_or_404(pool_id)
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['quantity', 'paymentMethod']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        quantity = int(data['quantity'])
        payment_method = data['paymentMethod']
        
        # Calculate amount
        amount = pool.price_per_unit * quantity
        
        # Create payment record
        payment = PoolPayment(
            pool_id=pool_id,
            amount=amount,
            quantity=quantity,
            payment_method=payment_method,
            payment_status='pending',
            mno_phone=data.get('mnoPhone'),
            card_name=data.get('cardName'),
            card_number=data.get('cardNumber'),
            card_expiry=data.get('cardExpiry'),
            card_cvv=data.get('cardCvv'),
            control_number=data.get('controlNumber'),
            transaction_id=data.get('transactionId'),
            payment_reference=data.get('paymentReference')
        )
        
        db.session.add(payment)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': payment.to_dict(),
            'message': 'Payment created successfully'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/payments/<int:payment_id>/confirm', methods=['POST'])
def confirm_payment(payment_id):
    """Confirm a payment and add participant to pool"""
    try:
        payment = PoolPayment.query.get_or_404(payment_id)
        
        if payment.payment_status != 'pending':
            return jsonify({'success': False, 'error': 'Payment already processed'}), 400
        
        # Update payment status
        payment.payment_status = 'completed'
        payment.paid_at = datetime.utcnow()
        
        # Create participant
        participant = PoolParticipant(
            pool_id=payment.pool_id,
            name=payment.card_name or 'Participant',
            company='—',
            quantity=payment.quantity,
            status='confirmed'
        )
        
        db.session.add(participant)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'payment': payment.to_dict(),
                'participant': participant.to_dict()
            },
            'message': 'Payment confirmed and participant added to pool'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/analytics/stats', methods=['GET'])
def get_analytics():
    """Get analytics data for bulk orders"""
    try:
        total_pools = BulkOrderPool.query.count()
        active_pools = BulkOrderPool.query.filter_by(status='active').count()
        closed_pools = BulkOrderPool.query.filter_by(status='closed').count()
        total_participants = PoolParticipant.query.count()
        total_payments = PoolPayment.query.count()
        
        # Calculate total revenue
        completed_payments = PoolPayment.query.filter_by(payment_status='completed').all()
        total_revenue = sum(p.amount for p in completed_payments)
        
        return jsonify({
            'success': True,
            'data': {
                'totalPools': total_pools,
                'activePools': active_pools,
                'closedPools': closed_pools,
                'totalParticipants': total_participants,
                'totalPayments': total_payments,
                'totalRevenue': total_revenue
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Bulk orders database tables created!")
    
    app.run(debug=True, host='0.0.0.0', port=5002)

from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bulk_orders_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize extensions
db = SQLAlchemy(app)
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'])

# Models
class BulkOrderPool(db.Model):
    __tablename__ = 'bulk_order_pools'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image = db.Column(db.Text)  # Base64 image data
    images = db.Column(db.JSON)  # Array of base64 image data
    videos = db.Column(db.JSON)  # Array of base64 video data
    tags = db.Column(db.JSON)   # Array of tags
    
    # Supplier details
    manufacturer = db.Column(db.String(200))
    supplier_contact_name = db.Column(db.String(100))
    supplier_contact_phone = db.Column(db.String(50))
    supplier_contact_email = db.Column(db.String(100))
    supplier_location = db.Column(db.String(200))
    supplier_website = db.Column(db.String(200))
    supplier_facebook = db.Column(db.String(200))
    supplier_twitter = db.Column(db.String(200))
    supplier_linkedin = db.Column(db.String(200))
    
    # Organizer details
    organizer = db.Column(db.String(200), nullable=False)
    organizer_contact_name = db.Column(db.String(100))
    organizer_contact_phone = db.Column(db.String(50))
    organizer_contact_email = db.Column(db.String(100))
    organizer_location = db.Column(db.String(200))
    organizer_website = db.Column(db.String(200))
    organizer_facebook = db.Column(db.String(200))
    organizer_twitter = db.Column(db.String(200))
    organizer_linkedin = db.Column(db.String(200))
    organizer_rating = db.Column(db.Float, default=0.0)
    
    # Product details
    specs = db.Column(db.JSON)  # Array of specifications
    included = db.Column(db.JSON)  # Array of included items
    lead_time_days = db.Column(db.Integer)
    payment_terms = db.Column(db.String(200))
    return_policy = db.Column(db.String(200))
    logistics_delivery = db.Column(db.JSON)  # Array of delivery options
    logistics_pickup = db.Column(db.JSON)   # Array of pickup locations
    
    # Pool details
    target_quantity = db.Column(db.Integer, nullable=False)
    price_per_unit = db.Column(db.Float, nullable=False)
    deadline = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='active')  # active, closed, ready
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    participants = db.relationship('PoolParticipant', backref='pool', lazy=True, cascade='all, delete-orphan')
    payments = db.relationship('PoolPayment', backref='pool', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        current_quantity = sum(p.quantity for p in self.participants)
        return {
            'id': str(self.id),
            'title': self.title,
            'category': self.category,
            'description': self.description,
            'image': self.image,
            'images': self.images or [],
            'videos': self.videos or [],
            'tags': self.tags or [],
            'manufacturer': self.manufacturer,
            'supplierContactName': self.supplier_contact_name,
            'supplierContactPhone': self.supplier_contact_phone,
            'supplierContactEmail': self.supplier_contact_email,
            'supplierLocation': self.supplier_location,
            'supplierWebsite': self.supplier_website,
            'supplierFacebook': self.supplier_facebook,
            'supplierTwitter': self.supplier_twitter,
            'supplierLinkedIn': self.supplier_linkedin,
            'organizer': self.organizer,
            'organizerContactName': self.organizer_contact_name,
            'organizerContactPhone': self.organizer_contact_phone,
            'organizerContactEmail': self.organizer_contact_email,
            'organizerLocation': self.organizer_location,
            'organizerWebsite': self.organizer_website,
            'organizerFacebook': self.organizer_facebook,
            'organizerTwitter': self.organizer_twitter,
            'organizerLinkedIn': self.organizer_linkedin,
            'organizerRating': self.organizer_rating,
            'specs': self.specs or [],
            'included': self.included or [],
            'leadTimeDays': self.lead_time_days,
            'paymentTerms': self.payment_terms,
            'returnPolicy': self.return_policy,
            'logisticsDelivery': self.logistics_delivery or [],
            'logisticsPickup': self.logistics_pickup or [],
            'targetQuantity': self.target_quantity,
            'pricePerUnit': self.price_per_unit,
            'deadline': self.deadline.strftime('%Y-%m-%d') if self.deadline else None,
            'status': self.status,
            'participants': [p.to_dict() for p in self.participants],
            'currentQuantity': current_quantity,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }

class PoolParticipant(db.Model):
    __tablename__ = 'pool_participants'
    
    id = db.Column(db.Integer, primary_key=True)
    pool_id = db.Column(db.Integer, db.ForeignKey('bulk_order_pools.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(200))
    quantity = db.Column(db.Integer, nullable=False)
    joined_date = db.Column(db.Date, default=datetime.utcnow().date)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, cancelled
    
    # Contact details
    email = db.Column(db.String(100))
    phone = db.Column(db.String(50))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'company': self.company,
            'quantity': self.quantity,
            'joinedDate': self.joined_date.strftime('%Y-%m-%d') if self.joined_date else None,
            'status': self.status,
            'email': self.email,
            'phone': self.phone
        }

class PoolPayment(db.Model):
    __tablename__ = 'pool_payments'
    
    id = db.Column(db.Integer, primary_key=True)
    pool_id = db.Column(db.Integer, db.ForeignKey('bulk_order_pools.id'), nullable=False)
    participant_id = db.Column(db.Integer, db.ForeignKey('pool_participants.id'), nullable=True)
    
    # Payment details
    amount = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)  # mno, card, control
    payment_status = db.Column(db.String(20), default='pending')  # pending, completed, failed, refunded
    
    # Payment method specific fields
    mno_phone = db.Column(db.String(50))
    card_name = db.Column(db.String(100))
    card_number = db.Column(db.String(50))
    card_expiry = db.Column(db.String(10))
    card_cvv = db.Column(db.String(10))
    control_number = db.Column(db.String(50))
    
    # Transaction details
    transaction_id = db.Column(db.String(100))
    payment_reference = db.Column(db.String(100))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    paid_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'amount': self.amount,
            'quantity': self.quantity,
            'paymentMethod': self.payment_method,
            'paymentStatus': self.payment_status,
            'mnoPhone': self.mno_phone,
            'cardName': self.card_name,
            'cardNumber': self.card_number,
            'cardExpiry': self.card_expiry,
            'cardCvv': self.card_cvv,
            'controlNumber': self.control_number,
            'transactionId': self.transaction_id,
            'paymentReference': self.payment_reference,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'paidAt': self.paid_at.isoformat() if self.paid_at else None
        }

# API Routes
@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'bulk-orders-backend'})

@app.route('/api/v1/pools', methods=['GET'])
def get_pools():
    """Get all bulk order pools with optional filtering"""
    try:
        # Query parameters
        search = request.args.get('search', '')
        country = request.args.get('country', '')
        status = request.args.get('status', '')
        
        query = BulkOrderPool.query
        
        # Apply filters
        if search:
            query = query.filter(
                db.or_(
                    BulkOrderPool.title.contains(search),
                    BulkOrderPool.organizer.contains(search),
                    BulkOrderPool.manufacturer.contains(search),
                    BulkOrderPool.description.contains(search)
                )
            )
        
        if country:
            query = query.filter(
                db.or_(
                    BulkOrderPool.supplier_location.contains(country),
                    BulkOrderPool.organizer_location.contains(country)
                )
            )
        
        if status:
            query = query.filter(BulkOrderPool.status == status)
        
        pools = query.order_by(BulkOrderPool.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [pool.to_dict() for pool in pools],
            'count': len(pools)
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools/<int:pool_id>', methods=['GET'])
def get_pool(pool_id):
    """Get a specific bulk order pool by ID"""
    try:
        pool = BulkOrderPool.query.get_or_404(pool_id)
        return jsonify({
            'success': True,
            'data': pool.to_dict()
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools', methods=['POST'])
def create_pool():
    """Create a new bulk order pool"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'category', 'organizer', 'targetQuantity', 'pricePerUnit', 'deadline']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        # Create new pool
        pool = BulkOrderPool(
            title=data['title'],
            category=data['category'],
            description=data.get('description'),
            image=data.get('image'),
            images=data.get('images', []),
            videos=data.get('videos', []),
            tags=data.get('tags', []),
            manufacturer=data.get('manufacturer'),
            supplier_contact_name=data.get('supplierContactName'),
            supplier_contact_phone=data.get('supplierContactPhone'),
            supplier_contact_email=data.get('supplierContactEmail'),
            supplier_location=data.get('supplierLocation'),
            supplier_website=data.get('supplierWebsite'),
            supplier_facebook=data.get('supplierFacebook'),
            supplier_twitter=data.get('supplierTwitter'),
            supplier_linkedin=data.get('supplierLinkedIn'),
            organizer=data['organizer'],
            organizer_contact_name=data.get('organizerContactName'),
            organizer_contact_phone=data.get('organizerContactPhone'),
            organizer_contact_email=data.get('organizerContactEmail'),
            organizer_location=data.get('organizerLocation'),
            organizer_website=data.get('organizerWebsite'),
            organizer_facebook=data.get('organizerFacebook'),
            organizer_twitter=data.get('organizerTwitter'),
            organizer_linkedin=data.get('organizerLinkedIn'),
            organizer_rating=data.get('organizerRating', 0.0),
            specs=data.get('specs', []),
            included=data.get('included', []),
            lead_time_days=data.get('leadTimeDays'),
            payment_terms=data.get('paymentTerms'),
            return_policy=data.get('returnPolicy'),
            logistics_delivery=data.get('logisticsDelivery', []),
            logistics_pickup=data.get('logisticsPickup', []),
            target_quantity=data['targetQuantity'],
            price_per_unit=data['pricePerUnit'],
            deadline=datetime.strptime(data['deadline'], '%Y-%m-%d').date(),
            status=data.get('status', 'active')
        )
        
        db.session.add(pool)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': pool.to_dict(),
            'message': 'Pool created successfully'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools/<int:pool_id>', methods=['PUT'])
def update_pool(pool_id):
    """Update a bulk order pool"""
    try:
        pool = BulkOrderPool.query.get_or_404(pool_id)
        data = request.get_json()
        
        # Update fields
        for field, value in data.items():
            if hasattr(pool, field):
                setattr(pool, field, value)
        
        pool.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': pool.to_dict(),
            'message': 'Pool updated successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools/<int:pool_id>', methods=['DELETE'])
def delete_pool(pool_id):
    """Delete a bulk order pool"""
    try:
        pool = BulkOrderPool.query.get_or_404(pool_id)
        db.session.delete(pool)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Pool deleted successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools/<int:pool_id>/join', methods=['POST'])
def join_pool(pool_id):
    """Join a bulk order pool"""
    try:
        pool = BulkOrderPool.query.get_or_404(pool_id)
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('quantity'):
            return jsonify({'success': False, 'error': 'Name and quantity are required'}), 400
        
        quantity = int(data['quantity'])
        
        # Check if pool is still active
        if pool.status != 'active':
            return jsonify({'success': False, 'error': 'Pool is not active'}), 400
        
        # Check if target quantity is reached
        current_quantity = sum(p.quantity for p in pool.participants)
        if current_quantity + quantity > pool.target_quantity:
            remaining = pool.target_quantity - current_quantity
            return jsonify({'success': False, 'error': f'Only {remaining} units remaining'}), 400
        
        # Create participant
        participant = PoolParticipant(
            pool_id=pool_id,
            name=data['name'],
            company=data.get('company', '—'),
            quantity=quantity,
            email=data.get('email'),
            phone=data.get('phone'),
            status='pending'
        )
        
        db.session.add(participant)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': participant.to_dict(),
            'message': f'Successfully joined pool with {quantity} unit(s)'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/pools/<int:pool_id>/payments', methods=['POST'])
def create_payment(pool_id):
    """Create a payment for joining a pool"""
    try:
        pool = BulkOrderPool.query.get_or_404(pool_id)
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['quantity', 'paymentMethod']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        quantity = int(data['quantity'])
        payment_method = data['paymentMethod']
        
        # Calculate amount
        amount = pool.price_per_unit * quantity
        
        # Create payment record
        payment = PoolPayment(
            pool_id=pool_id,
            amount=amount,
            quantity=quantity,
            payment_method=payment_method,
            payment_status='pending',
            mno_phone=data.get('mnoPhone'),
            card_name=data.get('cardName'),
            card_number=data.get('cardNumber'),
            card_expiry=data.get('cardExpiry'),
            card_cvv=data.get('cardCvv'),
            control_number=data.get('controlNumber'),
            transaction_id=data.get('transactionId'),
            payment_reference=data.get('paymentReference')
        )
        
        db.session.add(payment)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': payment.to_dict(),
            'message': 'Payment created successfully'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/payments/<int:payment_id>/confirm', methods=['POST'])
def confirm_payment(payment_id):
    """Confirm a payment and add participant to pool"""
    try:
        payment = PoolPayment.query.get_or_404(payment_id)
        
        if payment.payment_status != 'pending':
            return jsonify({'success': False, 'error': 'Payment already processed'}), 400
        
        # Update payment status
        payment.payment_status = 'completed'
        payment.paid_at = datetime.utcnow()
        
        # Create participant
        participant = PoolParticipant(
            pool_id=payment.pool_id,
            name=payment.card_name or 'Participant',
            company='—',
            quantity=payment.quantity,
            status='confirmed'
        )
        
        db.session.add(participant)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'payment': payment.to_dict(),
                'participant': participant.to_dict()
            },
            'message': 'Payment confirmed and participant added to pool'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/analytics/stats', methods=['GET'])
def get_analytics():
    """Get analytics data for bulk orders"""
    try:
        total_pools = BulkOrderPool.query.count()
        active_pools = BulkOrderPool.query.filter_by(status='active').count()
        closed_pools = BulkOrderPool.query.filter_by(status='closed').count()
        total_participants = PoolParticipant.query.count()
        total_payments = PoolPayment.query.count()
        
        # Calculate total revenue
        completed_payments = PoolPayment.query.filter_by(payment_status='completed').all()
        total_revenue = sum(p.amount for p in completed_payments)
        
        return jsonify({
            'success': True,
            'data': {
                'totalPools': total_pools,
                'activePools': active_pools,
                'closedPools': closed_pools,
                'totalParticipants': total_participants,
                'totalPayments': total_payments,
                'totalRevenue': total_revenue
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Bulk orders database tables created!")
    
    app.run(debug=True, host='0.0.0.0', port=5002)


