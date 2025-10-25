'use client';

import React, { useState, useEffect } from 'react';
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
import { buildApiUrl } from '../../../../config/api';

interface CashFlowProps {
  // Add any props you need for the cash flow component
}

interface CashFlowData {
  month: string;
  operating: number;
  investing: number;
  financing: number;
  net: number;
}

interface CashFlowCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

function CashFlow({}: CashFlowProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(6);
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([]);
  const [cashFlowCategories, setCashFlowCategories] = useState<CashFlowCategory[]>([]);
  const [totalNetCashFlow, setTotalNetCashFlow] = useState(0);
  const [loading, setLoading] = useState(true);

  const formatPrice = (value: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', 
    currency: 'TZS', 
    minimumFractionDigits: 0
  }).format(value);

  const fetchCashFlowData = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl(`/transactions/analytics/cash-flow?months=${selectedPeriod}`));
      
      if (!response.ok) {
        throw new Error('Failed to fetch cash flow data');
      }
      
      const data = await response.json();
      setCashFlowData(data.cash_flow_data);
      setCashFlowCategories(data.cash_flow_categories);
      setTotalNetCashFlow(data.total_net_cash_flow);
    } catch (err) {
      console.error('Error fetching cash flow data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashFlowData();
  }, [selectedPeriod]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header with Period Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
          Cash Flow Analytics
        </h2>
          <select
            value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            style={{
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
            cursor: 'pointer',
            minWidth: '160px'
          }}
        >
          <option value={1}>Last Month</option>
          <option value={3}>Last 3 Months</option>
          <option value={6}>Last 6 Months</option>
          <option value={12}>Last Year</option>
          </select>
        </div>

      {/* Cash Flow Trend Chart */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
          Monthly Cash Flow Trend
        </h3>
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
      </div>

      {/* Cash Flow Categories Pie Chart */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
          Cash Flow Distribution
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {/* Pie Chart */}
          <div style={{ position: 'relative', width: '200px', height: '200px' }}>
            <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
              {(() => {
                let cumulativePercentage = 0;
                return cashFlowCategories.map((category, index) => {
                  const percentage = Math.abs(category.percentage);
                  const circumference = 2 * Math.PI * 90;
                  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
                  cumulativePercentage += percentage;
                  
                  return (
                    <circle
                      key={index}
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke={category.color}
                      strokeWidth="20"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                  );
                });
              })()}
            </svg>
                  <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {formatPrice(totalNetCashFlow)}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Net Cash Flow
              </div>
        </div>
      </div>

          {/* Legend */}
          <div style={{ flex: 1 }}>
            {cashFlowCategories.map((category, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <div style={{
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: category.color, 
                  borderRadius: '50%' 
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {category.category}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {formatPrice(category.amount)} ({category.percentage.toFixed(1)}%)
                  </div>
                </div>
              </div>
            ))}
            </div>
        </div>
      </div>

    </div>
  );
}

export default CashFlow;