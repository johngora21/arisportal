"use client";
import React from 'react';
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
  Award,
  Wrench,
  Settings,
  Package,
  Building,
  MapPin,
  Home,
  Key,
  FileText as FileTextIcon,
  DollarSign,
  Shield,
  TrendingUp
} from 'lucide-react';
import { FaUserTie, FaSignOutAlt } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';

type CurrentUser = { id: number; email: string; full_name: string; role: 'admin'|'mentor'|'investor'|'entrepreneur' } | null;

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<CurrentUser>(null);
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const API_BASE = '';
  const AUTH_DISABLED = true; // temporarily disable auth enforcement
  const isAuthPage = pathname === '/authentication/login' || pathname?.startsWith('/authentication');

  React.useEffect(() => {
    if (AUTH_DISABLED) return; // skip auth check entirely
    if (isAuthPage) return; // avoid fetching when on auth pages
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data?.data || null);
        } else {
          setUser(null);
          if (pathname && pathname !== '/authentication/login') router.replace('/');
        }
      } catch {
        setUser(null);
        if (pathname && pathname !== '/authentication/login') router.replace('/');
      }
    };
    load();
  }, [pathname, router, isAuthPage, API_BASE, AUTH_DISABLED]);

  React.useEffect(() => {
    const update = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const items: SidebarGroup[] = React.useMemo(() => {
    const base = [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
      { id: 'crm', label: 'CRM', href: '/crm', icon: <UserCheck size={20} /> },
      { 
        id: 'hr', 
        label: 'HR', 
        href: '/hr', 
        icon: <FaUserTie size={20} />,
        subItems: [
          { id: 'hr-dashboard', label: 'Dashboard', href: '/hr', icon: <LayoutDashboard size={16} /> },
          { id: 'hr-employees', label: 'Employees', href: '/hr/employees', icon: <Users size={16} /> },
          { id: 'hr-payroll', label: 'Payroll', href: '/hr/modules', icon: <CreditCard size={16} /> },
          { id: 'hr-reports', label: 'Reports', href: '/hr/reports', icon: <BarChart3 size={16} /> }
        ]
      },
      { 
        id: 'tenders', 
        label: 'Tenders', 
        href: '/tenders', 
        icon: <FileText size={20} />,
        subItems: [
          { id: 'tenders-list', label: 'All Tenders', href: '/tenders', icon: <FileText size={16} /> },
          { id: 'tenders-tools', label: 'Tender Tools', href: '/tenders/tools', icon: <Wrench size={16} /> }
        ]
      },
      { 
        id: 'finance', 
        label: 'Finance', 
        href: '/finance', 
        icon: <Wallet size={20} />,
        subItems: [
          { id: 'finance-module', label: 'Payments', href: '/finance', icon: <CreditCard size={16} /> },
          { id: 'audit-module', label: 'Audit', href: '/finance/audit', icon: <FileCheck size={16} /> }
        ]
      },
      { id: 'marketing', label: 'Marketing', href: '/marketing', icon: <Megaphone size={20} /> },
      { id: 'inventory', label: 'Inventory', href: '/inventory', icon: <Package size={20} /> },
      { 
        id: 'departments', 
        label: 'Departments', 
        href: '/departments', 
        icon: <Building size={20} />,
        subItems: [
          { id: 'departments-list', label: 'All Departments', href: '/departments', icon: <Building size={16} /> },
          { id: 'branches-list', label: 'Branches', href: '/departments/branches', icon: <MapPin size={16} /> }
        ]
      },
      { id: 'assets', label: 'Assets', href: '/assets', icon: <Home size={20} /> },
      { id: 'portfolios', label: 'Portifolio', href: '/portfolios', icon: <Globe size={20} /> },
      { id: 'compliance', label: 'Compliance & Security', href: '/compliance', icon: <ShieldCheck size={20} /> },
      { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
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
        minHeight: '100vh', background: '#0f172a', color: '#e2e8f0',
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
      productName="meritportal"
      logo={<div className="mc-logo">MG</div>}
      items={items}
      initialCollapsed={false}
      onNavigate={(href) => { if (href !== pathname) router.push(href); }}
      currentPath={pathname || ''}
      footerCta={{ label: 'Logout', icon: <FaSignOutAlt size={18} />, onClick: async () => { try { await fetch(`${API_BASE}/api/v1/auth/logout`, { method: 'POST', credentials: 'include' }); } catch {} finally { router.replace('/authentication/login'); } } }}
      header={{
        actions: (
          <>
            <button className="mc-icon-btn" aria-label="Chats" onClick={() => router.push('/communications')}>
              <MessageSquare size={18} />
            </button>
            <button className="mc-icon-btn" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="mc-userchip">
              <div className="mc-userinfo">
                <span className="mc-username">{user?.full_name || 'Guest'}</span>
                <span className="mc-role">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</span>
              </div>
              <span className="mc-avatar">EC</span>
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
