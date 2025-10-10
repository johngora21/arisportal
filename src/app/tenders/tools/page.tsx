"use client";

import React from 'react';
import { 
  BarChart3,
  Target,
  Calculator,
  FileText,
  Users,
  Brain
} from 'lucide-react';

export default function TenderToolsPage() {
  const tools = [
    {
      id: "tender-analysis",
      title: "Tender Analysis",
      description: "Analyze tender requirements, competition, and success probability",
      icon: <BarChart3 size={32} color="var(--mc-sidebar-bg)" />,
      color: "#dbeafe",
      features: ["Competitor Analysis", "Success Probability", "Risk Assessment"]
    },
    {
      id: "bid-strategy",
      title: "Bid Strategy",
      description: "Develop winning strategies and pricing models for tenders",
      icon: <Target size={32} color="#10b981" />,
      color: "#dcfce7",
      features: ["Pricing Strategy", "Value Proposition", "Competitive Positioning"]
    },
    {
      id: "cost-estimation",
      title: "Cost Estimation",
      description: "Accurate cost calculation and budget planning tools",
      icon: <Calculator size={32} color="#f59e0b" />,
      color: "#fef3c7",
      features: ["Material Costs", "Labor Costs", "Overhead Calculation"]
    },
    {
      id: "document-management",
      title: "Document Management",
      description: "Manage tender documents, templates, and compliance",
      icon: <FileText size={32} color="#8b5cf6" />,
      color: "#ede9fe",
      features: ["Document Templates", "Compliance Check", "Version Control"]
    },
    {
      id: "team-collaboration",
      title: "Team Collaboration",
      description: "Coordinate team efforts and assign responsibilities",
      icon: <Users size={32} color="#ef4444" />,
      color: "#fee2e2",
      features: ["Task Assignment", "Progress Tracking", "Communication"]
    },
    {
      id: "win-probability",
      title: "Win Probability",
      description: "AI-powered prediction of tender success likelihood",
      icon: <Brain size={32} color="#06b6d4" />,
      color: "#cffafe",
      features: ["AI Analysis", "Historical Data", "Success Prediction"]
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
            Tender Tools
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            Advanced tools and modules to analyze, strategize, and win tenders
          </p>
        </div>

      </div>

      {/* Tools Grid */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
          Available Tools & Modules
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '24px' 
        }}>
          {tools.map((tool) => (
            <div 
              key={tool.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                padding: '24px',
                backgroundColor: 'white',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'var(--mc-sidebar-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: tool.color,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {tool.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    margin: '0 0 4px 0' 
                  }}>
                    {tool.title}
                  </h4>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {tool.description}
                  </p>
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: '0 0 8px 0' }}>
                  Key Features:
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {tool.features.map((feature, index) => (
                    <span 
                      key={index}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <button style={{
                width: '100%',
                padding: '10px 16px',
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
              }}>
                Open Tool
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
