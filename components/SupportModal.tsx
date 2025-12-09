import React, { useState } from 'react';
import { X, HelpCircle, MessageSquare, Phone, ChevronDown, ChevronUp } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How do I reset my password?", a: "Go to Settings > Security & Login to change your password. If you cannot log in, use the 'Forgot Password' link on the login screen." },
    { q: "When are funds deposited?", a: "Funds are typically deposited within 1-2 business days. You can view your deposit history in the 'Other Reports' > 'Funding' section." },
    { q: "How do I process a refund?", a: "Navigate to 'Sales Activity', locate the transaction you wish to refund, and click the refund icon." },
    { q: "Can I create multiple user accounts?", a: "Yes, you can manage team members and permissions in the Settings menu under 'Team Management'." }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#117aca] text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            Support Center
          </h3>
          <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-full transition-colors"><X className="h-6 w-6" /></button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <h4 className="font-bold text-gray-800 mb-4">Frequently Asked Questions</h4>
            <div className="space-y-3 mb-8">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 bg-white"
                        >
                            <span className="font-medium text-sm text-gray-900">{faq.q}</span>
                            {openFaq === idx ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                        </button>
                        {openFaq === idx && (
                            <div className="p-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 animate-fade-in">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <h4 className="font-bold text-gray-800 mb-4">Contact Us</h4>
            <div className="space-y-3">
                <button className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 hover:border-[#117aca] hover:text-[#117aca] transition-all">
                    <MessageSquare className="h-5 w-5" />
                    Start Live Chat
                </button>
                <button className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 hover:border-[#117aca] hover:text-[#117aca] transition-all">
                    <Phone className="h-5 w-5" />
                    Call Support (1-800-935-9935)
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;