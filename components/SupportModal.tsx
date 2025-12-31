
import React, { useState, useEffect, useRef } from 'react';
import { X, HelpCircle, MessageSquare, Phone, ChevronDown, ChevronUp, Send, User, Headset, Circle, Loader2 } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'chat'>('faq');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'Hello! I am your Chase Customer Care representative. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAgentTyping]);

  const faqs = [
    { q: "How do I reset my password?", a: "Go to Settings > Security & Login to change your password. If you cannot log in, use the 'Forgot Password' link on the login screen." },
    { q: "When are funds deposited?", a: "Funds are typically deposited within 1-2 business days. You can view your deposit history in the 'Other Reports' > 'Funding' section." },
    { q: "How do I process a refund?", a: "Navigate to 'Sales Activity', locate the transaction you wish to refund, and click the refund icon." },
    { q: "Can I create multiple user accounts?", a: "Yes, you can manage team members and permissions in the Settings menu under 'Team Management'." }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    
    // Simulate Agent Response
    setIsAgentTyping(true);
    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: getAgentResponse(userMsg.text),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsAgentTyping(false);
    }, 2000);
  };

  const getAgentResponse = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('balance')) return "I can help with that. Your current checking balance is $2,345,890.50. Would you like to see a detailed report?";
    if (t.includes('transfer')) return "To initiate a transfer, click the 'Pay & Transfer' tab in your dashboard. Is there a specific issue you are having with a transfer?";
    if (t.includes('hello') || t.includes('hi')) return "Hello! How can I assist you with your Chase accounts today?";
    return "Thank you for that information. I am looking into your account details now. One moment please.";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#117aca] text-white">
          <div className="flex items-center gap-3">
             <div className="bg-white/20 p-2 rounded-lg">
                <HelpCircle className="h-6 w-6" />
             </div>
             <div>
                <h3 className="text-lg font-bold">Chase Customer Care</h3>
                <div className="flex items-center gap-1.5 text-[10px] opacity-80 uppercase tracking-wider font-semibold">
                   <Circle className="h-1.5 w-1.5 fill-green-400 text-green-400" />
                   Live Support Online
                </div>
             </div>
          </div>
          <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white">
             <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50">
           <button 
             onClick={() => setActiveTab('faq')}
             className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'faq' ? 'border-[#117aca] text-[#117aca]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
           >
             FAQs
           </button>
           <button 
             onClick={() => setActiveTab('chat')}
             className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'chat' ? 'border-[#117aca] text-[#117aca]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
           >
             Live Chat
           </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col relative">
          {activeTab === 'faq' ? (
            <div className="p-6 overflow-y-auto custom-scrollbar">
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

                <h4 className="font-bold text-gray-800 mb-4">Other Ways to Contact</h4>
                <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 hover:border-[#117aca] hover:text-[#117aca] transition-all"
                    >
                        <MessageSquare className="h-5 w-5" />
                        Start Live Chat
                    </button>
                    <button className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 hover:border-[#117aca] hover:text-[#117aca] transition-all">
                        <Phone className="h-5 w-5" />
                        Call Support (1-800-935-9935)
                    </button>
                </div>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-fade-in">
               {/* Chat Messages */}
               <div 
                 ref={scrollRef}
                 className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-gray-50"
               >
                  {messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                       <div className={`max-w-[80%] flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 text-[#117aca]' : 'bg-[#117aca] text-white'}`}>
                             {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Headset className="h-4 w-4" />}
                          </div>
                          <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                            msg.sender === 'user' 
                              ? 'bg-[#117aca] text-white rounded-tr-none' 
                              : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                          }`}>
                             {msg.text}
                             <div className={`text-[10px] mt-1.5 opacity-60 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
                  {isAgentTyping && (
                    <div className="flex justify-start">
                       <div className="bg-white text-gray-400 p-2 rounded-full border border-gray-100 flex items-center gap-2 px-3 shadow-sm">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span className="text-[10px] font-medium italic">Agent is typing...</span>
                       </div>
                    </div>
                  )}
               </div>

               {/* Input Form */}
               <form 
                 onSubmit={handleSendMessage}
                 className="p-4 bg-white border-t border-gray-100 flex gap-2"
               >
                  <input 
                    type="text" 
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#117aca] outline-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="bg-[#117aca] text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <Send className="h-4 w-4" />
                  </button>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
