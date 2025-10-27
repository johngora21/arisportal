'use client';

import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, ChefHat, Home, Building, Calendar, User, Phone, Mail, DollarSign, Ruler, ChevronLeft, ChevronRight, Play } from 'lucide-react';

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
  yearBuilt?: number;
  furnishing?: string;
  parking?: string;
  utilities?: string;
  propertyType?: string;
  estimatedValue?: number;
  features: string[];
  locality?: string;
  block?: string;
  lotNumber?: string;
  legalArea?: string;
  lotUse?: string;
  region?: string;
  district?: string;
  ward?: string;
  street?: string;
  council?: string;
  latitude?: number;
  longitude?: number;
  ownerName?: string;
  role?: string;
  phoneNumber?: string;
  email?: string;
  contactName?: string;
  contactRole?: string;
  contactPhone?: string;
  contactEmail?: string;
  images: string[];
  description: string;
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const nextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i) || url.includes('youtube.com') || url.includes('vimeo.com');
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
        borderRadius: '20px',
        width: '90vw',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'relative'
      }}>
        {/* Close Button - Top right corner of modal */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#000000',
            zIndex: 1000,
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {/* Full Width Image/Video Carousel - At the very top */}
        <div style={{ position: 'relative' }}>
          
          <div style={{
            width: '100%',
            height: '400px',
            borderRadius: '20px 20px 0 0',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#f3f4f6'
          }}>
            {property.images && property.images.length > 0 ? (
              <>
                {/* Main Image/Video Display */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${property.images[currentImageIndex]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isVideo(property.images[currentImageIndex]) ? (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Play size={32} color="white" />
                    </div>
                  ) : null}
                </div>

                {/* Navigation Arrows */}
                {property.images && property.images.length > 0 && (
                  <>
                    <button
                      onClick={prevImage}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={nextImage}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {property.images.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Image Counter - Only show if more than 1 image */}
                {property.images.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                )}
              </>
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                fontSize: '16px'
              }}>
                No images available
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div style={{
          padding: '24px 24px 0 24px'
        }}>
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
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          
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
                    {property.ownerName || property.contactName || property.seller?.name || 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Role:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {property.role || property.contactRole || property.seller?.role || 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Phone:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {property.phoneNumber || property.contactPhone || property.seller?.phone || 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Email:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {property.email || property.contactEmail || property.seller?.email || 'N/A'}
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
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Estimated Value:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {property.estimatedValue ? `TZS ${property.estimatedValue}` : 'N/A'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Locality:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.locality || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Block:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.block || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Lot Number:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.lotNumber || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Legal Area:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.legalArea || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Lot Use:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.lotUse || 'N/A'}</span>
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
                      {property.propertyType && property.propertyType !== 'N/A' ? property.propertyType : 
                       property.type === 'house' ? 'House' : 
                       property.type === 'apartment' ? 'Apartment' : 
                       property.type === 'commercial' ? 'Commercial' : 
                       property.type === 'land' ? 'Land' : 'N/A'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Ruler size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Size:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.size || 'N/A'}</span>
                  </div>
                  {property.bedrooms !== undefined && property.bedrooms !== null ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bed size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Bedrooms:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.bedrooms}</span>
                    </div>
                  ) : null}
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
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.yearBuilt || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Home size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Furnishing:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.furnishing || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Parking:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.parking || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Utilities:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.utilities || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Location Details */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
                  Location Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Region:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.region || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>District:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.district || 'N/A'}</span>
                </div>
                {property.type !== 'land' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Ward:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.ward || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Street:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.street || 'N/A'}</span>
                  </div>
                  </>
                )}
                {property.type === 'land' && (
                  <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Council:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.council || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Locality:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.locality || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Block:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.block || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Lot Number:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.lotNumber || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Legal Area:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.legalArea || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Lot Use:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.lotUse || 'N/A'}</span>
                    </div>
                  </>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Latitude:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.latitude || 'N/A'}</span>
                  </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Longitude:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.longitude || 'N/A'}</span>
                </div>
              </div>
            </div>


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
            {property.features && property.features.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                  Features
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {property.features.map((feature: string, index: number) => (
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
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    List for Sale
                  </button>
                  <button style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--mc-sidebar-bg-hover)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
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
                  backgroundColor: 'var(--mc-sidebar-bg-hover)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
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
