import React, { useState, useEffect } from 'react';
import { useFinanceStore } from './store/useFinanceStore';
import { LayoutDashboard, Receipt, Lightbulb, UserCircle, Moon, Sun } from 'lucide-react';
import DashboardOverview from './components/DashboardOverview';
import Transactions from './components/Transactions';
import Insights from './components/Insights';

const App = () => {
  const { role, setRole, theme, toggleTheme } = useFinanceStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'insights'>('dashboard');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="app-container">
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>

      <header className="glass-panel flex-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.75rem', color: 'white' }}>
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>FinDash</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: '2rem' }}>
            <UserCircle size={20} className="text-muted" />
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as any)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', appearance: 'auto', paddingRight: '0.5rem' }}
            >
              <option value="Viewer">Viewer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="tabs-container" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--panel-border)' }}>
        <button 
          className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          style={{ background: activeTab === 'dashboard' ? '' : 'transparent', color: activeTab === 'dashboard' ? '' : 'var(--text-muted)' }}
        >
          <LayoutDashboard size={18} /> Overview
        </button>
        <button 
          className={`btn ${activeTab === 'transactions' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('transactions')}
          style={{ background: activeTab === 'transactions' ? '' : 'transparent', color: activeTab === 'transactions' ? '' : 'var(--text-muted)' }}
        >
          <Receipt size={18} /> Transactions
        </button>
        <button 
          className={`btn ${activeTab === 'insights' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('insights')}
          style={{ background: activeTab === 'insights' ? '' : 'transparent', color: activeTab === 'insights' ? '' : 'var(--text-muted)' }}
        >
          <Lightbulb size={18} /> Insights
        </button>
      </div>

      <main style={{ marginTop: '1rem' }}>
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'transactions' && <Transactions />}
        {activeTab === 'insights' && <Insights />}
      </main>
    </div>
  );
};

export default App;
