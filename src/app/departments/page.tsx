'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  Plus, 
  Search, 
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  DollarSign,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Shield,
  Truck,
  FileText,
  Settings,
  Phone,
  Mail,
  X
} from 'lucide-react';

// Mock data types
interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  budget: number;
  status: 'active' | 'inactive' | 'restructuring';
  branch_id?: string;
  branch_name?: string;
  location?: string;
  manager_id?: string;
  manager_name?: string;
  established_date?: string;
  employee_count: number;
  createdAt: string;
  updatedAt: string;
}

interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
  totalEmployees: number;
  averageBudget: number;
  departmentsByStatus: {
    active: number;
    inactive: number;
    restructuring: number;
  };
  departmentsByBranch: Array<{
    branch: string;
    count: number;
  }>;
  budgetDistribution: Array<{
    department: string;
    budget: number;
  }>;
}

interface NewDepartmentForm {
  name: string;
  code: string;
  description: string;
  budget: number;
  status: 'active' | 'inactive' | 'restructuring';
  branch_id?: string;
  location?: string;
  manager_id?: string;
  established_date?: string;
}

export default function DepartmentsPage() {
  // Mock data
  const mockDepartments: Department[] = [
    {
      id: '1',
      name: 'Human Resources',
      code: 'HR',
      description: 'Manages employee relations, recruitment, and organizational development',
      budget: 250000,
      status: 'active',
      branch_id: '1',
      branch_name: 'Main Office',
      location: 'Main Office',
      manager_id: 'EMP001',
      manager_name: 'Sarah Johnson',
      established_date: '2020-01-15',
      employee_count: 12,
      createdAt: '2020-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Information Technology',
      code: 'IT',
      description: 'Handles technology infrastructure, software development, and technical support',
      budget: 500000,
      status: 'active',
      branch_id: '2',
      branch_name: 'Tech Center',
      location: 'Tech Center',
      manager_id: 'EMP002',
      manager_name: 'Michael Chen',
      established_date: '2019-06-01',
      employee_count: 25,
      createdAt: '2019-06-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '3',
      name: 'Finance & Accounting',
      code: 'FIN',
      description: 'Manages financial planning, accounting, and budget oversight',
      budget: 300000,
      status: 'active',
      branch_id: '1',
      branch_name: 'Main Office',
      location: 'Main Office',
      manager_id: 'EMP003',
      manager_name: 'David Wilson',
      established_date: '2018-03-10',
      employee_count: 8,
      createdAt: '2018-03-10T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '4',
      name: 'Marketing & Sales',
      code: 'MKT',
      description: 'Drives business growth through marketing campaigns and sales strategies',
      budget: 400000,
      status: 'active',
      branch_id: '3',
      branch_name: 'Sales Office',
      location: 'Sales Office',
      manager_id: 'EMP004',
      manager_name: 'Lisa Rodriguez',
      established_date: '2021-02-20',
      employee_count: 15,
      createdAt: '2021-02-20T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '5',
      name: 'Operations',
      code: 'OPS',
      description: 'Oversees daily operations, logistics, and process optimization',
      budget: 350000,
      status: 'restructuring',
      branch_id: '1',
      branch_name: 'Main Office',
      location: 'Warehouse',
      manager_id: 'EMP005',
      manager_name: 'Robert Brown',
      established_date: '2017-09-05',
      employee_count: 20,
      createdAt: '2017-09-05T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ];

  // State
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [newDepartmentForm, setNewDepartmentForm] = useState<NewDepartmentForm>({
    name: '',
    code: '',
    description: '',
    budget: 0,
    status: 'active',
    branch_id: '',
    location: '',
    manager_id: '',
    established_date: ''
  });

  // Calculate stats
  useEffect(() => {
    const totalDepartments = departments.length;
    const activeDepartments = departments.filter(dept => dept.status === 'active').length;
    const totalEmployees = departments.reduce((sum, dept) => sum + dept.employee_count, 0);
    const averageBudget = departments.length > 0 ? departments.reduce((sum, dept) => sum + dept.budget, 0) / departments.length : 0;
    
    const departmentsByStatus = {
      active: departments.filter(dept => dept.status === 'active').length,
      inactive: departments.filter(dept => dept.status === 'inactive').length,
      restructuring: departments.filter(dept => dept.status === 'restructuring').length
    };

    const departmentsByBranch = departments.reduce((acc, dept) => {
      const branch = dept.location || 'Unknown';
      const existing = acc.find(item => item.branch === branch);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ branch, count: 1 });
      }
      return acc;
    }, [] as Array<{ branch: string; count: number }>);

    const budgetDistribution = departments.map(dept => ({
      department: dept.name,
      budget: dept.budget
    }));

    setStats({
      totalDepartments,
      activeDepartments,
      totalEmployees,
      averageBudget,
      departmentsByStatus,
      departmentsByBranch,
      budgetDistribution
    });
  }, [departments]);

  // Filter departments
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddDepartment = async () => {
    setFormLoading(true);
    try {
      const newDepartment: Department = {
        id: Date.now().toString(),
        name: newDepartmentForm.name,
        code: newDepartmentForm.code,
        description: newDepartmentForm.description,
        budget: newDepartmentForm.budget,
        status: newDepartmentForm.status,
        branch_id: newDepartmentForm.branch_id,
        branch_name: 'Selected Branch', // This would come from branch lookup
        location: newDepartmentForm.location,
        manager_id: newDepartmentForm.manager_id,
        manager_name: 'New Manager', // This would come from employee lookup
        established_date: newDepartmentForm.established_date,
        employee_count: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setDepartments(prev => [...prev, newDepartment]);
      setNewDepartmentForm({
        name: '',
        code: '',
        description: '',
        budget: 0,
        status: 'active',
        branch_id: '',
        location: '',
        manager_id: '',
        established_date: ''
      });
      setShowAddDepartment(false);
    } catch (error) {
      console.error('Error adding department:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(prev => prev.filter(dept => dept.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'restructuring': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'inactive': return <Clock size={16} />;
      case 'restructuring': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Department Management
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage organizational departments, budgets, and team structures
            </p>
          </div>
          <button
            onClick={() => setShowAddDepartment(true)}
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
            Add Department
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Building size={20} color="var(--mc-sidebar-bg)" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Departments</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.totalDepartments}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <CheckCircle size={20} color="#10b981" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Active Departments</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.activeDepartments}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Users size={20} color="#8b5cf6" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Employees</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.totalEmployees}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <DollarSign size={20} color="#f59e0b" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Avg Budget</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                ${stats.averageBudget.toLocaleString()}
              </div>
            </div>
          </div>
        )}
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
            placeholder="Search departments..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              background: 'white',
              width: '180px'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="restructuring">Restructuring</option>
          </select>
        </div>
      </div>

      {/* Departments Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {filteredDepartments.map((department) => (
          <div 
            key={department.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                  {department.name}
                </h3>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                  {department.code}
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                color: getStatusColor(department.status),
                fontSize: '12px',
                fontWeight: '500',
                padding: '4px 8px',
                backgroundColor: `${getStatusColor(department.status)}15`,
                borderRadius: '20px'
              }}>
                {getStatusIcon(department.status)}
                {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0', lineHeight: '1.5' }}>
              {department.description}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {department.employee_count} employees
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  ${department.budget.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Branch and Manager */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {department.branch_name || 'No branch'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {department.manager_name || 'No manager'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                Established: {department.established_date ? new Date(department.established_date).toLocaleDateString() : 'N/A'}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSelectedDepartment(department)}
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '20px',
                    color: '#6b7280'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <Eye size={16} />
                </button>
                <button
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '20px',
                    color: '#6b7280'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteDepartment(department.id)}
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '20px',
                    color: '#6b7280'
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
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {showAddDepartment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: 'min(600px, 90vw)',
            maxHeight: '90vh',
            borderRadius: '20px',
            padding: '32px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Add New Department
              </h2>
              <button
                onClick={() => setShowAddDepartment(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  color: '#6b7280'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Department Name *
                  </label>
                  <input
                    type="text"
                    value={newDepartmentForm.name}
                    onChange={(e) => setNewDepartmentForm(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Department Code *
                  </label>
                  <input
                    type="text"
                    value={newDepartmentForm.code}
                    onChange={(e) => setNewDepartmentForm(prev => ({ ...prev, code: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Description *
                </label>
                <textarea
                  value={newDepartmentForm.description}
                  onChange={(e) => setNewDepartmentForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Status *
                  </label>
                  <select
                    value={newDepartmentForm.status}
                    onChange={(e) => setNewDepartmentForm(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'restructuring' }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="restructuring">Restructuring</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Budget *
                  </label>
                  <input
                    type="number"
                    value={newDepartmentForm.budget}
                    onChange={(e) => setNewDepartmentForm(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={newDepartmentForm.location}
                    onChange={(e) => setNewDepartmentForm(prev => ({ ...prev, location: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Established Date
                  </label>
                  <input
                    type="date"
                    value={newDepartmentForm.established_date}
                    onChange={(e) => setNewDepartmentForm(prev => ({ ...prev, established_date: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setShowAddDepartment(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                disabled={formLoading || !newDepartmentForm.name || !newDepartmentForm.code || !newDepartmentForm.description}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                  opacity: formLoading ? 0.6 : 1
                }}
              >
                {formLoading ? 'Adding...' : 'Add Department'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
