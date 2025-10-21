import React, { useState } from 'react';
import { SidebarGroup, SidebarLink } from './Sidebar.types';
import { ChevronDown, ChevronRight } from 'lucide-react';

type Props = {
  group: SidebarGroup;
  collapsed: boolean;
  onNavigate?: (href: string) => void;
  currentPath?: string;
};

export const SidebarItem: React.FC<Props> = ({ group, collapsed, onNavigate, currentPath }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderLink = (link: SidebarLink, level: number = 0) => {
    const handleClick = () => {
      if (link.onClick) link.onClick();
      if (link.href && onNavigate) onNavigate(link.href);
    };

    const hasSubItems = link.subItems && link.subItems.length > 0;
    const isExpanded = expandedItems.has(link.id);
    
    // Check if any sub-item is active
    const hasActiveSubItem = hasSubItems && link.subItems!.some(subLink => 
      currentPath && subLink.href && currentPath === subLink.href
    );
    
    // Only highlight parent if no sub-item is active, and only highlight sub-item if it matches exactly
    const isActive = !!(currentPath && link.href && currentPath === link.href && !hasActiveSubItem);

    return (
      <li key={link.id}>
        <button
          className={isActive ? 'mc-nav-link mc-nav-link--active' : 'mc-nav-link'}
          aria-label={link.label}
          onClick={hasSubItems ? () => toggleExpanded(link.id) : handleClick}
          style={{ 
            paddingLeft: `${12 + (level * 16)}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {link.icon && <span className="mc-nav-link__icon">{link.icon}</span>}
            {!collapsed && <span className="mc-nav-link__label">{link.label}</span>}
            {!collapsed && link.badgeText && (
              <span className="mc-badge">{link.badgeText}</span>
            )}
          </div>
          {!collapsed && hasSubItems && (
            <span className="mc-nav-link__chevron">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
        </button>
        
        {!collapsed && hasSubItems && isExpanded && (
          <ul className="mc-nav-sublist" style={{ marginLeft: '16px' }}>
            {link.subItems!.map((subLink) => renderLink(subLink, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="mc-nav-group">
      {group.label && !collapsed && (
        <div className="mc-nav-group__label">{group.label}</div>
      )}
      <ul className="mc-nav-list">
        {group.items.map((link) => renderLink(link))}
      </ul>
    </div>
  );
};

export default SidebarItem;