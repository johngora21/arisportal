'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Users, Calendar, DollarSign, TrendingUp, Globe, Facebook, Twitter, Linkedin } from 'lucide-react';

// Data model for bulk order pools (modal-friendly)
type BulkOrderParticipant = { name: string; company: string; quantity: number; joinedDate: string };
type BulkOrderPool = {
  id: string;
  title: string;
  category: string;
  image?: string;
  tags?: string[];
  images?: string[];
  // Optional media and contacts
  videos?: string[];
  supplierContactName?: string;
  supplierContactPhone?: string;
  supplierContactEmail?: string;
  supplierLocation?: string;
  supplierWebsite?: string;
  supplierFacebook?: string;
  supplierTwitter?: string;
  supplierLinkedIn?: string;
  organizerContactName?: string;
  organizerContactPhone?: string;
  organizerContactEmail?: string;
  organizerLocation?: string;
  organizerWebsite?: string;
  organizerFacebook?: string;
  organizerTwitter?: string;
  organizerLinkedIn?: string;
  manufacturer?: string;
  leadTimeDays?: number;
  paymentTerms?: string;
  returnPolicy?: string;
  logisticsDelivery?: string[];
  logisticsPickup?: string[];
  specs?: string[];
  included?: string[];
  organizerRating?: number;
  targetQuantity: number;
  pricePerUnit: number;
  deadline: string;
  organizer: string;
  description?: string;
  participants: BulkOrderParticipant[];
  status: 'active' | 'closed' | 'ready';
};

