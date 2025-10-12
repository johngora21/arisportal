'use client';

import React, { useState } from 'react';
import { 
  ArrowRightLeft,
  User,
  CreditCard,
  Building,
  Smartphone,
  DollarSign,
  Search,
  Filter
} from 'lucide-react';

export default function TransferPage() {
  const [transferType, setTransferType] = useState<'internal' | 'external'>('internal');
  const [fromWallet, setFromWallet] = useState('main');
  const [toWallet, setToWallet] = useState('savings');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transferMethod, setTransferMethod] = useState<'bank' | 'mno'>('bank');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedMno, setSelectedMno] = useState('');

  // Mock data
  const wallets = [
    { id: 'main', name: 'Main Wallet', balance: 2500000, currency: 'TZS' },
    { id: 'savings', name: 'Savings Wallet', balance: 1500000, currency: 'TZS' },
    { id: 'business', name: 'Business Wallet', balance: 5000000, currency: 'TZS' }
  ];

  // Tanzanian Banks
  const banks = [
    { id: 'crdb', name: 'CRDB Bank', code: 'CRDB' },
    { id: 'nmb', name: 'NMB Bank', code: 'NMB' },
    { id: 'equity', name: 'Equity Bank', code: 'EQUITY' },
    { id: 'absa', name: 'Absa Bank', code: 'ABSA' },
    { id: 'stanbic', name: 'Stanbic Bank', code: 'STANBIC' },
    { id: 'exim', name: 'Exim Bank', code: 'EXIM' },
    { id: 'diamond', name: 'Diamond Trust Bank', code: 'DTB' },
    { id: 'kcb', name: 'KCB Bank', code: 'KCB' },
    { id: 'national', name: 'National Bank of Commerce', code: 'NBC' },
    { id: 'barclays', name: 'Barclays Bank', code: 'BARCLAYS' }
  ];

  // Mobile Network Operators (MNOs)
  const mnos = [
    { id: 'vodacom', name: 'Vodacom M-Pesa', code: 'VODACOM' },
    { id: 'airtel', name: 'Airtel Money', code: 'AIRTEL' },
    { id: 'tigo', name: 'Tigo Pesa', code: 'TIGO' },
    { id: 'halotel', name: 'HaloPesa', code: 'HALOTEL' },
    { id: 'ttcl', name: 'TTCL Pesa', code: 'TTCL' }
  ];

  const recentTransfers = [
    {
      id: '1',
      type: 'internal',
      from: 'Main Wallet',
      to: 'Savings Wallet',
      amount: 500000,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'external',
      from: 'Business Wallet',
      to: 'John Doe',
      amount: 750000,
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: '3',
      type: 'internal',
      from: 'Savings Wallet',
      to: 'Main Wallet',
      amount: 200000,
      date: '2024-01-13',
      status: 'completed'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleTransfer = () => {
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (transferType === 'external') {
      if (!recipient) {
        alert('Please enter recipient name');
        return;
      }
      
      if (transferMethod === 'bank') {
        if (!selectedBank) {
          alert('Please select a bank');
          return;
        }
        if (!bankAccount) {
          alert('Please enter account number');
          return;
        }
      } else {
        if (!selectedMno) {
          alert('Please select a mobile network');
          return;
        }
        if (!phoneNumber) {
          alert('Please enter phone number');
          return;
        }
      }
    }

    // Handle transfer logic here
    console.log('Transfer initiated:', {
      type: transferType,
      from: fromWallet,
      to: transferType === 'internal' ? toWallet : recipient,
      amount: parseFloat(amount),
      description,
      ...(transferType === 'external' && {
        transferMethod,
        ...(transferMethod === 'bank' ? {
          bank: selectedBank,
          accountNumber: bankAccount
        } : {
          mno: selectedMno,
          phoneNumber: phoneNumber
        })
      })
    });
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 32px 0' }}>
        Transfer Money
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Transfer Form */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
            New Transfer
          </h3>

          {/* Transfer Type */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Transfer Type
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setTransferType('internal')}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: transferType === 'internal' ? 'var(--mc-sidebar-bg-hover)' : '#f3f4f6',
                  color: transferType === 'internal' ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <ArrowRightLeft size={16} style={{ marginRight: '8px' }} />
                Internal
              </button>
              <button
                onClick={() => setTransferType('external')}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: transferType === 'external' ? 'var(--mc-sidebar-bg)' : '#f3f4f6',
                  color: transferType === 'external' ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <User size={16} style={{ marginRight: '8px' }} />
                External
              </button>
            </div>
          </div>

          {/* From Wallet */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              From Wallet
            </label>
            <select
              value={fromWallet}
              onChange={(e) => setFromWallet(e.target.value)}
              style={{
                width: '380px',
                padding: '12px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              {wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.name} - {formatCurrency(wallet.balance)}
                </option>
              ))}
            </select>
          </div>

          {/* To Wallet (Internal) or Recipient (External) */}
          {transferType === 'internal' ? (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                To Wallet
              </label>
              <select
                value={toWallet}
                onChange={(e) => setToWallet(e.target.value)}
                style={{
                  width: '380px',
                  padding: '12px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                {wallets.filter(w => w.id !== fromWallet).map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name} - {formatCurrency(wallet.balance)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Transfer Method
                </label>
                <select
                  value={transferMethod}
                  onChange={(e) => setTransferMethod(e.target.value as 'bank' | 'mno')}
                  style={{
                    width: '380px',
                    padding: '12px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="mno">Mobile Money</option>
                </select>
              </div>

              {/* Bank Selection */}
              {transferMethod === 'bank' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Select Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    style={{
                      width: '380px',
                      padding: '12px 20px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Choose a bank</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* MNO Selection */}
              {transferMethod === 'mno' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Select Mobile Network
                  </label>
                  <select
                    value={selectedMno}
                    onChange={(e) => setSelectedMno(e.target.value)}
                    style={{
                      width: '340px',
                      padding: '12px 20px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Choose mobile network</option>
                    {mnos.map((mno) => (
                      <option key={mno.id} value={mno.id}>
                        {mno.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Account/Phone Number Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  {transferMethod === 'bank' ? 'Account Number' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={transferMethod === 'bank' ? bankAccount : phoneNumber}
                  onChange={(e) => {
                    if (transferMethod === 'bank') {
                      setBankAccount(e.target.value);
                    } else {
                      setPhoneNumber(e.target.value);
                    }
                  }}
                  placeholder={transferMethod === 'bank' ? 'Enter account number' : 'Enter phone number (e.g., 0712345678)'}
                  style={{
                    width: '340px',
                    padding: '12px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Recipient Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter recipient name"
                  style={{
                    width: '340px',
                    padding: '12px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </>
          )}

          {/* Amount */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Amount (TZS)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              style={{
                width: '340px',
                padding: '12px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note about this transfer"
              rows={3}
              style={{
                width: '350px',
                padding: '12px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Transfer Button */}
          <button
            onClick={handleTransfer}
            style={{
                  width: '380px',
              padding: '12px 20px',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
            }}
          >
            Initiate Transfer
          </button>
        </div>

        {/* Recent Transfers */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Recent Transfers
            </h3>
            <button
              style={{
                padding: '12px 20px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTransfers.map((transfer) => (
              <div
                key={transfer.id}
                style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                      {transfer.from} → {transfer.to}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      {transfer.date}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: transfer.status === 'completed' ? '#dcfce7' : '#fef3c7',
                    color: transfer.status === 'completed' ? '#166534' : '#92400e',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {transfer.status}
                  </span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  {formatCurrency(transfer.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
