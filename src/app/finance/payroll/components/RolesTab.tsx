'use client';

import React, { useState } from 'react';
import {
  Search,
  Edit,
  Eye,
  Shield,
  Users,
  MapPin,
  Trash2,
  X,
  DollarSign,
  Calendar,
  FileText,
  Award,
  Briefcase,
  Building,
  Phone,
  Mail,
  Clock,
  UserCheck,
  Plus
} from 'lucide-react';

interface Role {
  id: string;
  title: string;
  department: string;
  branch: string;
  level: string;
  employees: number;
  description: string;
  status: string;
  // Extended details for modal
  salaryRange: {
    min: number;
    max: number;
  };
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: string;
  education: string;
  createdDate: string;
  reportsTo: string;
  directReports: number;
  departmentInfo: {
    phone: string;
    email: string;
    manager: string;
  };
}

interface RolesTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  branchFilter: string;
  setBranchFilter: (filter: string) => void;
  branches: Array<{ id: string; name: string }>;
  onAddNew: () => void;
}

const mockRoles: Role[] = [
  {
    id: '1',
    title: 'Senior Developer',
    department: 'Information Technology',
    branch: 'Tech Center',
    level: 'Senior',
    employees: 8,
    description: 'Lead software development projects and mentor junior developers',
    status: 'active',
    salaryRange: { min: 80000, max: 120000 },
    requirements: ['Bachelor\'s in Computer Science', '5+ years experience', 'Full-stack development'],
    responsibilities: ['Lead development projects', 'Code review and mentoring', 'Architecture decisions'],
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
    experience: '5-8 years',
    education: 'Bachelor\'s Degree',
    createdDate: '2023-01-15',
    reportsTo: 'Tech Lead',
    directReports: 3,
    departmentInfo: {
      phone: '+255 27 333 4444',
      email: 'tech@arisportal.com',
      manager: 'Tech Lead'
    }
  },
  {
    id: '2',
    title: 'HR Manager',
    department: 'Human Resources',
    branch: 'Main Branch',
    level: 'Manager',
    employees: 1,
    description: 'Manage HR operations, policies, and employee relations',
    status: 'active',
    salaryRange: { min: 65000, max: 85000 },
    requirements: ['Bachelor\'s in HR or related field', '3+ years HR experience', 'HR certification preferred'],
    responsibilities: ['Employee relations', 'Recruitment', 'Policy development', 'Performance management'],
    skills: ['HRIS', 'Recruitment', 'Employee Relations', 'Policy Development'],
    experience: '3-5 years',
    education: 'Bachelor\'s Degree',
    createdDate: '2022-08-10',
    reportsTo: 'HR Director',
    directReports: 2,
    departmentInfo: {
      phone: '+255 22 111 2222',
      email: 'hr@arisportal.com',
      manager: 'HR Director'
    }
  },
  {
    id: '3',
    title: 'Finance Director',
    department: 'Finance',
    branch: 'Main Branch',
    level: 'Director',
    employees: 1,
    description: 'Oversee financial planning, strategy, and compliance',
    status: 'active',
    salaryRange: { min: 120000, max: 150000 },
    requirements: ['Master\'s in Finance or MBA', '8+ years finance experience', 'CPA preferred'],
    responsibilities: ['Financial strategy', 'Budget planning', 'Compliance oversight', 'Team leadership'],
    skills: ['Financial Planning', 'Strategic Planning', 'Team Leadership', 'Compliance'],
    experience: '8+ years',
    education: 'Master\'s Degree',
    createdDate: '2021-03-20',
    reportsTo: 'CEO',
    directReports: 5,
    departmentInfo: {
      phone: '+255 22 111 2222',
      email: 'finance@arisportal.com',
      manager: 'CEO'
    }
  },
  {
    id: '4',
    title: 'Sales Representative',
    department: 'Sales & Marketing',
    branch: 'Sales Hub',
    level: 'Junior',
    employees: 12,
    description: 'Handle customer sales, relationships, and lead generation',
    status: 'active',
    salaryRange: { min: 35000, max: 50000 },
    requirements: ['Bachelor\'s degree', '1-2 years sales experience', 'Strong communication skills'],
    responsibilities: ['Lead generation', 'Customer outreach', 'Sales presentations', 'Relationship building'],
    skills: ['CRM Systems', 'Sales Presentations', 'Customer Relations', 'Lead Generation'],
    experience: '1-2 years',
    education: 'Bachelor\'s Degree',
    createdDate: '2023-06-01',
    reportsTo: 'Sales Manager',
    directReports: 0,
    departmentInfo: {
      phone: '+255 28 555 6666',
      email: 'sales@arisportal.com',
      manager: 'Sales Manager'
    }
  },
  {
    id: '5',
    title: 'Operations Coordinator',
    department: 'Operations',
    branch: 'Regional Office',
    level: 'Mid-level',
    employees: 6,
    description: 'Coordinate daily operations and support regional activities',
    status: 'active',
    salaryRange: { min: 45000, max: 60000 },
    requirements: ['Bachelor\'s degree', '2-4 years operations experience', 'Project management skills'],
    responsibilities: ['Process coordination', 'Resource planning', 'Performance monitoring', 'Team support'],
    skills: ['Project Management', 'Process Improvement', 'Resource Planning', 'Data Analysis'],
    experience: '2-4 years',
    education: 'Bachelor\'s Degree',
    createdDate: '2022-11-15',
    reportsTo: 'Operations Manager',
    directReports: 1,
    departmentInfo: {
      phone: '+255 26 777 8888',
      email: 'operations@arisportal.com',
      manager: 'Operations Manager'
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return { backgroundColor: '#10b981', color: '#ffffff' };
    case 'inactive': return { backgroundColor: '#f3f4f6', color: '#374151' };
    default: return { backgroundColor: '#f3f4f6', color: '#374151' };
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Director': return { backgroundColor: '#dc2626', color: '#ffffff' };
    case 'Manager': return { backgroundColor: '#ea580c', color: '#ffffff' };
    case 'Senior': return { backgroundColor: '#0891b2', color: '#ffffff' };
    case 'Mid-level': return { backgroundColor: '#059669', color: '#ffffff' };
    case 'Junior': return { backgroundColor: '#7c3aed', color: '#ffffff' };
    default: return { backgroundColor: '#6b7280', color: '#ffffff' };
  }
};

const RolesTab: React.FC<RolesTabProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  branchFilter, 
  setBranchFilter, 
  branches,
  onAddNew
}) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const filteredRoles = mockRoles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBranch = branchFilter === 'all' || role.branch === branchFilter;
    
    return matchesSearch && matchesBranch;
  });

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setShowRoleModal(true);
  };

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
          Add New Role
        </button>
      </div>

      {/* Search Bar and Branch Filter */}
      <div style={{
        position: 'relative',
        height: '40px',
        marginBottom: '24px'
      }}>
        {/* Search Bar - positioned from right */}
        <div style={{ 
          position: 'absolute',
          right: '300px',
          top: '0px',
          width: '350px'
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
            placeholder="Search roles..."
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
        
        {/* Branch Filter - positioned from right */}
        <div style={{
          position: 'absolute',
          right: '50px',
          top: '0px'
        }}>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              background: 'white',
              width: '180px'
            }}
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Roles Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Role
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Department
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Branch
              </th>
              <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Level
              </th>
              <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Employees
              </th>
              <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Status
              </th>
              <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, var(--mc-sidebar-bg), #8b5cf6)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white' 
                    }}>
                      <Shield size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                        {role.title}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {role.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    {role.department}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                      {role.branch}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    ...getLevelColor(role.level)
                  }}>
                    {role.level}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Users size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                      {role.employees}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    ...getStatusColor(role.status)
                  }}>
                    {role.status.charAt(0).toUpperCase() + role.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
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
                    <button 
                      onClick={() => handleViewRole(role)}
                      style={{
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
                      <Eye size={16} />
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Detail Modal */}
      {showRoleModal && selectedRole && (
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
            maxWidth: '1000px',
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
                  <Shield size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {selectedRole.title}
                  </h2>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                    {selectedRole.department} • {selectedRole.branch}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
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

            {/* Modal Content */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '24px'
            }}>
              {/* Role Overview */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                  Role Overview
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                      Basic Information
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Award size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Level: {selectedRole.level}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Current Employees: {selectedRole.employees}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Created: {new Date(selectedRole.createdDate).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Reports To: {selectedRole.reportsTo}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                      Compensation & Structure
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DollarSign size={16} color="#10b981" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          Salary Range: ${selectedRole.salaryRange.min.toLocaleString()} - ${selectedRole.salaryRange.max.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Direct Reports: {selectedRole.directReports}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Experience Required: {selectedRole.experience}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Education: {selectedRole.education}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                    Job Description
                  </h4>
                  <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                    {selectedRole.description}
                  </p>
                </div>
              </div>

              {/* Requirements and Skills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Requirements
                  </h4>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {selectedRole.requirements.map((req, index) => (
                      <li key={index} style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Key Skills
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedRole.skills.map((skill, index) => (
                      <span key={index} style={{
                        padding: '4px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Key Responsibilities
                </h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {selectedRole.responsibilities.map((resp, index) => (
                    <li key={index} style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Department Contact */}
              <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Department Contact Information
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Department Manager: {selectedRole.departmentInfo.manager}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>{selectedRole.departmentInfo.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>{selectedRole.departmentInfo.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesTab;
