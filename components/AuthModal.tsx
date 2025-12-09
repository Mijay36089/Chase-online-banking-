import React, { useState } from 'react';
import { X, Lock, Mail, ChevronRight, AlertCircle, User, MapPin, Phone, CheckCircle, Loader2, ShieldCheck, HelpCircle } from 'lucide-react';
import ChaseLogo from './ChaseLogo';

interface AuthModalProps {
  onLogin: (name?: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  const [rememberMe, setRememberMe] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Registration Approval Simulation State
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'verifying' | 'approving' | 'approved'>('idle');

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Common Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (isLogin) {
      // Login Validation
      if (!username.trim()) {
        setError('Please enter your username.');
        return;
      }
    } else {
      // Registration Validation
      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }

      if (!fullName.trim() || !username.trim() || !address.trim() || !phone.trim()) {
        setError('All fields are required for registration.');
        return;
      }
    }

    setIsLoading(true);

    if (isLogin) {
      // Simulate Login network delay
      setTimeout(() => {
        setIsLoading(false);
        // Default login (keeps existing profile data)
        onLogin(); 
      }, 1500);
    } else {
      // Simulate Registration & Approval Process
      setRegistrationStatus('verifying');
      
      setTimeout(() => {
        setRegistrationStatus('approving');
        setTimeout(() => {
          setRegistrationStatus('approved');
          setIsLoading(false);
          
          // Auto-login after approval delay with new name
          setTimeout(() => {
            onLogin(fullName);
          }, 1500);
        }, 1500);
      }, 1500);
    }
  };

  const resetForm = () => {
    setError('');
    setRegistrationStatus('idle');
    setIsLoading(false);
    setEmail('');
    setPassword('');
    setFullName('');
    setUsername('');
    setAddress('');
    setPhone('');
  };

  // If approved, show the confirmation screen (Sign Up Approver)
  if (registrationStatus === 'approved') {
    return (
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in p-8 text-center border border-gray-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="approved-title"
      >
           <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in-up">
              <CheckCircle className="h-10 w-10 text-green-600" aria-hidden="true" />
           </div>
           <h2 id="approved-title" className="text-2xl font-bold text-gray-900 mb-2">Account Approved!</h2>
           <p className="text-gray-600 mb-6">
             Your application has been verified and approved by our secure systems. Welcome to Chase, <span className="font-semibold text-gray-900">{fullName}</span>.
           </p>
           <div className="flex items-center justify-center gap-2 text-sm text-[#117aca]">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Logging you in securely...
           </div>
      </div>
    );
  }

  // NOTE: This component is now designed to be embedded in the Landing Page (App.tsx), not as a full screen modal overlay itself, 
  // though it can function as one if needed. Based on the requirements, it's the "Sign In box".
  return (
    <div className="bg-white rounded shadow-xl w-full overflow-hidden animate-fade-in border-t-8 border-[#117aca]">
        {/* Header is simpler for the login box look */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-center mb-4">
             <ChaseLogo className="h-12 w-12 text-[#117aca]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isLogin ? 'Welcome' : 'Open an Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Registration Specific Fields */}
            {!isLogin && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Full Name</label>
                      <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#117aca] focus:border-[#117aca] outline-none text-black"
                          placeholder="John Doe"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email</label>
                      <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#117aca] focus:border-[#117aca] outline-none text-black"
                          placeholder="name@example.com"
                      />
                   </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#117aca] focus:border-[#117aca] outline-none text-black"
                      placeholder="(555) 123-4567"
                    />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Address</label>
                  <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#117aca] focus:border-[#117aca] outline-none resize-none h-16 text-black"
                      placeholder="Street Address"
                    />
                </div>
              </div>
            )}

            {/* Login / Common Fields */}
            <div className="space-y-4">
                {/* Username */}
                <div>
                <label className="hidden text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:bg-white focus:ring-2 focus:ring-[#117aca] focus:border-transparent outline-none transition-all placeholder-gray-500 text-black"
                    placeholder="Username"
                />
                </div>

                {/* Password */}
                <div>
                <label className="hidden text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:bg-white focus:ring-2 focus:ring-[#117aca] focus:border-transparent outline-none transition-all placeholder-gray-500 text-black"
                    placeholder="Password"
                />
                </div>
            </div>

            {/* Remember Me & Links */}
            {isLogin && (
                <div className="flex flex-col gap-3 mt-1">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-[#117aca] focus:ring-[#117aca] border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer select-none">
                            Remember me
                        </label>
                    </div>
                </div>
            )}

            {error && (
              <div 
                className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded animate-fade-in border border-red-100"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#117aca] hover:bg-[#0f6ab0] text-white font-bold py-2.5 rounded shadow-sm transition-all flex items-center justify-center gap-2 mt-2 ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {isLogin 
                    ? 'Signing In...' 
                    : registrationStatus === 'verifying' 
                      ? 'Verifying...' 
                      : 'Processing...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
            
            {isLogin && (
                <div className="text-center space-y-2 mt-4">
                     <a href="#" className="block text-sm text-[#117aca] hover:underline">Forgot username/password?</a>
                     <div className="pt-2 border-t border-gray-100">
                         <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setIsLogin(false);
                            }}
                            className="text-sm text-[#117aca] hover:underline font-medium focus:outline-none"
                         >
                            Not enrolled? Sign up now.
                         </button>
                     </div>
                </div>
            )}
            
            {!isLogin && (
                 <div className="text-center mt-4 pt-2 border-t border-gray-100">
                     <button
                        type="button"
                        onClick={() => {
                            resetForm();
                            setIsLogin(true);
                        }}
                        className="text-sm text-[#117aca] hover:underline"
                     >
                        Already have an account? Log in
                     </button>
                 </div>
            )}

          </form>
        </div>
        
        {/* Security Footer */}
        {isLogin && (
            <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
                 <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-1">
                     <ShieldCheck className="h-4 w-4 text-green-600" />
                     <span>Tokenized Security Enabled</span>
                 </div>
            </div>
        )}
    </div>
  );
};

export default AuthModal;