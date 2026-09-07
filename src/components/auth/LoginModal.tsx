import React, { useState } from 'react';
import { X, Satellite, ShieldCheck, Lock, Mail, ArrowRight, UserCheck, Key } from 'lucide-react';

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
  const [role, setRole] = useState<'commander' | 'space_analyst' | 'coast_guard'>('commander');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(
      role === 'commander' 
        ? 'Commander / Lead Maritime Investigator'
        : role === 'space_analyst'
        ? 'NTRO Space Technology Lead'
        : 'Coast Guard Patrol Officer'
    );
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-purple-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Top Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Satellite className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-mono font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full">
              TraceX Auth Gateway
            </span>
          </div>

          <h3 className="text-2xl font-bold font-display">Sign In to TraceX</h3>
          <p className="text-xs text-purple-100 mt-1">
            Access the Maritime Oil-Spill Intelligence &amp; Attribution Platform
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">
              Official Email / Gov ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                placeholder="investigator@ntro.gov.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">
              Security Clearance Passkey
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Enter Tactical Operations Room</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* One-Click Instant Demo Login Profiles */}
          <div className="pt-3 border-t border-slate-100">
            <span className="block text-[11px] font-mono text-slate-400 text-center uppercase tracking-wider mb-2 font-bold">
              ✦ Instant Demo Role Access ✦
            </span>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('commander')}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[11px] text-purple-900 font-bold text-center transition-all hover:scale-105"
              >
                ⚓ Commander
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('space_analyst')}
                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[11px] text-blue-900 font-bold text-center transition-all hover:scale-105"
              >
                🛰️ NTRO Lead
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('coast_guard')}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] text-emerald-900 font-bold text-center transition-all hover:scale-105"
              >
                🚢 Coast Guard
              </button>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500 font-mono">
          SIH26143 / NTRO Certified • Maritime Forensic Decision Support System
        </div>

      </div>
    </div>
  );
};
