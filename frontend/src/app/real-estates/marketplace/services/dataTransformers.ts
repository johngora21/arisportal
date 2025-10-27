// Data transformation service to convert backend API data to frontend mock data format
import { Property, InvestmentProject, UserProperty } from '../models';

// Helper function to safely convert dates
const safeDateToString = (dateValue: any): string => {
  if (!dateValue) return new Date().toISOString().split('T')[0];
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
};

// Backend API interfaces (matching your backend schemas)
interface BackendProperty {
  id: number;
  title: string;
  description?: string;
  property_type: 'plot' | 'house' | 'apartment' | 'commercial' | 'office' | 'warehouse' | 'shop';
  status: 'available' | 'sold' | 'rented' | 'pending' | 'off_market';
  verification_status: 'pending' | 'approved' | 'rejected' | 'under_review';
  region: string;
  district: string;
  council: string;
  locality: string;
  street?: string;
  ward?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  estimated_value?: number;
  size?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  kitchen?: string;
  year_built?: number;
  condition?: string;
  furnishing?: 'Furnished' | 'Semi-furnished' | 'Unfurnished';
  parking?: string;
  security?: string;
  utilities?: string;
  features?: string;
  lot_number?: string;
  legal_area?: string;
  lot_type?: string;
  lot_use?: 'Mixed Use' | 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural' | 'Recreational';
  block?: string;
  total_area?: number;
  nearby_landmarks?: string;
  access_road?: string;
  contact_name: string;
  contact_role: string;
  contact_phone: string;
  contact_email: string;
  national_id_number?: string;
  supporting_document_type?: string;
  boundary_points?: number;
  boundary_distance?: number;
  boundary_coordinates?: Array<{lat: number; lng: number}>;
  owner_id: number;
  created_at: string;
  updated_at: string;
  images?: Array<{
    id: number;
    property_id: number;
    image_path: string;
    image_type: string;
    is_primary: boolean;
    created_at: string;
  }>;
}

interface BackendInvestmentProject {
  id: number;
  title: string;
  description?: string;
  category: string;
  location: string;
  land_size?: string;
  zoning?: string;
  access?: string;
  duration?: string;
  development_stage?: string;
  status: string;
  total_project_value: number;
  minimum_investment: number;
  current_investors: number;
  target_investors: number;
  funding_progress: number;
  expected_roi: number;
  investment_deadline?: string;
  latitude?: number;
  longitude?: number;
  features?: any;
  project_manager_id: number;
  contact_name: string;
  contact_role: string;
  contact_phone: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
  images?: Array<{
    id: number;
    project_id: number;
    image_path: string;
    image_type: string;
    is_primary: boolean;
    created_at: string;
  }>;
}

interface BackendUserProperty {
  id: number;
  user_id: number;
  property_id: number;
  acquisition_date: string;
  acquisition_price: number;
  current_value?: number;
  verification_status: 'pending' | 'approved' | 'rejected' | 'under_review';
  is_for_sale: boolean;
  is_for_rent: boolean;
  created_at: string;
  updated_at: string;
  property?: BackendProperty;
}

// Utility functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0
  }).format(price);
};

const formatSize = (size?: number, area?: number): string => {
  const sizeValue = size || area || 0;
  if (sizeValue === 0) return 'N/A';
  return `${sizeValue.toLocaleString()} sqm`;
};

const getPropertyType = (backendType: string): 'land' | 'house' | 'apartment' | 'commercial' => {
  switch (backendType) {
    case 'plot':
      return 'land';
    case 'house':
      return 'house';
    case 'apartment':
      return 'apartment';
    case 'commercial':
    case 'office':
    case 'warehouse':
    case 'shop':
      return 'commercial';
    default:
      return 'land';
  }
};

const getStatus = (backendStatus: string): 'available' | 'sold' | 'pending' => {
  switch (backendStatus) {
    case 'available':
      return 'available';
    case 'sold':
    case 'rented':
      return 'sold';
    case 'pending':
    case 'off_market':
      return 'pending';
    default:
      return 'available';
  }
};

