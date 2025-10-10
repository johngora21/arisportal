'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Tenant, Property, Unit } from '../types';

interface MessageTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  properties: Property[];
  units: Unit[];
}

export default function MessageTenantModal({ 
  isOpen, 
  onClose, 
  tenant, 
  properties, 
  units 
}: MessageTenantModalProps) {
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [messageContent, setMessageContent] = useState('');

  if (!isOpen || !tenant) return null;

  const property = properties.find(p => p.id === tenant.propertyId);
  const unit = units.find(u => u.id === tenant.unitId);

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      // Handle message sending
      console.log(`Sending ${selectedChannel} message to ${tenant.name}:`, messageContent);
      setMessageContent('');
      onClose();
    }
  };

  return (
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
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: '#e0f2fe', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '16px', 
              fontWeight: '600', 
              color: 'var(--mc-sidebar-bg)' 
            }}>
              {tenant.name.charAt(0)}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                {tenant.name}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                {property?.name} - {unit?.unitNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {/* Channel Selection */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
            Choose Communication Channel
          </label>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {tenant.email && (
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
            
            {tenant.phone && (
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
            
            {tenant.phone && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="channel"
                  value="whatsapp"
                  checked={selectedChannel === 'whatsapp'}
                  onChange={(e) => setSelectedChannel(e.target.value as any)}
                />
                <MessageCircle size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>WhatsApp</span>
              </label>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{ 
          flex: 1, 
          border: '1px solid #e5e7eb', 
          borderRadius: '20px', 
          marginBottom: '16px',
          backgroundColor: 'white',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Chat Header */}
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: '1px solid #e5e7eb', 
            backgroundColor: '#f9fafb',
            borderRadius: '8px 8px 0 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selectedChannel === 'email' && <Mail size={16} color="#6b7280" />}
              {selectedChannel === 'sms' && <Phone size={16} color="#6b7280" />}
              {selectedChannel === 'whatsapp' && <MessageCircle size={16} color="#6b7280" />}
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                {selectedChannel === 'email' && `Email: ${tenant.email}`}
                {selectedChannel === 'sms' && `SMS: ${tenant.phone}`}
                {selectedChannel === 'whatsapp' && `WhatsApp: ${tenant.phone}`}
              </span>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div style={{ 
            flex: 1, 
            padding: '16px', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px'
          }}>
            <MessageCircle size={48} color="#d1d5db" />
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
                Start a conversation
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Send a message to {tenant.name} via {selectedChannel.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Message Input */}
          <div style={{ 
            padding: '16px', 
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '12px'
          }}>
            <input
              type="text"
              placeholder={`Type your message...`}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageContent.trim()}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '20px',
                background: messageContent.trim() ? 'var(--mc-sidebar-bg)' : '#d1d5db',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: messageContent.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <MessageCircle size={16} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