export function BulkOrdersModule() {
  const [activePool, setActivePool] = useState<string | null>(null);
  const [showPoolModal, setShowPoolModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<BulkOrderPool | null>(null);
  const [mediaIndex, setMediaIndex] = useState<number>(0);
  const [joinError, setJoinError] = useState<string>('');
  const [joinSuccess, setJoinSuccess] = useState<string>('');
  const [joinQty, setJoinQty] = useState<number>(1);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentPool, setPaymentPool] = useState<BulkOrderPool | null>(null);
  const [paymentQty, setPaymentQty] = useState<number>(1);
  const [paymentError, setPaymentError] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'mno' | 'card' | 'control'>('mno');
  const [mnoPhone, setMnoPhone] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [controlNumber, setControlNumber] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState({
    product: '',
    category: '',
    description: '',
    targetQuantity: '',
    targetPrice: '',
    deadline: '',
    // Media
    image: '',
    images: '',
    videos: '',
    tags: '',
    // Supplier details
    manufacturer: '',
    supplierContactName: '',
    supplierContactPhone: '',
    supplierContactEmail: '',
    supplierLocation: '',
    supplierWebsite: '',
    supplierFacebook: '',
    supplierTwitter: '',
    supplierLinkedIn: '',
    // Organizer details
    organizer: '',
    organizerContactName: '',
    organizerContactPhone: '',
    organizerContactEmail: '',
    organizerLocation: '',
    organizerWebsite: '',
    organizerFacebook: '',
    organizerTwitter: '',
    organizerLinkedIn: '',
    // Product details
    specs: '',
    included: '',
    // Logistics
    logisticsDelivery: '',
    logisticsPickup: '',
    // Terms
    paymentTerms: '',
    returnPolicy: '',
    leadTimeDays: ''
  });
  const [createImages, setCreateImages] = useState<string[]>([]);
  const [createVideos, setCreateVideos] = useState<string[]>([]);
  const [createTags, setCreateTags] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<string>('');
  const [newVideo, setNewVideo] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [createSpecs, setCreateSpecs] = useState<string[]>([]);
  const [createIncluded, setCreateIncluded] = useState<string[]>([]);
  const [createDelivery, setCreateDelivery] = useState<string[]>([]);
  const [createPickup, setCreatePickup] = useState<string[]>([]);
  const [newSpec, setNewSpec] = useState<string>('');
  const [newIncluded, setNewIncluded] = useState<string>('');
  const [newDelivery, setNewDelivery] = useState<string>('');
  const [newPickup, setNewPickup] = useState<string>('');
  const [supplierLinkType, setSupplierLinkType] = useState<string>('Website');
  const [supplierLinkUrl, setSupplierLinkUrl] = useState<string>('');
  const [createSupplierLinks, setCreateSupplierLinks] = useState<Array<{ type: string; url: string }>>([]);
  const [organizerLinkType, setOrganizerLinkType] = useState<string>('Website');
  const [organizerLinkUrl, setOrganizerLinkUrl] = useState<string>('');
  const [createOrganizerLinks, setCreateOrganizerLinks] = useState<Array<{ type: string; url: string }>>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  useEffect(() => {
    const handler = () => setShowCreateModal(true);
    window.addEventListener('open-create-pool', handler as any);
    return () => window.removeEventListener('open-create-pool', handler as any);
  }, []);

  const initialBulkOrders: BulkOrderPool[] = [
    {
      id: 'pool1',
      title: 'Office Chairs Bulk Order',
      category: 'Furniture',
      image: 'https://images.unsplash.com/photo-1582582494700-1bf86bd7b98a?q=80&w=1200&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1582582494700-1bf86bd7b98a?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519967480003-f1f117a06f76?q=80&w=800&auto=format&fit=crop'
      ],
      tags: ['Ergonomic', 'Mesh', 'Armrest', 'Adjustable'],
      manufacturer: 'ErgoMakers Ltd',
      supplierContactName: 'Aisha Mwinyi',
      supplierContactPhone: '+255 712 345 678',
      supplierContactEmail: 'sales@ergomakers.example',
      supplierLocation: 'Dar es Salaam, Tanzania',
      supplierWebsite: 'https://ergomakers.example',
      supplierFacebook: 'https://facebook.com/ergomakers',
      supplierTwitter: 'https://twitter.com/ergomakers',
      supplierLinkedIn: 'https://linkedin.com/company/ergomakers',
      leadTimeDays: 14,
      paymentTerms: '50% deposit, 50% on dispatch',
      returnPolicy: '7 days DOA replacement',
      logisticsDelivery: ['Door delivery (city centers)', 'Regional freight'],
      logisticsPickup: ['Dar es Salaam Hub', 'Arusha Hub'],
      specs: ['Ergonomic mesh back', 'Adjustable height & tilt', 'Max load 120kg'],
      included: ['Chair unit', 'Assembly kit', 'User guide'],
      organizerRating: 4.7,
      organizerContactName: 'Moses Kimaro',
      organizerContactPhone: '+255 713 222 111',
      organizerContactEmail: 'moses@techhub.example',
      organizerLocation: 'Dar es Salaam, Tanzania',
      organizerWebsite: 'https://techhub.example',
      organizerFacebook: 'https://facebook.com/techhub',
      organizerTwitter: 'https://twitter.com/techhub',
      organizerLinkedIn: 'https://linkedin.com/company/techhub',
      targetQuantity: 100,
      
      pricePerUnit: 150000,
      
      deadline: '2025-01-15',
      organizer: 'TechHub Ltd',
      description: 'High-quality ergonomic office chairs with bulk pricing. Join this pool to get better rates.',
      participants: [
        { name: 'John M.', company: 'ABC Corp', quantity: 5, joinedDate: '2025-01-05' },
        { name: 'Sarah K.', company: 'XYZ Ltd', quantity: 10, joinedDate: '2025-01-06' },
        { name: 'Ahmed H.', company: 'Tech Solutions', quantity: 8, joinedDate: '2025-01-07' }
      ],
      status: 'active'
    },
    {
      id: 'pool2',
      title: 'Laptop Bulk Purchase',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=700&auto=format&fit=crop'
      ],
      tags: ['15-inch', '8GB RAM', 'SSD', 'Business'],
      manufacturer: 'CompTech Manufacturing',
      supplierContactName: 'John Doe',
      supplierContactPhone: '+255 714 555 000',
      supplierContactEmail: 'orders@comptech.example',
      supplierLocation: 'Arusha, Tanzania',
      supplierWebsite: 'https://comptech.example',
      supplierFacebook: 'https://facebook.com/comptech',
      supplierTwitter: 'https://twitter.com/comptech',
      supplierLinkedIn: 'https://linkedin.com/company/comptech',
      leadTimeDays: 10,
      paymentTerms: '30% deposit, balance Net 7',
      returnPolicy: '14 days limited return',
      logisticsDelivery: ['Courier (major cities)', 'Air freight (bulk)'],
      logisticsPickup: ['Dar es Salaam IT Hub'],
      specs: ['15" IPS display', 'Intel i5, 8GB RAM, 512GB SSD', 'Aluminum chassis'],
      included: ['Laptop', 'Charger', 'Carrying sleeve'],
      organizerRating: 4.8,
      organizerContactName: 'Neema Joseph',
      organizerContactPhone: '+255 715 444 333',
      organizerContactEmail: 'neema@soundmax.example',
      organizerLocation: 'Arusha, Tanzania',
      organizerWebsite: 'https://soundmax.example',
      organizerFacebook: 'https://facebook.com/soundmax',
      organizerTwitter: 'https://twitter.com/soundmax',
      organizerLinkedIn: 'https://linkedin.com/company/soundmax',
      targetQuantity: 50,
      
      pricePerUnit: 800000,
      
      deadline: '2025-01-20',
      organizer: 'SoundMax',
      description: '',
      participants: [
        { name: 'Maria L.', company: 'Design Studio', quantity: 3, joinedDate: '2025-01-08' },
        { name: 'Peter W.', company: 'Consulting Firm', quantity: 5, joinedDate: '2025-01-09' }
      ],
      status: 'active'
    },
    {
      id: 'pool3',
      title: 'Audio Equipment Pool',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=800&auto=format&fit=crop'
      ],
      tags: ['Speakers', 'Microphones', 'Studio', 'Pro'],
      manufacturer: 'ProSound Corp',
      supplierContactName: 'Peter Mushi',
      supplierContactPhone: '+255 716 777 888',
      supplierContactEmail: 'peter@prosound.example',
      supplierLocation: 'Mwanza, Tanzania',
      supplierWebsite: 'https://prosound.example',
      supplierFacebook: 'https://facebook.com/prosound',
      supplierTwitter: 'https://twitter.com/prosound',
      supplierLinkedIn: 'https://linkedin.com/company/prosound',
      leadTimeDays: 12,
      paymentTerms: 'Full payment on order',
      returnPolicy: 'No returns after unboxing',
      logisticsDelivery: ['Regional freight'],
      logisticsPickup: ['Mwanza Depot'],
      specs: ['2.1 Speaker set', 'Studio microphones', 'Balanced audio cables'],
      included: ['Speaker pair', 'Mic set', 'Cables'],
      organizerRating: 4.6,
      organizerContactName: 'Zainab Ali',
      organizerContactPhone: '+255 717 999 222',
      organizerContactEmail: 'zainab@comfortzone.example',
      organizerLocation: 'Mwanza, Tanzania',
      organizerWebsite: 'https://comfortzone.example',
      organizerFacebook: 'https://facebook.com/comfortzone',
      organizerTwitter: 'https://twitter.com/comfortzone',
      organizerLinkedIn: 'https://linkedin.com/company/comfortzone',
      targetQuantity: 200,
      
      pricePerUnit: 45000,
      
      deadline: '2025-01-10',
      organizer: 'ComfortZone',
      description: 'Professional audio equipment for offices and conference rooms.',
      participants: [
        { name: 'David K.', company: 'Media House', quantity: 15, joinedDate: '2025-01-03' },
        { name: 'Grace M.', company: 'Event Company', quantity: 20, joinedDate: '2025-01-04' },
        { name: 'James R.', company: 'Studio Inc', quantity: 10, joinedDate: '2025-01-05' }
      ],
      status: 'active'
    }
  ];

  const completedOrders = [
    {
      id: 'completed1',
      title: 'Desk Lamps Bulk Order',
      category: 'Electronics',
      finalQuantity: 75,
      finalParticipants: 15,
      finalDiscount: '18%',
      finalPricePerUnit: 20500,
      completedDate: '2024-12-20',
      organizer: 'OfficePro',
      status: 'completed'
    }
  ];

  const [pools, setPools] = useState<BulkOrderPool[]>(initialBulkOrders);

  // Filter pools based on search query and country
  const filteredPools = pools.filter(pool => {
    const matchesSearch = searchQuery === '' || 
      pool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCountry = selectedCountry === '' || 
      pool.supplierLocation?.toLowerCase().includes(selectedCountry.toLowerCase()) ||
      pool.organizerLocation?.toLowerCase().includes(selectedCountry.toLowerCase());
    
    return matchesSearch && matchesCountry;
  });

  const handleJoinPool = (pool: BulkOrderPool, qty: number) => {
    try {
      setJoinError('');
      setJoinSuccess('');
      // Prevent joining if target is reached
      const currentQty = pool.participants.reduce((sum, p) => sum + (p.quantity || 0), 0);
      if (currentQty >= pool.targetQuantity) {
        setJoinError('This pool is closed. Target quantity reached.');
        return;
      }
      if (!qty || qty < 1 || !Number.isFinite(qty)) {
        setJoinError('Enter a valid quantity (1 or more).');
        return;
      }
      const remaining = pool.targetQuantity - currentQty;
      if (qty > remaining) {
        setJoinError(`Only ${remaining} units remaining.`);
        return;
      }
      const updated: BulkOrderPool = {
        ...pool,
        participants: [
          ...pool.participants,
          { name: 'You', company: '—', quantity: Math.floor(qty), joinedDate: new Date().toISOString().slice(0, 10) }
        ]
      };
      setPools(prev => prev.map(p => (p.id === pool.id ? updated : p)));
      setSelectedPool(updated);
      setJoinSuccess(`Joined pool with ${Math.floor(qty)} unit${qty > 1 ? 's' : ''}.`);
    } catch (e) {
      setJoinError('Failed to join. Please try again.');
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button style={{
          padding: '12px 24px',
          backgroundColor: 'var(--mc-sidebar-bg-hover)',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onClick={() => setShowCreateModal(true)}
        >
          <Plus size={16} />
          Create Pool
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'flex-end' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search pools by title, organizer, supplier, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '300px',
              padding: '12px 16px 12px 44px',
              border: '1px solid #e5e7eb',
              borderRadius: '24px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--mc-sidebar-bg)'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}
          />
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        <div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{
              width: '200px',
              padding: '12px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '24px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--mc-sidebar-bg)'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}
          >
            <option value="">All Countries</option>
            <option value="tanzania">Tanzania</option>
            <option value="kenya">Kenya</option>
            <option value="uganda">Uganda</option>
            <option value="rwanda">Rwanda</option>
            <option value="burundi">Burundi</option>
            <option value="south africa">South Africa</option>
            <option value="nigeria">Nigeria</option>
            <option value="ghana">Ghana</option>
            <option value="ethiopia">Ethiopia</option>
            <option value="egypt">Egypt</option>
            <option value="morocco">Morocco</option>
            <option value="algeria">Algeria</option>
            <option value="tunisia">Tunisia</option>
            <option value="libya">Libya</option>
            <option value="sudan">Sudan</option>
            <option value="south sudan">South Sudan</option>
            <option value="chad">Chad</option>
            <option value="niger">Niger</option>
            <option value="mali">Mali</option>
            <option value="burkina faso">Burkina Faso</option>
            <option value="senegal">Senegal</option>
            <option value="guinea">Guinea</option>
            <option value="sierra leone">Sierra Leone</option>
            <option value="liberia">Liberia</option>
            <option value="ivory coast">Ivory Coast</option>
            <option value="gambia">Gambia</option>
            <option value="guinea-bissau">Guinea-Bissau</option>
            <option value="cape verde">Cape Verde</option>
            <option value="mauritania">Mauritania</option>
            <option value="mali">Mali</option>
            <option value="niger">Niger</option>
            <option value="chad">Chad</option>
            <option value="cameroon">Cameroon</option>
            <option value="central african republic">Central African Republic</option>
            <option value="democratic republic of congo">Democratic Republic of Congo</option>
            <option value="republic of congo">Republic of Congo</option>
            <option value="gabon">Gabon</option>
            <option value="equatorial guinea">Equatorial Guinea</option>
            <option value="sao tome and principe">Sao Tome and Principe</option>
            <option value="angola">Angola</option>
            <option value="zambia">Zambia</option>
            <option value="zimbabwe">Zimbabwe</option>
            <option value="botswana">Botswana</option>
            <option value="namibia">Namibia</option>
            <option value="lesotho">Lesotho</option>
            <option value="swaziland">Swaziland</option>
            <option value="madagascar">Madagascar</option>
            <option value="mauritius">Mauritius</option>
            <option value="seychelles">Seychelles</option>
            <option value="comoros">Comoros</option>
            <option value="djibouti">Djibouti</option>
            <option value="somalia">Somalia</option>
            <option value="eritrea">Eritrea</option>
            <option value="malawi">Malawi</option>
            <option value="mozambique">Mozambique</option>
          </select>
        </div>
      </div>

      {/* Active Bulk Orders */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Active Bulk Orders {filteredPools.length !== pools.length && `(${filteredPools.length} of ${pools.length})`}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {filteredPools.map((order) => {
            const targetQty = order.targetQuantity;
            const currentQty = Array.isArray(order.participants)
              ? order.participants.reduce((sum: number, p: any) => sum + (p.quantity || 0), 0)
              : 0;
            const isClosed = currentQty >= targetQty;
            return (
            <div
              key={order.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
              onClick={() => { setSelectedPool(order); setMediaIndex(0); setJoinError(''); setJoinSuccess(''); setJoinQty(1); setShowPoolModal(true); }}
            >
              {/* Image */}
              {order.image && (
                <div style={{
                  position: 'relative',
                  width: 'calc(100% + 40px)',
                  height: '180px',
                  margin: '-20px -20px 12px -20px',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  overflow: 'hidden'
                }}>
                  {/* Status badge on top-right of image */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '6px 10px',
                    backgroundColor: isClosed ? '#9ca3af' : '#10b981',
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                  }}>
                    {isClosed ? 'Closed' : 'Active'}
                  </div>
                  <img src={order.image} alt={order.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {order.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    by {order.organizer}
                  </p>
                  {order.manufacturer && (
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      Supplier: <span style={{ color: '#1f2937', fontWeight: 600 }}>{order.manufacturer}</span>
                    </div>
                  )}
                </div>
                {/* moved status badge onto image */}
              </div>

              {/* Key Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Price per Unit</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#059669' }}>TZS {order.pricePerUnit.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Active Units</div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>
                    <span style={{ color: '#059669' }}>{currentQty}</span>
                    <span style={{ color: '#6b7280' }}> / </span>
                    <span style={{ color: '#1f2937' }}>{targetQty}</span>
                    <span style={{ color: '#6b7280' }}> units</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Deadline</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>{order.deadline}</div>
                </div>
              </div>

              {/* Description under key info (cards) */}
              {order.description && (
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px', lineHeight: '1.5' }}>
                  {order.description}
                </p>
              )}

              {/* Tags appear below the description */}
              {Array.isArray(order.tags) && order.tags.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginBottom: '12px'
                }}>
                  {order.tags.slice(0, 4).map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f9fafb',
                        color: '#6b7280',
                        borderRadius: '20px',
                        fontSize: '10px',
                        fontWeight: 500,
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {order.tags.length > 4 && (
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#f9fafb',
                      color: '#6b7280',
                      borderRadius: '20px',
                      fontSize: '10px',
                      fontWeight: 500,
                      border: '1px solid #e5e7eb'
                    }}>
                      +{order.tags.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {/* Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '12px',
                marginTop: '12px'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} />
                  <span><span style={{ fontWeight: 600, color: '#1f2937' }}>{order.participants.length}</span>&nbsp;people</span>
                </div>
                <button style={{
                  backgroundColor: 'var(--mc-sidebar-bg-hover)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: isClosed ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                disabled={isClosed}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isClosed) return;
                  setPaymentPool(order);
                  setPaymentQty(1);
                  setPaymentError('');
                  setPaymentSuccess('');
                  setPaymentMethod('mno');
                  setMnoPhone('');
                  setCardName('');
                  setCardNumber('');
                  setCardExpiry('');
                  setCardCvv('');
                  setControlNumber('');
                  setShowPaymentModal(true);
                }}
                onMouseEnter={(e) => {
                  if (!isClosed) e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isClosed) e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
                }}
                >
                  {isClosed ? 'Closed' : 'Join Pool'}
                </button>
              </div>

              {/* Removed participants display */}
            </div>
          );})}
        </div>
      </div>

      {/* Pool Details Modal */}
      {showPoolModal && selectedPool && (
        <div style={{
          position: 'fixed',
          inset: 0 as any,
          backgroundColor: 'rgba(0,0,0,0.45)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: 'min(920px, 96vw)',
            maxHeight: '95vh',
            borderRadius: '20px',
            overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            {/* Media gallery (images/videos) */}
            {(() => {
              const images = (selectedPool.images && selectedPool.images.length > 0)
                ? selectedPool.images
                : (selectedPool.image ? [selectedPool.image] : []);
              const videos = selectedPool.videos || [];
              const mediaItems: Array<{ type: 'image' | 'video'; src: string }> = [
                ...images.map((src) => ({ type: 'image' as const, src })),
                ...videos.map((src) => ({ type: 'video' as const, src }))
              ];
              if (mediaItems.length === 0) return null;
              const current = mediaItems[Math.min(mediaIndex, mediaItems.length - 1)];
              return (
                <div style={{ position: 'relative', width: '100%', height: '380px', overflow: 'hidden', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', backgroundColor: '#000' }}>
                  {current.type === 'image' ? (
                    <img src={current.src} alt={selectedPool.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <video src={current.src} controls style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}
                  {/* Close button on media */}
                <button
                  onClick={() => setShowPoolModal(false)}
                  style={{
                      position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(0,0,0,0.45)', color: 'white',
                    border: 'none', borderRadius: '9999px', width: 32, height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
                  {/* Status badge on media */}
                <div style={{
                    position: 'absolute', top: '14px', left: '14px', padding: '8px 12px',
                  backgroundColor: selectedPool.status === 'active' ? '#10b981' : '#9ca3af', color: 'white',
                  borderRadius: 9999, fontSize: 12, fontWeight: 700
                }}>
                  {selectedPool.status === 'active' ? 'Active' : 'Closed'}
                </div>
                  {mediaItems.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setMediaIndex((i) => (i - 1 + mediaItems.length) % mediaItems.length); }}
                        style={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none', borderRadius: 9999, width: 32, height: 32, cursor: 'pointer' }}
                        aria-label="Previous"
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setMediaIndex((i) => (i + 1) % mediaItems.length); }}
                        style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none', borderRadius: 9999, width: 32, height: 32, cursor: 'pointer' }}
                        aria-label="Next"
                      >
                        ›
                      </button>
                      <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                        {mediaItems.map((_, idx) => (
                          <span key={idx} style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: idx === Math.min(mediaIndex, mediaItems.length - 1) ? '#10b981' : 'rgba(255,255,255,0.6)' }} />
                        ))}
              </div>
                    </>
            )}
                </div>
              );
            })()}

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Title */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>{selectedPool.title}</h2>
                  <div style={{ marginTop: 4, fontSize: 14, color: '#6b7280' }}>by {selectedPool.organizer}</div>
                  {selectedPool.manufacturer && (
                    <div style={{ marginTop: 2, fontSize: 12, color: '#6b7280' }}>Supplier: <span style={{ color: '#111827', fontWeight: 600 }}>{selectedPool.manufacturer}</span></div>
                  )}
                </div>
                {/* Close moved to image */}
              </div>

              {/* Description directly under title/supplier */}
              {selectedPool.description && (
                <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, margin: '8px 0 16px 0' }}>
                  {selectedPool.description}
                </p>
              )}

              {/* Tags appear below the description (modal) */}
              {Array.isArray(selectedPool.tags) && selectedPool.tags.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  margin: '0 0 16px 0'
                }}>
                  {selectedPool.tags.slice(0, 6).map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f9fafb',
                        color: '#6b7280',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 500,
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {selectedPool.tags.length > 6 && (
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#f9fafb',
                      color: '#6b7280',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 500,
                      border: '1px solid #e5e7eb'
                    }}>
                      +{selectedPool.tags.length - 6}
                    </span>
                  )}
                </div>
              )}

              

              {/* Specifications & Included */}
              {(selectedPool.specs || selectedPool.included) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  {selectedPool.specs && (
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Specifications</div>
                      <ul style={{ margin: 0, paddingLeft: 18, color: '#4b5563', fontSize: 13, lineHeight: 1.6 }}>
                        {selectedPool.specs.map((s, i) => (<li key={i}>{s}</li>))}
                      </ul>
                    </div>
                  )}
                  {selectedPool.included && (
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>What's Included</div>
                      <ul style={{ margin: 0, paddingLeft: 18, color: '#4b5563', fontSize: 13, lineHeight: 1.6 }}>
                        {selectedPool.included.map((s, i) => (<li key={i}>{s}</li>))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Logistics & Terms */}
              {(selectedPool.logisticsDelivery || selectedPool.logisticsPickup || selectedPool.paymentTerms || selectedPool.returnPolicy || selectedPool.leadTimeDays) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Logistics</div>
                    {selectedPool.logisticsDelivery && (
                      <div style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>Delivery Options</div>
                        <div style={{ fontSize: 13, color: '#374151' }}>{selectedPool.logisticsDelivery.join(', ')}</div>
                      </div>
                    )}
                    {selectedPool.logisticsPickup && (
                      <div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>Pickup Locations</div>
                        <div style={{ fontSize: 13, color: '#374151' }}>{selectedPool.logisticsPickup.join(', ')}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Terms</div>
                    {selectedPool.paymentTerms && (
                      <div style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>Payment Terms</div>
                        <div style={{ fontSize: 13, color: '#374151' }}>{selectedPool.paymentTerms}</div>
                      </div>
                    )}
                    {selectedPool.returnPolicy && (
                      <div style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>Return Policy</div>
                        <div style={{ fontSize: 13, color: '#374151' }}>{selectedPool.returnPolicy}</div>
                      </div>
                    )}
                    {typeof selectedPool.leadTimeDays === 'number' && (
                      <div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>Lead Time</div>
                        <div style={{ fontSize: 13, color: '#374151' }}>{selectedPool.leadTimeDays} days</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact info (Supplier and Organizer) */}
              {(selectedPool.manufacturer || selectedPool.organizer) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>Supplier</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{selectedPool.manufacturer}</div>
                    {(selectedPool.supplierContactName || selectedPool.supplierContactPhone || selectedPool.supplierContactEmail) && (
                      <div style={{ marginTop: 4 }}>
                        {selectedPool.supplierContactName && (
                          <div style={{ fontSize: 12, color: '#4b5563' }}>Contact: {selectedPool.supplierContactName}</div>
                        )}
                        {selectedPool.supplierContactPhone && (
                          <div style={{ fontSize: 12, color: '#4b5563' }}>Phone: {selectedPool.supplierContactPhone}</div>
                        )}
                        {selectedPool.supplierContactEmail && (
                          <div style={{ fontSize: 12, color: '#4b5563' }}>Email: {selectedPool.supplierContactEmail}</div>
                        )}
                        {selectedPool.supplierLocation && (
                          <div style={{ fontSize: 12, color: '#4b5563' }}>Location: {selectedPool.supplierLocation}</div>
                        )}
                        {(selectedPool.supplierWebsite || selectedPool.supplierFacebook || selectedPool.supplierTwitter || selectedPool.supplierLinkedIn) && (() => {
                          const iconProps = { size: 12, strokeWidth: 1.75 } as const;
                          const iconStyle: React.CSSProperties = { flexShrink: 0 };
                          const socials: Array<{ label: string; href: string; icon: JSX.Element }> = [];
                          if (selectedPool.supplierFacebook) socials.push({ label: 'Facebook', href: selectedPool.supplierFacebook, icon: <Facebook {...iconProps} style={iconStyle} /> });
                          if (selectedPool.supplierTwitter) socials.push({ label: 'Twitter', href: selectedPool.supplierTwitter, icon: <Twitter {...iconProps} style={iconStyle} /> });
                          if (selectedPool.supplierLinkedIn) socials.push({ label: 'LinkedIn', href: selectedPool.supplierLinkedIn, icon: <Linkedin {...iconProps} style={iconStyle} /> });
                          const limitedSocials = socials.slice(0, 2);
                          return (
                            <div style={{ fontSize: 12, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {selectedPool.supplierWebsite && (
                                <a href={selectedPool.supplierWebsite} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6, lineHeight: 1 }}>
                                  <span style={{ width: 18, height: 18, borderRadius: 9999, backgroundColor: '#1d4ed8', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Globe {...iconProps} style={{ ...iconStyle, color: '#fff' }} />
                                  </span>
                                  Website
                                </a>
                              )}
                              {limitedSocials.map((s, i) => (
                                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6, lineHeight: 1 }}>
                                  <span style={{ width: 18, height: 18, borderRadius: 9999, backgroundColor: '#1d4ed8', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {React.cloneElement(s.icon, { color: '#fff' })}
                                  </span>
                                  {s.label}
                                </a>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>Organizer</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{selectedPool.organizer}</div>
                    {(selectedPool.organizerContactName || selectedPool.organizerContactPhone || selectedPool.organizerContactEmail) && (
                      <div style={{ marginTop: 4 }}>
                        {selectedPool.organizerContactName && (
                          <div style={{ fontSize: 12, color: '#4b5563' }}>Contact: {selectedPool.organizerContactName}</div>
                        )}
                        {selectedPool.organizerContactPhone && (
                          <div style={{ fontSize: 12, color: '#4b5563' }}>Phone: {selectedPool.organizerContactPhone}</div>
                        )}
                        {selectedPool.organizerContactEmail && (
                          <div style={{ fontSize: 12, color: '#4b5563' }}>Email: {selectedPool.organizerContactEmail}</div>
                        )}
                        {selectedPool.organizerLocation && (
                          <div style={{ fontSize: 12, color: '#4b5563' }}>Location: {selectedPool.organizerLocation}</div>
                        )}
                        {(selectedPool.organizerWebsite || selectedPool.organizerFacebook || selectedPool.organizerTwitter || selectedPool.organizerLinkedIn) && (() => {
                          const iconProps = { size: 12, strokeWidth: 1.75 } as const;
                          const iconStyle: React.CSSProperties = { flexShrink: 0 };
                          const socials: Array<{ label: string; href: string; icon: JSX.Element }> = [];
                          if (selectedPool.organizerFacebook) socials.push({ label: 'Facebook', href: selectedPool.organizerFacebook, icon: <Facebook {...iconProps} style={iconStyle} /> });
                          if (selectedPool.organizerTwitter) socials.push({ label: 'Twitter', href: selectedPool.organizerTwitter, icon: <Twitter {...iconProps} style={iconStyle} /> });
                          if (selectedPool.organizerLinkedIn) socials.push({ label: 'LinkedIn', href: selectedPool.organizerLinkedIn, icon: <Linkedin {...iconProps} style={iconStyle} /> });
                          const limitedSocials = socials.slice(0, 2);
                          return (
                            <div style={{ fontSize: 12, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {selectedPool.organizerWebsite && (
                                <a href={selectedPool.organizerWebsite} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6, lineHeight: 1 }}>
                                  <span style={{ width: 18, height: 18, borderRadius: 9999, backgroundColor: '#1d4ed8', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Globe {...iconProps} style={{ ...iconStyle, color: '#fff' }} />
                                  </span>
                                  Website
                                </a>
                              )}
                              {limitedSocials.map((s, i) => (
                                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6, lineHeight: 1 }}>
                                  <span style={{ width: 18, height: 18, borderRadius: 9999, backgroundColor: '#1d4ed8', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {React.cloneElement(s.icon, { color: '#fff' })}
                                  </span>
                                  {s.label}
                                </a>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom key facts (Price per Unit, Active Units, Deadline) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 20, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>Price per Unit</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>TZS {selectedPool.pricePerUnit.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>Active Units</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {(() => {
                      const curr = selectedPool.participants.reduce((s, p) => s + (p.quantity || 0), 0);
                      return <><span style={{ color: '#059669' }}>{curr}</span><span style={{ color: '#6b7280' }}> / </span><span style={{ color: '#111827' }}>{selectedPool.targetQuantity}</span><span style={{ color: '#6b7280' }}> units</span></>;
                    })()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>Deadline</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#6b7280' }}>{selectedPool.deadline}</div>
                </div>
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ minHeight: 18 }}>
                  {joinError && <span style={{ color: '#dc2626', fontSize: 12 }}>{joinError}</span>}
                  {joinSuccess && <span style={{ color: '#059669', fontSize: 12 }}>{joinSuccess}</span>}
                </div>
                <button
                  style={{ backgroundColor: 'var(--mc-sidebar-bg-hover)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--mc-sidebar-bg-hover)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--mc-sidebar-bg-hover)'; }}
                  onClick={() => {
                    // Open payment modal with selected pool context
                    if (!selectedPool) return;
                    setPaymentPool(selectedPool);
                    setPaymentQty(1);
                    setPaymentError('');
                    setPaymentSuccess('');
                    setPaymentMethod('mno');
                    setMnoPhone('');
                    setCardName('');
                    setCardNumber('');
                    setCardExpiry('');
                    setCardCvv('');
                    setControlNumber('');
                    setShowPaymentModal(true);
                  }}
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal (from cards) */}
      {showPaymentModal && paymentPool && (
        <div style={{ position: 'fixed', inset: 0 as any, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: 'min(520px, 96vw)', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Join Pool</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{paymentPool.title}</div>
              </div>
              <button onClick={() => setShowPaymentModal(false)} style={{ width: 28, height: 28, borderRadius: 9999, border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>Units</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={() => setPaymentQty(q => Math.max(1, Math.floor(q) - 1))} style={{ width: 28, height: 28, border: 'none', background: '#f3f4f6', cursor: 'pointer' }}>−</button>
                  <input type="number" value={paymentQty} onChange={(e) => setPaymentQty(Math.max(1, Math.floor(Number(e.target.value) || 1)))} min={1} style={{ width: 56, height: 28, border: 'none', textAlign: 'center', fontSize: 13 }} />
                  <button onClick={() => setPaymentQty(q => Math.floor(q) + 1)} style={{ width: 28, height: 28, border: 'none', background: '#f3f4f6', cursor: 'pointer' }}>+</button>
                </div>
                <span style={{ fontSize: 12, color: '#6b7280' }}>Total</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>TZS {(paymentPool.pricePerUnit * paymentQty).toLocaleString()}</span>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Payment Method</div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#111827' }}>
                    <input type="radio" name="payMethod" checked={paymentMethod==='mno'} onChange={() => setPaymentMethod('mno')} /> Mobile Money (MNO)
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#111827' }}>
                    <input type="radio" name="payMethod" checked={paymentMethod==='card'} onChange={() => setPaymentMethod('card')} /> Debit/Credit Card
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#111827' }}>
                    <input type="radio" name="payMethod" checked={paymentMethod==='control'} onChange={() => setPaymentMethod('control')} /> Control Number
                  </label>
                </div>
              </div>

              {paymentMethod === 'mno' && (
                <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
                  <label style={{ fontSize: 12, color: '#374151' }}>Mobile Number
                    <input value={mnoPhone} onChange={(e) => setMnoPhone(e.target.value)} placeholder="e.g. +2557xxxxxxx" style={{ display: 'block', marginTop: 4, width: '100%', height: 34, border: '1px solid #e5e7eb', borderRadius: 6, padding: '0 10px', fontSize: 13 }} />
                  </label>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
                  <label style={{ fontSize: 12, color: '#374151' }}>Name on card
                    <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Full name" style={{ display: 'block', marginTop: 4, width: 260, height: 34, border: '1px solid #e5e7eb', borderRadius: 6, padding: '0 10px', fontSize: 13 }} />
                  </label>
                  <label style={{ fontSize: 12, color: '#374151' }}>Card number
                    <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" style={{ display: 'block', marginTop: 4, width: 260, height: 34, border: '1px solid #e5e7eb', borderRadius: 6, padding: '0 10px', fontSize: 13 }} />
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 8 }}>
                    <label style={{ fontSize: 12, color: '#374151' }}>Expiry (MM/YY)
                      <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" style={{ display: 'block', marginTop: 4, width: 90, height: 34, border: '1px solid #e5e7eb', borderRadius: 6, padding: '0 10px', fontSize: 13 }} />
                    </label>
                    <label style={{ fontSize: 12, color: '#374151' }}>CVV
                      <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="123" style={{ display: 'block', marginTop: 4, width: 70, height: 34, border: '1px solid #e5e7eb', borderRadius: 6, padding: '0 10px', fontSize: 13 }} />
                    </label>
                  </div>
                </div>
              )}

              {paymentMethod === 'control' && (
                <div style={{ display: 'grid', gap: 8, marginBottom: 8, color: '#374151', fontSize: 13 }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>A control number will be generated for you. Use it to pay.</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => {
                        const ref = `${paymentPool.id.toUpperCase()}-${Date.now().toString().slice(-6)}`;
                        setControlNumber(ref);
                      }}
                      style={{ border: '1px solid #e5e7eb', background: '#fff', color: '#374151', borderRadius: 8, padding: '8px 12px', fontWeight: 600, cursor: 'pointer' }}
                    >Generate Control Number</button>
                    {controlNumber && <span style={{ fontWeight: 700, color: '#111827' }}>{controlNumber}</span>}
                  </div>
                  {controlNumber && (
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Use the control number to complete payment via your preferred channel. We will confirm once payment is received.</div>
                  )}
                </div>
              )}
              <div style={{ minHeight: 18, marginBottom: 8 }}>
                {paymentError && <span style={{ color: '#dc2626', fontSize: 12 }}>{paymentError}</span>}
                {paymentSuccess && <span style={{ color: '#059669', fontSize: 12 }}>{paymentSuccess}</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button onClick={() => setShowPaymentModal(false)} style={{ border: '1px solid #e5e7eb', background: '#fff', color: '#374151', borderRadius: 8, padding: '8px 12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button
                  onClick={() => {
                    setPaymentError('');
                    setPaymentSuccess('');
                    if (paymentMethod === 'mno') {
                      if (!mnoPhone || mnoPhone.length < 7) {
                        setPaymentError('Enter a valid mobile number.');
                        return;
                      }
                    }
                    if (paymentMethod === 'card') {
                      if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
                        setPaymentError('Fill all card details.');
                        return;
                      }
                    }
                    if (paymentMethod === 'control') {
                      if (!controlNumber) {
                        setPaymentError('Generate a control number first.');
                        return;
                      }
                      // For control number, do not auto-join; rely on payment reconciliation
                      setPaymentSuccess('Control number generated. Complete payment to finalize.');
                      setShowPaymentModal(false);
                      return;
                    }
                    handleJoinPool(paymentPool, 1);
                    setShowPaymentModal(false);
                  }}
                  style={{ backgroundColor: 'var(--mc-sidebar-bg-hover)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 14px', fontWeight: 600, cursor: 'pointer' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--mc-sidebar-bg-hover)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--mc-sidebar-bg-hover)'; }}
                >
                  {paymentMethod === 'control' ? 'Confirm Control Number' : 'Pay'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Pool Modal (inline compact form) */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0 as any, background: 'rgba(0,0,0,0.45)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: 'min(720px, 96vw)', maxHeight: '92vh', borderRadius: 12, overflow: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Create Pool</div>
              <button onClick={() => setShowCreateModal(false)} style={{ width: 32, height: 32, borderRadius: 9999, border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowCreateModal(false); }} style={{ padding: 16, display: 'grid', gap: 12, maxHeight: '80vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Product Name
                  <input value={createForm.product} onChange={(e) => setCreateForm(f => ({ ...f, product: e.target.value }))} placeholder="e.g., Office Chairs" required style={{ display: 'block', marginTop: 4, width: 280, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Category
                  <input value={createForm.category} onChange={(e) => setCreateForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g., Electronics" style={{ display: 'block', marginTop: 4, width: 220, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
              </div>
              <label style={{ fontSize: 12, color: '#6b7280' }}>Description
                <textarea value={createForm.description} onChange={(e) => setCreateForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe the product..." style={{ display: 'block', marginTop: 4, width: 580, maxWidth: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', fontSize: 13, resize: 'vertical' }} />
              </label>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ fontSize: 12, color: '#6b7280' }}>Main Image URL</label>
                  <input value={createForm.image} onChange={(e) => setCreateForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." style={{ width: 300, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Additional Images</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="https://..." style={{ width: 300, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                    <button type="button" onClick={() => { if (newImage.trim()) { setCreateImages(arr => [...arr, newImage.trim()]); setNewImage(''); } }} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '8px 12px', height: 34, cursor: 'pointer', fontWeight: 600 }}>Add</button>
                  </div>
                  {createImages.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {createImages.map((url, idx) => (
                        <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 9999, fontSize: 12, color: '#374151' }}>
                          {url}
                          <button type="button" onClick={() => setCreateImages(arr => arr.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' }}>✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Videos</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input value={newVideo} onChange={(e) => setNewVideo(e.target.value)} placeholder="https://..." style={{ width: 300, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                    <button type="button" onClick={() => { if (newVideo.trim()) { setCreateVideos(arr => [...arr, newVideo.trim()]); setNewVideo(''); } }} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '8px 12px', height: 34, cursor: 'pointer', fontWeight: 600 }}>Add</button>
                  </div>
                  {createVideos.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {createVideos.map((url, idx) => (
                        <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 9999, fontSize: 12, color: '#374151' }}>
                          {url}
                          <button type="button" onClick={() => setCreateVideos(arr => arr.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' }}>✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Tags</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add a tag" style={{ width: 200, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                    <button type="button" onClick={() => { if (newTag.trim()) { setCreateTags(arr => [...arr, newTag.trim()]); setNewTag(''); } }} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '8px 12px', height: 34, cursor: 'pointer', fontWeight: 600 }}>Add</button>
                  </div>
                  {createTags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {createTags.map((t, idx) => (
                        <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 9999, fontSize: 12, color: '#374151' }}>
                          {t}
                          <button type="button" onClick={() => setCreateTags(arr => arr.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' }}>✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Target Quantity
                  <input type="number" value={createForm.targetQuantity} onChange={(e) => setCreateForm(f => ({ ...f, targetQuantity: e.target.value }))} placeholder="100" required style={{ display: 'block', marginTop: 4, width: 160, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Price per Unit (TZS)
                  <input type="number" value={createForm.targetPrice} onChange={(e) => setCreateForm(f => ({ ...f, targetPrice: e.target.value }))} placeholder="120000" required style={{ display: 'block', marginTop: 4, width: 180, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Minimum Participants
                  <input type="number" placeholder="5" style={{ display: 'block', marginTop: 4, width: 160, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Maximum Participants
                  <input type="number" placeholder="50" style={{ display: 'block', marginTop: 4, width: 160, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Deadline
                  <input type="date" value={createForm.deadline} onChange={(e) => setCreateForm(f => ({ ...f, deadline: e.target.value }))} required style={{ display: 'block', marginTop: 4, width: 200, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
              </div>
              <div style={{ height: 1, background: '#e5e7eb', margin: '4px 0' }} />
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 700 }}>Supplier Details</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Manufacturer/Supplier
                  <input value={createForm.manufacturer} onChange={(e) => setCreateForm(f => ({ ...f, manufacturer: e.target.value }))} placeholder="Company Name" style={{ display: 'block', marginTop: 4, width: 200, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Supplier Contact Name
                  <input value={createForm.supplierContactName} onChange={(e) => setCreateForm(f => ({ ...f, supplierContactName: e.target.value }))} placeholder="John Doe" style={{ display: 'block', marginTop: 4, width: 180, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Supplier Phone
                  <input value={createForm.supplierContactPhone} onChange={(e) => setCreateForm(f => ({ ...f, supplierContactPhone: e.target.value }))} placeholder="+255 714 555 000" style={{ display: 'block', marginTop: 4, width: 180, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Supplier Email
                  <input value={createForm.supplierContactEmail} onChange={(e) => setCreateForm(f => ({ ...f, supplierContactEmail: e.target.value }))} placeholder="orders@company.com" style={{ display: 'block', marginTop: 4, width: 220, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Supplier Location
                  <input value={createForm.supplierLocation} onChange={(e) => setCreateForm(f => ({ ...f, supplierLocation: e.target.value }))} placeholder="City, Country" style={{ display: 'block', marginTop: 4, width: 180, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Supplier Links</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <select value={supplierLinkType} onChange={(e) => setSupplierLinkType(e.target.value)} style={{ width: 140, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 8px', fontSize: 13 }}>
                    <option>Website</option>
                    <option>LinkedIn</option>
                    <option>Facebook</option>
                    <option>Twitter</option>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>WhatsApp</option>
                  </select>
                  <input value={supplierLinkUrl} onChange={(e) => setSupplierLinkUrl(e.target.value)} placeholder="https://..." style={{ width: 260, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                  <button type="button" onClick={() => { if (supplierLinkUrl.trim()) { setCreateSupplierLinks(arr => [...arr, { type: supplierLinkType, url: supplierLinkUrl.trim() }]); setSupplierLinkUrl(''); } }} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '8px 12px', height: 34, cursor: 'pointer', fontWeight: 600 }}>Add</button>
                </div>
                {createSupplierLinks.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {createSupplierLinks.map((l, idx) => (
                      <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 9999, fontSize: 12, color: '#374151' }}>
                        <strong>{l.type}:</strong> {l.url}
                        <button type="button" onClick={() => setCreateSupplierLinks(arr => arr.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 700 }}>Organizer Details</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Organizer
                  <input value={createForm.organizer} onChange={(e) => setCreateForm(f => ({ ...f, organizer: e.target.value }))} placeholder="Your Company" required style={{ display: 'block', marginTop: 4, width: 200, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Organizer Contact Name
                  <input value={createForm.organizerContactName} onChange={(e) => setCreateForm(f => ({ ...f, organizerContactName: e.target.value }))} placeholder="Your Name" style={{ display: 'block', marginTop: 4, width: 180, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Organizer Phone
                  <input value={createForm.organizerContactPhone} onChange={(e) => setCreateForm(f => ({ ...f, organizerContactPhone: e.target.value }))} placeholder="+255 715 444 333" style={{ display: 'block', marginTop: 4, width: 180, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Organizer Email
                  <input value={createForm.organizerContactEmail} onChange={(e) => setCreateForm(f => ({ ...f, organizerContactEmail: e.target.value }))} placeholder="you@company.com" style={{ display: 'block', marginTop: 4, width: 220, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Organizer Location
                  <input value={createForm.organizerLocation} onChange={(e) => setCreateForm(f => ({ ...f, organizerLocation: e.target.value }))} placeholder="City, Country" style={{ display: 'block', marginTop: 4, width: 180, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Organizer Links</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <select value={organizerLinkType} onChange={(e) => setOrganizerLinkType(e.target.value)} style={{ width: 140, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 8px', fontSize: 13 }}>
                    <option>Website</option>
                    <option>LinkedIn</option>
                    <option>Facebook</option>
                    <option>Twitter</option>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>WhatsApp</option>
                  </select>
                  <input value={organizerLinkUrl} onChange={(e) => setOrganizerLinkUrl(e.target.value)} placeholder="https://..." style={{ width: 260, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                  <button type="button" onClick={() => { if (organizerLinkUrl.trim()) { setCreateOrganizerLinks(arr => [...arr, { type: organizerLinkType, url: organizerLinkUrl.trim() }]); setOrganizerLinkUrl(''); } }} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '8px 12px', height: 34, cursor: 'pointer', fontWeight: 600 }}>Add</button>
                </div>
                {createOrganizerLinks.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {createOrganizerLinks.map((l, idx) => (
                      <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 9999, fontSize: 12, color: '#374151' }}>
                        <strong>{l.type}:</strong> {l.url}
                        <button type="button" onClick={() => setCreateOrganizerLinks(arr => arr.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Specifications</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input value={newSpec} onChange={(e) => setNewSpec(e.target.value)} placeholder="Add a spec" style={{ width: 320, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                  <button type="button" onClick={() => { if (newSpec.trim()) { setCreateSpecs(arr => [...arr, newSpec.trim()]); setNewSpec(''); } }} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '8px 12px', height: 34, cursor: 'pointer', fontWeight: 600 }}>Add</button>
                </div>
                {createSpecs.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {createSpecs.map((s, idx) => (
                      <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 9999, fontSize: 12, color: '#374151' }}>
                        {s}
                        <button type="button" onClick={() => setCreateSpecs(arr => arr.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>What's Included</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input value={newIncluded} onChange={(e) => setNewIncluded(e.target.value)} placeholder="Add an item" style={{ width: 320, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                  <button type="button" onClick={() => { if (newIncluded.trim()) { setCreateIncluded(arr => [...arr, newIncluded.trim()]); setNewIncluded(''); } }} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '8px 12px', height: 34, cursor: 'pointer', fontWeight: 600 }}>Add</button>
                </div>
                {createIncluded.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {createIncluded.map((s, idx) => (
                      <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 9999, fontSize: 12, color: '#374151' }}>
                        {s}
                        <button type="button" onClick={() => setCreateIncluded(arr => arr.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Delivery Options</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input value={newDelivery} onChange={(e) => setNewDelivery(e.target.value)} placeholder="Add delivery option" style={{ width: 320, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                  <button type="button" onClick={() => { if (newDelivery.trim()) { setCreateDelivery(arr => [...arr, newDelivery.trim()]); setNewDelivery(''); } }} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '8px 12px', height: 34, cursor: 'pointer', fontWeight: 600 }}>Add</button>
                </div>
                {createDelivery.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {createDelivery.map((s, idx) => (
                      <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 9999, fontSize: 12, color: '#374151' }}>
                        {s}
                        <button type="button" onClick={() => setCreateDelivery(arr => arr.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Pickup Locations</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input value={newPickup} onChange={(e) => setNewPickup(e.target.value)} placeholder="Add pickup location" style={{ width: 320, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                  <button type="button" onClick={() => { if (newPickup.trim()) { setCreatePickup(arr => [...arr, newPickup.trim()]); setNewPickup(''); } }} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '8px 12px', height: 34, cursor: 'pointer', fontWeight: 600 }}>Add</button>
                </div>
                {createPickup.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {createPickup.map((s, idx) => (
                      <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 9999, fontSize: 12, color: '#374151' }}>
                        {s}
                        <button type="button" onClick={() => setCreatePickup(arr => arr.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Payment Terms
                  <input value={createForm.paymentTerms} onChange={(e) => setCreateForm(f => ({ ...f, paymentTerms: e.target.value }))} placeholder="30% deposit, balance Net 7" style={{ display: 'block', marginTop: 4, width: 280, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Return Policy
                  <input value={createForm.returnPolicy} onChange={(e) => setCreateForm(f => ({ ...f, returnPolicy: e.target.value }))} placeholder="14 days limited return" style={{ display: 'block', marginTop: 4, width: 280, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Lead Time (days)
                  <input type="number" value={createForm.leadTimeDays} onChange={(e) => setCreateForm(f => ({ ...f, leadTimeDays: e.target.value }))} placeholder="10" style={{ display: 'block', marginTop: 4, width: 120, height: 34, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13 }} />
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ border: '1px solid #e5e7eb', background: '#fff', color: '#374151', borderRadius: 8, padding: '8px 12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ backgroundColor: 'var(--mc-sidebar-bg-hover)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 14px', fontWeight: 600, cursor: 'pointer' }}>Create Pool</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function BulkOrdersPage() {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <BulkOrdersModule />
    </div>
  );
}
