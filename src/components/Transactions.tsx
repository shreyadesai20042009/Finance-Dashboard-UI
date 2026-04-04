import React, { useState, useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import type { Transaction, Category } from '../types';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Transactions = () => {
  const { transactions, role, addTransaction, editTransaction, deleteTransaction } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '',
    amount: 0,
    category: 'Other',
    type: 'expense',
    date: new Date().toISOString().substring(0, 10),
  });

  const categories: Category[] = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Income', 'Other'];

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => filterType === 'all' || t.type === filterType)
      .filter((t) => t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, searchTerm]);

  const openForm = (transaction?: Transaction) => {
    if (transaction) {
      setFormData(transaction);
      setEditingId(transaction.id);
    } else {
      setFormData({ description: '', amount: 0, category: 'Other', type: 'expense', date: new Date().toISOString().substring(0, 10) });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.date && formData.category && formData.type) {
      if (editingId) {
        editTransaction(editingId, formData as Transaction);
      } else {
        addTransaction({ ...(formData as Transaction), id: uuidv4() });
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '60vh' }}>
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Transactions</h2>
        {role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => openForm()}>
            <Plus size={18} /> Add Transaction
          </button>
        )}
      </div>

      <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by description or category..." 
            className="input-field" 
            style={{ width: '100%', paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="input-field" 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value as any)}
          style={{ minWidth: '150px' }}
        >
          <option value="all">All Types</option>
          <option value="income">Income Only</option>
          <option value="expense">Expense Only</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              {role === 'Admin' && <th style={{ textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="table-row">
                <td>{t.date}</td>
                <td style={{ fontWeight: 500 }}>{t.description}</td>
                <td>
                  <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                    {t.category}
                  </span>
                </td>
                <td className={t.type === 'income' ? 'amount-income' : 'amount-expense'}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </td>
                {role === 'Admin' && (
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn-icon" style={{ width: '2rem', height: '2rem' }} onClick={() => openForm(t)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn-icon" style={{ width: '2rem', height: '2rem', color: 'var(--danger)' }} onClick={() => deleteTransaction(t.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={role === 'Admin' ? 5 : 4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h3>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group row" style={{ display: 'flex', gap: '1rem', flexDirection: 'row', marginBottom: 0 }}>
                <div style={{ flex: 1 }} className="form-group">
                  <label>Type</label>
                  <select className="input-field" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div style={{ flex: 1 }} className="form-group">
                  <label>Date</label>
                  <input type="date" className="input-field" value={formData.date} required onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input type="text" className="input-field" value={formData.description} required onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="e.g. Weekly Groceries" />
              </div>

              <div className="form-group row" style={{ display: 'flex', gap: '1rem', flexDirection: 'row', marginBottom: 0 }}>
                <div style={{ flex: 1 }} className="form-group">
                  <label>Category</label>
                  <select className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }} className="form-group">
                  <label>Amount ($)</label>
                  <input type="number" step="0.01" min="0" className="input-field" value={formData.amount} required onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} />
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Add Transaction'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
