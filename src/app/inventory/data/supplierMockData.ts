import { Supplier, SupplierLocation, SupplierRating, SupplierContact, SupplierCapabilities, SupplierPricing, SupplierDelivery, SupplierPerformance } from './supplier';

export const mockSuppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'TechHub Ltd',
    legalName: 'TechHub Limited',
    registrationNumber: 'REG-001-2023',
    taxId: 'TAX-TH-001',
    website: 'https://techhub.co.tz',
    
    location: {
      id: 'loc-1',
      city: 'Dar es Salaam',
      region: 'Dar es Salaam',
      country: 'Tanzania',
      address: 'Kariakoo Business District, Dar es Salaam',
      coordinates: {
        lat: -6.7924,
        lng: 39.2083
      }
    },
    
    contact: {
      primaryContact: {
        name: 'John Mwalimu',
        title: 'Sales Manager',
        phone: '+255 123 456 789',
        email: 'john@techhub.co.tz'
      },
      secondaryContact: {
        name: 'Sarah Kimaro',
        title: 'Operations Manager',
        phone: '+255 987 654 321',
        email: 'sarah@techhub.co.tz'
      },
      businessHours: {
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 6:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: '8:00 AM - 5:00 PM',
        saturday: '9:00 AM - 2:00 PM'
      }
    },
    
    capabilities: {
      categories: ['Electronics', 'Computer Accessories'],
      certifications: ['ISO 9001:2015', 'ISO 14001:2015'],
      specialties: ['Custom Electronics', 'Bulk Orders', 'Technical Support'],
      languages: ['English', 'Swahili'],
      paymentMethods: ['Bank Transfer', 'Mobile Money', 'Cash']
    },
    
    pricing: {
      minimumOrder: {
        quantity: 50,
        unit: 'units',
        currency: 'TZS'
      },
      pricingTiers: [
        {
          quantityRange: '1-50',
          discountPercentage: 0,
          unitPrice: 100000
        },
        {
          quantityRange: '51-100',
          discountPercentage: 5,
          unitPrice: 95000
        },
        {
          quantityRange: '100+',
          discountPercentage: 10,
          unitPrice: 90000
        }
      ],
      bulkDiscounts: [
        {
          threshold: 500,
          discountPercentage: 15
        },
        {
          threshold: 1000,
          discountPercentage: 20
        }
      ],
      landedCostFactors: {
        shipping: 5,
        customs: 10,
        handling: 2,
        insurance: 1
      },
      paymentTerms: {
        netDays: 30,
        earlyPaymentDiscount: {
          percentage: 2,
          days: 10
        }
      }
    },
    
    delivery: {
      leadTime: {
        standard: 7,
        express: 3,
        rush: 1
      },
      deliveryMethods: [
        {
          method: 'Delivery',
          cost: 15000,
          coverage: ['Dar es Salaam', 'Arusha', 'Mwanza']
        },
        {
          method: 'Pickup',
          cost: 0,
          coverage: ['Dar es Salaam']
        }
      ],
      deliveryTerms: 'FOB',
      packagingOptions: ['Standard', 'Premium', 'Custom']
    },
    
    performance: {
      onTimeDelivery: 95,
      qualityScore: 92,
      orderAccuracy: 98,
      responseTime: 2,
      totalOrders: 245,
      successfulOrders: 238,
      averageOrderValue: 2500000,
      lastOrderDate: '2024-01-15',
      totalSpent: 612500000, // Total amount spent with this supplier
      averageOrderSize: 75,
      defectRate: 1.2,
      returnRate: 0.8
    },
    
    rating: {
      overall: 4.8,
      quality: 4.9,
      delivery: 4.7,
      communication: 4.8,
      pricing: 4.6,
      totalReviews: 156,
      lastUpdated: '2024-01-10'
    },
    
    status: 'active',
    verificationStatus: 'verified',
    verificationDate: '2023-06-15',
    documents: [],
    establishedYear: 2018,
    employeeCount: '51-200',
    annualRevenue: '10M-50M',
    createdAt: '2023-01-15',
    updatedAt: '2024-01-15',
    lastContactDate: '2024-01-10'
  },
  
  {
    id: 'supplier-2',
    name: 'OfficePro',
    legalName: 'OfficePro Tanzania Limited',
    registrationNumber: 'REG-002-2022',
    taxId: 'TAX-OP-002',
    website: 'https://officepro.co.tz',
    
    location: {
      id: 'loc-2',
      city: 'Arusha',
      region: 'Arusha',
      country: 'Tanzania',
      address: 'Njiro Industrial Area, Arusha',
      coordinates: {
        lat: -3.3869,
        lng: 36.6830
      }
    },
    
    contact: {
      primaryContact: {
        name: 'Michael Ndege',
        title: 'General Manager',
        phone: '+255 222 333 444',
        email: 'michael@officepro.co.tz'
      },
      businessHours: {
        monday: '8:00 AM - 5:00 PM',
        tuesday: '8:00 AM - 5:00 PM',
        wednesday: '8:00 AM - 5:00 PM',
        thursday: '8:00 AM - 5:00 PM',
        friday: '8:00 AM - 4:00 PM'
      }
    },
    
    capabilities: {
      categories: ['Furniture', 'Office Supplies'],
      certifications: ['ISO 9001:2015'],
      specialties: ['Custom Furniture', 'Office Design'],
      languages: ['English', 'Swahili'],
      paymentMethods: ['Bank Transfer', 'Mobile Money']
    },
    
    pricing: {
      minimumOrder: {
        quantity: 20,
        unit: 'units',
        currency: 'TZS'
      },
      pricingTiers: [
        {
          quantityRange: '1-20',
          discountPercentage: 0,
          unitPrice: 200000
        },
        {
          quantityRange: '21-50',
          discountPercentage: 8,
          unitPrice: 184000
        },
        {
          quantityRange: '50+',
          discountPercentage: 15,
          unitPrice: 170000
        }
      ],
      bulkDiscounts: [
        {
          threshold: 100,
          discountPercentage: 20
        }
      ],
      landedCostFactors: {
        shipping: 8,
        customs: 12,
        handling: 3,
        insurance: 2
      }
    },
    
    delivery: {
      leadTime: {
        standard: 14,
        express: 7
      },
      deliveryMethods: [
        {
          method: 'Delivery',
          cost: 25000,
          coverage: ['Arusha', 'Dar es Salaam', 'Mwanza']
        },
        {
          method: 'Pickup',
          cost: 0,
          coverage: ['Arusha']
        }
      ],
      deliveryTerms: 'CIF',
      packagingOptions: ['Standard', 'Premium']
    },
    
    performance: {
      onTimeDelivery: 88,
      qualityScore: 89,
      orderAccuracy: 94,
      responseTime: 4,
      totalOrders: 89,
      successfulOrders: 82,
      averageOrderValue: 1800000,
      lastOrderDate: '2024-01-12',
      totalSpent: 160200000,
      averageOrderSize: 45,
      defectRate: 2.1,
      returnRate: 1.5
    },
    
    rating: {
      overall: 4.6,
      quality: 4.7,
      delivery: 4.5,
      communication: 4.6,
      pricing: 4.5,
      totalReviews: 67,
      lastUpdated: '2024-01-08'
    },
    
    status: 'active',
    verificationStatus: 'verified',
    verificationDate: '2022-12-10',
    documents: [],
    establishedYear: 2020,
    employeeCount: '11-50',
    annualRevenue: '1M-10M',
    createdAt: '2022-03-10',
    updatedAt: '2024-01-12',
    lastContactDate: '2024-01-08'
  },
  
  {
    id: 'supplier-3',
    name: 'SoundMax',
    legalName: 'SoundMax Electronics Limited',
    registrationNumber: 'REG-003-2021',
    taxId: 'TAX-SM-003',
    website: 'https://soundmax.co.tz',
    
    location: {
      id: 'loc-3',
      city: 'Mwanza',
      region: 'Mwanza',
      country: 'Tanzania',
      address: 'Nyamagana Industrial Zone, Mwanza',
      coordinates: {
        lat: -2.5164,
        lng: 32.9178
      }
    },
    
    contact: {
      primaryContact: {
        name: 'Grace Mwamba',
        title: 'Sales Director',
        phone: '+255 333 444 555',
        email: 'grace@soundmax.co.tz'
      },
      businessHours: {
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 6:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: '8:00 AM - 5:00 PM',
        saturday: '9:00 AM - 3:00 PM'
      }
    },
    
    capabilities: {
      categories: ['Electronics', 'Audio Equipment'],
      certifications: ['ISO 9001:2015', 'CE Marking'],
      specialties: ['Audio Systems', 'Custom Electronics', 'Installation Services'],
      languages: ['English', 'Swahili'],
      paymentMethods: ['Bank Transfer', 'Mobile Money', 'Cash']
    },
    
    pricing: {
      minimumOrder: {
        quantity: 100,
        unit: 'units',
        currency: 'TZS'
      },
      pricingTiers: [
        {
          quantityRange: '1-100',
          discountPercentage: 0,
          unitPrice: 75000
        },
        {
          quantityRange: '101-500',
          discountPercentage: 10,
          unitPrice: 67500
        },
        {
          quantityRange: '500+',
          discountPercentage: 18,
          unitPrice: 61500
        }
      ],
      bulkDiscounts: [
        {
          threshold: 1000,
          discountPercentage: 25
        }
      ],
      landedCostFactors: {
        shipping: 6,
        customs: 8,
        handling: 2,
        insurance: 1
      }
    },
    
    delivery: {
      leadTime: {
        standard: 5,
        express: 2,
        rush: 1
      },
      deliveryMethods: [
        {
          method: 'Delivery',
          cost: 20000,
          coverage: ['Mwanza', 'Dar es Salaam', 'Arusha', 'Dodoma']
        },
        {
          method: 'Pickup',
          cost: 0,
          coverage: ['Mwanza']
        }
      ],
      deliveryTerms: 'FOB',
      packagingOptions: ['Standard', 'Premium', 'Custom']
    },
    
    performance: {
      onTimeDelivery: 97,
      qualityScore: 95,
      orderAccuracy: 99,
      responseTime: 1,
      totalOrders: 312,
      successfulOrders: 308,
      averageOrderValue: 3200000,
      lastOrderDate: '2024-01-14',
      totalSpent: 998400000,
      averageOrderSize: 120,
      defectRate: 0.5,
      returnRate: 0.3
    },
    
    rating: {
      overall: 4.9,
      quality: 4.9,
      delivery: 4.8,
      communication: 4.9,
      pricing: 4.8,
      totalReviews: 203,
      lastUpdated: '2024-01-12'
    },
    
    status: 'active',
    verificationStatus: 'verified',
    verificationDate: '2021-11-20',
    documents: [],
    establishedYear: 2019,
    employeeCount: '51-200',
    annualRevenue: '10M-50M',
    createdAt: '2021-05-15',
    updatedAt: '2024-01-14',
    lastContactDate: '2024-01-12'
  },
  
  {
    id: 'supplier-4',
    name: 'ComfortZone',
    legalName: 'ComfortZone Furniture Limited',
    registrationNumber: 'REG-004-2020',
    taxId: 'TAX-CZ-004',
    website: 'https://comfortzone.co.tz',
    
    location: {
      id: 'loc-4',
      city: 'Dodoma',
      region: 'Dodoma',
      country: 'Tanzania',
      address: 'Dodoma Industrial Area, Dodoma',
      coordinates: {
        lat: -6.1630,
        lng: 35.7516
      }
    },
    
    contact: {
      primaryContact: {
        name: 'David Mwalimu',
        title: 'Operations Manager',
        phone: '+255 444 555 666',
        email: 'david@comfortzone.co.tz'
      },
      businessHours: {
        monday: '8:00 AM - 5:00 PM',
        tuesday: '8:00 AM - 5:00 PM',
        wednesday: '8:00 AM - 5:00 PM',
        thursday: '8:00 AM - 5:00 PM',
        friday: '8:00 AM - 4:00 PM'
      }
    },
    
    capabilities: {
      categories: ['Furniture', 'Home Decor'],
      certifications: ['ISO 9001:2015'],
      specialties: ['Custom Furniture', 'Interior Design'],
      languages: ['English', 'Swahili'],
      paymentMethods: ['Bank Transfer', 'Mobile Money']
    },
    
    pricing: {
      minimumOrder: {
        quantity: 15,
        unit: 'units',
        currency: 'TZS'
      },
      pricingTiers: [
        {
          quantityRange: '1-15',
          discountPercentage: 0,
          unitPrice: 180000
        },
        {
          quantityRange: '16-30',
          discountPercentage: 5,
          unitPrice: 171000
        },
        {
          quantityRange: '30+',
          discountPercentage: 12,
          unitPrice: 158400
        }
      ],
      bulkDiscounts: [
        {
          threshold: 50,
          discountPercentage: 18
        }
      ],
      landedCostFactors: {
        shipping: 10,
        customs: 15,
        handling: 4,
        insurance: 2
      }
    },
    
    delivery: {
      leadTime: {
        standard: 21,
        express: 10
      },
      deliveryMethods: [
        {
          method: 'Delivery',
          cost: 30000,
          coverage: ['Dodoma', 'Dar es Salaam', 'Arusha']
        },
        {
          method: 'Pickup',
          cost: 0,
          coverage: ['Dodoma']
        }
      ],
      deliveryTerms: 'CIF',
      packagingOptions: ['Standard', 'Premium']
    },
    
    performance: {
      onTimeDelivery: 82,
      qualityScore: 87,
      orderAccuracy: 91,
      responseTime: 6,
      totalOrders: 67,
      successfulOrders: 61,
      averageOrderValue: 1500000,
      lastOrderDate: '2024-01-08',
      totalSpent: 100500000,
      averageOrderSize: 25,
      defectRate: 3.2,
      returnRate: 2.8
    },
    
    rating: {
      overall: 4.7,
      quality: 4.8,
      delivery: 4.5,
      communication: 4.7,
      pricing: 4.6,
      totalReviews: 45,
      lastUpdated: '2024-01-05'
    },
    
    status: 'active',
    verificationStatus: 'verified',
    verificationDate: '2020-08-15',
    documents: [],
    establishedYear: 2017,
    employeeCount: '11-50',
    annualRevenue: '1M-10M',
    createdAt: '2020-02-20',
    updatedAt: '2024-01-08',
    lastContactDate: '2024-01-05'
  }
];

export const supplierStats = {
  totalSuppliers: 4,
  activeSuppliers: 4,
  verifiedSuppliers: 4,
  averageRating: 4.75,
  topCategories: [
    { category: 'Electronics', count: 2 },
    { category: 'Furniture', count: 2 },
    { category: 'Office Supplies', count: 1 }
  ],
  topLocations: [
    { location: 'Dar es Salaam', count: 1 },
    { location: 'Arusha', count: 1 },
    { location: 'Mwanza', count: 1 },
    { location: 'Dodoma', count: 1 }
  ]
};
