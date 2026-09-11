import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, 
  Layers, Scale, ArrowUpRight, Cpu, FileCheck, Sparkles
} from 'lucide-react';
import { Incident, ForensicHypothesis } from '../../types';

interface AbductiveHypothesisLedgerProps {
  incident: Incident;
}

export const AbductiveHypothesisLedger: React.FC<AbductiveHypothesisLedgerProps> = ({ incident }) => {
  const hypotheses = incident.hypotheses || [];
  const dualLedger = incident.dualLedger || { supporting: [], contradictory: [] };
  const [selectedHypothesis, setSelectedHypothesis] = useState<ForensicHypothesis>(hypotheses[0] || null);

  return (
    <div className="space-y-6 font-sans text-slate-100 select-none">
      
      {/* HEADER RIBBON (Deep Space Cyber Glassmorphic Panel) */}
      <div className="bg-[#040e16]/90 backdrop-blur-md p-5 rounded-3xl border border-[#0e3344] shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              Abductive Multi-Hypothesis &amp; Falsification Engine
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                TRACEX 2.0 ENGINE
              </span>
            </h3>
            <p className="text-xs font-mono text-cyan-300/70 font-medium">
              Formulates mutually exclusive hypotheses ($H_1 \dots H_4$) and actively attempts falsification against physics constraints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-[#061824] border border-[#133c50] text-slate-200 font-semibold flex items-center gap-1.5 shadow-inner">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Falsification Rate: <strong className="text-cyan-300">75.0% (3/4 Falsified)</strong></span>
          </div>
        </div>
      </div>

      {/* COMPETING HYPOTHESES SELECTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hypotheses.map(hyp => {
          const isSelected = selectedHypothesis?.id === hyp.id;
          const isSupported = hyp.status === 'SUPPORTED';

          return (
            <button
              key={hyp.id}
              onClick={() => setSelectedHypothesis(hyp)}
              className={`p-4 rounded-2xl text-left transition-all border relative flex flex-col justify-between ${
                isSelected 
                  ? 'bg-[#061824] shadow-[0_0_20px_rgba(168,85,247,0.25)] border-purple-500 ring-2 ring-purple-500/30' 
                  : 'bg-[#040e16]/80 hover:bg-[#071926] border-[#0e3344] shadow-md hover:border-[#164e66]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-md font-mono ${
                    isSupported 
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]' 
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                  }`}>
                    {hyp.code}
                  </span>

                  <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isSupported 
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                  }`}>
                    {isSupported ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-400" />
                    )}
                    {hyp.status}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-white line-clamp-1 mb-1 font-sans">
                  {hyp.title}
                </h4>
                <p className="text-[11px] font-mono text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {hyp.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#0e3344] flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-400">P(Hypothesis):</span>
                <span className={`font-extrabold ${isSupported ? 'text-emerald-400 text-sm' : 'text-slate-500'}`}>
                  {(hyp.posteriorProbability * 100).toFixed(0)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SELECTED HYPOTHESIS DETAILS & FALSIFICATION LOGIC (Pure Space Theme - No White Box) */}
      {selectedHypothesis && (
        <div className="bg-[#040e16]/95 backdrop-blur-md p-6 rounded-3xl border border-[#0e3344] shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0f3243] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                  HYPOTHESIS DETAIL: {selectedHypothesis.code}
                </span>
                <h4 className="text-base font-extrabold text-white">
                  {selectedHypothesis.title}
                </h4>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1 font-medium">
                Target Entity: <strong className="text-cyan-300">{selectedHypothesis.targetName}</strong> • Type: <span className="font-mono text-purple-400">{selectedHypothesis.type}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider font-mono">Physics Match Score</span>
                <span className="text-base font-extrabold font-mono text-cyan-400">
                  {selectedHypothesis.physicsConstraintScore}%
                </span>
              </div>
            </div>
          </div>

          {selectedHypothesis.status === 'FALSIFIED' && selectedHypothesis.falsificationReason && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-rose-300 uppercase tracking-wider text-[10px] font-mono">Hypothesis Falsification Verdict</strong>
                <p className="mt-0.5 leading-relaxed font-mono">{selectedHypothesis.falsificationReason}</p>
              </div>
            </div>
          )}

          {/* DUAL-TENSION EVIDENCE LEDGER (E+ vs E-) */}
          <div className="pt-2">
            <h4 className="text-sm font-extrabold text-white mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Bifurcated Dual Evidence Accounting Ledger
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-normal">
                Prevents Tribunal Automation Bias ($E^+$ Supporting vs $E^-$ Contradictory)
              </span>
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* SUPPORTING LEDGER E+ (Dark Emerald Matrix) */}
              <div className="bg-[#031c18]/80 border border-emerald-900/60 rounded-2xl p-4 space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2">
                  <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    SUPPORTING EVIDENCE LEDGER (E⁺)
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-mono">
                    {dualLedger.supporting.length} FACTOR{dualLedger.supporting.length !== 1 ? 'S' : ''}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {dualLedger.supporting.map((item) => (
                    <div key={item.id} className="bg-[#052620]/90 p-3 rounded-xl border border-emerald-800/40 text-xs shadow-md space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-emerald-300 text-[11px] px-2 py-0.5 bg-emerald-950/80 rounded border border-emerald-800/50">
                          {item.category} • {item.metric}
                        </span>
                        <span className="text-[11px] font-extrabold text-emerald-400 font-mono">
                          +{(item.impactWeight * 100).toFixed(0)} pts
                        </span>
                      </div>
                      <p className="font-bold text-white text-xs">{item.value}</p>
                      <p className="text-[11px] font-mono text-emerald-200/70 leading-snug">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTRADICTORY LEDGER E- (Dark Crimson Matrix) */}
              <div className="bg-[#1f060b]/80 border border-rose-900/60 rounded-2xl p-4 space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-rose-900/50 pb-2">
                  <span className="text-xs font-extrabold text-rose-300 flex items-center gap-1.5 font-mono">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    CONTRADICTORY EVIDENCE LEDGER (E⁻)
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded-full font-mono">
                    {dualLedger.contradictory.length} FACTOR{dualLedger.contradictory.length !== 1 ? 'S' : ''}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {dualLedger.contradictory.map((item) => (
                    <div key={item.id} className="bg-[#2a0910]/90 p-3 rounded-xl border border-rose-800/40 text-xs shadow-md space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-rose-300 text-[11px] px-2 py-0.5 bg-rose-950/80 rounded border border-rose-800/50 flex items-center gap-1">
                          {item.category} • {item.metric}
                          {item.isFalsificationCriterion && (
                            <span className="text-[9px] font-extrabold px-1.5 bg-rose-900/80 text-rose-200 rounded uppercase border border-rose-700">
                              Falsifier
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] font-extrabold text-rose-400 font-mono">
                          -{(item.impactWeight * 100).toFixed(0)} pts
                        </span>
                      </div>
                      <p className="font-bold text-white text-xs">{item.value}</p>
                      <p className="text-[11px] font-mono text-rose-200/70 leading-snug">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
