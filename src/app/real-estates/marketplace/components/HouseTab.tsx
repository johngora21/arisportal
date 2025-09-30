'use client';

import React from 'react';
import { Search, MapPin, DollarSign, Calendar, User, Building, Bed, Bath, ChefHat } from 'lucide-react';
import { Property } from '../types';

interface HouseTabProps {
  properties: Property[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  onPropertyClick: (property: Property) => void;
}

export default function HouseTab({ 
  properties, 
  searchTerm, 
  setSearchTerm, 
  typeFilter, 
  setTypeFilter,
  onPropertyClick
}: HouseTabProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div>
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
            placeholder="Search houses, apartments..."
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
        
        {/* Purpose Filter - positioned from right */}
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '0px'
        }}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              width: '200px'
            }}
          >
            <option value="all">All Purposes</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed">Mixed Use</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {properties.map((property) => (
          <div
            key={property.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
            }}
            onClick={() => onPropertyClick(property)}
          >
            <div style={{
              width: '100%',
              height: '200px',
              backgroundColor: '#f3f4f6',
              backgroundImage: `url(${property.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
            
            <div style={{ padding: '20px', flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                {property.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <MapPin size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '6px' }}>
                  {property.location}
                </span>
              </div>

              <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px', lineHeight: '1.5' }}>
                {property.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                  <span>Size: {property.size}</span>
                  {property.bedrooms && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Bed size={14} />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Bath size={14} />
                      <span>{property.bathrooms}</span>
                    </div>
                  )}
                  {property.kitchen && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ChefHat size={14} />
                      <span>{property.kitchen}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <DollarSign size={16} color="#059669" />
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#059669', marginLeft: '6px' }}>
                  {formatPrice(property.price)}
                </span>
              </div>
              <button
                style={{
                  backgroundColor: '#0f172a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0f172a';
                }}
              >
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <Building size={48} color="#d1d5db" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '16px 0 8px 0' }}>
            No houses found
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}