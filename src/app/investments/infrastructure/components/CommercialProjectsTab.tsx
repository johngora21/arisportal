'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, DollarSign, Users, TrendingUp, Calendar, X, Building2 } from 'lucide-react';
import { InfrastructureProject } from '../models';

// Declare Leaflet types
declare const L: any;

interface CommercialProjectsTabProps {
  projects?: InfrastructureProject[];
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  typeFilter?: string;
  setTypeFilter?: (filter: string) => void;
  onProjectClick?: (project: InfrastructureProject) => void;
}

export default function CommercialProjectsTab({ 
  projects = [], 
  searchTerm = '', 
  setSearchTerm, 
  typeFilter = 'all',
  setTypeFilter,
  onProjectClick 
}: CommercialProjectsTabProps) {
  const [showMapView, setShowMapView] = useState(false);
  const [selectedProjectForMap, setSelectedProjectForMap] = useState<InfrastructureProject | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Mock data for commercial infrastructure projects
  const mockProjects: InfrastructureProject[] = [
    {
      id: 'com-1',
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
      coordinates: { lat: -6.7924, lng: 39.2083 }
    },
    {
      id: 'com-2',
      title: 'CBD Office Tower',
      category: 'commercial',
      description: 'Premium office tower with modern amenities and prime CBD location for corporate headquarters.',
      location: 'CBD, Dar es Salaam',
      landSize: '1.8 acres',
      zoning: 'Commercial',
      access: 'Main Road',
      duration: '30 months',
      expectedROI: 18,
      developmentStage: 'construction',
      status: 'active',
      totalProjectValue: 800000000,
      minimumInvestment: 10000000,
      currentInvestors: 25,
      targetInvestors: 40,
      fundingProgress: 62,
      investmentDeadline: 'Mar 2025',
      features: ['Premium Office Spaces', 'Conference Facilities', 'Underground Parking', 'Smart Building Technology'],
      image: '/api/placeholder/400/300',
      coordinates: { lat: -6.8168, lng: 39.2804 }
    },
    {
      id: 'com-3',
      title: 'Kinondoni Shopping Mall',
      category: 'commercial',
      description: 'Large shopping mall with retail stores, food court, and entertainment facilities.',
      location: 'Kinondoni, Dar es Salaam',
      landSize: '4.2 acres',
      zoning: 'Commercial',
      access: 'Main Road',
      duration: '36 months',
      expectedROI: 12,
      developmentStage: 'planning',
      status: 'active',
      totalProjectValue: 1200000000,
      minimumInvestment: 15000000,
      currentInvestors: 8,
      targetInvestors: 60,
      fundingProgress: 13,
      investmentDeadline: 'Jun 2025',
      features: ['Retail Stores', 'Food Court', 'Cinema', 'Children Play Area', 'Ample Parking'],
      image: '/api/placeholder/400/300',
      coordinates: { lat: -6.7924, lng: 39.2083 }
    }
  ];

  const displayProjects = projects.length > 0 ? projects : mockProjects;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleViewOnMap = (project: InfrastructureProject, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setSelectedProjectForMap(project);
    setShowMapView(true);
  };

  // Initialize map when map view is shown
  useEffect(() => {
    if (showMapView && mapRef.current && !mapInstanceRef.current && selectedProjectForMap?.coordinates) {
      // Initialize Leaflet map
      const map = L.map(mapRef.current).setView(
        [selectedProjectForMap.coordinates.lat, selectedProjectForMap.coordinates.lng], 
        12
      );

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add satellite tiles
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add marker for the selected project
      const marker = L.marker([selectedProjectForMap.coordinates.lat, selectedProjectForMap.coordinates.lng], {
        title: selectedProjectForMap.title
      }).addTo(map);

      markerRef.current = marker;

      // Add popup with project info
      marker.bindPopup(`
        <div style="padding: 8px; font-family: 'Poppins', sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
            ${selectedProjectForMap.title}
          </h3>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
            ${selectedProjectForMap.location}
          </p>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: #059669;">
            Category: ${selectedProjectForMap.category}
          </p>
          <p style="margin: 0; font-size: 14px; color: #059669; font-weight: 600;">
            Min Investment: ${formatPrice(selectedProjectForMap.minimumInvestment)}
          </p>
        </div>
      `).openPopup();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current = null;
      }
      markerRef.current = null;
    };
  }, [showMapView, selectedProjectForMap]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'funded': return '#3b82f6';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'funded': return 'Funded';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  return (
    <div>
      {/* Search and Filter Section */}
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '24px',
        justifyContent: 'flex-end'
      }}>
        <input
          type="text"
          placeholder="Search commercial projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm?.(e.target.value)}
          style={{
            width: '250px',
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '20px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--mc-sidebar-bg)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
          }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter?.(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '20px',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Types</option>
          <option value="office">Office Buildings</option>
          <option value="retail">Retail Centers</option>
          <option value="mixed-use">Mixed Use</option>
        </select>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        Commercial Infrastructure Projects
      </h2>
      
      {displayProjects.length === 0 ? (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '20px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '2px dashed #d1d5db'
        }}>
          <Building2 size={48} color="#9ca3af" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '16px 0 8px 0' }}>
            No commercial projects available
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Check back later for new commercial infrastructure opportunities
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '24px'
        }}>
          {displayProjects.map((project) => (
            <div
              key={project.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
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
              onClick={() => onProjectClick?.(project)}
            >
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f3f4f6',
                backgroundImage: `url(${project.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: getStatusColor(project.status),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {getStatusText(project.status)}
                </div>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4'
                }}>
                  {project.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <MapPin size={14} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {project.location}
                  </span>
                </div>

                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 16px 0',
                  lineHeight: '1.5',
                  flex: 1
                }}>
                  {project.description}
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {project.currentInvestors}/{project.targetInvestors}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={16} color="#10b981" />
                    <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '600' }}>
                      {project.expectedROI}% ROI
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {project.duration}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={16} color="#3b82f6" />
                    <span style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '600' }}>
                      TSh {project.minimumInvestment.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      flex: 1,
                      backgroundColor: 'var(--mc-sidebar-bg)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                    }}
                  >
                    Invest Now
                  </button>
                  <button
                    onClick={(e) => handleViewOnMap(project, e)}
                    style={{
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                  >
                    <MapPin size={14} />
                    Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map Modal */}
      {showMapView && selectedProjectForMap && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            width: '90%',
            height: '80%',
            maxWidth: '1200px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                {selectedProjectForMap.title} - Location
              </h2>
              <button
                onClick={() => setShowMapView(false)}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} color="#6b7280" />
              </button>
            </div>
            <div ref={mapRef} style={{ flex: 1, width: '100%' }} />
          </div>
        </div>
      )}
    </div>
  );
}

