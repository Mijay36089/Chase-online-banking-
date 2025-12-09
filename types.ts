export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  accountId?: string;
}

export interface User {
  email: string;
  name: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TRANSACTIONS = 'TRANSACTIONS',
  TRANSFERS = 'TRANSFERS',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface RecurringPayment {
  id: string;
  recipient: string;
  amount: number;
  frequency: 'Weekly' | 'Monthly' | 'Yearly';
  nextDate: string;
  category?: string;
  recipientBank?: string;
}

export interface Card {
  id: string;
  name: string;
  last4: string;
  fullNumber: string; // Mock only
  cvv: string;
  type: 'Debit' | 'Credit';
  brand: 'Sapphire' | 'Freedom' | 'Debit';
  balance?: number; // For credit cards
  limit?: number;   // For credit cards
  status: 'Active' | 'Frozen';
  expiry: string;
  dueDate?: string;
  minPayment?: number;
}

export interface Loan {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  interestRate: number;
  type: 'Auto' | 'Mortgage';
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'Checking' | 'Savings';
  balance: number;
  mask: string;
  apy?: number;
}

export type Account = Card | Loan | BankAccount;

export interface Notification {
  id: string;
  type: 'transaction' | 'alert';
  message: string;
  timestamp: Date;
  amount?: number;
  merchant?: string;
  cardName?: string;
}