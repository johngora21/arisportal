"use client";

import React, { useState } from 'react';
import { countryNames } from '../../data/countries';
import { 
  FileText, 
  Wrench, 
  Plus,
  Calendar,
  DollarSign,
  Users,
  Award,
  Eye,
  ArrowRight,
  MapPin,
  Clock,
  Bookmark,
  Building2,
  Briefcase,
  Factory,
  Shield,
  Search,
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react';

export default function TendersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sector: [] as string[],
    country: [] as string[],
    contractValueMin: '',
    contractValueMax: '',
    currency: 'TZS'
  });

  const filterOptions = {
    sector: [
      'Technology', 'Construction', 'Healthcare', 'Transportation', 'Energy', 
      'Manufacturing', 'Education', 'Defense', 'Finance', 'Telecommunications', 
      'Agriculture', 'Mining', 'Real Estate', 'Retail', 'Media', 'Consulting', 
      'Security', 'Environment', 'Tourism', 'Food & Beverage', 'Infrastructure', 
      'Oil & Gas', 'Aviation', 'Maritime/Shipping', 'Water & Sanitation', 'Waste Management'
    ]
  };

  const currencies = [
    { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' }
  ];

  const tenders = [
    {
      id: 1,
      title: "Road Construction - Dodoma to Singida",
      organization: "Ministry of Works",
      sector: "Infrastructure",
      category: "Construction",
      location: "Dodoma",
      country: "Tanzania",
      contractValue: "TZS 2,500,000,000",
      deadline: "2024-03-15",
      description: "Construction of 150km highway connecting Dodoma to Singida with modern infrastructure and safety features",
      coverImage: null,
      isUrgent: false,
      isDeadlineExpired: false,
      submissions: 12
    },
    {
      id: 2,
      title: "IT Infrastructure Upgrade",
      organization: "Government of Tanzania",
      sector: "Technology",
      category: "IT Services",
      location: "Dar es Salaam",
      country: "Tanzania",
      contractValue: "TZS 800,000,000",
      deadline: "2024-02-28",
      description: "Upgrade of government IT systems and network infrastructure across ministries and departments",
      coverImage: null,
      isUrgent: false,
      isDeadlineExpired: false,
      submissions: 8
    },
    {
      id: 3,
      title: "Medical Equipment Supply",
      organization: "Ministry of Health",
      sector: "Healthcare",
      category: "Medical Supplies",
      location: "Multiple Regions",
      country: "Tanzania",
      contractValue: "TZS 1,200,000,000",
      deadline: "2024-01-20",
      description: "Supply of medical equipment for regional hospitals and health centers across Tanzania",
      coverImage: null,
      isUrgent: false,
      isDeadlineExpired: true,
      submissions: 15
    }
  ];

  const toggleFilter = (filterType: 'sector' | 'country', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const updateContractValueRange = (field: 'contractValueMin' | 'contractValueMax' | 'currency', value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      sector: [],
      country: [],
      contractValueMin: '',
      contractValueMax: '',
      currency: 'TZS'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.sector.length > 0) count += filters.sector.length;
    if (filters.country.length > 0) count += filters.country.length;
    if (filters.contractValueMin || filters.contractValueMax) count += 1;
    return count;
  };

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case 'Infrastructure': return Building2
      case 'Technology': return Briefcase
      case 'Healthcare': return Users
      default: return Briefcase
    }
  };

  const getSectorColor = (sector: string) => {
    const colorMap = {
      'Infrastructure': '#f97316',         // Orange
      'Technology': 'var(--mc-sidebar-bg)',             // Blue
      'Healthcare': '#ef4444',              // Red
      'default': '#64748b'                  // Gray
    }
    return colorMap[sector as keyof typeof colorMap] || colorMap.default
  };

  const formatDeadline = (deadline: string) => {
    if (!deadline) return 'Not specified'
    try {
      const date = new Date(deadline)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return deadline
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  };

  // Filter tenders based on search and sector
  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tender.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tender.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSector = selectedSector === 'All' || tender.sector === selectedSector;
    
    return matchesSearch && matchesSector;
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Tenders Management
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage tender opportunities, submissions, and evaluation processes
            </p>
          </div>
          <button
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
            New Tender
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FileText size={20} color="var(--mc-sidebar-bg)" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Active Tenders</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              12
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Award size={20} color="#10b981" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Won Tenders</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              8
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <DollarSign size={20} color="#f59e0b" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Value</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              TZS 2.5B
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Users size={20} color="#8b5cf6" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Bidders</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              45
            </div>
          </div>
        </div>
      </div>

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
              placeholder="Search tenders..."
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
          
          {/* Country Filter - positioned from right */}
          <div style={{
            position: 'absolute',
            right: '50px',
            top: '0px'
          }}>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              style={{
                padding: '12px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                width: '180px',
                backgroundColor: 'white'
              }}
            >
              <option value="All">All Countries</option>
              {countryNames.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filter Button - positioned from right */}
          <div style={{
            position: 'absolute',
            right: '5px',
            top: '0px'
          }}>
            <button
              onClick={() => setShowFilters(true)}
              style={{
                padding: '12px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <SlidersHorizontal size={16} color="#64748b" />
              {getActiveFilterCount() > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  borderRadius: '10px',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {getActiveFilterCount()}
                </div>
              )}
            </button>
          </div>
        </div>

      {/* Tender Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        {filteredTenders.map((tender) => {
          const SectorIcon = getSectorIcon(tender.sector)
          const sectorColor = getSectorColor(tender.sector)
          const daysUntilDeadline = getDaysUntilDeadline(tender.deadline)
          const isDeadlineUrgent = daysUntilDeadline <= 7
          
          return (
            <div key={tender.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0',
              position: 'relative',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
              height: '480px',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}>
              
              {/* Cover Image */}
              <div style={{ position: 'relative' }}>
                {tender.coverImage ? (
                  <img 
                    src={tender.coverImage} 
                    alt={tender.title}
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '250px',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b'
                  }}>
                    <SectorIcon size={48} color={sectorColor} />
                  </div>
                )}
                
                {/* Overlay badges */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      fontSize: '12px',
                      color: 'white',
                      backgroundColor: sectorColor,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontWeight: '600',
                      backdropFilter: 'blur(10px)'
                    }}>
                      {tender.sector}
                    </span>
                    {tender.isUrgent && (
                      <span style={{
                        fontSize: '10px',
                        color: 'white',
                        backgroundColor: 'var(--mc-sidebar-bg)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '20px',
                        lineHeight: '1'
                      }}>
                        URGENT
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Toggle bookmark functionality
                    }}
                    style={{
                      background: '#f8f9fa',
                      border: '1px solid #e2e8f0',
                      padding: '8px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      flexShrink: 0,
                      marginLeft: '8px',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement
                      target.style.backgroundColor = '#f1f5f9'
                      target.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement
                      target.style.backgroundColor = '#f8f9fa'
                      target.style.transform = 'scale(1)'
                    }}
                  >
                    <Bookmark 
                      size={20} 
                      color="#64748b"
                      fill="none"
                    />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Title */}
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 12px 0',
                  lineHeight: '1.3'
                }}>
                  {tender.title}
                </h2>

                {/* Organization */}
                <div style={{
                  fontSize: '13px',
                  color: '#64748b',
                  marginBottom: '12px',
                  fontWeight: '500'
                }}>
                  {tender.organization}
                </div>

                {/* Contract Value */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  color: '#16a34a',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  <DollarSign size={14} />
                  {tender.contractValue}
                </div>

                   {/* Deadline */}
                   <div style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '4px',
                     marginBottom: '12px',
                     fontSize: '13px',
                     color: '#64748b',
                     fontWeight: '500'
                   }}>
                     <Calendar size={12} />
                     <span>{tender.isDeadlineExpired ? 'Closed' : 'Deadline:'}</span>
                     <span style={{ 
                       color: tender.isDeadlineExpired ? '#6b7280' : (isDeadlineUrgent ? '#dc2626' : '#64748b'), 
                       fontWeight: tender.isDeadlineExpired ? '500' : (isDeadlineUrgent ? '600' : '500') 
                     }}>
                       {tender.isDeadlineExpired ? '' : formatDeadline(tender.deadline)}
                     </span>
                   </div>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9',
                  marginTop: 'auto',
                  flexShrink: 0
                }}>
                  {/* Location */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    color: '#64748b'
                  }}>
                    <MapPin size={14} />
                    {tender.location}, {tender.country}
                  </div>
                  
                  {/* Apply Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle apply functionality
                    }}
                    disabled={tender.isDeadlineExpired}
                    style={{
                      backgroundColor: tender.isDeadlineExpired ? '#6b7280' : 'var(--mc-sidebar-bg)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: tender.isDeadlineExpired ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s',
                      opacity: tender.isDeadlineExpired ? 0.6 : 1
                    }}
                    onMouseOver={(e) => {
                      if (!tender.isDeadlineExpired) {
                        (e.target as HTMLElement).style.backgroundColor = 'var(--mc-sidebar-bg-hover)'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!tender.isDeadlineExpired) {
                        (e.target as HTMLElement).style.backgroundColor = 'var(--mc-sidebar-bg)'
                      }
                    }}
                  >
                    {tender.isDeadlineExpired ? 'Closed' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease-in-out'
        }}
        onClick={() => setShowFilters(false)}>
          <div style={{
            backgroundColor: 'white',
            width: 'min(800px, 90vw)',
            maxHeight: '85vh',
            borderRadius: '16px',
            padding: '32px',
            overflowY: 'auto',
            transform: showFilters ? 'translateY(0)' : 'scale(0.9)',
            opacity: showFilters ? 1 : 0,
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0
              }}>
                Filters
              </h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={clearAllFilters}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  <X size={24} color="#64748b" />
                </button>
              </div>
            </div>

            {/* Filter Categories */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '32px'
            }}>
              
              {/* Sector */}
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 12px 0'
                }}>
                  Sector
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '8px' 
                }}>
                  {filterOptions.sector.map((sector) => (
                    <label key={sector} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      padding: '8px 0'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: '2px solid #e2e8f0',
                        backgroundColor: filters.sector.includes(sector) ? 'var(--mc-sidebar-bg)' : 'transparent',
                        borderColor: filters.sector.includes(sector) ? 'var(--mc-sidebar-bg)' : '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease-in-out',
                        flexShrink: 0
                      }}
                      onClick={() => toggleFilter('sector', sector)}>
                        {filters.sector.includes(sector) && (
                          <Check size={12} color="white" />
                        )}
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: '#1a1a1a',
                        fontWeight: '500'
                      }}>
                        {sector}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contract Value Range */}
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 12px 0'
                }}>
                  Contract Value Range
                </h3>
                
                {/* Currency Selection */}
                <div style={{ marginBottom: '16px', maxWidth: '300px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '6px',
                    fontWeight: '500'
                  }}>
                    Currency
                  </label>
                  <select
                    value={filters.currency}
                    onChange={(e) => updateContractValueRange('currency', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      color: '#1a1a1a',
                      outline: 'none',
                      transition: 'border-color 0.2s ease-in-out'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--mc-sidebar-bg)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                    }}
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contract Value Input Fields */}
                <div style={{ display: 'flex', gap: '12px', maxWidth: '500px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#64748b',
                      marginBottom: '6px',
                      fontWeight: '500'
                    }}>
                      Minimum Value
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.contractValueMin}
                      onChange={(e) => updateContractValueRange('contractValueMin', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        color: '#1a1a1a',
                        outline: 'none',
                        transition: 'border-color 0.2s ease-in-out'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--mc-sidebar-bg)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0'
                      }}
                    />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#64748b',
                      marginBottom: '6px',
                      fontWeight: '500'
                    }}>
                      Maximum Value
                    </label>
                    <input
                      type="number"
                      placeholder="No limit"
                      value={filters.contractValueMax}
                      onChange={(e) => updateContractValueRange('contractValueMax', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        color: '#1a1a1a',
                        outline: 'none',
                        transition: 'border-color 0.2s ease-in-out'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--mc-sidebar-bg)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid #f0f0f0'
            }}>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  minWidth: '200px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'var(--mc-sidebar-bg-hover)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'var(--mc-sidebar-bg)'
                }}
              >
                Apply Filters ({getActiveFilterCount()})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}