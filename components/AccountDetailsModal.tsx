

import React, { useState } from 'react';
import { X, Search, ArrowUp, ArrowDown, Download, Filter, Landmark, CreditCard, Briefcase, Car, Home, ChevronRight } from 'lucide-react';
import { Account, Transaction, Card, Loan, BankAccount } from '../types';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  transactions: Transaction[];
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ isOpen, onClose, account, transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');

  if (!isOpen || !account) return null;

  // Filter transactions for this specific account
  const accountTransactions = transactions
    .filter(tx => {
      // If accountId is present on transaction, match it
      if (tx.accountId) return tx.accountId === account.id;
      // Fallback for demo: if it's a debit card, match Checking. 
      // This is just a safety net for mock data that might miss an ID.
      if (account.id === 'card-1') return tx.accountId === 'acct-checking'; // Assuming debit card links to checking
      return false; 
    })
    .filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || tx.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getAccountIcon = () => {
    if ('type' in account) {
      if (account.type === 'Checking' || account.type === 'Debit') return <Landmark className="h-6 w-6 text-white" />;
      if (account.type === 'Savings') return <Briefcase className="h-6 w-6 text-white" />;
      if (account.type === 'Auto') return <Car className="h-6 w-6 text-white" />;
      if (account.type === 'Mortgage') return <Home className="h-6 w-6 text-white" />;
      if (account.type === 'Credit') return <CreditCard className="h-6 w-6 text-white" />;
    }
    return <Landmark className="h-6 w-6 text-white" />;
  };

  const getBalanceLabel = () => {
    if ('type' in account && account.type === 'Credit') return 'Current Balance';
    if ('type' in account && (account.type === 'Auto' || account.type === 'Mortgage')) return 'Remaining Balance';
    return 'Available Balance';
  };

  const getBalance = () => {
    if ('balance' in account && typeof account.balance === 'number') return account.balance;
    return 0;
  };

  const getMask = () => {
    if ('last4' in account) return `...${account.last4}`;
    if ('mask' in account) return `...${(account as BankAccount).mask}`;
    if ('accountNumber' in account) return `...${(account as Loan).accountNumber}`;
    return '';
  };

  const getAccountName = () => {
    if ('name' in account) return account.name;
    return 'Account';
  };

  const getAccountTypeColor = () => {
    if ('type' in account) {
      if (account.type === 'Checking') return 'bg-[#117aca]';
      if (account.type === 'Savings') return 'bg-blue-400';
      if (account.type === 'Credit') return 'bg-purple-600';
      if (account.type === 'Auto' || account.type === 'Mortgage') return 'bg-orange-400';
    }
    return 'bg-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/New_York'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="account-details-title">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`flex justify-between items-center p-6 text-white shrink-0 ${getAccountTypeColor()}`}>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full border border-white/50">
              {getAccountIcon()}
            </div>
            <div>
              <h3 id="account-details-title" className="text-xl font-bold">{getAccountName()}</h3>
              <p className="text-sm opacity-80">{getMask()}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors" aria-label="Close account details">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Balance Section */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">{getBalanceLabel()}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(getBalance())}</p>
          </div>
          <button className="flex items-center gap-1 text-sm text-[#117aca] hover:underline">
            Manage <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Transaction Search & Filter */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <label htmlFor="tx-search" className="sr-only">Search transactions</label>
            <input
              id="tx-search"
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#117aca] outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <label htmlFor="tx-filter" className="sr-only">Filter by type</label>
            <select
              id="tx-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:ring-2 focus:ring-[#117aca] outline-none appearance-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="credit">Credits</option>
              <option value="debit">Debits</option>
            </select>
          </div>
        </div>

        {/* Transaction List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {accountTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              <p>No transactions found for this account.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                  <th scope="col" className="px-6 py-3 font-medium">Date</th>
                  <th scope="col" className="px-6 py-3 font-medium">Description</th>
                  <th scope="col" className="px-6 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accountTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(tx.date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{tx.description}</td>
                    <td className={`px-6 py-4 text-sm font-semibold text-right ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsModal;