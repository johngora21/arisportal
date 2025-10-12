import React, { useState } from 'react';
import { Calculator, DollarSign, Calendar, Percent } from 'lucide-react';

export default function CalculatorTab() {
  const [formData, setFormData] = useState({
    propertyValue: '',
    loanAmount: '',
    interestRate: '13',
    termYears: '3'
  });

  const inputStyle = (hasError: boolean = false) => ({
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '16px',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '20px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none'
  });

  const selectStyle = (hasError: boolean = false) => ({
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '16px',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '20px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none'
  });

  const [results, setResults] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalAmount: number;
    loanToValueRatio: number;
  } | null>(null);

  const calculateLoan = () => {
    const propertyValue = parseFloat(formData.propertyValue);
    const loanAmount = parseFloat(formData.loanAmount);
    const annualRate = parseFloat(formData.interestRate) / 100;
    const termMonths = parseFloat(formData.termYears) * 12;

    if (propertyValue > 0 && loanAmount > 0 && termMonths > 0) {
      const monthlyRate = annualRate / 12;
      const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                           (Math.pow(1 + monthlyRate, termMonths) - 1);
      const totalAmount = monthlyPayment * termMonths;
      const totalInterest = totalAmount - loanAmount;
      const loanToValueRatio = (loanAmount / propertyValue) * 100;

      setResults({
        monthlyPayment,
        totalInterest,
        totalAmount,
        loanToValueRatio
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            backgroundColor: '#dbeafe',
            borderRadius: '20px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calculator size={20} color="#3b82f6" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Loan Calculator
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Input Form */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
              Loan Details
            </h4>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Property Value (TZS) *
              </label>
              <input
                type="number"
                value={formData.propertyValue}
                onChange={(e) => setFormData({ ...formData, propertyValue: e.target.value })}
                style={inputStyle()}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter property value"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Loan Amount (TZS) *
              </label>
              <input
                type="number"
                value={formData.loanAmount}
                onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                style={inputStyle()}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter loan amount"
              />
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                Maximum: {formData.propertyValue ? formatPrice(parseFloat(formData.propertyValue) * 0.7) : '0 TZS'}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                style={inputStyle()}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter interest rate"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Loan Term (Years)
              </label>
              <select
                value={formData.termYears}
                onChange={(e) => setFormData({ ...formData, termYears: e.target.value })}
                style={selectStyle()}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
                <option value="6">6 years</option>
              </select>
            </div>

            <button
              onClick={calculateLoan}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: 'var(--mc-sidebar-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
              }}
            >
              Calculate Loan
            </button>
          </div>

          {/* Results */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
              Calculation Results
            </h4>
            
            {results ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{
                  backgroundColor: '#f0f9ff',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #bae6fd'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <DollarSign size={16} color="#0369a1" />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#0369a1' }}>
                      Monthly Payment
                    </span>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#0369a1' }}>
                    {formatPrice(results.monthlyPayment)}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f0fdf4',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #bbf7d0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Calendar size={16} color="#059669" />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#059669' }}>
                      Total Interest
                    </span>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>
                    {formatPrice(results.totalInterest)}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#fefce8',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #fde047'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Percent size={16} color="#ca8a04" />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#ca8a04' }}>
                      Loan-to-Value Ratio
                    </span>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#ca8a04' }}>
                    {results.loanToValueRatio.toFixed(1)}%
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f3f4f6',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #d1d5db'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Total Amount to Pay
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                    {formatPrice(results.totalAmount)}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <Calculator size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p style={{ fontSize: '14px', margin: 0 }}>
                  Enter loan details and click "Calculate Loan" to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}