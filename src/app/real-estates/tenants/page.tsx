'use client';

import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Key, 
  FileText as FileTextIcon, 
  DollarSign, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MessageCircle,
  X,
  Save
} from 'lucide-react';

// Import all the tab components
import PropertiesTab from './components/PropertiesTab';
import TenantRecordsTab from './components/TenantRecordsTab';
import LeaseManagementTab from './components/LeaseManagementTab';
import PaymentTrackingTab from './components/PaymentTrackingTab';
import ReportsTab from './components/ReportsTab';

// Import all the modal components
import AddPropertyModal from './components/AddPropertyModal';
import AddTenantModal from './components/AddTenantModal';
import ViewTenantModal from './components/ViewTenantModal';
import MessageTenantModal from './components/MessageTenantModal';
import PropertyDetailsModal from './components/PropertyDetailsModal';

// Import types
import { Property, Unit, Tenant, Payment, AssetStats } from './types';

  // Mock data
  const mockProperties: Property[] = [
    {
      id: '1',
      name: 'Sunrise Apartments',
      type: 'residential',
      address: '123 Sunrise Street',
      city: 'Dar es Salaam',
      totalUnits: 12,
    occupiedUnits: 8,
    vacantUnits: 4,
      monthlyRent: 4500000,
      status: 'active',
    amenities: ['Parking', 'Security', 'Garden', 'Swimming Pool'],
      createdAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'Business Plaza',
      type: 'commercial',
      address: '456 Business Avenue',
    city: 'Dar es Salaam',
      totalUnits: 8,
      occupiedUnits: 6,
      vacantUnits: 2,
      monthlyRent: 3200000,
      status: 'active',
    amenities: ['Parking', 'Security', 'Elevator', 'Conference Room'],
    createdAt: '2023-02-20'
    },
    {
      id: '3',
      name: 'Mixed Complex',
      type: 'mixed-use',
    address: '789 Mixed Street',
    city: 'Arusha',
      totalUnits: 15,
      occupiedUnits: 12,
      vacantUnits: 3,
    monthlyRent: 5800000,
    status: 'active',
    amenities: ['Parking', 'Security', 'Garden', 'Shopping Center'],
    createdAt: '2023-03-10'
    }
  ];

  const mockUnits: Unit[] = [
  { id: '1', propertyId: '1', unitNumber: 'A1', type: 'residential', size: 80, monthlyRent: 350000, status: 'occupied' },
  { id: '2', propertyId: '1', unitNumber: 'A2', type: 'residential', size: 80, monthlyRent: 350000, status: 'occupied' },
  { id: '3', propertyId: '1', unitNumber: 'B1', type: 'residential', size: 100, monthlyRent: 450000, status: 'vacant' },
  { id: '4', propertyId: '2', unitNumber: 'Office 1', type: 'commercial', size: 200, monthlyRent: 800000, status: 'occupied' },
  { id: '5', propertyId: '2', unitNumber: 'Office 2', type: 'commercial', size: 150, monthlyRent: 600000, status: 'occupied' },
  { id: '6', propertyId: '3', unitNumber: 'Shop 1', type: 'commercial', size: 50, monthlyRent: 200000, status: 'occupied' },
  { id: '7', propertyId: '3', unitNumber: 'Unit 1', type: 'residential', size: 90, monthlyRent: 400000, status: 'occupied' }
  ];

  const mockTenants: Tenant[] = [
    {
    id: '1',
      name: 'John Mwalimu',
    email: 'john@example.com',
      phone: '+255 123 456 789',
      idNumber: '123456789',
      propertyId: '1',
    unitId: '1',
      leaseStart: '2023-01-01',
    leasePeriod: '24 months',
      leaseEnd: '2024-12-31',
      monthlyRent: 350000,
      deposit: 700000,
      status: 'active',
    emergencyContact: 'Jane Mwalimu',
    emergencyPhone: '+255 987 654 321',
      contractFile: new File(['contract content'], 'lease_contract_john.pdf', { type: 'application/pdf' }),
      idFile: new File(['id content'], 'john_id.pdf', { type: 'application/pdf' }),
    automaticRenewal: true,
    sendReminders: true,
    smartContract: false
    },
    {
    id: '2',
      name: 'Sarah Kimaro',
    email: 'sarah@example.com',
    phone: '+255 234 567 890',
    idNumber: '234567890',
      propertyId: '1',
    unitId: '2',
      leaseStart: '2023-03-15',
    leasePeriod: '12 months',
      leaseEnd: '2024-03-14',
    monthlyRent: 350000,
    deposit: 700000,
      status: 'active',
    emergencyContact: 'Peter Kimaro',
    emergencyPhone: '+255 876 543 210',
      contractFile: new File(['contract content'], 'lease_contract_sarah.pdf', { type: 'application/pdf' }),
    idFile: null,
    automaticRenewal: false,
    sendReminders: true,
    smartContract: true
    }
  ];

  const mockPayments: Payment[] = [
  { id: '1', tenantId: '1', unitId: '1', amount: 350000, date: '2024-01-01', status: 'paid' },
  { id: '2', tenantId: '2', unitId: '2', amount: 350000, date: '2024-01-01', status: 'paid' },
  { id: '3', tenantId: '1', unitId: '1', amount: 350000, date: '2024-02-01', status: 'paid' },
  { id: '4', tenantId: '2', unitId: '2', amount: 350000, date: '2024-02-01', status: 'pending' }
];