const getVerificationStatus = (backendStatus: string): 'verified' | 'pending' | 'rejected' => {
  switch (backendStatus) {
    case 'approved':
      return 'verified';
    case 'pending':
    case 'under_review':
      return 'pending';
    case 'rejected':
      return 'rejected';
    default:
      return 'pending';
  }
};

// Main transformation functions
export const transformBackendPropertyToFrontend = (backendProperty: BackendProperty): Property => {
  // Use a default image since images field doesn't exist in the API response
  const primaryImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400';
  const allImages = [primaryImage];

  return {
    id: `property-${backendProperty.id}`,
    title: backendProperty.title,
    type: getPropertyType(backendProperty.property_type),
    location: `${backendProperty.locality}, ${backendProperty.district}, ${backendProperty.region}`,
    price: backendProperty.price,
    size: formatSize(backendProperty.size, null), // Only use size field, not area
    bedrooms: backendProperty.bedrooms,
    bathrooms: backendProperty.bathrooms,
    kitchen: backendProperty.kitchen ? parseInt(backendProperty.kitchen) : undefined,
    image: primaryImage,
    description: backendProperty.description || 'No description available',
    seller: {
      name: backendProperty.contact_name,
      phone: backendProperty.contact_phone,
      email: backendProperty.contact_email,
      role: backendProperty.contact_role
    },
    listedDate: safeDateToString(backendProperty.created_at),
    status: getStatus(backendProperty.status),
    verificationStatus: getVerificationStatus(backendProperty.verification_status),
    features: backendProperty.features ? backendProperty.features.split(',').map(f => f.trim()) : [],
    amenities: [
      ...(backendProperty.parking ? ['Parking'] : []),
      ...(backendProperty.security ? ['Security'] : []),
      ...(backendProperty.utilities ? ['Utilities'] : [])
      // Removed water and electricity fields that don't exist
    ],
    images: allImages,
    documents: {
      titleDeed: !!backendProperty.national_id_number,
      survey: !!backendProperty.boundary_points,
      permits: !!backendProperty.supporting_document_type
    },
    coordinates: backendProperty.latitude && backendProperty.longitude ? {
      lat: backendProperty.latitude,
      lng: backendProperty.longitude
    } : undefined,
    // Add all the missing fields that exist in the database
    region: backendProperty.region,
    district: backendProperty.district,
    council: backendProperty.council,
    locality: backendProperty.locality,
    street: backendProperty.street,
    ward: backendProperty.ward,
    postal_code: backendProperty.postal_code,
    latitude: backendProperty.latitude,
    longitude: backendProperty.longitude,
    estimated_value: backendProperty.estimated_value,
    year_built: backendProperty.year_built,
    condition: backendProperty.condition,
    furnishing: backendProperty.furnishing,
    parking: backendProperty.parking,
    security: backendProperty.security,
    utilities: backendProperty.utilities,
    lot_number: backendProperty.lot_number,
    legal_area: backendProperty.legal_area,
    lot_type: backendProperty.lot_type,
    lot_use: backendProperty.lot_use,
    block: backendProperty.block,
    total_area: backendProperty.total_area,
    nearby_landmarks: backendProperty.nearby_landmarks,
    access_road: backendProperty.access_road,
    contact_name: backendProperty.contact_name,
    contact_role: backendProperty.contact_role,
    contact_phone: backendProperty.contact_phone,
    contact_email: backendProperty.contact_email,
    national_id_number: backendProperty.national_id_number,
    supporting_document_type: backendProperty.supporting_document_type,
    boundary_points: backendProperty.boundary_points,
    boundary_distance: backendProperty.boundary_distance,
    boundary_coordinates: backendProperty.boundary_coordinates
  };
};

