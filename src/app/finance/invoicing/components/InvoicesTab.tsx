'use client';

import React, { useState } from 'react';
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
  X
} from 'lucide-react';

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
}

interface InvoicesTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  durationFilter: string;
  setDurationFilter: (duration: string) => void;
}

export const InvoicesTab: React.FC<InvoicesTabProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  durationFilter,
  setDurationFilter
}) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [messageContent, setMessageContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Mock invoice data with contact info
  const invoices: Invoice[] = [
    {
      id: '1',
      number: '#INV-001',
      client: 'Acme Corporation',
      amount: '$2,500.00',
      date: '2024-01-15',
      status: 'paid',
      email: 'contact@acme.com',
      phone: '+1-555-0123',
      whatsapp: '+1-555-0123'
    },
    {
      id: '2',
      number: '#INV-002',
      client: 'Tech Solutions Ltd',
      amount: '$1,800.00',
      date: '2024-01-18',
      status: 'pending',
      email: 'info@techsolutions.com',
      phone: '+1-555-0456',
      whatsapp: '+1-555-0456'
    },
    {
      id: '3',
      number: '#INV-003',
      client: 'Global Services Inc',
      amount: '$3,200.00',
      date: '2024-01-20',
      status: 'paid',
      email: 'billing@globalservices.com',
      phone: '+1-555-0789',
      whatsapp: '+1-555-0789'
    },
    {
      id: '4',
      number: '#INV-004',
      client: 'Startup Ventures',
      amount: '$950.00',
      date: '2024-01-22',
      status: 'overdue',
      email: 'finance@startupventures.com',
      phone: '+1-555-0321',
      whatsapp: '+1-555-0321'
    }
  ];

  const handleMessageInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowMessageModal(true);
    // Set default message content
    setMessageContent(`Dear ${invoice.client},\n\nPlease find attached your invoice ${invoice.number} for ${invoice.amount}.\n\nThank you for your business!\n\nBest regards,`);
  };

  const handleSendMessage = () => {
    if (messageContent.trim() && selectedInvoice) {
      console.log(`Sending ${selectedChannel} message to ${selectedInvoice.client}:`, {
        content: messageContent,
        file: attachedFile,
        channel: selectedChannel
      });
      setMessageContent('');
      setAttachedFile(null);
      setShowMessageModal(false);
      setSelectedInvoice(null);
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
                      <button style={{ padding: '6px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        <Eye size={16} color="#6b7280" />
                      </button>
                      <button style={{ padding: '6px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        <Edit size={16} color="#6b7280" />
                      </button>
                      <button style={{ padding: '6px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        <Download size={16} color="#6b7280" />
                      </button>
                      <button 
                        onClick={() => handleMessageInvoice(invoice)}
                        style={{ padding: '6px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <MessageSquare size={16} color="#6b7280" />
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
                onClick={() => setShowMessageModal(false)}
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
                      value="sms"
                      checked={selectedChannel === 'sms'}
                      onChange={(e) => setSelectedChannel(e.target.value as any)}
                    />
                    <Phone size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>SMS</span>
                  </label>
                )}
                
                {selectedInvoice.whatsapp && (
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
                {selectedChannel === 'sms' && <Phone size={16} color="#6b7280" />}
                {selectedChannel === 'whatsapp' && <MessageSquare size={16} color="#6b7280" />}
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {selectedChannel === 'email' && `Email: ${selectedInvoice.email}`}
                  {selectedChannel === 'sms' && `SMS: ${selectedInvoice.phone}`}
                  {selectedChannel === 'whatsapp' && `WhatsApp: ${selectedInvoice.phone}`}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Invoice: {selectedInvoice.number} • Amount: {selectedInvoice.amount}
              </div>
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
                onClick={() => setShowMessageModal(false)}
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
                Send {selectedChannel === 'email' ? 'Email' : selectedChannel === 'sms' ? 'SMS' : 'WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
