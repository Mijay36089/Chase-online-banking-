import React, { useState, useEffect, Suspense } from 'react';
import { Menu, Search, User as UserIcon, LogOut, Bell, Building2, Settings, FileText, Send, PieChart, TrendingUp, HelpCircle, X, Store, Activity, FileBarChart, ChevronDown, ArrowUpRight, Lock, RefreshCw, ChevronLeft, ChevronRight as ChevronRightIcon, Star, MoreVertical, Loader2 } from 'lucide-react';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import ChaseLogo from './components/ChaseLogo';
import { Transaction, RecurringPayment, Card, Loan, BankAccount, Account } from './types';
import { MOCK_TRANSACTIONS, INITIAL_BALANCE, MOCK_CARDS, MOCK_LOANS } from './constants';

// Lazy Load Heavy Components for Fast Initial Load
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
  const [savingsBalance, setSavingsBalance] = useState(124500.00); // Mock Savings Balance
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [cards, setCards] = useState<Card[]>(MOCK_CARDS);
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);
  
  // Modals & UI State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Account Details Navigation
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  // Card Details Modal
  const [selectedCardForDetails, setSelectedCardForDetails] = useState<Card | null>(null);

  // New Functional Modals State
  const [isAccountMgmtOpen, setIsAccountMgmtOpen] = useState(false);
  const [isFinancialToolsOpen, setIsFinancialToolsOpen] = useState(false);
  const [isWealthOpen, setIsWealthOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isOpenAccountModalOpen, setIsOpenAccountModalOpen] = useState(false);
  
  // Settings Tab Deep Link State
  const [settingsInitialTab, setSettingsInitialTab] = useState<any>('profile');
  
  // Recurring Payment Cancellation State
  const [recurringPaymentIdToCancel, setRecurringPaymentIdToCancel] = useState<string | null>(null);
  
  const [transferMode, setTransferMode] = useState<'transfer' | 'bill'>('transfer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Transfer Limits State
  const [transactionLimit, setTransactionLimit] = useState(5000);
  const [dailyLimit, setDailyLimit] = useState(10000);
  const [dailyTotalSent, setDailyTotalSent] = useState(0);

  // State for Recurring Payments
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([
    {
      id: 'rp-1',
      recipient: 'Netflix Subscription',
      amount: 19.99,
      frequency: 'Monthly',
      nextDate: '2024-06-15',
      category: 'Entertainment',
      recipientBank: 'Citibank NA'
    },
    {
      id: 'rp-2',
      recipient: 'Luxury Apartments LLC',
      amount: 4200.00,
      frequency: 'Monthly',
      nextDate: '2024-06-01',
      category: 'Rent',
      recipientBank: 'Wells Fargo'
    }
  ]);

  // Derived Account Objects for consistency
  const checkingAccount: BankAccount = {
    id: 'acct-checking',
    name: 'Total Checking',
    type: 'Checking',
    balance: balance,
    mask: '8842'
  };

  const savingsAccount: BankAccount = {
    id: 'acct-savings',
    name: 'Premier Savings',
    type: 'Savings',
    balance: savingsBalance,
    mask: '9921',
    apy: 2.45
  };

  // Simulation Logic (Removed notifications simulation as requested)
  useEffect(() => {
    if (!isAuthenticated) return;

    const merchants = [
      { name: 'Starbucks', category: 'Food & Drink', avgAmount: 12.50 },
      { name: 'Uber Technologies', category: 'Transport', avgAmount: 25.00 },
      { name: 'Amazon Marketplace', category: 'Shopping', avgAmount: 85.00 },
      { name: 'Shell Station', category: 'Gas', avgAmount: 45.00 },
      { name: 'Spotify Premium', category: 'Entertainment', avgAmount: 11.99 },
      { name: 'Whole Foods', category: 'Groceries', avgAmount: 120.00 }
    ];

    const interval = setInterval(() => {
      // 50% chance to trigger a transaction every 5 seconds for more "live" feel
      if (Math.random() > 0.5) {
        const merchant = merchants[Math.floor(Math.random() * merchants.length)];
        const amount = Number((merchant.avgAmount + (Math.random() * 20 - 10)).toFixed(2));
        const activeCard = cards.find(c => c.status === 'Active') || cards[0];
        
        if (!activeCard) return; // No active cards

        // Create Transaction
        const newTransaction: Transaction = {
          id: `tx-sim-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: merchant.name,
          amount: amount,
          type: 'debit',
          category: merchant.category,
          accountId: activeCard.id // Assign to the active card
        };

        setTransactions(prev => [newTransaction, ...prev]);
        
        // Update Balance (Simulated logic: Credit card adds to balance owed, Debit subtracts from main balance)
        if (activeCard.type === 'Debit') {
          setBalance(prev => prev - amount);
        } else {
            setCards(prevCards => prevCards.map(c => 
                c.id === activeCard.id 
                ? { ...c, balance: (c.balance || 0) + amount }
                : c
            ));
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, cards]);

  const handleLogin = (name?: string) => {
    if (name) setUserName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setBalance(INITIAL_BALANCE); 
    setSavingsBalance(124500.00);
    setTransactions(MOCK_TRANSACTIONS);
    setCards(MOCK_CARDS);
    setLoans(MOCK_LOANS);
    setDailyTotalSent(0);
    setIsLogoutConfirmOpen(false);
    setIsSidebarOpen(false);
    setUserName('Marcelo Grant');
    setSelectedAccount(null);
  };

  const handleTransfer = (amount: number, recipient: string, type: 'internal' | 'external' | 'international' | 'bill') => {
    // Optimistic Update
    setBalance((prev) => prev - amount);
    
    // Track daily usage for limits
    if (type !== 'internal') {
        setDailyTotalSent(prev => prev + amount);
    }
    
    // If internal, add to savings
    if (type === 'internal') {
      setSavingsBalance((prev) => prev + amount);
    }
    
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `${type === 'bill' ? 'Bill Pay to' : type === 'internal' ? 'Transfer to Savings' : 'Transfer to'} ${recipient}`,
      amount: amount,
      type: 'debit',
      category: type === 'bill' ? 'Bill Payment' : type === 'internal' ? 'Internal Transfer' : 'Wire Transfer',
      accountId: 'acct-checking'
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setIsTransferModalOpen(false);
  };

  const handleDepositCheck = (amount: number, checkNumber: string) => {
    // Optimistic Update
    // Correction: Deposits add to balance.
    setBalance((prev) => prev + amount);

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `Mobile Deposit (Check #${checkNumber})`,
      amount: amount,
      type: 'credit',
      category: 'Mobile Deposit',
      accountId: 'acct-checking'
    };

    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const handleSchedulePayment = (payment: Omit<RecurringPayment, 'id'>) => {
    const newPayment: RecurringPayment = {
      ...payment,
      id: `rp-${Date.now()}`,
      recipientBank: 'Chase Bank' // Default for now as form doesn't capture it yet
    };
    setRecurringPayments(prev => [...prev, newPayment]);
    setIsTransferModalOpen(false);
  };

  const handleInitiateCancelRecurring = (id: string) => {
    setRecurringPaymentIdToCancel(id);
  };

  const handleConfirmCancelRecurring = () => {
    if (recurringPaymentIdToCancel) {
        setRecurringPayments(prev => prev.filter(p => p.id !== recurringPaymentIdToCancel));
        setRecurringPaymentIdToCancel(null);
    }
  };

  const handleToggleCardLock = (id: string) => {
    setCards(currentCards => 
      currentCards.map(card => 
        card.id === id 
          ? { ...card, status: card.status === 'Active' ? 'Frozen' : 'Active' }
          : card
      )
    );
  };

  const handleUpdateLimits = (txLimit: number, dayLimit: number) => {
    setTransactionLimit(txLimit);
    setDailyLimit(dayLimit);
  };

  const handleOpenAccountApplication = (productName: string, initialDeposit: number) => {
      // Simulate account creation success by adding a notification
      // (Notifications removed, so this is just for internal logic)
      
      // If there was an initial deposit, deduct it
      if (initialDeposit > 0) {
          setBalance(prev => prev - initialDeposit);
          const tx: Transaction = {
              id: `tx-open-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              description: `Opening Deposit - ${productName}`,
              amount: initialDeposit,
              type: 'debit',
              category: 'Account Funding',
              accountId: 'acct-checking'
          };
          setTransactions(prev => [tx, ...prev]);
      }
  };

  const openTransfer = () => {
    setTransferMode('transfer');
    setIsTransferModalOpen(true);
  };

  const openBillPay = () => {
    setTransferMode('bill');
    setIsTransferModalOpen(true);
  };

  const handlePayCard = (card: Card) => {
    // Open Transfer Modal specifically for paying this card
    setTransferMode('transfer');
    setIsTransferModalOpen(true);
  };

  const handleViewStatements = () => {
    setIsAccountMgmtOpen(true);
  };

  const handleShowCardDetails = (card: Card) => {
    setSelectedCardForDetails(card);
  };

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
  };

  // Updated Menu Items based on new consumer banking requirements
  const menuItems = [
    {
      title: 'Account Management',
      description: 'View statements, tax documents, and receipts',
      icon: FileText,
      action: () => {
        setIsSidebarOpen(false);
        setIsAccountMgmtOpen(true);
      }
    },
    {
      title: 'Payments & Transfers',
      description: 'Send money with Zelle®, pay bills, and transfer funds',
      icon: Send,
      action: () => {
        setIsSidebarOpen(false);
        setTransferMode('transfer');
        setIsTransferModalOpen(true);
      }
    },
    {
      title: 'Financial Tools',
      description: 'Spending reports, Credit Journey, and Autosave',
      icon: PieChart,
      action: () => {
        setIsSidebarOpen(false);
        setIsFinancialToolsOpen(true);
      }
    },
    {
      title: 'Wealth Management',
      description: 'J.P. Morgan Wealth Management & Goals',
      icon: TrendingUp,
      action: () => {
        setIsSidebarOpen(false);
        setIsWealthOpen(true);
      }
    },
    {
      title: 'Services & Settings',
      description: 'Customer service, app settings, and security',
      icon: Settings,
      action: () => {
        setIsSidebarOpen(false);
        setSettingsInitialTab('profile');
        setIsSettingsModalOpen(true);
      }
    }
  ];

  // Realistic URL simulation
  const currentUrl = isAuthenticated 
    ? 'https://secure.chase.com/web/auth/dashboard' 
    : 'https://www.chase.com/personal/banking/login';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-slate-800">
      
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#117aca] focus:shadow-md focus:ring-2 focus:ring-[#117aca] rounded-md font-semibold"
      >
        Skip to main content
      </a>

      {!isAuthenticated ? (
      <div 
        className="flex-1 bg-cover bg-center flex flex-col relative"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/30"></div>
        
        {/* Public Portal Header */}
        <div className="relative z-10 w-full">
            {/* Top thin bar */}
            <div className="bg-black/40 text-white/90 text-xs px-4 md:px-12 py-1.5 flex justify-between">
                <div className="flex gap-4">
                    <span className="cursor-pointer hover:text-white font-bold">Personal</span>
                    <span className="cursor-pointer hover:text-white">Business</span>
                    <span className="cursor-pointer hover:text-white">Commercial</span>
                </div>
                <div className="flex gap-4">
                    <span className="cursor-pointer hover:text-white">Schedule a Meeting</span>
                    <span className="cursor-pointer hover:text-white">Customer Service</span>
                    <span className="cursor-pointer hover:text-white">Español</span>
                </div>
            </div>
            
            {/* Main Header & Nav */}
            <div className="bg-[#117aca] text-white px-4 md:px-12 py-4 shadow-md">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo Area */}
                    <a href="https://www.chase.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                         <ChaseLogo className="h-10 w-10 text-white" />
                         <span className="text-2xl font-bold tracking-tight uppercase">Chase</span>
                    </a>

                    {/* Desktop Navigation Tabs */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-900">
                         <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200">Checking <ChevronDown className="h-3 w-3" /></div>
                         <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200">Savings <ChevronDown className="h-3 w-3" /></div>
                         <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200">Credit Cards <ChevronDown className="h-3 w-3" /></div>
                         <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200">Home Loans <ChevronDown className="h-3 w-3" /></div>
                         <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200">Auto <ChevronDown className="h-3 w-3" /></div>
                         <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200">Investing <ChevronDown className="h-3 w-3" /></div>
                    </nav>

                    <div className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </div>
                </div>
            </div>
        </div>

        {/* Login Container Positioning */}
        <div className="flex-1 relative z-10 flex items-center justify-end px-4 md:px-12 lg:px-24">
             <div className="w-full max-w-sm mr-auto md:mr-0">
                 <AuthModal onLogin={handleLogin} />
             </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 py-6 text-center text-white/70 text-xs bg-black/20 backdrop-blur-sm mt-auto w-full">
            <p className="mb-2">JPMorgan Chase & Co.</p>
            <div className="flex justify-center gap-4 mb-2">
                <span className="hover:underline cursor-pointer">Privacy</span>
                <span className="hover:underline cursor-pointer">Security</span>
                <span className="hover:underline cursor-pointer">Terms of Use</span>
                <span className="hover:underline cursor-pointer">Accessibility</span>
            </div>
            <a href="https://www.chase.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                Visit Chase.com <ArrowUpRight className="h-3 w-3" />
            </a>
            <p className="mt-2">Member FDIC. Equal Housing Lender.</p>
            
            <div className="mt-6 text-[10px] text-gray-400">
                <p>Authorized Access Only</p>
                <a href="/" className="text-blue-400 hover:text-blue-300 font-mono mt-1 inline-block">
                    {currentUrl}
                </a>
            </div>
        </div>
      </div>
      ) : (
      <>
        {/* Navigation Header */}
        <header className="bg-[#117aca] text-white shadow-lg sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Hamburger Button (Now Visible on Desktop too) */}
                <button 
                    className="p-1 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isSidebarOpen}
                >
                <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex items-center gap-2">
                    <ChaseLogo className="h-8 w-8 text-white" />
                    <span className="font-bold text-2xl tracking-tight">CHASE</span>
                </div>
                {/* Desktop Nav Links */}
                <nav className="hidden md:flex ml-8 space-x-6 text-sm font-medium text-gray-900" aria-label="Main Navigation">
                <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                    className="text-white border-b-2 border-white pb-0.5 hover:opacity-90 transition-opacity"
                >
                    Accounts
                </button>
                <button 
                    onClick={openTransfer}
                    className="text-blue-100 hover:text-white transition-colors"
                >
                    Pay & Transfer
                </button>
                <button 
                    onClick={() => setIsFinancialToolsOpen(true)}
                    className="text-blue-100 hover:text-white transition-colors"
                >
                    Plan & Track
                </button>
                <button 
                    onClick={() => setIsWealthOpen(true)}
                    className="text-blue-100 hover:text-white transition-colors"
                >
                    Investments
                </button>
                <button 
                    onClick={() => {
                    setSettingsInitialTab('security');
                    setIsSettingsModalOpen(true);
                    }}
                    className="text-blue-100 hover:text-white transition-colors"
                >
                    Security
                </button>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <button 
                onClick={() => setIsSupportOpen(true)}
                className="p-2 hover:bg-blue-700 rounded-full transition focus:outline-none focus:ring-2 focus:ring-white" 
                aria-label="Search and Support"
                >
                <Search className="h-5 w-5 text-blue-100" aria-hidden="true" />
                </button>
                <button 
                className="p-2 hover:bg-blue-700 rounded-full transition relative group focus:outline-none focus:ring-2 focus:ring-white" 
                aria-label={`Notifications ${''}`}
                aria-expanded="false"
                aria-haspopup="true"
                >
                <Bell className="h-5 w-5 text-blue-100" aria-hidden="true" />
                {/* Notification Dropdown Preview - Removed content as live activity is removed */}
                </button>
                <div className="hidden md:flex items-center gap-2 pl-4 border-l border-blue-600">
                <span className="text-sm font-medium">{userName}</span>
                <button 
                    onClick={() => {
                    setSettingsInitialTab('profile');
                    setIsSettingsModalOpen(true);
                    }}
                    className="p-2 hover:bg-blue-800 rounded-full transition focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Settings"
                >
                    <Settings className="h-5 w-5 text-blue-100" />
                </button>
                <button 
                    onClick={() => setIsLogoutConfirmOpen(true)}
                    className="p-2 bg-blue-800 hover:bg-blue-900 rounded-full transition focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Logout"
                >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                </button>
                </div>
            </div>
            </div>
        </header>

        {/* Main Feature Sidebar (Hamburger Menu) */}
        {isSidebarOpen && (
            <div className="fixed inset-0 z-50 flex">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                ></div>

                {/* Sidebar Panel */}
                <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-fade-in" style={{ animationName: 'slideRight' }}>
                    {/* Sidebar Header */}
                    <div className="p-4 bg-[#117aca] text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                            <ChaseLogo className="h-6 w-6 text-white" />
                            <span className="font-bold text-lg">Menu</span>
                        </div>
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1 hover:bg-blue-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto py-2">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.action}
                                className="w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 group focus:outline-none focus:bg-gray-50"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-50 text-[#117aca] rounded-lg group-hover:bg-[#117aca] group-hover:text-white transition-colors">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                        
                        {/* Sign Out Button in Menu */}
                        <button
                            onClick={() => {
                                setIsLogoutConfirmOpen(true);
                                setIsSidebarOpen(false);
                            }}
                            className="w-full text-left p-4 hover:bg-red-50 transition-colors border-b border-gray-100 group mt-2"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm">Sign Out</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Signs you out of the application</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50 text-center border-t border-gray-100 text-xs text-gray-500">
                        <p>Chase Premier Banking</p>
                        <p>Version 2.5.0</p>
                    </div>
                </div>
            </div>
        )}

        {/* Main Content Layout */}
        <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8" tabIndex={-1}>
            <Dashboard 
            userName={userName}
            balance={balance} 
            savingsBalance={savingsBalance}
            transactions={transactions} 
            recurringPayments={recurringPayments}
            cards={cards}
            loans={loans}
            onTransferClick={openTransfer}
            onBillPayClick={openBillPay}
            onDepositClick={() => setIsDepositModalOpen(true)}
            onCancelRecurring={handleInitiateCancelRecurring}
            onToggleCardLock={handleToggleCardLock}
            onTransactionClick={(tx) => setSelectedTransaction(tx)}
            onPayCard={handlePayCard}
            onViewStatements={handleViewStatements}
            onShowDetails={handleShowCardDetails}
            onSelectAccount={handleSelectAccount} 
            onOpenAccountClick={() => setIsOpenAccountModalOpen(true)} // Wire up the handler
            checkingAccount={checkingAccount}
            savingsAccount={savingsAccount}
            />
        </main>

        {/* Modals wrapped in Suspense for Lazy Loading */}
        <Suspense fallback={
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                <div className="bg-white p-4 rounded-full shadow-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-[#117aca]" />
                </div>
            </div>
        }>
            <TransferModal 
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                onTransfer={handleTransfer}
                onSchedule={handleSchedulePayment}
                onUpdateLimits={handleUpdateLimits}
                currentBalance={balance}
                savingsBalance={savingsBalance}
                mode={transferMode}
                transactionLimit={transactionLimit}
                dailyLimit={dailyLimit}
                dailyTotalSent={dailyTotalSent}
            />

            <DepositModal 
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                onDeposit={handleDepositCheck}
            />

            <SettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                initialTab={settingsInitialTab}
            />

            <CardDetailsModal
                isOpen={!!selectedCardForDetails}
                onClose={() => setSelectedCardForDetails(null)}
                card={selectedCardForDetails}
            />

            <AccountDetailsModal
                isOpen={!!selectedAccount}
                onClose={() => setSelectedAccount(null)}
                account={selectedAccount}
                transactions={transactions}
            />

            <AccountManagementModal 
                isOpen={isAccountMgmtOpen} 
                onClose={() => setIsAccountMgmtOpen(false)} 
            />

            <FinancialToolsModal 
                isOpen={isFinancialToolsOpen} 
                onClose={() => setIsFinancialToolsOpen(false)} 
            />

            <WealthManagementModal 
                isOpen={isWealthOpen} 
                onClose={() => setIsWealthOpen(false)} 
            />

            <SupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
            />

            <OpenAccountModal
                isOpen={isOpenAccountModalOpen}
                onClose={() => setIsOpenAccountModalOpen(false)}
                onSubmit={handleOpenAccountApplication}
            />

            <ConfirmationModal 
                isOpen={isLogoutConfirmOpen}
                onClose={() => setIsLogoutConfirmOpen(false)}
                onConfirm={handleLogout}
                title="Sign out?"
                message="Are you sure you want to sign out of your account? You will need to enter your credentials to access your banking dashboard again."
                confirmLabel="Sign Out"
                variant="danger"
                icon={LogOut}
            />

            <ConfirmationModal
                isOpen={!!recurringPaymentIdToCancel}
                onClose={() => setRecurringPaymentIdToCancel(null)}
                onConfirm={handleConfirmCancelRecurring}
                title="Cancel Recurring Payment?"
                message="Are you sure you want to cancel this recurring payment? Future scheduled transfers for this recipient will be stopped."
                confirmLabel="Cancel Payment"
                variant="danger"
            />

            <TransactionDetailsModal
                isOpen={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                transaction={selectedTransaction}
            />
        </Suspense>
      </>
      )}

    </div>
  );
}

export default App;