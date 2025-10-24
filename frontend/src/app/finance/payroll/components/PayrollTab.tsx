'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Eye,
  Receipt,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Trash2,
  X,
  Building,
  Phone,
  Mail,
  Clock,
  FileText,
  Award,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Banknote
} from 'lucide-react';
import { PayrollService, DetailedPayrollRecord, StaffService, Staff } from '../services/payrollService';

interface PayrollRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  branch: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  payPeriod: string;
  payDate: string;
  status: string;
  // Extended details for modal
  email: string;
  phone: string;
  position: string;
  hireDate: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  allowanceBreakdown: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
  deductionBreakdown: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
  taxDetails: {
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    totalTaxes: number;
  };
  paymentMethod: string;
  processedBy: string;
  processedDate: string;
  notes?: string;
}

interface PayrollTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  branchFilter: string;
  setBranchFilter: (filter: string) => void;
  monthFilter: string;
  setMonthFilter: (filter: string) => void;
  branches: Array<{ id: string; name: string }>;
}


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return { backgroundColor: '#10b981', color: '#ffffff' };
    case 'pending': return { backgroundColor: '#fef3c7', color: '#92400e' };
    case 'failed': return { backgroundColor: '#fecaca', color: '#991b1b' };
    default: return { backgroundColor: '#f3f4f6', color: '#374151' };
  }
};

