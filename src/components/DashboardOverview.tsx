import React, { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const DashboardOverview = () => {
  const { transactions } = useFinanceStore();

  const { totalIncome, totalExpense, balance, categoryData, timelineData } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const catMap = new Map<string, number>();
    const timeMap = new Map<string, { income: number; expense: number }>();

    // Sort by date logically
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach((t) => {
      if (t.type === 'income') {
        inc += t.amount;
      } else {
        exp += t.amount;
        catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
      }

      // Group by date (simple YYYY-MM-DD)
      const d = t.date.substring(0, 10);
      const curr = timeMap.get(d) || { income: 0, expense: 0 };
      if (t.type === 'income') curr.income += t.amount;
      else curr.expense += t.amount;
      timeMap.set(d, curr);
    });

    const cData = Array.from(catMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    
    let runningBalance = 0;
    const tData = Array.from(timeMap.entries()).map(([date, data]) => {
      runningBalance += (data.income - data.expense);
      return {
        date,
        balance: runningBalance,
        ...data
      };
    });

    return { totalIncome: inc, totalExpense: exp, balance: inc - exp, categoryData: cData, timelineData: tData };
  }, [transactions]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel value-card">
          <div className="label">Total Balance</div>
          <div className="value" style={{ color: balance >= 0 ? 'var(--text-main)' : 'var(--danger)' }}>
            ${balance.toLocaleString()}
          </div>
          <div className="icon-wrapper icon-wrapper-large text-primary">
            <Wallet />
          </div>
        </div>
        
        <div className="glass-panel value-card">
          <div className="label">Total Income</div>
          <div className="value amount-income">+${totalIncome.toLocaleString()}</div>
          <div className="icon-wrapper icon-wrapper-large" style={{ color: 'var(--success)' }}>
            <ArrowUpRight />
          </div>
        </div>
        
        <div className="glass-panel value-card">
          <div className="label">Total Expenses</div>
          <div className="value amount-expense">-${totalExpense.toLocaleString()}</div>
          <div className="icon-wrapper icon-wrapper-large" style={{ color: 'var(--danger)' }}>
            <ArrowDownRight />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel col-span-2">
          <h3>Balance Trend</h3>
          <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '0.5rem', color: 'var(--text-main)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="balance" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <h3>Spending Breakdown</h3>
          {categoryData.length > 0 ? (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '0.5rem' }} 
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Legend wrapperStyle={{ color: 'var(--text-muted)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No expenses yet.
            </div>
          )}
        </div>
        
        <div className="glass-panel">
          <h3>Recent Transactions</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {transactions.slice(-5).reverse().map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.05)', borderRadius: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{t.description}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.date} &bull; {t.category}</div>
                </div>
                <div className={t.type === 'income' ? 'amount-income' : 'amount-expense'}>
                  {t.type === 'income' ? '+' : '-'}${t.amount}
                </div>
              </div>
            ))}
            {transactions.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No transactions</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
