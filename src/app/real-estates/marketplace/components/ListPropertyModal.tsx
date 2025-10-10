'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  type: string;
  location: string;
  price: string;
  size: string;
  bedrooms: string;
  bathrooms: string;
  description: string;
  titleDeed: File | string;
  nationalIdNumber: string;
  nationalIdPhoto: File | string;
  supportingDocType: string;
  supportingDocument: File | string;
  propertyImages: File[];
  sellerName: string;
  sellerRole: string;
  sellerPhone: string;
  sellerEmail: string;
}

export default function ListPropertyModal({ isOpen, onClose }: ListPropertyModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: 'land',
    location: '',
    price: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    titleDeed: '',
    nationalIdNumber: '',
    nationalIdPhoto: '',
    supportingDocType: '',
    supportingDocument: '',
    propertyImages: [],
    sellerName: '',
    sellerRole: '',
    sellerPhone: '',
    sellerEmail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Property listing submitted:', formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    
    if (files) {
      if (name === 'propertyImages') {
        setFormData(prev => ({
          ...prev,
          [name]: Array.from(files)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
        {/* Header */}
        <div style={{
          padding: '24px 24px 0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Add Property
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', boxSizing: 'border-box' }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Property Title */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
                placeholder="e.g., Prime Land in Masaki"
              />
            </div>

            {/* Property Type and Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Property Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="land">Land</option>
                  <option value="buildings">Buildings</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., Masaki, Dar es Salaam"
                />
              </div>
            </div>

            {/* Price and Size */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Estimated Value (TZS) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., 150000000"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Size *
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., 500 sqm"
                />
              </div>
            </div>

            {/* Bedrooms and Bathrooms (for houses/apartments) */}
            {(formData.type === 'house' || formData.type === 'apartment') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      maxWidth: '500px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., 3"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      maxWidth: '500px',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., 2"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={8}
                style={{
                  width: '100%',
                  maxWidth: '700px',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                placeholder="Describe your property..."
              />
            </div>

            {/* Document Upload */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Required Documents
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {/* National ID Pair */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      National ID Number *
                    </label>
                    <input
                      type="text"
                      name="nationalIdNumber"
                      value={formData.nationalIdNumber}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., 1234567890123456"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      National ID Photo *
                    </label>
                    <input
                      type="file"
                      name="nationalIdPhoto"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                      Upload a clear photo of your National ID
                    </p>
                  </div>
                </div>
                
                {/* Supporting Document Pair */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Supporting Document Type *
                    </label>
                    <select
                      name="supportingDocType"
                      value={formData.supportingDocType}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select supporting document</option>
                      <option value="passport">Passport</option>
                      <option value="drivers-license">Driver's Licence</option>
                      <option value="voter-id">Voter's ID</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Supporting Document Upload *
                    </label>
                    <input
                      type="file"
                      name="supportingDocument"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                      Upload your selected supporting document
                    </p>
                  </div>
                </div>
                
                {/* Title Deed and Property Images Pair */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Title Deed *
                    </label>
                    <input
                      type="file"
                      name="titleDeed"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                      Upload the official ownership document from the Land Registry
                    </p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Property Images (Minimum 3) *
                    </label>
                    <input
                      type="file"
                      name="propertyImages"
                      accept=".jpg,.jpeg,.png"
                      multiple
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                      Upload at least 3 clear images of your property
                    </p>
                    {formData.propertyImages.length > 0 && (
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#059669' }}>
                        Selected {formData.propertyImages.length} image(s)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div style={{ paddingTop: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Your Contact Information
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="sellerName"
                      value={formData.sellerName}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Role *
                    </label>
                    <select
                      name="sellerRole"
                      value={formData.sellerRole}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select your role</option>
                      <option value="owner">Property Owner</option>
                      <option value="agent">Real Estate Agent</option>
                      <option value="broker">Real Estate Broker</option>
                      <option value="developer">Property Developer</option>
                      <option value="representative">Authorized Representative</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="sellerPhone"
                      value={formData.sellerPhone}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="+255 123 456 789"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="sellerEmail"
                      value={formData.sellerEmail}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#374151'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={16} />
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



