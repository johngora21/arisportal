// Base interfaces for all agriculture investment data structures

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AgricultureProject {
  id: string;
  title: string;
  category: 'crops' | 'livestock' | 'processing';
  location: string;
  totalValue: number;
  minimumInvestment: number;
  currentInvestors: number;
  targetInvestors: number;
  fundingProgress: number;
  expectedROI: number;
  projectDuration: string;
  image: string;
  description: string;
  status: 'active' | 'funded' | 'completed';
  coordinates?: Coordinates;
  
  // Crop-specific properties
  cropType?: string;
  farmSize?: string;
  expectedYield?: string;
  farmingMethod?: string;
  climate?: string;
  
  // Livestock-specific properties
  livestockType?: string;
  livestockCount?: number;
  
  // Processing-specific properties
  processingType?: string;
  capacity?: string;
  products?: string[];
  technology?: string;
  market?: string;
}

// Extended AgricultureProjectDetails interface for modals
export interface AgricultureProjectDetails extends AgricultureProject {
  images: string[];
  features: string[];
  benefits: string[];
  risks: string[];
  financialProjections: {
    year1: number;
    year2: number;
    year3: number;
  };
  sustainabilityMetrics: {
    waterUsage: string;
    carbonFootprint: string;
    soilHealth: string;
  };
}

// API Response interfaces for future real data integration
export interface AgricultureProjectListResponse {
  projects: AgricultureProject[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Search and filter interfaces
export interface AgricultureProjectSearchFilters {
  searchTerm?: string;
  category?: string;
  minInvestment?: number;
  maxInvestment?: number;
  location?: string;
  status?: string;
  minROI?: number;
  maxROI?: string;
  cropType?: string;
  livestockType?: string;
  processingType?: string;
}

// Form interfaces for creating/updating agriculture projects
export interface CreateAgricultureProjectRequest {
  title: string;
  category: 'crops' | 'livestock' | 'processing';
  location: string;
  totalValue: number;
  minimumInvestment: number;
  targetInvestors: number;
  expectedROI: number;
  projectDuration: string;
  image: string;
  description: string;
  coordinates?: Coordinates;
  
  // Category-specific fields
  cropType?: string;
  farmSize?: string;
  expectedYield?: string;
  farmingMethod?: string;
  climate?: string;
  
  livestockType?: string;
  livestockCount?: number;
  
  processingType?: string;
  capacity?: string;
  products?: string[];
  technology?: string;
  market?: string;
}

export interface UpdateAgricultureProjectRequest extends Partial<CreateAgricultureProjectRequest> {
  id: string;
}

// Investment tracking interfaces
export interface AgricultureInvestment {
  id: string;
  projectId: string;
  investorId: string;
  amount: number;
  investmentDate: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed';
  expectedReturn: number;
  actualReturn?: number;
  payoutSchedule: {
    date: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
  }[];
}

// Statistics interfaces for dashboards
export interface AgricultureProjectStats {
  totalProjects: number;
  activeProjects: number;
  fundedProjects: number;
  completedProjects: number;
  totalInvestmentValue: number;
  averageROI: number;
  categoryBreakdown: {
    crops: number;
    livestock: number;
    processing: number;
  };
  regionalBreakdown: Record<string, number>;
}

// Crop-specific interfaces
export interface CropProject extends AgricultureProject {
  category: 'crops';
  cropType: string;
  farmSize: string;
  expectedYield: string;
  farmingMethod: string;
  climate: string;
  growingSeason: string;
  harvestSchedule: string[];
  irrigationSystem?: string;
  soilType?: string;
  fertilizerPlan?: string;
  pestManagement?: string;
}

// Livestock-specific interfaces
export interface LivestockProject extends AgricultureProject {
  category: 'livestock';
  livestockType: string;
  livestockCount: number;
  facilityType: string;
  feedSystem?: string;
  healthManagement?: string;
  breedingProgram?: string;
  processingCapability?: string;
}

// Processing-specific interfaces
export interface ProcessingProject extends AgricultureProject {
  category: 'processing';
  processingType: string;
  capacity: string;
  products: string[];
  technology: string;
  market: string;
  rawMaterialSource?: string;
  qualityStandards?: string[];
  certifications?: string[];
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
export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface DocumentUpload {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  verified: boolean;
}

// Investment analytics interfaces
export interface InvestmentAnalytics {
  totalInvested: number;
  activeInvestments: number;
  completedInvestments: number;
  totalReturns: number;
  averageReturnRate: number;
  bestPerformingProject: {
    projectId: string;
    projectName: string;
    returnRate: number;
  };
  portfolioDistribution: {
    crops: number;
    livestock: number;
    processing: number;
  };
}

// Risk assessment interfaces
export interface RiskAssessment {
  projectId: string;
  climateRisk: 'low' | 'medium' | 'high';
  marketRisk: 'low' | 'medium' | 'high';
  operationalRisk: 'low' | 'medium' | 'high';
  financialRisk: 'low' | 'medium' | 'high';
  mitigationStrategies: string[];
  insuranceCoverage?: string;
}

// Sustainability interfaces
export interface SustainabilityMetrics {
  projectId: string;
  environmentalImpact: {
    waterUsage: number;
    carbonFootprint: number;
    soilHealth: string;
    biodiversity: string;
  };
  socialImpact: {
    localEmployment: number;
    communityBenefits: string[];
    educationPrograms: string[];
  };
  economicImpact: {
    localEconomicContribution: number;
    supplyChainDevelopment: string[];
    technologyTransfer: string[];
  };
}
