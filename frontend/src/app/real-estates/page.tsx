'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Building, Plus, Eye, MapPin, Home, List, Warehouse, TrendingUp } from 'lucide-react';
import { Property, InvestmentProject, UserProperty } from './marketplace/models';
import LandTab from './marketplace/components/LandTab';
import HouseTab from './marketplace/components/HouseTab';
import MyListingsTab from './marketplace/components/MyListingsTab';
import MyPropertiesTab from './marketplace/components/MyPropertiesTab';
import InvestmentProjectsTab from './marketplace/components/InvestmentProjectsTab';
import PropertyDetailsModal from './marketplace/components/PropertyDetailsModal';
import RealEstateProjectDetailsModal from './marketplace/components/RealEstateProjectDetailsModal';
import AddLandPropertyModal from './marketplace/components/admin/AddLandPropertyModal';
import AddBuildingPropertyModal from './marketplace/components/admin/AddBuildingPropertyModal';
import AddInvestmentProjectModal from './marketplace/components/admin/AddInvestmentProjectModal';
import { realEstateAPI } from './marketplace/services/realEstateAPI';

export default function RealEstatesPage() {
  const [activeTab, setActiveTab] = useState('land');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showPropertyDetailsModal, setShowPropertyDetailsModal] = useState(false);
  const [showInvestmentProjectModal, setShowInvestmentProjectModal] = useState(false);
  const [showAddLandModal, setShowAddLandModal] = useState(false);
  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSelfOwnedProperty, setIsSelfOwnedProperty] = useState(false);
  
  // API state management
  const [apiData, setApiData] = useState({
    properties: [] as Property[],
    investmentProjects: [] as InvestmentProject[],
    userProperties: [] as UserProperty[]
  });
  const [loading, setLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadDataFromAPI();
  }, []);

  // Load data from API
  const loadDataFromAPI = async () => {
    setLoading(true);
    try {
      const [properties, investmentProjects, userProperties] = await Promise.all([
        realEstateAPI.getProperties({ limit: 100, offset: 0 }),
        realEstateAPI.getInvestmentProjects({ limit: 100, offset: 0 }),
        realEstateAPI.getUserProperties(1)
      ]);

      setApiData({ properties, investmentProjects, userProperties });
    } catch (error) {
      console.error('Error loading data from API:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current data source (API only)
  const getCurrentData = () => {
    return apiData;
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setShowInvestmentProjectModal(true);
  };

  const handlePropertyClick = (property: any, isSelfOwned = false) => {
    // Map backend fields to frontend PropertyDetails format
    const propertyDetails = {
      ...property,
      // Map backend fields to frontend expected fields
      contactName: property.contact_name || property.seller?.name || 'N/A',
      contactRole: property.contact_role || property.seller?.role || 'N/A',
      contactPhone: property.contact_phone || property.seller?.phone || 'N/A',
      contactEmail: property.contact_email || property.seller?.email || 'N/A',
      ownerName: property.contact_name || property.seller?.name || 'N/A',
      role: property.contact_role || property.seller?.role || 'N/A',
      phoneNumber: property.contact_phone || property.seller?.phone || 'N/A',
      email: property.contact_email || property.seller?.email || 'N/A',
      // Map location fields - use actual backend fields
      region: property.region || 'N/A',
      district: property.district || 'N/A',
      ward: property.ward || 'N/A',
      street: property.street || 'N/A',
      council: property.council || 'N/A',
      locality: property.locality || 'N/A',
      // Map plot/land specific fields - use actual backend fields
      block: property.block || 'N/A',
      lotNumber: property.lot_number || 'N/A',
      legalArea: property.legal_area || 'N/A',
      lotUse: property.lot_use || 'N/A',
      // Map building specific fields - use actual backend fields
      propertyType: property.type === 'house' ? 'House' : 
                   property.type === 'apartment' ? 'Apartment' : 
                   property.type === 'commercial' ? 'Commercial' : 
                   property.type === 'land' ? 'Land' : 'N/A',
      yearBuilt: property.year_built || 'N/A',
      furnishing: property.furnishing || 'N/A',
      parking: property.parking || 'N/A',
      utilities: property.utilities || 'N/A',
      // Map other fields
      estimatedValue: property.estimated_value || property.price,
      features: property.features || [],
      images: property.images || [property.image || '/api/placeholder/600/300'],
      amenities: property.amenities || [],
      // Ensure size is properly formatted
      size: property.size && property.size !== '0 sqm' ? property.size : 'N/A',
      // Map bedroom/bathroom fields with proper handling
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      kitchen: property.kitchen || 0,
      seller: property.seller || {
        name: property.contact_name || 'Property Owner',
        phone: property.contact_phone || 'N/A',
        email: property.contact_email || 'N/A',
        role: property.contact_role || 'Property Owner'
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

  const handleSaveLandProperty = async (property: any) => {
    try {
      const savedProperty = await realEstateAPI.createProperty({
        ...property,
        type: 'land'
      });
      
      if (savedProperty) {
        // Reload data to show the new property
        await loadDataFromAPI();
        setShowAddLandModal(false);
      }
    } catch (error) {
      console.error('Error saving land property:', error);
    }
  };

  const handleSaveBuildingProperty = async (property: any) => {
    try {
      const savedProperty = await realEstateAPI.createProperty({
        ...property,
        type: property.type || 'house'
      });
      
      if (savedProperty) {
        // Reload data to show the new property
        await loadDataFromAPI();
        setShowAddBuildingModal(false);
      }
    } catch (error) {
      console.error('Error saving building property:', error);
    }
  };

  const handleSaveInvestmentProject = async (project: any) => {
    try {
      const savedProject = await realEstateAPI.createInvestmentProject(project);
      
      if (savedProject) {
        // Reload data to show the new project
        await loadDataFromAPI();
        setShowAddInvestmentModal(false);
      }
    } catch (error) {
      console.error('Error saving investment project:', error);
    }
  };


  // Get current data (API or mock)
  const currentData = getCurrentData();
  const properties: Property[] = currentData.properties;
  const investmentProjects: InvestmentProject[] = currentData.investmentProjects;
  const userProperties: UserProperty[] = currentData.userProperties;

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
  }, [properties, searchTerm, activeTab]);

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
          <InvestmentProjectsTab
            projects={investmentProjects}
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
            Browse and list properties for sale with blockchain tokenization
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          
          {activeTab === 'land' && (
            <button
              onClick={() => setShowAddLandModal(true)}
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
              Add Plot
            </button>
          )}
          
          {activeTab === 'buildings' && (
            <button
              onClick={() => setShowAddBuildingModal(true)}
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
              Add Building
            </button>
          )}
          
          {activeTab === 'investments' && (
            <button
              onClick={() => setShowAddInvestmentModal(true)}
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
              Add Project
            </button>
          )}
        </div>
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

      {/* Property Details Modal */}
      <PropertyDetailsModal
        isOpen={showPropertyDetailsModal}
        onClose={() => setShowPropertyDetailsModal(false)}
        property={selectedProperty}
        isSelfOwned={isSelfOwnedProperty}
      />

      {/* Investment Project Details Modal */}
      {showInvestmentProjectModal && (
        <RealEstateProjectDetailsModal
          project={selectedProject}
          onClose={() => {
            setShowInvestmentProjectModal(false);
            setSelectedProject(null);
          }}
        />
      )}

      {/* Admin Modals */}
      <AddLandPropertyModal
        isOpen={showAddLandModal}
        onClose={() => setShowAddLandModal(false)}
        onSave={handleSaveLandProperty}
      />

      <AddBuildingPropertyModal
        isOpen={showAddBuildingModal}
        onClose={() => setShowAddBuildingModal(false)}
        onSave={handleSaveBuildingProperty}
      />

      <AddInvestmentProjectModal
        isOpen={showAddInvestmentModal}
        onClose={() => setShowAddInvestmentModal(false)}
        onSave={handleSaveInvestmentProject}
      />
    
    </div>
  );
}