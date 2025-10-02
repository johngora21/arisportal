"use client";

import { useState } from "react";
import { 
  Users, UserPlus, Award, TrendingUp, Calendar, DollarSign, FileText, Plus, 
  ArrowUpRight, CheckCircle2, Star, BarChart3, LineChart, Activity, AlertTriangle, 
  MapPin, Eye, Edit, Building, Briefcase, Mail, Phone
} from "lucide-react";

export default function HRPage() {
  // Mock data
  const hrMetrics = {
    totalEmployees: 156,
    activeEmployees: 142,
    newHires: 8,
    departures: 3,
    avgSalary: 75000,
    satisfactionScore: 4.2
  };

  const monthlyTrends = [
    { month: "Jan", hires: 5, terminations: 2, payroll: 12000000, attendance: 95 },
    { month: "Feb", hires: 3, terminations: 1, payroll: 12500000, attendance: 97 },
    { month: "Mar", hires: 8, terminations: 3, payroll: 13000000, attendance: 94 },
    { month: "Apr", hires: 4, terminations: 2, payroll: 13500000, attendance: 96 },
    { month: "May", hires: 6, terminations: 1, payroll: 14000000, attendance: 98 },
    { month: "Jun", hires: 7, terminations: 4, payroll: 14500000, attendance: 93 }
  ];

  const recentEmployees = [
    {
      id: 1,
      name: "John Smith",
      position: "Software Engineer",
      status: "Active",
      email: "john.smith@company.com",
      phone: "+1 (555) 123-4567"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "HR Manager",
      status: "Active",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 234-5678"
    },
    {
      id: 3,
      name: "Mike Wilson",
      position: "Marketing Specialist",
      status: "Active",
      email: "mike.wilson@company.com",
      phone: "+1 (555) 345-6789"
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Human Resources Dashboard
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Overview of HR operations, employee management, and key metrics
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Plus size={20} />
              Quick Action
            </button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: '0 0 8px 0' }}>
                Total Employees
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
                {hrMetrics.totalEmployees}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                <ArrowUpRight size={16} color="#10b981" style={{ marginRight: '4px' }} />
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
                  +{hrMetrics.newHires} this month
                </span>
              </div>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px'
            }}>
              <Users size={32} color="#6b7280" />
            </div>
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: '0 0 8px 0' }}>
                Active Employees
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
                {hrMetrics.activeEmployees}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ marginRight: '4px' }} />
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
                  {((hrMetrics.activeEmployees/hrMetrics.totalEmployees)*100).toFixed(1)}% active rate
                </span>
              </div>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px'
            }}>
              <UserPlus size={32} color="#10b981" />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: '0 0 8px 0' }}>
                Average Salary
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
                ${hrMetrics.avgSalary.toLocaleString()}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                <TrendingUp size={16} color="#10b981" style={{ marginRight: '4px' }} />
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
                  +5.2% from last year
                </span>
              </div>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px'
            }}>
              <DollarSign size={32} color="#f59e0b" />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: '0 0 8px 0' }}>
                Satisfaction Score
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
                {hrMetrics.satisfactionScore}/5
              </p>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                <Star size={16} color="#f59e0b" style={{ marginRight: '4px' }} />
                <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '500' }}>
                  Employee satisfaction
                </span>
              </div>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px'
            }}>
              <Star size={32} color="#f59e0b" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Monthly Trends */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
            Monthly Trends
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {monthlyTrends.slice(-6).map((month, index) => (
              <div key={month.month} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: '#dbeafe', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--mc-sidebar-bg)' }}>
                      {month.month}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: '0 0 2px 0' }}>
                      {month.hires} hires
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                      {month.terminations} terminations
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    ${(month.payroll/1000000).toFixed(0)}M
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity size={12} color="#10b981" />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {month.attendance}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Employees */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
            Recent Employees
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentEmployees.map((employee) => (
              <div key={employee.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
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
                  fontSize: '14px'
                }}>
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: '0 0 2px 0' }}>
                    {employee.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    {employee.position}
                  </p>
                </div>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontWeight: '500',
                  backgroundColor: '#dcfce7',
                  color: '#166534'
                }}>
                  {employee.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
          Quick Actions
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          <a href="/hr/employees" style={{
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textDecoration: 'none',
            color: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--mc-sidebar-bg)';
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'white';
          }}>
            <Users size={32} color="var(--mc-sidebar-bg)" style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>
              Employee Management
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Manage employee records and information
            </p>
          </a>
          
          <a href="/hr/modules" style={{
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textDecoration: 'none',
            color: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#10b981';
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'white';
          }}>
            <DollarSign size={32} color="#10b981" style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>
              Payroll Management
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Process salaries and manage payroll
            </p>
          </a>
          
          <a href="/hr/reports" style={{
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textDecoration: 'none',
            color: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#f59e0b';
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'white';
          }}>
            <BarChart3 size={32} color="#f59e0b" style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>
              Reports & Analytics
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Generate and view HR reports
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}