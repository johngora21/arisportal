'use client';

import React from 'react';
import { X, User, Building, DollarSign, Calendar, FileText, Shield } from 'lucide-react';

interface EscrowAccount {
  id: number;
  escrow_id: string;
  title: string;
  description: string;
  payer_name: string;
  payer_email: string;
  payer_phone: string;
  payee_name: string;
  payee_email: string;
  payee_phone: string;
  total_amount: number;
  payment_type: string;
  release_date: string;
  terms: string;
  additional_notes: string;
  status: string;
  created_at: string;
  updated_at: string;
  milestones?: any[];
  created_by: string;
  completed_at?: string;
  cancelled_at?: string;
  cancelled_reason?: string;
}

interface ViewEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrow: EscrowAccount | null;
}

const ViewEscrowModal: React.FC<ViewEscrowModalProps> = ({ isOpen, onClose, escrow }) => {
  if (!isOpen || !escrow) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#3b82f6';
      case 'PENDING': return '#f59e0b';
      case 'COMPLETED': return '#10b981';
      case 'CANCELLED': return '#ef4444';
      case 'DISPUTED': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
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
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              padding: '12px', 
              backgroundColor: "var(--mc-sidebar-bg)", 
              borderRadius: '12px',
              color: 'white'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Escrow Details
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                {escrow.escrow_id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Badge */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: getStatusColor(escrow.status),
            color: 'white',
            textTransform: 'capitalize'
          }}>
            {escrow.status}
          </span>
        </div>

        {/* Transaction Details */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FileText size={20} />
            Transaction Details
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Title
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937'
              }}>
                {escrow.title}
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Description
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937',
                minHeight: '60px'
              }}>
                {escrow.description || 'No description provided'}
              </div>
            </div>
          </div>
        </div>

        {/* Payer Information */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <User size={20} />
            Payer Information
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Name
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937'
              }}>
                {escrow.payer_name}
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Email
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937'
              }}>
                {escrow.payer_email}
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Phone
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937'
              }}>
                {escrow.payer_phone}
              </div>
            </div>
          </div>
        </div>

        {/* Payee Information */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Building size={20} />
            Payee Information
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Name
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937'
              }}>
                {escrow.payee_name}
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Email
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937'
              }}>
                {escrow.payee_email}
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Phone
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937'
              }}>
                {escrow.payee_phone}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <DollarSign size={20} />
            Payment Information
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Total Amount
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                {formatCurrency(escrow.total_amount)}
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Payment Type
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937'
              }}>
                {escrow.payment_type}
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Release Date
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937'
              }}>
                {escrow.release_date ? new Date(escrow.release_date).toLocaleDateString() : 'TBD'}
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Created Date
              </label>
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937'
              }}>
                {new Date(escrow.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Notes */}
        {(escrow.terms || escrow.additional_notes) && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FileText size={20} />
              Additional Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {escrow.terms && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6b7280' 
                  }}>
                    Terms & Conditions
                  </label>
                  <div style={{ 
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#1f2937',
                    minHeight: '60px'
                  }}>
                    {escrow.terms}
                  </div>
                </div>
              )}

              {escrow.additional_notes && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6b7280' 
                  }}>
                    Additional Notes
                  </label>
                  <div style={{ 
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#1f2937',
                    minHeight: '60px'
                  }}>
                    {escrow.additional_notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Milestones */}
        {escrow.payment_type === 'MILESTONE' && escrow.milestones && escrow.milestones.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Calendar size={20} />
              Milestones
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {escrow.milestones.map((milestone, index) => (
                <div key={milestone.id} style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '8px' 
                  }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                      Milestone {milestone.milestone_number}
                    </h4>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: milestone.status === 'completed' ? '#10b981' : '#f59e0b',
                      color: 'white',
                      textTransform: 'capitalize'
                    }}>
                      {milestone.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
                    {milestone.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                    <span>Amount: {formatCurrency(milestone.amount)}</span>
                    <span>Due: {new Date(milestone.completion_date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: "var(--mc-sidebar-bg)",
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "var(--mc-sidebar-bg)";
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEscrowModal;
