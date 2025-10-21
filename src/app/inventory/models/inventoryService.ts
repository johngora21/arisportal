// Inventory Service - Handles API calls to inventory backend
import { getApiUrl } from '../../../config/api';

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  description: string;
  supplier: string | null;
  unit: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  location: string;
  status: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCategory {
  id: number;
  name: string;
  description: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categories: number;
}

export interface NewInventoryForm {
  name: string;
  sku: string;
  category: string;
  description: string;
  supplier: string;
  supplierContact: string;
  supplierSocial: string;
  unit: string;
  quantity: string;
  minQuantity: string;
  maxQuantity: string;
  unitPrice: string;
  location: string;
}

class InventoryService {
  // Test method to verify API config
  static testApiConfig() {
    console.log('API Config Test:');
    console.log('INVENTORY.CATEGORIES URL:', getApiUrl('INVENTORY.CATEGORIES'));
    console.log('INVENTORY.ITEMS URL:', getApiUrl('INVENTORY.ITEMS'));
    console.log('INVENTORY.ANALYTICS URL:', getApiUrl('INVENTORY.ANALYTICS'));
  }

  // Categories
  static async fetchCategories(): Promise<InventoryCategory[]> {
    const response = await fetch(getApiUrl('INVENTORY.CATEGORIES'));
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  }

  static async createCategory(name: string, description: string): Promise<InventoryCategory> {
    const url = getApiUrl('INVENTORY.CATEGORIES');
    console.log('Creating category with URL:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.error || 'Failed to create category');
    }
    return response.json();
  }

  static async updateCategory(id: number, name: string, description: string): Promise<InventoryCategory> {
    const response = await fetch(`${getApiUrl('INVENTORY.CATEGORIES')}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    return response.json();
  }

  static async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${getApiUrl('INVENTORY.CATEGORIES')}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
  }

  // Items
  static async fetchItems(): Promise<InventoryItem[]> {
    const response = await fetch(getApiUrl('INVENTORY.ITEMS'));
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    return response.json();
  }

  static async createItem(itemData: NewInventoryForm): Promise<InventoryItem> {
    const response = await fetch(getApiUrl('INVENTORY.ITEMS'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.error || 'Failed to create item');
    }
    return response.json();
  }

  static async updateItem(id: number, itemData: Partial<NewInventoryForm>): Promise<InventoryItem> {
    const response = await fetch(`${getApiUrl('INVENTORY.ITEMS')}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      throw new Error('Failed to update item');
    }
    return response.json();
  }

  static async deleteItem(id: number): Promise<void> {
    const response = await fetch(`${getApiUrl('INVENTORY.ITEMS')}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
  }

  // Analytics
  static async getStats(): Promise<InventoryStats> {
    const response = await fetch(getApiUrl('INVENTORY.ANALYTICS'));
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  }
}

export default InventoryService;