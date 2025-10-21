'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  FileText,
  Download,
  Clock,
  RefreshCw,
  Receipt,
  Layout
} from 'lucide-react';
import { InvoicesTab, TemplatesTab, CreateInvoiceModal } from './components';

export default function InvoicingPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'templates'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const renderTabContent = () => {
    if (activeTab === 'invoices') {
      return (
        <InvoicesTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          durationFilter={durationFilter}
          setDurationFilter={setDurationFilter}
        />
      );
    }

    if (activeTab === 'templates') {
      return <TemplatesTab />;
    }

    return null;
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Invoicing
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Create invoices, track payments, and manage collections
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: 'var(--mc-sidebar-bg)',
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
            New Invoice
          </button>
        </div>
      </div>

      {/* Invoice Status */}
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
            <FileText size={24} color="var(--mc-sidebar-bg)" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>23</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Invoices</div>
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
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>18</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Paid</div>
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
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>5</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Pending</div>
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
            <RefreshCw size={24} color="#ef4444" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>0</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Overdue</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'invoices', label: 'My Invoices', icon: <Receipt size={16} /> },
          { id: 'templates', label: 'Templates', icon: <Layout size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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

      {/* Content */}
      {renderTabContent()}

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={(invoiceData) => {
          console.log('Invoice saved:', invoiceData);
          // Handle save logic
        }}
        onSend={(invoiceData) => {
          console.log('Invoice sent:', invoiceData);
          // Handle send logic
        }}
      />
    </div>
  );
}