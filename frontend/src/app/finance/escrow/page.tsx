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
import ReleaseEscrowModal from './components/ReleaseEscrowModal';
import { useCurrency } from '../../../contexts/CurrencyContext';

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
  control_number?: string | null;
  payout_method?: string | null;
  payout_details?: any;
  payout_status?: string | null;
  payout_reference?: string | null;
  payout_provider_response?: any;
  release_transaction_hash?: string | null;
  release_block_number?: number | null;
  released_via_web3?: boolean | null;
}

export default function EscrowPage() {
  const { formatCurrency } = useCurrency();
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
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [releaseEscrowTarget, setReleaseEscrowTarget] = useState<EscrowAccount | null>(null);
  const [releasingEscrow, setReleasingEscrow] = useState(false);

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
  const handleViewContract = async (escrowId: string) => {
    if (contractData) {
      setShowContractModal(true);
      return;
    }
    
    setLoadingContract(true);
    try {
      // Pass the escrow_id to fetch real escrow data
      const response = await fetch(`${API_CONFIG.BASE_URL}/escrow/contract/document?escrow_id=${escrowId}`);
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

  const handleReleaseEscrow = (account: EscrowAccount) => {
    setReleaseEscrowTarget(account);
    setReleaseModalOpen(true);
  };

  const handleSubmitRelease = async (payload: any) => {
    if (!releaseEscrowTarget) return;

    const escrowId = releaseEscrowTarget.escrow_id;
    try {
      setReleasingEscrow(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/escrow/${escrowId}/release`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to release escrow: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      await fetchEscrows();
      setReleaseModalOpen(false);
      setReleaseEscrowTarget(null);
      alert(`Escrow ${escrowId} release status: ${result.payout_status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to release escrow');
      console.error('Error releasing escrow:', err);
    } finally {
      setReleasingEscrow(false);
    }
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
                        onClick={() => handleViewContract(account.escrow_id)}
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
                          onClick={() => handleReleaseEscrow(account)}
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
                          onClick={() => handleReleaseEscrow(account)}
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
                    {account.control_number && (
                      <div style={{ fontSize: '12px', color: '#334155', marginTop: '12px' }}>
                        <strong>Control #:</strong> {account.control_number}
                      </div>
                    )}
                    {account.payout_status && (
                      <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
                        <strong>Payout Status:</strong> {account.payout_status}
                        {account.payout_method ? ` · ${account.payout_method.toUpperCase()}` : ''}
                      </div>
                    )}
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

      <ReleaseEscrowModal
        isOpen={releaseModalOpen}
        escrow={releaseEscrowTarget}
        isSubmitting={releasingEscrow}
        onClose={() => {
          if (!releasingEscrow) {
            setReleaseModalOpen(false);
            setReleaseEscrowTarget(null);
          }
        }}
        onSubmit={handleSubmitRelease}
      />

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