const mockAssetStats: AssetStats = {
  totalProperties: 3,
  totalUnits: 35,
  occupiedUnits: 26,
  vacantUnits: 9,
  monthlyRevenue: 13500000,
  occupancyRate: 74.3
};

const tabs = [
  { id: 'properties', label: 'Properties', icon: <Home size={16} /> },
  { id: 'tenants', label: 'Tenant Records', icon: <Key size={16} /> },
  { id: 'lease-management', label: 'Lease Management', icon: <FileTextIcon size={16} /> },
  { id: 'payments', label: 'Payment Tracking', icon: <DollarSign size={16} /> },
  { id: 'reports', label: 'Reports', icon: <TrendingUp size={16} /> }
];

export default function TenantsPage() {
  // State management
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [assetStats] = useState<AssetStats>(mockAssetStats);

  // Modal states
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showViewTenantModal, setShowViewTenantModal] = useState(false);
  const [showMessageTenantModal, setShowMessageTenantModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [messageTenant, setMessageTenant] = useState<Tenant | null>(null);
  const [activePropertyTab, setActivePropertyTab] = useState('overview');

  // Property Details Modal tabs
  const propertyTabs = [
    { id: 'overview', label: 'Overview', icon: <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '2px' }} /> },
    { id: 'units', label: 'Units', icon: <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '2px' }} /> },
    { id: 'tenants', label: 'Tenants', icon: <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '2px' }} /> },
    { id: 'payments', label: 'Payments', icon: <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '2px' }} /> },
    { id: 'analytics', label: 'Analytics', icon: <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '2px' }} /> }
  ];

  // Event handlers
  const handleAddProperty = () => {
    setShowAddPropertyModal(true);
  };

  const handleAddTenant = () => {
    setShowAddTenantModal(true);
  };

  const handleViewTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowViewTenantModal(true);
  };

  const handleMessageTenant = (tenant: Tenant) => {
    setMessageTenant(tenant);
    setShowMessageTenantModal(true);
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleRenewLease = (tenant: Tenant) => {
    console.log('Renew lease for:', tenant.name);
  };

  const handleTerminateLease = (tenant: Tenant) => {
    console.log('Terminate lease for:', tenant.name);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Assets Management
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage properties, tenants, and rental operations
            </p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '32px'
        }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
            padding: '24px',
                  border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                backgroundColor: '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                justifyContent: 'center'
                    }}>
                <Home size={24} color="#3b82f6" />
                    </div>
                    <div>
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  {assetStats.totalProperties}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Properties</p>
                    </div>
                    </div>
                  </div>
                  
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
            padding: '24px',
                  border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                backgroundColor: '#dcfce7',
                      display: 'flex',
                      alignItems: 'center',
                justifyContent: 'center'
                    }}>
                <Key size={24} color="#10b981" />
                    </div>
                    <div>
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  {assetStats.totalUnits}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Units</p>
                    </div>
                    </div>
                  </div>
                  
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
            padding: '24px',
                  border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                backgroundColor: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                justifyContent: 'center'
                    }}>
                <FileTextIcon size={24} color="#f59e0b" />
                    </div>
                    <div>
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  {assetStats.occupancyRate.toFixed(1)}%
              </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Occupancy Rate</p>
            </div>
            </div>
          </div>

            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '24px', 
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ 
                width: '48px',
                height: '48px',
                borderRadius: '12px', 
                backgroundColor: '#f3e8ff',
                  display: 'flex',
                  alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={24} color="#8b5cf6" />
                        </div>
                        <div>
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  TZS {assetStats.monthlyRevenue.toLocaleString()}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Monthly Revenue</p>
                          </div>
                          </div>
                        </div>
      </div>

        {/* Tab Navigation */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
            <div style={{
              display: 'flex',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
            {tabs.map((tab) => (
                  <button
                    key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                    style={{
                  flex: 1,
                  padding: '16px 20px',
                  backgroundColor: activeTab === tab.id ? '#0f172a' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                  gap: '8px'
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
            </div>

            {/* Tab Content */}
          <div style={{ padding: '24px' }}>
            {activeTab === 'properties' && (
              <PropertiesTab
                properties={properties}
                units={units}
                onAddProperty={handleAddProperty}
                onViewProperty={handleViewProperty}
              />
            )}

            {activeTab === 'tenants' && (
              <TenantRecordsTab
                tenants={tenants}
                properties={properties}
                units={units}
                onAddTenant={handleAddTenant}
                onViewTenant={handleViewTenant}
                onMessageTenant={handleMessageTenant}
              />
            )}

            {activeTab === 'lease-management' && (
              <LeaseManagementTab />
            )}

            {activeTab === 'payments' && (
              <PaymentTrackingTab
                payments={payments}
                tenants={tenants}
                units={units}
                properties={properties}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsTab
                properties={properties}
                tenants={tenants}
                payments={payments}
                assetStats={assetStats}
              />
            )}
            </div>
                </div>
                </div>

      {/* Modals */}
      <AddPropertyModal
        isOpen={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        properties={properties}
        setProperties={setProperties}
        units={units}
        setUnits={setUnits}
      />

      <AddTenantModal
        isOpen={showAddTenantModal}
        onClose={() => setShowAddTenantModal(false)}
        properties={properties}
        units={units}
        tenants={tenants}
        setTenants={setTenants}
      />

      <ViewTenantModal
        isOpen={showViewTenantModal}
        onClose={() => setShowViewTenantModal(false)}
        tenant={selectedTenant}
        properties={properties}
        units={units}
        onRenewLease={handleRenewLease}
        onTerminateLease={handleTerminateLease}
      />

      <MessageTenantModal
        isOpen={showMessageTenantModal}
        onClose={() => setShowMessageTenantModal(false)}
        tenant={messageTenant}
        properties={properties}
        units={units}
      />

      <PropertyDetailsModal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
        units={units}
        tenants={tenants}
        payments={payments}
        activeTab={activePropertyTab}
        onTabChange={setActivePropertyTab}
        onAddTenant={handleAddTenant}
        onViewTenant={handleViewTenant}
        onContactTenant={handleMessageTenant}
      />
    </div>
  );
}