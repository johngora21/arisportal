'use client';

import React, { useState, useMemo } from 'react';
import { Building, Plus, Eye, MapPin, Home, List } from 'lucide-react';
import { Property } from './types';
import LandTab from './components/LandTab';
import HouseTab from './components/HouseTab';
import MyListingsTab from './components/MyListingsTab';
import ListPropertyModal from './components/ListPropertyModal';

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('land');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showListPropertyModal, setShowListPropertyModal] = useState(false);

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
      } else if (activeTab === 'house') {
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
          />
        );
      case 'house':
        return (
          <HouseTab
            properties={filteredProperties}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />
        );
      case 'my-listings':
        return (
          <MyListingsTab
            properties={filteredProperties}
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
          Marketplace
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            Browse and list properties for sale
          </p>
        </div>
        <button
          onClick={() => setShowListPropertyModal(true)}
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
          List Property
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {[
            { id: 'land', label: 'Land', icon: <MapPin size={16} /> },
            { id: 'house', label: 'House', icon: <Home size={16} /> },
            { id: 'my-listings', label: 'My Listings', icon: <List size={16} /> }
          ].map((tab) => (
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

      {/* List Property Modal */}
      <ListPropertyModal
        isOpen={showListPropertyModal}
        onClose={() => setShowListPropertyModal(false)}
      />
    </div>
  );
}