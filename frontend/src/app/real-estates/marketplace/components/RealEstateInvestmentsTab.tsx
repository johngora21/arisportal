'use client';

import React from 'react';
import { TrendingUp, MapPin, DollarSign, Calendar } from 'lucide-react';

export default function RealEstateInvestmentsTab() {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <TrendingUp size={48} color="#6b7280" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
          Real Estate Investments
        </h3>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Investment opportunities coming soon
        </p>
      </div>
    </div>
  );
}
