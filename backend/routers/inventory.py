from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from database import get_db
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Categories endpoints
@router.get("/categories", response_model=List[dict])
def get_categories(db: Session = Depends(get_db)):
    """Get all inventory categories"""
    try:
        result = db.execute(text("SELECT * FROM inventory_categories"))
        categories = []
        for row in result:
            categories.append({
                'id': row[0],
                'name': row[1],
                'description': row[2],
                'itemCount': row[3],
                'createdAt': row[4].isoformat() if row[4] else None,
                'updatedAt': row[5].isoformat() if row[5] else None
            })
        return categories
    except Exception as e:
        logger.error(f"Error fetching categories: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/categories", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_category(data: dict, db: Session = Depends(get_db)):
    """Create a new category"""
    try:
        # Check if category already exists
        result = db.execute(text("SELECT id FROM inventory_categories WHERE name = :name"), {"name": data['name']})
        if result.fetchone():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists")
        
        # Insert new category
        db.execute(
            text("INSERT INTO inventory_categories (name, description, item_count, created_at, updated_at) VALUES (:name, :description, 0, NOW(), NOW())"),
            {"name": data['name'], "description": data.get('description', '')}
        )
        db.commit()
        
        # Get the created category
        result = db.execute(text("SELECT * FROM inventory_categories WHERE name = :name"), {"name": data['name']})
        row = result.fetchone()
        return {
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'itemCount': row[3],
            'createdAt': row[4].isoformat() if row[4] else None,
            'updatedAt': row[5].isoformat() if row[5] else None
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating category: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# Items endpoints
@router.get("/items", response_model=List[dict])
def get_items(db: Session = Depends(get_db)):
    """Get all inventory items"""
    try:
        result = db.execute(text("""
            SELECT i.*, c.name as category_name 
            FROM inventory_items i 
            LEFT JOIN inventory_categories c ON i.category_id = c.id
        """))
        items = []
        for row in result:
            items.append({
                'id': row[0],
                'name': row[1],
                'sku': row[2],
                'category': row[19],  # category_name (last column)
                'description': row[3],
                'supplier': row[18] if row[18] else None,  # supplier_name
                'unit': row[6],
                'quantity': row[7],
                'minQuantity': row[8],
                'maxQuantity': row[9],
                'unitPrice': float(row[10]),
                'location': row[11],
                'status': row[12],
                'lastUpdated': row[15].isoformat() if row[15] else None,
                'createdAt': row[13].isoformat() if row[13] else None,
                'updatedAt': row[14].isoformat() if row[14] else None
            })
        return items
    except Exception as e:
        logger.error(f"Error fetching items: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/items", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_item(data: dict, db: Session = Depends(get_db)):
    """Create a new inventory item"""
    try:
        # Validate required fields
        required_fields = ['name', 'sku', 'category', 'unit', 'quantity', 'unitPrice']
        for field in required_fields:
            if not data.get(field):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{field} is required")
        
        # Check if SKU already exists
        result = db.execute(text("SELECT id FROM inventory_items WHERE sku = :sku"), {"sku": data['sku']})
        if result.fetchone():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="SKU already exists")
        
        # Find category by name
        result = db.execute(text("SELECT id FROM inventory_categories WHERE name = :name"), {"name": data['category']})
        category_row = result.fetchone()
        if not category_row:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found")
        
        category_id = category_row[0]
        
        # Insert new item
        db.execute(text("""
            INSERT INTO inventory_items 
            (name, sku, description, category_id, unit, quantity, min_quantity, max_quantity, unit_price, location, status, created_at, updated_at, last_updated)
            VALUES (:name, :sku, :description, :category_id, :unit, :quantity, :min_quantity, :max_quantity, :unit_price, :location, 'in_stock', NOW(), NOW(), NOW())
        """), {
            "name": data['name'], 
            "sku": data['sku'], 
            "description": data.get('description', ''), 
            "category_id": category_id,
            "unit": data['unit'], 
            "quantity": int(data['quantity']) if data['quantity'] else 0, 
            "min_quantity": int(data.get('minQuantity', 0)),
            "max_quantity": int(data.get('maxQuantity', 0)), 
            "unit_price": float(data['unitPrice']) if data['unitPrice'] else 0.0, 
            "location": data.get('location', '')
        })
        
        # Update category item count
        db.execute(text("UPDATE inventory_categories SET item_count = item_count + 1 WHERE id = :id"), {"id": category_id})
        db.commit()
        
        # Get the created item
        result = db.execute(text("SELECT * FROM inventory_items WHERE sku = :sku"), {"sku": data['sku']})
        row = result.fetchone()
        return {
            'id': row[0],
            'name': row[1],
            'sku': row[2],
            'category': data['category'],
            'description': row[3],
            'supplier': '',
            'unit': row[7],
            'quantity': row[8],
            'minQuantity': row[9],
            'maxQuantity': row[10],
            'unitPrice': float(row[11]),
            'location': row[12],
            'status': row[13],
            'lastUpdated': row[16].isoformat() if row[16] else None,
            'createdAt': row[17].isoformat() if row[17] else None,
            'updatedAt': row[18].isoformat() if row[18] else None
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating item: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# Analytics endpoints
@router.get("/analytics/stats", response_model=dict)
def get_inventory_stats(db: Session = Depends(get_db)):
    """Get inventory statistics"""
    try:
        # Total items
        result = db.execute(text("SELECT COUNT(*) FROM inventory_items"))
        total_items = result.fetchone()[0]
        
        # Total value
        result = db.execute(text("SELECT SUM(quantity * unit_price) FROM inventory_items"))
        total_value = result.fetchone()[0] or 0
        
        # Low stock items
        result = db.execute(text("SELECT COUNT(*) FROM inventory_items WHERE quantity <= min_quantity AND quantity > 0"))
        low_stock_items = result.fetchone()[0]
        
        # Out of stock items
        result = db.execute(text("SELECT COUNT(*) FROM inventory_items WHERE quantity = 0"))
        out_of_stock_items = result.fetchone()[0]
        
        # Categories count
        result = db.execute(text("SELECT COUNT(*) FROM inventory_categories"))
        categories_count = result.fetchone()[0]
        
        return {
            'totalItems': total_items,
            'totalValue': float(total_value),
            'lowStockItems': low_stock_items,
            'outOfStockItems': out_of_stock_items,
            'categories': categories_count
        }
    except Exception as e:
        logger.error(f"Error fetching inventory stats: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))