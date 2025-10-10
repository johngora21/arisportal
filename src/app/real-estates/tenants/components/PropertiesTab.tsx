'use client';

import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Building, 
  Plus,
  Search,
  MapPin,
  Users,
  Edit,
  Trash2
} from 'lucide-react';
import { Property } from '../types';

interface PropertiesTabProps {
  properties: Property[];
  units: any[];
  onAddProperty: () => void;
  onViewProperty: (property: Property) => void;
}

export default function PropertiesTab({
  properties,
  units,
  onAddProperty,
  onViewProperty
}: PropertiesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Helper functions
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'residential': return <Home size={16} color="#3b82f6" />;
      case 'commercial': return <Building size={16} color="#10b981" />;
      case 'mixed-use': return <Building size={16} color="#f59e0b" />;
      default: return <Building size={16} color="#6b7280" />;
    }
  };

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [properties, searchTerm, statusFilter]);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={onAddProperty}
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
          Add Property
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{
        position: 'relative',
        height: '40px',
        marginBottom: '24px'
      }}>
        {/* Search Bar - positioned from right */}
        <div style={{ 
          position: 'absolute',
          right: '290px',
          top: '0px',
          width: '400px'
        }}>
          <Search style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            width: '16px',
            height: '20px'
          }} />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px'
            }}
          />
        </div>
        
        {/* Status Filter - positioned from right */}
        <div style={{
          position: 'absolute',
          right: '50px',
          top: '0px'
        }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              background: 'white',
              width: '180px'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {/* Properties Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '24px'
      }}>
        {filteredProperties.map((property) => (
          <div 
            key={property.id}
            onClick={() => onViewProperty(property)}
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {getTypeIcon(property.type)}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {property.name}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', textTransform: 'capitalize' }}>
                    {property.type.replace('-', ' ')}
                  </div>
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                color: getStatusColor(property.status),
                fontSize: '12px',
                fontWeight: '500',
                padding: '4px 8px',
                backgroundColor: `${getStatusColor(property.status)}15`,
                borderRadius: '20px'
              }}>
                {getStatusIcon(property.status)}
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </div>
            </div>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MapPin size={16} color="#6b7280" />
              <div>
                <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                  {property.address}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {property.city}
                </div>
              </div>
            </div>

            {/* Units Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {property.totalUnits} units
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {property.occupiedUnits} occupied
                </span>
              </div>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Amenities:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {property.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: '12px',
                      padding: '2px 6px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '20px'
                    }}
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                Created: {new Date(property.createdAt).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit
                  }}
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '20px',
                    color: '#6b7280'
                  }}
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete
                  }}
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '20px',
                    color: '#ef4444'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}