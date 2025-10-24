'use client';

import React, { useState, useMemo } from 'react';
import { Building, Plus, Eye, MapPin, Home, List, Warehouse, TrendingUp } from 'lucide-react';
import { Property, InvestmentProject, UserProperty } from './marketplace/models';
import LandTab from './marketplace/components/LandTab';
import HouseTab from './marketplace/components/HouseTab';
import MyListingsTab from './marketplace/components/MyListingsTab';
import MyPropertiesTab from './marketplace/components/MyPropertiesTab';
import RealEstateInvestmentsTab from './marketplace/components/RealEstateInvestmentsTab';
import ListPropertyModal from './marketplace/components/ListPropertyModal';
import PropertyDetailsModal from './marketplace/components/PropertyDetailsModal';
import { landProperties, buildingProperties, userProperties } from './marketplace/data/mockData';

export default function RealEstatesPage() {
  const [activeTab, setActiveTab] = useState('land');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showListPropertyModal, setShowListPropertyModal] = useState(false);
  const [showPropertyDetailsModal, setShowPropertyDetailsModal] = useState(false);
  const [showInvestmentProjectModal, setShowInvestmentProjectModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSelfOwnedProperty, setIsSelfOwnedProperty] = useState(false);

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setShowInvestmentProjectModal(true);
  };

  const handlePropertyClick = (property: any, isSelfOwned = false) => {
    // Convert Property to PropertyDetails format
    const propertyDetails = {
      ...property,
      images: property.images || [property.image],
      features: property.features || ['Modern Design', 'Prime Location', 'Good Investment'],
      amenities: property.amenities || ['Parking', 'Security', 'Utilities'],
      seller: property.seller ? {
        ...property.seller,
        role: property.seller.role || 'Property Owner'
      } : {
        name: 'Property Owner',
        phone: 'N/A',
        email: 'N/A',
        role: 'Property Owner'
      },
      verificationStatus: property.verificationStatus || 'verified',
      documents: {
        titleDeed: true,
        survey: true,
        permits: true
      }
    };
    setSelectedProperty(propertyDetails);
    setIsSelfOwnedProperty(isSelfOwned);
    setShowPropertyDetailsModal(true);
  };

  // Mock investment projects data
  const investmentProjects = [
    {
      id: '1',
      title: 'Masaki Commercial Complex',
      category: 'commercial',
      description: 'Modern commercial complex with retail spaces, offices, and parking facilities in prime Masaki location.',
      location: 'Masaki, Dar es Salaam',
      landSize: '2.5 acres',
      zoning: 'Commercial',
      access: 'Main Road',
      duration: '24 months',
      expectedROI: 15,
      developmentStage: 'planning',
      status: 'active',
      totalProjectValue: 500000000,
      minimumInvestment: 5000000,
      currentInvestors: 12,
      targetInvestors: 50,
      fundingProgress: 24,
      investmentDeadline: 'Dec 2024',
      features: ['Modern Office Spaces', 'Retail Shops', 'Underground Parking', 'Green Building Design'],
      image: '/api/placeholder/400/300',
      coordinates: {
        lat: -6.7789,
        lng: 39.2567
      }
    },
    {
      id: '2',
      title: 'Kinondoni Residential Development',
      category: 'residential',
      description: 'Affordable housing development with 50 units targeting middle-income families.',
      location: 'Kinondoni, Dar es Salaam',
      landSize: '3.0 acres',
      zoning: 'Residential',
      access: 'Main Road',
      duration: '18 months',
      expectedROI: 12,
      developmentStage: 'construction',
      status: 'active',
      totalProjectValue: 300000000,
      minimumInvestment: 2000000,
      currentInvestors: 8,
      targetInvestors: 30,
      fundingProgress: 27,
      investmentDeadline: 'Mar 2025',
      features: ['Affordable Housing', 'Community Center', 'Playground', 'Parking'],
      image: '/api/placeholder/400/300',
      coordinates: {
        lat: -6.7924,
        lng: 39.2083
      }
    },
    {
      id: '3',
      title: 'CBD Office Tower',
      category: 'commercial',
      description: 'Premium office tower with modern amenities and prime CBD location.',
      location: 'CBD, Dar es Salaam',
      landSize: '1.8 acres',
      zoning: 'Commercial',
      access: 'Main Road',
      duration: '36 months',
      expectedROI: 18,
      developmentStage: 'construction',
      status: 'active',
      totalProjectValue: 800000000,
      minimumInvestment: 10000000,
      currentInvestors: 25,
      targetInvestors: 40,
      fundingProgress: 63,
      investmentDeadline: 'Jun 2025',
      features: ['Premium Office Spaces', 'Conference Facilities', 'Underground Parking', 'Smart Building Technology'],
      image: '/api/placeholder/400/300',
      coordinates: {
        lat: -6.7924,
        lng: 39.2083
      }
    },
    {
      id: '4',
      title: 'Kigamboni Mixed-Use Project',
      category: 'mixed-use',
      description: 'Mixed-use development with residential and commercial components.',
      location: 'Kigamboni, Dar es Salaam',
      landSize: '4.0 acres',
      zoning: 'Mixed Use',
      access: 'Main Road',
      duration: '20 months',
      expectedROI: 14,
      developmentStage: 'planning',
      status: 'funded',
      totalProjectValue: 200000000,
      minimumInvestment: 3000000,
      currentInvestors: 15,
      targetInvestors: 20,
      fundingProgress: 75,
      investmentDeadline: 'Apr 2025',
      features: ['Residential Units', 'Commercial Spaces', 'Recreation Area', 'Parking'],
      image: '/api/placeholder/400/300',
      coordinates: {
        lat: -6.8234,
        lng: 39.3456
      }
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

  // Use mock data for properties
  const properties: Property[] = [...landProperties, ...buildingProperties];

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
      case 'investments':
        return (
          <RealEstateInvestmentsTab
            projects={investmentProjects}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onProjectClick={handleProjectClick}
          />
        );
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
            onPropertyClick={(property) => handlePropertyClick(property, true)}
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
            backgroundColor: 'var(--mc-sidebar-bg-hover)',
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
            e.currentTarget.style.backgroundColor; 'var(--mc-sidebar-bg-hover)';
          }}
        >
          <Plus size={16} />
          Add Property
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {[
          { id: 'land', label: 'Plots', icon: <MapPin size={16} /> },
          { id: 'buildings', label: 'Structures', icon: <Warehouse size={16} /> },
          { id: 'investments', label: 'Investments', icon: <TrendingUp size={16} /> },
          { id: 'my-listings', label: 'My Listings', icon: <List size={16} /> },
          { id: 'my-properties', label: 'My Properties', icon: <Building size={16} /> }
        ].map((tab) => (
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
        isSelfOwned={isSelfOwnedProperty}
      />

    
    </div>
  );
}