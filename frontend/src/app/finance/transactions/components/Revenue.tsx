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

interface RevenueProps {
  // Add any props you need for the revenue component
}

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface RevenueSource {
  source: string;
  amount: number;
  percentage: number;
  color: string;
}

function Revenue({}: RevenueProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(6);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [revenueSources, setRevenueSources] = useState<RevenueSource[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [loading, setLoading] = useState(true);

  const formatPrice = (value: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', 
    currency: 'TZS', 
    minimumFractionDigits: 0
  }).format(value);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl(`/transactions/analytics/revenue?months=${selectedPeriod}`));
      
      if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
      }
      
      const data = await response.json();
      setRevenueData(data.revenue_data);
      setRevenueSources(data.revenue_sources);
      setTotalRevenue(data.total_revenue);
      setTotalExpenses(data.total_expenses);
      setTotalProfit(data.total_profit);
    } catch (err) {
      console.error('Error fetching revenue data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header with Period Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
          Revenue Analytics
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

      {/* Revenue vs Expenses Chart */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
          Revenue vs Expenses Trend
        </h3>
        <div style={{ height: '300px', display: 'flex', alignItems: 'end', gap: '12px', padding: '20px 0' }}>
          {revenueData.map((data, index) => {
            const maxValue = Math.max(...revenueData.map(d => Math.max(d.revenue, d.expenses)));
            const revenueHeight = (data.revenue / maxValue) * 100;
            const expensesHeight = (data.expenses / maxValue) * 100;
            
            return (
              <div key={data.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                {/* Revenue Bar */}
                <div style={{ 
                  height: `${revenueHeight}%`,
                  backgroundColor: '#10b981',
                  width: '45%',
                  borderRadius: '6px 6px 0 0',
                  minHeight: '8px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#10b981'
                  }}>
                    {formatPrice(data.revenue)}
                  </div>
                </div>
                {/* Expenses Bar */}
                <div style={{ 
                  height: `${expensesHeight}%`,
                  backgroundColor: '#ef4444',
                  width: '45%',
                  borderRadius: '0 0 6px 6px',
                  minHeight: '8px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#ef4444'
                  }}>
                    {formatPrice(data.expenses)}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', marginTop: '8px' }}>
                  {data.month}
                </div>
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Revenue</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Expenses</span>
          </div>
        </div>
      </div>

      {/* Revenue Sources Pie Chart */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
          Revenue Sources Distribution
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {/* Pie Chart */}
          <div style={{ position: 'relative', width: '200px', height: '200px' }}>
            <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
              {(() => {
                let cumulativePercentage = 0;
                return revenueSources.map((source, index) => {
                  const percentage = source.percentage;
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
                      stroke={source.color}
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
                {formatPrice(totalRevenue)}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Total Revenue
              </div>
        </div>
      </div>

          {/* Legend */}
          <div style={{ flex: 1 }}>
            {revenueSources.map((source, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <div style={{
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: source.color, 
                  borderRadius: '50%' 
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {source.source}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {formatPrice(source.amount)} ({source.percentage.toFixed(1)}%)
                  </div>
                </div>
              </div>
            ))}
            </div>
        </div>
      </div>

      {/* Profit Trend Chart */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
          Monthly Profit Trend
        </h3>
        <div style={{ height: '300px', display: 'flex', alignItems: 'end', gap: '12px', padding: '20px 0' }}>
          {revenueData.map((data, index) => {
            const maxProfit = Math.max(...revenueData.map(d => Math.abs(d.profit)));
            const height = Math.abs(data.profit) / maxProfit * 100;
            const isPositive = data.profit >= 0;
            
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
                    {formatPrice(data.profit)}
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

    </div>
  );
}

export default Revenue;