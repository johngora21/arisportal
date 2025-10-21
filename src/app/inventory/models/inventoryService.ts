// Inventory Service - Handles API calls to inventory backend
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
  unit: string;
  quantity: string;
  minQuantity: string;
  maxQuantity: string;
  unitPrice: string;
  location: string;
}

class InventoryService {
  private static baseUrl = 'http://localhost:5001/api/v1';

  // Categories
  static async fetchCategories(): Promise<InventoryCategory[]> {
    const response = await fetch(`${this.baseUrl}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  }

  static async createCategory(name: string, description: string): Promise<InventoryCategory> {
    const response = await fetch(`${this.baseUrl}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    return response.json();
  }

  static async updateCategory(id: number, name: string, description: string): Promise<InventoryCategory> {
    const response = await fetch(`${this.baseUrl}/categories/${id}`, {
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
    const response = await fetch(`${this.baseUrl}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
  }

  // Items
  static async fetchItems(): Promise<InventoryItem[]> {
    const response = await fetch(`${this.baseUrl}/items`);
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    return response.json();
  }

  static async createItem(itemData: NewInventoryForm): Promise<InventoryItem> {
    const response = await fetch(`${this.baseUrl}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create item');
    }
    return response.json();
  }

  static async updateItem(id: number, itemData: Partial<NewInventoryForm>): Promise<InventoryItem> {
    const response = await fetch(`${this.baseUrl}/items/${id}`, {
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
    const response = await fetch(`${this.baseUrl}/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
  }

  // Analytics
  static async getStats(): Promise<InventoryStats> {
    const response = await fetch(`${this.baseUrl}/analytics/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  }
}

export default InventoryService;
