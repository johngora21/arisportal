'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Download, Check, Filter, Search, X } from 'lucide-react';

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

interface TemplatesTabProps {
  onUseTemplate?: (templateId: string) => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ onUseTemplate }) => {
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
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple invoice design with centered layout and minimal elements',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'minimal',
      type: 'business',
      preview_url: '/api/templates/minimal/preview',
      template_url: '/api/templates/minimal/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary invoice design with sidebar header and grid-based layout',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'modern',
      type: 'business',
      preview_url: '/api/templates/modern/preview',
      template_url: '/api/templates/modern/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'minimal-card',
      name: 'Minimal Card',
      description: 'Card-style minimal design with subtle borders and grey color scheme',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'minimal-card',
      type: 'business',
      preview_url: '/api/templates/minimal-card/preview',
      template_url: '/api/templates/minimal-card/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'geometric',
      name: 'Geometric',
      description: 'Modern invoice design with geometric shapes and clean lines',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'geometric',
      type: 'business',
      preview_url: '/api/templates/geometric/preview',
      template_url: '/api/templates/geometric/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'modern-spaced',
      name: 'Modern Spaced',
      description: 'Spacious modern design with generous whitespace and grey colors',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'modern-spaced',
      type: 'business',
      preview_url: '/api/templates/modern-spaced/preview',
      template_url: '/api/templates/modern-spaced/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'elegant',
      name: 'Elegant',
      description: 'Sophisticated invoice design with ornamental borders and serif typography',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'elegant',
      type: 'business',
      preview_url: '/api/templates/elegant/preview',
      template_url: '/api/templates/elegant/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'minimal-left',
      name: 'Minimal Left',
      description: 'Left-aligned minimal invoice design with grey colors and vertical layout',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'minimal-left',
      type: 'business',
      preview_url: '/api/templates/minimal-left/preview',
      template_url: '/api/templates/minimal-left/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Asymmetric invoice design with geometric elements and card-style services',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'creative',
      type: 'business',
      preview_url: '/api/templates/creative/preview',
      template_url: '/api/templates/creative/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'modern-compact',
      name: 'Modern Compact',
      description: 'Compact modern design with smaller fonts and tighter spacing in grey',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'modern-compact',
      type: 'business',
      preview_url: '/api/templates/modern-compact/preview',
      template_url: '/api/templates/modern-compact/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Enterprise-grade invoice design with comprehensive client information and structured layout',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'corporate',
      type: 'business',
      preview_url: '/api/templates/corporate/preview',
      template_url: '/api/templates/corporate/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'minimal-grey',
      name: 'Minimal Grey',
      description: 'Clean minimal design with grey colors instead of black for a softer look',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'minimal-grey',
      type: 'business',
      preview_url: '/api/templates/minimal-grey/preview',
      template_url: '/api/templates/minimal-grey/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'typography',
      name: 'Typography',
      description: 'Typography-focused invoice design with emphasis on font weights and spacing',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'typography',
      type: 'business',
      preview_url: '/api/templates/typography/preview',
      template_url: '/api/templates/typography/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'modern-card',
      name: 'Modern Card',
      description: 'Card-style modern design with subtle borders and grey color scheme',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'modern-card',
      type: 'business',
      preview_url: '/api/templates/modern-card/preview',
      template_url: '/api/templates/modern-card/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional invoice design with serif fonts and formal table structure',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'classic',
      type: 'business',
      preview_url: '/api/templates/classic/preview',
      template_url: '/api/templates/classic/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'modern-vertical',
      name: 'Modern Vertical',
      description: 'Vertical layout modern design with grey colors and streamlined information flow',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'modern-vertical',
      type: 'business',
      preview_url: '/api/templates/modern-vertical/preview',
      template_url: '/api/templates/modern-vertical/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Corporate invoice design with comprehensive details and structured layout',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'professional',
      type: 'business',
      preview_url: '/api/templates/professional/preview',
      template_url: '/api/templates/professional/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'minimal-compact',
      name: 'Minimal Compact',
      description: 'Compact minimal design with smaller fonts and tighter spacing in grey',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'minimal-compact',
      type: 'business',
      preview_url: '/api/templates/minimal-compact/preview',
      template_url: '/api/templates/minimal-compact/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'grid',
      name: 'Grid',
      description: 'Grid-based invoice design with structured layout and organized information',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'grid',
      type: 'business',
      preview_url: '/api/templates/grid/preview',
      template_url: '/api/templates/grid/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'modern-grey',
      name: 'Modern Grey',
      description: 'Contemporary modern design with grey colors instead of black for a softer look',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'modern-grey',
      type: 'business',
      preview_url: '/api/templates/modern-grey/preview',
      template_url: '/api/templates/modern-grey/template',
      is_available: true,
      isSelected: false
    },
    {
      id: 'minimal-spaced',
      name: 'Minimal Spaced',
      description: 'Spacious minimal design with generous whitespace and grey colors',
      source: 'Professional Design',
      stars: '★★★★★',
      style: 'minimal-spaced',
      type: 'business',
      preview_url: '/api/templates/minimal-spaced/preview',
      template_url: '/api/templates/minimal-spaced/template',
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
      invoiceNumber: 'INV-2025-001',
      date: '2025-01-15',
      dueDate: '2025-02-15',
      clientName: 'Acme Corporation',
      clientEmail: 'contact@acmecorp.com',
      clientPhone: '+1 (555) 123-4567',
      clientAddress: '123 Business St, City, State 12345',
      companyName: 'Your Company Name',
      companyEmail: 'info@yourcompany.com',
      companyPhone: '+1 (555) 987-6543',
      companyAddress: '456 Office Ave, Business City, BC 67890',
      items: [
        { description: 'Web Development Services', quantity: 40, rate: 75, amount: 3000 },
        { description: 'UI/UX Design', quantity: 20, rate: 60, amount: 1200 },
        { description: 'Project Management', quantity: 10, rate: 50, amount: 500 }
      ],
      subtotal: 4700,
      discount: 235,
      discountRate: 5,
      tax: 470,
      total: 4935
    };

    switch (templateId) {
      case 'minimal':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#000',
            backgroundColor: '#fff',
            padding: '30px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {/* Minimal Header - Centered */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '300', 
                color: '#000',
                margin: '0 0 10px 0',
                letterSpacing: '3px'
              }}>
                INVOICE
              </h1>
              <div style={{ 
                width: '60px', 
                height: '1px', 
                backgroundColor: '#000',
                margin: '0 auto 20px auto'
              }}></div>
              <p style={{ fontSize: '11px', margin: 0, color: '#666' }}>Professional Services</p>
            </div>

            {/* Simple Two Column Layout */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '40px'
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold' }}>FROM</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{mockInvoiceData.companyEmail}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{mockInvoiceData.companyPhone}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold' }}>TO</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{mockInvoiceData.clientEmail}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{mockInvoiceData.clientPhone}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Invoice Details - Horizontal */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '30px',
              padding: '15px 0',
              borderTop: '1px solid #000',
              borderBottom: '1px solid #000'
            }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '0', fontSize: '11px' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '0', fontSize: '11px' }}><strong>Amount:</strong> ${mockInvoiceData.total}</p>
              </div>
            </div>

            {/* Services - Clean List */}
            <div style={{ marginBottom: '30px' }}>
              {mockInvoiceData.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index < mockInvoiceData.items.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: 'bold' }}>{item.description}</p>
                    <p style={{ margin: '0', fontSize: '10px', color: '#666' }}>{item.quantity} hours × ${item.rate}/hr</p>
                  </div>
                  <p style={{ margin: '0', fontSize: '11px', fontWeight: 'bold' }}>${item.amount}</p>
                </div>
              ))}
            </div>

            {/* Totals - Right Aligned */}
            <div style={{ 
              borderTop: '2px solid #000',
              paddingTop: '20px',
              textAlign: 'right'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <span>Subtotal:</span>
                <span>${mockInvoiceData.subtotal}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <span>Discount ({mockInvoiceData.discountRate}%):</span>
                <span>-${mockInvoiceData.discount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <span>Tax (10%):</span>
                <span>${mockInvoiceData.tax}</span>
            </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: 'bold',
                paddingTop: '8px',
                borderTop: '1px solid #000'
              }}>
                <span>TOTAL:</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
            </div>

          </div>
        );

      case 'modern':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#000',
            backgroundColor: '#fff',
            padding: '25px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {/* Modern Header with Sidebar */}
            <div style={{ 
              display: 'flex',
              marginBottom: '30px'
            }}>
              <div style={{ flex: 2 }}>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                  color: '#000',
                margin: '0 0 5px 0'
              }}>
                  INVOICE
              </h1>
                <p style={{ fontSize: '12px', margin: 0, color: '#666' }}>{mockInvoiceData.companyName}</p>
              </div>
              <div style={{ 
                flex: 1, 
                textAlign: 'right',
                paddingLeft: '20px',
                borderLeft: '3px solid #000'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>#{mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.date}</p>
              </div>
            </div>

            {/* Modern Grid Layout */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <div>
                <h3 style={{ fontSize: '12px', color: '#000', margin: '0 0 10px 0', fontWeight: 'bold' }}>FROM</h3>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.companyEmail}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.companyPhone}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '12px', color: '#000', margin: '0 0 10px 0', fontWeight: 'bold' }}>BILL TO</h3>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientEmail}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientPhone}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Modern Details Bar */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              padding: '15px',
              backgroundColor: '#f8f8f8',
              borderRadius: '0'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Payment Terms:</strong> Net 30</p>
              </div>
            </div>

            {/* Modern Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '25px',
              fontSize: '11px'
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--mc-sidebar-bg)', color: '#fff' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: 'none' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: 'none' }}>Qty</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: 'none' }}>Rate</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: 'none' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoiceData.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', border: 'none' }}>{item.description}</td>
                    <td style={{ padding: '12px', textAlign: 'center', border: 'none' }}>{item.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: 'none' }}>${item.rate}</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: 'none' }}>${item.amount}</td>
                </tr>
                ))}
              </tbody>
            </table>

            {/* Modern Totals */}
              <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '30px'
            }}>
              <div style={{ width: '250px' }}>
          <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px' }}>Subtotal:</span>
                  <span style={{ fontSize: '11px' }}>${mockInvoiceData.subtotal}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px' }}>Discount ({mockInvoiceData.discountRate}%):</span>
                  <span style={{ fontSize: '11px' }}>-${mockInvoiceData.discount}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px' }}>Tax (10%):</span>
                  <span style={{ fontSize: '11px' }}>${mockInvoiceData.tax}</span>
            </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: '#fff',
                  marginTop: '10px',
                  paddingLeft: '15px',
                  paddingRight: '15px'
                }}>
                  <span>TOTAL:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
              </div>
            </div>


            {/* Modern Footer */}
              <div style={{ 
              textAlign: 'center', 
              fontSize: '10px', 
              color: '#666',
              borderTop: '1px solid #eee',
              paddingTop: '15px'
            }}>
              <p>Thank you for your business!</p>
            </div>
          </div>
        );

      case 'classic':
        return (
          <div style={{ 
            fontFamily: 'Times New Roman, serif', 
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#000',
            backgroundColor: '#fff',
            padding: '30px',
            maxWidth: '550px',
            margin: '0 auto',
            border: '2px solid #000'
          }}>
            {/* Classic Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '2px solid #000'
            }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                color: '#000',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                INVOICE
              </h1>
              <p style={{ fontSize: '12px', margin: 0, color: '#000' }}>{mockInvoiceData.companyName}</p>
              <p style={{ fontSize: '11px', margin: '2px 0', color: '#000' }}>{mockInvoiceData.companyEmail}</p>
              <p style={{ fontSize: '11px', margin: '2px 0', color: '#000' }}>{mockInvoiceData.companyPhone}</p>
              <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#000' }}>{mockInvoiceData.companyAddress}</p>
            </div>

            {/* Classic Layout */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '30px'
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '12px', margin: '0 0 10px 0', color: '#000', fontWeight: 'bold' }}>BILL TO:</h3>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientEmail}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientPhone}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientAddress}</p>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
              </div>
            </div>

            {/* Classic Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '25px',
              fontSize: '11px',
              border: '2px solid #000'
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--mc-sidebar-bg)', color: '#fff' }}>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #000' }}>Description</th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #000' }}>Quantity</th>
                  <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #000' }}>Rate</th>
                  <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #000' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', border: '1px solid #000' }}>{item.description}</td>
                    <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #000' }}>{item.quantity}</td>
                    <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #000' }}>${item.rate}</td>
                    <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #000' }}>${item.amount}</td>
                </tr>
                ))}
              </tbody>
            </table>

            {/* Classic Totals */}
              <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '30px'
            }}>
              <div style={{ width: '300px' }}>
          <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #000'
                }}>
                  <span style={{ fontSize: '11px' }}>Subtotal:</span>
                  <span style={{ fontSize: '11px' }}>${mockInvoiceData.subtotal}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #000'
                }}>
                  <span style={{ fontSize: '11px' }}>Discount ({mockInvoiceData.discountRate}%):</span>
                  <span style={{ fontSize: '11px' }}>-${mockInvoiceData.discount}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #000'
                }}>
                  <span style={{ fontSize: '11px' }}>Tax (10%):</span>
                  <span style={{ fontSize: '11px' }}>${mockInvoiceData.tax}</span>
            </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: '#fff',
                  border: '2px solid #000',
                  marginTop: '10px',
                  paddingLeft: '15px',
                  paddingRight: '15px'
                }}>
                  <span>TOTAL:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
              </div>
            </div>


            {/* Classic Footer */}
              <div style={{ 
              textAlign: 'center', 
              fontSize: '10px', 
              color: '#000',
              borderTop: '1px solid #000',
              paddingTop: '15px'
            }}>
              <p><strong>Payment Terms:</strong> Net 30 days from invoice date</p>
              <p>Please remit payment using any of the methods above</p>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#000',
            backgroundColor: '#fff',
            padding: '25px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {/* Creative Asymmetric Header */}
            <div style={{ 
              marginBottom: '30px',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '0',
                left: '0',
                width: '60px',
                height: '60px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>INV</span>
              </div>
              <div style={{ 
                marginLeft: '80px',
                paddingTop: '10px'
            }}>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                  color: '#000',
                margin: '0 0 5px 0'
              }}>
                  INVOICE
              </h1>
                <p style={{ fontSize: '11px', margin: 0, color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{mockInvoiceData.companyEmail}</p>
                <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{mockInvoiceData.companyPhone}</p>
              </div>
            </div>

            {/* Creative Layout - Asymmetric */}
            <div style={{ 
              display: 'flex', 
              marginBottom: '30px'
            }}>
              <div style={{ 
                flex: 1,
                paddingRight: '20px'
              }}>
                <h3 style={{ fontSize: '11px', margin: '0 0 8px 0', color: '#000', fontWeight: 'bold' }}>TO:</h3>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientEmail}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientPhone}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientAddress}</p>
              </div>
              <div style={{ 
                flex: 1,
                textAlign: 'right'
              }}>
                <div style={{ 
                  backgroundColor: '#f8f8f8',
                  padding: '15px',
                  borderLeft: '4px solid #000'
                }}>
                  <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                  <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
                  <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due:</strong> {mockInvoiceData.dueDate}</p>
              </div>
              </div>
            </div>

            {/* Creative Services - Card Style */}
            <div style={{ marginBottom: '25px' }}>
              {mockInvoiceData.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  marginBottom: '10px',
                  border: '1px solid #000',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f8f8f8'
                }}>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: 'bold' }}>{item.description}</p>
                    <p style={{ margin: '0', fontSize: '10px', color: '#666' }}>{item.quantity} × ${item.rate}</p>
            </div>
                  <div style={{ 
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: '#fff',
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    ${item.amount}
                  </div>
            </div>
              ))}
            </div>

            {/* Creative Totals - Staggered */}
              <div style={{ 
              marginBottom: '30px'
            }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <span>Subtotal</span>
                <span>${mockInvoiceData.subtotal}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <span>Discount ({mockInvoiceData.discountRate}%)</span>
                <span>-${mockInvoiceData.discount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <span>Tax (10%)</span>
                <span>${mockInvoiceData.tax}</span>
            </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '15px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: '#fff',
                marginTop: '10px'
              }}>
                <span>TOTAL</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
            </div>


            {/* Creative Footer */}
              <div style={{ 
              textAlign: 'center', 
              fontSize: '10px', 
              color: '#666',
              borderTop: '2px solid #000',
              paddingTop: '15px'
            }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Thank you!</p>
              <p style={{ margin: '0' }}>Payment due within 30 days</p>
            </div>
          </div>
        );

      case 'professional':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#000',
            backgroundColor: '#fff',
            padding: '25px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {/* Professional Header with Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '3px solid #000'
            }}>
              <div>
              <h1 style={{ 
                fontSize: '22px', 
                fontWeight: 'bold', 
                  color: '#000',
                margin: '0 0 5px 0'
              }}>
                  PROFESSIONAL SERVICES
              </h1>
                <p style={{ fontSize: '11px', margin: 0, color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{mockInvoiceData.companyEmail}</p>
                <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{mockInvoiceData.companyPhone}</p>
                <p style={{ fontSize: '10px', margin: '5px 0 0 0', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div style={{ 
                textAlign: 'right',
                padding: '15px',
                backgroundColor: '#f8f8f8',
                border: '2px solid #000'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>INVOICE</p>
                <p style={{ margin: '0', fontSize: '11px' }}>#{mockInvoiceData.invoiceNumber}</p>
              </div>
            </div>

            {/* Professional Grid Layout */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <div>
                <h3 style={{ fontSize: '12px', color: '#000', margin: '0 0 10px 0', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '5px' }}>BILL FROM</h3>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.companyEmail}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.companyPhone}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.companyAddress}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>Tax ID: 12-3456789</p>
              </div>
              <div>
                <h3 style={{ fontSize: '12px', color: '#000', margin: '0 0 10px 0', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '5px' }}>BILL TO</h3>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientEmail}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientPhone}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientAddress}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>Account: ACC-2025-001</p>
              </div>
            </div>

            {/* Professional Details Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px',
              marginBottom: '25px',
              padding: '15px',
              backgroundColor: '#f8f8f8',
              border: '1px solid #000'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 'bold' }}>Invoice Date:</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 'bold' }}>Due Date:</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.dueDate}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 'bold' }}>Payment Terms:</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>Net 30 Days</p>
              </div>
            </div>

            {/* Professional Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '25px',
              fontSize: '11px',
              border: '1px solid #000'
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--mc-sidebar-bg)', color: '#fff' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #000' }}>Service Description</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #000' }}>Quantity</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>Unit Price</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoiceData.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #000' }}>
                    <td style={{ padding: '12px', border: '1px solid #000' }}>{item.description}</td>
                    <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #000' }}>{item.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>${item.rate}</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>${item.amount}</td>
                </tr>
                ))}
              </tbody>
            </table>

            {/* Professional Totals */}
              <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '30px'
            }}>
              <div style={{ width: '300px' }}>
          <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #000'
                }}>
                  <span style={{ fontSize: '11px' }}>Subtotal:</span>
                  <span style={{ fontSize: '11px' }}>${mockInvoiceData.subtotal}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #000'
                }}>
                  <span style={{ fontSize: '11px' }}>Discount ({mockInvoiceData.discountRate}%):</span>
                  <span style={{ fontSize: '11px' }}>-${mockInvoiceData.discount}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #000'
                }}>
                  <span style={{ fontSize: '11px' }}>Tax (10%):</span>
                  <span style={{ fontSize: '11px' }}>${mockInvoiceData.tax}</span>
            </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '15px 0',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: '#fff',
                  marginTop: '10px',
                  paddingLeft: '15px',
                  paddingRight: '15px',
                  border: '2px solid #000'
                }}>
                  <span>TOTAL AMOUNT:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
              </div>
            </div>


            {/* Professional Footer */}
              <div style={{ 
              fontSize: '10px', 
              color: '#000',
              borderTop: '1px solid #000',
              paddingTop: '15px',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Payment Instructions:</p>
              <p style={{ margin: '0' }}>Please remit payment within 30 days using any method above</p>
            </div>
          </div>
        );

      default:
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#000',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #000',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#000', margin: '20px 0' }}>Template Preview</h3>
            <p style={{ color: '#666' }}>Preview not available for this template</p>
          </div>
        );

      case 'elegant':
        return (
          <div style={{ 
            fontFamily: 'Georgia, serif', 
            fontSize: '12px', 
            lineHeight: '1.5',
            color: '#000',
            backgroundColor: '#fff',
            padding: '40px',
            maxWidth: '550px',
            margin: '0 auto',
            border: '1px solid #000'
          }}>
            {/* Elegant Header with Ornamental Border */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '40px',
              padding: '30px',
              border: '2px solid #000',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#fff',
                padding: '0 20px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                INVOICE
              </div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '300', 
                color: '#000',
                margin: '20px 0 10px 0',
                letterSpacing: '4px'
              }}>
                {mockInvoiceData.companyName}
              </h1>
              <p style={{ fontSize: '11px', margin: 0, color: '#666', fontStyle: 'italic' }}>Professional Services</p>
            </div>

            {/* Elegant Two Column Layout */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '40px',
              padding: '20px 0',
              borderTop: '1px solid #000',
              borderBottom: '1px solid #000'
            }}>
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <h3 style={{ fontSize: '12px', margin: '0 0 15px 0', color: '#000', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Bill From</h3>
                <p style={{ margin: '3px 0', fontSize: '11px' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '3px 0', fontSize: '11px' }}>{mockInvoiceData.companyEmail}</p>
                <p style={{ margin: '3px 0', fontSize: '11px' }}>{mockInvoiceData.companyPhone}</p>
                <p style={{ margin: '3px 0', fontSize: '11px' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div style={{ flex: 1, paddingLeft: '20px', borderLeft: '1px solid #000' }}>
                <h3 style={{ fontSize: '12px', margin: '0 0 15px 0', color: '#000', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Bill To</h3>
                <p style={{ margin: '3px 0', fontSize: '11px' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '3px 0', fontSize: '11px' }}>{mockInvoiceData.clientEmail}</p>
                <p style={{ margin: '3px 0', fontSize: '11px' }}>{mockInvoiceData.clientPhone}</p>
                <p style={{ margin: '3px 0', fontSize: '11px' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Elegant Invoice Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '30px',
              padding: '15px',
              backgroundColor: '#f8f8f8',
              border: '1px solid #000'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Terms:</strong> Net 30</p>
              </div>
            </div>

            {/* Elegant Services List */}
            <div style={{ marginBottom: '30px' }}>
              {mockInvoiceData.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 0',
                  borderBottom: index < mockInvoiceData.items.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold' }}>{item.description}</p>
                    <p style={{ margin: '0', fontSize: '10px', color: '#666', fontStyle: 'italic' }}>{item.quantity} hours at ${item.rate}/hour</p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>${item.amount}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Elegant Totals */}
            <div style={{ 
              borderTop: '2px solid #000',
              paddingTop: '20px',
              textAlign: 'right'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '12px'
              }}>
                <span>Subtotal:</span>
                <span>${mockInvoiceData.subtotal}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '12px'
              }}>
                <span>Discount ({mockInvoiceData.discountRate}%):</span>
                <span>-${mockInvoiceData.discount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '15px',
                fontSize: '12px'
              }}>
                <span>Tax (10%):</span>
                <span>${mockInvoiceData.tax}</span>
            </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '15px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: '#fff',
                border: '2px solid #000'
              }}>
                <span>TOTAL AMOUNT:</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
            </div>

          </div>
        );

      case 'corporate':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '11px', 
            lineHeight: '1.4',
            color: '#000',
            backgroundColor: '#fff',
            padding: '30px',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            {/* Corporate Header with Logo Space */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '40px',
              paddingBottom: '20px',
              borderBottom: '3px solid #000'
            }}>
              <div style={{ flex: 2 }}>
              <h1 style={{ 
                  fontSize: '24px', 
                fontWeight: 'bold', 
                  color: '#000',
                  margin: '0 0 5px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  {mockInvoiceData.companyName}
              </h1>
                <p style={{ fontSize: '10px', margin: '0', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
                <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{mockInvoiceData.companyEmail}</p>
                <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{mockInvoiceData.companyPhone}</p>
                <p style={{ fontSize: '10px', margin: '5px 0 0 0', color: '#666' }}>Tax ID: 12-3456789 | License: BC-2025-001</p>
              </div>
              <div style={{ 
                flex: 1, 
                textAlign: 'right',
                padding: '20px',
                backgroundColor: '#f0f0f0',
                border: '2px solid #000'
              }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#000',
                  margin: '0 0 10px 0'
                }}>
                  INVOICE
                </h2>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due:</strong> {mockInvoiceData.dueDate}</p>
              </div>
            </div>

            {/* Corporate Client Information */}
            <div style={{ 
              marginBottom: '30px',
              padding: '20px',
              backgroundColor: '#f8f8f8',
              border: '1px solid #000'
            }}>
              <h3 style={{ fontSize: '12px', color: '#000', margin: '0 0 15px 0', fontWeight: 'bold', textTransform: 'uppercase' }}>Client Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                  <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Client Name:</strong> {mockInvoiceData.clientName}</p>
                  <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Email:</strong> {mockInvoiceData.clientEmail}</p>
                  <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Phone:</strong> {mockInvoiceData.clientPhone}</p>
                  <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Address:</strong> {mockInvoiceData.clientAddress}</p>
              </div>
              <div>
                  <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Account Manager:</strong> John Smith</p>
                  <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Project Code:</strong> PRJ-2025-001</p>
              </div>
            </div>
            </div>

            {/* Corporate Services Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '30px',
              fontSize: '11px',
              border: '2px solid #000'
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--mc-sidebar-bg)', color: '#fff' }}>
                  <th style={{ padding: '15px', textAlign: 'left', border: '1px solid #000' }}>Service Description</th>
                  <th style={{ padding: '15px', textAlign: 'center', border: '1px solid #000' }}>Hours</th>
                  <th style={{ padding: '15px', textAlign: 'right', border: '1px solid #000' }}>Rate</th>
                  <th style={{ padding: '15px', textAlign: 'right', border: '1px solid #000' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoiceData.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #000' }}>
                    <td style={{ padding: '15px', border: '1px solid #000' }}>{item.description}</td>
                    <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #000' }}>{item.quantity}</td>
                    <td style={{ padding: '15px', textAlign: 'right', border: '1px solid #000' }}>${item.rate}</td>
                    <td style={{ padding: '15px', textAlign: 'right', border: '1px solid #000' }}>${item.amount}</td>
                </tr>
                ))}
              </tbody>
            </table>

            {/* Corporate Totals */}
              <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '30px'
            }}>
              <div style={{ width: '350px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #000'
                }}>
                  <span style={{ fontSize: '12px' }}>Subtotal:</span>
                  <span style={{ fontSize: '12px' }}>${mockInvoiceData.subtotal}</span>
              </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #000'
                }}>
                  <span style={{ fontSize: '12px' }}>Discount ({mockInvoiceData.discountRate}%):</span>
                  <span style={{ fontSize: '12px' }}>-${mockInvoiceData.discount}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #000'
                }}>
                  <span style={{ fontSize: '12px' }}>Tax (10%):</span>
                  <span style={{ fontSize: '12px' }}>${mockInvoiceData.tax}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '20px 0',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: '#fff',
                  marginTop: '15px',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  border: '2px solid #000'
                }}>
                  <span>TOTAL DUE:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
                </div>
              </div>
            </div>


            {/* Corporate Footer */}
            <div style={{ 
              fontSize: '10px', 
              color: '#000',
              borderTop: '1px solid #000',
              paddingTop: '20px',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Payment Terms: Net 30 Days</p>
              <p style={{ margin: '0' }}>Please remit payment using any method above. Thank you for your business.</p>
            </div>
          </div>
        );

      case 'geometric':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#000',
            backgroundColor: '#fff',
            padding: '25px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {/* Geometric Header */}
            <div style={{ 
              marginBottom: '30px',
              position: 'relative'
            }}>
              <div style={{
                width: '100%',
                height: '4px',
                backgroundColor: '#000',
                marginBottom: '20px'
              }}></div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                    color: '#000',
                margin: '0 0 5px 0'
              }}>
                    INVOICE
              </h1>
                  <p style={{ fontSize: '11px', margin: 0, color: '#666' }}>{mockInvoiceData.companyName}</p>
                </div>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(45deg)'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#fff',
                    transform: 'rotate(-45deg)'
                  }}></div>
                </div>
              </div>
              <div style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#000',
                marginTop: '20px'
              }}></div>
            </div>

            {/* Geometric Layout */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  marginBottom: '10px'
                }}></div>
                <h3 style={{ fontSize: '11px', margin: '0 0 8px 0', color: '#000', fontWeight: 'bold', textTransform: 'uppercase' }}>From</h3>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  marginBottom: '10px'
                }}></div>
                <h3 style={{ fontSize: '11px', margin: '0 0 8px 0', color: '#000', fontWeight: 'bold', textTransform: 'uppercase' }}>To</h3>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Geometric Invoice Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              padding: '15px',
              backgroundColor: '#f8f8f8',
              border: '2px solid #000'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Amount:</strong> ${mockInvoiceData.total}</p>
              </div>
            </div>

            {/* Geometric Services */}
            <div style={{ marginBottom: '25px' }}>
              {mockInvoiceData.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  marginBottom: '10px',
                  border: '1px solid #000',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f8f8f8'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: 'var(--mc-sidebar-bg)',
                      marginRight: '10px'
                    }}></div>
                    <div>
                      <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: 'bold' }}>{item.description}</p>
                      <p style={{ margin: '0', fontSize: '10px', color: '#666' }}>{item.quantity} × ${item.rate}</p>
                    </div>
                  </div>
                  <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>${item.amount}</p>
                </div>
              ))}
            </div>

            {/* Geometric Totals */}
            <div style={{ 
              marginBottom: '30px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <span>Subtotal</span>
                <span>${mockInvoiceData.subtotal}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <span>Discount ({mockInvoiceData.discountRate}%)</span>
                <span>-${mockInvoiceData.discount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <span>Tax (10%)</span>
                <span>${mockInvoiceData.tax}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '15px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: '#fff',
                marginTop: '10px',
                border: '2px solid #000'
              }}>
                <span>TOTAL</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
            </div>


            {/* Geometric Footer */}
            <div style={{ 
              textAlign: 'center', 
              fontSize: '10px', 
              color: '#666',
              borderTop: '2px solid #000',
              paddingTop: '15px'
            }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Thank you!</p>
              <p style={{ margin: '0' }}>Payment due within 30 days</p>
            </div>
          </div>
        );

      case 'typography':
        return (
          <div style={{ 
            fontFamily: 'Helvetica, Arial, sans-serif', 
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#000',
            backgroundColor: '#fff',
            padding: '35px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {/* Typography Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '40px',
              paddingBottom: '25px',
              borderBottom: '1px solid #000'
            }}>
              <h1 style={{ 
                fontSize: '36px', 
                fontWeight: '100', 
                color: '#000',
                margin: '0 0 10px 0',
                letterSpacing: '8px'
              }}>
                INVOICE
              </h1>
              <div style={{ 
                width: '100px', 
                height: '1px', 
                backgroundColor: '#000',
                margin: '0 auto 15px auto'
              }}></div>
              <p style={{ fontSize: '12px', margin: 0, color: '#000', fontWeight: '300' }}>{mockInvoiceData.companyName}</p>
              <p style={{ fontSize: '10px', margin: '5px 0 0 0', color: '#666', fontStyle: 'italic' }}>Professional Services</p>
            </div>

            {/* Typography Layout */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '40px'
            }}>
              <div style={{ flex: 1, paddingRight: '30px' }}>
                <h2 style={{ 
                  fontSize: '14px', 
                  fontWeight: '300', 
                  color: '#000',
                  margin: '0 0 15px 0',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  Bill From
                </h2>
                <p style={{ margin: '5px 0', fontSize: '11px', lineHeight: '1.8' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '5px 0', fontSize: '11px', lineHeight: '1.8' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div style={{ flex: 1, paddingLeft: '30px', borderLeft: '1px solid #000' }}>
                <h2 style={{ 
                  fontSize: '14px', 
                  fontWeight: '300', 
                  color: '#000',
                  margin: '0 0 15px 0',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  Bill To
                </h2>
                <p style={{ margin: '5px 0', fontSize: '11px', lineHeight: '1.8' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '5px 0', fontSize: '11px', lineHeight: '1.8' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Typography Invoice Details */}
            <div style={{ 
              marginBottom: '35px',
              padding: '20px',
              backgroundColor: '#f9f9f9',
              border: '1px solid #000'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                  <h3 style={{ fontSize: '10px', margin: '0 0 5px 0', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Invoice Number</h3>
                  <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>{mockInvoiceData.invoiceNumber}</p>
              </div>
              <div>
                  <h3 style={{ fontSize: '10px', margin: '0 0 5px 0', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Invoice Date</h3>
                  <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>{mockInvoiceData.date}</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '10px', margin: '0 0 5px 0', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Due Date</h3>
                  <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>{mockInvoiceData.dueDate}</p>
                </div>
              </div>
            </div>

            {/* Typography Services */}
            <div style={{ marginBottom: '35px' }}>
              {mockInvoiceData.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '20px 0',
                  borderBottom: index < mockInvoiceData.items.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '13px', 
                      fontWeight: '400', 
                      color: '#000',
                      letterSpacing: '0.5px'
                    }}>
                      {item.description}
                    </h4>
                    <p style={{ 
                      margin: '0', 
                      fontSize: '10px', 
                      color: '#666',
                      fontStyle: 'italic',
                      letterSpacing: '0.5px'
                    }}>
                      {item.quantity} hours × ${item.rate} per hour
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <p style={{ 
                      margin: '0', 
                      fontSize: '14px', 
                      fontWeight: '300',
                      letterSpacing: '1px'
                    }}>
                      ${item.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Typography Totals */}
            <div style={{ 
              borderTop: '1px solid #000',
              paddingTop: '25px',
              textAlign: 'right'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '12px',
                fontWeight: '300'
              }}>
                <span>Subtotal</span>
                <span>${mockInvoiceData.subtotal}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '12px',
                fontWeight: '300'
              }}>
                <span>Discount ({mockInvoiceData.discountRate}%)</span>
                <span>-${mockInvoiceData.discount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '20px',
                fontSize: '12px',
                fontWeight: '300'
              }}>
                <span>Tax (10%)</span>
                <span>${mockInvoiceData.tax}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '20px',
                fontWeight: '100',
                padding: '20px 0',
                borderTop: '1px solid #000',
                letterSpacing: '2px'
              }}>
                <span>TOTAL</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
            </div>

          </div>
        );

      case 'grid':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '11px', 
            lineHeight: '1.4',
            color: '#000',
            backgroundColor: '#fff',
            padding: '25px',
            maxWidth: '650px',
            margin: '0 auto'
          }}>
            {/* Grid Header */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '2px solid #000'
            }}>
              <div>
                <h1 style={{ 
                  fontSize: '22px', 
                  fontWeight: 'bold', 
                  color: '#000',
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase'
                }}>
                  {mockInvoiceData.companyName}
                </h1>
                <p style={{ fontSize: '10px', margin: '0', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div style={{ 
                display: 'grid',
                gridTemplateRows: 'repeat(3, 1fr)',
                gap: '5px',
                padding: '15px',
                backgroundColor: '#f8f8f8',
                border: '1px solid #000'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold' }}>INVOICE #:</span>
                  <span style={{ fontSize: '10px' }}>{mockInvoiceData.invoiceNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold' }}>DATE:</span>
                  <span style={{ fontSize: '10px' }}>{mockInvoiceData.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold' }}>DUE:</span>
                  <span style={{ fontSize: '10px' }}>{mockInvoiceData.dueDate}</span>
                </div>
              </div>
            </div>

            {/* Grid Client Information */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '30px',
              padding: '20px',
              backgroundColor: '#f8f8f8',
              border: '1px solid #000'
            }}>
              <div>
                <h3 style={{ fontSize: '11px', margin: '0 0 10px 0', color: '#000', fontWeight: 'bold', textTransform: 'uppercase' }}>Bill From</h3>
                <p style={{ margin: '3px 0', fontSize: '10px' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '3px 0', fontSize: '10px' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '11px', margin: '0 0 10px 0', color: '#000', fontWeight: 'bold', textTransform: 'uppercase' }}>Bill To</h3>
                <p style={{ margin: '3px 0', fontSize: '10px' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '3px 0', fontSize: '10px' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Grid Services Table */}
            <div style={{ marginBottom: '30px' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
                fontSize: '10px',
                border: '1px solid #000'
            }}>
              <thead>
                  <tr style={{ backgroundColor: 'var(--mc-sidebar-bg)', color: '#fff' }}>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #000' }}>Description</th>
                    <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #000' }}>Qty</th>
                    <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>Rate</th>
                    <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                  {mockInvoiceData.items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #000' }}>
                      <td style={{ padding: '12px', border: '1px solid #000' }}>{item.description}</td>
                      <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #000' }}>{item.quantity}</td>
                      <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>${item.rate}</td>
                      <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>${item.amount}</td>
                </tr>
                  ))}
              </tbody>
            </table>
            </div>

            {/* Grid Totals */}
              <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{ 
                padding: '20px',
                backgroundColor: '#f8f8f8',
                border: '1px solid #000'
              }}>
                <h3 style={{ fontSize: '11px', margin: '0 0 15px 0', color: '#000', fontWeight: 'bold', textTransform: 'uppercase' }}>Payment Terms</h3>
                <p style={{ margin: '5px 0', fontSize: '10px' }}>• Net 30 days from invoice date</p>
                <p style={{ margin: '5px 0', fontSize: '10px' }}>• Late payment fees may apply</p>
                <p style={{ margin: '5px 0', fontSize: '10px' }}>• Thank you for your business</p>
              </div>
              <div style={{ 
                padding: '20px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: '#fff',
                border: '2px solid #000'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  fontSize: '11px'
                }}>
                  <span>Subtotal:</span>
                  <span>${mockInvoiceData.subtotal}</span>
            </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  fontSize: '11px'
                }}>
                  <span>Discount ({mockInvoiceData.discountRate}%):</span>
                  <span>-${mockInvoiceData.discount}</span>
          </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                  fontSize: '11px'
                }}>
                  <span>Tax (10%):</span>
                  <span>${mockInvoiceData.tax}</span>
          </div>
          <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  paddingTop: '10px',
                  borderTop: '1px solid #fff'
                }}>
                  <span>TOTAL:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'minimal-grey':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#666',
            backgroundColor: '#fff',
            padding: '30px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {/* Minimal Header - Centered with Grey */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '300', 
                color: '#666',
                margin: '0 0 10px 0',
                letterSpacing: '3px'
              }}>
                INVOICE
              </h1>
              <div style={{ 
                width: '60px', 
                height: '1px', 
                backgroundColor: '#999',
                margin: '0 auto 20px auto'
              }}></div>
              <p style={{ fontSize: '11px', margin: 0, color: '#999' }}>Professional Services</p>
            </div>

            {/* Simple Two Column Layout */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '40px'
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>FROM</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyEmail}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyPhone}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>TO</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientEmail}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientPhone}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Invoice Details - Horizontal */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '30px',
              padding: '15px 0',
              borderTop: '1px solid #999',
              borderBottom: '1px solid #999'
            }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '0', fontSize: '11px', color: '#666' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '0', fontSize: '11px', color: '#666' }}><strong>Amount:</strong> ${mockInvoiceData.total}</p>
              </div>
            </div>

            {/* Services - Clean List */}
            <div style={{ marginBottom: '30px' }}>
              {mockInvoiceData.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index < mockInvoiceData.items.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>{item.description}</p>
                    <p style={{ margin: '0', fontSize: '10px', color: '#999' }}>{item.quantity} hours × ${item.rate}/hr</p>
                  </div>
                  <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>${item.amount}</p>
                </div>
              ))}
            </div>

            {/* Totals - Right Aligned */}
            <div style={{ 
              borderTop: '2px solid #999',
              paddingTop: '20px',
              textAlign: 'right'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px',
                color: '#666'
              }}>
                <span>Subtotal:</span>
                <span>${mockInvoiceData.subtotal}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px',
                color: '#666'
              }}>
                <span>Discount ({mockInvoiceData.discountRate}%):</span>
                <span>-${mockInvoiceData.discount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px',
                color: '#666'
              }}>
                <span>Tax (10%):</span>
                <span>${mockInvoiceData.tax}</span>
            </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: 'bold', 
                paddingTop: '8px',
                borderTop: '1px solid #999',
                color: '#666'
              }}>
                <span>TOTAL:</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
            </div>
          </div>
        );

      case 'minimal-left':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#666',
            backgroundColor: '#fff',
            padding: '30px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {/* Left-Aligned Header */}
            <div style={{ 
              marginBottom: '40px'
            }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '300', 
                color: '#666',
                margin: '0 0 10px 0',
                letterSpacing: '2px'
              }}>
                INVOICE
              </h1>
              <div style={{ 
                width: '80px', 
                height: '1px', 
                backgroundColor: '#999',
                marginBottom: '15px'
              }}></div>
              <p style={{ fontSize: '11px', margin: 0, color: '#999' }}>Professional Services</p>
            </div>

            {/* Left-Aligned Layout */}
            <div style={{ 
              marginBottom: '40px'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>FROM</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>TO</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Invoice Details - Vertical */}
            <div style={{ 
              marginBottom: '30px',
              padding: '15px 0',
              borderTop: '1px solid #999',
              borderBottom: '1px solid #999'
            }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
              <p style={{ margin: '0', fontSize: '11px', color: '#666' }}><strong>Amount:</strong> ${mockInvoiceData.total}</p>
            </div>

            {/* Services - Clean List */}
            <div style={{ marginBottom: '30px' }}>
              {mockInvoiceData.items.map((item, index) => (
                <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index < mockInvoiceData.items.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>{item.description}</p>
                    <p style={{ margin: '0', fontSize: '10px', color: '#999' }}>{item.quantity} hours × ${item.rate}/hr</p>
                  </div>
                  <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>${item.amount}</p>
                </div>
              ))}
            </div>

            {/* Totals - Left Aligned */}
            <div style={{ 
              borderTop: '2px solid #999',
              paddingTop: '20px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px',
                color: '#666'
              }}>
                <span>Subtotal:</span>
                <span>${mockInvoiceData.subtotal}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px',
                color: '#666'
              }}>
                <span>Discount ({mockInvoiceData.discountRate}%):</span>
                <span>-${mockInvoiceData.discount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px',
                color: '#666'
              }}>
                <span>Tax (10%):</span>
                <span>${mockInvoiceData.tax}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: 'bold',
                paddingTop: '8px',
                borderTop: '1px solid #999',
                color: '#666'
              }}>
                <span>TOTAL:</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
            </div>
          </div>
        );

      case 'minimal-compact':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '11px',
            lineHeight: '1.5',
            color: '#666',
            backgroundColor: '#fff',
            padding: '25px',
            maxWidth: '450px',
            margin: '0 auto'
          }}>
            {/* Compact Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: '300', 
                color: '#666',
                margin: '0 0 8px 0',
                letterSpacing: '2px'
              }}>
                INVOICE
              </h1>
              <div style={{ 
                width: '40px', 
                height: '1px', 
                backgroundColor: '#999',
                margin: '0 auto 15px auto'
              }}></div>
              <p style={{ fontSize: '10px', margin: 0, color: '#999' }}>Professional Services</p>
            </div>

            {/* Compact Layout */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div>
                <p style={{ margin: '0 0 6px 0', fontSize: '10px', fontWeight: 'bold', color: '#666' }}>FROM</p>
                <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 6px 0', fontSize: '10px', fontWeight: 'bold', color: '#666' }}>TO</p>
                <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Compact Details */}
            <div style={{ 
              marginBottom: '25px',
              padding: '12px 0',
              borderTop: '1px solid #999',
              borderBottom: '1px solid #999'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                  <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                  <p style={{ margin: '0', fontSize: '10px', color: '#666' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                  <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                  <p style={{ margin: '0', fontSize: '10px', color: '#666' }}><strong>Amount:</strong> ${mockInvoiceData.total}</p>
                </div>
              </div>
            </div>

            {/* Compact Services */}
            <div style={{ marginBottom: '25px' }}>
              {mockInvoiceData.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: index < mockInvoiceData.items.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontSize: '10px', fontWeight: 'bold', color: '#666' }}>{item.description}</p>
                    <p style={{ margin: '0', fontSize: '9px', color: '#999' }}>{item.quantity} hours × ${item.rate}/hr</p>
                  </div>
                  <p style={{ margin: '0', fontSize: '10px', fontWeight: 'bold', color: '#666' }}>${item.amount}</p>
                </div>
              ))}
            </div>

            {/* Compact Totals */}
            <div style={{ 
              borderTop: '2px solid #999',
              paddingTop: '15px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '6px',
                fontSize: '10px',
                color: '#666'
              }}>
                <span>Subtotal:</span>
                <span>${mockInvoiceData.subtotal}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '6px',
                fontSize: '10px',
                color: '#666'
              }}>
                <span>Discount ({mockInvoiceData.discountRate}%):</span>
                <span>-${mockInvoiceData.discount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '6px',
                fontSize: '10px',
                color: '#666'
              }}>
                <span>Tax (10%):</span>
                <span>${mockInvoiceData.tax}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '14px',
                fontWeight: 'bold',
                paddingTop: '6px',
                borderTop: '1px solid #999',
                color: '#666'
              }}>
                <span>TOTAL:</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
            </div>
          </div>
        );

      case 'minimal-spaced':
        return (
              <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '13px',
            lineHeight: '1.8',
            color: '#666',
            backgroundColor: '#fff',
            padding: '40px',
            maxWidth: '550px',
            margin: '0 auto'
          }}>
            {/* Spaced Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '50px'
            }}>
              <h1 style={{ 
                fontSize: '36px', 
                fontWeight: '200', 
                color: '#666',
                margin: '0 0 15px 0',
                letterSpacing: '4px'
              }}>
                INVOICE
              </h1>
              <div style={{ 
                width: '100px', 
                height: '1px', 
                backgroundColor: '#999',
                margin: '0 auto 25px auto'
              }}></div>
              <p style={{ fontSize: '12px', margin: 0, color: '#999' }}>Professional Services</p>
              </div>

            {/* Spaced Layout */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '50px'
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>FROM</p>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>TO</p>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Spaced Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '40px',
              padding: '20px 0',
              borderTop: '1px solid #999',
              borderBottom: '1px solid #999'
            }}>
              <div>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}><strong>Amount:</strong> ${mockInvoiceData.total}</p>
              </div>
            </div>

            {/* Spaced Services */}
            <div style={{ marginBottom: '40px' }}>
              {mockInvoiceData.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '15px 0',
                  borderBottom: index < mockInvoiceData.items.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>{item.description}</p>
                    <p style={{ margin: '0', fontSize: '11px', color: '#999' }}>{item.quantity} hours × ${item.rate}/hr</p>
                  </div>
                  <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>${item.amount}</p>
                </div>
              ))}
            </div>

            {/* Spaced Totals */}
            <div style={{ 
              borderTop: '2px solid #999',
              paddingTop: '25px',
              textAlign: 'right'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '12px',
                color: '#666'
              }}>
                <span>Subtotal:</span>
                <span>${mockInvoiceData.subtotal}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '12px',
                color: '#666'
              }}>
                <span>Discount ({mockInvoiceData.discountRate}%):</span>
                <span>-${mockInvoiceData.discount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '12px',
                color: '#666'
              }}>
                <span>Tax (10%):</span>
                <span>${mockInvoiceData.tax}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: 'bold',
                paddingTop: '10px',
                borderTop: '1px solid #999',
                color: '#666'
              }}>
                <span>TOTAL:</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
            </div>
          </div>
        );

      case 'minimal-card':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#666',
            backgroundColor: '#fff',
            padding: '30px',
            maxWidth: '500px',
            margin: '0 auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            {/* Card Header */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '40px',
              paddingBottom: '20px',
              borderBottom: '1px solid #eee'
            }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '300', 
                color: '#666',
                margin: '0 0 10px 0',
                letterSpacing: '2px'
              }}>
                INVOICE
              </h1>
              <div style={{ 
                width: '60px', 
                height: '1px', 
                backgroundColor: '#999',
                margin: '0 auto 15px auto'
              }}></div>
              <p style={{ fontSize: '11px', margin: 0, color: '#999' }}>Professional Services</p>
            </div>

            {/* Card Layout */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '25px',
              marginBottom: '35px'
            }}>
              <div style={{ 
                padding: '15px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                border: '1px solid #eee'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>FROM</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div style={{ 
                padding: '15px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                border: '1px solid #eee'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>TO</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Card Details */}
            <div style={{ 
              marginBottom: '30px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              border: '1px solid #eee'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                  <p style={{ margin: '0', fontSize: '11px', color: '#666' }}><strong>Date:</strong> {mockInvoiceData.date}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                  <p style={{ margin: '0', fontSize: '11px', color: '#666' }}><strong>Amount:</strong> ${mockInvoiceData.total}</p>
                </div>
              </div>
            </div>

            {/* Card Services */}
            <div style={{ marginBottom: '30px' }}>
              {mockInvoiceData.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  border: '1px solid #eee'
                }}>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>{item.description}</p>
                    <p style={{ margin: '0', fontSize: '10px', color: '#999' }}>{item.quantity} hours × ${item.rate}/hr</p>
                  </div>
                  <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>${item.amount}</p>
                </div>
              ))}
            </div>

            {/* Card Totals */}
            <div style={{ 
            padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              border: '1px solid #eee'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px',
                color: '#666'
              }}>
                <span>Subtotal:</span>
                <span>${mockInvoiceData.subtotal}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px',
                color: '#666'
              }}>
                <span>Discount ({mockInvoiceData.discountRate}%):</span>
                <span>-${mockInvoiceData.discount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '11px',
                color: '#666'
              }}>
                <span>Tax (10%):</span>
                <span>${mockInvoiceData.tax}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: 'bold',
                paddingTop: '8px',
                borderTop: '1px solid #ddd',
                color: '#666'
              }}>
                <span>TOTAL:</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
            </div>
          </div>
        );

      case 'modern-grey':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#666',
            backgroundColor: '#fff',
            padding: '25px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {/* Modern Header with Sidebar - Grey */}
            <div style={{ 
              display: 'flex',
              marginBottom: '30px'
            }}>
              <div style={{ flex: 2 }}>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                  color: '#666',
                margin: '0 0 5px 0'
              }}>
                  INVOICE
              </h1>
                <p style={{ fontSize: '12px', margin: 0, color: '#999' }}>{mockInvoiceData.companyName}</p>
              </div>
              <div style={{ 
                flex: 1, 
                textAlign: 'right',
                paddingLeft: '20px',
                borderLeft: '3px solid #999'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold', color: '#666' }}>#{mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '0', fontSize: '11px', color: '#999' }}>{mockInvoiceData.date}</p>
              </div>
            </div>

            {/* Modern Grid Layout */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <div>
                <h3 style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontWeight: 'bold' }}>FROM</h3>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontWeight: 'bold' }}>BILL TO</h3>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Modern Details Bar */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              padding: '15px',
              backgroundColor: '#f8f8f8',
              borderRadius: '0'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}><strong>Payment Terms:</strong> Net 30</p>
              </div>
            </div>

            {/* Modern Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '25px',
              fontSize: '11px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#999', color: '#fff' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: 'none' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: 'none' }}>Qty</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: 'none' }}>Rate</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: 'none' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoiceData.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', border: 'none', color: '#666' }}>{item.description}</td>
                    <td style={{ padding: '12px', textAlign: 'center', border: 'none', color: '#666' }}>{item.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#666' }}>${item.rate}</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#333', fontWeight: 'bold' }}>${item.amount}</td>
                </tr>
                ))}
              </tbody>
            </table>

            {/* Modern Totals */}
              <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '30px'
            }}>
              <div style={{ width: '250px' }}>
          <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Subtotal:</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>${mockInvoiceData.subtotal}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Discount ({mockInvoiceData.discountRate}%):</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>-${mockInvoiceData.discount}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Tax (10%):</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>${mockInvoiceData.tax}</span>
            </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  backgroundColor: '#999',
                  color: '#fff',
                  marginTop: '10px',
                  paddingLeft: '15px',
                  paddingRight: '15px'
                }}>
                  <span>TOTAL:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
              </div>
            </div>

            {/* Modern Footer */}
              <div style={{ 
              textAlign: 'center', 
              fontSize: '10px', 
              color: '#999',
              borderTop: '1px solid #eee',
              paddingTop: '15px'
            }}>
              <p>Thank you for your business!</p>
            </div>
          </div>
        );

      case 'modern-vertical':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#666',
            backgroundColor: '#fff',
            padding: '25px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {/* Vertical Header */}
            <div style={{ 
              marginBottom: '30px'
            }}>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                  color: '#666',
                margin: '0 0 5px 0'
              }}>
                  INVOICE
              </h1>
              <p style={{ fontSize: '12px', margin: '0 0 15px 0', color: '#999' }}>{mockInvoiceData.companyName}</p>
              <div style={{ 
                display: 'flex',
                gap: '20px',
                padding: '10px 0',
                borderTop: '1px solid #999',
                borderBottom: '1px solid #999'
              }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Invoice #</p>
                  <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.invoiceNumber}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Date</p>
                  <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.date}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Due Date</p>
                  <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.dueDate}</p>
                </div>
              </div>
            </div>

            {/* Vertical Layout */}
            <div style={{ 
              marginBottom: '30px'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontWeight: 'bold' }}>FROM</h3>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontWeight: 'bold' }}>BILL TO</h3>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Payment Terms */}
            <div style={{ 
              marginBottom: '25px',
              padding: '15px',
              backgroundColor: '#f8f8f8',
              borderRadius: '0'
            }}>
              <p style={{ margin: '0', fontSize: '11px', color: '#666' }}><strong>Payment Terms:</strong> Net 30</p>
            </div>

            {/* Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '25px',
              fontSize: '11px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#999', color: '#fff' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: 'none' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: 'none' }}>Qty</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: 'none' }}>Rate</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: 'none' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoiceData.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', border: 'none', color: '#666' }}>{item.description}</td>
                    <td style={{ padding: '12px', textAlign: 'center', border: 'none', color: '#666' }}>{item.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#666' }}>${item.rate}</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#333', fontWeight: 'bold' }}>${item.amount}</td>
                </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
              <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '30px'
            }}>
              <div style={{ width: '250px' }}>
          <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Subtotal:</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>${mockInvoiceData.subtotal}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Discount ({mockInvoiceData.discountRate}%):</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>-${mockInvoiceData.discount}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Tax (10%):</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>${mockInvoiceData.tax}</span>
            </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  backgroundColor: '#999',
                  color: '#fff',
                  marginTop: '10px',
                  paddingLeft: '15px',
                  paddingRight: '15px'
                }}>
                  <span>TOTAL:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
              </div>
            </div>

            {/* Footer */}
              <div style={{ 
              textAlign: 'center', 
              fontSize: '10px', 
              color: '#999',
              borderTop: '1px solid #eee',
              paddingTop: '15px'
            }}>
              <p>Thank you for your business!</p>
            </div>
          </div>
        );

      case 'modern-compact':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '11px',
            lineHeight: '1.3',
            color: '#666',
            backgroundColor: '#fff',
            padding: '20px',
            maxWidth: '550px',
            margin: '0 auto'
          }}>
            {/* Compact Header */}
            <div style={{ 
              display: 'flex',
              marginBottom: '25px'
            }}>
              <div style={{ flex: 2 }}>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                  color: '#666',
                margin: '0 0 3px 0'
              }}>
                  INVOICE
              </h1>
                <p style={{ fontSize: '10px', margin: 0, color: '#999' }}>{mockInvoiceData.companyName}</p>
              </div>
              <div style={{ 
                flex: 1, 
                textAlign: 'right',
                paddingLeft: '15px',
                borderLeft: '2px solid #999'
              }}>
                <p style={{ margin: '0 0 3px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>#{mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '0', fontSize: '10px', color: '#999' }}>{mockInvoiceData.date}</p>
              </div>
            </div>

            {/* Compact Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <h3 style={{ fontSize: '10px', color: '#666', margin: '0 0 6px 0', fontWeight: 'bold' }}>FROM</h3>
                <p style={{ margin: '1px 0', fontSize: '10px', color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '1px 0', fontSize: '10px', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '10px', color: '#666', margin: '0 0 6px 0', fontWeight: 'bold' }}>BILL TO</h3>
                <p style={{ margin: '1px 0', fontSize: '10px', color: '#666' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '1px 0', fontSize: '10px', color: '#666' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Compact Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: '#f8f8f8',
              borderRadius: '0'
            }}>
              <div>
                <p style={{ margin: '1px 0', fontSize: '10px', color: '#666' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
              </div>
              <div>
                <p style={{ margin: '1px 0', fontSize: '10px', color: '#666' }}><strong>Payment Terms:</strong> Net 30</p>
              </div>
            </div>

            {/* Compact Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '10px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#999', color: '#fff' }}>
                  <th style={{ padding: '8px', textAlign: 'left', border: 'none' }}>Description</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: 'none' }}>Qty</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: 'none' }}>Rate</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: 'none' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoiceData.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px', border: 'none', color: '#666' }}>{item.description}</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: 'none', color: '#666' }}>{item.quantity}</td>
                    <td style={{ padding: '8px', textAlign: 'right', border: 'none', color: '#666' }}>${item.rate}</td>
                    <td style={{ padding: '8px', textAlign: 'right', border: 'none', color: '#666' }}>${item.amount}</td>
                </tr>
                ))}
              </tbody>
            </table>

            {/* Compact Totals */}
              <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '25px'
            }}>
              <div style={{ width: '200px' }}>
          <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '10px', color: '#666' }}>Subtotal:</span>
                  <span style={{ fontSize: '10px', color: '#333', fontWeight: 'bold' }}>${mockInvoiceData.subtotal}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '10px', color: '#666' }}>Discount ({mockInvoiceData.discountRate}%):</span>
                  <span style={{ fontSize: '10px', color: '#333', fontWeight: 'bold' }}>-${mockInvoiceData.discount}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '10px', color: '#666' }}>Tax (10%):</span>
                  <span style={{ fontSize: '10px', color: '#333', fontWeight: 'bold' }}>${mockInvoiceData.tax}</span>
            </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  backgroundColor: '#999',
                  color: '#fff',
                  marginTop: '8px',
                  paddingLeft: '10px',
                  paddingRight: '10px'
                }}>
                  <span>TOTAL:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
              </div>
            </div>

            {/* Compact Footer */}
              <div style={{ 
              textAlign: 'center', 
              fontSize: '9px', 
              color: '#999',
              borderTop: '1px solid #eee',
              paddingTop: '10px'
            }}>
              <p>Thank you for your business!</p>
            </div>
          </div>
        );

      case 'modern-spaced':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#666',
            backgroundColor: '#fff',
            padding: '35px',
            maxWidth: '650px',
            margin: '0 auto'
          }}>
            {/* Spaced Header */}
            <div style={{ 
              display: 'flex',
              marginBottom: '40px'
            }}>
              <div style={{ flex: 2 }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                  color: '#666',
                margin: '0 0 8px 0'
              }}>
                  INVOICE
              </h1>
                <p style={{ fontSize: '14px', margin: 0, color: '#999' }}>{mockInvoiceData.companyName}</p>
              </div>
              <div style={{ 
                flex: 1, 
                textAlign: 'right',
                paddingLeft: '25px',
                borderLeft: '4px solid #999'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#666' }}>#{mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>{mockInvoiceData.date}</p>
              </div>
            </div>

            {/* Spaced Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              marginBottom: '40px'
            }}>
              <div>
                <h3 style={{ fontSize: '14px', color: '#666', margin: '0 0 15px 0', fontWeight: 'bold' }}>FROM</h3>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '14px', color: '#666', margin: '0 0 15px 0', fontWeight: 'bold' }}>BILL TO</h3>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Spaced Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '35px',
              padding: '20px',
              backgroundColor: '#f8f8f8',
              borderRadius: '0'
            }}>
              <div>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
              </div>
              <div>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}><strong>Payment Terms:</strong> Net 30</p>
              </div>
            </div>

            {/* Spaced Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '35px',
              fontSize: '12px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#999', color: '#fff' }}>
                  <th style={{ padding: '15px', textAlign: 'left', border: 'none' }}>Description</th>
                  <th style={{ padding: '15px', textAlign: 'center', border: 'none' }}>Qty</th>
                  <th style={{ padding: '15px', textAlign: 'right', border: 'none' }}>Rate</th>
                  <th style={{ padding: '15px', textAlign: 'right', border: 'none' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoiceData.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', border: 'none', color: '#666' }}>{item.description}</td>
                    <td style={{ padding: '15px', textAlign: 'center', border: 'none', color: '#666' }}>{item.quantity}</td>
                    <td style={{ padding: '15px', textAlign: 'right', border: 'none', color: '#666' }}>${item.rate}</td>
                    <td style={{ padding: '15px', textAlign: 'right', border: 'none', color: '#666' }}>${item.amount}</td>
                </tr>
                ))}
              </tbody>
            </table>

            {/* Spaced Totals */}
              <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '40px'
            }}>
              <div style={{ width: '300px' }}>
          <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>Subtotal:</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>${mockInvoiceData.subtotal}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>Discount ({mockInvoiceData.discountRate}%):</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>-${mockInvoiceData.discount}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>Tax (10%):</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>${mockInvoiceData.tax}</span>
            </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '15px 0',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  backgroundColor: '#999',
                  color: '#fff',
                  marginTop: '15px',
                  paddingLeft: '20px',
                  paddingRight: '20px'
                }}>
                  <span>TOTAL:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
              </div>
            </div>

            {/* Spaced Footer */}
              <div style={{ 
              textAlign: 'center', 
              fontSize: '12px', 
              color: '#999',
              borderTop: '1px solid #eee',
              paddingTop: '20px'
            }}>
              <p>Thank you for your business!</p>
            </div>
          </div>
        );

      case 'modern-card':
        return (
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#666',
            backgroundColor: '#fff',
            padding: '30px',
            maxWidth: '600px',
            margin: '0 auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            {/* Card Header */}
            <div style={{ 
              display: 'flex',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '1px solid #eee'
            }}>
              <div style={{ flex: 2 }}>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                  color: '#666',
                margin: '0 0 5px 0'
              }}>
                  INVOICE
              </h1>
                <p style={{ fontSize: '12px', margin: 0, color: '#999' }}>{mockInvoiceData.companyName}</p>
              </div>
              <div style={{ 
                flex: 1, 
                textAlign: 'right',
                paddingLeft: '20px',
                borderLeft: '3px solid #999'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold', color: '#666' }}>#{mockInvoiceData.invoiceNumber}</p>
                <p style={{ margin: '0', fontSize: '11px', color: '#999' }}>{mockInvoiceData.date}</p>
              </div>
            </div>

            {/* Card Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <div style={{ 
                padding: '15px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                border: '1px solid #eee'
              }}>
                <h3 style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontWeight: 'bold' }}>FROM</h3>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.companyAddress}</p>
              </div>
              <div style={{ 
                padding: '15px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                border: '1px solid #eee'
              }}>
                <h3 style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontWeight: 'bold' }}>BILL TO</h3>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientName}</p>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{mockInvoiceData.clientAddress}</p>
              </div>
            </div>

            {/* Card Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '25px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              border: '1px solid #eee'
            }}>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
              </div>
              <div>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}><strong>Payment Terms:</strong> Net 30</p>
              </div>
            </div>

            {/* Card Table */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '25px',
              fontSize: '11px',
              border: '1px solid #eee',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#999', color: '#fff' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: 'none' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: 'none' }}>Qty</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: 'none' }}>Rate</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: 'none' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoiceData.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                    <td style={{ padding: '12px', border: 'none', color: '#666' }}>{item.description}</td>
                    <td style={{ padding: '12px', textAlign: 'center', border: 'none', color: '#666' }}>{item.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#666' }}>${item.rate}</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#333', fontWeight: 'bold' }}>${item.amount}</td>
                </tr>
                ))}
              </tbody>
            </table>

            {/* Card Totals */}
              <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '30px'
            }}>
              <div style={{ width: '250px' }}>
          <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Subtotal:</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>${mockInvoiceData.subtotal}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Discount ({mockInvoiceData.discountRate}%):</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>-${mockInvoiceData.discount}</span>
              </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Tax (10%):</span>
                  <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>${mockInvoiceData.tax}</span>
            </div>
            <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  backgroundColor: '#999',
                  color: '#fff',
                  marginTop: '10px',
                  paddingLeft: '15px',
                  paddingRight: '15px',
                  borderRadius: '4px'
                }}>
                  <span>TOTAL:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${mockInvoiceData.total}</span>
              </div>
              </div>
            </div>

            {/* Card Footer */}
              <div style={{ 
              textAlign: 'center', 
              fontSize: '10px', 
              color: '#999',
              borderTop: '1px solid #eee',
              paddingTop: '15px'
            }}>
              <p>Thank you for your business!</p>
            </div>
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
    <>
    <div style={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px', 
        padding: '32px',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(31, 41, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(51, 65, 85, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h3 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, var(--mc-sidebar-bg) 0%, var(--mc-sidebar-bg-hover) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em'
            }}>
              Modern Templates
      </h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280', 
              margin: 0,
              fontWeight: '400'
            }}>
              Choose from {templates.length} professionally designed invoice templates
            </p>
            </div>
        </div>

      {/* Modern Template Preview Modal */}
      {selectedTemplate && (
        <div 
          onClick={() => setSelectedTemplate(null)}
          style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            margin: 0
          }}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              position: 'relative'
          }}>
            {/* Modern Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '24px 32px',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  background: 'linear-gradient(135deg, var(--mc-sidebar-bg) 0%, var(--mc-sidebar-bg-hover) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 0 4px 0',
                  letterSpacing: '-0.02em'
                }}>
                  {templates.find(t => t.id === selectedTemplate)?.name} Template
              </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  margin: 0,
                  fontWeight: '400'
                }}>
                  Preview and customize your invoice design
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                ✕
              </button>
            </div>
            
            {/* Modern Modal Content */}
            <div style={{ padding: '32px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                backdropFilter: 'blur(10px)',
                padding: '40px', 
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.3)',
                marginBottom: '32px',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}>
                <div style={{ 
                  transform: 'scale(1)', 
                  maxWidth: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                  {renderTemplatePreview(selectedTemplate)}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '25px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Template selected! This will be integrated with the invoice generation.');
                    setSelectedTemplate(null);
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '25px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--mc-sidebar-bg) 0%, var(--mc-sidebar-bg-hover) 100%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(31, 41, 55, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(31, 41, 55, 0.3)';
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

        {/* Modern Templates Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '24px',
          marginTop: '24px'
        }}>
          {templates.map((template, index) => (
          <div
            key={template.id}
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.2)',
              overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: template.is_available ? 'pointer' : 'not-allowed',
                opacity: template.is_available ? 1 : 0.5,
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
            onMouseEnter={(e) => {
              if (template.is_available) {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.3)';
                  e.currentTarget.style.borderColor = 'var(--mc-sidebar-bg)';
              }
            }}
            onMouseLeave={(e) => {
              if (template.is_available) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }
            }}
            onClick={() => template.is_available && setSelectedTemplate(template.id)}
          >
              {/* Card Gradient Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, 
                  ${index % 3 === 0 ? 'rgba(31, 41, 55, 0.1)' : 
                    index % 3 === 1 ? 'rgba(51, 65, 85, 0.1)' : 
                    'rgba(31, 41, 55, 0.05)'} 0%, 
                  transparent 50%)`,
                pointerEvents: 'none'
              }} />
              
            {/* Template Preview */}
              <div style={{ 
                padding: '20px', 
                backgroundColor: 'rgba(255,255,255,0.8)', 
                height: '280px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{ 
                  transform: 'scale(0.6)', 
                  transformOrigin: 'top center', 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                {renderTemplatePreview(template.id)}
              </div>
            </div>
            
              {/* Template Info */}
              <div style={{ 
                padding: '20px', 
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    margin: '0 0 4px 0',
                    letterSpacing: '-0.01em'
                  }}>
                    {template.name}
                  </h4>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: '0 0 8px 0',
                    lineHeight: '1.4'
                  }}>
                    {template.description}
                  </p>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    textTransform: 'capitalize'
                  }}>
                    {template.style}
                  </div>
                </div>
                
                {/* Action Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
              {template.is_available ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template.id);
                  }}
                  style={{
                        padding: '12px 24px',
                        borderRadius: '25px',
                    border: 'none',
                        background: 'linear-gradient(135deg, var(--mc-sidebar-bg) 0%, var(--mc-sidebar-bg-hover) 100%)',
                    color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)',
                        width: '100%',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(31, 41, 55, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(31, 41, 55, 0.3)';
                      }}
                    >
                      <Check size={16} />
                  Use Template
                </button>
              ) : (
                    <div style={{
                      fontSize: '12px',
                  color: '#6b7280',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '12px 24px',
                      borderRadius: '25px',
                      fontWeight: '500',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      width: '100%',
                      textAlign: 'center'
                }}>
                  Coming Soon
                    </div>
              )}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
      </div>

      {/* Modern Template Preview Modal - Outside main container */}
      {selectedTemplate && (
        <div 
          onClick={() => setSelectedTemplate(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            margin: 0
          }}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              position: 'relative'
            }}>
            {/* Modern Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '24px 32px',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  background: 'linear-gradient(135deg, var(--mc-sidebar-bg) 0%, var(--mc-sidebar-bg-hover) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 0 4px 0',
                  letterSpacing: '-0.02em'
                }}>
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  margin: 0,
                  fontWeight: '500'
                }}>
                  Preview and customize your invoice design
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <X size={20} color="#6b7280" />
              </button>
            </div>

            {/* Template Preview */}
            <div style={{ 
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}>
                {renderTemplatePreview(selectedTemplate)}
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '16px',
                width: '100%',
                maxWidth: '600px'
              }}>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    background: 'rgba(255,255,255,0.8)',
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked! Using template:', selectedTemplate);
                    console.log('onUseTemplate function:', onUseTemplate);
                    setSelectedTemplate(null);
                    if (onUseTemplate) {
                      console.log('Calling onUseTemplate...');
                      onUseTemplate(selectedTemplate);
                    } else {
                      console.log('onUseTemplate is not defined');
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--mc-sidebar-bg) 0%, var(--mc-sidebar-bg-hover) 100%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(31, 41, 55, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(31, 41, 55, 0.3)';
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
    </>
  );
};


