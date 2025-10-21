import { Property, InvestmentProject, UserProperty } from '../models';

// Mock data for Land Properties
export const landProperties: Property[] = [
  {
    id: 'land-1',
    title: 'Prime Commercial Plot - Kinondoni',
    type: 'land',
    location: 'Kinondoni, Dar es Salaam',
    price: 250000000,
    size: '2,500 sqm',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
    description: 'Prime commercial plot in Kinondoni with excellent road access and utilities nearby. Perfect for commercial development.',
    seller: {
      name: 'John Mwalimu',
      phone: '+255 754 123 456',
      email: 'john.mwalimu@email.com',
      role: 'Property Owner'
    },
    listedDate: '2024-01-15',
    status: 'available',
    verificationStatus: 'verified',
    features: ['Road Access', 'Utilities Nearby', 'Commercial Zone'],
    amenities: ['Water', 'Electricity', 'Security'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
    ],
    documents: {
      titleDeed: true,
      survey: true,
      permits: true
    },
    coordinates: {
      lat: -6.7924,
      lng: 39.2083
    }
  },
  {
    id: 'land-2',
    title: 'Residential Plot - Masaki',
    type: 'land',
    location: 'Masaki, Dar es Salaam',
    price: 180000000,
    size: '1,200 sqm',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    description: 'Beautiful residential plot in Masaki with ocean views. Ideal for luxury home construction.',
    seller: {
      name: 'Sarah Kimaro',
      phone: '+255 755 987 654',
      email: 'sarah.kimaro@email.com',
      role: 'Real Estate Agent'
    },
    listedDate: '2024-01-20',
    status: 'available',
    verificationStatus: 'verified',
    features: ['Ocean Views', 'Quiet Neighborhood', 'Luxury Area'],
    amenities: ['Water', 'Electricity', 'Security', 'Gated Community'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'
    ],
    documents: {
      titleDeed: true,
      survey: true,
      permits: false
    },
    coordinates: {
      lat: -6.7789,
      lng: 39.2567
    }
  },
  {
    id: 'land-3',
    title: 'Industrial Land - Kigamboni',
    type: 'land',
    location: 'Kigamboni, Dar es Salaam',
    price: 320000000,
    size: '5,000 sqm',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400',
    description: 'Large industrial plot in Kigamboni with excellent port access. Perfect for manufacturing or warehousing.',
    seller: {
      name: 'Ahmed Hassan',
      phone: '+255 756 456 789',
      email: 'ahmed.hassan@email.com',
      role: 'Property Developer'
    },
    listedDate: '2024-01-25',
    status: 'available',
    verificationStatus: 'verified',
    features: ['Port Access', 'Industrial Zone', 'Heavy Duty Access'],
    amenities: ['Water', 'Electricity', 'Rail Access'],
    images: [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'
    ],
    documents: {
      titleDeed: true,
      survey: true,
      permits: true
    },
    coordinates: {
      lat: -6.8234,
      lng: 39.3456
    }
  }
];

