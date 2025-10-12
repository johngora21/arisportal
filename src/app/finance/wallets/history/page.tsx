'use client';

import React, { useState } from 'react';
import { 
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building,
  Smartphone,
  Wallet
} from 'lucide-react';

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('30');

  // Mock transaction data
  const transactions = [
    {
      id: '1',
      type: 'transfer',
      status: 'completed',
      description: 'Monthly savings transfer',
      from: 'Main Wallet',
      to: 'Savings Wallet',
      amount: -500000,
      date: '2024-01-15T13:30:00Z',
      icon: ArrowDownLeft,
      iconColor: '#059669'
    },
    {
      id: '2',
      type: 'topup',
      status: 'completed',
      description: 'Business capital top-up',
      from: 'Bank Transfer',
      to: 'Business Wallet',
      amount: 2000000,
      date: '2024-01-14T17:20:00Z',
      icon: ArrowUpRight,
      iconColor: '#059669'
    },
    {
      id: '3',
      type: 'transfer',
      status: 'pending',
      description: 'Payment for services',
      from: 'Business Wallet',
      to: 'John Doe',
      amount: -750000,
      date: '2024-01-14T12:15:00Z',
      icon: ArrowDownLeft,
      iconColor: '#f59e0b'
    },
    {
      id: '4',
      type: 'cashout',
      status: 'completed',
      description: 'Cash withdrawal',
      from: 'Main Wallet',
      to: 'Bank Account',
      amount: -300000,
      date: '2024-01-13T19:45:00Z',
      icon: ArrowDownLeft,
      iconColor: '#059669'
    },
    {
      id: '5',
      type: 'topup',
      status: 'completed',
      description: 'Mobile money deposit',
      from: 'Mobile Money',
      to: 'Savings Wallet',
      amount: 150000,
      date: '2024-01-12T14:30:00Z',
      icon: ArrowUpRight,
      iconColor: '#059669'
    },
    {
      id: '6',
      type: 'transfer',
      status: 'completed',
      description: 'Emergency fund transfer',
      from: 'Savings Wallet',
      to: 'Main Wallet',
      amount: -200000,
      date: '2024-01-11T11:20:00Z',
      icon: ArrowDownLeft,
      iconColor: '#059669'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { color: '#059669', backgroundColor: '#dcfce7' };
      case 'pending':
        return { color: '#d97706', backgroundColor: '#fef3c7' };
      case 'failed':
        return { color: '#dc2626', backgroundColor: '#fee2e2' };
      default:
        return { color: '#6b7280', backgroundColor: '#f3f4f6' };
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.to.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
          Transaction History
        </h2>
        
        {/* Period Dropdown */}
        <div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '12px 20px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              backgroundColor: 'white',
              minWidth: '150px'
            }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
          All Transactions ({filteredTransactions.length})
        </h3>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                borderBottom: index === filteredTransactions.length - 1 ? 'none' : '1px solid #f3f4f6',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              {/* Icon */}
              <div style={{ marginRight: '16px' }}>
                <div style={{ padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '20px' }}>
                  <transaction.icon size={20} color={transaction.iconColor} />
                </div>
              </div>

              {/* Transaction Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                      {transaction.description}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                      {transaction.from} → {transaction.to}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: transaction.amount > 0 ? '#059669' : '#dc2626',
                      marginBottom: '4px'
                    }}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </div>
                    <div style={{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '10px', 
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      ...getStatusColor(transaction.status)
                    }}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {formatDate(transaction.date)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            <Wallet size={48} color="#6b7280" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
              No transactions found
            </h3>
            <p style={{ margin: 0 }}>
              No transactions match your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}