import { Supplier, SupplierLocation, SupplierRating, SupplierContact, SupplierCapabilities, SupplierPricing, SupplierDelivery, SupplierPerformance } from './supplier';

// Mock data removed - using real API data
export const mockSuppliers: Supplier[] = [];

export const supplierStats = {
  totalSuppliers: 0,
  activeSuppliers: 0,
  verifiedSuppliers: 0,
  pendingVerification: 0,
  averageRating: 0,
  totalOrders: 0,
  totalRevenue: 0
};