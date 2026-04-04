export type Category = 'Housing' | 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Utilities' | 'Income' | 'Other';

export interface Transaction {
  id: string;
  date: string; // ISO string
  amount: number;
  category: Category;
  type: 'income' | 'expense';
  description: string;
}

export type Role = 'Viewer' | 'Admin';
