
import React, { useState, useEffect, useRef } from 'react';
// Added missing TrendingUp import
import { X, User, Headset, Circle, Send, Search, Filter, Clock, Check, MoreVertical, Loader2, MessageCircle, LayoutDashboard, Users, ShieldAlert, BarChart3, ArrowUpRight, Activity, Bell, Settings, ArrowLeft, TrendingUp } from 'lucide-react';
import ChaseLogo from './ChaseLogo';

interface CustomerCarePortalProps {
  onClose: () => void;
}

type StaffView = 'dashboard' | 'messages' | 'customers' | 'security';

interface ChatSession {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: Date;
  status: 'active' | 'pending' | 'closed';
  unread?: boolean;
}

const CustomerCarePortal: React.FC<CustomerCarePortalProps> = ({ onClose }) => {
  const [activeView, setActiveView] = useState<StaffView>('dashboard');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  // Messages State
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: '1', customerName: 'Marcelo Grant', lastMessage: 'Need help with transfer limit.', timestamp: new Date(), status: 'active', unread: true },
    { id: '2', customerName: 'Anonymous Guest', lastMessage: 'How do I open a CD?', timestamp: new Date(Date.now() - 3600000), status: 'pending' },
    { id: '3', customerName: 'Jane Smith', lastMessage: 'Thank you for your help!', timestamp: new Date(Date.now() - 7200000), status: 'closed' },
  ]);
  
  const [messages, setMessages] = useState<any[]>([
    { id: 'm1', sender: 'customer', text: 'Need help with transfer limit.', time: '10:30 AM' },
    { id: 'm2', sender: 'agent', text: 'Hello Marcelo, I can assist you with that. What limit are you trying to increase?', time: '10:31 AM' },
  ]);
  const [inputValue, setInputValue] = useState('');
  
  // Dashboard Mock Data
  const stats = [
    { label: 'Managed Assets', value: '$4.2B', trend: '+12%', icon: BarChart3, color: 'text-blue-500' },
    { label: 'Active Support', value: '24', trend: '-2', icon: MessageCircle, color: 'text-green-500' },
    { label: 'Clearances', value: '142', trend: 'High', icon: ShieldAlert, color: 'text-orange-500' },
    { label: 'System Health', value: '99.9%', trend: 'Stable', icon: Activity, color: 'text-emerald-500' },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedSessionId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: 'agent',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInputValue('');
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard':
        return (
          <div className="p-5 space-y-5 animate-fade-in-up pb-24">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-36">
                  <div className={`p-2.5 w-fit rounded-2xl bg-gray-50 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-1">Business Pulse</h3>
                <p className="text-xs text-slate-400 mb-6 font-medium">Real-time system health status</p>
                <div className="space-y-3">
                   <div className="flex justify-between items-center bg-slate-800/60 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="h-4 w-4 text-orange-400" />
                        <span className="text-xs text-slate-200">Fraud Protection</span>
                      </div>
                      <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">ACTIVE</span>
                   </div>
                   <div className="flex justify-between items-center bg-slate-800/60 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-4 w-4 text-blue-400" />
                        <span className="text-xs text-slate-200">Liquidity Index</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">OPTIMAL</span>
                   </div>
                </div>
              </div>
              <Activity className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5" />
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-gray-800 tracking-tight">Enterprise Alert Feed</h3>
                  <button className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">See all</button>
               </div>
               <div className="divide-y divide-gray-50">
                  {[
                     { msg: 'Large Wire Approval', user: 'Marcelo Grant', time: '5m', type: 'warning' },
                     { msg: 'Identity Match Failure', user: 'Mobile Terminal 4', time: '12m', type: 'error' },
                     { msg: 'Zelle Velocity Trigger', user: 'Jane Smith', time: '1h', type: 'warning' },
                  ].map((alert, i) => (
                     <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={`h-2 w-2 rounded-full ${alert.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-orange-500'}`}></div>
                           <div>
                              <p className="text-xs font-bold text-gray-900">{alert.msg}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{alert.user}</p>
                           </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{alert.time}</span>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        );

      case 'messages':
        if (selectedSessionId) {
          return (
            <div className="flex flex-col h-full bg-white animate-fade-in pb-16">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white/90 backdrop-blur-md z-10">
                <button onClick={() => setSelectedSessionId(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                   <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div className="h-10 w-10 bg-blue-50 text-[#117aca] rounded-full flex items-center justify-center font-bold text-sm">
                  {selectedSession?.customerName.charAt(0)}
                </div>
                <div>
                   <h3 className="text-sm font-bold text-gray-900 leading-none">{selectedSession?.customerName}</h3>
                   <div className="flex items-center gap-1.5 mt-1">
                      <Circle className="h-1.5 w-1.5 fill-green-500 text-green-500" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Connected</span>
                   </div>
                </div>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/30 custom-scrollbar">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${msg.sender === 'agent' ? 'bg-[#117aca] text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                      {msg.text}
                      <div className={`text-[9px] mt-2 font-medium opacity-60 ${msg.sender === 'agent' ? 'text-right' : 'text-left'}`}>{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex gap-3 bg-white">
                <input 
                  type="text" 
                  placeholder="Type a secure response..." 
                  className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                />
                <button type="submit" className="h-11 w-11 shrink-0 bg-[#117aca] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-90 transition-transform"><Send className="h-5 w-5" /></button>
              </form>
            </div>
          );
        }
        return (
          <div className="animate-fade-in pb-24">
             <div className="p-5">
                <div className="flex justify-between items-end mb-6">
                   <h3 className="text-2xl font-bold text-gray-900">Queue</h3>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sessions.length} ACTIVE</span>
                </div>
                <div className="space-y-3">
                   {sessions.map(session => (
                      <button key={session.id} onClick={() => setSelectedSessionId(session.id)} className="w-full bg-white p-5 rounded-3xl border border-gray-100 flex gap-4 items-center shadow-sm hover:shadow-md transition-all text-left group">
                         <div className="relative shrink-0">
                            <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-bold text-lg group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                              {session.customerName.charAt(0)}
                            </div>
                            {session.status === 'active' && <Circle className="absolute bottom-0 right-0 h-3.5 w-3.5 fill-green-500 text-white border-[3px] border-white" />}
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                               <h4 className="font-bold text-sm text-gray-900 truncate">{session.customerName}</h4>
                               <span className="text-[10px] font-bold text-gray-400">{session.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-xs text-gray-500 truncate font-medium">{session.lastMessage}</p>
                         </div>
                      </button>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'customers':
        return (
          <div className="p-5 space-y-6 animate-fade-in pb-24">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Client Hub</h3>
                <button className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><Search className="h-5 w-5" /></button>
             </div>
             <div className="space-y-3">
                {[
                   { name: 'Marcelo Grant', tier: 'Private Client', status: 'Active', id: '8842' },
                   { name: 'Jane Smith', tier: 'Premier Plus', status: 'Active', id: '1123' },
                   { name: 'Robert Johnson', tier: 'Business Platinum', status: 'Active', id: '5561' },
                ].map((cust, i) => (
                   <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xs font-bold tracking-tighter">{cust.name.split(' ').map(n => n[0]).join('')}</div>
                         <div>
                            <p className="text-sm font-bold text-gray-900">{cust.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{cust.tier}</p>
                         </div>
                      </div>
                      <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                   </div>
                ))}
             </div>
          </div>
        );

      case 'security':
        return (
          <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in pb-24">
             <div className="p-8 bg-red-50 rounded-[2.5rem] shadow-xl shadow-red-500/10">
                <ShieldAlert className="h-16 w-16 text-red-500 animate-pulse" />
             </div>
             <div>
                <h3 className="text-2xl font