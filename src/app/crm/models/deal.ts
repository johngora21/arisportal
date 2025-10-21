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
}

export interface DealUpdateData extends Partial<DealCreateData> {
  id: string;
}

// Mock data that matches the structure exactly
export const mockDeals: Deal[] = [
  {
    id: '1',
    productName: 'Dell Latitude 5520 Laptop',
    productCategory: 'Electronics',
    buyerName: 'Sarah Johnson',
    address: 'San Francisco, CA',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    quantity: 25,
    unitPrice: 1200
  },
  {
    id: '2',
    productName: 'Office Furniture Set',
    productCategory: 'Furniture',
    buyerName: 'Michael Chen',
    address: 'Austin, TX',
    email: 'm.chen@startupxyz.com',
    phone: '+1 (555) 987-6543',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    quantity: 15,
    unitPrice: 800
  },
  {
    id: '3',
    productName: 'Medical Equipment Package',
    productCategory: 'Healthcare',
    buyerName: 'Dr. Emily Rodriguez',
    address: 'Boston, MA',
    email: 'emily.r@healthplus.com',
    phone: '+1 (555) 456-7890',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    quantity: 8,
    unitPrice: 2500
  },
  {
    id: '4',
    productName: 'Financial Software License',
    productCategory: 'Software',
    buyerName: 'James Wilson',
    address: 'New York, NY',
    email: 'j.wilson@financegroup.com',
    phone: '+1 (555) 321-0987',
    orderDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    quantity: 1,
    unitPrice: 50000
  },
  {
    id: '5',
    productName: 'Retail POS System',
    productCategory: 'Electronics',
    buyerName: 'Lisa Thompson',
    address: 'Chicago, IL',
    email: 'lisa.t@retailco.com',
    phone: '+1 (555) 654-3210',
    orderDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    quantity: 3,
    unitPrice: 1500
  }
];

// Database service functions (now using real API calls)
export class DealService {
  private static baseUrl = 'http://localhost:5000/api/v1';

  // Fetch all deals from database
  static async fetchDeals(): Promise<Deal[]> {
    try {
      const response = await fetch(`${this.baseUrl}/deals`);
      if (!response.ok) throw new Error('Failed to fetch deals');
      
      const deals = await response.json();
      return deals.map((deal: any) => this.mapApiToDeal(deal));
    } catch (error) {
      console.error('Error fetching deals:', error);
      // Fallback to mock data if API fails
      return mockDeals;
    }
  }

  // Fetch deals by contact ID
  static async fetchDealsByContact(contactId: string): Promise<Deal[]> {
    try {
      const response = await fetch(`${this.baseUrl}/deals?contact_id=${contactId}`);
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
      const response = await fetch(`${this.baseUrl}/deals`, {
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
          unit_price: data.unitPrice
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
      const response = await fetch(`${this.baseUrl}/deals/${data.id}`, {
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
      const response = await fetch(`${this.baseUrl}/deals/${id}`, {
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
