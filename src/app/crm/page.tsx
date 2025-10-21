'use client';

import React, { useState, useEffect } from 'react';
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
import { Contact, ContactService, Deal, DealService } from './models';

// Data loading hook
const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        // First load existing contacts from API
        const apiContacts = await ContactService.fetchContacts();
        
        // Then get deals to create contacts from sales data
        const deals = await DealService.fetchDeals();
        
        // Remove duplicate deals first
        const uniqueDeals: Deal[] = [];
        const seenDeals = new Set();
        
        deals.forEach(deal => {
          const dealKey = `${deal.buyerName}-${deal.address}-${deal.productName}-${deal.quantity}-${deal.unitPrice}-${deal.orderDate}`;
          if (!seenDeals.has(dealKey)) {
            seenDeals.add(dealKey);
            uniqueDeals.push(deal);
          } else {
            console.log(`Removed duplicate deal: ${deal.productName} for ${deal.buyerName}`);
          }
        });
        
        console.log(`Original deals: ${deals.length}, Unique deals: ${uniqueDeals.length}`);
        
        // Create contacts from unique buyers in deals
        const uniqueBuyers = new Map();
        
        uniqueDeals.forEach(deal => {
          const buyerKey = `${deal.buyerName}-${deal.address}`.toLowerCase();
          
          // Debug for jameson raey
          if (deal.buyerName.toLowerCase().includes('jameson')) {
            console.log(`Processing deal for jameson: ${deal.productName} - ${deal.quantity} × $${deal.unitPrice} = $${deal.quantity * deal.unitPrice}`);
          }
          
          if (!uniqueBuyers.has(buyerKey)) {
            uniqueBuyers.set(buyerKey, {
              name: deal.buyerName,
              address: deal.address,
              email: deal.email || '',
              phone: deal.phone || '',
              totalValue: deal.quantity * deal.unitPrice,
              deals: [deal]
            });
            
            // Debug for jameson raey
            if (deal.buyerName.toLowerCase().includes('jameson')) {
              console.log(`Created new jameson buyer with total: ${deal.quantity * deal.unitPrice}`);
            }
          } else {
            const existing = uniqueBuyers.get(buyerKey);
            const dealValue = deal.quantity * deal.unitPrice;
            existing.totalValue += dealValue;
            existing.deals.push(deal);
            
            // Debug for jameson raey
            if (deal.buyerName.toLowerCase().includes('jameson')) {
              console.log(`Added deal value ${dealValue} to existing jameson total: ${existing.totalValue}`);
            }
          }
        });

        // Convert unique buyers to contacts
        const salesContacts: Contact[] = Array.from(uniqueBuyers.values()).map(buyerData => {
          // Debug for jameson raey
          if (buyerData.name.toLowerCase().includes('jameson')) {
            console.log(`Final jameson contact calculation:`);
            console.log(`- Name: ${buyerData.name}`);
            console.log(`- Address: ${buyerData.address}`);
            console.log(`- Total Value: ${buyerData.totalValue}`);
            console.log(`- Number of deals: ${buyerData.deals.length}`);
            console.log(`- Deal breakdown:`, buyerData.deals.map((d: Deal) => `${d.productName}: ${d.quantity} × $${d.unitPrice} = $${d.quantity * d.unitPrice}`));
          }
          
          return {
            id: `sales-${buyerData.name}-${buyerData.address}`.replace(/\s+/g, '-').toLowerCase(),
            name: buyerData.name,
            company: '',
            location: buyerData.address,
            email: buyerData.email,
            phone: buyerData.phone,
            whatsapp: '',
            status: 'customer' as const,
            lastContact: new Date(Math.max(...buyerData.deals.map((d: Deal) => new Date(d.orderDate).getTime()))),
            value: buyerData.totalValue,
            tags: [],
            notes: `Customer from ${buyerData.deals.length} sale(s)`
          };
        });

        // Combine API contacts and sales contacts, avoiding duplicates
        const allContacts = [...apiContacts];
        salesContacts.forEach(salesContact => {
          const exists = apiContacts.some(apiContact => 
            apiContact.name.toLowerCase() === salesContact.name.toLowerCase() &&
            apiContact.location.toLowerCase() === salesContact.location.toLowerCase()
          );
          if (!exists) {
            allContacts.push(salesContact);
          } else {
            // Update existing contact with sales data
            const existingContact = apiContacts.find(apiContact => 
              apiContact.name.toLowerCase() === salesContact.name.toLowerCase() &&
              apiContact.location.toLowerCase() === salesContact.location.toLowerCase()
            );
            if (existingContact) {
              // Debug for jameson raey
              if (salesContact.name.toLowerCase().includes('jameson')) {
                console.log(`Merging jameson contact:`);
                console.log(`- Existing contact value: ${existingContact.value}`);
                console.log(`- Sales contact value: ${salesContact.value}`);
                console.log(`- Combined value: ${existingContact.value + salesContact.value}`);
              }
              
              // Update the existing contact in allContacts
              const index = allContacts.findIndex(c => c.id === existingContact.id);
              if (index !== -1) {
                allContacts[index] = {
                  ...existingContact,
                  value: salesContact.value, // Use sales-calculated value instead of adding
                  lastContact: salesContact.lastContact > existingContact.lastContact ? 
                    salesContact.lastContact : existingContact.lastContact, // Keep most recent
                  notes: existingContact.notes ? 
                    `${existingContact.notes}; ${salesContact.notes}` : 
                    salesContact.notes // Combine notes
                };
              }
            }
          }
        });

        // Remove any remaining duplicates from the final list
        const finalContacts: Contact[] = [];
        const seenKeys = new Set();
        
        allContacts.forEach(contact => {
          const key = `${contact.name.toLowerCase()}-${contact.location.toLowerCase()}`;
          
          // Debug for jameson raey
          if (contact.name.toLowerCase().includes('jameson')) {
            console.log(`Processing jameson in final merge: ${contact.name} - Value: ${contact.value}`);
          }
          
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            finalContacts.push(contact);
          } else {
            // Merge with existing contact
            const existingIndex = finalContacts.findIndex(c => 
              c.name.toLowerCase() === contact.name.toLowerCase() &&
              c.location.toLowerCase() === contact.location.toLowerCase()
            );
            if (existingIndex !== -1) {
              // Debug for jameson raey
              if (contact.name.toLowerCase().includes('jameson')) {
                console.log(`Final merge for jameson:`);
                console.log(`- Existing value: ${finalContacts[existingIndex].value}`);
                console.log(`- New contact value: ${contact.value}`);
                console.log(`- Final combined value: ${finalContacts[existingIndex].value + contact.value}`);
              }
              
              // Use the higher value instead of adding them together
              const higherValue = Math.max(finalContacts[existingIndex].value, contact.value);
              finalContacts[existingIndex] = {
                ...finalContacts[existingIndex],
                value: higherValue,
                lastContact: finalContacts[existingIndex].lastContact > contact.lastContact ? 
                  finalContacts[existingIndex].lastContact : contact.lastContact,
                notes: finalContacts[existingIndex].notes && contact.notes ? 
                  `${finalContacts[existingIndex].notes}; ${contact.notes}` : 
                  (finalContacts[existingIndex].notes || contact.notes)
              };
            }
          }
        });

        // Sort contacts by last contact date (most recent first)
        const sortedContacts = finalContacts.sort((a, b) => 
          new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()
        );
        
        setContacts(sortedContacts);
      } catch (error) {
        console.error('Failed to load contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  const addContact = async (contactData: any) => {
    try {
      const newContact = await ContactService.createContact(contactData);
      setContacts(prev => [...prev, newContact]);
      return newContact;
    } catch (error) {
      console.error('Failed to create contact:', error);
      throw error;
    }
  };

  const updateContact = async (contactData: any) => {
    try {
      const updatedContact = await ContactService.updateContact(contactData);
      setContacts(prev => prev.map(c => c.id === contactData.id ? updatedContact : c));
      return updatedContact;
    } catch (error) {
      console.error('Failed to update contact:', error);
      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await ContactService.deleteContact(id);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete contact:', error);
      throw error;
    }
  };

  return { contacts, loading, addContact, updateContact, deleteContact, setContacts };
};

