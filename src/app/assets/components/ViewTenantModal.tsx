'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Tenant, Property, Unit } from '../types';

interface ViewTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  properties: Property[];
  units: Unit[];
  onRenewLease?: (tenant: Tenant) => void;
  onTerminateLease?: (tenant: Tenant) => void;
}

export default function ViewTenantModal({ 
  isOpen, 
  onClose, 
  tenant, 
  properties, 
  units,
  onRenewLease,
  onTerminateLease
}: ViewTenantModalProps) {
  if (!isOpen || !tenant) return null;

  const property = properties.find(p => p.id === tenant.propertyId);
  const unit = units.find(u => u.id === tenant.unitId);

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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Tenant Details
          </h2>
          <button
            onClick={onClose}
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

        {/* Tenant Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {/* Tenant Name */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Tenant Name *
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
              {tenant.name}
            </div>
          </div>

          {/* Email */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Email *
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              {tenant.email}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Phone Number *
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              {tenant.phone}
            </div>
          </div>

          {/* ID Number */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              ID Number *
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              {tenant.idNumber}
            </div>
          </div>

          {/* Property */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Property *
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              {property?.name}
            </div>
          </div>

          {/* Unit */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Unit *
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              {unit?.unitNumber}
            </div>
          </div>

          {/* Lease Start Date */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Lease Start Date *
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              {new Date(tenant.leaseStart).toLocaleDateString('en-GB')}
            </div>
          </div>

          {/* Lease Period */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Lease Period *
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              {tenant.leasePeriod}
            </div>
          </div>

          {/* Lease End Date */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Lease End Date *
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              {new Date(tenant.leaseEnd).toLocaleDateString('en-GB')}
            </div>
          </div>

          {/* Monthly Rent */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Monthly Rent (TZS) *
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              TZS {tenant.monthlyRent.toLocaleString()}
            </div>
          </div>

          {/* Deposit */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Deposit (TZS) *
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              TZS {tenant.deposit.toLocaleString()}
            </div>
          </div>

          {/* Emergency Contact Name */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Emergency Contact Name
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              {tenant.emergencyContact || 'Not provided'}
            </div>
          </div>

          {/* Emergency Contact Phone */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Emergency Contact Phone
            </div>
            <div style={{ fontSize: '16px', color: '#1f2937' }}>
              {tenant.emergencyPhone || 'Not provided'}
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
            Documents
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                Lease Contract
              </div>
              <div style={{ fontSize: '14px', color: tenant.contractFile ? '#10b981' : '#ef4444' }}>
                {tenant.contractFile ? '✓ Uploaded' : '✗ Not uploaded'}
              </div>
              {tenant.contractFile && (
                <button
                  onClick={() => console.log('View contract document')}
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  View Document
                </button>
              )}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                ID Document
              </div>
              <div style={{ fontSize: '14px', color: tenant.idFile ? '#10b981' : '#ef4444' }}>
                {tenant.idFile ? '✓ Uploaded' : '✗ Not uploaded'}
              </div>
              {tenant.idFile && (
                <button
                  onClick={() => console.log('View ID document')}
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  View Document
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contract Options */}
        <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
            Contract Settings
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              {tenant.automaticRenewal ? '✓' : '✗'} Automatic renewal contract
            </div>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              {tenant.sendReminders ? '✓' : '✗'} Send reminder notifications
            </div>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              {tenant.smartContract ? '✓' : '✗'} Send automatic smart contract
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          {onRenewLease && (
            <button
              onClick={() => {
                onRenewLease(tenant);
                onClose();
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Renew Lease
            </button>
          )}
          {onTerminateLease && (
            <button
              onClick={() => {
                onTerminateLease(tenant);
                onClose();
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Terminate Lease
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
