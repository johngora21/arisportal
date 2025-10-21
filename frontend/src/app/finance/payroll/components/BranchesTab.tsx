'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit,
  Eye,
  MapPin,
  Phone,
  Mail,
  Users,
  Trash2,
  X,
  Calendar,
  DollarSign,
  Building,
  UserCheck,
  Clock,
  FileText,
  Award,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  employees: number;
  status: string;
  // Extended details for modal
  establishedDate: string;
  monthlyBudget: number;
  annualBudget: number;
  departments: Array<{
    id: string;
    name: string;
    employees: number;
    manager: string;
  }>;
  staff: Array<{
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    status: string;
  }>;
  attendance: {
    available: number;
    onLeave: number;
    absent: number;
  };
}

interface BranchesTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddNew: () => void;
}

const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Main Branch',
    address: '123 Main Street, Dar es Salaam',
    phone: '+255 22 111 2222',
    email: 'main@arisportal.com',
    manager: 'John Smith',
    employees: 45,
    status: 'active',
    establishedDate: '2018-03-15',
    monthlyBudget: 125000,
    annualBudget: 1500000,
    departments: [
      { id: '1', name: 'Finance', employees: 8, manager: 'Jennifer White' },
      { id: '2', name: 'Human Resources', employees: 6, manager: 'Alice Brown' },
      { id: '3', name: 'Administration', employees: 12, manager: 'David Lee' },
      { id: '4', name: 'Customer Service', employees: 19, manager: 'Lisa Chen' }
    ],
    staff: [
      { id: '1', name: 'John Smith', role: 'Branch Manager', department: 'Administration', email: 'john.smith@arisportal.com', phone: '+255 22 111 2222', status: 'active' },
      { id: '2', name: 'Jennifer White', role: 'Senior Accountant', department: 'Finance', email: 'jennifer.white@arisportal.com', phone: '+255 22 111 2223', status: 'active' },
      { id: '3', name: 'Alice Brown', role: 'HR Manager', department: 'Human Resources', email: 'alice.brown@arisportal.com', phone: '+255 22 111 2224', status: 'active' }
    ],
    attendance: { available: 36, onLeave: 7, absent: 2 }
  },
  {
    id: '2',
    name: 'Tech Center',
    address: '456 Tech Avenue, Arusha',
    phone: '+255 27 333 4444',
    email: 'tech@arisportal.com',
    manager: 'Sarah Johnson',
    employees: 32,
    status: 'active',
    establishedDate: '2019-08-20',
    monthlyBudget: 95000,
    annualBudget: 1140000,
    departments: [
      { id: '1', name: 'Information Technology', employees: 25, manager: 'Tech Lead' },
      { id: '2', name: 'Research & Development', employees: 7, manager: 'Dr. Michael Chen' }
    ],
    staff: [
      { id: '1', name: 'Sarah Johnson', role: 'Tech Center Manager', department: 'Information Technology', email: 'sarah.johnson@arisportal.com', phone: '+255 27 333 4444', status: 'active' },
      { id: '2', name: 'Tech Lead', role: 'Lead Developer', department: 'Information Technology', email: 'tech.lead@arisportal.com', phone: '+255 27 333 4445', status: 'active' },
      { id: '3', name: 'Dr. Michael Chen', role: 'R&D Director', department: 'Research & Development', email: 'michael.chen@arisportal.com', phone: '+255 27 333 4446', status: 'active' }
    ],
    attendance: { available: 26, onLeave: 5, absent: 1 }
  },
  {
    id: '3',
    name: 'Sales Hub',
    address: '789 Sales Road, Mwanza',
    phone: '+255 28 555 6666',
    email: 'sales@arisportal.com',
    manager: 'Mike Wilson',
    employees: 28,
    status: 'active',
    establishedDate: '2020-01-10',
    monthlyBudget: 75000,
    annualBudget: 900000,
    departments: [
      { id: '1', name: 'Sales & Marketing', employees: 18, manager: 'Sales Manager' },
      { id: '2', name: 'Business Development', employees: 10, manager: 'Business Dev Lead' }
    ],
    staff: [
      { id: '1', name: 'Mike Wilson', role: 'Sales Hub Manager', department: 'Sales & Marketing', email: 'mike.wilson@arisportal.com', phone: '+255 28 555 6666', status: 'active' },
      { id: '2', name: 'Sales Manager', role: 'Sales Director', department: 'Sales & Marketing', email: 'sales.manager@arisportal.com', phone: '+255 28 555 6667', status: 'active' },
      { id: '3', name: 'Business Dev Lead', role: 'Business Development Manager', department: 'Business Development', email: 'business.dev@arisportal.com', phone: '+255 28 555 6668', status: 'active' }
    ],
    attendance: { available: 23, onLeave: 4, absent: 1 }
  },
  {
    id: '4',
    name: 'Regional Office',
    address: '321 Regional Blvd, Dodoma',
    phone: '+255 26 777 8888',
    email: 'regional@arisportal.com',
    manager: 'Emily Brown',
    employees: 15,
    status: 'active',
    establishedDate: '2021-06-05',
    monthlyBudget: 45000,
    annualBudget: 540000,
    departments: [
      { id: '1', name: 'Operations', employees: 15, manager: 'Operations Manager' }
    ],
    staff: [
      { id: '1', name: 'Emily Brown', role: 'Regional Manager', department: 'Operations', email: 'emily.brown@arisportal.com', phone: '+255 26 777 8888', status: 'active' },
      { id: '2', name: 'Operations Manager', role: 'Operations Coordinator', department: 'Operations', email: 'operations.manager@arisportal.com', phone: '+255 26 777 8889', status: 'active' }
    ],
    attendance: { available: 12, onLeave: 2, absent: 1 }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return { backgroundColor: '#10b981', color: '#ffffff' };
    case 'inactive': return { backgroundColor: '#f3f4f6', color: '#374151' };
    default: return { backgroundColor: '#f3f4f6', color: '#374151' };
  }
};

