'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, DollarSign, Users, TrendingUp, Calendar, X, HeartPulse } from 'lucide-react';
import { InfrastructureProject } from '../models';

// Declare Leaflet types
declare const L: any;

interface HealthcareProjectsTabProps {
  projects?: InfrastructureProject[];
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  typeFilter?: string;
  setTypeFilter?: (filter: string) => void;
  onProjectClick?: (project: InfrastructureProject) => void;
}

export default function HealthcareProjectsTab({ 
  projects = [], 
  searchTerm = '', 
  setSearchTerm, 
  typeFilter = 'all',
  setTypeFilter,
  onProjectClick 
}: HealthcareProjectsTabProps) {
  const [showMapView, setShowMapView] = useState(false);
  const [selectedProjectForMap, setSelectedProjectForMap] = useState<InfrastructureProject | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Mock data for healthcare infrastructure projects
  const mockProjects: InfrastructureProject[] = [
    {
      id: 'health-1',
      title: 'Dar es Salaam Medical Center',
      category: 'healthcare',
      description: 'Modern medical center with specialized departments, emergency services, and advanced diagnostic facilities.',
      location: 'Masaki, Dar es Salaam',
      landSize: '2.8 acres',
      zoning: 'Institutional',
      access: 'Main Road',
      duration: '30 months',
      expectedROI: 12,
      developmentStage: 'construction',
      status: 'active',
      totalProjectValue: 900000000,
      minimumInvestment: 10000000,
      currentInvestors: 28,
      targetInvestors: 50,
      fundingProgress: 56,
      investmentDeadline: 'Mar 2025',
      features: ['Emergency Department', 'Specialized Clinics', 'Diagnostic Center', 'Pharmacy', 'Parking'],
      image: '/api/placeholder/400/300',
      coordinates: { lat: -6.7924, lng: 39.2083 }
    },
    {
      id: 'health-2',
      title: 'Arusha Regional Hospital',
      category: 'healthcare',
      description: 'Comprehensive regional hospital serving Northern Tanzania with modern medical facilities and patient care.',
      location: 'Arusha, Tanzania',
      landSize: '4.5 acres',
      zoning: 'Institutional',
      access: 'Main Road',
      duration: '36 months',
      expectedROI: 10,
      developmentStage: 'planning',
      status: 'active',
      totalProjectValue: 1500000000,
      minimumInvestment: 15000000,
      currentInvestors: 15,
      targetInvestors: 40,
      fundingProgress: 37,
      investmentDeadline: 'Jun 2025',
      features: ['General Hospital', 'Maternity Ward', 'Pediatric Unit', 'Laboratory', 'Radiology'],
      image: '/api/placeholder/400/300',
      coordinates: { lat: -3.3869, lng: 36.6830 }
    },
    {
      id: 'health-3',
      title: 'Mwanza Diagnostic Center',
      category: 'healthcare',
      description: 'Specialized diagnostic center with advanced imaging and laboratory services for comprehensive medical testing.',
      location: 'Mwanza, Tanzania',
      landSize: '1.5 acres',
      zoning: 'Institutional',
      access: 'Main Road',
      duration: '18 months',
      expectedROI: 14,
      developmentStage: 'construction',
      status: 'active',
      totalProjectValue: 600000000,
      minimumInvestment: 8000000,
      currentInvestors: 20,
      targetInvestors: 30,
      fundingProgress: 67,
      investmentDeadline: 'Jan 2025',
      features: ['MRI & CT Scan', 'Laboratory Services', 'Ultrasound', 'X-Ray', 'Consultation Rooms'],
      image: '/api/placeholder/400/300',
      coordinates: { lat: -2.5164, lng: 32.9176 }
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
          placeholder="Search healthcare projects..."
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
          <option value="hospital">Hospitals</option>
          <option value="clinic">Clinics</option>
          <option value="diagnostic">Diagnostic Centers</option>
        </select>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        Healthcare Infrastructure Projects
      </h2>
      
      {displayProjects.length === 0 ? (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '20px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '2px dashed #d1d5db'
        }}>
          <HeartPulse size={48} color="#9ca3af" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '16px 0 8px 0' }}>
            No healthcare projects available
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Check back later for new healthcare infrastructure opportunities
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

