'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  Trash2
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'financial' | 'operational' | 'analytical' | 'compliance';
  period: string;
  generatedAt: string;
  status: 'ready' | 'processing' | 'error';
  size: string;
  description: string;
}

interface ReportsProps {
  // Add any props you need for the reports component
}

export default function Reports({}: ReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [reportType, setReportType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportToGenerate, setSelectedReportToGenerate] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (value: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', 
    currency: 'TZS', 
    minimumFractionDigits: 0
  }).format(value);

  // Sample reports data
  const reports: Report[] = [
    {
      id: '1',
      name: 'Monthly Financial Summary',
      type: 'financial',
      period: 'January 2024',
      generatedAt: '2024-01-31',
      status: 'ready',
      size: '2.4 MB',
      description: 'Comprehensive monthly financial overview including P&L, balance sheet, and cash flow'
    },
    {
      id: '2',
      name: 'Client Revenue Analysis',
      type: 'analytical',
      period: 'Q4 2024',
      generatedAt: '2024-01-15',
      status: 'ready',
      size: '1.8 MB',
      description: 'Detailed analysis of client revenue patterns and growth trends'
    },
    {
      id: '3',
      name: 'Expense Breakdown Report',
      type: 'operational',
      period: 'December 2024',
      generatedAt: '2024-01-10',
      status: 'ready',
      size: '1.2 MB',
      description: 'Categorized expense analysis with budget comparisons'
    },
    {
      id: '4',
      name: 'Tax Compliance Report',
      type: 'compliance',
      period: '2024 Tax Year',
      generatedAt: '2024-01-05',
      status: 'ready',
      size: '3.1 MB',
      description: 'Annual tax compliance documentation and calculations'
    },
    {
      id: '5',
      name: 'Cash Flow Forecast',
      type: 'financial',
      period: 'Next 6 Months',
      generatedAt: '2024-01-20',
      status: 'processing',
      size: '1.5 MB',
      description: 'Projected cash flow analysis for the next 6 months'
    },
    {
      id: '6',
      name: 'Performance Dashboard',
      type: 'operational',
      period: 'Current Quarter',
      generatedAt: '2024-01-18',
      status: 'error',
      size: '2.2 MB',
      description: 'Quarterly performance metrics and KPI analysis'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle size={16} color="#10b981" />;
      case 'processing': return <Clock size={16} color="#f59e0b" />;
      case 'error': return <AlertCircle size={16} color="#ef4444" />;
      default: return <Clock size={16} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return { bg: '#d1fae5', color: '#10b981' };
      case 'processing': return { bg: '#fef3c7', color: '#f59e0b' };
      case 'error': return { bg: '#fee2e2', color: '#ef4444' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return <DollarSign size={16} />;
      case 'operational': return <BarChart3 size={16} />;
      case 'analytical': return <TrendingUp size={16} />;
      case 'compliance': return <FileText size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return '#10b981';
      case 'operational': return '#3b82f6';
      case 'analytical': return '#8b5cf6';
      case 'compliance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = reportType === 'all' || report.type === reportType;
    
    return matchesSearch && matchesType;
  });

  // Report generation options
  const reportGenerationOptions = [
    { value: 'financial_summary', label: 'Financial Summary', description: 'Complete financial overview with P&L, balance sheet, and cash flow' },
    { value: 'revenue_analysis', label: 'Revenue Analysis', description: 'Detailed revenue breakdown by source and period' },
    { value: 'expense_report', label: 'Expense Report', description: 'Categorized expense analysis with budget comparisons' },
    { value: 'cash_flow_statement', label: 'Cash Flow Statement', description: 'Operating, investing, and financing cash flows' },
    { value: 'tax_compliance', label: 'Tax Compliance Report', description: 'Annual tax documentation and calculations' },
    { value: 'client_analysis', label: 'Client Analysis', description: 'Client revenue patterns and growth trends' },
    { value: 'performance_dashboard', label: 'Performance Dashboard', description: 'KPI metrics and performance indicators' }
  ];

  const handleGenerateReport = () => {
    if (selectedReportToGenerate) {
      // Here you would implement the actual report generation logic
      console.log('Generating report:', selectedReportToGenerate);
      setSelectedReportToGenerate('');
    }
  };

  // Report statistics
  const reportStats = [
    { label: 'Total Reports', value: 24, change: '+3 this month', color: '#3b82f6' },
    { label: 'Ready Reports', value: 18, change: '75% complete', color: '#10b981' },
    { label: 'Processing', value: 4, change: 'In progress', color: '#f59e0b' },
    { label: 'Errors', value: 2, change: 'Need attention', color: '#ef4444' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>


      {/* Generate Report Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          onClick={handleGenerateReport}
          disabled={!selectedReportToGenerate}
          style={{
            padding: '10px 16px',
            backgroundColor: selectedReportToGenerate ? 'var(--mc-sidebar-bg)' : '#d1d5db',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: selectedReportToGenerate ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={16} />
          Generate Report
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginBottom: '20px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '300px',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s ease',
              backgroundColor: 'white'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--mc-sidebar-bg)';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Report Type Selection */}
        <select
          value={selectedReportToGenerate}
          onChange={(e) => setSelectedReportToGenerate(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '20px',
            fontSize: '14px',
            backgroundColor: 'white',
            width: '250px',
            outline: 'none',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--mc-sidebar-bg)';
            e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="">Select Report Type</option>
          {reportGenerationOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
        {filteredReports.map(report => (
          <div 
            key={report.id} 
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  backgroundColor: getTypeColor(report.type) + '20',
                  color: getTypeColor(report.type),
                  borderRadius: '20px',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getTypeIcon(report.type)}
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: getTypeColor(report.type),
                  textTransform: 'capitalize'
                }}>
                  {report.type}
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                ...getStatusColor(report.status)
              }}>
                {getStatusIcon(report.status)}
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                {report.name}
              </h4>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>
                {report.description}
              </p>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                {report.period} • {report.size}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Generated: {formatDate(report.generatedAt)}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {report.status === 'ready' && (
                  <button style={{
                    padding: '6px',
                    border: 'none',
                    borderRadius: '20px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    cursor: 'pointer'
                  }}>
                    <Download size={16} />
                  </button>
                )}
                <button style={{
                  padding: '6px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: '#f3f4f6',
                  color: '#ef4444',
                  cursor: 'pointer'
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <FileText size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
            No reports found
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

    </div>
  );
}
