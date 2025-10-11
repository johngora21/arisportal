'use client';

import React from 'react';
import { Eye, TrendingUp, Calendar, DollarSign, MapPin } from 'lucide-react';
import { AgricultureProject } from '../models';

interface MyAgricultureInvestmentsTabProps {
  projects?: AgricultureProject[];
  onInvestmentClick?: (investment: any) => void;
}

export default function MyAgricultureInvestmentsTab({ projects = [], onInvestmentClick }: MyAgricultureInvestmentsTabProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mock investment data for demonstration
  const myInvestments = [
    {
      id: 'inv-1',
      projectId: '1',
      project: projects.find(p => p.id === '1'),
      amount: 25000000,
      investmentDate: '2024-01-15',
      status: 'active' as const,
      expectedReturn: 5500000,
      actualReturn: 1200000,
      payoutSchedule: [
        { date: '2024-06-15', amount: 1200000, status: 'paid' as const },
        { date: '2024-12-15', amount: 1200000, status: 'pending' as const },
        { date: '2025-06-15', amount: 1200000, status: 'pending' as const },
        { date: '2025-12-15', amount: 1900000, status: 'pending' as const }
      ]
    },
    {
      id: 'inv-2',
      projectId: '3',
      project: projects.find(p => p.id === '3'),
      amount: 18000000,
      investmentDate: '2024-02-10',
      status: 'active' as const,
      expectedReturn: 2880000,
      actualReturn: 0,
      payoutSchedule: [
        { date: '2024-08-10', amount: 720000, status: 'pending' as const },
        { date: '2025-02-10', amount: 720000, status: 'pending' as const },
        { date: '2025-08-10', amount: 720000, status: 'pending' as const },
        { date: '2026-02-10', amount: 720000, status: 'pending' as const }
      ]
    },
    {
      id: 'inv-3',
      projectId: '4',
      project: projects.find(p => p.id === '4'),
      amount: 15000000,
      investmentDate: '2024-01-30',
      status: 'active' as const,
      expectedReturn: 3000000,
      actualReturn: 750000,
      payoutSchedule: [
        { date: '2024-07-30', amount: 750000, status: 'paid' as const },
        { date: '2025-01-30', amount: 750000, status: 'pending' as const },
        { date: '2025-07-30', amount: 750000, status: 'pending' as const },
        { date: '2026-01-30', amount: 750000, status: 'pending' as const }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'completed': return '#3b82f6';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const totalInvested = myInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpectedReturn = myInvestments.reduce((sum, inv) => sum + inv.expectedReturn, 0);
  const totalActualReturn = myInvestments.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
  const averageROI = myInvestments.length > 0 ? 
    (totalActualReturn / totalInvested * 100) : 0;

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        My Agriculture Investments
      </h2>

      {/* Investment Details */}
      {myInvestments.length === 0 ? (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '20px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '2px dashed #d1d5db'
        }}>
          <Eye size={48} color="#9ca3af" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '16px 0 8px 0' }}>
            No investments yet
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Start investing in agriculture projects to see your portfolio here
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {myInvestments.map((investment) => (
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
              onClick={() => onInvestmentClick?.(investment)}
            >
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f3f4f6',
                backgroundImage: `url(${investment.project?.image || '/api/placeholder/400/300'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: investment.status === 'active' ? '#10b981' : '#6b7280',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  fontWeight: '500'
                }}>
                  {getStatusText(investment.status)}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  fontSize: '14px',
                  color: '#1f2937',
                  fontWeight: '500'
                }}>
                  💰 Investment
                </div>
              </div>
              
              <div style={{ padding: '20px', flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                  {investment.project?.title || 'Unknown Project'}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {investment.project?.location || 'Unknown Location'}
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px', lineHeight: '1.5' }}>
                  Invested on {formatDate(investment.investmentDate)}
                </p>

                {/* Investment Details */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '8px', 
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Amount: {formatPrice(investment.amount).replace('TZS', '').trim()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Expected: {formatPrice(investment.expectedReturn).replace('TZS', '').trim()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Actual: {formatPrice(investment.actualReturn || 0).replace('TZS', '').trim()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>ROI: {((investment.actualReturn || 0) / investment.amount * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Investment Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{investment.payoutSchedule.filter(p => p.status === 'paid').length}/{investment.payoutSchedule.length} Paid</span>
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
                      Next Payout:
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {investment.payoutSchedule.find(p => p.status === 'pending')?.date ? 
                        formatDate(investment.payoutSchedule.find(p => p.status === 'pending')!.date) : 'N/A'}
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
