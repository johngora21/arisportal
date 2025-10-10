'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  Calendar,
  Users,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download
} from 'lucide-react';

interface RevenueProps {
  // Add any props you need for the revenue component
}

export default function Revenue({}: RevenueProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const formatPrice = (value: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', 
    currency: 'TZS', 
    minimumFractionDigits: 0
  }).format(value);

  // Sample revenue data
  const revenueData = [
    { month: 'Jan', revenue: 2850000, expenses: 1200000, profit: 1650000 },
    { month: 'Feb', revenue: 3200000, expenses: 1350000, profit: 1850000 },
    { month: 'Mar', revenue: 2750000, expenses: 1100000, profit: 1650000 },
    { month: 'Apr', revenue: 3100000, expenses: 1250000, profit: 1850000 },
    { month: 'May', revenue: 2950000, expenses: 1180000, profit: 1770000 },
    { month: 'Jun', revenue: 3300000, expenses: 1400000, profit: 1900000 }
  ];

  const revenueSources = [
    { source: 'Client Services', amount: 8500000, percentage: 52.8, color: '#10b981' },
    { source: 'Product Sales', amount: 4200000, percentage: 26.1, color: '#3b82f6' },
    { source: 'Consulting', amount: 2100000, percentage: 13.0, color: '#f59e0b' },
    { source: 'Training', amount: 800000, percentage: 5.0, color: '#8b5cf6' },
    { source: 'Other', amount: 600000, percentage: 3.7, color: '#ef4444' }
  ];

  const topClients = [
    { name: 'TechCorp Ltd', revenue: 1200000, growth: '+15.2%', status: 'active' },
    { name: 'StartupXYZ', revenue: 950000, growth: '+8.7%', status: 'active' },
    { name: 'HealthPlus Inc', revenue: 780000, growth: '+22.1%', status: 'active' },
    { name: 'FinanceGroup', revenue: 650000, growth: '-2.3%', status: 'at_risk' },
    { name: 'RetailCo', revenue: 520000, growth: '+5.4%', status: 'active' }
  ];

  const revenueMetrics = [
    { label: 'Total Revenue', value: 16200000, change: '+12.5%', changeType: 'positive' },
    { label: 'Average Deal Size', value: 450000, change: '+8.2%', changeType: 'positive' },
    { label: 'Revenue per Client', value: 675000, change: '+15.3%', changeType: 'positive' },
    { label: 'Monthly Recurring', value: 3800000, change: '+6.7%', changeType: 'positive' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'at_risk': return '#f59e0b';
      case 'inactive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getChangeColor = (changeType: string) => {
    return changeType === 'positive' ? '#10b981' : '#ef4444';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Revenue Trend Chart */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Revenue Trend
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                backgroundColor: 'white',
                outline: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="current_month">Current Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="last_6_months">Last 6 Months</option>
              <option value="last_year">Last Year</option>
            </select>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                backgroundColor: 'white',
                outline: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="revenue">Revenue</option>
              <option value="profit">Profit</option>
              <option value="expenses">Expenses</option>
            </select>
          </div>
        </div>

        {/* Chart */}
        <div style={{ height: '300px', display: 'flex', alignItems: 'end', gap: '12px', padding: '20px 0' }}>
          {revenueData.map((data, index) => {
            const maxValue = Math.max(...revenueData.map(d => d.revenue));
            const value = data[selectedMetric as keyof typeof data] as number;
            const height = (value / maxValue) * 100;
            
            return (
              <div key={data.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  height: `${height}%`,
                  backgroundColor: '#10b981',
                  width: '100%',
                  borderRadius: '6px 6px 0 0',
                  minHeight: '8px',
                  marginBottom: '8px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#10b981'
                  }}>
                    {formatPrice(value)}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                  {data.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Sources */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
          Revenue Sources
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {revenueSources.map((source, index) => (
            <div key={source.source}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: source.color,
                    borderRadius: '2px'
                  }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {source.source}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {formatPrice(source.amount)}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    ({source.percentage}%)
                  </span>
                </div>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#f3f4f6',
                borderRadius: '20px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${source.percentage}%`,
                  height: '100%',
                  backgroundColor: source.color,
                  borderRadius: '20px'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Clients */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Top Clients by Revenue
          </h3>
          <button style={{
            padding: '8px 12px',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Download size={16} />
            Export
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {topClients.map((client, index) => (
            <div key={client.name} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '20px',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                  backgroundColor: '#e0f2fe',
                  color: 'var(--mc-sidebar-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {client.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '2px' }}>
                    {client.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Client #{index + 1}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '2px' }}>
                    {formatPrice(client.revenue)}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: client.growth.startsWith('+') ? '#10b981' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {client.growth.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {client.growth}
                  </div>
                </div>
                
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: getStatusColor(client.status) + '20',
                  color: getStatusColor(client.status)
                }}>
                  {client.status.replace('_', ' ')}
                </div>
                
                <button style={{
                  padding: '6px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}>
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Goals */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
          Revenue Goals & Targets
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Monthly Target
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                85% Complete
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
              {formatPrice(2850000)} / {formatPrice(3500000)}
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '85%',
                height: '100%',
                backgroundColor: '#10b981',
                borderRadius: '20px'
              }}></div>
            </div>
          </div>
          
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Quarterly Target
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                92% Complete
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
              {formatPrice(9750000)} / {formatPrice(10500000)}
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '92%',
                height: '100%',
                backgroundColor: '#10b981',
                borderRadius: '20px'
              }}></div>
            </div>
          </div>
          
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Annual Target
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                78% Complete
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
              {formatPrice(39000000)} / {formatPrice(50000000)}
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '78%',
                height: '100%',
                backgroundColor: '#f59e0b',
                borderRadius: '20px'
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
