import React, { useState } from 'react';
import { X, FileBarChart, DollarSign, TrendingUp, AlertTriangle, PieChart } from 'lucide-react';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ReportTab = 'Settlement' | 'Chargeback' | 'Fees' | 'Funding';

const ReportsModal: React.FC<ReportsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<ReportTab>('Settlement');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[80vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#117aca] text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileBarChart className="h-6 w-6" />
            Merchant Reports
          </h3>
          <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-full transition-colors"><X className="h-6 w-6" /></button>
        </div>

        <div className="flex border-b border-gray-200">
            {(['Settlement', 'Chargeback', 'Fees', 'Funding'] as ReportTab[]).map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab ? 'border-[#117aca] text-[#117aca]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-gray-50">
            {activeTab === 'Settlement' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase">Gross Sales</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">$14,230.50</p>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase">Net Settlement</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">$13,850.25</p>
                        </div>
                         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase">Transactions</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">142</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h4 className="font-bold text-gray-800 mb-4">Recent Batches</h4>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr><th className="p-3">Batch ID</th><th className="p-3">Date</th><th className="p-3">Count</th><th className="p-3 text-right">Amount</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr><td className="p-3">#99201</td><td className="p-3">Mar 10, 2024</td><td className="p-3">45</td><td className="p-3 text-right font-bold">$4,230.00</td></tr>
                                <tr><td className="p-3">#99200</td><td className="p-3">Mar 09, 2024</td><td className="p-3">38</td><td className="p-3 text-right font-bold">$3,150.50</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'Chargeback' && (
                <div className="animate-fade-in text-center py-10">
                    <div className="bg-green-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                        <ShieldCheckIcon className="h-10 w-10 text-green-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">No Active Chargebacks</h4>
                    <p className="text-gray-500 mt-2">Great job! You have no pending disputes or chargebacks.</p>
                </div>
            )}

            {activeTab === 'Fees' && (
                 <div className="animate-fade-in">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                        <h4 className="font-bold text-gray-800 mb-4">Month-to-Date Fees</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Interchange</span><span>$240.50</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Service Fees</span><span>$45.00</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Network Assessments</span><span>$12.30</span></div>
                            <div className="border-t pt-2 flex justify-between font-bold"><span className="text-gray-900">Total</span><span>$297.80</span></div>
                        </div>
                    </div>
                 </div>
            )}
            
            {activeTab === 'Funding' && (
                <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                     <h4 className="font-bold text-gray-800 mb-4">Deposit History</h4>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-100">
                             <div className="flex items-center gap-3">
                                 <div className="bg-green-200 p-2 rounded-full"><DollarSign className="h-4 w-4 text-green-800" /></div>
                                 <div><p className="font-bold text-sm">Deposit Sent</p><p className="text-xs text-gray-500">Mar 10, 2024</p></div>
                             </div>
                             <p className="font-bold text-green-700">$4,230.00</p>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                             <div className="flex items-center gap-3">
                                 <div className="bg-gray-200 p-2 rounded-full"><CheckCircleIcon className="h-4 w-4 text-gray-600" /></div>
                                 <div><p className="font-bold text-sm">Deposit Sent</p><p className="text-xs text-gray-500">Mar 09, 2024</p></div>
                             </div>
                             <p className="font-bold text-gray-700">$3,150.50</p>
                        </div>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Simple Icons for local use
const ShieldCheckIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const CheckCircleIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

export default ReportsModal;