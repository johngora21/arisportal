'use client';

import React, { useState } from 'react';
import { MapPin, DollarSign, TrendingUp, Calendar, Building2 } from 'lucide-react';
import { MyInfrastructureInvestment, InfrastructureProject } from '../models';

interface MyInfrastructureInvestmentsTabProps {
  investments: MyInfrastructureInvestment[];
  onProjectClick?: (project: InfrastructureProject) => void;
}

export default function MyInfrastructureInvestmentsTab({ investments, onProjectClick }: MyInfrastructureInvestmentsTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Convert investment to project format for modal
  const convertToProject = (investment: MyInfrastructureInvestment): InfrastructureProject => {
    return {
      id: investment.projectId,
      title: investment.title,
      category: investment.category,
      description: `${investment.category.charAt(0).toUpperCase() + investment.category.slice(1)} investment project`,
      location: investment.location,
      landSize: 'N/A',
      zoning: 'N/A',
      access: 'N/A',
      duration: 'N/A',
      expectedROI: (investment.expectedReturn / investment.investedAmount) * 100,
      developmentStage: 'completed',
      status: investment.status,
      totalProjectValue: investment.investedAmount,
      minimumInvestment: investment.investedAmount,
      currentInvestors: 1,
      targetInvestors: 1,
      fundingProgress: 100,
      investmentDeadline: 'N/A',
      features: ['Investment Project'],
      image: '/api/placeholder/400/300',
      coordinates: { lat: -6.7924, lng: 39.2083 }
    };
  };

  const handleInvestmentClick = (investment: MyInfrastructureInvestment) => {
    if (onProjectClick) {
      const project = convertToProject(investment);
      onProjectClick(project);
    }
  };

  return (
    <div>
      {investments.length === 0 ? (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '20px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '2px dashed #d1d5db'
        }}>
          <Building2 size={48} color="#9ca3af" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '16px 0 8px 0' }}>
            No infrastructure investments yet
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Start investing in infrastructure projects to see your portfolio here
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '24px'
        }}>
          {investments.map((investment) => (
            <div
              key={investment.id}
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
              onClick={() => handleInvestmentClick(investment)}
            >
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f3f4f6',
                backgroundImage: `url(${investment.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: getStatusColor(investment.status),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {getStatusText(investment.status)}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {investment.category.toUpperCase()}
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
                  {investment.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <MapPin size={14} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {investment.location}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={16} color="#3b82f6" />
                    <span style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '600' }}>
                      {formatPrice(investment.investedAmount)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={16} color="#10b981" />
                    <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '600' }}>
                      {investment.roi.toFixed(1)}% ROI
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {investment.investedDate}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={16} color="#f59e0b" />
                    <span style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '600' }}>
                      {formatPrice(investment.actualReturn)}
                    </span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>
                    Recent Payouts
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {investment.payoutSchedule.slice(0, 2).map((payout, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {payout.date}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '12px', color: '#1f2937', fontWeight: '500' }}>
                            {formatPrice(payout.amount)}
                          </span>
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: payout.status === 'paid' ? '#10b981' : '#f59e0b'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
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
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

