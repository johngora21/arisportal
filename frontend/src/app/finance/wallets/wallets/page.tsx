'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Wallet
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WalletsPage() {
  const router = useRouter();
  const [walletBalanceVisibility, setWalletBalanceVisibility] = useState<Record<string, boolean>>({
    'main': true,
    'savings': true,
    'business': true
  });
  const [selectedWallet, setSelectedWallet] = useState('main');

  // Mock data
  const wallets = [
    { id: 'main', name: 'Main Wallet', balance: 2500000, currency: 'TZS', type: 'primary', status: 'active' },
    { id: 'savings', name: 'Savings Wallet', balance: 1500000, currency: 'TZS', type: 'savings', status: 'active' },
    { id: 'business', name: 'Business Wallet', balance: 5000000, currency: 'TZS', type: 'business', status: 'active' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          My Wallets
        </h3>
        <button
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
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Add Wallet
        </button>
      </div>

      {/* Wallet Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            onClick={() => setSelectedWallet(wallet.id)}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              padding: '0',
              borderRadius: '24px',
              boxShadow: selectedWallet === wallet.id 
                ? '0 10px 25px rgba(31, 41, 55, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)' 
                : '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
              border: selectedWallet === wallet.id ? '2px solid var(--mc-sidebar-bg)' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              overflow: 'hidden'
            }}
          >
            {/* Header Section */}
            <div style={{
              padding: '24px 24px 20px 24px',
              background: wallet.type === 'primary' 
                ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
                : wallet.type === 'savings'
                ? 'linear-gradient(135deg, #065f46 0%, #10b981 50%, #047857 100%)'
                : 'linear-gradient(135deg, #92400e 0%, #fbbf24 50%, #b45309 100%)',
              color: 'white',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '4px' }}>
                    {wallet.name}
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {wallet.type}
                  </span>
                </div>
                
                {/* Wallet Icon with Balance Toggle */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setWalletBalanceVisibility(prev => ({
                      ...prev,
                      [wallet.id]: !prev[wallet.id]
                    }));
                  }}
                  style={{
                    padding: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  }}
                >
                  <Wallet size={22} color="white" />
                </div>
              </div>
              
              {/* Balance Display */}
              <div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                  {walletBalanceVisibility[wallet.id] ? formatCurrency(wallet.balance) : '••••••'}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                  Available Balance
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div style={{ padding: '20px 24px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/finance/wallets/transfer');
                }}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: wallet.type === 'primary' 
                    ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
                    : wallet.type === 'savings'
                    ? 'linear-gradient(135deg, #065f46 0%, #10b981 50%, #047857 100%)'
                    : 'linear-gradient(135deg, #92400e 0%, #fbbf24 50%, #b45309 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                Top Up
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}