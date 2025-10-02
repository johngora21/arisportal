'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Smartphone, 
  CreditCard, 
  Mail, 
  Save, 
  Check, 
  X,
  AlertCircle,
  Info,
  Shield,
  DollarSign,
  MessageSquare,
  Send,
  Users,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('sms');
  const [smsSettings, setSmsSettings] = useState({
    senderName: 'MERITPORTAL',
    smsType: 'bulk', // 'bulk' or 'two-way'
    apiKey: '',
    apiSecret: '',
    showApiCredentials: false
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    collectionMethod: 'mobile', // 'mobile' or 'card'
    disbursementMethod: 'mobile', // 'mobile' or 'card'
    mobileProvider: 'mpesa', // 'mpesa', 'tigopesa', 'airtelmoney'
    cardProvider: 'visa', // 'visa', 'mastercard'
    merchantId: '',
    apiKey: '',
    showApiCredentials: false
  });
  
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '587',
    username: '',
    password: '',
    fromEmail: '',
    fromName: 'Merit Portal',
    showCredentials: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async (tab: string) => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCredentials = (type: string) => {
    if (type === 'sms') {
      setSmsSettings(prev => ({ ...prev, showApiCredentials: !prev.showApiCredentials }));
    } else if (type === 'payment') {
      setPaymentSettings(prev => ({ ...prev, showApiCredentials: !prev.showApiCredentials }));
    } else if (type === 'email') {
      setEmailSettings(prev => ({ ...prev, showCredentials: !prev.showCredentials }));
    }
  };

  const tabs = [
    { id: 'sms', label: 'SMS Configuration', icon: <Smartphone size={20} /> },
    { id: 'payments', label: 'Payment Methods', icon: <CreditCard size={20} /> },
    { id: 'email', label: 'Email Settings', icon: <Mail size={20} /> }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              System Settings
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Configure SMS, payment methods, and email settings for your system
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Smartphone size={20} color="var(--mc-sidebar-bg)" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>SMS Provider</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              Active
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <CreditCard size={20} color="#10b981" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Payment Methods</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              2 Active
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Mail size={20} color="#8b5cf6" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Email Service</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              Configured
            </div>
          </div>
        </div>
      </div>

      {/* Settings Container */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 24px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'var(--mc-sidebar-bg)' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '32px' }}>
          {/* SMS Configuration */}
          {activeTab === 'sms' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                  SMS Configuration
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Configure your SMS provider settings for bulk messaging and two-way communication
                </p>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Sender Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Sender Name
                  </label>
                  <input
                    type="text"
                    value={smsSettings.senderName}
                    onChange={(e) => setSmsSettings(prev => ({ ...prev, senderName: e.target.value }))}
                    placeholder="Enter sender name (max 11 characters)"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      maxWidth: '300px'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    This will appear as the sender name for all SMS messages
                  </p>
                </div>

                {/* SMS Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    SMS Type
                  </label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="smsType"
                        value="bulk"
                        checked={smsSettings.smsType === 'bulk'}
                        onChange={(e) => setSmsSettings(prev => ({ ...prev, smsType: e.target.value }))}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Bulk SMS</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="smsType"
                        value="two-way"
                        checked={smsSettings.smsType === 'two-way'}
                        onChange={(e) => setSmsSettings(prev => ({ ...prev, smsType: e.target.value }))}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Two-Way SMS</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    {smsSettings.smsType === 'bulk' 
                      ? 'Send messages to multiple recipients without expecting replies'
                      : 'Enable two-way communication for customer support and feedback'
                    }
                  </p>
                </div>

                {/* API Credentials */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      API Credentials
                    </label>
                    <button
                      onClick={() => toggleCredentials('sms')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {smsSettings.showApiCredentials ? <EyeOff size={14} /> : <Eye size={14} />}
                      {smsSettings.showApiCredentials ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '12px', maxWidth: '500px' }}>
                    <input
                      type={smsSettings.showApiCredentials ? 'text' : 'password'}
                      value={smsSettings.apiKey}
                      onChange={(e) => setSmsSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="API Key"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <input
                      type={smsSettings.showApiCredentials ? 'text' : 'password'}
                      value={smsSettings.apiSecret}
                      onChange={(e) => setSmsSettings(prev => ({ ...prev, apiSecret: e.target.value }))}
                      placeholder="API Secret"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <Info size={20} color="#0284c7" />
                  <div>
                    <p style={{ fontSize: '14px', color: '#0c4a6e', margin: '0 0 4px 0', fontWeight: '500' }}>
                      Plug & Play Integration
                    </p>
                    <p style={{ fontSize: '12px', color: '#0c4a6e', margin: 0 }}>
                      No API integration required. Simply configure your credentials and start sending SMS messages immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {activeTab === 'payments' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Payment Methods Configuration
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Configure payment methods for collections and disbursements
                </p>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Collection Method */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Collection Method
                  </label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="collectionMethod"
                        value="mobile"
                        checked={paymentSettings.collectionMethod === 'mobile'}
                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, collectionMethod: e.target.value }))}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Mobile Money</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="collectionMethod"
                        value="card"
                        checked={paymentSettings.collectionMethod === 'card'}
                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, collectionMethod: e.target.value }))}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Credit/Debit Cards</span>
                    </label>
                  </div>
                </div>

                {/* Disbursement Method */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Disbursement Method
                  </label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="disbursementMethod"
                        value="mobile"
                        checked={paymentSettings.disbursementMethod === 'mobile'}
                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, disbursementMethod: e.target.value }))}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Mobile Money</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="disbursementMethod"
                        value="card"
                        checked={paymentSettings.disbursementMethod === 'card'}
                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, disbursementMethod: e.target.value }))}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Bank Transfer</span>
                    </label>
                  </div>
                </div>

                {/* Mobile Provider */}
                {paymentSettings.collectionMethod === 'mobile' || paymentSettings.disbursementMethod === 'mobile' ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Mobile Money Provider
                    </label>
                    <select
                      value={paymentSettings.mobileProvider}
                      onChange={(e) => setPaymentSettings(prev => ({ ...prev, mobileProvider: e.target.value }))}
                      style={{
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        maxWidth: '300px'
                      }}
                    >
                      <option value="mpesa">M-Pesa</option>
                      <option value="tigopesa">Tigo Pesa</option>
                      <option value="airtelmoney">Airtel Money</option>
                    </select>
                  </div>
                ) : null}

                {/* Card Provider */}
                {paymentSettings.collectionMethod === 'card' ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Card Provider
                    </label>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="cardProvider"
                          value="visa"
                          checked={paymentSettings.cardProvider === 'visa'}
                          onChange={(e) => setPaymentSettings(prev => ({ ...prev, cardProvider: e.target.value }))}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Visa</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="cardProvider"
                          value="mastercard"
                          checked={paymentSettings.cardProvider === 'mastercard'}
                          onChange={(e) => setPaymentSettings(prev => ({ ...prev, cardProvider: e.target.value }))}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Mastercard</span>
                      </label>
                    </div>
                  </div>
                ) : null}

                {/* API Credentials */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Payment Gateway Credentials
                    </label>
                    <button
                      onClick={() => toggleCredentials('payment')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {paymentSettings.showApiCredentials ? <EyeOff size={14} /> : <Eye size={14} />}
                      {paymentSettings.showApiCredentials ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '12px', maxWidth: '500px' }}>
                    <input
                      type="text"
                      value={paymentSettings.merchantId}
                      onChange={(e) => setPaymentSettings(prev => ({ ...prev, merchantId: e.target.value }))}
                      placeholder="Merchant ID"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <input
                      type={paymentSettings.showApiCredentials ? 'text' : 'password'}
                      value={paymentSettings.apiKey}
                      onChange={(e) => setPaymentSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="API Key"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <Shield size={20} color="#16a34a" />
                  <div>
                    <p style={{ fontSize: '14px', color: '#166534', margin: '0 0 4px 0', fontWeight: '500' }}>
                      Secure Payment Processing
                    </p>
                    <p style={{ fontSize: '12px', color: '#166534', margin: 0 }}>
                      All payment transactions are encrypted and processed securely through certified payment gateways.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Email Configuration
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Configure SMTP settings for sending emails and notifications
                </p>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* SMTP Settings */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                      placeholder="smtp.gmail.com"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                      placeholder="587"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Email Credentials */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Email Credentials
                    </label>
                    <button
                      onClick={() => toggleCredentials('email')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {emailSettings.showCredentials ? <EyeOff size={14} /> : <Eye size={14} />}
                      {emailSettings.showCredentials ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '12px', maxWidth: '500px' }}>
                    <input
                      type="text"
                      value={emailSettings.username}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Email Username"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <input
                      type={emailSettings.showCredentials ? 'text' : 'password'}
                      value={emailSettings.password}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Email Password"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* From Settings */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      From Email
                    </label>
                    <input
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                      placeholder="noreply@meritportal.com"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      From Name
                    </label>
                    <input
                      type="text"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                      placeholder="Merit Portal"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <AlertCircle size={20} color="#d97706" />
                  <div>
                    <p style={{ fontSize: '14px', color: '#92400e', margin: '0 0 4px 0', fontWeight: '500' }}>
                      Email Testing Recommended
                    </p>
                    <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                      Test your email configuration by sending a test email before saving settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ 
            marginTop: '32px', 
            paddingTop: '24px', 
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {saveStatus === 'success' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a' }}>
                  <Check size={16} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Settings saved successfully</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
                  <X size={16} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Failed to save settings</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => handleSave(activeTab)}
              disabled={isSaving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.6 : 1,
                transition: 'all 0.2s'
              }}
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