// Mock data for Building Properties
export const buildingProperties: Property[] = [
  {
    id: 'building-1',
    title: 'Modern Office Complex - CBD',
    type: 'commercial',
    location: 'CBD, Dar es Salaam',
    price: 450000000,
    size: '3,200 sqm',
    bedrooms: 0,
    bathrooms: 8,
    kitchen: 2,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    description: 'Modern 8-story office complex in the heart of CBD with premium finishes and modern amenities.',
    seller: {
      name: 'David Mwamba',
      phone: '+255 754 111 222',
      email: 'david.mwamba@email.com',
      role: 'Property Developer'
    },
    listedDate: '2024-01-10',
    status: 'available',
    verificationStatus: 'verified',
    features: ['Modern Design', 'Premium Location', 'High-Speed Elevators'],
    amenities: ['Parking', 'Security', 'Air Conditioning', 'Generator'],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
    ],
    documents: {
      titleDeed: true,
      survey: true,
      permits: true
    },
    coordinates: {
      lat: -6.7924,
      lng: 39.2083
    }
  },
  {
    id: 'building-2',
    title: 'Luxury Apartment Building - Masaki',
    type: 'apartment',
    location: 'Masaki, Dar es Salaam',
    price: 380000000,
    size: '2,800 sqm',
    bedrooms: 24,
    bathrooms: 24,
    kitchen: 24,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    description: 'Luxury 6-story apartment building with ocean views and premium amenities in Masaki.',
    seller: {
      name: 'Grace Mwangi',
      phone: '+255 755 333 444',
      email: 'grace.mwangi@email.com',
      role: 'Real Estate Agent'
    },
    listedDate: '2024-01-18',
    status: 'available',
    verificationStatus: 'verified',
    features: ['Ocean Views', 'Luxury Finishes', 'Modern Design'],
    amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Generator'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
    ],
    documents: {
      titleDeed: true,
      survey: true,
      permits: true
    },
    coordinates: {
      lat: -6.7789,
      lng: 39.2567
    }
  },
  {
    id: 'building-3',
    title: 'Mixed-Use Development - Kinondoni',
    type: 'commercial',
    location: 'Kinondoni, Dar es Salaam',
    price: 520000000,
    size: '4,500 sqm',
    bedrooms: 12,
    bathrooms: 16,
    kitchen: 8,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    description: 'Mixed-use development with retail spaces, offices, and residential units in prime Kinondoni location.',
    seller: {
      name: 'Michael Kilonzo',
      phone: '+255 756 555 666',
      email: 'michael.kilonzo@email.com',
      role: 'Property Developer'
    },
    listedDate: '2024-01-22',
    status: 'available',
    verificationStatus: 'verified',
    features: ['Mixed Use', 'Prime Location', 'Modern Design'],
    amenities: ['Parking', 'Security', 'Retail Spaces', 'Office Spaces'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
    ],
    documents: {
      titleDeed: true,
      survey: true,
      permits: true
    },
    coordinates: {
      lat: -6.7924,
      lng: 39.2083
    }
  },
  {
    id: 'building-4',
    title: 'Warehouse Complex - Kigamboni',
    type: 'commercial',
    location: 'Kigamboni, Dar es Salaam',
    price: 280000000,
    size: '6,000 sqm',
    bedrooms: 0,
    bathrooms: 4,
    kitchen: 1,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
    description: 'Large warehouse complex with loading docks and office spaces. Perfect for logistics and distribution.',
    seller: {
      name: 'Fatma Ali',
      phone: '+255 757 777 888',
      email: 'fatma.ali@email.com',
      role: 'Property Owner'
    },
    listedDate: '2024-01-28',
    status: 'available',
    verificationStatus: 'verified',
    features: ['Loading Docks', 'High Ceilings', 'Industrial Grade'],
    amenities: ['Parking', 'Security', 'Office Spaces', 'Generator'],
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
    ],
    documents: {
      titleDeed: true,
      survey: true,
      permits: true
    },
    coordinates: {
      lat: -6.8234,
      lng: 39.3456
    }
  }
];

// Mock data for User Properties (My Properties)
export const userProperties: Property[] = [
  {
    id: 'user-property-1',
    title: 'My Residential Plot - Mikocheni',
    type: 'land',
    location: 'Mikocheni, Dar es Salaam',
    price: 150000000,
    size: '1,000 sqm',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
    description: 'My residential plot in Mikocheni with good road access and utilities.',
    seller: {
      name: 'Current User',
      phone: '+255 754 000 000',
      email: 'user@email.com',
      role: 'Property Owner'
    },
    listedDate: '2024-01-01',
    status: 'available',
    verificationStatus: 'verified',
    features: ['Road Access', 'Utilities', 'Residential Zone'],
    amenities: ['Water', 'Electricity'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'
    ],
    documents: {
      titleDeed: true,
      survey: true,
      permits: false
    },
    coordinates: {
      lat: -6.7654,
      lng: 39.2345
    }
  },
  {
    id: 'user-property-2',
    title: 'My Commercial Building - CBD',
    type: 'commercial',
    location: 'CBD, Dar es Salaam',
    price: 400000000,
    size: '2,500 sqm',
    bedrooms: 0,
    bathrooms: 6,
    kitchen: 1,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    description: 'My commercial building in CBD with office spaces and retail units.',
    seller: {
      name: 'Current User',
      phone: '+255 754 000 000',
      email: 'user@email.com',
      role: 'Property Owner'
    },
    listedDate: '2024-01-05',
    status: 'available',
    verificationStatus: 'verified',
    features: ['Prime Location', 'Office Spaces', 'Retail Units'],
    amenities: ['Parking', 'Security', 'Generator'],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
    ],
    documents: {
      titleDeed: true,
      survey: true,
      permits: true
    },
    coordinates: {
      lat: -6.7924,
      lng: 39.2083
    }
  }
];
