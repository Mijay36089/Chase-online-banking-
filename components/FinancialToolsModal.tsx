import React, { useState } from 'react';
import { X, PieChart, TrendingUp, PiggyBank, ShieldCheck, Gauge, Check } from 'lucide-react';

interface FinancialToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FinancialToolsModal: React.FC<FinancialToolsModalProps> = ({ isOpen, onClose }) => {
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#117aca] text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <PieChart className="h-6 w-6" />
            Financial Tools
          </h3>
          <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-full transition-colors"><X className="h-6 w-6" /></button>
        </div>

        <div className="relative p-6 flex-1 overflow-y-auto custom-scrollbar bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {toastMessage && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 animate-fade-in z-20">
                    <Check className="h-4 w-4 text-green-400" />
                    {toastMessage}
                </div>
            )}

            {/* Credit Journey */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                    <Gauge className="h-5 w-5 text-[#117aca]" />
                    <h4 className="font-bold text-gray-800">Credit Journey</h4>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative h-40 w-40 flex items-center justify-center">
                         {/* Simple CSS Gauge representation */}
                         <div className="absolute inset-0 rounded-full border-[12px] border-gray-100 border-t-[#117aca] border-r-[#117aca] rotate-45"></div>
                         <div className="text-center">
                             <span className="text-4xl font-bold text-gray-900 block">785</span>
                             <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-0.5 rounded-full">Excellent</span>
                         </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center">Your score is up 12 points since last month.</p>
                    <button 
                        onClick={() => showToast('Full credit report opened in new tab')}
                        className="mt-4 text-[#117aca] text-sm font-semibold hover:underline"
                    >
                        View Full Report
                    </button>
                </div>
            </div>

            {/* Autosave */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
                 <div className="flex items-center gap-2 mb-4">
                    <PiggyBank className="h-5 w-5 text-[#117aca]" />
                    <h4 className="font-bold text-gray-800">Autosave</h4>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-900 mb-2">Set up automatic transfers to reach your savings goals faster.</p>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                        <p className="font-semibold text-gray-900">Daily Savings</p>
                        <p className="text-xs text-gray-500">Transfer $5 every day</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={autosaveEnabled} 
                            onChange={(e) => {
                                setAutosaveEnabled(e.target.checked);
                                showToast(e.target.checked ? 'Autosave Enabled' : 'Autosave Disabled');
                            }} 
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#117aca]"></div>
                    </label>
                </div>
                <button 
                    onClick={() => showToast('New savings goal created')}
                    className="mt-6 w-full py-2 border border-[#117aca] text-[#117aca] rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                    Create New Goal
                </button>
            </div>

            {/* Spending Report */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
                 <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="h-5 w-5 text-[#117aca]" />
                    <h4 className="font-bold text-gray-800">Chase Spending Report</h4>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Mock Pie Chart Visual */}
                    <div className="relative h-48 w-48 rounded-full bg-[#117aca] bg-opacity-10 flex-shrink-0">
                         {/* Slices simulation */}
                         <div className="absolute inset-0 rounded-full border-[20px] border-[#117aca] opacity-80" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 50% 50%)' }}></div>
                         <div className="absolute inset-0 rounded-full border-[20px] border-orange-400 opacity-80" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 0 100%, 0 50%)', transform: 'rotate(20deg)' }}></div>
                         <div className="absolute inset-0 flex items-center justify-center flex-col">
                             <span className="text-xs text-gray-500 uppercase">Total Spent</span>
                             <span className="text-xl font-bold">$3,450</span>
                         </div>
                    </div>

                    <div className="w-full space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Food & Drink</span>
                                <span className="font-bold">$1,200.00</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-400 w-[35%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Shopping</span>
                                <span className="font-bold">$850.00</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#117aca] w-[25%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Bills & Utilities</span>
                                <span className="font-bold">$600.00</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[18%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default FinancialToolsModal;