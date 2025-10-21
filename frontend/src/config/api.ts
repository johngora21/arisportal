// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-api.com/api/v1'
    : 'http://localhost:4001/api/v1',
  VERSION: '1.0.0', // Cache busting
  
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
    },
    
    // CRM endpoints
    CRM: {
      CONTACTS: '/contacts',
      DEALS: '/deals',
      COMMUNICATIONS: '/communications',
    },
    
    // Inventory endpoints
    INVENTORY: {
      CATEGORIES: '/inventory/categories',
      ITEMS: '/inventory/items',
      ANALYTICS: '/inventory/analytics/stats',
    },
    
    // Properties endpoints
    PROPERTIES: {
      LIST: '/properties',
      CREATE: '/properties',
      UPDATE: '/properties',
    },
    
    // Investments endpoints
    INVESTMENTS: {
      LIST: '/investments',
      CREATE: '/investments',
      UPDATE: '/investments',
    },
    
    // Finance endpoints
    FINANCE: {
      TRANSACTIONS: '/finance/transactions',
      PAYROLL: '/finance/payroll',
      REPORTS: '/finance/reports',
    },
    
    // Payroll endpoints
    PAYROLL: {
      BRANCHES: '/payroll/branches',
      DEPARTMENTS: '/payroll/departments',
      ROLES: '/payroll/roles',
      STAFF: '/payroll/staff',
      PROCESS: '/payroll/process',
      RECORDS: '/payroll/records',
      SUMMARY: '/payroll/summary',
    },
    
    // Suppliers endpoints
    SUPPLIERS: {
      LIST: '/suppliers',
      CREATE: '/suppliers',
      UPDATE: '/suppliers',
    },
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get endpoint by path
export const getEndpoint = (path: string): string => {
  const keys = path.split('.');
  let endpoint = API_CONFIG.ENDPOINTS as any;
  
  for (const key of keys) {
    endpoint = endpoint[key];
    if (!endpoint) {
      throw new Error(`Endpoint not found: ${path}`);
    }
  }
  
  return endpoint;
};

// Helper function to build full URL from endpoint path
export const getApiUrl = (endpointPath: string): string => {
  const endpoint = getEndpoint(endpointPath);
  return buildApiUrl(endpoint);
};
