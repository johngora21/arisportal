'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CashFlowProps {
  // Add any props you need for the cash flow component
}

function CashFlow({}: CashFlowProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');

  const formatPrice = (value: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', 
    currency: 'TZS', 
    minimumFractionDigits: 0
  }).format(value);

  // Sample cash flow data
  const cashFlowData = [
    { month: 'Jan', operating: 1200000, investing: -300000, financing: 200000, net: 1100000 },
    { month: 'Feb', operating: 1350000, investing: -150000, financing: 0, net: 1200000 },
    { month: 'Mar', operating: 1100000, investing: -450000, financing: 500000, net: 1150000 },
    { month: 'Apr', operating: 1250000, investing: -200000, financing: -100000, net: 950000 },
    { month: 'May', operating: 1180000, investing: -350000, financing: 100000, net: 930000 },
    { month: 'Jun', operating: 1400000, investing: -250000, financing: 300000, net: 1450000 }
  ];

  const cashFlowCategories = [
    { category: 'Operating Activities', amount: 7480000, percentage: 85.2, color: '#10b981' },
    { category: 'Investing Activities', amount: -1700000, percentage: -19.4, color: '#ef4444' },
    { category: 'Financing Activities', amount: 1000000, percentage: 11.4, color: '#3b82f6' }
  ];

  const cashFlowForecast = [
    { period: 'Next Month', amount: 1300000, confidence: 'high' },
    { period: 'Next Quarter', amount: 3800000, confidence: 'medium' },
    { period: 'Next Year', amount: 15000000, confidence: 'low' }
  ];

  const recentCashMovements = [
    { id: 1, description: 'Client Payment Received', amount: 750000, type: 'inflow', date: '2024-01-15', category: 'Operating' },
    { id: 2, description: 'Equipment Purchase', amount: 300000, type: 'outflow', date: '2024-01-14', category: 'Investing' },
    { id: 3, description: 'Office Rent Paid', amount: 250000, type: 'outflow', date: '2024-01-13', category: 'Operating' },
    { id: 4, description: 'Bank Loan Received', amount: 500000, type: 'inflow', date: '2024-01-12', category: 'Financing' },
    { id: 5, description: 'Software License', amount: 120000, type: 'outflow', date: '2024-01-11', category: 'Operating' }
  ];

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Cash Flow Chart */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Cash Flow Trend
          </h3>
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
        </div>

        {/* Chart */}
        <div style={{ height: '300px', display: 'flex', alignItems: 'end', gap: '12px', padding: '20px 0' }}>
          {cashFlowData.map((data, index) => {
            const maxValue = Math.max(...cashFlowData.map(d => Math.abs(d.net)));
            const height = Math.abs(data.net) / maxValue * 100;
            const isPositive = data.net >= 0;
            
            return (
              <div key={data.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  height: `${height}%`,
                  backgroundColor: isPositive ? '#10b981' : '#ef4444',
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
                    color: isPositive ? '#10b981' : '#ef4444'
                  }}>
                    {formatPrice(data.net)}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                  {data.month}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Positive Cash Flow</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2px' }}></div>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Negative Cash Flow</span>
          </div>
        </div>
      </div>

      {/* Cash Flow Categories */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
          Cash Flow by Category
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cashFlowCategories.map((category, index) => (
            <div key={category.category}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: category.color,
                    borderRadius: '2px'
                  }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {category.category}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {formatPrice(category.amount)}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    ({category.percentage}%)
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
                  width: `${Math.abs(category.percentage)}%`,
                  height: '100%',
                  backgroundColor: category.color,
                  borderRadius: '20px'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Flow Forecast */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
          Cash Flow Forecast
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {cashFlowForecast.map(forecast => (
            <div key={forecast.period} style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '20px',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {forecast.period}
                </div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getConfidenceColor(forecast.confidence)
                }}></div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
                {formatPrice(forecast.amount)}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                {forecast.confidence} confidence
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Cash Movements */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
          Recent Cash Movements
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentCashMovements.map(movement => (
            <div key={movement.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderRadius: '20px',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  backgroundColor: movement.type === 'inflow' ? '#d1fae5' : '#fee2e2',
                  color: movement.type === 'inflow' ? '#10b981' : '#ef4444',
                  borderRadius: '20px',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {movement.type === 'inflow' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {movement.description}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {movement.category} • {formatDate(movement.date)}
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: movement.type === 'inflow' ? '#10b981' : '#ef4444'
              }}>
                {movement.type === 'inflow' ? '+' : '-'}{formatPrice(movement.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CashFlow;
