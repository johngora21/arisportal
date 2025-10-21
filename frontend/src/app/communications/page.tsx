'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  Paperclip, 
  MoreVertical,
  Settings,
  Check,
  CheckCheck,
  AlertCircle,
  Hash
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'customer';
  timestamp: Date;
  channel: 'whatsapp' | 'sms' | 'email';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: string[];
}

interface Conversation {
  id: string;
  customer: {
    name: string;
    avatar?: string;
    phone?: string;
    email?: string;
    company?: string;
  };
  lastMessage: Message;
  unreadCount: number;
  channel: 'whatsapp' | 'sms' | 'email';
  status: 'active' | 'archived' | 'starred';
  tags: string[];
  createdAt: Date;
}

// Mock data removed - using real API data
const mockConversations: Conversation[] = [
  {
    id: '1',
    customer: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah@techstartup.com',
      company: 'TechStartup Inc'
    },
    lastMessage: {
      id: 'm1',
      content: "Thanks for the pitch deck! I'll review it and get back to you by Friday.",
      sender: 'customer',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      channel: 'whatsapp',
      status: 'read'
    },
    unreadCount: 2,
    channel: 'whatsapp',
    status: 'active',
    tags: ['hot-lead', 'investor'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    customer: {
      name: 'Startup Founders Group',
      phone: '+1 (555) 987-6543',
      company: 'Founder Network'
    },
    lastMessage: {
      id: 'm2',
      content: "Has anyone tried the new funding platform?",
      sender: 'customer',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      channel: 'whatsapp',
      status: 'delivered'
    },
    unreadCount: 1,
    channel: 'whatsapp',
    status: 'active',
    tags: ['group', 'community'],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
  },
  {
    id: '3',
    customer: {
      name: 'Dr. James Wilson',
      email: 'james.wilson@mentor.com',
      company: 'Mentor Network'
    },
    lastMessage: {
      id: 'm3',
      content: "The mentorship session was very helpful. Thank you!",
      sender: 'customer',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      channel: 'email',
      status: 'read'
    },
    unreadCount: 0,
    channel: 'email',
    status: 'starred',
    tags: ['mentor', 'feedback'],
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000)
  },
  {
    id: '4',
    customer: {
      name: 'Investor Network',
      phone: '+1 (555) 456-7890',
      company: 'VC Partners'
    },
    lastMessage: {
      id: 'm4',
      content: "Great deal flow this quarter!",
      sender: 'customer',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      channel: 'sms',
      status: 'sent'
    },
    unreadCount: 1,
    channel: 'sms',
    status: 'active',
    tags: ['investor', 'quarterly'],
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000)
  },
  {
    id: '5',
    customer: {
      name: 'Alex Chen',
      phone: '+1 (555) 111-2222',
      email: 'alex@startupxyz.com',
      company: 'StartupXYZ'
    },
    lastMessage: {
      id: 'm5',
      content: "Interested in your funding round. Can we schedule a call?",
      sender: 'customer',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      channel: 'email',
      status: 'read'
    },
    unreadCount: 0,
    channel: 'email',
    status: 'active',
    tags: ['startup', 'funding'],
    createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000)
  },
  {
    id: '6',
    customer: {
      name: 'Maria Garcia',
      phone: '+1 (555) 333-4444',
      email: 'maria@innovationlabs.com',
      company: 'Innovation Labs'
    },
    lastMessage: {
      id: 'm6',
      content: "The demo was impressive. Let's move forward.",
      sender: 'customer',
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
      channel: 'whatsapp',
      status: 'delivered'
    },
    unreadCount: 3,
    channel: 'whatsapp',
    status: 'active',
    tags: ['client', 'demo'],
    createdAt: new Date(Date.now() - 144 * 60 * 60 * 1000)
  },
  {
    id: '7',
    customer: {
      name: 'John Smith',
      phone: '+1 (555) 555-6666',
      email: 'john@venturecapital.com',
      company: 'Venture Capital'
    },
    lastMessage: {
      id: 'm7',
      content: "Due diligence is complete. We're ready to invest.",
      sender: 'customer',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      channel: 'email',
      status: 'read'
    },
    unreadCount: 0,
    channel: 'email',
    status: 'active',
    tags: ['vc', 'investment'],
    createdAt: new Date(Date.now() - 168 * 60 * 60 * 1000)
  },
  {
    id: '8',
    customer: {
      name: 'Lisa Wang',
      phone: '+1 (555) 777-8888',
      email: 'lisa@techaccelerator.com',
      company: 'Tech Accelerator'
    },
    lastMessage: {
      id: 'm8',
      content: "Your application has been approved for our program.",
      sender: 'customer',
      timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
      channel: 'sms',
      status: 'delivered'
    },
    unreadCount: 1,
    channel: 'sms',
    status: 'active',
    tags: ['accelerator', 'program'],
    createdAt: new Date(Date.now() - 192 * 60 * 60 * 1000)
  },
  {
    id: '9',
    customer: {
      name: 'David Brown',
      phone: '+1 (555) 999-0000',
      email: 'david@angelinvestors.com',
      company: 'Angel Investors'
    },
    lastMessage: {
      id: 'm9',
      content: "Looking forward to the pitch presentation next week.",
      sender: 'customer',
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
      channel: 'email',
      status: 'read'
    },
    unreadCount: 0,
    channel: 'email',
    status: 'active',
    tags: ['angel', 'pitch'],
    createdAt: new Date(Date.now() - 216 * 60 * 60 * 1000)
  },
  {
    id: '10',
    customer: {
      name: 'Emma Davis',
      phone: '+1 (555) 123-7890',
      email: 'emma@corporatepartners.com',
      company: 'Corporate Partners'
    },
    lastMessage: {
      id: 'm10',
      content: "Partnership proposal looks good. Let's discuss terms.",
      sender: 'customer',
      timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000),
      channel: 'whatsapp',
      status: 'delivered'
    },
    unreadCount: 2,
    channel: 'whatsapp',
    status: 'active',
    tags: ['partnership', 'corporate'],
    createdAt: new Date(Date.now() - 240 * 60 * 60 * 1000)
];

