'use client';

import React, { useState } from 'react';
import { Droplets, MapPin, Users, TrendingUp, Zap, Waves, Mountain, X } from 'lucide-react';
import { EnergyProject } from '../models';

interface HydroProjectsTabProps {
  projects?: EnergyProject[];
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  typeFilter?: string;
  setTypeFilter?: (filter: string) => void;
  onProjectClick?: (project: EnergyProject) => void;
}

export default function HydroProjectsTab({
  projects = [],
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  onProjectClick
}: HydroProjectsTabProps) {
  const [showMapView, setShowMapView] = useState(false);
  const [selectedProjectForMap, setSelectedProjectForMap] = useState<EnergyProject | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

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
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const getHydroIcon = (technology: string) => {
    if (technology?.toLowerCase().includes('run-of-river')) return <Waves size={16} />;
    if (technology?.toLowerCase().includes('reservoir')) return <Mountain size={16} />;
    return <Droplets size={16} />;
  };

  const handleViewOnMap = (project: EnergyProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProjectForMap(project);
    setShowMapView(true);
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
          placeholder="Search hydro projects..."
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
          <option value="all">All Hydro</option>
          <option value="run-of-river">Run-of-River</option>
          <option value="reservoir">Reservoir</option>
          <option value="pumped-storage">Pumped Storage</option>
          <option value="micro-hydro">Micro Hydro</option>
        </select>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        Hydro Energy Projects
      </h2>

      {projects.length === 0 ? (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '20px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '2px dashed #d1d5db'
        }}>
          <Droplets size={48} color="#9ca3af" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '16px 0 8px 0' }}>
            No hydro energy projects found
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
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
                  backgroundColor: getStatusColor(project.status),
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
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {getHydroIcon(project.technology || '')} Hydro
                </div>
              </div>

              <div style={{ padding: '20px', flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                  {project.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <MapPin size={14} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {project.location}
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px', lineHeight: '1.5' }}>
                  {project.description}
                </p>

                {/* Energy Details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={12} />
                    <span>{project.capacity}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={12} />
                    <span>{project.expectedGeneration}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} />
                      <span>{project.currentInvestors}/{project.maxInvestors} Investors</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingUp size={14} />
                      <span>{project.roi}% ROI</span>
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
            width: '100%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                {selectedProjectForMap.title} - Location
              </h3>
              <button
                onClick={() => setShowMapView(false)}
                style={{
                  padding: '8px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{
              flex: 1,
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '16px'
            }}>
              Map view for {selectedProjectForMap.location}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


