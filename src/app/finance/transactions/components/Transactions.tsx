'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity' | 'transfer' | 'reversal' | 'other';
  category: string;
  amount: number;
  paymentMethod: 'cash' | 'bank';
  reference: string;
  account: string;
}

interface TransactionsProps {
  // Add any props you need for the transactions component
}

function Transactions({}: TransactionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timePeriod, setTimePeriod] = useState('all');

  const formatPrice = (value: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', 
    currency: 'TZS', 
    minimumFractionDigits: 0
  }).format(value);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Sample transaction data
  const transactions: Transaction[] = [
    {
      id: 'TXN001',
      date: '2024-01-15',
      description: 'Client Payment - Project Alpha',
      type: 'revenue',
      category: 'Services',
      amount: 750000,
      paymentMethod: 'bank',
      reference: 'INV-2024-001',
      account: 'Business Account'
    },
    {
      id: 'TXN002',
      date: '2024-01-14',
      description: 'Office Rent Payment',
      type: 'expense',
      category: 'Rent',
      amount: 250000,
      paymentMethod: 'bank',
      reference: 'RENT-001',
      account: 'Business Account'
    },
    {
      id: 'TXN003',
      date: '2024-01-13',
      description: 'Software License Renewal',
      type: 'expense',
      category: 'Software',
      amount: 120000,
      paymentMethod: 'cash',
      reference: 'SOFT-2024',
      account: 'Business Account'
    },
    {
      id: 'TXN004',
      date: '2024-01-12',
      description: 'Bank Transfer to Savings',
      type: 'transfer',
      category: 'Transfer',
      amount: 500000,
      paymentMethod: 'bank',
      reference: 'TRF-001',
      account: 'Savings Account'
    },
    {
      id: 'TXN005',
      date: '2024-01-11',
      description: 'Equipment Purchase',
      type: 'asset',
      category: 'Equipment',
      amount: 180000,
      paymentMethod: 'bank',
      reference: 'EQ-001',
      account: 'Business Account'
    },
    {
      id: 'TXN006',
      date: '2024-01-10',
      description: 'Client Payment - Project Beta',
      type: 'revenue',
      category: 'Services',
      amount: 450000,
      paymentMethod: 'bank',
      reference: 'INV-2024-002',
      account: 'Business Account'
    },
    {
      id: 'TXN007',
      date: '2024-01-09',
      description: 'Employee Salary Payment',
      type: 'expense',
      category: 'Payroll',
      amount: 320000,
      paymentMethod: 'bank',
      reference: 'PAY-001',
      account: 'Business Account'
    },
    {
      id: 'TXN008',
      date: '2024-01-08',
      description: 'Bank Loan Disbursement',
      type: 'liability',
      category: 'Financing',
      amount: 2000000,
      paymentMethod: 'bank',
      reference: 'LOAN-001',
      account: 'Business Account'
    },
    {
      id: 'TXN009',
      date: '2024-01-07',
      description: 'Marketing Campaign Payment',
      type: 'expense',
      category: 'Marketing',
      amount: 85000,
      paymentMethod: 'cash',
      reference: 'MKT-001',
      account: 'Business Account'
    },
    {
      id: 'TXN010',
      date: '2024-01-06',
      description: 'Interest Earned on Savings',
      type: 'revenue',
      category: 'Investment',
      amount: 15000,
      paymentMethod: 'bank',
      reference: 'INT-001',
      account: 'Savings Account'
    }
  ];


  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return { bg: '#fef3c7', color: '#f59e0b' };
      case 'bank': return { bg: '#dbeafe', color: '#3b82f6' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revenue': return '#10b981';      // Green - Income/Revenue
      case 'expense': return '#ef4444';      // Red - Expenses
      case 'asset': return '#3b82f6';        // Blue - Assets
      case 'liability': return '#f59e0b';    // Orange - Liabilities
      case 'equity': return '#8b5cf6';       // Purple - Equity
      case 'transfer': return '#06b6d4';     // Cyan - Transfers
      case 'reversal': return '#dc2626';     // Dark Red - Reversals
      case 'other': return '#6b7280';        // Gray - Other
      default: return '#6b7280';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    // Time period filtering
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    const matchesTimePeriod = (() => {
      switch (timePeriod) {
        case 'all': return true;
        case 'today': 
          return transactionDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        case 'month':
          return transactionDate.getMonth() === now.getMonth() && 
                 transactionDate.getFullYear() === now.getFullYear();
        case 'quarter':
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const transactionQuarter = Math.floor(transactionDate.getMonth() / 3);
          return transactionQuarter === currentQuarter && 
                 transactionDate.getFullYear() === now.getFullYear();
        case 'year':
          return transactionDate.getFullYear() === now.getFullYear();
        case 'last_month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          return transactionDate.getMonth() === lastMonth.getMonth() && 
                 transactionDate.getFullYear() === lastMonth.getFullYear();
        case 'last_quarter':
          const lastQuarter = Math.floor((now.getMonth() - 3) / 3);
          const lastQuarterYear = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
          const transactionLastQuarter = Math.floor(transactionDate.getMonth() / 3);
          return transactionLastQuarter === (lastQuarter < 0 ? 3 : lastQuarter) && 
                 transactionDate.getFullYear() === lastQuarterYear;
        case 'last_year':
          return transactionDate.getFullYear() === now.getFullYear() - 1;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesType && matchesTimePeriod;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search and Filters */}
      <div style={{
        position: 'relative',
        height: '40px',
        marginBottom: '24px'
      }}>
        {/* Search Bar - positioned from right */}
        <div style={{ 
          position: 'absolute',
          right: '480px',
          top: '0px',
          width: '300px'
        }}>
          <Search style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            width: '16px',
            height: '20px'
          }} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s ease',
              backgroundColor: 'white'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--mc-sidebar-bg)';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        
        {/* Time Period Filter - positioned from right */}
        <div style={{
          position: 'absolute',
          right: '250px',
          top: '0px'
        }}>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              background: 'white',
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
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="last_month">Last Month</option>
            <option value="last_quarter">Last Quarter</option>
            <option value="last_year">Last Year</option>
          </select>
        </div>
        
        {/* Type Filter - positioned from right */}
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '0px'
        }}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              background: 'white',
              width: '220px',
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
            <option value="all">All Types</option>
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
      </div>

      {/* Transactions Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Transaction
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Type
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Amount
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Payment Method
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Date
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                        {transaction.description}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {transaction.reference} • {transaction.account}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: getTypeColor(transaction.type) + '20',
                      color: getTypeColor(transaction.type)
                    }}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: transaction.type === 'expense' ? '#ef4444' : '#6b7280'
                    }}>
                      {transaction.type === 'expense' ? '-' : ''}
                      {formatPrice(transaction.amount)}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#6b7280'
                    }}>
                      {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {formatDate(transaction.date)}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        padding: '6px',
                        border: 'none',
                        borderRadius: '20px',
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        cursor: 'pointer'
                      }}>
                        <Edit size={16} />
                      </button>
                      <button style={{
                        padding: '6px',
                        border: 'none',
                        borderRadius: '20px',
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #f3f4f6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Previous
            </button>
            <button style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              backgroundColor: 'var(--mc-sidebar-bg-hover)',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              1
            </button>
            <button style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
