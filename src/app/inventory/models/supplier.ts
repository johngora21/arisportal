// Supplier Management Models - Suppliers are vendors providing goods/services to the business
export interface SupplierLocation {
  id: string;
  city: string;
  region: string;
  country: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SupplierRating {
  overall: number; // 0-5 scale
  quality: number;
  delivery: number;
  communication: number;
  pricing: number;
  totalReviews: number;
  lastUpdated: string;
}

export interface SupplierContact {
  primaryContact: {
    name: string;
    title: string;
    phone: string;
    email: string;
  };
  secondaryContact?: {
    name: string;
    title: string;
    phone: string;
    email: string;
  };
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday?: string;
    sunday?: string;
  };
}

export interface SupplierCapabilities {
  categories: string[]; // ['Electronics', 'Furniture', 'Office Supplies']
  certifications: string[]; // ['ISO 9001', 'ISO 14001']
  specialties: string[]; // ['Custom Manufacturing', 'Bulk Orders']
  languages: string[]; // ['English', 'Swahili']
  paymentMethods: string[]; // ['Bank Transfer', 'Mobile Money', 'Cash']
}

export interface SupplierPricing {
  minimumOrder: {
    quantity: number;
    unit: string;
    currency: string;
  };
  pricingTiers: {
    quantityRange: string; // '1-50', '51-100', '100+'
    discountPercentage: number;
    unitPrice: number;
  }[];
  bulkDiscounts: {
    threshold: number;
    discountPercentage: number;
  }[];
  landedCostFactors: {
    shipping: number;
    customs: number;
    handling: number;
    insurance: number;
  };
  paymentTerms: {
    netDays: number; // e.g., Net 30, Net 15
    earlyPaymentDiscount?: {
      percentage: number;
      days: number;
    };
  };
}

export interface SupplierDelivery {
  leadTime: {
    standard: number; // days
    express?: number; // days
    rush?: number; // days
  };
  deliveryMethods: {
    method: string; // 'Pickup', 'Delivery', 'Shipping'
    cost: number;
    coverage: string[]; // cities/regions covered
  }[];
  deliveryTerms: string; // 'FOB', 'CIF', 'EXW'
  packagingOptions: string[];
}

export interface SupplierPerformance {
  onTimeDelivery: number; // percentage
  qualityScore: number; // 0-100
  orderAccuracy: number; // percentage
  responseTime: number; // hours
  totalOrders: number;
  successfulOrders: number;
  averageOrderValue: number;
  lastOrderDate: string;
  totalSpent: number; // total amount spent with this supplier
  averageOrderSize: number; // average quantity per order
  defectRate: number; // percentage of defective items
  returnRate: number; // percentage of returned items
}

export interface SupplierDocument {
  id: string;
  type: 'business_license' | 'tax_certificate' | 'insurance' | 'certification' | 'contract' | 'other';
  name: string;
  url: string;
  expiryDate?: string;
  uploadedDate: string;
}

export interface Supplier {
  id: string;
  name: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  website?: string;
  
  // Core Information
  location: SupplierLocation;
  contact: SupplierContact;
  capabilities: SupplierCapabilities;
  pricing: SupplierPricing;
  delivery: SupplierDelivery;
  performance: SupplierPerformance;
  rating: SupplierRating;
  
  // Status and Metadata
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  verificationDate?: string;
  documents: SupplierDocument[];
  
  // Business Information
  establishedYear: number;
  employeeCount: string; // '1-10', '11-50', '51-200', '200+'
  annualRevenue?: string; // 'Under 1M', '1M-10M', '10M-50M', '50M+'
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
}

// Request/Response Types
export interface CreateSupplierRequest {
  name: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  website?: string;
  location: Omit<SupplierLocation, 'id'>;
  contact: SupplierContact;
  capabilities: SupplierCapabilities;
  pricing: SupplierPricing;
  delivery: SupplierDelivery;
  establishedYear: number;
  employeeCount: string;
  annualRevenue?: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  legalName?: string;
  website?: string;
  location?: Partial<SupplierLocation>;
  contact?: Partial<SupplierContact>;
  capabilities?: Partial<SupplierCapabilities>;
  pricing?: Partial<SupplierPricing>;
  delivery?: Partial<SupplierDelivery>;
  status?: Supplier['status'];
}

export interface SupplierSearchFilters {
  name?: string;
  category?: string;
  location?: string;
  status?: Supplier['status'];
  verificationStatus?: Supplier['verificationStatus'];
  minRating?: number;
  maxLeadTime?: number;
  minOrderQuantity?: number;
  capabilities?: string[];
}

export interface SupplierListResponse {
  suppliers: Supplier[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  verifiedSuppliers: number;
  averageRating: number;
  topCategories: {
    category: string;
    count: number;
  }[];
  topLocations: {
    location: string;
    count: number;
  }[];
}

// Supplier Comparison Types
export interface SupplierComparison {
  suppliers: Supplier[];
  criteria: {
    pricing: boolean;
    delivery: boolean;
    quality: boolean;
    location: boolean;
    capabilities: boolean;
  };
}

export interface SupplierQuote {
  id: string;
  supplierId: string;
  supplierName: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  currency: string;
  leadTime: number;
  validityDays: number;
  terms: string;
  notes?: string;
  createdAt: string;
  expiresAt: string;
}

// Supplier Performance Analytics
export interface SupplierAnalytics {
  supplierId: string;
  period: 'month' | 'quarter' | 'year';
  metrics: {
    orderVolume: number;
    orderValue: number;
    onTimeDelivery: number;
    qualityScore: number;
    costSavings: number;
    responseTime: number;
  };
  trends: {
    orderVolume: 'increasing' | 'decreasing' | 'stable';
    orderValue: 'increasing' | 'decreasing' | 'stable';
    qualityScore: 'improving' | 'declining' | 'stable';
  };
}
