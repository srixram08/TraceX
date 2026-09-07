import React, { useState } from 'react';
import { 
  Satellite, RotateCcw, Ship, 
  Play, Pause, Volume2, ArrowRight, Radio, Globe, 
  Flame, ChevronLeft, ChevronRight, FlaskConical, ShieldCheck
} from 'lucide-react';
import { Incident, Vessel } from '../../types';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onOpenLogin: () => void;
  incidents: Incident[];
  activeIncident: Incident;
  setActiveIncident: (inc: Incident) => void;
  user: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onOpenLogin,
  activeIncident,
  user,
}) => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [demoScrubberHours, setDemoScrubberHours] = useState<number>(0);

  const topVessel: Vessel = activeIncident.vessels[0];

  const telemetrySamples = [
    {
      id: 'sar-echo',
      title: 'SAR Radar Dielectric Backscatter',
      duration: '0:14 / 2:48',
      desc: 'High-frequency radar backscatter isolating low-dielectric surface slick boundary.',
    },
    {
      id: 'reverse-drift',
      title: 'Reverse Lagrangian Advection Pulse',
      duration: '0:32 / 3:10',
      desc: 'Retrograde ocean transport solver tracking 40 particle trajectories backward in time.',
    },
    {
      id: 'ais-anomaly',
      title: 'AIS Transponder Gap & Deceleration',
      duration: '0:18 / 1:55',
      desc: 'Dark ship anomaly flag: 47-minute transponder blackout & 10.1 kn speed drop.',
    },
    {
      id: 'counterfactual',
      title: 'Forward Plume Overlap Synthesizer',
      duration: '0:45 / 4:12',
      desc: 'Hypothetical forward discharge matches observed SAR polygon with 91.4% IoU.',
    },
    {
      id: 'voice-briefing',
      title: 'Forensic Intelligence Incident Briefing',
      duration: '0:22 / 2:04',
      desc: 'Automated situation report summarizing top suspect vessel and legal chain of custody.',
    },
    {
      id: 'ocean-weather',
      title: 'Stokes Drift & Wavefield Vector',
      duration: '0:11 / 1:40',
      desc: 'Surface roughness modulation showing wind leeway deflection angle of 235° at 12.4 kn.',
    },
  ];

  const handleTogglePlay = (id: string) => {
    setPlayingAudioId(playingAudioId === id ? null : id);
  };

  const handleAction = () => {
    if (user) {
      onLaunchDashboard();
    } else {
      onOpenLogin();
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 selection:bg-purple-600 selection:text-white font-sans">
      
      {/* HERO SECTION */}
      <section className="relative pt-10 pb-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-purple-200 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
              <span className="text-xs font-mono font-extrabold text-purple-950 uppercase tracking-wider">
                SIH26143 • NTRO Space Technology &amp; Maritime Surveillance
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans text-slate-950 tracking-tight leading-[1.12] drop-shadow-2xs">
              Detect The Spill.{' '}
              <span className="bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-700 bg-clip-text text-transparent font-black">
                Rewind The Ocean.
              </span>{' '}
              Trace The Vessel.
            </h1>

            <p className="text-base sm:text-lg text-slate-900 font-semibold leading-relaxed max-w-2xl bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-white/80 shadow-2xs">
              TraceX is an AI-powered maritime oil-spill forensic investigation platform combining Sentinel SAR satellite imagery, hydrodynamic reverse-drift modeling, and AIS trajectories to attribute illegal discharges with explainable evidence.
            </p>

            {/* CTAs matching reference pill buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleAction}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-black text-sm shadow-xl shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Get Started Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleAction}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 text-purple-400 fill-current" />
                <span>Explore Live Demo</span>
              </button>
            </div>

          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            <div className="w-full max-w-md p-1.5 rounded-[36px] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 shadow-2xl shadow-purple-600/25 relative group">
              
              <div className="w-full h-full bg-slate-950 rounded-[30px] p-6 text-white overflow-hidden relative flex flex-col justify-between min-h-[440px]">
                
                {/* Background Radar Grid */}
                <div className="absolute inset-0 radar-grid opacity-30 pointer-events-none" />

                {/* Card Top Telemetry */}
                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-purple-300">
                      LIVE RADAR: {activeIncident.caseNumber}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-500/40">
                    Sentinel-1 SAR
                  </span>
                </div>

                {/* Center Interactive Radar & Slick Preview */}
                <div className="relative z-10 flex flex-col items-center justify-center my-auto py-6">
                  
                  {/* Radar Circles */}
                  <div className="relative w-40 h-40 rounded-full border border-purple-500/30 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border border-blue-500/30 animate-pulse flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-emerald-500/30" />
                    </div>

                    {/* Spill Core */}
                    <div className="absolute w-14 h-9 rounded-[40%_60%_70%_30%] bg-red-500/40 border-2 border-red-500 shadow-lg shadow-red-500/40 flex items-center justify-center animate-pulse">
                      <Flame className="w-4 h-4 text-red-300" />
                    </div>

                    {/* Candidate Vessel */}
                    <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center shadow-lg shadow-purple-500 animate-bounce">
                      <Ship className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  <div className="text-center mt-3">
                    <span className="text-xs font-bold text-white block">{topVessel.name}</span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">{topVessel.score.overall}% Attribution Match</span>
                  </div>

                </div>

                {/* Bottom Interactive Rewind Preview Scrubber */}
                <div className="relative z-10 bg-slate-900/90 p-3 rounded-2xl border border-white/10 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between items-center text-[10px] text-purple-200">
                    <span className="flex items-center gap-1 font-bold">
                      <RotateCcw className="w-3 h-3 text-purple-400" /> Rewind Ocean:
                    </span>
                    <span className="text-emerald-400 font-bold">T-{demoScrubberHours}h</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="0.5"
                    value={demoScrubberHours}
                    onChange={(e) => setDemoScrubberHours(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Instant Launch Button */}
                <button
                  onClick={handleAction}
                  className="relative z-10 mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-1"
                >
                  <span>Enter Investigation Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* TOP 3 SERVICES CARDS */}
      <section id="services" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="mb-6">
          <h2 className="text-2xl font-black font-sans text-slate-950">
            Our Maritime Intelligence Services
          </h2>
          <p className="text-xs font-bold text-slate-600 mt-1">
            Versatile and High-Precision Space &amp; Ocean Forensic Modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Service Card 1 */}
          <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-110 transition-transform">
              <Satellite className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-950 mb-2 font-sans">
              Satellite SAR Segmentation
            </h3>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed font-sans">
              Automated ingestion and dielectric thresholding of Sentinel-1 C-SAR Dual-Pol and RADARSAT-2 imagery to isolate slick boundaries and area.
            </p>
          </div>

          {/* Service Card 2 */}
          <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-110 transition-transform">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-950 mb-2 font-sans">
              Reverse Drift Hydrodynamics
            </h3>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed font-sans">
              2D Lagrangian transport solver working backwards from observed satellite time to estimate probable release origin zones using HYCOM currents.
            </p>
          </div>

          {/* Service Card 3 */}
          <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-110 transition-transform">
              <Ship className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-950 mb-2 font-sans">
              AIS Anomaly &amp; Vessel Fusion
            </h3>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed font-sans">
              Normalizes global AIS telemetry, detecting transponder blackout episodes, sudden speed drops, course deviations, and ballast tank wash maneuvers.
            </p>
          </div>

        </div>
      </section>

      {/* SAMPLES & TELEMETRY FEEDS */}
      <section id="samples" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black font-sans text-slate-950">
              Sensor &amp; Telemetry Feeds
            </h2>
            <p className="text-xs font-bold text-slate-600 mt-0.5">
              Listen and inspect live acoustic, radar, and hydrodynamic signals
            </p>
          </div>
          <span className="text-xs font-extrabold text-purple-700 cursor-pointer hover:underline">
            Show more
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {telemetrySamples.map((sample) => (
            <div 
              key={sample.id}
              className={`p-4 rounded-2xl border transition-all ${
                playingAudioId === sample.id
                  ? 'bg-purple-50/90 border-purple-400 shadow-md ring-2 ring-purple-100'
                  : 'bg-white/95 border-slate-200/90 hover:border-purple-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-extrabold text-slate-950 truncate font-sans">
                  {sample.title}
                </h4>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  {sample.duration}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium mb-3 line-clamp-2 font-sans">
                {sample.desc}
              </p>

              {/* Player Waveform Bar */}
              <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
                <button
                  onClick={() => handleTogglePlay(sample.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    playingAudioId === sample.id
                      ? 'bg-purple-600 text-white animate-pulse'
                      : 'bg-slate-200 hover:bg-purple-100 text-slate-700 hover:text-purple-700'
                  }`}
                >
                  {playingAudioId === sample.id ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  )}
                </button>

                {/* Animated Waveform Bars */}
                <div className="flex-1 flex items-center gap-1 h-4 overflow-hidden">
                  {[40, 70, 30, 90, 60, 45, 80, 50, 95, 35, 60, 75, 40, 85, 55, 65].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all ${
                        playingAudioId === sample.id ? 'bg-purple-600' : 'bg-slate-300'
                      }`}
                      style={{
                        height: playingAudioId === sample.id ? `${Math.max(25, (h + i * 15) % 100)}%` : `${h * 0.4}%`
                      }}
                    />
                  ))}
                </div>

                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IS TRACEX? */}
      <section id="about" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-3xl font-black font-sans text-purple-700">
              Who Is TraceX?
            </h2>
            <p className="text-sm text-slate-900 font-medium leading-relaxed bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/60 shadow-2xs">
              At TraceX, we are passionate about the sovereignty and environmental protection of our oceans. We are an AI-powered space technology decision-support system built for maritime investigators, coast guards, and national security agencies.
            </p>
            <p className="text-sm text-slate-900 font-medium leading-relaxed bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/60 shadow-2xs">
              Our mission is simple: to deliver exceptional forensic attribution for illegal maritime discharges using physics-informed reverse-drift Lagrangian hydrodynamics and counterfactual simulation. What sets us apart is our explainable AI framework that produces verifiable legal dossiers rather than black-box assumptions.
            </p>

            <div className="pt-2">
              <button
                onClick={handleAction}
                className="text-sm font-extrabold text-purple-700 hover:text-purple-900 underline flex items-center gap-1"
              >
                <span>Learn More About Our Forensic Architecture</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Framed Spotlight Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md p-2 rounded-[36px] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 shadow-2xl shadow-purple-500/25">
              <div className="w-full h-full bg-white rounded-[28px] p-6 text-slate-900 flex flex-col justify-between min-h-[360px]">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-mono text-xs">
                  <span className="font-extrabold text-purple-700">SIGNATURE CAPABILITY</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px]">
                    91.4% IoU Match
                  </span>
                </div>

                <div className="my-auto text-center space-y-2 py-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
                    <FlaskConical className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-950 font-sans">
                    Counterfactual Simulation Engine
                  </h3>
                  <p className="text-xs text-slate-700 font-medium max-w-xs mx-auto">
                    Simulates forward discharges from candidate vessels at estimated release times, matching satellite polygons with quantitative precision.
                  </p>
                </div>

                <button
                  onClick={handleAction}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/30 transition-all hover:scale-105 flex items-center justify-center gap-1"
                >
                  <span>Simulate Incident Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 text-center">
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">
          We Have Worked With
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-90">
          <div className="font-sans font-black text-sm text-slate-900 flex items-center gap-1.5">
            <Satellite className="w-4 h-4 text-purple-600" /> NTRO Space Tech
          </div>
          <div className="font-sans font-black text-sm text-slate-900 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-blue-600" /> IMO MARPOL Annex I
          </div>
          <div className="font-sans font-black text-sm text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> EMSA CleanSeaNet
          </div>
          <div className="font-sans font-black text-sm text-slate-900 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-amber-500" /> SIH26143 Accelerator
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/80 text-xs text-slate-600 font-mono flex flex-wrap justify-between items-center gap-4 font-medium">
          <p>© 2026 TraceX Intelligence. Built for SIH26143 / NTRO Problem Statement.</p>
          <p>Decision Support System • Non-declaration of unilateral legal liability</p>
        </div>
      </footer>

    </div>
  );
};
