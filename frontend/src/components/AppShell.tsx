"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar, type SidebarGroup } from '@/components';
import {
  LayoutDashboard,
  MessageSquare,
  Bell,
  FileText,
  Users,
  Globe,
  Wallet,
  BarChart3,
  ShieldCheck,
  Telescope,
  Handshake,
  Megaphone,
  UserCheck,
  CreditCard,
  FileCheck,
  Banknote,
  Award,
  Wrench,
  Settings,
  Package,
  Landmark,
  MapPin,
  Home,
  Key,
  FileText as FileTextIcon,
  DollarSign,
  Shield,
  TrendingUp,
  Briefcase,
  Warehouse,
  SearchCheck,
  Receipt,
  Building2,
  Trees,
  Truck,
  Zap,
  ChevronDown
} from 'lucide-react';
import { PayrollIcon } from './icons/PayrollIcon';
import { InvoicingIcon } from './icons/InvoicingIcon';
import { Database } from 'lucide-react';
import { FaUserTie, FaSignOutAlt } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';
import InvestmentIcon from './icons/InvestmentIcon';
import { useAuth } from '../contexts/AuthContext';

type CurrentUser = { id: number; email: string; full_name: string; role?: string } | null;

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState('TZS');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  const currencies = [
    { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪' },
    { code: 'RWF', name: 'Rwanda Franc', flag: '🇷🇼' },
    { code: 'TZS', name: 'Tanzania Shilling', flag: '🇹🇿' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'ZMW', name: 'Zambian Kwacha', flag: '🇿🇲' },
    { code: 'MWK', name: 'Malawian Kwacha', flag: '🇲🇼' },
    { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
    { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦' },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false);
      }
    };

    if (showCurrencyDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCurrencyDropdown]);

  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const isAuthPage = pathname === '/authentication/login' || pathname?.startsWith('/authentication');

  // Use user from auth context
  const user = React.useMemo<CurrentUser>(() => {
    if (!authUser) return null;
    return {
      id: authUser.id,
      email: authUser.email,
      full_name: authUser.full_name,
      role: 'User'
    };
  }, [authUser]);

  React.useEffect(() => {
    const update = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const items: SidebarGroup[] = React.useMemo(() => {
    const base = [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
      { 
        id: 'finance', 
        label: 'Finance', 
        href: '/finance', 
        icon: <Wallet size={20} />,
        subItems: [
          { id: 'finance-transactions', label: 'Accounting', href: '/finance/transactions', icon: <CreditCard size={16} /> },
          { id: 'finance-wallet', label: 'My Wallet', href: '/finance/wallets', icon: <Wallet size={16} /> },
          { id: 'finance-payroll', label: 'Payroll', href: '/finance/payroll', icon: <PayrollIcon size={16} color="currentColor" /> },
          { id: 'finance-invoicing', label: 'Invoicing', href: '/finance/invoicing', icon: <InvoicingIcon size={16} color="currentColor" /> },
          { id: 'finance-escrow', label: 'Escrow', href: '/finance/escrow', icon: <Shield size={16} /> },
          { id: 'finance-loans', label: 'Loans', href: '/finance/loans', icon: <Banknote size={16} /> }
        ]
      },
      { 
        id: 'inventory', 
        label: 'Inventory', 
        href: '/inventory', 
        icon: <Package size={20} />,
        subItems: [
          { id: 'inventory-home', label: 'Inventories', href: '/inventory', icon: <Package size={16} /> },
          { id: 'inventory-modules', label: 'Modules', href: '/inventory/modules', icon: <Database size={16} /> }
        ]
      },
      { id: 'crm', label: 'CRM', href: '/crm', icon: <UserCheck size={20} /> },
      // { id: 'marketing', label: 'Marketing', href: '/marketing', icon: <Megaphone size={20} /> },
      // { 
      //   id: 'investments', 
      //   label: 'Investments', 
      //   href: '/investments', 
      //   icon: <InvestmentIcon size={20} />,
      //   subItems: [
      //     { id: 'investments-infrastructure', label: 'Infrastructure', href: '/investments/infrastructure', icon: <Landmark size={16} /> },
      //     { id: 'investments-agriculture', label: 'Agriculture', href: '/investments/agriculture', icon: <Trees size={16} /> }
      //   ]
      // },
      { id: 'real-estates', label: 'Real Estates', href: '/real-estates', icon: <Landmark size={20} /> },
      { 
        id: 'settings', 
        label: 'Settings', 
        href: '/settings', 
        icon: <Settings size={20} />,
        subItems: [
          { id: 'settings-configuration', label: 'Configuration', href: '/settings', icon: <Settings size={16} /> },
          { id: 'settings-apis', label: 'APIs', href: '/settings/apis', icon: <Key size={16} /> }
        ]
      },
    ];
    return [{ id: 'main', items: base }];
  }, []);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isMobile) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--mc-sidebar-bg)', color: '#e2e8f0',
        textAlign: 'center', padding: 24
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Mobile Not Supported</div>
          <div style={{ opacity: 0.9 }}>Please use a desktop or tablet to access this application.</div>
        </div>
      </div>
    );
  }

  return (
    <Sidebar
      productName="arisportal"
      logo={<div className="mc-logo">MG</div>}
      items={items}
      initialCollapsed={false}
      onNavigate={(href) => { if (href !== pathname) router.push(href); }}
      currentPath={pathname || ''}
      footerCta={{ label: 'Logout', icon: <FaSignOutAlt size={18} />, onClick: () => { logout(); router.replace('/authentication/login'); } }}
      header={{
        actions: (
          <>
            {/* SMS Credits Display */}
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              SMS Credits: <span style={{ color: '#10b981' }}>1,250</span>
            </div>
            
            {/* Currency Dropdown */}
            <div ref={currencyDropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <span style={{ fontSize: '16px' }}>
                  {currencies.find(c => c.code === selectedCurrency)?.flag || '🇺🇸'}
                </span>
                <span>{selectedCurrency}</span>
                <ChevronDown size={14} />
              </button>
              
              {showCurrencyDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  zIndex: 1000,
                  minWidth: '120px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => {
                        setSelectedCurrency(currency.code);
                        setShowCurrencyDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        backgroundColor: selectedCurrency === currency.code ? '#f3f4f6' : 'transparent',
                        color: selectedCurrency === currency.code ? '#1f2937' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: selectedCurrency === currency.code ? '600' : '400',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCurrency !== currency.code) {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCurrency !== currency.code) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span style={{ marginRight: '8px', fontSize: '16px' }}>{currency.flag}</span>
                      {currency.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="mc-icon-btn" aria-label="Chats" onClick={() => router.push('/communications')}>
              <MessageSquare size={18} />
            </button>
            <button className="mc-icon-btn" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="mc-userchip" onClick={() => router.push('/profile')} style={{ cursor: 'pointer' }}>
              <div className="mc-userinfo">
                <span className="mc-username">{user?.full_name || authUser?.full_name || 'Guest'}</span>
                <span className="mc-role">{authUser?.business_name || 'User'}</span>
              </div>
              <span className="mc-avatar">
                {user?.full_name ? user.full_name.charAt(0) : authUser?.full_name?.charAt(0) || 'G'}
              </span>
            </div>
          </>
        )
      }}
    >
      {children}
    </Sidebar>
  );
};

export default AppShell;
