'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  Star,
  Edit,
  Trash2,
  MessageCircle,
  Eye,
  UserPlus,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  UserCheck,
  PhoneCall,
  Mail as MailIcon,
  MessageSquare,
  FileText,
  Send,
  Receipt,
  Briefcase,
  Shield,
  User,
  X,
  Award,
  Clock,
  GraduationCap
} from 'lucide-react';

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'branches' | 'departments' | 'roles' | 'staff' | 'payroll'>('branches');
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffModalTab, setStaffModalTab] = useState('personal');

  // Mock data for branches
  const mockBranches = [
    {
      id: '1',
      name: 'Main Office',
      code: 'MAIN',
      address: '123 Business Street',
      city: 'Dar es Salaam',
      country: 'Tanzania',
      phone: '+255 22 123 4567',
      email: 'main@arisportal.com',
      manager: 'Sarah Johnson',
      status: 'active',
      employeeCount: 45,
      departmentCount: 3
    },
    {
      id: '2',
      name: 'Tech Center',
      code: 'TECH',
      address: '456 Innovation Avenue',
      city: 'Arusha',
      country: 'Tanzania',
      phone: '+255 27 234 5678',
      email: 'tech@arisportal.com',
      manager: 'Michael Chen',
      status: 'active',
      employeeCount: 28,
      departmentCount: 2
    },
    {
      id: '3',
      name: 'Sales Office',
      code: 'SALES',
      address: '789 Commerce Road',
      city: 'Mwanza',
      country: 'Tanzania',
      phone: '+255 28 345 6789',
      email: 'sales@arisportal.com',
      manager: 'Lisa Rodriguez',
      status: 'active',
      employeeCount: 15,
      departmentCount: 1
    }
  ];

  // Mock data for departments
  const mockDepartments = [
    {
      id: '1',
      name: 'Human Resources',
      code: 'HR',
      branch: 'Main Office',
      manager: 'Jennifer Smith',
      employeeCount: 8,
      budget: 120000,
      status: 'active'
    },
    {
      id: '2',
      name: 'Finance & Accounting',
      code: 'FIN',
      branch: 'Main Office',
      manager: 'Robert Wilson',
      employeeCount: 12,
      budget: 180000,
      status: 'active'
    },
    {
      id: '3',
      name: 'Information Technology',
      code: 'IT',
      branch: 'Tech Center',
      manager: 'David Brown',
      employeeCount: 15,
      budget: 250000,
      status: 'active'
    }
  ];

  // Mock data for roles
  const mockRoles = [
    {
      id: '1',
      title: 'Senior Developer',
      department: 'Information Technology',
      level: 'Senior',
      baseSalary: 85000,
      benefits: 'Health, Dental, Vision',
      employeeCount: 5,
      status: 'active'
    },
    {
      id: '2',
      title: 'HR Manager',
      department: 'Human Resources',
      level: 'Manager',
      baseSalary: 75000,
      benefits: 'Health, Dental, Vision, 401k',
      employeeCount: 1,
      status: 'active'
    },
    {
      id: '3',
      title: 'Accountant',
      department: 'Finance & Accounting',
      level: 'Mid-level',
      baseSalary: 55000,
      benefits: 'Health, Dental',
      employeeCount: 3,
      status: 'active'
    }
  ];

  // Mock data for staff with comprehensive details
  const mockStaff = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@arisportal.com',
      phone: '+255 22 111 2222',
      department: 'Information Technology',
      role: 'Senior Developer',
      branch: 'Tech Center',
      hireDate: '2023-01-15',
      salary: 85000,
      status: 'active',
      // Detailed information for modal
      firstName: 'John',
      lastName: 'Doe',
      middleName: 'Michael',
      dateOfBirth: '1990-05-15',
      gender: 'Male',
      nationalId: '123456789',
      maritalStatus: 'Single',
      bloodGroup: 'O+',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Sister',
        phone: '+255 22 999 8888'
      },
      address: {
        full: '123 Main Street, Downtown, Dar es Salaam, Tanzania',
        city: 'Dar es Salaam',
        state: 'Dar es Salaam',
        country: 'Tanzania',
        postalCode: '11101'
      },
      employment: {
        employeeId: 'EMP001',
        employeeNumber: '2023001',
        department: 'Information Technology',
        position: 'Senior Developer',
        employmentType: 'Full-time',
        employmentStatus: 'Active',
        hireDate: '2023-01-15',
        probationEndDate: '2023-04-15',
        contractEndDate: '2026-01-15',
        reportingManager: 'Tech Lead',
        workLocation: 'Tech Center'
      },
      salaryDetails: {
        basicSalary: 75000,
        allowances: 10000,
        totalPackage: 85000,
        bankName: 'CRDB Bank',
        bankAccount: '1234567890',
        taxId: 'TAX123456',
        lastReview: '2023-12-01',
        nextReview: '2024-12-01'
      },
      benefits: ['Health Insurance', 'Pension Plan', 'Life Insurance', 'Transport Allowance'],
      performance: {
        rating: 'Excellent (5)',
        lastReview: '2023-12-15',
        technicalSkills: 'JavaScript, React, Node.js, Python, SQL, Git, Docker',
        languages: 'English (Fluent), Swahili (Native)',
        certifications: [
          {
            name: 'AWS Certified Developer',
            issued: '2023-06-15',
            expires: '2026-06-15',
            status: 'Active'
          }
        ]
      },
      attendance: {
        workSchedule: 'Full-time (8 hours/day)',
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
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@arisportal.com',
      phone: '+255 22 333 4444',
      department: 'Human Resources',
      role: 'HR Manager',
      branch: 'Main Office',
      hireDate: '2022-06-10',
      salary: 75000,
      status: 'active',
      firstName: 'Jane',
      lastName: 'Smith',
      middleName: 'Elizabeth',
      dateOfBirth: '1988-08-22',
      gender: 'Female',
      nationalId: '234567890',
      maritalStatus: 'Married',
      bloodGroup: 'A+',
      emergencyContact: {
        name: 'Robert Smith',
        relationship: 'Husband',
        phone: '+255 22 777 6666'
      },
      address: {
        full: '456 Oak Avenue, Business District, Dar es Salaam, Tanzania',
        city: 'Dar es Salaam',
        state: 'Dar es Salaam',
        country: 'Tanzania',
        postalCode: '11102'
      },
      employment: {
        employeeId: 'EMP002',
        employeeNumber: '2022002',
        department: 'Human Resources',
        position: 'HR Manager',
        employmentType: 'Full-time',
        employmentStatus: 'Active',
        hireDate: '2022-06-10',
        probationEndDate: '2022-09-10',
        contractEndDate: '2025-06-10',
        reportingManager: 'CEO',
        workLocation: 'Main Office'
      },
      salaryDetails: {
        basicSalary: 65000,
        allowances: 10000,
        totalPackage: 75000,
        bankName: 'NMB Bank',
        bankAccount: '2345678901',
        taxId: 'TAX234567',
        lastReview: '2023-11-15',
        nextReview: '2024-11-15'
      },
      benefits: ['Health Insurance', 'Dental Insurance', 'Vision Insurance', '401k Plan'],
      performance: {
        rating: 'Excellent (5)',
        lastReview: '2023-11-15',
        technicalSkills: 'HR Management, Employee Relations, Payroll Systems, Recruitment',
        languages: 'English (Fluent), Swahili (Native), French (Intermediate)',
        certifications: [
          {
            name: 'PHR Certification',
            issued: '2022-09-10',
            expires: '2025-09-10',
            status: 'Active'
          }
        ]
      },
      attendance: {
        workSchedule: 'Full-time (8 hours/day)',
        holidayEntitlement: 25,
        leaveBalance: {
          annual: 20,
          sick: 8,
          personal: 3,
          maternity: 0
        }
      }
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@arisportal.com',
      phone: '+255 22 555 6666',
      department: 'Finance & Accounting',
      role: 'Accountant',
      branch: 'Main Office',
      hireDate: '2023-03-20',
      salary: 55000,
      status: 'active',
      firstName: 'Mike',
      lastName: 'Johnson',
      middleName: 'James',
      dateOfBirth: '1992-12-03',
      gender: 'Male',
      nationalId: '345678901',
      maritalStatus: 'Single',
      bloodGroup: 'B+',
      emergencyContact: {
        name: 'Linda Johnson',
        relationship: 'Mother',
        phone: '+255 22 444 3333'
      },
      address: {
        full: '789 Pine Street, Financial District, Dar es Salaam, Tanzania',
        city: 'Dar es Salaam',
        state: 'Dar es Salaam',
        country: 'Tanzania',
        postalCode: '11103'
      },
      employment: {
        employeeId: 'EMP003',
        employeeNumber: '2023003',
        department: 'Finance & Accounting',
        position: 'Accountant',
        employmentType: 'Full-time',
        employmentStatus: 'Active',
        hireDate: '2023-03-20',
        probationEndDate: '2023-06-20',
        contractEndDate: '2026-03-20',
        reportingManager: 'Finance Manager',
        workLocation: 'Main Office'
      },
      salaryDetails: {
        basicSalary: 45000,
        allowances: 10000,
        totalPackage: 55000,
        bankName: 'Exim Bank',
        bankAccount: '3456789012',
        taxId: 'TAX345678',
        lastReview: '2023-10-20',
        nextReview: '2024-10-20'
      },
      benefits: ['Health Insurance', 'Dental Insurance', 'Gym Membership'],
      performance: {
        rating: 'Good (4)',
        lastReview: '2023-10-20',
        technicalSkills: 'Accounting, Excel, QuickBooks, Financial Reporting, Tax Compliance',
        languages: 'English (Fluent), Swahili (Native)',
        certifications: [
          {
            name: 'CPA Certification',
            issued: '2023-05-15',
            expires: '2026-05-15',
            status: 'Active'
          }
        ]
      },
      attendance: {
        workSchedule: 'Full-time (8 hours/day)',
        holidayEntitlement: 25,
        leaveBalance: {
          annual: 18,
          sick: 12,
          personal: 4,
          maternity: 0
        }
      }
    }
  ];

  // Mock data for payroll
  const mockPayroll = [
    {
      id: '1',
      employee: 'John Doe',
      department: 'Information Technology',
      role: 'Senior Developer',
      baseSalary: 85000,
      allowances: 5000,
      deductions: 2500,
      netSalary: 87500,
      payPeriod: '2024-01',
      status: 'paid'
    },
    {
      id: '2',
      employee: 'Jane Smith',
      department: 'Human Resources',
      role: 'HR Manager',
      baseSalary: 75000,
      allowances: 4000,
      deductions: 2200,
      netSalary: 76800,
      payPeriod: '2024-01',
      status: 'paid'
    },
    {
      id: '3',
      employee: 'Mike Johnson',
      department: 'Finance & Accounting',
      role: 'Accountant',
      baseSalary: 55000,
      allowances: 3000,
      deductions: 1800,
      netSalary: 56200,
      payPeriod: '2024-01',
      status: 'pending'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Staff modal handlers
  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setShowStaffModal(true);
    setStaffModalTab('personal');
  };

  // Tab definitions for staff modal
  const staffModalTabs = [
    { id: "personal", label: "Personal", icon: <User size={16} /> },
    { id: "contact", label: "Contact", icon: <Mail size={16} /> },
    { id: "employment", label: "Employment", icon: <Briefcase size={16} /> },
    { id: "salary", label: "Salary", icon: <DollarSign size={16} /> },
    { id: "performance", label: "Performance", icon: <Award size={16} /> },
    { id: "attendance", label: "Attendance", icon: <Clock size={16} /> },
    { id: "documents", label: "Documents", icon: <FileText size={16} /> }
  ];

  // Filter functions
  const filteredDepartments = mockDepartments.filter(dept => {
    const matchesBranch = branchFilter === 'all' || dept.branch === branchFilter;
    const matchesSearch = searchQuery === '' || 
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.manager.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const filteredRoles = mockRoles.filter(role => {
    const matchesBranch = branchFilter === 'all' || 
      mockDepartments.some(dept => dept.name === role.department && dept.branch === branchFilter);
    const matchesSearch = searchQuery === '' || 
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.level.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const filteredStaff = mockStaff.filter(staff => {
    const matchesBranch = branchFilter === 'all' || staff.branch === branchFilter;
    const matchesSearch = searchQuery === '' || 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const filteredPayroll = mockPayroll.filter(payroll => {
    const staffMember = mockStaff.find(s => s.name === payroll.employee);
    const matchesBranch = branchFilter === 'all' || (staffMember && staffMember.branch === branchFilter);
    const matchesSearch = searchQuery === '' || 
      payroll.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payroll.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payroll.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payroll.payPeriod.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { backgroundColor: '#10b981', color: '#ffffff' };
      case 'inactive': return { backgroundColor: '#f3f4f6', color: '#374151' };
      case 'paid': return { backgroundColor: '#10b981', color: '#ffffff' };
      case 'pending': return { backgroundColor: '#fef3c7', color: '#92400e' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'branches':
        return (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '24px'
          }}>
            {mockBranches.map((branch) => (
              <div key={branch.id} style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                      {branch.name}
                    </h3>
                    <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                      {branch.code}
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <MapPin size={16} color="#6b7280" />
                  <div>
                    <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                      {branch.address}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      {branch.city}, {branch.country}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      {branch.departmentCount} departments
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      {branch.employeeCount} employees
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <User size={16} color="#6b7280" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    Manager: {branch.manager}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '20px',
                    color: '#6b7280'
                  }}>
                    <Eye size={16} />
                  </button>
                  <button style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '20px',
                    color: '#6b7280'
                  }}>
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'departments':
        return (
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Department</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Branch</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Manager</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Employees</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Budget</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((dept) => (
                    <tr key={dept.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                            {dept.name}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            {dept.code}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                          {dept.branch}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                          {dept.manager}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          {dept.employeeCount}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          {formatCurrency(dept.budget)}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          ...getStatusColor(dept.status)
                        }}>
                          {dept.status.charAt(0).toUpperCase() + dept.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{
                            padding: '6px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '20px',
                            color: '#6b7280'
                          }}>
                            <Eye size={16} />
                          </button>
                          <button style={{
                            padding: '6px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '20px',
                            color: '#6b7280'
                          }}>
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'roles':
        return (
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Role Title</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Department</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Level</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Base Salary</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Employees</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.map((role) => (
                    <tr key={role.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          {role.title}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                          {role.department}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                          {role.level}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          {formatCurrency(role.baseSalary)}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          {role.employeeCount}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
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
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{
                            padding: '6px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '20px',
                            color: '#6b7280'
                          }}>
                            <Eye size={16} />
                          </button>
                          <button style={{
                            padding: '6px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '20px',
                            color: '#6b7280'
                          }}>
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'staff':
        return (
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'payroll':
        return (
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Employee</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Department</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Base Salary</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Allowances</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Deductions</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Net Salary</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Pay Period</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayroll.map((payroll) => (
                    <tr key={payroll.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          {payroll.employee}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                          {payroll.department}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          {formatCurrency(payroll.baseSalary)}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                          +{formatCurrency(payroll.allowances)}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>
                          -{formatCurrency(payroll.deductions)}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>
                          {formatCurrency(payroll.netSalary)}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                          {payroll.payPeriod}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          ...getStatusColor(payroll.status)
                        }}>
                          {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{
                            padding: '6px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '20px',
                            color: '#6b7280'
                          }}>
                            <Eye size={16} />
                          </button>
                          <button style={{
                            padding: '6px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '20px',
                            color: '#6b7280'
                          }}>
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Payroll Management
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage branches, departments, roles, staff, and payroll processing
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Plus size={20} />
            Add New
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Building size={20} color="var(--mc-sidebar-bg)" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Branches</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {mockBranches.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Briefcase size={20} color="#10b981" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Departments</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {mockDepartments.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Users size={20} color="#f59e0b" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Staff</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {mockStaff.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <DollarSign size={20} color="#8b5cf6" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Monthly Payroll</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {formatCurrency(mockPayroll.reduce((sum, p) => sum + p.netSalary, 0))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'branches', label: 'Branches', icon: <Building size={16} /> },
            { id: 'departments', label: 'Departments', icon: <Briefcase size={16} /> },
            { id: 'roles', label: 'Roles', icon: <Shield size={16} /> },
            { id: 'staff', label: 'Staff', icon: <Users size={16} /> },
            { id: 'payroll', label: 'Payroll', icon: <Receipt size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? 'var(--mc-sidebar-bg)' : 'white',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                boxShadow: activeTab === tab.id ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar and Branch Filter */}
        {(activeTab === 'departments' || activeTab === 'roles' || activeTab === 'staff' || activeTab === 'payroll') && (
          <div style={{
            position: 'relative',
            height: '40px',
            marginBottom: '24px'
          }}>
            {/* Search Bar - positioned from right */}
            <div style={{ 
              position: 'absolute',
              right: '180px',
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
                placeholder={`Search ${activeTab}...`}
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
                {mockBranches.map((branch) => (
                  <option key={branch.id} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {renderTabContent()}

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
                          {selectedStaff.emergencyContact2?.name || selectedStaff.alternativeEmergencyContact?.name || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Relationship</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergencyContact2?.relationship || selectedStaff.alternativeEmergencyContact?.relationship || '-'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Phone</label>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                          {selectedStaff.emergencyContact2?.phone || selectedStaff.alternativeEmergencyContact?.phone || '-'}
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

              {staffModalTab === 'employment' && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '24px' 
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Employee ID</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.employment?.employeeId || '-'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Employee Number</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.employment?.employeeNumber || '-'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Department</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.employment?.department || selectedStaff.department}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Position/Job Title</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.employment?.position || selectedStaff.role}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Employment Type</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.employment?.employmentType || 'Full-time'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Employment Status</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.employment?.employmentStatus || selectedStaff.status}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Hire Date</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.employment?.hireDate || selectedStaff.hireDate}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Reporting Manager</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.employment?.reportingManager || '-'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Work Location/Branch</label>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                      {selectedStaff.employment?.workLocation || selectedStaff.branch}
                    </p>
                  </div>
                </div>
              )}

              {staffModalTab === 'salary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '24px' 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Basic Salary</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.salaryDetails?.basicSalary ? formatCurrency(selectedStaff.salaryDetails.basicSalary) : formatCurrency(selectedStaff.salary * 0.8)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Allowances</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.salaryDetails?.allowances ? formatCurrency(selectedStaff.salaryDetails.allowances) : formatCurrency(selectedStaff.salary * 0.2)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Total Package</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.salaryDetails?.totalPackage ? formatCurrency(selectedStaff.salaryDetails.totalPackage) : formatCurrency(selectedStaff.salary)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Bank Name</label>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {selectedStaff.salaryDetails?.bankName || 'Not provided'}
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
                      {selectedStaff.benefits?.map((benefit, index) => (
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
              {['performance', 'attendance', 'documents'].includes(staffModalTab) && (
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
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
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
}
