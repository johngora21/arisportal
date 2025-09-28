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
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  lastContact: Date;
  value: number;
  tags: string[];
  notes: string;
}

interface Deal {
  id: string;
  title: string;
  contact: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  closeDate: Date;
  owner: string;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    location: 'San Francisco, CA',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
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
    title: 'Enterprise Software License',
    contact: 'Sarah Johnson',
    value: 50000,
    stage: 'negotiation',
    probability: 80,
    closeDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    owner: 'John Smith'
  },
  {
    id: '2',
    title: 'Startup Package Deal',
    contact: 'Michael Chen',
    value: 15000,
    stage: 'proposal',
    probability: 60,
    closeDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    owner: 'Jane Doe'
  },
  {
    id: '3',
    title: 'Healthcare Compliance Solution',
    contact: 'Dr. Emily Rodriguez',
    value: 25000,
    stage: 'qualification',
    probability: 40,
    closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    owner: 'Mike Johnson'
  },
  {
    id: '4',
    title: 'Financial Services Upgrade',
    contact: 'James Wilson',
    value: 75000,
    stage: 'closed-won',
    probability: 100,
    closeDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    owner: 'Sarah Wilson'
  }
];

export default function CRMPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'contacts' | 'deals' | 'analytics'>('contacts');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'manual' | 'import' | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    location: '',
    email: '',
    phone: '',
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
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'bg-gray-100 text-gray-800';
      case 'qualification': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed-won': return 'bg-green-100 text-green-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
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

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = deals.filter(deal => deal.stage === 'closed-won');
  const activeDeals = deals.filter(deal => !deal.stage.includes('closed'));

  const handleAddContact = () => {
    if (newContact.name && newContact.location) {
      const contact: Contact = {
        id: Date.now().toString(),
        name: newContact.name,
        location: newContact.location,
        email: newContact.email,
        phone: newContact.phone,
        status: newContact.status,
        lastContact: new Date(),
        value: newContact.value,
        tags: [],
        notes: newContact.notes
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: '', location: '', email: '', phone: '', status: 'lead', value: 0, notes: '' });
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
            <Plus size={20} />
            Add Contact
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Users size={20} color="#0f172a" />
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
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Won Deals</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {wonDeals.length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'contacts', label: 'Contacts', icon: <Users size={16} /> },
            { id: 'deals', label: 'Deals', icon: <Target size={16} /> },
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
              placeholder="Search contacts..."
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
          
          {/* Status Filter - positioned from right */}
          <div style={{
            position: 'absolute',
            right: '50px',
            top: '0px'
          }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '12px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                background: 'white',
                width: '180px'
              }}
            >
              <option value="all">All Status</option>
              <option value="lead">Leads</option>
              <option value="prospect">Prospects</option>
              <option value="customer">Customers</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
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
                            e.currentTarget.style.color = '#0f172a';
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
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Deals ({deals.length})
            </h3>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gap: '16px' }}>
              {deals.map((deal) => (
                <div key={deal.id} style={{ 
                  padding: '20px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                        {deal.title}
                      </h4>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        {deal.contact} • {deal.owner}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
                        {formatCurrency(deal.value)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {deal.probability}% probability
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        ...getStageColor(deal.stage).split(' ').reduce((acc, className) => {
                          if (className.startsWith('bg-')) acc.backgroundColor = className.replace('bg-', '');
                          if (className.startsWith('text-')) acc.color = className.replace('text-', '');
                          return acc;
                        }, {} as any)
                      }}>
                        {deal.stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        Close: {formatDate(deal.closeDate)}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ padding: '6px', border: 'none', borderRadius: '6px', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer' }}>
                        <Edit size={16} />
                      </button>
                      <button style={{ padding: '6px', border: 'none', borderRadius: '6px', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer' }}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
            CRM Analytics
          </h3>
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <TrendingUp size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>Analytics dashboard coming soon...</p>
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
                    e.currentTarget.style.borderColor = '#0f172a';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <UserPlus size={32} color="#0f172a" />
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
                    e.currentTarget.style.borderColor = '#0f172a';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <FileText size={32} color="#0f172a" />
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Status
                    </label>
                    <select
                      value={newContact.status}
                      onChange={(e) => setNewContact({...newContact, status: e.target.value as Contact['status']})}
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="lead">Lead</option>
                      <option value="prospect">Prospect</option>
                      <option value="customer">Customer</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

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
                      background: '#0f172a',
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
                <FileText size={48} color="#0f172a" style={{ marginBottom: '16px' }} />
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
                    backgroundColor: '#0f172a',
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
                  color: '#0f172a' 
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
                  color: '#0f172a' 
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
                
                {selectedContact.phone && (
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

            {/* Chat Window */}
            <div style={{ 
              flex: 1, 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              marginBottom: '16px',
              backgroundColor: 'white',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Chat Header */}
              <div style={{ 
                padding: '12px 16px', 
                borderBottom: '1px solid #e5e7eb', 
                backgroundColor: '#f9fafb',
                borderRadius: '8px 8px 0 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedChannel === 'email' && <Mail size={16} color="#6b7280" />}
                  {selectedChannel === 'sms' && <Phone size={16} color="#6b7280" />}
                  {selectedChannel === 'whatsapp' && <MessageSquare size={16} color="#6b7280" />}
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {selectedChannel === 'email' && `Email: ${selectedContact.email}`}
                    {selectedChannel === 'sms' && `SMS: ${selectedContact.phone}`}
                    {selectedChannel === 'whatsapp' && `WhatsApp: ${selectedContact.phone}`}
                  </span>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div style={{ 
                flex: 1, 
                padding: '16px', 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
              }}>
                <MessageSquare size={48} color="#d1d5db" />
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
                    Start a conversation
                  </h4>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Send a message to {selectedContact.name} via {selectedChannel.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Message Input */}
              <div style={{ 
                padding: '16px', 
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '12px'
              }}>
                <input
                  type="text"
                  placeholder={`Type your message...`}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <button
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    background: '#0f172a',
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
                  Send
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
