'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock,
  FileText,
  Shield,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export default function FinanceDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
          Finance Dashboard
            </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: '8px 0 0 0' }}>
          Overview of cashflow, pending collections, invoices, and escrow
            </p>
          </div>



        {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '20px', 
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} color="var(--mc-sidebar-bg)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>TZS 2.4M</div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
            Total Cashflow
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            +12% from last month
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '20px', 
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={24} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>TZS 850K</div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
            Pending Collections
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            5 invoices pending
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '20px', 
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={24} color="#10b981" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>23</div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
            Active Invoices
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            18 paid, 5 pending
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '20px', 
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#f3e8ff', 
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={24} color="#8b5cf6" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>TZS 1.2M</div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
            Escrow Funds
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            3 active accounts
          </div>
            </div>
          </div>

    </div>
  );
}



