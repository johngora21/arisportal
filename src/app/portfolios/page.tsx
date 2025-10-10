'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Palette, 
  Settings, 
  Eye, 
  Edit, 
  Plus,
  Search,
  Star,
  BarChart3,
  ExternalLink
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: 'corporate' | 'startup' | 'creative' | 'tech' | 'consulting';
  description: string;
  features: string[];
  price: 'free' | 'premium';
  rating: number;
  downloads: number;
  isPopular?: boolean;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Corporate Professional',
    category: 'corporate',
    description: 'Clean, professional design perfect for established companies and corporations.',
    features: ['Team showcase', 'Company history', 'Services overview', 'Contact forms', 'News section'],
    price: 'free',
    rating: 4.8,
    downloads: 1250,
    isPopular: true
  },
  {
    id: '2',
    name: 'Startup Dynamic',
    category: 'startup',
    description: 'Modern, energetic design ideal for startups and growing businesses.',
    features: ['Mission statement', 'Team photos', 'Product showcase', 'Investor relations', 'Blog'],
    price: 'free',
    rating: 4.6,
    downloads: 890
  },
  {
    id: '3',
    name: 'Creative Agency',
    category: 'creative',
    description: 'Bold, creative design for agencies, designers, and creative professionals.',
    features: ['Portfolio gallery', 'Client testimonials', 'Project case studies', 'Creative process', 'Contact'],
    price: 'premium',
    rating: 4.9,
    downloads: 650
  },
  {
    id: '4',
    name: 'Tech Innovation',
    category: 'tech',
    description: 'Cutting-edge design for technology companies and software firms.',
    features: ['Product demos', 'Tech stack', 'Open source projects', 'Developer resources', 'API docs'],
    price: 'free',
    rating: 4.7,
    downloads: 1100
  }
];

export default function PortfoliosPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'customize' | 'analytics'>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [hasPortfolio, setHasPortfolio] = useState(false);

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'corporate': return { bg: '#dbeafe', color: '#1e40af' };
      case 'startup': return { bg: '#dcfce7', color: '#166534' };
      case 'creative': return { bg: '#fef3c7', color: '#92400e' };
      case 'tech': return { bg: '#e0e7ff', color: '#3730a3' };
      case 'consulting': return { bg: '#fce7f3', color: '#be185d' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Company Portfolios
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Create stunning company websites with customizable templates and subdomain hosting
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
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Plus size={20} />
            Create Portfolio
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Globe size={20} color="var(--mc-sidebar-bg)" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Portfolio Status</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {hasPortfolio ? 'Published' : 'Not Created'}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Palette size={20} color="#10b981" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Templates</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>4</div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Eye size={20} color="#f59e0b" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Views</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {hasPortfolio ? '1,250' : '0'}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <ExternalLink size={20} color="#8b5cf6" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Subdomain</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {hasPortfolio ? 'company.arisportal.com' : 'Not Set'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'templates', label: 'Choose Template', icon: <Palette size={16} /> },
            { id: 'customize', label: 'Customize', icon: <Edit size={16} /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> }
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

        {/* Filters */}
        {activeTab === 'templates' && (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 12px 14px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  background: 'white'
                }}
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '14px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                background: 'white',
                minWidth: '140px'
              }}
            >
              <option value="all">All Categories</option>
              <option value="corporate">Corporate</option>
              <option value="startup">Startup</option>
              <option value="creative">Creative</option>
              <option value="tech">Tech</option>
              <option value="consulting">Consulting</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'templates' && (
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Choose a Template ({filteredTemplates.length})
            </h3>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {filteredTemplates.map((template) => (
                <div key={template.id} style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '20px',
                  backgroundColor: 'white',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {template.isPopular && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'var(--mc-sidebar-bg)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      zIndex: 1
                    }}>
                      Popular
                    </div>
                  )}
                  
                  <div style={{ 
                    height: '200px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {template.name}
                  </div>
                  
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        {template.name}
                      </h4>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        ...getCategoryColor(template.category)
                      }}>
                        {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                      {template.description}
                    </p>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
                        Features:
                      </h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {template.features.slice(0, 3).map((feature, index) => (
                          <span key={index} style={{
                            padding: '2px 6px',
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            borderRadius: '20px',
                            fontSize: '12px'
                          }}>
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 3 && (
                          <span style={{
                            padding: '2px 6px',
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            borderRadius: '20px',
                            fontSize: '12px'
                          }}>
                            +{template.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} color="#f59e0b" />
                          <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                            {template.rating}
                          </span>
                        </div>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          ({template.downloads} downloads)
                        </span>
                      </div>
                      
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: template.price === 'free' ? '#d1fae5' : '#fef3c7',
                        color: template.price === 'free' ? '#10b981' : '#f59e0b'
                      }}>
                        {template.price === 'free' ? 'Free' : 'Premium'}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '20px',
                          background: 'white',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
                          setHasPortfolio(true);
                          setActiveTab('customize');
                        }}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          border: 'none',
                          borderRadius: '20px',
                          background: 'var(--mc-sidebar-bg)',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Edit size={16} />
                        Use This Template
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'customize' && (
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Customize Your Portfolio
            </h3>
            {selectedTemplate && (
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                Using template: <strong>{selectedTemplate.name}</strong>
              </p>
            )}
          </div>
          
          <div style={{ padding: '20px' }}>
            {!hasPortfolio ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <Palette size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>No Portfolio Created</h4>
                <p style={{ fontSize: '14px', margin: '0 0 20px 0' }}>Choose a template first to start customizing your company portfolio.</p>
                <button
                  onClick={() => setActiveTab('templates')}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '20px',
                    background: 'var(--mc-sidebar-bg)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Choose Template
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Portfolio Preview */}
                <div style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{ 
                    height: '300px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '600'
                  }}>
                    {selectedTemplate?.name} - Live Preview
                  </div>
                </div>

                {/* Customization Options */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '20px', backgroundColor: 'white' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                      Company Information
                    </h4>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <input
                        type="text"
                        placeholder="Company Name"
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '20px',
                          fontSize: '14px'
                        }}
                      />
                      <textarea
                        placeholder="Company Description"
                        rows={3}
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '20px',
                          fontSize: '14px',
                          resize: 'vertical'
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Contact Email"
                        style={{
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '20px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '20px', backgroundColor: 'white' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                      Subdomain Settings
                    </h4>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="company"
                          style={{
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '20px',
                            fontSize: '14px',
                            flex: 1
                          }}
                        />
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>.arisportal.com</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Your portfolio will be available at: <strong>company.arisportal.com</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
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
                    Save Draft
                  </button>
                  <button
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '20px',
                      background: '#10b981',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Publish Portfolio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
            Portfolio Analytics
          </h3>
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <BarChart3 size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>Analytics Dashboard</h4>
            <p style={{ fontSize: '14px', margin: 0 }}>Track visits, engagement, and performance metrics for your portfolios.</p>
          </div>
        </div>
      )}
    </div>
  );
}



