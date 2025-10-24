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
import { BranchService, DepartmentService, RoleService, StaffService, PayrollService } from './services/payrollService';

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'branches' | 'departments' | 'roles' | 'staff' | 'payroll'>('branches');
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<'branch' | 'department' | 'role' | 'staff'>('branch');
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [showProcessPayrollModal, setShowProcessPayrollModal] = useState(false);

  // State for real data
  const [branches, setBranches] = useState<Array<{ id: string; name: string }>>([]);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([]);
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch data from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [branchesData, departmentsData, rolesData, staffData] = await Promise.all([
          BranchService.fetchBranches(),
          DepartmentService.fetchDepartments(),
          RoleService.fetchRoles(),
          StaffService.fetchStaff()
        ]);
        
        setBranches(branchesData.map(b => ({ id: b.id.toString(), name: b.name })));
        setDepartments(departmentsData.map(d => ({ id: d.id.toString(), name: d.name })));
        setRoles(rolesData.map(r => ({ id: r.id.toString(), name: r.name })));
        setStaff(staffData);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
        // Fallback to empty arrays
        setBranches([]);
        setDepartments([]);
        setRoles([]);
        setStaff([]);
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
            onRefresh={refreshData}
            refreshTrigger={refreshTrigger}
          />
        );

      case 'payroll':
        return (
          <PayrollTab 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            monthFilter={monthFilter}
            setMonthFilter={setMonthFilter}
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
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minWidth: '200px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Building size={20} color="var(--mc-sidebar-bg)" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Branches</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {loading ? '...' : branches.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minWidth: '200px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Briefcase size={20} color="#10b981" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Departments</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {loading ? '...' : departments.length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minWidth: '200px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Users size={20} color="#f59e0b" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Staff</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {loading ? '...' : staff.filter(s => s.employment_status === 'active').length}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minWidth: '200px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <DollarSign size={20} color="#8b5cf6" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Monthly Payroll</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {loading ? '...' : `$${staff.filter(s => s.employment_status === 'active').reduce((sum, s) => sum + (s.total_package || 0), 0).toLocaleString()}`}
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minWidth: '200px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Receipt size={20} color="#C50F11" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Tax</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {loading ? '...' : `$${(() => {
                const activeStaff = staff.filter(s => s.employment_status === 'active');
                let totalPAYE = 0;
                let totalSDL = 0;
                
                activeStaff.forEach(staffMember => {
                  // Calculate PAYE tax if eligible
                  if (staffMember.paye_eligible && staffMember.basic_salary) {
                    const basicSalary = staffMember.basic_salary;
                    let allowancesTotal = 0;
                    
                    // Calculate total allowances from actual data
                    try {
                      const allowancesDetail = JSON.parse(staffMember.allowances_detail || '[]');
                      if (Array.isArray(allowancesDetail)) {
                        allowancesDetail.forEach((item: any) => {
                          if (item.amount) allowancesTotal += parseFloat(item.amount);
                        });
                      }
                    } catch (e) {
                      // Use numeric allowances if JSON parsing fails
                      allowancesTotal = staffMember.allowances || 0;
                    }
                    
                    const grossTaxableIncome = basicSalary + allowancesTotal;
                    
                    // Progressive PAYE calculation
                    let payeTax = 0;
                    if (grossTaxableIncome > 270000) {
                      payeTax += (grossTaxableIncome - 270000) * 0.30;
                      if (grossTaxableIncome > 100000) {
                        payeTax += (Math.min(grossTaxableIncome, 270000) - 100000) * 0.20;
                        if (grossTaxableIncome > 50000) {
                          payeTax += (Math.min(grossTaxableIncome, 100000) - 50000) * 0.15;
                          payeTax += (Math.min(grossTaxableIncome, 50000)) * 0.10;
                        } else {
                          payeTax += grossTaxableIncome * 0.10;
                        }
                      } else if (grossTaxableIncome > 50000) {
                        payeTax += (grossTaxableIncome - 50000) * 0.15;
                        payeTax += 50000 * 0.10;
                      } else {
                        payeTax += grossTaxableIncome * 0.10;
                      }
                    } else if (grossTaxableIncome > 100000) {
                      payeTax += (grossTaxableIncome - 100000) * 0.20;
                      if (grossTaxableIncome > 50000) {
                        payeTax += (grossTaxableIncome - 50000) * 0.15;
                        payeTax += 50000 * 0.10;
                      } else {
                        payeTax += grossTaxableIncome * 0.10;
                      }
                    } else if (grossTaxableIncome > 50000) {
                      payeTax += (grossTaxableIncome - 50000) * 0.15;
                      payeTax += 50000 * 0.10;
                    } else {
                      payeTax += grossTaxableIncome * 0.10;
                    }
                    
                    totalPAYE += payeTax;
                  }
                  
                  // Calculate total gross for SDL calculation
                  if (staffMember.total_package) {
                    totalSDL += staffMember.total_package;
                  }
                });
                
                // SDL only applies if company has at least 10 employees
                const sdlAmount = activeStaff.length >= 10 ? (totalSDL * 0.035) : 0;
                
                return (totalPAYE + sdlAmount).toLocaleString();
              })()}`}
            </div>
          </div>

          {/* SDL Card */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minWidth: '200px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Receipt size={20} color="#059669" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>SDL</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {loading ? '...' : `$${(() => {
                const activeStaff = staff.filter(s => s.employment_status === 'active');
                const totalGross = activeStaff.reduce((sum, s) => sum + (s.total_package || 0), 0);
                const sdlAmount = activeStaff.length >= 10 ? (totalGross * 0.035) : 0;
                return sdlAmount.toLocaleString();
              })()}`}
            </div>
          </div>

          {/* PAYE Card */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minWidth: '200px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Receipt size={20} color="#dc2626" />
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>PAYE</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {loading ? '...' : `$${(() => {
                const activeStaff = staff.filter(s => s.employment_status === 'active');
                let totalPAYE = 0;
                
                activeStaff.forEach(staffMember => {
                  if (staffMember.paye_eligible && staffMember.basic_salary) {
                    const basicSalary = staffMember.basic_salary;
                    let allowancesTotal = 0;
                    
                    try {
                      const allowancesDetail = JSON.parse(staffMember.allowances_detail || '[]');
                      if (Array.isArray(allowancesDetail)) {
                        allowancesDetail.forEach((item: any) => {
                          if (item.amount) allowancesTotal += parseFloat(item.amount);
                        });
                      }
                    } catch (e) {
                      allowancesTotal = staffMember.allowances || 0;
                    }
                    
                    const grossTaxableIncome = basicSalary + allowancesTotal;
                    
                    // Progressive PAYE calculation
                    let payeTax = 0;
                    if (grossTaxableIncome > 270000) {
                      payeTax += (grossTaxableIncome - 270000) * 0.30;
                      if (grossTaxableIncome > 100000) {
                        payeTax += (Math.min(grossTaxableIncome, 270000) - 100000) * 0.20;
                        if (grossTaxableIncome > 50000) {
                          payeTax += (Math.min(grossTaxableIncome, 100000) - 50000) * 0.15;
                          payeTax += (Math.min(grossTaxableIncome, 50000)) * 0.10;
                        } else {
                          payeTax += grossTaxableIncome * 0.10;
                        }
                      } else if (grossTaxableIncome > 50000) {
                        payeTax += (grossTaxableIncome - 50000) * 0.15;
                        payeTax += 50000 * 0.10;
                      } else {
                        payeTax += grossTaxableIncome * 0.10;
                      }
                    } else if (grossTaxableIncome > 100000) {
                      payeTax += (grossTaxableIncome - 100000) * 0.20;
                      if (grossTaxableIncome > 50000) {
                        payeTax += (grossTaxableIncome - 50000) * 0.15;
                        payeTax += 50000 * 0.10;
                      } else {
                        payeTax += grossTaxableIncome * 0.10;
                      }
                    } else if (grossTaxableIncome > 50000) {
                      payeTax += (grossTaxableIncome - 50000) * 0.15;
                      payeTax += 50000 * 0.10;
                    } else {
                      payeTax += grossTaxableIncome * 0.10;
                    }
                    
                    totalPAYE += payeTax;
                  }
                });
                
                return totalPAYE.toLocaleString();
              })()}`}
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
          } catch (error: any) {
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
            // The form now handles both create and update internally
            // This callback is just for closing the modal and refreshing data
            console.log('Staff operation completed, closing modal');
            setShowAddModal(false);
            setEditingStaff(null);
            // Refresh the data to show the updated/new staff
            refreshData();
            // Trigger refresh for all tabs
            setRefreshTrigger(prev => prev + 1);
          } catch (error: any) {
            console.error('Error in staff operation:', error);
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
  const [isMakingPayment, setIsMakingPayment] = useState(false);
  const [payrollSummary, setPayrollSummary] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const currentYear = new Date().getFullYear();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleProcessPayroll = async () => {
    if (!selectedMonth) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      const branchId = selectedBranch ? parseInt(selectedBranch) : undefined;
      const response = await PayrollService.processPayroll({
        payroll_period: selectedMonth,
        branch_id: branchId
      });
      
      if (response.status === 'success') {
        setPayrollData(response.detailed_records || []);
        setPayrollSummary({
          total_employees: response.total_employees,
          total_gross_salary: response.total_gross_salary,
          total_deductions: response.total_deductions,
          total_net_salary: response.total_net_salary
        });
      } else if (response.status === 'already_exists') {
        setError('Payroll for this period already exists. You can reprocess by deleting the existing records first.');
        setPayrollData([]);
        setPayrollSummary(null);
      } else if (response.status === 'no_staff') {
        setError('No active staff members found for payroll processing.');
        setPayrollData([]);
        setPayrollSummary(null);
      }
    } catch (error: any) {
      console.error('Error processing payroll:', error);
      setError(error.message || 'Failed to process payroll. Please try again.');
      setPayrollData([]);
      setPayrollSummary(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMakePayment = async () => {
    if (!selectedMonth) return;
    
    setIsMakingPayment(true);
    setError('');
    
    try {
      const branchId = selectedBranch ? parseInt(selectedBranch) : undefined;
      const response = await PayrollService.markPayrollPaid(selectedMonth, branchId);
      
      if (response.status === 'success') {
        alert(`Payment processing completed! ${response.paid_records} payroll records marked as paid.`);
        onClose();
      } else {
        setError(response.message || 'Failed to process payment.');
      }
    } catch (error: any) {
      console.error('Error making payment:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setIsMakingPayment(false);
    }
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

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                  {payrollSummary?.total_employees || payrollData.length}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Employees</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                  {payrollData.reduce((sum, emp) => sum + (emp.gross_salary || 0), 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Gross Salary</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
                  {payrollData.reduce((sum, emp) => sum + (emp.deductions || 0), 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Deductions</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                  {payrollData.reduce((sum, emp) => sum + (emp.allowances || 0), 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Allowances</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>
                  {payrollData.reduce((sum, emp) => sum + (emp.net_salary || 0), 0).toLocaleString()}
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
                          {employee.basic_salary?.toLocaleString() || '0'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#10b981' }}>
                          {employee.allowances?.toLocaleString() || '0'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                          {employee.gross_salary?.toLocaleString() || '0'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#dc2626' }}>
                          {employee.deductions?.toLocaleString() || '0'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#2563eb', fontWeight: '600' }}>
                          {employee.net_salary?.toLocaleString() || '0'}
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
                disabled={isMakingPayment}
                style={{
                  padding: '12px 24px',
                  backgroundColor: isMakingPayment ? '#d1d5db' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isMakingPayment ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <DollarSign size={16} />
                {isMakingPayment ? 'Processing Payment...' : 'Make Payment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};