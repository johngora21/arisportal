'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Building, 
  Package, 
  Car, 
  Heart, 
  Plus, 
  Eye, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function InsurancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewPolicyModal, setShowNewPolicyModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Mock insurance data
  const insuranceStats = {
    totalPolicies: 24,
    activePolicies: 18,
    pendingClaims: 3,
    totalCoverage: 2500000000, // 2.5B TZS
    monthlyPremiums: 45000000, // 45M TZS
    claimsPaid: 8,
    riskScore: 7.2
  };

  const policies = [
    {
      id: '1',
      type: 'property',
      title: 'Sunrise Apartments',
      coverage: 120000000,
      premium: 1800000,
      status: 'active',
      expiryDate: '2024-12-31',
      riskLevel: 'low',
      claims: 0,
      propertyType: 'residential'
    },
    {
      id: '2',
      type: 'business',
      title: 'Inventory Coverage - Electronics Store',
      coverage: 45000000,
      premium: 675000,
      status: 'active',
      expiryDate: '2024-11-15',
      riskLevel: 'medium',
      claims: 1,
      businessType: 'retail'
    },
    {
      id: '3',
      type: 'vehicle',
      title: 'Delivery Van - T123 ABC',
      coverage: 25000000,
      premium: 375000,
      status: 'active',
      expiryDate: '2024-10-20',
      riskLevel: 'high',
      claims: 2,
      vehicleType: 'commercial'
    },
    {
      id: '4',
      type: 'health',
      title: 'Employee Health Insurance',
      coverage: 15000000,
      premium: 225000,
      status: 'pending',
      expiryDate: '2024-09-30',
      riskLevel: 'low',
      claims: 0,
      employeeCount: 12
    }
  ];

  const claims = [
    {
      id: '1',
      policyId: '2',
      type: 'theft',
      amount: 2500000,
      status: 'approved',
      date: '2024-01-15',
      description: 'Stolen laptop inventory',
      processedBy: 'Insurance Agent'
    },
    {
      id: '2',
      policyId: '3',
      type: 'accident',
      amount: 1800000,
      status: 'pending',
      date: '2024-01-20',
      description: 'Vehicle collision damage',
      processedBy: 'Claims Adjuster'
    },
    {
      id: '3',
      policyId: '1',
      type: 'fire',
      amount: 5000000,
      status: 'investigating',
      date: '2024-01-25',
      description: 'Fire damage to property',
      processedBy: 'Risk Assessor'
    }
  ];

  const riskAssessments = [
    {
      id: '1',
      propertyId: '1',
      riskScore: 6.5,
      factors: ['Low crime area', 'Modern building', 'Security system'],
      recommendations: ['Install fire sprinklers', 'Update security cameras'],
      lastAssessment: '2024-01-10'
    },
    {
      id: '2',
      businessId: '2',
      riskScore: 8.2,
      factors: ['High-value inventory', 'Urban location', 'Night operations'],
      recommendations: ['Increase security', 'Install alarm system', 'Regular inventory audits'],
      lastAssessment: '2024-01-05'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp size={16} /> },
    { id: 'policies', label: 'My Policies', icon: <FileText size={16} /> },
    { id: 'claims', label: 'Claims', icon: <AlertTriangle size={16} /> },
    { id: 'risk-assessment', label: 'Risk Assessment', icon: <Shield size={16} /> },
    { id: 'coverage-types', label: 'Coverage Types', icon: <Building size={16} /> }
  ];

  const renderOverview = () => (
    <div>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={24} color="#3b82f6" />
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
              +3 this month
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
            {insuranceStats.totalPolicies}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Policies</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              backgroundColor: '#dcfce7',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} color="#10b981" />
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
              {(insuranceStats.totalCoverage / 1000000000).toFixed(1)}B TZS
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
            {insuranceStats.activePolicies}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Policies</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={24} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '500' }}>
              {insuranceStats.pendingClaims} pending
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
            {insuranceStats.claimsPaid}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Claims Paid</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={24} color="#10b981" />
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
              Score: {insuranceStats.riskScore}/10
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
            {(insuranceStats.monthlyPremiums / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Monthly Premiums (TZS)</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Recent Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {claims.slice(0, 3).map((claim) => (
            <div key={claim.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  backgroundColor: claim.status === 'approved' ? '#dcfce7' : claim.status === 'pending' ? '#fef3c7' : '#fee2e2',
                  borderRadius: '6px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle size={16} color={claim.status === 'approved' ? '#10b981' : claim.status === 'pending' ? '#f59e0b' : '#ef4444'} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {claim.description}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Policy #{claim.policyId} • {claim.date}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  {(claim.amount / 1000000).toFixed(1)}M TZS
                </div>
                <div style={{
                  fontSize: '12px',
                  color: claim.status === 'approved' ? '#10b981' : claim.status === 'pending' ? '#f59e0b' : '#ef4444',
                  fontWeight: '500'
                }}>
                  {claim.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPolicies = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          My Insurance Policies
        </h3>
        <button
          onClick={() => setShowNewPolicyModal(true)}
          style={{
            backgroundColor: 'var(--mc-sidebar-bg)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={16} />
          New Policy
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
          backgroundColor: '#f9fafb',
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <div>Policy</div>
          <div>Type</div>
          <div>Coverage</div>
          <div>Premium</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {policies.map((policy) => (
          <div key={policy.id} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
            padding: '16px',
            borderBottom: '1px solid #f3f4f6',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                {policy.title}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Expires: {policy.expiryDate}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                backgroundColor: policy.type === 'property' ? '#dbeafe' : policy.type === 'business' ? '#dcfce7' : policy.type === 'vehicle' ? '#fef3c7' : '#fce7f3',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: '500',
                color: policy.type === 'property' ? '#1e40af' : policy.type === 'business' ? '#166534' : policy.type === 'vehicle' ? '#92400e' : '#be185d'
              }}>
                {policy.type}
              </div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {(policy.coverage / 1000000).toFixed(1)}M TZS
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {(policy.premium / 1000).toFixed(0)}K TZS/mo
            </div>
            <div>
              <div style={{
                backgroundColor: policy.status === 'active' ? '#dcfce7' : '#fef3c7',
                color: policy.status === 'active' ? '#166534' : '#92400e',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'inline-block'
              }}>
                {policy.status}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setSelectedPolicy(policy);
                  setShowClaimModal(true);
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <AlertTriangle size={12} />
                Claim
              </button>
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Eye size={12} />
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCoverageTypes = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        Available Coverage Types
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Property Insurance */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            backgroundColor: '#dbeafe',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            marginBottom: '16px'
          }}>
            <Building size={24} color="#3b82f6" />
          </div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            Property Insurance
          </h4>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Comprehensive coverage for residential and commercial properties including fire, theft, and natural disasters.
          </p>
          <ul style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', paddingLeft: '16px' }}>
            <li>Fire and smoke damage</li>
            <li>Theft and vandalism</li>
            <li>Natural disasters</li>
            <li>Liability coverage</li>
            <li>Rental income protection</li>
          </ul>
          <button
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Get Quote
          </button>
        </div>

        {/* Business Insurance */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            backgroundColor: '#dcfce7',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            marginBottom: '16px'
          }}>
            <Package size={24} color="#10b981" />
          </div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            Business Insurance
          </h4>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Protect your business assets, inventory, and operations with tailored coverage for your industry.
          </p>
          <ul style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', paddingLeft: '16px' }}>
            <li>Inventory protection</li>
            <li>Business interruption</li>
            <li>Professional liability</li>
            <li>Equipment breakdown</li>
            <li>Cyber liability</li>
          </ul>
          <button
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Get Quote
          </button>
        </div>

        {/* Vehicle Insurance */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            marginBottom: '16px'
          }}>
            <Car size={24} color="#f59e0b" />
          </div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            Vehicle Insurance
          </h4>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Comprehensive motor vehicle insurance for personal and commercial vehicles.
          </p>
          <ul style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', paddingLeft: '16px' }}>
            <li>Third-party liability</li>
            <li>Comprehensive coverage</li>
            <li>Accident protection</li>
            <li>Theft coverage</li>
            <li>Emergency assistance</li>
          </ul>
          <button
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Get Quote
          </button>
        </div>



      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'policies':
        return renderPolicies();
      case 'coverage-types':
        return renderCoverageTypes();
      default:
        return renderOverview();
    }
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
          Insurance
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
          Comprehensive insurance coverage for your properties, business, and assets
        </p>
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
      {renderTabContent()}
    </div>
  );
}
