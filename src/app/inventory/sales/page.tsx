'use client';

import React, { useMemo, useState } from 'react';
import { DollarSign } from 'lucide-react';

export function SalesModule() {
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

  const formRef: Partial<{ productId: string; qty: number; price: number; date: string; buyerName: string; buyerCity: string; buyerPhone: string; buyerEmail: string; gender: string; ageRange: string }> = {};

  return (
    <div>

      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: 24 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--mc-sidebar-bg)' }}>Record Sale (Buyer Details)</h3>
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
              Total Amount: <span style={{ fontWeight: 700, color: 'var(--mc-sidebar-bg)' }}>TZS {(Math.max(0, saleQty) * Math.max(0, salePrice)).toLocaleString()}</span>
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
            }}
            style={{ padding: '10px 16px', backgroundColor: 'var(--mc-sidebar-bg)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
          >
            Save Sale
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SalesPage() {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937', margin: 0 }}>Sales Management</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>Record and track sales with buyer details and demographics.</p>
        </div>
      </div>
      <SalesModule />
    </div>
  );
}
