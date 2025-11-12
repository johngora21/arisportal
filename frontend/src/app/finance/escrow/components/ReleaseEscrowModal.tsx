import React, { useEffect, useMemo, useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EscrowAccount {
  escrow_id: string;
  payee_name: string;
  payee_phone: string;
  payout_method?: string | null;
  payout_details?: any;
  total_amount: number;
  currency?: string;
}

interface ReleaseEscrowModalProps {
  isOpen: boolean;
  escrow: EscrowAccount | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: { payoutMethod: 'mno' | 'bank'; payoutDetails: Record<string, any> }) => Promise<void>;
}

const BANK_OPTIONS = [
  { key: 'crdb', label: 'CRDB Bank' },
  { key: 'nmb', label: 'NMB Bank' },
  { key: 'equity', label: 'Equity Bank Tanzania' },
  { key: 'absa', label: 'Absa Bank Tanzania' },
  { key: 'stanbic', label: 'Stanbic Bank Tanzania' },
  { key: 'exim', label: 'Exim Bank Tanzania' },
  { key: 'diamond', label: 'Diamond Trust Bank' },
  { key: 'kcb', label: 'KCB Bank Tanzania' },
  { key: 'national', label: 'National Bank of Commerce' },
  { key: 'barclays', label: 'Barclays Bank Tanzania' },
];

const MNO_OPTIONS = [
  { key: 'vodacom', label: 'Vodacom M-Pesa' },
  { key: 'airtel', label: 'Airtel Money' },
  { key: 'tigo', label: 'Tigo Pesa' },
  { key: 'halotel', label: 'Halopesa' },
  { key: 'ttcl', label: 'TTCL Pesa' },
];

const initialMnoForm = {
  phone: '',
  mno: 'vodacom',
  recipientName: '',
  walletAddress: '',
};

const initialBankForm = {
  bankKey: 'crdb',
  accountName: '',
  accountNumber: '',
  branchCode: '',
  walletAddress: '',
};

