'use client';

import React from 'react';
import { X, MapPin, Bed, Bath, ChefHat, Home, Building, Calendar, User, Phone, Mail, DollarSign, Ruler } from 'lucide-react';

interface PropertyDetails {
  id: string;
  title: string;
  type: 'land' | 'house' | 'apartment' | 'commercial';
  location: string;
  price: number;
  size: string;
  bedrooms?: number;
  bathrooms?: number;
  kitchen?: number;
  images: string[];
  description: string;
  features: string[];
  amenities: string[];
  seller: {
    name: string;
    phone: string;
    email: string;
    role: string;
  };
  listedDate: string;
  status: 'available' | 'sold' | 'pending';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  documents: {
    titleDeed: boolean;
    survey: boolean;
    permits: boolean;
  };
}

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyDetails | null;
  isSelfOwned?: boolean;
}

export default function PropertyDetailsModal({ isOpen, onClose, property, isSelfOwned = false }: PropertyDetailsModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
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
      case 'verified':
        return {
          text: 'Verified',
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          borderColor: '#3b82f6'
        };
      case 'pending':
        return {
          text: 'Pending Verification',
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderColor: '#fde68a'
        };
      case 'rejected':
        return {
          text: 'Verification Failed',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderColor: '#fecaca'
        };
      default:
        return {
          text: 'Pending Verification',
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderColor: '#fde68a'
        };
    }
  };

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
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90vw',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              {getPropertyIcon(property.type)}
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                {property.title}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MapPin size={16} color="#6b7280" />
              <span style={{ fontSize: '16px', color: '#6b7280' }}>
                {property.location}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: getVerificationBadge(property.verificationStatus).backgroundColor,
                color: getVerificationBadge(property.verificationStatus).color,
                border: `1px solid ${getVerificationBadge(property.verificationStatus).borderColor}`
              }}>
                {getVerificationBadge(property.verificationStatus).text}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Images Gallery with Price */}
          <div style={{ marginBottom: '32px', position: 'relative' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '8px',
              height: '300px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                backgroundImage: `url(${property.images[0] || '/api/placeholder/600/300'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              <div style={{
                backgroundImage: `url(${property.images[1] || '/api/placeholder/300/300'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              <div style={{
                backgroundImage: `url(${property.images[2] || '/api/placeholder/300/300'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
            </div>
          </div>
          
          {/* Price */}
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#059669',
            marginBottom: '32px'
          }}>
            {formatPrice(property.price)}
          </div>

          <div>
            {/* Contact Info */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
                Contact Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Name:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {property.seller.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Role:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {property.seller.role}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Phone:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {property.seller.phone}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Email:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {property.seller.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Plot Details - Only for land properties */}
            {property.type === 'land' && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
                  Plot Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Locality:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Chigongwe' : property.id === '2' ? 'Kinondoni' : 'Masaki'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Block:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? '2AC' : property.id === '2' ? '3BD' : '1AB'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Lot Number:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? '53' : property.id === '2' ? '127' : '89'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Legal Area:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? '1,778.00 sqm' : property.id === '2' ? '2,450.00 sqm' : '1,200.00 sqm'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Lot Type:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Plot</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Region:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Dodoma' : 'Dar es Salaam'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>District:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Dodoma' : property.id === '2' ? 'Kinondoni' : 'Ilala'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Council:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Halmashauri ya Jiji Dodoma' : property.id === '2' ? 'Kinondoni Municipal Council' : 'Ilala Municipal Council'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Lot Use:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Residence' : property.id === '2' ? 'Commercial' : 'Mixed Use'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Seller Type:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Individual Owner' : property.id === '2' ? 'Company' : 'Individual Owner'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Payment Terms:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Cash' : property.id === '2' ? 'Installments' : 'Cash'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Building Details - Only for building properties */}
            {property.type !== 'land' && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
                  Building Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Property Type:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.type === 'house' ? 'House' : property.type === 'apartment' ? 'Apartment' : 'Commercial'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Ruler size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Area:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.size}</span>
                  </div>
                  {property.bedrooms && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bed size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Bedrooms:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bath size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Bathrooms:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.bathrooms}</span>
                    </div>
                  )}
                  {property.kitchen && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ChefHat size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Kitchen:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.kitchen}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Year Built:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? '2020' : property.id === '2' ? '2018' : '2022'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Condition:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Excellent' : property.id === '2' ? 'Good' : 'New'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Furnishing:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Semi-Furnished' : property.id === '2' ? 'Fully Furnished' : 'Unfurnished'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Parking:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? '2 Cars' : property.id === '2' ? '1 Car' : '3 Cars'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Security:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? '24/7 Guard' : property.id === '2' ? 'CCTV' : 'Gated Community'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Utilities:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Water & Electricity' : property.id === '2' ? 'All Utilities' : 'Water Only'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Location Details - Only for building properties */}
            {property.type !== 'land' && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
                  Location Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Street:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Mikocheni Street' : property.id === '2' ? 'Masaki Avenue' : 'Kinondoni Road'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Ward:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Mikocheni' : property.id === '2' ? 'Masaki' : 'Kinondoni'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>District:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Kinondoni' : property.id === '2' ? 'Ilala' : 'Kinondoni'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Region:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Dar es Salaam</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Council:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Kinondoni Municipal Council' : property.id === '2' ? 'Ilala Municipal Council' : 'Kinondoni Municipal Council'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Postal Code:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? '14110' : property.id === '2' ? '11101' : '14120'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Nearby Landmarks:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Mikocheni Hospital' : property.id === '2' ? 'Masaki Beach' : 'Kinondoni Market'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Access Road:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.id === '1' ? 'Tarmac' : property.id === '2' ? 'Tarmac' : 'Gravel'}
                    </span>
                  </div>
                </div>
              </div>
            )}


            {/* Description */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                Description
              </h3>
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.features.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                  Features
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '16px',
                        fontSize: '12px',
                        color: '#374151'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ textAlign: 'right' }}>
              {isSelfOwned ? (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    List for Sale
                  </button>
                  <button style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Get Valuation
                  </button>
                </div>
              ) : (
                <button style={{
                  padding: '12px 32px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Send Offer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
