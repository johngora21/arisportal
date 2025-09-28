'use client';

import React from 'react';
import { Tenant, Property, Unit } from '../types';

interface LeaseManagementTabProps {
  // No props needed for this component
}

export default function LeaseManagementTab({}: LeaseManagementTabProps) {
  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          Lease Management
        </h3>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
          Smart contract templates and lease automation
        </p>
      </div>
      
      {/* Smart Contract Templates */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Smart Contract Templates
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Residential Lease Template */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}>
                🏠
              </div>
              <div>
                <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Residential Lease
                </h5>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Standard residential rental agreement
                </p>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Features:</div>
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                • Automatic rent collection<br/>
                • Late fee enforcement<br/>
                • Maintenance request handling<br/>
                • Lease renewal automation
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Deploy Template
              </button>
              <button style={{
                padding: '10px 16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: '#374151'
              }}>
                Preview
              </button>
            </div>
          </div>

          {/* Commercial Lease Template */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}>
                🏢
              </div>
              <div>
                <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Commercial Lease
                </h5>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Business rental agreement
                </p>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Features:</div>
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                • Escalation clauses<br/>
                • CAM charges automation<br/>
                • Compliance monitoring<br/>
                • Business hour restrictions
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Deploy Template
              </button>
              <button style={{
                padding: '10px 16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: '#374151'
              }}>
                Preview
              </button>
            </div>
          </div>

          {/* Short-term Lease Template */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}>
                ⏰
              </div>
              <div>
                <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Short-term Lease
                </h5>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Flexible short-term rental
                </p>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Features:</div>
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                • Flexible payment terms<br/>
                • Quick termination options<br/>
                • Security deposit automation<br/>
                • Guest policy enforcement
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Deploy Template
              </button>
              <button style={{
                padding: '10px 16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: '#374151'
              }}>
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Smart Contracts */}
      <div>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Active Smart Contracts
        </h4>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Deployed Contracts
              </h5>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                Currently active smart contracts managing leases
              </p>
            </div>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              View All
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {/* Mock active smart contracts */}
            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  John Mwalimu
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Sunrise Apartments • Unit A1
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Contract ID: SC-0001
              </div>
            </div>
            
            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Sarah Kimaro
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Sunrise Apartments • Unit A2
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Contract ID: SC-0002
              </div>
            </div>
            
            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Mike Johnson
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Business Plaza • Office 1
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Contract ID: SC-0003
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