export const transformBackendInvestmentProjectToFrontend = (backendProject: BackendInvestmentProject): InvestmentProject => {
  const primaryImage = backendProject.images?.find(img => img.is_primary)?.image_path || 
                      backendProject.images?.[0]?.image_path || 
                      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400';

  return {
    id: `project-${backendProject.id}`,
    title: backendProject.title,
    category: backendProject.category,
    location: backendProject.location,
    landSize: backendProject.land_size || '2.0 acres',
    zoning: backendProject.zoning || 'Commercial',
    access: backendProject.access || 'Main Road',
    duration: backendProject.duration || '24 months',
    expectedROI: backendProject.expected_roi,
    developmentStage: backendProject.development_stage || 'planning',
    status: backendProject.status === 'active' ? 'active' : 
            backendProject.status === 'funded' ? 'funded' : 'completed',
    totalProjectValue: backendProject.total_project_value,
    minimumInvestment: backendProject.minimum_investment,
    currentInvestors: backendProject.current_investors,
    targetInvestors: backendProject.target_investors,
    fundingProgress: backendProject.funding_progress,
    investmentDeadline: backendProject.investment_deadline || 'Dec 2024',
    features: ['Modern Design', 'Prime Location', 'Good Investment'],
    image: primaryImage,
    coordinates: backendProject.latitude && backendProject.longitude ? {
      lat: backendProject.latitude,
      lng: backendProject.longitude
    } : undefined
  };
};

export const transformBackendUserPropertyToFrontend = (backendUserProperty: BackendUserProperty): UserProperty | null => {
  if (!backendUserProperty.property) {
    return null;
  }

  const property = backendUserProperty.property;
  const primaryImage = property.images?.find(img => img.is_primary)?.image_path || 
                      property.images?.[0]?.image_path || 
                      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400';

  return {
    id: `user-property-${backendUserProperty.id}`,
    title: property.title,
    type: getPropertyType(property.property_type),
    location: `${property.locality}, ${property.district}, ${property.region}`,
    price: backendUserProperty.acquisition_price,
    size: formatSize(property.size, property.area),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    kitchen: property.kitchen ? parseInt(property.kitchen) : undefined,
    image: primaryImage,
    description: property.description || 'No description available',
    acquisitionDate: new Date(backendUserProperty.acquisition_date).toISOString().split('T')[0],
    currentValue: backendUserProperty.current_value || backendUserProperty.acquisition_price,
    verificationStatus: getVerificationStatus(backendUserProperty.verification_status),
    coordinates: property.latitude && property.longitude ? {
      lat: property.latitude,
      lng: property.longitude
    } : undefined
  };
};

// Batch transformation functions
export const transformBackendPropertiesToFrontend = (backendProperties: BackendProperty[]): Property[] => {
  return backendProperties.map(transformBackendPropertyToFrontend);
};

export const transformBackendInvestmentProjectsToFrontend = (backendProjects: BackendInvestmentProject[]): InvestmentProject[] => {
  return backendProjects.map(transformBackendInvestmentProjectToFrontend);
};

export const transformBackendUserPropertiesToFrontend = (backendUserProperties: BackendUserProperty[]): UserProperty[] => {
  return backendUserProperties
    .map(transformBackendUserPropertyToFrontend)
    .filter((property): property is UserProperty => property !== null);
};

// Default mock data fallback (in case API fails)
export const getDefaultMockData = () => {
  return {
    properties: [] as Property[],
    investmentProjects: [] as InvestmentProject[],
    userProperties: [] as UserProperty[]
  };
};

// Error handling for transformations
export const safeTransformProperty = (backendProperty: any): Property | null => {
  try {
    return transformBackendPropertyToFrontend(backendProperty);
  } catch (error) {
    console.error('Error transforming property:', error);
    return null;
  }
};

export const safeTransformInvestmentProject = (backendProject: any): InvestmentProject | null => {
  try {
    return transformBackendInvestmentProjectToFrontend(backendProject);
  } catch (error) {
    console.error('Error transforming investment project:', error);
    return null;
  }
};

export const safeTransformUserProperty = (backendUserProperty: any): UserProperty | null => {
  try {
    return transformBackendUserPropertyToFrontend(backendUserProperty);
  } catch (error) {
    console.error('Error transforming user property:', error);
    return null;
  }
};
