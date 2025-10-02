'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, DollarSign, Calendar, User, Building, Bed, Bath, ChefHat, X } from 'lucide-react';
import { Property } from '../types';

// Declare Leaflet types
declare global {
  namespace L {
    interface Map {
      eachLayer(callback: (layer: any) => void): void;
    }
    interface TileLayer {
      addTo(map: Map): TileLayer;
    }
  }
}

interface HouseTabProps {
  properties: Property[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  onPropertyClick: (property: Property) => void;
}

export default function HouseTab({ 
  properties, 
  searchTerm, 
  setSearchTerm, 
  typeFilter, 
  setTypeFilter,
  onPropertyClick
}: HouseTabProps) {
  const [showMapView, setShowMapView] = useState(false);
  const [selectedPropertyForMap, setSelectedPropertyForMap] = useState<Property | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleViewOnMap = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setSelectedPropertyForMap(property);
    setShowMapView(true);
  };

  // Initialize map when map view is shown
  useEffect(() => {
    if (showMapView && mapRef.current && !mapInstanceRef.current && selectedPropertyForMap?.coordinates) {
      // Initialize Leaflet map
      const map = L.map(mapRef.current).setView(
        [selectedPropertyForMap.coordinates.lat, selectedPropertyForMap.coordinates.lng], 
        18
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

      // Add marker for the selected property
      const marker = L.marker([selectedPropertyForMap.coordinates.lat, selectedPropertyForMap.coordinates.lng], {
        title: selectedPropertyForMap.title
      }).addTo(map);

      markerRef.current = marker;

      // Add popup with property info
      marker.bindPopup(`
        <div style="padding: 8px; font-family: 'Poppins', sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
            ${selectedPropertyForMap.title}
          </h3>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
            ${selectedPropertyForMap.location}
          </p>
          <p style="margin: 0; font-size: 14px; color: #059669; font-weight: 600;">
            ${selectedPropertyForMap.size}
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
  }, [showMapView, selectedPropertyForMap]);

  const switchMapType = (mapType: string) => {
    if (mapInstanceRef.current) {
      // Remove all existing layers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });

      // Add new layer based on map type
      switch (mapType) {
        case 'satellite':
          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri'
          }).addTo(mapInstanceRef.current);
          break;
        case 'roadmap':
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstanceRef.current);
          break;
        case 'hybrid':
          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri'
          }).addTo(mapInstanceRef.current);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            opacity: 0.3
          }).addTo(mapInstanceRef.current);
          break;
        case 'terrain':
          L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap contributors'
          }).addTo(mapInstanceRef.current);
          break;
      }
    }
  };

  return (
    <div>
      {/* Search and Filters */}
      <div style={{
        position: 'relative',
        height: '40px',
        marginBottom: '24px'
      }}>
        {/* Search Bar - positioned from right */}
        <div style={{ 
          position: 'absolute',
          right: '290px',
          top: '0px',
          width: '400px'
        }}>
          <Search style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            width: '16px',
            height: '20px'
          }} />
          <input
            type="text"
            placeholder="Search houses, apartments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px'
            }}
          />
        </div>
        
        {/* Purpose Filter - positioned from right */}
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '0px'
        }}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              width: '200px'
            }}
          >
            <option value="all">All Purposes</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed">Mixed Use</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {properties.map((property) => (
          <div
            key={property.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
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
            onClick={() => onPropertyClick(property)}
          >
            <div style={{
              width: '100%',
              height: '200px',
              backgroundColor: '#f3f4f6',
              backgroundImage: `url(${property.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
            
            <div style={{ padding: '20px', flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                {property.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <MapPin size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '6px' }}>
                  {property.location}
                </span>
              </div>

              <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px', lineHeight: '1.5' }}>
                {property.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                  <span>Size: {property.size}</span>
                  {property.bedrooms && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Bed size={14} />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Bath size={14} />
                      <span>{property.bathrooms}</span>
                    </div>
                  )}
                  {property.kitchen && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ChefHat size={14} />
                      <span>{property.kitchen}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
                  {formatPrice(property.price)}
                </span>
              </div>
              <button
                style={{
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
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
                onClick={(e) => handleViewOnMap(property, e)}
              >
                <MapPin size={14} />
                View on Map
              </button>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <Building size={48} color="#d1d5db" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '16px 0 8px 0' }}>
            No houses found
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {/* Embedded Map View */}
      {showMapView && selectedPropertyForMap && (
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
            borderRadius: '12px',
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
                  {selectedPropertyForMap.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <MapPin size={14} style={{ marginRight: '6px' }} />
                  {selectedPropertyForMap.location}
                </p>
              </div>
              
              {/* Map Controls */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => switchMapType('satellite')}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Satellite
                </button>
                <button
                  onClick={() => switchMapType('roadmap')}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Road
                </button>
                <button
                  onClick={() => switchMapType('hybrid')}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Hybrid
                </button>
                <button
                  onClick={() => setShowMapView(false)}
                  style={{
                    padding: '8px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
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