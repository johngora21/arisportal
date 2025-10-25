'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { buildApiUrl } from '../../../../config/api';

interface Transaction {
  id: number;
  transaction_id: string;
  description: string;
  type: string;
  category: string;
  amount: number;
  payment_method: string;
  reference: string;
  account: string;
  notes: string;
  created_by: string;
  is_reconciled: boolean;
  reconciled_at: string | null;
  reconciled_by: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string | null;
}

interface IncomeStatementData {
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  interestExpense: number;
  incomeTax: number;
  netIncome: number;
}

interface BalanceSheetData {
  assets: {
    currentAssets: number;
    fixedAssets: number;
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: number;
    longTermLiabilities: number;
    totalLiabilities: number;
  };
  equity: {
    ownerEquity: number;
    retainedEarnings: number;
    totalEquity: number;
  };
}

interface CashFlowData {
  operatingActivities: {
    netIncome: number;
    depreciation: number;
    accountsReceivable: number;
    inventory: number;
    accountsPayable: number;
    netOperatingCash: number;
  };
  investingActivities: {
    equipmentPurchases: number;
    assetSales: number;
    netInvestingCash: number;
  };
  financingActivities: {
    loanProceeds: number;
    loanPayments: number;
    ownerWithdrawals: number;
    netFinancingCash: number;
  };
  netCashFlow: number;
}

