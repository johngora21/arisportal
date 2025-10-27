// Real Estate API Service with data transformation
import { API_CONFIG } from '../../../../config/api';
import { 
  Property, 
  InvestmentProject, 
  UserProperty,
  PropertySearchFilters,
  InvestmentProjectSearchFilters,
  CreatePropertyRequest,
  CreateInvestmentProjectRequest
} from '../models';
import {
  transformBackendPropertiesToFrontend,
  transformBackendInvestmentProjectsToFrontend,
  transformBackendUserPropertiesToFrontend,
  safeTransformProperty,
  safeTransformInvestmentProject,
  safeTransformUserProperty
} from './dataTransformers';

const API_BASE_URL = API_CONFIG.BASE_URL;

// API Service Class
class RealEstateAPIService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/real-estate`;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Properties API
  async getProperties(filters: PropertySearchFilters & { limit?: number; offset?: number } = {}): Promise<Property[]> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, item.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';
    
    try {
      const backendProperties = await this.makeRequest<any[]>(endpoint);
      return transformBackendPropertiesToFrontend(backendProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Return empty array on error - UI will show "no properties found"
      return [];
    }
  }

  async getProperty(id: string): Promise<Property | null> {
    try {
      const numericId = id.replace('property-', '');
      const backendProperty = await this.makeRequest<any>(`/properties/${numericId}`);
      return safeTransformProperty(backendProperty);
    } catch (error) {
      console.error('Error fetching property:', error);
      return null;
    }
  }

  async createProperty(propertyData: CreatePropertyRequest): Promise<Property | null> {
    try {
      // Transform frontend data to backend format
      const backendData = {
        title: propertyData.title,
        description: propertyData.description,
        property_type: propertyData.type === 'land' ? 'plot' : propertyData.type,
        region: propertyData.location.split(',')[2]?.trim() || 'Dar es Salaam',
        district: propertyData.location.split(',')[1]?.trim() || 'Unknown',
        council: propertyData.location.split(',')[1]?.trim() || 'Unknown',
        locality: propertyData.location.split(',')[0]?.trim() || 'Unknown',
        price: propertyData.price,
        size: parseFloat(propertyData.size.replace(/[^\d.]/g, '')) || 0,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        kitchen: propertyData.kitchen?.toString(),
        contact_name: 'Current User',
        contact_role: 'Property Owner',
        contact_phone: '+255 754 000 000',
        contact_email: 'user@email.com',
        owner_id: 1,
        latitude: propertyData.coordinates?.lat,
        longitude: propertyData.coordinates?.lng,
        features: propertyData.features?.join(', '),
        utilities: propertyData.amenities?.join(', ')
      };

      const backendProperty = await this.makeRequest<any>('/properties', {
        method: 'POST',
        body: JSON.stringify(backendData)
      });

      return safeTransformProperty(backendProperty);
    } catch (error) {
      console.error('Error creating property:', error);
      return null;
    }
  }

  async updateProperty(id: string, propertyData: Partial<CreatePropertyRequest>): Promise<Property | null> {
    try {
      const numericId = id.replace('property-', '');
      const backendProperty = await this.makeRequest<any>(`/properties/${numericId}`, {
        method: 'PUT',
        body: JSON.stringify(propertyData)
      });

      return safeTransformProperty(backendProperty);
    } catch (error) {
      console.error('Error updating property:', error);
      return null;
    }
  }

  async deleteProperty(id: string): Promise<boolean> {
    try {
      const numericId = id.replace('property-', '');
      await this.makeRequest(`/properties/${numericId}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  }

  // Investment Projects API
  async getInvestmentProjects(filters: InvestmentProjectSearchFilters & { limit?: number; offset?: number } = {}): Promise<InvestmentProject[]> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/investment-projects?${queryString}` : '/investment-projects';
    
    try {
      const backendProjects = await this.makeRequest<any[]>(endpoint);
      return transformBackendInvestmentProjectsToFrontend(backendProjects);
    } catch (error) {
      console.error('Error fetching investment projects:', error);
      return [];
    }
  }

  async getInvestmentProject(id: string): Promise<InvestmentProject | null> {
    try {
      const numericId = id.replace('project-', '');
      const backendProject = await this.makeRequest<any>(`/investment-projects/${numericId}`);
      return safeTransformInvestmentProject(backendProject);
    } catch (error) {
      console.error('Error fetching investment project:', error);
      return null;
    }
  }

  async createInvestmentProject(projectData: CreateInvestmentProjectRequest): Promise<InvestmentProject | null> {
    try {
      // Transform frontend data to backend format
      const backendData = {
        title: projectData.title,
        description: projectData.description,
        category: 'commercial', // Default category
        location: projectData.location,
        total_project_value: projectData.totalValue,
        minimum_investment: projectData.minimumInvestment,
        target_investors: projectData.targetInvestors,
        expected_roi: projectData.expectedROI,
        duration: projectData.projectDuration,
        project_manager_id: 1,
        contact_name: 'Current User',
        contact_role: 'Project Manager',
        contact_phone: '+255 754 000 000',
        contact_email: 'user@email.com',
        latitude: projectData.coordinates?.lat,
        longitude: projectData.coordinates?.lng
      };

      const backendProject = await this.makeRequest<any>('/investment-projects', {
        method: 'POST',
        body: JSON.stringify(backendData)
      });

      return safeTransformInvestmentProject(backendProject);
    } catch (error) {
      console.error('Error creating investment project:', error);
      return null;
    }
  }

  async updateInvestmentProject(id: string, projectData: Partial<CreateInvestmentProjectRequest>): Promise<InvestmentProject | null> {
    try {
      const numericId = id.replace('project-', '');
      const backendProject = await this.makeRequest<any>(`/investment-projects/${numericId}`, {
        method: 'PUT',
        body: JSON.stringify(projectData)
      });

      return safeTransformInvestmentProject(backendProject);
    } catch (error) {
      console.error('Error updating investment project:', error);
      return null;
    }
  }

  async deleteInvestmentProject(id: string): Promise<boolean> {
    try {
      const numericId = id.replace('project-', '');
      await this.makeRequest(`/investment-projects/${numericId}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting investment project:', error);
      return false;
    }
  }

  // User Properties API
  async getUserProperties(userId: number): Promise<UserProperty[]> {
    try {
      const backendUserProperties = await this.makeRequest<any[]>(`/users/${userId}/properties`);
      return transformBackendUserPropertiesToFrontend(backendUserProperties);
    } catch (error) {
      console.error('Error fetching user properties:', error);
      return [];
    }
  }

  async createUserProperty(userId: number, propertyId: string, acquisitionPrice: number): Promise<UserProperty | null> {
    try {
      const numericPropertyId = propertyId.replace('property-', '');
      const backendData = {
        user_id: userId,
        property_id: parseInt(numericPropertyId),
        acquisition_date: new Date().toISOString(),
        acquisition_price: acquisitionPrice,
        verification_status: 'pending'
      };

      const backendUserProperty = await this.makeRequest<any>(`/users/${userId}/properties`, {
        method: 'POST',
        body: JSON.stringify(backendData)
      });

      return safeTransformUserProperty(backendUserProperty);
    } catch (error) {
      console.error('Error creating user property:', error);
      return null;
    }
  }

  // Statistics API
  async getPropertyStats(): Promise<any> {
    try {
      return await this.makeRequest<any>('/statistics/properties');
    } catch (error) {
      console.error('Error fetching property stats:', error);
      return {
        totalProperties: 0,
        availableProperties: 0,
        soldProperties: 0,
        pendingProperties: 0,
        averagePrice: 0,
        totalValue: 0
      };
    }
  }

  async getInvestmentProjectStats(): Promise<any> {
    try {
      return await this.makeRequest<any>('/statistics/investment-projects');
    } catch (error) {
      console.error('Error fetching investment project stats:', error);
      return {
        totalProjects: 0,
        activeProjects: 0,
        fundedProjects: 0,
        completedProjects: 0,
        totalInvestmentValue: 0,
        averageROI: 0
      };
    }
  }
}

// Export singleton instance
export const realEstateAPI = new RealEstateAPIService();

// Export transformation functions for direct use
export {
  transformBackendPropertyToFrontend,
  transformBackendInvestmentProjectToFrontend,
  transformBackendUserPropertyToFrontend,
  transformBackendPropertiesToFrontend,
  transformBackendInvestmentProjectsToFrontend,
  transformBackendUserPropertiesToFrontend
} from './dataTransformers';