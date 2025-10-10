'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical,
  Shield,
  Download,
  Clock,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Lock,
  LockOpen
} from 'lucide-react';

export default function EscrowPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
          Escrow
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: '8px 0 0 0' }}>
          Create and manage escrow accounts for contracts, sales, or services
        </p>
      </div>

      {/* Search and Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'flex-end'
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af',
              width: '16px',
              height: '20px'
            }} 
          />
          <input
            type="text"
            placeholder="Search escrow accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px'
            }}
          />
        </div>
        
        {/* Status Filter - rightmost */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              background: 'white',
              width: '180px'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending Release</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <button style={{
          padding: '12px 16px',
          backgroundColor: 'var(--mc-sidebar-bg)',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Plus size={16} />
          Create Escrow
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <button
            style={{
              flex: 1,
              padding: '16px 20px',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Plus size={16} />
            Create Escrow
          </button>
          <button
            style={{
              flex: 1,
              padding: '16px 20px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Eye size={16} />
            Monitor Funds
          </button>
          <button
            style={{
              flex: 1,
              padding: '16px 20px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <LockOpen size={16} />
            Release Funds
          </button>
          <button
            style={{
              flex: 1,
              padding: '16px 20px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={16} />
            Auto Release
          </button>
        </div>
      </div>

      {/* Escrow Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '20px', 
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            <Lock size={24} color="var(--mc-sidebar-bg)" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>3</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Accounts</div>
        </div>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '20px', 
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            <Download size={24} color="#10b981" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>TZS 1.2M</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Funds</div>
        </div>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '20px', 
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            <Clock size={24} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>2</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Pending Release</div>
        </div>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '20px', 
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            <LockOpen size={24} color="#10b981" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>12</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Completed</div>
        </div>
      </div>

      {/* Escrow Accounts */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '20px', 
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Active Escrow Accounts
        </h3>
        <div style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '40px' }}>
          Escrow account management features will be implemented here
        </div>
      </div>
    </div>
  );
}