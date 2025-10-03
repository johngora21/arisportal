'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Download,
  Clock,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Upload,
  Settings,
  FileText,
  BarChart3,
  TrendingUp,
  Receipt,
  DollarSign,
  Building,
  AlertCircle,
  PieChart
} from 'lucide-react';
import { Dashboard, Transactions, Accounting, CashFlow, Revenue, Reports } from './components';

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'accounting' | 'cashflow' | 'revenue' | 'reports'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    type: 'revenue',
    category: '',
    amount: 0,
    reference: '',
    paymentMethod: 'cash'
  });

  const formatPrice = (v: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', currency: 'TZS', minimumFractionDigits: 0
  }).format(v);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header with actions */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: 0 }}>Transactions</h1>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: '8px 0 0 0' }}>Combined Payments & Collections management</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px 16px', backgroundColor: 'var(--mc-sidebar-bg)', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', minHeight: '44px'
            }}
          >
            <Plus size={18} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* KPI Cards (visible on all tabs) */}
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '24px' }}>
        {[
          { 
            label: 'Total Revenue', 
            value: 2850000,
            color: '#10b981', 
            bg: '#ecfdf5', 
            icon: TrendingUp,
            change: '+12.5%',
            changeType: 'positive'
          },
          { 
            label: 'Total Expenses', 
            value: 1200000,
            color: '#ef4444', 
            bg: '#fee2e2', 
            icon: TrendingUp,
            change: '+8.2%',
            changeType: 'negative'
          },
          { 
            label: 'Net Profit', 
            value: 1650000,
            color: '#3b82f6', 
            bg: '#dbeafe', 
            icon: BarChart3,
            change: '+15.3%',
            changeType: 'positive'
          },
          { 
            label: 'Cash Balance', 
            value: 450000,
            color: '#f59e0b', 
            bg: '#fef3c7', 
            icon: DollarSign,
            change: '+3.7%',
            changeType: 'positive'
          }
        ].map(k => (
          <div key={k.label} style={{
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            border: '1px solid #f3f4f6', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            minHeight: '160px',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Header with icon and change indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ 
                  backgroundColor: k.bg, 
                  color: k.color, 
                  borderRadius: '12px', 
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <k.icon size={20} />
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '600',
                  color: k.changeType === 'positive' ? '#10b981' : '#ef4444',
                  backgroundColor: k.changeType === 'positive' ? '#ecfdf5' : '#fee2e2',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {k.change}
                </div>
              </div>
              
              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>
                  {k.label}
                </div>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  color: '#1f2937',
                  lineHeight: '1.2',
                  marginBottom: '8px'
                }}>
                  {formatPrice(k.value)}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>vs last month</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs (Dashboard, Transactions, Accounting, Cash Flow, Revenue, Reports) */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'accounting', label: 'Accounting' },
            { id: 'cashflow', label: 'Cash Flow' },
            { id: 'revenue', label: 'Revenue' },
            { id: 'reports', label: 'Reports' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '14px 12px', backgroundColor: activeTab === (tab.id as any) ? 'var(--mc-sidebar-bg)' : 'transparent',
                color: activeTab === (tab.id as any) ? 'white' : '#6b7280', border: 'none', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'transactions' && <Transactions />}
      {activeTab === 'accounting' && <Accounting />}
      {activeTab === 'cashflow' && <CashFlow />}
      {activeTab === 'revenue' && <Revenue />}
      {activeTab === 'reports' && <Reports />}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Add New Transaction
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTransaction({ description: '', type: 'revenue', category: '', amount: 0, reference: '', paymentMethod: 'cash' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Description *
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  placeholder="Enter transaction description"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Type *
                  </label>
                  <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                    <option value="equity">Equity</option>
                    <option value="transfer">Transfer</option>
                    <option value="reversal">Reversal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    placeholder="e.g., Services, Rent"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Reference
                  </label>
                  <input
                    type="text"
                    value={newTransaction.reference}
                    onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                    placeholder="e.g., INV-001"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Payment Method
                </label>
                <select
                  value={newTransaction.paymentMethod}
                  onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTransaction({ description: '', type: 'revenue', category: '', amount: 0, reference: '', paymentMethod: 'cash' });
                  }}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Here you would typically save the transaction to your database
                    console.log('New transaction:', newTransaction);
                    setShowAddModal(false);
                    setNewTransaction({ description: '', type: 'revenue', category: '', amount: 0, reference: '', paymentMethod: 'cash' });
                    // You might want to show a success message or refresh the transactions list
                  }}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Add Transaction
                </button>
        </div>
        </div>
        </div>
        </div>
      )}

    </div>
  );
}
















