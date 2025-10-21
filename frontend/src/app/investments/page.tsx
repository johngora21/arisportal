'use client';

import React from 'react';
import { TrendingUp, Landmark, Trees, Truck, Zap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InvestmentsPage() {
  const router = useRouter();

  const investmentCategories = [
    {
      id: 'real-estates',
      title: 'Real Estates',
      description: 'Invest in commercial and residential properties across Tanzania',
      icon: <Landmark size={48} />,
      href: '/real-estates',
      stats: {
        totalProjects: 12,
        averageROI: 18,
        totalValue: 'TZS 2.5B'
      },
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'agriculture',
      title: 'Agriculture',
      description: 'Sustainable farming projects including crops, livestock, and processing',
      icon: <Trees size={48} />,
      href: '/investments/agriculture',
      stats: {
        totalProjects: 8,
        averageROI: 22,
        totalValue: 'TZS 1.8B'
      },
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'logistics',
      title: 'Logistics',
      description: 'Transportation and supply chain infrastructure investments',
      icon: <Truck size={48} />,
      href: '/investments/logistics',
      stats: {
        totalProjects: 5,
        averageROI: 15,
        totalValue: 'TZS 1.2B'
      },
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'energy',
      title: 'Energy',
      description: 'Renewable energy projects and power infrastructure',
      icon: <Zap size={48} />,
      href: '/investments/energy',
      stats: {
        totalProjects: 3,
        averageROI: 25,
        totalValue: 'TZS 3.1B'
      },
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const handleCategoryClick = (href: string) => {
    router.push(href);
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
          Investment Opportunities
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
          Discover and invest in diverse projects across Tanzania
        </p>
      </div>

      {/* Investment Categories */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {investmentCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.href)}
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px 0 rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
            }}
          >
            {/* Category Icon */}
            <div style={{
              color: category.id === 'real-estates' ? '#3b82f6' :
                     category.id === 'agriculture' ? '#10b981' :
                     category.id === 'logistics' ? '#f59e0b' : '#eab308',
              marginBottom: '20px'
            }}>
              {category.icon}
            </div>

            {/* Category Title */}
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0'
            }}>
              {category.title}
            </h3>

            {/* Category Description */}
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.5',
              marginBottom: '24px'
            }}>
              {category.description}
            </p>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '4px'
                }}>
                  {category.stats.totalProjects}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Projects
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#059669',
                  marginBottom: '4px'
                }}>
                  {category.stats.averageROI}%
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Avg ROI
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '4px'
                }}>
                  {category.stats.totalValue}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Total Value
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: category.id === 'real-estates' ? '#3b82f6' :
                       category.id === 'agriculture' ? '#10b981' :
                       category.id === 'logistics' ? '#f59e0b' : '#eab308'
              }}>
                Explore Investments
              </span>
              <ArrowRight size={16} style={{
                color: category.id === 'real-estates' ? '#3b82f6' :
                       category.id === 'agriculture' ? '#10b981' :
                       category.id === 'logistics' ? '#f59e0b' : '#eab308'
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Investment Overview Stats */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid #e5e7eb',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 24px 0'
        }}>
          Investment Overview
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              28
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Total Projects
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#059669',
              marginBottom: '8px'
            }}>
              TZS 8.6B
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Total Investment Value
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '8px'
            }}>
              20%
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Average ROI
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '8px'
            }}>
              156
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Active Investors
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 24px 0'
        }}>
          Recent Investment Activity
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { project: 'Kilimanjaro Coffee Plantation', investor: 'John Mwalimu', amount: 'TZS 25M', date: '2 hours ago' },
            { project: 'Masaki Commercial Complex', investor: 'Sarah Kimaro', amount: 'TZS 50M', date: '4 hours ago' },
            { project: 'Arusha Dairy Farm', investor: 'Ahmed Hassan', amount: 'TZS 15M', date: '1 day ago' },
            { project: 'Morogoro Rice Farm', investor: 'Grace Mwangi', amount: 'TZS 30M', date: '2 days ago' }
          ].map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '4px'
                }}>
                  {activity.project}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  {activity.investor} invested {activity.amount}
                </div>
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                {activity.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
