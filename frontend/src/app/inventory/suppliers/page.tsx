'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, CheckCircle, Phone, Mail, Globe, Star, Plus, Tag } from 'lucide-react';
import SuppliersService, { SupplierCategory } from '../models/suppliersService';
import { Supplier } from '../models/supplier';

function SuppliersModule() {
  const [supplierCountryFilter, setSupplierCountryFilter] = useState('');
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [categories, setCategories] = useState<SupplierCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [mediaIndex, setMediaIndex] = useState<number>(0);
  
  // Utility function to ensure we're using URLs, not base64
  const getValidImageUrl = (url: string): string => {
    if (!url) return '';
    // If it's base64 data, return empty string (we don't want base64)
    if (url.startsWith('data:')) return '';
    // If it's a relative URL, make it absolute
    if (url.startsWith('/')) return `http://localhost:4001${url}`;
    // If it's already a full URL, return as is
    return url;
  };

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    category: '',
    location: '',
    country: '',
    priceRange: '',
    bulkDiscount: '',
    minOrder: '',
    leadTime: '',
    returnPolicy: '',
    warranty: '',
    deliveryTerms: '',
    established: '',
    tags: '',
    languages: '',
    certifications: '',
    paymentMethods: '',
    deliveryAreas: '',
    contact: {
      phone: '',
      email: '',
      website: '',
      address: ''
    },
    customerReviews: []
  });

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
    'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
    'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia',
    'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
    'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
    'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
    'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
    'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco',
    'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
    'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine',
    'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
    'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
    'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
    'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
    'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
    'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen', 'Zambia', 'Zimbabwe'
  ];

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const fetchedCategories = await SuppliersService.getCategories();
      console.log('Fetched categories:', fetchedCategories);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    setIsLoadingSuppliers(true);
    try {
      const fetchedSuppliers = await SuppliersService.getSuppliers();
      setSuppliers(fetchedSuppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  // Handle add category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      const newCategory = await SuppliersService.createCategory(newCategoryName.trim());
      if (newCategory) {
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const success = await SuppliersService.deleteCategory(categoryId);
      if (success) {
        setCategories(categories.filter(cat => cat.id !== categoryId));
        alert('Category deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
      alert(`Error: ${errorMessage}`);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
  };

  // Handle video selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedVideos(prev => [...prev, ...files]);
  };

  // Remove image
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove video
  const removeVideo = (index: number) => {
    setSelectedVideos(prev => prev.filter((_, i) => i !== index));
  };

  // Load data on component mount
  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Add Supplier Button */}
      <div style={{ marginBottom: '24px', marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          onClick={() => setShowCategoriesModal(true)}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--mc-sidebar-bg-hover)',
            border: '1px solid var(--mc-sidebar-bg-hover)',
            borderRadius: '20px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--mc-sidebar-bg-hover)';
          }}
        >
          <Tag size={16} />
          Categories
        </button>
        
        <button
          onClick={() => setShowAddSupplierModal(true)}
          style={{
            backgroundColor: 'var(--mc-sidebar-bg-hover)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
          }}
        >
          <Plus size={16} />
          Add Supplier
        </button>
      </div>

      {/* Search Bar and Filters */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <input
            type="text"
            placeholder="Search suppliers..."
            style={{
              width: '300px',
              padding: '12px 16px 12px 44px',
              border: '1px solid #e5e7eb',
              borderRadius: '24px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--mc-sidebar-bg-hover)';
              e.target.style.boxShadow = '0 0 0 3px rgba(51, 65, 85, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          />
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        
        <select
          value={supplierCountryFilter}
          onChange={(e) => setSupplierCountryFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '24px',
            fontSize: '14px',
            backgroundColor: 'white',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            flex: '0 0 auto',
            cursor: 'pointer'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#C50F11';
            e.target.style.boxShadow = '0 0 0 3px rgba(197, 15, 17, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {/* Supplier Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {isLoadingSuppliers ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading suppliers...</div>
          </div>
        ) : suppliers.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>No suppliers found. Add your first supplier!</div>
          </div>
        ) : suppliers.filter(supplier => 
          !supplierCountryFilter || supplier.location?.country === supplierCountryFilter
        ).map((supplier, index) => (
          <div 
            key={index} 
            style={{ 
              background: 'white', 
              border: '1px solid #e5e7eb', 
              borderRadius: '20px', 
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
            onClick={async () => {
              // Fetch full supplier details including media
              const fullSupplier = await SuppliersService.getSupplier(supplier.id);
              setSelectedSupplier(fullSupplier || supplier);
              setMediaIndex(0); // Reset media index when opening modal
              setShowSupplierModal(true);
            }}
          >
            {/* Verification Badge */}
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 1
            }}>
              <CheckCircle size={10} />
              Verified
            </div>
            {/* Company Name */}
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1f2937', 
              margin: '0 0 8px 0'
            }}>
                {supplier.name}
              </h3>

            {/* Category (location moved to footer) */}
                <div style={{ 
              fontSize: '13px', 
              color: '#6b7280',
              marginBottom: '8px'
                }}>
                  {Array.isArray(supplier.categories) ? supplier.categories.join(', ') : (supplier.category || 'N/A')}
                </div>

            {/* Pricing Info */}
            <div style={{ 
              marginBottom: '12px',
              fontSize: '12px'
            }}>
              <div style={{ color: '#6b7280', marginBottom: '2px' }}>Min Order</div>
              <div style={{ fontWeight: '600', color: '#059669', fontSize: '14px' }}>
                {supplier.minimumOrderQuantity ? `${supplier.minimumOrderQuantity} ${supplier.minimumOrderUnit || 'units'}` : (supplier.minOrder || 'N/A')}
              </div>
              <div style={{ color: '#f59e0b', fontSize: '11px', marginTop: '2px' }}>
                {Array.isArray(supplier.bulkDiscounts) ? supplier.bulkDiscounts.join(', ') : (supplier.bulkDiscount || 'N/A')}
              </div>
            </div>

            {/* Key Info Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px',
              marginBottom: '16px',
              fontSize: '12px'
            }}>
                <div>
                <div style={{ color: '#6b7280', marginBottom: '2px' }}>Min Order</div>
                  <div style={{ fontWeight: '500', color: '#1f2937' }}>
                    {supplier.minimumOrderQuantity ? `${supplier.minimumOrderQuantity} ${supplier.minimumOrderUnit || 'units'}` : (supplier.minOrder || 'N/A')}
                  </div>
                </div>
                <div>
                <div style={{ color: '#6b7280', marginBottom: '2px' }}>Lead Time</div>
                  <div style={{ fontWeight: '500', color: '#1f2937' }}>
                    {supplier.standardLeadTimeDays ? `${supplier.standardLeadTimeDays} days` : (supplier.leadTime || 'N/A')}
                  </div>
              </div>
            </div>


            {/* Footer */}
            <div style={{
              padding: '6px 16px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <MapPin size={12} />
                {supplier.city || supplier.location || 'N/A'}
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  backgroundColor: 'transparent',
                  color: 'var(--mc-sidebar-bg)',
                  border: '1px solid var(--mc-sidebar-bg)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--mc-sidebar-bg)';
                }}
                >
                  Portfolio
                </button>
                
                <button style={{
                  backgroundColor: 'var(--mc-sidebar-bg-hover)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                }}
                >
                  Contact
                </button>
                </div>
                </div>
          </div>
        ))}
      </div>

      {/* Supplier Details Modal */}
      {showSupplierModal && selectedSupplier && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: 'min(900px, 95vw)',
            maxHeight: '95vh',
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowSupplierModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '20px',
                color: '#6b7280',
                zIndex: 1002,
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              ✕
            </button>

            {/* Scrollable Content Container */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {/* Media gallery (images/videos) */}
              {(() => {
                const images = selectedSupplier.images || [];
                const videos = selectedSupplier.videos || [];
                const mediaItems: Array<{ type: 'image' | 'video'; src: string }> = [
                  ...images.map((src: string) => ({ type: 'image' as const, src })),
                  ...videos.map((src: string) => ({ type: 'video' as const, src }))
                ];
                if (mediaItems.length === 0) return null;
                const current = mediaItems[Math.min(mediaIndex, mediaItems.length - 1)];
                return (
                  <div style={{ position: 'relative', width: '100%', height: '380px', overflow: 'hidden', backgroundColor: '#000' }}>
                    {current.type === 'image' ? (
                      <img src={getValidImageUrl(current.src)} alt={selectedSupplier.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <video src={getValidImageUrl(current.src)} controls style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    )}
                    {/* Status badge on media */}
                    {selectedSupplier.verificationStatus === 'verified' && (
                      <div style={{
                        position: 'absolute', top: '14px', left: '14px', padding: '8px 12px',
                        backgroundColor: '#10b981', color: 'white',
                        borderRadius: 9999, fontSize: 12, fontWeight: 700
                      }}>
                        Verified
                      </div>
                    )}
                    {mediaItems.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); setMediaIndex((i) => (i - 1 + mediaItems.length) % mediaItems.length); }}
                          style={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none', borderRadius: 9999, width: 32, height: 32, cursor: 'pointer' }}
                          aria-label="Previous"
                        >
                          ‹
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setMediaIndex((i) => (i + 1) % mediaItems.length); }}
                          style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none', borderRadius: 9999, width: 32, height: 32, cursor: 'pointer' }}
                          aria-label="Next"
                        >
                          ›
                        </button>
                        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                          {mediaItems.map((_, idx) => (
                            <span key={idx} style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: idx === Math.min(mediaIndex, mediaItems.length - 1) ? '#10b981' : 'rgba(255,255,255,0.6)' }} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Content Area with Padding */}
              <div style={{ padding: '32px' }}>
              {/* Header */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {selectedSupplier.name}
                  </h2>
                  <div style={{ 
                    backgroundColor: '#10b981', 
                    color: 'white', 
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '12px', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle size={12} />
                    Verified
                  </div>
                </div>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>
                  {Array.isArray(selectedSupplier.categories) ? selectedSupplier.categories.join(', ') : (selectedSupplier.category || 'N/A')} • {selectedSupplier.city || selectedSupplier.location || 'N/A'}
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                      Contact Information
                    </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.primaryContactPhone || selectedSupplier.phone || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.primaryContactEmail || selectedSupplier.email || 'N/A'}</span>
                      </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Globe size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.website || 'N/A'}</span>
                        </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.address || 'N/A'}</span>
                      </div>
                    </div>
              </div>

            {/* Pricing & Business Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Pricing & Orders
                </h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Price Range</div>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: '#059669' }}>
                    {Array.isArray(selectedSupplier.pricingTiers) && selectedSupplier.pricingTiers.length > 0 
                      ? selectedSupplier.pricingTiers.join(', ') 
                      : (selectedSupplier.priceRange || 'Contact for pricing')}
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Bulk Discount</div>
                  <div style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '500' }}>
                    {Array.isArray(selectedSupplier.bulkDiscounts) && selectedSupplier.bulkDiscounts.length > 0 
                      ? selectedSupplier.bulkDiscounts.join(', ') 
                      : (selectedSupplier.bulkDiscount || 'Contact for bulk pricing')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Minimum Order</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedSupplier.minimumOrderQuantity ? `${selectedSupplier.minimumOrderQuantity} ${selectedSupplier.minimumOrderUnit || 'units'}` : (selectedSupplier.minOrder || 'N/A')}
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Business Details
                </h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Lead Time</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedSupplier.standardLeadTimeDays ? `${selectedSupplier.standardLeadTimeDays} days` : (selectedSupplier.leadTime || 'N/A')}
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Return Policy</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedSupplier.returnPolicy || 'Contact supplier for details'}
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Warranty</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedSupplier.warranty || 'Contact supplier for details'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Delivery Terms</div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    {selectedSupplier.deliveryTerms || 'Contact supplier for details'}
                  </div>
                </div>
              </div>
            </div>

            {/* Products & Services */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Products & Services
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Product Specialties</div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      {Array.isArray(selectedSupplier.specialties) && selectedSupplier.specialties.length > 0 
                        ? selectedSupplier.specialties.join(', ') 
                        : 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Payment Methods</div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      {Array.isArray(selectedSupplier.paymentMethods) && selectedSupplier.paymentMethods.length > 0 
                        ? selectedSupplier.paymentMethods.join(', ') 
                        : 'Not specified'}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Delivery Methods</div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      {Array.isArray(selectedSupplier.deliveryMethods) && selectedSupplier.deliveryMethods.length > 0 
                        ? selectedSupplier.deliveryMethods.join(', ') 
                        : 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                
                <button style={{
                  backgroundColor: 'var(--mc-sidebar-bg-hover)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                }}
                >
                  Contact Supplier
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddSupplierModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: 'min(800px, 90vw)',
            maxHeight: '90vh',
            borderRadius: '20px',
            padding: '24px',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowAddSupplierModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '20px',
                color: '#6b7280'
              }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Add New Supplier
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
                Enter comprehensive supplier information for better management.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                // Process form data to match the database schema
                const processedData = {
                  name: supplierForm.name,
                  legalName: supplierForm.name, // Use company name as legal name
                  registrationNumber: `REG-${Date.now()}`, // Generate a unique registration number
                  taxId: `TAX-${Date.now()}`, // Generate a unique tax ID
                  city: supplierForm.location,
                  region: supplierForm.location, // Use location as region for now
                  country: supplierForm.country,
                  address: supplierForm.contact.address,
                  website: supplierForm.contact.website,
                  primaryContactName: supplierForm.name, // Use company name as primary contact
                  primaryContactTitle: 'Manager', // Default title
                  primaryContactPhone: supplierForm.contact.phone,
                  primaryContactEmail: supplierForm.contact.email,
                  categories: supplierForm.category ? [supplierForm.category] : [],
                  specialties: supplierForm.tags ? supplierForm.tags.split(',').map(s => s.trim()) : [],
                  paymentMethods: supplierForm.paymentMethods ? supplierForm.paymentMethods.split(',').map(s => s.trim()) : [],
                  deliveryMethods: supplierForm.deliveryAreas ? supplierForm.deliveryAreas.split(',').map(s => s.trim()) : [],
                  minimumOrderQuantity: supplierForm.minOrder ? parseInt(supplierForm.minOrder.replace(/\D/g, '')) : null,
                  minimumOrderUnit: supplierForm.minOrder ? supplierForm.minOrder.replace(/\d/g, '').trim() : null,
                  standardLeadTimeDays: supplierForm.leadTime ? parseInt(supplierForm.leadTime.replace(/\D/g, '')) : null,
                  returnPolicy: supplierForm.returnPolicy,
                  warranty: supplierForm.warranty,
                  deliveryTerms: supplierForm.deliveryTerms,
                  pricingTiers: supplierForm.priceRange ? [supplierForm.priceRange] : [],
                  bulkDiscounts: supplierForm.bulkDiscount ? [supplierForm.bulkDiscount] : [],
                  images: await Promise.all(selectedImages.map(async (file) => {
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      const response = await fetch('http://localhost:4001/api/v1/upload-image', {
                        method: 'POST',
                        body: formData
                      });
                      const result = await response.json();
                      return result.url;
                    } catch (error) {
                      console.error('Error uploading image:', error);
                      return null;
                    }
                  })).then(urls => urls.filter(url => url !== null)),
                  videos: await Promise.all(selectedVideos.map(async (file) => {
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      const response = await fetch('http://localhost:4001/api/v1/upload-video', {
                        method: 'POST',
                        body: formData
                      });
                      const result = await response.json();
                      return result.url;
                    } catch (error) {
                      console.error('Error uploading video:', error);
                      return null;
                    }
                  })).then(urls => urls.filter(url => url !== null)),
                  status: 'active',
                  verificationStatus: 'verified'
                };

                console.log('Supplier data:', processedData);
                
                // Create supplier via API
                const newSupplier = await SuppliersService.createSupplier(processedData as any);
                if (newSupplier) {
                  alert('Supplier added successfully!');
                  // Refresh suppliers list
                  await fetchSuppliers();
                } else {
                  alert('Failed to add supplier. Please try again.');
                }
                
                // Reset form
                setSupplierForm({
                  name: '',
                  category: '',
                  location: '',
                  country: '',
                  priceRange: '',
                  bulkDiscount: '',
                  minOrder: '',
                  leadTime: '',
                  returnPolicy: '',
                  warranty: '',
                  deliveryTerms: '',
                  established: '',
                  tags: '',
                  languages: '',
                  certifications: '',
                  paymentMethods: '',
                  deliveryAreas: '',
                  contact: {
                    phone: '',
                    email: '',
                    website: '',
                    address: ''
                  },
                  customerReviews: []
                });
                setSelectedImages([]);
                setSelectedVideos([]);
                setShowAddSupplierModal(false);
              } catch (error) {
                console.error('Error adding supplier:', error);
                alert('Error adding supplier: ' + (error as Error).message);
              } finally {
                setIsSubmitting(false);
              }
            }}>
              {/* Basic Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  Basic Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Company Name *</label>
                    <input
                      type="text"
                      value={supplierForm.name}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Category *</label>
                    <select
                      value={supplierForm.category}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, category: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    >
                      <option value="">Select Category</option>
                      {isLoadingCategories ? (
                        <option disabled>Loading categories...</option>
                      ) : categories.length === 0 ? (
                        <option disabled>No categories available. Add categories first.</option>
                      ) : (
                        categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Location *</label>
                    <input
                      type="text"
                      value={supplierForm.location}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, location: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Country *</label>
                    <select
                      value={supplierForm.country}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, country: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  Contact Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Phone *</label>
                    <input
                      type="tel"
                      value={supplierForm.contact.phone}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Email *</label>
                    <input
                      type="email"
                      value={supplierForm.contact.email}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Website</label>
                    <input
                      type="url"
                      value={supplierForm.contact.website}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, contact: { ...prev.contact, website: e.target.value } }))}
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Address *</label>
                    <input
                      type="text"
                      value={supplierForm.contact.address}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Business Details */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  Pricing & Business Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Price Range *</label>
                    <input
                      type="text"
                      value={supplierForm.priceRange}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, priceRange: e.target.value }))}
                      placeholder="e.g., TZS 45,000 - 120,000"
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Bulk Discount</label>
                    <input
                      type="text"
                      value={supplierForm.bulkDiscount}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, bulkDiscount: e.target.value }))}
                      placeholder="e.g., 10% off 100+ units"
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Minimum Order *</label>
                    <input
                      type="text"
                      value={supplierForm.minOrder}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, minOrder: e.target.value }))}
                      placeholder="e.g., 50 units"
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Lead Time *</label>
                    <input
                      type="text"
                      value={supplierForm.leadTime}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, leadTime: e.target.value }))}
                      placeholder="e.g., 7 days"
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Return Policy</label>
                    <input
                      type="text"
                      value={supplierForm.returnPolicy}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, returnPolicy: e.target.value }))}
                      placeholder="e.g., 30 days return policy"
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Warranty</label>
                    <input
                      type="text"
                      value={supplierForm.warranty}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, warranty: e.target.value }))}
                      placeholder="e.g., 1 year warranty"
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Delivery Terms</label>
                    <input
                      type="text"
                      value={supplierForm.deliveryTerms}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, deliveryTerms: e.target.value }))}
                      placeholder="e.g., FOB, CIF, EXW"
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>


              {/* Products & Services */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  Products & Services
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Product Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={supplierForm.tags}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="e.g., Laptops, Phones, Tablets, Accessories"
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Payment Methods (comma-separated)</label>
                    <input
                      type="text"
                      value={supplierForm.paymentMethods}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, paymentMethods: e.target.value }))}
                      placeholder="e.g., Bank Transfer, Mobile Money, Credit Card"
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Delivery Areas (comma-separated)</label>
                    <input
                      type="text"
                      value={supplierForm.deliveryAreas}
                      onChange={(e) => setSupplierForm(prev => ({ ...prev, deliveryAreas: e.target.value }))}
                      placeholder="e.g., Dar es Salaam, Arusha, Mwanza, Dodoma"
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Product Media */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  Product Media
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Product Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                      Select multiple images (JPG, PNG, max 5MB each)
                    </p>
                    
                    {/* Show selected images */}
                    {selectedImages.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                          Selected Images ({selectedImages.length}):
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {selectedImages.map((file, index) => (
                            <div key={index} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              backgroundColor: '#f3f4f6',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px'
                            }}>
                              <span>{file.name}</span>
                              <button 
                                type="button"
                                onClick={() => removeImage(index)}
                      style={{
                                  background: 'none', 
                                  border: 'none', 
                                  color: '#ef4444', 
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Product Videos</label>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoChange}
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
                    />
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                      Select multiple videos (MP4, MOV, max 50MB each)
                    </p>
                    
                    {/* Show selected videos */}
                    {selectedVideos.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                          Selected Videos ({selectedVideos.length}):
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {selectedVideos.map((file, index) => (
                            <div key={index} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              backgroundColor: '#f3f4f6',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px'
                            }}>
                              <span>{file.name}</span>
                              <button 
                                type="button"
                                onClick={() => removeVideo(index)}
                                style={{ 
                                  background: 'none', 
                                  border: 'none', 
                                  color: '#ef4444', 
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting ? '#9ca3af' : 'var(--mc-sidebar-bg-hover)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Adding...' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {showCategoriesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: 'min(600px, 90vw)',
            maxHeight: '80vh',
            borderRadius: '20px',
            padding: '24px',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowCategoriesModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '20px',
                color: '#6b7280'
              }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Supplier Categories
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
                Manage supplier categories for better organization.
              </p>
            </div>

            {/* Add New Category */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                Add New Category
              </h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg-hover)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(51, 65, 85, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  onClick={handleAddCategory}
                  style={{
                    backgroundColor: 'var(--mc-sidebar-bg-hover)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Categories List */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        {category.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#ef4444';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#ef4444';
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCategoriesModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function SuppliersPage() {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <SuppliersModule />
    </div>
  );
} 
        