const PayrollTab: React.FC<PayrollTabProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  branchFilter, 
  setBranchFilter, 
  monthFilter,
  setMonthFilter,
  branches 
}) => {
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<PayrollRecord | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentRecord, setSelectedPaymentRecord] = useState<PayrollRecord | null>(null);
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch staff data on component mount
  useEffect(() => {
    const fetchStaffData = async () => {
      setLoading(true);
      try {
        const staff = await StaffService.fetchStaff();
        setStaffData(staff);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        setStaffData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  // Helper function to safely parse JSON
  const safeJsonParse = (jsonString: string, defaultValue: any = []) => {
    try {
      return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (error) {
      console.warn('Failed to parse JSON:', jsonString, error);
      return defaultValue;
    }
  };


  // Filter staff data first, then convert to payroll records
  const filteredStaff = staffData.filter(staff => {
    const fullName = `${staff.first_name} ${staff.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                         (staff.employee_id && staff.employee_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (staff.department_name && staff.department_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesBranch = branchFilter === 'all' || (staff.branch_name && staff.branch_name === branchFilter);
    
    return matchesSearch && matchesBranch;
  });

  const filteredPayroll = filteredStaff.map(staff => {
    // Calculate deductions exactly like in staff details page
    let totalDeductions = 0;

    // Social Security deductions (percentage-based on basic salary)
    const socialSecurity = safeJsonParse(staff.social_security);
    if (Array.isArray(socialSecurity)) {
      socialSecurity.forEach((item: any) => {
        if (item.percentage && staff.basic_salary) {
          const deduction = (staff.basic_salary * parseFloat(item.percentage)) / 100;
          totalDeductions += deduction;
        } else if (item.amount) {
          totalDeductions += parseFloat(item.amount);
        }
      });
    }

    // Insurance deductions (annual amounts converted to monthly)
    const insuranceData = safeJsonParse(staff.insurance);
    if (Array.isArray(insuranceData)) {
      insuranceData.forEach((item: any) => {
        if (item.annualAmount) {
          const deduction = parseFloat(item.annualAmount) / 12;
          totalDeductions += deduction;
        } else if (item.amount) {
          const deduction = parseFloat(item.amount);
          totalDeductions += deduction;
        }
      });
    }

    // Loan deductions (monthly amounts)
    const loansData = safeJsonParse(staff.loans);
    if (Array.isArray(loansData)) {
      loansData.forEach((item: any) => {
        if (item.amount) {
          const deduction = parseFloat(item.amount);
          totalDeductions += deduction;
        }
      });
    }

    // PAYE Tax calculation (if eligible) - calculated on gross taxable income (basic salary + allowances)
    let payeTax = 0;
    if (staff.paye_eligible && staff.basic_salary) {
      const basicSalary = staff.basic_salary;
      let allowancesTotal = 0;

      // Calculate total allowances from actual data
      const allowancesDetail = safeJsonParse(staff.allowances_detail);
      if (Array.isArray(allowancesDetail)) {
        allowancesDetail.forEach((item: any) => {
          if (item.amount) allowancesTotal += parseFloat(item.amount);
        });
      }

      const grossTaxableIncome = basicSalary + allowancesTotal;

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

    // Calculate net salary exactly like in staff details page
    let netSalary = staff.basic_salary || 0;

    // Add allowances (allowances are NEVER deducted)
    const allowancesDetail = safeJsonParse(staff.allowances_detail);
    if (Array.isArray(allowancesDetail)) {
      allowancesDetail.forEach((item: any) => {
        if (item.amount) netSalary += parseFloat(item.amount);
      });
    }

    // Subtract all deductions (PAYE, Social Security, Insurance, Loans)
    netSalary -= totalDeductions;

    return {
      id: staff.id.toString(),
      employeeName: `${staff.first_name} ${staff.last_name}`,
      employeeId: staff.employee_id || staff.employee_number || '',
      department: staff.department_name || 'Unknown',
      branch: staff.branch_name || 'Unknown',
      basicSalary: staff.basic_salary || 0,
      allowances: staff.allowances || 0,
      deductions: totalDeductions,
      netSalary: netSalary,
      payPeriod: '2024-12', // Default to current month
      payDate: new Date().toISOString().split('T')[0],
      status: 'paid',
      email: staff.email || '',
      phone: staff.phone || '',
      position: staff.role_name || '',
      hireDate: staff.hire_date || '',
      bankDetails: {
        bankName: staff.bank_name || '',
        accountNumber: staff.bank_account || '',
        accountName: staff.account_name || 'N/A'
      },
      allowanceBreakdown: (safeJsonParse(staff.allowances_detail) || []).map((item: any) => ({
        type: item.name || 'Allowance',
        amount: item.amount || 0,
        description: 'Monthly allowance'
      })),
      deductionBreakdown: [
        ...(safeJsonParse(staff.social_security) || []).map((item: any) => ({
          type: item.name,
          amount: item.percentage ? (staff.basic_salary * parseFloat(item.percentage)) / 100 : item.amount || 0,
          description: item.percentage ? `${item.percentage}% of basic salary` : 'Monthly amount'
        })),
        ...(safeJsonParse(staff.insurance) || []).map((item: any) => ({
          type: item.name,
          amount: item.annualAmount ? parseFloat(item.annualAmount) / 12 : item.amount || 0,
          description: item.annualAmount ? 'Annual amount divided by 12' : 'Monthly amount'
        })),
        ...(safeJsonParse(staff.loans) || []).map((item: any) => ({
          type: item.name,
          amount: item.amount || 0,
          description: `${item.type || 'loan'} deduction`
        })),
        ...(staff.paye_eligible ? [{
          type: 'PAYE Tax',
          amount: payeTax,
          description: 'Progressive tax on gross taxable income'
        }] : [])
      ],
      taxDetails: {
        federalTax: payeTax,
        stateTax: 0,
        socialSecurity: 0,
        medicare: 0,
        totalTaxes: payeTax
      },
      paymentMethod: 'Direct Deposit',
      processedBy: 'System',
      processedDate: new Date().toISOString(),
      notes: ''
    };
  });

  const handleViewPayroll = (record: PayrollRecord) => {
    setSelectedPayrollRecord(record);
    setShowPayrollModal(true);
  };

  const handleDeletePayroll = async (record: PayrollRecord) => {
    if (window.confirm(`Are you sure you want to delete the payroll record for ${record.employeeName}?`)) {
      try {
        // Here you would call an API to delete the payroll record
        // For now, we'll just remove it from the local state
        setStaffData(prevStaff => prevStaff.filter(staff => staff.id.toString() !== record.id));
        console.log('Deleted payroll record for:', record.employeeName);
      } catch (error) {
        console.error('Error deleting payroll record:', error);
        alert('Failed to delete payroll record. Please try again.');
      }
    }
  };

  const handleIndividualPayment = (record: PayrollRecord) => {
    setSelectedPaymentRecord(record);
    setShowPaymentModal(true);
  };

  return (
    <div>
      {/* Search Bar and Branch Filter */}
      <div style={{
        position: 'relative',
        height: '40px',
        marginBottom: '24px'
      }}>
        {/* Search Bar - positioned from right */}
        <div style={{ 
          position: 'absolute',
          right: '520px',
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
            placeholder="Search payroll records..."
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
        
        {/* Month Filter - positioned from right */}
        <div style={{
          position: 'absolute',
          right: '270px',
          top: '0px'
        }}>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              background: 'white',
              width: '180px'
            }}
          >
            <option value="all">All Months</option>
            <option value="2024-01">January 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-03">March 2024</option>
            <option value="2024-04">April 2024</option>
            <option value="2024-05">May 2024</option>
            <option value="2024-06">June 2024</option>
            <option value="2024-07">July 2024</option>
            <option value="2024-08">August 2024</option>
            <option value="2024-09">September 2024</option>
            <option value="2024-10">October 2024</option>
            <option value="2024-11">November 2024</option>
            <option value="2024-12">December 2024</option>
            <option value="2025-01">January 2025</option>
            <option value="2025-02">February 2025</option>
            <option value="2025-03">March 2025</option>
            <option value="2025-04">April 2025</option>
            <option value="2025-05">May 2025</option>
            <option value="2025-06">June 2025</option>
            <option value="2025-07">July 2025</option>
            <option value="2025-08">August 2025</option>
            <option value="2025-09">September 2025</option>
            <option value="2025-10">October 2025</option>
            <option value="2025-11">November 2025</option>
            <option value="2025-12">December 2025</option>
          </select>
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

      {/* Payroll Records Table */}
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
                Employee
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Department
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Branch
              </th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Basic Salary
              </th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Allowances
              </th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Deductions
              </th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Net Salary
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
            {loading ? (
              <tr>
                <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  Loading payroll records...
                </td>
              </tr>
            ) : filteredPayroll.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  No payroll records found. Process payroll to see records here.
                </td>
              </tr>
            ) : (
              filteredPayroll.map((record) => (
              <tr key={record.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
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
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                        {record.employeeName}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {record.employeeId}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    {record.department}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                      {record.branch}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    {formatCurrency(record.basicSalary)}
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#059669', fontWeight: '500' }}>
                    +{formatCurrency(record.allowances)}
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#dc2626', fontWeight: '500' }}>
                    -{formatCurrency(record.deductions)}
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>
                    {formatCurrency(record.netSalary)}
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    ...getStatusColor(record.status)
                  }}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button 
                      onClick={() => handleViewPayroll(record)}
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
                    <button 
                      onClick={() => handleIndividualPayment(record)}
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
                        e.currentTarget.style.backgroundColor = '#f0fdf4';
                        e.currentTarget.style.color = '#059669';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <Banknote size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeletePayroll(record)}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Payroll Detail Modal */}
      {showPayrollModal && selectedPayrollRecord && (
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
                  <Receipt size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {selectedPayrollRecord.employeeName}
                  </h2>
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                    {selectedPayrollRecord.employeeId} • {selectedPayrollRecord.payPeriod}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPayrollModal(false)}
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

              {/* Employee & Payroll Summary */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                  Employee & Payroll Summary
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                      Employee Information
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Position: {selectedPayrollRecord.position}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Department: {selectedPayrollRecord.department}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Branch: {selectedPayrollRecord.branch}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Hired: {new Date(selectedPayrollRecord.hireDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                      Contact Information
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>{selectedPayrollRecord.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>{selectedPayrollRecord.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px', position: 'relative' }}>
                    {/* Status Badge - Top Right of Payment Information Card */}
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      ...getStatusColor(selectedPayrollRecord.status)
                    }}>
                      {selectedPayrollRecord.status.charAt(0).toUpperCase() + selectedPayrollRecord.status.slice(1)}
                    </span>
                    
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                      Payment Information
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Pay Date: {new Date(selectedPayrollRecord.payDate).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Method: {selectedPayrollRecord.paymentMethod}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Bank: {selectedPayrollRecord.bankDetails.bankName}</span>
                    </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Account: {selectedPayrollRecord.bankDetails.accountNumber}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>Account Name: {selectedPayrollRecord.bankDetails.accountName || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Allowances & Deductions Breakdown - Above the 4 cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} color="#10b981" />
                    Allowances Breakdown
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedPayrollRecord.allowanceBreakdown.map((allowance, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{allowance.type}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{allowance.description}</div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                          +{formatCurrency(allowance.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={20} color="#dc2626" />
                    Deductions Breakdown
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedPayrollRecord.deductionBreakdown.map((deduction, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{deduction.type}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{deduction.description}</div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>
                          -{formatCurrency(deduction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Salary Breakdown - 4 cards at the bottom */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                  Salary Breakdown
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                      <DollarSign size={20} color="#059669" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Basic Salary</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                      {formatCurrency(selectedPayrollRecord.basicSalary)}
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                      <TrendingUp size={20} color="#10b981" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Allowances</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                      +{formatCurrency(selectedPayrollRecord.allowances)}
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                      <AlertCircle size={20} color="#dc2626" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Deductions</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                      -{formatCurrency(selectedPayrollRecord.deductions)}
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                      <CheckCircle size={20} color="#059669" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Net Salary</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
                      {formatCurrency(selectedPayrollRecord.netSalary)}
                    </div>
                  </div>
                </div>
              </div>

                        </div>
                        </div>
                      </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPaymentRecord && (
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
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowPaymentModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '8px'
              }}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                <Banknote size={32} color="#059669" />
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  Process Payment
                </h2>
                  </div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Confirm payment details for this employee
              </p>
                </div>

            {/* Employee Info */}
            <div style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '16px', 
              padding: '20px', 
              marginBottom: '24px',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--mc-sidebar-bg), #8b5cf6)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white' 
                }}>
                  <User size={24} />
                </div>
                        <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {selectedPaymentRecord.employeeName}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    {selectedPaymentRecord.employeeId}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Department</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: 0 }}>
                    {selectedPaymentRecord.department}
                  </p>
                    </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Position</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: 0 }}>
                    {selectedPaymentRecord.position}
                  </p>
                    </div>
                  </div>
                </div>

            {/* Bank Details */}
            <div style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '16px', 
              padding: '20px', 
              marginBottom: '24px',
              backgroundColor: '#f9fafb'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    Bank Details
                  </h4>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Building size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  Bank: {selectedPaymentRecord.bankDetails.bankName}
                </span>
                    </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <CreditCard size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  Account: {selectedPaymentRecord.bankDetails.accountNumber}
                </span>
                    </div>
              
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  Account Name: {selectedPaymentRecord.bankDetails.accountName}
                </span>
                </div>
              </div>

            {/* Payment Summary */}
            <div style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '16px', 
              padding: '20px', 
              marginBottom: '24px'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                Payment Summary
                </h4>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Basic Salary</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {formatCurrency(selectedPaymentRecord.basicSalary)}
                </span>
                  </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Allowances</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  +{formatCurrency(selectedPaymentRecord.allowances)}
                </span>
                  </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Deductions</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#dc2626' }}>
                  -{formatCurrency(selectedPaymentRecord.deductions)}
                </span>
                  </div>
              
              <div style={{ 
                borderTop: '1px solid #e5e7eb', 
                paddingTop: '12px',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Net Salary</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                  {formatCurrency(selectedPaymentRecord.netSalary)}
                </span>
                </div>
              </div>


            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  alert(`Payment of ${formatCurrency(selectedPaymentRecord.netSalary)} processed successfully for ${selectedPaymentRecord.employeeName}`);
                  setShowPaymentModal(false);
                }}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '25px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollTab;
