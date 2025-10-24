from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Supplier(Base):
    __tablename__ = 'suppliers'

    # Basic Information
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    legal_name = Column(String(255), nullable=False)
    registration_number = Column(String(100), nullable=False, unique=True)
    tax_id = Column(String(100), nullable=False, unique=True)
    website = Column(String(255), nullable=True)
    
    # Location Information
    city = Column(String(100), nullable=False)
    region = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False, index=True)
    address = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Contact Information
    primary_contact_name = Column(String(255), nullable=False)
    primary_contact_title = Column(String(100), nullable=False)
    primary_contact_phone = Column(String(50), nullable=False)
    primary_contact_email = Column(String(255), nullable=False, index=True)
    secondary_contact_name = Column(String(255), nullable=True)
    secondary_contact_title = Column(String(100), nullable=True)
    secondary_contact_phone = Column(String(50), nullable=True)
    secondary_contact_email = Column(String(255), nullable=True)
    
    # Business Information
    business_hours = Column(JSON, nullable=True)
    categories = Column(JSON, nullable=True)
    certifications = Column(JSON, nullable=True)
    specialties = Column(JSON, nullable=True)
    languages = Column(JSON, nullable=True)
    payment_methods = Column(JSON, nullable=True)
    
    # Order Information
    minimum_order_quantity = Column(Integer, nullable=True)
    minimum_order_unit = Column(String(50), nullable=True)
    minimum_order_currency = Column(String(10), nullable=True)
    pricing_tiers = Column(JSON, nullable=True)
    bulk_discounts = Column(JSON, nullable=True)
    landed_cost_factors = Column(JSON, nullable=True)
    
    # Payment Terms
    payment_terms_net_days = Column(Integer, nullable=True)
    early_payment_discount_percentage = Column(Float, nullable=True)
    early_payment_discount_days = Column(Integer, nullable=True)
    
    # Lead Times
    standard_lead_time_days = Column(Integer, nullable=True)
    express_lead_time_days = Column(Integer, nullable=True)
    rush_lead_time_days = Column(Integer, nullable=True)
    
    # Delivery Information
    delivery_methods = Column(JSON, nullable=True)
    delivery_terms = Column(String(50), nullable=True)
    packaging_options = Column(JSON, nullable=True)
    on_time_delivery_percentage = Column(Float, nullable=True)
    
    # Business Policies
    return_policy = Column(Text, nullable=True)
    warranty = Column(Text, nullable=True)
    
    # Media
    images = Column(JSON, nullable=True)  # Array of image URLs
    videos = Column(JSON, nullable=True)  # Array of video URLs
    
    # Quality Metrics
    quality_score = Column(Float, nullable=True)
    order_accuracy_percentage = Column(Float, nullable=True)
    response_time_hours = Column(Float, nullable=True)
    
    # Order Statistics
    total_orders = Column(Integer, nullable=True)
    successful_orders = Column(Integer, nullable=True)
    average_order_value = Column(Float, nullable=True)
    last_order_date = Column(DateTime, nullable=True)
    total_spent = Column(Float, nullable=True)
    average_order_size = Column(Float, nullable=True)
    defect_rate_percentage = Column(Float, nullable=True)
    return_rate_percentage = Column(Float, nullable=True)
    
    # Ratings
    overall_rating = Column(Float, nullable=True)
    quality_rating = Column(Float, nullable=True)
    delivery_rating = Column(Float, nullable=True)
    communication_rating = Column(Float, nullable=True)
    pricing_rating = Column(Float, nullable=True)
    total_reviews = Column(Integer, nullable=True)
    rating_last_updated = Column(DateTime, nullable=True)
    
    # Company Information
    established_year = Column(Integer, nullable=True)
    employee_count = Column(String(50), nullable=True)
    annual_revenue = Column(String(50), nullable=True)
    status = Column(String(50), nullable=True)
    verification_status = Column(String(50), nullable=True)
    verification_date = Column(DateTime, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    documents = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_contact_date = Column(DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'legalName': self.legal_name,
            'registrationNumber': self.registration_number,
            'taxId': self.tax_id,
            'website': self.website,
            'city': self.city,
            'region': self.region,
            'country': self.country,
            'address': self.address,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'primaryContactName': self.primary_contact_name,
            'primaryContactTitle': self.primary_contact_title,
            'primaryContactPhone': self.primary_contact_phone,
            'primaryContactEmail': self.primary_contact_email,
            'secondaryContactName': self.secondary_contact_name,
            'secondaryContactTitle': self.secondary_contact_title,
            'secondaryContactPhone': self.secondary_contact_phone,
            'secondaryContactEmail': self.secondary_contact_email,
            'businessHours': self.business_hours,
            'categories': self.categories,
            'certifications': self.certifications,
            'specialties': self.specialties,
            'languages': self.languages,
            'paymentMethods': self.payment_methods,
            'minimumOrderQuantity': self.minimum_order_quantity,
            'minimumOrderUnit': self.minimum_order_unit,
            'minimumOrderCurrency': self.minimum_order_currency,
            'pricingTiers': self.pricing_tiers,
            'bulkDiscounts': self.bulk_discounts,
            'landedCostFactors': self.landed_cost_factors,
            'paymentTermsNetDays': self.payment_terms_net_days,
            'earlyPaymentDiscountPercentage': self.early_payment_discount_percentage,
            'earlyPaymentDiscountDays': self.early_payment_discount_days,
            'standardLeadTimeDays': self.standard_lead_time_days,
            'expressLeadTimeDays': self.express_lead_time_days,
            'rushLeadTimeDays': self.rush_lead_time_days,
            'deliveryMethods': self.delivery_methods,
            'deliveryTerms': self.delivery_terms,
            'packagingOptions': self.packaging_options,
            'onTimeDeliveryPercentage': self.on_time_delivery_percentage,
            'returnPolicy': self.return_policy,
            'warranty': self.warranty,
            'images': self.images,
            'videos': self.videos,
            'qualityScore': self.quality_score,
            'orderAccuracyPercentage': self.order_accuracy_percentage,
            'responseTimeHours': self.response_time_hours,
            'totalOrders': self.total_orders,
            'successfulOrders': self.successful_orders,
            'averageOrderValue': self.average_order_value,
            'lastOrderDate': self.last_order_date.isoformat() if self.last_order_date else None,
            'totalSpent': self.total_spent,
            'averageOrderSize': self.average_order_size,
            'defectRatePercentage': self.defect_rate_percentage,
            'returnRatePercentage': self.return_rate_percentage,
            'overallRating': self.overall_rating,
            'qualityRating': self.quality_rating,
            'deliveryRating': self.delivery_rating,
            'communicationRating': self.communication_rating,
            'pricingRating': self.pricing_rating,
            'totalReviews': self.total_reviews,
            'ratingLastUpdated': self.rating_last_updated.isoformat() if self.rating_last_updated else None,
            'establishedYear': self.established_year,
            'employeeCount': self.employee_count,
            'annualRevenue': self.annual_revenue,
            'status': self.status,
            'verificationStatus': self.verification_status,
            'verificationDate': self.verification_date.isoformat() if self.verification_date else None,
            'isActive': self.is_active,
            'documents': self.documents,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
            'lastContactDate': self.last_contact_date.isoformat() if self.last_contact_date else None
        }

    @classmethod
    def from_dict(cls, data):
        supplier = cls()
        supplier.name = data.get('name')
        supplier.legal_name = data.get('legalName')
        supplier.registration_number = data.get('registrationNumber')
        supplier.tax_id = data.get('taxId')
        supplier.website = data.get('website')
        supplier.city = data.get('city')
        supplier.region = data.get('region')
        supplier.country = data.get('country')
        supplier.address = data.get('address')
        supplier.latitude = data.get('latitude')
        supplier.longitude = data.get('longitude')
        supplier.primary_contact_name = data.get('primaryContactName')
        supplier.primary_contact_title = data.get('primaryContactTitle')
        supplier.primary_contact_phone = data.get('primaryContactPhone')
        supplier.primary_contact_email = data.get('primaryContactEmail')
        supplier.secondary_contact_name = data.get('secondaryContactName')
        supplier.secondary_contact_title = data.get('secondaryContactTitle')
        supplier.secondary_contact_phone = data.get('secondaryContactPhone')
        supplier.secondary_contact_email = data.get('secondaryContactEmail')
        supplier.business_hours = data.get('businessHours')
        supplier.categories = data.get('categories')
        supplier.certifications = data.get('certifications')
        supplier.specialties = data.get('specialties')
        supplier.languages = data.get('languages')
        supplier.payment_methods = data.get('paymentMethods')
        supplier.minimum_order_quantity = data.get('minimumOrderQuantity')
        supplier.minimum_order_unit = data.get('minimumOrderUnit')
        supplier.minimum_order_currency = data.get('minimumOrderCurrency')
        supplier.pricing_tiers = data.get('pricingTiers')
        supplier.bulk_discounts = data.get('bulkDiscounts')
        supplier.landed_cost_factors = data.get('landedCostFactors')
        supplier.payment_terms_net_days = data.get('paymentTermsNetDays')
        supplier.early_payment_discount_percentage = data.get('earlyPaymentDiscountPercentage')
        supplier.early_payment_discount_days = data.get('earlyPaymentDiscountDays')
        supplier.standard_lead_time_days = data.get('standardLeadTimeDays')
        supplier.express_lead_time_days = data.get('expressLeadTimeDays')
        supplier.rush_lead_time_days = data.get('rushLeadTimeDays')
        supplier.delivery_methods = data.get('deliveryMethods')
        supplier.delivery_terms = data.get('deliveryTerms')
        supplier.packaging_options = data.get('packagingOptions')
        supplier.on_time_delivery_percentage = data.get('onTimeDeliveryPercentage')
        supplier.return_policy = data.get('returnPolicy')
        supplier.warranty = data.get('warranty')
        supplier.images = data.get('images')
        supplier.videos = data.get('videos')
        supplier.quality_score = data.get('qualityScore')
        supplier.order_accuracy_percentage = data.get('orderAccuracyPercentage')
        supplier.response_time_hours = data.get('responseTimeHours')
        supplier.total_orders = data.get('totalOrders')
        supplier.successful_orders = data.get('successfulOrders')
        supplier.average_order_value = data.get('averageOrderValue')
        supplier.total_spent = data.get('totalSpent')
        supplier.average_order_size = data.get('averageOrderSize')
        supplier.defect_rate_percentage = data.get('defectRatePercentage')
        supplier.return_rate_percentage = data.get('returnRatePercentage')
        supplier.overall_rating = data.get('overallRating')
        supplier.quality_rating = data.get('qualityRating')
        supplier.delivery_rating = data.get('deliveryRating')
        supplier.communication_rating = data.get('communicationRating')
        supplier.pricing_rating = data.get('pricingRating')
        supplier.total_reviews = data.get('totalReviews')
        supplier.established_year = data.get('establishedYear')
        supplier.employee_count = data.get('employeeCount')
        supplier.annual_revenue = data.get('annualRevenue')
        supplier.status = data.get('status')
        supplier.verification_status = data.get('verificationStatus')
        supplier.documents = data.get('documents')
        return supplier