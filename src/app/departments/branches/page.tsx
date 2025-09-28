'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  X,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';

// Mock data types
interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  manager_id?: string;
  manager_name?: string;
  established_date?: string;
  status: 'active' | 'inactive';
  department_count: number;
  employee_count: number;
  createdAt: string;
  updatedAt: string;
}

interface BranchStats {
  totalBranches: number;
  activeBranches: number;
  totalEmployees: number;
  totalDepartments: number;
  branchesByStatus: {
    active: number;
    inactive: number;
  };
  branchesByCountry: Array<{
    country: string;
    count: number;
  }>;
}

interface NewBranchForm {
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  manager_id?: string;
  established_date?: string;
  status: 'active' | 'inactive';
}

export default function BranchesPage() {
  // Mock data
  const mockBranches: Branch[] = [
    {
      id: '1',
      name: 'Main Office',
      code: 'MAIN',
      address: '123 Business Street',
      city: 'Dar es Salaam',
      country: 'Tanzania',
      phone: '+255 22 123 4567',
      email: 'main@meritportal.com',
      manager_id: 'EMP001',
      manager_name: 'Sarah Johnson',
      established_date: '2020-01-15',
      status: 'active',
      department_count: 3,
      employee_count: 45,
      createdAt: '2020-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Tech Center',
      code: 'TECH',
      address: '456 Innovation Avenue',
      city: 'Arusha',
      country: 'Tanzania',
      phone: '+255 27 234 5678',
      email: 'tech@meritportal.com',
      manager_id: 'EMP002',
      manager_name: 'Michael Chen',
      established_date: '2021-03-20',
      status: 'active',
      department_count: 2,
      employee_count: 28,
      createdAt: '2021-03-20T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '3',
      name: 'Sales Office',
      code: 'SALES',
      address: '789 Commerce Road',
      city: 'Mwanza',
      country: 'Tanzania',
      phone: '+255 28 345 6789',
      email: 'sales@meritportal.com',
      manager_id: 'EMP004',
      manager_name: 'Lisa Rodriguez',
      established_date: '2022-06-10',
      status: 'active',
      department_count: 1,
      employee_count: 15,
      createdAt: '2022-06-10T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '4',
      name: 'Regional Office',
      code: 'REG',
      address: '321 Regional Plaza',
      city: 'Dodoma',
      country: 'Tanzania',
      phone: '+255 26 456 7890',
      email: 'regional@meritportal.com',
      manager_id: 'EMP006',
      manager_name: 'James Mwalimu',
      established_date: '2023-01-05',
      status: 'inactive',
      department_count: 0,
      employee_count: 0,
      createdAt: '2023-01-05T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ];

  // State
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [stats, setStats] = useState<BranchStats | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [newBranchForm, setNewBranchForm] = useState<NewBranchForm>({
    name: '',
    code: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    manager_id: '',
    established_date: '',
    status: 'active'
  });

  // Calculate stats
  useEffect(() => {
    const totalBranches = branches.length;
    const activeBranches = branches.filter(branch => branch.status === 'active').length;
    const totalEmployees = branches.reduce((sum, branch) => sum + branch.employee_count, 0);
    const totalDepartments = branches.reduce((sum, branch) => sum + branch.department_count, 0);
    
    const branchesByStatus = {
      active: branches.filter(branch => branch.status === 'active').length,
      inactive: branches.filter(branch => branch.status === 'inactive').length
    };

    const branchesByCountry = branches.reduce((acc, branch) => {
      const country = branch.country;
      const existing = acc.find(item => item.country === country);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ country, count: 1 });
      }
      return acc;
    }, [] as Array<{ country: string; count: number }>);

    setStats({
      totalBranches,
      activeBranches,
      totalEmployees,
      totalDepartments,
      branchesByStatus,
      branchesByCountry
    });
  }, [branches]);

  // Filter branches
  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddBranch = async () => {
    setFormLoading(true);
    try {
      const newBranch: Branch = {
        id: Date.now().toString(),
        name: newBranchForm.name,
        code: newBranchForm.code,
        address: newBranchForm.address,
        city: newBranchForm.city,
        country: newBranchForm.country,
        phone: newBranchForm.phone,
        email: newBranchForm.email,
        manager_id: newBranchForm.manager_id,
        manager_name: 'New Manager', // This would come from employee lookup
        established_date: newBranchForm.established_date,
        status: newBranchForm.status,
        department_count: 0,
        employee_count: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setBranches(prev => [...prev, newBranch]);
      setNewBranchForm({
        name: '',
        code: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        email: '',
        manager_id: '',
        established_date: '',
        status: 'active'
      });
      setShowAddBranch(false);
    } catch (error) {
      console.error('Error adding branch:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      setBranches(prev => prev.filter(branch => branch.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'inactive': return <Clock size={16} />;
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
              Branch Management
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage organizational branches, locations, and regional offices
            </p>
          </div>
          <button
            onClick={() => setShowAddBranch(true)}
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
            Add Branch
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Building size={20} color="#0f172a" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Branches</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.totalBranches}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <CheckCircle size={20} color="#10b981" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Active Branches</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.activeBranches}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Users size={20} color="#8b5cf6" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Employees</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.totalEmployees}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Building size={20} color="#f59e0b" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Departments</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.totalDepartments}
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
            placeholder="Search branches..."
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
          </select>
        </div>
      </div>

      {/* Branches Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {filteredBranches.map((branch) => (
          <div 
            key={branch.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
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
                  {branch.name}
                </h3>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                  {branch.code}
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                color: getStatusColor(branch.status),
                fontSize: '12px',
                fontWeight: '500',
                padding: '4px 8px',
                backgroundColor: `${getStatusColor(branch.status)}15`,
                borderRadius: '6px'
              }}>
                {getStatusIcon(branch.status)}
                {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
              </div>
            </div>

            {/* Location */}
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

            {/* Contact Info */}
            {(branch.phone || branch.email) && (
              <div style={{ marginBottom: '16px' }}>
                {branch.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Phone size={14} color="#6b7280" />
                    <span style={{ fontSize: '13px', color: '#374151' }}>
                      {branch.phone}
                    </span>
                  </div>
                )}
                {branch.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} color="#6b7280" />
                    <span style={{ fontSize: '13px', color: '#374151' }}>
                      {branch.email}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {branch.department_count} departments
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {branch.employee_count} employees
                </span>
              </div>
            </div>

            {/* Manager */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Users size={16} color="#6b7280" />
              <span style={{ fontSize: '14px', color: '#374151' }}>
                Manager: {branch.manager_name || 'No manager'}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                {branch.established_date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    Established: {new Date(branch.established_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSelectedBranch(branch)}
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
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
                    borderRadius: '4px',
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
                  onClick={() => handleDeleteBranch(branch.id)}
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
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

      {/* Add Branch Modal */}
      {showAddBranch && (
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
            borderRadius: '12px',
            padding: '32px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Add New Branch
              </h2>
              <button
                onClick={() => setShowAddBranch(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
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
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    value={newBranchForm.name}
                    onChange={(e) => setNewBranchForm(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Branch Code *
                  </label>
                  <input
                    type="text"
                    value={newBranchForm.code}
                    onChange={(e) => setNewBranchForm(prev => ({ ...prev, code: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Address *
                </label>
                <input
                  type="text"
                  value={newBranchForm.address}
                  onChange={(e) => setNewBranchForm(prev => ({ ...prev, address: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    value={newBranchForm.city}
                    onChange={(e) => setNewBranchForm(prev => ({ ...prev, city: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Country *
                  </label>
                  <input
                    type="text"
                    value={newBranchForm.country}
                    onChange={(e) => setNewBranchForm(prev => ({ ...prev, country: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newBranchForm.phone}
                    onChange={(e) => setNewBranchForm(prev => ({ ...prev, phone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={newBranchForm.email}
                    onChange={(e) => setNewBranchForm(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Status *
                  </label>
                  <select
                    value={newBranchForm.status}
                    onChange={(e) => setNewBranchForm(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Established Date
                  </label>
                  <input
                    type="date"
                    value={newBranchForm.established_date}
                    onChange={(e) => setNewBranchForm(prev => ({ ...prev, established_date: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setShowAddBranch(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddBranch}
                disabled={formLoading || !newBranchForm.name || !newBranchForm.code || !newBranchForm.address || !newBranchForm.city || !newBranchForm.country}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#0f172a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                  opacity: formLoading ? 0.6 : 1
                }}
              >
                {formLoading ? 'Adding...' : 'Add Branch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
