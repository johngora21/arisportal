'use client';

import React from 'react';
import { 
  Plus,
  Eye,
  Edit,
  MessageCircle
} from 'lucide-react';
import { Tenant, Property, Unit } from '../types';

interface TenantRecordsTabProps {
  tenants: Tenant[];
  properties: Property[];
  units: Unit[];
  onAddTenant: () => void;
  onViewTenant: (tenant: Tenant) => void;
  onMessageTenant: (tenant: Tenant) => void;
}

export default function TenantRecordsTab({
  tenants,
  properties,
  units,
  onAddTenant,
  onViewTenant,
  onMessageTenant
}: TenantRecordsTabProps) {
  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          Tenant Records
        </h3>
        <button
          onClick={onAddTenant}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: 'var(--mc-sidebar-bg)',
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
            {tenants.map((tenant) => (
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
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {tenant.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                    onClick={() => onViewTenant(tenant)}
                      style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                    onClick={() => onMessageTenant(tenant)}
                      style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                    >
                      <MessageCircle size={14} />
                    </button>
                    <button 
                    onClick={() => {
                      // Handle edit - you can implement this later
                      console.log('Edit tenant:', tenant.name);
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
  );
}
