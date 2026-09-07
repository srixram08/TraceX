import React, { useState } from 'react';
import { X, Satellite, ShieldCheck, Lock, Mail, ArrowRight, Shield, Globe, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userRole: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('investigator@ntro.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'commander' | 'space_analyst' | 'coast_guard'>('commander');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onLoginSuccess(
        role === 'commander' 
          ? 'Commander / Lead Maritime Investigator'
          : role === 'space_analyst'
          ? 'NTRO Space Technology Lead'
          : 'Coast Guard Patrol Officer'
      );
      setIsSubmitting(false);
    }, 400);
  };

  const handleQuickDemoLogin = (selectedRole: 'commander' | 'space_analyst' | 'coast_guard') => {
    setRole(selectedRole);
    onLoginSuccess(
      selectedRole === 'commander' 
        ? 'Commander / Lead Maritime Investigator'
        : selectedRole === 'space_analyst'
        ? 'NTRO Space Technology Lead'
        : 'Coast Guard Patrol Officer'
    );
  };

  const handleOAuthLogin = (providerName: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLoginSuccess(`${providerName} Authenticated Session`);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* HEADER */}
        <div className="p-6 pb-4 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Satellite className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full">
              TraceX Auth 3 Gateway
            </span>
          </div>

          <h3 className="text-2xl font-black font-display tracking-tight text-white">Sign In to TraceX</h3>
          <p className="text-xs text-purple-100 mt-1 font-mono">
            Maritime Forensic Digital Twin Clearance Access
          </p>
        </div>

        {/* OAUTH OPTIONS */}
        <div className="p-6 space-y-5">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
              OAuth Single Sign-On
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleOAuthLogin('NTRO Gov SSO')}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>NTRO</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('NIC Defence SSO')}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Defence</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('Google SAML SSO')}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>SAML</span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest shrink-0 font-bold">
              Or continue with email
            </span>
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          </div>

          {/* FORM BODY */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                Official Email / Gov ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-purple-600 outline-none transition-all"
                  placeholder="investigator@ntro.gov.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                Security Clearance Passkey
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-purple-600 outline-none transition-all"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Enter Tactical Operations Room'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* INSTANT DEMO ROLES */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="block text-[10px] font-mono text-slate-400 text-center uppercase tracking-wider mb-2 font-bold">
              ✦ Instant Demo Role Profiles ✦
            </span>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('commander')}
                className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/80 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-200 font-bold text-center transition-all hover:scale-105 cursor-pointer"
              >
                ⚓ Commander
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('space_analyst')}
                className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200 font-bold text-center transition-all hover:scale-105 cursor-pointer"
              >
                🛰️ NTRO Lead
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('coast_guard')}
                className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 font-bold text-center transition-all hover:scale-105 cursor-pointer"
              >
                🚢 Coast Guard
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-500 font-mono">
          TraceX 2.0 • NTRO Certified Maritime Forensic Twin
        </div>

      </div>
    </div>
  );
};
