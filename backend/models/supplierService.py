from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from typing import List, Optional, Dict, Any
from models.supplier import Supplier
from models.supplierCategory import SupplierCategory
import logging

logger = logging.getLogger(__name__)

class SupplierService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_supplier(self, supplier_data: Dict[str, Any]) -> Supplier:
        """Create a new supplier"""
        try:
            logger.info(f"Creating supplier with data: {supplier_data}")
            supplier = Supplier.from_dict(supplier_data)
            logger.info(f"Supplier object created: {supplier.name}")
            self.db.add(supplier)
            logger.info("Supplier added to database session")
            self.db.commit()
            logger.info("Database commit successful")
            self.db.refresh(supplier)
            logger.info(f"Created supplier: {supplier.name}")
            return supplier
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating supplier: {str(e)}")
            logger.error(f"Supplier data was: {supplier_data}")
            raise e
    
    def get_supplier(self, supplier_id: int) -> Optional[Supplier]:
        """Get a supplier by ID"""
        try:
            return self.db.query(Supplier).filter(
                and_(Supplier.id == supplier_id, Supplier.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting supplier {supplier_id}: {str(e)}")
            raise e
    
    def get_suppliers(
        self, 
        skip: int = 0, 
        limit: int = 100,
        country: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Supplier]:
        """Get suppliers with optional filtering"""
        try:
            query = self.db.query(Supplier).filter(Supplier.is_active == True)
            
            # Filter by country
            if country:
                query = query.filter(Supplier.country == country)
            
            # Filter by category (now stored as JSON)
            if category:
                query = query.filter(Supplier.categories.contains([category]))
            
            # Search by name, city, region, or specialties
            if search:
                search_term = f"%{search}%"
                query = query.filter(
                    or_(
                        Supplier.name.ilike(search_term),
                        Supplier.city.ilike(search_term),
                        Supplier.region.ilike(search_term),
                        Supplier.specialties.contains([search_term])
                    )
                )
            
            return query.offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting suppliers: {str(e)}")
            raise e
    
    def update_supplier(self, supplier_id: int, supplier_data: Dict[str, Any]) -> Optional[Supplier]:
        """Update a supplier"""
        try:
            supplier = self.get_supplier(supplier_id)
            if not supplier:
                return None
            
            # Update basic fields
            supplier.name = supplier_data.get('name', supplier.name)
            supplier.legal_name = supplier_data.get('legalName', supplier.legal_name)
            supplier.registration_number = supplier_data.get('registrationNumber', supplier.registration_number)
            supplier.tax_id = supplier_data.get('taxId', supplier.tax_id)
            supplier.website = supplier_data.get('website', supplier.website)
            
            # Update location fields
            supplier.city = supplier_data.get('city', supplier.city)
            supplier.region = supplier_data.get('region', supplier.region)
            supplier.country = supplier_data.get('country', supplier.country)
            supplier.address = supplier_data.get('address', supplier.address)
            supplier.latitude = supplier_data.get('latitude', supplier.latitude)
            supplier.longitude = supplier_data.get('longitude', supplier.longitude)
            
            # Update contact information
            supplier.primary_contact_name = supplier_data.get('primaryContactName', supplier.primary_contact_name)
            supplier.primary_contact_title = supplier_data.get('primaryContactTitle', supplier.primary_contact_title)
            supplier.primary_contact_phone = supplier_data.get('primaryContactPhone', supplier.primary_contact_phone)
            supplier.primary_contact_email = supplier_data.get('primaryContactEmail', supplier.primary_contact_email)
            supplier.secondary_contact_name = supplier_data.get('secondaryContactName', supplier.secondary_contact_name)
            supplier.secondary_contact_title = supplier_data.get('secondaryContactTitle', supplier.secondary_contact_title)
            supplier.secondary_contact_phone = supplier_data.get('secondaryContactPhone', supplier.secondary_contact_phone)
            supplier.secondary_contact_email = supplier_data.get('secondaryContactEmail', supplier.secondary_contact_email)
            
            # Update business information
            supplier.business_hours = supplier_data.get('businessHours', supplier.business_hours)
            supplier.categories = supplier_data.get('categories', supplier.categories)
            supplier.certifications = supplier_data.get('certifications', supplier.certifications)
            supplier.specialties = supplier_data.get('specialties', supplier.specialties)
            supplier.languages = supplier_data.get('languages', supplier.languages)
            supplier.payment_methods = supplier_data.get('paymentMethods', supplier.payment_methods)
            
            # Update order information
            supplier.minimum_order_quantity = supplier_data.get('minimumOrderQuantity', supplier.minimum_order_quantity)
            supplier.minimum_order_unit = supplier_data.get('minimumOrderUnit', supplier.minimum_order_unit)
            supplier.minimum_order_currency = supplier_data.get('minimumOrderCurrency', supplier.minimum_order_currency)
            supplier.pricing_tiers = supplier_data.get('pricingTiers', supplier.pricing_tiers)
            supplier.bulk_discounts = supplier_data.get('bulkDiscounts', supplier.bulk_discounts)
            supplier.landed_cost_factors = supplier_data.get('landedCostFactors', supplier.landed_cost_factors)
            
            # Update payment terms
            supplier.payment_terms_net_days = supplier_data.get('paymentTermsNetDays', supplier.payment_terms_net_days)
            supplier.early_payment_discount_percentage = supplier_data.get('earlyPaymentDiscountPercentage', supplier.early_payment_discount_percentage)
            supplier.early_payment_discount_days = supplier_data.get('earlyPaymentDiscountDays', supplier.early_payment_discount_days)
            
            # Update lead times
            supplier.standard_lead_time_days = supplier_data.get('standardLeadTimeDays', supplier.standard_lead_time_days)
            supplier.express_lead_time_days = supplier_data.get('expressLeadTimeDays', supplier.express_lead_time_days)
            supplier.rush_lead_time_days = supplier_data.get('rushLeadTimeDays', supplier.rush_lead_time_days)
            
            # Update delivery information
            supplier.delivery_methods = supplier_data.get('deliveryMethods', supplier.delivery_methods)
            supplier.delivery_terms = supplier_data.get('deliveryTerms', supplier.delivery_terms)
            supplier.packaging_options = supplier_data.get('packagingOptions', supplier.packaging_options)
            supplier.on_time_delivery_percentage = supplier_data.get('onTimeDeliveryPercentage', supplier.on_time_delivery_percentage)
            
            # Update quality metrics
            supplier.quality_score = supplier_data.get('qualityScore', supplier.quality_score)
            supplier.order_accuracy_percentage = supplier_data.get('orderAccuracyPercentage', supplier.order_accuracy_percentage)
            supplier.response_time_hours = supplier_data.get('responseTimeHours', supplier.response_time_hours)
            
            # Update company information
            supplier.established_year = supplier_data.get('establishedYear', supplier.established_year)
            supplier.employee_count = supplier_data.get('employeeCount', supplier.employee_count)
            supplier.annual_revenue = supplier_data.get('annualRevenue', supplier.annual_revenue)
            supplier.status = supplier_data.get('status', supplier.status)
            supplier.verification_status = supplier_data.get('verificationStatus', supplier.verification_status)
            supplier.documents = supplier_data.get('documents', supplier.documents)
            
            self.db.commit()
            self.db.refresh(supplier)
            logger.info(f"Updated supplier: {supplier.name}")
            return supplier
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating supplier {supplier_id}: {str(e)}")
            raise e
    
    def delete_supplier(self, supplier_id: int) -> bool:
        """Soft delete a supplier"""
        try:
            supplier = self.get_supplier(supplier_id)
            if not supplier:
                return False
            
            supplier.is_active = False
            self.db.commit()
            logger.info(f"Deleted supplier: {supplier.name}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting supplier {supplier_id}: {str(e)}")
            raise e
    
    def verify_supplier(self, supplier_id: int) -> Optional[Supplier]:
        """Verify a supplier"""
        try:
            supplier = self.get_supplier(supplier_id)
            if not supplier:
                return None
            
            supplier.verification_status = 'verified'
            self.db.commit()
            self.db.refresh(supplier)
            logger.info(f"Verified supplier: {supplier.name}")
            return supplier
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error verifying supplier {supplier_id}: {str(e)}")
            raise e
    
    def get_supplier_categories(self) -> List[SupplierCategory]:
        """Get all active supplier categories"""
        try:
            categories = self.db.query(SupplierCategory).filter(
                SupplierCategory.is_active == True
            ).order_by(SupplierCategory.name).all()
            return categories
        except Exception as e:
            logger.error(f"Error getting supplier categories: {str(e)}")
            raise e
    
    def get_supplier_countries(self) -> List[str]:
        """Get all unique supplier countries"""
        try:
            countries = self.db.query(Supplier.country).filter(
                Supplier.is_active == True
            ).distinct().all()
            return [country[0] for country in countries if country[0]]
        except Exception as e:
            logger.error(f"Error getting supplier countries: {str(e)}")
            raise e
    
    def get_supplier_stats(self) -> Dict[str, Any]:
        """Get supplier statistics"""
        try:
            total_suppliers = self.db.query(Supplier).filter(Supplier.is_active == True).count()
            verified_suppliers = self.db.query(Supplier).filter(
                and_(Supplier.is_active == True, Supplier.verification_status == 'verified')
            ).count()
            
            categories = self.get_supplier_categories()
            countries = self.get_supplier_countries()
            
            return {
                'totalSuppliers': total_suppliers,
                'verifiedSuppliers': verified_suppliers,
                'totalCategories': len(categories),
                'totalCountries': len(countries),
                'categories': categories,
                'countries': countries
            }
        except Exception as e:
            logger.error(f"Error getting supplier stats: {str(e)}")
            raise e

    def create_supplier_category(self, category_name: str, description: str = "") -> SupplierCategory:
        """Create a new supplier category"""
        try:
            if not category_name or not category_name.strip():
                raise ValueError("Category name cannot be empty")
            
            category_name = category_name.strip()
            
            # Check if category already exists
            existing_category = self.db.query(SupplierCategory).filter(
                SupplierCategory.name == category_name
            ).first()
            
            if existing_category:
                if existing_category.is_active:
                    raise ValueError("Category already exists")
                else:
                    # Reactivate the category
                    existing_category.is_active = True
                    existing_category.description = description or f"Category for {category_name} suppliers"
                    existing_category.updated_at = func.now()
                    self.db.commit()
                    logger.info(f"Reactivated supplier category: {category_name}")
                    return existing_category
            
            # Create new category
            new_category = SupplierCategory(
                name=category_name,
                description=description or f"Category for {category_name} suppliers",
                is_active=True
            )
            
            self.db.add(new_category)
            self.db.commit()
            
            logger.info(f"Created new supplier category: {category_name}")
            return new_category
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating supplier category: {str(e)}")
            raise e

    def delete_supplier_category(self, category_id: int) -> bool:
        """Delete a supplier category (soft delete - check if any suppliers use it)"""
        try:
            if not category_id:
                logger.warning("No category ID provided for deletion")
                return False
            
            logger.info(f"Attempting to delete category with ID: {category_id}")
            
            # Check if category exists
            category = self.db.query(SupplierCategory).filter(
                SupplierCategory.id == category_id
            ).first()
            
            if not category:
                logger.warning(f"Category with ID {category_id} not found")
                return False
            
            logger.info(f"Found category: {category.name}")
            
            # Check if any suppliers are using this category
            # Since categories is now a JSON array, we need to check differently
            suppliers_using_category = 0
            try:
                all_suppliers = self.db.query(Supplier).filter(Supplier.is_active == True).all()
                logger.info(f"Found {len(all_suppliers)} active suppliers to check")
                
                for supplier in all_suppliers:
                    if supplier.categories and category.name in supplier.categories:
                        suppliers_using_category += 1
                        logger.info(f"Supplier {supplier.name} uses category {category.name}")
            except Exception as e:
                logger.error(f"Error checking suppliers for category usage: {str(e)}")
                # If we can't check suppliers, we'll still allow deletion
                suppliers_using_category = 0
            
            if suppliers_using_category > 0:
                error_msg = f"Cannot delete category '{category.name}' because {suppliers_using_category} suppliers are using it"
                logger.warning(error_msg)
                raise ValueError(error_msg)
            
            # Soft delete the category
            category.is_active = False
            category.updated_at = func.now()
            self.db.commit()
            
            logger.info(f"Successfully soft deleted supplier category: {category.name}")
            return True
        except ValueError as e:
            # Re-raise ValueError as-is (business logic error)
            raise e
        except Exception as e:
            self.db.rollback()
            logger.error(f"Unexpected error deleting supplier category: {str(e)}")
            raise e
