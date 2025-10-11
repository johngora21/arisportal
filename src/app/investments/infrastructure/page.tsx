"use client";
import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  Hotel, 
  Stethoscope, 
  GraduationCap,
  TrendingUp,
  DollarSign,
  Target,
  Calendar
} from 'lucide-react';
import InvestmentIcon from '@/components/icons/InvestmentIcon';
import CommercialProjectsTab from './components/CommercialProjectsTab';
import HospitalityProjectsTab from './components/HospitalityProjectsTab';
import HealthcareProjectsTab from './components/HealthcareProjectsTab';
import EducationProjectsTab from './components/EducationProjectsTab';
import MyInfrastructureInvestmentsTab from './components/MyInfrastructureInvestmentsTab';
import InfrastructureProjectDetailsModal from './components/InfrastructureProjectDetailsModal';
import { InfrastructureProject, MyInfrastructureInvestment } from './models';

export default function InfrastructureInvestmentsPage() {
  const [activeTab, setActiveTab] = useState('commercial');
  const [selectedProject, setSelectedProject] = useState<InfrastructureProject | null>(null);

  // Mock data for user's infrastructure investments
  const userInvestments: MyInfrastructureInvestment[] = [
    {
      id: 'inf-1',
      projectId: 'proj-1',
      title: 'Masaki Commercial Complex',
      category: 'commercial',
      location: 'Masaki, Dar es Salaam',
      investedDate: 'Jan 15, 2024',
      investedAmount: 15000000,
      expectedReturn: 2250000,
      actualReturn: 750000,
      roi: 5.0,
      payoutSchedule: [
        { date: 'Jun 15, 2024', amount: 750000, status: 'paid' },
        { date: 'Dec 15, 2024', amount: 750000, status: 'pending' },
        { date: 'Jun 15, 2025', amount: 750000, status: 'pending' }
      ],
      status: 'active',
      image: '/api/placeholder/400/300'
    },
    {
      id: 'inf-2',
      projectId: 'proj-2',
      title: 'Serena Business Hotel',
      category: 'hospitality',
      location: 'Mikocheni, Dar es Salaam',
      investedDate: 'Feb 10, 2024',
      investedAmount: 12000000,
      expectedReturn: 1800000,
      actualReturn: 300000,
      roi: 2.5,
      payoutSchedule: [
        { date: 'Aug 10, 2024', amount: 300000, status: 'paid' },
        { date: 'Feb 10, 2025', amount: 300000, status: 'pending' },
        { date: 'Aug 10, 2025', amount: 300000, status: 'pending' },
        { date: 'Feb 10, 2026', amount: 900000, status: 'pending' }
      ],
      status: 'active',
      image: '/api/placeholder/400/300'
    }
  ];

  // Calculate user's investment summary
  const investmentSummary = useMemo(() => {
    const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const expectedReturns = userInvestments.reduce((sum, inv) => sum + inv.expectedReturn, 0);
    const actualReturns = userInvestments.reduce((sum, inv) => sum + inv.actualReturn, 0);
    const averageROI = userInvestments.length > 0 ? 
      userInvestments.reduce((sum, inv) => sum + inv.roi, 0) / userInvestments.length : 0;

    return {
      totalInvested,
      expectedReturns,
      actualReturns,
      averageROI
    };
  }, [userInvestments]);

  const tabs = [
    { id: 'commercial', label: 'Commercial', icon: <Building2 size={16} /> },
    { id: 'hospitality', label: 'Hospitality', icon: <Hotel size={16} /> },
    { id: 'healthcare', label: 'Healthcare', icon: <Stethoscope size={16} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={16} /> },
    { id: 'my-investments', label: 'My Investments', icon: <InvestmentIcon size={16} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'commercial':
        return <CommercialProjectsTab onProjectClick={setSelectedProject} />;
      case 'hospitality':
        return <HospitalityProjectsTab onProjectClick={setSelectedProject} />;
      case 'healthcare':
        return <HealthcareProjectsTab onProjectClick={setSelectedProject} />;
      case 'education':
        return <EducationProjectsTab onProjectClick={setSelectedProject} />;
      case 'my-investments':
        return <MyInfrastructureInvestmentsTab investments={userInvestments} onProjectClick={setSelectedProject} />;
      default:
        return <CommercialProjectsTab onProjectClick={setSelectedProject} />;
    }
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
            Infrastructure Investments
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            Invest in commercial, hospitality, healthcare, and education infrastructure projects
          </p>
        </div>
        {/* Hidden for security - only admin can list projects */}
        {/* <button
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
          Add Infrastructure Project
        </button> */}
      </div>

      {/* Investment Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
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
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
            TSh {investmentSummary.totalInvested.toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Total Invested
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
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
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
            TSh {investmentSummary.expectedReturns.toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Expected Returns
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
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
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>
            TSh {investmentSummary.actualReturns.toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Actual Returns
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
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
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#8b5cf6', marginBottom: '8px' }}>
            {investmentSummary.averageROI.toFixed(1)}%
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Average ROI
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? 'var(--mc-sidebar-bg)' : 'white',
              color: activeTab === tab.id ? 'white' : '#6b7280',
              boxShadow: activeTab === tab.id ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Project Details Modal */}
      <InfrastructureProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}


