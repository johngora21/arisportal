'use client';

import React, { useState } from 'react';
import { X, MapPin, DollarSign, Users, TrendingUp, Calendar, Building2, Play, Image, FileText, Clock, CheckCircle } from 'lucide-react';
import { InvestmentProject } from '../models';

interface RealEstateProjectDetailsModalProps {
  project: InvestmentProject | null;
  onClose: () => void;
}

export default function RealEstateProjectDetailsModal({ project, onClose }: RealEstateProjectDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderOverviewTab = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Project Overview
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Project Type
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Duration
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {project.duration}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Expected ROI
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
              {project.expectedROI}%
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Development Stage
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {project.developmentStage}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Investment Details
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Total Project Value
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {formatPrice(project.totalProjectValue)}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Minimum Investment
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#3b82f6' }}>
              {formatPrice(project.minimumInvestment)}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Current Investors
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {project.currentInvestors}/{project.targetInvestors}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Funding Progress
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
              {project.fundingProgress}%
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Investment Deadline
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {project.investmentDeadline}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Location Details
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Location
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {project.location}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Land Size
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {project.landSize}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Zoning
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {project.zoning}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Access
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {project.access}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Project Description
        </h3>
        <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
          {(project as any).description || 'No description available'}
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Project Features
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          {project.features.map((feature, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}
            >
              <CheckCircle size={16} color="#10b981" />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetailsTab = () => (
    <div style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
        Detailed Information
      </h3>
      
      {/* Project Specifications */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
          Project Specifications
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Building Type
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {project.category === 'residential' ? 'Residential Complex' : 
               project.category === 'commercial' ? 'Commercial Building' : 'Mixed-Use Development'}
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Construction Method
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              Modern Steel Frame Construction
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Energy Efficiency Rating
            </label>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              A+ (Green Building Certified)
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Parking Spaces
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              {project.category === 'residential' ? '150 Spaces' : 
               project.category === 'commercial' ? '200 Spaces' : '300 Spaces'}
            </span>
          </div>
        </div>
      </div>

      {/* Legal & Compliance */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
          Legal & Compliance
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Building Permits
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
              ✓ Approved & Valid
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Environmental Impact Assessment
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
              ✓ Completed
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Fire Safety Compliance
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
              ✓ Certified
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Accessibility Standards
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
              ✓ ADA Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Market Analysis */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
          Market Analysis
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Local Market Growth Rate
            </label>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              8.5% Annually
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Average Rental Yield
            </label>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              12-15%
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Property Appreciation Rate
            </label>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              6-8% Annually
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Occupancy Rate (Similar Properties)
            </label>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              95%+
            </span>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
          Risk Assessment
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Market Risk
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
              Low Risk
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Construction Risk
            </label>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              Medium Risk
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Regulatory Risk
            </label>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
              Low Risk
            </span>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Overall Risk Rating
            </label>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              Low-Medium Risk
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialTab = () => {
    // Calculate financial projections based on project data
    const annualRentalIncome = project.totalProjectValue * 0.12; // 12% rental yield
    const annualOperatingExpenses = annualRentalIncome * 0.25; // 25% of rental income
    const netOperatingIncome = annualRentalIncome - annualOperatingExpenses;
    const annualCashFlow = netOperatingIncome * (project.minimumInvestment / project.totalProjectValue);
    const totalReturn = annualCashFlow * 5; // 5-year projection
    const totalROI = (totalReturn / project.minimumInvestment) * 100;

    return (
      <div style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Financial Projections
        </h3>
        
        {/* Investment Summary */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
            Investment Summary
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Your Investment Amount
              </label>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                {formatPrice(project.minimumInvestment)}
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Expected Annual Return
              </label>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
                {project.expectedROI}%
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Projected 5-Year Return
              </label>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                {formatPrice(totalReturn)}
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Total ROI (5 Years)
              </label>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                {totalROI.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Annual Cash Flow Projection */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
            Annual Cash Flow Projection
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Gross Rental Income
              </label>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
                {formatPrice(annualRentalIncome)}
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Operating Expenses
              </label>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                {formatPrice(annualOperatingExpenses)}
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Net Operating Income
              </label>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#3b82f6' }}>
                {formatPrice(netOperatingIncome)}
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Your Annual Cash Flow
              </label>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
                {formatPrice(annualCashFlow)}
              </span>
            </div>
          </div>
        </div>

        {/* 5-Year Projection Table */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
            5-Year Investment Projection
          </h4>
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              backgroundColor: '#f3f4f6',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              <div>Year</div>
              <div>Annual Cash Flow</div>
              <div>Cumulative Return</div>
              <div>Property Value</div>
              <div>Total Value</div>
            </div>
            {[1, 2, 3, 4, 5].map((year) => {
              const yearCashFlow = annualCashFlow * Math.pow(1.05, year - 1); // 5% growth
              const cumulativeReturn = annualCashFlow * year;
              const propertyAppreciation = project.minimumInvestment * Math.pow(1.07, year); // 7% appreciation
              const totalValue = cumulativeReturn + propertyAppreciation;
              
              return (
                <div key={year} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#6b7280',
                  borderBottom: year < 5 ? '1px solid #e5e7eb' : 'none'
                }}>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>Year {year}</div>
                  <div style={{ color: '#1f2937', fontWeight: '600' }}>{formatPrice(yearCashFlow)}</div>
                  <div style={{ color: '#1f2937', fontWeight: '600' }}>{formatPrice(cumulativeReturn)}</div>
                  <div style={{ color: '#1f2937', fontWeight: '600' }}>{formatPrice(propertyAppreciation)}</div>
                  <div style={{ color: '#1f2937', fontWeight: '600' }}>{formatPrice(totalValue)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Factors */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
            Financial Risk Factors
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Interest Rate Risk
              </label>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                Medium Impact
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Market Volatility
              </label>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
                Low Impact
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Liquidity Risk
              </label>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                Medium Impact
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Inflation Hedge
              </label>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
                Strong Protection
              </span>
            </div>
          </div>
        </div>

        {/* Investment Timeline */}
        <div>
          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
            Investment Timeline & Milestones
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                First Distribution
              </label>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                Month 6
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Quarterly Distributions
              </label>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                After Month 6
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Project Completion
              </label>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                {project.duration}
              </span>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Exit Strategy
              </label>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                Year 5-7
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProgressTab = () => {
    // Mock progress data - in real app this would come from API
    const progressUpdates = [
      {
        id: 1,
        date: '2024-01-15',
        title: 'Project Launch & Site Survey',
        description: 'Successfully launched the real estate investment project and completed comprehensive site survey.',
        status: 'completed',
        media: [
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Site survey completed' },
          { type: 'video', url: '/api/placeholder/400/300', caption: 'Project overview video' }
        ]
      },
      {
        id: 2,
        date: '2024-02-01',
        title: 'Permits & Design Approval',
        description: 'Obtained all necessary building permits and completed architectural design approval process.',
        status: 'completed',
        media: [
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Building permits approved' },
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Architectural designs finalized' }
        ]
      },
      {
        id: 3,
        date: '2024-02-15',
        title: 'Ground Breaking & Site Preparation',
        description: 'Official ground breaking ceremony held. Site preparation and excavation work commenced.',
        status: 'completed',
        media: [
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Ground breaking ceremony' },
          { type: 'video', url: '/api/placeholder/400/300', caption: 'Site preparation progress' }
        ]
      },
      {
        id: 4,
        date: '2024-03-01',
        title: 'Foundation & Structure Work',
        description: 'Foundation concrete pouring completed successfully. Structural steel installation in progress.',
        status: 'in-progress',
        media: [
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Foundation work completed' },
          { type: 'image', url: '/api/placeholder/400/300', caption: 'Steel structure installation' }
        ]
      },
      {
        id: 5,
        date: '2024-03-15',
        title: 'Expected Completion Phase',
        description: 'Preparing for final construction phase. Interior work and finishing touches scheduled.',
        status: 'pending',
        media: []
      }
    ];

    return (
      <div style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
          Real-Time Progress Tracking
        </h3>
        
        {/* Overall Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              Overall Project Progress
            </h4>
            <span style={{ fontSize: '14px', color: '#059669', fontWeight: '600' }}>
              {project.fundingProgress}% Complete
            </span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${project.fundingProgress}%`,
              height: '100%',
              backgroundColor: '#059669',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Progress Timeline */}
        <div style={{ position: 'relative' }}>
          {progressUpdates.map((update, index) => (
            <div key={update.id} style={{ marginBottom: '32px', position: 'relative' }}>
              {/* Timeline Line */}
              {index < progressUpdates.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '20px',
                  top: '40px',
                  bottom: '-32px',
                  width: '2px',
                  backgroundColor: '#e5e7eb'
                }} />
              )}
              
              {/* Timeline Dot */}
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '12px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: update.status === 'completed' ? '#059669' : 
                                 update.status === 'in-progress' ? '#f59e0b' : '#e5e7eb',
                border: '3px solid white',
                boxShadow: '0 0 0 2px #e5e7eb'
              }} />
              
              {/* Content */}
              <div style={{ marginLeft: '48px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>
                      {update.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      {update.date}
                    </p>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    backgroundColor: update.status === 'completed' ? '#dcfce7' : 
                                   update.status === 'in-progress' ? '#fef3c7' : '#f3f4f6',
                    color: update.status === 'completed' ? '#059669' : 
                           update.status === 'in-progress' ? '#f59e0b' : '#6b7280'
                  }}>
                    {update.status}
                  </div>
                </div>
                
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '16px' }}>
                  {update.description}
                </p>
                
                {/* Media Gallery */}
                {update.media.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px'
                  }}>
                    {update.media.map((media, mediaIndex) => (
                      <div key={mediaIndex} style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          height: '120px',
                          backgroundColor: '#f3f4f6',
                          backgroundImage: `url(${media.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {media.type === 'video' ? (
                            <Play size={32} color="#6b7280" />
                          ) : (
                            <Image size={32} color="#6b7280" />
                          )}
                        </div>
                        <div style={{ padding: '8px 12px' }}>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                            {media.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
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
        width: '90%',
        height: '90%',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {project.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#6b7280" />
              <span style={{ fontSize: '16px', color: '#6b7280' }}>
                {project.location}
              </span>
              <div style={{
                marginLeft: '16px',
                padding: '4px 12px',
                backgroundColor: '#dcfce7',
                color: '#059669',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {project.status}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'details', label: 'Details' },
            { id: 'financial', label: 'Financial' },
            { id: 'progress', label: 'Progress' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '16px 20px',
                backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#1f2937' : '#6b7280',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderBottom: activeTab === tab.id ? '2px solid var(--mc-sidebar-bg)' : '2px solid transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'financial' && renderFinancialTab()}
          {activeTab === 'progress' && renderProgressTab()}
        </div>
      </div>
    </div>
  );
}
