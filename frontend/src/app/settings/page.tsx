'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Smartphone, 
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

// SMS icon component
const SMSIcon = ({ size, color }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

// WhatsApp icon component
const WhatsAppIcon = ({ size, color }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [smsSettings, setSmsSettings] = useState({
    senderName: 'ARISPORTAL',
    smsType: 'bulk', // 'bulk' or 'two-way'
    apiKey: '',
    apiSecret: '',
    showApiCredentials: false
  });
  
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '587',
    username: '',
    password: '',
    fromEmail: '',
    fromName: 'Aris Portal',
    showCredentials: false
  });

  // Mock data for multiple configurations
  const [smsSenderNames, setSmsSenderNames] = useState([
    { id: 1, name: 'ARISPORTAL', type: 'bulk', status: 'approved', date: '2024-01-15' },
    { id: 2, name: 'MYCOMPANY', type: 'two-way', status: 'pending', date: '2024-01-20' },
    { id: 3, name: 'BUSINESS', type: 'bulk', status: 'rejected', date: '2024-01-10' }
  ]);

  const [emailConfigs, setEmailConfigs] = useState([
    { id: 1, fromEmail: 'noreply@arisportal.com', fromName: 'Aris Portal', smtpHost: 'smtp.gmail.com', port: '587', status: 'active' },
    { id: 2, fromEmail: 'support@mycompany.com', fromName: 'My Company', smtpHost: 'smtp.outlook.com', port: '587', status: 'active' }
  ]);

  const [whatsappNumbers, setWhatsappNumbers] = useState([
    { id: 1, businessName: 'My Business', phoneNumber: '+255 123 456 789', status: 'pending', date: '2024-01-20' },
    { id: 2, businessName: 'Support Team', phoneNumber: '+255 987 654 321', status: 'approved', date: '2024-01-18' }
  ]);

  const [whatsappSettings, setWhatsappSettings] = useState({
    businessName: 'My Business',
    phoneNumber: '+255 123 456 789',
    status: 'pending' // 'pending', 'approved', 'rejected'
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
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCredentials = (type: string) => {
    if (type === 'sms') {
      setSmsSettings(prev => ({ ...prev, showApiCredentials: !prev.showApiCredentials }));
    } else if (type === 'email') {
      setEmailSettings(prev => ({ ...prev, showCredentials: !prev.showCredentials }));
    }
  };

  const removeSmsSender = (id: number) => {
    setSmsSenderNames(prev => prev.filter(item => item.id !== id));
  };

  const removeEmailConfig = (id: number) => {
    setEmailConfigs(prev => prev.filter(item => item.id !== id));
  };

  const removeWhatsappNumber = (id: number) => {
    setWhatsappNumbers(prev => prev.filter(item => item.id !== id));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Settings size={20} /> },
    { id: 'sms', label: 'SMS Configuration', icon: <SMSIcon size={20} color="#4CAF50" /> },
    { id: 'whatsapp', label: 'WhatsApp Integration', icon: <WhatsAppIcon size={20} color="#25D366" /> },
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
              Configure SMS, WhatsApp, and email settings for your system
            </p>
          </div>
          <button
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            <DollarSign size={16} />
            Buy SMS Credits
          </button>
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
          {/* Overview */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Configuration Overview
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  View all configured sender names, email addresses, and WhatsApp numbers
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: '20px' }}>
                {/* Left Container - SMS Sender Names */}
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    SMS Sender Names
                  </h4>
                  {smsSenderNames.length === 0 ? (
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, textAlign: 'center', padding: '20px' }}>
                      No SMS sender names configured
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {smsSenderNames.map((sender) => (
                        <div key={sender.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 0',
                          borderBottom: '1px solid #e5e7eb'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                              {sender.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {sender.type === 'bulk' ? 'Bulk SMS' : 'Two-Way SMS'} - {sender.status}
                            </div>
                          </div>
                          <button
                            onClick={() => removeSmsSender(sender.id)}
                            style={{
                              backgroundColor: 'var(--mc-sidebar-bg)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500',
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
                            Deactivate
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Container - WhatsApp Numbers */}
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    WhatsApp Numbers
                  </h4>
                  {whatsappNumbers.length === 0 ? (
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, textAlign: 'center', padding: '20px' }}>
                      No WhatsApp numbers configured
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {whatsappNumbers.map((whatsapp) => (
                        <div key={whatsapp.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 0',
                          borderBottom: '1px solid #e5e7eb'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                              {whatsapp.businessName}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {whatsapp.phoneNumber} - {whatsapp.status}
                            </div>
                          </div>
                          <button
                            onClick={() => removeWhatsappNumber(whatsapp.id)}
                            style={{
                              backgroundColor: 'var(--mc-sidebar-bg)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500',
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
                            Deactivate
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Container - Email Configurations */}
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  gridColumn: '1 / -1'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    Email Configurations
                  </h4>
                  {emailConfigs.length === 0 ? (
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, textAlign: 'center', padding: '20px' }}>
                      No email configurations
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {emailConfigs.map((email) => (
                        <div key={email.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 0',
                          borderBottom: '1px solid #e5e7eb'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                              {email.fromName}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {email.fromEmail}
                            </div>
                          </div>
                          <button
                            onClick={() => removeEmailConfig(email.id)}
                            style={{
                              backgroundColor: 'var(--mc-sidebar-bg)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500',
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
                            Deactivate
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SMS Configuration */}
          {activeTab === 'sms' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                  SMS Configuration
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Request SMS sender name approval and configure messaging preferences
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
                      borderRadius: '20px',
                      fontSize: '14px',
                      maxWidth: '400px'
                    }}
                  />
                </div>

                {/* SMS Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                    SMS Type
                  </label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="smsType"
                        value="bulk"
                        checked={smsSettings.smsType === 'bulk'}
                        onChange={(e) => setSmsSettings(prev => ({ ...prev, smsType: e.target.value as 'bulk' | 'two-way' }))}
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
                        onChange={(e) => setSmsSettings(prev => ({ ...prev, smsType: e.target.value as 'bulk' | 'two-way' }))}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Two-Way SMS</span>
                    </label>
                  </div>
                </div>

                {/* Info Box */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '20px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <Shield size={20} color="#16a34a" />
                  <div>
                    <p style={{ fontSize: '14px', color: '#166534', margin: '0 0 4px 0', fontWeight: '500' }}>
                      Managed SMS Service
                    </p>
                    <p style={{ fontSize: '12px', color: '#166534', margin: 0 }}>
                      We handle all SMS provider integrations and API credentials. You just need to request sender name approval and start sending messages.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    style={{
                      backgroundColor: 'var(--mc-sidebar-bg)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '500',
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
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp Integration */}
          {activeTab === 'whatsapp' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                  WhatsApp Business Integration
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Connect your WhatsApp Business account for seamless messaging integration
                </p>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Business Information */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Business Name
                  </label>
                      <input
                    type="text"
                    value={whatsappSettings.businessName}
                    onChange={(e) => setWhatsappSettings(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Enter your business name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      maxWidth: '400px'
                    }}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    WhatsApp Business Phone Number
                  </label>
                      <input
                    type="tel"
                    value={whatsappSettings.phoneNumber}
                    onChange={(e) => setWhatsappSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+255 123 456 789"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                      fontSize: '14px',
                      maxWidth: '400px'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    Include country code (e.g., +255 for Tanzania)
                  </p>
                </div>

                {/* Info Box */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '20px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <WhatsAppIcon size={20} color="#25D366" />
                  <div>
                    <p style={{ fontSize: '14px', color: '#0c4a6e', margin: '0 0 4px 0', fontWeight: '500' }}>
                      WhatsApp Business Integration
                    </p>
                    <p style={{ fontSize: '12px', color: '#0c4a6e', margin: 0 }}>
                      We only support WhatsApp Business accounts which provide automated messaging, analytics, and business verification features.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    style={{
                      backgroundColor: 'var(--mc-sidebar-bg)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '500',
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
                    Submit
                  </button>
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
                  Configure SMTP settings for sending emails
                </p>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* SMTP Configuration */}
                <div style={{ display: 'grid', gap: '16px' }}>
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
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                      placeholder="587"
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
                </div>

                {/* Email Credentials */}
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Email Username
                    </label>
                    <input
                      type="text"
                      value={emailSettings.username}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Email Username"
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
                        Email Password
                      </label>
                    <input
                      type={emailSettings.showCredentials ? 'text' : 'password'}
                      value={emailSettings.password}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Email Password"
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
                </div>

                {/* From Email Configuration */}
                <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      From Email
                    </label>
                    <input
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                      placeholder="noreply@arisportal.com"
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
                      From Name
                    </label>
                    <input
                      type="text"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                      placeholder="Aris Portal"
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
                </div>

                {/* Info Box */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '20px',
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
            
                {/* Submit Button */}
                <div>
            <button
              style={{
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                      padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
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
                    Submit
            </button>
          </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}