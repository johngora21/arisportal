// Base interfaces for all real estate data structures

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Seller {
  name: string;
  phone: string;
  email: string;
  role?: string;
}

export interface PropertyDocuments {
  titleDeed: boolean;
  survey: boolean;
  permits: boolean;
}

// Main Property interface - matches mock data structure exactly
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
  seller: Seller;
  listedDate: string;
  status: 'available' | 'sold' | 'pending';
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  features?: string[];
  amenities?: string[];
  images?: string[];
  documents?: PropertyDocuments;
  coordinates?: Coordinates;
}

// Extended PropertyDetails interface for modals
export interface PropertyDetails extends Property {
  images: string[];
  features: string[];
  amenities: string[];
  documents: PropertyDocuments;
}

// Investment Project interface - matches mock data structure exactly
export interface InvestmentProject {
  id: string;
  title: string;
  category: string;
  location: string;
  landSize: string;
  zoning: string;
  access: string;
  duration: string;
  expectedROI: number;
  developmentStage: string;
  status: 'active' | 'funded' | 'completed';
  totalProjectValue: number;
  minimumInvestment: number;
  currentInvestors: number;
  targetInvestors: number;
  fundingProgress: number;
  investmentDeadline: string;
  features: string[];
  image: string;
  coordinates?: Coordinates;
}

// User Property interface for "My Properties" tab
export interface UserProperty {
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
  acquisitionDate: string;
  currentValue: number;
  verificationStatus: 'approved' | 'pending' | 'rejected';
  coordinates?: Coordinates;
}

// API Response interfaces for future real data integration
export interface PropertyListResponse {
  properties: Property[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface InvestmentProjectListResponse {
  projects: InvestmentProject[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface UserPropertyListResponse {
  properties: UserProperty[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Search and filter interfaces
export interface PropertySearchFilters {
  searchTerm?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
  amenities?: string[];
  verificationStatus?: string;
  limit?: number;
  offset?: number;
}

export interface InvestmentProjectSearchFilters {
  searchTerm?: string;
  minInvestment?: number;
  maxInvestment?: number;
  location?: string;
  status?: string;
  minROI?: number;
  maxROI?: number;
  limit?: number;
  offset?: number;
}

// Form interfaces for creating/updating properties
export interface CreatePropertyRequest {
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
  features?: string[];
  amenities?: string[];
  coordinates?: Coordinates;
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {
  id: string;
}

export interface CreateInvestmentProjectRequest {
  title: string;
  location: string;
  totalValue: number;
  minimumInvestment: number;
  targetInvestors: number;
  expectedROI: number;
  projectDuration: string;
  image: string;
  description: string;
  coordinates?: Coordinates;
}

export interface UpdateInvestmentProjectRequest extends Partial<CreateInvestmentProjectRequest> {
  id: string;
}

// Error handling interfaces
export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// Pagination interface
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Statistics interfaces for dashboards
export interface PropertyStats {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  pendingProperties: number;
  averagePrice: number;
  totalValue: number;
}

export interface InvestmentProjectStats {
  totalProjects: number;
  activeProjects: number;
  fundedProjects: number;
  completedProjects: number;
  totalInvestmentValue: number;
  averageROI: number;
}

// Location interfaces
export interface LocationData {
  coordinates: Coordinates;
  address: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
}

// File upload interfaces
export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface DocumentUpload {
  id: string;
  propertyId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  verified: boolean;
}
