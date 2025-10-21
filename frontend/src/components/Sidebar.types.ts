import React from 'react';

export type SidebarLink = {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  badgeText?: string;
  subItems?: SidebarLink[];
};

export type SidebarGroup = {
  id: string;
  label?: string;
  items: SidebarLink[];
};

export type SidebarProps = {
  logo?: React.ReactNode;
  productName?: string; // optional, no defaults to avoid hardcoding
  items: SidebarGroup[];
  initialCollapsed?: boolean;
  onNavigate?: (href: string) => void;
  onToggle?: (collapsed: boolean) => void;
  className?: string;
  footerCta?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  header?: {
    title?: string;
    actions?: React.ReactNode;
  };
  children?: React.ReactNode; // inner page content, constrained next to sidebar
  currentPath?: string; // used to highlight active nav link
};


