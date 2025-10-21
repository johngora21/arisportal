'use client';

import React from 'react';
import { X, Plus, Phone, Mail, Calendar, DollarSign, FileText, Edit } from 'lucide-react';
import { Property, Unit, Tenant, Payment } from '../types';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  units: Unit[];
  tenants: Tenant[];
  payments: Payment[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTenant?: () => void;
  onViewTenant?: (tenant: Tenant) => void;
  onContactTenant?: (tenant: Tenant) => void;
}

const propertyTabs = [
  { id: 'overview', label: 'Overview', icon: <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '2px' }} /> },
  { id: 'units', label: 'Units', icon: <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '2px' }} /> },
  { id: 'tenants', label: 'Tenants', icon: <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '2px' }} /> },
  { id: 'payments', label: 'Payments', icon: <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '2px' }} /> },
  { id: 'analytics', label: 'Analytics', icon: <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '2px' }} /> }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return '#10b981';
    case 'inactive': return '#6b7280';
    case 'maintenance': return '#f59e0b';
    default: return '#6b7280';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return '●';
    case 'inactive': return '●';
    case 'maintenance': return '●';
    default: return '●';
  }
};

export default function PropertyDetailsModal({ 
  isOpen, 
  onClose, 
  property, 
  units, 
  tenants, 
  payments, 
  activeTab, 
  onTabChange,
  onAddTenant,
  onViewTenant,
  onContactTenant
}: PropertyDetailsModalProps) {
  if (!isOpen || !property) return null;

  return (
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
        borderRadius: '20px',
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
              {property.name}
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Property Management & Tenant Information
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '20px',
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
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '4px'
          }}>
            {propertyTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  padding: '12px 8px',
                  backgroundColor: 'var(--mc-sidebar-bg-hover)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '20px',
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
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '24px' 
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Property Type</label>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0, textTransform: 'capitalize' }}>
                    {property.type.replace('-', ' ')}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Status</label>
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    color: getStatusColor(property.status),
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '4px 8px',
                    backgroundColor: `${getStatusColor(property.status)}15`,
                    borderRadius: '20px',
                    width: 'fit-content'
                  }}>
                    {getStatusIcon(property.status)}
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Total Units</label>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    {property.totalUnits}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Occupied Units</label>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    {property.occupiedUnits}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Vacant Units</label>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    {property.vacantUnits}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Monthly Revenue</label>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    TZS {property.monthlyRent.toLocaleString()}
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
                      {property.address}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>City</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {property.city}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Amenities
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '14px',
                        padding: '6px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        borderRadius: '20px',
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
                  {new Date(property.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Units Tab */}
          {activeTab === 'units' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Property Units
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {units.filter(unit => unit.propertyId === property.id).map((unit) => (
                  <div key={unit.id} style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '20px',
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
                        borderRadius: '20px',
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
          {activeTab === 'tenants' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Current Tenants
                </h3>
                {onAddTenant && (
                  <button 
                    onClick={onAddTenant}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: 'var(--mc-sidebar-bg-hover)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} />
                    Add Tenant
                  </button>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
                {tenants.filter(tenant => {
                  const tenantUnit = units.find(unit => unit.id === tenant.unitId);
                  return tenantUnit && tenantUnit.propertyId === property.id;
                }).map((tenant) => (
                  <div key={tenant.id} style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '20px',
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
                        borderRadius: '20px',
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
                      <button 
                        onClick={() => onViewTenant?.(tenant)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: 'transparent',
                          border: '1px solid #d1d5db',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          color: '#374151'
                        }}
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => onContactTenant?.(tenant)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: 'var(--mc-sidebar-bg-hover)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Payment History
              </h3>
              
              <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
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
                  return paymentUnit && paymentUnit.propertyId === property.id;
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
                          borderRadius: '20px',
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

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
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
  );
}
