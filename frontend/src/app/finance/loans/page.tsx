'use client';

import React, { useState } from 'react';
import { Plus, Shield, Home, FileText, Calculator, DollarSign, MapPin, Building, CheckCircle, Clock } from 'lucide-react';
import { AllTab, CollateralsTab, ApplicationsTab, CalculatorTab } from './components';

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
  features?: string[];
  amenities?: string[];
  yearBuilt?: number;
  condition?: string;
  furnishing?: string;
  parking?: string;
  security?: string;
  utilities?: string;
  street?: string;
  ward?: string;
  district?: string;
  region?: string;
  council?: string;
  postalCode?: string;
  nearbyLandmarks?: string;
  accessRoad?: string;
  locality?: string;
  block?: string;
  lotNumber?: string;
  legalArea?: string;
  lotType?: string;
  lotUse?: string;
  sellerType?: string;
  paymentTerms?: string;
  verificationStatus: 'approved' | 'pending' | 'rejected';
  acquisitionDate: string;
  image: string;
}

interface LoanApplication {
  id: string;
  propertyId: string;
  propertyTitle: string;
  requestedAmount: number;
  propertyValue: number;
  loanToValueRatio: number;
  creditScore: number;
  monthlyIncome: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  applicationDate: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  notes?: string;
}

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState('collaterals');
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Mock user's verified properties from Real Estates "My Properties"
  const myProperties: Property[] = [
    {
      id: '1',
      title: 'Family Home',
      type: 'house',
      location: 'Mikocheni, Dar es Salaam',
      value: 280000000,
      size: '150 sqm',
      bedrooms: 3,
      bathrooms: 2,
      kitchen: 1,
      description: 'Modern family home in a quiet neighborhood with great amenities and excellent security.',
      features: ['Modern Design', 'Prime Location', 'Good Investment', 'Secure Neighborhood'],
      amenities: ['Parking', 'Security', 'Utilities', 'Garden'],
      yearBuilt: 2020,
      condition: 'Excellent',
      furnishing: 'Semi-Furnished',
      parking: '2 Cars',
      security: '24/7 Guard',
      utilities: 'Water & Electricity',
      street: 'Mikocheni Street',
      ward: 'Mikocheni',
      district: 'Kinondoni',
      region: 'Dar es Salaam',
      council: 'Kinondoni Municipal Council',
      postalCode: '14110',
      nearbyLandmarks: 'Mikocheni Hospital',
      accessRoad: 'Tarmac',
      verificationStatus: 'approved',
      acquisitionDate: '2020-03-15',
      image: '/api/placeholder/350/200'
    },
    {
      id: '2',
      title: 'Investment Land',
      type: 'land',
      location: 'Ubungo, Dar es Salaam',
      value: 120000000,
      size: '500 sqm',
      description: 'Prime land for development with good access to utilities and excellent location.',
      features: ['Prime Location', 'Development Ready', 'Good Investment'],
      amenities: ['Utilities Access', 'Road Access', 'Security'],
      locality: 'Ubungo',
      block: '3BD',
      lotNumber: '127',
      legalArea: '2,450.00 sqm',
      lotType: 'Plot',
      lotUse: 'Commercial',
      sellerType: 'Individual Owner',
      paymentTerms: 'Cash',
      district: 'Kinondoni',
      region: 'Dar es Salaam',
      council: 'Kinondoni Municipal Council',
      verificationStatus: 'approved',
      acquisitionDate: '2021-08-20',
      image: '/api/placeholder/350/200'
    },
    {
      id: '3',
      title: 'Commercial Office Space',
      type: 'commercial',
      location: 'CBD, Dar es Salaam',
      value: 450000000,
      size: '200 sqm',
      bedrooms: 0,
      bathrooms: 2,
      kitchen: 1,
      description: 'Premium office space in the heart of the business district with modern facilities.',
      features: ['Modern Design', 'CBD Location', 'Business Ready'],
      amenities: ['Parking', 'CCTV', 'All Utilities', 'Elevator'],
      yearBuilt: 2022,
      condition: 'New',
      furnishing: 'Unfurnished',
      parking: '3 Cars',
      security: 'Gated Community',
      utilities: 'Water Only',
      street: 'Kinondoni Road',
      ward: 'Kinondoni',
      district: 'Kinondoni',
      region: 'Dar es Salaam',
      council: 'Kinondoni Municipal Council',
      postalCode: '14120',
      nearbyLandmarks: 'Kinondoni Market',
      accessRoad: 'Gravel',
      verificationStatus: 'approved',
      acquisitionDate: '2021-12-10',
      image: '/api/placeholder/350/200'
    }
  ];

  // Mock loan applications
  const myLoanApplications: LoanApplication[] = [
    {
      id: '1',
      propertyId: '1',
      propertyTitle: 'Family Home',
      requestedAmount: 140000000,
      propertyValue: 280000000,
      loanToValueRatio: 50,
      creditScore: 680,
      monthlyIncome: 3200000,
      status: 'pending',
      applicationDate: '2024-01-20',
      interestRate: 13.0,
      termMonths: 72,
      monthlyPayment: 2850000,
      notes: 'Under review - additional documents requested'
    }
  ];

  // Mock active loans data
  const activeLoans = [
    {
      id: '1',
      propertyTitle: 'Investment Land',
      originalAmount: 80000000,
      remainingAmount: 45000000,
      monthlyPayment: 1200000,
      interestRate: 12.5,
      nextDueDate: '2024-02-15',
      status: 'active'
    },
    {
      id: '2',
      propertyTitle: 'Commercial Office',
      originalAmount: 200000000,
      remainingAmount: 180000000,
      monthlyPayment: 2800000,
      interestRate: 13.0,
      nextDueDate: '2024-02-20',
      status: 'active'
    }
  ];

  const totalPaidAmount = 97000000; // Amount paid back across all loans
  const creditScore = 720;
  const maxLoanAmount = Math.min(
    myProperties.reduce((sum, prop) => sum + prop.value * 0.7, 0), // 70% of total property value
    creditScore * 500000 // Credit score based limit (720 * 500,000 = 360M)
  );

  const tabs = [
    { id: 'collaterals', label: 'My Collaterals', icon: <Home size={16} /> },
    { id: 'applications', label: 'Applications', icon: <FileText size={16} /> },
    { id: 'calculator', label: 'Calculator', icon: <Calculator size={16} /> }
  ];

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleApplyForLoan = (property: Property) => {
                    setSelectedProperty(property);
                    setShowLoanApplication(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'collaterals':
        return (
          <CollateralsTab
            myProperties={myProperties}
            onPropertyClick={handlePropertyClick}
            onApplyForLoan={handleApplyForLoan}
          />
        );
      case 'applications':
        return (
          <ApplicationsTab
            myLoanApplications={myLoanApplications}
          />
        );
      case 'calculator':
        return <CalculatorTab />;
      default:
        return (
          <CollateralsTab
            myProperties={myProperties}
            onPropertyClick={handlePropertyClick}
            onApplyForLoan={handleApplyForLoan}
          />
        );
    }
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
            Loans
            </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            Property-backed loans and credit facilities
            </p>
          </div>
            <button
          onClick={() => setShowLoanApplication(true)}
              style={{
            backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
            padding: '12px 20px',
                fontSize: '14px',
            fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
              }}
              onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
              }}
            >
              <Plus size={16} />
              Apply for Loan
            </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          border: '1px solid #e5e7eb',
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <FileText size={20} color="#f59e0b" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Active Loans</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {formatPrice(activeLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0))}
          </div>
        </div>

            <div style={{
          backgroundColor: 'white',
              borderRadius: '20px',
          border: '1px solid #e5e7eb',
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Shield size={20} color="#10b981" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Paid</span>
            </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {formatPrice(totalPaidAmount)}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          border: '1px solid #e5e7eb',
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Calculator size={20} color="#3b82f6" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Credit Score</span>
            </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {creditScore}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          border: '1px solid #e5e7eb',
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <DollarSign size={20} color="#8b5cf6" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Maximum Loan</span>
            </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {formatPrice(maxLoanAmount)}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
              padding: '12px 24px',
              backgroundColor: activeTab === tab.id ? 'var(--mc-sidebar-bg)' : 'white',
                color: activeTab === tab.id ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
              gap: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = 'white';
              }
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Property Details Modal */}
      {showPropertyDetails && selectedProperty && (
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
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <PropertyDetailsModal
              property={selectedProperty}
              onClose={() => {
                setShowPropertyDetails(false);
                setSelectedProperty(null);
              }}
              onApplyForLoan={() => {
                setShowPropertyDetails(false);
                setShowLoanApplication(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Loan Application Modal */}
      {showLoanApplication && (
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
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
                    <LoanApplicationForm
                      selectedProperty={selectedProperty}
                      userProperties={myProperties}
                      onClose={() => {
                  setShowLoanApplication(false);
                  setSelectedProperty(null);
                }}
                      onSubmit={(application) => {
                        console.log('Loan application submitted:', application);
                        setShowLoanApplication(false);
                        setSelectedProperty(null);
                      }}
                    />
          </div>
        </div>
      )}
    </div>
  );
}

// Loan Application Form Component
function LoanApplicationForm({ selectedProperty, userProperties, onClose, onSubmit }: {
  selectedProperty: Property | null;
  userProperties: Property[];
  onClose: () => void;
  onSubmit: (application: LoanApplication) => void;
}) {
  const [formData, setFormData] = useState({
    propertyId: selectedProperty?.id || '',
    requestedAmount: '',
    termMonths: '36',
    monthlyIncome: '',
    employmentStatus: '',
    employerName: '',
    employmentDuration: '',
    monthlyExpenses: '',
    otherIncome: '',
    bankAccount: '',
    bankName: '',
    accountType: '',
    accountName: '',
    bankStatements: null as File | null,
    payslips: null as File | null,
    taxReturns: null as File | null,
    employmentLetter: null as File | null,
    propertyDocuments: null as File | null,
    notes: ''
  });

  const inputStyle = (hasError: boolean = false) => ({
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '16px',
    paddingRight: '16px',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '20px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none'
  });

  const selectStyle = (hasError: boolean = false) => ({
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '16px',
    paddingRight: '16px',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '20px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProperty) return;

    const application: LoanApplication = {
      id: Date.now().toString(),
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      requestedAmount: parseFloat(formData.requestedAmount),
      propertyValue: selectedProperty.value,
      loanToValueRatio: (parseFloat(formData.requestedAmount) / selectedProperty.value) * 100,
      creditScore: 720,
      monthlyIncome: parseFloat(formData.monthlyIncome),
      status: 'pending',
      applicationDate: new Date().toISOString(),
      interestRate: 13.0,
      termMonths: parseInt(formData.termMonths),
      monthlyPayment: calculateMonthlyPayment(parseFloat(formData.requestedAmount), 13.0, parseInt(formData.termMonths)),
      notes: formData.notes
    };

    onSubmit(application);
  };

  const calculateMonthlyPayment = (principal: number, annualRate: number, months: number) => {
    const monthlyRate = annualRate / 100 / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const selectedCollateral = userProperties.find(prop => prop.id === formData.propertyId);
  const maxLoanAmount = selectedCollateral ? selectedCollateral.value * 0.7 : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
          Loan Application
        </h2>
        <button
          onClick={onClose}
                style={{
            backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

      {selectedProperty && (
              <div style={{
                backgroundColor: '#f9fafb',
          borderRadius: '12px',
                padding: '16px',
          marginBottom: '24px'
              }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
            Selected Property
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
                  {selectedProperty.title}
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
                  {selectedProperty.location}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Property Value: <strong>{new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(selectedProperty.value)}</strong>
            </span>
            <span style={{ fontSize: '14px', color: '#059669' }}>
              Max Loan: <strong>{new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(maxLoanAmount)}</strong>
            </span>
                </div>
                </div>
      )}

      <form onSubmit={handleSubmit}>
              {/* Collateral Selection - Full Width */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Select Collateral Property *
                </label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  style={selectStyle()}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                >
                  <option value="">Select a property to use as collateral</option>
                  {userProperties.filter(prop => prop.verificationStatus === 'approved').map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title} - {property.location}
                    </option>
                  ))}
                </select>
                </div>

              {/* Row 1: Requested Amount & Loan Term */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Requested Amount (TZS) *
                  </label>
                  <input
                    type="number"
                    value={formData.requestedAmount}
                    onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                    max={maxLoanAmount}
                    style={inputStyle()}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    Max: {new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(maxLoanAmount)}
                  </p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Loan Term (Months) *
                  </label>
                  <select
                    value={formData.termMonths}
                    onChange={(e) => setFormData({ ...formData, termMonths: e.target.value })}
                    style={selectStyle()}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  >
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                    <option value="72">72 months</option>
                  </select>
              </div>
            </div>

              {/* Row 2: Monthly Income & Employment Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Monthly Income (TZS) *
                </label>
                <input
                  type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    style={inputStyle()}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Employment Status *
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                    style={selectStyle()}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  >
                    <option value="">Select employment status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business-owner">Business Owner</option>
                    <option value="contractor">Contractor</option>
                    <option value="retired">Retired</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Conditional Employment Fields - Only show when employed */}
              {formData.employmentStatus === 'employed' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Employer Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.employerName}
                      onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                      style={inputStyle()}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Employment Duration
                </label>
                <select
                      value={formData.employmentDuration}
                      onChange={(e) => setFormData({ ...formData, employmentDuration: e.target.value })}
                      style={selectStyle()}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select duration</option>
                      <option value="less-than-1-year">Less than 1 year</option>
                      <option value="1-2-years">1-2 years</option>
                      <option value="2-5-years">2-5 years</option>
                      <option value="5-10-years">5-10 years</option>
                      <option value="more-than-10-years">More than 10 years</option>
                </select>
              </div>
                </div>
              )}

              {/* Row 4: Other Income */}
              <div style={{ marginBottom: '16px' }}>
                <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Other Income (TZS)
                </label>
                <input
                  type="number"
                    value={formData.otherIncome}
                    onChange={(e) => setFormData({ ...formData, otherIncome: e.target.value })}
                    style={inputStyle()}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Rental income, investments, etc."
                  />
                </div>
              </div>

              {/* Row 5: Bank Name & Account Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Bank Name *
                </label>
                <input
                  type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    style={inputStyle()}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter bank name"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Account Type *
                  </label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    style={selectStyle()}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  >
                    <option value="">Select account type</option>
                    <option value="savings">Savings Account</option>
                    <option value="current">Current Account</option>
                    <option value="fixed-deposit">Fixed Deposit</option>
                    <option value="business">Business Account</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Account Number & Account Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Account Number *
                </label>
                <input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    style={inputStyle()}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Account Name *
                  </label>
                  <input
                    type="text"
                    value={formData.accountName || ''}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    style={inputStyle()}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Account holder name"
                    required
                  />
                </div>
              </div>

              {/* Row 7: Bank Statements & Payslips */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Bank Statements (Last 6 months) *
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, bankStatements: e.target.files?.[0] || null })}
                    style={inputStyle()}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Payslips (Last 3 months)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, payslips: e.target.files?.[0] || null })}
                    style={inputStyle()}
                  />
                </div>
              </div>

              {/* Row 8: Tax Returns & Employment Letter */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Tax Returns (Last 2 years)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, taxReturns: e.target.files?.[0] || null })}
                    style={inputStyle()}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Employment Letter
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, employmentLetter: e.target.files?.[0] || null })}
                    style={inputStyle()}
                  />
                </div>
              </div>


              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Additional Notes
                </label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  style={{
                      ...inputStyle(),
                    resize: 'vertical',
                      minHeight: '80px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Any additional information or special requests..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
            onClick={onClose}
                  style={{
                    padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#6b7280',
                    border: '1px solid #d1d5db',
              borderRadius: '8px',
                    fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
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
              borderRadius: '8px',
                    fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                  }}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
  );
}

