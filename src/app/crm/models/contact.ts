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

// Database service functions (to be implemented with actual DB calls)
export class ContactService {
  // Fetch all contacts from database
  static async fetchContacts(): Promise<Contact[]> {
    // TODO: Replace with actual database query
    // Example: const contacts = await db.query('SELECT * FROM contacts');
    // return contacts.map(row => this.mapDbRowToContact(row));
    
    // For now, return mock data
    return mockContacts;
  }

  // Create new contact
  static async createContact(data: ContactCreateData): Promise<Contact> {
    // TODO: Replace with actual database insert
    // Example: const result = await db.query('INSERT INTO contacts (...) VALUES (...) RETURNING *');
    // return this.mapDbRowToContact(result.rows[0]);
    
    // For now, return mock creation
    const newContact: Contact = {
      id: Date.now().toString(),
      ...data,
      lastContact: new Date(),
      tags: []
    };
    return newContact;
  }

  // Update existing contact
  static async updateContact(data: ContactUpdateData): Promise<Contact> {
    // TODO: Replace with actual database update
    // Example: const result = await db.query('UPDATE contacts SET ... WHERE id = $1 RETURNING *');
    // return this.mapDbRowToContact(result.rows[0]);
    
    // For now, return mock update
    const existingContact = mockContacts.find(c => c.id === data.id);
    if (!existingContact) throw new Error('Contact not found');
    
    return { ...existingContact, ...data };
  }

  // Delete contact
  static async deleteContact(id: string): Promise<void> {
    // TODO: Replace with actual database delete
    // Example: await db.query('DELETE FROM contacts WHERE id = $1', [id]);
    
    // For now, just log
    console.log(`Deleting contact with id: ${id}`);
  }

  // Map database row to Contact interface
  private static mapDbRowToContact(row: any): Contact {
    return {
      id: row.id,
      name: row.name,
      location: row.location,
      email: row.email,
      phone: row.phone,
      whatsapp: row.whatsapp,
      status: row.status,
      lastContact: new Date(row.last_contact),
      value: row.value,
      tags: row.tags ? JSON.parse(row.tags) : [],
      notes: row.notes
    };
  }
}
