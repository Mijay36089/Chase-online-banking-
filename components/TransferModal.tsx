import React, { useState, useEffect } from 'react';
import { X, Send, Receipt, Building, Globe, ArrowRightLeft, Landmark, RefreshCw, Settings, ShieldCheck, ChevronLeft, Check, Loader2, AlertCircle, Clock } from 'lucide-react';
import { RecurringPayment } from '../types';
import ConfirmationModal from './ConfirmationModal';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (amount: number, recipient: string, type: 'internal' | 'external' | 'international' | 'bill') => void;
  onSchedule: (payment: Omit<RecurringPayment, 'id'>) => void;
  onUpdateLimits: (perTxLimit: number, dailyLimit: number) => void;
  currentBalance: number;
  savingsBalance: number;
  mode?: 'transfer' | 'bill';
  transactionLimit: number;
  dailyLimit: number;
  dailyTotalSent: number;
}

type TransferTab = 'internal' | 'domestic' | 'international';

const TransferModal: React.FC<TransferModalProps> = ({ 
  isOpen, 
  onClose, 
  onTransfer, 
  onSchedule,
  onUpdateLimits,
  currentBalance, 
  savingsBalance,
  mode = 'transfer',
  transactionLimit,
  dailyLimit,
  dailyTotalSent
}) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [activeTab, setActiveTab] = useState<TransferTab>('domestic');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Specific fields
  const [routingNum, setRoutingNum] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [iban, setIban] = useState('');
  const [country, setCountry] = useState('');

  // Recurring state
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Settings Mode state
  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [newTxLimit, setNewTxLimit] = useState(transactionLimit.toString());
  const [newDailyLimit, setNewDailyLimit] = useState(dailyLimit.toString());

  // Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setRecipient('');
      setRoutingNum('');
      setAccountNum('');
      setSwiftCode('');
      setIban('');
      setCountry('');
      setError('');
      setSuccessMsg('');
      setIsRecurring(false);
      setFrequency('Monthly');
      setActiveTab('domestic');
      setIsSettingsMode(false);
      setIsConfirmOpen(false);
      setIsProcessing(false);
      setNewTxLimit(transactionLimit.toString());
      setNewDailyLimit(dailyLimit.toString());
    }
  }, [isOpen, transactionLimit, dailyLimit]);

  if (!isOpen) return null;

  const isBillPay = mode === 'bill';

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    const txLim = parseFloat(newTxLimit);
    const dayLim = parseFloat(newDailyLimit);

    if (isNaN(txLim) || txLim < 0 || isNaN(dayLim) || dayLim < 0) {
      setError('Limits must be positive numbers.');
      return;
    }

    if (txLim > dayLim) {
        setError('Per-transaction limit cannot exceed daily limit.');
        return;
    }

    onUpdateLimits(txLim, dayLim);
    setSuccessMsg('Transfer limits updated successfully.');
    setTimeout(() => {
        setIsSettingsMode(false);
        setSuccessMsg('');
        setError('');
    }, 1500);
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    
    if (numAmount > currentBalance) {
      setError('Insufficient funds in Checking.');
      return;
    }

    // Limit Checks
    if (numAmount > transactionLimit) {
        setError(`Amount exceeds your per-transaction limit of $${transactionLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
        return;
    }

    if (numAmount + dailyTotalSent > dailyLimit) {
        setError(`Amount exceeds your remaining daily limit. Available: $${(dailyLimit - dailyTotalSent).toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
        return;
    }

    // Validation based on type
    if (isBillPay) {
       if (!recipient.trim()) { setError('Biller name is required.'); return; }
    } else if (activeTab === 'domestic') {
       if (!recipient.trim()) { setError('Recipient name is required.'); return; }
       if (!routingNum.trim() || routingNum.length < 9) { setError('Valid Routing Number is required.'); return; }
       if (!accountNum.trim()) { setError('Account Number is required.'); return; }
    } else if (activeTab === 'international') {
       if (!recipient.trim()) { setError('Recipient name is required.'); return; }
       if (!swiftCode.trim()) { setError('SWIFT/BIC Code is required.'); return; }
       if (!iban.trim()) { setError('IBAN is required.'); return; }
       if (!country.trim()) { setError('Country is required.'); return; }
    }
    // Internal doesn't need recipient validation as it's fixed

    // If validation passes, open Confirmation Modal
    setIsConfirmOpen(true);
  };

  const handleExecuteTransfer = () => {
    setIsProcessing(true);
    
    // Simulate network delay for realism
    setTimeout(() => {
        const numAmount = parseFloat(amount);
        let finalRecipient = recipient;
        let transferType: 'internal' | 'external' | 'international' | 'bill' = 'external';

        if (isBillPay) {
        transferType = 'bill';
        } else {
        if (activeTab === 'internal') {
            finalRecipient = 'Chase Savings (...9921)';
            transferType = 'internal';
        } else if (activeTab === 'domestic') {
            transferType = 'external';
        } else if (activeTab === 'international') {
            transferType = 'international';
        }
        }

        if (isRecurring) {
        onSchedule({
            recipient: finalRecipient,
            amount: numAmount,
            frequency,
            nextDate: startDate,
            category: isBillPay ? 'Bill Payment' : `Recurring ${activeTab}`
        });
        } else {
        onTransfer(numAmount, finalRecipient, transferType);
        }

        setIsProcessing(false);
        setIsConfirmOpen(false);
        onClose();
    }, 1500);
  };

  const getRecipientDisplay = () => {
      if (activeTab === 'internal' && !isBillPay) return 'Chase Savings (...9921)';
      return recipient;
  };

  const getEstimatedArrival = () => {
      if (activeTab === 'internal' && !isBillPay) return 'Instant';
      if (activeTab === 'domestic') return '1-2 Business Days';
      if (activeTab === 'international') return '3-5 Business Days';
      return '1-3 Business Days'; // Bill pay
  };

  const getFeeDisplay = () => {
      if (activeTab === 'international') return '$15.00';
      return '$0.00 (Premier Benefit)';
  };

  const getDateSummary = () => {
    const dateObj = new Date(isRecurring ? startDate : new Date());
    const dateStr = dateObj.toLocaleDateString('en-US', {
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        timeZone: 'America/New_York'
    });
    
    if (isRecurring) {
        return `${dateStr} (Recurring ${frequency})`;
    }
    return `${dateStr} (Instant)`;
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        role="dialog" 
        aria-modal="true"
        aria-labelledby="transfer-modal-title"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
            <h3 id="transfer-modal-title" className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {isSettingsMode ? (
                  <>
                      <Settings className="h-6 w-6 text-gray-600" aria-hidden="true" />
                      Transfer Limits
                  </>
              ) : (
                  <>
                      {isBillPay ? <Receipt className="h-6 w-6 text-[#117aca]" aria-hidden="true" /> : <Send className="h-6 w-6 text-[#117aca]" aria-hidden="true" />}
                      {isBillPay ? 'Pay a Bill' : 'Transfer Funds'}
                  </>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {!isBillPay && (
                  <button 
                      onClick={() => {
                          setIsSettingsMode(!isSettingsMode);
                          setError('');
                          setSuccessMsg('');
                      }}
                      className="text-gray-400 hover:text-[#117aca] transition-colors p-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#117aca]"
                      title="Transfer Settings"
                      aria-label="Manage transfer limits"
                  >
                      <Settings className="h-5 w-5" />
                  </button>
              )}
              <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Close modal"
              >
                  <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* View Switcher: Settings vs Form */}
          {isSettingsMode ? (
              <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                          <ShieldCheck className="h-5 w-5 text-[#117aca] mt-0.5" />
                          <p className="text-sm text-blue-800" id="limits-explainer">
                              Set your daily and per-transaction limits for added security. 
                              Changes apply immediately.
                          </p>
                      </div>
                  </div>

                  <form onSubmit={handleSaveLimits} className="space-y-6" aria-describedby="limits-explainer">
                      <div>
                          <label htmlFor="tx-limit" className="block text-sm font-medium text-gray-700 mb-1">Max Per Transaction</label>
                          <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                              <input 
                                  id="tx-limit"
                                  type="number" 
                                  value={newTxLimit}
                                  onChange={(e) => setNewTxLimit(e.target.value)}
                                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117aca] outline-none"
                                  placeholder="5000"
                                  aria-required="true"
                              />
                          </div>
                      </div>

                      <div>
                          <label htmlFor="daily-limit" className="block text-sm font-medium text-gray-700 mb-1">Daily Limit</label>
                          <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                              <input 
                                  id="daily-limit"
                                  type="number" 
                                  value={newDailyLimit}
                                  onChange={(e) => setNewDailyLimit(e.target.value)}
                                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117aca] outline-none"
                                  placeholder="10000"
                                  aria-required="true"
                              />
                          </div>
                      </div>

                      {error && (
                          <p className="text-red-600 text-sm bg-red-50 p-2 rounded flex items-center gap-2" role="alert" aria-live="assertive">
                             <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                             {error}
                          </p>
                      )}
                      {successMsg && (
                          <p className="text-green-600 text-sm bg-green-50 p-2 rounded flex items-center gap-2" role="status">
                              <Check className="h-4 w-4" aria-hidden="true" />
                              {successMsg}
                          </p>
                      )}

                      <div className="pt-4 flex gap-3">
                          <button
                              type="button"
                              onClick={() => setIsSettingsMode(false)}
                              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-400 outline-none"
                          >
                              Cancel
                          </button>
                          <button
                              type="submit"
                              className="flex-1 py-3 px-4 bg-[#117aca] text-white rounded-lg font-semibold hover:bg-[#0f6ab0] transition-colors focus:ring-2 focus:ring-blue-600 outline-none"
                          >
                              Save Limits
                          </button>
                      </div>
                  </form>
              </div>
          ) : (
              <>
                  {/* Tabs for Transfer Mode */}
                  {!isBillPay && (
                  <div className="flex border-b border-gray-100 shrink-0" role="tablist">
                      <button 
                      onClick={() => setActiveTab('internal')}
                      role="tab"
                      aria-selected={activeTab === 'internal'}
                      aria-controls="transfer-panel"
                      className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 outline-none focus:bg-gray-50 ${activeTab === 'internal' ? 'border-[#117aca] text-[#117aca]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                      Internal
                      </button>
                      <button 
                      onClick={() => setActiveTab('domestic')}
                      role="tab"
                      aria-selected={activeTab === 'domestic'}
                      aria-controls="transfer-panel"
                      className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 outline-none focus:bg-gray-50 ${activeTab === 'domestic' ? 'border-[#117aca] text-[#117aca]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                      Domestic
                      </button>
                      <button 
                      onClick={() => setActiveTab('international')}
                      role="tab"
                      aria-selected={activeTab === 'international'}
                      aria-controls="transfer-panel"
                      className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 outline-none focus:bg-gray-50 ${activeTab === 'international' ? 'border-[#117aca] text-[#117aca]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                      International
                      </button>
                  </div>
                  )}

                  <div id="transfer-panel" className="p-6 overflow-y-auto custom-scrollbar">
                  {/* Internal Transfer Visual */}
                  {activeTab === 'internal' && !isBillPay && (
                      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between" aria-hidden="true">
                      <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase font-semibold">From</span>
                          <span className="text-sm font-bold text-gray-800">Checking (...8842)</span>
                          <span className="text-xs text-[#117aca]">${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <ArrowRightLeft className="h-5 w-5 text-gray-400" />
                      <div className="flex flex-col text-right">
                          <span className="text-xs text-gray-500 uppercase font-semibold">To</span>
                          <span className="text-sm font-bold text-gray-800">Savings (...9921)</span>
                          <span className="text-xs text-[#117aca]">${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      </div>
                  )}

                  {/* Balance Display for other modes */}
                  {(activeTab !== 'internal' || isBillPay) && (
                      <div className="mb-6 bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                          <div>
                          <p className="text-sm text-blue-600 mb-1">Available Checking Balance</p>
                          <p className="text-xl font-bold text-[#117aca]">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentBalance)}
                          </p>
                          </div>
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {isBillPay ? <Building className="h-5 w-5 text-blue-600" aria-hidden="true" /> : <Landmark className="h-5 w-5 text-blue-600" aria-hidden="true" />}
                          </div>
                      </div>
                  )}

                  <form onSubmit={handleReview} className="space-y-4">
                      
                      {/* Common Fields */}
                      {(isBillPay || activeTab === 'domestic' || activeTab === 'international') && (
                      <div>
                          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                          {isBillPay ? 'Biller Name' : 'Recipient Name'}
                          </label>
                          <input
                          id="recipient"
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#117aca] focus:border-transparent outline-none"
                          placeholder={isBillPay ? "e.g. ConEd, Verizon" : "e.g. John Doe, Business LLC"}
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          aria-required="true"
                          />
                      </div>
                      )}

                      {/* Domestic Specifics */}
                      {activeTab === 'domestic' && !isBillPay && (
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label htmlFor="routing" className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
                              <input
                              id="routing"
                              type="text"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#117aca] outline-none"
                              placeholder="9 digits"
                              value={routingNum}
                              onChange={(e) => setRoutingNum(e.target.value)}
                              maxLength={9}
                              aria-required="true"
                              />
                          </div>
                          <div>
                              <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                              <input
                              id="account"
                              type="text"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#117aca] outline-none"
                              placeholder="Account #"
                              value={accountNum}
                              onChange={(e) => setAccountNum(e.target.value)}
                              aria-required="true"
                              />
                          </div>
                      </div>
                      )}

                      {/* International Specifics */}
                      {activeTab === 'international' && !isBillPay && (
                      <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label htmlFor="swift" className="block text-sm font-medium text-gray-700 mb-1">SWIFT / BIC</label>
                                  <input
                                  id="swift"
                                  type="text"
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#117aca] outline-none uppercase"
                                  placeholder="ABCDUS33"
                                  value={swiftCode}
                                  onChange={(e) => setSwiftCode(e.target.value)}
                                  aria-required="true"
                                  />
                              </div>
                              <div>
                                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                  <input
                                  id="country"
                                  type="text"
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#117aca] outline-none"
                                  placeholder="e.g. United Kingdom"
                                  value={country}
                                  onChange={(e) => setCountry(e.target.value)}
                                  aria-required="true"
                                  />
                              </div>
                          </div>
                          <div>
                              <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-1">IBAN / Account Number</label>
                              <input
                              id="iban"
                              type="text"
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#117aca] outline-none uppercase"
                              placeholder="GB33 BUBK..."
                              value={iban}
                              onChange={(e) => setIban(e.target.value)}
                              aria-required="true"
                              />
                          </div>
                      </div>
                      )}
                      
                      <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                      <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">$</span>
                          <input
                          id="amount"
                          type="number"
                          className="w-full border border-gray-300 rounded-md pl-8 pr-4 py-2 focus:ring-2 focus:ring-[#117aca] focus:border-transparent outline-none"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          step="0.01"
                          aria-required="true"
                          aria-describedby="amount-limit-hint"
                          />
                      </div>
                      <p id="amount-limit-hint" className="text-xs text-gray-400 mt-1 text-right">Limit: ${transactionLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </div>

                      <div className="pt-2">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${isRecurring ? 'bg-[#117aca] border-[#117aca]' : 'border-gray-300'}`}>
                          {isRecurring && <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />}
                          </div>
                          <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={isRecurring} 
                          onChange={(e) => setIsRecurring(e.target.checked)} 
                          id="recurring-toggle"
                          />
                          <div className="flex-1">
                          <span className="font-medium text-sm text-gray-900 block">Recurring Payment</span>
                          <span className="text-xs text-gray-500">Schedule regular transfers</span>
                          </div>
                          <RefreshCw className={`h-5 w-5 ${isRecurring ? 'text-[#117aca]' : 'text-gray-400'}`} aria-hidden="true" />
                      </label>
                      </div>

                      {isRecurring && (
                      <div className="grid grid-cols-2 gap-4 animate-fade-in">
                          <div>
                          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                          <select
                              id="frequency"
                              value={frequency}
                              onChange={(e) => setFrequency(e.target.value as any)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#117aca] outline-none bg-white"
                          >
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Yearly">Yearly</option>
                          </select>
                          </div>
                          <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <div className="relative">
                              <input
                              id="startDate"
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full border border-gray-300 rounded-md pl-3 pr-2 py-2 text-sm focus:ring-2 focus:ring-[#117aca] outline-none"
                              />
                          </div>
                          </div>
                      </div>
                      )}

                      {error && (
                      <p className="text-red-600 text-sm bg-red-50 p-2 rounded flex items-center gap-2" role="alert" aria-live="assertive">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></span>
                          {error}
                      </p>
                      )}

                      <button
                      type="submit"
                      className="w-full bg-[#117aca] hover:bg-[#0f6ab0] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-4 shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 outline-none"
                      >
                      {isRecurring ? 'Review Schedule' : isBillPay ? 'Review Payment' : 'Review Transfer'}
                      {activeTab === 'international' ? <Globe className="h-4 w-4" aria-hidden="true" /> : isBillPay ? <Receipt className="h-4 w-4" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                      </button>
                  </form>
                  </div>
              </>
          )}
        </div>
      </div>

      {/* Reusable Confirmation Modal on top */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteTransfer}
        title={isRecurring ? "Confirm Schedule" : isBillPay ? "Confirm Bill Payment" : "Confirm Transfer"}
        confirmLabel={isRecurring ? "Schedule Payment" : isBillPay ? "Pay Bill" : "Send Funds"}
        isLoading={isProcessing}
        icon={ShieldCheck}
        message="Please review the transaction details below."
      >
        <div className="space-y-4">
           <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="text-center mb-4">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Total Amount</p>
                  <p className="text-3xl font-bold text-gray-900">
                      ${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
              </div>
              <div className="space-y-3 text-sm border-t border-gray-200 pt-3">
                 <div className="flex justify-between">
                    <span className="text-gray-500">From</span>
                    <span className="font-semibold text-gray-900 text-right">Chase Checking (...8842)</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">To</span>
                    <div className="text-right">
                       <span className="font-semibold text-gray-900 block">{getRecipientDisplay()}</span>
                       {(activeTab === 'domestic' && !isBillPay) && (
                          <span className="text-xs text-gray-400">Acct: ...{accountNum.slice(-4)}</span>
                       )}
                    </div>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-semibold text-gray-900 text-right">
                        {getDateSummary()}
                    </span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">Fees</span>
                    <span className="font-semibold text-gray-900">{getFeeDisplay()}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Arrival</span>
                    <span className="font-semibold text-[#117aca]">{getEstimatedArrival()}</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                 Please review details carefully. Remaining daily limit: 
                 <span className="font-bold ml-1">
                    ${Math.max(0, dailyLimit - dailyTotalSent - parseFloat(amount || '0')).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                 </span>
              </p>
           </div>
        </div>
      </ConfirmationModal>
    </>
  );
};

export default TransferModal;