'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  LockOpen,
  ArrowRight,
  Building,
  User,
  Code
} from 'lucide-react';
import { API_CONFIG } from '../../../config/api';
import CreateEscrowModal from './components/CreateEscrowModal';
import ViewEscrowModal from './components/ViewEscrowModal';
import ContractSignatureModal from './components/ContractSignatureModal';

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

export default function EscrowPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractData, setContractData] = useState<any>(null);
  const [loadingContract, setLoadingContract] = useState(false);
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowAccount | null>(null);
  const [escrowAccounts, setEscrowAccounts] = useState<EscrowAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch escrows from API
  const fetchEscrows = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/escrow/`);
      if (!response.ok) {
        throw new Error('Failed to fetch escrows');
      }
      const data = await response.json();
      // Sort by creation date (newest first)
      const sortedData = data.sort((a: EscrowAccount, b: EscrowAccount) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setEscrowAccounts(sortedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching escrows:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch escrow statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/escrow/stats/summary`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const stats = await response.json();
      return stats;
    } catch (err) {
      console.error('Error fetching stats:', err);
      return {
        total_escrows: 0,
        active_escrows: 0,
        pending_escrows: 0,
        completed_escrows: 0,
        cancelled_escrows: 0,
        total_amount_in_escrow: 0
      };
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchEscrows();
  }, []);

  // Create new escrow
  const handleCreateEscrow = async (escrowData: any) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/escrow/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(escrowData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to create escrow: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      
      // Refresh the escrow list
      await fetchEscrows();
      setShowCreateModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create escrow');
      console.error('Error creating escrow:', err);
    }
  };

  // Update escrow status
  const handleUpdateStatus = async (escrowId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/escrow/${escrowId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh the escrow list
      await fetchEscrows();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      console.error('Error updating status:', err);
    }
  };

  // View escrow details
  const handleViewEscrow = (escrowId: string) => {
    const escrow = escrowAccounts.find(acc => acc.escrow_id === escrowId);
    if (escrow) {
      setSelectedEscrow(escrow);
      setShowViewModal(true);
    }
  };

  // View smart contract
  const handleViewContract = async () => {
    if (contractData) {
      setShowContractModal(true);
      return;
    }
    
    setLoadingContract(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/escrow/contract/document`);
      if (!response.ok) throw new Error('Failed to fetch contract');
      const data = await response.json();
      setContractData(data);
      setShowContractModal(true);
    } catch (err) {
      console.error('Error fetching contract:', err);
      alert('Failed to load smart contract');
    } finally {
      setLoadingContract(false);
    }
  };

  // Release escrow funds
  const handleReleaseEscrow = async (escrowId: string) => {
    if (!confirm(`Are you sure you want to release funds for escrow ${escrowId}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/escrow/${escrowId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });

      if (!response.ok) {
        throw new Error('Failed to release escrow');
      }

      // Refresh the escrow list
      await fetchEscrows();
      alert(`Escrow ${escrowId} has been released successfully!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to release escrow');
      console.error('Error releasing escrow:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Lock size={16} color="#3b82f6" />;
      case 'PENDING': return <Clock size={16} color="#f59e0b" />;
      case 'COMPLETED': return <CheckCircle size={16} color="#10b981" />;
      case 'CANCELLED': return <XCircle size={16} color="#ef4444" />;
      case 'DISPUTED': return <XCircle size={16} color="#8b5cf6" />;
      default: return <Lock size={16} />;
    }
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
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Escrow Management
        </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Secure funds for transactions and contracts
        </p>
      </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: "var(--mc-sidebar-bg)",
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Plus size={16} />
            Create Escrow
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Lock size={20} color="var(--mc-sidebar-bg)" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Active Escrows</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {escrowAccounts.filter(acc => acc.status === 'ACTIVE').length}
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Shield size={20} color="#10b981" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total in Escrow</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {formatCurrency(escrowAccounts.reduce((sum, acc) => sum + acc.total_amount, 0))}
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Clock size={20} color="#f59e0b" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Pending Release</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {escrowAccounts.filter(acc => acc.status === 'PENDING').length}
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <CheckCircle size={20} color="#8b5cf6" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Completed</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {escrowAccounts.filter(acc => acc.status === 'COMPLETED').length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'all', label: 'All', icon: <Shield size={16} /> },
          { id: 'ACTIVE', label: 'Active', icon: <Lock size={16} /> },
          { id: 'PENDING', label: 'Pending', icon: <Clock size={16} /> },
          { id: 'COMPLETED', label: 'Completed', icon: <CheckCircle size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? 'var(--mc-sidebar-bg)' : 'white',
              color: activeTab === tab.id ? 'white' : '#6b7280',
              boxShadow: activeTab === tab.id ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Escrow Accounts List */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Escrow Accounts
        </h3>
        </div>

        <div style={{ padding: '0' }}>
          {escrowAccounts
            .filter(account => activeTab === 'all' || account.status === activeTab)
            .map((account) => (
              <div
                key={account.id}
                style={{
                  padding: '24px',
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: getStatusColor(account.status),
                        color: 'white',
                        textTransform: 'capitalize'
                      }}>
                        {account.status}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#6b7280',
                        fontWeight: '500'
                      }}>
                        {account.escrow_id}
                      </span>
          </div>

                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#1f2937', 
                      margin: '0 0 8px 0' 
                    }}>
                      {account.title}
                    </h4>
                    
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {account.description}
                    </p>

                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} color="#6b7280" />
                        <span style={{ color: '#6b7280' }}>Payer: </span>
                        <span style={{ color: '#1f2937', fontWeight: '500' }}>{account.payer_name}</span>
          </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building size={14} color="#6b7280" />
                        <span style={{ color: '#6b7280' }}>Payee: </span>
                        <span style={{ color: '#1f2937', fontWeight: '500' }}>{account.payee_name}</span>
          </div>
        </div>
      </div>

                  <div style={{ textAlign: 'right', minWidth: '200px' }}>
      <div style={{ 
                      fontSize: '20px', 
                      fontWeight: '700', 
                      color: '#1f2937', 
                      marginBottom: '4px' 
                    }}>
                      {formatCurrency(account.total_amount)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                      Release: {account.release_date ? new Date(account.release_date).toLocaleDateString() : 'TBD'}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleViewEscrow(account.escrow_id)}
                        style={{
                        padding: '8px 12px',
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#e2e8f0';
                          e.currentTarget.style.color = '#374151';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.color = '#6b7280';
                        }}
                      >
                        <Eye size={12} />
                        View
                      </button>
                      <button 
                        onClick={handleViewContract}
                        disabled={loadingContract}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#374151',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'white',
                          cursor: loadingContract ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease',
                          opacity: loadingContract ? 0.5 : 1
                        }}
                        onMouseOver={(e) => {
                          if (!loadingContract) {
                            e.currentTarget.style.backgroundColor = '#1f2937';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!loadingContract) {
                            e.currentTarget.style.backgroundColor = '#374151';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        <Code size={12} />
                        Contract
                      </button>
                      {account.status === 'PENDING' && (
                        <button 
                          onClick={() => handleReleaseEscrow(account.escrow_id)}
                          style={{
                          padding: '8px 12px',
                          backgroundColor: '#10b981',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#059669';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#10b981';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <LockOpen size={12} />
                          Release
                        </button>
                      )}
                      {account.status === 'ACTIVE' && (
                        <button 
                          onClick={() => handleReleaseEscrow(account.escrow_id)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#10b981',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#059669';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#10b981';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <CheckCircle size={12} />
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Create Escrow Modal */}
      <CreateEscrowModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateEscrow}
      />

      {/* View Escrow Modal */}
      <ViewEscrowModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedEscrow(null);
        }}
        escrow={selectedEscrow}
      />

      {/* Contract Signature Modal */}
      {showContractModal && contractData && (
        <ContractSignatureModal
          isOpen={showContractModal}
          onClose={() => {
            setShowContractModal(false);
            setContractData(null);
          }}
          escrow={selectedEscrow}
          contractData={contractData}
        />
      )}

      {/* Old Modal - Keep for backwards compatibility if needed */}
      {false && showContractModal && contractData && (
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
            maxWidth: '800px',
            maxHeight: '95vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  ⚖️
                </div>
              <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>
                    Escrow Agreement
                </h2>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    {contractData.contract_name}
                </p>
                </div>
              </div>
              <button
                onClick={() => setShowContractModal(false)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <XCircle size={24} color="#6b7280" />
              </button>
            </div>

            {/* Document Preview */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '40px',
              backgroundColor: '#ffffff'
            }}>
              {contractData.format === 'pdf' ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  {/* Document Preview */}
                  <div style={{
                    width: '100%',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '12px',
                    border: '2px dashed #d1d5db',
                    padding: '48px 32px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '64px',
                      marginBottom: '16px'
                    }}>📋</div>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#111827',
                      margin: '0 0 8px 0'
                    }}>
                      Legal Agreement Ready
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      color: '#6b7280',
                      margin: '0 0 24px 0',
                      lineHeight: '1.6'
                    }}>
                      This contract document includes all terms, conditions, and signature sections for both parties to execute.
                    </p>
                    
                    <div style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'left',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        color: '#6b7280',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Document Details
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#111827',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div><strong>Type:</strong> Legal Escrow Agreement</div>
                        <div><strong>Format:</strong> PDF Document</div>
                        <div><strong>Status:</strong> Ready for Download & Signature</div>
                      </div>
                    </div>
            </div>

              <button
                onClick={() => {
                      const byteCharacters = atob(contractData.code);
                      const byteNumbers = new Array(byteCharacters.length);
                      for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                      }
                      const byteArray = new Uint8Array(byteNumbers);
                      const blob = new Blob([byteArray], { type: 'application/pdf' });
                      
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = contractData.contract_name;
                  a.click();
                  URL.revokeObjectURL(url);
                      setShowContractModal(false);
                }}
                style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 32px',
                      backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px -2px rgba(59, 130, 246, 0.4)',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(59, 130, 246, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(59, 130, 246, 0.4)';
                    }}
                  >
                    <Eye size={20} />
                    Download & Sign Contract
              </button>
                  
                  <p style={{
                    fontSize: '13px',
                    color: '#9ca3af',
                    margin: '8px 0 0 0',
                    textAlign: 'center'
                  }}>
                    Download to print, sign, and share with both parties
                  </p>
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  padding: '24px',
                  fontFamily: 'Monaco, Menlo, monospace'
                }}>
                  <pre style={{
                    margin: 0,
                    color: '#e2e8f0',
                    fontSize: '12px',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }}>
                    {contractData.code}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 1000,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          {error}
        </div>
      )}

      {/* Loading Display */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#6b7280',
          zIndex: 1000,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          Loading escrows...
        </div>
      )}
    </div>
  );
}