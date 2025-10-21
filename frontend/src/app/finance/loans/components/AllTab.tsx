import React from 'react';
import { Building, FileText, Target, DollarSign, MapPin, CheckCircle, Clock, XCircle, Banknote } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  type: 'land' | 'house' | 'apartment' | 'commercial';
  location: string;
  value: number;
  verificationStatus: 'approved' | 'pending' | 'rejected';
  acquisitionDate: string;
  image: string;
}

interface LoanApplication {
  id: string;
  propertyId: string;
  propertyTitle: string;
  requestedAmount: number;
  propertyValue: number;
  loanToValueRatio: number;
  creditScore: number;
  monthlyIncome: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  applicationDate: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  notes?: string;
}

interface AllTabProps {
  myProperties: Property[];
  myLoanApplications: LoanApplication[];
  onApplyForLoan: (property: Property) => void;
}

export default function AllTab({ myProperties, myLoanApplications, onApplyForLoan }: AllTabProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      case 'disbursed': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending Review';
      case 'rejected': return 'Rejected';
      case 'disbursed': return 'Disbursed';
      default: return 'Unknown';
    }
  };

  return (
    <div>
      {/* Recent Applications */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Recent Applications
          </h3>
        </div>
        
        {myLoanApplications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              No Applications Yet
            </h4>
            <p style={{ fontSize: '14px', margin: 0 }}>
              Apply for a loan using your verified properties as collateral.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {myLoanApplications.slice(0, 3).map((application) => (
              <div
                key={application.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '20px',
                  padding: '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                      {application.propertyTitle}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                      Applied on {new Date(application.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: getStatusColor(application.status),
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {application.status === 'approved' && <CheckCircle size={10} />}
                    {application.status === 'pending' && <Clock size={10} />}
                    {application.status === 'rejected' && <XCircle size={10} />}
                    {application.status === 'disbursed' && <Banknote size={10} />}
                    {getStatusText(application.status)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Requested</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                      {formatPrice(application.requestedAmount)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Monthly Payment</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                      {formatPrice(application.monthlyPayment)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Interest Rate</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                      {application.interestRate}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Properties */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Available Properties
          </h3>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {myProperties.map((property) => (
            <div
              key={property.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {property.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#6b7280" />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {property.location}
                    </span>
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  backgroundColor: property.verificationStatus === 'approved' ? '#dcfce7' : 
                                 property.verificationStatus === 'pending' ? '#fef3c7' : '#fee2e2',
                  color: property.verificationStatus === 'approved' ? '#166534' :
                         property.verificationStatus === 'pending' ? '#92400e' : '#dc2626',
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  {property.verificationStatus}
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#059669', marginBottom: '4px' }}>
                  {formatPrice(property.value)}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Max Loan: {formatPrice(property.value * 0.7)}
                </div>
              </div>

              <button 
                onClick={() => onApplyForLoan(property)}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: 'var(--mc-sidebar-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
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
                Apply for Loan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

