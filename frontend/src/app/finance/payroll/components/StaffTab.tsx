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

import { StaffService, Staff } from '../services/payrollService';

interface StaffTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  branchFilter: string;
  setBranchFilter: (filter: string) => void;
  branches: Array<{ id: string; name: string }>;
  onAddNew: () => void;
  onEditStaff?: (staff: Staff) => void;
  onRefresh?: () => void;
  refreshTrigger?: number;
}

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
  onAddNew,
  onEditStaff,
  onRefresh,
  refreshTrigger
}) => {
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffModalTab, setStaffModalTab] = useState('personal');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch staff data from API
  React.useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const branchId = branchFilter === 'all' ? undefined : 
          branches.find(b => b.name === branchFilter)?.id;
        
        const staffData = await StaffService.fetchStaff(
          branchId ? parseInt(branchId) : undefined,
          undefined,
          'active',
          searchQuery
        );
        setStaff(staffData);
      } catch (error) {
        console.error('Error fetching staff:', error);
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [searchQuery, branchFilter, branches, refreshTrigger]);

  // Update selectedStaff when staff data changes (for modal refresh)
  React.useEffect(() => {
    if (selectedStaff && showStaffModal && staff.length > 0) {
      const updatedStaff = staff.find(s => s.id === selectedStaff.id);
      if (updatedStaff) {
        setSelectedStaff(updatedStaff);
      }
    }
  }, [staff, refreshTrigger]);

  const filteredStaff = staff;

  const handleViewStaff = async (staff: Staff) => {
    try {
      // Fetch fresh staff data from individual endpoint to ensure we have complete data
      const freshStaffData = await StaffService.getStaffMember(staff.id);
      setSelectedStaff(freshStaffData);
      setShowStaffModal(true);
      setStaffModalTab('personal');
    } catch (error) {
      console.error('Error fetching staff details:', error);
      // Fallback to using the staff data from the list
      setSelectedStaff(staff);
      setShowStaffModal(true);
      setStaffModalTab('personal');
    }
  };

  const handleEditStaff = (staff: Staff) => {
    if (onEditStaff) {
      onEditStaff(staff);
    }
  };


  const staffModalTabs = [
    { id: "personal", label: "Personal", icon: <User size={16} /> },
    { id: "contact", label: "Contact", icon: <Mail size={16} /> },
    { id: "employment", label: "Employment", icon: <Briefcase size={16} /> },
    { id: "salary", label: "Salary", icon: <DollarSign size={16} /> },
    { id: "attendance", label: "Attendance", icon: <Clock size={16} /> },
    { id: "documents", label: "Documents", icon: <FileText size={16} /> }
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

      {/* Loading State */}
      {loading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '16px',
          color: '#6b7280'
        }}>
          Loading staff data...
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredStaff.length === 0 && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '16px',
          color: '#6b7280'
        }}>
          <div style={{ marginBottom: '8px' }}>No staff members found</div>
          <div style={{ fontSize: '14px' }}>Add new staff members to get started</div>
        </div>
      )}

      {/* Staff Cards */}
      {!loading && filteredStaff.length > 0 && (
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
                  {`${staff.first_name[0]}${staff.last_name[0]}`}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {`${staff.first_name} ${staff.last_name}`}
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
                ...getStatusColor(staff.employment_status)
              }}>
                {staff.employment_status.charAt(0).toUpperCase() + staff.employment_status.slice(1)}
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
                    {staff.department_name || `Department ${staff.department_id}`}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="#6b7280" />
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Role</div>
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    {staff.role_name || `Role ${staff.role_id}`}
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
                    {formatCurrency(staff.basic_salary)}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#6b7280" />
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Hire Date</div>
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    {new Date(staff.hire_date).toLocaleDateString()}
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
                  {staff.branch_name || `Branch ${staff.branch_id}`}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditStaff(staff);
                  }}
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
      )}

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
            <div 
              key={`${selectedStaff.id}-${refreshTrigger}`}
              style={{
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
                        {selectedStaff.first_name || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Last Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.last_name || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Middle Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.middle_name || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Date of Birth</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.date_of_birth || '-'}
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
                        {selectedStaff.national_id || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Marital Status</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.marital_status || '-'}
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
                        {selectedStaff.alternative_phone || '+255 22 999 8888'}
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
                          {selectedStaff.linkedin_url || 'linkedin.com/in/' + (selectedStaff.first_name + '-' + selectedStaff.last_name).toLowerCase().replace(/\s/g, '-')}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Twitter/X</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.twitter_url || '@' + (selectedStaff.first_name + selectedStaff.last_name).toLowerCase().replace(/\s/g, '')}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Instagram</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.instagram_url || '@' + (selectedStaff.first_name + '_' + selectedStaff.last_name).toLowerCase().replace(/\s/g, '_')}
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
                          {selectedStaff.emergency_contact_name || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Relationship</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergency_contact_relationship || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Phone</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergency_contact_phone || '-'}
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
                          {selectedStaff.emergency_contact2_name || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Relationship</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergency_contact2_relationship || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Phone</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergency_contact2_phone || '-'}
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
                        {selectedStaff.address_full || 'Not provided'}
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
                          {selectedStaff.address_city || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>State/Region</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.address_state || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Country</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.address_country || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {/* Placeholder for other tabs */}
              {staffModalTab === 'employment' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Department</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.department_name || selectedStaff.department_id || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Position/Role</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.role_name || selectedStaff.role_id || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Branch</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.branch_name || selectedStaff.branch_id || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Employment Type</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.employment_type || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Hire Date</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.hire_date || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Employment Status</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.employment_status || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Probation End Date</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.probation_end_date || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Contract End Date</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.contract_end_date || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {staffModalTab === 'salary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Banking & Tax Information */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Bank Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.bank_name || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Bank Account</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.bank_account || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Account Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.account_name || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Tax ID</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.tax_id || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>PAYE Tax Eligible</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.paye_eligible !== undefined ? (selectedStaff.paye_eligible ? 'Yes' : 'No') : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Salary Information */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Total Package</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.total_package ? `$${selectedStaff.total_package.toLocaleString()}` : '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Total Deductions</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#C50F11', margin: 0 }}>
                        {(() => {
                          let totalDeductions = 0;
                          
                          // Helper function to safely parse JSON
                          const safeJsonParse = (jsonString: string, defaultValue: any = []) => {
                            try {
                              return jsonString ? JSON.parse(jsonString) : defaultValue;
                            } catch (error) {
                              console.warn('Failed to parse JSON:', jsonString, error);
                              return defaultValue;
                            }
                          };
                          
                          // Social Security deductions (percentage-based)
                          const socialSecurity = safeJsonParse(selectedStaff.social_security);
                          if (Array.isArray(socialSecurity)) {
                            socialSecurity.forEach((item: any) => {
                              if (item.percentage && selectedStaff.basic_salary) {
                                // Calculate percentage of basic salary
                                totalDeductions += (selectedStaff.basic_salary * parseFloat(item.percentage)) / 100;
                              } else if (item.amount) {
                                const deduction = parseFloat(item.amount);
                                totalDeductions += deduction;
                                console.log(`DEBUG: ${item.name} deduction: ${deduction}`);
                              }
                            });
                          }
                          
                          // Insurance deductions (annual amounts converted to monthly)
                          const insuranceData = safeJsonParse(selectedStaff.insurance);
                          if (Array.isArray(insuranceData)) {
                            insuranceData.forEach((item: any) => {
                              if (item.annualAmount) {
                                const deduction = parseFloat(item.annualAmount) / 12;
                                totalDeductions += deduction;
                                console.log(`DEBUG: ${item.name} deduction: ${deduction} (${item.annualAmount}/12)`);
                              } else if (item.amount) {
                                const deduction = parseFloat(item.amount);
                                totalDeductions += deduction;
                                console.log(`DEBUG: ${item.name} deduction: ${deduction}`);
                              }
                            });
                          }
                          
                          // Loan deductions (monthly amounts)
                          const loansData = safeJsonParse(selectedStaff.loans);
                          if (Array.isArray(loansData)) {
                            loansData.forEach((item: any) => {
                              if (item.amount) {
                                const deduction = parseFloat(item.amount);
                                totalDeductions += deduction;
                                console.log(`DEBUG: ${item.name} deduction: ${deduction}`);
                              }
                            });
                          }
                          
                          // PAYE Tax calculation (if eligible) - calculated on gross taxable income (basic salary + allowances)
                          if (selectedStaff.paye_eligible && selectedStaff.basic_salary) {
                            const basicSalary = selectedStaff.basic_salary;
                            let allowancesTotal = 0;
                            
                            // Calculate total allowances from actual data
                            const allowancesDetail = safeJsonParse(selectedStaff.allowances_detail);
                            if (Array.isArray(allowancesDetail)) {
                              allowancesDetail.forEach((item: any) => {
                                if (item.amount) allowancesTotal += parseFloat(item.amount);
                              });
                            }
                            
                            const grossTaxableIncome = basicSalary + allowancesTotal;
                            let payeTax = 0;
                            
                            // Tanzania monthly tax brackets - using gross_taxable_income
                            if (grossTaxableIncome <= 270000) {
                              payeTax = 0;
                            } else if (grossTaxableIncome <= 520000) {
                              payeTax = (grossTaxableIncome - 270000) * 0.08;
                            } else if (grossTaxableIncome <= 760000) {
                              payeTax = 20000 + (grossTaxableIncome - 520000) * 0.20;
                            } else if (grossTaxableIncome <= 1000000) {
                              payeTax = 68000 + (grossTaxableIncome - 760000) * 0.25;
                            } else {
                              payeTax = 128000 + (grossTaxableIncome - 1000000) * 0.30;
                            }
                            
                            totalDeductions += payeTax;
                          }
                          
                          return totalDeductions > 0 ? `$${Math.round(totalDeductions).toLocaleString()}` : '-';
                        })()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Basic Salary</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.basic_salary ? `$${selectedStaff.basic_salary.toLocaleString()}` : '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Allowances</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {(() => {
                          let totalAllowances = 0;
                          
                          // Helper function to safely parse JSON
                          const safeJsonParse = (jsonString: string, defaultValue: any = []) => {
                            try {
                              return jsonString ? JSON.parse(jsonString) : defaultValue;
                            } catch (error) {
                              console.warn('Failed to parse JSON:', jsonString, error);
                              return defaultValue;
                            }
                          };
                          
                          const allowancesDetail = safeJsonParse(selectedStaff.allowances_detail);
                          console.log('DEBUG: Staff allowances data:', {
                            staffId: selectedStaff.id,
                            allowances_detail_raw: selectedStaff.allowances_detail,
                            allowances_detail_parsed: allowancesDetail,
                            allowances_numeric: selectedStaff.allowances,
                            isArray: Array.isArray(allowancesDetail),
                            arrayLength: Array.isArray(allowancesDetail) ? allowancesDetail.length : 'not array'
                          });
                          
                          if (Array.isArray(allowancesDetail)) {
                            allowancesDetail.forEach((item: any) => {
                              if (item.amount) totalAllowances += parseFloat(item.amount);
                            });
                          }
                          
                          console.log('DEBUG: Total allowances calculated:', totalAllowances);
                          return totalAllowances > 0 ? `$${totalAllowances.toLocaleString()}` : '-';
                        })()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Net Salary</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#0066CC', margin: 0 }}>
                        {(() => {
                          let netSalary = 0;
                          
                          // Helper function to safely parse JSON
                          const safeJsonParse = (jsonString: string, defaultValue: any = []) => {
                            try {
                              return jsonString ? JSON.parse(jsonString) : defaultValue;
                            } catch (error) {
                              console.warn('Failed to parse JSON:', jsonString, error);
                              return defaultValue;
                            }
                          };
                          
                          // Start with basic salary
                          if (selectedStaff.basic_salary) {
                            netSalary = selectedStaff.basic_salary;
                          }
                          
                          // Calculate ALL deductions from basic salary only
                          let totalDeductions = 0;
                          
                          console.log('DEBUG: Staff deduction data:', {
                            social_security: selectedStaff.social_security,
                            insurance: selectedStaff.insurance,
                            loans: selectedStaff.loans,
                            paye_eligible: selectedStaff.paye_eligible
                          });
                          
                          // Social Security deductions (percentage-based on basic salary)
                          const socialSecurity = safeJsonParse(selectedStaff.social_security);
                          if (Array.isArray(socialSecurity)) {
                            socialSecurity.forEach((item: any) => {
                              if (item.percentage && selectedStaff.basic_salary) {
                                const deduction = (selectedStaff.basic_salary * parseFloat(item.percentage)) / 100;
                                totalDeductions += deduction;
                                console.log(`DEBUG: ${item.name} deduction: ${deduction} (${item.percentage}% of ${selectedStaff.basic_salary})`);
                              } else if (item.amount) {
                                const deduction = parseFloat(item.amount);
                                totalDeductions += deduction;
                                console.log(`DEBUG: ${item.name} deduction: ${deduction}`);
                                console.log(`DEBUG: ${item.name} deduction: ${item.amount}`);
                              }
                            });
                          }
                          
                          // Insurance deductions (annual amounts converted to monthly)
                          const insuranceData = safeJsonParse(selectedStaff.insurance);
                          if (Array.isArray(insuranceData)) {
                            insuranceData.forEach((item: any) => {
                              if (item.annualAmount) {
                                const deduction = parseFloat(item.annualAmount) / 12;
                                totalDeductions += deduction;
                                console.log(`DEBUG: ${item.name} deduction: ${deduction} (${item.annualAmount}/12)`);
                              } else if (item.amount) {
                                const deduction = parseFloat(item.amount);
                                totalDeductions += deduction;
                                console.log(`DEBUG: ${item.name} deduction: ${deduction}`);
                              }
                            });
                          }
                          
                          // Loan deductions (monthly amounts)
                          const loansData = safeJsonParse(selectedStaff.loans);
                          if (Array.isArray(loansData)) {
                            loansData.forEach((item: any) => {
                              if (item.amount) {
                                const deduction = parseFloat(item.amount);
                                totalDeductions += deduction;
                                console.log(`DEBUG: ${item.name} deduction: ${deduction}`);
                              }
                            });
                          }
                          
                          // PAYE Tax calculation (if eligible) - calculated on gross taxable income (basic salary + allowances)
                          console.log('DEBUG: PAYE eligibility check:', selectedStaff.paye_eligible, selectedStaff.basic_salary);
                          if (selectedStaff.paye_eligible && selectedStaff.basic_salary) {
                            const basicSalary = selectedStaff.basic_salary;
                            let allowancesTotal = 0;
                            
                            // Calculate total allowances from actual data
                            const allowancesDetail = safeJsonParse(selectedStaff.allowances_detail);
                            if (Array.isArray(allowancesDetail)) {
                              allowancesDetail.forEach((item: any) => {
                                if (item.amount) allowancesTotal += parseFloat(item.amount);
                              });
                            }
                            
                            const grossTaxableIncome = basicSalary + allowancesTotal;
                            let payeTax = 0;
                            
                            // Tanzania monthly tax brackets - using gross_taxable_income
                            if (grossTaxableIncome <= 270000) {
                              payeTax = 0;
                            } else if (grossTaxableIncome <= 520000) {
                              payeTax = (grossTaxableIncome - 270000) * 0.08;
                            } else if (grossTaxableIncome <= 760000) {
                              payeTax = 20000 + (grossTaxableIncome - 520000) * 0.20;
                            } else if (grossTaxableIncome <= 1000000) {
                              payeTax = 68000 + (grossTaxableIncome - 760000) * 0.25;
                            } else {
                              payeTax = 128000 + (grossTaxableIncome - 1000000) * 0.30;
                            }
                            
                            totalDeductions += payeTax;
                            console.log(`DEBUG: PAYE Tax deduction: ${payeTax} (calculated on gross taxable income: ${grossTaxableIncome})`);
                          }
                          
                          // NSSF and other social security deductions are already included in the socialSecurity calculation above
                          console.log(`DEBUG: Total deductions calculated: ${totalDeductions}`);
                          
                          // Net Salary = Basic Salary + Allowances - All Deductions
                          // All deductions (PAYE, Social Security, Insurance, Loans) are already calculated above
                          netSalary = selectedStaff.basic_salary;
                          
                          // Add allowances (allowances are NEVER deducted)
                          const allowancesDetail = safeJsonParse(selectedStaff.allowances_detail);
                          if (Array.isArray(allowancesDetail)) {
                            allowancesDetail.forEach((item: any) => {
                              if (item.amount) netSalary += parseFloat(item.amount);
                            });
                          }
                          
                          // Subtract all deductions (PAYE, Social Security, Insurance, Loans)
                          netSalary -= totalDeductions;
                          
                          return netSalary > 0 ? `$${Math.round(netSalary).toLocaleString()}` : '-';
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                    {/* Allowances Breakdown */}
                    {(() => {
                      const safeJsonParse = (jsonString: string, defaultValue: any = []) => {
                        try {
                          return jsonString ? JSON.parse(jsonString) : defaultValue;
                        } catch (error) {
                          console.warn('Failed to parse JSON:', jsonString, error);
                          return defaultValue;
                        }
                      };
                      
                      const allowancesDetail = safeJsonParse(selectedStaff.allowances_detail);
                      return allowancesDetail && Array.isArray(allowancesDetail) && allowancesDetail.length > 0 && (
                        <>
                          {allowancesDetail.map((item: any, index: number) => (
                          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>{item.name}</label>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                              ${item.amount ? parseFloat(item.amount).toLocaleString() : '0'}
                            </p>
                          </div>
                        ))}
                      </>
                      );
                    })()}

                    {/* Social Security */}
                    {(() => {
                      const safeJsonParse = (jsonString: string, defaultValue: any = []) => {
                        try {
                          return jsonString ? JSON.parse(jsonString) : defaultValue;
                        } catch (error) {
                          console.warn('Failed to parse JSON:', jsonString, error);
                          return defaultValue;
                        }
                      };
                      
                      const socialSecurity = safeJsonParse(selectedStaff.social_security);
                      return socialSecurity && Array.isArray(socialSecurity) && socialSecurity.length > 0 && (
                        <>
                          {socialSecurity.map((item: any, index: number) => (
                          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>{item.name}</label>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                              {item.percentage ? `${item.percentage}%` : item.amount ? `$${item.amount}` : '-'}
                            </p>
                          </div>
                        ))}
                      </>
                      );
                    })()}

                    {/* Insurance */}
                    {(() => {
                      const safeJsonParse = (jsonString: string, defaultValue: any = []) => {
                        try {
                          return jsonString ? JSON.parse(jsonString) : defaultValue;
                        } catch (error) {
                          console.warn('Failed to parse JSON:', jsonString, error);
                          return defaultValue;
                        }
                      };
                      
                      const insurance = safeJsonParse(selectedStaff.insurance);
                      return insurance && Array.isArray(insurance) && insurance.length > 0 && (
                        <>
                          {insurance.map((item: any, index: number) => (
                          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>{item.name}</label>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                              {item.annualAmount ? `$${parseFloat(item.annualAmount).toLocaleString()}` : item.amount ? `$${item.amount}` : '-'}
                            </p>
                          </div>
                        ))}
                      </>
                      );
                    })()}

                    {/* Loans & Deductions */}
                    {(() => {
                      const safeJsonParse = (jsonString: string, defaultValue: any = []) => {
                        try {
                          return jsonString ? JSON.parse(jsonString) : defaultValue;
                        } catch (error) {
                          console.warn('Failed to parse JSON:', jsonString, error);
                          return defaultValue;
                        }
                      };
                      
                      const loans = safeJsonParse(selectedStaff.loans);
                      return loans && Array.isArray(loans) && loans.length > 0 && (
                        <>
                          {loans.map((item: any, index: number) => (
                          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>
                              {item.name}{item.type ? ` (${item.type})` : ''}
                            </label>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                              {item.amount ? `$${parseFloat(item.amount).toLocaleString()}` : '-'}
                            </p>
                          </div>
                        ))}
                      </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {staffModalTab === 'documents' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Documents
                    </h3>
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#6b7280',
                      backgroundColor: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '12px'
                    }}>
                      Read-only view
                    </span>
                  </div>

                  {/* Documents List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {(() => {
                      const safeJsonParse = (jsonString: string, defaultValue: any = []) => {
                        try {
                          return jsonString ? JSON.parse(jsonString) : defaultValue;
                        } catch (error) {
                          console.warn('Failed to parse JSON:', jsonString, error);
                          return defaultValue;
                        }
                      };
                      
                      const documents = safeJsonParse(selectedStaff.documents);
                      
                      if (!documents || !Array.isArray(documents) || documents.length === 0) {
                        return (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                            height: '120px',
                  color: '#6b7280',
                            fontSize: '14px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                            border: '1px dashed #d1d5db'
                          }}>
                            No documents added yet. Use "Edit Profile" to manage documents.
                          </div>
                        );
                      }
                      
                      return documents.map((doc: any, index: number) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FileText size={20} color="#6b7280" />
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                                {doc.name || `Document ${index + 1}`}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                {doc.file && doc.file.name ? doc.file.name : 'No file uploaded'}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              title="Download document"
                              onClick={() => {
                                if (doc.file && doc.file.data) {
                                  // Convert base64 to blob and download
                                  const byteCharacters = atob(doc.file.data.split(',')[1]);
                                  const byteNumbers = new Array(byteCharacters.length);
                                  for (let i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                  }
                                  const byteArray = new Uint8Array(byteNumbers);
                                  const blob = new Blob([byteArray], { type: doc.file.type });
                                  
                                  const link = document.createElement('a');
                                  link.href = URL.createObjectURL(blob);
                                  link.download = doc.file.name;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  URL.revokeObjectURL(link.href);
                                } else {
                                  alert('No file available for download');
                                }
                              }}
                              style={{
                                padding: '8px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: '#6b7280',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                                e.currentTarget.style.color = '#3b82f6';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#6b7280';
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7,10 12,15 17,10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                              </svg>
                            </button>
                            <button 
                              title="Delete document"
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete "${doc.name}"?`)) {
                                  // Remove document from the list
                                  const updatedDocuments = documents.filter((_, docIndex) => docIndex !== index);
                                  
                                  // Update the staff member's documents
                                  const updatedStaff = {
                                    ...selectedStaff,
                                    documents: JSON.stringify(updatedDocuments)
                                  };
                                  
                                  // Update the staff in the list
                                  const updatedStaffList = staff.map(s => 
                                    s.id === selectedStaff.id ? updatedStaff : s
                                  );
                                  setStaff(updatedStaffList);
                                  
                                  // Update selectedStaff
                                  setSelectedStaff(updatedStaff);
                                  
                                  // Update the backend
                                  try {
                                    await StaffService.updateStaff(selectedStaff.id.toString(), {
                                      documents: updatedDocuments
                                    });
                                    console.log('Document deleted successfully');
                                  } catch (error) {
                                    console.error('Error deleting document:', error);
                                    alert('Failed to delete document. Please try again.');
                                  }
                                }
                              }}
                              style={{
                                padding: '8px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: '#6b7280',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#fef2f2';
                                e.currentTarget.style.color = '#dc2626';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#6b7280';
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {staffModalTab === 'attendance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Work Schedule</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.work_schedule || 'Not specified'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Holiday Entitlement</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.holiday_entitlement || 0} days per year
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Current Status</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.leave_status || 'Available'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Leave End Date</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.leave_end_date ? new Date(selectedStaff.leave_end_date).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
                  </div>
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
              <button 
                onClick={() => {
                  setShowStaffModal(false);
                  if (onEditStaff && selectedStaff) {
                    onEditStaff(selectedStaff);
                  }
                }}
                style={{
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

