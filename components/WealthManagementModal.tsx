import React, { useState } from 'react';
import { X, TrendingUp, Briefcase, Phone, ArrowUpRight, Check, Loader2 } from 'lucide-react';

interface WealthManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WealthManagementModal: React.FC<WealthManagementModalProps> = ({ isOpen, onClose }) => {
  const [isContacting, setIsContacting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  if (!isOpen) return null;

  const handleContactAdvisor = () => {
      setIsContacting(true);
      setTimeout(() => {
          setIsContacting(false);
          setContactSuccess(true);
          setTimeout(() => setContactSuccess(false), 4000);
      }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* J.P. Morgan Branding Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-900 bg-gray-900 text-white">
          <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.2em] opacity-80">J.P. Morgan</span>
              <h3 className="text-xl font-serif font-medium">Wealth Management</h3>
          </div>
          <button onClick={onClose} className="hover:bg-gray-800 p-2 rounded-full transition-colors"><X className="h-6 w-6" /></button>
        </div>

        <div className="p-0 flex-1 overflow-y-auto custom-scrollbar bg-gray-50 relative">
            
            {contactSuccess && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg text-sm flex items-center gap-2 animate-fade-in z-20">
                    <Check className="h-4 w-4 text-white" />
                    Request sent. An advisor will contact you shortly.
                </div>
            )}

            {/* Hero Section */}
            <div className="bg-white p-8 border-b border-gray-200">
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Total Investments</p>
                <h2 className="text-4xl font-serif text-gray-900 mb-4">$1,245,300.52</h2>
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <ArrowUpRight className="h-4 w-4" />
                    +$12,450.00 (1.2%) Today
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Goal Tracking */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gray-700" />
                        Retirement Goal
                    </h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-2xl font-light text-gray-900">$1.2M</span>
                            <span className="text-sm text-gray-500">Target: $2.5M</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-800 w-[48%]"></div>
                        </div>
                        <p className="text-sm text-gray-600">You are on track to reach your goal by 2045.</p>
                        <button className="text-blue-600 text-sm font-medium hover:underline">Adjust Goal</button>
                    </div>
                </div>

                {/* Portfolio Allocation */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-gray-700" />
                        Portfolio Allocation
                    </h4>
                    <div className="space-y-3">
                         <div className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-2">
                                 <div className="h-3 w-3 bg-blue-600 rounded-sm"></div>
                                 <span>US Equities</span>
                             </div>
                             <span className="font-semibold">60%</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-2">
                                 <div className="h-3 w-3 bg-purple-600 rounded-sm"></div>
                                 <span>International</span>
                             </div>
                             <span className="font-semibold">20%</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-2">
                                 <div className="h-3 w-3 bg-green-600 rounded-sm"></div>
                                 <span>Bonds & Cash</span>
                             </div>
                             <span className="font-semibold">20%</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Advisor CTA */}
            <div className="mx-6 mb-6 bg-blue-900 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h4 className="font-bold text-lg mb-1">Need professional guidance?</h4>
                    <p className="text-blue-200 text-sm">Schedule a consultation with your dedicated J.P. Morgan Private Client Advisor.</p>
                </div>
                <button 
                    onClick={handleContactAdvisor}
                    disabled={isContacting || contactSuccess}
                    className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-80"
                >
                    {isContacting ? (
                        <>
                           <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                        </>
                    ) : contactSuccess ? (
                        <>
                           <Check className="h-4 w-4" /> Request Sent
                        </>
                    ) : (
                        <>
                            <Phone className="h-4 w-4" /> Contact Advisor
                        </>
                    )}
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default WealthManagementModal;