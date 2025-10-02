"use client";
import React from 'react';

type User = { 
  id: number; 
  email: string; 
  full_name: string; 
  role: string;
  created_at?: string;
  is_active?: boolean;
};

type Stats = {
  totalUsers: number;
  activeUsers: number;
  pendingProjects: number;
  totalInvestments: number;
  mentors: number;
  investors: number;
  entrepreneurs: number;
};

const API = '';

export default function AdminSystemPage() {
  const [activeTab, setActiveTab] = React.useState<'users' | 'projects' | 'investments' | 'settings' | 'system'>('users');
  const [users, setUsers] = React.useState<User[]>([]);
  const [stats, setStats] = React.useState<Stats>({
    totalUsers: 0, activeUsers: 0, pendingProjects: 0, totalInvestments: 0,
    mentors: 0, investors: 0, entrepreneurs: 0
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Pagination & Search
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<'name' | 'email' | 'role' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 20;

  React.useEffect(() => {
    loadData();
  }, [currentPage, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load users with pagination
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        role: roleFilter !== 'all' ? roleFilter : '',
        status: statusFilter !== 'all' ? statusFilter : '',
        sort: sortBy,
        order: sortOrder
      });
      
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API}/api/v1/users?${params}`, { credentials: 'include' }),
        fetch(`${API}/api/v1/admin/stats`, { credentials: 'include' })
      ]);
      
      const usersData = await usersRes.json().catch(() => ({}));
      const statsData = await statsRes.json().catch(() => ({}));
      
      if (!usersRes.ok) throw new Error(usersData?.message || 'Failed to load users');
      
      setUsers(usersData.data || []);
      setStats(statsData.data || stats);
    } catch (e: any) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: number, action: 'approve' | 'suspend' | 'delete') => {
    try {
      const res = await fetch(`${API}/api/v1/admin/users/${userId}/${action}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (res.ok) {
        loadData(); // Refresh data
      } else {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Action failed');
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.is_active !== false) ||
      (statusFilter === 'inactive' && user.is_active === false);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Admin System</h1>
          <p>Manage users, projects, investments and system settings</p>
        </div>
        <div className="admin-actions">
          <button className="btn-primary" onClick={() => window.open('/api/v1/admin/export/users', '_blank')}>Export Users</button>
          <button className="btn-secondary">System Logs</button>
        </div>
      </div>

      <div className="admin-tabs">
        {(['users', 'projects', 'investments', 'settings', 'system'] as const).map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>


      {activeTab === 'users' && (
        <div className="admin-users">
          <div className="users-controls">
            <div className="search-filters">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="filter-select">
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="mentor">Mentor</option>
                <option value="investor">Investor</option>
                <option value="entrepreneur">Entrepreneur</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                <option value="all">All Status</option>
                <option value="active">Approved</option>
                <option value="inactive">Suspended</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="filter-select">
                <option value="created_at">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="role">Sort by Role</option>
              </select>
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="sort-btn"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {loading && <div className="loading">Loading users...</div>}
          {error && <div className="error">{error}</div>}
          
      {!loading && !error && (
            <>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
          <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="user-details">
                              <div className="user-name">{user.full_name}</div>
                              <div className="user-email">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.is_active !== false ? 'active' : 'inactive'}`}>
                            {user.is_active !== false ? 'Approved' : 'Suspended'}
                          </span>
                        </td>
                        <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="action-buttons">
                            {user.is_active !== false ? (
                              <button 
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                className="btn-small btn-warning"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUserAction(user.id, 'approve')}
                                className="btn-small btn-success"
                              >
                                Approve
                              </button>
                            )}
                            <button 
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="btn-small btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
              </tr>
            ))}
          </tbody>
        </table>
              </div>

              <div className="pagination">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="admin-projects">
          <div className="section-header">
            <h3>Project Management</h3>
            <p>Approve, reject, and manage project submissions</p>
          </div>
          <div className="project-filters">
            <select className="filter-select">
              <option value="all">All Projects</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <input type="text" placeholder="Search projects..." className="search-input" />
          </div>
          <div className="coming-soon">Project management features coming soon...</div>
        </div>
      )}

      {activeTab === 'investments' && (
        <div className="admin-investments">
          <div className="section-header">
            <h3>Investment Management</h3>
            <p>Monitor investments, transactions, and financial data</p>
          </div>
          <div className="investment-filters">
            <select className="filter-select">
              <option value="all">All Investments</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <input type="date" className="filter-select" />
            <input type="date" className="filter-select" />
          </div>
          <div className="coming-soon">Investment management features coming soon...</div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="admin-settings">
          <div className="section-header">
            <h3>Platform Settings</h3>
            <p>Configure platform behavior and policies</p>
          </div>
          <div className="settings-grid">
            <div className="setting-card">
              <h4>User Registration</h4>
              <div className="setting-controls">
                <label>
                  <input type="checkbox" defaultChecked />
                  Allow new user registrations
                </label>
                <label>
                  <input type="checkbox" />
                  Require email verification
                </label>
              </div>
            </div>
            <div className="setting-card">
              <h4>Project Submission</h4>
              <div className="setting-controls">
                <label>
                  <input type="checkbox" defaultChecked />
                  Auto-approve projects
                </label>
                <label>
                  <input type="checkbox" />
                  Require admin review
                </label>
              </div>
            </div>
            <div className="setting-card">
              <h4>System Maintenance</h4>
              <div className="setting-controls">
                <button className="btn-warning">Clear Cache</button>
                <button className="btn-danger">Reset Database</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="admin-system">
          <div className="section-header">
            <h3>System Administration</h3>
            <p>Monitor system health and performance</p>
          </div>
          <div className="system-stats">
            <div className="stat-card">
              <div className="stat-icon">💾</div>
              <div className="stat-content">
                <div className="stat-number">2.4GB</div>
                <div className="stat-label">Database Size</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-number">98%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔒</div>
              <div className="stat-content">
                <div className="stat-number">Secure</div>
                <div className="stat-label">Security Status</div>
              </div>
            </div>
          </div>
          <div className="system-actions">
            <button className="btn-primary">Backup Database</button>
            <button className="btn-secondary">View Logs</button>
            <button className="btn-warning">Restart Services</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-wrap { display: grid; gap: 24px; padding: 24px; }
        
        .admin-header { 
          display: flex; justify-content: space-between; align-items: center; 
          padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; 
        }
        .admin-title h1 { margin: 0; font-size: 28px; font-weight: 800; color: var(--mc-sidebar-bg); }
        .admin-title p { margin: 4px 0 0; color: #6b7280; font-size: 14px; }
        .admin-actions { display: flex; gap: 12px; }
        
        .admin-tabs { 
          display: flex; gap: 8px; border-bottom: 1px solid #e5e7eb; 
          margin-bottom: 24px; 
        }
        .admin-tab { 
          padding: 12px 20px; border: none; background: none; 
          font-weight: 600; color: #6b7280; cursor: pointer;
          border-bottom: 2px solid transparent; transition: all 0.2s;
        }
        .admin-tab.active { color: var(--mc-sidebar-bg); border-bottom-color: var(--mc-sidebar-bg); }
        .admin-tab:hover { color: var(--mc-sidebar-bg); }
        
        .stats-grid { 
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 16px; margin-bottom: 32px; 
        }
        .stat-card { 
          background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; 
          padding: 20px; display: flex; align-items: center; gap: 16px; 
        }
        .stat-icon { font-size: 32px; }
        .stat-number { font-size: 24px; font-weight: 800; color: var(--mc-sidebar-bg); }
        .stat-label { color: #6b7280; font-size: 14px; }
        
        .role-breakdown { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
        .role-breakdown h3 { margin: 0 0 16px; font-size: 18px; font-weight: 700; }
        .role-stats { display: flex; gap: 24px; }
        .role-stat { display: flex; flex-direction: column; align-items: center; }
        .role-label { color: #6b7280; font-size: 14px; }
        .role-count { font-size: 20px; font-weight: 700; color: var(--mc-sidebar-bg); }
        
        .users-controls { margin-bottom: 20px; }
        .search-filters { 
          display: flex; gap: 12px; align-items: center; 
          flex-wrap: wrap; 
        }
        .search-input { 
          padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; 
          font-size: 14px; min-width: 200px; 
        }
        .filter-select { 
          padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; 
          font-size: 14px; background: #fff; 
        }
        .sort-btn { 
          padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; 
          background: #fff; cursor: pointer; font-size: 16px; 
        }
        
        .users-table { 
          background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; 
          overflow: hidden; margin-bottom: 20px; 
        }
        .users-table table { width: 100%; border-collapse: collapse; }
        .users-table th { 
          background: #f9fafb; padding: 12px 16px; text-align: left; 
          font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb; 
        }
        .users-table td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; }
        
        .user-info { display: flex; align-items: center; gap: 12px; }
        .user-avatar { 
          width: 40px; height: 40px; border-radius: 10px; 
          background: var(--mc-sidebar-bg); color: #fff; display: flex; 
          align-items: center; justify-content: center; font-weight: 700; 
        }
        .user-name { font-weight: 600; color: var(--mc-sidebar-bg); }
        .user-email { color: #6b7280; font-size: 12px; }
        
        .role-badge { 
          padding: 4px 8px; border-radius: 6px; font-size: 12px; 
          font-weight: 600; text-transform: capitalize; 
        }
        .role-admin { background: var(--mc-sidebar-bg); color: #fff; }
        .role-mentor { background: #0b1220; color: #a5b4fc; }
        .role-investor { background: #f0fdf4; color: #065f46; }
        .role-entrepreneur { background: #eff6ff; color: #1d4ed8; }
        
        .status-badge { 
          padding: 4px 8px; border-radius: 6px; font-size: 12px; 
          font-weight: 600; 
        }
        .status-badge.active { background: #f0fdf4; color: #065f46; }
        .status-badge.inactive { background: #fef2f2; color: #dc2626; }
        
        .action-buttons { display: flex; gap: 8px; }
        .btn-small { 
          padding: 4px 8px; border: none; border-radius: 6px; 
          font-size: 12px; font-weight: 600; cursor: pointer; 
        }
        .btn-primary { background: var(--mc-sidebar-bg); color: #fff; }
        .btn-success { background: #10b981; color: #fff; }
        .btn-warning { background: #f59e0b; color: #fff; }
        .btn-danger { background: #ef4444; color: #fff; }
        
        .pagination { 
          display: flex; justify-content: center; align-items: center; 
          gap: 16px; 
        }
        .pagination-btn { 
          padding: 8px 16px; border: 1px solid #d1d5db; 
          border-radius: 8px; background: #fff; cursor: pointer; 
        }
        .pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pagination-info { color: #6b7280; font-size: 14px; }
        
        .btn-primary, .btn-secondary { 
          padding: 10px 20px; border: none; border-radius: 8px; 
          font-weight: 600; cursor: pointer; 
        }
        .btn-primary { background: var(--mc-sidebar-bg); color: #fff; }
        .btn-secondary { background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; }
        
        .loading, .error, .coming-soon { 
          text-align: center; padding: 40px; color: #6b7280; 
          background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; 
        }
        .error { color: #ef4444; }
        
        .section-header { margin-bottom: 20px; }
        .section-header h3 { margin: 0 0 8px; font-size: 20px; font-weight: 700; }
        .section-header p { margin: 0; color: #6b7280; font-size: 14px; }
        
        .project-filters, .investment-filters { 
          display: flex; gap: 12px; margin-bottom: 20px; 
          flex-wrap: wrap; 
        }
        
        .settings-grid { 
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 20px; 
        }
        .setting-card { 
          background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; 
          padding: 20px; 
        }
        .setting-card h4 { margin: 0 0 16px; font-size: 16px; font-weight: 600; }
        .setting-controls { display: grid; gap: 12px; }
        .setting-controls label { 
          display: flex; align-items: center; gap: 8px; 
          font-size: 14px; cursor: pointer; 
        }
        .setting-controls input[type="checkbox"] { margin: 0; }
        
        .system-stats { 
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 16px; margin-bottom: 24px; 
        }
        .system-actions { 
          display: flex; gap: 12px; flex-wrap: wrap; 
        }
      `}</style>
    </div>
  );
}