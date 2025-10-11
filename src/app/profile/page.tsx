'use client';

import React, { useState } from 'react';
import { 
  User, 
  Store, 
  Edit3,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  CheckCircle
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showPersonalEditModal, setShowPersonalEditModal] = useState(false);
  const [showBusinessEditModal, setShowBusinessEditModal] = useState(false);

  // Mock data for display
  const personalInfo = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+255 123 456 789',
    nationality: 'Tanzanian',
    address: 'Masaki, Dar es Salaam',
    nationalIdNumber: '1234567890123456',
    nationalId: 'national-id.pdf'
  };

  const businessInfo = {
    businessName: 'My Company Ltd',
    businessType: 'Technology',
    businessEmail: 'info@mycompany.com',
    businessPhone: '+255 987 654 321',
    country: 'Tanzania, United Republic of',
    city: 'Dar es Salaam',
    businessAddress: 'CBD, Dar es Salaam',
    website: 'https://mycompany.com',
    registrationNumber: 'REG123456789',
    taxId: 'TAX987654321',
    businessLicense: 'business-license.pdf',
    registrationCertificate: 'registration-cert.pdf',
    taxCertificate: 'tax-certificate.pdf'
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={20} /> },
    { id: 'business', label: 'Business Info', icon: <Store size={20} /> }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
          Profile
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
          View your personal and business information
        </p>
      </div>

      {/* Profile Container */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '20px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 24px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'var(--mc-sidebar-bg)' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '32px' }}>
          {/* Personal Information */}
          {activeTab === 'personal' && (
            <div>
              {/* Profile Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: '600',
                  color: 'var(--mc-sidebar-bg)',
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {personalInfo.firstName.charAt(0)}{personalInfo.lastName.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '28px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h3>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 16px 0' }}>
                    {personalInfo.email}
                  </p>
                  <button
                    onClick={() => setShowPersonalEditModal(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: 'var(--mc-sidebar-bg)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Email</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{personalInfo.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Phone</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{personalInfo.phone}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <User size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Nationality</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{personalInfo.nationality}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Address</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{personalInfo.address}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>National ID</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                      {personalInfo.nationalIdNumber} • {personalInfo.nationalId}
                    </div>
                  </div>
                  <CheckCircle size={20} color="#10b981" />
                </div>
              </div>
            </div>
          )}

          {/* Business Information */}
          {activeTab === 'business' && (
            <div>
              {/* Business Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: '600',
                  color: 'var(--mc-sidebar-bg)',
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {businessInfo.businessName.split(' ').map(word => word.charAt(0)).join('')}
                </div>
                <div>
                  <h3 style={{ fontSize: '28px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                    {businessInfo.businessName}
                  </h3>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 16px 0' }}>
                    {businessInfo.businessType}
                  </p>
                  <button
                    onClick={() => setShowBusinessEditModal(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: 'var(--mc-sidebar-bg)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <Edit3 size={16} />
                    Edit Business
                  </button>
                </div>
              </div>

              {/* Business Information */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Business Email</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.businessEmail}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Business Phone</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.businessPhone}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Country</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.country}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>City</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.city}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Address</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.businessAddress}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Globe size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Website</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.website}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Registration Number</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.registrationNumber}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Tax ID</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.taxId}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Business License</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.businessLicense}</div>
                  </div>
                  <CheckCircle size={20} color="#10b981" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Registration Certificate</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.registrationCertificate}</div>
                  </div>
                  <CheckCircle size={20} color="#10b981" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Tax Certificate</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.taxCertificate}</div>
                  </div>
                  <CheckCircle size={20} color="#10b981" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information Edit Modal */}
      {showPersonalEditModal && (
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
            borderRadius: '20px',
            padding: '32px',
            width: '95%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Edit Personal Information
              </h3>
              <button
                onClick={() => setShowPersonalEditModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue={personalInfo.firstName}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue={personalInfo.lastName}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={personalInfo.email}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue={personalInfo.phone}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Nationality
                  </label>
                  <input
                    type="text"
                    defaultValue={personalInfo.nationality}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    National ID Number
                  </label>
                  <input
                    type="text"
                    defaultValue={personalInfo.nationalIdNumber}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Address
                </label>
                <input
                  type="text"
                  defaultValue={personalInfo.address}
                  style={{
                    width: '300px',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  National ID Document
                </label>
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '20px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer'
                }}>
                  <FileText size={24} color="#6b7280" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                    Click to upload or drag and drop
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {personalInfo.nationalId || 'No file uploaded'}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPersonalEditModal(false)}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPersonalEditModal(false)}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Information Edit Modal */}
      {showBusinessEditModal && (
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
            borderRadius: '20px',
            padding: '32px',
            width: '95%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Edit Business Information
              </h3>
              <button
                onClick={() => setShowBusinessEditModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Business Name
                  </label>
                  <input
                    type="text"
                    defaultValue={businessInfo.businessName}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Business Type
                  </label>
                  <input
                    type="text"
                    defaultValue={businessInfo.businessType}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Business Email
                  </label>
                  <input
                    type="email"
                    defaultValue={businessInfo.businessEmail}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue={businessInfo.businessPhone}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    defaultValue={businessInfo.country}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    City
                  </label>
                  <input
                    type="text"
                    defaultValue={businessInfo.city}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Business Address
                  </label>
                  <input
                    type="text"
                    defaultValue={businessInfo.businessAddress}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Website
                  </label>
                  <input
                    type="url"
                    defaultValue={businessInfo.website}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Registration Number
                  </label>
                  <input
                    type="text"
                    defaultValue={businessInfo.registrationNumber}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Tax ID
                  </label>
                  <input
                    type="text"
                    defaultValue={businessInfo.taxId}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Business License
                  </label>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '20px',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer'
                  }}>
                    <FileText size={20} color="#6b7280" style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      Upload
                    </div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                      {businessInfo.businessLicense || 'No file'}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Registration Certificate
                  </label>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '20px',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer'
                  }}>
                    <FileText size={20} color="#6b7280" style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      Upload
                    </div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                      {businessInfo.registrationCertificate || 'No file'}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Tax Certificate
                  </label>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '20px',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer'
                  }}>
                    <FileText size={20} color="#6b7280" style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      Upload
                    </div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                      {businessInfo.taxCertificate || 'No file'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowBusinessEditModal(false)}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowBusinessEditModal(false)}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}