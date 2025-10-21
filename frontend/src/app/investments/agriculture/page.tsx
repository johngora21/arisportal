'use client';

import React, { useState, useMemo } from 'react';
import { Leaf, Plus, Eye, MapPin, Wheat, TrendingUp, TreePine, DollarSign, Target, Award } from 'lucide-react';
import { AgricultureProject } from './models';
import InvestmentIcon from '@/components/icons/InvestmentIcon';
import CropProjectsTab from './components/CropProjectsTab';
import LivestockProjectsTab from './components/LivestockProjectsTab';
import AgroProcessingTab from './components/AgroProcessingTab';
import MyAgricultureInvestmentsTab from './components/MyAgricultureInvestmentsTab';
import AgricultureProjectDetailsModal from './components/AgricultureProjectDetailsModal';

export default function AgriculturePage() {
  const [activeTab, setActiveTab] = useState('crops');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetailsModal(true);
  };

  // Mock agriculture investment projects data
  const agricultureProjects: AgricultureProject[] = [
    {
      id: '1',
      title: 'Kilimanjaro Coffee Plantation',
      category: 'crops',
      location: 'Kilimanjaro Region, Tanzania',
      totalValue: 800000000,
      minimumInvestment: 15000000,
      currentInvestors: 18,
      targetInvestors: 35,
      fundingProgress: 51,
      expectedROI: 22,
      projectDuration: '36 months',
      image: '/api/placeholder/400/300',
      description: 'Premium coffee plantation with sustainable farming practices and direct export capabilities to international markets.',
      status: 'active' as const,
      cropType: 'Coffee',
      farmSize: '50 hectares',
      expectedYield: '25 tons/year',
      farmingMethod: 'Organic',
      climate: 'Tropical Highland',
      coordinates: {
        lat: -3.0674,
        lng: 37.3556
      }
    },
    {
      id: '2',
      title: 'Morogoro Rice Farm',
      category: 'crops',
      location: 'Morogoro, Tanzania',
      totalValue: 450000000,
      minimumInvestment: 8000000,
      currentInvestors: 12,
      targetInvestors: 25,
      fundingProgress: 48,
      expectedROI: 18,
      projectDuration: '24 months',
      image: '/api/placeholder/400/300',
      description: 'Large-scale rice cultivation with modern irrigation systems and processing facilities for local and regional markets.',
      status: 'active' as const,
      cropType: 'Rice',
      farmSize: '200 hectares',
      expectedYield: '800 tons/year',
      farmingMethod: 'Modern Irrigation',
      climate: 'Tropical Wet',
      coordinates: {
        lat: -6.8278,
        lng: 37.6591
      }
    },
    {
      id: '3',
      title: 'Arusha Dairy Farm',
      category: 'livestock',
      location: 'Arusha, Tanzania',
      totalValue: 600000000,
      minimumInvestment: 12000000,
      currentInvestors: 22,
      targetInvestors: 30,
      fundingProgress: 73,
      expectedROI: 16,
      projectDuration: '30 months',
      image: '/api/placeholder/400/300',
      description: 'Modern dairy farm with 500 cattle, automated milking systems, and milk processing plant for local distribution.',
      status: 'active' as const,
      livestockType: 'Dairy Cattle',
      farmSize: '100 hectares',
      livestockCount: 500,
      farmingMethod: 'Intensive',
      climate: 'Temperate Highland',
      coordinates: {
        lat: -3.3869,
        lng: 36.6830
      }
    },
    {
      id: '4',
      title: 'Iringa Maize Processing Plant',
      category: 'processing',
      location: 'Iringa, Tanzania',
      totalValue: 350000000,
      minimumInvestment: 10000000,
      currentInvestors: 15,
      targetInvestors: 20,
      fundingProgress: 75,
      expectedROI: 20,
      projectDuration: '18 months',
      image: '/api/placeholder/400/300',
      description: 'State-of-the-art maize processing facility producing flour, animal feed, and ethanol for domestic and export markets.',
      status: 'funded' as const,
      processingType: 'Maize Processing',
      capacity: '50,000 tons/year',
      products: ['Flour', 'Animal Feed', 'Ethanol'],
      technology: 'Modern Processing',
      market: 'Domestic & Export',
      coordinates: {
        lat: -7.7667,
        lng: 35.7000
      }
    },
    {
      id: '5',
      title: 'Dodoma Sunflower Farm',
      category: 'crops',
      location: 'Dodoma, Tanzania',
      totalValue: 280000000,
      minimumInvestment: 6000000,
      currentInvestors: 8,
      targetInvestors: 20,
      fundingProgress: 40,
      expectedROI: 15,
      projectDuration: '20 months',
      image: '/api/placeholder/400/300',
      description: 'Sunflower cultivation for oil production with integrated processing facilities for cooking oil and biodiesel.',
      status: 'active' as const,
      cropType: 'Sunflower',
      farmSize: '150 hectares',
      expectedYield: '300 tons/year',
      farmingMethod: 'Rain-fed',
      climate: 'Semi-arid',
      coordinates: {
        lat: -6.1630,
        lng: 35.7516
      }
    },
    {
      id: '6',
      title: 'Mwanza Fish Farm',
      category: 'livestock',
      location: 'Mwanza, Tanzania',
      totalValue: 400000000,
      minimumInvestment: 9000000,
      currentInvestors: 14,
      targetInvestors: 25,
      fundingProgress: 56,
      expectedROI: 19,
      projectDuration: '28 months',
      image: '/api/placeholder/400/300',
      description: 'Aquaculture facility producing tilapia and catfish with modern filtration systems and processing capabilities.',
      status: 'active' as const,
      livestockType: 'Fish (Tilapia/Catfish)',
      farmSize: '20 hectares',
      livestockCount: 100000,
      farmingMethod: 'Aquaculture',
      climate: 'Tropical Lake',
      coordinates: {
        lat: -2.5164,
        lng: 32.9173
      }
    }
  ];

  const filteredProjects = useMemo(() => {
    return agricultureProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by active tab
      let matchesTab = true;
      if (activeTab === 'crops') {
        matchesTab = project.category === 'crops';
      } else if (activeTab === 'livestock') {
        matchesTab = project.category === 'livestock';
      } else if (activeTab === 'processing') {
        matchesTab = project.category === 'processing';
      }
      
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'crops':
        return (
          <CropProjectsTab
            projects={filteredProjects}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onProjectClick={handleProjectClick}
          />
        );
      case 'livestock':
        return (
          <LivestockProjectsTab
            projects={filteredProjects}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onProjectClick={handleProjectClick}
          />
        );
      case 'processing':
        return (
          <AgroProcessingTab
            projects={filteredProjects}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onProjectClick={handleProjectClick}
          />
        );
      case 'my-investments':
        return (
          <MyAgricultureInvestmentsTab
            projects={agricultureProjects.filter(p => p.currentInvestors > 0)}
            onInvestmentClick={handleProjectClick}
          />
        );
      default:
        return (
          <CropProjectsTab
            projects={filteredProjects}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onProjectClick={handleProjectClick}
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
          Agriculture Investments
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            Invest in sustainable agriculture projects across Tanzania
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
          List Agriculture Project
        </button> */}
      </div>

      {/* My Investment Summary */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: 'transparent', borderRadius: '20px', color: '#3b82f6' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Invested</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>TSh 58,000,000</div>
            </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: 'transparent', borderRadius: '20px', color: '#10b981' }}>
              <Target size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Expected Returns</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>TSh 11,380,000</div>
            </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: 'transparent', borderRadius: '20px', color: '#f59e0b' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Actual Returns</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>TSh 1,950,000</div>
            </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: 'transparent', borderRadius: '20px', color: '#8b5cf6' }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Average ROI</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>3.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'crops', label: 'Crop Farming', icon: <Wheat size={16} /> },
          { id: 'livestock', label: 'Livestock', icon: <TreePine size={16} /> },
          { id: 'processing', label: 'Agro Processing', icon: <TrendingUp size={16} /> },
          { id: 'my-investments', label: 'My Investments', icon: <InvestmentIcon size={16} /> }
        ].map((tab) => (
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

      {/* Agriculture Project Details Modal */}
      <AgricultureProjectDetailsModal
        isOpen={showProjectDetailsModal}
        onClose={() => setShowProjectDetailsModal(false)}
        project={selectedProject}
      />
    </div>
  );
}
