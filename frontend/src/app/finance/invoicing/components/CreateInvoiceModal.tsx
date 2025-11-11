'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X,
  Plus,
  Minus,
  Save,
  FileText,
  User,
  Building,
  Calendar,
  DollarSign,
  Percent,
  Hash,
  Trash2,
  Receipt
} from 'lucide-react';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { buildApiUrl } from '../../../../config/api';

interface InvoiceItem {
  id: string;
  type: 'service' | 'item';
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface InvoiceService {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (invoiceData: any) => void;
  onSend?: (invoiceData: any) => void;
  initialTab?: 'details' | 'items' | 'services' | 'summary' | 'invoice';
  selectedTemplateId?: string | null;
  editingInvoice?: any;
  autoDownload?: boolean;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, onSave, onSend, initialTab = 'details', selectedTemplateId, editingInvoice, autoDownload = false }) => {
  const { selectedCurrency } = useCurrency();
  const { token } = useAuth();
  
  // Company/Business profile data
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: ''
  });
  
  // Format currency for invoice display (no conversion, just formatting)
  const formatInvoiceCurrency = (amount: number, currency?: string): string => {
    const currencyCode = currency || selectedCurrency;
    try {
      const locale = currencyCode === 'TZS' ? 'en-TZ' :
                     currencyCode === 'KES' ? 'en-KE' :
                     currencyCode === 'USD' ? 'en-US' :
                     currencyCode === 'EUR' ? 'de-DE' :
                     currencyCode === 'GBP' ? 'en-GB' : 'en-US';
      
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      return `${currencyCode} ${amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    }
  };
  
  // Generate auto invoice number
  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const [formData, setFormData] = useState({
    invoiceNumber: generateInvoiceNumber(),
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    notes: '',
    taxRate: '',
    discount: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', type: 'item', description: '', quantity: 0, unit: '', rate: 0, amount: 0 }
  ]);

  const [services, setServices] = useState<InvoiceService[]>([
    { id: '1', description: '', quantity: 0, unit: 'hours', rate: 0, amount: 0 }
  ]);

  const [activeTab, setActiveTab] = useState<'details' | 'items' | 'services' | 'summary' | 'invoice'>(initialTab);
  const [generatedInvoice, setGeneratedInvoice] = useState<any>(null);
  const [currentTemplateId, setCurrentTemplateId] = useState<string>(selectedTemplateId || 'minimal');
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Auto-generate preview if opened on invoice tab (wait for companyInfo if needed)
  useEffect(() => {
    if (initialTab === 'invoice' && !generatedInvoice) {
      // If we have companyInfo or editingInvoice data, generate immediately
      // Otherwise, wait for companyInfo to load (handled by the other useEffect)
      if (companyInfo.companyName || editingInvoice?.invoiceData) {
        generateInvoicePreview();
      }
    }
  }, [initialTab, selectedTemplateId, companyInfo.companyName, editingInvoice]);

  // Populate form when editing an invoice
  useEffect(() => {
    if (editingInvoice && editingInvoice.invoiceData) {
      const data = editingInvoice.invoiceData;
      setFormData({
        invoiceNumber: data.invoiceNumber || '',
        issueDate: data.date || '',
        dueDate: data.dueDate || '',
        clientName: data.clientName || '',
        clientEmail: data.clientEmail || '',
        clientPhone: data.clientPhone || '',
        clientAddress: data.clientAddress || '',
        taxRate: data.taxRate || '',
        discount: data.discount || '',
        notes: data.notes || ''
      });
      
      if (data.items && data.items.length > 0) {
        setItems(data.items);
      }
      
      if (data.services && data.services.length > 0) {
        setServices(data.services);
      }
      
      // If invoice has company info, use it (preserves original invoice data)
      if (data.companyName || data.companyEmail || data.companyAddress) {
        setCompanyInfo({
          companyName: data.companyName || '',
          companyEmail: data.companyEmail || '',
          companyPhone: data.companyPhone || '',
          companyAddress: data.companyAddress || ''
        });
      }
    }
  }, [editingInvoice]);

  // Update current template when selectedTemplateId changes
  useEffect(() => {
    if (selectedTemplateId) {
      console.log('Template ID received:', selectedTemplateId);
      setCurrentTemplateId(selectedTemplateId);
    }
  }, [selectedTemplateId]);

  // Fetch business profile data when modal opens
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      if (!token || !isOpen) return;
      
      try {
        const response = await fetch(buildApiUrl('/profile'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const businessInfo = data.business_info || {};
          
          // Build address string from components - handle null/undefined/empty values
          const addressParts = [];
          
          // Check for business_address (might be businessAddress in some cases)
          const businessAddress = businessInfo.business_address || businessInfo.businessAddress || '';
          if (businessAddress && businessAddress.trim()) {
            addressParts.push(businessAddress.trim());
          }
          
          const city = businessInfo.city || '';
          if (city && city.trim()) {
            addressParts.push(city.trim());
          }
          
          const country = businessInfo.country || '';
          if (country && country.trim()) {
            addressParts.push(country.trim());
          }
          
          const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : '';
          
          console.log('Building company address:', {
            business_address: businessAddress,
            city: city,
            country: country,
            addressParts: addressParts,
            fullAddress: fullAddress,
            rawBusinessInfo: businessInfo
          });
          
          const newCompanyInfo = {
            companyName: businessInfo.business_name || businessInfo.businessName || '',
            companyEmail: businessInfo.business_email || businessInfo.businessEmail || '',
            companyPhone: businessInfo.business_phone || businessInfo.businessPhone || '',
            companyAddress: fullAddress
          };
          
          console.log('Setting company info:', newCompanyInfo);
          setCompanyInfo(newCompanyInfo);
          
          // If we're on the invoice tab and have a generated invoice, regenerate it with the new company info
          if (activeTab === 'invoice' && generatedInvoice) {
            console.log('Regenerating invoice with new company info...');
            setTimeout(() => {
              generateInvoicePreview();
            }, 100);
          }
        }
      } catch (error) {
        console.error('Error fetching business profile:', error);
        // Keep default values if fetch fails
      }
    };
    
    fetchBusinessProfile();
  }, [token, isOpen, activeTab, generatedInvoice]);

  // Auto-update preview when form data or companyInfo changes
  useEffect(() => {
    if (activeTab === 'invoice') {
      generateInvoicePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, items, services, activeTab, companyInfo, selectedCurrency]);

  useEffect(() => {
    if (!isOpen || !autoDownload) {
      return;
    }

    if (!generatedInvoice) {
      generateInvoicePreview();
      return;
    }

    if (!invoiceRef.current) {
      return;
    }

    const timer = setTimeout(async () => {
      await handleDownload({ silent: true });
      onClose();
    }, 400);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, autoDownload, generatedInvoice, onClose]);

  const inputStyle = (hasError: boolean = false) => ({
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '16px',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '20px',
    fontSize: '14px',
    outline: 'none'
  });

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      type: 'item',
      description: '',
      quantity: 1,
      unit: '',
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const addService = () => {
    const newService: InvoiceService = {
      id: Date.now().toString(),
      description: '',
      quantity: 0,
      unit: 'hours',
      rate: 0,
      amount: 0
    };
    setServices([...services, newService]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const removeService = (id: string) => {
    if (services.length > 1) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const updateService = (id: string, field: keyof InvoiceService, value: string | number) => {
    const updatedServices = services.map(service => {
      if (service.id === id) {
        const updatedService = { ...service, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedService.amount = updatedService.quantity * updatedService.rate;
        }
        return updatedService;
      }
      return service;
    });
    setServices(updatedServices);
  };

  const itemsSubtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const servicesSubtotal = services.reduce((sum, service) => sum + service.amount, 0);
  const subtotal = itemsSubtotal + servicesSubtotal;
  const taxAmount = (subtotal * (parseFloat(formData.taxRate) || 0)) / 100;
  const discountAmount = (subtotal * (parseFloat(formData.discount) || 0)) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const generateInvoicePreview = () => {
    const invoiceData = {
      invoiceNumber: formData.invoiceNumber,
      date: formData.issueDate,
      dueDate: formData.dueDate,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      clientAddress: formData.clientAddress,
      companyName: companyInfo.companyName || 'Your Company Name',
      companyEmail: companyInfo.companyEmail || 'info@yourcompany.com',
      companyPhone: companyInfo.companyPhone || '+1 (555) 987-6543',
      companyAddress: (companyInfo.companyAddress && companyInfo.companyAddress.trim()) || (editingInvoice?.invoiceData?.companyAddress && editingInvoice.invoiceData.companyAddress.trim()) || '',
      items: items.filter(item => item.description && item.amount > 0),
      subtotal: subtotal,
      discount: discountAmount,
      discountRate: formData.discount,
      tax: taxAmount,
      total: total,
      notes: formData.notes,
      currency: selectedCurrency
    };
    
    console.log('Generating invoice preview with company info:', {
      companyName: invoiceData.companyName,
      companyAddress: invoiceData.companyAddress,
      companyEmail: invoiceData.companyEmail,
      companyPhone: invoiceData.companyPhone,
      companyInfoState: companyInfo,
      hasAddress: !!invoiceData.companyAddress,
      addressLength: invoiceData.companyAddress?.length || 0
    });
    
    setGeneratedInvoice(invoiceData);
    if (activeTab !== 'invoice') {
      setActiveTab('invoice');
    }
  };

  const handleSave = () => {
    // Generate invoice preview if not already generated
    if (!generatedInvoice) {
      generateInvoicePreview();
      // Wait a bit for state to update, then save
      setTimeout(() => {
        if (onSave) {
          const invoiceData = {
            invoiceNumber: formData.invoiceNumber,
            date: formData.issueDate,
            dueDate: formData.dueDate,
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            clientPhone: formData.clientPhone,
            clientAddress: formData.clientAddress,
            companyName: companyInfo.companyName || 'Your Company Name',
            companyEmail: companyInfo.companyEmail || 'info@yourcompany.com',
            companyPhone: companyInfo.companyPhone || '+1 (555) 987-6543',
            companyAddress: companyInfo.companyAddress || '456 Office Ave, Business City, BC 67890',
            items: items.filter(item => item.description && item.amount > 0),
            subtotal: subtotal,
            discount: discountAmount,
            discountRate: formData.discount,
            tax: taxAmount,
            taxRate: formData.taxRate, // Include taxRate for backend update
            total: total,
            notes: formData.notes,
            currency: selectedCurrency,
            templateId: currentTemplateId
          };
          onSave(invoiceData);
        }
      }, 100);
    } else {
      // If preview already exists, save immediately
      if (onSave) {
        onSave(generatedInvoice);
      }
    }
  };

  const handleDownload = async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    if (!generatedInvoice || !invoiceRef.current) {
      if (!silent) {
      alert('Please generate an invoice first');
      }
        return;
      }

    try {
      // Dynamic imports to avoid TypeScript issues
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).jsPDF;

      // Generate high-quality canvas
      const canvas = await html2canvas(invoiceRef.current, {
        background: '#ffffff',
        logging: false
      });

      // Create PDF with high quality
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to maintain aspect ratio
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const safeInvoiceNumber = (generatedInvoice.invoiceNumber || 'invoice').toString().replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `invoice-${safeInvoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // Save the invoice to the system after successful download
      if (onSave) {
        onSave(generatedInvoice);
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      if (!silent) {
        alert('Error generating PDF. Please try again.');
      }
    }
  };

  const renderDetailsTab = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Invoice Details */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} />
          Invoice Details
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>
              Invoice Number
            </label>
            <div style={{
              ...inputStyle(),
              backgroundColor: '#f9fafb',
              color: '#6b7280',
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>{formData.invoiceNumber}</span>
              <button
                type="button"
                onClick={() => setFormData({...formData, invoiceNumber: generateInvoiceNumber()})}
                style={{
                  padding: '4px 8px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Regenerate
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>
              Issue Date *
            </label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
              style={inputStyle()}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>
              Due Date *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              style={inputStyle()}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>
              Client *
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              placeholder="Select or enter client name"
              style={inputStyle()}
              required
            />
          </div>
        </div>

        {/* Client Information */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>
                Email
              </label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                placeholder="client@example.com"
                style={inputStyle()}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>
                Phone
              </label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                placeholder="+1 (555) 123-4567"
                style={inputStyle()}
              />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>
              Address
            </label>
            <textarea
              value={formData.clientAddress}
              onChange={(e) => setFormData({...formData, clientAddress: e.target.value})}
              placeholder="Client address"
              style={{
                ...inputStyle(),
                width: '60%',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Tax and Discount Settings */}
      </div>
    </div>
  );

  const renderItemsTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Receipt size={16} />
          Invoice Items
        </h3>
        <button
          onClick={addItem}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ 
                textAlign: 'left', 
                padding: '12px 16px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151',
                width: '35%',           // DESCRIPTION WIDTH - Increased from 25%
                minWidth: '200px'       // DESCRIPTION MIN WIDTH - Adjust this value
              }}>Description</th>
              <th style={{ 
                textAlign: 'center', 
                padding: '12px 16px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151', 
                width: '12%',           // QTY WIDTH - Adjust this percentage
                minWidth: '80px'        // QTY MIN WIDTH - Adjust this value
              }}>Qty</th>
              <th style={{ 
                textAlign: 'center', 
                padding: '12px 16px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151', 
                width: '10%',           // UNIT WIDTH - Further reduced from 12%
                minWidth: '70px'        // UNIT MIN WIDTH - Further reduced from 80px
              }}>Unit</th>
              <th style={{ 
                textAlign: 'right', 
                padding: '12px 16px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151', 
                width: '12%',           // RATE WIDTH - Further reduced from 15%
                minWidth: '80px'        // RATE MIN WIDTH - Further reduced from 90px
              }}>Rate</th>
              <th style={{ 
                textAlign: 'right', 
                padding: '12px 16px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151', 
                width: '18%',           // AMOUNT WIDTH - Adjust this percentage
                minWidth: '100px'       // AMOUNT MIN WIDTH - Adjust this value
              }}>Amount</th>
              <th style={{ 
                textAlign: 'center', 
                padding: '12px 16px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151', 
                width: '7%',            // ACTION WIDTH - Adjust this percentage
                minWidth: '60px'        // ACTION MIN WIDTH - Adjust this value
              }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ 
                  padding: '12px 16px',     // DESCRIPTION CELL PADDING - Adjust these values
                  width: '35%',             // DESCRIPTION CELL WIDTH - Match header width
                  minWidth: '200px'         // DESCRIPTION CELL MIN WIDTH - Match header min width
                }}>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Product description"
                    style={{
                      width: '280px',       // INPUT CONTAINER WIDTH - Increased to match column width
                      position: 'relative', // REQUIRED for left positioning to work
                      left: '0px',        // INPUT CONTAINER POSITION FROM LEFT - Adjust this value (0px, 10px, 20px, etc.)
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '16px',  // INPUT TEXT PADDING FROM LEFT - Adjust this value
                      paddingRight: '16px', // INPUT TEXT PADDING FROM RIGHT - Adjust this value
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </td>
                <td style={{ 
                  padding: '12px 16px',     // QTY CELL PADDING - Adjust these values
                  textAlign: 'center',
                  width: '12%',             // QTY CELL WIDTH - Match header width
                  minWidth: '80px'          // QTY CELL MIN WIDTH - Match header min width
                }}>
                  <input
                    type="text"
                    value={item.quantity || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*$/.test(value)) {
                        updateItem(item.id, 'quantity', parseInt(value) || 0);
                      }
                    }}
                    style={{
                      width: '80px',        // QTY INPUT CONTAINER WIDTH - Adjust this value
                      position: 'relative', // REQUIRED for left positioning to work
                      left: '12px',         // QTY INPUT CONTAINER POSITION FROM LEFT - Adjust this value (0px, 5px, 10px, etc.)
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '16px',  // QTY INPUT TEXT PADDING FROM LEFT - Adjust this value
                      paddingRight: '16px', // QTY INPUT TEXT PADDING FROM RIGHT - Adjust this value
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </td>
                <td style={{ 
                  padding: '12px 16px',     // UNIT CELL PADDING - Adjust these values
                  textAlign: 'center',
                  width: '10%',             // UNIT CELL WIDTH - Match header width
                  minWidth: '70px'          // UNIT CELL MIN WIDTH - Match header min width
                }}>
                  <input
                    type="text"
                    value={item.unit || ''}
                    onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                    placeholder="pcs"
                    style={{
                      width: '100px',       // UNIT INPUT CONTAINER WIDTH - Adjust this value
                      position: 'relative', // REQUIRED for left positioning to work
                      left: '12px',         // UNIT INPUT CONTAINER POSITION FROM LEFT - Adjust this value (0px, 5px, 10px, etc.)
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '16px',  // UNIT INPUT TEXT PADDING FROM LEFT - Adjust this value
                      paddingRight: '16px', // UNIT INPUT TEXT PADDING FROM RIGHT - Adjust this value
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </td>
                <td style={{ 
                  padding: '12px 16px',     // RATE CELL PADDING - Adjust these values
                  textAlign: 'right',
                  width: '12%',             // RATE CELL WIDTH - Match header width
                  minWidth: '80px'         // RATE CELL MIN WIDTH - Match header min width
                }}>
                  <input
                    type="text"
                    value={item.rate || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        updateItem(item.id, 'rate', parseFloat(value) || 0);
                      }
                    }}
                    style={{
                      width: '100px',       // RATE INPUT CONTAINER WIDTH - Adjust this value
                      position: 'relative', // REQUIRED for left positioning to work
                      left: '45px',         // RATE INPUT CONTAINER POSITION FROM LEFT - Adjust this value (0px, 5px, 10px, etc.)
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '16px',  // RATE INPUT TEXT PADDING FROM LEFT - Adjust this value
                      paddingRight: '16px', // RATE INPUT TEXT PADDING FROM RIGHT - Adjust this value
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                  />
                </td>
                <td style={{ 
                  padding: '12px 16px',     // AMOUNT CELL PADDING - Adjust these values
                  textAlign: 'right', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#1f2937',
                  width: '18%',             // AMOUNT CELL WIDTH - Match header width
                  minWidth: '100px'         // AMOUNT CELL MIN WIDTH - Match header min width
                }}>
                  {formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}
                </td>
                <td style={{ 
                  padding: '12px 16px',     // ACTION CELL PADDING - Adjust these values
                  textAlign: 'center',
                  width: '7%',              // ACTION CELL WIDTH - Match header width
                  minWidth: '60px'          // ACTION CELL MIN WIDTH - Match header min width
                }}>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        padding: '6px',
                        backgroundColor: '#fef2f2',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
          Additional Notes
        </h4>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Add any additional notes or terms..."
          style={{
            ...inputStyle(),
            minHeight: '100px',
            resize: 'vertical'
          }}
        />
      </div>
    </div>
  );

  const renderMinimalTemplate = () => (
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
          <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.companyName}</p>
          {generatedInvoice.companyAddress && generatedInvoice.companyAddress.trim() && (
            <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.companyAddress}</p>
          )}
          {generatedInvoice.companyEmail && generatedInvoice.companyEmail.trim() && (
            <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.companyEmail}</p>
          )}
          {generatedInvoice.companyPhone && generatedInvoice.companyPhone.trim() && (
            <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.companyPhone}</p>
          )}
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold' }}>TO</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.clientName}</p>
          {generatedInvoice.clientAddress && generatedInvoice.clientAddress.trim() && (
            <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.clientAddress}</p>
          )}
          {generatedInvoice.clientEmail && generatedInvoice.clientEmail.trim() && (
            <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.clientEmail}</p>
          )}
          {generatedInvoice.clientPhone && generatedInvoice.clientPhone.trim() && (
            <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.clientPhone}</p>
          )}
        </div>
      </div>

      {/* Simple Items List */}
      <div style={{ marginBottom: '40px' }}>
        {generatedInvoice.items.map((item: any, index: number) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: index < generatedInvoice.items.length - 1 ? '1px solid #eee' : 'none'
          }}>
            <div>
              <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: 'bold' }}>{item.description}</p>
              <p style={{ margin: '0', fontSize: '10px', color: '#666' }}>{item.quantity} × {formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</p>
            </div>
            <p style={{ margin: '0', fontSize: '11px', fontWeight: 'bold' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</p>
          </div>
        ))}
      </div>

      {/* Simple Totals */}
      <div style={{ 
        borderTop: '1px solid #000',
        paddingTop: '20px',
        textAlign: 'right'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>
          <span>Subtotal</span>
          <span>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>
          <span>Discount ({generatedInvoice.discount}%)</span>
          <span>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>
          <span>Tax ({generatedInvoice.taxRate}%)</span>
          <span>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '16px',
          fontWeight: 'bold',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          marginTop: '10px'
        }}>
          <span>TOTAL</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#495057', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '11px', 
            color: '#6c757d', 
            margin: 0,
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderModernTemplate = () => (
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
          <p style={{ fontSize: '12px', margin: 0, color: '#666' }}>{generatedInvoice.companyName}</p>
        </div>
        <div style={{ 
          flex: 1, 
          textAlign: 'right',
          paddingLeft: '20px',
          borderLeft: '3px solid #000'
        }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>#{generatedInvoice.invoiceNumber}</p>
          <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>{generatedInvoice.date}</p>
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
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.companyName}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.companyEmail}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.companyPhone}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.companyAddress}</p>
        </div>
        <div>
          <h3 style={{ fontSize: '12px', color: '#000', margin: '0 0 10px 0', fontWeight: 'bold' }}>BILL TO</h3>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientName}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientEmail}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientPhone}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientAddress}</p>
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
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>
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
          {generatedInvoice.items.map((item: any, index: number) => (
            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px', border: 'none' }}>{item.description}</td>
              <td style={{ padding: '12px', textAlign: 'center', border: 'none' }}>{item.quantity}</td>
              <td style={{ padding: '12px', textAlign: 'right', border: 'none' }}>{formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</td>
              <td style={{ padding: '12px', textAlign: 'right', border: 'none' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</td>
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
            <span style={{ fontSize: '11px' }}>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
        </div>
      <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid #eee'
          }}>
            <span style={{ fontSize: '11px' }}>Discount ({generatedInvoice.discountRate}%):</span>
            <span style={{ fontSize: '11px' }}>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
        </div>
      <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid #eee'
          }}>
            <span style={{ fontSize: '11px' }}>Tax ({generatedInvoice.taxRate}%):</span>
            <span style={{ fontSize: '11px' }}>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
        </div>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '4px',
          border: '1px solid #eee'
        }}>
          <h4 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#666', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '11px', 
            color: '#666', 
            margin: 0,
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderClassicTemplate = () => (
    <div style={{ 
      fontFamily: 'Times New Roman, serif', 
      fontSize: '12px',
      lineHeight: '1.4',
      color: '#000',
      backgroundColor: '#fff',
      padding: '30px',
      maxWidth: '500px',
      margin: '0 auto',
      border: '2px solid #000',
      borderRadius: '0px'
    }}>
      {/* Classic Header */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '40px',
        borderBottom: '2px solid #000',
        paddingBottom: '20px'
      }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: '#000',
          margin: '0 0 10px 0',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          INVOICE
        </h1>
        <p style={{ fontSize: '14px', margin: 0, fontWeight: 'bold' }}>{generatedInvoice.companyName}</p>
      </div>

      {/* Classic Details */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '30px'
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Bill From:</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.companyName}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.companyEmail}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.companyPhone}</p>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Bill To:</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.clientName}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.clientEmail}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px' }}>{generatedInvoice.clientPhone}</p>
        </div>
      </div>

      {/* Classic Items */}
      <div style={{ marginBottom: '30px' }}>
        {generatedInvoice.items.map((item: any, index: number) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #000'
          }}>
            <div>
              <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: 'bold' }}>{item.description}</p>
              <p style={{ margin: '0', fontSize: '10px', color: '#666' }}>{item.quantity} × {formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</p>
            </div>
            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</p>
          </div>
        ))}
      </div>

      {/* Classic Totals */}
      <div style={{ 
        borderTop: '2px solid #000',
        paddingTop: '20px',
        textAlign: 'right'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '16px',
          fontWeight: 'bold',
          padding: '15px',
          backgroundColor: '#000',
          color: '#fff',
          marginTop: '10px'
        }}>
          <span>TOTAL AMOUNT</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '0px',
          border: '2px solid #000'
        }}>
          <h4 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#000', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '11px', 
            color: '#000', 
            margin: 0,
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );

  // Other templates fall back to minimal for now
  const renderCreativeTemplate = () => (
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
          <p style={{ fontSize: '11px', margin: 0, color: '#666' }}>{generatedInvoice.companyName}</p>
          <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{generatedInvoice.companyEmail}</p>
          <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{generatedInvoice.companyPhone}</p>
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
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientName}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientEmail}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientPhone}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientAddress}</p>
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
            <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> {generatedInvoice.invoiceNumber}</p>
            <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Date:</strong> {generatedInvoice.date}</p>
            <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due:</strong> {generatedInvoice.dueDate}</p>
        </div>
        </div>
      </div>

      {/* Creative Services - Card Style */}
      <div style={{ marginBottom: '25px' }}>
        {generatedInvoice.items.map((item: any, index: number) => (
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
              <p style={{ margin: '0', fontSize: '10px', color: '#666' }}>{item.quantity} × {formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</p>
        </div>
            <div style={{ 
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: '#fff',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 'bold'
            }}>
              {formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}
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
          <span>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '11px'
        }}>
          <span>Discount ({generatedInvoice.discountRate}%)</span>
          <span>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '11px'
        }}>
          <span>Tax ({generatedInvoice.taxRate}%)</span>
          <span>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '0px',
          border: '2px solid #000'
        }}>
          <h4 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#000', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '11px', 
            color: '#000', 
            margin: 0,
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );
  const renderProfessionalTemplate = () => (
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
          <p style={{ fontSize: '11px', margin: 0, color: '#666' }}>{generatedInvoice.companyName}</p>
          <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{generatedInvoice.companyEmail}</p>
          <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{generatedInvoice.companyPhone}</p>
          <p style={{ fontSize: '10px', margin: '5px 0 0 0', color: '#666' }}>{generatedInvoice.companyAddress}</p>
        </div>
        <div style={{ 
          textAlign: 'right',
          padding: '15px',
          backgroundColor: '#f8f8f8',
          border: '2px solid #000'
        }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>INVOICE</p>
          <p style={{ margin: '0', fontSize: '11px' }}>#{generatedInvoice.invoiceNumber}</p>
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
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.companyName}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.companyEmail}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.companyPhone}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.companyAddress}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>Tax ID: 12-3456789</p>
        </div>
        <div>
          <h3 style={{ fontSize: '12px', color: '#000', margin: '0 0 10px 0', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '5px' }}>BILL TO</h3>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientName}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientEmail}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientPhone}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientAddress}</p>
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
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.date}</p>
        </div>
        <div>
          <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 'bold' }}>Due Date:</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.dueDate}</p>
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
          {generatedInvoice.items.map((item: any, index: number) => (
            <tr key={index} style={{ borderBottom: '1px solid #000' }}>
              <td style={{ padding: '12px', border: '1px solid #000' }}>{item.description}</td>
              <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #000' }}>{item.quantity}</td>
              <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>{formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</td>
              <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</td>
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
            <span style={{ fontSize: '11px' }}>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
        </div>
      <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid #000'
          }}>
            <span style={{ fontSize: '11px' }}>Discount ({generatedInvoice.discountRate}%):</span>
            <span style={{ fontSize: '11px' }}>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
        </div>
      <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid #000'
          }}>
            <span style={{ fontSize: '11px' }}>Tax ({generatedInvoice.taxRate}%):</span>
            <span style={{ fontSize: '11px' }}>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
        </div>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '0px',
          border: '2px solid #000'
        }}>
          <h4 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#000', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '11px', 
            color: '#000', 
            margin: 0,
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderElegantTemplate = () => (
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
          {generatedInvoice.companyName}
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
          <p style={{ margin: '3px 0', fontSize: '11px' }}>{generatedInvoice.companyName}</p>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>{generatedInvoice.companyEmail}</p>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>{generatedInvoice.companyPhone}</p>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>{generatedInvoice.companyAddress}</p>
        </div>
        <div style={{ flex: 1, paddingLeft: '20px', borderLeft: '1px solid #000' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 15px 0', color: '#000', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Bill To</h3>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>{generatedInvoice.clientName}</p>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>{generatedInvoice.clientEmail}</p>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>{generatedInvoice.clientPhone}</p>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>{generatedInvoice.clientAddress}</p>
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
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> {generatedInvoice.invoiceNumber}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Date:</strong> {generatedInvoice.date}</p>
        </div>
        <div>
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Terms:</strong> Net 30</p>
        </div>
      </div>

      {/* Elegant Services List */}
      <div style={{ marginBottom: '30px' }}>
        {generatedInvoice.items.map((item: any, index: number) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 0',
            borderBottom: index < generatedInvoice.items.length - 1 ? '1px solid #eee' : 'none'
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold' }}>{item.description}</p>
              <p style={{ margin: '0', fontSize: '10px', color: '#666', fontStyle: 'italic' }}>{item.quantity} hours at {formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}/hour</p>
            </div>
            <div style={{ textAlign: 'right', minWidth: '80px' }}>
              <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</p>
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
          <span>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '10px',
          fontSize: '12px'
        }}>
          <span>Discount ({generatedInvoice.discountRate}%):</span>
          <span>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '15px',
          fontSize: '12px'
        }}>
          <span>Tax ({generatedInvoice.taxRate}%):</span>
          <span>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '0px',
          border: '1px solid #000'
        }}>
          <h4 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#000', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '11px', 
            color: '#000', 
            margin: 0,
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderCorporateTemplate = () => (
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
            {generatedInvoice.companyName}
        </h1>
          <p style={{ fontSize: '10px', margin: '0', color: '#666' }}>{generatedInvoice.companyAddress}</p>
          <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{generatedInvoice.companyEmail}</p>
          <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>{generatedInvoice.companyPhone}</p>
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
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> {generatedInvoice.invoiceNumber}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Date:</strong> {generatedInvoice.date}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due:</strong> {generatedInvoice.dueDate}</p>
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
            <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Client Name:</strong> {generatedInvoice.clientName}</p>
            <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Email:</strong> {generatedInvoice.clientEmail}</p>
            <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Phone:</strong> {generatedInvoice.clientPhone}</p>
            <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Address:</strong> {generatedInvoice.clientAddress}</p>
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
          {generatedInvoice.items.map((item: any, index: number) => (
            <tr key={index} style={{ borderBottom: '1px solid #000' }}>
              <td style={{ padding: '15px', border: '1px solid #000' }}>{item.description}</td>
              <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #000' }}>{item.quantity}</td>
              <td style={{ padding: '15px', textAlign: 'right', border: '1px solid #000' }}>{formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</td>
              <td style={{ padding: '15px', textAlign: 'right', border: '1px solid #000' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</td>
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
            <span style={{ fontSize: '12px' }}>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
        </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #000'
          }}>
            <span style={{ fontSize: '12px' }}>Discount ({generatedInvoice.discountRate}%):</span>
            <span style={{ fontSize: '12px' }}>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #000'
          }}>
            <span style={{ fontSize: '12px' }}>Tax ({generatedInvoice.taxRate}%):</span>
            <span style={{ fontSize: '12px' }}>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '0px',
          border: '1px solid #000'
        }}>
          <h4 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#000', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '11px', 
            color: '#000', 
            margin: 0,
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderGeometricTemplate = () => (
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
            <p style={{ fontSize: '11px', margin: 0, color: '#666' }}>{generatedInvoice.companyName}</p>
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
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.companyName}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.companyAddress}</p>
        </div>
        <div>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: 'var(--mc-sidebar-bg)',
            marginBottom: '10px'
          }}></div>
          <h3 style={{ fontSize: '11px', margin: '0 0 8px 0', color: '#000', fontWeight: 'bold', textTransform: 'uppercase' }}>To</h3>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientName}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}>{generatedInvoice.clientAddress}</p>
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
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Invoice #:</strong> {generatedInvoice.invoiceNumber}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Date:</strong> {generatedInvoice.date}</p>
        </div>
        <div>
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Due:</strong> {generatedInvoice.dueDate}</p>
          <p style={{ margin: '2px 0', fontSize: '11px' }}><strong>Amount:</strong> {formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</p>
        </div>
      </div>

      {/* Geometric Services */}
      <div style={{ marginBottom: '25px' }}>
        {generatedInvoice.items.map((item: any, index: number) => (
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
                <p style={{ margin: '0', fontSize: '10px', color: '#666' }}>{item.quantity} × {formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</p>
              </div>
            </div>
            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</p>
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
          <span>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '11px'
        }}>
          <span>Discount ({generatedInvoice.discountRate}%)</span>
          <span>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '11px'
        }}>
          <span>Tax ({generatedInvoice.taxRate}%)</span>
          <span>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '0px',
          border: '2px solid #000'
        }}>
          <h4 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#000', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '11px', 
            color: '#000', 
            margin: 0,
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderTypographyTemplate = () => (
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
        <p style={{ fontSize: '12px', margin: 0, color: '#000', fontWeight: '300' }}>{generatedInvoice.companyName}</p>
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
          <p style={{ margin: '5px 0', fontSize: '11px', lineHeight: '1.8' }}>{generatedInvoice.companyName}</p>
          <p style={{ margin: '5px 0', fontSize: '11px', lineHeight: '1.8' }}>{generatedInvoice.companyAddress}</p>
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
          <p style={{ margin: '5px 0', fontSize: '11px', lineHeight: '1.8' }}>{generatedInvoice.clientName}</p>
          <p style={{ margin: '5px 0', fontSize: '11px', lineHeight: '1.8' }}>{generatedInvoice.clientAddress}</p>
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
            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>{generatedInvoice.invoiceNumber}</p>
        </div>
        <div>
            <h3 style={{ fontSize: '10px', margin: '0 0 5px 0', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Invoice Date</h3>
            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>{generatedInvoice.date}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '10px', margin: '0 0 5px 0', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Due Date</h3>
            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>{generatedInvoice.dueDate}</p>
          </div>
        </div>
      </div>

      {/* Typography Services */}
      <div style={{ marginBottom: '35px' }}>
        {generatedInvoice.items.map((item: any, index: number) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '20px 0',
            borderBottom: index < generatedInvoice.items.length - 1 ? '1px solid #eee' : 'none'
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
                {item.quantity} hours × {formatInvoiceCurrency(item.rate, generatedInvoice?.currency)} per hour
              </p>
            </div>
            <div style={{ textAlign: 'right', minWidth: '100px' }}>
              <p style={{ 
                margin: '0', 
                fontSize: '14px', 
                fontWeight: '300',
                letterSpacing: '1px'
              }}>
                {formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}
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
          <span>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '12px',
          fontSize: '12px',
          fontWeight: '300'
        }}>
          <span>Discount ({generatedInvoice.discountRate}%)</span>
          <span>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '20px',
          fontSize: '12px',
          fontWeight: '300'
        }}>
          <span>Tax ({generatedInvoice.taxRate}%)</span>
          <span>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '0px',
          border: '1px solid #000'
        }}>
          <h4 style={{ 
            fontSize: '12px', 
            fontWeight: '300', 
            color: '#000', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '11px', 
            color: '#000', 
            margin: 0,
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            fontWeight: '300'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderGridTemplate = () => (
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
            {generatedInvoice.companyName}
          </h1>
          <p style={{ fontSize: '10px', margin: '0', color: '#666' }}>{generatedInvoice.companyAddress}</p>
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
            <span style={{ fontSize: '10px' }}>{generatedInvoice.invoiceNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold' }}>DATE:</span>
            <span style={{ fontSize: '10px' }}>{generatedInvoice.date}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold' }}>DUE:</span>
            <span style={{ fontSize: '10px' }}>{generatedInvoice.dueDate}</span>
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
          <p style={{ margin: '3px 0', fontSize: '10px' }}>{generatedInvoice.companyName}</p>
          <p style={{ margin: '3px 0', fontSize: '10px' }}>{generatedInvoice.companyAddress}</p>
        </div>
        <div>
          <h3 style={{ fontSize: '11px', margin: '0 0 10px 0', color: '#000', fontWeight: 'bold', textTransform: 'uppercase' }}>Bill To</h3>
          <p style={{ margin: '3px 0', fontSize: '10px' }}>{generatedInvoice.clientName}</p>
          <p style={{ margin: '3px 0', fontSize: '10px' }}>{generatedInvoice.clientAddress}</p>
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
            {generatedInvoice.items.map((item: any, index: number) => (
              <tr key={index} style={{ borderBottom: '1px solid #000' }}>
                <td style={{ padding: '12px', border: '1px solid #000' }}>{item.description}</td>
                <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #000' }}>{item.quantity}</td>
                <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>{formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</td>
                <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #000' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</td>
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
            <span>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
        </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '11px'
          }}>
            <span>Discount ({generatedInvoice.discountRate}%):</span>
            <span>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
      </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '15px',
            fontSize: '11px'
          }}>
            <span>Tax ({generatedInvoice.taxRate}%):</span>
            <span>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '0px',
          border: '1px solid #000'
        }}>
          <h4 style={{ 
            fontSize: '11px', 
            fontWeight: 'bold', 
            color: '#000', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '10px', 
            color: '#000', 
            margin: 0,
            lineHeight: '1.4',
            whiteSpace: 'pre-wrap'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderMinimalGreyTemplate = () => (
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
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyName}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyEmail}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyPhone}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyAddress}</p>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>TO</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientName}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientEmail}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientPhone}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientAddress}</p>
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
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Invoice #:</strong> {generatedInvoice.invoiceNumber}</p>
          <p style={{ margin: '0', fontSize: '11px', color: '#666' }}><strong>Date:</strong> {generatedInvoice.date}</p>
        </div>
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>
          <p style={{ margin: '0', fontSize: '11px', color: '#666' }}><strong>Amount:</strong> {formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</p>
        </div>
      </div>

      {/* Services - Clean List */}
      <div style={{ marginBottom: '30px' }}>
        {generatedInvoice.items.map((item: any, index: number) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: index < generatedInvoice.items.length - 1 ? '1px solid #eee' : 'none'
          }}>
            <div>
              <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>{item.description}</p>
              <p style={{ margin: '0', fontSize: '10px', color: '#999' }}>{item.quantity} hours × {formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}/hr</p>
            </div>
            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</p>
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
          <span>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '11px',
          color: '#666'
        }}>
          <span>Discount ({generatedInvoice.discountRate}%):</span>
          <span>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '11px',
          color: '#666'
        }}>
          <span>Tax ({generatedInvoice.taxRate}%):</span>
          <span>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '8px',
          border: '1px solid #999'
        }}>
          <h4 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#666', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '11px', 
            color: '#666', 
            margin: 0,
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderMinimalLeftTemplate = () => (
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
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyName}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyAddress}</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>TO</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientName}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientAddress}</p>
        </div>
      </div>

      {/* Invoice Details - Vertical */}
      <div style={{ 
        marginBottom: '30px',
        padding: '15px 0',
        borderTop: '1px solid #999',
        borderBottom: '1px solid #999'
      }}>
        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Invoice #:</strong> {generatedInvoice.invoiceNumber}</p>
        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Date:</strong> {generatedInvoice.date}</p>
        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>
        <p style={{ margin: '0', fontSize: '11px', color: '#666' }}><strong>Amount:</strong> {formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</p>
      </div>

      {/* Services - Clean List */}
      <div style={{ marginBottom: '30px' }}>
        {generatedInvoice.items.map((item: any, index: number) => (
          <div key={index} style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: index < generatedInvoice.items.length - 1 ? '1px solid #eee' : 'none'
          }}>
            <div>
              <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>{item.description}</p>
              <p style={{ margin: '0', fontSize: '10px', color: '#999' }}>{item.quantity} hours × {formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}/hr</p>
            </div>
            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</p>
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
          <span>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '11px',
          color: '#666'
        }}>
          <span>Discount ({generatedInvoice.discountRate}%):</span>
          <span>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '11px',
          color: '#666'
        }}>
          <span>Tax ({generatedInvoice.taxRate}%):</span>
          <span>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
        </div>
      </div>

      {/* Notes Section */}
      {generatedInvoice.notes && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '8px',
          border: '1px solid #999'
        }}>
          <h4 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#666', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Notes
          </h4>
          <p style={{ 
            fontSize: '11px', 
            color: '#666', 
            margin: 0,
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {generatedInvoice.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderServicesTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Receipt size={16} />
          Invoice Services
        </h3>
        <button
          onClick={addService}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Description</th>
              <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151', width: '80px' }}>Qty</th>
              <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151', width: '100px' }}>Unit</th>
              <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151', width: '120px' }}>Rate</th>
              <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151', width: '120px' }}>Amount</th>
              <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151', width: '60px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 16px' }}>
                  <input
                    type="text"
                    value={service.description}
                    onChange={(e) => updateService(service.id, 'description', e.target.value)}
                    placeholder="Service description"
                    style={{
                      width: '100%',        // DESCRIPTION INPUT CONTAINER WIDTH - Adjust this value
                      marginLeft: '0px',    // DESCRIPTION INPUT CONTAINER POSITION FROM LEFT - Adjust this value (0px, 10px, 20px, etc.)
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '16px',  // DESCRIPTION INPUT TEXT PADDING FROM LEFT - Adjust this value
                      paddingRight: '16px', // DESCRIPTION INPUT TEXT PADDING FROM RIGHT - Adjust this value
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <input
                    type="text"
                    value={service.quantity || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        updateService(service.id, 'quantity', parseFloat(value) || 0);
                      }
                    }}
                    style={{
                      width: '60px',        // QTY INPUT CONTAINER WIDTH - Adjust this value
                      marginLeft: '12px',   // QTY INPUT CONTAINER POSITION FROM LEFT - Adjust this value (0px, 5px, 10px, etc.)
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '16px',  // QTY INPUT TEXT PADDING FROM LEFT - Adjust this value
                      paddingRight: '16px', // QTY INPUT TEXT PADDING FROM RIGHT - Adjust this value
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <input
                    type="text"
                    value={service.unit}
                    onChange={(e) => updateService(service.id, 'unit', e.target.value)}
                    placeholder="hours"
                    style={{
                      width: '80px',        // UNIT INPUT CONTAINER WIDTH - Adjust this value
                      marginLeft: '12px',   // UNIT INPUT CONTAINER POSITION FROM LEFT - Adjust this value (0px, 5px, 10px, etc.)
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '16px',  // UNIT INPUT TEXT PADDING FROM LEFT - Adjust this value
                      paddingRight: '16px', // UNIT INPUT TEXT PADDING FROM RIGHT - Adjust this value
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <input
                    type="text"
                    value={service.rate || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        updateService(service.id, 'rate', parseFloat(value) || 0);
                      }
                    }}
                    style={{
                      width: '100px',       // RATE INPUT CONTAINER WIDTH - Adjust this value
                      position: 'relative', // REQUIRED for left positioning to work
                      left: '45px',        // RATE INPUT CONTAINER POSITION FROM LEFT - Adjust this value (0px, 5px, 10px, etc.)
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '16px',  // RATE INPUT TEXT PADDING FROM LEFT - Adjust this value
                      paddingRight: '16px', // RATE INPUT TEXT PADDING FROM RIGHT - Adjust this value
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                  />
                </td>
                <td style={{ 
                  padding: '12px 16px', 
                  textAlign: 'right', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#1f2937'
                }}>
                  ${service.amount.toFixed(2)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  {services.length > 1 && (
                    <button
                      onClick={() => removeService(service.id)}
                      style={{
                        padding: '6px',
                        backgroundColor: '#fef2f2',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
          Additional Notes
        </h4>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Add any additional notes or terms..."
          style={{
            ...inputStyle(),
            minHeight: '100px',
            resize: 'vertical'
          }}
        />
      </div>
    </div>
  );

  const renderSummaryTab = () => (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DollarSign size={16} />
        Invoice Summary
      </h3>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Subtotal</span>
          <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{formatInvoiceCurrency(subtotal)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Discount</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={formData.discount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setFormData({...formData, discount: value});
                }
              }}
              style={{
                width: '80px',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>%</span>
            <span style={{ fontSize: '14px', color: '#ef4444', fontWeight: '500' }}>-{formatInvoiceCurrency(discountAmount)}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Tax</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={formData.taxRate}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setFormData({...formData, taxRate: value});
                }
              }}
              style={{
                width: '80px',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>%</span>
            <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{formatInvoiceCurrency(taxAmount)}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid #e5e7eb' }}>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Total</span>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>{formatInvoiceCurrency(total)}</span>
        </div>
      </div>

    </div>
  );

  const renderInvoiceTab = () => {
    if (!generatedInvoice) {
      return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Receipt size={16} />
        Invoice Preview
      </h3>
      
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#f9fafb', 
        borderRadius: '20px', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <Receipt size={48} color="#9ca3af" />
          <p style={{ marginTop: '16px', fontSize: '16px', color: '#6b7280' }}>
            Invoice preview will appear here
          </p>
          <p style={{ marginTop: '8px', fontSize: '14px', color: '#9ca3af' }}>
            Generate invoice first to see preview
          </p>
        </div>
      </div>
    </div>
  );
    }

    // Placeholder functions for remaining templates - will implement them
    const renderMinimalCompactTemplate = () => (
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
            <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}>{generatedInvoice.companyName || 'Your Company Name'}</p>
            {generatedInvoice.companyAddress && generatedInvoice.companyAddress.trim() && (
              <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}>{generatedInvoice.companyAddress}</p>
            )}
            {generatedInvoice.companyEmail && generatedInvoice.companyEmail.trim() && (
              <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}>{generatedInvoice.companyEmail}</p>
            )}
            {generatedInvoice.companyPhone && generatedInvoice.companyPhone.trim() && (
              <p style={{ margin: '0', fontSize: '10px', color: '#666' }}>{generatedInvoice.companyPhone}</p>
            )}
          </div>
          <div>
            <p style={{ margin: '0 0 6px 0', fontSize: '10px', fontWeight: 'bold', color: '#666' }}>TO</p>
            <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}>{generatedInvoice.clientName}</p>
            <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}>{generatedInvoice.clientAddress}</p>
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
              <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}><strong>Invoice #:</strong> {generatedInvoice.invoiceNumber}</p>
              <p style={{ margin: '0', fontSize: '10px', color: '#666' }}><strong>Date:</strong> {generatedInvoice.date}</p>
          </div>
          <div>
              <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#666' }}><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>
              <p style={{ margin: '0', fontSize: '10px', color: '#666' }}><strong>Amount:</strong> {formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</p>
            </div>
          </div>
        </div>

        {/* Compact Services */}
        <div style={{ marginBottom: '25px' }}>
          {generatedInvoice.items.map((item: any, index: number) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: index < generatedInvoice.items.length - 1 ? '1px solid #eee' : 'none'
            }}>
              <div>
                <p style={{ margin: '0 0 2px 0', fontSize: '10px', fontWeight: 'bold', color: '#666' }}>{item.description}</p>
                <p style={{ margin: '0', fontSize: '9px', color: '#999' }}>{item.quantity} hours × {formatInvoiceCurrency(item.rate, generatedInvoice.currency)}/hr</p>
              </div>
              <p style={{ margin: '0', fontSize: '10px', fontWeight: 'bold', color: '#666' }}>{formatInvoiceCurrency(item.amount, generatedInvoice.currency)}</p>
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
            <span>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '6px',
            fontSize: '10px',
            color: '#666'
          }}>
            <span>Discount ({generatedInvoice.discountRate}%):</span>
            <span>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '6px',
            fontSize: '10px',
            color: '#666'
          }}>
            <span>Tax ({generatedInvoice.taxRate}%):</span>
            <span>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
          </div>
        </div>

        {/* Notes Section */}
        {generatedInvoice.notes && (
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f8f8',
            borderRadius: '4px',
            border: '1px solid #999'
          }}>
            <h4 style={{ 
              fontSize: '10px', 
              fontWeight: 'bold', 
              color: '#666', 
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Notes
            </h4>
            <p style={{ 
              fontSize: '9px', 
              color: '#666', 
              margin: 0,
              lineHeight: '1.4',
              whiteSpace: 'pre-wrap'
            }}>
              {generatedInvoice.notes}
            </p>
          </div>
        )}
      </div>
    );
    const renderMinimalSpacedTemplate = () => (
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
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}>{generatedInvoice.companyName}</p>
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}>{generatedInvoice.companyAddress}</p>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>TO</p>
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}>{generatedInvoice.clientName}</p>
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}>{generatedInvoice.clientAddress}</p>
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
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}><strong>Invoice #:</strong> {generatedInvoice.invoiceNumber}</p>
            <p style={{ margin: '0', fontSize: '12px', color: '#666' }}><strong>Date:</strong> {generatedInvoice.date}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>
            <p style={{ margin: '0', fontSize: '12px', color: '#666' }}><strong>Amount:</strong> {formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</p>
          </div>
        </div>

        {/* Spaced Services */}
        <div style={{ marginBottom: '40px' }}>
          {generatedInvoice.items.map((item: any, index: number) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '15px 0',
              borderBottom: index < generatedInvoice.items.length - 1 ? '1px solid #eee' : 'none'
            }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>{item.description}</p>
                <p style={{ margin: '0', fontSize: '11px', color: '#999' }}>{item.quantity} hours × {formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}/hr</p>
              </div>
              <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</p>
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
            <span>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '12px',
            color: '#666'
          }}>
            <span>Discount ({generatedInvoice.discountRate}%):</span>
            <span>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '12px',
            color: '#666'
          }}>
            <span>Tax ({generatedInvoice.taxRate}%):</span>
            <span>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
          </div>
        </div>

        {/* Notes Section */}
        {generatedInvoice.notes && (
          <div style={{ 
            marginTop: '40px',
            padding: '25px',
            backgroundColor: '#f8f8f8',
            borderRadius: '8px',
            border: '1px solid #999'
          }}>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              color: '#666', 
              margin: '0 0 15px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Notes
            </h4>
            <p style={{ 
              fontSize: '11px', 
              color: '#666', 
              margin: 0,
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap'
            }}>
              {generatedInvoice.notes}
            </p>
          </div>
        )}
      </div>
    );
    const renderMinimalCardTemplate = () => (
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
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyName}</p>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyAddress}</p>
          </div>
          <div style={{ 
            padding: '15px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #eee'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>TO</p>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientName}</p>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientAddress}</p>
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
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Invoice #:</strong> {generatedInvoice.invoiceNumber}</p>
              <p style={{ margin: '0', fontSize: '11px', color: '#666' }}><strong>Date:</strong> {generatedInvoice.date}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>
              <p style={{ margin: '0', fontSize: '11px', color: '#666' }}><strong>Amount:</strong> {formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</p>
            </div>
          </div>
        </div>

        {/* Card Services */}
        <div style={{ marginBottom: '30px' }}>
          {generatedInvoice.items.map((item: any, index: number) => (
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
                <p style={{ margin: '0', fontSize: '10px', color: '#999' }}>{item.quantity} hours × {formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}/hr</p>
              </div>
              <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</p>
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
            <span>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '11px',
            color: '#666'
          }}>
            <span>Discount ({generatedInvoice.discountRate}%):</span>
            <span>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '11px',
            color: '#666'
          }}>
            <span>Tax ({generatedInvoice.taxRate}%):</span>
            <span>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
          </div>
        </div>

        {/* Notes Section */}
        {generatedInvoice.notes && (
          <div style={{ 
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #eee'
          }}>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              color: '#666', 
              margin: '0 0 10px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Notes
            </h4>
            <p style={{ 
              fontSize: '11px', 
              color: '#666', 
              margin: 0,
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}>
              {generatedInvoice.notes}
            </p>
          </div>
        )}
      </div>
    );
    const renderModernGreyTemplate = () => (
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
            <p style={{ fontSize: '12px', margin: 0, color: '#999' }}>{generatedInvoice.companyName}</p>
          </div>
          <div style={{ 
            flex: 1, 
            textAlign: 'right',
            paddingLeft: '20px',
            borderLeft: '3px solid #999'
          }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold', color: '#666' }}>#{generatedInvoice.invoiceNumber}</p>
            <p style={{ margin: '0', fontSize: '11px', color: '#999' }}>{generatedInvoice.date}</p>
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
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyName}</p>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyAddress}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontWeight: 'bold' }}>BILL TO</h3>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientName}</p>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientAddress}</p>
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
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>
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
            {generatedInvoice.items.map((item: any, index: number) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', border: 'none', color: '#666' }}>{item.description}</td>
                <td style={{ padding: '12px', textAlign: 'center', border: 'none', color: '#666' }}>{item.quantity}</td>
                <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#666' }}>{formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</td>
                <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</td>
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
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
          </div>
        <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontSize: '11px', color: '#666' }}>Discount ({generatedInvoice.discountRate}%):</span>
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
          </div>
        <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontSize: '11px', color: '#666' }}>Tax (10%):</span>
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
          </div>
          </div>
        </div>

        {/* Notes Section */}
        {generatedInvoice.notes && (
          <div style={{ 
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f8f8f8',
            borderRadius: '4px',
            border: '1px solid #eee'
          }}>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              color: '#666', 
              margin: '0 0 10px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Notes
            </h4>
            <p style={{ 
              fontSize: '11px', 
              color: '#666', 
              margin: 0,
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}>
              {generatedInvoice.notes}
            </p>
          </div>
        )}
      </div>
    );
    const renderModernVerticalTemplate = () => (
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
          <p style={{ fontSize: '12px', margin: '0 0 15px 0', color: '#999' }}>{generatedInvoice.companyName}</p>
          <div style={{ 
            display: 'flex',
            gap: '20px',
            padding: '10px 0',
            borderTop: '1px solid #999',
            borderBottom: '1px solid #999'
          }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Invoice #</p>
              <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>{generatedInvoice.invoiceNumber}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Date</p>
              <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>{generatedInvoice.date}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Due Date</p>
              <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>{generatedInvoice.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Vertical Layout */}
        <div style={{ 
          marginBottom: '30px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontWeight: 'bold' }}>FROM</h3>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyName}</p>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyAddress}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontWeight: 'bold' }}>BILL TO</h3>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientName}</p>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientAddress}</p>
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
            {generatedInvoice.items.map((item: any, index: number) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', border: 'none', color: '#666' }}>{item.description}</td>
                <td style={{ padding: '12px', textAlign: 'center', border: 'none', color: '#666' }}>{item.quantity}</td>
                <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#666' }}>{formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</td>
                <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</td>
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
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
          </div>
        <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontSize: '11px', color: '#666' }}>Discount ({generatedInvoice.discountRate}%):</span>
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
          </div>
        <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontSize: '11px', color: '#666' }}>Tax (10%):</span>
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
          </div>
          </div>
        </div>

        {/* Notes Section */}
        {generatedInvoice.notes && (
          <div style={{ 
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f8f8f8',
            borderRadius: '4px',
            border: '1px solid #eee'
          }}>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              color: '#666', 
              margin: '0 0 10px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Notes
            </h4>
            <p style={{ 
              fontSize: '11px', 
              color: '#666', 
              margin: 0,
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}>
              {generatedInvoice.notes}
            </p>
          </div>
        )}
      </div>
    );
    const renderModernCompactTemplate = () => (
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
            <p style={{ fontSize: '10px', margin: 0, color: '#999' }}>{generatedInvoice.companyName}</p>
          </div>
          <div style={{ 
            flex: 1, 
            textAlign: 'right',
            paddingLeft: '15px',
            borderLeft: '2px solid #999'
          }}>
            <p style={{ margin: '0 0 3px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>#{generatedInvoice.invoiceNumber}</p>
            <p style={{ margin: '0', fontSize: '10px', color: '#999' }}>{generatedInvoice.date}</p>
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
            <p style={{ margin: '1px 0', fontSize: '10px', color: '#666' }}>{generatedInvoice.companyName}</p>
            <p style={{ margin: '1px 0', fontSize: '10px', color: '#666' }}>{generatedInvoice.companyAddress}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '10px', color: '#666', margin: '0 0 6px 0', fontWeight: 'bold' }}>BILL TO</h3>
            <p style={{ margin: '1px 0', fontSize: '10px', color: '#666' }}>{generatedInvoice.clientName}</p>
            <p style={{ margin: '1px 0', fontSize: '10px', color: '#666' }}>{generatedInvoice.clientAddress}</p>
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
            <p style={{ margin: '1px 0', fontSize: '10px', color: '#666' }}><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>
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
            {generatedInvoice.items.map((item: any, index: number) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px', border: 'none', color: '#666' }}>{item.description}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: 'none', color: '#666' }}>{item.quantity}</td>
                <td style={{ padding: '8px', textAlign: 'right', border: 'none', color: '#666' }}>{formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</td>
                <td style={{ padding: '8px', textAlign: 'right', border: 'none', color: '#666' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</td>
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
              <span style={{ fontSize: '10px', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
          </div>
        <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontSize: '10px', color: '#666' }}>Discount ({generatedInvoice.discountRate}%):</span>
              <span style={{ fontSize: '10px', color: '#333', fontWeight: 'bold' }}>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
          </div>
        <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontSize: '10px', color: '#666' }}>Tax (10%):</span>
              <span style={{ fontSize: '10px', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
          </div>
          </div>
        </div>

        {/* Notes Section */}
        {generatedInvoice.notes && (
          <div style={{ 
            marginTop: '25px',
            padding: '15px',
            backgroundColor: '#f8f8f8',
            borderRadius: '4px',
            border: '1px solid #eee'
          }}>
            <h4 style={{ 
              fontSize: '10px', 
              fontWeight: 'bold', 
              color: '#666', 
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Notes
            </h4>
            <p style={{ 
              fontSize: '9px', 
              color: '#666', 
              margin: 0,
              lineHeight: '1.3',
              whiteSpace: 'pre-wrap'
            }}>
              {generatedInvoice.notes}
            </p>
          </div>
        )}
      </div>
    );
    const renderModernSpacedTemplate = () => (
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
            <p style={{ fontSize: '14px', margin: 0, color: '#999' }}>{generatedInvoice.companyName}</p>
          </div>
          <div style={{ 
            flex: 1, 
            textAlign: 'right',
            paddingLeft: '25px',
            borderLeft: '4px solid #999'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#666' }}>#{generatedInvoice.invoiceNumber}</p>
            <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>{generatedInvoice.date}</p>
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
            <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{generatedInvoice.companyName}</p>
            <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{generatedInvoice.companyAddress}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '14px', color: '#666', margin: '0 0 15px 0', fontWeight: 'bold' }}>BILL TO</h3>
            <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{generatedInvoice.clientName}</p>
            <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{generatedInvoice.clientAddress}</p>
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
            <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>
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
            {generatedInvoice.items.map((item: any, index: number) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px', border: 'none', color: '#666' }}>{item.description}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: 'none', color: '#666' }}>{item.quantity}</td>
                <td style={{ padding: '15px', textAlign: 'right', border: 'none', color: '#666' }}>{formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</td>
                <td style={{ padding: '15px', textAlign: 'right', border: 'none', color: '#666' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</td>
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
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
          </div>
        <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontSize: '12px', color: '#666' }}>Discount ({generatedInvoice.discountRate}%):</span>
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
          </div>
        <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontSize: '12px', color: '#666' }}>Tax (10%):</span>
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
          </div>
          </div>
        </div>

        {/* Notes Section */}
        {generatedInvoice.notes && (
          <div style={{ 
            marginTop: '40px',
            padding: '25px',
            backgroundColor: '#f8f8f8',
            borderRadius: '4px',
            border: '1px solid #eee'
          }}>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              color: '#666', 
              margin: '0 0 15px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Notes
            </h4>
            <p style={{ 
              fontSize: '11px', 
              color: '#666', 
              margin: 0,
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {generatedInvoice.notes}
            </p>
          </div>
        )}
      </div>
    );
    const renderModernCardTemplate = () => (
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
            <p style={{ fontSize: '12px', margin: 0, color: '#999' }}>{generatedInvoice.companyName}</p>
          </div>
          <div style={{ 
            flex: 1, 
            textAlign: 'right',
            paddingLeft: '20px',
            borderLeft: '3px solid #999'
          }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold', color: '#666' }}>#{generatedInvoice.invoiceNumber}</p>
            <p style={{ margin: '0', fontSize: '11px', color: '#999' }}>{generatedInvoice.date}</p>
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
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyName}</p>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.companyAddress}</p>
          </div>
          <div style={{ 
            padding: '15px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #eee'
          }}>
            <h3 style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontWeight: 'bold' }}>BILL TO</h3>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientName}</p>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{generatedInvoice.clientAddress}</p>
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
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}><strong>Due Date:</strong> {generatedInvoice.dueDate}</p>
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
            {generatedInvoice.items.map((item: any, index: number) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={{ padding: '12px', border: 'none', color: '#666' }}>{item.description}</td>
                <td style={{ padding: '12px', textAlign: 'center', border: 'none', color: '#666' }}>{item.quantity}</td>
                <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#666' }}>{formatInvoiceCurrency(item.rate, generatedInvoice?.currency)}</td>
                <td style={{ padding: '12px', textAlign: 'right', border: 'none', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(item.amount, generatedInvoice?.currency)}</td>
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
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.subtotal, generatedInvoice.currency)}</span>
          </div>
        <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontSize: '11px', color: '#666' }}>Discount ({generatedInvoice.discountRate}%):</span>
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>-{formatInvoiceCurrency(generatedInvoice.discount, generatedInvoice.currency)}</span>
          </div>
        <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ fontSize: '11px', color: '#666' }}>Tax (10%):</span>
              <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.tax, generatedInvoice.currency)}</span>
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
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatInvoiceCurrency(generatedInvoice.total, generatedInvoice.currency)}</span>
          </div>
          </div>
        </div>

        {/* Notes Section */}
        {generatedInvoice.notes && (
          <div style={{ 
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #eee'
          }}>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              color: '#666', 
              margin: '0 0 10px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Notes
            </h4>
            <p style={{ 
              fontSize: '11px', 
              color: '#666', 
              margin: 0,
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}>
              {generatedInvoice.notes}
            </p>
          </div>
        )}
      </div>
    );

    // Render template based on currentTemplateId
    const renderTemplate = () => {
      switch (currentTemplateId) {
        case 'minimal':
          return renderMinimalTemplate();
        case 'modern':
          return renderModernTemplate();
        case 'classic':
          return renderClassicTemplate();
        case 'creative':
          return renderCreativeTemplate();
        case 'professional':
          return renderProfessionalTemplate();
        case 'elegant':
          return renderElegantTemplate();
        case 'corporate':
          return renderCorporateTemplate();
        case 'geometric':
          return renderGeometricTemplate();
        case 'typography':
          return renderTypographyTemplate();
        case 'grid':
          return renderGridTemplate();
        case 'minimal-grey':
          return renderMinimalGreyTemplate();
        case 'minimal-left':
          return renderMinimalLeftTemplate();
        case 'minimal-compact':
          return renderMinimalCompactTemplate();
        case 'minimal-spaced':
          return renderMinimalSpacedTemplate();
        case 'minimal-card':
          return renderMinimalCardTemplate();
        case 'modern-grey':
          return renderModernGreyTemplate();
        case 'modern-vertical':
          return renderModernVerticalTemplate();
        case 'modern-compact':
          return renderModernCompactTemplate();
        case 'modern-spaced':
          return renderModernSpacedTemplate();
        case 'modern-card':
          return renderModernCardTemplate();
        default:
          return renderMinimalTemplate();
      }
    };

    return (
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Receipt size={16} />
          Generated Invoice Preview ({currentTemplateId})
        </h3>
        
        <div ref={invoiceRef} style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          {renderTemplate()}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: <FileText size={16} /> },
    { id: 'items', label: 'Items', icon: <Receipt size={16} /> },
    { id: 'services', label: 'Services', icon: <Receipt size={16} /> },
    { id: 'summary', label: 'Summary', icon: <DollarSign size={16} /> },
    { id: 'invoice', label: 'Invoice', icon: <Receipt size={16} /> }
  ];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: autoDownload ? '-9999px' : 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: autoDownload ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: autoDownload ? -1 : 1000,
      padding: '20px',
      pointerEvents: autoDownload ? 'none' : 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Receipt size={20} color="var(--mc-sidebar-bg)" />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#f3f4f6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          padding: '4px 16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          gap: '60px',
          width: '100%',
          justifyContent: 'center'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                width: '120px',
                backgroundColor: activeTab === tab.id ? 'var(--mc-sidebar-bg)' : 'white',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                boxShadow: activeTab === tab.id ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'items' && renderItemsTab()}
          {activeTab === 'services' && renderServicesTab()}
          {activeTab === 'summary' && renderSummaryTab()}
          {activeTab === 'invoice' && renderInvoiceTab()}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: 'auto', padding: '24px', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={handleSave}
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
            <Save size={16} />
            {editingInvoice ? 'Update Invoice' : 'Save Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
