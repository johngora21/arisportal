"use client";

import { useState } from "react";
import { 
  BarChart3, DollarSign, TrendingUp, Download, FileText, PieChart, LineChart, Calendar
} from "lucide-react";

export default function HRReportsPage() {
  const [selectedReport, setSelectedReport] = useState("");

  const reportTypes = [
    {
      id: "employee",
      title: "Employee Report",
      description: "Comprehensive employee data report",
      icon: <BarChart3 size={24} color="#0f172a" />,
      color: "#0f172a",
      lastGenerated: "2024-01-15",
      records: 156
    },
    {
      id: "payroll",
      title: "Payroll Report",
      description: "Detailed payroll and salary report",
      icon: <DollarSign size={24} color="#10b981" />,
      color: "#10b981",
      lastGenerated: "2024-01-14",
      records: 142
    },
    {
      id: "performance",
      title: "Performance Report",
      description: "Employee performance analytics",
      icon: <TrendingUp size={24} color="#f59e0b" />,
      color: "#f59e0b",
      lastGenerated: "2024-01-13",
      records: 98
    },
    {
      id: "attendance",
      title: "Attendance Report",
      description: "Employee attendance and leave analysis",
      icon: <Calendar size={24} color="#8b5cf6" />,
      color: "#8b5cf6",
      lastGenerated: "2024-01-15",
      records: 156
    }
  ];

  const handleGenerateReport = (reportId: string) => {
    setSelectedReport(reportId);
    // Handle report generation logic
    console.log(`Generating ${reportId} report...`);
  };

  const handleDownloadReport = (reportId: string) => {
    // Handle report download logic
    console.log(`Downloading ${reportId} report...`);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              HR Reports
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Generate and download comprehensive HR reports and analytics
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Download size={20} />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '32px'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
          Available Reports
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {reportTypes.map((report) => (
            <div 
              key={report.id}
              style={{
                padding: '24px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = report.color;
                e.currentTarget.style.boxShadow = `0 4px 12px ${report.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                {report.icon}
                <div>
                  <h4 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    margin: '0 0 4px 0' 
                  }}>
                    {report.title}
                  </h4>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: 0 
                  }}>
                    {report.description}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>
                    Last Generated
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    {report.lastGenerated}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>
                    Records
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    {report.records}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  style={{
                    flex: 1,
                    backgroundColor: report.color,
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => handleGenerateReport(report.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  Generate
                </button>
                <button 
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => handleDownloadReport(report.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
          Recent Reports
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={20} color="#0f172a" />
              <div>
                <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>
                  Employee Report - January 2024
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Generated on 2024-01-15 • 156 records
                </p>
              </div>
            </div>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Download
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={20} color="#10b981" />
              <div>
                <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>
                  Payroll Report - December 2023
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Generated on 2024-01-14 • 142 records
                </p>
              </div>
            </div>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

