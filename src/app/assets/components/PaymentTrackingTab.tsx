'use client';

import React from 'react';
import { Plus } from 'lucide-react';

import { Payment, Tenant, Unit, Property } from '../types';

interface PaymentTrackingTabProps {
  payments: Payment[];
  tenants: Tenant[];
  units: Unit[];
  properties: Property[];
}

export default function PaymentTrackingTab({ payments, tenants, units, properties }: PaymentTrackingTabProps) {
  return (
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
            backgroundColor: '#0f172a',
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
            {payments.map((payment) => {
              const tenant = tenants.find(t => t.id === payment.tenantId);
              const unit = units.find(u => u.id === payment.unitId);
              
              return (
                <tr key={payment.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                    {tenant?.name || 'Unknown Tenant'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                    TZS {payment.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                    -
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>
                    Bank Transfer
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
