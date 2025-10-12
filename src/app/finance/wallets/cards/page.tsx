'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CardsPage() {
  const router = useRouter();
  const [cardBalanceVisibility, setCardBalanceVisibility] = useState<Record<string, boolean>>({
    '1': true,
    '2': true,
    '3': true
  });

  // Mock data
  const cards = [
    { 
      id: '1', 
      type: 'visa', 
      name: 'Visa Platinum', 
      number: '**** **** **** 4532', 
      expiry: '12/26', 
      holder: 'John Doe',
      balance: 850000,
      status: 'active',
      color: 'blue'
    },
    { 
      id: '2', 
      type: 'visa', 
      name: 'Visa Gold', 
      number: '**** **** **** 7890', 
      expiry: '08/27', 
      holder: 'John Doe',
      balance: 1250000,
      status: 'active',
      color: 'gold'
    },
    { 
      id: '3', 
      type: 'visa', 
      name: 'Visa Business', 
      number: '**** **** **** 2468', 
      expiry: '03/28', 
      holder: 'John Doe',
      balance: 2100000,
      status: 'active',
      color: 'green'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          My Cards
        </h3>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'var(--mc-sidebar-bg-hover)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Add Card
        </button>
      </div>

      {/* Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => setCardBalanceVisibility(prev => ({
              ...prev,
              [card.id]: !prev[card.id]
            }))}
            style={{
              width: '340px',
              height: '214px',
              background: card.color === 'blue' 
                ? 'linear-gradient(135deg, var(--mc-sidebar-bg) 0%, #374151 50%, var(--mc-sidebar-bg-hover) 100%)'
                : card.color === 'gold'
                ? 'linear-gradient(135deg, #92400e 0%, #b45309 50%, #78350f 100%)'
                : 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #064e3b 100%)',
              borderRadius: '16px',
              padding: '20px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              opacity: '0.3'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-80px',
              width: '160px',
              height: '160px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
              opacity: '0.5'
            }} />

            {/* Card Network Logo */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '24px',
              fontWeight: '900',
              color: 'white'
            }}>
              <div style={{ 
                width: '60px', 
                height: '20px', 
                background: 'white', 
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color === 'blue' 
                  ? 'var(--mc-sidebar-bg)'
                  : card.color === 'gold'
                  ? '#b45309'
                  : '#064e3b',
                fontSize: '12px',
                fontWeight: '900',
                letterSpacing: '1px'
              }}>
                VISA
              </div>
            </div>

            {/* Chip */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '32px',
              height: '24px',
              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '24px',
                height: '18px',
                background: 'linear-gradient(135deg, #c9a96e 0%, #ffd700 50%, #c9a96e 100%)',
                borderRadius: '2px',
                border: '1px solid rgba(0, 0, 0, 0.2)'
              }} />
            </div>

            {/* Card Holder Name */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '14px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textAlign: 'center',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              {card.holder}
            </div>

            {/* Card Number */}
            <div style={{
              position: 'absolute',
              top: '70px',
              left: '20px',
              fontSize: '22px',
              fontWeight: '500',
              letterSpacing: '4px',
              fontFamily: 'monospace',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              {card.number}
            </div>

            {/* Balance */}
            <div style={{
              position: 'absolute',
              top: '110px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'center',
              opacity: '0.9'
            }}>
              {cardBalanceVisibility[card.id] ? formatCurrency(card.balance) : '••••••'}
            </div>

            {/* Expiry Date */}
            <div style={{
              position: 'absolute',
              bottom: '50px',
              left: '20px',
              fontSize: '12px',
              fontWeight: '400',
              opacity: '0.8'
            }}>
              VALID THRU
            </div>
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '20px',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              {card.expiry}
            </div>

            {/* CVV */}
            <div style={{
              position: 'absolute',
              bottom: '50px',
              right: '20px',
              fontSize: '12px',
              fontWeight: '400',
              opacity: '0.8'
            }}>
              CVV
            </div>
            <div style={{
              position: 'absolute',
              bottom: '30px',
              right: '20px',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              ***
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
