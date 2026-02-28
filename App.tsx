
import React, { useState, useEffect, Suspense } from 'react';
import { Menu, Search, LogOut, Bell, Settings, FileText, Send, PieChart, TrendingUp, X, Landmark, ChevronDown, Loader2 } from 'lucide-react';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import ChaseLogo from './components/ChaseLogo';
import { Transaction, RecurringPayment, Card, Loan, BankAccount, Account } from './types';
import { MOCK_TRANSACTIONS, INITIAL_BALANCE, MOCK_CARDS, MOCK_LOANS } from './constants';

// Lazy Load Heavy Components for Performance
const TransferModal = React.lazy(() => import('./components/TransferModal'));
const DepositModal = React.lazy(() => import('./components/DepositModal'));
const TransactionDetailsModal = React.lazy(() => import('./components/TransactionDetailsModal'));
const SettingsModal = React.lazy(() => import('./components/SettingsModal'));
const ConfirmationModal = React.lazy(() => import('./components/ConfirmationModal'));
const SupportModal = React.lazy(() => import('./components/SupportModal'));
const AccountManagementModal = React.lazy(() => import('./components/AccountManagementModal'));
const FinancialToolsModal = React.lazy(() => import('./components/FinancialToolsModal'));
const WealthManagementModal = React.lazy(() => import('./components/WealthManagementModal'));
const CardDetailsModal = React.lazy(() => import('./components/CardDetailsModal'));
const AccountDetailsModal = React.lazy(() => import('./components/AccountDetailsModal'));
const OpenAccountModal = React.lazy(() => import('./components/OpenAccountModal'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Marcelo Grant');
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [savingsBalance, setSavingsBalance] = useState(124500.00); 
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [cards, setCards] = useState<Card[]>(MOCK_CARDS);
  const [loans] = useState<Loan[]>(MOCK_LOANS);
  
  // Modals & UI State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedCardForDetails, setSelectedCardForDetails] = useState<Card | null>(null);
  const [isAccountMgmtOpen, setIsAccountMgmtOpen] = useState(false);
  const [isFinancialToolsOpen, setIsFinancialToolsOpen] = useState(false);
  const [isWealthOpen, setIsWealthOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isOpenAccountModalOpen, setIsOpenAccountModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'profile' | 'security' | 'preferences' | 'notifications' | 'accounts'>('profile');
  const [recurringPaymentIdToCancel, setRecurringPaymentIdToCancel] = useState<string | null>(null);
  const [transferMode, setTransferMode] = useState<'transfer' | 'bill'>('transfer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactionLimit, setTransactionLimit] = useState(5000);
  const [dailyLimit, setDailyLimit] = useState(10000);
  const [dailyTotalSent, setDailyTotalSent] = useState(0);

  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([
    { id: 'rp-1', recipient: 'Netflix Subscription', amount: 19.99, frequency: 'Monthly', nextDate: '2024-06-15', category: 'Entertainment', recipientBank: 'Citibank NA' },
    { id: 'rp-2', recipient: 'Luxury Apartments LLC', amount: 4200.00, frequency: 'Monthly', nextDate: '2024-06-01', category: 'Rent', recipientBank: 'Wells Fargo' }
  ]);

  const checkingAccount: BankAccount = { id: 'acct-checking', name: 'Total Checking', type: 'Checking', balance: balance, mask: '8842' };
  const savingsAccount: BankAccount = { id: 'acct-savings', name: 'Premier Savings', type: 'Savings', balance: savingsBalance, mask: '9921', apy: 2.45 };

  const handleLogin = (name?: string) => {
    if (name) setUserName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsLogoutConfirmOpen(false);
    setIsSidebarOpen(false);
    setSelectedAccount(null);
  };

  const handleTransfer = (amount: number, recipient: string, type: 'internal' | 'external' | 'international' | 'bill') => {
    setBalance((prev) => prev - amount);
    if (type !== 'internal') setDailyTotalSent(prev => prev + amount);
    if (type === 'internal') setSavingsBalance((prev) => prev + amount);
    const newTransaction: Transaction = { id: `tx-${Date.now()}`, date: new Date().toISOString().split('T')[0], description: `${type === 'bill' ? 'Bill Pay to' : type === 'internal' ? 'Transfer to Savings' : 'Transfer to'} ${recipient}`, amount: amount, type: 'debit', category: type === 'bill' ? 'Bill Payment' : type === 'internal' ? 'Internal Transfer' : 'Wire Transfer', accountId: 'acct-checking' };
    setTransactions((prev) => [newTransaction, ...prev]);
    setIsTransferModalOpen(false);
  };

  const handleDepositCheck = (amount: number, checkNumber: string) => {
    setBalance((prev) => prev + amount);
    const newTransaction: Transaction = { id: `tx-${Date.now()}`, date: new Date().toISOString().split('T')[0], description: `Mobile Deposit (Check #${checkNumber})`, amount: amount, type: 'credit', category: 'Mobile Deposit', accountId: 'acct-checking' };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const handleSchedulePayment = (payment: Omit<RecurringPayment, 'id'>) => {
    const newPayment: RecurringPayment = { ...payment, id: `rp-${Date.now()}`, recipientBank: 'Chase Bank' };
    setRecurringPayments(prev => [...prev, newPayment]);
    setIsTransferModalOpen(false);
  };

  const handleToggleCardLock = (id: string) => {
    setCards(currentCards => currentCards.map(card => card.id === id ? { ...card, status: card.status === 'Active' ? 'Frozen' : 'Active' } : card));
  };

  const handleOpenAccountApplication = (productName: string, initialDeposit: number) => {
    if (initialDeposit > 0) {
      setBalance(prev => prev - initialDeposit);
      const tx: Transaction = { id: `tx-open-${Date.now()}`, date: new Date().toISOString().split('T')[0], description: `Opening Deposit - ${productName}`, amount: initialDeposit, type: 'debit', category: 'Account Funding', accountId: 'acct-checking' };
      setTransactions(prev => [tx, ...prev]);
    }
  };

  const menuItems = [
    { title: 'Account Management', description: 'View statements, tax documents, and receipts', icon: FileText, action: () => { setIsSidebarOpen(false); setIsAccountMgmtOpen(true); } },
    { title: 'Payments & Transfers', description: 'Send money with Zelle®, pay bills, and transfer funds', icon: Send, action: () => { setIsSidebarOpen(false); setTransferMode('transfer'); setIsTransferModalOpen(true); } },
    { title: 'Financial Tools', description: 'Spending reports, Credit Journey, and Autosave', icon: PieChart, action: () => { setIsSidebarOpen(false); setIsFinancialToolsOpen(true); } },
    { title: 'Wealth Management', description: 'J.P. Morgan Wealth Management & Goals', icon: TrendingUp, action: () => { setIsSidebarOpen(false); setIsWealthOpen(true); } },
    { title: 'Services & Settings', description: 'Customer service, app settings, and security', icon: Settings, action: () => { setIsSidebarOpen(false); setSettingsInitialTab('profile'); setIsSettingsModalOpen(true); } }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-slate-800 overflow-x-hidden">
      {!isAuthenticated ? (
        <div className="flex-1 bg-cover bg-center flex flex-col relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070")' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/30"></div>
          <div className="relative z-10 w-full">
            <div className="bg-[#117aca] text-white px-4 md:px-12 py-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><ChaseLogo className="h-10 w-10 text-white" /><span className="text-2xl font-bold tracking-tight uppercase">Chase</span></div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative z-10 flex items-center justify-center px-4">
            <div className="w-full max-w-sm"><AuthModal onLogin={handleLogin} /></div>
          </div>
          <footer className="relative z-10 py-6 text-center text-white/70 text-xs bg-black/20 backdrop-blur-sm">
            <p>© 2024 JPMorgan Chase & Co. Member FDIC.</p>
          </footer>
        </div>
      ) : (
        <>
          <header className="bg-[#117aca] text-white shadow-lg sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="p-1 hover:bg-blue-700 rounded transition" onClick={() => setIsSidebarOpen(true)}><Menu className="h-6 w-6" /></button>
                <div className="flex items-center gap-2"><ChaseLogo className="h-8 w-8 text-white" /><span className="font-bold text-2xl tracking-tight">CHASE</span></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-sm font-medium">{userName}</span>
                <button onClick={() => setIsLogoutConfirmOpen(true)} className="p-2 bg-blue-800 hover:bg-blue-900 rounded-full transition"><LogOut className="h-4 w-4" /></button>
              </div>
            </div>
          </header>

          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
              <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col">
                <div className="p-4 bg-[#117aca] text-white flex justify-between items-center">
                  <div className="flex items-center gap-2 font-bold">Menu</div>
                  <button onClick={() => setIsSidebarOpen(false)}><X className="h-6 w-6" /></button>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                  {menuItems.map((item, index) => (
                    <button key={index} onClick={item.action} className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 flex gap-4 items-start">
                      <div className="p-2 bg-blue-50 text-[#117aca] rounded-lg"><item.icon className="h-5 w-5" /></div>
                      <div><h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4><p className="text-xs text-gray-500">{item.description}</p></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <Dashboard 
              userName={userName} 
              balance={balance} 
              savingsBalance={savingsBalance} 
              transactions={transactions} 
              recurringPayments={recurringPayments} 
              cards={cards} 
              loans={loans} 
              onTransferClick={() => { setTransferMode('transfer'); setIsTransferModalOpen(true); }} 
              onBillPayClick={() => { setTransferMode('bill'); setIsTransferModalOpen(true); }} 
              onDepositClick={() => setIsDepositModalOpen(true)} 
              onCancelRecurring={setRecurringPaymentIdToCancel} 
              onToggleCardLock={handleToggleCardLock} 
              onTransactionClick={setSelectedTransaction} 
              onPayCard={() => { setTransferMode('transfer'); setIsTransferModalOpen(true); }} 
              onViewStatements={() => setIsAccountMgmtOpen(true)} 
              onShowDetails={setSelectedCardForDetails} 
              onSelectAccount={setSelectedAccount} 
              onOpenAccountClick={() => setIsOpenAccountModalOpen(true)}
              checkingAccount={checkingAccount} 
              savingsAccount={savingsAccount} 
            />
          </main>

          <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10"><Loader2 className="h-8 w-8 animate-spin text-[#117aca]" /></div>}>
            <TransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} onTransfer={handleTransfer} onSchedule={handleSchedulePayment} onUpdateLimits={(tx, d) => { setTransactionLimit(tx); setDailyLimit(d); }} currentBalance={balance} savingsBalance={savingsBalance} mode={transferMode} transactionLimit={transactionLimit} dailyLimit={dailyLimit} dailyTotalSent={dailyTotalSent} />
            <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} onDeposit={handleDepositCheck} />
            <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} initialTab={settingsInitialTab} />
            <CardDetailsModal isOpen={!!selectedCardForDetails} onClose={() => setSelectedCardForDetails(null)} card={selectedCardForDetails} />
            <AccountDetailsModal isOpen={!!selectedAccount} onClose={() => setSelectedAccount(null)} account={selectedAccount} transactions={transactions} />
            <AccountManagementModal isOpen={isAccountMgmtOpen} onClose={() => setIsAccountMgmtOpen(false)} />
            <FinancialToolsModal isOpen={isFinancialToolsOpen} onClose={() => setIsFinancialToolsOpen(false)} />
            <WealthManagementModal isOpen={isWealthOpen} onClose={() => setIsWealthOpen(false)} />
            <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
            <OpenAccountModal isOpen={isOpenAccountModalOpen} onClose={() => setIsOpenAccountModalOpen(false)} onSubmit={handleOpenAccountApplication} />
            <ConfirmationModal isOpen={isLogoutConfirmOpen} onClose={() => setIsLogoutConfirmOpen(false)} onConfirm={handleLogout} title="Sign out?" message="Are you sure you want to sign out?" confirmLabel="Sign Out" variant="danger" icon={LogOut} />
            <ConfirmationModal isOpen={!!recurringPaymentIdToCancel} onClose={() => setRecurringPaymentIdToCancel(null)} onConfirm={() => { if (recurringPaymentIdToCancel) { setRecurringPayments(prev => prev.filter(p => p.id !== recurringPaymentIdToCancel)); setRecurringPaymentIdToCancel(null); } }} title="Cancel Payment?" message="Are you sure?" confirmLabel="Cancel" variant="danger" />
            <TransactionDetailsModal isOpen={!!selectedTransaction} onClose={() => setSelectedTransaction(null)} transaction={selectedTransaction} />
          </Suspense>
        </>
      )}
    </div>
  );
}

export default App;
