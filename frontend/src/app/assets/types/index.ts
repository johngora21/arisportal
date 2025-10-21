export interface Property {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'mixed-use';
  address: string;
  city: string;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  monthlyRent: number;
  status: 'active' | 'maintenance' | 'inactive';
  amenities: string[];
  photos: string[];
  createdAt: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  type: string;
  size: number;
  monthlyRent: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  amenities: string[];
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  propertyId: string;
  unitId: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  deposit: number;
  status: 'active' | 'inactive';
  contractFile?: File | null;
  idFile?: File | null;
  emergencyContact?: string;
  emergencyPhone?: string;
  automaticRenewal?: boolean;
  sendReminders?: boolean;
  smartContract?: boolean;
}

export interface Payment {
  id: string;
  tenantId: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
}

export interface AssetStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  totalTenants: number;
  activeLeases: number;
  monthlyRevenue: number;
  overduePayments: number;
  occupancyRate: number;
  averageRent: number;
}