const BranchesTab: React.FC<BranchesTabProps> = ({ searchQuery, setSearchQuery, onAddNew }) => {
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchModalTab, setBranchModalTab] = useState('overview');

  const filteredBranches = mockBranches.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowBranchModal(true);
    setBranchModalTab('overview');
  };

  const branchModalTabs = [
    { id: 'overview', label: 'Overview', icon: <Building size={16} /> },
    { id: 'departments', label: 'Departments', icon: <FileText size={16} /> },
    { id: 'staff', label: 'Staff', icon: <Users size={16} /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock size={16} /> }
  ];

  return (
    <div>
      {/* Add New Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          onClick={onAddNew}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: 'var(--mc-sidebar-bg)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Plus size={16} />
          Add New Branch
        </button>
      </div>

      {/* Search Bar */}
      <div style={{
        position: 'relative',
        height: '40px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          position: 'absolute',
          right: '80px',
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
            placeholder="Search branches..."
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
      </div>

      {/* Branches Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '24px'
      }}>
        {filteredBranches.map((branch) => (
          <div key={branch.id} style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => handleViewBranch(branch)}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}>
            {/* Header with Branch Name and Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--mc-sidebar-bg), #8b5cf6)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: 'white' 
                }}>
                      <MapPin size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {branch.name}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#6b7280" />
                    {branch.address}
                  </div>
                </div>
              </div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                ...getStatusColor(branch.status)
              }}>
                {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
              </span>
            </div>

            {/* Contact Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {branch.phone}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {branch.email}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {branch.manager}
                </span>
              </div>
            </div>

            {/* Employee Count */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingTop: '16px', 
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                  {branch.employees} employees
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '6px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = 'var(--mc-sidebar-bg)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
                >
                  <Edit size={16} />
                </button>
                <button style={{
                  padding: '6px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Branch Detail Modal */}
      {showBranchModal && selectedBranch && (
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
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--mc-sidebar-bg), #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Building size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {selectedBranch.name}
                  </h2>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                    {selectedBranch.address}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBranchModal(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              borderBottom: '1px solid #e5e7eb'
            }}>
              {branchModalTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setBranchModalTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px',
                    border: 'none',
                    backgroundColor: branchModalTab === tab.id ? '#f9fafb' : 'transparent',
                    color: branchModalTab === tab.id ? 'var(--mc-sidebar-bg)' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    borderBottom: branchModalTab === tab.id ? '2px solid var(--mc-sidebar-bg)' : '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '24px'
            }}>
              {branchModalTab === 'overview' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                    Branch Overview
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
                    <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                        Basic Information
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>Manager: {selectedBranch.manager}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>Location: {selectedBranch.address}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>Employees: {selectedBranch.employees}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                        Contact Information
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Phone size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>{selectedBranch.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>{selectedBranch.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <DollarSign size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>Annual Budget: ${selectedBranch.annualBudget.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                        Financial Summary
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <DollarSign size={16} color="#10b981" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>Annual Budget: ${selectedBranch.annualBudget.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <DollarSign size={16} color="#f59e0b" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>Payroll Total: ${selectedBranch.annualBudget.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                        Departments
                      </h4>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--mc-sidebar-bg)', marginBottom: '8px' }}>
                        {selectedBranch.departments.length}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Total departments in this branch
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {branchModalTab === 'departments' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                    Branch Departments
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {selectedBranch.departments.map((dept) => (
                      <div key={dept.id} style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '20px',
                        padding: '20px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--mc-sidebar-bg), #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600'
                          }}>
                            <FileText size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                              {dept.name}
                            </div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                              Manager: {dept.manager}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>
                            {dept.employees} employees
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {branchModalTab === 'staff' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                    Branch Staff
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
                    {selectedBranch.staff.map((member) => (
                      <div key={member.id} style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '20px',
                        padding: '20px',
                        position: 'relative'
                      }}>
                        {/* Status Badge - Top Right */}
                        <span style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          ...getStatusColor(member.status)
                        }}>
                          {member.status}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--mc-sidebar-bg), #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600'
                          }}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                              {member.name}
                            </div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                              {member.role}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Building size={14} color="#6b7280" />
                            <span style={{ fontSize: '14px', color: '#374151' }}>
                              {member.department}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail size={14} color="#6b7280" />
                            <span style={{ fontSize: '14px', color: '#374151' }}>
                              {member.email}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone size={14} color="#6b7280" />
                            <span style={{ fontSize: '14px', color: '#374151' }}>
                              {member.phone}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button style={{
                            padding: '6px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '20px',
                            color: '#6b7280',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.color = 'var(--mc-sidebar-bg)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                          >
                            <Edit size={16} />
                          </button>
                          <button style={{
                            padding: '6px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '20px',
                            color: '#6b7280',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.color = '#374151';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                          >
                            <MessageCircle size={16} />
                          </button>
                          <button style={{
                            padding: '6px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '20px',
                            color: '#6b7280',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#fef2f2';
                            e.currentTarget.style.color = '#dc2626';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {branchModalTab === 'attendance' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                    Staff Availability
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <UserCheck size={20} color="#10b981" />
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          Available
                        </h4>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
                        {selectedBranch.attendance.available}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Staff currently available
                      </div>
                    </div>

                    <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <Clock size={20} color="#f59e0b" />
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          On Leave
                        </h4>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>
                        {selectedBranch.attendance.onLeave}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Staff on leave today
                      </div>
                    </div>

                    <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <Users size={20} color="#6b7280" />
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          Absent
                        </h4>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#6b7280', marginBottom: '8px' }}>
                        {selectedBranch.attendance.absent}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Staff absent today
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesTab;
