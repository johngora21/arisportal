from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models.supplier import Supplier
from models.supplierService import SupplierService
from models.supplierCategory import SupplierCategory
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/")
async def create_supplier(supplier_data: dict, db: Session = Depends(get_db)):
    """Create a new supplier"""
    try:
        supplier_service = SupplierService(db)
        supplier = supplier_service.create_supplier(supplier_data)
        
        return {
            "success": True,
            "message": "Supplier created successfully",
            "data": supplier.to_dict()
        }
    except Exception as e:
        logger.error(f"Error creating supplier: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_suppliers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    country: str = Query(None),
    category: str = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db)
):
    """Get suppliers with optional filtering"""
    try:
        supplier_service = SupplierService(db)
        
        suppliers = supplier_service.get_suppliers(
            skip=skip,
            limit=limit,
            country=country,
            category=category,
            search=search
        )
        
        return {
            "success": True,
            "data": [supplier.to_dict() for supplier in suppliers],
            "count": len(suppliers)
        }
    except Exception as e:
        logger.error(f"Error getting suppliers: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Categories endpoints (must be before /{supplier_id} to avoid route conflicts)
@router.get("/categories")
async def get_supplier_categories(db: Session = Depends(get_db)):
    """Get all supplier categories"""
    try:
        supplier_service = SupplierService(db)
        categories = supplier_service.get_supplier_categories()
        
        return {
            "success": True,
            "categories": [category.to_dict() for category in categories]
        }
    except Exception as e:
        logger.error(f"Error getting supplier categories: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/categories")
async def create_supplier_category(category_data: dict, db: Session = Depends(get_db)):
    """Create a new supplier category"""
    try:
        supplier_service = SupplierService(db)
        category = supplier_service.create_supplier_category(
            category_data.get('name'),
            category_data.get('description', '')
        )
        
        return {
            "success": True,
            "message": "Category created successfully",
            "category": category.to_dict()
        }
    except Exception as e:
        logger.error(f"Error creating supplier category: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/categories/{category_id}")
async def delete_supplier_category(category_id: int, db: Session = Depends(get_db)):
    """Delete a supplier category"""
    try:
        supplier_service = SupplierService(db)
        success = supplier_service.delete_supplier_category(category_id)
        
        if success:
            return {
                "success": True,
                "message": "Category deleted successfully"
            }
        else:
            raise HTTPException(status_code=400, detail="Category could not be deleted")
    except Exception as e:
        logger.error(f"Error deleting supplier category: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{supplier_id}")
async def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """Get a specific supplier by ID"""
    try:
        supplier_service = SupplierService(db)
        supplier = supplier_service.get_supplier(supplier_id)
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        return {
            "success": True,
            "data": supplier.to_dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting supplier {supplier_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{supplier_id}")
async def update_supplier(supplier_id: int, supplier_data: dict, db: Session = Depends(get_db)):
    """Update a supplier"""
    try:
        supplier_service = SupplierService(db)
        supplier = supplier_service.update_supplier(supplier_id, supplier_data)
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        return {
            "success": True,
            "message": "Supplier updated successfully",
            "data": supplier.to_dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating supplier {supplier_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{supplier_id}")
async def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """Delete a supplier (soft delete)"""
    try:
        supplier_service = SupplierService(db)
        success = supplier_service.delete_supplier(supplier_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        return {
            "success": True,
            "message": "Supplier deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting supplier {supplier_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{supplier_id}/verify")
async def verify_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """Verify a supplier"""
    try:
        supplier_service = SupplierService(db)
        supplier = supplier_service.verify_supplier(supplier_id)
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        return {
            "success": True,
            "message": "Supplier verified successfully",
            "data": supplier.to_dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying supplier {supplier_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/meta/categories/{category_name}")
async def delete_supplier_category(category_name: str, db: Session = Depends(get_db)):
    """Delete a supplier category"""
    try:
        supplier_service = SupplierService(db)
        success = supplier_service.delete_supplier_category(category_name)
        
        if not success:
            raise HTTPException(status_code=404, detail="Category not found")
        
        return {
            "success": True,
            "message": "Category deleted successfully"
        }
    except ValueError as e:
        # Handle the case where suppliers are using the category
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting supplier category: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/meta/categories")
async def get_supplier_categories(db: Session = Depends(get_db)):
    """Get all supplier categories"""
    try:
        supplier_service = SupplierService(db)
        categories = supplier_service.get_supplier_categories()
        
        return {
            "success": True,
            "data": categories
        }
    except Exception as e:
        logger.error(f"Error getting supplier categories: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/meta/countries")
async def get_supplier_countries(db: Session = Depends(get_db)):
    """Get all supplier countries"""
    try:
        supplier_service = SupplierService(db)
        countries = supplier_service.get_supplier_countries()
        
        return {
            "success": True,
            "data": countries
        }
    except Exception as e:
        logger.error(f"Error getting supplier countries: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/meta/stats")
async def get_supplier_stats(db: Session = Depends(get_db)):
    """Get supplier statistics"""
    try:
        supplier_service = SupplierService(db)
        stats = supplier_service.get_supplier_stats()
        
        return {
            "success": True,
            "data": stats
        }
    except Exception as e:
        logger.error(f"Error getting supplier stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))