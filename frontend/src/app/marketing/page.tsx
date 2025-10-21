'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Play,
  Pause,
  Edit,
  Trash2,
  BarChart3,
  Target,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music,
  Megaphone
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok';
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  objective: string;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  creative: {
    type: 'image' | 'video' | 'carousel' | 'story';
    url: string;
    title: string;
    description: string;
  };
  audience: {
    size: number;
    demographics: string;
    interests: string[];
  };
}

const platformIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music
};

const platformColors = {
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  tiktok: '#000000'
};

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q4 Product Launch - Facebook',
    platform: 'facebook',
    status: 'active',
    budget: 5000,
    spent: 3240,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    objective: 'Brand Awareness',
    reach: 125000,
    impressions: 450000,
    clicks: 8900,
    conversions: 234,
    ctr: 1.98,
    cpc: 0.36,
    cpm: 7.20,
    roas: 4.2,
    creative: {
      type: 'video',
      url: '/api/placeholder/300/200',
      title: 'Introducing Our New Product',
      description: 'Revolutionary solution for modern businesses'
    },
    audience: {
      size: 250000,
      demographics: '25-45, Urban, Tech-savvy',
      interests: ['Technology', 'Business', 'Innovation']
    }
  },
  {
    id: '2',
    name: 'LinkedIn B2B Campaign',
    platform: 'linkedin',
    status: 'active',
    budget: 3000,
    spent: 1890,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    objective: 'Lead Generation',
    reach: 45000,
    impressions: 180000,
    clicks: 5400,
    conversions: 89,
    ctr: 3.0,
    cpc: 0.35,
    cpm: 10.50,
    roas: 3.8,
    creative: {
      type: 'image',
      url: '/api/placeholder/300/200',
      title: 'Professional Services',
      description: 'Expert solutions for enterprise clients'
    },
    audience: {
      size: 120000,
      demographics: '30-55, Professionals, Decision Makers',
      interests: ['Business', 'Management', 'Technology']
    }
  },
  {
    id: '3',
    name: 'Instagram Story Ads',
    platform: 'instagram',
    status: 'paused',
    budget: 2000,
    spent: 1200,
    startDate: '2024-01-10',
    endDate: '2024-01-25',
    objective: 'Engagement',
    reach: 85000,
    impressions: 340000,
    clicks: 6800,
    conversions: 156,
    ctr: 2.0,
    cpc: 0.18,
    cpm: 3.53,
    roas: 2.1,
    creative: {
      type: 'story',
      url: '/api/placeholder/300/200',
      title: 'Behind the Scenes',
      description: 'See how we create amazing products'
    },
    audience: {
      size: 180000,
      demographics: '18-35, Creative, Lifestyle',
      interests: ['Design', 'Lifestyle', 'Creativity']
    }
  },
  {
    id: '4',
    name: 'Twitter Promoted Tweets',
    platform: 'twitter',
    status: 'active',
    budget: 1500,
    spent: 890,
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    objective: 'Engagement',
    reach: 65000,
    impressions: 195000,
    clicks: 3900,
    conversions: 78,
    ctr: 2.0,
    cpc: 0.23,
    cpm: 4.56,
    roas: 2.8,
    creative: {
      type: 'image',
      url: '/api/placeholder/300/200',
      title: 'Industry Insights',
      description: 'Latest trends and updates'
    },
    audience: {
      size: 150000,
      demographics: '25-40, Tech Professionals',
      interests: ['Technology', 'News', 'Industry Updates']
    }
  },
  {
    id: '5',
    name: 'YouTube TrueView Campaign',
    platform: 'youtube',
    status: 'active',
    budget: 4000,
    spent: 2100,
    startDate: '2024-01-05',
    endDate: '2024-02-05',
    objective: 'Brand Awareness',
    reach: 180000,
    impressions: 720000,
    clicks: 14400,
    conversions: 320,
    ctr: 2.0,
    cpc: 0.15,
    cpm: 2.92,
    roas: 3.5,
    creative: {
      type: 'video',
      url: '/api/placeholder/300/200',
      title: 'Product Demo Video',
      description: 'See our product in action'
    },
    audience: {
      size: 300000,
      demographics: '22-45, Video Enthusiasts',
      interests: ['Technology', 'Tutorials', 'Reviews']
    }
  },
  {
    id: '6',
    name: 'TikTok Brand Takeover',
    platform: 'tiktok',
    status: 'completed',
    budget: 2500,
    spent: 2500,
    startDate: '2024-01-01',
    endDate: '2024-01-07',
    objective: 'Brand Awareness',
    reach: 500000,
    impressions: 2000000,
    clicks: 50000,
    conversions: 1200,
    ctr: 2.5,
    cpc: 0.05,
    cpm: 1.25,
    roas: 4.8,
    creative: {
      type: 'video',
      url: '/api/placeholder/300/200',
      title: 'Viral Challenge',
      description: 'Join our trending challenge'
    },
    audience: {
      size: 800000,
      demographics: '16-30, Gen Z, Creative',
      interests: ['Music', 'Dance', 'Trends', 'Entertainment']
    }
  },
  {
    id: '7',
    name: 'Facebook Carousel Ads',
    platform: 'facebook',
    status: 'draft',
    budget: 1800,
    spent: 0,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    objective: 'Conversion',
    reach: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    cpc: 0,
    cpm: 0,
    roas: 0,
    creative: {
      type: 'carousel',
      url: '/api/placeholder/300/200',
      title: 'Product Showcase',
      description: 'Multiple products in one ad'
    },
    audience: {
      size: 200000,
      demographics: '25-50, Shoppers',
      interests: ['Shopping', 'Products', 'Deals']
    }
  },
  {
    id: '8',
    name: 'LinkedIn Sponsored Content',
    platform: 'linkedin',
    status: 'paused',
    budget: 2200,
    spent: 1100,
    startDate: '2024-01-12',
    endDate: '2024-01-26',
    objective: 'Lead Generation',
    reach: 35000,
    impressions: 140000,
    clicks: 4200,
    conversions: 95,
    ctr: 3.0,
    cpc: 0.26,
    cpm: 7.86,
    roas: 3.2,
    creative: {
      type: 'image',
      url: '/api/placeholder/300/200',
      title: 'Industry Report',
      description: 'Download our latest insights'
    },
    audience: {
      size: 100000,
      demographics: '28-50, B2B Decision Makers',
      interests: ['Industry Reports', 'Business Intelligence']
    }
  },
  {
    id: '9',
    name: 'Instagram Shopping Ads',
    platform: 'instagram',
    status: 'active',
    budget: 3200,
    spent: 1950,
    startDate: '2024-01-18',
    endDate: '2024-02-18',
    objective: 'Conversion',
    reach: 95000,
    impressions: 380000,
    clicks: 11400,
    conversions: 285,
    ctr: 3.0,
    cpc: 0.17,
    cpm: 5.13,
    roas: 4.1,
    creative: {
      type: 'image',
      url: '/api/placeholder/300/200',
      title: 'Shop Now Collection',
      description: 'Discover our latest products'
    },
    audience: {
      size: 200000,
      demographics: '20-40, Fashion & Lifestyle',
      interests: ['Fashion', 'Shopping', 'Lifestyle']
    }
  },
  {
    id: '10',
    name: 'YouTube Shopping Ads',
    platform: 'youtube',
    status: 'active',
    budget: 2800,
    spent: 1680,
    startDate: '2024-01-25',
    endDate: '2024-02-25',
    objective: 'Conversion',
    reach: 120000,
    impressions: 480000,
    clicks: 9600,
    conversions: 192,
    ctr: 2.0,
    cpc: 0.18,
    cpm: 3.50,
    roas: 3.8,
    creative: {
      type: 'video',
      url: '/api/placeholder/300/200',
      title: 'Product Tutorial',
      description: 'Learn how to use our product'
    },
    audience: {
      size: 250000,
      demographics: '25-45, DIY Enthusiasts',
      interests: ['Tutorials', 'How-to', 'Products']
    }
  }
];

const CreateCampaignModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Demographics
    ageRange: { min: 18, max: 65 },
    gender: 'all',
    location: '',
    language: 'en',
    incomeMin: '',
    incomeMax: '',
    education: '',
    relationship: '',
    parental: '',
    
    // Interests & Behaviors
    interests: [] as string[],
    behaviors: [] as string[],
    lifeEvents: [] as string[],
    
    // Custom Audiences
    customAudiences: [] as string[],
    lookalikeAudiences: [] as string[],
    websiteVisitors: false,
    appUsers: false,
    emailList: false,
    
    // Platform
    platforms: [] as string[],
    
    // Objective
    objective: '',
    
    // Budget
    budgetType: 'daily',
    budgetAmount: 0,
    bidStrategy: 'lowest_cost',
    
    // Creative
    adType: 'single_image',
    primaryText: '',
    headline: '',
    description: '',
    cta: 'Learn More',
    creativeFile: null as File | null
  });

  const steps = [
    { id: 1, title: 'Demographics', description: 'Target your audience' },
    { id: 2, title: 'Platform', description: 'Choose platforms' },
    { id: 3, title: 'Objective', description: 'Set campaign goal' },
    { id: 4, title: 'Budget', description: 'Set budget & bidding' },
    { id: 5, title: 'Creative', description: 'Create your ad' }
  ];

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('Campaign created:', formData);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Demographics
        return (
          <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
              Advanced Audience Targeting
            </h3>
            
            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Basic Demographics */}
              <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '20px', backgroundColor: '#f9fafb' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Basic Demographics</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {/* Age Range */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Age Range
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="number"
                        value={formData.ageRange.min}
                        onChange={(e) => setFormData({...formData, ageRange: {...formData.ageRange, min: parseInt(e.target.value)}})}
                        style={{ width: '80px', padding: '12px 8px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                      />
                      <span style={{ color: '#6b7280' }}>to</span>
                      <input
                        type="number"
                        value={formData.ageRange.max}
                        onChange={(e) => setFormData({...formData, ageRange: {...formData.ageRange, max: parseInt(e.target.value)}})}
                        style={{ width: '80px', padding: '12px 8px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Gender
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {['all', 'male', 'female'].map((gender) => (
                        <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          />
                          <span style={{ textTransform: 'capitalize', color: '#374151' }}>{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter country, state, or city"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                    />
                  </div>

                  {/* Education */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Education Level
                    </label>
                    <select
                      value={formData.education}
                      onChange={(e) => setFormData({...formData, education: e.target.value})}
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                    >
                      <option value="">Select education level</option>
                      <option value="all">All Education Levels</option>
                      <option value="no_formal">No Formal Education</option>
                      <option value="elementary">Elementary School</option>
                      <option value="middle_school">Middle School</option>
                      <option value="high_school">High School</option>
                      <option value="some_college">Some College</option>
                      <option value="associates">Associate's Degree</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="doctorate">Doctorate/PhD</option>
                      <option value="professional">Professional Degree</option>
                      <option value="trade_school">Trade School/Certificate</option>
                    </select>
                  </div>

                  {/* Income Level - Full Width */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Income Level ($)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px' }}>
                      <input
                        type="number"
                        placeholder="Min income"
                        value={formData.incomeMin || ''}
                        onChange={(e) => setFormData({...formData, incomeMin: e.target.value})}
                        style={{ width: '120px', padding: '12px 8px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                      />
                      <span style={{ color: '#6b7280' }}>to</span>
                      <input
                        type="number"
                        placeholder="Max income"
                        value={formData.incomeMax || ''}
                        onChange={(e) => setFormData({...formData, incomeMax: e.target.value})}
                        style={{ width: '120px', padding: '12px 8px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '20px', backgroundColor: '#f9fafb' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Interests & Hobbies</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    // Technology & Digital
                    'Technology', 'Software', 'Mobile Apps', 'Gaming', 'Streaming', 'Social Media',
                    'Artificial Intelligence', 'Cryptocurrency', 'E-commerce', 'Online Learning',
                    
                    // Business & Finance
                    'Business', 'Entrepreneurship', 'Finance', 'Investing', 'Real Estate', 'Marketing',
                    'Sales', 'Management', 'Startups', 'Trading',
                    
                    // Sports & Fitness
                    'Sports', 'Fitness', 'Running', 'Weightlifting', 'Yoga', 'Swimming',
                    'Basketball', 'Football', 'Soccer', 'Tennis', 'Golf', 'Cycling',
                    'Martial Arts', 'Boxing', 'MMA', 'Olympics',
                    
                    // Entertainment & Media
                    'Music', 'Movies', 'TV Shows', 'Streaming', 'Podcasts', 'Comedy',
                    'Dancing', 'Theater', 'Concerts', 'Festivals', 'Gaming', 'Anime',
                    'Manga', 'Comics', 'Books', 'Literature',
                    
                    // Lifestyle & Fashion
                    'Fashion', 'Beauty', 'Makeup', 'Skincare', 'Hair', 'Jewelry',
                    'Shopping', 'Luxury', 'Streetwear', 'Vintage', 'Designer',
                    
                    // Food & Dining
                    'Food', 'Cooking', 'Baking', 'Restaurants', 'Wine', 'Coffee',
                    'Craft Beer', 'Cocktails', 'Healthy Eating', 'Vegan', 'Vegetarian',
                    'Fine Dining', 'Food Trucks', 'Cooking Shows',
                    
                    // Travel & Adventure
                    'Travel', 'Adventure', 'Hiking', 'Camping', 'Backpacking', 'Skiing',
                    'Snowboarding', 'Surfing', 'Diving', 'Sailing', 'Road Trips',
                    'International Travel', 'Luxury Travel', 'Budget Travel',
                    
                    // Arts & Creativity
                    'Art', 'Design', 'Photography', 'Painting', 'Drawing', 'Sculpture',
                    'Crafts', 'DIY', 'Home Decor', 'Interior Design', 'Architecture',
                    'Graphic Design', 'Web Design', 'Fashion Design',
                    
                    // Health & Wellness
                    'Health', 'Wellness', 'Mental Health', 'Meditation', 'Mindfulness',
                    'Nutrition', 'Weight Loss', 'Fitness', 'Yoga', 'Pilates',
                    'Alternative Medicine', 'Self-Care', 'Personal Development',
                    
                    // Home & Family
                    'Home & Garden', 'Gardening', 'Pets', 'Dogs', 'Cats', 'Parenting',
                    'Family', 'Kids', 'Babies', 'Pregnancy', 'Marriage',
                    'Home Improvement', 'Renovation', 'Furniture',
                    
                    // Hobbies & Activities
                    'Reading', 'Writing', 'Blogging', 'Podcasting', 'Collecting',
                    'Board Games', 'Card Games', 'Puzzles', 'Chess', 'Magic',
                    'Knitting', 'Sewing', 'Woodworking', 'Metalworking',
                    
                    // Automotive & Transportation
                    'Cars', 'Motorcycles', 'Bicycles', 'Aviation', 'Boats',
                    'Classic Cars', 'Luxury Cars', 'Racing', 'Formula 1',
                    
                    // Science & Education
                    'Science', 'Space', 'Astronomy', 'Physics', 'Chemistry',
                    'Biology', 'History', 'Geography', 'Languages', 'Education',
                    'Online Courses', 'Tutorials', 'Research',
                    
                    // News & Politics
                    'News', 'Politics', 'Current Events', 'World News', 'Local News',
                    'Technology News', 'Business News', 'Sports News',
                    
                    // Religion & Spirituality
                    'Religion', 'Spirituality', 'Christianity', 'Islam', 'Judaism',
                    'Buddhism', 'Hinduism', 'Meditation', 'Prayer',
                    
                    // Other
                    'Volunteering', 'Charity', 'Environment', 'Sustainability',
                    'Climate Change', 'Social Causes', 'Activism', 'Community'
                  ].map((interest) => (
                    <label key={interest} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px' }}>
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, interests: [...formData.interests, interest]});
                          } else {
                            setFormData({...formData, interests: formData.interests.filter(i => i !== interest)});
                          }
                        }}
                      />
                      <span style={{ fontSize: '13px', color: '#374151' }}>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Behaviors */}
              <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '20px', backgroundColor: '#f9fafb' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Behaviors & Purchase History</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    'Frequent Online Shoppers', 'Mobile Device Users', 'Desktop Users',
                    'High-Value Purchasers', 'Brand Loyalists', 'Price Sensitive',
                    'Early Adopters', 'Luxury Buyers', 'Bargain Hunters', 'Subscription Users',
                    'Gift Buyers', 'Seasonal Shoppers', 'Impulse Buyers', 'Research Heavy',
                    'Social Media Active', 'Email Subscribers', 'App Users', 'Website Visitors'
                  ].map((behavior) => (
                    <label key={behavior} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px' }}>
                      <input
                        type="checkbox"
                        checked={formData.behaviors.includes(behavior)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, behaviors: [...formData.behaviors, behavior]});
                          } else {
                            setFormData({...formData, behaviors: formData.behaviors.filter(b => b !== behavior)});
                          }
                        }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>{behavior}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Life Events */}
              <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '20px', backgroundColor: '#f9fafb' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Life Events</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    'Recently Moved', 'New Job', 'Engaged', 'Married', 'New Parent',
                    'Recently Graduated', 'Retired', 'New Homeowner', 'Recently Divorced',
                    'Empty Nester', 'Career Change', 'Started Business', 'Recently Traveled',
                    'Health Milestone', 'Financial Milestone', 'Relationship Change'
                  ].map((event) => (
                    <label key={event} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px' }}>
                      <input
                        type="checkbox"
                        checked={formData.lifeEvents.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, lifeEvents: [...formData.lifeEvents, event]});
                          } else {
                            setFormData({...formData, lifeEvents: formData.lifeEvents.filter(e => e !== event)});
                          }
                        }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>{event}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Audiences */}
              <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '20px', backgroundColor: '#f9fafb' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Custom Audiences</h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.websiteVisitors}
                      onChange={(e) => setFormData({...formData, websiteVisitors: e.target.checked})}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Website Visitors (Last 30 days)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.appUsers}
                      onChange={(e) => setFormData({...formData, appUsers: e.target.checked})}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>App Users</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.emailList}
                      onChange={(e) => setFormData({...formData, emailList: e.target.checked})}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Email List Subscribers</span>
                  </label>
                </div>
              </div>

              {/* Lookalike Audiences */}
              <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '20px', backgroundColor: '#f9fafb' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Lookalike Audiences</h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {[
                    'Similar to Website Visitors (1%)', 'Similar to Website Visitors (2%)',
                    'Similar to Email List (1%)', 'Similar to Email List (2%)',
                    'Similar to App Users (1%)', 'Similar to App Users (2%)',
                    'Similar to High-Value Customers (1%)', 'Similar to High-Value Customers (2%)'
                  ].map((lookalike) => (
                    <label key={lookalike} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px' }}>
                      <input
                        type="checkbox"
                        checked={formData.lookalikeAudiences.includes(lookalike)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, lookalikeAudiences: [...formData.lookalikeAudiences, lookalike]});
                          } else {
                            setFormData({...formData, lookalikeAudiences: formData.lookalikeAudiences.filter(l => l !== lookalike)});
                          }
                        }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>{lookalike}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Platform
        return (
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
              Choose Platforms
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {Object.entries(platformIcons).map(([platform, Icon]) => (
                <label
                  key={platform}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    border: formData.platforms.includes(platform) ? '2px solid var(--mc-sidebar-bg)' : '1px solid #e5e7eb',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    backgroundColor: formData.platforms.includes(platform) ? '#eff6ff' : 'white'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, platforms: [...formData.platforms, platform]});
                      } else {
                        setFormData({...formData, platforms: formData.platforms.filter(p => p !== platform)});
                      }
                    }}
                  />
                  <Icon size={24} color={platformColors[platform as keyof typeof platformColors]} />
                  <span style={{ textTransform: 'capitalize', fontWeight: '500', color: '#374151' }}>
                    {platform}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 3: // Objective
        return (
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
              Campaign Objective
            </h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { id: 'awareness', title: 'Awareness', description: 'Brand awareness and reach' },
                { id: 'traffic', title: 'Traffic', description: 'Website clicks and app installs' },
                { id: 'engagement', title: 'Engagement', description: 'Post engagement and page likes' },
                { id: 'leads', title: 'Leads', description: 'Lead generation and instant forms' },
                { id: 'sales', title: 'Sales', description: 'Conversions and catalog sales' }
              ].map((objective) => (
                <label
                  key={objective.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    border: formData.objective === objective.id ? '2px solid var(--mc-sidebar-bg)' : '1px solid #e5e7eb',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    backgroundColor: formData.objective === objective.id ? '#eff6ff' : 'white'
                  }}
                >
                  <input
                    type="radio"
                    name="objective"
                    value={objective.id}
                    checked={formData.objective === objective.id}
                    onChange={(e) => setFormData({...formData, objective: e.target.value})}
                  />
                  <div>
                    <div style={{ fontWeight: '500', color: '#374151' }}>{objective.title}</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>{objective.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 4: // Budget
        return (
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
              Budget & Bidding
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {/* Budget Type */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Budget Type
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['daily', 'lifetime'].map((type) => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="budgetType"
                        value={type}
                        checked={formData.budgetType === type}
                        onChange={(e) => setFormData({...formData, budgetType: e.target.value})}
                      />
                      <span style={{ textTransform: 'capitalize', color: '#374151' }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Amount */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Budget Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="Enter budget amount"
                  value={formData.budgetAmount}
                  onChange={(e) => setFormData({...formData, budgetAmount: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                />
              </div>

              {/* Bid Strategy - Full Width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Bid Strategy
                </label>
                <select
                  value={formData.bidStrategy}
                  onChange={(e) => setFormData({...formData, bidStrategy: e.target.value})}
                  style={{ width: '100%', maxWidth: '300px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                >
                  <option value="lowest_cost">Lowest Cost</option>
                  <option value="cost_cap">Cost Cap</option>
                  <option value="bid_cap">Bid Cap</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5: // Creative
        return (
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
              Create Your Ad
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {/* Ad Type */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Ad Type
                </label>
                <select
                  value={formData.adType}
                  onChange={(e) => setFormData({...formData, adType: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                >
                  <option value="single_image">Single Image</option>
                  <option value="carousel">Carousel</option>
                  <option value="video">Video</option>
                  <option value="collection">Collection</option>
                </select>
              </div>

              {/* Call to Action */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Call to Action
                </label>
                <select
                  value={formData.cta}
                  onChange={(e) => setFormData({...formData, cta: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                >
                  <option value="Learn More">Learn More</option>
                  <option value="Shop Now">Shop Now</option>
                  <option value="Sign Up">Sign Up</option>
                  <option value="Download">Download</option>
                  <option value="Get Quote">Get Quote</option>
                </select>
              </div>

              {/* Headline */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Headline
                </label>
                <input
                  type="text"
                  placeholder="Enter headline"
                  value={formData.headline}
                  onChange={(e) => setFormData({...formData, headline: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                />
              </div>

              {/* Primary Text - Full Width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Primary Text
                </label>
                <textarea
                  placeholder="Enter your ad copy"
                  value={formData.primaryText}
                  onChange={(e) => setFormData({...formData, primaryText: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '20px', minHeight: '100px', fontSize: '14px' }}
                />
              </div>

              {/* Creative Upload - Full Width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Creative Upload
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setFormData({...formData, creativeFile: e.target.files?.[0] || null})}
                  style={{ width: '100%', maxWidth: '400px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '14px' }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Create Campaign
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Step {currentStep} of 5: {steps[currentStep - 1].title}
            </p>
          </div>
          <button
            onClick={onClose}
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

        {/* Progress Bar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {steps.map((step) => (
              <div
                key={step.id}
                style={{
                  flex: 1,
                  height: '4px',
                  backgroundColor: step.id <= currentStep ? 'var(--mc-sidebar-bg-hover)' : '#e5e7eb',
                  borderRadius: '2px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              backgroundColor: 'white',
              color: currentStep === 1 ? '#9ca3af' : '#374151',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            {currentStep === 5 ? (
              <button
                onClick={handleSubmit}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: 'var(--mc-sidebar-bg-hover)',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Create Campaign
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: 'var(--mc-sidebar-bg-hover)',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.objective.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || campaign.platform === platformFilter;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ));
  };

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Marketing Campaigns
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage and optimize your social media marketing campaigns
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={20} />
            Create Campaign
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <DollarSign size={20} color="#10b981" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Budget</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {formatCurrency(totalBudget)}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <TrendingUp size={20} color="var(--mc-sidebar-bg)" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Spent</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {formatCurrency(totalSpent)}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Users size={20} color="#8b5cf6" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Reach</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {formatNumber(totalReach)}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Target size={20} color="#f59e0b" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Conversions</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {formatNumber(totalConversions)}
            </div>
          </div>
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
              placeholder="Search campaigns..."
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
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

      </div>

      {/* Campaigns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
        {filteredCampaigns.map((campaign) => {
          const PlatformIcon = platformIcons[campaign.platform];
          const platformColor = platformColors[campaign.platform];
          
          return (
            <div
              key={campaign.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'all 0.2s',
                cursor: 'pointer',
                border: selectedCampaign?.id === campaign.id ? '2px solid var(--mc-sidebar-bg)' : '1px solid #e5e7eb'
              }}
              onClick={() => setSelectedCampaign(campaign)}
            >
              {/* Campaign Header */}
              <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '20px', 
                      background: platformColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <PlatformIcon size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                        {campaign.name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        {campaign.objective}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCampaignStatus(campaign.id);
                      }}
                      style={{
                        padding: '6px',
                        border: 'none',
                        borderRadius: '20px',
                        background: campaign.status === 'active' ? '#fef3c7' : '#dbeafe',
                        color: campaign.status === 'active' ? '#92400e' : '#1e40af',
                        cursor: 'pointer'
                      }}
                    >
                      {campaign.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '6px',
                        border: 'none',
                        borderRadius: '20px',
                        background: '#f3f4f6',
                        color: '#6b7280',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    ...getStatusColor(campaign.status).split(' ').reduce((acc, className) => {
                      if (className.startsWith('text-')) acc.color = className.replace('text-', '');
                      if (className.startsWith('bg-')) acc.background = className.replace('bg-', '');
                      return acc;
                    }, {} as any)
                  }}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {campaign.startDate} - {campaign.endDate}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Budget</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>ROAS</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>
                      {campaign.roas}x
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Metrics */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Reach</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {formatNumber(campaign.reach)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Impressions</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {formatNumber(campaign.impressions)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Clicks</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {formatNumber(campaign.clicks)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Conversions</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {formatNumber(campaign.conversions)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                  <span>CTR: {campaign.ctr}%</span>
                  <span>CPC: {formatCurrency(campaign.cpc)}</span>
                  <span>CPM: {formatCurrency(campaign.cpm)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Megaphone size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
            No campaigns found
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>
            {searchQuery || statusFilter !== 'all' || platformFilter !== 'all' 
              ? 'Try adjusting your filters to see more campaigns'
              : 'Create your first marketing campaign to get started'
            }
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Create Campaign
          </button>
        </div>
      )}

      {/* Create Campaign Modal */}
      <CreateCampaignModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}
