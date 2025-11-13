'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { PayrollService, DetailedPayrollRecord, StaffService, Staff } from '../services/payrollService';

interface PayrollRecord {
  id: string;
  payrollRecordId: number | null;
  staffId: number | null;
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
  paidAt: string | null;
  processedAt: string | null;
  createdAt: string | null;
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

const getStatusColor = (status: string) => {
  return status === 'paid'
    ? { backgroundColor: '#10b981', color: '#ffffff' }
    : { backgroundColor: '#fef3c7', color: '#92400e' };
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
  const { formatCurrency } = useCurrency();
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<PayrollRecord | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentRecord, setSelectedPaymentRecord] = useState<PayrollRecord | null>(null);
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [rawPayrollRecords, setRawPayrollRecords] = useState<DetailedPayrollRecord[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const isLoading = isLoadingStaff || isLoadingRecords;
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [controlNumber, setControlNumber] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [paymentError, setPaymentError] = useState('');

  // Fetch staff data on component mount
  useEffect(() => {
    const fetchStaffData = async () => {
      setIsLoadingStaff(true);
      try {
        const staff = await StaffService.fetchStaff();
        setStaffData(staff);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        setStaffData([]);
      } finally {
        setIsLoadingStaff(false);
      }
    };

    fetchStaffData();
  }, []);

  const loadPayrollRecords = useCallback(async () => {
    setIsLoadingRecords(true);
    try {
      const selectedBranch =
        branchFilter !== 'all'
          ? branches.find(
              branch =>
                branch.name === branchFilter || branch.id === branchFilter
            )
          : undefined;

      const parsedBranchId =
        selectedBranch && !Number.isNaN(Number(selectedBranch.id))
          ? Number(selectedBranch.id)
          : undefined;

      const detailedRecords = await PayrollService.fetchDetailedPayrollRecords(
        monthFilter !== 'all' ? monthFilter : undefined,
        parsedBranchId
      );
      setRawPayrollRecords(detailedRecords);
    } catch (error) {
      console.error('Error fetching detailed payroll records:', error);
      setRawPayrollRecords([]);
    } finally {
      setIsLoadingRecords(false);
    }
  }, [branchFilter, branches, monthFilter]);

  useEffect(() => {
    loadPayrollRecords();
  }, [loadPayrollRecords]);

  // Helper function to safely parse JSON
  const safeJsonParse = (jsonString: string, defaultValue: any = []) => {
    try {
      return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (error) {
      console.warn('Failed to parse JSON:', jsonString, error);
      return defaultValue;
    }
  };
  const payrollRecords = useMemo<PayrollRecord[]>(() => {
    const dedupedMap = new Map<string, PayrollRecord>();

    rawPayrollRecords.forEach(record => {
      const staff = staffData.find(s => s.id === record.staff_id);

      const allowancesDetail = safeJsonParse(staff?.allowances_detail);
      const allowanceBreakdown = Array.isArray(allowancesDetail)
        ? allowancesDetail
            .map((item: any) => {
              if (!item) return null;
              const amount = item.amount ? Number(item.amount) : 0;
              if (!Number.isFinite(amount) || amount === 0) return null;
              return {
                type: item.name || item.type || 'Allowance',
                amount,
                description: item.description || item.notes || 'Monthly allowance'
              };
            })
            .filter(Boolean) as Array<{ type: string; amount: number; description: string }>
        : [];

      const socialSecurityData = safeJsonParse(staff?.social_security);
      let socialSecurityTotal = 0;
      const socialSecurityBreakdown = Array.isArray(socialSecurityData)
        ? socialSecurityData
            .map((item: any) => {
              if (!item) return null;
              let amount = 0;
              if (item.percentage && staff?.basic_salary) {
                amount = (staff.basic_salary * Number(item.percentage)) / 100;
              } else if (item.amount) {
                amount = Number(item.amount);
              }
              if (!Number.isFinite(amount) || amount === 0) return null;
              socialSecurityTotal += amount;
              return {
                type: item.name || item.type || 'Social Security',
                amount,
                description: item.percentage ? `${item.percentage}% of basic salary` : 'Monthly amount'
              };
            })
            .filter(Boolean) as Array<{ type: string; amount: number; description: string }>
        : [];

      const insuranceData = safeJsonParse(staff?.insurance);
      let insuranceTotal = 0;
      const insuranceBreakdown = Array.isArray(insuranceData)
        ? insuranceData
            .map((item: any) => {
              if (!item) return null;
              let amount = 0;
              if (item.annualAmount) {
                amount = Number(item.annualAmount) / 12;
              } else if (item.amount) {
                amount = Number(item.amount);
              }
              if (!Number.isFinite(amount) || amount === 0) return null;
              insuranceTotal += amount;
              return {
                type: item.name || item.type || 'Insurance',
                amount,
                description: item.annualAmount ? 'Annual amount divided by 12' : 'Monthly amount'
              };
            })
            .filter(Boolean) as Array<{ type: string; amount: number; description: string }>
        : [];

      const loansData = safeJsonParse(staff?.loans);
      let loansTotal = 0;
      const loansBreakdown = Array.isArray(loansData)
        ? loansData
            .map((item: any) => {
              if (!item) return null;
              const amount = item.monthly_deduction
                ? Number(item.monthly_deduction)
                : item.amount
                ? Number(item.amount)
                : 0;
              if (!Number.isFinite(amount) || amount === 0) return null;
              loansTotal += amount;
              return {
                type: item.name || item.type || 'Loan',
                amount,
                description: item.description || 'Loan deduction'
              };
            })
            .filter(Boolean) as Array<{ type: string; amount: number; description: string }>
        : [];

      const payeTax = Number(record.paye_tax) || 0;
      const payeBreakdown =
        payeTax > 0
          ? [
              {
                type: 'PAYE Tax',
                amount: payeTax,
                description: 'Progressive tax on gross taxable income'
              }
            ]
          : [];

      const deductionBreakdown = [
        ...socialSecurityBreakdown,
        ...insuranceBreakdown,
        ...loansBreakdown,
        ...payeBreakdown
      ];

      const totalDeductions =
        record.total_deductions ??
        socialSecurityTotal + insuranceTotal + loansTotal + payeTax;

      const netSalary =
        record.net_salary ??
        (record.basic_salary ?? 0) + (record.allowances ?? 0) - totalDeductions;

      const employeeName =
        record.name ||
        (staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown Employee');

      const employeeId =
        record.employee_id || staff?.employee_id || staff?.employee_number || '';

      const branchName = record.branch_name || staff?.branch_name || 'Unknown';
      const departmentName =
        record.department_name || staff?.department_name || 'Unknown';

      const payPeriod = record.payroll_period || monthFilter;
      const rawStatus = (record.status || 'pending').toLowerCase();
      const normalizedStatus = rawStatus === 'paid' ? 'paid' : 'pending';

      const key = `${record.staff_id ?? staff?.id ?? employeeId}-${payPeriod}`;
      const existing = dedupedMap.get(key);
      const existingCreatedAt = existing?.createdAt
        ? new Date(existing.createdAt)
        : null;
      const currentCreatedAt = record.created_at
        ? new Date(record.created_at)
        : null;

      if (
        existing &&
        existingCreatedAt &&
        currentCreatedAt &&
        existingCreatedAt >= currentCreatedAt
      ) {
        return;
      }

      dedupedMap.set(key, {
        id:
          record.id !== undefined && record.id !== null
            ? record.id.toString()
            : `${record.staff_id ?? 'staff'}-${payPeriod}`,
        payrollRecordId: record.id ?? null,
        staffId: record.staff_id ?? null,
        employeeName,
        employeeId,
        department: departmentName,
        branch: branchName,
        basicSalary: record.basic_salary ?? staff?.basic_salary ?? 0,
        allowances: record.allowances ?? staff?.allowances ?? 0,
        deductions: totalDeductions,
        netSalary,
        payPeriod,
        payDate:
          record.pay_date ||
          record.processed_at ||
          record.created_at ||
          new Date().toISOString(),
        status: normalizedStatus,
        email: record.email || staff?.email || '',
        phone: staff?.phone || '',
        position: staff?.role_name || staff?.employment_type || 'Not set',
        hireDate: staff?.hire_date || record.created_at || new Date().toISOString(),
        bankDetails: {
          bankName: staff?.bank_name || 'Not provided',
          accountNumber: staff?.bank_account || 'Not provided',
          accountName:
            staff?.account_name ||
            (staff ? `${staff.first_name} ${staff.last_name}` : 'Not provided')
        },
        allowanceBreakdown,
        deductionBreakdown,
        taxDetails: {
          federalTax: payeTax,
          stateTax: 0,
          socialSecurity: socialSecurityTotal,
          medicare: 0,
          totalTaxes: payeTax + socialSecurityTotal
        },
        paymentMethod:
          normalizedStatus === 'paid'
            ? 'BillPay Control Number'
            : 'Pending',
        processedBy: 'System',
        processedDate:
          record.processed_at || record.created_at || new Date().toISOString(),
        notes: record.notes || '',
        paidAt: record.paid_at || null,
        processedAt: record.processed_at || null,
        createdAt: record.created_at || null
      });
    });

    return Array.from(dedupedMap.values());
  }, [rawPayrollRecords, staffData, monthFilter]);

  const filteredPayroll = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const branchNameFilter =
      branchFilter === 'all' ? null : branchFilter.trim().toLowerCase();
    const periodFilter = monthFilter === 'all' ? null : monthFilter;

    return payrollRecords.filter(record => {
      const employeeName = record.employeeName?.toLowerCase() ?? '';
      const employeeId = record.employeeId?.toLowerCase() ?? '';
      const branchName = record.branch?.toLowerCase() ?? '';
      const payPeriod = record.payPeriod ?? '';

      const matchesSearch =
        !query ||
        employeeName.includes(query) ||
        employeeId.includes(query);

      const matchesBranch =
        !branchNameFilter || branchName === branchNameFilter;

      const matchesPeriod = !periodFilter || payPeriod === periodFilter;

      return matchesSearch && matchesBranch && matchesPeriod;
    });
  }, [payrollRecords, searchQuery, branchFilter, monthFilter]);

  const handleViewPayroll = (record: PayrollRecord) => {
    setSelectedPayrollRecord(record);
    setShowPayrollModal(true);
  };

  const handleDeletePayroll = async (record: PayrollRecord) => {
    if (window.confirm(`Are you sure you want to delete the payroll record for ${record.employeeName}?`)) {
      try {
        // Here you would call an API to delete the payroll record
        // For now, we'll just remove it from the local state
        if (record.payrollRecordId !== null) {
          setRawPayrollRecords(prev =>
            prev.filter(pr => pr.id !== record.payrollRecordId)
          );
        }
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
    setControlNumber('');
    setPaymentDetails(null);
    setPaymentError('');
  };

  const handleGeneratePayment = async () => {
    if (!selectedPaymentRecord) return;
    
    if (!selectedPaymentRecord.payrollRecordId) {
      setPaymentError('Payroll record information is missing for this employee.');
      return;
    }

    if (selectedPaymentRecord.status === 'paid') {
      setPaymentError('This payroll record is already marked as paid.');
      return;
    }

    setIsGeneratingPayment(true);
    setPaymentError('');
    
    try {
      const response = await PayrollService.generateIndividualPayrollPayment(
        selectedPaymentRecord.payrollRecordId
      );
      
      if (response.success) {
        setControlNumber(response.billpay_control_number);
        setPaymentDetails(response);
        await loadPayrollRecords();
      } else {
        setPaymentError(response.message || 'Failed to generate payment control number.');
      }
    } catch (error: any) {
      console.error('Error generating payment:', error);
      setPaymentError(error.message || 'Failed to generate payment control number. Please try again.');
    } finally {
      setIsGeneratingPayment(false);
    }
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
            {isLoading ? (
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


            {/* Payment Control Number Display */}
            {controlNumber && paymentDetails && (
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                backgroundColor: 'white'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Payment Control Number Generated
                </h4>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Control Number:</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', fontFamily: 'monospace' }}>
                    {controlNumber}
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Total Amount to Pay:</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                    {formatCurrency(paymentDetails.total_amount)}
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: '#f9fafb', 
                  padding: '12px', 
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#374151',
                  marginTop: '12px'
                }}>
                  Net Salary: {formatCurrency(paymentDetails.net_salary)}<br />
                  Total Fees: {formatCurrency(paymentDetails.total_amount - paymentDetails.net_salary)}<br />
                  <strong style={{ color: '#10b981' }}>Total: {formatCurrency(paymentDetails.total_amount)}</strong>
                </div>
                <div style={{ 
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  <strong>Instructions:</strong> Use the control number {controlNumber} to pay via your preferred payment method (MNO, Bank, etc.). Once paid, the salary will be automatically sent to {selectedPaymentRecord.employeeName}'s bank account.
                </div>
              </div>
            )}

            {/* Error Message */}
            {paymentError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                color: '#dc2626',
                fontSize: '14px'
              }}>
                {paymentError}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setControlNumber('');
                  setPaymentDetails(null);
                  setPaymentError('');
                }}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #d1d5db',
                  borderRadius: '25px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {controlNumber ? 'Close' : 'Cancel'}
              </button>
              {!controlNumber && (
                <button
                  onClick={handleGeneratePayment}
                  disabled={isGeneratingPayment}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '25px',
                    backgroundColor: isGeneratingPayment ? '#d1d5db' : '#10b981',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isGeneratingPayment ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    if (!isGeneratingPayment) {
                      e.currentTarget.style.backgroundColor = '#059669';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isGeneratingPayment) {
                      e.currentTarget.style.backgroundColor = '#10b981';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                    }
                  }}
                >
                  {isGeneratingPayment ? 'Generating Control Number...' : 'Pay'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollTab;