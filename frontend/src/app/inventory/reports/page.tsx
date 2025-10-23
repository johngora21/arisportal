'use client';

import React, { useMemo, useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

function ReportsModule() {
  const products = useMemo(() => ([
    { id: 'p1', name: 'Office Chair', category: 'Furniture', unitPrice: 150 },
    { id: 'p2', name: 'Laptop 15"', category: 'Electronics', unitPrice: 800 },
    { id: 'p3', name: 'A4 Paper Ream', category: 'Office Supplies', unitPrice: 12.5 },
    { id: 'p4', name: 'Desk Lamp', category: 'Electronics', unitPrice: 25 },
  ]), []);

  const [sales] = useState<Array<{ id: string; productId: string; qty: number; price: number; date: string; buyerName: string; buyerCity?: string; buyerPhone?: string; buyerEmail?: string; gender?: string; ageRange?: string }>>([
    { id: 's1', productId: 'p1', qty: 2, price: 150, date: '2025-09-01', buyerName: 'John D', buyerCity: 'Dar es Salaam', gender: 'Male', ageRange: '25-34', buyerPhone: '+255700000001' },
    { id: 's2', productId: 'p2', qty: 1, price: 800, date: '2025-09-03', buyerName: 'Asha K', buyerCity: 'Dodoma', gender: 'Female', ageRange: '25-34', buyerEmail: 'asha@example.com' },
    { id: 's3', productId: 'p3', qty: 20, price: 12.5, date: '2025-09-05', buyerName: 'Kito Ltd', buyerCity: 'Arusha', buyerPhone: '+255700000003' },
    { id: 's4', productId: 'p4', qty: 5, price: 25, date: '2025-09-06', buyerName: 'Mariam M', buyerCity: 'Mwanza', gender: 'Female', ageRange: '18-24' },
  ]);

  const [filters, setFilters] = useState<{ category: string; from?: string; to?: string }>({ category: 'all' });

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const prod = products.find(p => p.id === s.productId);
      if (!prod) return false;
      const inCat = filters.category === 'all' || prod.category === filters.category;
      const d = new Date(s.date).getTime();
      const inFrom = !filters.from || d >= new Date(filters.from).getTime();
      const inTo = !filters.to || d <= new Date(filters.to).getTime();
      return inCat && inFrom && inTo;
    });
  }, [sales, products, filters]);

  const kpis = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.qty * s.price, 0);
    const unitsSold = filteredSales.reduce((sum, s) => sum + s.qty, 0);
    const orders = filteredSales.length;
    const aov = orders ? totalRevenue / orders : 0;
    const stockTurnover = unitsSold / 100;
    return { totalRevenue, unitsSold, orders, aov, stockTurnover };
  }, [filteredSales]);

  const topProducts = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSales.forEach(s => { map[s.productId] = (map[s.productId] || 0) + s.qty * s.price; });
    return Object.entries(map)
      .map(([productId, revenue]) => ({ productId, revenue, name: products.find(p => p.id === productId)?.name || productId }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredSales, products]);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937', margin: 0 }}>Sales Reports</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>Analytics and insights for your inventory sales performance.</p>
        </div>
      </div>

      {/* Market Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        {/* Sales by Category Pie Chart */}
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--mc-sidebar-bg)', marginBottom: 16 }}>Sales by Category</h4>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <div style={{ position: 'relative', width: 150, height: 150 }}>
              {/* Pie Chart SVG */}
              <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="75" cy="75" r="60" fill="none" stroke="#e5e7eb" strokeWidth="20"/>
                <circle cx="75" cy="75" r="60" fill="none" stroke="#3b82f6" strokeWidth="20" 
                  strokeDasharray={`${2 * Math.PI * 60 * 0.45} ${2 * Math.PI * 60}`} strokeDashoffset="0"/>
                <circle cx="75" cy="75" r="60" fill="none" stroke="#10b981" strokeWidth="20" 
                  strokeDasharray={`${2 * Math.PI * 60 * 0.35} ${2 * Math.PI * 60}`} strokeDashoffset={`-${2 * Math.PI * 60 * 0.45}`}/>
                <circle cx="75" cy="75" r="60" fill="none" stroke="#f59e0b" strokeWidth="20" 
                  strokeDasharray={`${2 * Math.PI * 60 * 0.20} ${2 * Math.PI * 60}`} strokeDashoffset={`-${2 * Math.PI * 60 * 0.8}`}/>
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--mc-sidebar-bg)' }}>28</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Units</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, backgroundColor: '#3b82f6', borderRadius: 2 }}></div>
              <span style={{ fontSize: 14 }}>Electronics (45%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, backgroundColor: '#10b981', borderRadius: 2 }}></div>
              <span style={{ fontSize: 14 }}>Furniture (35%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, backgroundColor: '#f59e0b', borderRadius: 2 }}></div>
              <span style={{ fontSize: 14 }}>Office Supplies (20%)</span>
            </div>
          </div>
        </div>

        {/* Top Products Bar Chart */}
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--mc-sidebar-bg)', marginBottom: 16 }}>Top Products (by revenue)</h4>
          <div style={{ height: 200, position: 'relative' }}>
            <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
              {/* Bar Chart */}
              <rect x="20" y="40" width="60" height="120" fill="#3b82f6" rx="4"/>
              <rect x="100" y="80" width="60" height="80" fill="#10b981" rx="4"/>
              <rect x="180" y="100" width="60" height="60" fill="#f59e0b" rx="4"/>
              <rect x="260" y="140" width="60" height="20" fill="#ef4444" rx="4"/>
              
              {/* Product Labels */}
              <text x="50" y="175" fontSize="12" fill="#6b7280" textAnchor="middle">Laptop 15"</text>
              <text x="130" y="175" fontSize="12" fill="#6b7280" textAnchor="middle">Office Chair</text>
              <text x="210" y="175" fontSize="12" fill="#6b7280" textAnchor="middle">A4 Paper</text>
              <text x="290" y="175" fontSize="12" fill="#6b7280" textAnchor="middle">Desk Lamp</text>
              
              {/* Revenue Labels */}
              <text x="50" y="30" fontSize="12" fill="var(--mc-sidebar-bg)" textAnchor="middle" fontWeight="600">TZS 800</text>
              <text x="130" y="70" fontSize="12" fill="var(--mc-sidebar-bg)" textAnchor="middle" fontWeight="600">TZS 300</text>
              <text x="210" y="90" fontSize="12" fill="var(--mc-sidebar-bg)" textAnchor="middle" fontWeight="600">TZS 250</text>
              <text x="290" y="130" fontSize="12" fill="var(--mc-sidebar-bg)" textAnchor="middle" fontWeight="600">TZS 125</text>
              
              {/* Y-axis */}
              <line x1="15" y1="20" x2="15" y2="160" stroke="#e5e7eb" strokeWidth="2"/>
              <line x1="15" y1="160" x2="320" y2="160" stroke="#e5e7eb" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Best Seller</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--mc-sidebar-bg)', marginTop: 4 }}>Office Chair</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>28 units sold</div>
        </div>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Avg Order Value</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--mc-sidebar-bg)', marginTop: 4 }}>TZS 369</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Per transaction</div>
        </div>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Stock Turnover</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--mc-sidebar-bg)', marginTop: 4 }}>0.28</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Monthly rate</div>
        </div>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Total Revenue</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--mc-sidebar-bg)', marginTop: 4 }}>TZS 1,475</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>This period</div>
        </div>
      </div>

      {/* Market Analysis Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        {/* Trending Products */}
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--mc-sidebar-bg)', marginBottom: 12 }}>Trending Products (Market)</h4>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { name: 'Wireless Mouse', category: 'Electronics', trend: '+45%', price: 'TZS 25,000', supplier: 'TechHub Ltd' },
                { name: 'Standing Desk', category: 'Furniture', trend: '+32%', price: 'TZS 180,000', supplier: 'OfficePro' },
                { name: 'Bluetooth Speaker', category: 'Electronics', trend: '+28%', price: 'TZS 45,000', supplier: 'SoundMax' },
                { name: 'Ergonomic Chair', category: 'Furniture', trend: '+22%', price: 'TZS 120,000', supplier: 'ComfortZone' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{item.category} • {item.supplier}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{item.trend}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitor Pricing */}
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--mc-sidebar-bg)', marginBottom: 12 }}>Competitor Pricing</h4>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { product: 'Office Chair', yourPrice: 'TZS 150,000', marketAvg: 'TZS 145,000', competitors: '5 stores' },
                { product: 'Laptop 15"', yourPrice: 'TZS 800,000', marketAvg: 'TZS 820,000', competitors: '8 stores' },
                { product: 'A4 Paper Ream', yourPrice: 'TZS 12,500', marketAvg: 'TZS 13,200', competitors: '12 stores' },
                { product: 'Desk Lamp', yourPrice: 'TZS 25,000', marketAvg: 'TZS 28,000', competitors: '6 stores' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.product}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{item.competitors}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{item.yourPrice}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Avg: {item.marketAvg}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937', margin: 0 }}>Reports & Analytics</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>Analytics and insights for your inventory sales performance with market analysis.</p>
        </div>
      </div>
      <ReportsModule />
    </div>
  );
}
