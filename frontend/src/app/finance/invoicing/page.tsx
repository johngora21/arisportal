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

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  email?: string;
  phone?: string;
  whatsapp?: string;
  invoiceData?: any; // Store the full invoice data for editing/viewing
}

export default function InvoicingPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'templates'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openOnInvoiceTab, setOpenOnInvoiceTab] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setOpenOnInvoiceTab(true);
    setShowCreateModal(true);
  };

  const handleSaveInvoice = (invoiceData: any) => {
    // Check if this invoice already exists (for downloaded invoices)
    const existingInvoice = invoices.find(inv => 
      inv.invoiceData?.invoiceNumber === invoiceData.invoiceNumber
    );

    if (existingInvoice) {
      // Update existing invoice instead of creating new one
      setInvoices(prev => prev.map(inv => 
        inv.id === existingInvoice.id 
          ? {
              ...inv,
              client: invoiceData.clientName || inv.client,
              amount: `$${invoiceData.total?.toFixed(2) || inv.amount}`,
              invoiceData: invoiceData
            }
          : inv
      ));
    } else {
      // Create new invoice
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        number: invoiceData.invoiceNumber || `INV-${Date.now()}`,
        client: invoiceData.clientName || 'Unknown Client',
        amount: `$${invoiceData.total?.toFixed(2) || '0.00'}`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        email: invoiceData.clientEmail,
        phone: invoiceData.clientPhone,
        invoiceData: invoiceData
      };
      
      setInvoices(prev => [newInvoice, ...prev]);
    }

    setShowCreateModal(false);
    setOpenOnInvoiceTab(false);
    setSelectedTemplateId(null);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setSelectedTemplateId(invoice.invoiceData?.templateId || 'minimal');
    setOpenOnInvoiceTab(true);
    setShowCreateModal(true);
  };

  const handleUpdateInvoice = (updatedData: any) => {
    if (editingInvoice) {
      setInvoices(prev => prev.map(inv => 
        inv.id === editingInvoice.id 
          ? {
              ...inv,
              client: updatedData.clientName || inv.client,
              amount: `$${updatedData.total?.toFixed(2) || inv.amount}`,
              invoiceData: updatedData
            }
          : inv
      ));
    }
    setEditingInvoice(null);
    setShowCreateModal(false);
    setOpenOnInvoiceTab(false);
    setSelectedTemplateId(null);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, status: 'paid' | 'pending' | 'overdue') => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status } : inv
    ));
  };

  // Calculate invoice statistics
  const getInvoiceStats = () => {
    const total = invoices.length;
    const paid = invoices.filter(inv => inv.status === 'paid').length;
    const pending = invoices.filter(inv => inv.status === 'pending').length;
    const overdue = invoices.filter(inv => inv.status === 'overdue').length;
    
    return { total, paid, pending, overdue };
  };

  const stats = getInvoiceStats();

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
          invoices={invoices}
          onEditInvoice={handleEditInvoice}
          onDeleteInvoice={handleDeleteInvoice}
          onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
        />
      );
    }

    if (activeTab === 'templates') {
      return <TemplatesTab onUseTemplate={handleUseTemplate} />;
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
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{stats.total}</div>
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
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{stats.paid}</div>
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
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{stats.pending}</div>
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
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{stats.overdue}</div>
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
        onClose={() => {
          setShowCreateModal(false);
          setOpenOnInvoiceTab(false);
          setSelectedTemplateId(null);
          setEditingInvoice(null);
        }}
        onSave={editingInvoice ? handleUpdateInvoice : handleSaveInvoice}
        onSend={() => {}}
        initialTab={openOnInvoiceTab ? 'invoice' : 'details'}
        selectedTemplateId={selectedTemplateId}
        editingInvoice={editingInvoice}
      />
    </div>
  );
}