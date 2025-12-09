import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  CreditCard as CreditCardIcon, 
  Send, 
  Download,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Filter,
  Calendar,
  Trash2,
  Clock,
  RefreshCw,
  Camera,
  Tag,
  Briefcase,
  Landmark,
  Car,
  Home,
  ChevronRight,
  Check,
  Loader2
} from 'lucide-react';
import { Transaction, ChatMessage, RecurringPayment, Card, Loan, BankAccount, Account } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import CardList from './CardList';

interface DashboardProps {
  userName: string;
  balance: number;
  savingsBalance: number;
  transactions: Transaction[];
  recurringPayments: RecurringPayment[];
  cards: Card[];
  loans: Loan[];
  onTransferClick: () => void;
  onBillPayClick: () => void;
  onDepositClick: () => void;
  onCancelRecurring: (id: string) => void;
  onToggleCardLock: (id: string) => void;
  onTransactionClick: (tx: Transaction) => void;
  onPayCard: (card: Card) => void;
  onViewStatements: () => void;
  onShowDetails: (card: Card) => void;
  onSelectAccount?: (account: Account) => void;
  onOpenAccountClick?: () => void;
  checkingAccount?: BankAccount;
  savingsAccount?: BankAccount;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  userName,
  balance, 
  savingsBalance,
  transactions, 
  recurringPayments,
  cards,
  loans,
  onTransferClick, 
  onBillPayClick,
  onDepositClick,
  onCancelRecurring,
  onToggleCardLock,
  onTransactionClick,
  onPayCard,
  onViewStatements,
  onShowDetails,
  onSelectAccount,
  onOpenAccountClick,
  checkingAccount,
  savingsAccount
}) => {
  const [chatQuery, setChatQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [greeting, setGreeting] = useState('Good morning');
  
  // Download State
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sorting and Filtering State
  const [sortConfig, setSortConfig] = useState<{ key: 'date' | 'amount'; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');

  useEffect(() => {
    // Get current time in New York (Eastern Time)
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'America/New_York'
    });
    
    const nycHour = parseInt(formatter.format(now), 10);

    if (nycHour < 12) setGreeting('Good morning');
    else if (nycHour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}) => {
    const date = new Date(dateString);
    // Use UTC date parts to prevent local timezone shifting for YYYY-MM-DD strings
    // But since the requirement is "USA Time", we will rely on standard parsing and force timezone
    return date.toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
      ...options
    });
  };

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const newMessages = [...chatMessages, { role: 'user', text: chatQuery } as ChatMessage];
    setChatMessages(newMessages);
    setChatQuery('');
    setIsAiThinking(true);

    const advice = await getFinancialAdvice(chatQuery, transactions, balance);
    
    setIsAiThinking(false);
    setChatMessages(prev => [...prev, { role: 'model', text: advice }]);
  };

  const handleSort = (key: 'date' | 'amount') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleDownloadCSV = () => {
    setIsDownloading(true);
    setTimeout(() => {
        setIsDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1500);
  };

  // Filter and Sort Logic
  const processedTransactions = [...transactions]
    .filter(tx => filterType === 'all' || tx.type === filterType)
    .sort((a, b) => {
      let comparison = 0;
      if (sortConfig.key === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a.amount - b.amount;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {greeting}, <span className="text-[#117aca]">{userName}</span>
        </h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'America/New_York' 
          })}
        </p>
      </div>

      {/* Accounts Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Accounts Grid (Checking, Savings, Loans) */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Checking Account Card */}
            <div 
              onClick={() => checkingAccount && onSelectAccount?.(checkingAccount)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-full border-l-4 border-l-[#117aca] cursor-pointer hover:shadow-md transition-shadow group"
            >
                <div>
                   <div className="flex justify-between items-start mb-2">
                       <div>
                           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide group-hover:text-[#117aca] transition-colors">Total Checking</p>
                           <p className="text-sm text-gray-400">...8842</p>
                       </div>
                       <Landmark className="h-5 w-5 text-[#117aca]" />
                   </div>
                   <p className="text-2xl font-bold text-gray-900 mb-4">{formatCurrency(balance)}</p>
                </div>
                <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onTransferClick(); }} 
                      className="flex-1 text-sm bg-blue-50 text-[#117aca] py-2 rounded font-medium hover:bg-blue-100 transition-colors"
                    >
                        Transfer
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDepositClick(); }} 
                      className="flex-1 text-sm bg-blue-50 text-[#117aca] py-2 rounded font-medium hover:bg-blue-100 transition-colors"
                    >
                        Deposit
                    </button>
                </div>
            </div>

            {/* Savings Account Card */}
            <div 
              onClick={() => savingsAccount && onSelectAccount?.(savingsAccount)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-full border-l-4 border-l-blue-400 cursor-pointer hover:shadow-md transition-shadow group"
            >
                <div>
                   <div className="flex justify-between items-start mb-2">
                       <div>
                           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide group-hover:text-blue-500 transition-colors">Premier Savings</p>
                           <p className="text-sm text-gray-400">...9921</p>
                       </div>
                       <Briefcase className="h-5 w-5 text-blue-400" />
                   </div>
                   <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(savingsBalance)}</p>
                   <p className="text-xs text-green-600 font-medium mb-4 flex items-center gap-1">
                       <ArrowUpRight className="h-3 w-3" /> 2.45% APY
                   </p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onTransferClick(); }} 
                  className="w-full text-sm border border-gray-200 text-gray-700 py-2 rounded font-medium hover:bg-gray-50 transition-colors"
                >
                    Add Funds
                </button>
            </div>

            {/* Auto Loan Card */}
            {loans.map(loan => (
                <div 
                  key={loan.id} 
                  onClick={() => onSelectAccount?.(loan)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-full border-l-4 border-l-orange-400 cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{loan.name}</p>
                                <p className="text-sm text-gray-400">...{loan.accountNumber}</p>
                            </div>
                            {loan.type === 'Auto' ? <Car className="h-5 w-5 text-orange-400" /> : <Home className="h-5 w-5 text-orange-400" />}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(loan.balance)}</p>
                        <p className="text-xs text-gray-500 mb-4">
                            Due: <span className="text-orange-600 font-medium">{formatCurrency(loan.nextPaymentAmount)}</span> on {formatDate(loan.nextPaymentDate, {month:'short', day:'numeric'})}
                        </p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onBillPayClick(); }} 
                      className="w-full text-sm bg-orange-50 text-orange-700 py-2 rounded font-medium hover:bg-orange-100 transition-colors"
                    >
                        Pay Loan
                    </button>
                </div>
            ))}

            {/* Open Account Placeholder */}
            <div 
                onClick={onOpenAccountClick}
                className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-5 flex flex-col items-center justify-center text-center h-full hover:bg-gray-100 transition-colors cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onOpenAccountClick?.();
                    }
                }}
            >
                <div className="bg-white p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                     <ArrowUpRight className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">Open Account</p>
                <p className="text-xs text-gray-400">CDs, IRAs, & more</p>
            </div>

        </div>

        {/* AI Insight Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#117aca]">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              <h3 className="font-bold">Chase Genius™</h3>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[200px] mb-4 space-y-3" role="log" aria-live="polite">
             {chatMessages.length === 0 ? (
               <p className="text-gray-500 text-sm">
                 Ask me anything about your finances. For example: "How much did I spend on travel in 2023?" or "Analyze my recent large deposit."
               </p>
             ) : (
               chatMessages.map((msg, idx) => (
                 <div key={idx} className={`text-sm p-3 rounded-lg ${msg.role === 'user' ? 'bg-gray-100 text-gray-800 ml-4' : 'bg-blue-50 text-blue-900 mr-4'}`}>
                   {msg.text}
                 </div>
               ))
             )}
             {isAiThinking && (
               <div className="flex gap-1 items-center text-xs text-gray-500 animate-pulse">
                 Thinking...
               </div>
             )}
          </div>

          <form onSubmit={handleAiAsk} className="relative mt-auto">
            <label htmlFor="ai-chat-input" className="sr-only">Ask AI Assistant</label>
            <input 
              id="ai-chat-input"
              type="text" 
              placeholder="Ask about your finances..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-[#117aca] outline-none text-gray-900"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 text-[#117aca] hover:text-[#0a4d8c]" aria-label="Send Query">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>

      {/* Middle Row: Cards */}
      <div className="grid grid-cols-1">
        <CardList 
            cards={cards} 
            onToggleLock={onToggleCardLock} 
            onPayCard={onPayCard}
            onViewStatements={onViewStatements}
            onShowDetails={onShowDetails}
            onSelectAccount={onSelectAccount} // Pass handler
        />
      </div>

      {/* Bottom Content Grid: Transactions & Recurring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Transactions List (Takes 2/3) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
            
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <label htmlFor="tx-filter" className="sr-only">Filter Transactions</label>
                  <select
                      id="tx-filter"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-[#117aca] outline-none appearance-none cursor-pointer hover:bg-white transition-colors"
                  >
                      <option value="all">All</option>
                      <option value="credit">Income</option>
                      <option value="debit">Expenses</option>
                  </select>
               </div>
               <button 
                onClick={handleDownloadCSV}
                className="text-gray-400 hover:text-[#117aca] transition-colors p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#117aca] relative" 
                title="Download CSV"
                aria-label="Download CSV of transactions"
              >
                 {isDownloading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                 ) : downloadSuccess ? (
                    <Check className="h-5 w-5 text-green-600" />
                 ) : (
                    <Download className="h-5 w-5" aria-hidden="true" />
                 )}
               </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" aria-sort={sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'} className="p-0">
                    <button 
                      type="button"
                      className="w-full h-full px-6 py-4 font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#117aca]"
                      onClick={() => handleSort('date')}
                    >
                      Date
                      <span className={`${sortConfig.key === 'date' ? 'text-[#117aca]' : 'text-gray-500'}`}>
                        {sortConfig.key === 'date' && sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" />}
                      </span>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">Description</th>
                  <th scope="col" aria-sort={sortConfig.key === 'amount' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'} className="p-0">
                    <button
                      type="button" 
                      className="w-full h-full px-6 py-4 font-medium flex items-center justify-end gap-2 hover:bg-gray-100 transition-colors focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#117aca]"
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                      <span className={`${sortConfig.key === 'amount' ? 'text-[#117aca]' : 'text-gray-500'}`}>
                        {sortConfig.key === 'amount' && sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" />}
                      </span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processedTransactions.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500 text-sm">
                            No transactions found.
                        </td>
                    </tr>
                ) : (
                    processedTransactions.map((tx) => (
                      <tr 
                        key={tx.id} 
                        onClick={() => onTransactionClick(tx)}
                        className="hover:bg-blue-50/50 transition-colors cursor-pointer group focus:outline-none focus:bg-blue-50"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onTransactionClick(tx);
                          }
                        }}
                        aria-label={`Transaction at ${tx.description} for ${formatCurrency(tx.amount)}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(tx.date, { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{tx.description}</div>
                          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                             <Tag className="h-3 w-3" /> {tx.category}
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                          {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recurring Payments */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
           <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                 <RefreshCw className="h-5 w-5 text-[#117aca]" />
                 Recurring
              </h3>
           </div>
           
           <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
              {recurringPayments.length === 0 ? (
                  <div className="text-center text-gray-400 py-8 text-sm">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No scheduled payments</p>
                  </div>
              ) : (
                  recurringPayments.map(payment => (
                      <div key={payment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100 relative group">
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <h4 className="font-semibold text-gray-900 text-sm">{payment.recipient}</h4>
                                  <p className="text-xs text-gray-500">{payment.category}</p>
                              </div>
                              <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancelRecurring(payment.id);
                                }}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                aria-label={`Cancel payment to ${payment.recipient}`}
                              >
                                  <Trash2 className="h-4 w-4" />
                              </button>
                          </div>
                          
                          <div className="flex justify-between items-end">
                              <div>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 uppercase tracking-wide">
                                      <Clock className="h-3 w-3" /> {payment.frequency}
                                  </span>
                                  <p className="text-xs text-gray-400 mt-1">Next: {formatDate(payment.nextDate)}</p>
                              </div>
                              <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                          </div>
                      </div>
                  ))
              )}
           </div>
           
           <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <button 
                 onClick={onBillPayClick}
                 className="w-full py-2 text-sm text-[#117aca] font-medium hover:underline"
              >
                  Schedule New Payment
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;