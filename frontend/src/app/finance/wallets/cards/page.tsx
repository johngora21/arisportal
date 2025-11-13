'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ArrowLeft,
  Eye,
  EyeOff,
  CreditCard,
  X,
  Copy,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { buildApiUrl } from '../../../../config/api';

interface Card {
  id: number;
  card_type: string;
  last_four: string;
  card_number?: string | null;  // Full formatted card number (control number for top-ups)
  cardholder_name: string | null;
  balance: number;
  is_active: boolean;
  is_default: boolean;
  expiry_month?: string | null;
  expiry_year?: string | null;
}

export default function CardsPage() {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const { token } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardBalanceVisibility, setCardBalanceVisibility] = useState<Record<number, boolean>>({});
  const [showAllBalances, setShowAllBalances] = useState(true); // Global toggle for all balances
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  
  // Create card form state
  const [cardName, setCardName] = useState('');
  const [cardType, setCardType] = useState('business');

  // Format card number for display: 16 digits in groups of 4 (e.g., "1234 5678 9012 3456")
  // This is for card display only, not changing the actual control number
  const formatCardNumberForDisplay = (cardNumber: string | null | undefined): string => {
    if (!cardNumber) return '';
    
    // Remove any existing spaces or non-digits
    const digitsOnly = cardNumber.replace(/\D/g, '');
    
    // Pad to 16 digits if shorter, or truncate to 16 if longer
    let formattedNumber = digitsOnly;
    if (formattedNumber.length < 16) {
      // Pad with zeros at the end to make it 16 digits
      formattedNumber = formattedNumber.padEnd(16, '0');
    } else if (formattedNumber.length > 16) {
      // Take first 16 digits
      formattedNumber = formattedNumber.substring(0, 16);
    }
    
    // Format in groups of 4: "XXXX XXXX XXXX XXXX"
    return formattedNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  // Silently sync payments in the background (no UI feedback, automatic)
  const syncPaymentsSilently = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(buildApiUrl('/cards/sync-payments'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Always refresh cards after sync to show updated balances (even if synced_count is 0)
        // Use skip_reconcile=true here because the sync endpoint already updated the ledger
        const cardsResponse = await fetch(buildApiUrl('/cards?skip_reconcile=true'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (cardsResponse.ok) {
          const cardsData = await cardsResponse.json();
          setCards(cardsData || []);
        }
      }
    } catch (err: any) {
      // Silently fail - webhook will handle real-time updates
      console.error('Background sync error (ignored):', err);
    }
  };

  // Fetch cards from API
  useEffect(() => {
    const fetchCards = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 15000); // 15 second timeout

        let response;
        try {
          response = await fetch(buildApiUrl('/cards?skip_reconcile=true'), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal
          });
        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            throw new Error('Request timed out. The server may be slow or not responding.');
          }
          throw fetchError;
        }

        clearTimeout(timeoutId);

        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          router.push('/authentication/login');
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`Failed to fetch cards: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setCards(data || []);
        setError(null);
        
        // Initialize visibility state for all cards based on global toggle
        const visibilityState: Record<number, boolean> = {};
        (data || []).forEach((card: Card) => {
          visibilityState[card.id] = showAllBalances;
        });
        setCardBalanceVisibility(visibilityState);
        
        // Automatically sync payments in the background (silently)
        if (data && data.length > 0) {
          syncPaymentsSilently();
        }
      } catch (err: any) {
        console.error('Error fetching cards:', err);
        if (err.name === 'AbortError' || err.message?.includes('timed out')) {
          setError('Request timed out. The server may be slow or the backend needs to be restarted. Please check if the backend is running.');
        } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
          setError('Cannot connect to server. Please make sure the backend is running.');
        } else if (err.message?.includes('404')) {
          setError('Cards endpoint not found. The backend may need to be restarted to register the cards router.');
        } else {
          setError(err.message || 'Failed to load cards. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [token, router]);

  // Helper to get card display name
  const getCardDisplayName = (card: Card): string => {
    if (card.cardholder_name) {
      return card.cardholder_name;
    }
    return `Card ${card.last_four || card.id}`;
  };

  // Handle create card
  const handleCreateCard = async () => {
    if (!token) {
      setCreateError('Please login to create a card');
      return;
    }

    if (!cardName.trim()) {
      setCreateError('Card name is required');
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      const response = await fetch(buildApiUrl('/cards'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_type: cardType,
          cardholder_name: cardName.trim()
          // last_four will be auto-generated by backend
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        router.push('/authentication/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create card');
      }

      const newCard = await response.json();
      
      // Refresh cards list
      const cardsResponse = await fetch(buildApiUrl('/cards'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (cardsResponse.ok) {
        const updatedCards = await cardsResponse.json();
        setCards(updatedCards);
        
        // Initialize visibility for new card
        setCardBalanceVisibility(prev => ({
          ...prev,
          [newCard.id]: true
        }));
      }

      // Close modal and reset form
      setShowCreateModal(false);
      setCardName('');
      setCardType('business');
      setCreateError(null);
    } catch (err: any) {
      console.error('Error creating card:', err);
      setCreateError(err.message || 'Failed to create card. Please try again.');
    } finally {
      setCreating(false);
    }
  };


  if (loading) {
    return (
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center' 
      }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid var(--mc-sidebar-bg)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }} />
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          margin: 0
        }}>
          Loading your cards...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center' 
      }}>
        <p style={{ 
          fontSize: '14px', 
          color: '#ef4444',
          marginBottom: '16px'
        }}>
          {error}
        </p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            // Trigger refetch by updating dependency
            window.location.reload();
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--mc-sidebar-bg)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          My Cards
        </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div
              onClick={() => {
                const newVisibility = !showAllBalances;
                setShowAllBalances(newVisibility);
                // Update all card balances visibility
                const visibilityState: Record<number, boolean> = {};
                cards.forEach((card: Card) => {
                  visibilityState[card.id] = newVisibility;
                });
                setCardBalanceVisibility(visibilityState);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#1f2937';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              {showAllBalances ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
        <button
              onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'var(--mc-sidebar-bg-hover)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
          }}
        >
          <Plus size={16} />
          Add Card
        </button>
          </div>
        </div>
      </div>

      {/* Create Card Modal */}
      {showCreateModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
              setCardName('');
              setCardType('business');
              setCreateError(null);
            }
          }}
          style={{
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
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Create New Card
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCardName('');
                  setCardType('business');
                  setCreateError(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Card Type */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Card Type
                </label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                  disabled={creating}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: creating ? '#f3f4f6' : 'white',
                    cursor: creating ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="business">Business Card</option>
                  <option value="personal">Personal Card</option>
                  <option value="savings">Savings Card</option>
                </select>
              </div>

              {/* Card Name */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Card Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder={
                    cardType === 'business' ? 'e.g., Main Business Card, Operations Card' :
                    cardType === 'personal' ? 'e.g., Personal Card, Daily Expenses' :
                    cardType === 'savings' ? 'e.g., Savings Account, Emergency Fund' :
                    'Enter card name'
                  }
                  disabled={creating}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: creating ? '#f3f4f6' : 'white'
                  }}
                />
              </div>

              {/* Error Message */}
              {createError && (
            <div style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  {createError}
                </div>
              )}

              {/* Modal Footer */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCardName('');
                    setCardType('business');
                    setCreateError(null);
                  }}
                  disabled={creating}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: creating ? 'not-allowed' : 'pointer',
                    opacity: creating ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCard}
                  disabled={creating || !cardName.trim()}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: creating || !cardName.trim() ? '#d1d5db' : 'var(--mc-sidebar-bg-hover)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: creating || !cardName.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {creating ? 'Creating...' : 'Create Card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {cards.length === 0 ? (
            <div style={{
          padding: '60px 20px', 
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '2px dashed #e5e7eb'
        }}>
          <CreditCard size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 8px' }}>
            No cards yet
          </p>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Add your first card to get started
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
        {cards.map((card) => {
          const expiryDate = card.expiry_month && card.expiry_year 
            ? `${card.expiry_month}/${card.expiry_year.slice(-2)}`
            : 'N/A';

          // Get card theme using system colors - real debit card style
          const getCardTheme = (cardType: string, isActive: boolean) => {
            // System theme colors
            const systemBg = '#1f2937'; // --mc-sidebar-bg  
            const systemHover = '#334155'; // --mc-sidebar-bg-hover
            const accent = '#fbbf24'; // --mc-accent
            
            if (!isActive) {
              return {
                background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                patternColor: 'rgba(0, 0, 0, 0.05)'
              };
            }
            
            // Use system theme colors - balanced brightness
            return {
              background: `linear-gradient(135deg, ${systemBg} 0%, ${systemHover} 100%)`,
              patternColor: `rgba(251, 191, 36, 0.2)`
            };
          };

          const cardTheme = getCardTheme(card.card_type || '', card.is_active);

          return (
            <div
              key={card.id}
              style={{
                position: 'relative',
                height: '220px',
                borderRadius: '16px',
                background: cardTheme.background,
                padding: '24px',
                color: 'white',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Natural shadows and highlights for depth - visible but not colored */}
              {/* Top light reflection - larger area */}
              <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-15%',
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.08) 40%, rgba(255, 255, 255, 0.03) 70%, transparent 100%)',
                zIndex: 0,
                filter: 'blur(40px)'
              }} />
              
              {/* Middle-left shadow area */}
              <div style={{
                position: 'absolute',
                top: '25%',
                left: '-8%',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 80%)',
                zIndex: 0,
                filter: 'blur(35px)'
              }} />
              
              {/* Bottom-right shadow area */}
            <div style={{
              position: 'absolute',
                bottom: '-8%',
                right: '8%',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 0, 0, 0.18) 0%, transparent 70%)',
                zIndex: 0,
                filter: 'blur(32px)'
              }} />
              
              {/* Gradient overlay for depth */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, transparent 50%, rgba(0, 0, 0, 0.08) 100%)',
                zIndex: 0
              }} />

              {/* Card Content */}
              <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Top Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: '500'
                    }}>
                      {card.card_type?.toUpperCase() || 'CARD'}
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '600'
                    }}>
                      {card.cardholder_name || 'Card Holder'}
                    </div>
            </div>

                  {/* Active Badge - Top Right */}
            <div style={{
                    padding: '4px 10px',
                    background: card.is_active ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '600',
              textTransform: 'uppercase',
                    letterSpacing: '0.5px'
            }}>
                    {card.is_active ? 'Active' : 'Frozen'}
                  </div>
            </div>

                {/* Center Section - Card Number */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginTop: '20px',
                  marginBottom: '20px'
                }}>
                  {card.card_number && (
            <div style={{
                      fontSize: '18px',
                      color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: 'monospace',
                      letterSpacing: '2px',
                      fontWeight: '500'
            }}>
                      {formatCardNumberForDisplay(card.card_number)}
                    </div>
                  )}
            </div>

                {/* Bottom Section */}
                <div>
            {/* Balance */}
            <div style={{
                    marginBottom: '10px'
                  }}>
            <div style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '4px'
                    }}>
                      Balance
            </div>
            <div style={{
                      fontSize: '20px',
                      fontWeight: '700'
                    }}>
                      {cardBalanceVisibility[card.id] ? formatCurrency(card.balance) : '••••••'}
                    </div>
            </div>

                  {/* Expiry Date - Bottom Right */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ textAlign: 'right' }}>
            <div style={{
                        fontSize: '9px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '2px'
                      }}>
                        Expires
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}>
                        {expiryDate}
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
