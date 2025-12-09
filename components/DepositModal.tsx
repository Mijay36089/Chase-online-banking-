import React, { useState, useEffect } from 'react';
import { X, Camera, Check, UploadCloud, AlertCircle, Loader2 } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, checkNumber: string) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit }) => {
  const [amount, setAmount] = useState('');
  const [checkNumber, setCheckNumber] = useState('');
  const [frontImageCaptured, setFrontImageCaptured] = useState(false);
  const [backImageCaptured, setBackImageCaptured] = useState(false);
  
  const [isCapturing, setIsCapturing] = useState<'front' | 'back' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setCheckNumber('');
      setFrontImageCaptured(false);
      setBackImageCaptured(false);
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCapture = (side: 'front' | 'back') => {
    setIsCapturing(side);
    // Simulate camera/upload delay
    setTimeout(() => {
      if (side === 'front') setFrontImageCaptured(true);
      else setBackImageCaptured(true);
      setIsCapturing(null);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid deposit amount.');
      return;
    }
    if (!frontImageCaptured || !backImageCaptured) {
      setError('Please capture both the front and back of the check.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onDeposit(numAmount, checkNumber || 'N/A');
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="deposit-modal-title">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h3 id="deposit-modal-title" className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="h-6 w-6 text-[#117aca]" aria-hidden="true" />
            Deposit Checks
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Amount Input */}
            <div>
              <label htmlFor="deposit-amount" className="block text-sm font-medium text-gray-700 mb-1">Check Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 font-semibold">$</span>
                <input
                  id="deposit-amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117aca] focus:border-transparent outline-none text-lg font-semibold"
                  placeholder="0.00"
                  aria-required="true"
                />
              </div>
            </div>

             {/* Check Number Input */}
             <div>
              <label htmlFor="check-number" className="block text-sm font-medium text-gray-700 mb-1">Check Number <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input
                id="check-number"
                type="text"
                value={checkNumber}
                onChange={(e) => setCheckNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117aca] outline-none"
                placeholder="e.g. 1045"
              />
            </div>

            {/* Image Capture Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Front Side */}
              <button
                type="button"
                onClick={() => handleCapture('front')}
                className={`relative group h-32 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 
                  ${frontImageCaptured 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-[#117aca] hover:bg-blue-50'}`}
                aria-label={frontImageCaptured ? "Front of check captured" : "Capture front of check"}
              >
                {isCapturing === 'front' ? (
                  <Loader2 className="h-8 w-8 text-[#117aca] animate-spin" />
                ) : frontImageCaptured ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <img 
                         src="https://images.unsplash.com/photo-1550565118-3a1402987360?auto=format&fit=crop&q=80&w=200&h=100" 
                         className="opacity-20 w-full h-full object-cover rounded-lg"
                         alt=""
                         aria-hidden="true" 
                       />
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-green-700">
                      <Check className="h-8 w-8 mb-1" aria-hidden="true" />
                      <span className="text-xs font-bold">Front Captured</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="h-8 w-8 text-gray-400 mb-2 group-hover:text-[#117aca]" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-500 group-hover:text-[#117aca]">Scan Front</span>
                  </>
                )}
              </button>

              {/* Back Side */}
              <button
                type="button"
                onClick={() => handleCapture('back')}
                className={`relative group h-32 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200
                  ${backImageCaptured 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-[#117aca] hover:bg-blue-50'}`}
                aria-label={backImageCaptured ? "Back of check captured" : "Capture back of check"}
              >
                {isCapturing === 'back' ? (
                  <Loader2 className="h-8 w-8 text-[#117aca] animate-spin" />
                ) : backImageCaptured ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img 
                         src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=200&h=100" 
                         className="opacity-20 w-full h-full object-cover rounded-lg"
                         alt=""
                         aria-hidden="true" 
                       />
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-green-700">
                      <Check className="h-8 w-8 mb-1" aria-hidden="true" />
                      <span className="text-xs font-bold">Back Captured</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="h-8 w-8 text-gray-400 mb-2 group-hover:text-[#117aca]" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-500 group-hover:text-[#117aca]">Scan Back</span>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Funds are typically available by the next business day. 
              <br />Ensure the endorsement on the back is signed.
            </p>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#117aca] hover:bg-[#0f6ab0] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <UploadCloud className="h-5 w-5" aria-hidden="true" />
                  Processing...
                </>
              ) : (
                <>
                  <UploadCloud className="h-5 w-5" aria-hidden="true" />
                  Deposit Funds
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;