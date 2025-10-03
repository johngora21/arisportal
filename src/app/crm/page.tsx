'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  Star,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  UserCheck,
  PhoneCall,
  Mail as MailIcon,
  MessageSquare,
  FileText,
  Send
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  lastContact: Date;
  value: number;
  tags: string[];
  notes: string;
}

interface Deal {
  id: string;
  productName: string;
  productCategory: string;
  buyerName: string;
  address: string;
  email: string;
  phone: string;
  orderDate: Date;
  quantity: number;
  unitPrice: number;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    location: 'San Francisco, CA',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    whatsapp: '+1 (555) 123-4567',
    status: 'customer',
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    value: 50000,
    tags: ['enterprise', 'tech', 'high-value'],
    notes: 'Interested in our enterprise solution. Very responsive to emails.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    location: 'Austin, TX',
    email: 'm.chen@startupxyz.com',
    phone: '+1 (555) 987-6543',
    whatsapp: '+1 (555) 987-6543',
    status: 'prospect',
    lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    value: 15000,
    tags: ['startup', 'referral', 'budget-conscious'],
    notes: 'Looking for cost-effective solutions. Mentioned budget constraints.'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    location: 'Boston, MA',
    email: 'emily.r@healthplus.com',
    phone: '+1 (555) 456-7890',
    whatsapp: '+1 (555) 456-7890',
    status: 'lead',
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    value: 25000,
    tags: ['healthcare', 'linkedin', 'decision-maker'],
    notes: 'Very interested in our compliance features. Scheduled demo for next week.'
  },
  {
    id: '4',
    name: 'James Wilson',
    location: 'New York, NY',
    email: 'j.wilson@financegroup.com',
    phone: '+1 (555) 321-0987',
    whatsapp: '+1 (555) 321-0987',
    status: 'customer',
    lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    value: 75000,
    tags: ['finance', 'enterprise', 'long-term'],
    notes: 'Long-term customer. Very satisfied with our services. Potential for expansion.'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    location: 'Chicago, IL',
    email: 'lisa.t@retailco.com',
    phone: '+1 (555) 654-3210',
    whatsapp: '+1 (555) 654-3210',
    status: 'inactive',
    lastContact: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    value: 5000,
    tags: ['retail', 'marketing', 'unresponsive'],
    notes: 'Was interested but went silent after initial contact. Follow up needed.'
  }
];

const mockDeals: Deal[] = [
  {
    id: '1',
    productName: 'Dell Latitude 5520 Laptop',
    productCategory: 'Electronics',
    buyerName: 'Sarah Johnson',
    address: 'San Francisco, CA',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    quantity: 25,
    unitPrice: 1200
  },
  {
    id: '2',
    productName: 'Office Furniture Set',
    productCategory: 'Furniture',
    buyerName: 'Michael Chen',
    address: 'Austin, TX',
    email: 'm.chen@startupxyz.com',
    phone: '+1 (555) 987-6543',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    quantity: 15,
    unitPrice: 800
  },
  {
    id: '3',
    productName: 'Medical Equipment Package',
    productCategory: 'Healthcare',
    buyerName: 'Dr. Emily Rodriguez',
    address: 'Boston, MA',
    email: 'emily.r@healthplus.com',
    phone: '+1 (555) 456-7890',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    quantity: 8,
    unitPrice: 2500
  },
  {
    id: '4',
    productName: 'Financial Software License',
    productCategory: 'Software',
    buyerName: 'James Wilson',
    address: 'New York, NY',
    email: 'j.wilson@financegroup.com',
    phone: '+1 (555) 321-0987',
    orderDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    quantity: 1,
    unitPrice: 50000
  },
  {
    id: '5',
    productName: 'Retail POS System',
    productCategory: 'Electronics',
    buyerName: 'Lisa Thompson',
    address: 'Chicago, IL',
    email: 'lisa.t@retailco.com',
    phone: '+1 (555) 654-3210',
    orderDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    quantity: 3,
    unitPrice: 1500
  }
];

