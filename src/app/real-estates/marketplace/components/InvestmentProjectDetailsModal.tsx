'use client';

import React from 'react';
import { X, MapPin, DollarSign, Users, TrendingUp, Calendar, Clock, Target, Building, FileText } from 'lucide-react';

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

interface InvestmentProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: InvestmentProject | null;
}

export default function InvestmentProjectDetailsModal({ isOpen, onClose, project }: InvestmentProjectDetailsModalProps) {
  if (!isOpen || !project) return null;

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
        borderRadius: '12px',
        width: '90vw',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={16} />
        </button>

        <div style={{ padding: '32px' }}>
          {/* Project Image */}
          <div style={{ marginBottom: '32px', position: 'relative' }}>
            <div style={{
              width: '100%',
              height: '300px',
              backgroundColor: '#f3f4f6',
              backgroundImage: `url(${project.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              overflow: 'hidden'
            }} />
            {/* Status Badge */}
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: getStatusColor(project.status),
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {getStatusText(project.status)}
            </div>
          </div>

          {/* Price */}
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#059669',
            marginBottom: '32px'
          }}>
            {formatPrice(project.totalValue)}
          </div>

          {/* Project Overview */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
              Project Overview
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Project Type:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {project.id === '1' ? 'Commercial Complex' : project.id === '2' ? 'Residential Development' : 'Mixed-Use Project'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Duration:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{project.projectDuration}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Expected ROI:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{project.expectedROI}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Development Stage:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {project.id === '1' ? 'Planning' : project.id === '2' ? 'Construction' : 'Pre-Construction'}
                </span>
              </div>
            </div>
          </div>

          {/* Investment Details */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
              Investment Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Project Value:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{formatPrice(project.totalValue)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Minimum Investment:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{formatPrice(project.minimumInvestment)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Current Investors:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{project.currentInvestors}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Target Investors:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{project.targetInvestors}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Funding Progress:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{project.fundingProgress}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Investment Deadline:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {project.id === '1' ? 'Dec 2024' : project.id === '2' ? 'Mar 2025' : 'Jun 2025'}
                </span>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
              Location Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Location:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{project.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Land Size:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {project.id === '1' ? '2.5 acres' : project.id === '2' ? '1.8 acres' : '3.2 acres'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Zoning:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {project.id === '1' ? 'Commercial' : project.id === '2' ? 'Residential' : 'Mixed-Use'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Access:</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {project.id === '1' ? 'Main Road' : project.id === '2' ? 'Tarmac Road' : 'Highway Access'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
              Project Description
            </h3>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
              {project.description}
            </p>
          </div>

          {/* Project Features */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
              Project Features
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {project.id === '1' ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    Modern Office Spaces
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    Retail Shops
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    Underground Parking
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    Green Building Design
                  </div>
                </>
              ) : project.id === '2' ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    Luxury Apartments
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    Swimming Pool
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    Gym & Spa
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    24/7 Security
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    Mixed-Use Development
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    Shopping Mall
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    Residential Towers
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                    Entertainment Complex
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Investment Button */}
          <div style={{ textAlign: 'right' }}>
            <button style={{
              padding: '12px 32px',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Invest Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

