'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, CheckCircle, Phone, Mail, Globe, Star } from 'lucide-react';

// Declare Leaflet types
declare const L: any;

export function SuppliersModule() {
  const [supplierCountryFilter, setSupplierCountryFilter] = useState('');
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

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

  // Initialize map when supplier modal opens
  useEffect(() => {
    if (showSupplierModal && mapRef.current && !mapInstanceRef.current && selectedSupplier?.coordinates) {
      const map = L.map(mapRef.current).setView(
        [selectedSupplier.coordinates.lat, selectedSupplier.coordinates.lng], 
        15
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([selectedSupplier.coordinates.lat, selectedSupplier.coordinates.lng]).addTo(map);
      marker.bindPopup(`
        <div style="padding: 8px; font-family: 'Poppins', sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
            ${selectedSupplier.name}
          </h3>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
            ${selectedSupplier.contact.address}
          </p>
          <p style="margin: 0; font-size: 14px; color: #059669; font-weight: 600;">
            ${selectedSupplier.contact.phone}
          </p>
        </div>
      `).openPopup();

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current = null;
      }
    };
  }, [showSupplierModal, selectedSupplier]);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      

      {/* Search Bar and Filters */}
      <div style={{ marginBottom: '16px', marginTop: '48px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
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
              e.target.style.borderColor = 'var(--mc-sidebar-bg)';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
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
            e.target.style.borderColor = 'var(--mc-sidebar-bg)';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
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
        {[
          { 
            name: 'TechHub Ltd', 
            category: 'Electronics', 
            minOrder: '50 units', 
            leadTime: '7 days', 
            rating: '4.8/5', 
            location: 'Dar es Salaam',
            country: 'Tanzania',
            priceRange: 'TZS 45,000 - 120,000',
            bulkDiscount: '10% off 100+ units',
            tags: ['Laptops', 'Phones', 'Tablets', 'Accessories'],
            // Extended details
            contact: {
              phone: '+255 22 123 4567',
              email: 'sales@techhub.co.tz',
              website: 'www.techhub.co.tz',
              address: '123 Tech Street, Masaki, Dar es Salaam'
            },
            coordinates: { lat: -6.7789, lng: 39.2567 },
            established: '2018',
            employees: '51-200',
            certifications: ['ISO 9001', 'CE Marking', 'FCC Certified'],
            paymentMethods: ['Bank Transfer', 'Mobile Money', 'Credit Card', 'Cash'],
            deliveryAreas: ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma'],
            warranty: '2 years',
            returnPolicy: '30 days',
            customerReviews: [
              { name: 'John M.', rating: 5, comment: 'Excellent service and quality products' },
              { name: 'Sarah K.', rating: 4, comment: 'Fast delivery and good prices' },
              { name: 'Ahmed H.', rating: 5, comment: 'Professional team, highly recommended' }
            ],
            specialties: ['Custom Electronics', 'Bulk Orders', 'Technical Support', 'Warranty Service'],
            languages: ['English', 'Swahili', 'French']
          },
          { 
            name: 'OfficePro', 
            category: 'Furniture', 
            minOrder: '20 units', 
            leadTime: '14 days', 
            rating: '4.6/5', 
            location: 'Arusha',
            country: 'Tanzania',
            priceRange: 'TZS 85,000 - 250,000',
            bulkDiscount: '15% off 50+ units',
            tags: ['Desks', 'Chairs', 'Storage', 'Office Supplies'],
            // Extended details
            contact: {
              phone: '+255 27 234 5678',
              email: 'info@officepro.co.tz',
              website: 'www.officepro.co.tz',
              address: '456 Business Avenue, Arusha'
            },
            coordinates: { lat: -3.3869, lng: 36.6830 },
            established: '2020',
            employees: '11-50',
            certifications: ['ISO 14001', 'FSC Certified'],
            paymentMethods: ['Bank Transfer', 'Mobile Money', 'Cash'],
            deliveryAreas: ['Arusha', 'Kilimanjaro', 'Manyara'],
            warranty: '1 year',
            returnPolicy: '14 days',
            customerReviews: [
              { name: 'Maria L.', rating: 4, comment: 'Good quality furniture at reasonable prices' },
              { name: 'Peter W.', rating: 5, comment: 'Great customer service and delivery' }
            ],
            specialties: ['Custom Furniture', 'Office Design', 'Installation Service'],
            languages: ['English', 'Swahili']
          },
          { 
            name: 'SoundMax', 
            category: 'Electronics', 
            minOrder: '100 units', 
            leadTime: '5 days', 
            rating: '4.9/5', 
            location: 'Mwanza',
            country: 'Tanzania',
            priceRange: 'TZS 35,000 - 95,000',
            bulkDiscount: '12% off 200+ units',
            tags: ['Speakers', 'Headphones', 'Audio Systems', 'Microphones'],
            // Extended details
            contact: {
              phone: '+255 28 345 6789',
              email: 'contact@soundmax.co.tz',
              website: 'www.soundmax.co.tz',
              address: '789 Audio Lane, Mwanza'
            },
            coordinates: { lat: -2.5164, lng: 32.9178 },
            established: '2019',
            employees: '51-200',
            certifications: ['ISO 9001', 'THX Certified', 'Dolby Atmos'],
            paymentMethods: ['Bank Transfer', 'Mobile Money', 'Credit Card'],
            deliveryAreas: ['Mwanza', 'Shinyanga', 'Geita', 'Simiyu'],
            warranty: '3 years',
            returnPolicy: '45 days',
            customerReviews: [
              { name: 'David K.', rating: 5, comment: 'Best audio equipment in the region' },
              { name: 'Grace M.', rating: 5, comment: 'Professional installation and support' },
              { name: 'James R.', rating: 4, comment: 'High quality products, fast delivery' }
            ],
            specialties: ['Professional Audio', 'Custom Installations', 'Technical Support'],
            languages: ['English', 'Swahili', 'French']
          },
          { 
            name: 'ComfortZone', 
            category: 'Furniture', 
            minOrder: '15 units', 
            leadTime: '21 days', 
            rating: '4.7/5', 
            location: 'Dodoma',
            country: 'Tanzania',
            priceRange: 'TZS 95,000 - 280,000',
            bulkDiscount: '8% off 30+ units',
            tags: ['Sofas', 'Tables', 'Beds', 'Wardrobes'],
            // Extended details
            contact: {
              phone: '+255 26 456 7890',
              email: 'hello@comfortzone.co.tz',
              website: 'www.comfortzone.co.tz',
              address: '321 Comfort Road, Dodoma'
            },
            coordinates: { lat: -6.1630, lng: 35.7516 },
            established: '2017',
            employees: '11-50',
            certifications: ['ISO 9001', 'OEKO-TEX Standard'],
            paymentMethods: ['Bank Transfer', 'Mobile Money', 'Cash'],
            deliveryAreas: ['Dodoma', 'Singida', 'Tabora'],
            warranty: '2 years',
            returnPolicy: '21 days',
            customerReviews: [
              { name: 'Anna S.', rating: 5, comment: 'Beautiful furniture, excellent craftsmanship' },
              { name: 'Michael T.', rating: 4, comment: 'Good value for money' }
            ],
            specialties: ['Custom Furniture', 'Interior Design', 'Assembly Service'],
            languages: ['English', 'Swahili']
          }
        ].filter(supplier => 
          !supplierCountryFilter || supplier.country === supplierCountryFilter
        ).map((supplier, i) => (
          <div 
            key={i} 
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
            onClick={() => {
              setSelectedSupplier(supplier);
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
              {supplier.category}
            </div>

            {/* Pricing Info */}
            <div style={{ 
              marginBottom: '12px',
              fontSize: '12px'
            }}>
              <div style={{ color: '#6b7280', marginBottom: '2px' }}>Price Range</div>
              <div style={{ fontWeight: '600', color: '#059669', fontSize: '14px' }}>{supplier.priceRange}</div>
              <div style={{ color: '#f59e0b', fontSize: '11px', marginTop: '2px' }}>{supplier.bulkDiscount}</div>
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
                <div style={{ fontWeight: '500', color: '#1f2937' }}>{supplier.minOrder}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', marginBottom: '2px' }}>Lead Time</div>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>{supplier.leadTime}</div>
              </div>
            </div>

            {/* Product Tags */}
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '12px'
            }}>
              {supplier.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#f9fafb',
                    color: '#6b7280',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '500',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  {tag}
                </span>
              ))}
              {supplier.tags.length > 3 && (
                <span
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    border: '1px solid #d1d5db'
                  }}
                >
                  +{supplier.tags.length - 3}
                </span>
              )}
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
                {supplier.location}
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
                  e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
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
                  backgroundColor: 'var(--mc-sidebar-bg)',
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
                  e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
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
            padding: '32px',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowSupplierModal(false)}
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
                {selectedSupplier.category} • {selectedSupplier.location}
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
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.contact.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.contact.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.contact.website}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.contact.address}</span>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Location
              </h3>
              <div style={{ height: '300px', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
              </div>
            </div>

            {/* Products & Services */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Products & Services
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {selectedSupplier.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#f9fafb',
                      color: '#6b7280',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  Specialties
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedSupplier.specialties.map((specialty: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
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
                  <div style={{ fontSize: '20px', fontWeight: '600', color: '#059669' }}>{selectedSupplier.priceRange}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Bulk Discount</div>
                  <div style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '500' }}>{selectedSupplier.bulkDiscount}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Minimum Order</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedSupplier.minOrder}</div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Business Details
                </h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Lead Time</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedSupplier.leadTime}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Return Policy</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedSupplier.returnPolicy}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Delivery Areas</div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.deliveryAreas.join(', ')}</div>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Customer Reviews
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {selectedSupplier.customerReviews.map((review: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{review.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < review.rating ? '#f59e0b' : '#e5e7eb'}
                            color={i < review.rating ? '#f59e0b' : '#e5e7eb'}
                          />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button style={{
                backgroundColor: 'transparent',
                color: 'var(--mc-sidebar-bg)',
                border: '1px solid var(--mc-sidebar-bg)',
                borderRadius: '20px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--mc-sidebar-bg)';
              }}
              >
                View Portfolio
              </button>
              
              <button style={{
                backgroundColor: 'var(--mc-sidebar-bg)',
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
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
              }}
              >
                Contact Supplier
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
