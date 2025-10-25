'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface CategoryInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  transactionType?: string; // Add transaction type to filter categories
}

// All categories organized by type
const CATEGORIES = {
  'Revenue': [
    'Product Sales',
    'Service Income',
    'Subscription Fees',
    'Commission Income',
    'Rental Income',
    'Interest Income',
    'Discounts / Returns',
    'Other Income'
  ],
  'Expenses': [
    'Salaries & Wages',
    'Rent',
    'Utilities',
    'Office Supplies',
  
    'Marketing & Advertising',
    'Transport & Travel',
    'Repairs & Maintenance',
    'Insurance',
    'Depreciation & Amortization',
    'Interest Expense',
    'Taxes & Licenses',
    'Miscellaneous Expenses'
  ],
  'Assets': [
    'Cash & Cash Equivalents',
    'Bank Accounts',
    'Accounts Receivable',
    'Inventory / Stock',
    'Prepaid Expenses',
    'Land & Buildings',
    'Machinery & Equipment',
    'Vehicles',
    'Office Equipment',
    'Computer Equipment',
    'Furniture & Fixtures',
    'Tools & Instruments',
    'Intangible Assets',
    'Patents & Trademarks',
    'Software Licenses',
    'Investments',
    'Deposits & Guarantees',
    'Work in Progress'
  ],
  'Liabilities': [
    'Accounts Payable',
    'Short-Term Loans',
    'Accrued Expenses',
    'Long-Term Loans',
    'Taxes Payable',
    'Pension Obligations',
    'Lease Liabilities',
    'Deferred Revenue'
  ],
  'Equity': [
    'Owner\'s Capital / Share Capital',
    'Retained Earnings',
    'Current Year Profit / Loss',
    'Drawings / Owner Withdrawals',
    'Revaluation Surplus',
    'Reserves'
  ],
  'Transfers': [
    'Bank to Bank Transfer',
    'Cash to Bank / Bank to Cash',
    'Petty Cash Refill',
    'Internal Account Adjustment',
    'Currency Exchange Gain/Loss'
  ],
  'Other': [
    'Donations / Grants',
    'Asset Disposal Gain or Loss',
    'Penalties / Fines',
    'Write-offs',
    'Rounding Differences',
    'Opening Balances',
    'Prior Year Adjustments'
  ]
};

// Flatten all categories for easier searching
const ALL_CATEGORIES = Object.values(CATEGORIES).flat();

const CategoryInput: React.FC<CategoryInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Select or type category (optional)...",
  style = {},
  transactionType
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Array<{type: string, category: string}>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter categories based on search term and transaction type
  useEffect(() => {
    let categoriesToFilter = Object.entries(CATEGORIES);
    
    // Filter by transaction type if provided
    if (transactionType) {
      const typeMapping: Record<string, string[]> = {
        'revenue': ['Revenue'],
        'expense': ['Expenses'],
        'asset': ['Assets'],
        'liability': ['Liabilities'],
        'equity': ['Equity'],
        'transfer': ['Transfers'],
        'other': ['Other']
      };
      
      const allowedTypes = typeMapping[transactionType] || Object.keys(CATEGORIES);
      categoriesToFilter = categoriesToFilter.filter(([type]) => allowedTypes.includes(type));
    }
    
    if (searchTerm.trim() === '') {
      // Show all categories grouped by type
      const grouped: Array<{type: string, category: string}> = [];
      categoriesToFilter.forEach(([type, categories]) => {
        categories.forEach(category => {
          grouped.push({ type, category });
        });
      });
      setFilteredCategories(grouped);
    } else {
      // Filter categories that match search term
      const filtered: Array<{type: string, category: string}> = [];
      categoriesToFilter.forEach(([type, categories]) => {
        categories.forEach(category => {
          if (category.toLowerCase().includes(searchTerm.toLowerCase())) {
            filtered.push({ type, category });
          }
        });
      });
      setFilteredCategories(filtered);
    }
  }, [searchTerm, transactionType]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    onChange(category);
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
    if (value && !searchTerm) {
      setSearchTerm(value);
    }
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent) => {
    // Delay closing to allow clicking on suggestions
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }, 150);
  };

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Clear input
  const handleClear = () => {
    onChange('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  // Highlight matching text
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: '#fef3c7', fontWeight: '600' }}>
          {part}
        </span>
      ) : part
    );
  };

  // Group filtered categories by type
  const groupedFiltered = filteredCategories.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item.category);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm || value}
          onChange={handleInputChange}
          onFocus={(e) => {
            handleFocus();
            e.target.style.borderColor = 'var(--mc-sidebar-bg)';
            e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
          }}
          onBlur={(e) => {
            handleBlur(e);
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px 40px 12px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '20px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease',
            backgroundColor: 'white',
            boxSizing: 'border-box'
          }}
        />
        
        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '30px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            <X size={14} />
          </button>
        )}
        
        {/* Dropdown arrow */}
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9ca3af',
          pointerEvents: 'none'
        }}>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Dropdown suggestions */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 1000,
            maxHeight: '300px',
            overflowY: 'auto',
            marginTop: '4px'
          }}
        >
          {Object.keys(groupedFiltered).length === 0 ? (
            <div style={{
              padding: '12px 16px',
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center',
              borderBottom: '1px solid #f3f4f6'
            }}>
              No specific categories found
            </div>
          ) : null}
          
          {/* Always show "Other" option */}
          <div style={{
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #f3f4f6',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            General
          </div>
          
          <button
            type="button"
            onClick={() => handleCategorySelect('Other')}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              textAlign: 'left',
              fontSize: '14px',
              color: '#374151',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              borderBottom: '1px solid #f9fafb'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Other
          </button>
          
          {Object.keys(groupedFiltered).length > 0 && (
            Object.entries(groupedFiltered).map(([type, categories]) => (
              <div key={type}>
                {/* Type header */}
                <div style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #f3f4f6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {type}
                </div>
                
                {/* Categories */}
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      borderBottom: '1px solid #f9fafb'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {highlightText(category, searchTerm)}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryInput;