const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const data = await DealService.fetchDeals();
        setDeals(data);
      } catch (error) {
        console.error('Failed to load deals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, []);

  const addDeal = async (dealData: any) => {
    try {
      const newDeal = await DealService.createDeal(dealData);
      setDeals(prev => [...prev, newDeal]);
      return newDeal;
    } catch (error) {
      console.error('Failed to create deal:', error);
      throw error;
    }
  };

  return { deals, loading, addDeal };
};

export default function CRMPage() {
  const { contacts, loading: contactsLoading, addContact, updateContact, deleteContact, setContacts } = useContacts();
  const { deals, loading: dealsLoading, addDeal } = useDeals();
  const [contactsSearchQuery, setContactsSearchQuery] = useState('');
  const [salesSearchQuery, setSalesSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'contacts' | 'deals' | 'analytics'>('contacts');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [addMode, setAddMode] = useState<'manual' | 'import' | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    company: '',
    location: '',
    email: '',
    phone: '',
    whatsapp: '',
    status: 'lead' as Contact['status'],
    value: 0,
    notes: ''
  });
  const [newSale, setNewSale] = useState({
    productName: '',
    productCategory: '',
    buyerName: '',
    address: '',
    email: '',
    phone: '',
    orderDate: new Date(),
    quantity: '',
    unitPrice: ''
  });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showBuyerSuggestions, setShowBuyerSuggestions] = useState(false);
  const [buyerSuggestions, setBuyerSuggestions] = useState<Contact[]>([]);
  
  const availableChannels = [
    { id: 'email', label: 'Email', icon: <Mail size={16} /> },
    { id: 'sms', label: 'SMS', icon: <Phone size={16} /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare size={16} /> }
  ];

  // Clean up duplicate contacts
  const cleanupDuplicateContacts = () => {
    console.log('Starting cleanup with', contacts.length, 'contacts');
    
    const contactMap = new Map();
    
    contacts.forEach((contact, index) => {
      const key = `${contact.name.toLowerCase()}-${contact.location.toLowerCase()}`;
      console.log(`Processing contact ${index + 1}: ${contact.name} (${contact.location}) - Key: ${key}`);
      
      if (contactMap.has(key)) {
        const existing = contactMap.get(key);
        console.log(`Found duplicate for ${contact.name}! Existing value: ${existing.value}, New value: ${contact.value}`);
        
        // Merge contacts by combining their values and keeping the most recent data
        const mergedContact = {
          ...existing,
          value: existing.value + contact.value, // Add values together
          lastContact: existing.lastContact > contact.lastContact ? existing.lastContact : contact.lastContact, // Keep most recent
          email: existing.email || contact.email, // Keep non-empty email
          phone: existing.phone || contact.phone, // Keep non-empty phone
          whatsapp: existing.whatsapp || contact.whatsapp, // Keep non-empty whatsapp
          notes: existing.notes && contact.notes ? 
            `${existing.notes}; ${contact.notes}` : 
            (existing.notes || contact.notes) // Combine notes
        };
        contactMap.set(key, mergedContact);
        console.log(`Merged contact ${contact.name} - New total value: ${mergedContact.value}`);
      } else {
        contactMap.set(key, contact);
        console.log(`Added new contact: ${contact.name}`);
      }
    });
    
    const uniqueContacts = Array.from(contactMap.values());
    console.log('Final unique contacts:', uniqueContacts.length);
    console.log('Unique contacts:', uniqueContacts.map(c => `${c.name} (${c.location}) - $${c.value}`));
    
    setContacts(uniqueContacts);
    
    // Show which contacts were merged
    const duplicates = contacts.length - uniqueContacts.length;
    if (duplicates > 0) {
      alert(`Merged ${duplicates} duplicate contacts! Total contacts reduced from ${contacts.length} to ${uniqueContacts.length}.`);
    } else {
      alert('No duplicates found!');
    }
  };

  // Handle buyer name input with autocomplete
  const handleBuyerNameChange = (value: string) => {
    setNewSale({...newSale, buyerName: value});
    
    if (value.length > 0) {
      // Filter contacts that match the input
      const suggestions = contacts.filter(contact => 
        contact.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Show max 5 suggestions
      
      setBuyerSuggestions(suggestions);
      setShowBuyerSuggestions(suggestions.length > 0);
    } else {
      setShowBuyerSuggestions(false);
      setBuyerSuggestions([]);
    }
  };

  // Handle selecting a suggestion
  const handleSelectBuyer = (contact: Contact) => {
    setNewSale({
      ...newSale, 
      buyerName: contact.name,
      address: contact.location,
      email: contact.email,
      phone: contact.phone
    });
    setShowBuyerSuggestions(false);
    setBuyerSuggestions([]);
    
    // Show a brief success message
    console.log(`Selected contact: ${contact.name} - Auto-filled address, email, and phone`);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking on the suggestions dropdown
      if (showBuyerSuggestions && !target.closest('[data-suggestions]')) {
        setShowBuyerSuggestions(false);
        setBuyerSuggestions([]);
      }
    };

    if (showBuyerSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showBuyerSuggestions]);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(contactsSearchQuery.toLowerCase()) ||
                         contact.location.toLowerCase().includes(contactsSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Function to get deals for a specific contact
  const getContactDeals = (contactId: string) => {
    // Find the contact to get their name and location
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return [];
    
    // Match deals by buyer name and address
    const matchedDeals = deals.filter(deal => 
      deal.buyerName.toLowerCase() === contact.name.toLowerCase() &&
      deal.address.toLowerCase() === contact.location.toLowerCase()
    );
    
    // Sort deals by order date (most recent first)
    const sortedDeals = matchedDeals.sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
    
    console.log(`Contact: ${contact.name} (${contact.location})`);
    console.log(`Contact value: $${contact.value}`);
    console.log(`Found ${sortedDeals.length} deals:`, sortedDeals.map(d => `${d.productName}: ${d.quantity} × $${d.unitPrice} = $${d.quantity * d.unitPrice}`));
    
    return sortedDeals;
  };

  // Function to calculate total sales for a contact
  const getContactTotalSales = (contactId: string) => {
    const contactDeals = getContactDeals(contactId);
    return contactDeals.reduce((total, deal) => total + (deal.quantity * deal.unitPrice), 0);
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.productName.toLowerCase().includes(salesSearchQuery.toLowerCase()) ||
                         deal.buyerName.toLowerCase().includes(salesSearchQuery.toLowerCase()) ||
                         deal.address.toLowerCase().includes(salesSearchQuery.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => 
    new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

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

  const handleAddContact = async () => {
    if (newContact.name && newContact.location) {
      try {
        await addContact({
        name: newContact.name,
        company: '', // Add company field
        location: newContact.location,
        email: newContact.email,
        phone: newContact.phone,
          whatsapp: newContact.whatsapp,
        status: newContact.status,
        value: newContact.value,
        notes: newContact.notes,
        owner_id: 1 // Add required owner_id
        });
        setNewContact({ name: '', company: '', location: '', email: '', phone: '', whatsapp: '', status: 'lead', value: 0, notes: '' });
      setShowAddModal(false);
      setAddMode(null);
      } catch (error) {
        console.error('Failed to add contact:', error);
        // Handle error (show notification, etc.)
      }
    }
  };

  const handleAddSale = async () => {
    if (newSale.productName && newSale.buyerName && newSale.address) {
      try {
        // First create the deal
        const createdDeal = await addDeal({
          productName: newSale.productName,
          productCategory: newSale.productCategory,
          buyerName: newSale.buyerName,
          address: newSale.address,
          email: newSale.email,
          phone: newSale.phone,
          orderDate: newSale.orderDate,
          quantity: parseInt(newSale.quantity) || 0,
          unitPrice: parseFloat(newSale.unitPrice) || 0
        });

        // Then create/update contact from the deal information
        try {
          // Check if contact already exists
          const existingContact = contacts.find(contact => 
            contact.name.toLowerCase() === newSale.buyerName.toLowerCase() &&
            contact.location.toLowerCase() === newSale.address.toLowerCase()
          );

          if (existingContact) {
            // Update existing contact's value
            const newValue = (parseInt(newSale.quantity) || 0) * (parseFloat(newSale.unitPrice) || 0);
            const updatedValue = existingContact.value + newValue;
            
            // Update the contact in the contacts list
            setContacts(prev => prev.map(c => 
              c.id === existingContact.id 
                ? { ...c, value: updatedValue, lastContact: new Date() }
                : c
            ));
            
            console.log(`Updated existing contact: ${existingContact.name} - New total value: ${formatCurrency(updatedValue)}`);
          } else {
            // Create new contact
            await addContact({
              name: newSale.buyerName,
              company: '', // No company info from sales
              location: newSale.address,
              email: newSale.email || '',
              phone: newSale.phone || '',
              whatsapp: '', // No WhatsApp from sales
              status: 'customer', // Anyone who buys becomes a customer
              value: (parseInt(newSale.quantity) || 0) * (parseFloat(newSale.unitPrice) || 0), // Set value to the purchase amount
              notes: `Customer from sale: ${newSale.productName}`,
              owner_id: 1
            });
            console.log(`Created new contact: ${newSale.buyerName}`);
          }
        } catch (contactError) {
          // If contact creation fails, it might already exist - that's okay
          console.log('Contact creation/update failed:', contactError);
        }

        setNewSale({
          productName: '',
          productCategory: '',
          buyerName: '',
          address: '',
          email: '',
          phone: '',
          orderDate: new Date(),
          quantity: '',
          unitPrice: ''
        });
        setShowAddSaleModal(false);
      } catch (error) {
        console.error('Failed to add sale:', error);
        // Handle error (show notification, etc.)
      }
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

  const handleEditContact = (contact: Contact) => {
    setNewContact({
      name: contact.name,
      company: contact.company,
      location: contact.location,
      email: contact.email,
      phone: contact.phone,
      whatsapp: contact.whatsapp,
      status: contact.status,
      value: contact.value,
      notes: contact.notes
    });
    setSelectedContact(contact);
    setShowEditModal(true);
  };

  const handleUpdateContact = async () => {
    if (selectedContact && newContact.name && newContact.location) {
      try {
        // Check if this is a sales-generated contact (ID starts with "sales-")
        if (selectedContact.id.startsWith('sales-')) {
          // For sales-generated contacts, we can't update them via API
          // Just close the modal and show a message
          alert('Sales-generated contacts cannot be updated. They are automatically created from sales data.');
          setNewContact({ name: '', company: '', location: '', email: '', phone: '', whatsapp: '', status: 'lead', value: 0, notes: '' });
          setShowEditModal(false);
          setSelectedContact(null);
        } else {
          // For API contacts, call the update API
          await updateContact({
            id: selectedContact.id,
            name: newContact.name,
            company: newContact.company,
            location: newContact.location,
            email: newContact.email,
            phone: newContact.phone,
            whatsapp: newContact.whatsapp,
            status: newContact.status,
            value: newContact.value,
            notes: newContact.notes,
            owner_id: 1
          });
          
          setNewContact({ name: '', company: '', location: '', email: '', phone: '', whatsapp: '', status: 'lead', value: 0, notes: '' });
          setShowEditModal(false);
          setSelectedContact(null);
        }
      } catch (error) {
        console.error('Failed to update contact:', error);
      }
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact? This will permanently remove the contact and ALL their sales history (deals, revenue, etc.). This action cannot be undone.')) {
      try {
        // Check if this is a sales-generated contact (ID starts with "sales-")
        if (contactId.startsWith('sales-')) {
          // For sales-generated contacts, we can't delete them via API
          // Just show a message
          alert('Sales-generated contacts cannot be deleted. They are automatically created from sales data.');
          setErrorMessage(null);
        } else {
          // For API contacts, call the delete API
        await deleteContact(contactId);
          setErrorMessage(null);
        }
      } catch (error) {
        console.error('Failed to delete contact:', error);
        // Show error message to user
        const message = error instanceof Error ? error.message : 'Failed to delete contact';
        setErrorMessage(message);
        // Also try alert as fallback
        alert(message);
      }
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
          <div style={{ display: 'flex', gap: '12px' }}>
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
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Plus size={20} />
              Add Contact
            </button>
            <button
              onClick={() => setShowAddSaleModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <DollarSign size={20} />
              Add Sale
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Users size={20} color="var(--mc-sidebar-bg)" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Contacts</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {contacts.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <DollarSign size={20} color="#10b981" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Pipeline Value</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {formatCurrency(totalValue)}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Target size={20} color="#f59e0b" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Active Deals</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {activeDeals.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <TrendingUp size={20} color="#8b5cf6" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Completed Sales</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {completedDeals.length}
            </div>
          </div>
        </div>

      {/* Error Message */}
      {errorMessage && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              !
            </div>
            <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '500' }}>
              {errorMessage}
            </span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>
      )}

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
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          
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
                        borderRadius: '20px',
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
                            borderRadius: '20px', 
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
                          onClick={() => handleEditContact(contact)}
                          style={{ 
                            padding: '6px', 
                            border: 'none', 
                            borderRadius: '20px', 
                            background: '#f3f4f6', 
                            color: '#6b7280', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }} 
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#f0f9ff';
                            e.currentTarget.style.color = '#0ea5e9';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                          title="Edit Contact"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleChatContact(contact)}
                          style={{ 
                            padding: '6px', 
                            border: 'none', 
                            borderRadius: '20px', 
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
                            borderRadius: '20px', 
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
              borderRadius: '20px',
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
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
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
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
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
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
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
                          <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '20px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${percentage}%`, 
                              height: '100%', 
                              backgroundColor: customer.color,
                              borderRadius: '20px',
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
            borderRadius: '20px',
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
                  setNewContact({ name: '', company: '', location: '', email: '', phone: '', whatsapp: '', status: 'lead', value: 0, notes: '' });
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
                    borderRadius: '20px',
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
                    borderRadius: '20px',
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
                      borderRadius: '20px',
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
                      borderRadius: '20px',
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
                      borderRadius: '20px',
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
                      borderRadius: '20px',
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
                        borderRadius: '20px',
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
                      type="text"
                      value={newContact.value}
                      onChange={(e) => setNewContact({...newContact, value: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
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
                      borderRadius: '20px',
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
                    setNewContact({ name: '', company: '', location: '', email: '', phone: '', whatsapp: '', status: 'lead', value: 0, notes: '' });
                  }}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
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
                      borderRadius: '20px',
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
                    borderRadius: '20px',
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
                      borderRadius: '20px',
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

      {/* Edit Contact Modal */}
      {showEditModal && selectedContact && (
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
            borderRadius: '20px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Edit Contact
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedContact(null);
                  setNewContact({ name: '', company: '', location: '', email: '', phone: '', whatsapp: '', status: 'lead', value: 0, notes: '' });
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    borderRadius: '20px',
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
                    borderRadius: '20px',
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
                    borderRadius: '20px',
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
                    borderRadius: '20px',
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
                    borderRadius: '20px',
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
                    type="text"
                    value={newContact.value}
                    onChange={(e) => setNewContact({...newContact, value: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
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
                    borderRadius: '20px',
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedContact(null);
                    setNewContact({ name: '', company: '', location: '', email: '', phone: '', whatsapp: '', status: 'lead', value: 0, notes: '' });
                  }}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
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
                  onClick={handleUpdateContact}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '20px',
                    background: 'var(--mc-sidebar-bg-hover)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Update Contact
                </button>
              </div>
            </div>
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
            borderRadius: '20px',
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
                    borderRadius: '20px',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '20px', border: '1px solid #e5e7eb' }}>
                    <Mail size={16} color="#6b7280" />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Email</div>
                      <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{selectedContact.email}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '20px', border: '1px solid #e5e7eb' }}>
                    <Phone size={16} color="#6b7280" />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Phone</div>
                      <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{selectedContact.phone}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '20px', border: '1px solid #e5e7eb' }}>
                    <MessageSquare size={16} color="#6b7280" />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>WhatsApp</div>
                      <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{selectedContact.whatsapp}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales History Section */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                  Sales History
                </h3>
                {(() => {
                  const contactDeals = getContactDeals(selectedContact.id);
                  const totalSales = getContactTotalSales(selectedContact.id);
                  
                  return (
                    <div>
                      {contactDeals.length > 0 ? (
                 <div>
                   <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                     {contactDeals.map((deal, index) => (
                              <div key={index} style={{ 
                                padding: '16px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                marginBottom: '12px',
                                backgroundColor: '#fafafa'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                                    {deal.productName}
                                  </div>
                                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>
                                    {formatCurrency(deal.quantity * deal.unitPrice)}
                                  </div>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                                  <div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Quantity</div>
                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{deal.quantity}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Unit Price</div>
                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{formatCurrency(deal.unitPrice)}</div>
                                  </div>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                  <div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Category</div>
                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{deal.productCategory}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Order Date</div>
                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{formatDate(deal.orderDate)}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '32px', 
                          backgroundColor: '#f9fafb', 
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <Target size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
                          <div style={{ fontSize: '16px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>
                            No Sales Yet
                          </div>
                          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                            This contact hasn't made any purchases yet
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
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
                    borderRadius: '20px',
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
            borderRadius: '20px',
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
                    borderRadius: '20px',
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
                    borderRadius: '20px',
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

      {/* Add Sale Modal */}
      {showAddSaleModal && (
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
            borderRadius: '20px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Add New Sale
              </h2>
              <button
                onClick={() => {
                  setShowAddSaleModal(false);
                  setNewSale({
                    productName: '',
                    productCategory: '',
                    buyerName: '',
                    address: '',
                    email: '',
                    phone: '',
                    orderDate: new Date(),
                    quantity: '1',
                    unitPrice: '0'
                  });
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '100%', boxSizing: 'border-box' }}>
              {/* Product Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newSale.productName}
                    onChange={(e) => setNewSale({...newSale, productName: e.target.value})}
                    placeholder="e.g., Dell Latitude 5520 Laptop"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Product Category
                  </label>
                  <input
                    type="text"
                    value={newSale.productCategory}
                    onChange={(e) => setNewSale({...newSale, productCategory: e.target.value})}
                    placeholder="e.g., Electronics, Furniture"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Buyer Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Buyer Name *
                  </label>
                  <input
                    type="text"
                    value={newSale.buyerName}
                    onChange={(e) => handleBuyerNameChange(e.target.value)}
                    placeholder="e.g., Sarah Johnson"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {showBuyerSuggestions && buyerSuggestions.length > 0 && (
                    <div 
                      data-suggestions
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}
                    >
                      {buyerSuggestions.map((contact, index) => (
                        <div
                          key={contact.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectBuyer(contact);
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            borderBottom: index < buyerSuggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                              {contact.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {contact.location} • {contact.status}
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                            {formatCurrency(contact.value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Address *
                  </label>
                  <input
                    type="text"
                    value={newSale.address}
                    onChange={(e) => setNewSale({...newSale, address: e.target.value})}
                    placeholder="e.g., San Francisco, CA"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={newSale.email}
                    onChange={(e) => setNewSale({...newSale, email: e.target.value})}
                    placeholder="sarah.johnson@techcorp.com"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
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
                    value={newSale.phone}
                    onChange={(e) => setNewSale({...newSale, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Sale Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Sale Date
                  </label>
                  <input
                    type="date"
                    value={newSale.orderDate.toISOString().split('T')[0]}
                    onChange={(e) => setNewSale({...newSale, orderDate: new Date(e.target.value)})}
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={newSale.quantity}
                    onChange={(e) => setNewSale({...newSale, quantity: e.target.value})}
                    placeholder="Enter quantity"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Unit Price ($)
                  </label>
                  <input
                    type="text"
                    value={newSale.unitPrice}
                    onChange={(e) => setNewSale({...newSale, unitPrice: e.target.value})}
                    placeholder="Enter unit price"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Total Price Display */}
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f9fafb', 
                borderRadius: '20px', 
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Total Price</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                  {formatCurrency(parseInt(newSale.quantity) * parseFloat(newSale.unitPrice))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => {
                    setShowAddSaleModal(false);
                    setNewSale({
                      productName: '',
                      productCategory: '',
                      buyerName: '',
                      address: '',
                      email: '',
                      phone: '',
                      orderDate: new Date(),
                      quantity: '1',
                      unitPrice: '0'
                    });
                  }}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
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
                  onClick={handleAddSale}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '20px',
                    background: '#10b981',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Add Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
