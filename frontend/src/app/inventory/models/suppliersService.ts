// Suppliers Service - Handles API calls to suppliers backend
import { buildApiUrl } from '../../../config/api';
import { Supplier } from './supplier';

export interface SupplierCategory {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class SuppliersService {
  private baseUrl = process.env.NODE_ENV === 'production' ? 'https://your-production-api.com/api/v1' : 'http://localhost:4001/api/v1';

  // Get all suppliers
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await fetch(`${this.baseUrl}/suppliers/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }
  }

  // Get a single supplier by ID
  async getSupplier(id: number): Promise<Supplier | null> {
    try {
      const response = await fetch(`${this.baseUrl}/suppliers/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching supplier:', error);
      return null;
    }
  }

  // Create a new supplier
  async createSupplier(supplierData: Partial<Supplier>): Promise<Supplier | null> {
    try {
      const response = await fetch(`${this.baseUrl}/suppliers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      return null;
    }
  }

  // Get supplier categories
  async getCategories(): Promise<SupplierCategory[]> {
    try {
      const response = await fetch(`${this.baseUrl}/suppliers/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Create a new category
  async createCategory(name: string, description: string = ''): Promise<SupplierCategory | null> {
    try {
      const response = await fetch(`${this.baseUrl}/suppliers/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.category;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }

  // Delete a category
  async deleteCategory(categoryId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/suppliers/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }
}

export default new SuppliersService();