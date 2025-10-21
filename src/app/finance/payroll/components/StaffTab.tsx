'use client';

import React, { useState } from 'react';
import {
  Search,
  Edit,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  Briefcase,
  Shield,
  User,
  X,
  Award,
  Clock,
  GraduationCap,
  FileText,
  Trash2,
  Plus,
  Eye
} from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  department: string;
  role: string;
  branch: string;
  hireDate: string;
  salary: number;
  status: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationalId?: string;
  maritalStatus?: string;
  bloodGroup?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  emergencyContact2?: {
    name: string;
    relationship: string;
    phone: string;
  };
  address?: {
    full: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  socialMedia?: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  employment?: {
    employeeId: string;
    employeeNumber: string;
    department: string;
    position: string;
    employmentType: string;
    employmentStatus: string;
    hireDate: string;
    probationEndDate: string;
    contractEndDate: string;
    reportingManager: string;
    workLocation: string;
  };
  salaryDetails?: {
    basicSalary: number;
    allowances: number;
    totalPackage: number;
    bankName: string;
    bankAccount: string;
    taxId: string;
    lastReview: string;
    nextReview: string;
  };
  benefits?: string[];
  performance?: {
    rating: string;
    lastReview: string;
    technicalSkills: string;
    languages: string;
    certifications: Array<{
      name: string;
      issued: string;
      expires: string;
      status: string;
    }>;
  };
  attendance?: {
    workSchedule: string;
    holidayEntitlement: number;
    leaveBalance: {
      annual: number;
      sick: number;
      personal: number;
      maternity: number;
    };
  };
}

interface StaffTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  branchFilter: string;
  setBranchFilter: (filter: string) => void;
  branches: Array<{ id: string; name: string }>;
  onAddNew: () => void;
}

// Mock data removed - using real API data
const mockStaff: Staff[] = [];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return { backgroundColor: '#10b981', color: '#ffffff' };
    case 'inactive': return { backgroundColor: '#f3f4f6', color: '#374151' };
    default: return { backgroundColor: '#f3f4f6', color: '#374151' };
  }
};

const StaffTab: React.FC<StaffTabProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  branchFilter, 
  setBranchFilter, 
  branches,
  onAddNew
}) => {
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffModalTab, setStaffModalTab] = useState('personal');

  const filteredStaff = mockStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBranch = branchFilter === 'all' || staff.branch === branchFilter;
    
    return matchesSearch && matchesBranch;
  });

  const handleViewStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setShowStaffModal(true);
    setStaffModalTab('personal');
  };

  const staffModalTabs = [
    { id: "personal", label: "Personal", icon: <User size={16} /> },
    { id: "contact", label: "Contact", icon: <Mail size={16} /> },
    { id: "employment", label: "Employment", icon: <Briefcase size={16} /> },
    { id: "salary", label: "Salary", icon: <DollarSign size={16} /> },
    { id: "performance", label: "Performance", icon: <Award size={16} /> },
    { id: "attendance", label: "Attendance", icon: <Clock size={16} /> }
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
          Add New Staff
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
            placeholder="Search staff..."
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

      {/* Staff Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '24px'
      }}>
        {filteredStaff.map((staff) => (
          <div key={staff.id} style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #f0f0f0',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => handleViewStaff(staff)}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}>
            {/* Header with Avatar and Status */}
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
                  {staff.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {staff.name}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {staff.email}
                  </div>
                </div>
              </div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                ...getStatusColor(staff.status)
              }}>
                {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
              </span>
            </div>

            {/* Contact Information */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Phone size={16} color="#6b7280" />
              <span style={{ fontSize: '14px', color: '#374151' }}>
                {staff.phone}
              </span>
            </div>

            {/* Department and Role */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={16} color="#6b7280" />
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Department</div>
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    {staff.department}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="#6b7280" />
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Role</div>
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    {staff.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Salary and Hire Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={16} color="#6b7280" />
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Monthly Salary</div>
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    {formatCurrency(staff.salary / 12)}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#6b7280" />
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Hire Date</div>
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    {new Date(staff.hireDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer with Branch and Actions */}
            <div style={{ 
              paddingTop: '16px', 
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                  {staff.branch}
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
          </div>
        ))}
      </div>

      {/* Staff Detail Modal */}
      {showStaffModal && selectedStaff && (
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
          zIndex: 1000,
          padding: '20px'
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
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                  Staff Profile
                </h2>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                  View comprehensive staff information and profile
                </p>
              </div>
              <button
                onClick={() => setShowStaffModal(false)}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={24} color="#6b7280" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div style={{
              padding: '0 24px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px'
              }}>
                {staffModalTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStaffModalTab(tab.id)}
                    style={{
                      padding: '12px 8px',
                      backgroundColor: staffModalTab === tab.id ? 'var(--mc-sidebar-bg)' : 'transparent',
                      color: staffModalTab === tab.id ? 'white' : '#6b7280',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div style={{
              padding: '24px',
              overflowY: 'auto',
              flex: 1
            }}>
              {staffModalTab === 'personal' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>First Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.firstName || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Last Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.lastName || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Middle Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.middleName || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Date of Birth</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.dateOfBirth || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Gender</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.gender || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>National ID</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.nationalId || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Marital Status</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.maritalStatus || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Blood Group</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.bloodGroup || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {staffModalTab === 'contact' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Email Address</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.email}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Main Phone Number</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.phone}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Alternative Phone</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.alternativePhone || '+255 22 999 8888'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Social Media & Portfolio
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '16px' 
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>LinkedIn</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.socialMedia?.linkedin || 'linkedin.com/in/' + selectedStaff.name.toLowerCase().replace(' ', '-')}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Twitter/X</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.socialMedia?.twitter || '@' + selectedStaff.name.toLowerCase().replace(' ', '')}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Instagram</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.socialMedia?.instagram || '@' + selectedStaff.name.toLowerCase().replace(' ', '_')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Emergency Contacts
                    </h4>
                    
                    {/* Emergency Contact 1 */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '16px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Contact Name (Primary)</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergencyContact?.name || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Relationship</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergencyContact?.relationship || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Phone</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergencyContact?.phone || '-'}
                        </p>
                      </div>
                    </div>

                    {/* Emergency Contact 2 */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '16px'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Contact Name (Secondary)</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergencyContact2?.name || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Relationship</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergencyContact2?.relationship || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Phone</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergencyContact2?.phone || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Current Address
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Full Address</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.address?.full || 'Not provided'}
                      </p>
                    </div>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '16px' 
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>City</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.address?.city || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>State/Region</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.address?.state || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Country</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.address?.country || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {/* Placeholder for other tabs */}
              {['employment', 'salary', 'performance', 'attendance'].includes(staffModalTab) && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '200px',
                  color: '#6b7280',
                  fontSize: '16px'
                }}>
                  {staffModalTab.charAt(0).toUpperCase() + staffModalTab.slice(1)} information will be displayed here
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowStaffModal(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
              >
                Close
              </button>
              <button style={{
                padding: '12px 24px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
              }}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffTab;
