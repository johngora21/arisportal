'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { DollarSign, BarChart3, Package, Star, MapPin, Clock, TrendingUp, CheckCircle, Phone, Mail, Calendar, Users, Award, Shield, Truck, CreditCard, Globe, Plus } from 'lucide-react';
import Link from 'next/link';
import { SalesModule } from '../sales/page';
import { ReportsModule } from '../reports/page';
import { SuppliersModule } from '../suppliers/page';
import { BulkOrdersModule } from '../bulk-orders/page';

// Declare Leaflet types
declare const L: any;

export default function InventoryModulesPage() {
  const [activeTab, setActiveTab] = useState<'sales'|'reports'|'suppliers'|'bulk-orders'>('sales');
  const [productQuery, setProductQuery] = useState('');
  const [saleQty, setSaleQty] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [supplierCountryFilter, setSupplierCountryFilter] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
    'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
    'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia',
    'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
    'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
    'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
    'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
    'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco',
    'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
    'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine',
    'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
    'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
    'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
    'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
    'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
    'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen', 'Zambia', 'Zimbabwe'
  ];

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

  // Initialize map when supplier modal opens
  useEffect(() => {
    if (showSupplierModal && mapRef.current && !mapInstanceRef.current && selectedSupplier?.coordinates) {
      const map = L.map(mapRef.current).setView(
        [selectedSupplier.coordinates.lat, selectedSupplier.coordinates.lng], 
        15
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([selectedSupplier.coordinates.lat, selectedSupplier.coordinates.lng]).addTo(map);
      marker.bindPopup(`
        <div style="padding: 8px; font-family: 'Poppins', sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
            ${selectedSupplier.name}
          </h3>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
            ${selectedSupplier.contact.address}
          </p>
          <p style="margin: 0; font-size: 14px; color: #059669; font-weight: 600;">
            ${selectedSupplier.contact.phone}
          </p>
        </div>
      `).openPopup();

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current = null;
      }
    };
  }, [showSupplierModal, selectedSupplier]);

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
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1f2937', margin: '0 0 8px 0' }}>
          Inventory Modules
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
          Comprehensive inventory management tools for sales, reports, suppliers, and bulk orders.
        </p>
      </div>

      {/* Quick Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: 'transparent', borderRadius: '20px', color: '#3b82f6' }}>
              <DollarSign size={20} />
            </div>
        <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Revenue</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>TZS 1,475</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
            <TrendingUp size={12} style={{ display: 'inline', marginRight: '4px' }} />
            +12% from last month
        </div>
      </div>

        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: 'transparent', borderRadius: '20px', color: '#10b981' }}>
              <Package size={20} />
        </div>
        <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Suppliers</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>4</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
            <TrendingUp size={12} style={{ display: 'inline', marginRight: '4px' }} />
            +2 new this month
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: 'transparent', borderRadius: '20px', color: '#f59e0b' }}>
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Bulk Orders</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>3 Active</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
            <TrendingUp size={12} style={{ display: 'inline', marginRight: '4px' }} />
            +1 new pool
        </div>
      </div>

        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: 'transparent', borderRadius: '20px', color: '#ec4899' }}>
              <BarChart3 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Growth Rate</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>+28%</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
            <TrendingUp size={12} style={{ display: 'inline', marginRight: '4px' }} />
            +5% from last month
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '20px', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { id: 'sales', label: 'Sales', icon: <DollarSign size={16} /> },
            { id: 'suppliers', label: 'Suppliers', icon: <Package size={16} /> },
            { id: 'bulk-orders', label: 'Bulk Orders', icon: <Users size={16} /> },
            { id: 'reports', label: 'Reports', icon: <BarChart3 size={16} /> }
          ].map(t => (
            <button key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: '14px 12px',
                backgroundColor: activeTab === (t.id as any) ? 'var(--mc-sidebar-bg)' : 'transparent',
                color: activeTab === (t.id as any) ? 'white' : '#6b7280',
                border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer'
              }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>{t.icon}{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'sales' && <SalesModule />}


      {activeTab === 'suppliers' && <SuppliersModule />}

      {activeTab === 'bulk-orders' && <BulkOrdersModule />}
      {/* Supplier Details Modal */}
      {showSupplierModal && selectedSupplier && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: 'min(900px, 95vw)',
            maxHeight: '95vh',
            borderRadius: '20px',
            padding: '32px',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowSupplierModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '20px',
                color: '#6b7280'
              }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  {selectedSupplier.name}
                </h2>
                <div style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle size={12} />
                  Verified
                </div>
              </div>
              <div style={{ fontSize: '16px', color: '#6b7280' }}>
                {selectedSupplier.category} • {selectedSupplier.location}
              </div>
            </div>

            {/* Contact Information */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Contact Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.contact.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.contact.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.contact.website}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.contact.address}</span>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Location
              </h3>
              <div style={{ height: '300px', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
              </div>
            </div>

            {/* Products & Services */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Products & Services
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {selectedSupplier.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#f9fafb',
                      color: '#6b7280',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  Specialties
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedSupplier.specialties.map((specialty: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing & Business Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Pricing & Orders
                </h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Price Range</div>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: '#059669' }}>{selectedSupplier.priceRange}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Bulk Discount</div>
                  <div style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '500' }}>{selectedSupplier.bulkDiscount}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Minimum Order</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedSupplier.minOrder}</div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Business Details
                </h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Lead Time</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedSupplier.leadTime}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Return Policy</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedSupplier.returnPolicy}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Delivery Areas</div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>{selectedSupplier.deliveryAreas.join(', ')}</div>
                </div>
              </div>
            </div>


            {/* Customer Reviews */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Customer Reviews
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {selectedSupplier.customerReviews.map((review: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{review.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < review.rating ? '#f59e0b' : '#e5e7eb'}
                            color={i < review.rating ? '#f59e0b' : '#e5e7eb'}
                          />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button style={{
                backgroundColor: 'transparent',
                color: 'var(--mc-sidebar-bg)',
                border: '1px solid var(--mc-sidebar-bg)',
                borderRadius: '20px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--mc-sidebar-bg)';
              }}
              >
                View Portfolio
              </button>
              
              <button style={{
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
              }}
              >
                Contact Supplier
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}


