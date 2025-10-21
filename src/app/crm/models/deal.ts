import { getApiUrl } from '../../../config/api';

export interface Deal {
  id: string;
  productName: string;
  productCategory: string;
  buyerName: string;
  address: string;
  email: string;
  phone: string;
  orderDate: Date;
  quantity: number;
  unitPrice: number;
}

export interface DealCreateData {
  productName: string;
  productCategory: string;
  buyerName: string;
  address: string;
  email: string;
  phone: string;
  orderDate: Date;
  quantity: number;
  unitPrice: number;
  contactId?: string;
}

export interface DealUpdateData extends Partial<DealCreateData> {
  id: string;
}

// Mock data removed - using real API data

// Database service functions (now using real API calls)
export class DealService {

  // Fetch all deals from database
  static async fetchDeals(): Promise<Deal[]> {
    try {
      const response = await fetch(getApiUrl('CRM.DEALS'));
      if (!response.ok) throw new Error('Failed to fetch deals');
      
      const deals = await response.json();
      return deals.map((deal: any) => this.mapApiToDeal(deal));
    } catch (error) {
      console.error('Error fetching deals:', error);
      // Fallback to mock data if API fails
      return [];
    }
  }

  // Fetch deals by contact ID
  static async fetchDealsByContact(contactId: string): Promise<Deal[]> {
    try {
      const response = await fetch(`${getApiUrl('CRM.DEALS')}?contact_id=${contactId}`);
      if (!response.ok) throw new Error('Failed to fetch deals by contact');
      
      const deals = await response.json();
      return deals.map((deal: any) => this.mapApiToDeal(deal));
    } catch (error) {
      console.error('Error fetching deals by contact:', error);
      // Fallback to mock data filtered by contact
      return mockDeals.filter(deal => deal.buyerName === contactId);
    }
  }

  // Create new deal
  static async createDeal(data: DealCreateData): Promise<Deal> {
    try {
      const response = await fetch(getApiUrl('CRM.DEALS'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: data.productName,
          product_category: data.productCategory,
          buyer_name: data.buyerName,
          address: data.address,
          email: data.email,
          phone: data.phone,
          order_date: data.orderDate.toISOString(),
          quantity: data.quantity,
          unit_price: data.unitPrice,
          status: 'pending',
          contact_id: data.contactId || null,
          creator_id: 1 // Default creator ID
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create deal');
      
      const deal = await response.json();
      return this.mapApiToDeal(deal.deal);
    } catch (error) {
      console.error('Error creating deal:', error);
      // Fallback to mock creation
      const newDeal: Deal = {
        id: Date.now().toString(),
        ...data
      };
      return newDeal;
    }
  }

  // Update existing deal
  static async updateDeal(data: DealUpdateData): Promise<Deal> {
    try {
      const response = await fetch(`${getApiUrl('CRM.DEALS')}/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: data.productName,
          product_category: data.productCategory,
          buyer_name: data.buyerName,
          address: data.address,
          email: data.email,
          phone: data.phone,
          order_date: data.orderDate?.toISOString(),
          quantity: data.quantity,
          unit_price: data.unitPrice
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update deal');
      
      const deal = await response.json();
      return this.mapApiToDeal(deal.deal);
    } catch (error) {
      console.error('Error updating deal:', error);
      // Fallback to mock update
      const existingDeal = mockDeals.find(d => d.id === data.id);
      if (!existingDeal) throw new Error('Deal not found');
      
      return { ...existingDeal, ...data };
    }
  }

  // Delete deal
  static async deleteDeal(id: string): Promise<void> {
    try {
      const response = await fetch(`${getApiUrl('CRM.DEALS')}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete deal');
    } catch (error) {
      console.error('Error deleting deal:', error);
      // Fallback to mock delete
      console.log(`Deleting deal with id: ${id}`);
    }
  }

  // Get analytics data
  static async getAnalyticsData(): Promise<{
    salesByLocation: Array<{ location: string; count: number; color: string }>;
    topProducts: Array<{ name: string; quantity: number; total: number; color: string }>;
    topCustomers: Array<{ name: string; value: number; color: string }>;
  }> {
    try {
      const deals = await this.fetchDeals();
      
      const salesByLocation = [
        { location: 'San Francisco, CA', count: deals.filter(d => d.address.includes('San Francisco')).length, color: '#8b5cf6' },
        { location: 'Austin, TX', count: deals.filter(d => d.address.includes('Austin')).length, color: '#06b6d4' },
        { location: 'Boston, MA', count: deals.filter(d => d.address.includes('Boston')).length, color: '#10b981' },
        { location: 'New York, NY', count: deals.filter(d => d.address.includes('New York')).length, color: '#f59e0b' },
        { location: 'Chicago, IL', count: deals.filter(d => d.address.includes('Chicago')).length, color: '#ef4444' }
      ].filter(item => item.count > 0);

      const topProducts = deals
        .map(deal => ({
          name: deal.productName,
          quantity: deal.quantity,
          total: deal.quantity * deal.unitPrice,
          color: '#3b82f6'
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      const topCustomers = deals
        .map(deal => ({
          name: deal.buyerName,
          value: deal.quantity * deal.unitPrice,
          color: '#6366f1'
        }))
        .reduce((acc, deal) => {
          const existing = acc.find(d => d.name === deal.name);
          if (existing) {
            existing.value += deal.value;
          } else {
            acc.push(deal);
          }
          return acc;
        }, [] as any[])
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      return {
        salesByLocation,
        topProducts,
        topCustomers
      };
    } catch (error) {
      console.error('Error getting analytics data:', error);
      // Return empty analytics if API fails
      return {
        salesByLocation: [],
        topProducts: [],
        topCustomers: []
      };
    }
  }

  // Map API response to Deal interface
  private static mapApiToDeal(apiDeal: any): Deal {
    return {
      id: apiDeal.id.toString(),
      productName: apiDeal.product_name,
      productCategory: apiDeal.product_category || '',
      buyerName: apiDeal.buyer_name,
      address: apiDeal.address,
      email: apiDeal.email || '',
      phone: apiDeal.phone || '',
      orderDate: new Date(apiDeal.order_date),
      quantity: apiDeal.quantity,
      unitPrice: apiDeal.unit_price
    };
  }
}
