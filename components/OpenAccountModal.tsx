
import React, { useState } from 'react';
import { X, CheckCircle, ChevronRight, Loader2, Briefcase, Landmark, Percent, TrendingUp } from 'lucide-react';

interface OpenAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productName: string, initialDeposit: number) => void;
}

type Product = {
  id: string;
  name: string;
  description: string;
  apy?: string;
  minDeposit: number;
  icon: React.ElementType;
};

const products: Product[] = [
  {
    id: 'cd-1',
    name: 'Certificate of Deposit (CD)',
    description: 'Fixed rate for a fixed term. Guaranteed returns.',
    apy: '4.50%',
    minDeposit: 1000,
    icon: Percent
  },
  {
    id: 'ira-1',
    name: 'Roth IRA',
    description: 'Tax-advantaged savings for your retirement goals.',
    apy: 'Market',
    minDeposit: 0,
    icon: TrendingUp
  },
  {
    id: 'sav-1',
    name: 'High-Yield Savings',
    description: 'Grow your savings faster with our competitive rates.',
    apy: '3.50%',
    minDeposit: 0,
    icon: Briefcase
  },
  {
    id: 'chk-1',
    name: 'Total Checking',
    description: 'Everyday banking with easy access to your funds.',
    minDeposit: 0,
    icon: Landmark
  }
];

const OpenAccountModal: React.FC<OpenAccountModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState<'select' | 'form' | 'processing' | 'success'>('select');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  
  if (!isOpen) return null;

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate API call
    setTimeout(() => {
      setStep('success');
      onSubmit(selectedProduct!.name, parseFloat(depositAmount) || 0);
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    // Reset state after transition
    setTimeout(() => {
        setStep('select');
        setSelectedProduct(null);
        setDepositAmount('');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#117aca] text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Landmark className="h-6 w-6" />
            Open an Account
          </h3>
          <button onClick={handleClose} className="hover:bg-blue-700 p-2 rounded-full transition-colors"><X className="h-6 w-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          
          {step === 'select' && (
            <div className="animate-fade-in">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Select a Product</h4>
              <p className="text-sm text-gray-500 mb-6">Choose the account type that fits your financial goals.</p>
              
              <div className="grid grid-cols-1 gap-4">
                {products.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#117aca] hover:bg-blue-50 transition-all group text-left w-full"
                  >
                    <div className="p-3 bg-blue-100 text-[#117aca] rounded-full group-hover:bg-[#117aca] group-hover:text-white transition-colors">
                      <product.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-gray-900">{product.name}</h5>
                        {product.apy && (
                          <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                            {product.apy} APY
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#117aca]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'form' && selectedProduct && (
            <div className="animate-fade-in">
              <button 
                onClick={() => setStep('select')}
                className="text-sm text-gray-500 hover:text-[#117aca] mb-4 flex items-center gap-1"
              >
                &larr; Back to products
              </button>
              
              <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="p-2 bg-white rounded-full text-[#117aca] shadow-sm">
                   <selectedProduct.icon className="h-6 w-6" />
                </div>
                <div>
                   <h4 className="font-bold text-gray-900">{selectedProduct.name}</h4>
                   <p className="text-xs text-blue-700">{selectedProduct.description}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Deposit Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 font-semibold">$</span>
                    <input 
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117aca] outline-none text-lg font-semibold"
                      placeholder={selectedProduct.minDeposit.toString()}
                      min={selectedProduct.minDeposit}
                      required
                    />
                  </div>
                  {selectedProduct.minDeposit > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Minimum opening deposit: ${selectedProduct.minDeposit.toLocaleString()}</p>
                  )}
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Funding Source</label>
                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117aca] outline-none bg-white">
                      <option>Total Checking (...8842)</option>
                      <option>Premier Savings (...9921)</option>
                      <option>Link External Account</option>
                   </select>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                   <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 text-[#117aca] rounded border-gray-300 focus:ring-[#117aca]" />
                   <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the <a href="#" className="text-[#117aca] hover:underline">Electronic Signature Consent</a> and the <a href="#" className="text-[#117aca] hover:underline">Deposit Account Agreement</a>. I certify that the information provided is accurate.
                   </label>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#117aca] hover:bg-[#0f6ab0] text-white font-bold rounded-lg transition-colors shadow-md"
                >
                  Submit Application
                </button>
              </form>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center h-64 animate-fade-in text-center">
              <Loader2 className="h-12 w-12 text-[#117aca] animate-spin mb-4" />
              <h4 className="text-lg font-bold text-gray-900">Reviewing Application...</h4>
              <p className="text-gray-500 max-w-xs mx-auto mt-2">We are verifying your information and setting up your new account.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center h-full py-8 animate-fade-in text-center">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Account Opened!</h4>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Your new <span className="font-semibold text-gray-900">{selectedProduct?.name}</span> is now active. 
                Funds will be transferred from your selected funding source shortly.
              </p>
              <button 
                onClick={handleClose}
                className="px-8 py-3 bg-[#117aca] hover:bg-[#0f6ab0] text-white font-bold rounded-lg transition-colors shadow-md"
              >
                Go to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OpenAccountModal;
