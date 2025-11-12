'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Currency {
  code: string;
  name: string;
  flag: string;
  locale?: string;
}

interface CurrencyContextType {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  currencies: Currency[];
  formatCurrency: (amount: number, options?: { showSymbol?: boolean }) => string;
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => number;
  getExchangeRate: (fromCurrency: string, toCurrency: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates relative to USD (base currency)
// These are approximate rates - in production, you'd fetch these from an API
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  TZS: 2300, // 1 USD = 2300 TZS
  KES: 130,  // 1 USD = 130 KES
  RWF: 1300, // 1 USD = 1300 RWF
  ZAR: 18,   // 1 USD = 18 ZAR
  ZMW: 25,   // 1 USD = 25 ZMW
  MWK: 1700, // 1 USD = 1700 MWK
  NGN: 1600, // 1 USD = 1600 NGN
  EGP: 30,   // 1 USD = 30 EGP
  AED: 3.67, // 1 USD = 3.67 AED
  QAR: 3.64, // 1 USD = 3.64 QAR
  SAR: 3.75, // 1 USD = 3.75 SAR
  EUR: 0.92, // 1 USD = 0.92 EUR
  GBP: 0.79, // 1 USD = 0.79 GBP
};

// Currency locale mappings for proper formatting
const CURRENCY_LOCALES: Record<string, string> = {
  TZS: 'en-TZ',
  KES: 'en-KE',
  RWF: 'en-RW',
  ZAR: 'en-ZA',
  ZMW: 'en-ZM',
  MWK: 'en-MW',
  NGN: 'en-NG',
  EGP: 'en-EG',
  AED: 'en-AE',
  QAR: 'en-QA',
  SAR: 'en-SA',
  EUR: 'de-DE', // Use a European locale for EUR
  GBP: 'en-GB',
  USD: 'en-US',
};

const CURRENCIES: Currency[] = [
  { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪', locale: 'en-KE' },
  { code: 'RWF', name: 'Rwanda Franc', flag: '🇷🇼', locale: 'en-RW' },
  { code: 'TZS', name: 'Tanzania Shilling', flag: '🇹🇿', locale: 'en-TZ' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦', locale: 'en-ZA' },
  { code: 'ZMW', name: 'Zambian Kwacha', flag: '🇿🇲', locale: 'en-ZM' },
  { code: 'MWK', name: 'Malawian Kwacha', flag: '🇲🇼', locale: 'en-MW' },
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬', locale: 'en-NG' },
  { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬', locale: 'en-EG' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', locale: 'en-AE' },
  { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦', locale: 'en-QA' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', locale: 'en-SA' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', locale: 'en-GB' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', locale: 'en-US' },
];

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrencyState] = useState<string>('TZS');

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && CURRENCIES.find(c => c.code === savedCurrency)) {
      setSelectedCurrencyState(savedCurrency);
    }
  }, []);

  // Save currency to localStorage when it changes
  const setSelectedCurrency = (currency: string) => {
    setSelectedCurrencyState(currency);
    localStorage.setItem('selectedCurrency', currency);
  };

  // Get exchange rate between two currencies
  const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return 1;
    
    const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
    const toRate = EXCHANGE_RATES[toCurrency] || 1;
    
    // Convert from fromCurrency to USD, then from USD to toCurrency
    return toRate / fromRate;
  };

  // Convert amount from one currency to another
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    const rate = getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  };

  // Format currency with selected currency
  const formatCurrency = (amount: number, options?: { showSymbol?: boolean }): string => {
    const currency = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[2]; // Default to TZS
    const locale = currency.locale || CURRENCY_LOCALES[selectedCurrency] || 'en-US';
    
    // Assume all amounts in the system are stored in TZS (base currency)
    // Convert to selected currency
    const convertedAmount = convertCurrency(amount, 'TZS', selectedCurrency);
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: selectedCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(convertedAmount);
    } catch (error) {
      // Fallback formatting
      return `${selectedCurrency} ${convertedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    setSelectedCurrency,
    currencies: CURRENCIES,
    formatCurrency,
    convertCurrency,
    getExchangeRate,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};



