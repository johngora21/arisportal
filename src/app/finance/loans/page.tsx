'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  DollarSign,
  Clock,
  FileText,
  Building,
  User,
  CheckCircle,
  XCircle,
  Calendar,
  Banknote,
  Calculator,
  Target,
  BarChart3,
  CreditCard,
  MapPin,
  Home,
  TrendingUp
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  type: 'land' | 'house' | 'apartment' | 'commercial';
  location: string;
  value: number;
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
  const [activeTab, setActiveTab] = useState('overview');
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Mock user's verified properties from Real Estates "My Properties"
  const myProperties: Property[] = [
    {
      id: '1',
      title: 'Prime Land in Masaki',
      type: 'land',
      location: 'Masaki, Dar es Salaam',
      value: 150000000,
      verificationStatus: 'approved',
      acquisitionDate: '2023-01-15',
      image: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Modern Apartment Complex',
      type: 'apartment',
      location: 'Kinondoni, Dar es Salaam',
      value: 280000000,
      verificationStatus: 'approved',
      acquisitionDate: '2022-08-20',
      image: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'Commercial Office Space',
      type: 'commercial',
      location: 'CBD, Dar es Salaam',
      value: 450000000,
      verificationStatus: 'approved',
      acquisitionDate: '2021-12-10',
      image: '/api/placeholder/300/200'
    }
  ];

  // Mock user's loan applications
  const myLoanApplications: LoanApplication[] = [
    {
      id: '1',
      propertyId: '1',
      propertyTitle: 'Prime Land in Masaki',
      requestedAmount: 75000000,
      propertyValue: 150000000,
      loanToValueRatio: 50,
      creditScore: 720,
      monthlyIncome: 2500000,
      status: 'approved',
      applicationDate: '2024-01-15',
      interestRate: 12.5,
      termMonths: 60,
      monthlyPayment: 1680000,
      notes: 'Loan approved for business expansion'
    },
    {
      id: '2',
      propertyId: '2',
      propertyTitle: 'Modern Apartment Complex',
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      case 'disbursed': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending Review';
      case 'rejected': return 'Rejected';
      case 'disbursed': return 'Disbursed';
      default: return 'Unknown';
    }
  };



  const tabs = [
    { id: 'overview', label: 'My Collaterals', icon: <Home size={16} /> },
    { id: 'applications', label: 'My Applications', icon: <FileText size={16} /> },
    { id: 'calculator', label: 'Calculator', icon: <Calculator size={16} /> }
  ];

  const renderOverviewTab = () => (
    <div>
      {/* My Collaterals */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          My Collaterals
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {myProperties.map((property) => (
            <div
              key={property.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f3f4f6',
                backgroundImage: `url(${property.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  Verified
                </div>
              </div>
              
              <div style={{ padding: '20px', flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                  {property.title}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <MapPin size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '6px' }}>
                    {property.location}
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                    Acquired: {new Date(property.acquisitionDate).toLocaleDateString()}
                  </div>
                </div>

                <div style={{
                  padding: '12px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#166534', marginBottom: '2px' }}>
                    Max Loan: {formatPrice(property.value * 0.7)}
                  </div>
                  <div style={{ fontSize: '10px', color: '#166534' }}>
                    Up to 70% of property value
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DollarSign size={16} color="#059669" />
                  <span style={{ fontSize: '18px', fontWeight: '600', color: '#059669', marginLeft: '6px' }}>
                    {formatPrice(property.value)}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedProperty(property);
                    setShowLoanApplication(true);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Apply for Loan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  const renderApplicationsTab = () => (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
          My Loan Applications
        </h2>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
          Track the status of your loan applications
        </p>
      </div>

      {myLoanApplications.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '6px' }}>
            No Applications Yet
          </h3>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
            Apply for a loan using your verified properties as collateral.
          </p>
          <button 
            onClick={() => setActiveTab('apply')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Apply for Loan
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {myLoanApplications.map((application) => (
            <div
              key={application.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '20px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {application.propertyTitle}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    Applied on {new Date(application.applicationDate).toLocaleDateString()}
                  </p>
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  backgroundColor: getStatusColor(application.status) + '20',
                  color: getStatusColor(application.status),
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  {application.status === 'approved' && <CheckCircle size={10} />}
                  {application.status === 'pending' && <Clock size={10} />}
                  {application.status === 'rejected' && <XCircle size={10} />}
                  {application.status === 'disbursed' && <Banknote size={10} />}
                  {getStatusText(application.status)}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Requested</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                    {formatPrice(application.requestedAmount)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Property Value</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {formatPrice(application.propertyValue)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Credit Score</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {application.creditScore}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Monthly Payment</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {formatPrice(application.monthlyPayment)}
                  </div>
                </div>
              </div>

              {application.notes && (
                <div style={{
                  padding: '8px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <strong>Note:</strong> {application.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCalculatorTab = () => (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
          Loan Calculator
        </h2>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
          Calculate your loan payments and eligibility
        </p>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '24px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Property Value (TZS)
            </label>
            <input
              type="number"
              placeholder="Enter property value"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Loan Amount (TZS)
            </label>
            <input
              type="number"
              placeholder="Enter loan amount"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Interest Rate (%)
            </label>
            <input
              type="number"
              placeholder="12.5"
              step="0.1"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Loan Term (Months)
            </label>
            <input
              type="number"
              placeholder="60"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Monthly Payment:</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>TZS 0</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Interest:</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>TZS 0</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Amount:</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>TZS 0</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Loan-to-Value:</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>0%</div>
            </div>
          </div>
        </div>

        <button style={{
          padding: '10px 20px',
          backgroundColor: 'var(--mc-sidebar-bg)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Calculate Payment
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              Property-Backed Loans
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: '8px 0 0 0' }}>
              Get loans using your verified properties as collateral with competitive rates
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                if (myProperties.length > 0) {
                  setSelectedProperty(myProperties[0]);
                  setShowLoanApplication(true);
                }
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
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
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={20} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Credit Score
              </h3>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                CreditInfo verified
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
              720
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Good Credit Rating
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              backgroundColor: '#dcfce7',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building size={20} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Properties
              </h3>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                Available for loans
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
              {myProperties.length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Verified properties
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Applications
              </h3>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                Active applications
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
              {myLoanApplications.length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Total applications
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '16px 20px',
                backgroundColor: activeTab === tab.id ? 'var(--mc-sidebar-bg)' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'applications' && renderApplicationsTab()}
      {activeTab === 'calculator' && renderCalculatorTab()}

      {/* Loan Application Modal */}
      {showLoanApplication && selectedProperty && (
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
            borderRadius: '12px',
            padding: '32px',
            width: '90vw',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Apply for Loan
              </h2>
              <button
                onClick={() => {
                  setShowLoanApplication(false);
                  setSelectedProperty(null);
                }}
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

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                Property Details
              </h3>
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                  {selectedProperty.title}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  {selectedProperty.location}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
                  Property Value: {formatPrice(selectedProperty.value)}
                </div>
                <div style={{ fontSize: '14px', color: '#166534', marginTop: '8px' }}>
                  Maximum Loan Amount: {formatPrice(selectedProperty.value * 0.7)}
                </div>
              </div>
            </div>

            <form>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Loan Amount (TZS) *
                </label>
                <input
                  type="number"
                  placeholder="Enter loan amount"
                  max={selectedProperty.value * 0.7}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Loan Purpose *
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select purpose</option>
                  <option value="business">Business Expansion</option>
                  <option value="personal">Personal Use</option>
                  <option value="investment">Investment</option>
                  <option value="education">Education</option>
                  <option value="medical">Medical</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Monthly Income (TZS) *
                </label>
                <input
                  type="number"
                  placeholder="Enter monthly income"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  National ID Number *
                </label>
                <input
                  type="text"
                  placeholder="Enter National ID number"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  National ID Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Bank Statement (Last 3 months) *
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Additional Notes
                </label>
                <textarea
                  placeholder="Any additional information..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoanApplication(false);
                    setSelectedProperty(null);
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
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
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

