import React from 'react';
import { X, Receipt, CheckCircle, Share2, Printer, ArrowDownLeft, CreditCard } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-details-title"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2" id="tx-details-title">
            <Receipt className="h-5 w-5 text-gray-500" aria-hidden="true" />
            Transaction Details
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close details"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          
          <div className="flex flex-col items-center mb-8">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-blue-50'}`}>
               {transaction.type === 'credit' ? (
                 <ArrowDownLeft className="h-8 w-8 text-green-600" aria-hidden="true" />
               ) : (
                 <CreditCard className="h-8 w-8 text-[#117aca]" aria-hidden="true" />
               )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center">{transaction.description}</h2>
            <p className={`text-3xl font-bold mt-2 ${transaction.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
              {transaction.type === 'credit' ? '+' : '-'}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}
            </p>
            <div className="flex items-center gap-1.5 mt-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
              <CheckCircle className="h-3.5 w-3.5" />
              Completed
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Transaction ID</span>
              <span className="text-sm font-mono text-gray-900">{transaction.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Date</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(transaction.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  timeZone: 'America/New_York'
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Category</span>
              <span className="text-sm font-medium text-gray-900">{transaction.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Payment Method</span>
              <span className="text-sm font-medium text-gray-900">Chase Checking (...8842)</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-4 bg-gray-50">
          <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-gray-300 outline-none">
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-gray-300 outline-none">
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;