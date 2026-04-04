import React, { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { AlertCircle, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

const Insights = () => {
  const { transactions } = useFinanceStore();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    // 1. Highest Spending Category
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    let highestCategory = '';
    let highestAmount = 0;
    
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCategory = cat;
      }
    });

    // 2. Savings Rate
    const totalExp = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalInc = income.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc) * 100 : 0;

    // 3. Largest single expense
    const largestExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];

    return { highestCategory, highestAmount, totalExp, totalInc, savingsRate, largestExpense };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Not enough data to generate insights yet.
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>Smart Insights</h2>
      
      <div className="grid grid-cols-2 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        {/* Insight 1: Top Spending Category */}
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Top Spending Area</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Your highest expense category is <strong style={{ color: 'var(--text-main)' }}>{insights.highestCategory}</strong>, totaling <strong style={{ color: 'var(--danger)' }}>${insights.highestAmount.toLocaleString()}</strong>.
            </p>
          </div>
        </div>

        {/* Insight 2: Savings Rate */}
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--success)', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
            <Target size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Savings Health</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Your overall savings rate is <strong style={{ color: insights.savingsRate >= 20 ? 'var(--success)' : 'var(--warning)' }}>{insights.savingsRate.toFixed(1)}%</strong>. 
              {insights.savingsRate >= 20 ? " Excellent job saving!" : " Consider finding areas to reduce expenses to boost your savings."}
            </p>
          </div>
        </div>

        {/* Insight 3: Cash Flow */}
        <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
            {insights.totalInc > insights.totalExp ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Cash Flow</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
              You've earned <strong style={{ color: 'var(--success)' }}>${insights.totalInc.toLocaleString()}</strong> and spent <strong style={{ color: 'var(--danger)' }}>${insights.totalExp.toLocaleString()}</strong>. 
              Net flow is <strong style={{ color: insights.totalInc >= insights.totalExp ? 'var(--success)' : 'var(--danger)' }}>${(insights.totalInc - insights.totalExp).toLocaleString()}</strong>.
            </p>
          </div>
        </div>

        {/* Insight 4: Notable Transaction */}
        {insights.largestExpense && (
          <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--warning)', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
              <Zap size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Notable Expense</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Your single largest expense was on <strong style={{ color: 'var(--text-main)' }}>{insights.largestExpense.date}</strong> for <strong style={{ color: 'var(--text-main)' }}>{insights.largestExpense.description}</strong> at <strong style={{ color: 'var(--danger)' }}>${insights.largestExpense.amount.toLocaleString()}</strong>.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Insights;
