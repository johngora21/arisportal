'use client';

import React from 'react';

import { Property, Unit, Tenant, Payment, AssetStats } from '../types';

interface ReportsTabProps {
  properties: Property[];
  tenants: Tenant[];
  payments: Payment[];
  assetStats: AssetStats;
}

export default function ReportsTab({ properties, tenants, payments, assetStats }: ReportsTabProps) {
  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          Reports & Analytics
        </h3>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
          Detailed reports and analytics for property management
        </p>
      </div>

      {/* Report Filters */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
            Period
          </label>
          <select style={{
            padding: '12px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '20px',
            fontSize: '14px',
            backgroundColor: 'white',
            width: '180px'
          }}>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
            Property
          </label>
          <select style={{
            padding: '12px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '20px',
            fontSize: '14px',
            backgroundColor: 'white',
            width: '180px'
          }}>
            <option>All Properties</option>
            <option>Sunrise Apartments</option>
            <option>Downtown Plaza</option>
            <option>Garden Villas</option>
          </select>
        </div>
      </div>

      {/* Financial Performance Chart */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '24px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Revenue Trend (Last 6 Months)
          </h4>
        </div>
        
        {/* Mock Chart */}
        <div style={{ 
          height: '300px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e2e8f0',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Revenue Chart
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Interactive chart showing monthly revenue trends
            </div>
          </div>
          
          {/* Mock Chart Bars */}
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            left: '20px', 
            right: '20px',
            display: 'flex',
            alignItems: 'end',
            gap: '8px',
            height: '200px'
          }}>
            {[120, 135, 110, 145, 160, 175].map((height, index) => (
              <div key={index} style={{
                flex: 1,
                backgroundColor: '#3b82f6',
                height: `${height}px`,
                borderRadius: '4px 4px 0 0',
                opacity: 0.8
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Occupancy Analysis */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Occupancy Analysis by Property
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {properties.map((property) => {
              // Mock unit data for reports
              const mockUnits = [
                { id: '1', propertyId: '1', status: 'occupied' },
                { id: '2', propertyId: '1', status: 'occupied' },
                { id: '3', propertyId: '1', status: 'vacant' },
                { id: '4', propertyId: '2', status: 'occupied' },
                { id: '5', propertyId: '2', status: 'occupied' },
                { id: '6', propertyId: '3', status: 'occupied' },
                { id: '7', propertyId: '3', status: 'occupied' }
              ];
              
              const propertyUnits = mockUnits.filter(u => u.propertyId === property.id);
              const occupiedUnits = propertyUnits.filter(u => u.status === 'occupied').length;
              const occupancyRate = propertyUnits.length > 0 ? (occupiedUnits / propertyUnits.length) * 100 : 0;
              
              return (
                <div key={property.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      {property.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {occupiedUnits} of {propertyUnits.length} units
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {occupancyRate.toFixed(1)}%
                    </div>
                    <div style={{ 
                      width: '60px', 
                      height: '4px', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '2px',
                      marginTop: '4px'
                    }}>
                      <div style={{ 
                        width: `${occupancyRate}%`, 
                        height: '100%', 
                        backgroundColor: occupancyRate > 80 ? '#10b981' : occupancyRate > 60 ? '#f59e0b' : '#ef4444',
                        borderRadius: '2px'
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Status Breakdown */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Payment Status Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>On Time</span>
              </div>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>85%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>Late (1-7 days)</span>
              </div>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>10%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>Overdue (7+ days)</span>
              </div>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>5%</span>
            </div>
          </div>
          
          {/* Pie Chart Mock */}
          <div style={{ 
            marginTop: '20px', 
            height: '120px', 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🥧</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Payment Status Chart</div>
            </div>
          </div>
        </div>

        {/* Top Performing Properties */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Top Performing Properties
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {properties.slice(0, 3).map((property, index) => (
              <div key={property.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : '#cd7c2f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      {property.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {property.type.replace('-', ' ')}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    TZS {(property.monthlyRent * 0.8).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Monthly Revenue
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
