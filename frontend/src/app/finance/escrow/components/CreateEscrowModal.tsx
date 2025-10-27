'use client';

import React, { useState } from 'react';
import { 
  X,
  Shield,
  User,
  Building,
  DollarSign,
  Calendar,
  FileText,
  Save,
  Plus
} from 'lucide-react';

interface CreateEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (escrowData: any) => void;
}

const CreateEscrowModal: React.FC<CreateEscrowModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    userRole: '', // 'PAYER', 'PAYEE', 'BUYER', 'SELLER', 'SERVICE_PROVIDER', 'CLIENT'
    title: '',
    description: '',
    payerName: '',
    payerEmail: '',
    payerPhone: '',
    payeeName: '',
    payeeEmail: '',
    payeePhone: '',
    totalAmount: '',
    paymentType: 'FULL', // 'FULL' or 'MILESTONE'
    releaseDate: '',
    terms: '',
    additionalNotes: ''
  });

  const [milestones, setMilestones] = useState([
    { id: 1, description: '', amount: '', completionDate: '' }
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const inputStyle = (hasError: boolean = false) => ({
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '14px',
    paddingRight: '14px',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
    '&:focus': {
      borderColor: 'var(--mc-sidebar-bg)',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMilestone = () => {
    const newId = milestones.length + 1;
    setMilestones(prev => [...prev, { id: newId, description: '', amount: '', completionDate: '' }]);
  };

  const removeMilestone = (id: number) => {
    if (milestones.length > 1) {
      setMilestones(prev => prev.filter(milestone => milestone.id !== id));
    }
  };

  const updateMilestone = (id: number, field: string, value: string) => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    ));
  };

  const getTotalMilestoneAmount = () => {
    return milestones.reduce((total, milestone) => total + (parseFloat(milestone.amount) || 0), 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = [
      { field: 'userRole', label: 'Your Role' },
      { field: 'title', label: 'Transaction Title' },
      { field: 'payerName', label: 'Payer Name' },
      { field: 'payerEmail', label: 'Payer Email' },
      { field: 'payerPhone', label: 'Payer Phone' },
      { field: 'payeeName', label: 'Payee Name' },
      { field: 'payeeEmail', label: 'Payee Email' },
      { field: 'payeePhone', label: 'Payee Phone' },
      { field: 'totalAmount', label: 'Total Amount' }
    ];

    for (const { field, label } of requiredFields) {
      const value = formData[field as keyof typeof formData];
      if (!value || String(value).trim() === '') {
        alert(`Please fill in ${label}.`);
        return;
      }
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.payerEmail)) {
      alert('Please enter a valid payer email address.');
      return;
    }
    if (!emailRegex.test(formData.payeeEmail)) {
      alert('Please enter a valid payee email address.');
      return;
    }

    // Validate amount
    const amount = parseFloat(formData.totalAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid total amount.');
      return;
    }

    // Validate release date for full payments
    if (formData.paymentType === 'FULL' && !formData.releaseDate) {
      alert('Please select a release date for full payment.');
      return;
    }

    if (formData.paymentType === 'MILESTONE') {
      const totalMilestoneAmount = getTotalMilestoneAmount();
      if (totalMilestoneAmount !== parseFloat(formData.totalAmount)) {
        alert('Total milestone amounts must equal the total amount.');
        return;
      }
      
      const hasEmptyMilestones = milestones.some(m => !m.description || !m.amount || !m.completionDate);
      if (hasEmptyMilestones) {
        alert('Please fill in all milestone details.');
        return;
      }
    }

    try {
      // Upload files first if any
      let documents = [];
      if (uploadedFiles.length > 0) {
        const formDataToSend = new FormData();
        uploadedFiles.forEach((file, index) => {
          formDataToSend.append(`files`, file);
        });
        
        const uploadResponse = await fetch('http://localhost:8000/api/v1/escrow-documents', {
          method: 'POST',
          body: formDataToSend
        });
        
        if (uploadResponse.ok) {
          documents = await uploadResponse.json();
        }
      }

      const escrowData = {
        ...formData,
        milestones: formData.paymentType === 'MILESTONE' ? milestones : null,
        documents: documents,
        createdBy: 'frontend-user'
      };
      
      onCreate?.(escrowData);
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload documents. Please try again.');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

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
        padding: '32px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              padding: '12px', 
              backgroundColor: "var(--mc-sidebar-bg)", 
              borderRadius: '12px',
              color: 'white'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Create New Escrow
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                Set up a secure escrow account for your transaction
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* User Role Selection */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <User size={20} />
              Your Role *
            </h3>
            
              <div>
              <select
                name="userRole"
                value={formData.userRole}
                  onChange={handleInputChange}
                  required
                  style={{
                    ...inputStyle(),
                  fontSize: '15px',
                  width: '60%'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
              >
                <option value="">Select your role</option>
                <option value="PAYER">I am making the payment (Payer/Buyer/Client)</option>
                <option value="PAYEE">I will receive the payment (Payee/Seller/Service Provider)</option>
              </select>
              {formData.userRole && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: formData.userRole === 'PAYER'
                    ? '#dbeafe'
                    : '#d1fae5',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: formData.userRole === 'PAYER'
                    ? '#1e40af'
                    : '#065f46',
                  border: `1px solid ${formData.userRole === 'PAYER'
                    ? '#93c5fd'
                    : '#86efac'}`
                }}>
                  <strong>Note:</strong> {
                    formData.userRole === 'PAYER'
                      ? 'You will control the release of funds. You can release payments directly.'
                      : 'You can request fund release. The payer will need to approve your request to release the funds.'
                  }
              </div>
              )}
            </div>
          </div>

          {/* Payer Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <User size={20} />
              Payer Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="payerName"
                  value={formData.payerName}
                  onChange={handleInputChange}
                  placeholder="Payer's full name"
                  required
                  style={inputStyle()}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="payerEmail"
                  value={formData.payerEmail}
                  onChange={handleInputChange}
                  placeholder="payer@example.com"
                  required
                  style={inputStyle()}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  name="payerPhone"
                  value={formData.payerPhone}
                  onChange={handleInputChange}
                  placeholder="+255 123 456 789"
                  required
                  style={inputStyle()}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Payee Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Building size={20} />
              Payee Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="payeeName"
                  value={formData.payeeName}
                  onChange={handleInputChange}
                  placeholder="Payee's full name or company"
                  required
                  style={inputStyle()}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="payeeEmail"
                  value={formData.payeeEmail}
                  onChange={handleInputChange}
                  placeholder="payee@example.com"
                  required
                  style={inputStyle()}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  name="payeePhone"
                  value={formData.payeePhone}
                  onChange={handleInputChange}
                  placeholder="+255 123 456 789"
                  required
                  style={inputStyle()}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FileText size={20} />
              Transaction Details
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Transaction Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Property Purchase - Dar es Salaam"
                  required
                  style={inputStyle()}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the transaction..."
                  rows={3}
                  style={{
                    ...inputStyle(),
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

            </div>
          </div>

          {/* Payment Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <DollarSign size={20} />
              Payment Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Total Amount (TZS) *
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                  min="0"
                  step="1000"
                  style={inputStyle()}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Payment Type *
                </label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  style={inputStyle()}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="FULL">Full Payment</option>
                  <option value="MILESTONE">Milestone Payments</option>
                </select>
              </div>
            </div>

            {formData.paymentType === 'FULL' && (
              <div style={{ marginTop: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Release Date *
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    ...inputStyle(),
                    width: '50%'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Milestone Payments */}
          {formData.paymentType === 'MILESTONE' && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FileText size={20} />
                Milestone Payments
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Total Milestone Amount
                  </span>
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: formData.totalAmount && getTotalMilestoneAmount() === parseFloat(formData.totalAmount) 
                      ? '#10b981' 
                      : '#ef4444'
                  }}>
                    {new Intl.NumberFormat('en-TZ', {
                      style: 'currency',
                      currency: 'TZS',
                      minimumFractionDigits: 0
                    }).format(getTotalMilestoneAmount())}
                  </span>
                </div>
                {formData.totalAmount && getTotalMilestoneAmount() !== parseFloat(formData.totalAmount) && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '8px 0 0 0' }}>
                    Milestone total must equal total amount
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    backgroundColor: '#f9fafb'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '16px' 
                    }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                        Milestone {index + 1}
                      </h4>
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMilestone(milestone.id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '6px', 
                          fontSize: '12px', 
                          fontWeight: '500', 
                          color: '#6b7280' 
                        }}>
                          Description *
                        </label>
                        <input
                          type="text"
                          value={milestone.description}
                          onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                          placeholder="e.g., Project planning and design"
                          required
                          style={inputStyle()}
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '6px', 
                          fontSize: '12px', 
                          fontWeight: '500', 
                          color: '#6b7280' 
                        }}>
                          Amount (TZS) *
                        </label>
                        <input
                          type="number"
                          value={milestone.amount}
                          onChange={(e) => updateMilestone(milestone.id, 'amount', e.target.value)}
                          placeholder="0"
                          required
                          min="0"
                          step="1000"
                          style={inputStyle()}
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '6px', 
                          fontSize: '12px', 
                          fontWeight: '500', 
                          color: '#6b7280' 
                        }}>
                          Completion Date *
                        </label>
                        <input
                          type="date"
                          value={milestone.completionDate}
                          onChange={(e) => updateMilestone(milestone.id, 'completionDate', e.target.value)}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          style={inputStyle()}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addMilestone}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    backgroundColor: '#f3f4f6',
                    border: '2px dashed #d1d5db',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                    e.currentTarget.style.borderColor = '#9ca3af';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                >
                  <Plus size={16} />
                  Add Milestone
                </button>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FileText size={20} />
              Terms & Conditions
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Terms & Conditions
                </label>
                <textarea
                  name="terms"
                  value={formData.terms}
                  onChange={handleInputChange}
                  placeholder="Specify the terms and conditions for fund release..."
                  rows={4}
                  style={{
                    ...inputStyle(),
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6b7280' 
                }}>
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes or special instructions..."
                  rows={3}
                  style={{
                    ...inputStyle(),
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FileText size={20} />
              Supporting Documents
            </h3>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '12px', 
                fontWeight: '500', 
                color: '#6b7280' 
              }}>
                Upload Contract Agreements (PDF, DOC, DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleFileChange}
                style={{
                  ...inputStyle(),
                  padding: '8px',
                  cursor: 'pointer'
                }}
              />
              {uploadedFiles.length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ef4444',
                          fontSize: '14px',
                          padding: '4px 8px'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                Upload your contract agreements or supporting documents for conflict resolution
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'flex-end',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Save size={16} />
              Create Escrow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEscrowModal;
