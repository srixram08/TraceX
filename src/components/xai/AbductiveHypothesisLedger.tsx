import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, 
  Layers, Scale, ArrowUpRight, Cpu, FileCheck
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
    <div className="space-y-6 font-sans">
      
      {/* HEADER RIBBON */}
      <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-lg flex flex-wrap items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Abductive Multi-Hypothesis & Falsification Engine
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase tracking-wider">
                TRACEX 2.0 ENGINE
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Formulates mutually exclusive hypotheses ($H_1 \dots H_4$) and actively attempts falsification against physics constraints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>Falsification Rate: <strong>75.0% (3/4 Falsified)</strong></span>
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
                  ? 'bg-white dark:bg-slate-900 shadow-md border-indigo-600 ring-2 ring-indigo-500/20' 
                  : 'bg-white/90 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-md font-mono ${
                    isSupported 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {hyp.code}
                  </span>

                  <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isSupported 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {isSupported ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-600" />
                    )}
                    {hyp.status}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1 mb-1 font-sans">
                  {hyp.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {hyp.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-500">P(Hypothesis):</span>
                <span className={`font-extrabold ${isSupported ? 'text-indigo-600 text-sm' : 'text-slate-400'}`}>
                  {(hyp.posteriorProbability * 100).toFixed(0)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SELECTED HYPOTHESIS DETAILS & FALSIFICATION LOGIC */}
      {selectedHypothesis && (
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 font-mono">
                  HYPOTHESIS DETAIL: {selectedHypothesis.code}
                </span>
                <h4 className="text-base font-extrabold text-slate-900">
                  {selectedHypothesis.title}
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Target Entity: <strong className="text-slate-800">{selectedHypothesis.targetName}</strong> • Type: <span className="font-mono text-purple-700">{selectedHypothesis.type}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Physics Match Score</span>
                <span className="text-base font-extrabold font-mono text-indigo-600">
                  {selectedHypothesis.physicsConstraintScore}%
                </span>
              </div>
            </div>
          </div>

          {selectedHypothesis.status === 'FALSIFIED' && selectedHypothesis.falsificationReason && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-rose-950 uppercase tracking-wider text-[10px]">Hypothesis Falsification Verdict</strong>
                <p className="mt-0.5 leading-relaxed">{selectedHypothesis.falsificationReason}</p>
              </div>
            </div>
          )}

          {/* DUAL-TENSION EVIDENCE LEDGER (E+ vs E-) */}
          <div className="pt-2">
            <h4 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Bifurcated Dual Evidence Accounting Ledger
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                Prevents Tribunal Automation Bias ($E^+$ Supporting vs $E^-$ Contradictory)
              </span>
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* SUPPORTING LEDGER E+ */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    SUPPORTING EVIDENCE LEDGER (E⁺)
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono">
                    {dualLedger.supporting.length} FACTOR{dualLedger.supporting.length !== 1 ? 'S' : ''}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {dualLedger.supporting.map((item) => (
                    <div key={item.id} className="bg-white/90 p-3 rounded-xl border border-emerald-100 text-xs shadow-2xs space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-emerald-800 text-[11px] px-2 py-0.5 bg-emerald-50 rounded">
                          {item.category} • {item.metric}
                        </span>
                        <span className="text-[11px] font-extrabold text-emerald-600">
                          +{(item.impactWeight * 100).toFixed(0)} pts
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900 text-xs">{item.value}</p>
                      <p className="text-[11px] text-slate-500 leading-snug">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTRADICTORY LEDGER E- */}
              <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-rose-200/60 pb-2">
                  <span className="text-xs font-extrabold text-rose-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    CONTRADICTORY EVIDENCE LEDGER (E⁻)
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-mono">
                    {dualLedger.contradictory.length} FACTOR{dualLedger.contradictory.length !== 1 ? 'S' : ''}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {dualLedger.contradictory.map((item) => (
                    <div key={item.id} className="bg-white/90 p-3 rounded-xl border border-rose-100 text-xs shadow-2xs space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-rose-800 text-[11px] px-2 py-0.5 bg-rose-50 rounded flex items-center gap-1">
                          {item.category} • {item.metric}
                          {item.isFalsificationCriterion && (
                            <span className="text-[9px] font-extrabold px-1.5 bg-rose-200 text-rose-900 rounded uppercase">
                              Falsifier
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] font-extrabold text-rose-600">
                          -{(item.impactWeight * 100).toFixed(0)} pts
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900 text-xs">{item.value}</p>
                      <p className="text-[11px] text-slate-500 leading-snug">{item.detail}</p>
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
