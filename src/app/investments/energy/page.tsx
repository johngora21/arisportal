'use client';

import React, { useState, useMemo } from 'react';
import { Zap, Plus, Sun, Wind, Droplets, Thermometer, Leaf } from 'lucide-react';
import { EnergyProject } from './models';
import InvestmentIcon from '@/components/icons/InvestmentIcon';
import SolarProjectsTab from './components/SolarProjectsTab';
import WindProjectsTab from './components/WindProjectsTab';
import HydroProjectsTab from './components/HydroProjectsTab';
import MyEnergyInvestmentsTab from './components/MyEnergyInvestmentsTab';
import EnergyProjectDetailsModal from './components/EnergyProjectDetailsModal';

export default function EnergyPage() {
  const [activeTab, setActiveTab] = useState('solar');
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<EnergyProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data for energy projects
  const energyProjects: EnergyProject[] = useMemo(() => [
    {
      id: 'energy-1',
      title: 'Kilimanjaro Solar Farm',
      location: 'Kilimanjaro Region, Tanzania',
      description: 'Large-scale solar photovoltaic farm with advanced tracking systems for maximum energy production.',
      image: '/images/solar-farm.jpg',
      currentInvestors: 15,
      maxInvestors: 40,
      roi: 18,
      minimumInvestment: 30000000,
      status: 'active',
      category: 'solar',
      energyType: 'solar',
      capacity: '100 MW',
      technology: 'Solar PV with Tracking',
      expectedGeneration: '180 GWh/year',
      carbonReduction: '90,000 tons CO2/year',
      gridConnection: 'Grid-connected',
      commissioningDate: '2024-06-01',
      projectDuration: '2 years',
      totalValue: 1200000000,
      targetInvestors: 40,
      fundingProgress: 75,
      expectedROI: 18,
      expectedReturn: 9000000,
      actualReturn: 2100000,
      investmentDate: '2024-01-10T00:00:00Z',
      payoutSchedule: [
        { date: '2024-07-10T00:00:00Z', amount: 2100000, status: 'paid' },
        { date: '2025-01-10T00:00:00Z', amount: 2100000, status: 'pending' },
        { date: '2025-07-10T00:00:00Z', amount: 2100000, status: 'pending' },
        { date: '2026-01-10T00:00:00Z', amount: 2700000, status: 'pending' },
      ]
    },
    {
      id: 'energy-2',
      title: 'Arusha Wind Energy Park',
      location: 'Arusha, Tanzania',
      description: 'Modern wind farm with high-efficiency turbines designed for optimal wind conditions in the region.',
      image: '/images/wind-farm.jpg',
      currentInvestors: 8,
      maxInvestors: 25,
      roi: 16,
      minimumInvestment: 25000000,
      status: 'active',
      category: 'wind',
      energyType: 'wind',
      capacity: '75 MW',
      technology: 'Wind Turbines',
      expectedGeneration: '220 GWh/year',
      carbonReduction: '110,000 tons CO2/year',
      gridConnection: 'Grid-connected',
      commissioningDate: '2024-08-15',
      projectDuration: '2.5 years',
      totalValue: 900000000,
      targetInvestors: 25,
      fundingProgress: 60,
      expectedROI: 16,
      expectedReturn: 6000000,
      actualReturn: 0,
      investmentDate: '2024-02-20T00:00:00Z',
      payoutSchedule: [
        { date: '2024-08-20T00:00:00Z', amount: 1500000, status: 'pending' },
        { date: '2025-02-20T00:00:00Z', amount: 1500000, status: 'pending' },
        { date: '2025-08-20T00:00:00Z', amount: 1500000, status: 'pending' },
        { date: '2026-02-20T00:00:00Z', amount: 1500000, status: 'pending' },
      ]
    },
    {
      id: 'energy-3',
      title: 'Rufiji Hydroelectric Plant',
      location: 'Rufiji River, Tanzania',
      description: 'Run-of-river hydroelectric project providing clean, reliable power with minimal environmental impact.',
      image: '/images/hydro-plant.jpg',
      currentInvestors: 22,
      maxInvestors: 35,
      roi: 14,
      minimumInvestment: 20000000,
      status: 'active',
      category: 'hydro',
      energyType: 'hydro',
      capacity: '50 MW',
      technology: 'Run-of-River Hydro',
      expectedGeneration: '300 GWh/year',
      carbonReduction: '150,000 tons CO2/year',
      gridConnection: 'Grid-connected',
      commissioningDate: '2024-05-30',
      projectDuration: '3 years',
      totalValue: 750000000,
      targetInvestors: 35,
      fundingProgress: 85,
      expectedROI: 14,
      expectedReturn: 4200000,
      actualReturn: 1050000,
      investmentDate: '2024-01-05T00:00:00Z',
      payoutSchedule: [
        { date: '2024-07-05T00:00:00Z', amount: 1050000, status: 'paid' },
        { date: '2025-01-05T00:00:00Z', amount: 1050000, status: 'pending' },
        { date: '2025-07-05T00:00:00Z', amount: 1050000, status: 'pending' },
        { date: '2026-01-05T00:00:00Z', amount: 1050000, status: 'pending' },
      ]
    },
    {
      id: 'energy-4',
      title: 'Dar es Salaam Solar Rooftop Initiative',
      location: 'Dar es Salaam, Tanzania',
      description: 'Distributed solar rooftop installations across commercial buildings in Dar es Salaam.',
      image: '/images/rooftop-solar.jpg',
      currentInvestors: 12,
      maxInvestors: 30,
      roi: 20,
      minimumInvestment: 15000000,
      status: 'funded',
      category: 'solar',
      energyType: 'solar',
      capacity: '25 MW',
      technology: 'Rooftop Solar PV',
      expectedGeneration: '45 GWh/year',
      carbonReduction: '22,500 tons CO2/year',
      gridConnection: 'Grid-connected',
      commissioningDate: '2024-04-01',
      projectDuration: '1.5 years',
      totalValue: 450000000,
      targetInvestors: 30,
      fundingProgress: 100,
      expectedROI: 20,
      expectedReturn: 4500000,
      actualReturn: 0,
      investmentDate: '2024-03-15T00:00:00Z',
      payoutSchedule: [
        { date: '2024-09-15T00:00:00Z', amount: 1125000, status: 'pending' },
        { date: '2025-03-15T00:00:00Z', amount: 1125000, status: 'pending' },
        { date: '2025-09-15T00:00:00Z', amount: 1125000, status: 'pending' },
        { date: '2026-03-15T00:00:00Z', amount: 1125000, status: 'pending' },
      ]
    },
    {
      id: 'energy-5',
      title: 'Mwanza Geothermal Exploration',
      location: 'Mwanza, Tanzania',
      description: 'Geothermal energy exploration and development project in the Rift Valley region.',
      image: '/images/geothermal.jpg',
      currentInvestors: 6,
      maxInvestors: 20,
      roi: 22,
      minimumInvestment: 35000000,
      status: 'active',
      category: 'geothermal',
      energyType: 'geothermal',
      capacity: '30 MW',
      technology: 'Geothermal Power Plant',
      expectedGeneration: '240 GWh/year',
      carbonReduction: '120,000 tons CO2/year',
      gridConnection: 'Grid-connected',
      commissioningDate: '2025-01-01',
      projectDuration: '4 years',
      totalValue: 600000000,
      targetInvestors: 20,
      fundingProgress: 45,
      expectedROI: 22,
      expectedReturn: 7700000,
      actualReturn: 0,
      investmentDate: '2024-04-10T00:00:00Z',
      payoutSchedule: [
        { date: '2025-04-10T00:00:00Z', amount: 1925000, status: 'pending' },
        { date: '2026-04-10T00:00:00Z', amount: 1925000, status: 'pending' },
        { date: '2027-04-10T00:00:00Z', amount: 1925000, status: 'pending' },
        { date: '2028-04-10T00:00:00Z', amount: 1925000, status: 'pending' },
      ]
    },
    {
      id: 'energy-6',
      title: 'Dodoma Biomass Power Plant',
      location: 'Dodoma, Tanzania',
      description: 'Sustainable biomass power plant using agricultural waste for clean energy generation.',
      image: '/images/biomass-plant.jpg',
      currentInvestors: 18,
      maxInvestors: 28,
      roi: 17,
      minimumInvestment: 22000000,
      status: 'completed',
      category: 'biomass',
      energyType: 'biomass',
      capacity: '40 MW',
      technology: 'Biomass Combustion',
      expectedGeneration: '320 GWh/year',
      carbonReduction: '160,000 tons CO2/year',
      gridConnection: 'Grid-connected',
      commissioningDate: '2023-12-01',
      projectDuration: '2 years',
      totalValue: 800000000,
      targetInvestors: 28,
      fundingProgress: 100,
      expectedROI: 17,
      expectedReturn: 6800000,
      actualReturn: 6800000,
      investmentDate: '2023-06-20T00:00:00Z',
      payoutSchedule: [
        { date: '2023-12-20T00:00:00Z', amount: 1700000, status: 'paid' },
        { date: '2024-06-20T00:00:00Z', amount: 1700000, status: 'paid' },
        { date: '2024-12-20T00:00:00Z', amount: 1700000, status: 'paid' },
        { date: '2025-06-20T00:00:00Z', amount: 1700000, status: 'paid' },
      ]
    },
  ], []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleProjectClick = (project: EnergyProject) => {
    setSelectedProject(project);
    setShowProjectDetailsModal(true);
  };

  const filteredProjects = useMemo(() => {
    let projects = energyProjects;

    if (activeTab === 'solar') {
      projects = projects.filter(p => p.energyType === 'solar');
    } else if (activeTab === 'wind') {
      projects = projects.filter(p => p.energyType === 'wind');
    } else if (activeTab === 'hydro') {
      projects = projects.filter(p => p.energyType === 'hydro');
    } else if (activeTab === 'my-investments') {
      projects = projects.filter(p => p.currentInvestors > 0);
    }

    if (searchTerm) {
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      if (activeTab === 'solar' && typeFilter !== 'all') {
        projects = projects.filter(p => p.technology?.toLowerCase().includes(typeFilter.toLowerCase()));
      } else if (activeTab === 'wind' && typeFilter !== 'all') {
        projects = projects.filter(p => p.technology?.toLowerCase().includes(typeFilter.toLowerCase()));
      } else if (activeTab === 'hydro' && typeFilter !== 'all') {
        projects = projects.filter(p => p.technology?.toLowerCase().includes(typeFilter.toLowerCase()));
      }
    }

    return projects;
  }, [searchTerm, activeTab, typeFilter, energyProjects]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'solar':
        return (
          <SolarProjectsTab
            projects={filteredProjects}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onProjectClick={handleProjectClick}
          />
        );
      case 'wind':
        return (
          <WindProjectsTab
            projects={filteredProjects}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onProjectClick={handleProjectClick}
          />
        );
      case 'hydro':
        return (
          <HydroProjectsTab
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
          <MyEnergyInvestmentsTab
            projects={energyProjects.filter(p => p.currentInvestors > 0)}
            onInvestmentClick={handleProjectClick}
          />
        );
      default:
        return (
          <SolarProjectsTab
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

  // Calculate user's total investment summary
  const myInvestments = energyProjects.filter(p => p.currentInvestors > 0);
  const totalInvested = myInvestments.reduce((sum, inv) => sum + inv.minimumInvestment, 0);
  const totalExpectedReturn = myInvestments.reduce((sum, inv) => sum + (inv.expectedReturn || 0), 0);
  const totalActualReturn = myInvestments.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
  const averageROI = myInvestments.length > 0 ?
    (totalActualReturn / totalInvested * 100) : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
          Clean Energy Investments
        </h1>
        <button
          style={{
            backgroundColor: 'var(--mc-sidebar-bg)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
          }}
        >
          <Plus size={16} />
          List Energy Project
        </button>
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
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
            {formatPrice(totalInvested).replace('TZS', '').trim()}
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
            {formatPrice(totalExpectedReturn).replace('TZS', '').trim()}
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
            {formatPrice(totalActualReturn).replace('TZS', '').trim()}
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
            {averageROI.toFixed(1)}%
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Average ROI
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'solar', label: 'Solar Energy', icon: <Sun size={16} /> },
          { id: 'wind', label: 'Wind Energy', icon: <Wind size={16} /> },
          { id: 'hydro', label: 'Hydro Energy', icon: <Droplets size={16} /> },
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

      {/* Energy Project Details Modal */}
      <EnergyProjectDetailsModal
        isOpen={showProjectDetailsModal}
        onClose={() => setShowProjectDetailsModal(false)}
        project={selectedProject}
      />
    </div>
  );
}


