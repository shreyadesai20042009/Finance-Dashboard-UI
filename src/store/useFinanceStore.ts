import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Role } from '../types';

interface FinanceState {
  transactions: Transaction[];
  role: Role;
  theme: 'light' | 'dark';
  setRole: (role: Role) => void;
  toggleTheme: () => void;
  addTransaction: (transaction: Transaction) => void;
  editTransaction: (id: string, updatedTransaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
}

const initialTransactions: Transaction[] = [
  { id: '1', date: '2023-10-01', amount: 5000, category: 'Income', type: 'income', description: 'Salary' },
  { id: '2', date: '2023-10-05', amount: 1200, category: 'Housing', type: 'expense', description: 'Rent' },
  { id: '3', date: '2023-10-10', amount: 300, category: 'Food', type: 'expense', description: 'Groceries' },
  { id: '4', date: '2023-10-15', amount: 150, category: 'Utilities', type: 'expense', description: 'Electric Bill' },
  { id: '5', date: '2023-10-20', amount: 200, category: 'Transportation', type: 'expense', description: 'Gas' },
  { id: '6', date: '2023-10-25', amount: 400, category: 'Shopping', type: 'expense', description: 'Clothes' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
      role: 'Viewer',
      theme: 'dark', // Starting with dark mode as a nice default
      setRole: (role) => set({ role }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      addTransaction: (transaction) =>
        set((state) => {
          if (state.role !== 'Admin') return state;
          return { transactions: [...state.transactions, transaction] };
        }),
      editTransaction: (id, updatedTransaction) =>
        set((state) => {
          if (state.role !== 'Admin') return state;
          return {
            transactions: state.transactions.map((t) =>
              t.id === id ? { ...updatedTransaction } : t
            ),
          };
        }),
      deleteTransaction: (id) =>
        set((state) => {
          if (state.role !== 'Admin') return state;
          return {
            transactions: state.transactions.filter((t) => t.id !== id),
          };
        }),
    }),
    {
      name: 'finance-storage',
    }
  )
);
