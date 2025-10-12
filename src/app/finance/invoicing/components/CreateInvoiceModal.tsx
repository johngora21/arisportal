'use client';

import React, { useState } from 'react';
import { 
  X,
  Plus,
  Minus,
  Save,
  Send,
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

interface InvoiceItem {
  id: string;
  type: 'service' | 'item';
  description: string;
  quantity: number;
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
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, onSave, onSend }) => {
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
    taxRate: 0,
    discount: 0
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', type: 'item', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  const [services, setServices] = useState<InvoiceService[]>([
    { id: '1', description: '', quantity: 1, unit: 'hours', rate: 0, amount: 0 }
  ]);

  const [activeTab, setActiveTab] = useState<'details' | 'items' | 'services' | 'summary' | 'invoice'>('details');

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
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const addService = () => {
    const newService: InvoiceService = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
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
  const taxAmount = (subtotal * formData.taxRate) / 100;
  const discountAmount = (subtotal * formData.discount) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const handleSave = () => {
    console.log('Saving invoice:', { formData, items, total });
    onSave?.({ formData, items, total });
    onClose();
  };

  const handleSend = () => {
    console.log('Sending invoice:', { formData, items, total });
    onSend?.({ formData, items, total });
    onClose();
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
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={14} />
            Client Information
          </h4>
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
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
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
                width: '45%',           // DESCRIPTION WIDTH - Adjust this percentage
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
                textAlign: 'right', 
                padding: '12px 16px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151', 
                width: '18%',           // RATE WIDTH - Adjust this percentage
                minWidth: '100px'       // RATE MIN WIDTH - Adjust this value
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
                  width: '45%',             // DESCRIPTION CELL WIDTH - Match header width
                  minWidth: '200px'         // DESCRIPTION CELL MIN WIDTH - Match header min width
                }}>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Product description"
                    style={{
                      width: '100%',        // INPUT CONTAINER WIDTH - Adjust this value
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
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    min="0"
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
                  padding: '12px 16px',     // RATE CELL PADDING - Adjust these values
                  textAlign: 'right',
                  width: '18%',             // RATE CELL WIDTH - Match header width
                  minWidth: '100px'         // RATE CELL MIN WIDTH - Match header min width
                }}>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
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
                  ${item.amount.toFixed(2)}
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
                    type="number"
                    value={service.quantity}
                    onChange={(e) => updateService(service.id, 'quantity', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.5"
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
                    type="number"
                    value={service.rate}
                    onChange={(e) => updateService(service.id, 'rate', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
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
          <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>${subtotal.toFixed(2)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Tax</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="number"
              value={formData.taxRate}
              onChange={(e) => setFormData({...formData, taxRate: parseFloat(e.target.value) || 0})}
              placeholder="0"
              min="0"
              max="100"
              step="0.1"
              style={{
                width: '60px',
                padding: '6px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>%</span>
            <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>${taxAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Discount</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
              placeholder="0"
              style={{
                width: '60px',
                padding: '6px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            />
            <span style={{ fontSize: '14px', color: '#ef4444', fontWeight: '500' }}>-${discountAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid #e5e7eb' }}>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Total</span>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>${total.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );

  const renderInvoiceTab = () => (
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
        width: '100%',
        maxWidth: '900px',
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
              Create New Invoice
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
          padding: '4px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          gap: '8px',
          width: '100%'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
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
            Generate
          </button>
          <button
            onClick={handleSend}
            style={{
              padding: '12px 24px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#10b981',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Send size={16} />
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
