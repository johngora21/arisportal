'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Building,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Settings,
  Plus
} from 'lucide-react';

interface FinancialStatement {
  id: string;
  name: string;
  type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'trial_balance';
  period: string;
  generatedAt: string;
  status: 'ready' | 'processing' | 'error';
  size: string;
}

interface AccountingProps {
  // Add any props you need for the accounting component
}

export default function Accounting({}: AccountingProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [statementType, setStatementType] = useState('income_statement');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (value: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', 
    currency: 'TZS', 
    minimumFractionDigits: 0
  }).format(value);

  // Sample financial statements data
  const financialStatements: FinancialStatement[] = [
    {
      id: '1',
      name: 'Income Statement Q4 2024',
      type: 'income_statement',
      period: 'Q4 2024',
      generatedAt: '2024-01-15',
      status: 'ready',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Balance Sheet Q4 2024',
      type: 'balance_sheet',
      period: 'Q4 2024',
      generatedAt: '2024-01-15',
      status: 'ready',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Cash Flow Statement Q4 2024',
      type: 'cash_flow',
      period: 'Q4 2024',
      generatedAt: '2024-01-15',
      status: 'processing',
      size: '1.2 MB'
    },
    {
      id: '4',
      name: 'Trial Balance December 2024',
      type: 'trial_balance',
      period: 'December 2024',
      generatedAt: '2024-01-10',
      status: 'ready',
      size: '3.1 MB'
    },
    {
      id: '5',
      name: 'Income Statement Q3 2024',
      type: 'income_statement',
      period: 'Q3 2024',
      generatedAt: '2023-10-15',
      status: 'error',
      size: '2.2 MB'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle size={16} color="#10b981" />;
      case 'processing': return <Clock size={16} color="#f59e0b" />;
      case 'error': return <AlertCircle size={16} color="#ef4444" />;
      default: return <Clock size={16} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return { bg: '#d1fae5', color: '#10b981' };
      case 'processing': return { bg: '#fef3c7', color: '#f59e0b' };
      case 'error': return { bg: '#fee2e2', color: '#ef4444' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getStatementTypeLabel = (type: string) => {
    switch (type) {
      case 'income_statement': return 'Income Statement';
      case 'balance_sheet': return 'Balance Sheet';
      case 'cash_flow': return 'Cash Flow';
      case 'trial_balance': return 'Trial Balance';
      default: return type;
    }
  };

  const filteredStatements = financialStatements.filter(statement => {
    return statementType === 'all' || statement.type === statementType;
  });

  // Sample accounting metrics
  const accountingMetrics = [
    { label: 'Total Assets', value: 12500000, change: '+5.2%', color: '#3b82f6' },
    { label: 'Total Liabilities', value: 3200000, change: '+2.1%', color: '#ef4444' },
    { label: 'Owner\'s Equity', value: 9300000, change: '+7.8%', color: '#10b981' },
    { label: 'Net Income', value: 1650000, change: '+12.3%', color: '#f59e0b' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Statement Type Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setStatementType('income_statement')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: statementType === 'income_statement' ? 'var(--mc-sidebar-bg)' : 'white',
              color: statementType === 'income_statement' ? 'white' : '#6b7280',
              boxShadow: statementType === 'income_statement' ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            Income Statement
          </button>
          <button
            onClick={() => setStatementType('balance_sheet')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: statementType === 'balance_sheet' ? 'var(--mc-sidebar-bg)' : 'white',
              color: statementType === 'balance_sheet' ? 'white' : '#6b7280',
              boxShadow: statementType === 'balance_sheet' ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setStatementType('cash_flow')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: statementType === 'cash_flow' ? 'var(--mc-sidebar-bg)' : 'white',
              color: statementType === 'cash_flow' ? 'white' : '#6b7280',
              boxShadow: statementType === 'cash_flow' ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            Cash Flow Statement
          </button>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              backgroundColor: 'white',
              width: '160px',
              outline: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--mc-sidebar-bg)';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="current_month">Current Month</option>
            <option value="last_month">Last Month</option>
            <option value="current_quarter">Current Quarter</option>
            <option value="last_quarter">Last Quarter</option>
            <option value="current_year">Current Year</option>
          </select>
        </div>
      </div>

      {/* Income Statement */}
      {statementType === 'income_statement' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
            Income Statement - {selectedPeriod.replace('_', ' ').toUpperCase()}
          </h3>
          <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Revenue</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{formatPrice(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Cost of Goods Sold</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>-{formatPrice(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Gross Profit</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>{formatPrice(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Operating Expenses</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>-{formatPrice(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Operating Income</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>{formatPrice(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Interest Expense</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>-{formatPrice(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Income Tax</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>-{formatPrice(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '2px solid #e5e7eb' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>Net Income</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#10b981' }}>{formatPrice(0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Balance Sheet */}
      {statementType === 'balance_sheet' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
            Balance Sheet - {selectedPeriod.replace('_', ' ').toUpperCase()}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Assets */}
            <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>Assets</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>Cash & Cash Equivalents</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{formatPrice(18500000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>Accounts Receivable</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{formatPrice(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>Inventory</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{formatPrice(2800000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>Total Assets</span>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#10b981' }}>{formatPrice(21300000)}</span>
                </div>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>Liabilities & Equity</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>Accounts Payable</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>-{formatPrice(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>Accrued Expenses</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>-{formatPrice(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>Retained Earnings</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{formatPrice(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>Total Liabilities & Equity</span>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#10b981' }}>{formatPrice(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow Statement */}
      {statementType === 'cash_flow' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
            Cash Flow Statement - {selectedPeriod.replace('_', ' ').toUpperCase()}
          </h3>
          <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Operating Activities */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>Operating Activities</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#374151' }}>Net Income</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{formatPrice(0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#374151' }}>Depreciation & Amortization</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{formatPrice(0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>Net Cash from Operating Activities</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#10b981' }}>{formatPrice(0)}</span>
                  </div>
                </div>
              </div>

              {/* Investing Activities */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>Investing Activities</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#374151' }}>Purchase of Equipment</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>-{formatPrice(0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>Net Cash from Investing Activities</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#ef4444' }}>-{formatPrice(0)}</span>
                  </div>
                </div>
              </div>

              {/* Financing Activities */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>Financing Activities</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#374151' }}>Proceeds from Bank Loan</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{formatPrice(0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>Net Cash from Financing Activities</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#10b981' }}>{formatPrice(0)}</span>
                  </div>
                </div>
              </div>

              {/* Net Change in Cash */}
              <div style={{ paddingTop: '16px', borderTop: '2px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>Net Change in Cash</span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#10b981' }}>{formatPrice(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
