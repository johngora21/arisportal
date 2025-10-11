'use client';

import React from 'react';
import { AppShell } from '@/components/AppShell';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Building2,
  BarChart3,
  Activity,
  Target,
  PieChart
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Revenue',
      value: 'TSh 45,230,000',
      change: '+12.5%',
      changeType: 'positive',
      icon: <DollarSign size={24} />
    },
    {
      title: 'Active Projects',
      value: '23',
      change: '+3',
      changeType: 'positive',
      icon: <Building2 size={24} />
    },
    {
      title: 'Total Investors',
      value: '156',
      change: '+8.2%',
      changeType: 'positive',
      icon: <Users size={24} />
    },
    {
      title: 'ROI Rate',
      value: '18.5%',
      change: '+2.1%',
      changeType: 'positive',
      icon: <TrendingUp size={24} />
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'investment',
      message: 'New investment in Kilimanjaro Coffee Plantation',
      amount: 'TSh 5,000,000',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'payout',
      message: 'Payout processed for Arusha Dairy Farm',
      amount: 'TSh 720,000',
      time: '4 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'project',
      message: 'New project: Dar es Salaam Office Complex',
      amount: 'TSh 15,000,000',
      time: '6 hours ago',
      status: 'pending'
    },
    {
      id: 4,
      type: 'investment',
      message: 'Investment in Iringa Maize Processing',
      amount: 'TSh 3,500,000',
      time: '1 day ago',
      status: 'completed'
    }
  ];

  return (
    <AppShell>
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            Dashboard
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: 0
          }}>
            Welcome back! Here's what's happening with your investments today.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  color: '#1f2937'
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: stat.changeType === 'positive' ? '#10b981' : '#ef4444',
                  backgroundColor: stat.changeType === 'positive' ? '#dcfce7' : '#fef2f2',
                  padding: '4px 8px',
                  borderRadius: '8px'
                }}>
                  {stat.change}
                </div>
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {stat.title}
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Activities Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Chart Placeholder */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                Investment Performance
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                <BarChart3 size={16} />
                Last 6 months
              </div>
            </div>
            <div style={{
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '2px dashed #d1d5db'
            }}>
              <div style={{ textAlign: 'center' }}>
                <PieChart size={48} color="#9ca3af" />
                <p style={{ color: '#6b7280', marginTop: '8px' }}>Chart coming soon</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <Activity size={20} color="#1f2937" />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                Recent Activities
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentActivities.map((activity) => (
                <div key={activity.id} style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    {activity.message}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    {activity.amount}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {activity.time}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: activity.status === 'completed' ? '#10b981' : '#f59e0b',
                      backgroundColor: activity.status === 'completed' ? '#dcfce7' : '#fef3c7',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 20px 0'
          }}>
            Quick Actions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { label: 'View Investments', icon: <Target size={20} />, href: '/investments' },
              { label: 'Add New Project', icon: <Building2 size={20} />, href: '/investments' },
              { label: 'View Reports', icon: <BarChart3 size={20} />, href: '/finance/transactions' },
              { label: 'Manage CRM', icon: <Users size={20} />, href: '/crm' }
            ].map((action, index) => (
              <button
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                onClick={() => window.location.href = action.href}
              >
                <div style={{ color: '#1f2937' }}>
                  {action.icon}
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1f2937'
                }}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}


