import React, { useState } from 'react';
import { X, Activity, RefreshCcw, FileText, Ban, Search, CheckCircle } from 'lucide-react';

interface SalesActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Sale {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Voided' | 'Refunded';
  cardLast4: string;
}

const SalesActivityModal: React.FC<SalesActivityModalProps> = ({ isOpen, onClose }) => {
  const [sales, setSales] = useState<Sale[]>([
    { id: 'TX-9982', date: '2024-03-10 14:30', amount: 45.20, status: 'Completed', cardLast4: '4242' },
    { id: 'TX-9983', date: '2024-03-10 15:12', amount: 12.50, status: 'Completed', cardLast4: '1123' },
    { id: 'TX-9984', date: '2024-03-10 16:45', amount: 120.00, status: 'Completed', cardLast4: '8832' },
    { id: 'TX-9981', date: '2024-03-09 10:20', amount: 8.99, status: 'Refunded', cardLast4: '5521' },
  ]);

  const [toast, setToast] = useState('');

  if (!isOpen) return null;

  const handleAction = (id: string, action: 'Void' | 'Refund' | 'Receipt') => {
    if (action === 'Receipt') {
        setToast(`Receipt for ${id} sent to printer.`);
        setTimeout(() => setToast(''), 3000);
        return;
    }

    setSales(prev => prev.map(sale => {
        if (sale.id === id) {
            return { ...sale, status: action === 'Void' ? 'Voided' : 'Refunded' };
        }
        return sale;
    }));
    setToast(`Transaction ${id} has been ${action === 'Void' ? 'voided' : 'refunded'}.`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#117aca] text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Sales Activity
          </h3>
          <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-full transition-colors"><X className="h-6 w-6" /></button>
        </div>

        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="relative">
                <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search Transaction ID" className="pl-9 pr-4 py-1.5 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#117aca] outline-none" />
            </div>
            <div className="flex gap-2">
                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide py-1.5">Today's Total: $177.70</span>
            </div>
        </div>

        <div className="p-0 flex-1 overflow-y-auto custom-scrollbar relative">
          {toast && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 animate-fade-in z-10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  {toast}
              </div>
          )}
          
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-xs text-gray-500 uppercase">
                <th className="px-6 py-3 font-semibold">Date/Time</th>
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Card</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.map(sale => (
                <tr key={sale.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{sale.date}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{sale.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${sale.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">•••• {sale.cardLast4}</td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                         sale.status === 'Completed' ? 'bg-green-100 text-green-800' :
                         sale.status === 'Voided' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                     }`}>
                         {sale.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleAction(sale.id, 'Receipt')}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors" 
                            title="Reprint Receipt"
                        >
                            <FileText className="h-4 w-4" />
                        </button>
                        {sale.status === 'Completed' && (
                            <>
                                <button 
                                    onClick={() => handleAction(sale.id, 'Refund')}
                                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-100 rounded transition-colors" 
                                    title="Refund"
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={() => handleAction(sale.id, 'Void')}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors" 
                                    title="Void Transaction"
                                >
                                    <Ban className="h-4 w-4" />
                                </button>
                            </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesActivityModal;