'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useAuth } from '../../../contexts/AuthContext';
import { buildApiUrl } from '../../../config/api';

import CardsTab from './cards/page';
import TransferTab from './transfer/page';
import HistoryTab from './history/page';
import { ArrowRightLeft, CreditCard, History, Settings } from 'lucide-react';

interface Card {
  id: number;
  card_type: string;
  cardholder_name: string | null;
  card_number?: string | null;
  balance: number;
  is_active: boolean;
  is_default: boolean;
  expiry_month?: string | null;
  expiry_year?: string | null;
}

export default function WalletsPage() {
  const { formatCurrency } = useCurrency();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'cards' | 'transfer' | 'history'>('cards');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Settings state
  const [walletPin, setWalletPin] = useState('');
  const [biometricAuth, setBiometricAuth] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('biometricAuth');
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [updatingPin, setUpdatingPin] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);

  // Fetch cards when settings modal opens
  useEffect(() => {
    if (showSettingsModal && token) {
      fetchCards();
    }
  }, [showSettingsModal, token]);

  const fetchCards = async () => {
    if (!token) return;
    
    setLoadingCards(true);
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
      } else {
        console.error('Failed to fetch cards');
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleUpdatePin = async () => {
    if (!walletPin || walletPin.length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }

    setUpdatingPin(true);
    try {
      // Store PIN in localStorage (in production, this should be sent to backend)
      localStorage.setItem('walletPin', walletPin);
      alert('PIN updated successfully');
      setWalletPin('');
    } catch (error) {
      console.error('Error updating PIN:', error);
      alert('Failed to update PIN');
    } finally {
      setUpdatingPin(false);
    }
  };

  const handleBiometricToggle = () => {
    const newValue = !biometricAuth;
    setBiometricAuth(newValue);
    localStorage.setItem('biometricAuth', JSON.stringify(newValue));
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!token) return;
    
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return;
    }

    setDeletingCardId(cardId);
    try {
      const response = await fetch(buildApiUrl(`/cards/${cardId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove card from local state
        setCards((prevCards) => prevCards.filter(card => card.id !== cardId));
        alert('Card deleted successfully');
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to delete card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card');
    } finally {
      setDeletingCardId(null);
    }
  };

  const handleSetDefaultCard = async (cardId: number) => {
    if (!token) return;

    setSettingDefaultId(cardId);
    try {
      const response = await fetch(buildApiUrl(`/cards/${cardId}/default`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setCards((prevCards) => prevCards.map((card) => ({
          ...card,
          is_default: card.id === cardId,
        })));
        alert('Default card updated');
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to set default card');
      }
    } catch (error) {
      console.error('Error setting default card:', error);
      alert('Failed to set default card');
    } finally {
      setSettingDefaultId(null);
    }
  };

  const formatCardNumber = (cardNumber: string | null | undefined): string => {
    if (!cardNumber) return '';
    const digitsOnly = cardNumber.replace(/\D/g, '');
    if (digitsOnly.length === 0) return '';

    let formattedNumber = digitsOnly;
    if (formattedNumber.length < 16) {
      formattedNumber = formattedNumber.padEnd(16, '0');
    } else if (formattedNumber.length > 16) {
      formattedNumber = formattedNumber.substring(0, 16);
    }

    return formattedNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cards':
        return <CardsTab />;

      case 'transfer':
        return <TransferTab />;

      case 'history':
        return <HistoryTab />;

      default:
  return null;
}

  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              My Wallet
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage your funds, top up, cash out, and transfer money
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowSettingsModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Settings size={16} />
              Settings
            </button>
          </div>
        </div>
      </div>


      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[

          { id: 'cards', label: 'Cards', icon: <CreditCard size={16} /> },
          { id: 'transfer', label: 'Transfer', icon: <ArrowRightLeft size={16} /> },
          { id: 'history', label: 'History', icon: <History size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'var(--mc-sidebar-bg)' : 'white',
              color: activeTab === tab.id ? 'white' : '#6b7280',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {renderTabContent()}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
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
            padding: '32px',
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Wallet Settings
              </h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {/* PIN/Password Management */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                PIN/Password Management
              </h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Wallet PIN
                </label>
                <input
                  type="password"
                  value={walletPin}
                  onChange={(e) => setWalletPin(e.target.value)}
                  placeholder="Enter new PIN"
                  style={{
                    width: '350px',
                    padding: '12px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <button
                onClick={handleUpdatePin}
                disabled={updatingPin || !walletPin}
                style={{
                  padding: '10px 20px',
                  backgroundColor: updatingPin || !walletPin ? '#d1d5db' : 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: updatingPin || !walletPin ? 'not-allowed' : 'pointer',
                  opacity: updatingPin || !walletPin ? 0.6 : 1
                }}
              >
                {updatingPin ? 'Updating...' : 'Update PIN'}
              </button>
            </div>

            {/* Biometric Authentication */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                Biometric Authentication
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Enable fingerprint/face ID</span>
                <button
                  onClick={handleBiometricToggle}
                  style={{
                    width: '48px',
                    height: '24px',
                    backgroundColor: biometricAuth ? 'var(--mc-sidebar-bg)' : '#d1d5db',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: biometricAuth ? '26px' : '2px',
                    transition: 'all 0.2s ease'
                  }} />
                </button>
              </div>
            </div>

            {/* Card Management */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                Card Management
              </h3>
              {loadingCards ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  Loading cards...
                </div>
              ) : cards.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  No cards found
                </div>
              ) : (
                cards.map((card) => {
                const hasBalance = card.balance > 0;
                  const isDefault = card.is_default;
                  const cardName = card.cardholder_name || `${card.card_type.charAt(0).toUpperCase() + card.card_type.slice(1)} Card`;
                return (
                  <div key={card.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                            {cardName}
                          </div>
                          {isDefault && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#2563eb',
                              backgroundColor: '#dbeafe',
                              padding: '2px 8px',
                              borderRadius: '999px'
                            }}>
                              Default
                            </span>
                          )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {formatCardNumber(card.card_number)}
                      </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Balance: {formatCurrency(card.balance)}
                      </div>
                    </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!isDefault && (
                    <button
                            onClick={() => handleSetDefaultCard(card.id)}
                            disabled={settingDefaultId === card.id}
                            style={{
                              padding: '6px 14px',
                              backgroundColor: '#2563eb',
                              color: 'white',
                              border: 'none',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: settingDefaultId === card.id ? 'not-allowed' : 'pointer',
                              opacity: settingDefaultId === card.id ? 0.7 : 1
                            }}
                          >
                            {settingDefaultId === card.id ? 'Setting...' : 'Set as default'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          disabled={hasBalance || deletingCardId === card.id}
                      style={{
                        padding: '6px 16px',
                            backgroundColor: hasBalance || deletingCardId === card.id ? '#d1d5db' : '#EF4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                            cursor: hasBalance || deletingCardId === card.id ? 'not-allowed' : 'pointer',
                            opacity: hasBalance || deletingCardId === card.id ? 0.6 : 1
                      }}
                    >
                          {deletingCardId === card.id ? 'Deleting...' : 'Delete'}
                    </button>
                      </div>
                  </div>
                );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}