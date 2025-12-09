import React, { useEffect, useState } from 'react';
import { Bell, ShoppingBag, AlertCircle, Clock } from 'lucide-react';
import { Notification } from '../types';

interface LiveActivityFeedProps {
  notifications: Notification[];
}

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ notifications }) => {
  const [_, setTick] = useState(0);

  // Force re-render every minute to update "time ago"
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper to format relative time
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return '1d+ ago';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-[300px] overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
          <div className="relative">
             <Bell className="h-4 w-4 text-[#117aca]" />
             <span className="absolute -top-1 -right-0.5 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </div>
          Live Activity
        </h3>
        <div className="flex items-center gap-3">
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Real-time
            </span>
        </div>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs">
            <Clock className="h-6 w-6 mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100 animate-fade-in-up">
              <div className={`p-2 rounded-full shrink-0 ${notif.type === 'transaction' ? 'bg-blue-100 text-[#117aca]' : 'bg-yellow-100 text-yellow-600'}`}>
                {notif.type === 'transaction' ? <ShoppingBag className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-semibold text-gray-900 truncate pr-2">
                    {notif.merchant || notif.message}
                  </p>
                  <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                    {getTimeAgo(notif.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {notif.cardName}
                </p>
              </div>
              {notif.amount && (
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">-${notif.amount.toFixed(2)}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveActivityFeed;