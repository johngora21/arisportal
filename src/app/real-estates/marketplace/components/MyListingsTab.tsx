'use client';

import React from 'react';
import { MapPin, DollarSign, Calendar, User, Building, Bed, Bath, ChefHat } from 'lucide-react';
import { Property } from '../types';

interface MyListingsTabProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

export default function MyListingsTab({ properties, onPropertyClick }: MyListingsTabProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        My Property Listings
      </h2>
      
      {properties.length === 0 ? (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center',
          border: '2px dashed #d1d5db'
        }}>
          <Building size={48} color="#9ca3af" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '16px 0 8px 0' }}>
            No listings yet
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            List your first property to see it here
          </p>
        </div>
      ) : (
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
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                    {formatPrice(property.price)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', marginRight: '6px' }}>Value:</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {formatPrice(property.price * 1.2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


