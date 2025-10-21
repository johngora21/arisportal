'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Download, Check, Filter, Search } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  source: string;
  stars: string;
  style: string;
  type: string;
  preview_url: string;
  template_url: string;
  is_available: boolean;
  isSelected: boolean;
}

export const TemplatesTab: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStyle, setFilterStyle] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availableStyles, setAvailableStyles] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  // Fetch templates from API
  useEffect(() => {
    fetchTemplates();
    fetchFilters();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStyle) params.append('style', filterStyle);
      if (filterType) params.append('type', filterType);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`http://localhost:5002/api/templates?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Fallback to mock data if API is not available
      setTemplates(getMockTemplates());
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [stylesResponse, typesResponse] = await Promise.all([
        fetch('http://localhost:5002/api/templates/styles'),
        fetch('http://localhost:5002/api/templates/types')
      ]);
      
      const [stylesData, typesData] = await Promise.all([
        stylesResponse.json(),
        typesResponse.json()
      ]);
      
      if (stylesData.success) setAvailableStyles(stylesData.styles);
      if (typesData.success) setAvailableTypes(typesData.types);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchTemplates();
  }, [filterStyle, filterType, searchQuery]);

  const getMockTemplates = (): Template[] => [
    {
      id: 'legal-firm',
      name: 'Legal Firm',
      description: 'Formal legal services invoice with time tracking, case references, and legal compliance',
      source: 'Legal Industry Standard',
      stars: '★★★★★',
      style: 'formal',
      type: 'legal',
      preview_url: '/api/templates/legal-firm/preview',
      template_url: '/api/templates/legal-firm/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Medical services invoice with CPT codes, insurance breakdown, and HIPAA compliance',
      source: 'Healthcare Industry Standard',
      stars: '★★★★★',
      style: 'medical',
      type: 'healthcare',
      preview_url: '/api/templates/healthcare/preview',
      template_url: '/api/templates/healthcare/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'construction',
      name: 'Construction',
      description: 'Construction contractor invoice with labor/materials breakdown, permits, and project tracking',
      source: 'Construction Industry Standard',
      stars: '★★★★★',
      style: 'industrial',
      type: 'construction',
      preview_url: '/api/templates/construction/preview',
      template_url: '/api/templates/construction/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'finance',
      name: 'Finance',
      description: 'Financial services invoice with portfolio management, performance tracking, and regulatory compliance',
      source: 'Finance Industry Standard',
      stars: '★★★★★',
      style: 'professional',
      type: 'finance',
      preview_url: '/api/templates/finance/preview',
      template_url: '/api/templates/finance/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'logistics',
      name: 'Logistics',
      description: 'Logistics and shipping invoice with tracking numbers, route details, and freight calculations',
      source: 'Logistics Industry Standard',
      stars: '★★★★★',
      style: 'industrial',
      type: 'logistics',
      preview_url: '/api/templates/logistics/preview',
      template_url: '/api/templates/logistics/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'retail',
      name: 'Retail',
      description: 'Retail store invoice with product SKUs, customer loyalty, and discount calculations',
      source: 'Retail Industry Standard',
      stars: '★★★★★',
      style: 'modern',
      type: 'retail',
      preview_url: '/api/templates/retail/preview',
      template_url: '/api/templates/retail/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'education',
      name: 'Education',
      description: 'Educational services invoice with course credits, student information, and academic billing',
      source: 'Education Industry Standard',
      stars: '★★★★★',
      style: 'academic',
      type: 'education',
      preview_url: '/api/templates/education/preview',
      template_url: '/api/templates/education/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'freelance',
      name: 'Freelance',
      description: 'Freelance services invoice with hourly rates, project details, and creative billing',
      source: 'Freelance Industry Standard',
      stars: '★★★★★',
      style: 'creative',
      type: 'freelance',
      preview_url: '/api/templates/freelance/preview',
      template_url: '/api/templates/freelance/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'it',
      name: 'IT Services',
      description: 'IT services invoice with technical specifications, SLA tracking, and system details',
      source: 'IT Industry Standard',
      stars: '★★★★★',
      style: 'technical',
      type: 'it',
      preview_url: '/api/templates/it/preview',
      template_url: '/api/templates/it/template',
      is_available: true,
      isSelected: false
    }
  ];

  const handleUseTemplate = (templateId: string) => {
    // TODO: Integrate with CreateInvoiceModal to use selected template
    console.log('Using template:', templateId);
  };

  const renderTemplatePreview = (templateId: string) => {
    const mockInvoiceData = {
      invoiceNumber: 'INV-20250101-001',
      date: '2025-01-15',
      dueDate: '2025-02-15',
      client: 'Acme Corporation',
      clientEmail: 'billing@acme.com',
      items: [
        { description: 'Web Development', qty: 40, rate: 75, amount: 3000 },
        { description: 'Design Services', qty: 20, rate: 50, amount: 1000 }
      ],
      subtotal: 4000,
      tax: 400,
      total: 4400
    };

    switch (templateId) {
      case 'legal-firm':
        // Legal Firm Invoice - Formal Blue Theme
        return (
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            backgroundColor: 'white', 
            fontFamily: 'serif',
            color: '#1a237e',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '2px solid #1a237e',
            padding: '20px'
          }}>
            {/* Legal Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '30px',
              borderBottom: '3px solid #1a237e',
              paddingBottom: '15px'
            }}>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#1a237e',
                margin: '0 0 5px 0'
              }}>
                LEGAL SERVICES INVOICE
              </h1>
              <p style={{ fontSize: '11px', margin: 0 }}>Attorney at Law • Licensed in State of NY</p>
            </div>

            {/* Invoice Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> LEG-2025-001</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Case Ref:</strong> AC-2025-001</p>
              </div>
            </div>

            {/* Client Info */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '13px', color: '#1a237e', margin: '0 0 8px 0' }}>CLIENT INFORMATION</h3>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Client:</strong> {mockInvoiceData.client}</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Matter:</strong> Corporate Legal Services</p>
            </div>

            {/* Legal Services Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '10px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#1a237e', color: 'white' }}>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #1a237e' }}>SERVICE</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #1a237e' }}>HOURS</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #1a237e' }}>RATE</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #1a237e' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Legal Research</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>4.5</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$450.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$2,025.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Document Review</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>3.0</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$425.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$1,275.00</td>
                </tr>
              </tbody>
            </table>

            {/* Legal Totals */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Subtotal: $3,300.00</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Tax: $297.00</p>
              <div style={{ 
                borderTop: '2px solid #1a237e', 
                paddingTop: '5px',
                marginTop: '5px'
              }}>
                <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold' }}>TOTAL: $3,597.00</p>
              </div>
            </div>
          </div>
        );

      case 'healthcare':
        // Healthcare Invoice - Medical Green Theme
        return (
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            backgroundColor: 'white', 
            fontFamily: 'Arial, sans-serif',
            color: '#00695c',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '2px solid #4caf50',
            padding: '20px'
          }}>
            {/* Medical Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '30px',
              backgroundColor: '#e8f5e8',
              padding: '15px',
              borderRadius: '8px',
              border: '2px solid #4caf50'
            }}>
              <h1 style={{ 
                fontSize: '22px', 
                fontWeight: 'bold', 
                color: '#00695c',
                margin: '0 0 5px 0'
              }}>
                MEDICAL SERVICES INVOICE
              </h1>
              <p style={{ fontSize: '11px', margin: 0, color: '#00695c' }}>City General Hospital • Licensed Medical Facility</p>
            </div>

            {/* Invoice Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              backgroundColor: '#f1f8e9',
              padding: '10px',
              borderRadius: '5px'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> MED-2025-001</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Service Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Patient ID:</strong> PD-2025-001</p>
              </div>
            </div>

            {/* Patient Info */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '13px', color: '#00695c', margin: '0 0 8px 0' }}>PATIENT INFORMATION</h3>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Patient:</strong> John Doe</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Insurance:</strong> Blue Cross Blue Shield</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Copay:</strong> $25.00</p>
            </div>

            {/* Medical Services Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '10px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#4caf50', color: 'white' }}>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #4caf50' }}>SERVICE</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #4caf50' }}>CPT CODE</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #4caf50' }}>FEE</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #4caf50' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Cardiology Consultation</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>99213</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$150.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$150.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>EKG - 12 Lead</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>93000</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$85.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$85.00</td>
                </tr>
              </tbody>
            </table>

            {/* Medical Totals */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Total Services: $235.00</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Insurance Coverage (80%): ($188.00)</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Patient Copay: $25.00</p>
              <div style={{ 
                borderTop: '2px solid #4caf50', 
                paddingTop: '5px',
                marginTop: '5px'
              }}>
                <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold' }}>AMOUNT DUE: $52.00</p>
              </div>
            </div>
          </div>
        );

      case 'construction':
        // Construction Invoice - Industrial Orange Theme
        return (
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            backgroundColor: 'white', 
            fontFamily: 'Arial Black, sans-serif',
            color: '#d84315',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '3px solid #ff5722',
            padding: '20px'
          }}>
            {/* Construction Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '30px',
              backgroundColor: '#fff3e0',
              padding: '15px',
              borderRadius: '5px',
              border: '3px solid #ff5722'
            }}>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#d84315',
                margin: '0 0 5px 0',
                textTransform: 'uppercase'
              }}>
                CONSTRUCTION SERVICES INVOICE
              </h1>
              <p style={{ fontSize: '11px', margin: 0, color: '#d84315' }}>HAMMER & NAIL CONTRACTORS • Licensed GC-2025-001</p>
            </div>

            {/* Invoice Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              backgroundColor: '#ffcc02',
              padding: '10px',
              borderRadius: '3px'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> CON-2025-001</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Project Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Permit #:</strong> BP-2025-001</p>
              </div>
            </div>

            {/* Project Info */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '13px', color: '#d84315', margin: '0 0 8px 0' }}>PROJECT INFORMATION</h3>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Project:</strong> Office Building Renovation</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Client:</strong> {mockInvoiceData.client}</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Project Manager:</strong> Mike Johnson</p>
            </div>

            {/* Construction Work Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '10px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#ff5722', color: 'white' }}>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ff5722' }}>WORK</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ff5722' }}>QTY</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #ff5722' }}>RATE</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #ff5722' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Demolition - Interior Walls</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>150 sq ft</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$8.50</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$1,275.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Framing - New Partitions</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>200 sq ft</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$12.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$2,400.00</td>
                </tr>
              </tbody>
            </table>

            {/* Construction Totals */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Labor Costs: $3,675.00</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Materials: $2,850.00</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Permits & Fees: $450.00</p>
              <div style={{ 
                borderTop: '3px solid #ff5722', 
                paddingTop: '5px',
                marginTop: '5px'
              }}>
                <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold' }}>TOTAL DUE: $6,975.00</p>
              </div>
            </div>
          </div>
        );

      case 'finance':
        // Finance Invoice - Professional Blue Theme
        return (
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            backgroundColor: 'white', 
            fontFamily: 'Arial, sans-serif',
            color: '#0d47a1',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '2px solid #1976d2',
            padding: '20px'
          }}>
            {/* Finance Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '30px',
              backgroundColor: '#e3f2fd',
              padding: '15px',
              borderRadius: '8px',
              border: '2px solid #1976d2'
            }}>
              <h1 style={{ 
                fontSize: '22px', 
                fontWeight: 'bold', 
                color: '#0d47a1',
                margin: '0 0 5px 0'
              }}>
                FINANCIAL SERVICES INVOICE
              </h1>
              <p style={{ fontSize: '11px', margin: 0, color: '#0d47a1' }}>Meritus Financial Advisors • Licensed Investment Firm</p>
            </div>

            {/* Invoice Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              backgroundColor: '#f3f8ff',
              padding: '10px',
              borderRadius: '5px'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> FIN-2025-001</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Statement Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Account #:</strong> ACC-2025-001</p>
              </div>
            </div>

            {/* Client Portfolio Info */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '13px', color: '#0d47a1', margin: '0 0 8px 0' }}>CLIENT PORTFOLIO</h3>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Client:</strong> {mockInvoiceData.client}</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Portfolio Manager:</strong> Sarah Johnson</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>AUM:</strong> $2,500,000</p>
            </div>

            {/* Financial Services Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '10px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #1976d2' }}>SERVICE</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #1976d2' }}>PERIOD</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #1976d2' }}>RATE</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #1976d2' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Portfolio Management</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>Q4 2024</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>1.25%</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$7,812.50</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Financial Planning</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>Monthly</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$500.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$500.00</td>
                </tr>
              </tbody>
            </table>

            {/* Finance Totals */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Total Advisory Fees: $8,312.50</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Performance Bonus: $50,000.00</p>
              <div style={{ 
                borderTop: '2px solid #1976d2', 
                paddingTop: '5px',
                marginTop: '5px'
              }}>
                <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold' }}>TOTAL: $58,312.50</p>
              </div>
            </div>
          </div>
        );

      case 'logistics':
        // Logistics Invoice - Industrial Green Theme
        return (
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            backgroundColor: 'white', 
            fontFamily: 'Arial, sans-serif',
            color: '#2e7d32',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '2px solid #4caf50',
            padding: '20px'
          }}>
            {/* Logistics Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '30px',
              backgroundColor: '#e8f5e8',
              padding: '15px',
              borderRadius: '5px',
              border: '2px solid #4caf50'
            }}>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#2e7d32',
                margin: '0 0 5px 0'
              }}>
                LOGISTICS SERVICES INVOICE
              </h1>
              <p style={{ fontSize: '11px', margin: 0, color: '#2e7d32' }}>FastTrack Logistics Inc • Licensed Freight Forwarder</p>
            </div>

            {/* Invoice Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              backgroundColor: '#f1f8e9',
              padding: '10px',
              borderRadius: '3px'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> LOG-2025-001</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Shipment Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Tracking #:</strong> TRK-2025-001</p>
              </div>
            </div>

            {/* Shipment Info */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '13px', color: '#2e7d32', margin: '0 0 8px 0' }}>SHIPMENT INFORMATION</h3>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Weight:</strong> 2,500 lbs</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Route:</strong> LA to NY</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Transit Time:</strong> 5 days</p>
            </div>

            {/* Logistics Services Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '10px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#4caf50', color: 'white' }}>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #4caf50' }}>SERVICE</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #4caf50' }}>WEIGHT</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #4caf50' }}>RATE</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #4caf50' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Ground Transportation</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>2,500 lbs</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$1.25/lb</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$3,125.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Fuel Surcharge</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>12%</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$375.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$375.00</td>
                </tr>
              </tbody>
            </table>

            {/* Logistics Totals */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Base Transportation: $3,125.00</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Additional Services: $565.00</p>
              <div style={{ 
                borderTop: '2px solid #4caf50', 
                paddingTop: '5px',
                marginTop: '5px'
              }}>
                <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold' }}>TOTAL: $4,003.65</p>
              </div>
            </div>
          </div>
        );

      case 'retail':
        // Retail Invoice - Modern Red Theme
        return (
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            backgroundColor: 'white', 
            fontFamily: 'Arial, sans-serif',
            color: '#c62828',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '2px solid #f44336',
            padding: '20px'
          }}>
            {/* Retail Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '30px',
              backgroundColor: '#ffebee',
              padding: '15px',
              borderRadius: '8px',
              border: '2px solid #f44336'
            }}>
              <h1 style={{ 
                fontSize: '22px', 
                fontWeight: 'bold', 
                color: '#c62828',
                margin: '0 0 5px 0'
              }}>
                RETAIL INVOICE
              </h1>
              <p style={{ fontSize: '11px', margin: 0, color: '#c62828' }}>Style Mart Boutique • Fashion & Lifestyle Store</p>
            </div>

            {/* Invoice Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              backgroundColor: '#fce4ec',
              padding: '10px',
              borderRadius: '5px'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> RET-2025-001</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Order Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Order #:</strong> ORD-2025-001</p>
              </div>
            </div>

            {/* Customer Info */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '13px', color: '#c62828', margin: '0 0 8px 0' }}>CUSTOMER INFORMATION</h3>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Customer:</strong> Jane Smith</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>VIP Status:</strong> Gold Member</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Discount:</strong> 15%</p>
            </div>

            {/* Retail Products Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '10px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f44336', color: 'white' }}>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #f44336' }}>PRODUCT</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #f44336' }}>SKU</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #f44336' }}>QTY</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #f44336' }}>PRICE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Designer Handbag</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>SKU-001</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>1</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$299.99</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Silk Scarf</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>SKU-002</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>2</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$179.98</td>
                </tr>
              </tbody>
            </table>

            {/* Retail Totals */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Subtotal: $959.94</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>VIP Discount (15%): ($143.99)</p>
              <div style={{ 
                borderTop: '2px solid #f44336', 
                paddingTop: '5px',
                marginTop: '5px'
              }}>
                <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold' }}>TOTAL: $885.26</p>
              </div>
            </div>
          </div>
        );

      case 'education':
        // Education Invoice - Academic Blue Theme
        return (
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            backgroundColor: 'white', 
            fontFamily: 'serif',
            color: '#1565c0',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '2px solid #1976d2',
            padding: '20px'
          }}>
            {/* Education Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '30px',
              backgroundColor: '#e3f2fd',
              padding: '15px',
              borderRadius: '8px',
              border: '2px solid #1976d2'
            }}>
              <h1 style={{ 
                fontSize: '22px', 
                fontWeight: 'bold', 
                color: '#1565c0',
                margin: '0 0 5px 0'
              }}>
                EDUCATIONAL SERVICES INVOICE
              </h1>
              <p style={{ fontSize: '11px', margin: 0, color: '#1565c0' }}>Prestige Learning Institute • Accredited Institution</p>
            </div>

            {/* Invoice Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              backgroundColor: '#f3f8ff',
              padding: '10px',
              borderRadius: '5px'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> EDU-2025-001</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Course Start:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Student ID:</strong> STU-2025-001</p>
              </div>
            </div>

            {/* Student Info */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '13px', color: '#1565c0', margin: '0 0 8px 0' }}>STUDENT INFORMATION</h3>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Student:</strong> John Smith</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Program:</strong> Executive MBA</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Instructor:</strong> Dr. Sarah Johnson</p>
            </div>

            {/* Education Services Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '10px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #1976d2' }}>COURSE</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #1976d2' }}>CREDITS</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #1976d2' }}>RATE</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #1976d2' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Core Business Courses</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>18</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$750.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$13,500.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Elective Courses</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>12</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$650.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$7,800.00</td>
                </tr>
              </tbody>
            </table>

            {/* Education Totals */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Tuition & Fees: $26,900.00</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Scholarship (20%): ($5,380.00)</p>
              <div style={{ 
                borderTop: '2px solid #1976d2', 
                paddingTop: '5px',
                marginTop: '5px'
              }}>
                <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold' }}>TOTAL: $21,820.00</p>
              </div>
            </div>
          </div>
        );

      case 'freelance':
        // Freelance Invoice - Creative Purple Theme
        return (
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            backgroundColor: 'white', 
            fontFamily: 'Arial, sans-serif',
            color: '#6a1b9a',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '2px solid #9c27b0',
            padding: '20px'
          }}>
            {/* Freelance Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '30px',
              backgroundColor: '#f3e5f5',
              padding: '15px',
              borderRadius: '8px',
              border: '2px solid #9c27b0'
            }}>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#6a1b9a',
                margin: '0 0 5px 0'
              }}>
                FREELANCE SERVICES INVOICE
              </h1>
              <p style={{ fontSize: '11px', margin: 0, color: '#6a1b9a' }}>Creative Solutions by Alex • Designer & Developer</p>
            </div>

            {/* Invoice Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              backgroundColor: '#fce4ec',
              padding: '10px',
              borderRadius: '5px'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> FRE-2025-001</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Project Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Project:</strong> Website Redesign</p>
              </div>
            </div>

            {/* Client Info */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '13px', color: '#6a1b9a', margin: '0 0 8px 0' }}>CLIENT INFORMATION</h3>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Client:</strong> StartupXYZ Inc.</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Contact:</strong> Jane Smith</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Timeline:</strong> 4 weeks</p>
            </div>

            {/* Freelance Services Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '10px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#9c27b0', color: 'white' }}>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #9c27b0' }}>SERVICE</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #9c27b0' }}>HOURS</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #9c27b0' }}>RATE</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #9c27b0' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>UI/UX Design</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>25</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$75.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$1,875.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Frontend Development</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>40</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$85.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$3,400.00</td>
                </tr>
              </tbody>
            </table>

            {/* Freelance Totals */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Subtotal: $7,985.00</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Rush Fee (10%): $798.50</p>
              <div style={{ 
                borderTop: '2px solid #9c27b0', 
                paddingTop: '5px',
                marginTop: '5px'
              }}>
                <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold' }}>TOTAL: $8,783.50</p>
              </div>
            </div>
          </div>
        );

      case 'it':
        // IT Services Invoice - Technical Gray Theme
        return (
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            backgroundColor: 'white', 
            fontFamily: 'monospace',
            color: '#37474f',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '2px solid #607d8b',
            padding: '20px'
          }}>
            {/* IT Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '30px',
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '5px',
              border: '2px solid #607d8b'
            }}>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#37474f',
                margin: '0 0 5px 0'
              }}>
                IT SERVICES INVOICE
              </h1>
              <p style={{ fontSize: '11px', margin: 0, color: '#37474f' }}>Technology Solutions LLC • Enterprise IT Services</p>
            </div>

            {/* Invoice Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              backgroundColor: '#fafafa',
              padding: '10px',
              borderRadius: '3px'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> IT-2025-001</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Service Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>System:</strong> Server Migration</p>
              </div>
            </div>

            {/* Client System Info */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '13px', color: '#37474f', margin: '0 0 8px 0' }}>SYSTEM DETAILS</h3>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Client:</strong> TechCorp Industries</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Servers:</strong> 12 Physical + 8 Virtual</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>SLA:</strong> 99.9% Uptime</p>
            </div>

            {/* IT Services Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '10px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#607d8b', color: 'white' }}>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #607d8b' }}>SERVICE</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #607d8b' }}>UNITS</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #607d8b' }}>RATE</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #607d8b' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Server Migration</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>12</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$500.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$6,000.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>VM Setup</td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}>8</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$350.00</td>
                  <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ccc' }}>$2,800.00</td>
                </tr>
              </tbody>
            </table>

            {/* IT Totals */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Professional Services: $19,300.00</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>24/7 Support (3 months): $4,500.00</p>
              <div style={{ 
                borderTop: '2px solid #607d8b', 
                paddingTop: '5px',
                marginTop: '5px'
              }}>
                <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold' }}>TOTAL: $25,000.00</p>
              </div>
            </div>
          </div>
        );

      default:
        // Default template for any unmatched IDs
        return (
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            backgroundColor: 'white', 
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '1px solid #ccc',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#666', margin: '20px 0' }}>Template Preview</h3>
            <p style={{ color: '#999' }}>Preview not available for this template</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading professional templates...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '20px', 
      padding: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
        Invoice Templates ({templates.length})
      </h3>

      {/* Template Preview Modal */}
      {selectedTemplate && (
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
            borderRadius: '16px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                {templates.find(t => t.id === selectedTemplate)?.name} Template Preview
              </h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px'
                }}
              >
                ✕
              </button>
            </div>
            
            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              <div style={{ 
                backgroundColor: '#f9fafb', 
                padding: '32px', 
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <div style={{ transform: 'scale(1)', maxWidth: '100%' }}>
                  {renderTemplatePreview(selectedTemplate)}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    alert('Template selected! This will be integrated with the invoice generation.');
                    setSelectedTemplate(null);
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Check size={16} />
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {templates.map((template) => (
          <div
            key={template.id}
            style={{
              border: template.is_available ? '2px solid #e5e7eb' : '2px dashed #d1d5db',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: 'white',
              transition: 'all 0.2s ease',
              cursor: template.is_available ? 'pointer' : 'not-allowed',
              opacity: template.is_available ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (template.is_available) {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (template.is_available) {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onClick={() => template.is_available && setSelectedTemplate(template.id)}
          >
            {/* Template Preview */}
            <div style={{ padding: '12px', backgroundColor: 'white', height: '300px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden' }}>
              <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center', maxWidth: '100%', maxHeight: '100%' }}>
                {renderTemplatePreview(template.id)}
              </div>
            </div>
            
            {/* Template Action */}
            <div style={{ padding: '12px', display: 'flex', justifyContent: 'center' }}>
              {template.is_available ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template.id);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Check size={12} />
                  Use Template
                </button>
              ) : (
                <span style={{
                  fontSize: '10px',
                  color: '#6b7280',
                  backgroundColor: '#e5e7eb',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontWeight: '500'
                }}>
                  Coming Soon
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


