'use client';

import React, { useState } from 'react';
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
  User
} from 'lucide-react';
import CreateEscrowModal from './components/CreateEscrowModal';

export default function EscrowPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock escrow data
  const escrowAccounts = [
    {
      id: 'ESC-001',
      title: 'Property Purchase - Dar es Salaam',
      buyer: 'John Mwalimu',
      seller: 'ABC Real Estate Ltd',
      amount: 45000000,
      status: 'active',
      createdDate: '2024-01-15',
      releaseDate: '2024-02-15',
      description: 'Escrow for apartment purchase in Kinondoni'
    },
    {
      id: 'ESC-002',
      title: 'Equipment Sale Contract',
      buyer: 'Tech Solutions Inc',
      seller: 'Industrial Equipment Co',
      amount: 12500000,
      status: 'pending',
      createdDate: '2024-01-20',
      releaseDate: '2024-02-05',
      description: 'Heavy machinery sale with inspection period'
    },
    {
      id: 'ESC-003',
      title: 'Service Agreement - Consulting',
      buyer: 'Government Agency',
      seller: 'Professional Consultants',
      amount: 8500000,
      status: 'completed',
      createdDate: '2024-01-10',
      releaseDate: '2024-01-25',
      description: 'IT consulting services completion'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Lock size={16} color="#3b82f6" />;
      case 'pending': return <Clock size={16} color="#f59e0b" />;
      case 'completed': return <CheckCircle size={16} color="#10b981" />;
      case 'cancelled': return <XCircle size={16} color="#ef4444" />;
      default: return <Lock size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
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
            {escrowAccounts.filter(acc => acc.status === 'active').length}
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Shield size={20} color="#10b981" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total in Escrow</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {formatCurrency(escrowAccounts.reduce((sum, acc) => sum + acc.amount, 0))}
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Clock size={20} color="#f59e0b" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Pending Release</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {escrowAccounts.filter(acc => acc.status === 'pending').length}
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <CheckCircle size={20} color="#8b5cf6" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Completed</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {escrowAccounts.filter(acc => acc.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'all', label: 'All', icon: <Shield size={16} /> },
          { id: 'active', label: 'Active', icon: <Lock size={16} /> },
          { id: 'pending', label: 'Pending', icon: <Clock size={16} /> },
          { id: 'completed', label: 'Completed', icon: <CheckCircle size={16} /> }
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
                        {account.id}
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
                        <span style={{ color: '#6b7280' }}>Buyer: </span>
                        <span style={{ color: '#1f2937', fontWeight: '500' }}>{account.buyer}</span>
          </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building size={14} color="#6b7280" />
                        <span style={{ color: '#6b7280' }}>Seller: </span>
                        <span style={{ color: '#1f2937', fontWeight: '500' }}>{account.seller}</span>
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
                      {formatCurrency(account.amount)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                      Release: {new Date(account.releaseDate).toLocaleDateString()}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button style={{
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
                        gap: '4px'
                      }}>
                        <Eye size={12} />
                        View
                      </button>
                      {account.status === 'pending' && (
                        <button style={{
                          padding: '8px 12px',
                          backgroundColor: "var(--mc-sidebar-bg)",
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <LockOpen size={12} />
                          Release
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
        onCreate={(escrowData) => {
          console.log('New escrow created:', escrowData);
          // Here you would typically add the new escrow to your state or API
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}