// Property Details Modal Component
function PropertyDetailsModal({ property, onClose, onApplyForLoan }: {
  property: Property;
  onClose: () => void;
  onApplyForLoan: () => void;
}) {
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
      case 'land': return <MapPin size={24} color="#10b981" />;
      case 'house': return <Home size={24} color="#3b82f6" />;
      case 'apartment': return <Building size={24} color="#8b5cf6" />;
      case 'commercial': return <Building size={24} color="#f59e0b" />;
      default: return <Building size={24} color="#6b7280" />;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle size={16} />,
          text: 'Approved',
          backgroundColor: '#dcfce7',
          color: '#166534',
          borderColor: '#bbf7d0'
        };
      case 'pending':
        return {
          icon: <Clock size={16} />,
          text: 'Pending',
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderColor: '#fde68a'
        };
      case 'rejected':
        return {
          icon: <Clock size={16} />,
          text: 'Rejected',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderColor: '#fecaca'
        };
      default:
        return {
          icon: <Clock size={16} />,
          text: 'Pending',
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderColor: '#fde68a'
        };
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {getPropertyIcon(property.type)}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
              {property.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>{property.location}</span>
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: getVerificationBadge(property.verificationStatus).backgroundColor,
                color: getVerificationBadge(property.verificationStatus).color,
                border: `1px solid ${getVerificationBadge(property.verificationStatus).borderColor}`
              }}>
                {getVerificationBadge(property.verificationStatus).icon}
                {getVerificationBadge(property.verificationStatus).text}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
                  style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ×
        </button>
      </div>

      {/* Property Image */}
      <div style={{
                    width: '100%',
        height: '300px',
        backgroundColor: '#f3f4f6',
        backgroundImage: `url(${property.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '12px',
        marginBottom: '24px'
      }} />

      {/* Price */}
      <div style={{
        fontSize: '20px',
        fontWeight: '700',
        color: '#059669',
        marginBottom: '32px'
      }}>
        Current Value: {formatPrice(property.value)}
      </div>

      {/* Plot Details - Only for land properties */}
      {property.type === 'land' && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
            Plot Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {property.locality && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Locality:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.locality}
                </span>
              </div>
            )}
            {property.block && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Block:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.block}
                </span>
              </div>
            )}
            {property.lotNumber && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Lot Number:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.lotNumber}
                </span>
              </div>
            )}
            {property.legalArea && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Legal Area:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.legalArea}
                </span>
              </div>
            )}
            {property.lotType && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Lot Type:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.lotType}</span>
              </div>
            )}
            {property.region && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Region:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.region}
                </span>
              </div>
            )}
            {property.district && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>District:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.district}
                </span>
              </div>
            )}
            {property.council && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Council:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.council}
                </span>
              </div>
            )}
            {property.lotUse && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Lot Use:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.lotUse}
                </span>
              </div>
            )}
            {property.sellerType && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Seller Type:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.sellerType}
                </span>
              </div>
            )}
            {property.paymentTerms && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Payment Terms:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.paymentTerms}
                </span>
              </div>
            )}
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
            {property.size && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Area:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.size}</span>
              </div>
            )}
            {property.bedrooms && property.bedrooms > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Bedrooms:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Bathrooms:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.bathrooms}</span>
              </div>
            )}
            {property.kitchen && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Kitchen:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.kitchen}</span>
              </div>
            )}
            {property.yearBuilt && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Year Built:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.yearBuilt}
                </span>
              </div>
            )}
            {property.condition && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Condition:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.condition}
                </span>
              </div>
            )}
            {property.furnishing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Furnishing:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.furnishing}
                </span>
              </div>
            )}
            {property.parking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Parking:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.parking}
                </span>
              </div>
            )}
            {property.security && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Security:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.security}
                </span>
              </div>
            )}
            {property.utilities && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Utilities:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.utilities}
                </span>
              </div>
            )}
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
            {property.street && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Street:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.street}
                </span>
              </div>
            )}
            {property.ward && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Ward:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.ward}
                </span>
              </div>
            )}
            {property.district && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>District:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.district}
                </span>
              </div>
            )}
            {property.region && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Region:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{property.region}</span>
              </div>
            )}
            {property.council && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Council:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.council}
                </span>
              </div>
            )}
            {property.postalCode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Postal Code:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.postalCode}
                </span>
              </div>
            )}
            {property.nearbyLandmarks && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Nearby Landmarks:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.nearbyLandmarks}
                </span>
              </div>
            )}
            {property.accessRoad && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Access Road:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {property.accessRoad}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {property.description && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
            Description
          </h3>
          <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
            {property.description}
          </p>
        </div>
      )}

      {/* Features */}
      {property.features && property.features.length > 0 && (
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

      {/* Financial Information */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
          Financial Information
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Current Value:</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>
              {formatPrice(property.value)}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Max Loan Amount:</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>
              {formatPrice(property.value * 0.7)}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Loan-to-Value Ratio:</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              Up to 70%
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Acquisition Date:</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {new Date(property.acquisitionDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
          onClick={onClose}
                  style={{
                    padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
                    fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
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
                <button
          onClick={onApplyForLoan}
                  style={{
                    padding: '12px 24px',
            backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    border: 'none',
            borderRadius: '8px',
                    fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
          }}
        >
          Apply for Loan
                </button>
              </div>
    </div>
  );
}
