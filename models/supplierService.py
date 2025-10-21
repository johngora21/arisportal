from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional, Dict, Any
from models.supplier import Supplier
import logging

logger = logging.getLogger(__name__)

class SupplierService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_supplier(self, supplier_data: Dict[str, Any]) -> Supplier:
        """Create a new supplier"""
        try:
            supplier = Supplier.from_dict(supplier_data)
            self.db.add(supplier)
            self.db.commit()
            self.db.refresh(supplier)
            logger.info(f"Created supplier: {supplier.name}")
            return supplier
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating supplier: {str(e)}")
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
            
            # Filter by category
            if category:
                query = query.filter(Supplier.category == category)
            
            # Search by name, location, or tags
            if search:
                search_term = f"%{search}%"
                query = query.filter(
                    or_(
                        Supplier.name.ilike(search_term),
                        Supplier.location.ilike(search_term),
                        Supplier.tags.ilike(search_term),
                        Supplier.specialties.ilike(search_term)
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
            
            # Update fields
            supplier.name = supplier_data.get('name', supplier.name)
            supplier.category = supplier_data.get('category', supplier.category)
            supplier.location = supplier_data.get('location', supplier.location)
            supplier.country = supplier_data.get('country', supplier.country)
            
            # Contact Information
            contact = supplier_data.get('contact', {})
            supplier.phone = contact.get('phone', supplier.phone)
            supplier.email = contact.get('email', supplier.email)
            supplier.website = contact.get('website', supplier.website)
            supplier.address = contact.get('address', supplier.address)
            
            # Business Details
            supplier.price_range = supplier_data.get('priceRange', supplier.price_range)
            supplier.bulk_discount = supplier_data.get('bulkDiscount', supplier.bulk_discount)
            supplier.min_order = supplier_data.get('minOrder', supplier.min_order)
            supplier.lead_time = supplier_data.get('leadTime', supplier.lead_time)
            
            # Products & Services
            supplier.tags = ','.join(supplier_data.get('tags', [])) if supplier_data.get('tags') else supplier.tags
            supplier.specialties = ','.join(supplier_data.get('specialties', [])) if supplier_data.get('specialties') else supplier.specialties
            supplier.payment_methods = ','.join(supplier_data.get('paymentMethods', [])) if supplier_data.get('paymentMethods') else supplier.payment_methods
            supplier.delivery_areas = ','.join(supplier_data.get('deliveryAreas', [])) if supplier_data.get('deliveryAreas') else supplier.delivery_areas
            
            # Location Coordinates
            coordinates = supplier_data.get('coordinates', {})
            supplier.latitude = coordinates.get('lat', supplier.latitude)
            supplier.longitude = coordinates.get('lng', supplier.longitude)
            
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
            
            supplier.is_verified = True
            self.db.commit()
            self.db.refresh(supplier)
            logger.info(f"Verified supplier: {supplier.name}")
            return supplier
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error verifying supplier {supplier_id}: {str(e)}")
            raise e
    
    def get_supplier_categories(self) -> List[str]:
        """Get all unique supplier categories"""
        try:
            categories = self.db.query(Supplier.category).filter(
                Supplier.is_active == True
            ).distinct().all()
            return [category[0] for category in categories if category[0]]
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
                and_(Supplier.is_active == True, Supplier.is_verified == True)
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
