'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Building,
  TrendingUp,
  DollarSign,
  Users,
  UserCheck,
  Receipt,
  Briefcase,
  Shield
} from 'lucide-react';
import { 
  BranchesTab, 
  DepartmentsTab, 
  RolesTab, 
  StaffTab, 
  PayrollTab,
  AddNewModal
} from './components';
import { BranchService, DepartmentService, RoleService, StaffService } from './services/payrollService';

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'branches' | 'departments' | 'roles' | 'staff' | 'payroll'>('branches');
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<'branch' | 'department' | 'role' | 'staff'>('branch');
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [showProcessPayrollModal, setShowProcessPayrollModal] = useState(false);

  // State for real data
  const [branches, setBranches] = useState<Array<{ id: string; name: string }>>([]);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([]);
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch data from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [branchesData, departmentsData, rolesData] = await Promise.all([
          BranchService.fetchBranches(),
          DepartmentService.fetchDepartments(),
          RoleService.fetchRoles()
        ]);
        
        setBranches(branchesData.map(b => ({ id: b.id.toString(), name: b.name })));
        setDepartments(departmentsData.map(d => ({ id: d.id.toString(), name: d.name })));
        setRoles(rolesData.map(r => ({ id: r.id.toString(), name: r.name })));
      } catch (error) {
        console.error('Error fetching payroll data:', error);
        // Fallback to empty arrays
        setBranches([]);
        setDepartments([]);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refresh function for child components
  const refreshData = async () => {
    try {
      setLoading(true);
      const [branchesData, departmentsData, rolesData] = await Promise.all([
        BranchService.fetchBranches(),
        DepartmentService.fetchDepartments(),
        RoleService.fetchRoles()
      ]);
      
      setBranches(branchesData.map(b => ({ id: b.id.toString(), name: b.name })));
      setDepartments(departmentsData.map(d => ({ id: d.id.toString(), name: d.name })));
      setRoles(rolesData.map(r => ({ id: r.id.toString(), name: r.name })));
      
      // Trigger refresh for child components
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error refreshing payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'branches':
        return (
          <BranchesTab 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            onAddNew={() => { setShowAddModal(true); setAddModalType('branch'); }}
            onRefresh={refreshData}
            refreshTrigger={refreshTrigger}
          />
        );

      case 'departments':
        return (
          <DepartmentsTab 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            branches={branches}
            onAddNew={() => { setShowAddModal(true); setAddModalType('department'); }}
            onRefresh={refreshData}
            refreshTrigger={refreshTrigger}
          />
        );

      case 'roles':
        return (
          <RolesTab 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            branches={branches}
            departments={departments}
            onAddNew={() => { setShowAddModal(true); setAddModalType('role'); }}
            onRefresh={refreshData}
            refreshTrigger={refreshTrigger}
          />
        );

      case 'staff':
        return (
          <StaffTab 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            branches={branches}
            onAddNew={() => { setShowAddModal(true); setAddModalType('staff'); }}
            onEditStaff={(staff) => { 
              setEditingStaff(staff);
              setShowAddModal(true); 
              setAddModalType('staff'); 
            }}
          />
        );

      case 'payroll':
        return (
          <PayrollTab 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            branches={branches}
          />
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
            onClick={() => setShowProcessPayrollModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <DollarSign size={16} />
            Process Payroll
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
              {loading ? '...' : branches.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Briefcase size={20} color="#10b981" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Departments</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {loading ? '...' : departments.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Users size={20} color="#f59e0b" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Staff</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {loading ? '...' : '0'}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <DollarSign size={20} color="#8b5cf6" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Monthly Payroll</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {loading ? '...' : '$0'}
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
      </div>

      {/* Content */}
      {renderTabContent()}

      {/* Add New Modal */}
      <AddNewModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingStaff(null);
        }}
        modalType={addModalType}
        branches={branches}
        departments={departments}
        roles={roles}
        editingStaff={editingStaff}
        loading={loading}
        onAddBranch={async (branchData) => {
          console.log('AddNewModal branches prop:', branches);
          console.log('AddNewModal departments prop:', departments);
          console.log('AddNewModal roles prop:', roles);
          try {
            console.log('Creating new branch:', branchData);
            const result = await BranchService.createBranch(branchData);
            console.log('Branch created successfully:', result);
            setShowAddModal(false);
            // Refresh the data to show the new branch
            refreshData();
          } catch (error) {
            console.error('Error creating branch:', error);
            alert('Failed to create branch: ' + error.message);
            // Keep modal open on error
          }
        }}
        onAddDepartment={async (departmentData) => {
          try {
            console.log('Creating new department:', departmentData);
            const result = await DepartmentService.createDepartment(departmentData);
            console.log('Department created successfully:', result);
            setShowAddModal(false);
            // Refresh the data to show the new department
            refreshData();
          } catch (error: any) {
            console.error('Error creating department:', error);
            alert('Failed to create department: ' + error.message);
            // Keep modal open on error
          }
        }}
        onAddRole={async (roleData) => {
          try {
            console.log('Creating new role:', roleData);
            const result = await RoleService.createRole(roleData);
            console.log('Role created successfully:', result);
            setShowAddModal(false);
            // Refresh the data to show the new role
            refreshData();
          } catch (error: any) {
            console.error('Error creating role:', error);
            alert('Failed to create role: ' + error.message);
            // Keep modal open on error
          }
        }}
        onAddStaff={async (staffData) => {
          try {
            console.log('Creating new staff:', staffData);
            const result = await StaffService.createStaff(staffData);
            console.log('Staff created successfully:', result);
            setShowAddModal(false);
            setEditingStaff(null);
            // Refresh the data to show the new staff
            refreshData();
          } catch (error: any) {
            console.error('Error creating staff:', error);
            // Re-throw the error so the form can display it
            throw error;
          }
        }}
      />

      {/* Process Payroll Modal */}
      {showProcessPayrollModal && (
        <ProcessPayrollModal
          isOpen={showProcessPayrollModal}
          onClose={() => setShowProcessPayrollModal(false)}
          branches={branches}
        />
      )}
    </div>
  );
}

// Process Payroll Modal Component
interface ProcessPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: Array<{ id: string; name: string }>;
}

const ProcessPayrollModal: React.FC<ProcessPayrollModalProps> = ({ isOpen, onClose, branches }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentYear = new Date().getFullYear();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleProcessPayroll = async () => {
    if (!selectedMonth) return;
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      // Mock payroll data
      setPayrollData([
        {
          id: '1',
          name: 'John Doe',
          basicSalary: 500000,
          allowances: 50000,
          grossSalary: 550000,
          payeTax: 55000,
          sdlTax: 27500,
          nssf: 22000,
          nhif: 16500,
          deductions: 121000,
          netSalary: 429000
        },
        {
          id: '2',
          name: 'Jane Smith',
          basicSalary: 450000,
          allowances: 40000,
          grossSalary: 490000,
          payeTax: 49000,
          sdlTax: 24500,
          nssf: 19600,
          nhif: 14700,
          deductions: 107800,
          netSalary: 382200
        }
      ]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleMakePayment = () => {
    // Process payment logic here
    alert('Payment processing initiated for all employees!');
    onClose();
  };

  if (!isOpen) return null;

  return (
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
        padding: '24px',
        maxWidth: '1200px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Process Payroll
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ✕
          </button>
        </div>

        {/* Month and Branch Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Select Month *
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select month</option>
              {months.map((month, index) => (
                <option key={index} value={`${currentYear}-${String(index + 1).padStart(2, '0')}`}>
                  {month} {currentYear}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Select Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Process Button */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleProcessPayroll}
            disabled={!selectedMonth || isProcessing}
            style={{
              padding: '12px 24px',
              backgroundColor: selectedMonth && !isProcessing ? '#10b981' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: selectedMonth && !isProcessing ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <DollarSign size={16} />
            {isProcessing ? 'Processing...' : 'Process Payroll'}
          </button>
        </div>

        {/* Payroll Results */}
        {payrollData.length > 0 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
              Payroll Summary for {months[parseInt(selectedMonth.split('-')[1]) - 1]} {selectedMonth.split('-')[0]}
            </h3>
            
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                  {payrollData.length}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Employees</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                  {payrollData.reduce((sum, emp) => sum + emp.grossSalary, 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Gross Salary</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
                  {payrollData.reduce((sum, emp) => sum + emp.deductions, 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Deductions</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>
                  {payrollData.reduce((sum, emp) => sum + emp.netSalary, 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Net Salary</div>
              </div>
            </div>

            {/* Payroll Table */}
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Employee</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Basic Salary</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Allowances</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Gross Salary</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Deductions</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Net Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollData.map((employee) => (
                      <tr key={employee.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#1f2937' }}>{employee.name}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#1f2937' }}>
                          {employee.basicSalary.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#10b981' }}>
                          {employee.allowances.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                          {employee.grossSalary.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#dc2626' }}>
                          {employee.deductions.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#2563eb', fontWeight: '600' }}>
                          {employee.netSalary.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Make Payment Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={onClose}
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
                onClick={handleMakePayment}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <DollarSign size={16} />
                Make Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};