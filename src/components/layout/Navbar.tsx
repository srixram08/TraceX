import React, { useState } from 'react';
import { Satellite, Activity, FileText, ChevronDown, Flame, User, LogIn, LogOut, Sun, Moon } from 'lucide-react';
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
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
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
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 lg:px-8 py-3 transition-all duration-300 shadow-xs">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Context */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div 
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <span className="text-2xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
              Trace<span className="text-purple-600 dark:text-purple-400 font-black">X</span><span className="text-purple-600 dark:text-purple-400 text-3xl leading-none">.</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
              {currentView === 'dashboard' ? 'FORENSIC TWIN' : 'SIH26143'}
            </span>
          </div>

          {/* Landing Navigation Links (ONLY visible on Landing Page) */}
          {currentView === 'landing' && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setCurrentView('landing')}
                className="text-purple-600 dark:text-purple-400 font-bold transition-colors"
              >
                Home
              </button>
              <a href="#about" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                About
              </a>
              <a href="#services" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Services
              </a>
              <a href="#samples" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Telemetry Feeds
              </a>
            </nav>
          )}
        </div>

        {/* Right Actions Header Control */}
        <div className="flex items-center gap-2.5">
          
          {currentView === 'dashboard' ? (
            <>
              {/* SLK Active Location Selector Pill (Positioned right next to Certified Dossier) */}
              {activeIncident && (
                <div className="relative">
                  <button
                    onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-800 dark:text-purple-200 border border-purple-200/90 dark:border-purple-800 font-medium text-xs transition-all shadow-2xs group cursor-pointer"
                    title="Switch Active Location"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-extrabold font-mono text-purple-900 dark:text-purple-200">{activeIncident.caseNumber}</span>
                    <span className="text-slate-600 dark:text-slate-400 font-sans text-xs hidden sm:inline">({activeIncident.region.split(' (')[0]})</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 transition-transform duration-200 ${isLocationMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Location Popover Dropdown Menu */}
                  {isLocationMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsLocationMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl z-50 p-2 space-y-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3 py-1.5 text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-1">
                          <span>Select Target Location</span>
                          <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full font-mono font-bold">{incidents.length} LOCATIONS</span>
                        </div>

                        {incidents.map((inc) => (
                          <button
                            key={inc.id}
                            onClick={() => {
                              setActiveIncident(inc);
                              setIsLocationMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                              inc.id === activeIncident.id
                                ? 'bg-purple-50/90 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 font-extrabold border border-purple-200/80 dark:border-purple-800 shadow-2xs'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${inc.id === activeIncident.id ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900' : 'bg-slate-300 dark:bg-slate-700'}`} />
                              <div>
                                <div className="text-xs font-mono font-bold flex items-center gap-2">
                                  <span className="text-purple-900 dark:text-purple-300">{inc.caseNumber}</span>
                                  <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    {inc.region.split(' (')[0]}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                  {inc.areaKm2} km² • {inc.sensor.split(' ')[0]}
                                </div>
                              </div>
                            </div>

                            {inc.id === activeIncident.id && (
                              <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-full">
                                ACTIVE
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Dossier Report Export Quick Action */}
              <button
                onClick={onOpenReport}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all border border-slate-200/80 dark:border-slate-700 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="hidden sm:inline">Certified Dossier</span>
              </button>

              {/* Dark Mode Toggle Button */}
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Home / Exit Dashboard Button */}
              <button
                onClick={() => setCurrentView('landing')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Exit Command Center</span>
              </button>

              {/* Sign Out Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-all hover:scale-105 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <>
              {/* Dark Mode Toggle Button for Landing Page */}
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center mr-1"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Enter Operations Dashboard</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Access Portal</span>
                </button>
              )}
            </>
          )}

        </div>

      </div>
    </header>
  );
};

