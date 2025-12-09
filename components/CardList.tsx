import React from 'react';
import { CreditCard, Lock, Unlock, Wifi, Eye, ChevronRight, FileText, DollarSign } from 'lucide-react';
import { Card, Account } from '../types';

interface CardListProps {
  cards: Card[];
  onToggleLock: (id: string) => void;
  onPayCard: (card: Card) => void;
  onViewStatements: () => void;
  onShowDetails: (card: Card) => void;
  onSelectAccount?: (account: Account) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onToggleLock, onPayCard, onViewStatements, onShowDetails, onSelectAccount }) => {
  
  const getCardStyle = (card: Card) => {
    if (card.status === 'Frozen') return 'bg-gray-300 grayscale opacity-90 text-gray-600';
    if (card.brand === 'Sapphire') return 'bg-gradient-to-br from-[#1a1f2c] to-[#0a3069] text-white'; // Deep metallic blue
    if (card.brand === 'Freedom') return 'bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] text-gray-800'; // Silver
    return 'bg-gradient-to-br from-[#117aca] to-[#0a4d8c] text-white'; // Default Chase Blue
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'America/New_York'
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-[#117aca]" aria-hidden="true" />
        My Cards
      </h3>
      
      <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {cards.map((card) => (
          <div key={card.id} className="flex flex-col xl:flex-row gap-6 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
            
            {/* Visual Card Graphic */}
            <div className="w-full xl:w-72 shrink-0 group perspective">
               <div 
                  onClick={() => onSelectAccount?.(card)}
                  className={`relative aspect-[1.586] rounded-xl p-5 shadow-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer ${getCardStyle(card)}`}
                  role="img"
                  aria-label={`View history for ${card.name} ending in ${card.last4}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-bold tracking-wider text-sm opacity-90 uppercase">Chase {card.brand}</span>
                    <Wifi className="h-5 w-5 rotate-90 opacity-70" />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-7 w-10 bg-yellow-200/30 rounded backdrop-blur-sm border border-white/20"></div>
                  </div>

                  <div className="mb-2">
                    <p className="font-mono text-lg tracking-widest text-shadow">
                      •••• •••• •••• {card.last4}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] uppercase opacity-70 mb-0.5">Cardholder</p>
                      <p className="text-xs font-bold tracking-wide uppercase">Marcelo Grant</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase opacity-70 mb-0.5">Exp</p>
                      <p className="text-xs font-bold">{card.expiry}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="flex items-center justify-between mt-3 px-1">
                   <button 
                      onClick={() => onShowDetails(card)}
                      className="text-xs font-medium text-[#117aca] hover:underline flex items-center gap-1"
                   >
                      <Eye className="h-3 w-3" /> View details
                   </button>
                   <button
                    onClick={() => onToggleLock(card.id)}
                    className={`flex items-center gap-1 text-xs font-medium ${card.status === 'Frozen' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                   >
                     {card.status === 'Frozen' ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                     {card.status === 'Frozen' ? 'Unlock' : 'Lock'}
                   </button>
                </div>
            </div>

            {/* Account Summary & Navigation */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">{card.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border ${card.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                          {card.status}
                      </span>
                   </div>
                   
                   {/* Key Stats Grid */}
                   <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-4">
                      {card.type === 'Credit' ? (
                          <>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Current Balance</p>
                                <p className="text-xl font-bold text-gray-900">${card.balance?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Available Credit</p>
                                <p className="text-xl font-bold text-gray-700">
                                    ${(card.limit! - card.balance!).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Due</p>
                                <p className="text-sm font-semibold text-red-600">
                                    {formatDate(card.dueDate!)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Min Payment</p>
                                <p className="text-sm font-semibold text-gray-900">${card.minPayment?.toFixed(2)}</p>
                            </div>
                          </>
                      ) : (
                          <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Daily Spending Limit</p>
                              <p className="text-lg font-bold text-gray-900">$3,000.00</p>
                          </div>
                      )}
                   </div>
                </div>

                {/* Functional Navigation Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                    {card.type === 'Credit' && (
                        <button 
                            onClick={() => onPayCard(card)}
                            className="flex items-center justify-center gap-2 bg-[#117aca] text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <DollarSign className="h-4 w-4" />
                            Pay Card
                        </button>
                    )}
                    <button 
                        onClick={onViewStatements}
                        className={`flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors ${card.type !== 'Credit' ? 'col-span-2' : ''}`}
                    >
                        <FileText className="h-4 w-4" />
                        Statements
                    </button>
                </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CardList;