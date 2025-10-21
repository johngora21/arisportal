import { getApiUrl } from '../../../config/api';

export interface Contact {
  id: string;
  name: string;
  company: string;
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
  company: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  value: number;
  notes: string;
  owner_id: number;
}

export interface ContactUpdateData extends Partial<ContactCreateData> {
  id: string;
}



// Database service functions (now using real API calls)
export class ContactService {

  // Fetch all contacts from database
  static async fetchContacts(): Promise<Contact[]> {
    try {
      const response = await fetch(getApiUrl('CRM.CONTACTS'));
      if (!response.ok) throw new Error('Failed to fetch contacts');
      
      const contacts = await response.json();
      return contacts.map((contact: any) => this.mapApiToContact(contact));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      // Fallback to mock data if API fails
      return [];
    }
  }

  // Create new contact
  static async createContact(data: ContactCreateData): Promise<Contact> {
    try {
      const response = await fetch(getApiUrl('CRM.CONTACTS'), {
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
      const response = await fetch(`${getApiUrl('CRM.CONTACTS')}/${data.id}`, {
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
      // Fallback to mock update - no mock data available
      throw new Error('Contact not found');
    }
  }

  // Delete contact
  static async deleteContact(id: string): Promise<void> {
    try {
      const response = await fetch(`${getApiUrl('CRM.CONTACTS')}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error; // Re-throw the error so it can be handled by the calling function
    }
  }

  // Map API response to Contact interface
  private static mapApiToContact(apiContact: any): Contact {
    return {
      id: apiContact.id.toString(),
      name: apiContact.name,
      company: apiContact.company || '',
      location: apiContact.location || '',
      email: apiContact.email || '',
      phone: apiContact.phone || '',
      whatsapp: apiContact.whatsapp || '',
      status: apiContact.status || 'lead',
      lastContact: new Date(apiContact.created_at),
      value: apiContact.value || 0,
      tags: [], // Tags not implemented in backend yet
      notes: apiContact.notes || ''
    };
  }
}