export default function CRMPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [contactsSearchQuery, setContactsSearchQuery] = useState('');
  const [salesSearchQuery, setSalesSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'contacts' | 'deals' | 'analytics'>('contacts');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'manual' | 'import' | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    location: '',
    email: '',
    phone: '',
    whatsapp: '',
    status: 'lead' as Contact['status'],
    value: 0,
    notes: ''
  });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');
  
  const availableChannels = [
    { id: 'email', label: 'Email', icon: <Mail size={16} /> },
    { id: 'sms', label: 'SMS', icon: <Phone size={16} /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare size={16} /> }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(contactsSearchQuery.toLowerCase()) ||
                         contact.location.toLowerCase().includes(contactsSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.productName.toLowerCase().includes(salesSearchQuery.toLowerCase()) ||
                         deal.buyerName.toLowerCase().includes(salesSearchQuery.toLowerCase()) ||
                         deal.address.toLowerCase().includes(salesSearchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'customer': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const totalValue = deals.reduce((sum, deal) => sum + (deal.quantity * deal.unitPrice), 0);
  const completedDeals = deals.filter(deal => deal.id); // All deals are considered completed orders
  const activeDeals = deals.filter(deal => deal.id); // All deals are active

  const handleAddContact = () => {
    if (newContact.name && newContact.location) {
      const contact: Contact = {
        id: Date.now().toString(),
        name: newContact.name,
        location: newContact.location,
        email: newContact.email,
        phone: newContact.phone,
        whatsapp: newContact.whatsapp,
        status: newContact.status,
        lastContact: new Date(),
        value: newContact.value,
        tags: [],
        notes: newContact.notes
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: '', location: '', email: '', phone: '', whatsapp: '', status: 'lead', value: 0, notes: '' });
      setShowAddModal(false);
      setAddMode(null);
    }
  };

  const handleImportContacts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd parse the CSV/Excel file here
      // For now, we'll just show a success message
      alert('Import functionality will be implemented with file parsing logic');
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowViewModal(true);
  };

  const handleChatContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowChatModal(true);
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(contact => contact.id !== contactId));
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Customer Relationship Management
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage your contacts, leads, and deals effectively
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Plus size={20} />
            Add Contact
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Users size={20} color="var(--mc-sidebar-bg)" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Contacts</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {contacts.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <DollarSign size={20} color="#10b981" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Pipeline Value</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {formatCurrency(totalValue)}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Target size={20} color="#f59e0b" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Active Deals</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {activeDeals.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <TrendingUp size={20} color="#8b5cf6" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Completed Sales</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {completedDeals.length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'contacts', label: 'Contacts', icon: <Users size={16} /> },
            { id: 'deals', label: 'Sales', icon: <Target size={16} /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={16} /> }
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

        {/* Search Bar - Only for Contacts and Sales tabs */}
        {(activeTab === 'contacts' || activeTab === 'deals') && (
        <div style={{
          position: 'relative',
          height: '40px',
          marginBottom: '24px'
        }}>
          {/* Search Bar - positioned from right */}
          <div style={{ 
            position: 'absolute',
              right: '60px',
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
                placeholder={activeTab === 'contacts' ? "Search contacts..." : "Search sales..."}
                value={activeTab === 'contacts' ? contactsSearchQuery : salesSearchQuery}
                onChange={(e) => activeTab === 'contacts' ? setContactsSearchQuery(e.target.value) : setSalesSearchQuery(e.target.value)}
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
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'contacts' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Location</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Value</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Last Contact</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {contact.name}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {contact.location}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        ...getStatusColor(contact.status).split(' ').reduce((acc, className) => {
                          if (className.startsWith('bg-')) acc.backgroundColor = className.replace('bg-', '');
                          if (className.startsWith('text-')) acc.color = className.replace('text-', '');
                          return acc;
                        }, {} as any)
                      }}>
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                        {formatCurrency(contact.value)}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {formatDate(contact.lastContact)}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleViewContact(contact)}
                          style={{ 
                            padding: '6px', 
                            border: 'none', 
                            borderRadius: '6px', 
                            background: '#f3f4f6', 
                            color: '#6b7280', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }} 
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#e5e7eb';
                            e.currentTarget.style.color = '#374151';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                          title="View Contact Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleChatContact(contact)}
                          style={{ 
                            padding: '6px', 
                            border: 'none', 
                            borderRadius: '6px', 
                            background: '#f3f4f6', 
                            color: '#6b7280', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }} 
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#dbeafe';
                            e.currentTarget.style.color = 'var(--mc-sidebar-bg)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                          title="Send Message"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteContact(contact.id)}
                          style={{ 
                            padding: '6px', 
                            border: 'none', 
                            borderRadius: '6px', 
                            background: '#f3f4f6', 
                            color: '#6b7280', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }} 
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                            e.currentTarget.style.color = '#dc2626';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                          title="Delete Contact"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'deals' && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '20px',
          maxWidth: '1400px'
        }}>
          {filteredDeals.map((deal) => (
            <div key={deal.id} style={{ 
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}>
              {/* Card Header */}
              <div style={{ 
                padding: '20px 20px 16px 20px',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  margin: 0,
                  lineHeight: '1.3'
                }}>
                  {deal.productName}
            </h3>
          </div>
          
              {/* Card Body */}
              <div style={{ padding: '20px', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Buyer Info */}
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                      {deal.buyerName}
                    </div>
                    
                    {/* Contact Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={14} color="#6b7280" />
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>{deal.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={14} color="#6b7280" />
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>{deal.phone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} color="#6b7280" />
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>{deal.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sale Details */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '20px'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                        Sale Date
                    </div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        {formatDate(deal.orderDate)}
                      </div>
                      </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                        Quantity
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        {deal.quantity} units
                      </div>
                    </div>
                  </div>
                    </div>
                  </div>
                  
              {/* Card Footer */}
              <div style={{ 
                padding: '16px 20px', 
                borderTop: '1px solid #f3f4f6',
                backgroundColor: '#f9fafb'
              }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                    Total Price
                      </span>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                    {formatCurrency(deal.quantity * deal.unitPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Locations Pie Chart */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
              Sales by Location
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
              {/* Pie Chart */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {(() => {
                  const locationData = [
                    { location: 'San Francisco, CA', count: deals.filter(d => d.address.includes('San Francisco')).length, color: '#8b5cf6' },
                    { location: 'Austin, TX', count: deals.filter(d => d.address.includes('Austin')).length, color: '#06b6d4' },
                    { location: 'Boston, MA', count: deals.filter(d => d.address.includes('Boston')).length, color: '#10b981' },
                    { location: 'New York, NY', count: deals.filter(d => d.address.includes('New York')).length, color: '#f59e0b' },
                    { location: 'Chicago, IL', count: deals.filter(d => d.address.includes('Chicago')).length, color: '#ef4444' }
                  ].filter(item => item.count > 0);
                  
                  const total = locationData.reduce((sum, item) => sum + item.count, 0);
                  let cumulativePercentage = 0;
                  const radius = 80;
                  const centerX = 100;
                  const centerY = 100;
                  
                  return (
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      {locationData.map((item, index) => {
                        const percentage = (item.count / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const startAngle = cumulativePercentage * 3.6;
                        const endAngle = (cumulativePercentage + percentage) * 3.6;
                        
                        const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
                        const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
                        
                        const largeArcFlag = percentage > 50 ? 1 : 0;
                        const pathData = [
                          `M ${centerX} ${centerY}`,
                          `L ${x1} ${y1}`,
                          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          'Z'
                        ].join(' ');
                        
                        cumulativePercentage += percentage;
                        
                        return (
                          <path
                            key={index}
                            d={pathData}
                            fill={item.color}
                            stroke="white"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                  );
                })()}
              </div>
              
              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { location: 'San Francisco, CA', count: deals.filter(d => d.address.includes('San Francisco')).length, color: '#8b5cf6' },
                  { location: 'Austin, TX', count: deals.filter(d => d.address.includes('Austin')).length, color: '#06b6d4' },
                  { location: 'Boston, MA', count: deals.filter(d => d.address.includes('Boston')).length, color: '#10b981' },
                  { location: 'New York, NY', count: deals.filter(d => d.address.includes('New York')).length, color: '#f59e0b' },
                  { location: 'Chicago, IL', count: deals.filter(d => d.address.includes('Chicago')).length, color: '#ef4444' }
                ].filter(item => item.count > 0).map((item) => {
                  const percentage = (item.count / deals.length) * 100;
                  return (
                    <div key={item.location} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: item.color }}></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                            {item.location}
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                            {item.count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Sold Items/Services */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
              Top Sold Items/Services
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
              {/* Bar Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '300px', justifyContent: 'space-between' }}>
                {deals
                  .map(deal => ({
                    name: deal.productName,
                    quantity: deal.quantity,
                    total: deal.quantity * deal.unitPrice,
                    color: '#3b82f6'
                  }))
                  .sort((a, b) => b.quantity - a.quantity)
                  .slice(0, 5)
                  .map((item, index) => {
                    const maxQuantity = Math.max(...deals.map(d => d.quantity));
                    const barHeight = (item.quantity / maxQuantity) * 100;
                    return (
                      <div key={item.name} style={{ display: 'flex', alignItems: 'end', gap: '12px', height: '50px' }}>
                        <div style={{ 
                          width: '20px', 
                          height: `${barHeight}%`, 
                          backgroundColor: item.color,
                          borderRadius: '4px 4px 0 0',
                          minHeight: '20px'
                        }}></div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                            {item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}
                          </span>
                          <span style={{ fontSize: '11px', color: '#6b7280' }}>
                            {item.quantity} units
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {deals
                  .map(deal => ({
                    name: deal.productName,
                    quantity: deal.quantity,
                    total: deal.quantity * deal.unitPrice,
                    color: '#3b82f6'
                  }))
                  .sort((a, b) => b.quantity - a.quantity)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%', 
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280'
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                            {item.name}
                      </span>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                            {item.quantity} units
                      </span>
                    </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'right' }}>
                          {formatCurrency(item.total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Top Customers */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
              Top Customers
          </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
              {/* Horizontal Bar Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {deals
                  .map(deal => ({
                    name: deal.buyerName,
                    value: deal.quantity * deal.unitPrice,
                    color: '#6366f1'
                  }))
                  .reduce((acc, deal) => {
                    const existing = acc.find(d => d.name === deal.name);
                    if (existing) {
                      existing.value += deal.value;
                    } else {
                      acc.push(deal);
                    }
                    return acc;
                  }, [] as any[])
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map((customer, index) => {
                    const maxValue = Math.max(...deals.map(d => d.quantity * d.unitPrice));
                    const percentage = (customer.value / maxValue) * 100;
                    return (
                      <div key={customer.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '20px', 
                          height: '20px', 
                          borderRadius: '50%', 
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6b7280'
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                              {customer.name}
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                              {formatCurrency(customer.value)}
                            </span>
                          </div>
                          <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${percentage}%`, 
                              height: '100%', 
                              backgroundColor: customer.color,
                              borderRadius: '4px',
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              {/* Pie Chart for Customer Revenue */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {(() => {
                  const customerData = deals
                    .map(deal => ({
                      name: deal.buyerName,
                      value: deal.quantity * deal.unitPrice,
                      color: '#6366f1'
                    }))
                    .reduce((acc, deal) => {
                      const existing = acc.find(d => d.name === deal.name);
                      if (existing) {
                        existing.value += deal.value;
                      } else {
                        acc.push(deal);
                      }
                      return acc;
                    }, [] as any[])
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5);
                  
                  const total = customerData.reduce((sum, item) => sum + item.value, 0);
                  let cumulativePercentage = 0;
                  const radius = 80;
                  const centerX = 100;
                  const centerY = 100;
                  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
                  
                  return (
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      {customerData.map((customer, index) => {
                        const percentage = (customer.value / total) * 100;
                        const startAngle = cumulativePercentage * 3.6;
                        const endAngle = (cumulativePercentage + percentage) * 3.6;
                        
                        const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
                        const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
                        
                        const largeArcFlag = percentage > 50 ? 1 : 0;
                        const pathData = [
                          `M ${centerX} ${centerY}`,
                          `L ${x1} ${y1}`,
                          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          'Z'
                        ].join(' ');
                        
                        cumulativePercentage += percentage;
                        
                        return (
                          <path
                            key={index}
                            d={pathData}
                            fill={colors[index % colors.length]}
                            stroke="white"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
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
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Add New Contact
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddMode(null);
                  setNewContact({ name: '', location: '', email: '', phone: '', status: 'lead', value: 0, notes: '' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {!addMode ? (
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button
                  onClick={() => setAddMode('manual')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '24px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    background: 'white',
                    cursor: 'pointer',
                    minWidth: '150px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <UserPlus size={32} color="var(--mc-sidebar-bg)" />
                  <span style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>Manual Entry</span>
                  <span style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>Add contact details one by one</span>
                </button>

                <button
                  onClick={() => setAddMode('import')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '24px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    background: 'white',
                    cursor: 'pointer',
                    minWidth: '150px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--mc-sidebar-bg)';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <FileText size={32} color="var(--mc-sidebar-bg)" />
                  <span style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>Import CSV</span>
                  <span style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>Upload a CSV file with contacts</span>
                </button>
              </div>
            ) : addMode === 'manual' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '100%', boxSizing: 'border-box' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="Enter contact name"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newContact.location}
                    onChange={(e) => setNewContact({...newContact, location: e.target.value})}
                    placeholder="e.g., San Francisco, CA"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    placeholder="contact@example.com"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    WhatsApp
                    </label>
                  <input
                    type="tel"
                    value={newContact.whatsapp}
                    onChange={(e) => setNewContact({...newContact, whatsapp: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                  />
                  </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Value ($)
                    </label>
                    <input
                      type="number"
                      value={newContact.value}
                      onChange={(e) => setNewContact({...newContact, value: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Notes
                  </label>
                  <textarea
                    value={newContact.notes}
                    onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                    placeholder="Add any notes about this contact..."
                    rows={3}
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                  onClick={() => {
                    setAddMode(null);
                    setNewContact({ name: '', location: '', email: '', phone: '', status: 'lead', value: 0, notes: '' });
                  }}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      background: 'white',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContact}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '8px',
                      background: 'var(--mc-sidebar-bg)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Add Contact
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <FileText size={48} color="var(--mc-sidebar-bg)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Import Contacts from CSV
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>
                  Upload a CSV file with columns: Name, Location, Status, Value, Notes
                </p>
                
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportContacts}
                  style={{ display: 'none' }}
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Choose CSV File
                </label>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                  <button
                    onClick={() => setAddMode(null)}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      background: 'white',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {showViewModal && selectedContact && (
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
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Contact Details
              </h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedContact(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: '#e0f2fe', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '24px', 
                  fontWeight: '600', 
                  color: 'var(--mc-sidebar-bg)' 
                }}>
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {selectedContact.name}
                  </h3>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                    {selectedContact.location}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                    Status
                  </label>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    ...getStatusColor(selectedContact.status).split(' ').reduce((acc, className) => {
                      if (className.startsWith('bg-')) acc.backgroundColor = className.replace('bg-', '');
                      if (className.startsWith('text-')) acc.color = className.replace('text-', '');
                      return acc;
                    }, {} as any)
                  }}>
                    {selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                    Value
                  </label>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {formatCurrency(selectedContact.value)}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                    Last Contact
                  </label>
                  <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                    {formatDate(selectedContact.lastContact)}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                    Contact ID
                  </label>
                  <p style={{ fontSize: '14px', color: '#374151', margin: 0, fontFamily: 'monospace' }}>
                    {selectedContact.id}
                  </p>
                </div>
              </div>


              {/* Contact Information */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
                  Contact Information
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <Mail size={16} color="#6b7280" />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Email</div>
                      <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{selectedContact.email}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <Phone size={16} color="#6b7280" />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Phone</div>
                      <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{selectedContact.phone}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <MessageSquare size={16} color="#6b7280" />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>WhatsApp</div>
                      <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{selectedContact.whatsapp}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedContact(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedContact && (
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
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: '#e0f2fe', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: 'var(--mc-sidebar-bg)' 
                }}>
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {selectedContact.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    {selectedContact.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChatModal(false);
                  setSelectedContact(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {/* Channel Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
                Choose Communication Channel
              </label>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {selectedContact.email && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="channel"
                      value="email"
                      checked={selectedChannel === 'email'}
                      onChange={(e) => setSelectedChannel(e.target.value as any)}
                    />
                    <Mail size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Email</span>
                  </label>
                )}
                
                {selectedContact.phone && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="channel"
                      value="sms"
                      checked={selectedChannel === 'sms'}
                      onChange={(e) => setSelectedChannel(e.target.value as any)}
                    />
                    <Phone size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>SMS</span>
                  </label>
                )}
                
                {selectedContact.whatsapp && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="channel"
                      value="whatsapp"
                      checked={selectedChannel === 'whatsapp'}
                      onChange={(e) => setSelectedChannel(e.target.value as any)}
                    />
                    <MessageSquare size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>WhatsApp</span>
                  </label>
                )}
                </div>
              </div>

              {/* Message Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
                Message to {selectedContact.name} via {selectedChannel.toUpperCase()}
              </label>
              <textarea
                placeholder="Type your message here..."
                rows={6}
                  style={{
                  width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                  }}
                />
            </div>

            {/* Send Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  style={{
                  padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'var(--mc-sidebar-bg)',
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
                Send Message
                </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
