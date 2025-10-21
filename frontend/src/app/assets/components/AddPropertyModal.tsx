'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Property, Unit } from '../types';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Property) => void;
}

export default function AddPropertyModal({ isOpen, onClose, onSave }: AddPropertyModalProps) {
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [propertyUnits, setPropertyUnits] = useState<Unit[]>([]);
  const [newUnit, setNewUnit] = useState({
    unitNumber: '',
    type: '',
    size: '',
    monthlyRent: '',
    amenities: [] as string[]
  });

  const getUnitTypes = (propertyType: string) => {
    switch (propertyType) {
      case 'residential':
        return ['1BR', '2BR', '3BR', '4BR', 'Studio'];
      case 'commercial':
        return ['Office', 'Shop', 'Warehouse', 'Restaurant'];
      case 'mixed-use':
        return ['Residential', 'Commercial'];
      default:
        return [];
    }
  };

  const handleAddUnit = () => {
    if (!newUnit.unitNumber) return;

    const unit: Unit = {
      id: Date.now().toString(),
      propertyId: '',
      unitNumber: newUnit.unitNumber,
      type: newUnit.type,
      size: newUnit.size,
      monthlyRent: parseFloat(newUnit.monthlyRent) || 0,
      status: 'vacant',
      amenities: newUnit.amenities
    };

    setPropertyUnits([...propertyUnits, unit]);
    setNewUnit({
      unitNumber: '',
      type: '',
      size: '',
      monthlyRent: '',
      amenities: []
    });
  };

  const handleDuplicateUnit = (unitToDuplicate: Unit) => {
    const currentName = unitToDuplicate.unitNumber;
    const match = currentName.match(/^([A-Za-z]*)(\d+)$/);
    
    if (match) {
      const [, prefix, number] = match;
      const nextNumber = parseInt(number) + 1;
      const nextName = `${prefix}${nextNumber}`;
      
      const duplicatedUnit: Unit = {
        ...unitToDuplicate,
        id: Date.now().toString(),
        unitNumber: nextName
      };
      
      setPropertyUnits([...propertyUnits, duplicatedUnit]);
    } else {
      const nextName = `${currentName}-2`;
      const duplicatedUnit: Unit = {
        ...unitToDuplicate,
        id: Date.now().toString(),
        unitNumber: nextName
      };
      
      setPropertyUnits([...propertyUnits, duplicatedUnit]);
    }
  };

  const handleRemoveUnit = (unitId: string) => {
    setPropertyUnits(propertyUnits.filter(unit => unit.id !== unitId));
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
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
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
            onClick={onClose}
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
              borderRadius: '20px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '0 16px 24px 16px' }}>
          <form onSubmit={(e) => {
            e.preventDefault();
            // Handle form submission
            console.log('Property form submitted');
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
                    borderRadius: '20px',
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
                    borderRadius: '20px',
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
                    borderRadius: '20px',
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
                    borderRadius: '20px',
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
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'end', 
                  marginBottom: '16px',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                      Unit Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., A1, B2"
                      value={newUnit.unitNumber}
                      onChange={(e) => setNewUnit({...newUnit, unitNumber: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                      Unit Type *
                    </label>
                    <select
                      value={newUnit.type}
                      onChange={(e) => setNewUnit({...newUnit, type: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select unit type</option>
                      {getUnitTypes(selectedPropertyType).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                      Size (sq ft) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 80"
                      value={newUnit.size}
                      onChange={(e) => setNewUnit({...newUnit, size: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                      Monthly Rent (TZS) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 350000"
                      value={newUnit.monthlyRent}
                      onChange={(e) => setNewUnit({...newUnit, monthlyRent: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddUnit}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Add Unit
                  </button>
                </div>

                {/* Units List */}
                {propertyUnits.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                      Added Units ({propertyUnits.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {propertyUnits.map((unit) => (
                        <div key={unit.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '20px'
                        }}>
                          <span style={{ fontSize: '14px', color: '#374151' }}>
                            {unit.unitNumber} - {unit.size} sq ft
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleDuplicateUnit(unit)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#f3f4f6',
                                border: '1px solid #d1d5db',
                                borderRadius: '20px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Duplicate
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveUnit(unit.id)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '20px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                color: '#dc2626'
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ gridColumn: '1 / -1' }}>
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
                    borderRadius: '20px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  color: '#374151'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Save Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
