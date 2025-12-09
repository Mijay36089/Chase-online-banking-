import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Loader2, Copy, Eye, EyeOff, Check } from 'lucide-react';
import { Card } from '../types';

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card | null;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ isOpen, onClose, card }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVerifying(false);
      setIsRevealed(false);
      setShowCvv(false);
      setCopied(false);
      // Focus the close button for keyboard users when modal opens
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen || !card) return null;

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate secure identity check
    setTimeout(() => {
      setIsVerifying(false);
      setIsRevealed(true);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(card.fullNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCardStyle = () => {
    if (card.brand === 'Sapphire') return 'bg-gradient-to-br from-[#1a1f2c] to-[#0a3069] text-white';
    if (card.brand === 'Freedom') return 'bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] text-gray-800';
    return 'bg-gradient-to-br from-[#117aca] to-[#0a4d8c] text-white';
  };

  // Format card number for screen readers (adding spaces/pauses)
  const accessibleCardNumber = card.fullNumber.split('').join(' ');

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="card-details-title"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 id="card-details-title" className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#117aca]" aria-hidden="true" />
            Card Details
          </h3>
          <button 
            ref={closeButtonRef}
            onClick={onClose} 
            className="hover:bg-gray-100 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#117aca]"
            aria-label="Close details"
          >
            <X className="h-6 w-6 text-gray-500" aria-hidden="true" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center">
          {!isRevealed ? (
            <div className="text-center py-8" role="region" aria-label="Security Verification">
              <div className="bg-blue-50 p-4 rounded-full inline-flex mb-4">
                <ShieldCheck className="h-12 w-12 text-[#117aca]" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Security Verification</h4>
              <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                To view your full card number and CVV, we need to verify your identity.
              </p>
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="bg-[#117aca] text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#117aca]"
                aria-live="polite"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> 
                    <span>Verifying...</span>
                  </>
                ) : (
                  'Reveal Card Details'
                )}
              </button>
            </div>
          ) : (
            <div className="w-full animate-fade-in-up">
              {/* Realistic Card Visual */}
              <div className={`relative aspect-[1.586] rounded-2xl p-6 shadow-2xl mb-8 flex flex-col justify-between ${getCardStyle()}`}>
                <div className="flex justify-between items-start">
                    <span className="font-bold tracking-widest text-lg opacity-90 uppercase">Chase {card.brand}</span>
                    <svg className="h-10 w-10 opacity-80" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M2 10c0-3.866 3.134-7 7-7 1.3 0 2.516.36 3.563.985C13.626 2.376 15.696 1 18 1c2.76 0 5 2.24 5 5 0 2.228-1.464 4.107-3.486 4.764.12.396.186.817.186 1.236 0 2.76-2.24 5-5 5-1.3 0-2.516-.36-3.563-.985C10.374 17.624 8.304 19 6 19c-2.76 0-5-2.24-5-5 0-2.228 1.464-4.107 3.486-4.764C4.366 8.84 4.3 8.42 4.3 8c0-1.256.46-2.407 1.216-3.297C3.518 5.61 2 7.622 2 10z"/>
                    </svg>
                </div>
                
                <div className="space-y-4">
                     <div className="flex items-center gap-4">
                         <div className="bg-yellow-200/40 h-8 w-12 rounded backdrop-blur-sm border border-white/20" aria-hidden="true"></div>
                         <svg className="h-8 w-8 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M1 10h22M1 14h22M5 18h14"/></svg>
                     </div>
                     
                     <div className="flex items-center justify-between">
                         <p className="font-mono text-xl md:text-2xl tracking-widest drop-shadow-md" aria-label={`Card number: ${accessibleCardNumber}`}>
                             {card.fullNumber}
                         </p>
                         <button 
                            onClick={handleCopy}
                            className="opacity-80 hover:opacity-100 transition-opacity p-2 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50" 
                            title="Copy Card Number"
                            aria-label={copied ? "Copied to clipboard" : "Copy full card number to clipboard"}
                         >
                            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                         </button>
                     </div>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] uppercase opacity-70 mb-1">Cardholder Name</p>
                        <p className="font-medium tracking-wider uppercase">Marcelo Grant</p>
                    </div>
                    <div className="flex gap-6">
                         <div>
                            <p className="text-[10px] uppercase opacity-70 mb-1">Valid Thru</p>
                            <p className="font-medium">{card.expiry}</p>
                         </div>
                         <div>
                            <p className="text-[10px] uppercase opacity-70 mb-1">CVV</p>
                            <div className="flex items-center gap-2">
                                <p className="font-medium" aria-hidden={!showCvv}>{showCvv ? card.cvv : '•••'}</p>
                                <button 
                                  onClick={() => setShowCvv(!showCvv)} 
                                  className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded p-0.5"
                                  aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                                  aria-pressed={showCvv}
                                >
                                    {showCvv ? <EyeOff className="h-3 w-3 opacity-70" aria-hidden="true" /> : <Eye className="h-3 w-3 opacity-70" aria-hidden="true" />}
                                </button>
                            </div>
                         </div>
                    </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 flex gap-3" role="alert">
                  <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <p>Never share these details with anyone who contacts you unexpectedly. Chase will never ask for your CVV or PIN.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { CardDetailsModal };