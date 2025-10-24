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
            SELECT i.id, i.name, i.description, i.category_id, i.supplier_id, i.unit, 
                   i.quantity, i.min_quantity, i.max_quantity, i.unit_price, i.location, 
                   i.status, i.created_at, i.updated_at, i.last_updated,
                   i.supplier_contact, i.supplier_social, i.supplier_name, i.supplier_phone,
                   c.name as category_name 
            FROM inventory_items i 
            LEFT JOIN inventory_categories c ON i.category_id = c.id
        """))
        items = []
        for row in result:
            items.append({
                'id': row[0],
                'name': row[1],
                'category': row[19],  # category_name (last column)
                'description': row[2],
                'supplier': row[17] if row[17] else None,  # supplier_name
                'supplierContact': row[15] if row[15] else None,  # supplier_contact
                'supplierSocial': row[16] if row[16] else None,  # supplier_social
                'unit': row[5],
                'quantity': row[6],
                'minQuantity': row[7],
                'maxQuantity': row[8],
                'unitPrice': float(row[9]),
                'location': row[10],
                'status': row[11],
                'lastUpdated': row[14].isoformat() if row[14] else None,
                'createdAt': row[12].isoformat() if row[12] else None,
                'updatedAt': row[13].isoformat() if row[13] else None
            })
        return items
    except Exception as e:
        logger.error(f"Error fetching items: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/items", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_item(data: dict, db: Session = Depends(get_db)):
    """Create a new inventory item"""
    try:
        logger.info(f"Creating item with data: {data}")
        # Validate required fields
        required_fields = ['name', 'category', 'unit', 'quantity', 'unitPrice']
        for field in required_fields:
            if not data.get(field) or data.get(field) == '':
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{field} is required")
        
        
        # Find category by name
        result = db.execute(text("SELECT id FROM inventory_categories WHERE name = :name"), {"name": data['category']})
        category_row = result.fetchone()
        if not category_row:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found")
        
        category_id = category_row[0]
        
        # Insert new item
        db.execute(text("""
            INSERT INTO inventory_items 
            (name, description, category_id, unit, quantity, min_quantity, max_quantity, unit_price, location, status, created_at, updated_at, last_updated, supplier_contact, supplier_social, supplier_name, supplier_phone)
            VALUES (:name, :description, :category_id, :unit, :quantity, :min_quantity, :max_quantity, :unit_price, :location, 'in_stock', NOW(), NOW(), NOW(), :supplier_contact, :supplier_social, :supplier_name, :supplier_phone)
        """), {
            "name": data['name'], 
            "description": data.get('description', ''), 
            "category_id": category_id,
            "unit": data['unit'], 
            "quantity": int(data['quantity']) if data['quantity'] else 0, 
            "min_quantity": int(data.get('minQuantity', 0)),
            "max_quantity": int(data.get('maxQuantity', 0)), 
            "unit_price": float(data['unitPrice']) if data['unitPrice'] else 0.0, 
            "location": data.get('location', ''),
            "supplier_contact": data.get('supplierContact', ''),
            "supplier_social": data.get('supplierSocial', ''),
            "supplier_name": data.get('supplier', ''),
            "supplier_phone": data.get('supplierPhone', '')
        })
        
        # Update category item count
        db.execute(text("UPDATE inventory_categories SET item_count = item_count + 1 WHERE id = :id"), {"id": category_id})
        db.commit()
        
        # Get the created item
        result = db.execute(text("SELECT * FROM inventory_items WHERE name = :name AND category_id = :category_id ORDER BY id DESC LIMIT 1"), {"name": data['name'], "category_id": category_id})
        row = result.fetchone()
        return {
            'id': row[0],
            'name': row[1],
            'category': data['category'],
            'description': row[2],
            'supplier': row[17] if row[17] else '',
            'supplierContact': row[15] if row[15] else None,
            'supplierSocial': row[16] if row[16] else None,
            'unit': row[5],
            'quantity': row[6],
            'minQuantity': row[7],
            'maxQuantity': row[8],
            'unitPrice': float(row[9]),
            'location': row[10],
            'status': row[11],
            'lastUpdated': row[14].isoformat() if row[14] else None,
            'createdAt': row[12].isoformat() if row[12] else None,
            'updatedAt': row[13].isoformat() if row[13] else None
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

@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    """Delete an inventory item"""
    try:
        logger.info(f"Deleting item with ID: {item_id}")
        
        # Check if item exists
        result = db.execute(text("SELECT id, category_id FROM inventory_items WHERE id = :id"), {"id": item_id})
        item_row = result.fetchone()
        if not item_row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        
        category_id = item_row[1]
        
        # Delete the item
        db.execute(text("DELETE FROM inventory_items WHERE id = :id"), {"id": item_id})
        
        # Update category item count
        db.execute(text("UPDATE inventory_categories SET item_count = item_count - 1 WHERE id = :id"), {"id": category_id})
        
        db.commit()
        logger.info(f"Successfully deleted item with ID: {item_id}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting item: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/items/{item_id}", response_model=dict)
def update_item(item_id: int, data: dict, db: Session = Depends(get_db)):
    """Update an inventory item"""
    try:
        logger.info(f"Updating item {item_id} with data: {data}")
        
        # Check if item exists
        result = db.execute(text("SELECT id FROM inventory_items WHERE id = :id"), {"id": item_id})
        if not result.fetchone():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        
        # Find category by name if provided
        category_id = None
        if data.get('category'):
            result = db.execute(text("SELECT id FROM inventory_categories WHERE name = :name"), {"name": data['category']})
            category_row = result.fetchone()
            if not category_row:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found")
            category_id = category_row[0]
        
        # Build update query dynamically
        update_fields = []
        update_values = {"id": item_id}
        
        if data.get('name'):
            update_fields.append("name = :name")
            update_values["name"] = data['name']
        
        
        if data.get('description'):
            update_fields.append("description = :description")
            update_values["description"] = data['description']
        
        if category_id:
            update_fields.append("category_id = :category_id")
            update_values["category_id"] = category_id
        
        if data.get('unit'):
            update_fields.append("unit = :unit")
            update_values["unit"] = data['unit']
        
        if data.get('quantity'):
            update_fields.append("quantity = :quantity")
            update_values["quantity"] = int(data['quantity']) if data['quantity'] else 0
            
            # Auto-calculate status based on quantity
            quantity = int(data['quantity']) if data['quantity'] else 0
            min_quantity = int(data.get('minQuantity', 0)) if data.get('minQuantity') else 0
            
            if quantity == 0:
                status = 'out_of_stock'
            elif min_quantity > 0 and quantity <= min_quantity:
                status = 'low_stock'
            elif quantity <= 5:  # Default low stock threshold
                status = 'low_stock'
            else:
                status = 'in_stock'
            
            update_fields.append("status = :status")
            update_values["status"] = status
        
        if data.get('minQuantity'):
            update_fields.append("min_quantity = :min_quantity")
            update_values["min_quantity"] = int(data['minQuantity'])
        
        if data.get('maxQuantity'):
            update_fields.append("max_quantity = :max_quantity")
            update_values["max_quantity"] = int(data['maxQuantity'])
        
        if data.get('unitPrice'):
            update_fields.append("unit_price = :unit_price")
            update_values["unit_price"] = float(data['unitPrice']) if data['unitPrice'] else 0.0
        
        if data.get('location'):
            update_fields.append("location = :location")
            update_values["location"] = data['location']
        
        if data.get('supplier'):
            update_fields.append("supplier_name = :supplier_name")
            update_values["supplier_name"] = data['supplier']
        
        if data.get('supplierContact'):
            update_fields.append("supplier_contact = :supplier_contact")
            update_values["supplier_contact"] = data['supplierContact']
        
        if data.get('supplierSocial'):
            update_fields.append("supplier_social = :supplier_social")
            update_values["supplier_social"] = data['supplierSocial']
        
        if not update_fields:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
        
        # Add updated_at
        update_fields.append("updated_at = NOW()")
        update_fields.append("last_updated = NOW()")
        
        # Execute update
        query = f"UPDATE inventory_items SET {', '.join(update_fields)} WHERE id = :id"
        db.execute(text(query), update_values)
        db.commit()
        
        # Get updated item
        result = db.execute(text("SELECT * FROM inventory_items WHERE id = :id"), {"id": item_id})
        row = result.fetchone()
        
        # Debug: Check what we're getting for datetime fields
        logger.info(f"Row data for item {item_id}:")
        logger.info(f"  row[12] (created_at): {row[12]} (type: {type(row[12])})")
        logger.info(f"  row[13] (updated_at): {row[13]} (type: {type(row[13])})")
        logger.info(f"  row[14] (last_updated): {row[14]} (type: {type(row[14])})")
        
        return {
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'category': data.get('category', ''),
            'supplier': row[17] if row[17] else '',
            'supplierContact': row[15] if row[15] else None,
            'supplierSocial': row[16] if row[16] else None,
            'unit': row[5],
            'quantity': row[6],
            'minQuantity': row[7],
            'maxQuantity': row[8],
            'unitPrice': float(row[9]),
            'location': row[10],
            'status': row[11],
            'lastUpdated': row[14].isoformat() if row[14] else None,
            'createdAt': row[12].isoformat() if row[12] else None,
            'updatedAt': row[13].isoformat() if row[13] else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating item: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))