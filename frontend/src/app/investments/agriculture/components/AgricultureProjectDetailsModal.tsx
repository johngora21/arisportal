'use client';

import React, { useState } from 'react';
import { X, MapPin, DollarSign, Users, Calendar, TrendingUp, Leaf, Heart, Factory, Package } from 'lucide-react';
import { AgricultureProject } from '../models';

interface AgricultureProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AgricultureProject | null;
}

export default function AgricultureProjectDetailsModal({ isOpen, onClose, project }: AgricultureProjectDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !project) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crops': return <Leaf size={20} />;
      case 'livestock': return <Heart size={20} />;
      case 'processing': return <Factory size={20} />;
      default: return <Package size={20} />;
    }
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

  const renderOverviewTab = () => (
    <div style={{ padding: '24px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Project Information */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Project Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#6b7280" />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Location: </span>
              <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                {project.location}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#6b7280" />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Duration: </span>
              <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                {project.projectDuration}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="#6b7280" />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Expected ROI: </span>
              <span style={{ fontSize: '14px', color: '#059669', fontWeight: '600' }}>
                {project.expectedROI}%
              </span>
            </div>
          </div>
        </div>

        {/* Investment Details */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Investment Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={16} color="#6b7280" />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Value: </span>
              <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                {formatPrice(project.totalValue).replace('TZS', '').trim()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={16} color="#6b7280" />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Min Investment: </span>
              <span style={{ fontSize: '14px', color: '#059669', fontWeight: '600' }}>
                {formatPrice(project.minimumInvestment).replace('TZS', '').trim()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#6b7280" />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Investors: </span>
              <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                {project.currentInvestors}/{project.targetInvestors}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Project Description
        </h3>
        <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
          {project.description}
        </p>
      </div>
    </div>
  );

  const renderDetailsTab = () => (
    <div style={{ padding: '24px' }}>
      {project.category === 'crops' && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Crop Farming Details
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Crop Type: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.cropType || 'N/A'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Farm Size: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.farmSize || 'N/A'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Expected Yield: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.expectedYield || 'N/A'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Farming Method: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.farmingMethod || 'N/A'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Climate: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.climate || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {project.category === 'livestock' && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Livestock Details
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Livestock Type: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.livestockType || 'N/A'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Farm Size: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.farmSize || 'N/A'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Livestock Count: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.livestockCount?.toLocaleString() || 'N/A'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Farming Method: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.farmingMethod || 'N/A'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Climate: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.climate || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {project.category === 'processing' && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Processing Details
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Processing Type: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.processingType || 'N/A'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Capacity: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.capacity || 'N/A'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Technology: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.technology || 'N/A'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Market: </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                  {project.market || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {project.products && project.products.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                Products
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.products.map((product, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderProgressTab = () => (
    <div style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        Project Progress
      </h3>
      
      {/* Timeline */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {[
            {
              date: '2024-01-15',
              title: 'Project Launch',
              description: 'Successfully launched the agriculture investment project with initial funding secured.',
              status: 'completed',
              media: ['project-overview.jpg', 'funding-announcement.jpg']
            },
            {
              date: '2024-02-01',
              title: 'Land Preparation',
              description: 'Completed land clearing and soil preparation for optimal crop cultivation.',
              status: 'completed',
              media: ['land-clearing.jpg', 'soil-testing.jpg']
            },
            {
              date: '2024-02-15',
              title: 'Seed Planting',
              description: 'Successfully planted high-quality seeds across all designated areas.',
              status: 'completed',
              media: ['planting-day.jpg', 'seed-distribution.jpg']
            },
            {
              date: '2024-03-01',
              title: 'Growth Monitoring',
              description: 'Implementing advanced monitoring systems to track crop development and health.',
              status: 'in-progress',
              media: ['growth-monitoring.jpg', 'irrigation-system.jpg']
            },
            {
              date: '2024-04-15',
              title: 'First Harvest',
              description: 'Expected first harvest with quality assessment and yield optimization.',
              status: 'pending',
              media: []
            }
          ].map((update, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                position: 'relative',
                marginLeft: '24px'
              }}
            >
              <div style={{
                position: 'absolute',
                left: '-32px',
                top: '20px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: update.status === 'completed' ? '#10b981' : 
                                update.status === 'in-progress' ? '#f59e0b' : '#d1d5db',
                border: '3px solid white',
                boxShadow: '0 0 0 3px #e5e7eb'
              }} />
              
              <div style={{
                position: 'absolute',
                left: '-26px',
                top: '32px',
                width: '2px',
                height: '100%',
                backgroundColor: index === 4 ? 'transparent' : '#e5e7eb'
              }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {update.title}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
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
              
              {update.media.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '8px'
                }}>
                  {update.media.map((media, mediaIndex) => (
                    <div
                      key={mediaIndex}
                      style={{
                        width: '120px',
                        height: '80px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#6b7280',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      📷 {media}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Live Updates */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Live Updates
        </h4>
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              Real-time monitoring active
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Last update: {new Date().toLocaleString()} - All systems operational
          </p>
        </div>
      </div>
    </div>
  );

  const renderFinancialTab = () => (
    <div style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        Financial Projections
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669', marginBottom: '8px' }}>
            {formatPrice(project.totalValue).replace('TZS', '').trim()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Total Project Value
          </div>
        </div>

        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
            {formatPrice(project.minimumInvestment).replace('TZS', '').trim()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Minimum Investment
          </div>
        </div>

        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>
            {project.expectedROI}%
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Expected ROI
          </div>
        </div>

        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
            {project.projectDuration}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Project Duration
          </div>
        </div>
      </div>

      {/* Investment Progress */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Funding Progress
        </h4>
        <div style={{
          backgroundColor: '#f3f4f6',
          borderRadius: '20px',
          height: '20px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            backgroundColor: '#10b981',
            height: '100%',
            width: `${project.fundingProgress}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {project.currentInvestors} of {project.targetInvestors} investors
          </span>
          <span style={{ fontSize: '14px', color: '#059669', fontWeight: '600' }}>
            {project.fundingProgress}%
          </span>
        </div>
      </div>
    </div>
  );

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
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              {getCategoryIcon(project.category)}
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>
                {project.title}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {project.location}
                </span>
              </div>
              <span style={{
                backgroundColor: getStatusColor(project.status),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {getStatusText(project.status)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            <X size={20} />
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

        {/* Footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
              Minimum Investment
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>
              {formatPrice(project.minimumInvestment).replace('TZS', '').trim()}
            </div>
          </div>
          <button
            style={{
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
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
        </div>
      </div>
    </div>
  );
}