'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { DealService } from '../../crm/models/deal';
import { ContactService } from '../../crm/models/contact';
import InventoryService from '../models/inventoryService';

export default function SalesPage() {
  const [productQuery, setProductQuery] = useState('');
  const [saleQty, setSaleQty] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Load inventory items from backend
  useEffect(() => {
    const loadInventoryItems = async () => {
      setLoadingProducts(true);
      try {
        const items = await InventoryService.fetchItems();
        setInventoryItems(items);
      } catch (error) {
        console.error('Error loading inventory items:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    
    loadInventoryItems();
  }, []);

  const visibleProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    if (!q) return inventoryItems;
    return inventoryItems.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
  }, [inventoryItems, productQuery]);

  const [sales, setSales] = useState<Array<{ id: string; productId: string; qty: number; price: number; date: string; buyerName: string; buyerCity?: string; buyerPhone?: string; buyerEmail?: string }>>([]);

  const [formData, setFormData] = useState({
    productId: '',
    qty: 0,
    price: 0,
    date: '',
    buyerName: '',
    buyerCity: '',
    buyerPhone: '',
    buyerEmail: ''
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937', margin: 0 }}>Sales Management</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>Record and track sales with buyer details and demographics.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '20px', padding: 24 }}>
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
              style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 20, marginBottom: 8, marginRight: 8, boxSizing: 'border-box' }}
            />
            {showProductDropdown && (
              <div style={{ position: 'absolute', top: 64, left: 0, right: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, boxShadow: '0 8px 16px rgba(0,0,0,0.08)', zIndex: 10, maxHeight: 240, overflowY: 'auto' }}>
                {loadingProducts ? (
                  <div style={{ padding: 10, color: '#6b7280' }}>Loading products...</div>
                ) : visibleProducts.length === 0 ? (
                  <div style={{ padding: 10, color: '#6b7280' }}>No products found</div>
                ) : null}
                {visibleProducts.map(p => (
                  <div
                    key={p.id}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, productId: p.id.toString() }));
                      setProductQuery(p.name);
                      setFormData(prev => ({ ...prev, price: p.unitPrice }));
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
            <input type="number" onChange={(e) => { const v = parseInt(e.target.value || '0'); setFormData(prev => ({ ...prev, qty: v })); setSaleQty(isNaN(v) ? 0 : v); }}
              style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 20, boxSizing: 'border-box', marginRight: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Price per unit</label>
            <input type="number" step="0.01" onChange={(e) => { const v = parseFloat(e.target.value || '0'); setFormData(prev => ({ ...prev, price: v })); setSalePrice(isNaN(v) ? 0 : v); }}
              style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 20, boxSizing: 'border-box', marginRight: 8 }} />
            <div style={{ marginTop: 6, fontSize: 12, color: '#6b7280' }}>
              Total Amount: <span style={{ fontWeight: 700, color: 'var(--mc-sidebar-bg)' }}>TZS {(Math.max(0, saleQty) * Math.max(0, salePrice)).toLocaleString()}</span>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Date</label>
            <input type="date" onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 20, boxSizing: 'border-box', marginRight: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Buyer name</label>
            <input type="text" onChange={(e) => setFormData(prev => ({ ...prev, buyerName: e.target.value }))}
              style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 20, boxSizing: 'border-box', marginRight: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Buyer Location</label>
            <input type="text" onChange={(e) => setFormData(prev => ({ ...prev, buyerCity: e.target.value }))}
              style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 20, boxSizing: 'border-box', marginRight: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Buyer Phone</label>
            <input type="text" onChange={(e) => setFormData(prev => ({ ...prev, buyerPhone: e.target.value }))}
              style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 20, boxSizing: 'border-box', marginRight: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Buyer Email</label>
            <input type="email" onChange={(e) => setFormData(prev => ({ ...prev, buyerEmail: e.target.value }))}
              style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 20, boxSizing: 'border-box', marginRight: 8 }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
          <button
            onClick={async () => {
              console.log('Button clicked!');
              console.log('formData.productId:', formData.productId);
              console.log('inventoryItems:', inventoryItems);
              
              if (!formData.productId) {
                alert('Please select a product first');
                return;
              }
              
              setIsSubmitting(true);
              try {
                // Find the selected product
                const selectedProduct = inventoryItems.find(p => p.id.toString() === formData.productId);
                if (!selectedProduct) return;

                // Create deal data for CRM
                const dealData = {
                  productName: selectedProduct.name,
                  productCategory: selectedProduct.category,
                  buyerName: formData.buyerName || 'Unknown',
                  address: formData.buyerCity || '',
                  email: formData.buyerEmail || '',
                  phone: formData.buyerPhone || '',
                  orderDate: new Date(formData.date || new Date().toISOString().slice(0, 10)),
                  quantity: formData.qty || 0,
                  unitPrice: formData.price || selectedProduct.unitPrice
                };

                // Create the deal (this will also create contact if needed)
                await DealService.createDeal(dealData);

                // Add to local sales state for display
              const id = `s${Date.now()}`;
              setSales(prev => ([...prev, {
                id,
                  productId: formData.productId,
                  qty: formData.qty || 0,
                  price: formData.price || selectedProduct.unitPrice,
                  date: formData.date || new Date().toISOString().slice(0,10),
                  buyerName: formData.buyerName || 'Unknown',
                  buyerCity: formData.buyerCity || '',
                  buyerPhone: formData.buyerPhone || '',
                  buyerEmail: formData.buyerEmail || ''
              }]));

                // Reset form
                setFormData({
                  productId: '',
                  qty: 0,
                  price: 0,
                  date: '',
                  buyerName: '',
                  buyerCity: '',
                  buyerPhone: '',
                  buyerEmail: ''
                });
                setProductQuery('');
                setSaleQty(0);
                setSalePrice(0);

                alert('Sale recorded successfully! Contact and deal created in CRM.');
              } catch (error) {
                console.error('Error creating sale:', error);
                alert('Error creating sale: ' + (error as Error).message);
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            style={{ 
              padding: '10px 16px', 
              backgroundColor: isSubmitting ? '#9ca3af' : 'var(--mc-sidebar-bg-hover)', 
              color: 'white', 
              border: 'none', 
              borderRadius: 8, 
              fontWeight: 600, 
              cursor: isSubmitting ? 'not-allowed' : 'pointer' 
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}

