'use client';

import React, { useMemo, useState } from 'react';
import { DollarSign, BarChart3, Truck, Package } from 'lucide-react';

export default function InventoryModulesPage() {
  const [activeTab, setActiveTab] = useState<'sales'|'reports'|'suppliers'|'pooling'>('sales');
  const [productQuery, setProductQuery] = useState('');
  const [saleQty, setSaleQty] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const products = useMemo(() => ([
    { id: 'p1', name: 'Office Chair', category: 'Furniture', unitPrice: 150 },
    { id: 'p2', name: 'Laptop 15"', category: 'Electronics', unitPrice: 800 },
    { id: 'p3', name: 'A4 Paper Ream', category: 'Office Supplies', unitPrice: 12.5 },
    { id: 'p4', name: 'Desk Lamp', category: 'Electronics', unitPrice: 25 },
  ]), []);
  const visibleProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [products, productQuery]);
  const [sales, setSales] = useState<Array<{ id: string; productId: string; qty: number; price: number; date: string; buyerName: string; buyerCity?: string; buyerPhone?: string; buyerEmail?: string; gender?: string; ageRange?: string }>>([
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

  const formRef: Partial<{ productId: string; qty: number; price: number; date: string; buyerName: string; buyerCity: string; buyerPhone: string; buyerEmail: string; gender: string; ageRange: string }> = {};

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937', margin: 0 }}>Inventory Modules</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>Extended analytics and workflows for inventories.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { id: 'sales', label: 'Sales', icon: <DollarSign size={16} /> },
            { id: 'reports', label: 'Reports', icon: <BarChart3 size={16} /> },
            { id: 'suppliers', label: 'Suppliers', icon: <Truck size={16} /> },
            { id: 'pooling', label: 'Pooling', icon: <Package size={16} /> }
          ].map(t => (
            <button key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: '14px 12px',
                backgroundColor: activeTab === (t.id as any) ? '#0f172a' : 'transparent',
                color: activeTab === (t.id as any) ? 'white' : '#6b7280',
                border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer'
              }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>{t.icon}{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'reports' && (
        <>
          {/* Market Analytics Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
            {/* Sales by Category Pie Chart */}
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Sales by Category</h4>
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
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>28</div>
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
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Top Products (by revenue)</h4>
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
                  <text x="50" y="30" fontSize="12" fill="#111827" textAnchor="middle" fontWeight="600">TZS 800</text>
                  <text x="130" y="70" fontSize="12" fill="#111827" textAnchor="middle" fontWeight="600">TZS 300</text>
                  <text x="210" y="90" fontSize="12" fill="#111827" textAnchor="middle" fontWeight="600">TZS 250</text>
                  <text x="290" y="130" fontSize="12" fill="#111827" textAnchor="middle" fontWeight="600">TZS 125</text>
                  
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
              <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginTop: 4 }}>Office Chair</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>28 units sold</div>
            </div>
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Avg Order Value</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginTop: 4 }}>TZS 369</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Per transaction</div>
            </div>
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Stock Turnover</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginTop: 4 }}>0.28</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Monthly rate</div>
            </div>
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Total Revenue</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginTop: 4 }}>TZS 1,475</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>This period</div>
            </div>
          </div>

          {/* Market Analysis Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
            {/* Trending Products */}
            <div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Trending Products (Market)</h4>
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
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Competitor Pricing</h4>
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



        </>
      )}

      {activeTab === 'sales' && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111827' }}>Record Sale (Buyer Details)</h3>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Capture buyer identity and demographics with each sale for analytics.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Product</label>
              <input
                type="text"
                placeholder="Search and select product..."
                value={productQuery}
                onChange={(e) => { setProductQuery(e.target.value); setShowProductDropdown(true); }}
                onFocus={() => setShowProductDropdown(true)}
                onBlur={() => setTimeout(() => setShowProductDropdown(false), 150)}
                style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8, marginBottom: 8, marginRight: 8, boxSizing: 'border-box' }}
              />
              {showProductDropdown && (
                <div style={{ position: 'absolute', top: 64, left: 0, right: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 8px 16px rgba(0,0,0,0.08)', zIndex: 10, maxHeight: 240, overflowY: 'auto' }}>
                  {visibleProducts.length === 0 && (
                    <div style={{ padding: 10, color: '#6b7280' }}>No products</div>
                  )}
                  {visibleProducts.map(p => (
                    <div
                      key={p.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        formRef.productId = p.id;
                        setProductQuery(p.name);
                        formRef.price = p.unitPrice;
                        setSalePrice(p.unitPrice);
                        setShowProductDropdown(false);
                      }}
                      style={{ padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#f9fafb'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                    >
                      <span>{p.name}</span>
                      <span style={{ color: '#6b7280', fontSize: 12 }}>TZS {p.unitPrice.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Quantity</label>
              <input type="number" onChange={(e) => { const v = parseInt(e.target.value || '0'); formRef.qty = v; setSaleQty(isNaN(v) ? 0 : v); }}
                style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box', marginRight: 8 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Price per unit</label>
              <input type="number" step="0.01" onChange={(e) => { const v = parseFloat(e.target.value || '0'); formRef.price = v; setSalePrice(isNaN(v) ? 0 : v); }}
                style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box', marginRight: 8 }} />
              <div style={{ marginTop: 6, fontSize: 12, color: '#6b7280' }}>
                Total Amount: <span style={{ fontWeight: 700, color: '#111827' }}>TZS {(Math.max(0, saleQty) * Math.max(0, salePrice)).toLocaleString()}</span>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Date</label>
              <input type="date" onChange={(e) => (formRef.date = e.target.value)}
                style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box', marginRight: 8 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Buyer name</label>
              <input type="text" onChange={(e) => (formRef.buyerName = e.target.value)}
                style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box', marginRight: 8 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Buyer Location</label>
              <input type="text" onChange={(e) => (formRef.buyerCity = e.target.value)}
                style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box', marginRight: 8 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Buyer Phone</label>
              <input type="text" onChange={(e) => (formRef.buyerPhone = e.target.value)}
                style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box', marginRight: 8 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Buyer Email</label>
              <input type="email" onChange={(e) => (formRef.buyerEmail = e.target.value)}
                style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box', marginRight: 8 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Buyer Gender</label>
              <select onChange={(e) => (formRef.gender = e.target.value)}
                style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box', marginRight: 8 }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Buyer Age Range</label>
              <input type="text" onChange={(e) => (formRef.ageRange = e.target.value)}
                placeholder="e.g., 25-34"
                style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, boxSizing: 'border-box', marginRight: 8 }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
            <button
              onClick={() => {
                if (!formRef.productId) return;
                const id = `s${Date.now()}`;
                setSales(prev => ([...prev, {
                  id,
                  productId: formRef.productId!,
                  qty: formRef.qty || 0,
                  price: formRef.price || (products.find(p => p.id === formRef.productId)?.unitPrice || 0),
                  date: formRef.date || new Date().toISOString().slice(0,10),
                  buyerName: formRef.buyerName || 'Unknown',
                  buyerCity: formRef.buyerCity || '',
                  buyerPhone: formRef.buyerPhone || '',
                  buyerEmail: formRef.buyerEmail || '',
                  gender: formRef.gender || '',
                  ageRange: formRef.ageRange || ''
                }]));
                formRef.productId = '';
                formRef.qty = 0;
                formRef.price = 0;
                formRef.date = '';
                formRef.buyerName = '';
                formRef.buyerCity = '';
                formRef.buyerPhone = '';
                formRef.buyerEmail = '';
                formRef.gender = '';
                formRef.ageRange = '';
                setActiveTab('reports');
              }}
              style={{ padding: '10px 16px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
            >
              Save Sale
            </button>
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111827' }}>Suppliers</h3>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Benchmark suppliers and track landed costs (local-only for now).</p>

          <div style={{ marginTop: 24 }}>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Supplier Intelligence</h4>
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                {[
                  { name: 'TechHub Ltd', category: 'Electronics', minOrder: '50 units', leadTime: '7 days', rating: '4.8/5', location: 'Dar es Salaam' },
                  { name: 'OfficePro', category: 'Furniture', minOrder: '20 units', leadTime: '14 days', rating: '4.6/5', location: 'Arusha' },
                  { name: 'SoundMax', category: 'Electronics', minOrder: '100 units', leadTime: '5 days', rating: '4.9/5', location: 'Mwanza' },
                  { name: 'ComfortZone', category: 'Furniture', minOrder: '15 units', leadTime: '21 days', rating: '4.7/5', location: 'Dodoma' }
                ].map((supplier, i) => (
                  <div key={i} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{supplier.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{supplier.category} • {supplier.location}</div>
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{supplier.rating}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                      <div>
                        <div style={{ color: '#6b7280' }}>Min Order</div>
                        <div style={{ fontWeight: 600 }}>{supplier.minOrder}</div>
                      </div>
                      <div>
                        <div style={{ color: '#6b7280' }}>Lead Time</div>
                        <div style={{ fontWeight: 600 }}>{supplier.leadTime}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pooling' && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111827' }}>Pooled Bulk Orders</h3>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Create order pools so multiple sellers can commit and buy cheaper.</p>
        </div>
      )}

      
    </div>
  );
}