const ReleaseEscrowModal: React.FC<ReleaseEscrowModalProps> = ({ isOpen, escrow, isSubmitting, onClose, onSubmit }) => {
  const [selectedMethod, setSelectedMethod] = useState<'mno' | 'bank'>('mno');
  const [mnoForm, setMnoForm] = useState(initialMnoForm);
  const [bankForm, setBankForm] = useState(initialBankForm);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const existingDetails = useMemo(() => {
    if (!escrow || !escrow.payout_details) return null;
    if (typeof escrow.payout_details === 'string') {
      try {
        return JSON.parse(escrow.payout_details);
      } catch (parseError) {
        return null;
      }
    }
    return escrow.payout_details;
  }, [escrow]);

  useEffect(() => {
    if (!isOpen || !escrow) return;

    setError(null);
    setSuccessMessage(null);

    if (existingDetails && existingDetails.method) {
      const method = existingDetails.method === 'bank' ? 'bank' : 'mno';
      setSelectedMethod(method);

      if (method === 'mno') {
        setMnoForm({
          phone: existingDetails.phone || escrow.payee_phone || '',
          mno: existingDetails.mno || 'vodacom',
          recipientName: existingDetails.recipient_name || escrow.payee_name || '',
          walletAddress: existingDetails.walletAddress || '',
        });
      } else {
        setBankForm({
          bankKey: existingDetails.bankKey || 'crdb',
          accountName: existingDetails.accountName || escrow.payee_name || '',
          accountNumber: existingDetails.accountNumber || '',
          branchCode: existingDetails.branchCode || '',
          walletAddress: existingDetails.walletAddress || '',
        });
      }
    } else {
      setSelectedMethod('mno');
      setMnoForm({
        phone: escrow.payee_phone || '',
        mno: 'vodacom',
        recipientName: escrow.payee_name || '',
        walletAddress: '',
      });
      setBankForm({ ...initialBankForm, accountName: escrow.payee_name || '' });
    }
  }, [isOpen, escrow, existingDetails]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!escrow) return;

    setError(null);
    setSuccessMessage(null);

    try {
      if (selectedMethod === 'mno') {
        if (!mnoForm.phone.trim()) {
          throw new Error('Phone number is required for mobile money payout.');
        }
        if (!mnoForm.mno) {
          throw new Error('Please select a mobile network operator.');
        }

        await onSubmit({
          payoutMethod: 'mno',
          payoutDetails: {
            phone: mnoForm.phone.trim(),
            mno: mnoForm.mno,
            payeeName: mnoForm.recipientName?.trim() || escrow.payee_name,
            walletAddress: mnoForm.walletAddress?.trim() || undefined,
          },
        });
      } else {
        if (!bankForm.accountName.trim()) {
          throw new Error('Account name is required for bank payout.');
        }
        if (!bankForm.accountNumber.trim()) {
          throw new Error('Account number is required for bank payout.');
        }

        await onSubmit({
          payoutMethod: 'bank',
          payoutDetails: {
            bankKey: bankForm.bankKey,
            accountName: bankForm.accountName.trim(),
            accountNumber: bankForm.accountNumber.trim(),
            branchCode: bankForm.branchCode?.trim() || undefined,
            walletAddress: bankForm.walletAddress?.trim() || undefined,
          },
        });
      }

      setSuccessMessage('Escrow release initiated successfully.');
    } catch (submitError: any) {
      const message = submitError?.detail || submitError?.message || 'Failed to submit payout details.';
      setError(message);
    }
  };

  if (!isOpen || !escrow) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(4px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '95vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Release Escrow Funds</h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Escrow {escrow.escrow_id} · Amount {escrow.currency || 'TZS'} {escrow.total_amount.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid #cbd5f5',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <X size={18} color="#0f172a" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
              Select payout method
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setSelectedMethod('mno')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: selectedMethod === 'mno' ? '2px solid var(--mc-sidebar-bg)' : '1px solid #cbd5f5',
                  backgroundColor: selectedMethod === 'mno' ? 'rgba(59, 130, 246, 0.08)' : 'white',
                  color: '#0f172a',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Mobile Money (MNO)
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('bank')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: selectedMethod === 'bank' ? '2px solid var(--mc-sidebar-bg)' : '1px solid #cbd5f5',
                  backgroundColor: selectedMethod === 'bank' ? 'rgba(59, 130, 246, 0.08)' : 'white',
                  color: '#0f172a',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Bank Transfer (ACH)
              </button>
            </div>
          </div>

          {selectedMethod === 'mno' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                  Mobile Network
                </label>
                <select
                  value={mnoForm.mno}
                  onChange={(e) => setMnoForm((prev) => ({ ...prev, mno: e.target.value as typeof prev.mno }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5f5',
                    fontSize: '14px',
                  }}
                >
                  {MNO_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                  Payee Phone Number (format: 255XXXXXXXXX)
                </label>
                <input
                  type="text"
                  value={mnoForm.phone}
                  onChange={(e) => setMnoForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="255710000000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5f5',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                  Recipient Name (optional override)
                </label>
                <input
                  type="text"
                  value={mnoForm.recipientName}
                  onChange={(e) => setMnoForm((prev) => ({ ...prev, recipientName: e.target.value }))}
                  placeholder={escrow.payee_name}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5f5',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                  Payee Wallet Address (for Web3, optional)
                </label>
                <input
                  type="text"
                  value={mnoForm.walletAddress}
                  onChange={(e) => setMnoForm((prev) => ({ ...prev, walletAddress: e.target.value }))}
                  placeholder="0x..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5f5',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                  Bank
                </label>
                <select
                  value={bankForm.bankKey}
                  onChange={(e) => setBankForm((prev) => ({ ...prev, bankKey: e.target.value as typeof prev.bankKey }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5f5',
                    fontSize: '14px',
                  }}
                >
                  {BANK_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                  Account Name
                </label>
                <input
                  type="text"
                  value={bankForm.accountName}
                  onChange={(e) => setBankForm((prev) => ({ ...prev, accountName: e.target.value }))}
                  placeholder="Payee account name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5f5',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                  Account Number
                </label>
                <input
                  type="text"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="e.g. 0123456789"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5f5',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                  Branch Code (optional)
                </label>
                <input
                  type="text"
                  value={bankForm.branchCode}
                  onChange={(e) => setBankForm((prev) => ({ ...prev, branchCode: e.target.value }))}
                  placeholder="Branch code"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5f5',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                  Payee Wallet Address (for Web3, optional)
                </label>
                <input
                  type="text"
                  value={bankForm.walletAddress}
                  onChange={(e) => setBankForm((prev) => ({ ...prev, walletAddress: e.target.value }))}
                  placeholder="0x..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5f5',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '18px',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#b91c1c',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {successMessage && (
            <div style={{
              marginTop: '18px',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: '#047857',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
            }}>
              <CheckCircle2 size={16} />
              {successMessage}
            </div>
          )}

          <div style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '20px',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid #cbd5f5',
                backgroundColor: 'white',
                color: '#0f172a',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isSubmitting ? '#94a3b8' : 'var(--mc-sidebar-bg)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 16px -6px rgba(59, 130, 246, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isSubmitting ? 'Releasing…' : 'Release Funds'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReleaseEscrowModal;
