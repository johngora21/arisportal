'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { buildApiUrl } from '../../../../config/api';
import { useRouter } from 'next/navigation';
import { countries } from '../../../../data/countries';

interface Card {
  id: number;
  card_type: string;
  last_four: string;
  cardholder_name: string | null;
  balance: number;
  is_active: boolean;
  is_default: boolean;
}

export default function TransferPage() {
  const { formatCurrency } = useCurrency();
  const { token } = useAuth();
  const router = useRouter();
  const [transferType, setTransferType] = useState<'card' | 'local' | 'international'>('card');
  const [transferSubType, setTransferSubType] = useState<'peer' | 'bulk'>('peer');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transferMethod, setTransferMethod] = useState<'bank' | 'mno'>('bank');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedMno, setSelectedMno] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [transferMode, setTransferMode] = useState<'card' | 'external' | 'clickpesa_balance'>('card');
  const [fromCard, setFromCard] = useState('');
  const [toCard, setToCard] = useState('');
  const [bulkRecipients, setBulkRecipients] = useState<Array<{ id: string; recipientName: string; account: string; amount: string; bank: string; mno: string; country?: string }>>([
    { id: '1', recipientName: '', account: '', amount: '', bank: '', mno: '' }
  ]);
  const [importError, setImportError] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clickpesaBanks, setClickpesaBanks] = useState<Array<{id: string; name: string; bic?: string; code?: string}>>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  
  // African countries that support MNO
  const africanMnoCountries = [
    'Benin',
    'Burkina Faso',
    'Cameroon',
    'Ghana',
    'Côte d\'Ivoire',
    'Ivory Coast',
    'Nigeria',
    'Senegal',
    'Sierra Leone',
    'Congo',
    'Congo, Democratic Republic of the',
    'DRC',
    'Gabon',
    'Lesotho',
    'Malawi',
    'Mozambique',
    'Zambia',
    'Ethiopia',
    'Kenya',
    'Rwanda',
    'Tanzania, United Republic of',
    'Tanzania',
    'Uganda'
  ];

  // Fetch cards from API
  useEffect(() => {
    const fetchCards = async () => {
      if (!token) {
        setLoadingCards(false);
        return;
      }

      try {
        setLoadingCards(true);
        const response = await fetch(buildApiUrl('/cards'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          // Token invalid, redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          router.push('/authentication/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }

        const data = await response.json();
        setCards(data);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError('Failed to load cards. Please try again.');
      } finally {
        setLoadingCards(false);
      }
    };

    fetchCards();
  }, [token, router]);

  // Helper to get card display name
  const getCardDisplayName = (card: Card): string => {
    const cardType = card.card_type?.toUpperCase() || 'CARD';
    if (card.cardholder_name) {
      return `${cardType} - ${card.cardholder_name}`;
    }
    return `${cardType} Card`;
  };

  const getCardOptionLabel = (card: Card): string => {
    const base = getCardDisplayName(card);
    return card.is_default ? `${base} (Default)` : base;
  };

  // Fetch ClickPesa banks list
  useEffect(() => {
    const fetchBanks = async () => {
      if (!token || clickpesaBanks.length > 0) return;

      try {
        setLoadingBanks(true);
        const response = await fetch(buildApiUrl('/transfers/banks/list'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          router.push('/authentication/login');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          // Handle different response formats from ClickPesa
          let banksList = [];
          if (Array.isArray(data)) {
            banksList = data;
          } else if (data.banks && Array.isArray(data.banks)) {
            banksList = data.banks;
          } else if (data.data && Array.isArray(data.data)) {
            banksList = data.data;
          }
          
          // Map ClickPesa bank format to our format
          const mappedBanks = banksList
            .map((bank: any, index: number) => {
              const bic = bank?.bic || bank?.BIC || bank?.bicCode || bank?.code || bank?.bankCode || bank?.bank_code;
              if (!bic) {
                return null;
              }

              return {
                id: (bic as string).toUpperCase(),
                name: bank.name || bank.bankName || bank.bank_name || 'Unknown Bank',
                bic: (bic as string).toUpperCase(),
                transferType: (bank.transferType || bank.transfer_type || '').toUpperCase() || 'ACH',
              };
            })
            .filter((bank: any) => bank !== null);
          
          setClickpesaBanks(mappedBanks as Array<{ id: string; name: string; bic?: string; transferType?: string }>);
        } else {
          console.warn('Failed to fetch ClickPesa banks, using fallback list');
        }
      } catch (err) {
        console.error('Error fetching banks:', err);
        // Continue with fallback list
      } finally {
        setLoadingBanks(false);
      }
    };

    fetchBanks();
  }, [token, router]);

  // Use only ClickPesa banks (no fallback)
  const banks = clickpesaBanks;

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
        const imported: Array<{ id: string; recipientName: string; account: string; amount: string; bank: string; mno: string }> = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length >= 3 && values[accountIndex] && values[amountIndex]) {
            const bankName = values[bankIndex];
            const match = banks.find(b => b.name.toLowerCase().includes(bankName.toLowerCase()) || bankName.toLowerCase().includes(b.name.toLowerCase()));
            imported.push({ id: String(Date.now() + i), recipientName: '', account: values[accountIndex], amount: values[amountIndex], bank: match?.id || '', mno: '' });
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

  // Helper function to render fields in pairs
  const renderFieldsInPairs = (fields: Array<React.ReactNode>) => {
    if (fields.length === 0) return null;
    
    const pairs: Array<React.ReactNode[]> = [];
    for (let i = 0; i < fields.length; i += 2) {
      pairs.push(fields.slice(i, i + 2));
    }
    
    return pairs.map((pair, idx) => {
      // Always use 2-column grid, even for single fields (adds empty div to maintain pairing)
      const isLastSingle = idx === pairs.length - 1 && pair.length === 1;
      
      return (
        <div 
          key={idx} 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 360px)', 
            gap: '16px', 
            marginBottom: '20px', 
            justifyContent: 'flex-start'
          }}
        >
          {pair.map((field, fieldIdx) => (
            <div key={fieldIdx} style={{ boxSizing: 'border-box' }}>
              {field}
            </div>
          ))}
          {/* Add empty div to maintain 2-column layout when last field is single */}
          {isLastSingle && <div style={{ boxSizing: 'border-box' }} />}
        </div>
      );
    });
  };

  // Helper to create a field wrapper
  const createField = (
    label: string,
    children: React.ReactNode,
    width?: string
  ) => (
    <div style={{ boxSizing: 'border-box', width: width || '100%' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
        {label}
      </label>
      {children}
    </div>
  );

  // Check if selected country supports MNO
  const supportsMno = (countryName: string): boolean => {
    return africanMnoCountries.some(country => 
      countryName.toLowerCase().includes(country.toLowerCase()) || 
      country.toLowerCase().includes(countryName.toLowerCase())
    );
  };

  const handleTransfer = async () => {
    if (!token) {
      setError('Please login to continue');
      router.push('/authentication/login');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
    if (transferType === 'card') {
      if (!fromCard || !toCard) {
          setError('Please select both source and destination cards');
          setLoading(false);
        return;
      }
    if (!amount || parseFloat(amount) <= 0) {
          setError('Please enter a valid amount');
          setLoading(false);
      return;
    }

        // Card-to-card transfer
        const response = await fetch(buildApiUrl('/transfers/card-to-card'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from_card_id: parseInt(fromCard),
            to_card_id: parseInt(toCard),
            amount: parseFloat(amount),
            description: description || undefined
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Transfer failed');
        }

        setSuccess('Transfer completed successfully!');
        // Auto-clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
        
        // Refresh cards to update balances
        const cardsResponse = await fetch(buildApiUrl('/cards'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (cardsResponse.ok) {
          const updatedCards = await cardsResponse.json();
          setCards(updatedCards);
        }
        
        // Reset form
        setAmount('');
        setDescription('');
        setFromCard('');
        setToCard('');

      } else if (transferType === 'local' && transferSubType === 'peer') {
        // Validation for local peer transfer
      if (transferMode === 'card' && !fromCard) {
          setError('Please select a source card');
          setLoading(false);
        return;
      }
      if (transferMethod === 'bank') {
        if (!selectedBank) {
            setError('Please select a bank');
            setLoading(false);
          return;
        }
        if (!bankAccount) {
            setError('Please enter account number');
            setLoading(false);
          return;
        }
        } else if (transferMethod === 'mno') {
        if (!selectedMno) {
            setError('Please select a mobile network');
            setLoading(false);
          return;
        }
        if (!phoneNumber) {
            setError('Please enter phone number');
            setLoading(false);
          return;
        }
      }
      if (!amount || parseFloat(amount) <= 0) {
          setError('Please enter a valid amount');
          setLoading(false);
        return;
      }
      if (!recipient) {
          setError('Please enter recipient name');
          setLoading(false);
        return;
      }

        // Local peer transfer
        const response = await fetch(buildApiUrl('/transfers/local-peer'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from_card_id: transferMode === 'card' ? parseInt(fromCard) : null,
            transfer_mode: transferMode,
            transfer_method: transferMethod,
            recipient_name: recipient,
            recipient_account: transferMethod === 'bank' ? bankAccount : phoneNumber,
            recipient_bank: transferMethod === 'bank' ? selectedBank : null,
            recipient_mno: transferMethod === 'mno' ? selectedMno : null,
            amount: parseFloat(amount),
            description: description || undefined
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Transfer failed');
        }

        // Only show success when provider has disbursed successfully
        const providerStatus = (data?.status || '').toString().toUpperCase();
        if (providerStatus === 'COMPLETED' || providerStatus === 'PROCESSING') {
          const message = providerStatus === 'COMPLETED'
            ? 'Disbursed successfully!'
            : `Transfer submitted to provider. Awaiting confirmation (status: ${providerStatus}).`;
          setSuccess(message);
          setTimeout(() => setSuccess(''), 5000);
        } else {
          setError(`Transfer not completed. Provider status: ${providerStatus || 'UNKNOWN'}`);
          return;
        }
        
        // Refresh cards to update balances
        if (transferMode === 'card') {
          const cardsResponse = await fetch(buildApiUrl('/cards'), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (cardsResponse.ok) {
            const updatedCards = await cardsResponse.json();
            setCards(updatedCards);
          }
        }

        // Reset form
        setAmount('');
        setDescription('');
        setRecipient('');
        setBankAccount('');
        setPhoneNumber('');
        setSelectedBank('');
        setSelectedMno('');

      } else if (transferType === 'local' && transferSubType === 'bulk') {
        // Validation for local bulk transfer
      if (transferMode === 'card' && !fromCard) {
          setError('Please select a source card');
          setLoading(false);
        return;
      }
      if (bulkRecipients.length === 0) {
          setError('Please add at least one recipient');
          setLoading(false);
        return;
      }
        // Validate based on transfer method
        if (transferMethod === 'bank') {
          const invalidRecipient = bulkRecipients.some(r => !r.account || !r.amount || parseFloat(r.amount) <= 0 || !r.bank);
          if (invalidRecipient) {
            setError('Please fill in all recipient details including bank selection');
            setLoading(false);
            return;
          }
        } else if (transferMethod === 'mno') {
          const invalidRecipient = bulkRecipients.some(r => !r.account || !r.amount || parseFloat(r.amount) <= 0 || !r.mno);
          if (invalidRecipient) {
            setError('Please fill in all recipient details including mobile network selection');
            setLoading(false);
        return;
      }
    }

        // Local bulk transfer
        const response = await fetch(buildApiUrl('/transfers/local-bulk'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from_card_id: transferMode === 'card' ? parseInt(fromCard) : null,
            transfer_mode: transferMode,
            transfer_method: transferMethod,
            recipients: bulkRecipients.map(r => ({
              recipient_name: r.recipientName || r.account, // Use account as fallback if name not provided
              recipient_account: r.account,
              amount: parseFloat(r.amount),
              bank_id: transferMethod === 'bank' ? r.bank : null,
              mno_id: transferMethod === 'mno' ? r.mno : null
            })),
            description: description || undefined
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Bulk transfer failed');
        }

        // Only show success when provider has disbursed successfully (if backend aggregates status)
        const providerStatus = (data?.status || '').toString().toUpperCase();
        const summaryCounts = data?.transfer_summary?.counts;
        const totalRecipients = summaryCounts?.total ?? bulkRecipients.length;
        if (providerStatus === 'COMPLETED' || providerStatus === 'PROCESSING') {
          const completed = summaryCounts?.completed ?? 0;
          const failed = summaryCounts?.failed ?? 0;
          const processing = summaryCounts?.processing ?? 0;
          const message = providerStatus === 'COMPLETED'
            ? `Bulk disbursement completed for ${totalRecipients} recipient${totalRecipients === 1 ? '' : 's'}!`
            : `Bulk disbursement submitted for ${totalRecipients} recipient${totalRecipients === 1 ? '' : 's'}. Provider status: ${providerStatus}. Completed: ${completed}, Processing: ${processing}, Failed: ${failed}.`;
          setSuccess(message);
          setTimeout(() => setSuccess(''), 6000);
    } else {
          setError(`Bulk transfer not completed. Provider status: ${providerStatus || 'UNKNOWN'}`);
          return;
        }
        
        // Refresh cards to update balances
        if (transferMode === 'card') {
          const cardsResponse = await fetch(buildApiUrl('/cards'), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (cardsResponse.ok) {
            const updatedCards = await cardsResponse.json();
            setCards(updatedCards);
          }
        }

        // Reset form
        setBulkRecipients([{ id: '1', recipientName: '', account: '', amount: '', bank: '', mno: '' }]);
        setDescription('');
        setFromCard('');

      } else {
        // International transfers - not implemented yet
        setError('International transfers are not yet implemented');
        setLoading(false);
        return;
    }
    
    } catch (err: any) {
      console.error('Transfer error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '820px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 32px 0' }}>
        Transfer Money
      </h2>

      {error && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#991B1B',
          borderRadius: '12px',
                  display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '14px' }}>{error}</span>
          <button onClick={() => setError('')} style={{
            marginLeft: '12px',
            background: 'transparent',
                  border: 'none',
            color: '#991B1B',
            fontSize: '16px',
            cursor: 'pointer'
          }}>×</button>
            </div>
      )}

      {success && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          borderRadius: '12px'
        }}>
          <span style={{ fontSize: '14px' }}>{success}</span>
          </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div style={{ maxWidth: '800px', boxSizing: 'border-box' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
            New Transfer
          </h3>

          {/* Transfer Type and Transfer Option */}
          {renderFieldsInPairs([
            createField('Transfer Type', (
            <select
                value={transferType}
                onChange={(e) => {
                  const newType = e.target.value as 'card' | 'local' | 'international';
                  setTransferType(newType);
                  setTransferMode('card');
                  setError('');
                  if (newType === 'card') {
                    setTransferSubType('peer');
                  } else {
                    // Keep peer as default for local/international
                  }
                }}
                disabled={loading || loadingCards}
              style={{
                      width: '100%',
                padding: '12px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                  backgroundColor: (loading || loadingCards) ? '#f3f4f6' : 'white',
                  boxSizing: 'border-box',
                  cursor: (loading || loadingCards) ? 'not-allowed' : 'pointer'
              }}
            >
                <option value="card">Between Cards</option>
                <option value="local">Local Transfer</option>
                <option value="international">International Transfer</option>
            </select>
            )),
            // Transfer Option - only show when Local or International is selected
            ...((transferType === 'local' || transferType === 'international') ? [
              createField('Transfer Option', (
              <select
                  value={transferSubType}
                  onChange={(e) => {
                    const newSubType = e.target.value as 'peer' | 'bulk';
                    setTransferSubType(newSubType);
                  setTransferMode('card');
                    setError('');
                    if (newSubType === 'bulk') {
                  setTransferMethod('bank');
                    }
                }}
                disabled={loading || loadingCards}
                style={{
                      width: '100%',
                  padding: '12px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                    backgroundColor: (loading || loadingCards) ? '#f3f4f6' : 'white',
                    boxSizing: 'border-box',
                    cursor: (loading || loadingCards) ? 'not-allowed' : 'pointer'
                }}
              >
                  <option value="peer">Peer Transfer</option>
                  <option value="bulk">Bulk Transfer</option>
                </select>
              ))
            ] : [])
          ])}

          {/* Card Transfer */}
          {transferType === 'card' && (
            <>
              {renderFieldsInPairs([
                createField('From Card', (
                  <select value={fromCard} onChange={(e) => { setFromCard(e.target.value); setError(''); }} disabled={loadingCards || loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: loadingCards || loading ? '#f3f4f6' : 'white', boxSizing: 'border-box', cursor: loadingCards || loading ? 'not-allowed' : 'pointer' }}>
                    <option value="">Choose a card</option>
                    {cards.filter(c => c.is_active).map((c) => (
                      <option key={c.id} value={c.id}>{getCardOptionLabel(c)}</option>
                ))}
              </select>
                )),
                createField('To Card', (
                  <select value={toCard} onChange={(e) => { setToCard(e.target.value); setError(''); }} disabled={loadingCards || loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: loadingCards || loading ? '#f3f4f6' : 'white', boxSizing: 'border-box', cursor: loadingCards || loading ? 'not-allowed' : 'pointer' }}>
                    <option value="">Choose a card</option>
                    {cards.filter(c => c.is_active && c.id.toString() !== fromCard).map((c) => (
                      <option key={c.id} value={c.id}>{getCardOptionLabel(c)}</option>
                ))}
              </select>
                )),
                createField('Amount (TZS)', (
                <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setError(''); }} placeholder="Enter amount" disabled={loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
                ))
              ])}
            </>
          )}

          {/* Local/International Peer Transfer */}
          {((transferType === 'local' && transferSubType === 'peer') || (transferType === 'international' && transferSubType === 'peer')) && (() => {
            const peerFields: React.ReactNode[] = [];
            
            // Country Selection - only for international
            if (transferType === 'international') {
              peerFields.push(
                createField('Destination Country', (
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setError('');
                      // Reset MNO if country doesn't support it
                      if (!supportsMno(e.target.value) && transferMethod === 'mno') {
                        setTransferMethod('bank');
                      }
                    }}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      backgroundColor: loading ? '#f3f4f6' : 'white',
                      boxSizing: 'border-box',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                ))
              );
            }

            // Payment Mode - always visible
            peerFields.push(
              createField('Payment Mode', (
                <select
                  value={transferMode}
                  onChange={(e) => { setTransferMode(e.target.value as 'card' | 'external' | 'clickpesa_balance'); setError(''); }}
                  disabled={loading}
                  style={{
                      width: '100%',
                    padding: '12px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f3f4f6' : 'white',
                    boxSizing: 'border-box',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="card">Use Card</option>
                  <option value="clickpesa_balance">ClickPesa Balance</option>
                  <option value="external">External Source</option>
                </select>
              ))
            );

            // From Card - only if card mode
            if (transferMode === 'card') {
              peerFields.push(
                createField('From Card', (
                    <select value={fromCard} onChange={(e) => { setFromCard(e.target.value); setError(''); }} disabled={loadingCards || loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: loadingCards || loading ? '#f3f4f6' : 'white', boxSizing: 'border-box', cursor: loadingCards || loading ? 'not-allowed' : 'pointer' }}>
                    <option value="">Choose a card</option>
                      {cards.filter(c => c.is_active).map((c) => (<option key={c.id} value={c.id}>{getCardOptionLabel(c)}</option>))}
                  </select>
                ))
              );
            }

            // Transfer Method - show MNO only for local or international with MNO-supporting countries
            const showMnoOption = transferType === 'local' || (transferType === 'international' && selectedCountry && supportsMno(selectedCountry));
            
            peerFields.push(
              createField('Transfer Method', (
                  <select
                  value={transferMethod} 
                  onChange={(e) => {
                    const newMethod = e.target.value as 'bank' | 'mno';
                    setTransferMethod(newMethod);
                    setError('');
                    // If switching to MNO but country doesn't support it, prevent it
                    if (newMethod === 'mno' && transferType === 'international' && selectedCountry && !supportsMno(selectedCountry)) {
                      setTransferMethod('bank');
                      alert('Mobile Money is not available for the selected country');
                      return;
                    }
                  }} 
                  disabled={loading}
                  style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: loading ? '#f3f4f6' : 'white', boxSizing: 'border-box', cursor: loading ? 'not-allowed' : 'pointer' }}
                  >
                  <option value="bank">Bank Transfer</option>
                  {showMnoOption && <option value="mno">Mobile Money</option>}
                  </select>
              ))
            );

            // Select Bank - only if bank method
                      if (transferMethod === 'bank') {
              peerFields.push(
                createField('Select Bank', (
                  <select value={selectedBank} onChange={(e) => { setSelectedBank(e.target.value); setError(''); }} disabled={loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: loading ? '#f3f4f6' : 'white', boxSizing: 'border-box', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    <option value="">Choose a bank</option>
                    {banks.map((bank) => (<option key={bank.id} value={bank.id}>{bank.name}</option>))}
                  </select>
                ))
              );
                      }

            // Select MNO - only if MNO method and (local or international with MNO-supporting country)
            if (transferMethod === 'mno' && showMnoOption) {
              peerFields.push(
                createField('Select Mobile Network', (
                  <select value={selectedMno} onChange={(e) => { setSelectedMno(e.target.value); setError(''); }} disabled={loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: loading ? '#f3f4f6' : 'white', boxSizing: 'border-box', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    <option value="">Choose a mobile network</option>
                    {mnos.map((mno) => (<option key={mno.id} value={mno.id}>{mno.name}</option>))}
                  </select>
                ))
              );
            }

            // Account Number / Phone Number
            peerFields.push(
              createField(transferMethod === 'bank' ? 'Account Number' : 'Phone Number', (
                  <input type="text" value={transferMethod === 'bank' ? bankAccount : phoneNumber} onChange={(e) => { if (transferMethod === 'bank') { setBankAccount(e.target.value); } else { setPhoneNumber(e.target.value); } }} placeholder={transferMethod === 'bank' ? 'Enter account number' : 'Enter phone number'} disabled={loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
              ))
            );

            // Amount
            peerFields.push(
              createField('Amount (TZS)', (
                  <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setError(''); }} placeholder="Enter amount" disabled={loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
              ))
            );

            // Recipient Name
            peerFields.push(
              createField('Recipient Name', (
                <input type="text" value={recipient} onChange={(e) => { setRecipient(e.target.value); setError(''); }} placeholder="Enter recipient name" disabled={loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
              ))
            );

            return <>{renderFieldsInPairs(peerFields)}</>;
          })()}

          {/* Local/International Bulk Transfer */}
          {((transferType === 'local' && transferSubType === 'bulk') || (transferType === 'international' && transferSubType === 'bulk')) && (
            <>
              {(() => {
                const bulkFields: React.ReactNode[] = [];
                
                // Country Selection - only for international
                if (transferType === 'international') {
                  bulkFields.push(
                    createField('Destination Country', (
                  <select
                        value={selectedCountry}
                        onChange={(e) => {
                          setSelectedCountry(e.target.value);
                          setError('');
                          // Reset MNO if country doesn't support it
                          if (!supportsMno(e.target.value) && transferMethod === 'mno') {
                            setTransferMethod('bank');
                          }
                        }}
                        disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                          backgroundColor: loading ? '#f3f4f6' : 'white',
                          boxSizing: 'border-box',
                          cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                    ))
                  );
                }
                
                // Payment Mode - always visible
                bulkFields.push(
                  createField('Payment Mode', (
                  <select
                  value={transferMode}
                  onChange={(e) => { setTransferMode(e.target.value as 'card' | 'external' | 'clickpesa_balance'); setError(''); }}
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
                  <option value="clickpesa_balance">ClickPesa Balance</option>
                  <option value="external">External Source</option>
                  </select>
                  ))
                );

                // From Card - only if card mode
                if (transferMode === 'card') {
                  bulkFields.push(
                    createField('From Card', (
                    <select value={fromCard} onChange={(e) => { setFromCard(e.target.value); setError(''); }} disabled={loadingCards || loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: loadingCards || loading ? '#f3f4f6' : 'white', boxSizing: 'border-box', cursor: loadingCards || loading ? 'not-allowed' : 'pointer' }}>
                    <option value="">Choose a card</option>
                      {cards.filter(c => c.is_active).map((c) => (<option key={c.id} value={c.id}>{getCardOptionLabel(c)}</option>))}
                    </select>
                    ))
                  );
                }

                // Transfer Method - show MNO only for local or international with MNO-supporting countries
                const showMnoOption = transferType === 'local' || (transferType === 'international' && selectedCountry && supportsMno(selectedCountry));
                
                bulkFields.push(
                  createField('Transfer Method', (
                  <select
                      value={transferMethod} 
                      onChange={(e) => {
                        const newMethod = e.target.value as 'bank' | 'mno';
                        setTransferMethod(newMethod);
                        setError('');
                        // If switching to MNO but country doesn't support it, prevent it
                        if (newMethod === 'mno' && transferType === 'international' && selectedCountry && !supportsMno(selectedCountry)) {
                          setTransferMethod('bank');
                          alert('Mobile Money is not available for the selected country');
                          return;
                        }
                      }} 
                      disabled={loading}
                      style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: loading ? '#f3f4f6' : 'white', boxSizing: 'border-box', cursor: loading ? 'not-allowed' : 'pointer' }}
                  >
                      <option value="bank">Bank Transfer</option>
                      {showMnoOption && <option value="mno">Mobile Money</option>}
                  </select>
                  ))
                );

                return renderFieldsInPairs(bulkFields);
              })()}

                <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    Recipients
                </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {transferMethod === 'bank' && (
                      <>
                        <input type="file" accept=".csv" onChange={handleExcelImport} style={{ display: 'none' }} id="excel-import" disabled={loading} />
                        <button onClick={() => document.getElementById('excel-import')?.click()} disabled={loading} style={{ padding: '8px 12px', backgroundColor: loading ? '#9ca3af' : '#1f2937', color: 'white', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>📊 Import Excel</button>
                      </>
                    )}
                    <button onClick={() => setBulkRecipients([...bulkRecipients, { id: String(Date.now()), recipientName: '', account: '', amount: '', bank: '', mno: '', ...(transferType === 'international' ? { country: selectedCountry || '' } : {}) }])} disabled={loading} style={{ padding: '8px 12px', backgroundColor: loading ? '#9ca3af' : '#10B981', color: 'white', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>+ Add Recipient</button>
                  </div>
                </div>
                {importError && (
                  <div style={{ padding: '8px 12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '20px', marginBottom: '12px', fontSize: '12px', color: '#DC2626' }}>
                    {importError}
                  </div>
                )}
                {bulkRecipients.map((rec, index) => {
                  // Adjust grid columns based on transfer type and method
                  const isInternational = transferType === 'international';
                  // For local: [Bank/MNO] [Recipient Name] [Account/Phone] [Amount] [Delete]
                  // For international: [Country] [Bank/MNO] [Recipient Name] [Account/Phone] [Amount] [Delete]
                  const gridCols = isInternational 
                    ? '150px 150px 180px 180px 150px 40px'
                    : '150px 180px 180px 150px 40px';
                  
                  return (
                  <div
                    key={rec.id}
                    style={{
                      marginBottom: '12px',
                      display: 'grid',
                        gridTemplateColumns: gridCols,
                      gap: '10px',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      boxSizing: 'border-box',
                      maxWidth: '100%'
                    }}
                  >
                      {/* Country selector for international - shown first */}
                      {isInternational && (
                        <select 
                          value={rec.country || selectedCountry} 
                  onChange={(e) => {
                        const updated = [...bulkRecipients];
                            updated[index].country = e.target.value; 
                            // If switching country and MNO doesn't support it, clear MNO
                            if (transferMethod === 'mno' && !supportsMno(e.target.value)) {
                              updated[index].mno = '';
                            }
                        setBulkRecipients(updated);
                      }}
                          disabled={loading}
                          style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: loading ? '#f3f4f6' : 'white', boxSizing: 'border-box' }}
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.code} value={country.name}>{country.name}</option>
                          ))}
                        </select>
                      )}
                      
                      {/* Bank or MNO selector */}
                      {transferMethod === 'bank' ? (
                      <select value={rec.bank} onChange={(e) => { const updated = [...bulkRecipients]; updated[index].bank = e.target.value; setBulkRecipients(updated); }} disabled={loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', backgroundColor: loading ? '#f3f4f6' : 'white', boxSizing: 'border-box' }}>
                        <option value="">Select Bank</option>
                        {banks.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                      ) : (
                        <select 
                          value={rec.mno} 
                      onChange={(e) => {
                        const updated = [...bulkRecipients];
                            updated[index].mno = e.target.value; 
                        setBulkRecipients(updated);
                      }}
                          disabled={(isInternational && rec.country && !supportsMno(rec.country)) || loading}
                  style={{
                            width: '100%', 
                            padding: '12px 20px', 
                    border: '1px solid #d1d5db',
                            borderRadius: '20px', 
                          fontSize: '14px',
                            backgroundColor: (isInternational && rec.country && !supportsMno(rec.country)) || loading ? '#f3f4f6' : 'white', 
                            boxSizing: 'border-box',
                            cursor: (isInternational && rec.country && !supportsMno(rec.country)) || loading ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <option value="">Select MNO</option>
                          {mnos.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    )}
                      
                      {/* Recipient Name */}
                      <input type="text" value={rec.recipientName} onChange={(e) => { const updated = [...bulkRecipients]; updated[index].recipientName = e.target.value; setBulkRecipients(updated); }} placeholder="Recipient name" disabled={loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
                      
                      {/* Account/Phone Number */}
                      <input type="text" value={rec.account} onChange={(e) => { const updated = [...bulkRecipients]; updated[index].account = e.target.value; setBulkRecipients(updated); }} placeholder={transferMethod === 'bank' ? 'Account number' : 'Phone number'} disabled={loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
                      
                      {/* Amount */}
                      <input type="number" value={rec.amount} onChange={(e) => { const updated = [...bulkRecipients]; updated[index].amount = e.target.value; setBulkRecipients(updated); }} placeholder="Amount (TZS)" disabled={loading} style={{ width: '100%', padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
                      
                    {bulkRecipients.length > 1 && (
                      <button onClick={() => setBulkRecipients(bulkRecipients.filter((_, i) => i !== index))} disabled={loading} style={{ width: '40px', height: '40px', backgroundColor: loading ? '#9ca3af' : '#EF4444', color: 'white', border: 'none', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: '600', boxSizing: 'border-box', flexShrink: 0 }}>×</button>
                    )}
                  </div>
                  );
                })}
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
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box',
                backgroundColor: loading ? '#f3f4f6' : 'white'
              }}
            />
          </div>

          {/* Transfer Button */}
          <button
            onClick={handleTransfer}
            disabled={loading || loadingCards || cards.length === 0}
            style={{
              width: '360px',
              padding: '12px 20px',
              backgroundColor: (loading || loadingCards || cards.length === 0) ? '#9ca3af' : 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (loading || loadingCards || cards.length === 0) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
              opacity: (loading || loadingCards || cards.length === 0) ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (!loading && !loadingCards && cards.length > 0) {
              e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading && !loadingCards && cards.length > 0) {
              e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
              }
            }}
          >
            {loading ? 'Processing...' : 'Initiate Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
}
