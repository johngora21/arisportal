"use client";

import React, { useState } from "react";
import { 
  CreditCard, Search, ArrowLeft, DollarSign, Plus, Edit, Eye, 
  CheckCircle, Clock, AlertCircle, Building, User, Calendar, 
  Download, ArrowRight, Banknote
} from "lucide-react";

export default function PaymentMethodsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);

  const paymentMethods = [
    {
      id: 1,
      name: "CRDB Bank Transfer",
      type: "Bank Transfer",
      description: "Direct deposit to CRDB bank accounts",
      status: "Active",
      icon: <Building size={20} color="#10b981" />
    },
    {
      id: 2,
      name: "NMB Bank Transfer",
      type: "Bank Transfer",
      description: "Direct deposit to NMB bank accounts",
      status: "Active",
      icon: <Building size={20} color="var(--mc-sidebar-bg)" />
    },
    {
      id: 3,
      name: "M-Pesa",
      type: "Mobile Money",
      description: "Mobile money payments via Vodacom M-Pesa",
      status: "Active",
      icon: <CreditCard size={20} color="#f59e0b" />
    },
    {
      id: 4,
      name: "Tigo Pesa",
      type: "Mobile Money",
      description: "Mobile money payments via Tigo Pesa",
      status: "Inactive",
      icon: <CreditCard size={20} color="#ef4444" />
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      employeeName: "John Mwalimu",
      amount: 2400000,
      method: "CRDB Bank Transfer",
      accountNumber: "****1234",
      status: "Completed",
      processedDate: "2024-01-15",
      transactionId: "TXN001234"
    },
    {
      id: 2,
      employeeName: "Sarah Mwamba",
      amount: 2950000,
      method: "NMB Bank Transfer",
      accountNumber: "****5678",
      status: "Completed",
      processedDate: "2024-01-15",
      transactionId: "TXN001235"
    },
    {
      id: 3,
      employeeName: "Michael Kimaro",
      amount: 2030000,
      method: "M-Pesa",
      accountNumber: "+255 123 456 789",
      status: "Pending",
      processedDate: "2024-01-15",
      transactionId: "TXN001236"
    }
  ];

  const filteredPayments = paymentHistory.filter(payment =>
    payment.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px'
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Payment Methods
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage bank transfers and payment processing for employees
            </p>
          </div>
        </div>
        
        <div style={{
          position: 'relative',
          height: '40px',
          marginBottom: '24px'
        }}>
          {/* Search Bar - positioned from right */}
          <div style={{ 
            position: 'absolute',
            right: '290px',
            top: '0px',
            width: '300px'
          }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              width: '16px',
              height: '20px'
            }} />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '16px',
                paddingTop: '12px',
                paddingBottom: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Month Filter - positioned from right */}
          <div style={{
            position: 'absolute',
            right: '50px',
            top: '0px'
          }}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                padding: '12px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                backgroundColor: 'white',
                width: '150px'
              }}
            >
              <option value="2024-01">January 2024</option>
              <option value="2024-02">February 2024</option>
              <option value="2024-03">March 2024</option>
            </select>
          </div>
        </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowAddMethodModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              Add Method
            </button>
            <button
              onClick={() => setShowPaymentModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <ArrowRight size={16} />
              Process Payments
            </button>
          </div>
        </div>
      </div>

      {/* Payment Methods Overview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {paymentMethods.map((method) => (
          <div key={method.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#f3f4f6',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {method.icon}
              </div>
              <span style={{
                padding: '4px 8px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: method.status === 'Active' ? '#dcfce7' : '#fee2e2',
                color: method.status === 'Active' ? '#166534' : '#dc2626'
              }}>
                {method.status}
              </span>
            </div>
            <h4 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              margin: '0 0 8px 0' 
            }}>
              {method.name}
            </h4>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: '0 0 16px 0',
              lineHeight: '1.4'
            }}>
              {method.description}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: '#6b7280'
              }}>
                <Eye size={16} style={{ marginRight: '4px' }} />
                View
              </button>
              <button style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                <Edit size={16} style={{ marginRight: '4px' }} />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment History */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Payment History - {selectedMonth}
          </h3>
          <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={16} color="#10b981" />
              Completed: {paymentHistory.filter(p => p.status === 'Completed').length}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={16} color="#f59e0b" />
              Pending: {paymentHistory.filter(p => p.status === 'Pending').length}
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Employee
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Amount
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Payment Method
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Account Details
                </th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Status
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Transaction ID
                </th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        {payment.employeeName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {payment.processedDate}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                    TZS {payment.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#1f2937' }}>
                    {payment.method}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                    {payment.accountNumber}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: payment.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                      color: payment.status === 'Completed' ? '#166534' : '#92400e'
                    }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#6b7280' }}>
                    {payment.transactionId}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Eye size={16} color="#6b7280" />
                      </button>
                      <button style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Download size={16} color="#6b7280" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Payments Modal */}
      {showPaymentModal && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
              Process Payments for {selectedMonth}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>
              This will process salary payments for all employees using their configured payment methods. Are you sure you want to continue?
            </p>
            
            <div style={{ 
              backgroundColor: '#fef3c7', 
              border: '1px solid #f59e0b', 
              borderRadius: '20px', 
              padding: '12px', 
              marginBottom: '24px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} color="#f59e0b" />
                <span style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
                  Total amount to be processed: TZS {paymentHistory.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  // Handle payment processing
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Process Payments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddMethodModal && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
              Add Payment Method
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Method Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Direct Bank Transfer"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Type
                </label>
                <select style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  outline: 'none'
                }}>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Digital Wallet">Digital Wallet</option>
                  <option value="Physical Check">Physical Check</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Description
                </label>
                <textarea
                  placeholder="Describe this payment method..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddMethodModal(false)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddMethodModal(false)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
