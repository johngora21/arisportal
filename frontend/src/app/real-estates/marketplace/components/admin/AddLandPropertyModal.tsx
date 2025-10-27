'use client';

import React, { useState } from 'react';
import { X, MapPin, DollarSign, Calendar, Building, Upload, Save } from 'lucide-react';

interface AddLandPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: any) => void;
}

export default function AddLandPropertyModal({ isOpen, onClose, onSave }: AddLandPropertyModalProps) {
  const [formData, setFormData] = useState({
    // Property Details
    title: '',
    estimatedValue: '',
    features: '',
    description: '',
    
    // Plot Details
    locality: '',
    block: '',
    lotNumber: '',
    legalArea: '',
    region: '',
    district: '',
    council: '',
    lotUse: '',
    latitude: '',
    longitude: '',
    
    // Owner Information
    nationalIdNumber: '',
    nationalIdPhoto: null as File | null,
    supportingDocumentType: '',
    supportingDocument: null as File | null,
    titleDeed: null as File | null,
    propertyImages: [] as File[],
    
    // Contact Information
    ownerName: '',
    role: '',
    phoneNumber: '',
    email: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.estimatedValue.trim()) newErrors.estimatedValue = 'Estimated value is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.nationalIdNumber.trim()) newErrors.nationalIdNumber = 'National ID number is required';
    if (!formData.nationalIdPhoto) newErrors.nationalIdPhoto = 'National ID photo is required';
    if (!formData.supportingDocumentType.trim()) newErrors.supportingDocumentType = 'Supporting document type is required';
    if (!formData.supportingDocument) newErrors.supportingDocument = 'Supporting document is required';
    if (!formData.titleDeed) newErrors.titleDeed = 'Title deed is required';
    if (formData.propertyImages.length < 3) newErrors.propertyImages = 'At least 3 property images are required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '32px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
            Add Land Property
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Property Details */}
          <div>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
              Property Details
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Property Title and Region */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Property Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.title ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., Prime Land in Masaki"
                  />
                  {errors.title && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.title}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Region *
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.region ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., Dar es Salaam"
                  />
                  {errors.region && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.region}</div>}
                </div>
              </div>

              {/* District and Council */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    District *
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.district ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., Ilala"
                  />
                  {errors.district && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.district}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Council *
                  </label>
                  <input
                    type="text"
                    value={formData.council}
                    onChange={(e) => handleInputChange('council', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.council ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., Ilala Municipal Council"
                  />
                  {errors.council && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.council}</div>}
                </div>
              </div>

              {/* Locality and Block */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Locality *
                  </label>
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) => handleInputChange('locality', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.locality ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., Masaki"
                  />
                  {errors.locality && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.locality}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Block *
                  </label>
                  <input
                    type="text"
                    value={formData.block}
                    onChange={(e) => handleInputChange('block', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.block ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., 1AB"
                  />
                  {errors.block && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.block}</div>}
                </div>
              </div>

              {/* Coordinates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Latitude *
                  </label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.latitude ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., -6.7924"
                  />
                  {errors.latitude && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.latitude}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Longitude *
                  </label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.longitude ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., 39.2083"
                  />
                  {errors.longitude && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.longitude}</div>}
                </div>
              </div>

              {/* Lot Number and Legal Area */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Lot Number *
                  </label>
                  <input
                    type="text"
                    value={formData.lotNumber}
                    onChange={(e) => handleInputChange('lotNumber', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.lotNumber ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., 89"
                  />
                  {errors.lotNumber && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.lotNumber}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Legal Area *
                  </label>
                  <input
                    type="text"
                    value={formData.legalArea}
                    onChange={(e) => handleInputChange('legalArea', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.legalArea ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., 1,200.00 sqm"
                  />
                  {errors.legalArea && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.legalArea}</div>}
                </div>
              </div>

              {/* Lot Use and Estimated Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Lot Use *
                  </label>
                  <select
                    value={formData.lotUse}
                    onChange={(e) => handleInputChange('lotUse', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.lotUse ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select lot use</option>
                    <option value="Mixed Use">Mixed Use</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Recreational">Recreational</option>
                  </select>
                  {errors.lotUse && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.lotUse}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Market Value (TZS) *
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedValue}
                    onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.estimatedValue ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., 150000000"
                  />
                  {errors.estimatedValue && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.estimatedValue}</div>}
                </div>
              </div>

              {/* Features */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Features *
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${errors.features ? '#dc2626' : '#d1d5db'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  placeholder="e.g., Road access, electricity, water, security..."
                />
                {errors.features && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.features}</div>}
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${errors.description ? '#dc2626' : '#d1d5db'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your property..."
                />
                {errors.description && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.description}</div>}
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
              Required Documents
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* National ID Number and Photo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    National ID Number *
                  </label>
                  <input
                    type="text"
                    value={formData.nationalIdNumber}
                    onChange={(e) => handleInputChange('nationalIdNumber', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.nationalIdNumber ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., 1234567890123456"
                  />
                  {errors.nationalIdNumber && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.nationalIdNumber}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    National ID Photo *
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleInputChange('nationalIdPhoto', e.target.files?.[0] || null)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.nationalIdPhoto ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Upload a clear photo of your National ID
                  </div>
                  {errors.nationalIdPhoto && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.nationalIdPhoto}</div>}
                </div>
              </div>

              {/* Supporting Document Type and Upload */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Supporting Document Type *
                  </label>
                  <select
                    value={formData.supportingDocumentType}
                    onChange={(e) => handleInputChange('supportingDocumentType', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.supportingDocumentType ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select supporting document</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver's License">Driver's License</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Birth Certificate">Birth Certificate</option>
                  </select>
                  {errors.supportingDocumentType && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.supportingDocumentType}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Supporting Document Upload *
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleInputChange('supportingDocument', e.target.files?.[0] || null)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.supportingDocument ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Upload your selected supporting document
                  </div>
                  {errors.supportingDocument && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.supportingDocument}</div>}
                </div>
              </div>

              {/* Title Deed and Property Images */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Title Deed *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleInputChange('titleDeed', e.target.files?.[0] || null)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.titleDeed ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Upload the official ownership document from the Land Registry
                  </div>
                  {errors.titleDeed && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.titleDeed}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Property Images (Minimum 3) *
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleInputChange('propertyImages', Array.from(e.target.files || []))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.propertyImages ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Upload at least 3 clear images of your property
                  </div>
                  {errors.propertyImages && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.propertyImages}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
              Contact Person Information
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Owner Name and Role */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.ownerName ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Contact person's full name"
                  />
                  {errors.ownerName && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.ownerName}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.role ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select your role</option>
                    <option value="Owner">Owner</option>
                    <option value="Agent">Agent</option>
                    <option value="Developer">Developer</option>
                    <option value="Investor">Investor</option>
                  </select>
                  {errors.role && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.role}</div>}
                </div>
              </div>

              {/* Phone Number and Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.phoneNumber ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="+255 123 456 789"
                  />
                  {errors.phoneNumber && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.phoneNumber}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.email ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="your@email.com"
                  />
                  {errors.email && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* GPS Boundary Mapping */}
          <div>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
              GPS Boundary Mapping
            </label>
            
            <div style={{
              width: '100%',
              height: '300px',
              border: '2px solid #d1d5db',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f9fafb',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📱</div>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
                GPS Boundary Mapping
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button
                  type="button"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Start Mapping
                </button>
                <button
                  type="button"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Stop
                </button>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '24px', 
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <div>Points: 0</div>
                <div>Distance: 0m</div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Save size={16} />
              Save Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}