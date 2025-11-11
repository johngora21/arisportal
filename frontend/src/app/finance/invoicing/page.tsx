'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { useAuth } from '../../../contexts/AuthContext';
import { buildApiUrl } from '../../../config/api';

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
  const [downloadingInvoice, setDownloadingInvoice] = useState<Invoice | null>(null);
  const { token } = useAuth();

  const formatAmountWithCurrency = (amount: number, currencyCode: string) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode || 'TZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(Number.isFinite(amount) ? amount : 0);
    } catch {
      const code = (currencyCode || 'TZS').toUpperCase();
      const safe = Number.isFinite(amount) ? amount : 0;
      return `${code} ${safe.toFixed(2)}`;
    }
  };

  // Load invoices from backend
  const loadInvoices = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(buildApiUrl('/invoices'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load invoices: ${response.statusText}`);
      }

      const invoicesData = await response.json();
      
      // Map backend invoice format to frontend format
      const mappedInvoices: Invoice[] = invoicesData.map((inv: any) => {
        const currency = inv.currency || 'TZS';
        const formattedAmount = formatAmountWithCurrency(inv.total || 0, currency);
        
        return {
          id: inv.id.toString(),
          number: inv.invoice_number,
          client: inv.client_name || 'Unknown Client',
          amount: formattedAmount,
          date: inv.issue_date ? new Date(inv.issue_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: (inv.status?.toLowerCase() || 'pending') as 'paid' | 'pending' | 'overdue',
          email: inv.client_email,
          phone: inv.client_phone,
          invoiceData: inv
        };
      });

      setInvoices(mappedInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      // Don't show alert on initial load failure to avoid annoying user
    }
  }, [token]);

  // Load invoices on mount and when token changes
  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setOpenOnInvoiceTab(true);
    setShowCreateModal(true);
  };

  const handleSaveInvoice = async (invoiceData: any) => {
    if (!token) {
      // Fallback to local save if no token
      const currency = invoiceData.currency || 'TZS';
      const formattedAmount = formatAmountWithCurrency(invoiceData.total || 0, currency);
      
    const existingInvoice = invoices.find(inv => 
      inv.invoiceData?.invoiceNumber === invoiceData.invoiceNumber
    );

    if (existingInvoice) {
      setInvoices(prev => prev.map(inv => 
        inv.id === existingInvoice.id 
          ? {
              ...inv,
              client: invoiceData.clientName || inv.client,
                amount: formattedAmount,
              invoiceData: invoiceData
            }
          : inv
      ));
    } else {
        const newInvoice: Invoice = {
          id: Date.now().toString(),
          number: invoiceData.invoiceNumber || `INV-${Date.now()}`,
          client: invoiceData.clientName || 'Unknown Client',
          amount: formattedAmount,
          date: invoiceData.date || new Date().toISOString().split('T')[0],
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
      setDownloadingInvoice(null);
      return;
    }

    try {
      // Map items to backend format
      const items = (invoiceData.items || []).map((item: any) => ({
        description: item.description || '',
        quantity: item.quantity || 0,
        unit: item.unit || '',
        rate: item.rate || 0,
        amount: item.amount || 0
      }));

      // Calculate tax_rate from tax_amount and subtotal if not provided
      const subtotal = invoiceData.subtotal || 0;
      const taxAmount = invoiceData.tax || invoiceData.tax_amount || 0;
      const calculatedTaxRate = subtotal > 0 ? (taxAmount / subtotal) * 100 : 0;
      const taxRate = invoiceData.taxRate || invoiceData.tax_rate || calculatedTaxRate;

      // Prepare create payload - map from modal format to backend format
      const createPayload = {
        invoice_number: invoiceData.invoiceNumber || invoiceData.invoice_number,
        issue_date: invoiceData.date || invoiceData.issue_date || new Date().toISOString().split('T')[0],
        due_date: invoiceData.dueDate || invoiceData.due_date || null,
        client_name: invoiceData.clientName || invoiceData.client_name,
        client_email: invoiceData.clientEmail || invoiceData.client_email || '',
        client_phone: invoiceData.clientPhone || invoiceData.client_phone || '',
        client_address: invoiceData.clientAddress || invoiceData.client_address || '',
        items: items,
        subtotal: subtotal,
        tax_rate: parseFloat(String(taxRate)) || 0,
        tax_amount: taxAmount,
        discount: invoiceData.discount || invoiceData.discountAmount || 0,
        discount_rate: parseFloat(String(invoiceData.discountRate || invoiceData.discount_rate || '0')) || 0,
        total: invoiceData.total || 0,
        currency: invoiceData.currency || 'TZS',
        notes: invoiceData.notes || ''
      };

      const response = await fetch(buildApiUrl('/invoices'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to create invoice: ${errorData.detail || response.statusText}`);
      }

      const savedInvoice = await response.json();
      
      // Update local state with the response
      const currency = savedInvoice.currency || 'TZS';
      const formattedAmount = formatAmountWithCurrency(savedInvoice.total || 0, currency);
      
      const newInvoice: Invoice = {
        id: savedInvoice.id.toString(),
        number: savedInvoice.invoice_number,
        client: savedInvoice.client_name || 'Unknown Client',
        amount: formattedAmount,
        date: savedInvoice.issue_date ? new Date(savedInvoice.issue_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: savedInvoice.status?.toLowerCase() || 'pending',
        email: savedInvoice.client_email,
        phone: savedInvoice.client_phone,
        invoiceData: savedInvoice
      };
      
      // Check if this invoice already exists (update instead of duplicate)
      const existingInvoice = invoices.find(inv => 
        inv.invoiceData?.invoice_number === savedInvoice.invoice_number ||
        inv.invoiceData?.id === savedInvoice.id
      );

      if (existingInvoice) {
        setInvoices(prev => prev.map(inv => 
          inv.id === existingInvoice.id 
            ? newInvoice
            : inv
        ));
      } else {
        setInvoices(prev => [newInvoice, ...prev]);
      }

      alert('Invoice saved successfully!');
      
      // Reload invoices to get the latest data
      await loadInvoices();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert(`Failed to save invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback to local save on error
      const currency = invoiceData.currency || 'TZS';
      const formattedAmount = formatAmountWithCurrency(invoiceData.total || 0, currency);
      
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        number: invoiceData.invoiceNumber || `INV-${Date.now()}`,
        client: invoiceData.clientName || 'Unknown Client',
        amount: formattedAmount,
        date: invoiceData.date || new Date().toISOString().split('T')[0],
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
    setDownloadingInvoice(null);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setDownloadingInvoice(null);
    setEditingInvoice(invoice);
    setSelectedTemplateId(invoice.invoiceData?.templateId || 'minimal');
    setOpenOnInvoiceTab(true);
    setShowCreateModal(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    setDownloadingInvoice(invoice);
    setEditingInvoice(invoice);
    setSelectedTemplateId(invoice.invoiceData?.templateId || 'minimal');
    setOpenOnInvoiceTab(true);
    setShowCreateModal(true);
  };

  const handleUpdateInvoice = async (updatedData: any) => {
    if (!editingInvoice || !token) {
      // Fallback to local update if no token
    if (editingInvoice) {
        const currency = updatedData.currency || 'TZS';
        const formattedAmount = formatAmountWithCurrency(updatedData.total || 0, currency);
        
        setInvoices(prev => prev.map(inv => 
          inv.id === editingInvoice.id 
            ? {
                ...inv,
                client: updatedData.clientName || inv.client,
                amount: formattedAmount,
                invoiceData: updatedData
              }
            : inv
        ));
      }
      setEditingInvoice(null);
      setShowCreateModal(false);
      setOpenOnInvoiceTab(false);
      setSelectedTemplateId(null);
      setDownloadingInvoice(null);
      return;
    }

    try {
      // Get invoice ID - might be in invoiceData or use the id directly
      const invoiceId = editingInvoice.invoiceData?.id || editingInvoice.id;
      
      // Map items to backend format
      const items = (updatedData.items || []).map((item: any) => ({
        description: item.description || '',
        quantity: item.quantity || 0,
        unit: item.unit || '',
        rate: item.rate || 0,
        amount: item.amount || 0
      }));

      // Calculate tax_rate from tax_amount and subtotal if not provided
      const subtotal = updatedData.subtotal || 0;
      const taxAmount = updatedData.tax || updatedData.tax_amount || 0;
      const calculatedTaxRate = subtotal > 0 ? (taxAmount / subtotal) * 100 : 0;
      const taxRate = updatedData.taxRate || updatedData.tax_rate || calculatedTaxRate;
      
      // Prepare update payload - map from modal format to backend format
      const updatePayload = {
        invoice_number: updatedData.invoiceNumber || updatedData.invoice_number,
        issue_date: updatedData.date || updatedData.issue_date,
        due_date: updatedData.dueDate || updatedData.due_date,
        client_name: updatedData.clientName || updatedData.client_name,
        client_email: updatedData.clientEmail || updatedData.client_email,
        client_phone: updatedData.clientPhone || updatedData.client_phone,
        client_address: updatedData.clientAddress || updatedData.client_address,
        items: items,
        subtotal: subtotal,
        tax_rate: parseFloat(String(taxRate)) || 0,
        tax_amount: taxAmount,
        discount: updatedData.discount || updatedData.discountAmount || 0,
        discount_rate: parseFloat(String(updatedData.discountRate || updatedData.discount_rate || '0')) || 0,
        total: updatedData.total || 0,
        currency: updatedData.currency || 'TZS',
        notes: updatedData.notes || ''
      };

      const response = await fetch(buildApiUrl(`/invoices/${invoiceId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error(`Failed to update invoice: ${response.statusText}`);
      }

      const updatedInvoice = await response.json();
      
      // Update local state with the response
      const currency = updatedInvoice.currency || 'TZS';
      const formattedAmount = formatAmountWithCurrency(updatedInvoice.total || 0, currency);
      
      setInvoices(prev => prev.map(inv => 
        inv.id === editingInvoice.id 
          ? {
              ...inv,
              client: updatedInvoice.client_name || inv.client,
              amount: formattedAmount,
              date: updatedInvoice.issue_date ? new Date(updatedInvoice.issue_date).toISOString().split('T')[0] : inv.date,
              invoiceData: updatedInvoice
            }
          : inv
      ));

      alert('Invoice updated successfully!');
      
      // Reload invoices to get the latest data
      await loadInvoices();
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert(`Failed to update invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback to local update on error
      if (editingInvoice) {
        const currency = updatedData.currency || 'TZS';
        const formattedAmount = formatAmountWithCurrency(updatedData.total || 0, currency);
        
        setInvoices(prev => prev.map(inv => 
          inv.id === editingInvoice.id 
            ? {
                ...inv,
                client: updatedData.clientName || inv.client,
                amount: formattedAmount,
                invoiceData: updatedData
              }
            : inv
        ));
      }
    }

    setEditingInvoice(null);
    setShowCreateModal(false);
    setOpenOnInvoiceTab(false);
    setSelectedTemplateId(null);
    setDownloadingInvoice(null);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!token) {
      // Fallback to local delete if no token
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      return;
    }

    try {
      // Ensure invoiceId is a number (backend expects integer)
      const invoiceIdNum = parseInt(invoiceId, 10);
      if (isNaN(invoiceIdNum)) {
        throw new Error(`Invalid invoice ID: ${invoiceId}`);
      }

      const response = await fetch(buildApiUrl(`/invoices/${invoiceIdNum}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`Failed to delete invoice: ${errorText || response.statusText}`);
      }

      // Remove from local state
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      alert('Invoice deleted successfully!');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert(`Failed to delete invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Still remove from local state on error for better UX
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
    }
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
          onDownloadInvoice={handleDownloadInvoice}
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
          setDownloadingInvoice(null);
        }}
        onSave={editingInvoice ? handleUpdateInvoice : handleSaveInvoice}
        onSend={() => {}}
        initialTab={downloadingInvoice ? 'invoice' : (openOnInvoiceTab ? 'invoice' : 'details')}
        autoDownload={Boolean(downloadingInvoice)}
        selectedTemplateId={selectedTemplateId}
        editingInvoice={downloadingInvoice || editingInvoice}
      />
    </div>
  );}
