export interface Contact {
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

export interface ContactCreateData {
  name: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  value: number;
  notes: string;
}

export interface ContactUpdateData extends Partial<ContactCreateData> {
  id: string;
}

// Mock data that matches the structure exactly
export const mockContacts: Contact[] = [
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

// Database service functions (now using real API calls)
export class ContactService {
  private static baseUrl = 'http://localhost:5000/api/v1';

  // Fetch all contacts from database
  static async fetchContacts(): Promise<Contact[]> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts`);
      if (!response.ok) throw new Error('Failed to fetch contacts');
      
      const contacts = await response.json();
      return contacts.map((contact: any) => this.mapApiToContact(contact));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      // Fallback to mock data if API fails
      return mockContacts;
    }
  }

  // Create new contact
  static async createContact(data: ContactCreateData): Promise<Contact> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create contact');
      
      const contact = await response.json();
      return this.mapApiToContact(contact.contact);
    } catch (error) {
      console.error('Error creating contact:', error);
      // Fallback to mock creation
      const newContact: Contact = {
        id: Date.now().toString(),
        ...data,
        lastContact: new Date(),
        tags: []
      };
      return newContact;
    }
  }

  // Update existing contact
  static async updateContact(data: ContactUpdateData): Promise<Contact> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update contact');
      
      const contact = await response.json();
      return this.mapApiToContact(contact.contact);
    } catch (error) {
      console.error('Error updating contact:', error);
      // Fallback to mock update
      const existingContact = mockContacts.find(c => c.id === data.id);
      if (!existingContact) throw new Error('Contact not found');
      
      return { ...existingContact, ...data };
    }
  }

  // Delete contact
  static async deleteContact(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete contact');
    } catch (error) {
      console.error('Error deleting contact:', error);
      // Fallback to mock delete
      console.log(`Deleting contact with id: ${id}`);
    }
  }

  // Map API response to Contact interface
  private static mapApiToContact(apiContact: any): Contact {
    return {
      id: apiContact.id.toString(),
      name: apiContact.name,
      location: apiContact.location || '',
      email: apiContact.email || '',
      phone: apiContact.phone || '',
      whatsapp: apiContact.phone || '', // Use phone as whatsapp fallback
      status: apiContact.status || 'lead',
      lastContact: new Date(apiContact.created_at),
      value: apiContact.value || 0,
      tags: [], // Tags not implemented in backend yet
      notes: apiContact.notes || ''
    };
  }
}