const Accounting: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState('2025-10'); // Default to month with sample data
  const [statementType, setStatementType] = useState<'income_statement' | 'balance_sheet' | 'cash_flow'>('income_statement');
  
  const [incomeData, setIncomeData] = useState<IncomeStatementData>({
    revenue: 0,
    costOfGoodsSold: 0,
    grossProfit: 0,
    operatingExpenses: 0,
    operatingIncome: 0,
    interestExpense: 0,
    incomeTax: 0,
    netIncome: 0
  });

  const [balanceData, setBalanceData] = useState<BalanceSheetData>({
    assets: { currentAssets: 0, fixedAssets: 0, totalAssets: 0 },
    liabilities: { currentLiabilities: 0, longTermLiabilities: 0, totalLiabilities: 0 },
    equity: { ownerEquity: 0, retainedEarnings: 0, totalEquity: 0 }
  });

  const [cashFlowData, setCashFlowData] = useState<CashFlowData>({
    operatingActivities: {
      netIncome: 0,
      depreciation: 0,
      accountsReceivable: 0,
      inventory: 0,
      accountsPayable: 0,
      netOperatingCash: 0
    },
    investingActivities: {
      equipmentPurchases: 0,
      assetSales: 0,
      netInvestingCash: 0
    },
    financingActivities: {
      loanProceeds: 0,
      loanPayments: 0,
      ownerWithdrawals: 0,
      netFinancingCash: 0
    },
    netCashFlow: 0
  });

  const formatPrice = (amount: number) => new Intl.NumberFormat('en-TZ', {
    style: 'currency', 
    currency: 'TZS', 
    minimumFractionDigits: 0
  }).format(amount);

  const calculateIncomeStatement = (transactions: Transaction[], month: string) => {
    const filteredTransactions = transactions.filter(t => 
      t.transaction_date.startsWith(month)
    );

    let revenue = 0;
    let costOfGoodsSold = 0;
    let operatingExpenses = 0;
    let interestExpense = 0;
    let incomeTax = 0;

    filteredTransactions.forEach(transaction => {
      const amount = transaction.amount;
      
      switch (transaction.type.toLowerCase()) {
        case 'revenue':
          revenue += amount;
          break;
        case 'expense':
          const category = transaction.category.toLowerCase();
          if (category.includes('cost') || category.includes('goods') || category.includes('inventory')) {
            costOfGoodsSold += amount;
          } else if (category.includes('interest')) {
            interestExpense += amount;
          } else if (category.includes('tax')) {
            incomeTax += amount;
          } else {
            operatingExpenses += amount;
          }
          break;
      }
    });

    const grossProfit = revenue - costOfGoodsSold;
    const operatingIncome = grossProfit - operatingExpenses;
    const netIncome = operatingIncome - interestExpense - incomeTax;

    return {
      revenue,
      costOfGoodsSold,
      grossProfit,
      operatingExpenses,
      operatingIncome,
      interestExpense,
      incomeTax,
      netIncome
    };
  };

  const calculateBalanceSheet = (transactions: Transaction[], month: string) => {
    const filteredTransactions = transactions.filter(t => 
      t.transaction_date.slice(0, 7) <= month
    );

    let currentAssets = 0;
    let fixedAssets = 0;
    let currentLiabilities = 0;
    let longTermLiabilities = 0;
    let ownerEquity = 0;
    let retainedEarnings = 0;

    filteredTransactions.forEach(transaction => {
      const amount = transaction.amount;
      
      switch (transaction.type.toLowerCase()) {
        case 'asset':
          const category = transaction.category.toLowerCase();
          if (category.includes('cash') || category.includes('bank') || category.includes('receivable') || 
              category.includes('inventory') || category.includes('prepaid')) {
            currentAssets += amount;
          } else {
            fixedAssets += amount;
          }
          break;
        case 'liability':
          const liabilityCategory = transaction.category.toLowerCase();
          if (liabilityCategory.includes('payable') || liabilityCategory.includes('short') || 
              liabilityCategory.includes('accrued')) {
            currentLiabilities += amount;
          } else {
            longTermLiabilities += amount;
          }
          break;
        case 'equity':
          const equityCategory = transaction.category.toLowerCase();
          if (equityCategory.includes('capital') || equityCategory.includes('owner')) {
            ownerEquity += amount;
          } else {
            retainedEarnings += amount;
          }
          break;
        case 'revenue':
          retainedEarnings += amount;
          break;
        case 'expense':
          retainedEarnings -= amount;
          break;
      }
    });

    const totalAssets = currentAssets + fixedAssets;
    const totalLiabilities = currentLiabilities + longTermLiabilities;
    const totalEquity = ownerEquity + retainedEarnings;

    return {
      assets: { currentAssets, fixedAssets, totalAssets },
      liabilities: { currentLiabilities, longTermLiabilities, totalLiabilities },
      equity: { ownerEquity, retainedEarnings, totalEquity }
    };
  };

  const calculateCashFlow = (transactions: Transaction[], month: string) => {
    const filteredTransactions = transactions.filter(t => 
      t.transaction_date.startsWith(month)
    );

    let netIncome = 0;
    let depreciation = 0;
    let accountsReceivable = 0;
    let inventory = 0;
    let accountsPayable = 0;
    let equipmentPurchases = 0;
    let assetSales = 0;
    let loanProceeds = 0;
    let loanPayments = 0;
    let ownerWithdrawals = 0;

    filteredTransactions.forEach(transaction => {
      const amount = transaction.amount;
      const category = transaction.category.toLowerCase();
      
      switch (transaction.type.toLowerCase()) {
        case 'revenue':
          netIncome += amount;
          break;
        case 'expense':
          netIncome -= amount;
          if (category.includes('depreciation')) {
            depreciation += amount;
          }
          break;
        case 'asset':
          if (category.includes('receivable')) {
            accountsReceivable += amount;
          } else if (category.includes('inventory')) {
            inventory += amount;
          } else if (category.includes('equipment') || category.includes('machinery')) {
            equipmentPurchases += amount;
          }
          break;
        case 'liability':
          if (category.includes('payable')) {
            accountsPayable += amount;
          } else if (category.includes('loan')) {
            loanProceeds += amount;
          }
          break;
        case 'equity':
          if (category.includes('withdrawal') || category.includes('drawing')) {
            ownerWithdrawals += amount;
          }
          break;
      }
    });

    const netOperatingCash = netIncome + depreciation - accountsReceivable - inventory + accountsPayable;
    const netInvestingCash = -equipmentPurchases + assetSales;
    const netFinancingCash = loanProceeds - loanPayments - ownerWithdrawals;
    const netCashFlow = netOperatingCash + netInvestingCash + netFinancingCash;

    return {
      operatingActivities: {
        netIncome,
        depreciation,
        accountsReceivable: -accountsReceivable,
        inventory: -inventory,
        accountsPayable,
        netOperatingCash
      },
      investingActivities: {
        equipmentPurchases: -equipmentPurchases,
        assetSales,
        netInvestingCash
      },
      financingActivities: {
        loanProceeds,
        loanPayments: -loanPayments,
        ownerWithdrawals: -ownerWithdrawals,
        netFinancingCash
      },
      netCashFlow
    };
  };

  const fetchFinancialStatements = async () => {
    try {
      setLoading(true);
      
      // Fetch all three financial statements from backend
      const [incomeResponse, balanceResponse, cashFlowResponse] = await Promise.all([
        fetch(buildApiUrl(`/transactions/statements/income?month=${currentMonth}`)),
        fetch(buildApiUrl(`/transactions/statements/balance-sheet?month=${currentMonth}`)),
        fetch(buildApiUrl(`/transactions/statements/cash-flow?month=${currentMonth}`))
      ]);
      
      if (!incomeResponse.ok || !balanceResponse.ok || !cashFlowResponse.ok) {
        throw new Error('Failed to fetch financial statements');
      }
      
      const [incomeData, balanceData, cashFlowData] = await Promise.all([
        incomeResponse.json(),
        balanceResponse.json(),
        cashFlowResponse.json()
      ]);
      
      // Update state with backend data
      setIncomeData({
        revenue: incomeData.revenue,
        costOfGoodsSold: incomeData.cost_of_goods_sold,
        grossProfit: incomeData.gross_profit,
        operatingExpenses: incomeData.operating_expenses,
        operatingIncome: incomeData.operating_income,
        interestExpense: incomeData.interest_expense,
        incomeTax: incomeData.income_tax,
        netIncome: incomeData.net_income
      });
      
      setBalanceData({
        assets: {
          currentAssets: balanceData.assets.current_assets,
          fixedAssets: balanceData.assets.fixed_assets,
          totalAssets: balanceData.assets.total_assets
        },
        liabilities: {
          currentLiabilities: balanceData.liabilities.current_liabilities,
          longTermLiabilities: balanceData.liabilities.long_term_liabilities,
          totalLiabilities: balanceData.liabilities.total_liabilities
        },
        equity: {
          ownerEquity: balanceData.equity.owner_equity,
          retainedEarnings: balanceData.equity.retained_earnings,
          totalEquity: balanceData.equity.total_equity
        }
      });
      
      setCashFlowData({
        operatingActivities: {
          netIncome: cashFlowData.operating_activities.net_income,
          depreciation: cashFlowData.operating_activities.depreciation,
          accountsReceivable: cashFlowData.operating_activities.accounts_receivable,
          inventory: cashFlowData.operating_activities.inventory,
          accountsPayable: cashFlowData.operating_activities.accounts_payable,
          netOperatingCash: cashFlowData.operating_activities.net_operating_cash
        },
        investingActivities: {
          equipmentPurchases: cashFlowData.investing_activities.equipment_purchases,
          assetSales: cashFlowData.investing_activities.asset_sales,
          netInvestingCash: cashFlowData.investing_activities.net_investing_cash
        },
        financingActivities: {
          loanProceeds: cashFlowData.financing_activities.loan_proceeds,
          loanPayments: cashFlowData.financing_activities.loan_payments,
          ownerWithdrawals: cashFlowData.financing_activities.owner_withdrawals,
          netFinancingCash: cashFlowData.financing_activities.net_financing_cash
        },
        netCashFlow: cashFlowData.net_cash_flow
      });
      
    } catch (err) {
      console.error('Error fetching financial statements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialStatements();
  }, [currentMonth]);

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
  };

  const incomeStatementItems = [
    {
      label: 'Revenue',
      amount: incomeData.revenue,
      type: 'neutral'
    },
    {
      label: 'Cost of Goods Sold',
      amount: incomeData.costOfGoodsSold,
      type: 'negative'
    },
    {
      label: 'Gross Profit',
      amount: incomeData.grossProfit,
      type: incomeData.grossProfit >= 0 ? 'positive' : 'negative'
    },
    {
      label: 'Operating Expenses',
      amount: incomeData.operatingExpenses,
      type: 'negative'
    },
    {
      label: 'Operating Income',
      amount: incomeData.operatingIncome,
      type: incomeData.operatingIncome >= 0 ? 'positive' : 'negative'
    },
    {
      label: 'Interest Expense',
      amount: incomeData.interestExpense,
      type: 'negative'
    },
    {
      label: 'Income Tax',
      amount: incomeData.incomeTax,
      type: 'negative'
    },
    {
      label: 'Net Income',
      amount: incomeData.netIncome,
      type: incomeData.netIncome >= 0 ? 'positive' : 'negative'
    }
  ];

  const assetsItems = [
    { label: 'Cash & Cash Equivalents', amount: balanceData.assets.currentAssets * 0.4 },
    { label: 'Accounts Receivable', amount: balanceData.assets.currentAssets * 0.3 },
    { label: 'Inventory', amount: balanceData.assets.currentAssets * 0.2 },
    { label: 'Prepaid Expenses', amount: balanceData.assets.currentAssets * 0.1 },
    { label: 'Fixed Assets', amount: balanceData.assets.fixedAssets },
  ];

  const liabilitiesItems = [
    { label: 'Accounts Payable', amount: balanceData.liabilities.currentLiabilities * 0.6 },
    { label: 'Short-term Loans', amount: balanceData.liabilities.currentLiabilities * 0.4 },
    { label: 'Long-term Loans', amount: balanceData.liabilities.longTermLiabilities },
  ];

  const equityItems = [
    { label: 'Owner\'s Capital', amount: balanceData.equity.ownerEquity },
    { label: 'Retained Earnings', amount: balanceData.equity.retainedEarnings },
  ];

  const operatingItems = [
    { label: 'Net Income', amount: cashFlowData.operatingActivities.netIncome },
    { label: 'Depreciation', amount: cashFlowData.operatingActivities.depreciation },
    { label: 'Accounts Receivable', amount: cashFlowData.operatingActivities.accountsReceivable },
    { label: 'Inventory', amount: cashFlowData.operatingActivities.inventory },
    { label: 'Accounts Payable', amount: cashFlowData.operatingActivities.accountsPayable },
  ];

  const investingItems = [
    { label: 'Equipment Purchases', amount: cashFlowData.investingActivities.equipmentPurchases },
    { label: 'Asset Sales', amount: cashFlowData.investingActivities.assetSales },
  ];

  const financingItems = [
    { label: 'Loan Proceeds', amount: cashFlowData.financingActivities.loanProceeds },
    { label: 'Loan Payments', amount: cashFlowData.financingActivities.loanPayments },
    { label: 'Owner Withdrawals', amount: cashFlowData.financingActivities.ownerWithdrawals },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
        
        {/* Generate Button */}
        <button
          onClick={() => fetchFinancialStatements()}
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--mc-sidebar-bg)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={16} />
          Generate Statement
        </button>
        
        {/* Month Selector */}
        <div>
          <select
            value={currentMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '180px'
            }}
          >
            <option value="2024-01">January 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-03">March 2024</option>
            <option value="2024-04">April 2024</option>
            <option value="2024-05">May 2024</option>
            <option value="2024-06">June 2024</option>
            <option value="2024-07">July 2024</option>
            <option value="2024-08">August 2024</option>
            <option value="2024-09">September 2024</option>
            <option value="2024-10">October 2024</option>
            <option value="2024-11">November 2024</option>
            <option value="2024-12">December 2024</option>
            <option value="2025-01">January 2025</option>
            <option value="2025-02">February 2025</option>
            <option value="2025-03">March 2025</option>
            <option value="2025-04">April 2025</option>
            <option value="2025-05">May 2025</option>
            <option value="2025-06">June 2025</option>
            <option value="2025-07">July 2025</option>
            <option value="2025-08">August 2025</option>
            <option value="2025-09">September 2025</option>
            <option value="2025-10">October 2025</option>
            <option value="2025-11">November 2025</option>
            <option value="2025-12">December 2025</option>
          </select>
        </div>
      </div>

      {/* Statement Type Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setStatementType('income_statement')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: statementType === 'income_statement' ? 'var(--mc-sidebar-bg)' : 'white',
              color: statementType === 'income_statement' ? 'white' : '#6b7280',
              boxShadow: statementType === 'income_statement' ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            Income Statement
          </button>
          <button
            onClick={() => setStatementType('balance_sheet')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: statementType === 'balance_sheet' ? 'var(--mc-sidebar-bg)' : 'white',
              color: statementType === 'balance_sheet' ? 'white' : '#6b7280',
              boxShadow: statementType === 'balance_sheet' ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setStatementType('cash_flow')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: statementType === 'cash_flow' ? 'var(--mc-sidebar-bg)' : 'white',
              color: statementType === 'cash_flow' ? 'white' : '#6b7280',
              boxShadow: statementType === 'cash_flow' ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            Cash Flow Statement
          </button>
        </div>
      </div>

      {/* Income Statement */}
      {statementType === 'income_statement' && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              Loading income statement...
            </div>
          ) : (
            <div>
        <div style={{
                padding: '20px 24px', 
                backgroundColor: '#f9fafb', 
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Income Statement - {new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
          </h3>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Generated on {new Date().toLocaleDateString()}
              </div>
              </div>

              <div style={{ padding: '0' }}>
                {incomeStatementItems.map((item, index) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '16px 24px',
                      borderBottom: index < incomeStatementItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: index === 2 || index === 4 || index === 7 ? '#f9fafb' : 'white',
                      fontWeight: index === 2 || index === 4 || index === 7 ? '600' : '400'
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: 'inherit' }}>
                      {item.label}
                    </span>
                    
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 'inherit',
                      color: item.type === 'positive' ? '#10b981' : item.type === 'negative' ? '#ef4444' : '#374151'
                    }}>
                      {item.type === 'positive' ? '' : item.type === 'negative' ? '-' : ''}{formatPrice(item.amount)}
                    </div>
              </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Balance Sheet */}
      {statementType === 'balance_sheet' && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              Loading balance sheet...
            </div>
          ) : (
            <div>
        <div style={{
                padding: '20px 24px', 
                backgroundColor: '#f9fafb', 
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Balance Sheet - {new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
          </h3>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Generated on {new Date().toLocaleDateString()}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                {/* Assets */}
                <div style={{ borderRight: '1px solid #e5e7eb' }}>
                  <div style={{ 
                    padding: '16px 24px', 
                    backgroundColor: '#f9fafb', 
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    ASSETS
                  </div>
                  
                  <div style={{ padding: '0' }}>
                    {assetsItems.map((item, index) => (
                      <div
                        key={item.label}
                        style={{
                          padding: '12px 24px',
                          borderBottom: index < assetsItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                          {formatPrice(item.amount)}
                        </span>
                      </div>
                    ))}
                    
                    {/* Total Assets */}
                    <div style={{
                      padding: '16px 24px',
                      backgroundColor: '#f9fafb',
                      borderTop: '2px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '700'
                    }}>
                      <span style={{ fontSize: '14px', color: '#1f2937' }}>TOTAL ASSETS</span>
                      <span style={{ fontSize: '16px', color: '#10b981' }}>
                        {formatPrice(balanceData.assets.totalAssets)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Liabilities & Equity */}
                <div>
                  {/* Liabilities */}
                  <div>
                    <div style={{ 
                      padding: '16px 24px', 
                      backgroundColor: '#f9fafb', 
                      borderBottom: '1px solid #e5e7eb',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      LIABILITIES
                    </div>
                    
                    <div style={{ padding: '0' }}>
                      {liabilitiesItems.map((item, index) => (
                        <div
                          key={item.label}
                          style={{
                            padding: '12px 24px',
                            borderBottom: index < liabilitiesItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                            <span style={{ fontSize: '14px', color: '#374151' }}>
                              {item.label}
                            </span>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                            {formatPrice(item.amount)}
                          </span>
                </div>
                      ))}
                      
                      {/* Total Liabilities */}
                      <div style={{
                        padding: '16px 24px',
                        backgroundColor: '#f9fafb',
                        borderTop: '2px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: '700'
                      }}>
                        <span style={{ fontSize: '14px', color: '#1f2937' }}>TOTAL LIABILITIES</span>
                        <span style={{ fontSize: '16px', color: '#3b82f6' }}>
                          {formatPrice(balanceData.liabilities.totalLiabilities)}
                        </span>
                </div>
              </div>
            </div>

                  {/* Equity */}
                  <div>
                    <div style={{ 
                      padding: '16px 24px', 
                      backgroundColor: '#f9fafb', 
                      borderBottom: '1px solid #e5e7eb',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      EQUITY
                    </div>
                    
                    <div style={{ padding: '0' }}>
                      {equityItems.map((item, index) => (
                        <div
                          key={item.label}
                          style={{
                            padding: '12px 24px',
                            borderBottom: index < equityItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                            <span style={{ fontSize: '14px', color: '#374151' }}>
                              {item.label}
                            </span>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                            {formatPrice(item.amount)}
                          </span>
                        </div>
                      ))}
                      
                      {/* Total Equity */}
                      <div style={{
                        padding: '16px 24px',
                        backgroundColor: '#f9fafb',
                        borderTop: '2px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: '700'
                      }}>
                        <span style={{ fontSize: '14px', color: '#1f2937' }}>TOTAL EQUITY</span>
                        <span style={{ fontSize: '16px', color: '#3b82f6' }}>
                          {formatPrice(balanceData.equity.totalEquity)}
                        </span>
                      </div>
                </div>
                </div>

                  {/* Total Liabilities & Equity */}
                  <div style={{
                    padding: '20px 24px',
                    backgroundColor: '#1f2937',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: '700'
                  }}>
                    <span style={{ fontSize: '16px' }}>TOTAL LIABILITIES & EQUITY</span>
                    <span style={{ fontSize: '18px' }}>
                      {formatPrice(balanceData.liabilities.totalLiabilities + balanceData.equity.totalEquity)}
                    </span>
                </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cash Flow Statement */}
      {statementType === 'cash_flow' && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              Loading cash flow statement...
            </div>
          ) : (
            <div>
        <div style={{
                padding: '20px 24px', 
                backgroundColor: '#f9fafb', 
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Cash Flow Statement - {new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
          </h3>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Generated on {new Date().toLocaleDateString()}
                </div>
              </div>

              <div style={{ padding: '0' }}>
              {/* Operating Activities */}
              <div>
                  <div style={{ 
                    padding: '16px 24px', 
                    backgroundColor: '#f9fafb', 
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    OPERATING ACTIVITIES
                  </div>
                  
                  <div style={{ padding: '0' }}>
                    {operatingItems.map((item, index) => (
                      <div
                        key={item.label}
                        style={{
                          padding: '12px 24px',
                          borderBottom: index < operatingItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {item.label}
                        </span>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          color: '#1f2937'
                        }}>
                          {item.amount >= 0 ? '' : '-'}{formatPrice(Math.abs(item.amount))}
                        </span>
                  </div>
                    ))}
                    
                    {/* Net Operating Cash */}
                    <div style={{
                      padding: '16px 24px',
                      backgroundColor: '#f9fafb',
                      borderTop: '2px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '700'
                    }}>
                      <span style={{ fontSize: '14px', color: '#1f2937' }}>NET OPERATING CASH</span>
                      <span style={{ 
                        fontSize: '16px', 
                        color: '#10b981'
                      }}>
                        {formatPrice(cashFlowData.operatingActivities.netOperatingCash)}
                      </span>
                  </div>
                </div>
              </div>

              {/* Investing Activities */}
              <div>
                  <div style={{ 
                    padding: '16px 24px', 
                    backgroundColor: '#f9fafb', 
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    INVESTING ACTIVITIES
                  </div>
                  
                  <div style={{ padding: '0' }}>
                    {investingItems.map((item, index) => (
                      <div
                        key={item.label}
                        style={{
                          padding: '12px 24px',
                          borderBottom: index < investingItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {item.label}
                        </span>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          color: '#1f2937'
                        }}>
                          {item.amount >= 0 ? '' : '-'}{formatPrice(Math.abs(item.amount))}
                        </span>
                      </div>
                    ))}
                    
                    {/* Net Investing Cash */}
                    <div style={{
                      padding: '16px 24px',
                      backgroundColor: '#f9fafb',
                      borderTop: '2px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '700'
                    }}>
                      <span style={{ fontSize: '14px', color: '#1f2937' }}>NET INVESTING CASH</span>
                      <span style={{ 
                        fontSize: '16px', 
                        color: '#3b82f6'
                      }}>
                        {formatPrice(cashFlowData.investingActivities.netInvestingCash)}
                      </span>
                  </div>
                </div>
              </div>

              {/* Financing Activities */}
              <div>
                  <div style={{ 
                    padding: '16px 24px', 
                    backgroundColor: '#f9fafb', 
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    FINANCING ACTIVITIES
                  </div>
                  
                  <div style={{ padding: '0' }}>
                    {financingItems.map((item, index) => (
                      <div
                        key={item.label}
                        style={{
                          padding: '12px 24px',
                          borderBottom: index < financingItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {item.label}
                        </span>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          color: '#1f2937'
                        }}>
                          {item.amount >= 0 ? '' : '-'}{formatPrice(Math.abs(item.amount))}
                        </span>
                      </div>
                    ))}
                    
                    {/* Net Financing Cash */}
                    <div style={{
                      padding: '16px 24px',
                      backgroundColor: '#f9fafb',
                      borderTop: '2px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '700'
                    }}>
                      <span style={{ fontSize: '14px', color: '#1f2937' }}>NET FINANCING CASH</span>
                      <span style={{ 
                        fontSize: '16px', 
                        color: '#3b82f6'
                      }}>
                        {formatPrice(cashFlowData.financingActivities.netFinancingCash)}
                      </span>
                  </div>
                </div>
              </div>

                {/* Net Cash Flow */}
                <div style={{
                  padding: '20px 24px',
                  backgroundColor: '#1f2937',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: '700'
                }}>
                  <span style={{ fontSize: '16px' }}>NET CASH FLOW</span>
                  <span style={{ 
                    fontSize: '18px',
                    color: '#10b981'
                  }}>
                    {formatPrice(cashFlowData.netCashFlow)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Accounting;
