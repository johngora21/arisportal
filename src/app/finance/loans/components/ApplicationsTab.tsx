import React from 'react';
import { FileText, CheckCircle, Clock, XCircle, Banknote } from 'lucide-react';

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

interface ApplicationsTabProps {
  myLoanApplications: LoanApplication[];
}

export default function ApplicationsTab({ myLoanApplications }: ApplicationsTabProps) {
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
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Loan Applications
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
          <div style={{ display: 'grid', gap: '24px' }}>
            {myLoanApplications.map((application) => (
              <div
                key={application.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '20px',
                  padding: '24px',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                      {application.propertyTitle}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      Applied on {new Date(application.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    backgroundColor: getStatusColor(application.status),
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {application.status === 'approved' && <CheckCircle size={12} />}
                    {application.status === 'pending' && <Clock size={12} />}
                    {application.status === 'rejected' && <XCircle size={12} />}
                    {application.status === 'disbursed' && <Banknote size={12} />}
                    {getStatusText(application.status)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Requested Amount</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
                      {formatPrice(application.requestedAmount)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Monthly Payment</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {formatPrice(application.monthlyPayment)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Interest Rate</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {application.interestRate}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Term</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {application.termMonths} months
                    </div>
                  </div>
                </div>

                {application.notes && (
                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Notes:</div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>{application.notes}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

