'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface ContractSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrow: any;
  contractData: any;
}

export default function ContractSignatureModal({
  isOpen,
  onClose,
  escrow,
  contractData
}: ContractSignatureModalProps) {
  const [payerSigned, setPayerSigned] = useState(false);

  const handleSign = async () => {
    if (!escrow || payerSigned) return;
    
    // Generate digital signature for payer
    const signature = generateDigitalSignature(escrow.payer_name || 'Unknown');
    
    // Save signature (this would be sent to backend)
    console.log('Payer signed with signature:', signature);
    
    // Update UI
    setPayerSigned(true);
    
    // Send email to payee for their signature
    // TODO: Implement email sending to payee
    // Note: Payee will receive contract via email for their digital signature
  };

  const generateDigitalSignature = (name: string): string => {
    // Generate a styled text signature
    const timestamp = new Date().toISOString();
    return btoa(JSON.stringify({
      name,
      timestamp,
      hash: Math.random().toString(36).substring(2, 15)
    }));
  };

  const displayContract = () => {
    if (contractData.format === 'pdf') {
      // Decode and display PDF in iframe
      const byteCharacters = atob(contractData.code);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      // Add parameters to hide Chrome PDF viewer controls
      return `${url}#toolbar=0&navpanes=0&scrollbar=0`;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '95%',
        maxWidth: '1400px',
        height: '98vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '12px 20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
              Escrow Agreement
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={18} color="#6b7280" />
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          backgroundColor: '#f3f4f6',
          padding: '0 20px'
        }}>
          {contractData.format === 'pdf' && (
            <iframe
              src={displayContract() || undefined}
              width="100%"
              height="100%"
              style={{
                border: 'none',
                borderRadius: '12px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              title="Contract PDF"
            />
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <button
            onClick={handleSign}
            disabled={payerSigned}
            style={{
              padding: '10px 28px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: payerSigned ? '#10b981' : 'var(--mc-sidebar-bg)',
              color: 'white',
              cursor: payerSigned ? 'default' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {payerSigned ? (
              <>
                <span>✓</span>
                <span>Signed & Sent to {escrow?.payee_name || 'Payee'}</span>
              </>
            ) : (
              `Sign as ${escrow?.payer_name || 'Payer'}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

