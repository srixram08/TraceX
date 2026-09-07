import React, { useState } from 'react';
import { 
  Satellite, ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, 
  Building2, Globe, Shield, CheckCircle2, Eye, EyeOff, Sparkles, Key
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userRole: string) => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const [email, setEmail] = useState('investigator@ntro.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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

  const handleOAuthLogin = (providerName: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLoginSuccess(`${providerName} Authenticated Session`);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-transparent text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-4xl w-full flex flex-col lg:flex-row items-stretch gap-6 my-auto">
        
        {/* FLOATING BRAND SECTION (AUTH 3 LEFT BRAND CARD WITH GLASSMORPHISM) */}
        <div className="lg:w-5/12 bg-gradient-to-br from-slate-900/95 via-purple-950/90 to-indigo-950/95 text-white backdrop-blur-2xl p-8 rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/20 flex flex-col justify-between space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-6">
            {/* Top Back Navigation Link */}
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/10 shadow-sm backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Platform</span>
            </button>

            {/* Floating Brand Section Badge */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-extrabold backdrop-blur-md">
                <Satellite className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>TRACEX 2.0 • AUTH 3 GATEWAY</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white font-display leading-tight">
                Forensic Maritime <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">Digital Twin</span>
              </h1>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                National level oil-spill forensic attribution &amp; counterfactual hydrodynamic intelligence portal.
              </p>
            </div>
          </div>

          {/* Bottom Security Quote Box */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>NTRO LEVEL IV CLEARANCE ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans italic">
              &quot;Proximity is not proof. TraceX formulates competing causal hypotheses with bit-for-bit court admissibility.&quot;
            </p>
          </div>
        </div>

        {/* CENTERED CARD WITH OAUTH OPTIONS (AUTH 3 RIGHT FORM CARD) */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              Sign in with your clearance account or Single Sign-On provider.
            </p>
          </div>

          {/* OAUTH OPTIONS (REACT BITS PRO AUTH 3 FEATURE) */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              OAuth &amp; Government SSO
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleOAuthLogin('NTRO Gov SSO')}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-slate-200 dark:border-slate-700 hover:border-purple-300 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>NTRO Gov</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('NIC Defence SSO')}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 hover:border-blue-300 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>NIC Defence</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('Google SAML SSO')}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Google SAML</span>
              </button>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest shrink-0 font-bold">
              Or continue with email
            </span>
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          </div>

          {/* FORM INPUTS */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                Official Email / Gov ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  placeholder="investigator@ntro.gov.in"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                  Security Clearance Passkey
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] font-mono text-purple-600 dark:text-purple-400 hover:underline font-semibold">
                  Forgot passkey?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME CHECKBOX */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500 accent-purple-600"
                />
                <span>Remember clearance session</span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-purple-600/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating Clearance...' : 'Enter Tactical Operations Room'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* INSTANT DEMO ROLES ACCESS */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="block text-[10px] font-mono text-purple-600 dark:text-purple-400 text-center uppercase tracking-wider font-bold">
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

      </div>

    </div>
  );
};
