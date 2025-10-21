// Bulk Orders Service for API integration
export interface BulkOrderPool {
  id: string;
  title: string;
  category: string;
  description?: string;
  image?: string;
  images?: string[];
  videos?: string[];
  tags?: string[];
  manufacturer?: string;
  supplierContactName?: string;
  supplierContactPhone?: string;
  supplierContactEmail?: string;
  supplierLocation?: string;
  supplierWebsite?: string;
  supplierFacebook?: string;
  supplierTwitter?: string;
  supplierLinkedIn?: string;
  organizer: string;
  organizerContactName?: string;
  organizerContactPhone?: string;
  organizerContactEmail?: string;
  organizerLocation?: string;
  organizerWebsite?: string;
  organizerFacebook?: string;
  organizerTwitter?: string;
  organizerLinkedIn?: string;
  organizerRating?: number;
  specs?: string[];
  included?: string[];
  leadTimeDays?: number;
  paymentTerms?: string;
  returnPolicy?: string;
  logisticsDelivery?: string[];
  logisticsPickup?: string[];
  targetQuantity: number;
  pricePerUnit: number;
  deadline: string;
  status: 'active' | 'closed' | 'ready';
  participants: BulkOrderParticipant[];
  currentQuantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BulkOrderParticipant {
  id: string;
  name: string;
  company?: string;
  quantity: number;
  joinedDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  email?: string;
  phone?: string;
}

export interface PoolPayment {
  id: string;
  amount: number;
  quantity: number;
  paymentMethod: 'mno' | 'card' | 'control';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  mnoPhone?: string;
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  controlNumber?: string;
  transactionId?: string;
  paymentReference?: string;
  createdAt?: string;
  paidAt?: string;
}

export interface CreatePoolData {
  title: string;
  category: string;
  description?: string;
  image?: string;
  images?: string[];
  videos?: string[];
  tags?: string[];
  manufacturer?: string;
  supplierContactName?: string;
  supplierContactPhone?: string;
  supplierContactEmail?: string;
  supplierLocation?: string;
  supplierWebsite?: string;
  supplierFacebook?: string;
  supplierTwitter?: string;
  supplierLinkedIn?: string;
  organizer: string;
  organizerContactName?: string;
  organizerContactPhone?: string;
  organizerContactEmail?: string;
  organizerLocation?: string;
  organizerWebsite?: string;
  organizerFacebook?: string;
  organizerTwitter?: string;
  organizerLinkedIn?: string;
  organizerRating?: number;
  specs?: string[];
  included?: string[];
  leadTimeDays?: number;
  paymentTerms?: string;
  returnPolicy?: string;
  logisticsDelivery?: string[];
  logisticsPickup?: string[];
  targetQuantity: number;
  pricePerUnit: number;
  deadline: string;
  status?: 'active' | 'closed' | 'ready';
}

export interface JoinPoolData {
  name: string;
  company?: string;
  quantity: number;
  email?: string;
  phone?: string;
}

export interface PaymentData {
  quantity: number;
  paymentMethod: 'mno' | 'card' | 'control';
  mnoPhone?: string;
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  controlNumber?: string;
  transactionId?: string;
  paymentReference?: string;
}

export interface AnalyticsData {
  totalPools: number;
  activePools: number;
  closedPools: number;
  totalParticipants: number;
  totalPayments: number;
  totalRevenue: number;
}

class BulkOrdersService {
  private static baseUrl = 'http://localhost:5000/api/v1';

  // Get all pools with optional filtering
  static async fetchPools(search?: string, country?: string, status?: string): Promise<BulkOrderPool[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (country) params.append('country', country);
      if (status) params.append('status', status);

      const response = await fetch(`${this.baseUrl}/pools?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch pools');
      }

      return data.data || [];
    } catch (error) {
      console.error('Error fetching pools:', error);
      throw error;
    }
  }

  // Get a specific pool by ID
  static async fetchPool(poolId: string): Promise<BulkOrderPool> {
    try {
      const response = await fetch(`${this.baseUrl}/pools/${poolId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch pool');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching pool:', error);
      throw error;
    }
  }

  // Create a new pool
  static async createPool(poolData: CreatePoolData): Promise<BulkOrderPool> {
    try {
      const response = await fetch(`${this.baseUrl}/pools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(poolData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create pool');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating pool:', error);
      throw error;
    }
  }

  // Update a pool
  static async updatePool(poolId: string, poolData: Partial<CreatePoolData>): Promise<BulkOrderPool> {
    try {
      const response = await fetch(`${this.baseUrl}/pools/${poolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(poolData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update pool');
      }

      return data.data;
    } catch (error) {
      console.error('Error updating pool:', error);
      throw error;
    }
  }

  // Delete a pool
  static async deletePool(poolId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/pools/${poolId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete pool');
      }
    } catch (error) {
      console.error('Error deleting pool:', error);
      throw error;
    }
  }

  // Join a pool
  static async joinPool(poolId: string, joinData: JoinPoolData): Promise<BulkOrderParticipant> {
    try {
      const response = await fetch(`${this.baseUrl}/pools/${poolId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(joinData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join pool');
      }

      return data.data;
    } catch (error) {
      console.error('Error joining pool:', error);
      throw error;
    }
  }

  // Create a payment
  static async createPayment(poolId: string, paymentData: PaymentData): Promise<PoolPayment> {
    try {
      const response = await fetch(`${this.baseUrl}/pools/${poolId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Confirm a payment
  static async confirmPayment(paymentId: string): Promise<{ payment: PoolPayment; participant: BulkOrderParticipant }> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}/confirm`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm payment');
      }

      return data.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Get analytics data
  static async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/stats`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
}

export default BulkOrdersService;
