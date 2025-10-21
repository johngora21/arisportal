from flask import Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from models.supplier import Supplier
from models.supplierService import SupplierService
import logging

logger = logging.getLogger(__name__)

suppliers_bp = Blueprint('suppliers', __name__)

@suppliers_bp.route('/', methods=['POST'])
def create_supplier():
    """Create a new supplier"""
    try:
        from app import db
        supplier_data = request.get_json()
        
        supplier_service = SupplierService(db.session)
        supplier = supplier_service.create_supplier(supplier_data)
        
        return jsonify({
            "success": True,
            "message": "Supplier created successfully",
            "data": supplier.to_dict()
        }), 201
    except Exception as e:
        logger.error(f"Error creating supplier: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@suppliers_bp.route('/', methods=['GET'])
def get_suppliers():
    """Get suppliers with optional filtering"""
    try:
        from app import db
        supplier_service = SupplierService(db.session)
        
        # Get query parameters
        skip = request.args.get('skip', 0, type=int)
        limit = request.args.get('limit', 100, type=int)
        country = request.args.get('country')
        category = request.args.get('category')
        search = request.args.get('search')
        
        suppliers = supplier_service.get_suppliers(
            skip=skip,
            limit=limit,
            country=country,
            category=category,
            search=search
        )
        
        return jsonify({
            "success": True,
            "data": [supplier.to_dict() for supplier in suppliers],
            "count": len(suppliers)
        })
    except Exception as e:
        logger.error(f"Error getting suppliers: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@suppliers_bp.route('/<int:supplier_id>', methods=['GET'])
def get_supplier(supplier_id):
    """Get a specific supplier by ID"""
    try:
        from app import db
        supplier_service = SupplierService(db.session)
        supplier = supplier_service.get_supplier(supplier_id)
        
        if not supplier:
            return jsonify({"success": False, "error": "Supplier not found"}), 404
        
        return jsonify({
            "success": True,
            "data": supplier.to_dict()
        })
    except Exception as e:
        logger.error(f"Error getting supplier {supplier_id}: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@suppliers_bp.route('/<int:supplier_id>', methods=['PUT'])
def update_supplier(supplier_id):
    """Update a supplier"""
    try:
        from app import db
        supplier_service = SupplierService(db.session)
        supplier_data = request.get_json()
        
        supplier = supplier_service.update_supplier(supplier_id, supplier_data)
        
        if not supplier:
            return jsonify({"success": False, "error": "Supplier not found"}), 404
        
        return jsonify({
            "success": True,
            "message": "Supplier updated successfully",
            "data": supplier.to_dict()
        })
    except Exception as e:
        logger.error(f"Error updating supplier {supplier_id}: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@suppliers_bp.route('/<int:supplier_id>', methods=['DELETE'])
def delete_supplier(supplier_id):
    """Delete a supplier (soft delete)"""
    try:
        from app import db
        supplier_service = SupplierService(db.session)
        success = supplier_service.delete_supplier(supplier_id)
        
        if not success:
            return jsonify({"success": False, "error": "Supplier not found"}), 404
        
        return jsonify({
            "success": True,
            "message": "Supplier deleted successfully"
        })
    except Exception as e:
        logger.error(f"Error deleting supplier {supplier_id}: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@suppliers_bp.route('/<int:supplier_id>/verify', methods=['PATCH'])
def verify_supplier(supplier_id):
    """Verify a supplier"""
    try:
        from app import db
        supplier_service = SupplierService(db.session)
        supplier = supplier_service.verify_supplier(supplier_id)
        
        if not supplier:
            return jsonify({"success": False, "error": "Supplier not found"}), 404
        
        return jsonify({
            "success": True,
            "message": "Supplier verified successfully",
            "data": supplier.to_dict()
        })
    except Exception as e:
        logger.error(f"Error verifying supplier {supplier_id}: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@suppliers_bp.route('/meta/categories', methods=['GET'])
def get_supplier_categories():
    """Get all supplier categories"""
    try:
        from app import db
        supplier_service = SupplierService(db.session)
        categories = supplier_service.get_supplier_categories()
        
        return jsonify({
            "success": True,
            "data": categories
        })
    except Exception as e:
        logger.error(f"Error getting supplier categories: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@suppliers_bp.route('/meta/countries', methods=['GET'])
def get_supplier_countries():
    """Get all supplier countries"""
    try:
        from app import db
        supplier_service = SupplierService(db.session)
        countries = supplier_service.get_supplier_countries()
        
        return jsonify({
            "success": True,
            "data": countries
        })
    except Exception as e:
        logger.error(f"Error getting supplier countries: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@suppliers_bp.route('/meta/stats', methods=['GET'])
def get_supplier_stats():
    """Get supplier statistics"""
    try:
        from app import db
        supplier_service = SupplierService(db.session)
        stats = supplier_service.get_supplier_stats()
        
        return jsonify({
            "success": True,
            "data": stats
        })
    except Exception as e:
        logger.error(f"Error getting supplier stats: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
