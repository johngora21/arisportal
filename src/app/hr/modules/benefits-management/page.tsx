"use client";

import { useState } from "react";
import { 
  Award, Plus, Search, Edit, Eye, ArrowLeft, CheckCircle, 
  X, DollarSign, Calendar, Users, Shield, Heart
} from "lucide-react";

export default function BenefitsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddBenefit, setShowAddBenefit] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState(null);

  const benefits = [
    {
      id: 1,
      name: "National Health Insurance Fund (NHIF)",
      type: "Medical",
      coverage: "Family",
      monthlyCost: 150000,
      employeeContribution: 50000,
      companyContribution: 100000,
      status: "Active",
      icon: <Shield size={20} color="#10b981" />
    },
    {
      id: 2,
      name: "National Social Security Fund (NSSF)",
      type: "Retirement",
      coverage: "All Employees",
      monthlyCost: 200000,
      employeeContribution: 100000,
      companyContribution: 100000,
      status: "Active",
      icon: <Award size={20} color="#f59e0b" />
    },
    {
      id: 3,
      name: "Workers Compensation Fund (WCF)",
      type: "Insurance",
      coverage: "All Employees",
      monthlyCost: 50000,
      employeeContribution: 0,
      companyContribution: 50000,
      status: "Active",
      icon: <Shield size={20} color="var(--mc-sidebar-bg)" />
    },
    {
      id: 4,
      name: "Transport Allowance",
      type: "Allowance",
      coverage: "All Employees",
      monthlyCost: 100000,
      employeeContribution: 0,
      companyContribution: 100000,
      status: "Active",
      icon: <Heart size={20} color="#ef4444" />
    }
  ];

  const filteredBenefits = benefits.filter(benefit =>
    benefit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefit.type.toLowerCase().includes(searchTerm.toLowerCase())
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
              borderRadius: '20px',
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
              Benefits Management
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Manage employee benefits and allowances
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#6b7280" style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <input
              type="text"
              placeholder="Search benefits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '12px 12px 12px 40px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '16px',
                width: '300px',
                outline: 'none'
              }}
            />
          </div>
          
          <button
            onClick={() => setShowAddBenefit(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            Add Benefit
          </button>
        </div>
      </div>

      {/* Benefits Overview Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: '0 0 8px 0' }}>
                Total Benefits
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
                {benefits.length}
              </p>
              <p style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
                Active benefits
              </p>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '20px'
            }}>
              <Award size={32} color="#6b7280" />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: '0 0 8px 0' }}>
                Monthly Cost
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
                TZS {benefits.reduce((sum, benefit) => sum + benefit.monthlyCost, 0).toLocaleString()}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                Total monthly cost
              </p>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: '#fef3c7',
              borderRadius: '20px'
            }}>
              <DollarSign size={32} color="#f59e0b" />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: '0 0 8px 0' }}>
                Company Contribution
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
                TZS {benefits.reduce((sum, benefit) => sum + benefit.companyContribution, 0).toLocaleString()}
              </p>
              <p style={{ fontSize: '12px', color: '#10b981' }}>
                Monthly company cost
              </p>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: '#dcfce7',
              borderRadius: '20px'
            }}>
              <Users size={32} color="#10b981" />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits List */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
          Employee Benefits
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredBenefits.map((benefit) => (
            <div 
              key={benefit.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                backgroundColor: 'white',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {benefit.icon}
                </div>
                <div>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    margin: '0 0 4px 0' 
                  }}>
                    {benefit.name}
                  </h4>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                    <span>Type: {benefit.type}</span>
                    <span>Coverage: {benefit.coverage}</span>
                    <span>Monthly: TZS {benefit.monthlyCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                    Employee: TZS {benefit.employeeContribution.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    Company: TZS {benefit.companyContribution.toLocaleString()}
                  </div>
                </div>
                
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: '#dcfce7',
                  color: '#166534'
                }}>
                  {benefit.status}
                </span>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '20px',
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
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Edit size={16} color="#6b7280" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Benefit Modal */}
      {showAddBenefit && (
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
            borderRadius: '20px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Add New Benefit
              </h3>
              <button
                onClick={() => setShowAddBenefit(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} color="#6b7280" />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Benefit Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Health Insurance"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Type
                </label>
                <select style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  outline: 'none'
                }}>
                  <option value="Medical">Medical</option>
                  <option value="Retirement">Retirement</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Monthly Cost
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Employee Contribution
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddBenefit(false)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddBenefit(false)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Add Benefit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
