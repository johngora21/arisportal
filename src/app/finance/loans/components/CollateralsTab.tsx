import React from 'react';
import { MapPin, Building, Bed, Bath, ChefHat, Home, CheckCircle, Clock } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  type: 'land' | 'house' | 'apartment' | 'commercial';
  location: string;
  value: number;
  size?: string;
  bedrooms?: number;
  bathrooms?: number;
  kitchen?: number;
  description?: string;
  verificationStatus: 'approved' | 'pending' | 'rejected';
  acquisitionDate: string;
  image: string;
}

interface CollateralsTabProps {
  myProperties: Property[];
  onPropertyClick: (property: Property) => void;
  onApplyForLoan: (property: Property) => void;
}

export default function CollateralsTab({ myProperties, onPropertyClick, onApplyForLoan }: CollateralsTabProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'land': return <MapPin size={20} color="#10b981" />;
      case 'house': return <Home size={20} color="#3b82f6" />;
      case 'apartment': return <Building size={20} color="#8b5cf6" />;
      case 'commercial': return <Building size={20} color="#f59e0b" />;
      default: return <Building size={20} color="#6b7280" />;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle size={16} />,
          text: 'Approved',
          backgroundColor: '#10b981',
          color: 'white',
          borderColor: '#10b981'
        };
      case 'pending':
        return {
          icon: <Clock size={16} />,
          text: 'Pending',
          backgroundColor: '#f59e0b',
          color: 'white',
          borderColor: '#f59e0b'
        };
      case 'rejected':
        return {
          icon: <Clock size={16} />,
          text: 'Rejected',
          backgroundColor: '#ef4444',
          color: 'white',
          borderColor: '#ef4444'
        };
      default:
        return {
          icon: <Clock size={16} />,
          text: 'Pending',
          backgroundColor: '#f59e0b',
          color: 'white',
          borderColor: '#f59e0b'
        };
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        My Collaterals
      </h2>
      
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        border: '1px solid #0ea5e9', 
        borderRadius: '20px', 
        padding: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Building size={20} color="#0ea5e9" />
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#0c4a6e' }}>
            Property Valuation
          </span>
        </div>
        <p style={{ fontSize: '14px', color: '#0c4a6e', margin: 0 }}>
          Your properties are automatically valued with current market values updated regularly.
        </p>
      </div>
      
      {myProperties.length === 0 ? (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '20px',
          padding: '24px',
          textAlign: 'center',
          border: '2px dashed #d1d5db'
        }}>
          <Building size={48} color="#9ca3af" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '16px 0 8px 0' }}>
            No properties registered
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Add your properties to track their current market value
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {myProperties.map((property) => (
            <div
              key={property.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
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
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                {/* Verification Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: getVerificationBadge(property.verificationStatus).backgroundColor,
                  color: getVerificationBadge(property.verificationStatus).color,
                  border: `1px solid ${getVerificationBadge(property.verificationStatus).borderColor}`,
                  backdropFilter: 'blur(4px)'
                }}>
                  {getVerificationBadge(property.verificationStatus).icon}
                  {getVerificationBadge(property.verificationStatus).text}
                </div>
              </div>
              
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

                {property.description && (
                  <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px', lineHeight: '1.5' }}>
                    {property.description}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                    {property.size && <span>Size: {property.size}</span>}
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
                backgroundColor: '#f9fafb'
              }}>
                {/* Value */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', marginRight: '6px' }}>Value:</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                    {formatPrice(property.value)}
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