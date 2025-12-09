import { Transaction, Card, Loan } from './types';

export const INITIAL_BALANCE = 2345890.50; // Roughly 2.3M + some change

// Helper to generate past dates
const getDateDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    date: getDateDaysAgo(0),
    description: 'Vroon Offshore Company Limited',
    amount: 2300000.00,
    type: 'credit',
    category: 'Wire Transfer',
    accountId: 'acct-checking'
  },
  {
    id: 'tx-002',
    date: getDateDaysAgo(2),
    description: 'Whole Foods Market',
    amount: 245.89,
    type: 'debit',
    category: 'Groceries',
    accountId: 'acct-checking'
  },
  {
    id: 'tx-003',
    date: getDateDaysAgo(5),
    description: 'Netflix Subscription',
    amount: 19.99,
    type: 'debit',
    category: 'Entertainment',
    accountId: 'card-2' // Sapphire
  },
  {
    id: 'tx-004',
    date: getDateDaysAgo(12),
    description: 'Shell Gas Station',
    amount: 54.20,
    type: 'debit',
    category: 'Transport',
    accountId: 'card-3' // Freedom
  },
  {
    id: 'tx-005',
    date: getDateDaysAgo(15),
    description: 'Monthly Dividend Payout',
    amount: 4500.00,
    type: 'credit',
    category: 'Investment',
    accountId: 'acct-savings'
  },
  // Generating some 2023 history
  {
    id: 'tx-006',
    date: '2023-12-20',
    description: 'Apple Store 5th Ave',
    amount: 1299.00,
    type: 'debit',
    category: 'Electronics',
    accountId: 'card-2'
  },
  {
    id: 'tx-007',
    date: '2023-11-15',
    description: 'Delta Airlines',
    amount: 850.00,
    type: 'debit',
    category: 'Travel',
    accountId: 'card-2'
  },
  {
    id: 'tx-008',
    date: '2023-10-01',
    description: 'Consulting Fee - Q3',
    amount: 15000.00,
    type: 'credit',
    category: 'Business',
    accountId: 'acct-checking'
  },
  {
    id: 'tx-009',
    date: '2023-08-14',
    description: 'Ritz Carlton Hotel',
    amount: 2400.00,
    type: 'debit',
    category: 'Travel',
    accountId: 'card-2'
  },
  {
    id: 'tx-010',
    date: '2023-05-22',
    description: 'Vanguard Fund Transfer',
    amount: 50000.00,
    type: 'debit',
    category: 'Investment',
    accountId: 'acct-checking'
  }
];

export const MOCK_CARDS: Card[] = [
  {
    id: 'card-1',
    name: 'Chase Debit',
    last4: '8842',
    fullNumber: '4400 8842 1234 5678',
    cvv: '123',
    type: 'Debit',
    brand: 'Debit',
    status: 'Active',
    expiry: '12/28'
  },
  {
    id: 'card-2',
    name: 'Sapphire Reserve',
    last4: '4091',
    fullNumber: '4147 4091 2837 9910',
    cvv: '884',
    type: 'Credit',
    brand: 'Sapphire',
    balance: 4240.50,
    limit: 50000,
    status: 'Active',
    expiry: '09/27',
    dueDate: '2024-06-25',
    minPayment: 125.00
  },
  {
    id: 'card-3',
    name: 'Freedom Unlimited',
    last4: '1123',
    fullNumber: '5521 1123 4455 6677',
    cvv: '456',
    type: 'Credit',
    brand: 'Freedom',
    balance: 850.00,
    limit: 15000,
    status: 'Active',
    expiry: '05/26',
    dueDate: '2024-06-20',
    minPayment: 35.00
  }
];

export const MOCK_LOANS: Loan[] = [
  {
    id: 'loan-1',
    name: 'Chase Auto',
    accountNumber: '3321',
    balance: 15400.00,
    nextPaymentDate: '2024-06-28',
    nextPaymentAmount: 350.00,
    interestRate: 4.5,
    type: 'Auto'
  },
  {
    id: 'loan-2',
    name: 'Chase Mortgage',
    accountNumber: '0012',
    balance: 320000.00,
    nextPaymentDate: '2024-06-01',
    nextPaymentAmount: 1800.00,
    interestRate: 6.2,
    type: 'Mortgage'
  }
];