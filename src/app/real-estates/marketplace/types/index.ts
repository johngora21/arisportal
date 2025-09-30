export interface Property {
  id: string;
  title: string;
  type: 'land' | 'house' | 'apartment' | 'commercial';
  location: string;
  price: number;
  size: string;
  bedrooms?: number;
  bathrooms?: number;
  kitchen?: number;
  image: string;
  description: string;
  seller: {
    name: string;
    phone: string;
    email: string;
    role?: string;
  };
  listedDate: string;
  status: 'available' | 'sold' | 'pending';
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  features?: string[];
  amenities?: string[];
  images?: string[];
  documents?: {
    titleDeed: boolean;
    survey: boolean;
    permits: boolean;
  };
}

export interface PropertyDetails {
  id: string;
  title: string;
  type: 'land' | 'house' | 'apartment' | 'commercial';
  location: string;
  price: number;
  size: string;
  bedrooms?: number;
  bathrooms?: number;
  kitchen?: number;
  images: string[];
  description: string;
  features: string[];
  amenities: string[];
  seller: {
    name: string;
    phone: string;
    email: string;
    role: string;
  };
  listedDate: string;
  status: 'available' | 'sold' | 'pending';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  documents: {
    titleDeed: boolean;
    survey: boolean;
    permits: boolean;
  };
}

export interface MarketplaceStats {
  totalProperties: number;
  totalSales: number;
  activeSellers: number;
  totalVolume: number;
  successRate: number;
  averageSaleTime: number;
}
export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  status: 'pending' | 'verified' | 'rejected';
  documents: {
    idDocument: File | null;
    businessLicense: File | null;
    taxCertificate: File | null;
  };
}

export interface PropertyVerification {
  id: string;
  propertyId: string;
  sellerId: string;
  status: 'pending' | 'verified' | 'rejected' | 'in-progress';
  submittedDate: string;
  verifiedDate?: string;
  verifiedBy?: string;
  ministryCheck: {
    ownershipAuthentic: boolean;
    noDisputes: boolean;
    noLiens: boolean;
    digitalPhysicalMatch: boolean;
  };
  notes: string;
  documents: {
    digitalDeed: File | null;
    physicalDeedReceived: boolean;
    inspectionReport: File | null;
  };
}

export interface TokenizedProperty {
  id: string;
  propertyId: string;
  tokenId: string;
  smartContractAddress: string;
  blockchainHash: string;
  tokenizedDate: string;
  status: 'active' | 'transferred' | 'burned';
  metadata: {
    location: string;
    size: number;
    deedNumber: string;
    legalInfo: string;
    ownerInfo: string;
  };
}

export interface MarketplaceProperty {
  id: string;
  title: string;
  description: string;
  location: string;
  size: number;
  price: number;
  currency: string;
  propertyType: 'residential' | 'commercial' | 'land' | 'mixed-use';
  images: string[];
  tokenId?: string;
  smartContractAddress?: string;
  seller: {
    id: string;
    name: string;
    verified: boolean;
  };
  verification: {
    status: 'verified' | 'pending' | 'rejected';
    verifiedDate?: string;
    verifiedBy?: string;
  };
  listingDate: string;
  status: 'active' | 'sold' | 'removed';
  features: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PurchaseOrder {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: string;
  paymentReference?: string;
  contractTerms: {
    price: number;
    conditions: string[];
    closingDate: string;
    contingencies: string[];
  };
  createdAt: string;
  updatedAt: string;
  smartContractExecution?: {
    transactionHash: string;
    executedAt: string;
    gasUsed: number;
  };
}

export interface OwnershipRecord {
  id: string;
  propertyId: string;
  tokenId: string;
  currentOwner: {
    id: string;
    name: string;
    walletAddress: string;
  };
  previousOwners: Array<{
    id: string;
    name: string;
    walletAddress: string;
    ownedFrom: string;
    ownedTo: string;
    transactionHash: string;
  }>;
  ownershipHistory: Array<{
    transactionHash: string;
    from: string;
    to: string;
    timestamp: string;
    blockNumber: number;
  }>;
  digitalDeedCertificate: {
    certificateId: string;
    issuedAt: string;
    validUntil?: string;
    downloadUrl: string;
  };
}

export interface AuditRecord {
  id: string;
  type: 'verification' | 'tokenization' | 'purchase' | 'transfer' | 'compliance';
  propertyId?: string;
  sellerId?: string;
  buyerId?: string;
  transactionHash?: string;
  details: {
    action: string;
    performedBy: string;
    timestamp: string;
    data: any;
  };
  status: 'success' | 'failed' | 'pending';
  notes?: string;
}

export interface MarketplaceStats {
  totalProperties: number;
  verifiedProperties: number;
  pendingVerification: number;
  totalSales: number;
  totalVolume: number;
  activeSellers: number;
  pendingSellers: number;
  averageSaleTime: number;
  successRate: number;
}

export interface VerificationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  completedAt?: string;
  notes?: string;
}

