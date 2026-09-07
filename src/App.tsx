import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { OperationsDashboard } from './components/dashboard/OperationsDashboard';
import { InvestigationReportModal } from './components/reports/InvestigationReportModal';
import { NewIncidentModal } from './components/incidents/NewIncidentModal';
import { LoginModal } from './components/auth/LoginModal';
import { LoginPage } from './components/auth/LoginPage';
import Scanner from './components/ui/Scanner';
import GradientBlinds from './components/ui/GradientBlinds';
import { mockIncidents } from './data/mockData';
import { Incident, ViewMode } from './types';

export function App() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [activeIncident, setActiveIncident] = useState<Incident>(mockIncidents[0]);
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  
  // Auth state
  const [user, setUser] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // Modals
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState<boolean>(false);

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
  };

  const handleLoginSuccess = (userRole: string) => {
    setUser(userRole);
    setIsLoginOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const handleAddNewIncident = (newInc: Incident) => {
    setIncidents((prev: Incident[]) => [newInc, ...prev]);
    setActiveIncident(newInc);
    setCurrentView('dashboard');
  };

  const isLandingOrLogin = currentView === 'landing' || currentView === 'login';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative overflow-x-hidden">
      
      {/* React Bits WebGL Scanner Radar Field Background (Vibrant & Rich on Landing & Login) */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${isLandingOrLogin ? 'opacity-90' : 'opacity-0'}`}>
        <Scanner
          color1="#6366f1"
          color2="#ec4899"
          color3="#06b6d4"
          speed={0.6}
          sweepSpeed={0.28}
          sweepWidth={1.5}
          sweepFalloff={5.5}
          scale={1.5}
          frequency={2.2}
          ripple={0.25}
          bandDensity={12}
          lineSharpness={5.0}
          glow={0.4}
          scanDirection="diagonal"
          colorSpread={0.8}
          brightness={1.35}
          contrast={1.25}
          softness={1.2}
          vignette={0.3}
          scanline={true}
          grain={true}
          grainIntensity={0.04}
          opacity={0.9}
          mouseInteraction={true}
          mouseRadius={0.5}
          mouseStrength={0.6}
        />
      </div>

      {/* React Bits WebGL GradientBlinds Component Background (Calm & Low Intensity on Dashboard) */}
      {currentView === 'dashboard' && (
        <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 opacity-25">
          <GradientBlinds
            gradientColors={['#f1f5f9', '#e2e8f0', '#ddd6fe', '#e0e7ff']}
            angle={20}
            noise={0.05}
            blindCount={16}
            blindMinWidth={70}
            spotlightRadius={0.5}
            spotlightSoftness={1.5}
            spotlightOpacity={0.35}
            mouseDampening={0.12}
            distortAmount={0.3}
            shineDirection="left"
            mixBlendMode="soft-light"
            lightMode={true}
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Universal Navbar (Hidden on standalone Login Page) */}
        {currentView !== 'login' && (
          <Navbar
            currentView={currentView}
            setCurrentView={handleViewChange}
            incidents={incidents}
            activeIncident={activeIncident}
            setActiveIncident={setActiveIncident}
            onOpenReport={() => setIsReportOpen(true)}
            onOpenNewIncident={() => setIsNewIncidentOpen(true)}
            onOpenLogin={() => setCurrentView('login')}
            user={user}
            onLogout={handleLogout}
          />
        )}

        {/* Main View Area */}
        <main className="flex-1">
          {currentView === 'landing' ? (
            <LandingPage
              onLaunchDashboard={() => {
                if (user) {
                  setCurrentView('dashboard');
                } else {
                  setCurrentView('login');
                }
              }}
              onOpenLogin={() => setCurrentView('login')}
              incidents={incidents}
              activeIncident={activeIncident}
              setActiveIncident={setActiveIncident}
              user={user}
            />
          ) : currentView === 'login' ? (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onBackToHome={() => setCurrentView('landing')}
            />
          ) : (
            <OperationsDashboard
              incident={activeIncident}
              onOpenReport={() => setIsReportOpen(true)}
              onOpenNewIncident={() => setIsNewIncidentOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Auth Login Gateway Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Certified Investigation Dossier Report Modal */}
      <InvestigationReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        incident={activeIncident}
        selectedVessel={activeIncident.vessels[0]}
      />

      {/* Ingest New Incident Modal */}
      <NewIncidentModal
        isOpen={isNewIncidentOpen}
        onClose={() => setIsNewIncidentOpen(false)}
        onAddNewIncident={handleAddNewIncident}
      />

    </div>
  );
}

export default App;
