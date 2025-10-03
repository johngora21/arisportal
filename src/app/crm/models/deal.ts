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

// Database service functions (to be implemented with actual DB calls)
export class DealService {
  // Fetch all deals from database
  static async fetchDeals(): Promise<Deal[]> {
    // TODO: Replace with actual database query
    // Example: const deals = await db.query('SELECT * FROM deals');
    // return deals.map(row => this.mapDbRowToDeal(row));
    
    // For now, return mock data
    return mockDeals;
  }

  // Fetch deals by contact ID
  static async fetchDealsByContact(contactId: string): Promise<Deal[]> {
    // TODO: Replace with actual database query
    // Example: const deals = await db.query('SELECT * FROM deals WHERE buyer_id = $1', [contactId]);
    // return deals.map(row => this.mapDbRowToDeal(row));
    
    // For now, return mock data filtered by contact
    return mockDeals.filter(deal => deal.buyerName === contactId);
  }

  // Create new deal
  static async createDeal(data: DealCreateData): Promise<Deal> {
    // TODO: Replace with actual database insert
    // Example: const result = await db.query('INSERT INTO deals (...) VALUES (...) RETURNING *');
    // return this.mapDbRowToDeal(result.rows[0]);
    
    // For now, return mock creation
    const newDeal: Deal = {
      id: Date.now().toString(),
      ...data
    };
    return newDeal;
  }

  // Update existing deal
  static async updateDeal(data: DealUpdateData): Promise<Deal> {
    // TODO: Replace with actual database update
    // Example: const result = await db.query('UPDATE deals SET ... WHERE id = $1 RETURNING *');
    // return this.mapDbRowToDeal(result.rows[0]);
    
    // For now, return mock update
    const existingDeal = mockDeals.find(d => d.id === data.id);
    if (!existingDeal) throw new Error('Deal not found');
    
    return { ...existingDeal, ...data };
  }

  // Delete deal
  static async deleteDeal(id: string): Promise<void> {
    // TODO: Replace with actual database delete
    // Example: await db.query('DELETE FROM deals WHERE id = $1', [id]);
    
    // For now, just log
    console.log(`Deleting deal with id: ${id}`);
  }

  // Get analytics data
  static async getAnalyticsData(): Promise<{
    salesByLocation: Array<{ location: string; count: number; color: string }>;
    topProducts: Array<{ name: string; quantity: number; total: number; color: string }>;
    topCustomers: Array<{ name: string; value: number; color: string }>;
  }> {
    // TODO: Replace with actual database aggregation queries
    // Example: 
    // const locationData = await db.query('SELECT address as location, COUNT(*) as count FROM deals GROUP BY address');
    // const productData = await db.query('SELECT product_name, SUM(quantity) as total_quantity, SUM(quantity * unit_price) as total_value FROM deals GROUP BY product_name ORDER BY total_quantity DESC LIMIT 5');
    // const customerData = await db.query('SELECT buyer_name, SUM(quantity * unit_price) as total_value FROM deals GROUP BY buyer_name ORDER BY total_value DESC LIMIT 5');
    
    // For now, return mock analytics
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
  }

  // Map database row to Deal interface
  private static mapDbRowToDeal(row: any): Deal {
    return {
      id: row.id,
      productName: row.product_name,
      productCategory: row.product_category,
      buyerName: row.buyer_name,
      address: row.address,
      email: row.email,
      phone: row.phone,
      orderDate: new Date(row.order_date),
      quantity: row.quantity,
      unitPrice: row.unit_price
    };
  }
}
