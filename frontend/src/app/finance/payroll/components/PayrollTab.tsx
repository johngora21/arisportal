'use client';

import React, { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';

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
    routingNumber: string;
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
  branches: Array<{ id: string; name: string }>;
}

const mockPayroll: PayrollRecord[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    employeeId: 'EMP001',
    department: 'Information Technology',
    branch: 'Tech Center',
    basicSalary: 75000,
    allowances: 10000,
    deductions: 8500,
    netSalary: 76500,
    payPeriod: '2024-01',
    payDate: '2024-01-31',
    status: 'paid',
    email: 'john.doe@arisportal.com',
    phone: '+255 27 333 4444',
    position: 'Senior Developer',
    hireDate: '2022-03-15',
    bankDetails: {
      bankName: 'National Bank of Tanzania',
      accountNumber: '****1234',
      routingNumber: '123456789'
    },
    allowanceBreakdown: [
      { type: 'Housing Allowance', amount: 5000, description: 'Monthly housing stipend' },
      { type: 'Transportation', amount: 3000, description: 'Commute and travel expenses' },
      { type: 'Meal Allowance', amount: 2000, description: 'Daily meal allowance' }
    ],
    deductionBreakdown: [
      { type: 'Income Tax', amount: 4500, description: 'Federal and state income tax' },
      { type: 'Social Security', amount: 2250, description: 'Social Security contribution' },
      { type: 'Health Insurance', amount: 1200, description: 'Company health plan' },
      { type: 'Retirement Fund', amount: 550, description: '401(k) contribution' }
    ],
    taxDetails: {
      federalTax: 3200,
      stateTax: 1300,
      socialSecurity: 2250,
      medicare: 525,
      totalTaxes: 7275
    },
    paymentMethod: 'Direct Deposit',
    processedBy: 'HR Department',
    processedDate: '2024-01-30',
    notes: 'Regular monthly payroll processing'
  },
  {
    id: '2',
    employeeName: 'Sarah Johnson',
    employeeId: 'EMP002',
    department: 'Human Resources',
    branch: 'Main Branch',
    basicSalary: 65000,
    allowances: 8000,
    deductions: 7300,
    netSalary: 65700,
    payPeriod: '2024-01',
    payDate: '2024-01-31',
    status: 'paid',
    email: 'sarah.johnson@arisportal.com',
    phone: '+255 22 111 2222',
    position: 'HR Manager',
    hireDate: '2021-08-10',
    bankDetails: {
      bankName: 'CRDB Bank',
      accountNumber: '****5678',
      routingNumber: '987654321'
    },
    allowanceBreakdown: [
      { type: 'Housing Allowance', amount: 4000, description: 'Monthly housing stipend' },
      { type: 'Transportation', amount: 2500, description: 'Commute and travel expenses' },
      { type: 'Meal Allowance', amount: 1500, description: 'Daily meal allowance' }
    ],
    deductionBreakdown: [
      { type: 'Income Tax', amount: 3900, description: 'Federal and state income tax' },
      { type: 'Social Security', amount: 1950, description: 'Social Security contribution' },
      { type: 'Health Insurance', amount: 1000, description: 'Company health plan' },
      { type: 'Retirement Fund', amount: 450, description: '401(k) contribution' }
    ],
    taxDetails: {
      federalTax: 2800,
      stateTax: 1100,
      socialSecurity: 1950,
      medicare: 455,
      totalTaxes: 6305
    },
    paymentMethod: 'Direct Deposit',
    processedBy: 'Finance Team',
    processedDate: '2024-01-30',
    notes: 'Standard HR payroll processing'
  },
  {
    id: '3',
    employeeName: 'Mike Wilson',
    employeeId: 'EMP003',
    department: 'Sales & Marketing',
    branch: 'Sales Hub',
    basicSalary: 60000,
    allowances: 12000,
    deductions: 7200,
    netSalary: 64800,
    payPeriod: '2024-01',
    payDate: '2024-01-31',
    status: 'pending',
    email: 'mike.wilson@arisportal.com',
    phone: '+255 28 555 6666',
    position: 'Sales Representative',
    hireDate: '2023-06-01',
    bankDetails: {
      bankName: 'NMB Bank',
      accountNumber: '****9012',
      routingNumber: '456789123'
    },
    allowanceBreakdown: [
      { type: 'Sales Commission', amount: 8000, description: 'Monthly sales performance bonus' },
      { type: 'Housing Allowance', amount: 2500, description: 'Monthly housing stipend' },
      { type: 'Transportation', amount: 1500, description: 'Client visit expenses' }
    ],
    deductionBreakdown: [
      { type: 'Income Tax', amount: 3600, description: 'Federal and state income tax' },
      { type: 'Social Security', amount: 1800, description: 'Social Security contribution' },
      { type: 'Health Insurance', amount: 900, description: 'Company health plan' },
      { type: 'Retirement Fund', amount: 900, description: '401(k) contribution' }
    ],
    taxDetails: {
      federalTax: 2600,
      stateTax: 1000,
      socialSecurity: 1800,
      medicare: 420,
      totalTaxes: 5820
    },
    paymentMethod: 'Direct Deposit',
    processedBy: 'Payroll System',
    processedDate: '2024-01-31',
    notes: 'Pending final commission calculation'
  },
  {
    id: '4',
    employeeName: 'Emily Brown',
    employeeId: 'EMP004',
    department: 'Operations',
    branch: 'Regional Office',
    basicSalary: 55000,
    allowances: 7000,
    deductions: 6200,
    netSalary: 55800,
    payPeriod: '2024-01',
    payDate: '2024-01-31',
    status: 'paid',
    email: 'emily.brown@arisportal.com',
    phone: '+255 26 777 8888',
    position: 'Operations Coordinator',
    hireDate: '2022-11-15',
    bankDetails: {
      bankName: 'Equity Bank',
      accountNumber: '****3456',
      routingNumber: '789123456'
    },
    allowanceBreakdown: [
      { type: 'Housing Allowance', amount: 3500, description: 'Monthly housing stipend' },
      { type: 'Transportation', amount: 2000, description: 'Regional travel expenses' },
      { type: 'Meal Allowance', amount: 1500, description: 'Daily meal allowance' }
    ],
    deductionBreakdown: [
      { type: 'Income Tax', amount: 3300, description: 'Federal and state income tax' },
      { type: 'Social Security', amount: 1650, description: 'Social Security contribution' },
      { type: 'Health Insurance', amount: 800, description: 'Company health plan' },
      { type: 'Retirement Fund', amount: 450, description: '401(k) contribution' }
    ],
    taxDetails: {
      federalTax: 2400,
      stateTax: 900,
      socialSecurity: 1650,
      medicare: 385,
      totalTaxes: 5335
    },
    paymentMethod: 'Direct Deposit',
    processedBy: 'Regional HR',
    processedDate: '2024-01-30',
    notes: 'Regional operations payroll'
  }
];

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
  branches 
}) => {
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<PayrollRecord | null>(null);

  const filteredPayroll = mockPayroll.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBranch = branchFilter === 'all' || record.branch === branchFilter;
    
    return matchesSearch && matchesBranch;
  });

  const handleViewPayroll = (record: PayrollRecord) => {
    setSelectedPayrollRecord(record);
    setShowPayrollModal(true);
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
            {filteredPayroll.map((record) => (
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
                </td>
              </tr>
            ))}
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                  Salary Breakdown
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                      <DollarSign size={20} color="#6b7280" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Basic Salary</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                      {formatCurrency(selectedPayrollRecord.basicSalary)}
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                      <TrendingUp size={20} color="#6b7280" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Allowances</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                      +{formatCurrency(selectedPayrollRecord.allowances)}
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                      <AlertCircle size={20} color="#6b7280" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Deductions</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                      -{formatCurrency(selectedPayrollRecord.deductions)}
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                      <CheckCircle size={20} color="#6b7280" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Net Salary</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
                      {formatCurrency(selectedPayrollRecord.netSalary)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Allowances & Deductions Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Allowances Breakdown
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedPayrollRecord.allowanceBreakdown.map((allowance, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{allowance.type}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{allowance.description}</div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          +{formatCurrency(allowance.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Deductions Breakdown
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedPayrollRecord.deductionBreakdown.map((deduction, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{deduction.type}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{deduction.description}</div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          -{formatCurrency(deduction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tax Details & Bank Information */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Tax Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#374151' }}>Federal Tax:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{formatCurrency(selectedPayrollRecord.taxDetails.federalTax)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#374151' }}>State Tax:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{formatCurrency(selectedPayrollRecord.taxDetails.stateTax)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#374151' }}>Social Security:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{formatCurrency(selectedPayrollRecord.taxDetails.socialSecurity)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#374151' }}>Medicare:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{formatCurrency(selectedPayrollRecord.taxDetails.medicare)}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>Total Taxes:</span>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>{formatCurrency(selectedPayrollRecord.taxDetails.totalTaxes)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Bank Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#374151' }}>{selectedPayrollRecord.bankDetails.bankName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Account: {selectedPayrollRecord.bankDetails.accountNumber}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Routing: {selectedPayrollRecord.bankDetails.routingNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Information */}
              <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Processing Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Processed By</div>
                    <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>{selectedPayrollRecord.processedBy}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Processed Date</div>
                    <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>{new Date(selectedPayrollRecord.processedDate).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Notes</div>
                    <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>{selectedPayrollRecord.notes || 'No notes'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollTab;
