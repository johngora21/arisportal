'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Eye,
  Briefcase,
  Users,
  MapPin,
  Phone,
  Mail,
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
  MessageCircle,
  Plus
} from 'lucide-react';
import { DepartmentService } from '../services/payrollService';

interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  employees: number;
  branch: string;
  status: string;
  // Extended details for modal
  phone: string;
  email: string;
  establishedDate: string;
  budget: number;
  objectives: string[];
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
    joinDate: string;
    status: string;
    email: string;
    phone: string;
  }>;
  performance: {
    rating: number;
    projectsCompleted: number;
    budgetUtilization: number;
    teamSatisfaction: number;
  };
  // Financial details for finance module
  monthlyBudget: number;
  annualBudget: number;
  expenses: Array<{
    id: string;
    category: string;
    amount: number;
    date: string;
    description: string;
  }>;
}

interface DepartmentsTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  branchFilter: string;
  setBranchFilter: (filter: string) => void;
  branches: Array<{ id: string; name: string }>;
  onAddNew: () => void;
  onRefresh?: () => void;
  refreshTrigger?: number;
}

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Information Technology',
    description: 'Software development and IT infrastructure',
    manager: 'Tech Lead',
    employees: 25,
    branch: 'Tech Center',
    status: 'active',
    phone: '+1 (555) 123-4567',
    email: 'informationtechnology@arisportal.com',
    establishedDate: '2020-01-15',
    budget: 500000,
    objectives: [
      'Develop scalable web applications',
      'Maintain system security and performance',
      'Implement new technologies and frameworks',
      'Support business growth through innovation'
    ],
    teamMembers: [
      { id: '1', name: 'John Smith', role: 'Senior Developer', joinDate: '2020-03-01', status: 'active', email: 'john.smith@arisportal.com', phone: '+1 (555) 111-2222' },
      { id: '2', name: 'Jane Doe', role: 'Frontend Developer', joinDate: '2021-06-15', status: 'active', email: 'jane.doe@arisportal.com', phone: '+1 (555) 111-2223' },
      { id: '3', name: 'Bob Wilson', role: 'Backend Developer', joinDate: '2020-08-20', status: 'active', email: 'bob.wilson@arisportal.com', phone: '+1 (555) 111-2224' }
    ],
    performance: {
      rating: 4.5,
      projectsCompleted: 12,
      budgetUtilization: 85,
      teamSatisfaction: 92
    },
    monthlyBudget: 41667,
    annualBudget: 500000,
    expenses: [
      { id: '1', category: 'Salaries', amount: 35000, date: '2023-12-01', description: 'Monthly salary payments' },
      { id: '2', category: 'Equipment', amount: 5000, date: '2023-12-15', description: 'Software licenses and hardware' },
      { id: '3', category: 'Training', amount: 1667, date: '2023-12-20', description: 'Employee development programs' }
    ]
  },
  {
    id: '2',
    name: 'Human Resources',
    description: 'Employee management and recruitment',
    manager: 'HR Manager',
    employees: 8,
    branch: 'Main Branch',
    status: 'active',
    phone: '+1 (555) 234-5678',
    email: 'humanresources@arisportal.com',
    establishedDate: '2019-03-10',
    budget: 200000,
    objectives: [
      'Recruit top talent for all departments',
      'Maintain employee satisfaction and engagement',
      'Develop comprehensive training programs',
      'Ensure compliance with labor laws'
    ],
    teamMembers: [
      { id: '1', name: 'Alice Brown', role: 'HR Specialist', joinDate: '2020-01-15', status: 'active', email: 'alice.brown@arisportal.com', phone: '+1 (555) 222-3333' },
      { id: '2', name: 'Tom Davis', role: 'Recruiter', joinDate: '2021-04-10', status: 'active', email: 'tom.davis@arisportal.com', phone: '+1 (555) 222-3334' }
    ],
    performance: {
      rating: 4.2,
      projectsCompleted: 8,
      budgetUtilization: 78,
      teamSatisfaction: 88
    },
    monthlyBudget: 16667,
    annualBudget: 200000,
    expenses: [
      { id: '1', category: 'Salaries', amount: 12000, date: '2023-12-01', description: 'Monthly salary payments' },
      { id: '2', category: 'Recruitment', amount: 3000, date: '2023-12-10', description: 'Job posting and recruitment costs' },
      { id: '3', category: 'Training', amount: 1667, date: '2023-12-18', description: 'Employee training programs' }
    ]
  },
  {
    id: '3',
    name: 'Finance',
    description: 'Financial planning and accounting',
    manager: 'Finance Director',
    employees: 12,
    branch: 'Main Branch',
    status: 'active',
    phone: '+1 (555) 345-6789',
    email: 'finance@arisportal.com',
    establishedDate: '2018-12-01',
    budget: 150000,
    objectives: [
      'Maintain accurate financial records',
      'Provide financial analysis and reporting',
      'Ensure regulatory compliance',
      'Optimize cash flow and budgeting'
    ],
    teamMembers: [
      { id: '1', name: 'Jennifer White', role: 'Senior Accountant', joinDate: '2019-01-15', status: 'active', email: 'jennifer.white@arisportal.com', phone: '+1 (555) 333-4444' },
      { id: '2', name: 'Robert Kim', role: 'Financial Analyst', joinDate: '2020-05-20', status: 'active', email: 'robert.kim@arisportal.com', phone: '+1 (555) 333-4445' }
    ],
    performance: {
      rating: 4.7,
      projectsCompleted: 10,
      budgetUtilization: 95,
      teamSatisfaction: 90
    },
    monthlyBudget: 12500,
    annualBudget: 150000,
    expenses: [
      { id: '1', category: 'Salaries', amount: 8000, date: '2023-12-01', description: 'Monthly salary payments' },
      { id: '2', category: 'Software', amount: 2500, date: '2023-12-05', description: 'Accounting software licenses' },
      { id: '3', category: 'Audit', amount: 2000, date: '2023-12-12', description: 'External audit fees' }
    ]
  },
  {
    id: '4',
    name: 'Sales & Marketing',
    description: 'Sales operations and marketing campaigns',
    manager: 'Sales Manager',
    employees: 18,
    branch: 'Sales Hub',
    status: 'active',
    phone: '+1 (555) 456-7890',
    email: 'salesmarketing@arisportal.com',
    establishedDate: '2019-06-20',
    budget: 300000,
    objectives: [
      'Increase brand awareness and recognition',
      'Generate qualified leads for sales team',
      'Develop effective marketing campaigns',
      'Maintain strong social media presence'
    ],
    teamMembers: [
      { id: '1', name: 'Rachel Green', role: 'Marketing Manager', joinDate: '2019-07-01', status: 'active', email: 'rachel.green@arisportal.com', phone: '+1 (555) 444-5555' },
      { id: '2', name: 'Mark Taylor', role: 'Content Creator', joinDate: '2020-02-15', status: 'active', email: 'mark.taylor@arisportal.com', phone: '+1 (555) 444-5556' },
      { id: '3', name: 'Sara Miller', role: 'Social Media Specialist', joinDate: '2021-01-10', status: 'active', email: 'sara.miller@arisportal.com', phone: '+1 (555) 444-5557' }
    ],
    performance: {
      rating: 4.3,
      projectsCompleted: 15,
      budgetUtilization: 92,
      teamSatisfaction: 85
    },
    monthlyBudget: 25000,
    annualBudget: 300000,
    expenses: [
      { id: '1', category: 'Salaries', amount: 15000, date: '2023-12-01', description: 'Monthly salary payments' },
      { id: '2', category: 'Advertising', amount: 7000, date: '2023-12-08', description: 'Digital marketing campaigns' },
      { id: '3', category: 'Events', amount: 3000, date: '2023-12-14', description: 'Trade shows and events' }
    ]
  },
  {
    id: '5',
    name: 'Operations',
    description: 'Daily operations and logistics',
    manager: 'Operations Manager',
    employees: 15,
    branch: 'Regional Office',
    status: 'active',
    phone: '+1 (555) 567-8901',
    email: 'operations@arisportal.com',
    establishedDate: '2019-09-05',
    budget: 250000,
    objectives: [
      'Streamline operational processes',
      'Ensure efficient resource allocation',
      'Maintain high service quality standards',
      'Support business expansion initiatives'
    ],
    teamMembers: [
      { id: '1', name: 'Kevin Park', role: 'Operations Coordinator', joinDate: '2020-03-10', status: 'active', email: 'kevin.park@arisportal.com', phone: '+1 (555) 555-6666' },
      { id: '2', name: 'Maria Garcia', role: 'Process Analyst', joinDate: '2021-07-15', status: 'active', email: 'maria.garcia@arisportal.com', phone: '+1 (555) 555-6667' },
      { id: '3', name: 'James Wilson', role: 'Quality Assurance', joinDate: '2020-11-20', status: 'active', email: 'james.wilson@arisportal.com', phone: '+1 (555) 555-6668' }
    ],
    performance: {
      rating: 4.1,
      projectsCompleted: 18,
      budgetUtilization: 88,
      teamSatisfaction: 87
    },
    monthlyBudget: 20833,
    annualBudget: 250000,
    expenses: [
      { id: '1', category: 'Salaries', amount: 12000, date: '2023-12-01', description: 'Monthly salary payments' },
      { id: '2', category: 'Equipment', amount: 6000, date: '2023-12-06', description: 'Operational equipment and tools' },
      { id: '3', category: 'Maintenance', amount: 2833, date: '2023-12-16', description: 'Facility maintenance costs' }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return { backgroundColor: '#10b981', color: '#ffffff' };
    case 'inactive': return { backgroundColor: '#f3f4f6', color: '#374151' };
    default: return { backgroundColor: '#f3f4f6', color: '#374151' };
  }
};

const DepartmentsTab: React.FC<DepartmentsTabProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  branchFilter, 
  setBranchFilter, 
  branches,
  onAddNew,
  onRefresh,
  refreshTrigger
}) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [departmentModalTab, setDepartmentModalTab] = useState('overview');

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const data = await DepartmentService.fetchDepartments();
        setDepartments(data);
      } catch (err) {
        setError('Failed to fetch departments');
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [refreshTrigger]); // Use refreshTrigger as dependency

  // Refresh departments data
  const refreshDepartments = async () => {
    try {
      setLoading(true);
      const data = await DepartmentService.fetchDepartments();
      setDepartments(data);
      // Also refresh parent data
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      setError('Failed to fetch departments');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.manager.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBranch = branchFilter === 'all' || dept.branch === branchFilter;
    
    return matchesSearch && matchesBranch;
  });

  const handleViewDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowDepartmentModal(true);
    setDepartmentModalTab('overview');
  };

  const departmentModalTabs = [
    { id: 'overview', label: 'Overview', icon: <Briefcase size={16} /> },
    { id: 'payroll', label: 'Payroll', icon: <Users size={16} /> },
    { id: 'staff', label: 'Staff', icon: <UserCheck size={16} /> },
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
          Add New Department
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading departments...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#ef4444',
          backgroundColor: '#fef2f2',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          {error}
          <button 
            onClick={refreshDepartments}
            style={{
              marginLeft: '16px',
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

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
            placeholder="Search departments..."
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

      {/* Departments Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '24px'
      }}>
        {filteredDepartments.map((dept) => (
          <div key={dept.id} style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
          onClick={() => handleViewDepartment(dept)}
          >
            {/* Header with Department Name and Status */}
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
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {dept.name}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#6b7280" />
                    {dept.branch}
                  </div>
                </div>
              </div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                ...getStatusColor(dept.status)
              }}>
                {dept.status.charAt(0).toUpperCase() + dept.status.slice(1)}
              </span>
            </div>

            {/* Department Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  +1 (555) 123-4567
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {dept.name.toLowerCase().replace(/\s+/g, '')}@arisportal.com
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {dept.manager}
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
                  {dept.employees} employees
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
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit
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
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle delete
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

      {/* Department Detail Modal */}
      {showDepartmentModal && selectedDepartment && (
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
                  <Briefcase size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {selectedDepartment.name}
                  </h2>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                    {selectedDepartment.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDepartmentModal(false)}
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
              {departmentModalTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDepartmentModalTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px',
                    border: 'none',
                    backgroundColor: departmentModalTab === tab.id ? '#f9fafb' : 'transparent',
                    color: departmentModalTab === tab.id ? 'var(--mc-sidebar-bg)' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    borderBottom: departmentModalTab === tab.id ? '2px solid var(--mc-sidebar-bg)' : '2px solid transparent',
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
              {departmentModalTab === 'overview' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                    Department Overview
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
                    <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                        Basic Information
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>Manager: {selectedDepartment.manager}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>Branch: {selectedDepartment.branch}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>Employees: {selectedDepartment.employees}</span>
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
                          <span style={{ fontSize: '14px', color: '#374151' }}>{selectedDepartment.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>{selectedDepartment.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <DollarSign size={16} color="#6b7280" />
                          <span style={{ fontSize: '14px', color: '#374151' }}>Budget: ${selectedDepartment.budget.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                      Department Objectives
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {selectedDepartment.objectives.map((objective, index) => (
                        <li key={index} style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {departmentModalTab === 'team' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                    Team Members
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {selectedDepartment.teamMembers.map((member) => (
                      <div key={member.id} style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '20px',
                        padding: '16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
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
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                              {member.name}
                            </div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                              {member.role}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={14} color="#6b7280" />
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                              Joined: {member.joinDate}
                            </span>
                          </div>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500',
                            ...getStatusColor(member.status)
                          }}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {departmentModalTab === 'staff' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                    Department Staff
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
                    {selectedDepartment.teamMembers.map((member) => (
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

              {departmentModalTab === 'payroll' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                    Payroll Information
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <Users size={20} color="var(--mc-sidebar-bg)" />
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          Total Employees
                        </h4>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--mc-sidebar-bg)', marginBottom: '8px' }}>
                        {selectedDepartment.employees}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Active employees in department
                      </div>
                    </div>

                    <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <DollarSign size={20} color="#10b981" />
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          Monthly Payroll
                        </h4>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
                        ${selectedDepartment.monthlyBudget.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Total monthly salary costs
                      </div>
                    </div>

                    <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <DollarSign size={20} color="#f59e0b" />
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          Average Salary
                        </h4>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>
                        ${Math.round(selectedDepartment.monthlyBudget / selectedDepartment.employees).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Average monthly salary per employee
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {departmentModalTab === 'attendance' && (
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
                        {Math.round(selectedDepartment.employees * 0.80)}
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
                        {Math.round(selectedDepartment.employees * 0.15)}
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
                        {Math.round(selectedDepartment.employees * 0.05)}
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

export default DepartmentsTab;