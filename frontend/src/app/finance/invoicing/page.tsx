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
  const [sendingInvoice, setSendingInvoice] = useState<Invoice | null>(null);
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

  const handleSaveInvoice = async (invoiceData: any, skipCloseModal: boolean = false) => {
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

      if (!skipCloseModal) {
    setShowCreateModal(false);
    setOpenOnInvoiceTab(false);
    setSelectedTemplateId(null);
        setDownloadingInvoice(null);
      }
      return;
    }

    try {
      // Map items to backend format - ensure we have at least one item
      const items = (invoiceData.items || []).filter((item: any) => item && (item.description || item.quantity > 0 || item.rate > 0))
        .map((item: any, index: number) => ({
          id: item.id || `item-${index + 1}`, // Backend requires id field
          type: item.type || 'item',
          description: item.description || '',
          quantity: parseFloat(String(item.quantity)) || 0,
          unit: item.unit || '',
          rate: parseFloat(String(item.rate)) || 0,
          amount: parseFloat(String(item.amount)) || 0
        }));
      
      // Backend requires at least one item
      if (items.length === 0) {
        throw new Error('Please add at least one item to the invoice');
      }

      // Validate required fields
      const clientName = invoiceData.clientName || invoiceData.client_name;
      if (!clientName || clientName.trim() === '') {
        throw new Error('Client name is required');
      }

      // Calculate tax_rate from tax_amount and subtotal if not provided
      const subtotal = parseFloat(String(invoiceData.subtotal)) || 0;
      const taxAmount = parseFloat(String(invoiceData.tax || invoiceData.tax_amount || 0)) || 0;
      const calculatedTaxRate = subtotal > 0 ? (taxAmount / subtotal) * 100 : 0;
      const taxRate = parseFloat(String(invoiceData.taxRate || invoiceData.tax_rate || calculatedTaxRate)) || 0;
      
      const total = parseFloat(String(invoiceData.total)) || 0;
      if (total <= 0) {
        throw new Error('Invoice total must be greater than 0');
      }

      // Prepare create payload - map from modal format to backend format
      const createPayload = {
        invoice_number: invoiceData.invoiceNumber || invoiceData.invoice_number || null,
        issue_date: invoiceData.date || invoiceData.issue_date || new Date().toISOString().split('T')[0],
        due_date: invoiceData.dueDate || invoiceData.due_date || null,
        client_name: clientName.trim(),
        client_email: (invoiceData.clientEmail || invoiceData.client_email || '').trim() || null,
        client_phone: (invoiceData.clientPhone || invoiceData.client_phone || '').trim() || null,
        client_address: (invoiceData.clientAddress || invoiceData.client_address || '').trim() || null,
        items: items,
        subtotal: subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        discount: parseFloat(String(invoiceData.discount || invoiceData.discountAmount || 0)) || 0,
        discount_rate: parseFloat(String(invoiceData.discountRate || invoiceData.discount_rate || '0')) || 0,
        total: total,
        currency: invoiceData.currency || 'TZS',
        notes: (invoiceData.notes || '').trim() || null,
        status: invoiceData.status || 'PENDING'
      };

      console.log('Creating invoice with payload:', JSON.stringify(createPayload, null, 2));

      const response = await fetch(buildApiUrl('/invoices'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createPayload)
      });

      if (!response.ok) {
        let errorMessage = `Failed to create invoice (${response.status}): `;
        try {
          const errorData = await response.json();
          // Handle different error response formats
          if (typeof errorData === 'string') {
            errorMessage += errorData;
          } else if (errorData.detail) {
            errorMessage += typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
          } else if (errorData.message) {
            errorMessage += errorData.message;
          } else if (errorData.error) {
            errorMessage += typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
          } else {
            errorMessage += JSON.stringify(errorData);
          }
        } catch (e) {
          // If JSON parsing fails, try to get text
          const errorText = await response.text().catch(() => response.statusText);
          errorMessage += errorText || response.statusText;
        }
        console.error('Invoice creation error:', errorMessage);
        throw new Error(errorMessage);
      }

      const savedInvoice = await response.json();
      
      // DEBUG: Log the control number from backend
      console.log('🔍 Backend returned invoice:', {
        id: savedInvoice.id,
        invoice_number: savedInvoice.invoice_number,
        control_number: savedInvoice.control_number,
        has_control_number: !!savedInvoice.control_number,
        control_number_type: typeof savedInvoice.control_number,
        control_number_starts_with_noctrl: savedInvoice.control_number?.startsWith('NOCTRL')
      });
      
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

      if (!skipCloseModal) {
        alert('Invoice saved successfully!');
      }
      
      // Reload invoices to get the latest data (but don't wait if sending)
      if (!skipCloseModal) {
        await loadInvoices();
      } else {
        // If sending, reload in background without blocking
        loadInvoices().catch(console.error);
      }
      
      // Return the saved invoice for Send functionality
      return savedInvoice;
    } catch (error) {
      console.error('Error saving invoice:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : (typeof error === 'string' ? error : JSON.stringify(error));
      
      // DO NOT create local invoice - backend MUST create it with control number
      // If backend fails, show error and DO NOT proceed
      if (!skipCloseModal) {
        alert(`Failed to save invoice: ${errorMessage}\n\nInvoice was NOT created. Please check your ClickPesa API credentials and try again.`);
      } else {
        // Still show error even if not closing modal (e.g., when sending)
        alert(`Failed to save invoice: ${errorMessage}\n\nCannot send invoice - it was not created. Please try again.`);
        console.error('Invoice save error (modal stays open):', errorMessage);
      }
      
      // DO NOT create fake invoice - throw error instead
      throw error;
    }
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
      
      // Map items to backend format - include id field
      const items = (updatedData.items || []).filter((item: any) => item && (item.description || item.quantity > 0 || item.rate > 0))
        .map((item: any, index: number) => ({
          id: item.id || `item-${index + 1}`, // Backend requires id field
          type: item.type || 'item',
          description: item.description || '',
          quantity: parseFloat(String(item.quantity)) || 0,
          unit: item.unit || '',
          rate: parseFloat(String(item.rate)) || 0,
          amount: parseFloat(String(item.amount)) || 0
        }));
      
      // Backend requires at least one item
      if (items.length === 0) {
        throw new Error('Please add at least one item to the invoice');
      }

      // Validate required fields
      const clientName = updatedData.clientName || updatedData.client_name;
      if (!clientName || clientName.trim() === '') {
        throw new Error('Client name is required');
      }

      // Calculate tax_rate from tax_amount and subtotal if not provided
      const subtotal = parseFloat(String(updatedData.subtotal)) || 0;
      const taxAmount = parseFloat(String(updatedData.tax || updatedData.tax_amount || 0)) || 0;
      const calculatedTaxRate = subtotal > 0 ? (taxAmount / subtotal) * 100 : 0;
      const taxRate = parseFloat(String(updatedData.taxRate || updatedData.tax_rate || calculatedTaxRate)) || 0;
      
      const total = parseFloat(String(updatedData.total)) || 0;
      if (total <= 0) {
        throw new Error('Invoice total must be greater than 0');
      }
      
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
        let errorMessage = `Failed to update invoice (${response.status}): `;
        try {
          const errorData = await response.json();
          if (typeof errorData === 'string') {
            errorMessage += errorData;
          } else if (errorData.detail) {
            errorMessage += typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
          } else if (errorData.message) {
            errorMessage += errorData.message;
          } else if (errorData.error) {
            errorMessage += typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
          } else {
            errorMessage += JSON.stringify(errorData);
          }
        } catch (e) {
          const errorText = await response.text().catch(() => response.statusText);
          errorMessage += errorText || response.statusText;
        }
        console.error('Invoice update error:', errorMessage);
        throw new Error(errorMessage);
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

  const handleSendInvoice = async (invoiceData: any) => {
    try {
      // First, save the invoice if not already saved (skip closing modal)
      const savedInvoice = await handleSaveInvoice(invoiceData, true);
      
      if (savedInvoice && savedInvoice.id) {
        // Create Invoice object for the message modal
        const invoiceForSend: Invoice = {
          id: savedInvoice.id.toString(),
          number: savedInvoice.invoice_number,
          client: savedInvoice.client_name || 'Unknown Client',
          amount: formatAmountWithCurrency(savedInvoice.total || 0, savedInvoice.currency || 'TZS'),
          date: savedInvoice.issue_date ? new Date(savedInvoice.issue_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: (savedInvoice.status?.toLowerCase() || 'pending') as 'paid' | 'pending' | 'overdue',
          email: savedInvoice.client_email,
          phone: savedInvoice.client_phone,
          invoiceData: savedInvoice // Include full data with control_number
        };
        
        // Close create modal and set sending invoice to trigger message modal
        setShowCreateModal(false);
        setOpenOnInvoiceTab(false);
        setSelectedTemplateId(null);
        setEditingInvoice(null);
        setDownloadingInvoice(null);
        
        // Set the invoice to send - this will trigger the message modal in InvoicesTab
        setSendingInvoice(invoiceForSend);
      } else {
        // If save failed, show error and close modal
        setShowCreateModal(false);
        setOpenOnInvoiceTab(false);
        setSelectedTemplateId(null);
        setDownloadingInvoice(null);
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert(`Failed to prepare invoice for sending: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Close modal on error
      setShowCreateModal(false);
      setOpenOnInvoiceTab(false);
      setSelectedTemplateId(null);
      setDownloadingInvoice(null);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!token) {
      // Fallback to local delete if no token
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      return;
    }

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
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

      // Reload invoices from backend to ensure UI is in sync with database
      await loadInvoices();
      alert('Invoice deleted successfully!');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert(`Failed to delete invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Do NOT remove from local state on error - keep it visible so user knows it wasn't deleted
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
          sendingInvoice={sendingInvoice}
          onSendingInvoiceComplete={() => setSendingInvoice(null)}
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
            onClick={() => {
              // Clear all editing state when creating a new invoice
              setEditingInvoice(null);
              setDownloadingInvoice(null);
              setSelectedTemplateId(null);
              setOpenOnInvoiceTab(false);
              setShowCreateModal(true);
            }}
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
        key={editingInvoice?.id || 'new-invoice'} // Force remount when switching between new/edit
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setOpenOnInvoiceTab(false);
          setSelectedTemplateId(null);
          setEditingInvoice(null);
          setDownloadingInvoice(null);
        }}
        onSave={editingInvoice ? handleUpdateInvoice : handleSaveInvoice}
        onSend={handleSendInvoice}
        initialTab={downloadingInvoice ? 'invoice' : (openOnInvoiceTab ? 'invoice' : 'details')}
        autoDownload={Boolean(downloadingInvoice)}
        selectedTemplateId={selectedTemplateId}
        editingInvoice={downloadingInvoice || editingInvoice}
      />
    </div>
  );}
