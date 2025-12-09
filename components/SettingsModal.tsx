import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Shield, 
  Bell, 
  Link as LinkIcon, 
  ChevronRight, 
  Save, 
  Smartphone, 
  Mail, 
  CreditCard,
  Plus,
  Check,
  Calendar,
  Sliders,
  FileText,
  Globe,
  Megaphone,
  Laptop,
  LogOut,
  Gauge
} from 'lucide-react';

export type SettingsTab = 'profile' | 'security' | 'preferences' | 'notifications' | 'accounts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SettingsTab;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialTab = 'profile' }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Update active tab if initialTab changes when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Mock State for Forms
  const [profile, setProfile] = useState({
    firstName: 'Marcelo',
    lastName: 'Grant',
    email: 'marcelo.grant@example.com',
    phone: '(555) 123-4567',
    address: '123 Market Street, San Francisco, CA 94105',
    dob: '1973-07-24'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    emailThreshold: '0.00',
    smsAlerts: true,
    smsThreshold: '100.00',
    pushNotifs: true,
    alertOnCredit: true,
    alertOnDebit: true,
    alertOnForeign: false
  });

  const [preferences, setPreferences] = useState({
    paperless: true,
    language: 'English',
    marketingEmail: false,
    marketingPhone: false,
    marketingMail: true
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: true,
    securityQuestion: 'What was the make of your first car?',
    securityAnswer: '******'
  });

  const [linkedDevices, setLinkedDevices] = useState([
    { id: 1, name: 'Windows PC (Chrome)', location: 'San Francisco, CA', active: true, current: true, icon: Laptop },
    { id: 2, name: 'iPhone 14 Pro', location: 'San Francisco, CA', active: true, current: false, icon: Smartphone },
    { id: 3, name: 'iPad Air', location: 'San Jose, CA', active: true, current: false, icon: Smartphone }
  ]);

  const [linkedAccounts, setLinkedAccounts] = useState([
    { id: 1, bank: 'Chase', name: 'Total Checking', mask: '8842', type: 'internal' },
    { id: 2, bank: 'Chase', name: 'Premier Savings', mask: '9921', type: 'internal' }
  ]);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Settings updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1000);
  };

  const handleLinkAccount = () => {
    // Simulate linking external account
    setIsLoading(true);
    setTimeout(() => {
        const newAccount = { 
            id: Date.now(), 
            bank: 'Bank of America', 
            name: 'Advantage Banking', 
            mask: Math.floor(1000 + Math.random() * 9000).toString(), 
            type: 'external' 
        };
        setLinkedAccounts([...linkedAccounts, newAccount]);
        setIsLoading(false);
        setSuccessMsg('External account linked successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
    }, 1500);
  };

  const handleRemoveDevice = (id: number) => {
    setLinkedDevices(prev => prev.filter(d => d.id !== id));
  };

  const TabButton = ({ id, icon: Icon, label }: { id: SettingsTab; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        activeTab === id 
          ? 'bg-blue-50 text-[#117aca]' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {label}
      {activeTab === id && <ChevronRight className="h-4 w-4 ml-auto" aria-hidden="true" />}
    </button>
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[650px]">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4 flex flex-col shrink-0">
          <h2 className="text-xl font-bold text-gray-800 mb-6 px-4 pt-2">Settings</h2>
          <nav className="space-y-1 flex-1 overflow-y-auto">
            <TabButton id="profile" icon={User} label="Profile & Personal" />
            <TabButton id="security" icon={Shield} label="Security & Login" />
            <TabButton id="preferences" icon={Sliders} label="Preferences" />
            <TabButton id="notifications" icon={Bell} label="Notifications" />
            <TabButton id="accounts" icon={LinkIcon} label="Linked Accounts" />
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
            <h3 className="text-lg font-bold text-gray-900 capitalize">
              {activeTab === 'preferences' ? 'Account Preferences' : activeTab === 'accounts' ? 'Linked Accounts' : `${activeTab} Settings`}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close settings"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            
            {successMsg && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 animate-fade-in" role="status">
                    <Check className="h-5 w-5" aria-hidden="true" />
                    {successMsg}
                </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8 max-w-2xl">
                {/* Personal Identifiers */}
                <section>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Personal Identifiers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input 
                            type="text" 
                            value={profile.firstName}
                            onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#117aca] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input 
                            type="text" 
                            value={profile.lastName}
                            onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#117aca] outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                                <input 
                                type="date" 
                                value={profile.dob}
                                onChange={(e) => setProfile({...profile, dob: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117aca] outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-t border-gray-100 pt-6">Contact Information</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                                <input 
                                type="email" 
                                value={profile.email}
                                onChange={(e) => setProfile({...profile, email: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117aca] outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                                <input 
                                type="tel" 
                                value={profile.phone}
                                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117aca] outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mailing Address</label>
                            <textarea 
                                value={profile.address}
                                onChange={(e) => setProfile({...profile, address: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#117aca] outline-none h-20 resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Identity Monitoring */}
                <section>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-t border-gray-100 pt-6">Identity Monitoring</h4>
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-start justify-between">
                            <div>
                                <h5 className="font-bold text-lg flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-400" />
                                    Chase Credit Journey®
                                </h5>
                                <p className="text-gray-300 text-sm mt-1">Identity monitoring is active. No new alerts detected.</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-3xl font-bold">785</span>
                                <span className="text-xs text-green-400 font-medium bg-green-900/50 px-2 py-0.5 rounded">Excellent</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700 flex gap-4 text-sm">
                            <button className="text-blue-300 hover:text-white hover:underline">View Credit Report</button>
                            <button className="text-blue-300 hover:text-white hover:underline">Manage Alerts</button>
                        </div>
                    </div>
                </section>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 max-w-2xl">
                {/* Password & Authentication */}
                <section>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Authentication Data</h4>
                    <div className="space-y-4">
                        <input 
                            type="password" 
                            placeholder="Current Password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#117aca] outline-none"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                type="password" 
                                placeholder="New Password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#117aca] outline-none"
                            />
                            <input 
                                type="password" 
                                placeholder="Confirm New Password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#117aca] outline-none"
                            />
                        </div>
                        
                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Security Question</label>
                            <select 
                                value={security.securityQuestion}
                                onChange={(e) => setSecurity({...security, securityQuestion: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#117aca] outline-none mb-2"
                            >
                                <option>What was the make of your first car?</option>
                                <option>What is your mother's maiden name?</option>
                                <option>What city were you born in?</option>
                            </select>
                            <input 
                                type="text" 
                                value={security.securityAnswer}
                                onChange={(e) => setSecurity({...security, securityAnswer: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#117aca] outline-none"
                                placeholder="Answer"
                            />
                        </div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* 2FA Toggle */}
                <section>
                    <div className="flex items-center justify-between">
                        <div>
                        <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-xs text-gray-500">Require a code when logging in from a new device.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={security.twoFactor} 
                            onChange={(e) => setSecurity({...security, twoFactor: e.target.checked})} 
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#117aca]"></div>
                        </label>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Linked Devices */}
                <section>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Linked Devices</h4>
                    <div className="space-y-3">
                        {linkedDevices.map(device => (
                            <div key={device.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border border-gray-200 rounded-lg">
                                        <device.icon className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            {device.name}
                                            {device.current && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">Current</span>}
                                        </p>
                                        <p className="text-xs text-gray-500">{device.location} • Active Now</p>
                                    </div>
                                </div>
                                {!device.current && (
                                    <button 
                                        onClick={() => handleRemoveDevice(device.id)}
                                        className="text-xs text-red-600 hover:text-red-800 hover:underline flex items-center gap-1"
                                    >
                                        <LogOut className="h-3 w-3" /> Sign Out
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
              </div>
            )}

            {activeTab === 'preferences' && (
                <div className="space-y-8 max-w-2xl">
                    <section>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Account Preferences</h4>
                        <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-[#117aca]" />
                                        <div>
                                            <h5 className="font-bold text-gray-900 text-sm">Paperless Statements</h5>
                                            <p className="text-xs text-gray-500">Receive documents electronically.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.paperless} 
                                            onChange={(e) => setPreferences({...preferences, paperless: e.target.checked})} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#117aca]"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Globe className="h-5 w-5 text-[#117aca]" />
                                    <div>
                                        <h5 className="font-bold text-gray-900 text-sm">Language</h5>
                                        <p className="text-xs text-gray-500">Preferred language for banking.</p>
                                    </div>
                                </div>
                                <select 
                                    value={preferences.language}
                                    onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                    className="border border-gray-300 rounded-md text-sm px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#117aca]"
                                >
                                    <option>English</option>
                                    <option>Español</option>
                                    <option>Français</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section>
                         <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pt-4 border-t border-gray-100">Marketing Preferences</h4>
                         <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Megaphone className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-semibold text-gray-800">I would like to receive offers via:</span>
                            </div>
                            
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-gray-600">Email</span>
                                <input 
                                    type="checkbox" 
                                    checked={preferences.marketingEmail} 
                                    onChange={(e) => setPreferences({...preferences, marketingEmail: e.target.checked})} 
                                    className="accent-[#117aca] h-4 w-4"
                                />
                            </label>
                             <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-gray-600">Phone / SMS</span>
                                <input 
                                    type="checkbox" 
                                    checked={preferences.marketingPhone} 
                                    onChange={(e) => setPreferences({...preferences, marketingPhone: e.target.checked})} 
                                    className="accent-[#117aca] h-4 w-4"
                                />
                            </label>
                             <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-gray-600">Standard Mail</span>
                                <input 
                                    type="checkbox" 
                                    checked={preferences.marketingMail} 
                                    onChange={(e) => setPreferences({...preferences, marketingMail: e.target.checked})} 
                                    className="accent-[#117aca] h-4 w-4"
                                />
                            </label>
                         </div>
                    </section>
                </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                 {/* Email Settings */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-[#117aca]">
                                <Mail className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Email Alerts</h4>
                                <p className="text-xs text-gray-500">Receive digital receipts and statements.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifications.emailAlerts} 
                            onChange={(e) => setNotifications({...notifications, emailAlerts: e.target.checked})} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#117aca]"></div>
                        </label>
                    </div>
                    
                    {notifications.emailAlerts && (
                        <div className="ml-12 p-4 bg-gray-50 rounded-lg border border-gray-100 animate-fade-in">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Minimum Transaction Amount</label>
                            <div className="relative max-w-[200px]">
                                <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                                <input 
                                    type="number" 
                                    value={notifications.emailThreshold}
                                    onChange={(e) => setNotifications({...notifications, emailThreshold: e.target.value})}
                                    className="w-full pl-7 pr-4 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#117aca] outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">You will receive emails for transactions exceeding this amount.</p>
                        </div>
                    )}
                 </div>

                 <hr className="border-gray-100" />

                 {/* SMS Settings */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                <Smartphone className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                                <p className="text-xs text-gray-500">Instant alerts sent to your mobile device.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifications.smsAlerts} 
                            onChange={(e) => setNotifications({...notifications, smsAlerts: e.target.checked})} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#117aca]"></div>
                        </label>
                    </div>

                    {notifications.smsAlerts && (
                        <div className="ml-12 p-4 bg-gray-50 rounded-lg border border-gray-100 animate-fade-in">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Minimum Transaction Amount</label>
                            <div className="relative max-w-[200px]">
                                <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                                <input 
                                    type="number" 
                                    value={notifications.smsThreshold}
                                    onChange={(e) => setNotifications({...notifications, smsThreshold: e.target.value})}
                                    className="w-full pl-7 pr-4 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#117aca] outline-none"
                                    placeholder="100.00"
                                />
                            </div>
                        </div>
                    )}
                 </div>

                 <hr className="border-gray-100" />

                 {/* Granular Filters */}
                 <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Bell className="h-4 w-4 text-[#117aca]" aria-hidden="true" />
                        Alert Preferences
                    </h4>
                    <div className="space-y-3 ml-1">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${notifications.alertOnDebit ? 'bg-[#117aca] border-[#117aca]' : 'border-gray-300 bg-white'}`}>
                                {notifications.alertOnDebit && <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />}
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={notifications.alertOnDebit} 
                                onChange={(e) => setNotifications({...notifications, alertOnDebit: e.target.checked})} 
                            />
                            <span className="text-sm text-gray-700">Outgoing Payments & Withdrawals</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${notifications.alertOnCredit ? 'bg-[#117aca] border-[#117aca]' : 'border-gray-300 bg-white'}`}>
                                {notifications.alertOnCredit && <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />}
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={notifications.alertOnCredit} 
                                onChange={(e) => setNotifications({...notifications, alertOnCredit: e.target.checked})} 
                            />
                            <span className="text-sm text-gray-700">Incoming Deposits & Credits</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${notifications.alertOnForeign ? 'bg-[#117aca] border-[#117aca]' : 'border-gray-300 bg-white'}`}>
                                {notifications.alertOnForeign && <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />}
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={notifications.alertOnForeign} 
                                onChange={(e) => setNotifications({...notifications, alertOnForeign: e.target.checked})} 
                            />
                            <span className="text-sm text-gray-700">International Transactions</span>
                        </label>
                    </div>
                 </div>

              </div>
            )}

            {activeTab === 'accounts' && (
              <div className="space-y-4">
                 <p className="text-sm text-gray-600 mb-4">
                     Manage your connected accounts. Use Open Banking to link external accounts for a consolidated view of your finances.
                 </p>
                 
                 {linkedAccounts.map((account) => (
                     <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                         <div className="flex items-center gap-4">
                             <div className={`p-3 rounded-lg ${account.type === 'internal' ? 'bg-[#117aca] text-white' : 'bg-purple-600 text-white'}`}>
                                 <CreditCard className="h-6 w-6" aria-hidden="true" />
                             </div>
                             <div>
                                 <h4 className="font-bold text-gray-900">{account.bank}</h4>
                                 <p className="text-sm text-gray-600">{account.name} •••• {account.mask}</p>
                             </div>
                         </div>
                         <span className={`px-2 py-1 text-xs font-semibold rounded ${account.type === 'internal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                             {account.type === 'internal' ? 'Primary' : 'External'}
                         </span>
                     </div>
                 ))}

                 <button 
                    onClick={handleLinkAccount}
                    disabled={isLoading}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-[#117aca] hover:border-[#117aca] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
                 >
                     {isLoading ? 'Connecting...' : (
                        <>
                            <Plus className="h-5 w-5" aria-hidden="true" />
                            Link External Account
                        </>
                     )}
                 </button>
              </div>
            )}

          </div>

          {/* Footer */}
          {activeTab !== 'accounts' && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#117aca] hover:bg-[#0f6ab0] text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#117aca] outline-none disabled:opacity-70"
                >
                <Save className="h-4 w-4" aria-hidden="true" />
                {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;