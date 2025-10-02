"use client";

import { useState } from "react";
import { 
  Calculator, Search, ArrowLeft, DollarSign, Percent, FileText, 
  Download, Plus, Edit, Eye, AlertCircle, CheckCircle, Clock
} from "lucide-react";

export default function TaxCalculationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTaxYear, setSelectedTaxYear] = useState("2024");
  const [showTaxModal, setShowTaxModal] = useState(false);

  const taxCalculations = [
    {
      id: 1,
      employeeName: "John Mwalimu",
      grossSalary: 2850000,
      payeTax: 450000,
      nssfContribution: 200000,
      nhifContribution: 150000,
      wcfContribution: 50000,
      totalTaxes: 850000,
      netSalary: 2000000,
      status: "Calculated",
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      employeeName: "Sarah Mwamba",
      grossSalary: 3600000,
      payeTax: 650000,
      nssfContribution: 200000,
      nhifContribution: 150000,
      wcfContribution: 50000,
      totalTaxes: 1050000,
      netSalary: 2550000,
      status: "Calculated",
      lastUpdated: "2024-01-15"
    },
    {
      id: 3,
      employeeName: "Michael Kimaro",
      grossSalary: 2430000,
      payeTax: 400000,
      nssfContribution: 200000,
      nhifContribution: 150000,
      wcfContribution: 50000,
      totalTaxes: 800000,
      netSalary: 1630000,
      status: "Pending",
      lastUpdated: "2024-01-14"
    }
  ];

  const filteredCalculations = taxCalculations.filter(calc =>
    calc.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const taxRates = [
    { type: "PAYE Tax", rate: "Progressive", description: "Pay As You Earn tax brackets" },
    { type: "NSSF Contribution", rate: "10%", description: "National Social Security Fund" },
    { type: "NHIF Contribution", rate: "6%", description: "National Health Insurance Fund" },
    { type: "WCF Contribution", rate: "2%", description: "Workers Compensation Fund" }
  ];

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
              Tax Calculations
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Calculate taxes, deductions, and compliance for employees
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
          
          {/* Year Filter - positioned from right */}
          <div style={{
            position: 'absolute',
            right: '50px',
            top: '0px'
          }}>
            <select
              value={selectedTaxYear}
              onChange={(e) => setSelectedTaxYear(e.target.value)}
              style={{
                padding: '12px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                backgroundColor: 'white',
                width: '120px'
              }}
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
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
            Export Tax Forms
          </button>
          <button
            onClick={() => setShowTaxModal(true)}
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
            Calculate Taxes
          </button>
        </div>
      </div>

      {/* Tax Rates Overview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {taxRates.map((tax, index) => (
          <div key={index} style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                padding: '8px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px'
              }}>
                <Percent size={20} color="#6b7280" />
              </div>
              <span style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                {tax.rate}
              </span>
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
              {tax.type}
            </h4>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
              {tax.description}
            </p>
          </div>
        ))}
      </div>

      {/* Tax Calculations Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Tax Calculations - {selectedTaxYear}
          </h3>
          <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={16} color="#10b981" />
              Calculated: {taxCalculations.filter(t => t.status === 'Calculated').length}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={16} color="#f59e0b" />
              Pending: {taxCalculations.filter(t => t.status === 'Pending').length}
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
                  Gross Salary
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  PAYE Tax
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  NSSF
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  NHIF
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  WCF
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Total Taxes
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
              {filteredCalculations.map((calc) => (
                <tr key={calc.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        {calc.employeeName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Updated: {calc.lastUpdated}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#1f2937' }}>
                    TZS {calc.grossSalary.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#ef4444' }}>
                    -TZS {calc.payeTax.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#ef4444' }}>
                    -TZS {calc.nssfContribution.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#ef4444' }}>
                    -TZS {calc.nhifContribution.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#ef4444' }}>
                    -TZS {calc.wcfContribution.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>
                    -TZS {calc.totalTaxes.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                    TZS {calc.netSalary.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: calc.status === 'Calculated' ? '#dcfce7' : '#fef3c7',
                      color: calc.status === 'Calculated' ? '#166534' : '#92400e'
                    }}>
                      {calc.status}
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

      {/* Calculate Taxes Modal */}
      {showTaxModal && (
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
              Calculate Taxes for {selectedTaxYear}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>
              This will calculate taxes for all employees based on current tax rates and regulations. Are you sure you want to continue?
            </p>
            
            <div style={{ 
              backgroundColor: '#fef3c7', 
              border: '1px solid #f59e0b', 
              borderRadius: '8px', 
              padding: '12px', 
              marginBottom: '24px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} color="#f59e0b" />
                <span style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
                  Tax calculations will be updated for all employees
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowTaxModal(false)}
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
                  setShowTaxModal(false);
                  // Handle tax calculation
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
                Calculate Taxes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
