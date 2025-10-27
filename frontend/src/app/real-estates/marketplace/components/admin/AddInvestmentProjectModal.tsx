'use client';

import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, Calendar, Users, Target, Save } from 'lucide-react';

interface AddInvestmentProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: any) => void;
}

export default function AddInvestmentProjectModal({ isOpen, onClose, onSave }: AddInvestmentProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    expectedROI: '',
    developmentStage: '',
    status: '',
    features: [] as string[],
    // Legal & Compliance
    buildingPermits: '',
    environmentalAssessment: '',
    fireSafetyCompliance: '',
    accessibilityStandards: '',
    // Market Analysis
    marketGrowthRate: '',
    rentalYield: '',
    appreciationRate: '',
    occupancyRate: '',
    // Risk Assessment
    marketRisk: '',
    constructionRisk: '',
    regulatoryRisk: '',
    overallRiskRating: '',
    // Investment Details
    totalProjectValue: '',
    minimumInvestment: '',
    currentInvestors: '',
    targetInvestors: '',
    fundingProgress: '',
    investmentDeadline: '',
    // Location Details
    region: '',
    district: '',
    ward: '',
    street: '',
    latitude: '',
    longitude: '',
    // Required Documents
    nationalIdNumber: '',
    nationalIdPhoto: null,
    supportingDocumentType: '',
    supportingDocument: null,
    titleDeed: null,
    propertyImages: [],
    // Contact Information
    contactName: '',
    contactRole: '',
    contactPhone: '',
    contactEmail: ''
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };


  const handleSave = () => {
    const projectData = {
      ...formData,
      id: Date.now().toString(),
      expectedROI: parseFloat(formData.expectedROI),
      totalProjectValue: parseFloat(formData.totalProjectValue),
      minimumInvestment: parseFloat(formData.minimumInvestment),
      currentInvestors: parseInt(formData.currentInvestors) || 0,
      targetInvestors: parseInt(formData.targetInvestors),
      fundingProgress: parseFloat(formData.fundingProgress) || 0,
      coordinates: {
        lat: parseFloat(formData.latitude),
        lng: parseFloat(formData.longitude)
      },
      image: '/api/placeholder/400/300',
      createdAt: new Date().toISOString()
    };
    
    onSave(projectData);
    onClose();
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
        padding: '32px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Add Investment Project
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
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ padding: '24px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Project Overview Section */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                Project Overview
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Project Title and Project Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., Masaki Commercial Complex"
                  />
                </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Project Type *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select category</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="mixed-use">Mixed-Use</option>
                      <option value="industrial">Industrial</option>
                      <option value="hospitality">Hospitality</option>
                    </select>
                  </div>
                </div>

                {/* Duration and Expected ROI */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., 24 months"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Expected ROI (%) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.expectedROI}
                      onChange={(e) => handleInputChange('expectedROI', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="15"
                    />
                  </div>
                </div>

                {/* Development Stage and Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Development Stage *
                    </label>
                    <select
                      value={formData.developmentStage}
                      onChange={(e) => handleInputChange('developmentStage', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select stage</option>
                      <option value="Planning">Planning</option>
                      <option value="Pre-Construction">Pre-Construction</option>
                      <option value="Construction">Construction</option>
                      <option value="Near Completion">Near Completion</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
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
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                    placeholder="Describe the investment project"
                  />
                </div>

                {/* Project Features */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Project Features *
                  </label>
                  <textarea
                    value={formData.features.join(', ')}
                    onChange={(e) => {
                      const features = e.target.value.split(',').map(f => f.trim()).filter(f => f.length > 0);
                      handleInputChange('features', features);
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                    placeholder="e.g., Modern Design, Premium Location, High-Speed Elevators"
                  />
                </div>

              </div>
            </div>


            {/* Legal & Compliance Section */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                Legal & Compliance
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Building Permits and Environmental Impact Assessment */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Building Permits *
                    </label>
                    <select
                      value={formData.buildingPermits}
                      onChange={(e) => handleInputChange('buildingPermits', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select status</option>
                      <option value="Approved & Valid">✓ Approved & Valid</option>
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Not Applied">Not Applied</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Environmental Impact Assessment *
                    </label>
                    <select
                      value={formData.environmentalAssessment}
                      onChange={(e) => handleInputChange('environmentalAssessment', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select status</option>
                      <option value="Completed">✓ Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Not Started">Not Started</option>
                      <option value="Not Required">Not Required</option>
                    </select>
                  </div>
                </div>

                {/* Fire Safety Compliance and Accessibility Standards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Fire Safety Compliance *
                    </label>
                    <select
                      value={formData.fireSafetyCompliance}
                      onChange={(e) => handleInputChange('fireSafetyCompliance', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select status</option>
                      <option value="Certified">✓ Certified</option>
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Not Certified">Not Certified</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Accessibility Standards *
                    </label>
                    <select
                      value={formData.accessibilityStandards}
                      onChange={(e) => handleInputChange('accessibilityStandards', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select status</option>
                      <option value="ADA Compliant">✓ ADA Compliant</option>
                      <option value="Partially Compliant">Partially Compliant</option>
                      <option value="Not Compliant">Not Compliant</option>
                      <option value="Under Review">Under Review</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Analysis Section */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                Market Analysis
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Local Market Growth Rate and Average Rental Yield */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Local Market Growth Rate *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.marketGrowthRate}
                      onChange={(e) => handleInputChange('marketGrowthRate', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., 8.5"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Average Rental Yield *
                    </label>
                    <input
                      type="text"
                      value={formData.rentalYield}
                      onChange={(e) => handleInputChange('rentalYield', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., 12-15%"
                    />
                  </div>
                </div>

                {/* Property Appreciation Rate and Occupancy Rate */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Property Appreciation Rate *
                    </label>
                    <input
                      type="text"
                      value={formData.appreciationRate}
                      onChange={(e) => handleInputChange('appreciationRate', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., 6-8% Annually"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Occupancy Rate (Similar Properties) *
                    </label>
                    <input
                      type="text"
                      value={formData.occupancyRate}
                      onChange={(e) => handleInputChange('occupancyRate', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., 95%+"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment Section */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                Risk Assessment
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Market Risk and Construction Risk */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Market Risk *
                    </label>
                    <select
                      value={formData.marketRisk}
                      onChange={(e) => handleInputChange('marketRisk', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select risk level</option>
                      <option value="Low Risk">Low Risk</option>
                      <option value="Medium Risk">Medium Risk</option>
                      <option value="High Risk">High Risk</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Construction Risk *
                    </label>
                    <select
                      value={formData.constructionRisk}
                      onChange={(e) => handleInputChange('constructionRisk', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select risk level</option>
                      <option value="Low Risk">Low Risk</option>
                      <option value="Medium Risk">Medium Risk</option>
                      <option value="High Risk">High Risk</option>
                    </select>
                  </div>
                </div>

                {/* Regulatory Risk and Overall Risk Rating */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Regulatory Risk *
                    </label>
                    <select
                      value={formData.regulatoryRisk}
                      onChange={(e) => handleInputChange('regulatoryRisk', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select risk level</option>
                      <option value="Low Risk">Low Risk</option>
                      <option value="Medium Risk">Medium Risk</option>
                      <option value="High Risk">High Risk</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Overall Risk Rating *
                    </label>
                    <input
                      type="text"
                      value={formData.overallRiskRating}
                      onChange={(e) => handleInputChange('overallRiskRating', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., Low-Medium Risk"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Details Section */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                Investment Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Total Project Value and Minimum Investment */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Total Project Value (TZS) *
                    </label>
                    <input
                      type="number"
                      value={formData.totalProjectValue}
                      onChange={(e) => handleInputChange('totalProjectValue', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="500000000"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Minimum Investment (TZS) *
                    </label>
                    <input
                      type="number"
                      value={formData.minimumInvestment}
                      onChange={(e) => handleInputChange('minimumInvestment', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="5000000"
                    />
                  </div>
                </div>

                {/* Current Investors and Target Investors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Current Investors *
                    </label>
                    <input
                      type="number"
                      value={formData.currentInvestors}
                      onChange={(e) => handleInputChange('currentInvestors', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Target Investors *
                    </label>
                    <input
                      type="number"
                      value={formData.targetInvestors}
                      onChange={(e) => handleInputChange('targetInvestors', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="50"
                    />
                  </div>
                </div>

                {/* Funding Progress and Investment Deadline */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Funding Progress (%) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.fundingProgress}
                      onChange={(e) => handleInputChange('fundingProgress', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Investment Deadline *
                    </label>
                    <input
                      type="text"
                      value={formData.investmentDeadline}
                      onChange={(e) => handleInputChange('investmentDeadline', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Dec 2024"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details Section */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                Location Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Region and District */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., Dar es Salaam"
                    />
                  </div>
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
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., Kinondoni"
                    />
                  </div>
                </div>

                {/* Ward and Street */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Ward *
                    </label>
                    <input
                      type="text"
                      value={formData.ward}
                      onChange={(e) => handleInputChange('ward', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., Kinondoni"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Street *
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., Kinondoni Road"
                    />
                  </div>
                </div>

                {/* Latitude and Longitude */}
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
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., -6.7924"
                    />
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
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., 39.2083"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Required Documents Section */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                Required Documents
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* National ID Number and National ID Photo */}
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
                      accept="image/*"
                      onChange={(e) => handleInputChange('nationalIdPhoto', e.target.files?.[0] || null)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                      Upload a clear photo of your National ID
                    </p>
              </div>
            </div>

                {/* Supporting Document Type and Supporting Document Upload */}
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
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select supporting document</option>
                      <option value="building-permit">Building Permit</option>
                      <option value="occupancy-certificate">Occupancy Certificate</option>
                      <option value="property-tax-receipt">Property Tax Receipt</option>
                      <option value="utility-bill">Utility Bill</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Supporting Document Upload *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleInputChange('supportingDocument', e.target.files?.[0] || null)}
                      required
                          style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                            borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                      Upload your selected supporting document
                    </p>
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
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleInputChange('titleDeed', e.target.files?.[0] || null)}
                      required
                            style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                      Upload the official ownership document from the Land Registry
                    </p>
                        </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Property Images (Minimum 3) *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleInputChange('propertyImages', Array.from(e.target.files || []))}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                      Upload at least 3 clear images of your property
                    </p>
                    </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                Contact Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Name and Role */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Name *
                  </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., David Mwamba"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Role *
                  </label>
                    <input
                      type="text"
                      value={formData.contactRole}
                      onChange={(e) => handleInputChange('contactRole', e.target.value)}
                      required
                          style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                            borderRadius: '20px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., Property Developer"
                    />
                  </div>
                </div>

                {/* Phone and Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Phone *
                      </label>
                      <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '20px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      placeholder="e.g., +255 754 111 222"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Email *
                      </label>
                      <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '20px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      placeholder="e.g., david.mwamba@email.com"
                      />
                    </div>
                  </div>
              </div>
            </div>




            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '20px',
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
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Save size={16} />
                Save Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}