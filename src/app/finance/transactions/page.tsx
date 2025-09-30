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

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'accounting' | 'cashflow' | 'revenue' | 'reports'>('dashboard');
  const [auditTab, setAuditTab] = useState<'documents' | 'statements' | 'analysis'>('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterType, setFilterType] = useState<string>('all');

  const formatPrice = (v: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', currency: 'TZS', minimumFractionDigits: 0
  }).format(v);

  // Mock data for audit functionality
  interface Document {
    id: string;
    name: string;
    type: 'receipt' | 'invoice' | 'statement' | 'transaction';
    date: string;
    amount: number;
    status: 'pending' | 'processed' | 'error';
    uploadedAt: string;
  }

  interface FinancialStatement {
    id: string;
    name: string;
    period: string;
    generatedAt: string;
    status: 'ready' | 'processing' | 'error';
  }

  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Q3 Bank Statement.pdf',
      type: 'statement',
      date: '2024-09-30',
      amount: 125000,
      status: 'processed',
      uploadedAt: '2024-10-01'
    },
    {
      id: '2',
      name: 'Office Rent Receipt.pdf',
      type: 'receipt',
      date: '2024-10-01',
      amount: 5000,
      status: 'processed',
      uploadedAt: '2024-10-02'
    },
    {
      id: '3',
      name: 'Client Invoice #1234.pdf',
      type: 'invoice',
      date: '2024-10-05',
      amount: 15000,
      status: 'pending',
      uploadedAt: '2024-10-06'
    },
    {
      id: '4',
      name: 'Vendor Payment Receipt.pdf',
      type: 'receipt',
      date: '2024-10-08',
      amount: 2500,
      status: 'error',
      uploadedAt: '2024-10-09'
    }
  ];

  const mockStatements: FinancialStatement[] = [
    {
      id: '1',
      name: 'Income Statement Q3 2024',
      period: 'Q3 2024',
      generatedAt: '2024-10-01',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Balance Sheet Q3 2024',
      period: 'Q3 2024',
      generatedAt: '2024-10-01',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Cash Flow Statement Q3 2024',
      period: 'Q3 2024',
      generatedAt: '2024-10-01',
      status: 'processing'
    }
  ];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return { color: '#10b981', bg: '#d1fae5' };
      case 'pending': return { color: '#f59e0b', bg: '#fef3c7' };
      case 'error': return { color: '#ef4444', bg: '#fee2e2' };
      default: return { color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'receipt': return <Receipt size={16} />;
      case 'invoice': return <FileText size={16} />;
      case 'statement': return <Building size={16} />;
      case 'transaction': return <DollarSign size={16} />;
      default: return <FileText size={16} />;
    }
  };

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
            style={{
              padding: '10px 14px', backgroundColor: 'white', color: '#0f172a',
              border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Plus size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Add Transaction
          </button>
          <button
            style={{
              padding: '10px 14px', backgroundColor: '#0f172a', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Plus size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Make Payment
          </button>
        </div>
      </div>

      {/* KPI Cards (visible on all tabs) */}
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '24px' }}>
        {[
          { label: 'Total Revenue', color: '#10b981', bg: '#ecfdf5', icon: '$' },
          { label: 'Total Expenses', color: '#ef4444', bg: '#fee2e2', icon: 'R' },
          { label: 'Net Profit', color: '#3b82f6', bg: '#dbeafe', icon: 'P' },
          { label: 'Cash Balance', color: '#f59e0b', bg: '#fef3c7', icon: 'C' }
        ].map(k => (
          <div key={k.label} style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minHeight: '140px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{k.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '8px' }}>{formatPrice(0)}</div>
              </div>
              <div style={{ backgroundColor: k.bg, color: k.color, borderRadius: '10px', padding: '12px 14px', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>{k.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs (Dashboard, Transactions, Accounting, Cash Flow, Revenue, Reports) */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '24px' }}>
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
                padding: '14px 12px', backgroundColor: activeTab === (tab.id as any) ? '#0f172a' : 'transparent',
                color: activeTab === (tab.id as any) ? 'white' : '#6b7280', border: 'none', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content placeholders (no extra iris-unapproved UI) */}
      {activeTab === 'accounting' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Accounting</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Accounting period, statements, and journal entries will appear here.</div>
        </div>
      )}
      {activeTab === 'cashflow' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Cash Flow</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Cash flow statements and breakdowns will appear here.</div>
        </div>
      )}
      {activeTab === 'revenue' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Revenue</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Revenue analytics and sources will appear here.</div>
        </div>
      )}
      {activeTab === 'reports' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Reports</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Financial reports and exports will appear here.</div>
        </div>
      )}


      {/* Transaction History */}
      <div style={{
        backgroundColor: 'white', borderRadius: '12px', padding: '24px',
        border: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Transaction History
        </h3>
        <div style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '40px' }}>
          Transaction history and reporting features will be implemented here
        </div>
      </div>
    </div>
  );
}
















