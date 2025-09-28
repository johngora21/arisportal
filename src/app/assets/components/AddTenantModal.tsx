'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Property, Unit, Tenant } from '../types';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenant: Tenant) => void;
  properties: Property[];
  units: Unit[];
  isEditing?: boolean;
  initialTenant?: Partial<Tenant>;
}

export default function AddTenantModal({ 
  isOpen, 
  onClose, 
  onSave, 
  properties, 
  units, 
  isEditing = false,
  initialTenant = {}
}: AddTenantModalProps) {
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
    smartContract: false,
    ...initialTenant
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle tenant creation/editing
    console.log('Tenant form submitted:', newTenant);
    onSave(newTenant as Tenant);
    onClose();
  };

  if (!isOpen) return null;

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
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            {isEditing ? 'Edit Tenant' : 'Add New Tenant'}
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

        {/* Tenant Form */}
        <form onSubmit={handleSubmit}>
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
              onClick={onClose}
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
                backgroundColor: '#0f172a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Save size={16} />
              {isEditing ? 'Update Tenant' : 'Add Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
