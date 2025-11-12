'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye,
  Edit,
  Download,
  MessageSquare,
  Mail,
  Phone,
  Paperclip,
  Send,
  X,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { buildApiUrl } from '../../../../config/api';

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
  invoiceData?: any;
}

interface InvoicesTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  durationFilter: string;
  setDurationFilter: (duration: string) => void;
  invoices: Invoice[];
  onEditInvoice: (invoice: Invoice) => void;
  onDownloadInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onUpdateInvoiceStatus: (invoiceId: string, status: 'paid' | 'pending' | 'overdue') => void;
  sendingInvoice?: Invoice | null;
  onSendingInvoiceComplete?: () => void;
}

export const InvoicesTab: React.FC<InvoicesTabProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  durationFilter,
  setDurationFilter,
  invoices,
  onEditInvoice,
  onDownloadInvoice,
  onDeleteInvoice,
  onUpdateInvoiceStatus,
  sendingInvoice,
  onSendingInvoiceComplete
}) => {
  const { token } = useAuth();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'whatsapp'>('email');
  const [initiatingUSSD, setInitiatingUSSD] = useState(false);
  
  // Generate payment message with control number and payment link
  const generatePaymentMessage = (invoice: Invoice): string => {
    // Get control number from various possible locations
    console.log('🔍 Generating message for invoice:', {
      invoiceId: invoice.id,
      invoiceData: invoice.invoiceData,
      control_number: invoice.invoiceData?.control_number,
      clickpesa_control_number: invoice.invoiceData?.clickpesa_control_number,
      controlNumber: (invoice.invoiceData as any)?.controlNumber
    });
    
    const controlNumber = invoice.invoiceData?.control_number 
      || invoice.invoiceData?.clickpesa_control_number 
      || (invoice.invoiceData as any)?.controlNumber
      || 'N/A';
    
    console.log('🔍 Final controlNumber for message:', controlNumber);
    
    const invoiceNumber = invoice.number || invoice.invoiceData?.invoice_number || 'N/A';
    const amount = invoice.amount || (invoice.invoiceData?.total ? `${invoice.invoiceData.currency || 'TZS'} ${invoice.invoiceData.total}` : 'N/A');
    const clientName = invoice.client || invoice.invoiceData?.client_name || 'Customer';
    const invoiceId = invoice.invoiceData?.id || invoice.id;
    const phone = invoice.phone 
      || invoice.invoiceData?.client_phone 
      || invoice.invoiceData?.clientPhone 
      || (invoice.invoiceData as any)?.phone
      || '';
    
    // Create USSD push payment link - frontend route that triggers USSD push
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const ussdPushLink = invoiceId
      ? `${baseUrl}/payment/ussd/${invoiceId}`
      : '';
    
    // Web payment link using ClickPesa control number (only if valid control number)
    const hasValidControlNumber = controlNumber 
      && controlNumber !== 'N/A' 
      && !controlNumber.startsWith('NOCTRL')
      && controlNumber.trim() !== '';
    
    const webPaymentLink = hasValidControlNumber
      ? `https://pay.clickpesa.com/pay/${controlNumber}`
      : '';

    // Build simple, clean message
    let message = `Dear ${clientName},\n\n`;
    message += `Invoice: ${invoiceNumber}\n`;
    message += `Amount: ${amount}\n`;
    
    // Check if control number is a placeholder (NOCTRL)
    if (controlNumber && controlNumber.startsWith('NOCTRL')) {
      message += `\n⚠️ WARNING: This invoice has an invalid control number. Please contact the merchant.\n`;
    } else if (controlNumber && controlNumber !== 'N/A') {
      message += `Control Number: ${controlNumber}\n`;
    }
    
    message += `\nThank you for your business!`;
    
    return message;
  };

  const [messageContent, setMessageContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Update message content when sendingInvoice or selectedInvoice changes
  useEffect(() => {
    if (showMessageModal && selectedInvoice) {
      // Always generate the full payment message with control number and links
      setMessageContent(generatePaymentMessage(selectedInvoice));
    }
  }, [selectedInvoice, showMessageModal]);

  // Auto-open message modal when sendingInvoice is set (moved from earlier useEffect)
  useEffect(() => {
    if (sendingInvoice) {
      setSelectedInvoice(sendingInvoice);
      setShowMessageModal(true);
      // Set default channel based on available contact info
      if (sendingInvoice.email) {
        setSelectedChannel('email');
      } else if (sendingInvoice.phone) {
        setSelectedChannel('whatsapp');
      }
      // Message content will be set by the other useEffect
    }
  }, [sendingInvoice]);

  const handleMessageInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowMessageModal(true);
    // Set default channel based on available contact info
    if (invoice.email) {
      setSelectedChannel('email');
    } else if (invoice.phone) {
      setSelectedChannel('whatsapp');
    }
    // Message content will be set by the useEffect above
  };

  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    setSelectedInvoice(null);
    setMessageContent('');
    setAttachedFile(null);
    if (onSendingInvoiceComplete) {
      onSendingInvoiceComplete();
    }
  };

  const generateInvoicePDF = async (invoice: Invoice): Promise<{ pdfBase64: string; filename: string }> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Dynamic imports to avoid TypeScript issues
        const html2canvas = (await import('html2canvas')).default;
        const jsPDF = (await import('jspdf')).jsPDF;

        // Create a temporary div to render the invoice
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = '210mm'; // A4 width
        tempDiv.style.padding = '20mm';
        tempDiv.style.backgroundColor = '#ffffff';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(tempDiv);

        // Build invoice HTML
        const invoiceNumber = invoice.number || invoice.invoiceData?.invoice_number || 'N/A';
        const clientName = invoice.client || invoice.invoiceData?.client_name || 'Customer';
        const amount = invoice.amount || (invoice.invoiceData?.total ? `${invoice.invoiceData.currency || 'TZS'} ${invoice.invoiceData.total}` : 'N/A');
        const date = invoice.date || (invoice.invoiceData?.issue_date ? new Date(invoice.invoiceData.issue_date).toLocaleDateString() : new Date().toLocaleDateString());
        
        let itemsHTML = '';
        if (invoice.invoiceData?.items) {
          try {
            const items = typeof invoice.invoiceData.items === 'string' 
              ? JSON.parse(invoice.invoiceData.items) 
              : invoice.invoiceData.items;
            items.forEach((item: any) => {
              itemsHTML += `
                <tr>
                  <td>${item.description || ''}</td>
                  <td>${item.quantity || 0}</td>
                  <td>${item.rate || 0}</td>
                  <td>${item.amount || 0}</td>
                </tr>
              `;
            });
          } catch (e) {
            console.error('Error parsing items:', e);
          }
        }

        tempDiv.innerHTML = `
          <div style="max-width: 100%;">
            <h1 style="font-size: 24px; margin-bottom: 20px;">Invoice ${invoiceNumber}</h1>
            <div style="margin-bottom: 20px;">
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Client:</strong> ${clientName}</p>
              <p><strong>Amount:</strong> ${amount}</p>
            </div>
            ${itemsHTML ? `
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
                    <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Quantity</th>
                    <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Rate</th>
                    <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
            ` : ''}
            <div style="margin-top: 20px; text-align: right;">
              <p style="font-size: 18px; font-weight: bold;">Total: ${amount}</p>
            </div>
          </div>
        `;

        // Generate PDF
        const canvas = await html2canvas(tempDiv, {
          background: '#ffffff',
          logging: false,
          scale: 2
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const safeInvoiceNumber = invoiceNumber.replace(/[^a-zA-Z0-9._-]/g, '_');
        const fileName = `invoice-${safeInvoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Get PDF as base64 string
        const pdfBase64 = pdf.output('datauristring').split(',')[1]; // Remove data:application/pdf;base64, prefix
        
        // Clean up
        document.body.removeChild(tempDiv);
        
        resolve({ pdfBase64, filename: fileName });
      } catch (error) {
        console.error('Error generating PDF:', error);
        reject(error);
      }
    });
  };

  const handleSendMessage = async () => {
    if (messageContent.trim() && selectedInvoice) {
      try {
        // Generate PDF
        const { pdfBase64, filename } = await generateInvoicePDF(selectedInvoice);
        const invoiceId = selectedInvoice.invoiceData?.id || selectedInvoice.id;
        
        if (selectedChannel === 'email' && selectedInvoice.email) {
          // Send email via backend with PDF attachment
          const response = await fetch(buildApiUrl(`/invoices/${invoiceId}/send-email`), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              to_email: selectedInvoice.email,
              subject: `Invoice ${selectedInvoice.number}`,
              message: messageContent,
              pdf_base64: pdfBase64,
              pdf_filename: filename
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to send email');
          }

          const result = await response.json();
          alert(`✅ Email sent successfully to ${selectedInvoice.email}!`);
          handleCloseMessageModal();
        } else if (selectedChannel === 'whatsapp' && selectedInvoice.phone) {
          // For WhatsApp, download the file and open WhatsApp
          // Convert base64 to blob and download
          const byteCharacters = atob(pdfBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          // Small delay for download to start
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Open WhatsApp with message
          // Format phone number (remove +, spaces, etc.)
          let phone = selectedInvoice.phone.replace(/[^\d]/g, '');
          // If starts with 0, replace with country code (255 for Tanzania)
          if (phone.startsWith('0')) {
            phone = '255' + phone.substring(1);
          } else if (!phone.startsWith('255') && phone.length === 9) {
            phone = '255' + phone;
          }
          const message = encodeURIComponent(messageContent);
          const whatsappLink = `https://wa.me/${phone}?text=${message}`;
          window.open(whatsappLink, '_blank');
          alert('📄 Invoice PDF downloaded. Please attach it to your WhatsApp message.');
          handleCloseMessageModal();
        } else {
          alert(`Please select a valid ${selectedChannel === 'email' ? 'email address' : 'phone number'}`);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert(`Failed to send ${selectedChannel}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };
  return (
    <>
      {/* Search and Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '400px', right: '60px' }}>
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
            placeholder="Search invoices..."
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
        
        {/* Duration Filter */}
        <div style={{ flex: '0 0 auto' }}>
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              backgroundColor: 'white',
              minWidth: '120px'
            }}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Status Filter - rightmost */}
        <div style={{ flex: '0 0 auto' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              backgroundColor: 'white',
              minWidth: '150px'
            }}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoice List */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '20px', 
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
          Recent Invoices
        </h3>
        
        {/* Invoices Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '16px 24px 16px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Invoice #</th>
                <th style={{ textAlign: 'left', padding: '16px 24px 16px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Client</th>
                <th style={{ textAlign: 'left', padding: '16px 32px 16px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '16px 32px 16px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '16px 32px 16px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '16px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={invoice.id} style={{ borderBottom: index === invoices.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px 24px 16px 0', fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{invoice.number}</td>
                  <td style={{ padding: '16px 24px 16px 0', fontSize: '14px', color: '#374151' }}>{invoice.client}</td>
                  <td style={{ padding: '16px 32px 16px 0', fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{invoice.amount}</td>
                  <td style={{ padding: '16px 32px 16px 0', fontSize: '14px', color: '#6b7280' }}>{invoice.date}</td>
                  <td style={{ padding: '16px 32px 16px 0' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: invoice.status === 'paid' ? '#10b981' : 
                                     invoice.status === 'pending' ? '#f59e0b' : '#ef4444',
                      color: 'white'
                    }}>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                  </td>
                  <td style={{ padding: '16px 0' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => onDownloadInvoice(invoice)}
                        style={{ padding: '6px', backgroundColor: '#eef2ff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        title="Download Invoice"
                      >
                        <Download size={16} color="#4f46e5" />
                      </button>
                      <button 
                        onClick={() => onEditInvoice(invoice)}
                        style={{ padding: '6px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        title="Edit Invoice"
                      >
                        <Edit size={16} color="#6b7280" />
                      </button>
                      <button 
                        onClick={() => onDeleteInvoice(invoice.id)}
                        style={{ padding: '6px', backgroundColor: '#fef2f2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        title="Delete Invoice"
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && selectedInvoice && (
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
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Send Invoice to {selectedInvoice.client}
              </h3>
              <button
                onClick={handleCloseMessageModal}
                style={{ padding: '8px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                <X size={16} color="#6b7280" />
              </button>
            </div>

            {/* Channel Selection */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                Select Communication Channel
              </h4>
              <div style={{ display: 'flex', gap: '16px' }}>
                {selectedInvoice.email && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="channel"
                      value="email"
                      checked={selectedChannel === 'email'}
                      onChange={(e) => setSelectedChannel(e.target.value as any)}
                    />
                    <Mail size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Email</span>
                  </label>
                )}
                
                {selectedInvoice.phone && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="channel"
                      value="whatsapp"
                      checked={selectedChannel === 'whatsapp'}
                      onChange={(e) => setSelectedChannel(e.target.value as any)}
                    />
                    <MessageSquare size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>WhatsApp</span>
                  </label>
                )}
              </div>
            </div>

            {/* Contact Info Display */}
            <div style={{ 
              backgroundColor: '#f9fafb', 
              padding: '16px', 
              borderRadius: '12px', 
              marginBottom: '24px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {selectedChannel === 'email' && <Mail size={16} color="#6b7280" />}
                {selectedChannel === 'whatsapp' && <MessageSquare size={16} color="#6b7280" />}
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {selectedChannel === 'email' && `Email: ${selectedInvoice.email}`}
                  {selectedChannel === 'whatsapp' && `WhatsApp: ${selectedInvoice.phone}`}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                Invoice: {selectedInvoice.number} • Amount: {selectedInvoice.amount}
              </div>
              
              {/* Control Number Display */}
              {selectedInvoice.invoiceData?.control_number && selectedInvoice.invoiceData.control_number !== 'N/A' && (
                <div style={{ 
                  backgroundColor: selectedInvoice.invoiceData.control_number.startsWith('NOCTRL') ? '#fef3c7' : '#eff6ff', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  marginTop: '8px',
                  border: `1px solid ${selectedInvoice.invoiceData.control_number.startsWith('NOCTRL') ? '#fcd34d' : '#bfdbfe'}`
                }}>
                  {selectedInvoice.invoiceData.control_number.startsWith('NOCTRL') ? (
                    <>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', marginBottom: '6px' }}>
                        ⚠️ Invalid Control Number (Placeholder)
                      </div>
                      <div style={{ fontSize: '11px', color: '#78350f', marginBottom: '12px' }}>
                        This invoice was created with a placeholder control number and cannot be used for payment. 
                        Please regenerate a real control number from ClickPesa.
                      </div>
                      <div style={{ fontSize: '12px', color: '#78350f', marginBottom: '8px', fontFamily: 'monospace' }}>
                        Current: {selectedInvoice.invoiceData.control_number}
                      </div>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          if (!token || !selectedInvoice.invoiceData?.id) {
                            alert('Unable to regenerate control number. Please ensure you are logged in.');
                            return;
                          }
                          
                          if (!confirm('Regenerate control number from ClickPesa? This will create a real payment control number.')) {
                            return;
                          }
                          
                          try {
                            const response = await fetch(
                              buildApiUrl(`/invoices/${selectedInvoice.invoiceData.id}/regenerate-control-number`),
                              {
                                method: 'POST',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                  'Content-Type': 'application/json'
                                }
                              }
                            );
                            
                            if (!response.ok) {
                              const error = await response.json().catch(() => ({ detail: 'Failed to regenerate control number' }));
                              throw new Error(error.detail || 'Failed to regenerate control number');
                            }
                            
                            const updatedInvoice = await response.json();
                            alert(`✅ Control number regenerated successfully!\nNew Control Number: ${updatedInvoice.control_number}`);
                            
                            // Reload the invoice data
                            if (onSendingInvoiceComplete) {
                              onSendingInvoiceComplete();
                            }
                            handleCloseMessageModal();
                            window.location.reload(); // Reload to refresh invoice list
                          } catch (error: any) {
                            alert(`Failed to regenerate control number: ${error.message}`);
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        Regenerate Control Number
                      </button>
                    </>
                  ) : null}
                </div>
              )}
            </div>

            {/* File Attachment */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                Attach Invoice File
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="file"
                  id="invoice-file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileAttachment}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="invoice-file"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151'
                  }}
                >
                  <Paperclip size={16} />
                  Choose File
                </label>
                {attachedFile && (
                  <span style={{ fontSize: '14px', color: '#10b981' }}>
                    ✓ {attachedFile.name}
                  </span>
                )}
              </div>
            </div>

            {/* Message Input */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                Message Content
              </h4>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseMessageModal}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageContent.trim()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: messageContent.trim() ? 'var(--mc-sidebar-bg)' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  cursor: messageContent.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Send size={16} />
                Send {selectedChannel === 'email' ? 'Email' : 'WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
