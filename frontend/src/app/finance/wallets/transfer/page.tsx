'use client';

import React, { useState } from 'react';
import { useCurrency } from '../../../../contexts/CurrencyContext';

export default function TransferPage() {
  const { formatCurrency } = useCurrency();
  const [transferType, setTransferType] = useState<'card' | 'peer' | 'bulk'>('card');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transferMethod, setTransferMethod] = useState<'bank' | 'mno'>('bank');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedMno, setSelectedMno] = useState('');
  const [transferMode, setTransferMode] = useState<'card' | 'external'>('card');
  const [fromCard, setFromCard] = useState('');
  const [toCard, setToCard] = useState('');
  const [bulkRecipients, setBulkRecipients] = useState<Array<{ id: string; name: string; amount: string; bank: string }>>([
    { id: '1', name: '', amount: '', bank: '' }
  ]);
  const [importError, setImportError] = useState('');
  
  // Mock cards
  const cards = [
    { id: 'card1', name: "Emergency Fund", type: 'savings' },
    { id: 'card2', name: "My Shop", type: 'business' },
    { id: 'card3', name: "John's Card", type: 'personal' }
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


  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImportError('');
    if (!file.name.endsWith('.csv')) {
      setImportError('Please use CSV format.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = (e.target?.result as string) || '';
        const lines = data.split('\n');
        const headers = lines[0]?.toLowerCase().split(',').map(h => h.trim()) || [];
        const bankIndex = headers.findIndex(h => h.includes('bank'));
        const accountIndex = headers.findIndex(h => h.includes('account'));
        const amountIndex = headers.findIndex(h => h.includes('amount'));
        if (bankIndex === -1 || accountIndex === -1 || amountIndex === -1) {
          setImportError('File must contain: Bank Name, Account Number, Amount');
          return;
        }
        const imported: Array<{ id: string; name: string; amount: string; bank: string }> = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length >= 3 && values[accountIndex] && values[amountIndex]) {
            const bankName = values[bankIndex];
            const match = banks.find(b => b.name.toLowerCase().includes(bankName.toLowerCase()) || bankName.toLowerCase().includes(b.name.toLowerCase()));
            imported.push({ id: String(Date.now() + i), name: values[accountIndex], amount: values[amountIndex], bank: match?.id || '' });
          }
        }
        if (imported.length > 0) {
          setBulkRecipients(imported);
          setImportError('');
        } else {
          setImportError('No valid rows found');
        }
      } catch {
        setImportError('Error reading file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleTransfer = () => {
    if (transferType === 'card') {
      if (!fromCard || !toCard) {
        alert('Please select both source and destination cards');
        return;
      }
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    } else if (transferType === 'peer') {
      if (transferMode === 'card' && !fromCard) {
        alert('Please select a source card');
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
      if (!amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      if (!recipient) {
        alert('Please enter recipient name');
        return;
      }
    } else if (transferType === 'bulk') {
      if (transferMode === 'card' && !fromCard) {
        alert('Please select a source card');
        return;
      }
      if (bulkRecipients.length === 0) {
        alert('Please add at least one recipient');
        return;
      }
      const invalidRecipient = bulkRecipients.some(r => !r.name || !r.amount || parseFloat(r.amount) <= 0 || (transferMethod === 'bank' && !r.bank));
      if (invalidRecipient) {
        alert('Please fill in all recipient details');
        return;
      }
    }

    if (transferType === 'bulk') {
      console.log('Bulk transfer initiated:', {
        from: fromCard,
        recipients: bulkRecipients,
        totalAmount: bulkRecipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0),
        description,
        transferMode
      });
      alert(`Bulk transfer initiated for ${bulkRecipients.length} recipients`);
    } else {
      const payload: Record<string, unknown> = {
      type: transferType,
      amount: parseFloat(amount),
        description
      };

      if (transferType === 'card') {
        Object.assign(payload, {
          from: fromCard,
          to: toCard
        });
      } else {
        Object.assign(payload, {
          from: transferMode === 'card' ? fromCard : 'external-control-number',
          to: transferMethod === 'bank' ? bankAccount : phoneNumber,
          recipient,
          transferMode,
        transferMethod,
          ...(transferMethod === 'bank'
            ? { bank: selectedBank, accountNumber: bankAccount }
            : { mno: selectedMno, phoneNumber })
        });
      }

      console.log('Transfer initiated:', payload);
      alert('Transfer initiated successfully');
    }
  };

  return (
    <div style={{ maxWidth: '820px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 32px 0' }}>
        Transfer Money
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div style={{ maxWidth: '800px', boxSizing: 'border-box' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
            New Transfer
          </h3>

          {/* Transfer Type */}
          <div style={{ marginBottom: '20px', width: '360px', boxSizing: 'border-box' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Transfer Type
            </label>
            <select
              value={transferType}
              onChange={(e) => {
                const newType = e.target.value as 'card' | 'peer' | 'bulk';
                setTransferType(newType);
                setTransferMode('card');
                if (newType === 'bulk') {
                  setTransferMethod('bank');
                }
              }}
              style={{
                width: '100%',
                padding: '12px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                backgroundColor: 'white',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              <option value="card">Between Cards</option>
              <option value="peer">Peer Transfer</option>
              <option value="bulk">Bulk Transfer</option>
            </select>
          </div>

          {/* Card Transfer */}
          {transferType === 'card' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 360px)', gap: '16px', marginBottom: '20px', justifyContent: 'flex-start' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>From Card</label>
                  <select value={fromCard} onChange={(e) => setFromCard(e.target.value)} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="">Choose a card</option>
                    {cards.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>To Card</label>
                  <select value={toCard} onChange={(e) => setToCard(e.target.value)} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="">Choose a card</option>
                    {cards.filter(c => c.id !== fromCard).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
              </div>
              <div style={{ marginBottom: '20px', width: '360px', boxSizing: 'border-box' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Amount (TZS)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </>
          )}

          {/* Peer Transfer */}
          {transferType === 'peer' && (
            <>
              <div style={{ marginBottom: '20px', width: '360px', boxSizing: 'border-box' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Payment Mode</label>
                <select
                  value={transferMode}
                  onChange={(e) => setTransferMode(e.target.value as 'card' | 'external')}
                  style={{
                      width: '100%',
                    padding: '12px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="card">Use Card</option>
                  <option value="external">External Source</option>
                </select>
              </div>

              {transferMode === 'card' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 360px)', gap: '16px', marginBottom: '20px', justifyContent: 'flex-start' }}>
                <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>From Card</label>
                    <select value={fromCard} onChange={(e) => setFromCard(e.target.value)} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="">Choose a card</option>
                      {cards.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Transfer Method</label>
                    <select value={transferMethod} onChange={(e) => setTransferMethod(e.target.value as 'bank' | 'mno')} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                  <option value="bank">Bank Transfer</option>
                  <option value="mno">Mobile Money</option>
                </select>
                </div>
              </div>
              )}

              {transferMode === 'external' && (
                <div style={{ marginBottom: '20px', width: '360px', boxSizing: 'border-box' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Transfer Method</label>
                  <select value={transferMethod} onChange={(e) => setTransferMethod(e.target.value as 'bank' | 'mno')} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="bank">Bank Transfer</option>
                    <option value="mno">Mobile Money</option>
                  </select>
                </div>
              )}

              {transferMethod === 'bank' && (
                <div style={{ marginBottom: '20px', width: '360px', boxSizing: 'border-box' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Select Bank</label>
                  <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="">Choose a bank</option>
                    {banks.map((bank) => (<option key={bank.id} value={bank.id}>{bank.name}</option>))}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 360px)', gap: '24px', marginBottom: '20px', justifyContent: 'flex-start' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>{transferMethod === 'bank' ? 'Account Number' : 'Phone Number'}</label>
                  <input type="text" value={transferMethod === 'bank' ? bankAccount : phoneNumber} onChange={(e) => { if (transferMethod === 'bank') { setBankAccount(e.target.value); } else { setPhoneNumber(e.target.value); } }} placeholder={transferMethod === 'bank' ? 'Enter account number' : 'Enter phone number'} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Amount (TZS)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: '20px', width: '360px', boxSizing: 'border-box' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Recipient Name</label>
                <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Enter recipient name" style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </>
          )}

          {/* Bulk Transfer Recipients */}
          {transferType === 'bulk' && (
            <>
              <div style={{ marginBottom: '20px', width: '360px', boxSizing: 'border-box' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Payment Mode</label>
                  <select
                  value={transferMode}
                  onChange={(e) => setTransferMode(e.target.value as 'card' | 'external')}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="card">Use Card</option>
                  <option value="external">External Source</option>
                </select>
              </div>

              {transferMode === 'card' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 360px)', gap: '16px', marginBottom: '20px', justifyContent: 'flex-start' }}>
                  <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>From Card</label>
                    <select value={fromCard} onChange={(e) => setFromCard(e.target.value)} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="">Choose a card</option>
                      {cards.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                  </div>
                  <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Transfer Method</label>
                    <select value={transferMethod} onChange={(e) => setTransferMethod(e.target.value as 'bank' | 'mno')} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                      <option value="bank">Bank Transfer</option>
                      <option value="mno">Mobile Money</option>
                  </select>
                  </div>
                </div>
              )}

              {transferMode === 'external' && (
                <div style={{ marginBottom: '20px', width: '360px', boxSizing: 'border-box' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Transfer Method</label>
                  <select value={transferMethod} onChange={(e) => setTransferMethod(e.target.value as 'bank' | 'mno')} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="bank">Bank Transfer</option>
                    <option value="mno">Mobile Money</option>
                  </select>
                </div>
              )}

                <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    Recipients
                </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {transferMethod === 'bank' && (
                      <>
                        <input type="file" accept=".csv" onChange={handleExcelImport} style={{ display: 'none' }} id="excel-import" />
                        <button onClick={() => document.getElementById('excel-import')?.click()} style={{ padding: '8px 12px', backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>📊 Import Excel</button>
                      </>
                    )}
                    <button onClick={() => setBulkRecipients([...bulkRecipients, { id: String(Date.now()), name: '', amount: '', bank: '' }])} style={{ padding: '8px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>+ Add Recipient</button>
                  </div>
                </div>
                {importError && (
                  <div style={{ padding: '8px 12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '20px', marginBottom: '12px', fontSize: '12px', color: '#DC2626' }}>
                    {importError}
                  </div>
                )}
                {bulkRecipients.map((rec, index) => (
                  <div
                    key={rec.id}
                    style={{
                      marginBottom: '12px',
                      display: 'grid',
                      gridTemplateColumns: transferMethod === 'bank'
                        ? '200px 250px 170px 40px'
                        : '250px 200px 40px',
                      gap: '10px',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      boxSizing: 'border-box',
                      maxWidth: '100%'
                    }}
                  >
                    {transferMethod === 'bank' && (
                      <select value={rec.bank} onChange={(e) => { const updated = [...bulkRecipients]; updated[index].bank = e.target.value; setBulkRecipients(updated); }} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                        <option value="">Select Bank</option>
                        {banks.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    )}
                    <input type="text" value={rec.name} onChange={(e) => { const updated = [...bulkRecipients]; updated[index].name = e.target.value; setBulkRecipients(updated); }} placeholder={transferMethod === 'bank' ? 'Account number' : 'Phone number'} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box' }} />
                    <input type="number" value={rec.amount} onChange={(e) => { const updated = [...bulkRecipients]; updated[index].amount = e.target.value; setBulkRecipients(updated); }} placeholder="Amount (TZS)" style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box' }} />
                    {bulkRecipients.length > 1 && (
                      <button onClick={() => setBulkRecipients(bulkRecipients.filter((_, i) => i !== index))} style={{ width: '40px', height: '40px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', boxSizing: 'border-box', flexShrink: 0 }}>×</button>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                    Total Amount: {formatCurrency(bulkRecipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0))}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {bulkRecipients.length} recipient{bulkRecipients.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Description */}
          <div style={{ marginBottom: '24px', width: '360px', boxSizing: 'border-box' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note about this transfer"
              rows={3}
              style={{
                width: '100%',
                padding: '12px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Transfer Button */}
          <button
            onClick={handleTransfer}
            style={{
              width: '360px',
              padding: '12px 20px',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
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
      </div>
    </div>
  );
}
