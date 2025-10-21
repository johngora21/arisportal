'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, DollarSign, Users, TrendingUp, Calendar, X, Wheat, Leaf } from 'lucide-react';
import { AgricultureProject } from '../models';

// Declare Leaflet types
declare const L: any;

interface CropProjectsTabProps {
  projects?: AgricultureProject[];
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  typeFilter?: string;
  setTypeFilter?: (filter: string) => void;
  onProjectClick?: (project: AgricultureProject) => void;
}

export default function CropProjectsTab({ 
  projects = [], 
  searchTerm = '', 
  setSearchTerm, 
  typeFilter = 'all',
  setTypeFilter,
  onProjectClick 
}: CropProjectsTabProps) {
  const [showMapView, setShowMapView] = useState(false);
  const [selectedProjectForMap, setSelectedProjectForMap] = useState<AgricultureProject | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleViewOnMap = (project: AgricultureProject, e: React.MouseEvent) => {
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
            Crop: ${selectedProjectForMap.cropType || 'N/A'}
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

  const getCropIcon = (cropType: string) => {
    switch (cropType?.toLowerCase()) {
      case 'coffee': return '☕';
      case 'rice': return '🌾';
      case 'maize': return '🌽';
      case 'sunflower': return '🌻';
      case 'cotton': return '🌿';
      case 'sugarcane': return '🎋';
      default: return '🌱';
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
          placeholder="Search crop projects..."
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
          <option value="all">All Crops</option>
          <option value="coffee">Coffee</option>
          <option value="rice">Rice</option>
          <option value="maize">Maize</option>
          <option value="sunflower">Sunflower</option>
          <option value="cotton">Cotton</option>
          <option value="sugarcane">Sugarcane</option>
        </select>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        Crop Farming Projects
      </h2>
      
      {projects.length === 0 ? (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '20px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '2px dashed #d1d5db'
        }}>
          <Wheat size={48} color="#9ca3af" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '16px 0 8px 0' }}>
            No crop farming projects available
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Check back later for new crop investment opportunities
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '24px'
        }}>
          {projects.map((project) => (
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
                  backgroundColor: project.status === 'active' ? '#10b981' : '#6b7280',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  fontWeight: '500'
                }}>
                  {getStatusText(project.status)}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  fontSize: '14px',
                  color: '#1f2937',
                  fontWeight: '500'
                }}>
                  {getCropIcon(project.cropType || '')} {project.cropType}
                </div>
              </div>
              
              <div style={{ padding: '20px', flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                  {project.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <MapPin size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '6px' }}>
                    {project.location}
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px', lineHeight: '1.5' }}>
                  {project.description}
                </p>

                {/* Project Details */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '8px', 
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Leaf size={12} />
                    <span>Size: {project.farmSize}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={12} />
                    <span>Yield: {project.expectedYield}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    <span>{project.projectDuration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} />
                    <span>{project.currentInvestors}/{project.targetInvestors}</span>
                  </div>
                </div>

                {/* Investment Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingUp size={14} />
                      <span>{project.expectedROI}% ROI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                      Min Investment:
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      TZS {formatPrice(project.minimumInvestment).replace('TZS', '').trim()}
                    </div>
                  </div>
                </div>
                <button
                  style={{
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                  }}
                  onClick={(e) => handleViewOnMap(project, e)}
                >
                  <MapPin size={14} />
                  View on Map
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded Map View */}
      {showMapView && selectedProjectForMap && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '10px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            width: '98vw',
            height: '98vh',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white'
            }}>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 4px 0'
                }}>
                  {selectedProjectForMap.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <MapPin size={14} style={{ marginRight: '6px' }} />
                  {selectedProjectForMap.location}
                </p>
              </div>
              
              <button
                onClick={() => setShowMapView(false)}
                style={{
                  padding: '8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Map Container */}
            <div style={{
              flex: 1,
              height: 'calc(98vh - 100px)',
              backgroundColor: '#e5e7eb',
              position: 'relative'
            }}>
              <div
                ref={mapRef}
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
