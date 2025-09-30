'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  BarChart3, 
  TrendingUp, 
  PieChart,
  DollarSign,
  Building,
  Users,
  Shield,
  Eye,
  Plus, 
  Filter, 
  Calendar,
  Clock,
  Target,
  Award,
  Zap
} from 'lucide-react';

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [auditSubTab, setAuditSubTab] = useState('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock self-audit data
  const auditStats = {
    totalAudits: 8,
    activeAudits: 2,
    completedAudits: 6,
    totalValueAudited: 1500000000, // 1.5B TZS
    averageAuditTime: '3 days',
    complianceRate: 96.2,
    costSavings: 25000000 // 25M TZS saved vs traditional firms
  };

  const clients = [
  {
    id: '1',
      name: 'ABC Trading Company',
      type: 'retail',
      status: 'active',
      auditProgress: 75,
      lastAudit: '2024-01-15',
      nextAudit: '2024-04-15',
      valueAudited: 150000000,
      complianceScore: 92
  },
  {
    id: '2',
      name: 'XYZ Manufacturing Ltd',
      type: 'manufacturing',
      status: 'completed',
      auditProgress: 100,
      lastAudit: '2024-01-10',
      nextAudit: '2024-07-10',
      valueAudited: 300000000,
      complianceScore: 96
  },
  {
    id: '3',
      name: 'City Real Estate Group',
      type: 'real-estate',
    status: 'pending',
      auditProgress: 0,
      lastAudit: '2023-12-20',
      nextAudit: '2024-02-20',
      valueAudited: 500000000,
      complianceScore: 88
    }
  ];

  const auditServices = [
  {
    id: '1',
      title: 'Financial Statement Audit',
      description: 'Comprehensive review of financial statements for accuracy and compliance',
      price: 'From 500,000 TZS',
      duration: '7-14 days',
      features: ['Balance Sheet Review', 'Income Statement Analysis', 'Cash Flow Verification', 'Compliance Check'],
      icon: <BarChart3 size={24} />
  },
  {
    id: '2',
      title: 'Tax Compliance Audit',
      description: 'Review tax returns and ensure compliance with Tanzanian tax regulations',
      price: 'From 300,000 TZS',
      duration: '5-10 days',
      features: ['Tax Return Review', 'Deduction Verification', 'Compliance Assessment', 'Penalty Avoidance'],
      icon: <FileText size={24} />
  },
  {
    id: '3',
      title: 'Inventory Audit',
      description: 'Physical count and valuation of inventory assets',
      price: 'From 200,000 TZS',
      duration: '3-7 days',
      features: ['Physical Count', 'Valuation Check', 'Discrepancy Analysis', 'Stock Management'],
      icon: <Building size={24} />
    },
    {
      id: '4',
      title: 'Internal Controls Review',
      description: 'Assessment of internal control systems and risk management',
      price: 'From 400,000 TZS',
      duration: '10-15 days',
      features: ['Control Testing', 'Risk Assessment', 'Process Review', 'Recommendations'],
      icon: <Shield size={24} />
    },
    {
      id: '5',
      title: 'Payroll Audit',
      description: 'Review of payroll processes and employee compensation',
      price: 'From 150,000 TZS',
      duration: '3-5 days',
      features: ['Payroll Verification', 'Tax Deduction Check', 'Benefits Review', 'Compliance Check'],
      icon: <Users size={24} />
    },
    {
      id: '6',
      title: 'Due Diligence Audit',
      description: 'Comprehensive business evaluation for acquisitions or investments',
      price: 'From 1,000,000 TZS',
      duration: '15-30 days',
      features: ['Financial Analysis', 'Asset Valuation', 'Risk Assessment', 'Investment Report'],
      icon: <Target size={24} />
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp size={16} /> },
    { id: 'my-audits', label: 'My Audits', icon: <FileText size={16} /> },
    { id: 'tools', label: 'Audit Tools', icon: <Award size={16} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={16} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={16} /> }
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
              <Users size={24} color="#3b82f6" />
                    </div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
              +5 this month
                      </div>
                    </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
            {auditStats.totalAudits}
                    </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Self Audits Completed</div>
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
              <CheckCircle size={24} color="#10b981" />
                  </div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
              {auditStats.completedAudits} completed
                    </div>
                  </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
            {auditStats.activeAudits}
                  </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Self Audits</div>
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
              <DollarSign size={24} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '500' }}>
              {(auditStats.totalValueAudited / 1000000000).toFixed(1)}B TZS
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
            {auditStats.complianceRate}%
      </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Compliance Rate</div>
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
              <Zap size={24} color="#10b981" />
                    </div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
              {(auditStats.costSavings / 1000000).toFixed(0)}M TZS saved
                      </div>
                    </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
            {auditStats.averageAuditTime}
                    </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Average Audit Time</div>
                  </div>
              </div>

      {/* Value Proposition */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
                  border: '1px solid #e5e7eb', 
        padding: '24px',
        marginBottom: '32px'
                }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Why Self-Audit with Our System?
        </h3>
                  <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              padding: '12px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '48px', 
              height: '48px'
                  }}>
              <DollarSign size={24} color="#3b82f6" />
                  </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                Cost Effective
                    </h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Save up to 60% compared to traditional audit firms by auditing your own business using our integrated platform.
              </p>
                    </div>
                  </div>
                  
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              backgroundColor: '#dcfce7',
              borderRadius: '8px',
              padding: '12px',
                display: 'flex',
                alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px'
            }}>
              <Clock size={24} color="#10b981" />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                Fast Turnaround
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Complete self-audits in 3-7 days using our automated tools and integrated business data.
              </p>
            </div>
      </div>

          <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ 
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              padding: '12px',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
              width: '48px',
              height: '48px'
            }}>
              <Shield size={24} color="#f59e0b" />
                    </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                Compliance Focused
                      </h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Ensure full compliance with Tanzanian regulations using our built-in compliance checker.
              </p>
                      </div>
                    </div>
                    
          <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ 
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              padding: '12px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '48px', 
              height: '48px'
                  }}>
              <TrendingUp size={24} color="#10b981" />
                  </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                AI-Powered Insights
                    </h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Get detailed analytics and recommendations based on your integrated business data.
              </p>
                    </div>
                  </div>
                  </div>
                </div>
    </div>
  );

  const renderServices = () => (
    <div>
      <div style={{
                display: 'flex',
        justifyContent: 'space-between',
                alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          Self-Audit Tools
        </h3>
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            backgroundColor: '#0f172a',
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
          Start Self Audit
            </button>
        </div>

          <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {auditServices.map((service) => (
          <div key={service.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
                    border: '1px solid #e5e7eb', 
            padding: '24px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ 
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              padding: '12px',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
              width: '48px',
              height: '48px',
              marginBottom: '16px'
            }}>
              {service.icon}
                    </div>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
              {service.title}
                      </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              {service.description}
            </p>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Price:</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>{service.price}</span>
                      </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Duration:</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>{service.duration}</span>
                    </div>
            </div>
            <ul style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', paddingLeft: '16px' }}>
              {service.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
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
              Request Quote
                      </button>
                  </div>
                ))}
              </div>
          </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'tools':
        return renderServices();
      default:
        return (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
              {activeTab === 'my-audits' ? 'My Audits' : 
               activeTab === 'documents' ? 'Documents' : 
               activeTab === 'reports' ? 'Reports' : 
               activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              This section is under development and will be available soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
          Self Audit
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
          Audit your own business using our integrated system - no need for expensive audit firms
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
                backgroundColor: activeTab === tab.id ? '#0f172a' : 'transparent',
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
