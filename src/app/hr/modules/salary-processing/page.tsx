"use client";

import React, { useState } from "react";
import { 
  DollarSign, Calculator, Users, Calendar, Plus, Search, Filter,
  Edit, Eye, Download, ArrowLeft, CheckCircle, AlertCircle, Clock
} from "lucide-react";

export default function SalaryProcessingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [showProcessModal, setShowProcessModal] = useState(false);

  const employees = [
    {
      id: 1,
      name: "John Mwalimu",
      position: "Software Engineer",
      basicSalary: 2500000,
      allowances: 200000,
      overtime: 150000,
      deductions: 450000,
      netSalary: 2400000,
      status: "Processed"
    },
    {
      id: 2,
      name: "Sarah Mwamba",
      position: "HR Manager",
      basicSalary: 3200000,
      allowances: 300000,
      overtime: 100000,
      deductions: 650000,
      netSalary: 2950000,
      status: "Processed"
    },
    {
      id: 3,
      name: "Michael Kimaro",
      position: "Marketing Specialist",
      basicSalary: 2200000,
      allowances: 150000,
      overtime: 80000,
      deductions: 400000,
      netSalary: 2030000,
      status: "Pending"
    }
  ];

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px'
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Salary Processing
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Process monthly salaries and calculate employee payments
            </p>
          </div>
        </div>
        
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
            width: '300px'
          }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
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
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Month Filter - positioned from right */}
          <div style={{
            position: 'absolute',
            right: '50px',
            top: '0px'
          }}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                padding: '12px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                backgroundColor: 'white',
                width: '150px'
              }}
            >
              <option value="2024-01">January 2024</option>
              <option value="2024-02">February 2024</option>
              <option value="2024-03">March 2024</option>
              <option value="2024-04">April 2024</option>
            </select>
          </div>
        </div>
      </div>
          
      <div style={{ display: 'flex', gap: '12px' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => setShowProcessModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              Process Salaries
            </button>
          </div>
        </div>
      </div>

      {/* Salary Processing Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Employee Salaries - {selectedMonth}
          </h3>
          <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={16} color="#10b981" />
              Processed: {employees.filter(e => e.status === 'Processed').length}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={16} color="#f59e0b" />
              Pending: {employees.filter(e => e.status === 'Pending').length}
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Employee
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Basic Salary
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Allowances
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Overtime
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Deductions
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Net Salary
                </th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Status
                </th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        {employee.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {employee.position}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#1f2937' }}>
                    TZS {employee.basicSalary.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#10b981' }}>
                    +TZS {employee.allowances.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#10b981' }}>
                    +TZS {employee.overtime.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#ef4444' }}>
                    -TZS {employee.deductions.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    TZS {employee.netSalary.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: employee.status === 'Processed' ? '#dcfce7' : '#fef3c7',
                      color: employee.status === 'Processed' ? '#166534' : '#92400e'
                    }}>
                      {employee.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Eye size={16} color="#6b7280" />
                      </button>
                      <button style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Edit size={16} color="#6b7280" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Salaries Modal */}
      {showProcessModal && (
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
            padding: '24px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
              Process Salaries for {selectedMonth}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>
              This will calculate and process salaries for all employees. Are you sure you want to continue?
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowProcessModal(false)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowProcessModal(false);
                  // Handle salary processing
                }}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Process Salaries
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



