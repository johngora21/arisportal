'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  Key, 
  DollarSign, 
  Shield, 
  TrendingUp,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Building,
  Calendar,
  FileText,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  LayoutDashboard,
  X,
  Save,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import PropertiesTab from './components/PropertiesTab';
import TenantRecordsTab from './components/TenantRecordsTab';
import LeaseManagementTab from './components/LeaseManagementTab';
import PaymentTrackingTab from './components/PaymentTrackingTab';
import ReportsTab from './components/ReportsTab';

// Mock data types
interface Property {
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

interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  type: string;
  size: number;
  monthlyRent: number;
  status: 'vacant' | 'occupied' | 'reserved' | 'maintenance';
  tenantId?: string;
  tenantName?: string;
}

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  unitId: string;
  propertyId: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  deposit: number;
  status: 'active' | 'expired' | 'terminated';
  contractFile?: File | null;
  idFile?: File | null;
  emergencyContact?: string;
  emergencyPhone?: string;
}

interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  unitId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  method: 'cash' | 'bank' | 'mobile';
}

interface AssetStats {
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

export default function AssetsPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal state
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

  // Mock data
  const mockProperties: Property[] = [
    {
      id: '1',
      name: 'Sunrise Apartments',
      type: 'residential',
      address: '123 Sunrise Street',
      city: 'Dar es Salaam',
      totalUnits: 12,
      occupiedUnits: 10,
      vacantUnits: 2,
      monthlyRent: 4500000,
      status: 'active',
      amenities: ['Parking', 'Security', 'Garden'],
      photos: [],
      createdAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'Business Plaza',
      type: 'commercial',
      address: '456 Business Avenue',
      city: 'Arusha',
      totalUnits: 8,
      occupiedUnits: 6,
      vacantUnits: 2,
      monthlyRent: 3200000,
      status: 'active',
      amenities: ['Parking', 'Elevator', 'Security'],
      photos: [],
      createdAt: '2023-03-20'
    },
    {
      id: '3',
      name: 'Mixed Complex',
      type: 'mixed-use',
      address: '789 Mixed Road',
      city: 'Mwanza',
      totalUnits: 15,
      occupiedUnits: 12,
      vacantUnits: 3,
      monthlyRent: 2800000,
      status: 'maintenance',
      amenities: ['Parking', 'Shop Space'],
      photos: [],
      createdAt: '2023-06-10'
    }
  ];

  const mockUnits: Unit[] = [
    { id: '1', propertyId: '1', unitNumber: 'A1', type: '2BR', size: 80, monthlyRent: 350000, status: 'occupied', tenantId: 'T1', tenantName: 'John Mwalimu' },
    { id: '2', propertyId: '1', unitNumber: 'A2', type: '1BR', size: 60, monthlyRent: 280000, status: 'occupied', tenantId: 'T2', tenantName: 'Sarah Kimaro' },
    { id: '3', propertyId: '1', unitNumber: 'A3', type: '2BR', size: 80, monthlyRent: 350000, status: 'vacant' },
    { id: '4', propertyId: '2', unitNumber: 'B1', type: 'Office', size: 120, monthlyRent: 450000, status: 'occupied', tenantId: 'T3', tenantName: 'Tech Solutions Ltd' },
    { id: '5', propertyId: '2', unitNumber: 'B2', type: 'Shop', size: 50, monthlyRent: 200000, status: 'vacant' }
  ];

  const mockTenants: Tenant[] = [
    {
      id: 'T1',
      name: 'John Mwalimu',
      email: 'john@email.com',
      phone: '+255 123 456 789',
      idNumber: '123456789',
      unitId: '1',
      propertyId: '1',
      leaseStart: '2023-01-01',
      leaseEnd: '2024-12-31',
      monthlyRent: 350000,
      deposit: 700000,
      status: 'active',
      contractFile: new File(['contract content'], 'lease_contract_john.pdf', { type: 'application/pdf' }),
      idFile: new File(['id content'], 'john_id.pdf', { type: 'application/pdf' }),
      emergencyContact: 'Jane Mwalimu',
      emergencyPhone: '+255 987 654 321'
    },
    {
      id: 'T2',
      name: 'Sarah Kimaro',
      email: 'sarah@email.com',
      phone: '+255 987 654 321',
      idNumber: '987654321',
      unitId: '2',
      propertyId: '1',
      leaseStart: '2023-03-15',
      leaseEnd: '2024-03-14',
      monthlyRent: 280000,
      deposit: 560000,
      status: 'active',
      contractFile: new File(['contract content'], 'lease_contract_sarah.pdf', { type: 'application/pdf' }),
      idFile: null, // No ID uploaded
      emergencyContact: 'Michael Kimaro',
      emergencyPhone: '+255 111 222 333'
    }
  ];

  const mockPayments: Payment[] = [
    {
      id: 'P1',
      tenantId: 'T1',
      tenantName: 'John Mwalimu',
      unitId: '1',
      amount: 350000,
      dueDate: '2024-01-01',
      paidDate: '2024-01-02',
      status: 'paid',
      method: 'bank'
    },
    {
      id: 'P2',
      tenantId: 'T2',
      tenantName: 'Sarah Kimaro',
      unitId: '2',
      amount: 280000,
      dueDate: '2024-01-01',
      status: 'overdue',
      method: 'cash'
    }
  ];

  // State
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [stats, setStats] = useState<AssetStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activePropertyTab, setActivePropertyTab] = useState('overview');
  const [propertyUnits, setPropertyUnits] = useState<Unit[]>([]);
  const [newUnit, setNewUnit] = useState({
    unitNumber: '',
    type: '',
    size: '',
    monthlyRent: '',
    amenities: [] as string[]
  });
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  
  // Add Tenant modal state
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [isEditingTenant, setIsEditingTenant] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    propertyId: '',
    unitId: '',
    leaseStart: '',
    leasePeriod: '',
    leaseEnd: '',
    monthlyRent: '',
    deposit: '',
    emergencyContact: '',
    emergencyPhone: '',
    contractFile: null as File | null,
    idFile: null as File | null,
    automaticRenewal: false,
    sendReminders: false,
    smartContract: false
  });

  // View Tenant modal state
  const [showViewTenantModal, setShowViewTenantModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Message Tenant modal state
  const [showMessageTenantModal, setShowMessageTenantModal] = useState(false);
  const [messageTenant, setMessageTenant] = useState<Tenant | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');

  // Get unit types based on property type
  const getUnitTypes = (propertyType: string) => {
    switch (propertyType) {
      case 'residential':
        return [
          { value: '1BR', label: '1 Bedroom' },
          { value: '2BR', label: '2 Bedrooms' },
          { value: '3BR', label: '3 Bedrooms' },
          { value: 'Studio', label: 'Studio' }
        ];
      case 'commercial':
        return [
          { value: 'Office', label: 'Office' },
          { value: 'Shop', label: 'Shop' },
          { value: 'Warehouse', label: 'Warehouse' },
          { value: 'Retail', label: 'Retail Space' }
        ];
      case 'mixed-use':
        return [
          { value: '1BR', label: '1 Bedroom' },
          { value: '2BR', label: '2 Bedrooms' },
          { value: '3BR', label: '3 Bedrooms' },
          { value: 'Office', label: 'Office' },
          { value: 'Shop', label: 'Shop' },
          { value: 'Studio', label: 'Studio' }
        ];
      default:
        return [
          { value: '1BR', label: '1 Bedroom' },
          { value: '2BR', label: '2 Bedrooms' },
          { value: '3BR', label: '3 Bedrooms' },
          { value: 'Office', label: 'Office' },
          { value: 'Shop', label: 'Shop' },
          { value: 'Studio', label: 'Studio' }
        ];
    }
  };

  // Property modal tabs
  const propertyTabs = [
    { id: 'overview', label: 'Overview', icon: <Home size={16} /> },
    { id: 'units', label: 'Units', icon: <Building size={16} /> },
    { id: 'tenants', label: 'Tenants', icon: <Users size={16} /> },
    { id: 'payments', label: 'Payments', icon: <DollarSign size={16} /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Shield size={16} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> }
  ];

  // Calculate stats
  useEffect(() => {
    const totalProperties = properties.length;
    const totalUnits = units.length;
    const occupiedUnits = units.filter(unit => unit.status === 'occupied').length;
    const vacantUnits = units.filter(unit => unit.status === 'vacant').length;
    const totalTenants = tenants.length;
    const activeLeases = tenants.filter(tenant => tenant.status === 'active').length;
    const monthlyRevenue = tenants.reduce((sum, tenant) => sum + tenant.monthlyRent, 0);
    const overduePayments = payments.filter(payment => payment.status === 'overdue').length;
    const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
    const averageRent = tenants.length > 0 ? monthlyRevenue / tenants.length : 0;

    setStats({
      totalProperties,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      totalTenants,
      activeLeases,
      monthlyRevenue,
      overduePayments,
      occupancyRate,
      averageRent
    });
  }, [properties, units, tenants, payments]);

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'maintenance': return '#f59e0b';
      case 'inactive': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'maintenance': return <AlertTriangle size={16} />;
      case 'inactive': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'residential': return <Home size={20} />;
      case 'commercial': return <Building size={20} />;
      case 'mixed-use': return <Building size={20} />;
      default: return <Home size={20} />;
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Tenant & Estate Management
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage properties, tenants, leases, and rental payments
            </p>
          </div>
        </div>

        {/* Stats Cards - Always Visible */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Home size={20} color="var(--mc-sidebar-bg)" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Properties</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.totalProperties}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Building size={20} color="#8b5cf6" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Units</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.totalUnits}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Users size={20} color="#10b981" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Occupied</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.occupiedUnits}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <DollarSign size={20} color="#f59e0b" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Monthly Revenue</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                TZS {stats.monthlyRevenue.toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <BarChart3 size={20} color="#3b82f6" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Occupancy Rate</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.occupancyRate.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Horizontal Tabs */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            {[
              { id: 'properties', label: 'Properties', icon: <Home size={16} /> },
              { id: 'tenants', label: 'Tenant Records', icon: <Users size={16} /> },
              { id: 'leases', label: 'Lease Management', icon: <Key size={16} /> },
              { id: 'payments', label: 'Payment Tracking', icon: <DollarSign size={16} /> },
              { id: 'reports', label: 'Reports', icon: <TrendingUp size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '16px 12px',
                  backgroundColor: activeTab === tab.id ? 'var(--mc-sidebar-bg)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: activeTab === tab.id ? '12px 12px 0 0' : '0',
                  transition: 'all 0.2s ease',
                  borderBottom: activeTab === tab.id ? '2px solid var(--mc-sidebar-bg)' : '2px solid transparent',
                  flex: 1,
                  minWidth: 0
                }}
              >
                {tab.icon}
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <PropertiesTab
            properties={properties}
            filteredProperties={filteredProperties}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            setShowAddPropertyModal={setShowAddPropertyModal}
            setSelectedProperty={setSelectedProperty}
            getTypeIcon={getTypeIcon}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        )}

        {/* Tenant Records Tab */}
        {activeTab === 'tenants' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Tenant Records
              </h3>
              <button
                onClick={() => setShowAddTenantModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                Add Tenant
              </button>
            </div>
            
            {/* Tenants Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Tenant</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Property</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Unit</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Lease Period</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Monthly Rent</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Due Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTenants.map((tenant) => (
                    <tr key={tenant.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                            {tenant.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {tenant.email}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                        {properties.find(p => p.id === tenant.propertyId)?.name}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                        {units.find(u => u.id === tenant.unitId)?.unitNumber}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                        {(() => {
                          const startDate = new Date(tenant.leaseStart);
                          const endDate = new Date(tenant.leaseEnd);
                          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                          const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
                          return `${diffMonths} months`;
                        })()}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                        TZS {tenant.monthlyRent.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                        {(() => {
                          const today = new Date();
                          const currentMonth = today.getMonth();
                          const currentYear = today.getFullYear();
                          const nextMonth = new Date(currentYear, currentMonth + 1, 1);
                          return nextMonth.toLocaleDateString();
                        })()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: tenant.status === 'active' ? '#10b98115' : '#6b728015',
                          color: tenant.status === 'active' ? '#10b981' : '#6b7280',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {tenant.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => {
                              setSelectedTenant(tenant);
                              setShowViewTenantModal(true);
                            }}
                            style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              setMessageTenant(tenant);
                              setShowMessageTenantModal(true);
                            }}
                            style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                          >
                            <MessageCircle size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              // Pre-fill the form with tenant data for editing
                              setNewTenant({
                                name: tenant.name,
                                email: tenant.email,
                                phone: tenant.phone,
                                idNumber: tenant.idNumber,
                                propertyId: tenant.propertyId,
                                unitId: tenant.unitId,
                                leaseStart: tenant.leaseStart,
                                leasePeriod: '', // Will need to calculate from dates
                                leaseEnd: tenant.leaseEnd,
                                monthlyRent: tenant.monthlyRent.toString(),
                                deposit: tenant.deposit.toString(),
                                emergencyContact: '',
                                emergencyPhone: '',
                                contractFile: tenant.contractFile || null,
                                idFile: tenant.idFile || null,
                                automaticRenewal: false,
                                sendReminders: false,
                                smartContract: false
                              });
                              setShowAddTenantModal(true);
                            }}
                            style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lease Management Tab */}
        {activeTab === 'leases' && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Lease Management
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
                Smart contract templates and lease automation
              </p>
            </div>
            
            {/* Smart Contract Templates */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Smart Contract Templates
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Residential Lease Template */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px'
                    }}>
                      🏠
                    </div>
                    <div>
                      <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        Residential Lease
                      </h5>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        Standard residential rental agreement
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Features:</div>
                    <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                      • Automatic rent collection<br/>
                      • Late fee enforcement<br/>
                      • Maintenance request handling<br/>
                      • Lease renewal automation
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      flex: 1,
                      padding: '10px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      Deploy Template
                    </button>
                    <button style={{
                      padding: '10px 16px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      color: '#374151'
                    }}>
                      Preview
                    </button>
                  </div>
                </div>

                {/* Commercial Lease Template */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px'
                    }}>
                      🏢
                    </div>
                    <div>
                      <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        Commercial Lease
                      </h5>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        Business rental agreement
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Features:</div>
                    <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                      • Escalation clauses<br/>
                      • CAM charges automation<br/>
                      • Compliance monitoring<br/>
                      • Business hour restrictions
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      flex: 1,
                      padding: '10px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      Deploy Template
                    </button>
                    <button style={{
                      padding: '10px 16px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      color: '#374151'
                    }}>
                      Preview
                    </button>
                  </div>
                </div>

                {/* Short-term Lease Template */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px'
                    }}>
                      ⏰
                    </div>
                    <div>
                      <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        Short-term Lease
                      </h5>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        Flexible rental periods
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Features:</div>
                    <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                      • Flexible payment terms<br/>
                      • Auto-termination<br/>
                      • Security deposit handling<br/>
                      • Guest policy enforcement
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      flex: 1,
                      padding: '10px 16px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      Deploy Template
                    </button>
                    <button style={{
                      padding: '10px 16px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      color: '#374151'
                    }}>
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Smart Contracts */}
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Active Smart Contracts
              </h4>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Deployed Contracts
                    </h5>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                      Currently active smart contracts managing leases
                    </p>
                  </div>
                  <button style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    View All
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  {mockTenants.slice(0, 3).map((tenant) => (
                    <div key={tenant.id} style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981'
                        }} />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                          {tenant.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                        {properties.find(p => p.id === tenant.propertyId)?.name} • Unit {units.find(u => u.id === tenant.unitId)?.unitNumber}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Contract ID: SC-{tenant.id.toString().padStart(4, '0')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Payment Tracking Tab */}
        {activeTab === 'payments' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Payment Tracking
              </h3>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                Record Payment
              </button>
            </div>
            
            {/* Payments Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Tenant</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Due Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Paid Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Method</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPayments.map((payment) => (
                    <tr key={payment.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                        {payment.tenantName}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                        TZS {payment.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                        {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>
                        {payment.method}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: payment.status === 'paid' ? '#10b98115' : payment.status === 'overdue' ? '#ef444415' : '#f59e0b15',
                          color: payment.status === 'paid' ? '#10b981' : payment.status === 'overdue' ? '#ef4444' : '#f59e0b',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Reports & Analytics
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
                Detailed reports and analytics for property management
              </p>
            </div>

            {/* Report Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Report Type
                </label>
                <select style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  minWidth: '150px'
                }}>
                  <option>Financial Reports</option>
                  <option>Occupancy Reports</option>
                  <option>Tenant Reports</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Period
                </label>
                <select style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  minWidth: '120px'
                }}>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Property
                </label>
                <select style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  minWidth: '150px'
                }}>
                  <option>All Properties</option>
                  <option>Sunrise Apartments</option>
                  <option>Downtown Plaza</option>
                  <option>Garden Villas</option>
                </select>
              </div>
            </div>

            {/* Financial Performance Chart */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '24px', 
              marginBottom: '24px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Revenue Trend (Last 6 Months)
                </h4>
              </div>
              
              {/* Mock Chart */}
              <div style={{ 
                height: '300px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e2e8f0',
                position: 'relative'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Revenue Chart
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Interactive chart showing monthly revenue trends
                  </div>
                </div>
                
                {/* Mock Chart Bars */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '20px', 
                  left: '20px', 
                  right: '20px',
                  display: 'flex',
                  alignItems: 'end',
                  gap: '8px',
                  height: '200px'
                }}>
                  {[120, 135, 110, 145, 160, 175].map((height, index) => (
                    <div key={index} style={{
                      flex: 1,
                      backgroundColor: '#3b82f6',
                      height: `${height}px`,
                      borderRadius: '4px 4px 0 0',
                      opacity: 0.8
                    }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Reports Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              {/* Occupancy Analysis */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Occupancy Analysis by Property
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {properties.map((property) => {
                    const propertyUnits = units.filter(u => u.propertyId === property.id);
                    const occupiedUnits = propertyUnits.filter(u => u.status === 'occupied').length;
                    const occupancyRate = propertyUnits.length > 0 ? (occupiedUnits / propertyUnits.length) * 100 : 0;
                    
                    return (
                      <div key={property.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                            {property.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {occupiedUnits} of {propertyUnits.length} units
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                            {occupancyRate.toFixed(1)}%
                          </div>
                          <div style={{ 
                            width: '60px', 
                            height: '4px', 
                            backgroundColor: '#e5e7eb', 
                            borderRadius: '2px',
                            marginTop: '4px'
                          }}>
                            <div style={{ 
                              width: `${occupancyRate}%`, 
                              height: '100%', 
                              backgroundColor: occupancyRate > 80 ? '#10b981' : occupancyRate > 60 ? '#f59e0b' : '#ef4444',
                              borderRadius: '2px'
                            }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Status Breakdown */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Payment Status Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                      <span style={{ fontSize: '14px', color: '#374151' }}>On Time</span>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>85%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Late (1-7 days)</span>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>10%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Overdue (7+ days)</span>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>5%</span>
                  </div>
                </div>
                
                {/* Pie Chart Mock */}
                <div style={{ 
                  marginTop: '20px', 
                  height: '120px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🥧</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Payment Status Chart</div>
                  </div>
                </div>
              </div>

              {/* Top Performing Properties */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Top Performing Properties
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {properties.slice(0, 3).map((property, index) => (
                    <div key={property.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : '#cd7c2f',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                            {property.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {property.type.replace('-', ' ')}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          TZS {(property.monthlyRent * 0.8).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Monthly Revenue
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddPropertyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '95vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            margin: '0 auto'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px 16px 0 16px',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '24px'
            }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Add New Property
                </h2>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Create a new property and define its units for tenant management
                </p>
              </div>
              <button
                onClick={() => setShowAddPropertyModal(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  borderRadius: '6px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '0 16px 24px 16px', overflow: 'hidden' }}>
              <form onSubmit={(e) => {
                e.preventDefault();
                // Handle form submission here
                setShowAddPropertyModal(false);
              }} style={{ width: '100%', maxWidth: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px', width: '100%', maxWidth: '100%' }}>
                  
                  {/* Property Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Property Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Sunrise Apartments"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Property Type *
                    </label>
                    <select
                      required
                      value={selectedPropertyType}
                      onChange={(e) => {
                        setSelectedPropertyType(e.target.value);
                        setNewUnit({...newUnit, type: ''}); // Clear unit type when property type changes
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select property type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="mixed-use">Mixed-use</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 123 Sunrise Street"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      City/Town *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Dar es Salaam"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Add Units Section */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'block' }}>
                      Property Units
                    </label>
                    
                    {/* Unit Form */}
                    <div style={{ 
                      marginBottom: '20px'
                    }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                        Add New Unit
                      </h4>
                      
                      {/* Unit Input Fields - All in One Horizontal Row */}
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', width: '100%' }}>
                        {/* Unit Name */}
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                            Unit Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., A1, B2"
                            value={newUnit.unitNumber}
                            onChange={(e) => setNewUnit({...newUnit, unitNumber: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              backgroundColor: 'white'
                            }}
                          />
                        </div>

                        {/* Unit Type Selection (for mixed-use) */}
                        {selectedPropertyType === 'mixed-use' && (
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                              Unit Type *
                            </label>
                            <select
                              value={newUnit.unitType || ''}
                              onChange={(e) => setNewUnit({...newUnit, unitType: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px',
                                backgroundColor: 'white'
                              }}
                            >
                              <option value="">Select unit type</option>
                              <option value="residential">Residential</option>
                              <option value="commercial">Commercial</option>
                            </select>
                          </div>
                        )}

                        {/* Room Configuration / Total Area */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {/* Residential Fields */}
                          {(selectedPropertyType === 'residential' || (selectedPropertyType === 'mixed-use' && newUnit.unitType === 'residential')) && (
                            <div>
                              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Room Configuration
                              </label>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <select
                                  value={newUnit.bedrooms || ''}
                                  onChange={(e) => setNewUnit({...newUnit, bedrooms: e.target.value})}
                                  style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    backgroundColor: 'white'
                                  }}
                                >
                                  <option value="">Bedrooms</option>
                                  <option value="1">1 Bedroom</option>
                                  <option value="2">2 Bedrooms</option>
                                  <option value="3">3 Bedrooms</option>
                                  <option value="4">4+ Bedrooms</option>
                                </select>
                                <select
                                  value={newUnit.kitchen || ''}
                                  onChange={(e) => setNewUnit({...newUnit, kitchen: e.target.value})}
                                  style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    backgroundColor: 'white'
                                  }}
                                >
                                  <option value="">Kitchen</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                                <select
                                  value={newUnit.sittingRoom || ''}
                                  onChange={(e) => setNewUnit({...newUnit, sittingRoom: e.target.value})}
                                  style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    backgroundColor: 'white'
                                  }}
                                >
                                  <option value="">Sitting Room</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                                <select
                                  value={newUnit.bathrooms || ''}
                                  onChange={(e) => setNewUnit({...newUnit, bathrooms: e.target.value})}
                                  style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    backgroundColor: 'white'
                                  }}
                                >
                                  <option value="">Bathrooms</option>
                                  <option value="1">1 Bathroom</option>
                                  <option value="2">2 Bathrooms</option>
                                  <option value="3">3+ Bathrooms</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Commercial Fields */}
                          {(selectedPropertyType === 'commercial' || (selectedPropertyType === 'mixed-use' && newUnit.unitType === 'commercial')) && (
                            <div>
                              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Total Area (sq ft)
                              </label>
                              <input
                                type="number"
                                placeholder="e.g., 500"
                                value={newUnit.totalArea || ''}
                                onChange={(e) => setNewUnit({...newUnit, totalArea: e.target.value})}
                                style={{
                                  flex: 1,
                                  padding: '12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  backgroundColor: 'white'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Add Unit Buttons */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', width: '100%' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (newUnit.unitNumber) {
                              const unit: Unit = {
                                id: `unit-${Date.now()}`,
                                propertyId: 'temp',
                                unitNumber: newUnit.unitNumber,
                                type: selectedPropertyType,
                                size: selectedPropertyType === 'residential' ? 0 : parseInt(newUnit.totalArea || '0'),
                                monthlyRent: 0,
                                status: 'vacant'
                              };
                              setPropertyUnits([...propertyUnits, unit]);
                              setNewUnit({ unitNumber: '', type: '', size: '', monthlyRent: '', amenities: [], bedrooms: '', kitchen: '', sittingRoom: '', bathrooms: '', totalArea: '' });
                            }
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            backgroundColor: 'var(--mc-sidebar-bg)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          <Plus size={16} />
                          Add Unit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (newUnit.unitNumber) {
                              // Extract the base name and number from current unit
                              const currentName = newUnit.unitNumber;
                              const match = currentName.match(/^([A-Za-z]*)(\d+)$/);
                              
                              let nextName;
                              if (match) {
                                const [, prefix, number] = match;
                                const nextNumber = parseInt(number) + 1;
                                nextName = `${prefix}${nextNumber}`;
                              } else {
                                // If no pattern match, treat as number and increment
                                const currentNum = parseInt(currentName) || 0;
                                nextName = `${currentNum + 1}`;
                              }

                              // Add current unit
                              const unit: Unit = {
                                id: `unit-${Date.now()}`,
                                propertyId: 'temp',
                                unitNumber: newUnit.unitNumber,
                                type: selectedPropertyType,
                                size: selectedPropertyType === 'residential' ? 0 : parseInt(newUnit.totalArea || '0'),
                                monthlyRent: 0,
                                status: 'vacant'
                              };
                              setPropertyUnits([...propertyUnits, unit]);

                              // Update form with incremented name, keep other values
                              setNewUnit({
                                ...newUnit,
                                unitNumber: nextName
                              });
                            }
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          <Plus size={16} />
                          Duplicate
                        </button>
                      </div>
                    </div>

                    {/* Added Units List */}
                    {propertyUnits.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                          Added Units ({propertyUnits.length})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {propertyUnits.map((unit, index) => (
                            <div key={unit.id} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              <div>
                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                                  {unit.unitNumber} - {unit.type}
                                </span>
                                <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
                                  {unit.size} sq ft
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setPropertyUnits(propertyUnits.filter((_, i) => i !== index));
                                }}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Description */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the property, its features, and any additional information..."
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Form Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddPropertyModal(false)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      backgroundColor: 'var(--mc-sidebar-bg)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <Save size={16} />
                    Create Property
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                  {selectedProperty.name}
                </h2>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                  Property Management & Tenant Information
                </p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={24} color="#6b7280" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div style={{
              padding: '0 24px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '4px'
              }}>
                {propertyTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePropertyTab(tab.id)}
                    style={{
                      padding: '12px 8px',
                      backgroundColor: activePropertyTab === tab.id ? 'var(--mc-sidebar-bg)' : 'transparent',
                      color: activePropertyTab === tab.id ? 'white' : '#6b7280',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div style={{
              padding: '24px',
              overflowY: 'auto',
              flex: 1
            }}>
              {/* Overview Tab */}
              {activePropertyTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Property Type</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0, textTransform: 'capitalize' }}>
                        {selectedProperty.type.replace('-', ' ')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Status</label>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        color: getStatusColor(selectedProperty.status),
                        fontSize: '14px',
                        fontWeight: '500',
                        padding: '4px 8px',
                        backgroundColor: `${getStatusColor(selectedProperty.status)}15`,
                        borderRadius: '6px',
                        width: 'fit-content'
                      }}>
                        {getStatusIcon(selectedProperty.status)}
                        {selectedProperty.status.charAt(0).toUpperCase() + selectedProperty.status.slice(1)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Total Units</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedProperty.totalUnits}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Occupied Units</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedProperty.occupiedUnits}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Vacant Units</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedProperty.vacantUnits}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Monthly Revenue</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        TZS {selectedProperty.monthlyRent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Location Details
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '16px' 
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Address</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedProperty.address}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>City</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedProperty.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Amenities
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedProperty.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          style={{
                            fontSize: '14px',
                            padding: '6px 12px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            borderRadius: '6px',
                            fontWeight: '500'
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Created Date</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {new Date(selectedProperty.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Units Tab */}
              {activePropertyTab === 'units' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Property Units
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {units.filter(unit => unit.propertyId === selectedProperty.id).map((unit) => (
                      <div key={unit.id} style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        padding: '16px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {unit.unitNumber}
                          </h4>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: unit.status === 'occupied' ? '#dcfce7' : '#fef3c7',
                            color: unit.status === 'occupied' ? '#166534' : '#92400e'
                          }}>
                            {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>Type:</span>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{unit.type}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>Rent:</span>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>TZS {unit.monthlyRent.toLocaleString()}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>Size:</span>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{unit.size} sq ft</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tenants Tab */}
              {activePropertyTab === 'tenants' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Current Tenants
                    </h3>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: 'var(--mc-sidebar-bg)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      <Plus size={16} />
                      Add Tenant
                    </button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
                    {tenants.filter(tenant => {
                      const tenantUnit = units.find(unit => unit.id === tenant.unitId);
                      return tenantUnit && tenantUnit.propertyId === selectedProperty.id;
                    }).map((tenant) => (
                      <div key={tenant.id} style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <div>
                            <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                              {tenant.name}
                            </h4>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                              {units.find(unit => unit.id === tenant.unitId)?.unitNumber || 'Unknown Unit'}
                            </p>
                          </div>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: tenant.status === 'active' ? '#dcfce7' : '#fef3c7',
                            color: tenant.status === 'active' ? '#166534' : '#92400e'
                          }}>
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone size={16} color="#6b7280" />
                            <span style={{ fontSize: '14px', color: '#374151' }}>{tenant.phone}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail size={16} color="#6b7280" />
                            <span style={{ fontSize: '14px', color: '#374151' }}>{tenant.email}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={16} color="#6b7280" />
                            <span style={{ fontSize: '14px', color: '#374151' }}>
                              Lease: {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <DollarSign size={16} color="#6b7280" />
                            <span style={{ fontSize: '14px', color: '#374151' }}>
                              Rent: TZS {tenant.monthlyRent.toLocaleString()}/month
                            </span>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                          <button style={{
                            flex: 1,
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            color: '#374151'
                          }}>
                            View Details
                          </button>
                          <button style={{
                            flex: 1,
                            padding: '8px 12px',
                            backgroundColor: 'var(--mc-sidebar-bg)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}>
                            Contact
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activePropertyTab === 'payments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Payment History
                  </h3>
                  
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '16px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                        <div>Date</div>
                        <div>Tenant</div>
                        <div>Unit</div>
                        <div>Amount</div>
                        <div>Status</div>
                      </div>
                    </div>
                    
                    {payments.filter(payment => {
                      const paymentUnit = units.find(unit => unit.id === payment.unitId);
                      return paymentUnit && paymentUnit.propertyId === selectedProperty.id;
                    }).map((payment) => (
                      <div key={payment.id} style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '16px', fontSize: '14px', alignItems: 'center' }}>
                          <div style={{ color: '#374151' }}>
                            {new Date(payment.date).toLocaleDateString()}
                          </div>
                          <div style={{ color: '#374151' }}>
                            {tenants.find(tenant => tenant.id === payment.tenantId)?.name || 'Unknown'}
                          </div>
                          <div style={{ color: '#374151' }}>
                            {units.find(unit => unit.id === payment.unitId)?.unitNumber || 'Unknown'}
                          </div>
                          <div style={{ color: '#374151', fontWeight: '500' }}>
                            TZS {payment.amount.toLocaleString()}
                          </div>
                          <div>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '500',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: payment.status === 'paid' ? '#dcfce7' : '#fef3c7',
                              color: payment.status === 'paid' ? '#166534' : '#92400e'
                            }}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other tabs placeholder */}
              {activePropertyTab === 'maintenance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Maintenance Records
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '16px' }}>Maintenance records will be displayed here.</p>
                </div>
              )}

              {activePropertyTab === 'documents' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Property Documents
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '16px' }}>Property documents will be displayed here.</p>
                </div>
              )}


              {activePropertyTab === 'analytics' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Property Analytics
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '16px' }}>Analytics and reports will be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Tenant Modal */}
      {showViewTenantModal && selectedTenant && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Tenant Details
              </h2>
              <button
                onClick={() => setShowViewTenantModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Tenant Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Tenant Name */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Tenant Name *
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  {selectedTenant.name}
                </div>
              </div>

              {/* Email */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Email *
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {selectedTenant.email}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Phone Number *
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {selectedTenant.phone}
                </div>
              </div>

              {/* ID Number */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  ID Number *
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {selectedTenant.idNumber}
                </div>
              </div>

              {/* Property */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Property *
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {properties.find(p => p.id === selectedTenant.propertyId)?.name}
                </div>
              </div>

              {/* Unit */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Unit *
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {units.find(u => u.id === selectedTenant.unitId)?.unitNumber}
                </div>
              </div>

              {/* Lease Start Date */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Lease Start Date *
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {new Date(selectedTenant.leaseStart).toLocaleDateString('en-GB')}
                </div>
              </div>

              {/* Lease Period */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Lease Period *
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {(() => {
                    const startDate = new Date(selectedTenant.leaseStart);
                    const endDate = new Date(selectedTenant.leaseEnd);
                    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
                    return `${diffMonths} months`;
                  })()}
                </div>
              </div>

              {/* Lease End Date */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Lease End Date *
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {new Date(selectedTenant.leaseEnd).toLocaleDateString('en-GB')}
                </div>
              </div>

              {/* Monthly Rent */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Monthly Rent (TZS) *
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  TZS {selectedTenant.monthlyRent.toLocaleString()}
                </div>
              </div>

              {/* Deposit */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Deposit (TZS) *
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  TZS {selectedTenant.deposit.toLocaleString()}
                </div>
              </div>

              {/* Emergency Contact Name */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Emergency Contact Name
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {selectedTenant.emergencyContact || 'Not provided'}
                </div>
              </div>

              {/* Emergency Contact Phone */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Emergency Contact Phone
                </div>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {selectedTenant.emergencyPhone || 'Not provided'}
                </div>
              </div>

              {/* Status */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                  Status
                </div>
                <div>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: selectedTenant.status === 'active' ? '#10b98115' : '#6b728015',
                    color: selectedTenant.status === 'active' ? '#10b981' : '#6b7280',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {selectedTenant.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                Documents
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Contract Document */}
                <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <FileText size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Lease Contract
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                    {selectedTenant.contractFile ? (
                      <span style={{ color: '#10b981' }}>✓ Uploaded</span>
                    ) : (
                      <span style={{ color: '#ef4444' }}>✗ Not uploaded</span>
                    )}
                  </div>
                  {selectedTenant.contractFile && (
                    <button
                      onClick={() => {
                        // Handle document download/view
                        console.log('Download contract:', selectedTenant.contractFile);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'var(--mc-sidebar-bg)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      View Document
                    </button>
                  )}
                </div>

                {/* ID Document */}
                <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <FileText size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      ID Document
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                    {selectedTenant.idFile ? (
                      <span style={{ color: '#10b981' }}>✓ Uploaded</span>
                    ) : (
                      <span style={{ color: '#ef4444' }}>✗ Not uploaded</span>
                    )}
                  </div>
                  {selectedTenant.idFile && (
                    <button
                      onClick={() => {
                        // Handle document download/view
                        console.log('Download ID:', selectedTenant.idFile);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'var(--mc-sidebar-bg)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      View Document
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  // Handle lease renewal
                  console.log('Renew lease for:', selectedTenant?.name);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <Edit size={16} />
                Renew Lease
              </button>
              <button
                onClick={() => {
                  // Handle lease termination
                  console.log('Terminate lease for:', selectedTenant?.name);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
                Terminate Lease
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Tenant Modal */}
      {showMessageTenantModal && messageTenant && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: '#e0f2fe', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: 'var(--mc-sidebar-bg)' 
                }}>
                  {messageTenant.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {messageTenant.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    {properties.find(p => p.id === messageTenant.propertyId)?.name} - {units.find(u => u.id === messageTenant.unitId)?.unitNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowMessageTenantModal(false);
                  setMessageTenant(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {/* Channel Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
                Choose Communication Channel
              </label>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {messageTenant.email && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="channel"
                      value="email"
                      checked={selectedChannel === 'email'}
                      onChange={(e) => setSelectedChannel(e.target.value as any)}
                    />
                    <Mail size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Email</span>
                  </label>
                )}
                
                {messageTenant.phone && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="channel"
                      value="sms"
                      checked={selectedChannel === 'sms'}
                      onChange={(e) => setSelectedChannel(e.target.value as any)}
                    />
                    <Phone size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>SMS</span>
                  </label>
                )}
                
                {messageTenant.phone && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="channel"
                      value="whatsapp"
                      checked={selectedChannel === 'whatsapp'}
                      onChange={(e) => setSelectedChannel(e.target.value as any)}
                    />
                    <MessageCircle size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>WhatsApp</span>
                  </label>
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div style={{ 
              flex: 1, 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              marginBottom: '16px',
              backgroundColor: 'white',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Chat Header */}
              <div style={{ 
                padding: '12px 16px', 
                borderBottom: '1px solid #e5e7eb', 
                backgroundColor: '#f9fafb',
                borderRadius: '8px 8px 0 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedChannel === 'email' && <Mail size={16} color="#6b7280" />}
                  {selectedChannel === 'sms' && <Phone size={16} color="#6b7280" />}
                  {selectedChannel === 'whatsapp' && <MessageCircle size={16} color="#6b7280" />}
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {selectedChannel === 'email' && `Email: ${messageTenant.email}`}
                    {selectedChannel === 'sms' && `SMS: ${messageTenant.phone}`}
                    {selectedChannel === 'whatsapp' && `WhatsApp: ${messageTenant.phone}`}
                  </span>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div style={{ 
                flex: 1, 
                padding: '16px', 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
              }}>
                <MessageCircle size={48} color="#d1d5db" />
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
                    Start a conversation
                  </h4>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Send a message to {messageTenant.name} via {selectedChannel.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Message Input */}
              <div style={{ 
                padding: '16px', 
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '12px'
              }}>
                <input
                  type="text"
                  placeholder={`Type your message...`}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <button
                  onClick={() => {
                    if (messageContent.trim()) {
                      // Handle message sending
                      console.log(`Sending ${selectedChannel} message to ${messageTenant.name}:`, messageContent);
                      setMessageContent('');
                      setShowMessageTenantModal(false);
                    }
                  }}
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <MessageCircle size={16} />
                  Send
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddTenantModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Add New Tenant
              </h2>
              <button
                onClick={() => setShowAddTenantModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>
            {/* Tenant Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle tenant creation
              setShowAddTenantModal(false);
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                {/* Tenant Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Tenant Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe"
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., john@example.com"
                    value={newTenant.email}
                    onChange={(e) => setNewTenant({...newTenant, email: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g., +255 123 456 789"
                    value={newTenant.phone}
                    onChange={(e) => setNewTenant({...newTenant, phone: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* ID Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    ID Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 123456789"
                    value={newTenant.idNumber}
                    onChange={(e) => setNewTenant({...newTenant, idNumber: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Property Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Property *
                  </label>
                  <select
                    value={newTenant.propertyId}
                    onChange={(e) => {
                      setNewTenant({...newTenant, propertyId: e.target.value, unitId: ''});
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Property</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Unit *
                  </label>
                  <select
                    value={newTenant.unitId}
                    onChange={(e) => setNewTenant({...newTenant, unitId: e.target.value})}
                    required
                    disabled={!newTenant.propertyId}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: newTenant.propertyId ? 'white' : '#f9fafb',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Unit</option>
                    {units.filter(unit => unit.propertyId === newTenant.propertyId).map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.unitNumber} - {unit.type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lease Start */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Lease Start Date *
                  </label>
                  <input
                    type="date"
                    value={newTenant.leaseStart}
                    onChange={(e) => {
                      const startDate = e.target.value;
                      const period = parseInt(newTenant.leasePeriod);
                      if (startDate && period) {
                        const endDate = new Date(startDate);
                        endDate.setMonth(endDate.getMonth() + period);
                        setNewTenant({
                          ...newTenant, 
                          leaseStart: startDate,
                          leaseEnd: endDate.toISOString().split('T')[0]
                        });
                      } else {
                        setNewTenant({...newTenant, leaseStart: startDate});
                      }
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Lease Period */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Lease Period *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 6 months, 1 year, 18 months"
                    value={newTenant.leasePeriod}
                    onChange={(e) => setNewTenant({...newTenant, leasePeriod: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Lease End */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Lease End Date *
                  </label>
                  <input
                    type="date"
                    value={newTenant.leaseEnd}
                    onChange={(e) => setNewTenant({...newTenant, leaseEnd: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Monthly Rent */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Monthly Rent (TZS) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 350000"
                    value={newTenant.monthlyRent}
                    onChange={(e) => setNewTenant({...newTenant, monthlyRent: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Deposit */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Deposit (TZS) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 700000"
                    value={newTenant.deposit}
                    onChange={(e) => setNewTenant({...newTenant, deposit: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Jane Doe"
                    value={newTenant.emergencyContact}
                    onChange={(e) => setNewTenant({...newTenant, emergencyContact: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Emergency Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g., +255 987 654 321"
                    value={newTenant.emergencyPhone}
                    onChange={(e) => setNewTenant({...newTenant, emergencyPhone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                  Document Uploads
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Contract Upload */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Lease Contract *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewTenant({...newTenant, contractFile: file});
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      />
                      {newTenant.contractFile && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981' }}>
                          ✓ {newTenant.contractFile.name}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Accepted formats: PDF, DOC, DOCX
                    </div>
                  </div>

                  {/* ID Upload */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      ID Document *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewTenant({...newTenant, idFile: file});
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      />
                      {newTenant.idFile && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981' }}>
                          ✓ {newTenant.idFile.name}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Accepted formats: PDF, JPG, JPEG, PNG
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Options */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                  Contract Options
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Automatic Renewal */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      id="automaticRenewal"
                      checked={newTenant.automaticRenewal}
                      onChange={(e) => setNewTenant({...newTenant, automaticRenewal: e.target.checked})}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer'
                      }}
                    />
                    <label htmlFor="automaticRenewal" style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                      Automatic renewal contract
                    </label>
                  </div>

                  {/* Send Reminder Notifications */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      id="sendReminders"
                      checked={newTenant.sendReminders}
                      onChange={(e) => setNewTenant({...newTenant, sendReminders: e.target.checked})}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer'
                      }}
                    />
                    <label htmlFor="sendReminders" style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                      Send reminder notifications
                    </label>
                  </div>

                  {/* Smart Contract */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      id="smartContract"
                      checked={newTenant.smartContract}
                      onChange={(e) => setNewTenant({...newTenant, smartContract: e.target.checked})}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer'
                      }}
                    />
                    <label htmlFor="smartContract" style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                      Send automatic smart contract
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <Save size={16} />
                  Add Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
