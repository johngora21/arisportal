'use client';

import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Download,
  Eye,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Receipt,
  Building,
  PieChart
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'receipt' | 'invoice' | 'statement' | 'transaction';
  date: string;
  amount: number;
  status: 'pending' | 'processed' | 'error';
  uploadedAt: string;
}

interface FinancialStatement {
  id: string;
  name: string;
  period: string;
  generatedAt: string;
  status: 'ready' | 'processing' | 'error';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Q3 Bank Statement.pdf',
    type: 'statement',
    date: '2024-09-30',
    amount: 125000,
    status: 'processed',
    uploadedAt: '2024-10-01'
  },
  {
    id: '2',
    name: 'Office Rent Receipt.pdf',
    type: 'receipt',
    date: '2024-10-01',
    amount: 5000,
    status: 'processed',
    uploadedAt: '2024-10-02'
  },
  {
    id: '3',
    name: 'Client Invoice #1234.pdf',
    type: 'invoice',
    date: '2024-10-05',
    amount: 15000,
    status: 'pending',
    uploadedAt: '2024-10-06'
  },
  {
    id: '4',
    name: 'Vendor Payment Receipt.pdf',
    type: 'receipt',
    date: '2024-10-08',
    amount: 2500,
    status: 'error',
    uploadedAt: '2024-10-09'
  }
];

const mockStatements: FinancialStatement[] = [
  {
    id: '1',
    name: 'Income Statement Q3 2024',
    period: 'Q3 2024',
    generatedAt: '2024-10-01',
    status: 'ready'
  },
  {
    id: '2',
    name: 'Balance Sheet Q3 2024',
    period: 'Q3 2024',
    generatedAt: '2024-10-01',
    status: 'ready'
  },
  {
    id: '3',
    name: 'Cash Flow Statement Q3 2024',
    period: 'Q3 2024',
    generatedAt: '2024-10-01',
    status: 'processing'
  }
];

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState<'documents' | 'statements' | 'analysis'>('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return { color: '#10b981', bg: '#d1fae5' };
      case 'pending': return { color: '#f59e0b', bg: '#fef3c7' };
      case 'error': return { color: '#ef4444', bg: '#fee2e2' };
      default: return { color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'receipt': return <Receipt size={16} />;
      case 'invoice': return <FileText size={16} />;
      case 'statement': return <Building size={16} />;
      case 'transaction': return <DollarSign size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Financial Audit & Intelligence
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Upload documents, generate financial statements, and get AI-powered business insights
            </p>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Upload size={20} />
            Upload Documents
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FileText size={20} color="#0f172a" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Documents</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {mockDocuments.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <CheckCircle size={20} color="#10b981" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Processed</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {mockDocuments.filter(d => d.status === 'processed').length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <BarChart3 size={20} color="#f59e0b" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Statements</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {mockStatements.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <DollarSign size={20} color="#8b5cf6" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Value</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              ${mockDocuments.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'documents', label: 'Documents', icon: <FileText size={16} /> },
            { id: 'statements', label: 'Financial Statements', icon: <BarChart3 size={16} /> },
            { id: 'analysis', label: 'AI Analysis', icon: <TrendingUp size={16} /> }
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
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#0f172a' : 'white',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                boxShadow: activeTab === tab.id ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        {activeTab === 'documents' && (
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
              width: '400px'
            }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                width: '16px',
                height: '20px'
              }} />
              <input
                type="text"
                placeholder="Search documents..."
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
            
            {/* Type Filter - positioned from right */}
            <div style={{
              position: 'absolute',
              right: '50px',
              top: '0px'
            }}>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '12px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  background: 'white',
                  width: '180px'
                }}
              >
                <option value="all">All Types</option>
                <option value="receipt">Receipts</option>
                <option value="invoice">Invoices</option>
                <option value="statement">Statements</option>
                <option value="transaction">Transactions</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'documents' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Uploaded Documents ({filteredDocuments.length})
            </h3>
          </div>
          
          <div style={{ padding: '20px' }}>
            {filteredDocuments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>No documents found</h3>
                <p style={{ fontSize: '14px', margin: 0 }}>Upload your first document to get started with financial auditing.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    padding: '16px', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px',
                      backgroundColor: '#e0f2fe',
                      color: '#0f172a'
                    }}>
                      {getTypeIcon(doc.type)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                        {doc.name}
                      </h4>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                        <span>Date: {doc.date}</span>
                        <span>Amount: ${doc.amount.toLocaleString()}</span>
                        <span>Uploaded: {doc.uploadedAt}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        ...getStatusColor(doc.status)
                      }}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                      
                      <button style={{ padding: '6px', border: 'none', borderRadius: '6px', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer' }}>
                        <Eye size={16} />
                      </button>
                      <button style={{ padding: '6px', border: 'none', borderRadius: '6px', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer' }}>
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'statements' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Generated Financial Statements
            </h3>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gap: '16px' }}>
              {mockStatements.map((statement) => (
                <div key={statement.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  padding: '20px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '8px',
                    backgroundColor: statement.status === 'ready' ? '#d1fae5' : statement.status === 'processing' ? '#fef3c7' : '#fee2e2',
                    color: statement.status === 'ready' ? '#10b981' : statement.status === 'processing' ? '#f59e0b' : '#ef4444'
                  }}>
                    {statement.status === 'ready' ? <CheckCircle size={24} /> : 
                     statement.status === 'processing' ? <BarChart3 size={24} /> : 
                     <AlertCircle size={24} />}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                      {statement.name}
                    </h4>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                      <span>Period: {statement.period}</span>
                      <span>Generated: {statement.generatedAt}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: statement.status === 'ready' ? '#d1fae5' : statement.status === 'processing' ? '#fef3c7' : '#fee2e2',
                      color: statement.status === 'ready' ? '#10b981' : statement.status === 'processing' ? '#f59e0b' : '#ef4444'
                    }}>
                      {statement.status.charAt(0).toUpperCase() + statement.status.slice(1)}
                    </span>
                    
                    {statement.status === 'ready' && (
                      <button style={{ 
                        padding: '8px 16px', 
                        border: 'none', 
                        borderRadius: '6px', 
                        background: '#0f172a', 
                        color: 'white', 
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        Download
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
            AI-Powered Financial Analysis
          </h3>
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <PieChart size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>AI Analysis Coming Soon</h4>
            <p style={{ fontSize: '14px', margin: 0 }}>Upload more documents to enable AI-powered financial insights and recommendations.</p>
          </div>
        </div>
      )}
    </div>
  );
}

