'use client';

import React, { useState, useEffect } from 'react';
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
  TrendingDown,
  Receipt,
  DollarSign,
  Building,
  AlertCircle,
  PieChart
} from 'lucide-react';
import { Dashboard, Transactions, Accounting, CashFlow, Revenue, Reports, CategoryInput } from './components';
import { buildApiUrl } from '../../../config/api';

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'accounting'>('transactions');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    type: 'revenue',
    category: '',
    amount: 0,
    reference: '',
    paymentMethod: 'cash',
    account: 'Business Account'
  });
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [kpiData, setKpiData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    cashBalance: 0,
    revenueChange: 0,
    expensesChange: 0,
    profitChange: 0,
    cashChange: 0
  });
  const [kpiLoading, setKpiLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const formatPrice = (v: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', currency: 'TZS', minimumFractionDigits: 0
  }).format(v);

  // Fetch KPI data
  const fetchKpiData = async () => {
    try {
      setKpiLoading(true);
      
      // Get current month data
      const currentDate = new Date();
      const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      // Get previous month data
      const prevMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      
      const [currentResponse, prevResponse] = await Promise.all([
        fetch(buildApiUrl(`/transactions/stats/summary?start_date=${currentMonthStart.toISOString()}&end_date=${currentMonthEnd.toISOString()}`)),
        fetch(buildApiUrl(`/transactions/stats/summary?start_date=${prevMonthStart.toISOString()}&end_date=${prevMonthEnd.toISOString()}`))
      ]);
      
      if (!currentResponse.ok || !prevResponse.ok) {
        throw new Error(`Failed to fetch KPI data: ${currentResponse.status}`);
      }
      
      const currentData = await currentResponse.json();
      const prevData = await prevResponse.json();
      
      // Calculate percentage changes
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };
      
      setKpiData({
        totalRevenue: currentData.total_revenue || 0,
        totalExpenses: currentData.total_expenses || 0,
        netIncome: currentData.net_income || 0,
        cashBalance: currentData.total_assets || 0,
        revenueChange: calculateChange(currentData.total_revenue || 0, prevData.total_revenue || 0),
        expensesChange: calculateChange(currentData.total_expenses || 0, prevData.total_expenses || 0),
        profitChange: calculateChange(currentData.net_income || 0, prevData.net_income || 0),
        cashChange: calculateChange(currentData.total_assets || 0, prevData.total_assets || 0)
      });
    } catch (err) {
      console.error('Error fetching KPI data:', err);
      // Keep default values on error
    } finally {
      setKpiLoading(false);
    }
  };

  // Handle refresh from Transactions component
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    fetchKpiData();
  };

  // Handle edit transaction
  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      description: transaction.description,
      type: transaction.type.toLowerCase(),
      category: transaction.category || '',
      amount: transaction.amount,
      reference: transaction.reference || '',
      paymentMethod: transaction.payment_method.toLowerCase(),
      account: transaction.account || 'Business Account'
    });
    setShowAddModal(true);
  };


  // Load KPI data on component mount
  useEffect(() => {
    fetchKpiData();
  }, []);

  // Handle transaction creation/update
  const handleCreateTransaction = async () => {
    try {
      const isEditing = editingTransaction !== null;
      const url = isEditing 
        ? buildApiUrl(`/transactions/${editingTransaction.transaction_id}`)
        : buildApiUrl('/transactions/');
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTransaction,
          createdBy: 'frontend-user'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} transaction: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log(`Transaction ${isEditing ? 'updated' : 'created'}:`, result);
      
      // Reset form and close modal
      setNewTransaction({
        description: '',
        type: 'revenue',
        category: '',
        amount: 0,
        reference: '',
        paymentMethod: 'cash',
        account: 'Business Account'
      });
      setEditingTransaction(null);
      setShowAddModal(false);
      
      // Refresh the transactions list and KPI data
      handleRefresh();
      
      // Show success message
      alert(`Transaction ${isEditing ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      console.error(`Error ${editingTransaction ? 'updating' : 'creating'} transaction:`, err);
      alert(`Failed to ${editingTransaction ? 'update' : 'create'} transaction: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header with actions */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px 16px', backgroundColor: 'var(--mc-sidebar-bg)', color: 'white',
              border: 'none', borderRadius: '20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
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
            value: kpiData.totalRevenue,
            color: '#10b981', 
            bg: '#ecfdf5', 
            icon: TrendingUp,
            change: `${kpiData.revenueChange >= 0 ? '+' : ''}${kpiData.revenueChange.toFixed(1)}%`,
            changeType: kpiData.revenueChange >= 0 ? 'positive' : 'negative'
          },
          { 
            label: 'Total Expenses', 
            value: kpiData.totalExpenses,
            color: '#ef4444', 
            bg: '#fee2e2', 
            icon: TrendingDown,
            change: `${kpiData.expensesChange >= 0 ? '+' : ''}${kpiData.expensesChange.toFixed(1)}%`,
            changeType: kpiData.expensesChange >= 0 ? 'negative' : 'positive'
          },
          { 
            label: 'Net Profit', 
            value: kpiData.netIncome,
            color: '#3b82f6', 
            bg: '#dbeafe', 
            icon: BarChart3,
            change: `${kpiData.profitChange >= 0 ? '+' : ''}${kpiData.profitChange.toFixed(1)}%`,
            changeType: kpiData.profitChange >= 0 ? 'positive' : 'negative'
          },
          { 
            label: 'Cash Balance', 
            value: kpiData.cashBalance,
            color: '#f59e0b', 
            bg: '#fef3c7', 
            icon: DollarSign,
            change: `${kpiData.cashChange >= 0 ? '+' : ''}${kpiData.cashChange.toFixed(1)}%`,
            changeType: kpiData.cashChange >= 0 ? 'positive' : 'negative'
          }
        ].map(k => (
          <div key={k.label} style={{
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '16px',
            border: '1px solid #f3f4f6', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            minHeight: '120px',
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
              {/* Header with icon and percentage */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ 
                  color: k.color, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <k.icon size={20} />
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '600',
                  color: k.changeType === 'positive' ? '#10b981' : '#ef4444'
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
                  {kpiLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw size={16} className="animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    formatPrice(k.value)
                  )}
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
        {[
          { id: 'transactions', label: 'Transactions', icon: Receipt },
          { id: 'accounting', label: 'Accounting', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
              padding: '12px 20px',
              backgroundColor: activeTab === (tab.id as any) ? '#1f2937' : 'transparent',
              color: activeTab === (tab.id as any) ? 'white' : '#6b7280',
              border: 'none',
              fontSize: '14px',
              fontWeight: activeTab === (tab.id as any) ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === (tab.id as any) ? '0 4px 8px rgba(31, 41, 55, 0.2)' : 'none',
              transform: activeTab === (tab.id as any) ? 'translateY(-1px)' : 'translateY(0)'
            }}
          >
            <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
      </div>

      {/* Tab content */}
      {activeTab === 'transactions' && <Transactions key={refreshKey} onRefresh={handleRefresh} onEditTransaction={handleEditTransaction} />}
      {activeTab === 'accounting' && <Accounting />}

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
            borderRadius: '20px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTransaction(null);
                  setNewTransaction({ description: '', type: 'revenue', category: '', amount: 0, reference: '', paymentMethod: 'cash', account: 'Business Account' });
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
                    borderRadius: '20px',
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
                    onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value, category: ''})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
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
                    Category (Optional)
                  </label>
                  <CategoryInput
                    value={newTransaction.category}
                    onChange={(value) => setNewTransaction({...newTransaction, category: value})}
                    placeholder="Select or type category (optional)..."
                    transactionType={newTransaction.type}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Amount *
                  </label>
                  <input
                    type="text"
                    value={newTransaction.amount === 0 ? '' : newTransaction.amount.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Simple: just update the state with whatever they type
                      setNewTransaction({...newTransaction, amount: Number(value) || 0});
                    }}
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
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
                      borderRadius: '20px',
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
                    borderRadius: '20px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Card</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Account
                </label>
                <input
                  type="text"
                  value={newTransaction.account}
                  onChange={(e) => setNewTransaction({...newTransaction, account: e.target.value})}
                  placeholder="e.g., Business Account"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTransaction(null);
                    setNewTransaction({ description: '', type: 'revenue', category: '', amount: 0, reference: '', paymentMethod: 'cash', account: 'Business Account' });
                  }}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
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
                  onClick={handleCreateTransaction}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '20px',
                    background: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                </button>
        </div>
        </div>
        </div>
        </div>
      )}

    </div>
  );
}
















