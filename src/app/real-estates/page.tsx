'use client';

import React, { useState, useMemo } from 'react';
import { Building, Plus, Eye, MapPin, Home, List, TrendingUp } from 'lucide-react';
import { Property } from './marketplace/types';
import LandTab from './marketplace/components/LandTab';
import HouseTab from './marketplace/components/HouseTab';
import InvestmentProjectsTab from './marketplace/components/InvestmentProjectsTab';
import MyListingsTab from './marketplace/components/MyListingsTab';
import MyPropertiesTab from './marketplace/components/MyPropertiesTab';
import ListPropertyModal from './marketplace/components/ListPropertyModal';
import PropertyDetailsModal from './marketplace/components/PropertyDetailsModal';
import InvestmentProjectDetailsModal from './marketplace/components/InvestmentProjectDetailsModal';

export default function RealEstatesPage() {
  const [activeTab, setActiveTab] = useState('land');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showListPropertyModal, setShowListPropertyModal] = useState(false);
  const [showPropertyDetailsModal, setShowPropertyDetailsModal] = useState(false);
  const [showInvestmentProjectModal, setShowInvestmentProjectModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setShowInvestmentProjectModal(true);
  };

  const handlePropertyClick = (property: any) => {
    // Convert Property to PropertyDetails format
    const propertyDetails = {
      ...property,
      images: property.images || [property.image],
      features: property.features || ['Modern Design', 'Prime Location', 'Good Investment'],
      amenities: property.amenities || ['Parking', 'Security', 'Utilities'],
      seller: {
        ...property.seller,
        role: property.seller.role || 'Property Owner'
      },
      verificationStatus: property.verificationStatus || 'verified',
      documents: {
        titleDeed: true,
        survey: true,
        permits: true
      }
    };
    setSelectedProperty(propertyDetails);
    setShowPropertyDetailsModal(true);
  };

  // Mock investment projects data
  const investmentProjects = [
    {
      id: '1',
      title: 'Masaki Commercial Complex',
      location: 'Masaki, Dar es Salaam',
      totalValue: 500000000,
      minimumInvestment: 5000000,
      currentInvestors: 12,
      targetInvestors: 50,
      fundingProgress: 24,
      expectedROI: 15,
      projectDuration: '24 months',
      image: '/api/placeholder/400/300',
      description: 'Modern commercial complex with retail spaces, offices, and parking facilities in prime Masaki location.',
      status: 'active' as const
    },
    {
      id: '2',
      title: 'Kinondoni Residential Development',
      location: 'Kinondoni, Dar es Salaam',
      totalValue: 300000000,
      minimumInvestment: 2000000,
      currentInvestors: 8,
      targetInvestors: 30,
      fundingProgress: 27,
      expectedROI: 12,
      projectDuration: '18 months',
      image: '/api/placeholder/400/300',
      description: 'Affordable housing development with 50 units targeting middle-income families.',
      status: 'active' as const
    },
    {
      id: '3',
      title: 'CBD Office Tower',
      location: 'CBD, Dar es Salaam',
      totalValue: 800000000,
      minimumInvestment: 10000000,
      currentInvestors: 25,
      targetInvestors: 40,
      fundingProgress: 63,
      expectedROI: 18,
      projectDuration: '36 months',
      image: '/api/placeholder/400/300',
      description: 'Premium office tower with modern amenities and prime CBD location.',
      status: 'active' as const
    },
    {
      id: '4',
      title: 'Kigamboni Mixed-Use Project',
      location: 'Kigamboni, Dar es Salaam',
      totalValue: 200000000,
      minimumInvestment: 3000000,
      currentInvestors: 15,
      targetInvestors: 20,
      fundingProgress: 75,
      expectedROI: 14,
      projectDuration: '20 months',
      image: '/api/placeholder/400/300',
      description: 'Mixed-use development with residential and commercial components.',
      status: 'funded' as const
    }
  ];

  // Mock user properties data (not for sale, for loan valuation)
  const userProperties = [
    {
      id: '1',
      title: 'My Family Home',
      type: 'house' as const,
      location: 'Mikocheni, Dar es Salaam',
      price: 120000000,
      size: '150 sqm',
      bedrooms: 4,
      bathrooms: 3,
      kitchen: 1,
      image: '/api/placeholder/400/300',
      description: 'Family home with garden and parking space.',
      acquisitionDate: '2020-03-15',
      currentValue: 180000000,
      verificationStatus: 'approved' as const
    },
    {
      id: '2',
      title: 'Investment Land',
      type: 'land' as const,
      location: 'Ubungo, Dar es Salaam',
      price: 45000000,
      size: '800 sqm',
      image: '/api/placeholder/400/300',
      description: 'Prime land for future development.',
      acquisitionDate: '2021-08-20',
      currentValue: 72000000,
      verificationStatus: 'pending' as const
    },
    {
      id: '3',
      title: 'Rental Apartment',
      type: 'apartment' as const,
      location: 'Kariakoo, Dar es Salaam',
      price: 75000000,
      size: '90 sqm',
      bedrooms: 2,
      bathrooms: 2,
      kitchen: 1,
      image: '/api/placeholder/400/300',
      description: 'Two-bedroom apartment currently rented out.',
      acquisitionDate: '2019-11-10',
      currentValue: 105000000,
      verificationStatus: 'approved' as const
    },
    {
      id: '4',
      title: 'Commercial Office',
      type: 'commercial' as const,
      location: 'CBD, Dar es Salaam',
      price: 200000000,
      size: '200 sqm',
      image: '/api/placeholder/400/300',
      description: 'Office space in prime CBD location.',
      acquisitionDate: '2022-01-05',
      currentValue: 250000000,
      verificationStatus: 'rejected' as const
    }
  ];

  // Mock properties data
  const properties: Property[] = [
    {
      id: '1',
      title: 'Prime Land in Masaki',
      type: 'land',
      location: 'Masaki, Dar es Salaam',
      price: 150000000,
      size: '500 sqm',
      image: '/api/placeholder/400/300',
      description: 'Prime commercial land in Masaki with excellent road access and utilities.',
      seller: {
        name: 'John Mwalimu',
        phone: '+255 123 456 789',
        email: 'john@example.com'
      },
      listedDate: '2024-01-15',
      status: 'available'
    },
    {
      id: '2',
      title: 'Modern Apartment',
      type: 'apartment',
      location: 'Kinondoni, Dar es Salaam',
      price: 85000000,
      size: '120 sqm',
      bedrooms: 3,
      bathrooms: 2,
      kitchen: 1,
      image: '/api/placeholder/400/300',
      description: 'Furnished 3-bedroom apartment with modern amenities.',
      seller: {
        name: 'Sarah Kimaro',
        phone: '+255 987 654 321',
        email: 'sarah@example.com'
      },
      listedDate: '2024-01-10',
      status: 'available'
    },
    {
      id: '3',
      title: 'Commercial Building',
      type: 'commercial',
      location: 'CBD, Dar es Salaam',
      price: 250000000,
      size: '300 sqm',
      image: '/api/placeholder/400/300',
      description: 'Office building in central business district.',
      seller: {
        name: 'Ahmed Hassan',
        phone: '+255 555 123 456',
        email: 'ahmed@example.com'
      },
      listedDate: '2024-01-05',
      status: 'available'
    }
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by active tab
      let matchesTab = true;
      if (activeTab === 'land') {
        matchesTab = property.type === 'land';
      } else if (activeTab === 'buildings') {
        matchesTab = property.type === 'house' || property.type === 'apartment' || property.type === 'commercial';
      } else if (activeTab === 'my-listings') {
        // For now, show all properties as "my listings" - in real app, filter by current user
        matchesTab = true;
      }
      
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'land':
        return (
          <LandTab
            properties={filteredProperties}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onPropertyClick={handlePropertyClick}
          />
        );
      case 'buildings':
        return (
          <HouseTab
            properties={filteredProperties}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onPropertyClick={handlePropertyClick}
          />
        );
      case 'investment-projects':
        return <InvestmentProjectsTab projects={investmentProjects} onProjectClick={handleProjectClick} />;
      case 'my-listings':
        return (
          <MyListingsTab
            properties={filteredProperties}
            onPropertyClick={handlePropertyClick}
          />
        );
      case 'my-properties':
        return (
          <MyPropertiesTab
            properties={userProperties}
          />
        );
      default:
        return (
          <LandTab
            properties={filteredProperties}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onPropertyClick={handlePropertyClick}
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
          Real Estates
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            Browse and list properties for sale
          </p>
        </div>
        <button
          onClick={() => setShowListPropertyModal(true)}
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
            gap: '8px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1e293b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0f172a';
          }}
        >
          <Plus size={16} />
          Add Property
        </button>
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
          {[
            { id: 'land', label: 'Plots', icon: <MapPin size={16} /> },
            { id: 'buildings', label: 'Buildings', icon: <Home size={16} /> },
            { id: 'investment-projects', label: 'Investment Projects', icon: <TrendingUp size={16} /> },
            { id: 'my-listings', label: 'My Listings', icon: <List size={16} /> },
            { id: 'my-properties', label: 'My Properties', icon: <Building size={16} /> }
          ].map((tab) => (
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

      {/* List Property Modal */}
      <ListPropertyModal
        isOpen={showListPropertyModal}
        onClose={() => setShowListPropertyModal(false)}
      />

      {/* Property Details Modal */}
      <PropertyDetailsModal
        isOpen={showPropertyDetailsModal}
        onClose={() => setShowPropertyDetailsModal(false)}
        property={selectedProperty}
      />

      {/* Investment Project Details Modal */}
      <InvestmentProjectDetailsModal
        isOpen={showInvestmentProjectModal}
        onClose={() => setShowInvestmentProjectModal(false)}
        project={selectedProject}
      />
    </div>
  );
}