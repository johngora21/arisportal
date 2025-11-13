'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { buildApiUrl } from '../../../../config/api';
import { 
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building,
  Smartphone,
  Wallet
} from 'lucide-react';

interface Transfer {
  id: number;
  transfer_type: string;
  status: string;
  amount: number;
  currency: string;
  description?: string;
  from_card_id?: number;
  to_card_id?: number;
  recipient_name?: string;
  recipient_account?: string;
  recipient_bank?: string;
  recipient_mno?: string;
  transfer_method?: string;
  created_at: string;
}

export default function HistoryPage() {
  const { formatCurrency } = useCurrency();
  const { token, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<Array<{id: number; cardholder_name: string | null; last_four: string}>>([]);

  // Fetch cards for display names
  useEffect(() => {
    const fetchCards = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(buildApiUrl('/cards'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCards(data || []);
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    if (token) {
      fetchCards();
    }
  }, [token]);

  // Fetch transfers from API
  useEffect(() => {
    const fetchTransfers = async () => {
      if (!token || !isAuthenticated) {
        setError('Please login to view transaction history');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = buildApiUrl('/transfers');
        console.log('Fetching transfers from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401 || response.status === 403) {
          // Token might be invalid or expired - try to get detailed error
          const errorText = await response.text().catch(() => '');
          let errorMessage = 'Please login to view transaction history';
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.detail || errorMessage;
          } catch {
            if (errorText) errorMessage = errorText;
          }
          setError(errorMessage);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `Failed to fetch transfers (${response.status})`;
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.detail || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setTransfers(data || []);
      } catch (err: any) {
        console.error('Error fetching transfers:', err);
        setError(err.message || 'Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [token, isAuthenticated]);

  // Convert transfers to transaction format for display
  const getCardName = (cardId: number | null | undefined): string => {
    if (!cardId) return 'Unknown';
    const card = cards.find(c => c.id === cardId);
    if (card) {
      return card.cardholder_name || `Card ****${card.last_four}`;
    }
    return 'Unknown Card';
  };

  const getTransactionIcon = (transfer: Transfer) => {
    if (transfer.transfer_type === 'card_to_card') {
      return { icon: CreditCard, color: '#3b82f6' };
    } else if (transfer.transfer_method === 'bank') {
      return { icon: Building, color: '#059669' };
    } else if (transfer.transfer_method === 'mno') {
      return { icon: Smartphone, color: '#10b981' };
    }
    return { icon: ArrowDownLeft, color: '#6b7280' };
  };

  const getTransactionDescription = (transfer: Transfer): string => {
    if (transfer.description) {
      return transfer.description;
    }
    
    if (transfer.transfer_type === 'card_to_card') {
      return 'Card to card transfer';
    } else if (transfer.transfer_type === 'local_peer') {
      return transfer.recipient_name ? `Payment to ${transfer.recipient_name}` : 'Peer transfer';
    } else if (transfer.transfer_type === 'local_bulk') {
      return 'Bulk transfer';
    }
    return 'Transfer';
  };

  const getTransactionFromTo = (transfer: Transfer): { from: string; to: string } => {
    if (transfer.transfer_type === 'card_to_card') {
      return {
        from: getCardName(transfer.from_card_id),
        to: getCardName(transfer.to_card_id)
      };
    } else {
      const from = transfer.from_card_id ? getCardName(transfer.from_card_id) : 
                   (transfer.transfer_mode === 'clickpesa_balance' ? 'ClickPesa Balance' : 'External Source');
      const to = transfer.recipient_name || 
                 (transfer.transfer_method === 'bank' ? transfer.recipient_bank || 'Bank Account' : 
                  transfer.transfer_method === 'mno' ? transfer.recipient_mno || 'Mobile Money' : 
                  transfer.recipient_account || 'Recipient');
      return { from, to };
    }
  };

  const transactions = transfers.map(transfer => {
    const { from, to } = getTransactionFromTo(transfer);
    const { icon, color } = getTransactionIcon(transfer);
    // Amount is negative for outgoing, positive for incoming
    // For card-to-card: from_card is negative, to_card is positive
    // For peer/bulk: always negative (outgoing)
    const amount = transfer.transfer_type === 'card_to_card' ? -transfer.amount : -transfer.amount;
    
    return {
      id: transfer.id.toString(),
      type: transfer.transfer_type,
      status: transfer.status,
      description: getTransactionDescription(transfer),
      from,
      to,
      amount,
      date: transfer.created_at,
      icon,
      iconColor: color
    };
  });


  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'white', backgroundColor: '#10b981' };
      case 'pending':
        return { color: 'white', backgroundColor: '#f59e0b' };
      case 'failed':
        return { color: 'white', backgroundColor: '#ef4444' };
      default:
        return { color: 'white', backgroundColor: '#6b7280' };
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.to.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Map transfer types to filter types
    let transactionType = transaction.type;
    if (transaction.type === 'card_to_card') {
      transactionType = 'transfer';
    } else if (transaction.type === 'local_peer' || transaction.type === 'local_bulk') {
      transactionType = 'transfer';
    }
    
    const matchesType = filterType === 'all' || transactionType === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    // Date range filter
    if (dateRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      const daysAgo = parseInt(dateRange);
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      if (transactionDate < cutoffDate) {
        return false;
      }
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
        <Wallet size={48} color="#6b7280" style={{ marginBottom: '16px' }} />
        <p>Loading transaction history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }

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
            <option value="all">All time</option>
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
                (e.currentTarget as HTMLElement).style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
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
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                    </div>
                    <div style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'inline-block',
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