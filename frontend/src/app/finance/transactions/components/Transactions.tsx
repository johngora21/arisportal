'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { buildApiUrl } from '../../../../config/api';

interface Transaction {
  transaction_id: string;
  transaction_date: string;
  description: string;
  type: 'REVENUE' | 'EXPENSE' | 'ASSET' | 'LIABILITY' | 'EQUITY' | 'TRANSFER' | 'REVERSAL' | 'OTHER';
  category: string | null;
  amount: number;
  payment_method: 'CASH' | 'BANK' | 'CARD' | 'MOBILE_MONEY' | 'OTHER';
  reference: string | null;
  account: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string | null;
}

interface TransactionsProps {
  onRefresh?: () => void;
  onEditTransaction?: (transaction: Transaction) => void;
}

function Transactions({ onRefresh, onEditTransaction }: TransactionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timePeriod, setTimePeriod] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = buildApiUrl('/transactions/');
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }
      
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  // Delete transaction
  const deleteTransaction = async (transactionId: string) => {
    try {
      const url = buildApiUrl(`/transactions/${transactionId}`);
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete transaction: ${response.status}`);
      }
      
      // Refresh the transactions list
      await fetchTransactions();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
    }
  };

  // Load transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);


  const getPaymentMethodColor = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'cash': return { bg: '#fef3c7', color: '#f59e0b' };
      case 'bank': return { bg: '#dbeafe', color: '#3b82f6' };
      case 'card': return { bg: '#e0e7ff', color: '#6366f1' };
      case 'mobile_money': return { bg: '#f0fdf4', color: '#22c55e' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
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
                         (transaction.reference && transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || transaction.type.toLowerCase() === typeFilter.toLowerCase();
    
    // Time period filtering
    const transactionDate = new Date(transaction.transaction_date);
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
      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#dc2626',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

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
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <RefreshCw size={16} className="animate-spin" />
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.transaction_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                        {transaction.description}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {transaction.reference || 'No reference'} • {transaction.account || 'No account'}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                        fontSize: '14px',
                      fontWeight: '500',
                        color: '#374151'
                    }}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                        color: transaction.type.toLowerCase() === 'expense' ? '#ef4444' : '#6b7280'
                    }}>
                        {transaction.type.toLowerCase() === 'expense' ? '-' : ''}
                      {formatPrice(transaction.amount)}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#6b7280'
                    }}>
                        {transaction.payment_method.charAt(0).toUpperCase() + transaction.payment_method.slice(1).toLowerCase().replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {formatDate(transaction.transaction_date)}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => onEditTransaction && onEditTransaction(transaction)}
                        style={{
                          padding: '6px',
                          border: 'none',
                          borderRadius: '20px',
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit size={16} />
                      </button>
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this transaction?')) {
                              deleteTransaction(transaction.transaction_id);
                            }
                          }}
                          style={{
                        padding: '6px',
                        border: 'none',
                            backgroundColor: 'transparent',
                        color: '#ef4444',
                        cursor: 'pointer'
                          }}
                        >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
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
