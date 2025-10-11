'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Smartphone, 
  CreditCard, 
  MessageSquare, 
  Key,
  BookOpen,
  Code,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Globe,
  Lock,
  Download,
  Send,
  AlertCircle,
  Info
} from 'lucide-react';

// WhatsApp icon component
const WhatsAppIcon = ({ size, color }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

// SMS icon component
const SMSIcon = ({ size, color }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

export default function APIsPage() {
  const [activeTab, setActiveTab] = useState('sms');
  const [copiedApiKey, setCopiedApiKey] = useState<string | null>(null);
  
  // API Request States
  const [smsRequest, setSmsRequest] = useState({
    projectName: '',
    description: '',
    expectedVolume: '',
    useCase: 'bulk', // 'bulk' or 'two-way'
    website: '',
    contactEmail: ''
  });

  const [paymentRequest, setPaymentRequest] = useState({
    businessName: '',
    businessType: '',
    description: '',
    monthlyVolume: '',
    supportedMethods: ['mobile'], // ['mobile', 'card', 'bank']
    paymentPurpose: ['collection'], // ['collection', 'disbursement']
    website: '',
    contactEmail: ''
  });

  const [whatsappRequest, setWhatsappRequest] = useState({
    businessName: '',
    businessPhone: '',
    businessType: '',
    description: '',
    expectedMessages: '',
    website: '',
    contactEmail: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<string | null>(null);

  // Mock API Keys (these would come from backend)
  const apiKeys = {
    sms: {
      key: 'sms_live_sk_1234567890abcdef',
      status: 'active',
      createdAt: '2024-01-15',
      lastUsed: '2024-01-20'
    },
    payment: {
      key: 'pay_live_pk_abcdef1234567890',
      status: 'pending',
      createdAt: '2024-01-18',
      lastUsed: null
    },
    whatsapp: {
      key: 'wa_live_sk_9876543210fedcba',
      status: 'active',
      createdAt: '2024-01-10',
      lastUsed: '2024-01-19'
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedApiKey(type);
    setTimeout(() => setCopiedApiKey(null), 2000);
  };

  const handleSubmit = async (type: string) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmittedRequest(type);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'sms', label: 'SMS API', icon: <SMSIcon size={20} color="#4CAF50" /> },
    { id: 'payment', label: 'Payment API', icon: <CreditCard size={20} /> },
    { id: 'whatsapp', label: 'WhatsApp API', icon: <WhatsAppIcon size={20} color="#25D366" /> },
    { id: 'documentation', label: 'API Documentation', icon: <BookOpen size={20} /> }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              API Management
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Request API access and manage your integration credentials
            </p>
          </div>
        </div>
      </div>

      {/* Settings Container */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '20px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
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
          {/* SMS API */}
          {activeTab === 'sms' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                  SMS API Access
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Request API access for SMS messaging services
                </p>
              </div>

              {/* Current API Key */}
              {apiKeys.sms.key && (
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    Current API Key
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}>
                    <Key size={20} color="#6b7280" />
                    <code style={{ 
                      fontSize: '14px', 
                      fontFamily: 'monospace',
                      backgroundColor: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      flex: 1
                    }}>
                      {apiKeys.sms.key}
                    </code>
                    <button
                      onClick={() => copyToClipboard(apiKeys.sms.key, 'sms')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: 'var(--mc-sidebar-bg)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                      }}
                    >
                      {copiedApiKey === 'sms' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedApiKey === 'sms' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                    <span>Status: <span style={{ color: '#10b981', fontWeight: '500' }}>Active</span></span>
                    <span>Created: {apiKeys.sms.createdAt}</span>
                    <span>Last Used: {apiKeys.sms.lastUsed}</span>
                  </div>
                </div>
              )}

              {/* Request Form */}
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={smsRequest.projectName}
                      onChange={(e) => setSmsRequest(prev => ({ ...prev, projectName: e.target.value }))}
                      placeholder="My Business"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={smsRequest.contactEmail}
                      onChange={(e) => setSmsRequest(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="developer@company.com"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Project Description
                  </label>
                  <textarea
                    value={smsRequest.description}
                    onChange={(e) => setSmsRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe how you plan to use SMS API..."
                    rows={4}
                    style={{
                      width: '300px',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Expected Monthly Volume
                    </label>
                    <select
                      value={smsRequest.expectedVolume}
                      onChange={(e) => setSmsRequest(prev => ({ ...prev, expectedVolume: e.target.value }))}
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select volume</option>
                      <option value="<1000">Less than 1,000</option>
                      <option value="1000-10000">1,000 - 10,000</option>
                      <option value="10000-100000">10,000 - 100,000</option>
                      <option value=">100000">More than 100,000</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Use Case
                    </label>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="smsUseCase"
                          value="bulk"
                          checked={smsRequest.useCase === 'bulk'}
                          onChange={(e) => setSmsRequest(prev => ({ ...prev, useCase: e.target.value }))}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Bulk SMS</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="smsUseCase"
                          value="two-way"
                          checked={smsRequest.useCase === 'two-way'}
                          onChange={(e) => setSmsRequest(prev => ({ ...prev, useCase: e.target.value }))}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Two-Way SMS</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={smsRequest.website}
                    onChange={(e) => setSmsRequest(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourcompany.com"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                  />
                </div>

                <button
                  onClick={() => handleSubmit('sms')}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Request SMS API Access
                    </>
                  )}
                </button>

                {submittedRequest === 'sms' && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <Check size={20} color="#16a34a" />
                    <div>
                      <p style={{ fontSize: '14px', color: '#166534', margin: '0 0 4px 0', fontWeight: '500' }}>
                        Request Submitted
                      </p>
                      <p style={{ fontSize: '12px', color: '#166534', margin: 0 }}>
                        Your SMS API access request has been submitted. Our team will review it within 24-48 hours.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment API */}
          {activeTab === 'payment' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Payment API Access
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Request API access for payment processing services
                </p>
              </div>

              {/* Current API Key */}
              {apiKeys.payment.key && (
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    Current API Key
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}>
                    <Key size={20} color="#6b7280" />
                    <code style={{ 
                      fontSize: '14px', 
                      fontFamily: 'monospace',
                      backgroundColor: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      flex: 1
                    }}>
                      {apiKeys.payment.key}
                    </code>
                    <button
                      onClick={() => copyToClipboard(apiKeys.payment.key, 'payment')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: 'var(--mc-sidebar-bg)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                      }}
                    >
                      {copiedApiKey === 'payment' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedApiKey === 'payment' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                    <span>Status: <span style={{ color: '#f59e0b', fontWeight: '500' }}>Pending</span></span>
                    <span>Created: {apiKeys.payment.createdAt}</span>
                    <span>Last Used: {apiKeys.payment.lastUsed || 'Never'}</span>
                  </div>
                </div>
              )}

              {/* Request Form */}
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={paymentRequest.businessName}
                      onChange={(e) => setPaymentRequest(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="My Business"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={paymentRequest.contactEmail}
                      onChange={(e) => setPaymentRequest(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="developer@company.com"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Business Type
                    </label>
                    <input
                      type="text"
                      value={paymentRequest.businessType}
                      onChange={(e) => setPaymentRequest(prev => ({ ...prev, businessType: e.target.value }))}
                      placeholder="E-commerce, SaaS, Marketplace, Non-profit, Other"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Expected Monthly Volume
                    </label>
                    <select
                      value={paymentRequest.monthlyVolume}
                      onChange={(e) => setPaymentRequest(prev => ({ ...prev, monthlyVolume: e.target.value }))}
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select volume</option>
                      <option value="<10000">Less than $10,000</option>
                      <option value="10000-100000">$10,000 - $100,000</option>
                      <option value="100000-1000000">$100,000 - $1,000,000</option>
                      <option value=">1000000">More than $1,000,000</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Project Description
                  </label>
                  <textarea
                    value={paymentRequest.description}
                    onChange={(e) => setPaymentRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe how you plan to use Payment API..."
                    rows={4}
                    style={{
                      width: '300px',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Payment Purpose
                  </label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={paymentRequest.paymentPurpose.includes('collection')}
                        onChange={(e) => {
                          const purposes = e.target.checked 
                            ? [...paymentRequest.paymentPurpose, 'collection']
                            : paymentRequest.paymentPurpose.filter(p => p !== 'collection');
                          setPaymentRequest(prev => ({ ...prev, paymentPurpose: purposes }));
                        }}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Collection</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={paymentRequest.paymentPurpose.includes('disbursement')}
                        onChange={(e) => {
                          const purposes = e.target.checked 
                            ? [...paymentRequest.paymentPurpose, 'disbursement']
                            : paymentRequest.paymentPurpose.filter(p => p !== 'disbursement');
                          setPaymentRequest(prev => ({ ...prev, paymentPurpose: purposes }));
                        }}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Disbursement</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                    Supported Payment Methods
                  </label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {['mobile', 'card', 'bank'].map((method) => (
                      <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={paymentRequest.supportedMethods.includes(method)}
                          onChange={(e) => {
                            const methods = e.target.checked 
                              ? [...paymentRequest.supportedMethods, method]
                              : paymentRequest.supportedMethods.filter(m => m !== method);
                            setPaymentRequest(prev => ({ ...prev, supportedMethods: methods }));
                          }}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>
                          {method === 'mobile' ? 'Mobile Money' : method === 'card' ? 'Cards' : 'Bank Transfer'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={paymentRequest.website}
                    onChange={(e) => setPaymentRequest(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourcompany.com"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                  />
                </div>

                <button
                  onClick={() => handleSubmit('payment')}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Request Payment API Access
                    </>
                  )}
                </button>

                {submittedRequest === 'payment' && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <Check size={20} color="#16a34a" />
                    <div>
                      <p style={{ fontSize: '14px', color: '#166534', margin: '0 0 4px 0', fontWeight: '500' }}>
                        Request Submitted
                      </p>
                      <p style={{ fontSize: '12px', color: '#166534', margin: 0 }}>
                        Your Payment API access request has been submitted. Our team will review it within 24-48 hours.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WhatsApp API */}
          {activeTab === 'whatsapp' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                  WhatsApp API Access
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Request API access for WhatsApp Business messaging
                </p>
              </div>

              {/* Current API Key */}
              {apiKeys.whatsapp.key && (
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    Current API Key
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}>
                    <Key size={20} color="#6b7280" />
                    <code style={{ 
                      fontSize: '14px', 
                      fontFamily: 'monospace',
                      backgroundColor: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      flex: 1
                    }}>
                      {apiKeys.whatsapp.key}
                    </code>
                    <button
                      onClick={() => copyToClipboard(apiKeys.whatsapp.key, 'whatsapp')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: 'var(--mc-sidebar-bg)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                      }}
                    >
                      {copiedApiKey === 'whatsapp' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedApiKey === 'whatsapp' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                    <span>Status: <span style={{ color: '#10b981', fontWeight: '500' }}>Active</span></span>
                    <span>Created: {apiKeys.whatsapp.createdAt}</span>
                    <span>Last Used: {apiKeys.whatsapp.lastUsed}</span>
                  </div>
                </div>
              )}

              {/* Request Form */}
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={whatsappRequest.businessName}
                      onChange={(e) => setWhatsappRequest(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="My Business"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Business Phone
                    </label>
                    <input
                      type="tel"
                      value={whatsappRequest.businessPhone}
                      onChange={(e) => setWhatsappRequest(prev => ({ ...prev, businessPhone: e.target.value }))}
                      placeholder="+255 123 456 789"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Business Type
                    </label>
                    <input
                      type="text"
                      value={whatsappRequest.businessType}
                      onChange={(e) => setWhatsappRequest(prev => ({ ...prev, businessType: e.target.value }))}
                      placeholder="E-commerce, SaaS, Customer Service, Marketing, Other"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Expected Monthly Messages
                    </label>
                    <select
                      value={whatsappRequest.expectedMessages}
                      onChange={(e) => setWhatsappRequest(prev => ({ ...prev, expectedMessages: e.target.value }))}
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select volume</option>
                      <option value="<1000">Less than 1,000</option>
                      <option value="1000-10000">1,000 - 10,000</option>
                      <option value="10000-100000">10,000 - 100,000</option>
                      <option value=">100000">More than 100,000</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Project Description
                  </label>
                  <textarea
                    value={whatsappRequest.description}
                    onChange={(e) => setWhatsappRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe how you plan to use WhatsApp API..."
                    rows={4}
                    style={{
                      width: '300px',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={whatsappRequest.website}
                      onChange={(e) => setWhatsappRequest(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourcompany.com"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={whatsappRequest.contactEmail}
                      onChange={(e) => setWhatsappRequest(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="developer@company.com"
                      style={{
                        width: '300px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleSubmit('whatsapp')}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Request WhatsApp API Access
                    </>
                  )}
                </button>

                {submittedRequest === 'whatsapp' && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <Check size={20} color="#16a34a" />
                    <div>
                      <p style={{ fontSize: '14px', color: '#166534', margin: '0 0 4px 0', fontWeight: '500' }}>
                        Request Submitted
                      </p>
                      <p style={{ fontSize: '12px', color: '#166534', margin: 0 }}>
                        Your WhatsApp API access request has been submitted. Our team will review it within 24-48 hours.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* API Documentation */}
          {activeTab === 'documentation' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                  API Documentation
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Complete API reference and integration guides
                </p>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Quick Start */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code size={20} />
                    Quick Start Guide
                  </h4>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
                        1. Get Your API Key
                      </h5>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        Request API access through the tabs above. Once approved, you'll receive your API key.
                      </p>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
                        2. Make Your First Request
                      </h5>
                      <div style={{
                        backgroundColor: '#1f2937',
                        color: '#f9fafb',
                        padding: '16px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        overflow: 'auto'
                      }}>
                        <div>curl -X POST https://api.arisportal.com/v1/sms/send \</div>
                        <div style={{ marginLeft: '20px' }}>-H "Authorization: Bearer YOUR_API_KEY" \</div>
                        <div style={{ marginLeft: '20px' }}>-H "Content-Type: application/json" \</div>
                        <div style={{ marginLeft: '20px' }}>-d '{`{"to": "+255123456789", "message": "Hello World!"}`}'</div>
                      </div>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
                        3. Handle Responses
                      </h5>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        All APIs return JSON responses with consistent error handling and status codes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* API References */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {/* SMS API */}
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <SMSIcon size={20} color="#4CAF50" />
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        SMS API
                      </h4>
                    </div>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
                      Send bulk SMS messages and handle two-way messaging
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        <span>POST /v1/sms/send</span>
                        <ExternalLink size={12} />
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        <span>GET /v1/sms/status</span>
                        <ExternalLink size={12} />
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        <span>GET /v1/sms/webhooks</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Payment API */}
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <CreditCard size={20} color="#10b981" />
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        Payment API
                      </h4>
                    </div>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
                      Process payments through mobile money and cards
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        <span>POST /v1/payments/create</span>
                        <ExternalLink size={12} />
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        <span>GET /v1/payments/{'{id}'}</span>
                        <ExternalLink size={12} />
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        <span>POST /v1/payments/refund</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp API */}
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <WhatsAppIcon size={20} color="#25D366" />
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        WhatsApp API
                      </h4>
                    </div>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
                      Send messages and manage WhatsApp Business conversations
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        <span>POST /v1/whatsapp/send</span>
                        <ExternalLink size={12} />
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        <span>GET /v1/whatsapp/messages</span>
                        <ExternalLink size={12} />
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        <span>POST /v1/whatsapp/webhooks</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={20} />
                    Additional Resources
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}>
                      <BookOpen size={20} color="#6b7280" />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>SDK Downloads</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Node.js, Python, PHP</div>
                      </div>
                    </button>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}>
                      <Code size={20} color="#6b7280" />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Code Examples</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Sample implementations</div>
                      </div>
                    </button>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}>
                      <Shield size={20} color="#6b7280" />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Security Guide</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Best practices</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




