'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import WalletsTab from './wallets/page';
import CardsTab from './cards/page';
import TransferTab from './transfer/page';
import HistoryTab from './history/page';
import { 
  Plus, 
  Wallet,
  TrendingUp,
  DollarSign,
  Users,
  ArrowRightLeft,
  Minus,
  Building,
  Smartphone,
  CreditCard,
  History,
  Settings,
  Eye,
  EyeOff,
  Filter,
  Download
} from 'lucide-react';

export default function WalletsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'wallets' | 'cards' | 'transfer' | 'history'>('wallets');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Settings state
  const [walletPin, setWalletPin] = useState('');
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [defaultWallet, setDefaultWallet] = useState('main');
  const [currency, setCurrency] = useState('TZS');
  const [cardStatus, setCardStatus] = useState<Record<string, boolean>>({
    '1': true,
    '2': true,
    '3': true
  });
  const [walletBalanceVisibility, setWalletBalanceVisibility] = useState<Record<string, boolean>>({
    'main': true,
    'savings': true,
    'business': true
  });
  const [cardBalanceVisibility, setCardBalanceVisibility] = useState<Record<string, boolean>>({
    '1': true,
    '2': true,
    '3': true
  });
  const [selectedWallet, setSelectedWallet] = useState('main');

  // Mock data
  const wallets = [
    { id: 'main', name: 'Main Wallet', balance: 2500000, currency: 'TZS', type: 'primary', status: 'active' },
    { id: 'savings', name: 'Savings Wallet', balance: 1500000, currency: 'TZS', type: 'savings', status: 'active' },
    { id: 'business', name: 'Business Wallet', balance: 5000000, currency: 'TZS', type: 'business', status: 'active' }
  ];

  const currencies = [
    // East African currencies
    { id: 'TZS', name: 'TZS' },
    { id: 'KES', name: 'KES' },
    { id: 'UGX', name: 'UGX' },
    { id: 'RWF', name: 'RWF' },
    { id: 'BIF', name: 'BIF' },
    { id: 'DJF', name: 'DJF' },
    { id: 'ETB', name: 'ETB' },
    { id: 'SOS', name: 'SOS' },
    { id: 'SSP', name: 'SSP' },
    { id: 'ERN', name: 'ERN' },
    
    // Southern African currencies
    { id: 'ZAR', name: 'ZAR' },
    { id: 'BWP', name: 'BWP' },
    { id: 'SZL', name: 'SZL' },
    { id: 'LSL', name: 'LSL' },
    { id: 'NAD', name: 'NAD' },
    { id: 'MZN', name: 'MZN' },
    { id: 'ZMW', name: 'ZMW' },
    { id: 'ZWL', name: 'ZWL' },
    { id: 'MGA', name: 'MGA' },
    { id: 'MUR', name: 'MUR' },
    { id: 'SCR', name: 'SCR' },
    { id: 'MWK', name: 'MWK' },
    
    // Major international currencies
    { id: 'USD', name: 'USD' },
    { id: 'EUR', name: 'EUR' },
    { id: 'GBP', name: 'GBP' }
  ];

  const cards = [
    { 
      id: '1', 
      type: 'visa', 
      name: 'Visa Platinum', 
      number: '**** **** **** 4532', 
      expiry: '12/26', 
      holder: 'John Doe',
      balance: 850000,
      status: 'active',
      color: 'blue'
    },
    { 
      id: '2', 
      type: 'visa', 
      name: 'Visa Gold', 
      number: '**** **** **** 7890', 
      expiry: '08/27', 
      holder: 'John Doe',
      balance: 1200000,
      status: 'active',
      color: 'gold'
    },
    { 
      id: '3', 
      type: 'visa', 
      name: 'Visa Business', 
      number: '**** **** **** 1234', 
      expiry: '03/28', 
      holder: 'John Doe',
      balance: 2500000,
      status: 'active',
      color: 'green'
    }
  ];

  const recentTransactions = [
    { id: '1', type: 'topup', amount: 500000, description: 'Top-up via M-Pesa', date: '2025-01-15', status: 'completed', method: 'mobile' },
    { id: '2', type: 'transfer', amount: -250000, description: 'Transfer to John Doe', date: '2025-01-14', status: 'completed', method: 'wallet' },
    { id: '3', type: 'cashout', amount: -100000, description: 'Cashout to Bank Account', date: '2025-01-13', status: 'pending', method: 'bank' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTotalBalance = () => {
    return wallets.reduce((total, wallet) => total + wallet.balance, 0);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup': return <Plus size={20} color="#10b981" />;
      case 'cashout': return <Minus size={20} color="#ef4444" />;
      case 'transfer': return <ArrowRightLeft size={20} color="#3b82f6" />;
      default: return <DollarSign size={20} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { color: '#10b981', backgroundColor: '#f0fdf4' };
      case 'pending': return { color: '#f59e0b', backgroundColor: '#fffbeb' };
      case 'failed': return { color: '#ef4444', backgroundColor: '#fef2f2' };
      default: return { color: '#6b7280', backgroundColor: '#f9fafb' };
    }
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'wallets':
        return <WalletsTab />;

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
            { id: 'wallets', label: 'Wallets', icon: <Wallet size={16} /> },
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
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Update PIN
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
                  onClick={() => setBiometricAuth(!biometricAuth)}
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

            {/* Default Wallet */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                Default Wallet
              </h3>
              <select
                value={defaultWallet}
                onChange={(e) => setDefaultWallet(e.target.value)}
                style={{
                  width: '350px',
                  padding: '12px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Preferences */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                Currency Preferences
              </h3>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  width: '350px',
                  padding: '12px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                {currencies.map((curr) => (
                  <option key={curr.id} value={curr.id}>
                    {curr.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Freeze/Unfreeze */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                Card Management
              </h3>
              {cards.map((card) => (
                <div key={card.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {card.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      **** **** **** {card.number.slice(-4)}
                    </div>
                  </div>
                  <button
                    onClick={() => setCardStatus(prev => ({ ...prev, [card.id]: !prev[card.id] }))}
                    style={{
                      padding: '6px 16px',
                      backgroundColor: cardStatus[card.id] ? '#dc2626' : '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    {cardStatus[card.id] ? 'Freeze' : 'Unfreeze'}
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{
                  padding: '12px 24px',
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
                  padding: '12px 24px',
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