"use client";

import { useState } from "react";
import { 
  DollarSign, Calculator, CreditCard, TrendingUp, Plus, 
  Calendar, FileText, Download, Users, Building, Clock, Award
} from "lucide-react";

export default function HRPayrollPage() {
  const [selectedModule, setSelectedModule] = useState("");

  const payrollModules = [
    {
      id: "salary-processing",
      title: "Salary Processing",
      description: "Process monthly salaries and calculate payments",
      icon: <DollarSign size={32} color="#10b981" />,
      color: "#10b981",
      onClick: () => {
        window.location.href = '/hr/modules/salary-processing';
      }
    },
    {
      id: "benefits-management",
      title: "Benefits Management",
      description: "Manage employee benefits and allowances",
      icon: <Award size={32} color="#0f172a" />,
      color: "#0f172a",
      onClick: () => {
        window.location.href = '/hr/modules/benefits-management';
      }
    },
    {
      id: "tax-calculations",
      title: "Tax Calculations",
      description: "Calculate taxes, deductions, and compliance",
      icon: <Calculator size={32} color="#f59e0b" />,
      color: "#f59e0b",
      onClick: () => {
        window.location.href = '/hr/modules/tax-calculations';
      }
    },
    {
      id: "payment-methods",
      title: "Payment Methods",
      description: "Manage bank transfers and payment processing",
      icon: <CreditCard size={32} color="#8b5cf6" />,
      color: "#8b5cf6",
      onClick: () => {
        window.location.href = '/hr/modules/payment-methods';
      }
    }
  ];

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
              Process salaries, manage benefits, and handle payroll operations
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#10b981',
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
              Process Payroll
            </button>
          </div>
        </div>
      </div>

      {/* Payroll Modules List */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '32px'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
          Payroll Modules
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {payrollModules.map((module) => (
            <div 
              key={module.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: 'white',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onClick={module.onClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0f172a';
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {module.icon}
                </div>
                <div>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    margin: '0 0 4px 0' 
                  }}>
                    {module.title}
                  </h4>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {module.description}
                  </p>
                </div>
              </div>
              <button style={{
                backgroundColor: '#0f172a',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0f172a';
              }}>
                Open Module
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
