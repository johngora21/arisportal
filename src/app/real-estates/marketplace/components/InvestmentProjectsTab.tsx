'use client';

import React from 'react';
import { MapPin, DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';

interface InvestmentProject {
  id: string;
  title: string;
  location: string;
  totalValue: number;
  minimumInvestment: number;
  currentInvestors: number;
  targetInvestors: number;
  fundingProgress: number;
  expectedROI: number;
  projectDuration: string;
  image: string;
  description: string;
  status: 'active' | 'funded' | 'completed';
}

interface InvestmentProjectsTabProps {
  projects?: InvestmentProject[];
  onProjectClick?: (project: InvestmentProject) => void;
}

export default function InvestmentProjectsTab({ projects = [], onProjectClick }: InvestmentProjectsTabProps) {
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
      default: return 'Unknown';
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        Investment Projects
      </h2>
      
      {projects.length === 0 ? (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center',
          border: '2px dashed #d1d5db'
        }}>
          <TrendingUp size={48} color="#9ca3af" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '16px 0 8px 0' }}>
            No investment projects available
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Check back later for new investment opportunities
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
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {getStatusText(project.status)}
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

                {/* Investment Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} />
                      <span>{project.currentInvestors}/{project.targetInvestors}</span>
                    </div>
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
                backgroundColor: '#f9fafb'
              }}>
                {/* Funding Progress */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Funding Progress</span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{project.fundingProgress}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${project.fundingProgress}%`,
                      height: '100%',
                      backgroundColor: '#10b981',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Investment Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280', marginRight: '6px' }}>Min:</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                      {formatPrice(project.minimumInvestment)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280', marginRight: '6px' }}>Total:</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                      {formatPrice(project.totalValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
