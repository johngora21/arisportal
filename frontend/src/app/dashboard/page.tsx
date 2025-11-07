'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, PieChart, Bar, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart } from 'lucide-react';
import { getApiUrl, buildApiUrl } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';

interface FinanceStats {
  totalTransactions: number;
  totalRevenue: number;
  totalExpenses: number;
  totalAssets: number;
  totalLiabilities: number;
  netIncome: number;
}

interface SalesStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{ name: string; revenue: number; units?: number }>;
  topCategories: Array<{ name: string; sales: number }>;
  topCustomers: Array<{ name: string; revenue: number; orders: number }>;
  salesByLocation: Array<{ location: string; sales: number }>;
}

interface CashFlowData {
  month: string;
  operating?: number;
  investing?: number;
  financing?: number;
  net?: number;
  cumulativeFreq?: number;
}

interface RevenueAnalytics {
  revenue_data: Array<{ month: string; revenue: number; expenses: number; profit: number }>;
  revenue_sources: Array<{ source: string; amount: number; percentage: number }>;
}

const COLORS = ['#4F46E5', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#14B8A6'];

export default function DashboardPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [financeStats, setFinanceStats] = useState<FinanceStats | null>(null);
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([]);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, [token]);

  // Helper function to create fetch options with auth headers
  const getFetchOptions = (): RequestInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return { headers };
  };

  const loadAllStats = async () => {
    try {
      setLoading(true);
      
      const fetchOptions = getFetchOptions();
      
      // Load all stats in parallel
      const [financeStatsResult, cashFlowResult, revenueResult, dealsResult] = await Promise.allSettled([
        // Finance stats
        fetch(buildApiUrl('/transactions/stats/summary'), fetchOptions).then(res => {
          if (!res.ok) throw new Error('Failed to fetch finance stats');
          return res.json();
        }),
        // Cash flow analytics
        fetch(buildApiUrl('/transactions/analytics/cash-flow?months=12'), fetchOptions).then(res => {
          if (!res.ok) throw new Error('Failed to fetch cash flow');
          return res.json();
        }),
        // Revenue analytics
        fetch(buildApiUrl('/transactions/analytics/revenue?months=12'), fetchOptions).then(res => {
          if (!res.ok) throw new Error('Failed to fetch revenue analytics');
          return res.json();
        }),
        // Deals (sales data)
        fetch(getApiUrl('CRM.DEALS'), fetchOptions).then(res => {
          if (!res.ok) throw new Error('Failed to fetch deals');
          return res.json();
        }),
      ]);

      // Process finance stats
      if (financeStatsResult.status === 'fulfilled') {
        const data = financeStatsResult.value;
        setFinanceStats({
          totalTransactions: data.total_transactions || 0,
          totalRevenue: data.total_revenue || 0,
          totalExpenses: data.total_expenses || 0,
          totalAssets: data.total_assets || 0,
          totalLiabilities: data.total_liabilities || 0,
          netIncome: data.net_income || 0,
        });
      }

      // Process cash flow data
      if (cashFlowResult.status === 'fulfilled') {
        const data = cashFlowResult.value;
        const cashFlow = data.cash_flow_data || [];
        // Calculate cumulative frequency for cash flow
        let cumulative = 0;
        const totalNet = Math.abs(data.total_net_cash_flow || 1);
        const processedCashFlow = cashFlow.map((item: any, index: number) => {
          cumulative += Math.abs(item.net || 0);
          return {
            ...item,
            cumulativeFreq: totalNet > 0 ? (cumulative / totalNet) * 100 : 0,
          };
        });
        setCashFlowData(processedCashFlow);
      }

      // Process revenue analytics
      if (revenueResult.status === 'fulfilled') {
        setRevenueAnalytics(revenueResult.value);
      }

      // Process deals (sales data)
      if (dealsResult.status === 'fulfilled') {
        const deals = dealsResult.value;
        calculateSalesStats(deals);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSalesStats = (deals: any[]) => {
    if (!deals || deals.length === 0) {
      setSalesStats({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        topProducts: [],
        topCategories: [],
        topCustomers: [],
        salesByLocation: [],
      });
      return;
    }

    // Calculate total revenue and orders
    const totalRevenue = deals.reduce((sum, deal) => {
      return sum + ((deal.quantity || 0) * (deal.unit_price || 0));
    }, 0);
    const totalOrders = deals.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Top products by revenue
    const productMap = new Map<string, { revenue: number; units: number }>();
    deals.forEach(deal => {
      const productName = deal.product_name || 'Unknown';
      const revenue = (deal.quantity || 0) * (deal.unit_price || 0);
      const existing = productMap.get(productName) || { revenue: 0, units: 0 };
      productMap.set(productName, {
        revenue: existing.revenue + revenue,
        units: existing.units + (deal.quantity || 0),
      });
    });
    const topProducts = Array.from(productMap.entries())
      .map(([name, data]) => ({ name, revenue: data.revenue, units: data.units }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Top categories by sales
    const categoryMap = new Map<string, number>();
    deals.forEach(deal => {
      const category = deal.product_category || 'Uncategorized';
      const revenue = (deal.quantity || 0) * (deal.unit_price || 0);
      categoryMap.set(category, (categoryMap.get(category) || 0) + revenue);
    });
    const topCategories = Array.from(categoryMap.entries())
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Top customers by revenue
    const customerMap = new Map<string, { revenue: number; orders: number }>();
    deals.forEach(deal => {
      const customerName = deal.buyer_name || 'Unknown';
      const revenue = (deal.quantity || 0) * (deal.unit_price || 0);
      const existing = customerMap.get(customerName) || { revenue: 0, orders: 0 };
      customerMap.set(customerName, {
        revenue: existing.revenue + revenue,
        orders: existing.orders + 1,
      });
    });
    const topCustomers = Array.from(customerMap.entries())
      .map(([name, data]) => ({ name, revenue: data.revenue, orders: data.orders }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Sales by location
    const locationMap = new Map<string, number>();
    deals.forEach(deal => {
      const location = deal.address || 'Unknown';
      const revenue = (deal.quantity || 0) * (deal.unit_price || 0);
      locationMap.set(location, (locationMap.get(location) || 0) + revenue);
    });
    const salesByLocation = Array.from(locationMap.entries())
      .map(([location, sales]) => ({ location, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    setSalesStats({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topProducts,
      topCategories,
      topCustomers,
      salesByLocation,
    });
  };

  const tabs = [
    { id: 0, label: 'Finance', icon: DollarSign },
    { id: 1, label: 'Sales', icon: ShoppingCart }
  ];

  // Revenue distribution from analytics or fallback
  const revenueDistributionData = revenueAnalytics?.revenue_sources && revenueAnalytics.revenue_sources.length > 0
    ? revenueAnalytics.revenue_sources.map(source => ({
        name: source.source || 'Other',
        value: source.amount || 0
      }))
    : financeStats && financeStats.totalRevenue > 0
    ? [
        { name: 'Sales', value: financeStats.totalRevenue * 0.45 },
        { name: 'Services', value: financeStats.totalRevenue * 0.30 },
        { name: 'Interest', value: financeStats.totalRevenue * 0.15 },
        { name: 'Other', value: financeStats.totalRevenue * 0.10 },
      ]
    : [];

  // Expenses distribution
  const expensesDistributionData = financeStats && financeStats.totalExpenses > 0
    ? [
        { name: 'Operating Expenses', value: financeStats.totalExpenses * 0.60 },
        { name: 'Cost of Goods', value: financeStats.totalExpenses * 0.25 },
        { name: 'Administrative', value: financeStats.totalExpenses * 0.15 },
      ]
    : [];

  // Assets breakdown
  const assetsBreakdownData = financeStats && financeStats.totalAssets > 0 ? [
    { name: 'Cash & Cash Equivalents', value: financeStats.totalAssets * 0.30 },
    { name: 'Property & Equipment', value: financeStats.totalAssets * 0.50 },
    { name: 'Other Assets', value: financeStats.totalAssets * 0.20 },
  ] : [];

  // Liabilities breakdown
  const liabilitiesBreakdownData = financeStats && financeStats.totalLiabilities > 0 ? [
    { name: 'Loans & Debt', value: financeStats.totalLiabilities * 0.60 },
    { name: 'Accounts Payable', value: financeStats.totalLiabilities * 0.30 },
    { name: 'Other Liabilities', value: financeStats.totalLiabilities * 0.10 },
  ] : [];

  // Sales chart data - use real data from salesStats
  const topCategories = salesStats?.topCategories || [];
  const topItems = salesStats?.topProducts || [];
  const topCustomers = salesStats?.topCustomers || [];
  const salesByLocation = salesStats?.salesByLocation || [];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Finance
        return (
          <div style={{ padding: '0' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Loading finance statistics...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Revenue Pie Chart */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px', color: '#6B7280' }}>
                    Revenue Distribution
                  </h3>
                  {revenueDistributionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={revenueDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#10B981"
                          dataKey="value"
                        >
                          {revenueDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Legend 
                          wrapperStyle={{ color: '#1F2937' }}
                          formatter={(value: string) => <span style={{ color: '#1F2937' }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                      No revenue data available
                    </div>
                  )}
                </div>

                {/* Expenses Pie Chart */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px', color: '#6B7280' }}>
                    Expenses Distribution
                  </h3>
                  {expensesDistributionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={expensesDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#EF4444"
                          dataKey="value"
                        >
                          {expensesDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Legend 
                          wrapperStyle={{ color: '#1F2937' }}
                          formatter={(value: string) => <span style={{ color: '#1F2937' }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                      No expense data available
                    </div>
                  )}
                </div>

                {/* Assets Chart */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px', color: '#6B7280' }}>
                    Assets Overview
                  </h3>
                  {assetsBreakdownData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={assetsBreakdownData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="value" fill="#1e40af" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                      No asset data available
                    </div>
                  )}
                </div>

                {/* Liabilities Chart */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px', color: '#6B7280' }}>
                    Liabilities Overview
                  </h3>
                  {liabilitiesBreakdownData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={liabilitiesBreakdownData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke="#6B7280" />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                      No liability data available
                    </div>
                  )}
                </div>

                {/* Cash Flow Chart - Full Width */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', gridColumn: '1 / -1' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#1F2937' }}>
                    Cash Flow Analysis
                  </h3>
                  {cashFlowData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={cashFlowData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis 
                          stroke="#6B7280"
                          label={{ value: 'Net Cash Flow ($)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => {
                            if (name === 'cumulativeFreq') {
                              return [`${value.toFixed(1)}%`, 'Cumulative Frequency'];
                            }
                            return [`$${value.toLocaleString()}`, name];
                          }}
                          labelFormatter={(label) => `Month: ${label}`}
                          contentStyle={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="net"
                          stroke="#1e40af" 
                          strokeWidth={3}
                          name="Net Cash Flow"
                          dot={{ fill: '#1e40af', strokeWidth: 2, r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                      No cash flow data available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 1: // Sales
        return (
          <div style={{ padding: '0' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Loading sales statistics...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Top Categories */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px', color: '#6B7280' }}>
                    Top Categories
                  </h3>
                  {topCategories.length > 0 ? (
                    <>
                      <style dangerouslySetInnerHTML={{
                        __html: `
                          .recharts-pie-label-text {
                            fill: #1F2937 !important;
                            font-weight: 600 !important;
                            font-size: 12px !important;
                          }
                        `
                      }} />
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={topCategories}
                            cx="50%"
                            cy="45%"
                            labelLine={false}
                            label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="sales"
                          >
                            {topCategories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                          <Legend 
                            layout="vertical"
                            verticalAlign="bottom"
                            align="left"
                            wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
                            formatter={(value: string) => <span style={{ color: '#1F2937' }}>{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                      No category data available
                    </div>
                  )}
                </div>

                {/* Top Items/Services */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px', color: '#6B7280' }}>
                    Top Items Sold
                  </h3>
                  {topItems.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topItems} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number" stroke="#6B7280" />
                        <YAxis dataKey="name" type="category" stroke="#6B7280" width={100} />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="revenue" fill="#1e40af" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                      No sales data available
                    </div>
                  )}
                </div>

                {/* Top Customers */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px', color: '#6B7280' }}>
                    Top Customers
                  </h3>
                  {topCustomers.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topCustomers} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number" stroke="#6B7280" />
                        <YAxis dataKey="name" type="category" stroke="#6B7280" width={100} />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="revenue" fill="#10B981" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                      No customer data available
                    </div>
                  )}
                </div>

                {/* Sales by Location */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px', color: '#6B7280' }}>
                    Sales by Location
                  </h3>
                  {salesByLocation.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesByLocation}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="location" stroke="#6B7280" angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke="#6B7280" />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="sales" fill="#1f2937" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                      No location data available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px', background: '#F9FAFB', minHeight: 'calc(100vh - 80px)' }}>
      {/* Compact Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        backgroundColor: '#f3f4f6',
        padding: '6px',
        borderRadius: '12px',
        width: 'fit-content'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              backgroundColor: activeTab === tab.id ? '#1f2937' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#6b7280',
              border: 'none',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === tab.id ? '0 4px 8px rgba(31, 41, 55, 0.2)' : 'none',
              transform: activeTab === tab.id ? 'translateY(-1px)' : 'translateY(0)'
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
