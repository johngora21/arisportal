'use client';

import React, { useState } from 'react';
import { X, MapPin, DollarSign, Users, TrendingUp, Calendar, Building2, Play, Image, FileText, Clock, CheckCircle } from 'lucide-react';
import { InfrastructureProject } from '../models';

interface InfrastructureProjectDetailsModalProps {
  project: InfrastructureProject | null;
  onClose: () => void;
}

export default function InfrastructureProjectDetailsModal({ project, onClose }: InfrastructureProjectDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderOverviewTab = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Project Overview
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Project Type
            </label>
            <span style={{ fontSize: '16px', color: '#1f2937' }}>
              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Duration
            </label>
            <span style={{ fontSize: '16px', color: '#1f2937' }}>
              {project.duration}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Expected ROI
            </label>
            <span style={{ fontSize: '16px', color: '#10b981', fontWeight: '600' }}>
              {project.expectedROI}%
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Development Stage
            </label>
            <span style={{ fontSize: '16px', color: '#1f2937' }}>
              {project.developmentStage}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Investment Details
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Total Project Value
            </label>
            <span style={{ fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>
              {formatPrice(project.totalProjectValue)}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Minimum Investment
            </label>
            <span style={{ fontSize: '16px', color: '#3b82f6', fontWeight: '600' }}>
              {formatPrice(project.minimumInvestment)}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Current Investors
            </label>
            <span style={{ fontSize: '16px', color: '#1f2937' }}>
              {project.currentInvestors}/{project.targetInvestors}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Funding Progress
            </label>
            <span style={{ fontSize: '16px', color: '#10b981', fontWeight: '600' }}>
              {project.fundingProgress}%
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Investment Deadline
            </label>
            <span style={{ fontSize: '16px', color: '#1f2937' }}>
              {project.investmentDeadline}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Location Details
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Location
            </label>
            <span style={{ fontSize: '16px', color: '#1f2937' }}>
              {project.location}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Land Size
            </label>
            <span style={{ fontSize: '16px', color: '#1f2937' }}>
              {project.landSize}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Zoning
            </label>
            <span style={{ fontSize: '16px', color: '#1f2937' }}>
              {project.zoning}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Access
            </label>
            <span style={{ fontSize: '16px', color: '#1f2937' }}>
              {project.access}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Project Description
        </h3>
        <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
          {project.description}
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Project Features
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          {project.features.map((feature, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}
            >
              <CheckCircle size={16} color="#10b981" />
              <span style={{ fontSize: '14px', color: '#1f2937' }}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetailsTab = () => (
    <div style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
        Detailed Information
      </h3>
      <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6', marginBottom: '24px' }}>
        Additional detailed information about this infrastructure project will be displayed here.
      </p>
    </div>
  );

  const renderFinancialTab = () => (
    <div style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
        Financial Projections
      </h3>
      <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6', marginBottom: '24px' }}>
        Detailed financial projections and investment analysis will be displayed here.
      </p>
    </div>
  );

  const renderProgressTab = () => {
    // Mock progress data - in real app this would come from API
    const progressUpdates = [
      {
        id: 1,
        date: '2024-01-15',
        title: 'Project Launch & Site Survey',
        description: 'Successfully launched the infrastructure investment project and completed comprehensive site survey.',
        status: 'completed',
        media: [
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Site survey completed' },
          { type: 'video', url: '/api/placeholder/400/300', caption: 'Project overview video' }
        ]
      },
      {
        id: 2,
        date: '2024-02-01',
        title: 'Permits & Design Approval',
        description: 'Obtained all necessary building permits and completed architectural design approval process.',
        status: 'completed',
        media: [
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Building permits approved' },
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Architectural designs finalized' }
        ]
      },
      {
        id: 3,
        date: '2024-02-15',
        title: 'Ground Breaking & Site Preparation',
        description: 'Official ground breaking ceremony held. Site preparation and excavation work commenced.',
        status: 'completed',
        media: [
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Ground breaking ceremony' },
          { type: 'video', url: '/api/placeholder/400/300', caption: 'Site preparation progress' }
        ]
      },
      {
        id: 4,
        date: '2024-03-01',
        title: 'Foundation & Structure Work',
        description: 'Foundation concrete pouring completed successfully. Structural steel installation in progress.',
        status: 'in-progress',
        media: [
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Foundation work completed' },
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Steel structure installation' }
        ]
      },
      {
        id: 5,
        date: '2024-03-15',
        title: 'Expected Completion Phase',
        description: 'Preparing for final construction phase. Interior work and finishing touches scheduled.',
        status: 'pending',
        media: []
      }
    ];

    return (
      <div style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
          Real-Time Progress Tracking
        </h3>
        
        {/* Overall Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
              Overall Project Progress
            </h4>
            <span style={{ fontSize: '14px', color: '#059669', fontWeight: '600' }}>
              65%
            </span>
          </div>
          <div style={{
            backgroundColor: '#f3f4f6',
            borderRadius: '20px',
            height: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: '#10b981',
              height: '100%',
              width: '65%',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Progress Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {progressUpdates.map((update, index) => (
            <div key={update.id} style={{
              position: 'relative',
              paddingLeft: '40px'
            }}>
              {/* Timeline line */}
              {index < progressUpdates.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '19px',
                  top: '40px',
                  bottom: '-24px',
                  width: '2px',
                  backgroundColor: update.status === 'completed' ? '#10b981' : '#e5e7eb'
                }} />
              )}
              
              {/* Timeline dot */}
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '8px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: update.status === 'completed' ? '#10b981' : update.status === 'in-progress' ? '#3b82f6' : '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}>
                {update.status === 'completed' && <CheckCircle size={10} color="white" />}
                {update.status === 'in-progress' && <Clock size={10} color="white" />}
              </div>

              {/* Content */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                      {update.title}
                    </h5>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>
                      {update.date}
                    </p>
                  </div>
                  <span style={{
                    backgroundColor: update.status === 'completed' ? '#dcfce7' : 
                                    update.status === 'in-progress' ? '#fef3c7' : '#f3f4f6',
                    color: update.status === 'completed' ? '#166534' : 
                           update.status === 'in-progress' ? '#92400e' : '#6b7280',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {update.status.replace('-', ' ')}
                  </span>
                </div>
                
                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5', marginBottom: '16px' }}>
                  {update.description}
                </p>

                {/* Media Gallery */}
                {update.media.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px'
                  }}>
                    {update.media.map((media, mediaIndex) => (
                      <div key={mediaIndex} style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          width: '100%',
                          height: '120px',
                          backgroundColor: '#f3f4f6',
                          backgroundImage: `url(${media.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {media.type === 'video' && (
                            <div style={{
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Play size={20} color="white" />
                            </div>
                          )}
                        </div>
                        <div style={{ padding: '12px' }}>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, textAlign: 'center' }}>
                            {media.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
        borderRadius: '20px',
        width: '90%',
        height: '90%',
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {project.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <MapPin size={16} color="#6b7280" />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {project.location}
              </span>
            </div>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {project.status}
            </div>
          </div>
          <button
            onClick={onClose}
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

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'details', label: 'Details' },
            { id: 'financial', label: 'Financial' },
            { id: 'progress', label: 'Progress' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '16px 20px',
                backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#1f2937' : '#6b7280',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderBottom: activeTab === tab.id ? '2px solid var(--mc-sidebar-bg)' : '2px solid transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'financial' && renderFinancialTab()}
          {activeTab === 'progress' && renderProgressTab()}
        </div>
      </div>
    </div>
  );
}

