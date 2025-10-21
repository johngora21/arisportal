import React, { useMemo, useState } from 'react';
import { SidebarItem } from './SidebarItem';
import { SidebarGroup, SidebarProps } from './Sidebar.types';
import '../styles/sidebar.css';

export const Sidebar: React.FC<SidebarProps> = ({
  logo,
  productName,
  items,
  initialCollapsed = false,
  onNavigate,
  onToggle,
  className,
  footerCta,
  header,
  children,
  currentPath,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed);

  const groups = useMemo<SidebarGroup[]>(() => items, [items]);

  return (
    <div className={(collapsed ? 'mc-shell mc-shell--collapsed' : 'mc-shell') + (className ? ' ' + className : '')}>
      <aside className={collapsed ? 'mc-sidebar mc-sidebar--collapsed' : 'mc-sidebar'}>
        <div className="mc-sidebar__top">
          {logo ? (
            <div className="mc-sidebar__brand">
              {logo}
              {productName && <span className="mc-sidebar__title">{productName}</span>}
            </div>
          ) : (
            <div className="mc-sidebar__brand mc-sidebar__brand--text">
              <span className="mc-sidebar__dot" />
              {productName && <span className="mc-sidebar__title">{productName}</span>}
            </div>
          )}
        </div>

        <nav className="mc-sidebar__nav" aria-label="Primary">
          {groups.map((group) => (
            <SidebarItem
              key={group.id}
              group={group}
              collapsed={collapsed}
              onNavigate={onNavigate}
              currentPath={currentPath}
            />)
          )}
        </nav>

        {footerCta && (
          <div className="mc-sidebar__bottom">
            <button className="mc-btn mc-btn--logout mc-w-full" onClick={footerCta.onClick}>
              {footerCta.icon && <span className="mc-nav-link__icon">{footerCta.icon}</span>}
              <span className="mc-nav-link__label">{footerCta.label}</span>
            </button>
          </div>
        )}
      </aside>

      <section className="mc-content">
        <header className="mc-topbar">
          <div className="mc-topbar__title">{header?.title}</div>
          <div className="mc-topbar__actions">{header?.actions}</div>
        </header>
        <main className="mc-main">
          {children}
        </main>
      </section>
    </div>
  );
};

export default Sidebar;