// Mock data removed - using real API data
const mockMessages: Record<string, Message[]> = {};
const channelIcons = {
  whatsapp: MessageCircle,
  sms: Phone,
  email: Mail
};

const statusIcons = {
  sent: Check,
  delivered: CheckCheck,
  read: CheckCheck,
  failed: AlertCircle
};

const statusColors = {
  sent: '#9ca3af',
  delivered: '#60a5fa',
  read: '#10b981',
  failed: '#ef4444'
};

export default function CommunicationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'sms' | 'email'>('email');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.more-options-container')) {
        setShowMoreOptions(false);
      }
    };

    if (showMoreOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMoreOptions]);

  const filteredConversations = conversations.filter(conv => 
    conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.customer.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      channel: selectedChannel,
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), message]
    }));

    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const templates = [
    { name: 'Welcome', content: 'Welcome to Aris Portal! How can we help you today?' },
    { name: 'Follow-up', content: 'Hi! Just following up on our conversation. Do you have any questions?' },
    { name: 'Meeting', content: 'I\'d like to schedule a meeting to discuss your requirements. When works best for you?' },
    { name: 'Thank you', content: 'Thank you for your interest! We\'ll get back to you soon.' }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            overflow: hidden !important;
          }
          .chat-conversations-scroll::-webkit-scrollbar,
          .chat-messages::-webkit-scrollbar {
            display: none !important;
          }
          .chat-conversations-scroll,
          .chat-messages {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
        `
      }} />
      <div style={{ display: 'flex', height: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '320px', 
        background: 'white', 
        borderRight: '1px solid #e5e7eb', 
        display: 'flex', 
        flexDirection: 'column',
        marginTop: '64px' // Account for topbar height
      }}>
        {/* Header */}
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '16px' 
          }}>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: 'var(--mc-sidebar-bg)', 
              margin: 0 
            }}>💬 Chats</h1>
          </div>
          
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af' 
            }} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                background: 'white',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Channel Filter */}
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '4px', 
            background: '#f3f4f6', 
            borderRadius: '20px', 
            padding: '4px' 
          }}>
            {(['email', 'sms', 'whatsapp'] as const).map((channel) => {
              const Icon = channelIcons[channel];
              return (
                <button
                  key={channel}
                  onClick={() => setSelectedChannel(channel)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    background: selectedChannel === channel ? 'white' : 'none',
                    color: selectedChannel === channel ? 'var(--mc-sidebar-bg-hover)' : '#6b7280',
                    border: 'none',
                    boxShadow: selectedChannel === channel ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'
                  }}
                >
                  <Icon size={16} />
                  <span>{channel === 'sms' ? 'SMS' : channel.charAt(0).toUpperCase() + channel.slice(1)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversations List */}
        <div 
          className="chat-conversations-scroll"
          style={{ 
            flex: 1, 
            overflowY: 'auto',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* Internet Explorer 10+ */
            minHeight: 0,
            padding: '8px 0'
          }}
        >
          {filteredConversations.map((conversation) => {
            const ChannelIcon = channelIcons[conversation.channel];
            const isSelected = selectedConversation === conversation.id;
            
            return (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  background: isSelected ? '#eff6ff' : 'transparent',
                  borderLeft: isSelected ? '4px solid var(--mc-sidebar-bg-hover)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, var(--mc-sidebar-bg), #8b5cf6)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '16px'
                    }}>
                      {conversation.customer.name.charAt(0)}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '16px',
                      height: '16px',
                      background: 'var(--mc-sidebar-bg)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <ChannelIcon size={12} />
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      <h3 style={{
                        fontWeight: '500',
                        color: 'var(--mc-sidebar-bg)',
                        margin: 0,
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {conversation.customer.name}
                      </h3>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: '4px 0 8px 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {conversation.lastMessage.content}
                    </p>
                    
                    {conversation.unreadCount > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        marginTop: '8px'
                      }}>
                        <span style={{
                          background: 'var(--mc-sidebar-bg)',
                          color: 'white',
                          fontSize: '12px',
                          borderRadius: '20px',
                          padding: '2px 8px',
                          minWidth: '20px',
                          textAlign: 'center'
                        }}>
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        marginTop: '64px' // Account for topbar height
      }}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div style={{ 
              background: 'white', 
              borderBottom: '1px solid #e5e7eb', 
              padding: '16px' 
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, var(--mc-sidebar-bg), #8b5cf6)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    {currentConversation?.customer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 style={{ 
                      fontWeight: '600', 
                      color: 'var(--mc-sidebar-bg)', 
                      margin: 0, 
                      fontSize: '16px' 
                    }}>
                      {currentConversation?.customer.name}
                    </h2>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      margin: 0 
                    }}>
                      {currentConversation?.customer.company}
                    </p>
                  </div>
                </div>
                
                <div className="more-options-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                  <button 
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    style={{ 
                      padding: '8px', 
                      background: 'none', 
                      border: 'none', 
                      borderRadius: '20px', 
                      cursor: 'pointer' 
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>
                  
                  {showMoreOptions && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      zIndex: 10,
                      minWidth: '150px',
                      marginTop: '4px'
                    }}>
                      <button
                        onClick={() => {
                          setShowMoreOptions(false);
                          // Handle clear chats
                          console.log('Clear chats');
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #f3f4f6'
                        }}
                      >
                        Clear chats
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreOptions(false);
                          // Handle block
                          console.log('Block user');
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#ef4444'
                        }}
                      >
                        Block
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              className="chat-messages"
              style={{ 
                flex: 1, 
                padding: '16px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {currentMessages.map((message) => {
                const StatusIcon = statusIcons[message.status];
                const isUser = message.sender === 'user';
                
                return (
                  <div
                    key={message.id}
                    style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}
                  >
                    <div style={{
                      maxWidth: '320px',
                      padding: '12px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      background: isUser ? 'var(--mc-sidebar-bg)' : '#f3f4f6',
                      color: isUser ? 'white' : 'var(--mc-sidebar-bg)'
                    }}>
                      <p style={{ margin: 0 }}>{message.content}</p>
                      
                      {message.attachments && (
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {message.attachments.map((attachment, idx) => (
                            <div key={idx} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px', 
                              fontSize: '12px', 
                              opacity: 0.75 
                            }}>
                              <Paperclip size={12} />
                              <span>{attachment}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        marginTop: '8px' 
                      }}>
                        <span style={{ fontSize: '12px', opacity: 0.75 }}>
                          {formatTime(message.timestamp)}
                        </span>
                        {isUser && (
                          <StatusIcon
                            size={12}
                            style={{ color: statusColors[message.status] }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{ 
              background: 'white', 
              borderTop: '1px solid #e5e7eb', 
              padding: '16px' 
            }}>
              {/* Templates */}
              {showTemplates && (
                <div style={{ 
                  marginBottom: '16px', 
                  padding: '12px', 
                  background: '#f9fafb', 
                  borderRadius: '20px' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px' 
                  }}>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#374151', 
                      margin: 0 
                    }}>Quick Templates</h4>
                    <button
                      onClick={() => setShowTemplates(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '8px' 
                  }}>
                    {templates.map((template) => (
                      <button
                        key={template.name}
                        onClick={() => {
                          setNewMessage(template.content);
                          setShowTemplates(false);
                        }}
                        style={{
                          textAlign: 'left',
                          padding: '8px',
                          background: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '20px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ 
                          fontWeight: '500', 
                          color: 'var(--mc-sidebar-bg)', 
                          fontSize: '14px' 
                        }}>{template.name}</div>
                        <div style={{ 
                          color: '#6b7280', 
                          fontSize: '12px', 
                          marginTop: '2px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>{template.content}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end'
              }}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  style={{
                    width: '100%',
                    padding: '12px 50px 12px 35px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    background: 'white',
                    resize: 'none',
                    fontFamily: 'inherit',
                    minHeight: '20px',
                    maxHeight: '120px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }}
                />
                
                {/* File upload icon inside the text input */}
                <div style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <label style={{ 
                    padding: '6px', 
                    background: 'transparent', 
                    border: 'none', 
                    borderRadius: '20px', 
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} title="Attach file">
                    <Paperclip size={16} color="#64748b" />
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          console.log('File selected:', file.name);
                          // Handle file upload here
                        }
                      }}
                    />
                  </label>
                </div>
                
                {/* Send button on the right */}
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '8px',
                    background: newMessage.trim() ? 'var(--mc-sidebar-bg)' : '#e2e8f0',
                    color: newMessage.trim() ? 'white' : '#94a3b8',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px'
                  }}
                  title="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <MessageCircle size={48} style={{ 
                color: '#9ca3af', 
                marginBottom: '16px' 
              }} />
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '500', 
                color: 'var(--mc-sidebar-bg)', 
                margin: '0 0 8px 0' 
              }}>
                Select a conversation
              </h3>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Choose a chat from the sidebar or start a new conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}