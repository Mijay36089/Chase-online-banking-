import React, { useState } from 'react';
import { X, FileText, Download, Receipt, FileCheck, Loader2, Check } from 'lucide-react';

interface AccountManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountManagementModal: React.FC<AccountManagementModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'Statements' | 'Tax Docs' | 'Receipts'>('Statements');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<number[]>([]);

  if (!isOpen) return null;

  const statements = [
    { id: 1, date: 'June 2024', account: 'Total Checking (...8842)' },
    { id: 2, date: 'May 2024', account: 'Total Checking (...8842)' },
    { id: 3, date: 'April 2024', account: 'Total Checking (...8842)' },
  ];

  const taxDocs = [
    { id: 101, year: '2023', type: 'Form 1099-INT', description: 'Interest Income' },
    { id: 102, year: '2022', type: 'Form 1099-INT', description: 'Interest Income' },
  ];

  const handleDownload = (id: number) => {
    if (downloadedIds.includes(id)) return;
    setDownloadingId(id);
    setTimeout(() => {
        setDownloadingId(null);
        setDownloadedIds(prev => [...prev, id]);
        // Reset after 3 seconds
        setTimeout(() => {
            setDownloadedIds(prev => prev.filter(did => did !== id));
        }, 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#117aca] text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Account Management
          </h3>
          <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-full transition-colors"><X className="h-6 w-6" /></button>
        </div>

        <div className="flex border-b border-gray-200">
            {(['Statements', 'Tax Docs', 'Receipts'] as const).map(tab => (
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
            {activeTab === 'Statements' && (
                <div className="space-y-4 animate-fade-in">
                    <p className="text-sm text-gray-600 mb-2">View and download your monthly account statements.</p>
                    {statements.map(stmt => (
                        <div key={stmt.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-3 rounded-full text-[#117aca]">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{stmt.date}</h4>
                                    <p className="text-sm text-gray-500">{stmt.account}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDownload(stmt.id)}
                                disabled={downloadingId === stmt.id}
                                className={`font-medium text-sm flex items-center gap-1 transition-colors ${
                                    downloadedIds.includes(stmt.id) ? 'text-green-600' : 'text-[#117aca] hover:underline'
                                }`}
                            >
                                {downloadingId === stmt.id ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" /> Downloading...
                                    </>
                                ) : downloadedIds.includes(stmt.id) ? (
                                    <>
                                        <Check className="h-4 w-4" /> Saved
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4" /> PDF
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'Tax Docs' && (
                <div className="space-y-4 animate-fade-in">
                    <p className="text-sm text-gray-600 mb-2">Important tax documents for your filing.</p>
                    {taxDocs.map(doc => (
                        <div key={doc.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 p-3 rounded-full text-gray-600">
                                    <FileCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{doc.year} {doc.type}</h4>
                                    <p className="text-sm text-gray-500">{doc.description}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDownload(doc.id)}
                                disabled={downloadingId === doc.id}
                                className={`font-medium text-sm flex items-center gap-1 transition-colors ${
                                    downloadedIds.includes(doc.id) ? 'text-green-600' : 'text-[#117aca] hover:underline'
                                }`}
                            >
                                {downloadingId === doc.id ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" /> Downloading...
                                    </>
                                ) : downloadedIds.includes(doc.id) ? (
                                    <>
                                        <Check className="h-4 w-4" /> Saved
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4" /> Download
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'Receipts' && (
                <div className="flex flex-col items-center justify-center h-48 animate-fade-in text-gray-400">
                    <Receipt className="h-12 w-12 mb-2 opacity-50" />
                    <p>No recent digital receipts found.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AccountManagementModal;