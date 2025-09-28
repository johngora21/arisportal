"use client";

import { useState } from "react";
import { 
  Search, Plus, Edit, Eye, Building, Briefcase, Mail, Phone, X, 
  Calendar, DollarSign, Award, FileText, Download, CheckCircle, 
  MapPin, User, Shield, Clock, Star, GraduationCap
} from "lucide-react";

export default function HREmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  // Mock data
  const employees = [
    {
      id: 1,
      name: "John Smith",
      position: "Software Engineer",
      status: "Active",
      salary: 85000,
      startDate: "2022-01-15",
      email: "john.smith@company.com",
      phone: "+1 (555) 123-4567",
      // Detailed information for modal
      firstName: "John",
      lastName: "Smith",
      middleName: "Michael",
      dateOfBirth: "1990-05-15",
      gender: "Male",
      nationalId: "123456789",
      maritalStatus: "Single",
      bloodGroup: "O+",
      emergencyContact: {
        name: "Jane Smith",
        relationship: "Sister",
        phone: "+1 (555) 987-6543"
      },
      address: {
        full: "123 Main Street, Downtown, New York, NY 10001",
        city: "New York",
        state: "NY",
        country: "USA",
        postalCode: "10001"
      },
      employment: {
        employeeId: "EMP001",
        employeeNumber: "2022001",
        department: "Engineering",
        position: "Software Engineer",
        employmentType: "Full-time",
        employmentStatus: "Active",
        hireDate: "2022-01-15",
        probationEndDate: "2022-04-15",
        contractEndDate: "2025-01-15",
        reportingManager: "Sarah Johnson",
        workLocation: "New York Office"
      },
      salary: {
        basicSalary: 75000,
        allowances: 10000,
        totalPackage: 85000,
        bankName: "Chase Bank",
        bankAccount: "1234567890",
        taxId: "TAX123456",
        lastReview: "2023-12-01",
        nextReview: "2024-12-01"
      },
      benefits: ["Health Insurance", "Pension Plan", "Life Insurance", "Transport Allowance"],
      performance: {
        rating: "Excellent (5)",
        lastReview: "2023-12-15",
        technicalSkills: "JavaScript, React, Node.js, Python, SQL, Git, Docker",
        languages: "English (Fluent), Spanish (Basic)",
        certifications: [
          {
            name: "AWS Certified Developer",
            issued: "2023-06-15",
            expires: "2026-06-15",
            status: "Active"
          },
          {
            name: "React Developer Certification",
            issued: "2023-03-20",
            expires: "2025-03-20",
            status: "Active"
          }
        ]
      },
      attendance: {
        workSchedule: "Full-time (8 hours/day)",
        holidayEntitlement: 25,
        leaveBalance: {
          annual: 15,
          sick: 10,
          personal: 5,
          maternity: 3
        }
      }
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "HR Manager",
      status: "Active",
      salary: 95000,
      startDate: "2021-03-20",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 234-5678"
    },
    {
      id: 3,
      name: "Mike Wilson",
      position: "Marketing Specialist",
      status: "Active",
      salary: 65000,
      startDate: "2022-06-10",
      email: "mike.wilson@company.com",
      phone: "+1 (555) 345-6789"
    }
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || employee.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
    setActiveTab("personal");
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: <User size={16} /> },
    { id: "contact", label: "Contact", icon: <Mail size={16} /> },
    { id: "employment", label: "Employment", icon: <Briefcase size={16} /> },
    { id: "salary", label: "Salary", icon: <DollarSign size={16} /> },
    { id: "performance", label: "Performance", icon: <Award size={16} /> },
    { id: "attendance", label: "Attendance", icon: <Clock size={16} /> },
    { id: "documents", label: "Documents", icon: <FileText size={16} /> },
    { id: "access", label: "Access", icon: <Shield size={16} /> }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Employee Management
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage employee records, profiles, and information
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#0f172a',
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
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{
        position: 'relative',
        height: '40px',
        marginBottom: '24px'
      }}>
        {/* Search Bar - positioned from right */}
        <div style={{ 
          position: 'absolute',
          right: '290px',
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
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        
        {/* Status Filter - positioned from right */}
        <div style={{
          position: 'absolute',
          right: '50px',
          top: '0px'
        }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              background: 'white',
              width: '180px'
            }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Employee Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '24px' 
      }}>
        {filteredEmployees.map((employee) => (
          <div key={employee.id} style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
          onClick={() => handleViewEmployee(employee)}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          }}>
            {/* Header with Avatar and Status */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #0f172a, #8b5cf6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '20px'
                }}>
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: '#111827', 
                    margin: '0 0 4px 0', 
                    lineHeight: '1.2'
                  }}>
                    {employee.name}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    fontWeight: '500',
                    margin: 0 
                  }}>
                    {employee.position}
                  </p>
                </div>
              </div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: employee.status === 'Active' ? '#dcfce7' : '#fee2e2',
                color: employee.status === 'Active' ? '#166534' : '#dc2626',
                border: employee.status === 'Active' ? '1px solid #bbf7d0' : '1px solid #fecaca'
              }}>
                {employee.status}
              </span>
            </div>

            {/* Employee Details */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                  <Building size={16} color="#9ca3af" />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Main Branch</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                  <Briefcase size={16} color="#9ca3af" />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Engineering</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                  <Mail size={16} color="#9ca3af" />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{employee.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                  <Phone size={16} color="#9ca3af" />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{employee.phone}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    // Handle edit action
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dcfce7';
                    e.currentTarget.style.color = '#16a34a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <Edit size={16} color="#6b7280" />
                </button>
              </div>
              <button 
                style={{
                  background: '#0f172a',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  // Handle contact action
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0f172a';
                }}
              >
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Detail Modal */}
      {showEmployeeModal && selectedEmployee && (
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
            borderRadius: '12px',
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
                  Employee Profile
                </h2>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                  View comprehensive employee information and profile
                </p>
              </div>
              <button
                onClick={() => setShowEmployeeModal(false)}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
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
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '4px'
              }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '12px 8px',
                      backgroundColor: activeTab === tab.id ? '#0f172a' : 'transparent',
                      color: activeTab === tab.id ? 'white' : '#6b7280',
                      border: 'none',
                      borderRadius: '6px',
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
              {activeTab === 'personal' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>First Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.firstName || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Last Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.lastName || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Middle Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.middleName || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Date of Birth</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.dateOfBirth || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Gender</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.gender || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>National ID</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.nationalId || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Marital Status</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.maritalStatus || '-'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Blood Group</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.bloodGroup || '-'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Emergency Contact
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '16px' 
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Contact Name</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedEmployee.emergencyContact?.name || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Relationship</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedEmployee.emergencyContact?.relationship || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Phone</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedEmployee.emergencyContact?.phone || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Email Address</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.email}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Phone Number</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.phone}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Alternative Phone</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.phone}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>City</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.address?.city || 'New York'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Current Address
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Full Address</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.address?.full || '123 Main Street, Downtown, New York, NY 10001'}
                      </p>
                    </div>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '16px' 
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>State/Region</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedEmployee.address?.state || 'NY'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Country</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedEmployee.address?.country || 'USA'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Postal Code</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedEmployee.address?.postalCode || '10001'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'employment' && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '24px' 
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Employee ID</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedEmployee.employment?.employeeId || 'EMP001'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Employee Number</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedEmployee.employment?.employeeNumber || '2022001'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Department</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedEmployee.employment?.department || 'Engineering'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Position/Job Title</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedEmployee.position}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Employment Type</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedEmployee.employment?.employmentType || 'Full-time'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Employment Status</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedEmployee.status}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Hire Date</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedEmployee.startDate}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Probation End Date</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedEmployee.employment?.probationEndDate || '2022-04-15'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Contract End Date</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedEmployee.employment?.contractEndDate || '2025-01-15'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Reporting Manager</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedEmployee.employment?.reportingManager || '-'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Work Location/Branch</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedEmployee.employment?.workLocation || '-'}
                    </p>
                  </div>
                </div>
              )}

              {/* Add more tabs as needed */}
              {activeTab === 'salary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Basic Salary</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        ${selectedEmployee.salary?.basicSalary?.toLocaleString() || '$75,000'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Allowances</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        ${selectedEmployee.salary?.allowances?.toLocaleString() || '$10,000'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Total Package</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        ${selectedEmployee.salary?.totalPackage?.toLocaleString() || '$85,000'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Bank Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedEmployee.salary?.bankName || 'Chase Bank'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Benefits
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '16px' 
                    }}>
                      {selectedEmployee.benefits?.map((benefit, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            width: '16px', 
                            height: '16px', 
                            backgroundColor: '#10b981', 
                            borderRadius: '50%' 
                          }}></div>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                            {benefit}
                          </span>
                        </div>
                      )) || (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '16px', 
                              height: '16px', 
                              backgroundColor: '#10b981', 
                              borderRadius: '50%' 
                            }}></div>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                              Health Insurance
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '16px', 
                              height: '16px', 
                              backgroundColor: '#10b981', 
                              borderRadius: '50%' 
                            }}></div>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                              Pension Plan
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {['performance', 'attendance', 'documents', 'access'].includes(activeTab) && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '200px',
                  color: '#6b7280',
                  fontSize: '16px'
                }}>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} information will be displayed here
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
                onClick={() => setShowEmployeeModal(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
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
                backgroundColor: '#0f172a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0f172a';
              }}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}