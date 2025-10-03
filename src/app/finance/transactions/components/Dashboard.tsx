'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DashboardProps {
  // Add any props you need for the dashboard
}

export default function Dashboard({}: DashboardProps) {
  const formatPrice = (value: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', 
    currency: 'TZS', 
    minimumFractionDigits: 0
  }).format(value);

  // Sample data for dashboard charts and metrics
  const monthlyData = [
    { month: 'Jan', revenue: 2850000, expenses: 1200000 },
    { month: 'Feb', revenue: 3200000, expenses: 1350000 },
    { month: 'Mar', revenue: 2750000, expenses: 1100000 },
    { month: 'Apr', revenue: 3100000, expenses: 1250000 },
    { month: 'May', revenue: 2950000, expenses: 1180000 },
    { month: 'Jun', revenue: 3300000, expenses: 1400000 }
  ];

  const topExpenseCategories = [
    { category: 'Office Rent', amount: 250000, percentage: 20.8 },
    { category: 'Software Licenses', amount: 180000, percentage: 15.0 },
    { category: 'Equipment', amount: 150000, percentage: 12.5 },
    { category: 'Marketing', amount: 120000, percentage: 10.0 },
    { category: 'Utilities', amount: 95000, percentage: 7.9 }
  ];

  // Data for pie charts
  const cashFlowData = [
    { name: 'Inflow', value: 2000000, color: '#10b981' },
    { name: 'Outflow', value: 850000, color: '#ef4444' }
  ];

  const taxData = [
    { name: 'Income Tax', value: 495000, color: '#ef4444' },
    { name: 'VAT', value: 513000, color: '#f59e0b' },
    { name: 'Payroll Tax', value: 85000, color: '#8b5cf6' }
  ];

  const revenueTrendData = [
    { month: 'Jan', revenue: 2850000 },
    { month: 'Feb', revenue: 3200000 },
    { month: 'Mar', revenue: 2750000 },
    { month: 'Apr', revenue: 3100000 },
    { month: 'May', revenue: 2950000 },
    { month: 'Jun', revenue: 3300000 }
  ];

  const financialHealthData = [
    { name: 'Excellent', value: 82, fill: '#10b981' },
    { name: 'Remaining', value: 18, fill: '#e5e7eb' }
  ];

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      
      {/* Top Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Monthly Trend Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
            Monthly Revenue vs Expenses
          </h3>
          <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '200px', paddingBottom: '20px' }}>
            {monthlyData.map((data, index) => {
              const maxValue = Math.max(...monthlyData.map(d => Math.max(d.revenue, d.expenses)));
              const revenueHeight = (data.revenue / maxValue) * 100;
              const expenseHeight = (data.expenses / maxValue) * 100;
              
              return (
                <div key={data.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '4px', 
                    height: '100%',
                    justifyContent: 'flex-end'
                  }}>
                    <div style={{
                      height: `${revenueHeight}%`,
                      backgroundColor: '#10b981',
                      width: '100%',
                      borderRadius: '4px 4px 0 0',
                      minHeight: '4px'
                    }}></div>
                    <div style={{
                      height: `${expenseHeight}%`,
                      backgroundColor: '#ef4444',
                      width: '100%',
                      borderRadius: '4px 4px 0 0',
                      minHeight: '4px'
                    }}></div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    {data.month}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Revenue</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2px' }}></div>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Expenses</span>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
            Top Expense Categories
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topExpenseCategories.map((category, index) => (
              <div key={category.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {category.category}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {formatPrice(category.amount)}
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '6px', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${category.percentage}%`,
                    height: '100%',
                    backgroundColor: '#ef4444',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Charts and Graphs - All 4 Charts in Pairs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Cash Flow Pie Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
            Cash Flow Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={cashFlowData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {cashFlowData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatPrice(value as number)} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
            {cashFlowData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '2px' }}></div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {item.name} ({Math.round((item.value / (cashFlowData[0].value + cashFlowData[1].value)) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Breakdown Pie Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
            Tax Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={taxData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {taxData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatPrice(value as number)} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            {taxData.map((item, index) => {
              const total = taxData.reduce((sum, t) => sum + t.value, 0);
              const percentage = Math.round((item.value / total) * 100);
              return (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '2px' }}></div>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {item.name} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => formatPrice(value as number)} />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Health Gauge */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
            Financial Health Score
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={financialHealthData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {financialHealthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="700" fill="#10b981">
                82
              </text>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Poor</span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Excellent</span>
          </div>
        </div>
      </div>

    </div>
  );
}