export interface SmartContractTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

    ownedTo: string;
    transactionHash: string;
  }>;
  ownershipHistory: Array<{
    transactionHash: string;
    from: string;
    to: string;
    timestamp: string;
    blockNumber: number;
  }>;
  digitalDeedCertificate: {
    certificateId: string;
    issuedAt: string;
    validUntil?: string;
    downloadUrl: string;
  };
}

export interface AuditRecord {
  id: string;
  type: 'verification' | 'tokenization' | 'purchase' | 'transfer' | 'compliance';
  propertyId?: string;
  sellerId?: string;
  buyerId?: string;
  transactionHash?: string;
  details: {
    action: string;
    performedBy: string;
    timestamp: string;
    data: any;
  };
  status: 'success' | 'failed' | 'pending';
  notes?: string;
}

export interface MarketplaceStats {
  totalProperties: number;
  verifiedProperties: number;
  pendingVerification: number;
  totalSales: number;
  totalVolume: number;
  activeSellers: number;
  pendingSellers: number;
  averageSaleTime: number;
  successRate: number;
}

export interface VerificationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  completedAt?: string;
  notes?: string;
}

export interface SmartContractTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

    ownedTo: string;
    transactionHash: string;
  }>;
  ownershipHistory: Array<{
    transactionHash: string;
    from: string;
    to: string;
    timestamp: string;
    blockNumber: number;
  }>;
  digitalDeedCertificate: {
    certificateId: string;
    issuedAt: string;
    validUntil?: string;
    downloadUrl: string;
  };
}

export interface AuditRecord {
  id: string;
  type: 'verification' | 'tokenization' | 'purchase' | 'transfer' | 'compliance';
  propertyId?: string;
  sellerId?: string;
  buyerId?: string;
  transactionHash?: string;
  details: {
    action: string;
    performedBy: string;
    timestamp: string;
    data: any;
  };
  status: 'success' | 'failed' | 'pending';
  notes?: string;
}

export interface MarketplaceStats {
  totalProperties: number;
  verifiedProperties: number;
  pendingVerification: number;
  totalSales: number;
  totalVolume: number;
  activeSellers: number;
  pendingSellers: number;
  averageSaleTime: number;
  successRate: number;
}

export interface VerificationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  completedAt?: string;
  notes?: string;
}

export interface SmartContractTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

    ownedTo: string;
    transactionHash: string;
  }>;
  ownershipHistory: Array<{
    transactionHash: string;
    from: string;
    to: string;
    timestamp: string;
    blockNumber: number;
  }>;
  digitalDeedCertificate: {
    certificateId: string;
    issuedAt: string;
    validUntil?: string;
    downloadUrl: string;
  };
}

export interface AuditRecord {
  id: string;
  type: 'verification' | 'tokenization' | 'purchase' | 'transfer' | 'compliance';
  propertyId?: string;
  sellerId?: string;
  buyerId?: string;
  transactionHash?: string;
  details: {
    action: string;
    performedBy: string;
    timestamp: string;
    data: any;
  };
  status: 'success' | 'failed' | 'pending';
  notes?: string;
}

export interface MarketplaceStats {
  totalProperties: number;
  verifiedProperties: number;
  pendingVerification: number;
  totalSales: number;
  totalVolume: number;
  activeSellers: number;
  pendingSellers: number;
  averageSaleTime: number;
  successRate: number;
}

export interface VerificationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  completedAt?: string;
  notes?: string;
}

export interface SmartContractTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
