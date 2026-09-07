import React, { useState } from 'react';
import { 
  Satellite, ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, 
  Building2, Globe, Key, Shield, CheckCircle2, Radio, Sparkles
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userRole: string) => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const [authMode, setAuthMode] = useState<'credentials' | 'sso_domain'>('credentials');
  
  // Standard Credentials State
  const [email, setEmail] = useState('investigator@ntro.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  
  // SSO Domain State
  const [companyDomain, setCompanyDomain] = useState('ntro.gov.in');
  
  const [role, setRole] = useState<'commander' | 'space_analyst' | 'coast_guard'>('commander');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleProviderSSO = (providerName: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLoginSuccess(`${providerName} Authenticated Session`);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-transparent text-slate-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Authentication 2 Card Container */}
      <div className="relative z-10 max-w-xl w-full">
        
        {/* Top Back Navigation Link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-700 hover:text-purple-700 transition-all bg-white hover:bg-purple-50 px-4 py-2 rounded-full border border-slate-200 hover:border-purple-200 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Platform</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>NTRO SSO Node Active</span>
          </div>
        </div>

        {/* Card Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-purple-500/10 overflow-hidden">
          
          {/* Header Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Satellite className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase bg-white/20 text-white px-3 py-1 rounded-full">
                TraceX Auth Gateway • Authentication 2
              </span>
            </div>

            <h1 className="text-3xl font-extrabold font-display text-white tracking-tight">
              Sign In to TraceX
            </h1>
            <p className="text-xs text-purple-100 mt-1 font-mono">
              Access the Maritime Oil-Spill Intelligence &amp; Attribution Platform
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Provider-First Sign-In Section (React Bits Pro Authentication 2 Pattern) */}
            <div>
              <span className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">
                1. Single Sign-On (SSO Providers)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleProviderSSO('NTRO Gov SSO')}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-xs font-bold text-slate-800 hover:text-purple-900 transition-all hover:scale-[1.02]"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>NTRO Gov SSO</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleProviderSSO('NIC Defence SSO')}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-bold text-slate-800 hover:text-blue-900 transition-all hover:scale-[1.02]"
                >
                  <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>NIC Defence</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleProviderSSO('Google Workspace SAML')}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 hover:text-emerald-900 transition-all hover:scale-[1.02]"
                >
                  <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Google SAML</span>
                </button>
              </div>
            </div>

            {/* Section Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest shrink-0 font-bold">
                Or Choose Auth Method
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* Auth Mode Toggle Switch (Standard Email vs Company / Agency Domain) */}
            <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200 grid grid-cols-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setAuthMode('credentials')}
                className={`py-2 rounded-xl transition-all font-bold flex items-center justify-center gap-1.5 ${
                  authMode === 'credentials'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-600 hover:text-purple-600'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Clearance Email</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('sso_domain')}
                className={`py-2 rounded-xl transition-all font-bold flex items-center justify-center gap-1.5 ${
                  authMode === 'sso_domain'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-600 hover:text-purple-600'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Company Domain</span>
              </button>
            </div>

            {/* Dynamic Form Inputs (Swaps Email/Passkey vs Company Domain) */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {authMode === 'credentials' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">
                      Official Email / Gov ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="investigator@ntro.gov.in"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">
                      Security Clearance Passkey
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Company / Agency Domain Input (Authentication 2 Provider Swap) */
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">
                      Company / Agency SSO Domain
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={companyDomain}
                        onChange={(e) => setCompanyDomain(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-purple-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="e.g. ntro.gov.in or indiannavy.nic.in"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      Enter your authorized agency domain to trigger SAML v2.0 redirect.
                    </p>
                  </div>

                  {/* Domain Chip Autocompletes */}
                  <div className="flex flex-wrap gap-1.5">
                    {['ntro.gov.in', 'indiannavy.nic.in', 'coastguard.gov.in', 'marpol.org'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setCompanyDomain(d)}
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                          companyDomain === d
                            ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-purple-50 hover:text-purple-700'
                        }`}
                      >
                        @{d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-sm shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating Clearance...' : 'Enter Tactical Operations Room'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Demo Role Access (React Bits Pro Authentication 2 Pattern) */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <span className="block text-[11px] font-mono text-purple-700 text-center uppercase tracking-wider font-bold">
                ✦ Instant Demo Role Access ✦
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('commander')}
                  className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs text-purple-900 font-bold text-center transition-all hover:scale-105 flex items-center justify-center gap-1.5"
                >
                  <span>⚓ Commander</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('space_analyst')}
                  className="p-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs text-blue-900 font-bold text-center transition-all hover:scale-105 flex items-center justify-center gap-1.5"
                >
                  <span>🛰️ NTRO Lead</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('coast_guard')}
                  className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs text-emerald-900 font-bold text-center transition-all hover:scale-105 flex items-center justify-center gap-1.5"
                >
                  <span>🚢 Coast Guard</span>
                </button>
              </div>
            </div>

          </div>

          {/* Footer Security Notice */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>SIH26143 / NTRO Certified</span>
            <span className="text-purple-700 font-bold">RESTRICTED ACCESS • LEVEL IV CLEARANCE</span>
          </div>

        </div>
      </div>

    </div>
  );
};
