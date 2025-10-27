'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Store, 
  Edit3,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  CheckCircle,
  Upload,
  RefreshCw,
  Receipt,
  Download,
  Eye
} from 'lucide-react';
import { buildApiUrl } from '../../config/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, token, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [showPersonalEditModal, setShowPersonalEditModal] = useState(false);
  const [showBusinessEditModal, setShowBusinessEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Profile data state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    address: '',
    nationalIdNumber: '',
    nationalId: ''
  });

  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    businessType: '',
    businessEmail: '',
    businessPhone: '',
    country: '',
    city: '',
    businessAddress: '',
    website: '',
    registrationNumber: '',
    taxId: '',
    businessLicense: '',
    registrationCertificate: '',
    taxCertificate: ''
  });

  const [profileStats, setProfileStats] = useState({
    personal_info: { completed: 0, total: 7, percentage: 0 },
    business_info: { completed: 0, total: 10, percentage: 0 },
    documents: { completed: 0, total: 4, percentage: 0 },
    overall: { completed: 0, total: 21, percentage: 0 },
    profile_completed: false
  });

  // Form state for editing
  const [personalForm, setPersonalForm] = useState({ ...personalInfo });
  const [businessForm, setBusinessForm] = useState({ ...businessInfo });

  // API functions
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // No token found, redirect to login
        router.push('/authentication/login');
        return;
      }
      
      const response = await fetch(buildApiUrl('/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          router.push('/authentication/login');
          return;
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update personal info
      const updatedPersonalInfo = {
        firstName: data.personal_info.first_name || '',
        lastName: data.personal_info.last_name || '',
        email: data.personal_info.email || '',
        phone: data.personal_info.phone || '',
        nationality: data.personal_info.nationality || '',
        address: data.personal_info.address || '',
        nationalIdNumber: data.personal_info.national_id_number || '',
        nationalId: data.personal_info.national_id_document || ''
      };
      setPersonalInfo(updatedPersonalInfo);
      
      // Update business info
      const updatedBusinessInfo = {
        businessName: data.business_info.business_name || '',
        businessType: data.business_info.business_type || '',
        businessEmail: data.business_info.business_email || '',
        businessPhone: data.business_info.business_phone || '',
        country: data.business_info.country || '',
        city: data.business_info.city || '',
        businessAddress: data.business_info.business_address || '',
        website: data.business_info.website || '',
        registrationNumber: data.business_info.registration_number || '',
        taxId: data.business_info.tax_id || '',
        businessLicense: data.business_info.business_license_document || '',
        registrationCertificate: data.business_info.registration_certificate_document || '',
        taxCertificate: data.business_info.tax_certificate_document || ''
      };
      setBusinessInfo(updatedBusinessInfo);
      
      // Update form states with the newly fetched data
      setPersonalForm({ ...updatedPersonalInfo });
      setBusinessForm({ ...updatedBusinessInfo });
      
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return; // No token, skip stats fetch
      }
      
      const response = await fetch(buildApiUrl('/profile/stats'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const stats = await response.json();
        setProfileStats(stats);
      }
    } catch (err) {
      console.error('Error fetching profile stats:', err);
    }
  };

  const updatePersonalInfo = async () => {
    try {
      setSaving(true);
      setError('');
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/authentication/login');
        return;
      }
      
      // Helper to convert empty strings to null
      const cleanValue = (val: string) => val && val.trim() ? val.trim() : null;
      
      const response = await fetch(buildApiUrl('/profile/personal'), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: cleanValue(personalForm.firstName),
          last_name: cleanValue(personalForm.lastName),
          email: cleanValue(personalForm.email),
          phone: cleanValue(personalForm.phone),
          nationality: cleanValue(personalForm.nationality),
          address: cleanValue(personalForm.address),
          national_id_number: cleanValue(personalForm.nationalIdNumber)
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update personal info: ${response.status}`);
      }
      
      // Update local state
      setPersonalInfo({ ...personalForm });
      setShowPersonalEditModal(false);
      
      // Refresh stats
      await fetchProfileStats();
      
    } catch (err) {
      console.error('Error updating personal info:', err);
      setError(err instanceof Error ? err.message : 'Failed to update personal information');
    } finally {
      setSaving(false);
    }
  };

  const updateBusinessInfo = async () => {
    try {
      setSaving(true);
      setError('');
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/authentication/login');
        return;
      }
      
      // Helper to convert empty strings to null
      const cleanValue = (val: string) => val && val.trim() ? val.trim() : null;
      
      const response = await fetch(buildApiUrl('/profile/business'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          business_name: cleanValue(businessForm.businessName),
          business_type: cleanValue(businessForm.businessType),
          business_email: cleanValue(businessForm.businessEmail),
          business_phone: cleanValue(businessForm.businessPhone),
          country: cleanValue(businessForm.country),
          city: cleanValue(businessForm.city),
          business_address: cleanValue(businessForm.businessAddress),
          website: cleanValue(businessForm.website),
          registration_number: cleanValue(businessForm.registrationNumber),
          tax_id: cleanValue(businessForm.taxId)
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update business info: ${response.status}`);
      }
      
      // Update local state
      setBusinessInfo({ ...businessForm });
      setShowBusinessEditModal(false);
      
      // Refresh stats
      await fetchProfileStats();
      
    } catch (err) {
      console.error('Error updating business info:', err);
      setError(err instanceof Error ? err.message : 'Failed to update business information');
    } finally {
      setSaving(false);
    }
  };

  const uploadDocument = async (file: File, documentType: string) => {
    try {
      setSaving(true);
      setError('');
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('No auth token found');
        router.push('/authentication/login');
        return;
      }
      
      console.log('Uploading document:', documentType, 'File:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadUrl = buildApiUrl(`/profile/upload/${documentType}`);
      console.log('Upload URL:', uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Failed to upload ${documentType}: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Upload successful:', result);
      
      // Refetch profile data to get updated document paths from database
      await fetchProfile();
      
      // Refresh stats
      await fetchProfileStats();
      
    } catch (err) {
      console.error(`Error uploading ${documentType}:`, err);
      setError(err instanceof Error ? err.message : `Failed to upload ${documentType}`);
    } finally {
      setSaving(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadDocument(file, documentType);
    }
  };

  // Helper function to get document URL
  const getDocumentUrl = (filePath: string) => {
    if (!filePath) return null;
    // The file path from backend is: profile_documents/user_id/filename
    // Backend serves uploads at /uploads
    return `http://localhost:4001/uploads/${filePath}`;
  };

  // View document in new tab
  const viewDocument = (filePath: string) => {
    const url = getDocumentUrl(filePath);
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Download document
  const downloadDocument = async (filePath: string, filename: string) => {
    const url = getDocumentUrl(filePath);
    if (!url) return;
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename || filePath.split('/').pop() || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      setError('Failed to download document');
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProfile();
      fetchProfileStats();
    } else if (!isAuthenticated) {
      // No auth, redirect to login immediately
      router.push('/authentication/login');
    }
  }, [isAuthenticated, token, router]);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={20} /> },
    { id: 'business', label: 'Business Info', icon: <Store size={20} /> }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
          Profile
        </h1>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
              <RefreshCw size={16} className="animate-spin" />
              <span style={{ fontSize: '14px' }}>Loading...</span>
            </div>
          )}
        </div>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 16px 0' }}>
          View your personal and business information
        </p>
        
        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
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
                    onClick={() => {
                      setPersonalForm({ ...personalInfo });
                      setShowPersonalEditModal(true);
                    }}
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
                  <Receipt size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>National ID Number (NIN)</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{personalInfo.nationalIdNumber || 'Not provided'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>National ID Document</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{personalInfo.nationalId ? 'Uploaded' : 'Not uploaded'}</div>
                  </div>
                  {personalInfo.nationalId && <CheckCircle size={20} color="#10b981" />}
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
                    onClick={() => {
                      setBusinessForm({ ...businessInfo });
                      setShowBusinessEditModal(true);
                    }}
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
                  <Receipt size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Registration Number</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.registrationNumber}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Receipt size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Tax ID</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.taxId}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Business License</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.businessLicense ? 'Uploaded' : 'Not uploaded'}</div>
                  </div>
                  {businessInfo.businessLicense && <CheckCircle size={20} color="#10b981" />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Registration Certificate</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.registrationCertificate ? 'Uploaded' : 'Not uploaded'}</div>
                  </div>
                  {businessInfo.registrationCertificate && <CheckCircle size={20} color="#10b981" />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Tax Certificate</div>
                    <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{businessInfo.taxCertificate ? 'Uploaded' : 'Not uploaded'}</div>
                  </div>
                  {businessInfo.taxCertificate && <CheckCircle size={20} color="#10b981" />}
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
                    value={personalForm.firstName}
                    onChange={(e) => setPersonalForm(prev => ({ ...prev, firstName: e.target.value }))}
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
                    value={personalForm.lastName}
                    onChange={(e) => setPersonalForm(prev => ({ ...prev, lastName: e.target.value }))}
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
                    value={personalForm.email}
                    onChange={(e) => setPersonalForm(prev => ({ ...prev, email: e.target.value }))}
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
                    value={personalForm.phone}
                    onChange={(e) => setPersonalForm(prev => ({ ...prev, phone: e.target.value }))}
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
                    value={personalForm.nationality}
                    onChange={(e) => setPersonalForm(prev => ({ ...prev, nationality: e.target.value }))}
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
                    value={personalForm.nationalIdNumber}
                    onChange={(e) => setPersonalForm(prev => ({ ...prev, nationalIdNumber: e.target.value }))}
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
                  value={personalForm.address}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, address: e.target.value }))}
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
                <label style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '20px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer',
                  display: 'block'
                }}>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileInput(e, 'national-id')}
                    style={{ display: 'none' }}
                    id="national-id-upload"
                  />
                  <FileText size={24} color="#6b7280" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                    Click to upload or drag and drop
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {personalInfo.nationalId || 'No file uploaded'}
                  </div>
                </label>
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
                onClick={updatePersonalInfo}
                disabled={saving}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: saving ? '#9ca3af' : 'var(--mc-sidebar-bg)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {saving && <RefreshCw size={16} className="animate-spin" />}
                {saving ? 'Saving...' : 'Save Changes'}
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
                    value={businessForm.businessName}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, businessName: e.target.value }))}
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
                  <select
                    value={businessForm.businessType}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, businessType: e.target.value }))}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Select Business Type</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Retail">Retail</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Service Provider">Service Provider</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Construction">Construction</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Technology">Technology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={businessForm.businessEmail}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, businessEmail: e.target.value }))}
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
                    value={businessForm.businessPhone}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, businessPhone: e.target.value }))}
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
                    value={businessForm.country}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, country: e.target.value }))}
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
                    value={businessForm.city}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, city: e.target.value }))}
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
                    value={businessForm.businessAddress}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, businessAddress: e.target.value }))}
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
                    value={businessForm.website}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, website: e.target.value }))}
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
                    value={businessForm.registrationNumber}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, registrationNumber: e.target.value }))}
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
                    value={businessForm.taxId}
                    onChange={(e) => setBusinessForm(prev => ({ ...prev, taxId: e.target.value }))}
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
                  <label style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '20px',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer',
                    display: 'block'
                  }}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileInput(e, 'business-license')}
                      style={{ display: 'none' }}
                      id="business-license-upload"
                    />
                    <FileText size={20} color="#6b7280" style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      Upload
                    </div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                      {businessInfo.businessLicense || 'No file'}
                    </div>
                  </label>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Registration Certificate
                  </label>
                  <label style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '20px',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer',
                    display: 'block'
                  }}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileInput(e, 'registration-certificate')}
                      style={{ display: 'none' }}
                      id="registration-certificate-upload"
                    />
                    <FileText size={20} color="#6b7280" style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      Upload
                    </div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                      {businessInfo.registrationCertificate || 'No file'}
                    </div>
                  </label>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Tax Certificate
                  </label>
                  <label style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '20px',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer',
                    display: 'block'
                  }}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileInput(e, 'tax-certificate')}
                      style={{ display: 'none' }}
                      id="tax-certificate-upload"
                    />
                    <FileText size={20} color="#6b7280" style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      Upload
                    </div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                      {businessInfo.taxCertificate || 'No file'}
                    </div>
                  </label>
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
                onClick={updateBusinessInfo}
                disabled={saving}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: saving ? '#9ca3af' : 'var(--mc-sidebar-bg)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {saving && <RefreshCw size={16} className="animate-spin" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}