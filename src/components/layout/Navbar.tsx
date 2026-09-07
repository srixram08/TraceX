import React from 'react';
import { Satellite, Activity, FileText, ChevronDown, Flame, User, LogIn } from 'lucide-react';
import { Incident, ViewMode } from '../../types';

interface NavbarProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  incidents: Incident[];
  activeIncident: Incident;
  setActiveIncident: (incident: Incident) => void;
  onOpenReport: () => void;
  onOpenNewIncident: () => void;
  onOpenLogin: () => void;
  user: string | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  incidents,
  activeIncident,
  setActiveIncident,
  onOpenReport,
  onOpenNewIncident,
  onOpenLogin,
  user,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 px-4 lg:px-8 py-3.5 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo - Styled like 'Jabel.' in reference image */}
        <div className="flex items-center gap-8">
          <div 
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <span className="text-2xl font-extrabold font-display tracking-tight text-slate-900">
              Trace<span className="text-purple-600 font-black">X</span><span className="text-purple-600 text-3xl leading-none">.</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold border border-purple-200">
              SIH26143
            </span>
          </div>

          {/* Navigation Links (Matching Home, About, Services, On Hold, Pricing, Blog in reference) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setCurrentView('landing')}
              className={`transition-colors hover:text-purple-600 ${
                currentView === 'landing' ? 'text-purple-600 font-bold' : ''
              }`}
            >
              Home
            </button>
            <a href="#about" onClick={() => setCurrentView('landing')} className="hover:text-purple-600 transition-colors">
              About
            </a>
            <a href="#services" onClick={() => setCurrentView('landing')} className="hover:text-purple-600 transition-colors">
              Services
            </a>
            <a href="#samples" onClick={() => setCurrentView('landing')} className="hover:text-purple-600 transition-colors">
              Telemetry Feeds
            </a>
            {user && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-1.5 transition-colors hover:text-purple-600 ${
                  currentView === 'dashboard' ? 'text-purple-600 font-bold' : ''
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-purple-600" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right Actions: Login & Get Started Pill Button */}
        <div className="flex items-center gap-3">
          
          {/* Active Incident Dropdown when in Dashboard */}
          {currentView === 'dashboard' && (
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-mono text-purple-900 transition-all hover:bg-purple-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold">{activeIncident.caseNumber}</span>
                <span className="text-slate-500">({activeIncident.title.slice(0, 14)}...)</span>
                <ChevronDown className="w-3.5 h-3.5 text-purple-600 group-hover:rotate-180 transition-transform" />
              </button>

              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 hidden group-hover:block z-50">
                <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-100 font-bold">
                  Active Cases
                </div>
                {incidents.map((inc) => (
                  <button
                    key={inc.id}
                    onClick={() => setActiveIncident(inc)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex flex-col ${
                      inc.id === activeIncident.id
                        ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-mono text-purple-700">{inc.caseNumber}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{inc.areaKm2} km²</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-normal truncate">{inc.title}</span>
                  </button>
                ))}
                
                <div className="pt-1.5 border-t border-slate-100 mt-1">
                  <button
                    onClick={onOpenNewIncident}
                    className="w-full py-1.5 text-center text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    + Ingest New Incident
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Export Report button in Dashboard */}
          {currentView === 'dashboard' && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Dossier</span>
            </button>
          )}

          {/* User Auth Status / Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView(currentView === 'landing' ? 'dashboard' : 'landing')}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all hover:scale-105"
              >
                {currentView === 'landing' ? 'Go to Dashboard' : 'Back to Home'}
              </button>
              <button
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                title="Sign Out"
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenLogin}
                className="text-sm font-semibold text-slate-700 hover:text-purple-600 transition-colors px-2 py-1"
              >
                Login
              </button>

              {/* Get Started Pill Button (Exact Jabel style from reference!) */}
              <button
                onClick={onOpenLogin}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xs font-bold shadow-md shadow-purple-500/30 transition-all hover:scale-105 active:scale-95"
              >
                Get Started
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
