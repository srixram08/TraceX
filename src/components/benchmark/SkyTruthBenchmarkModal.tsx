import React from 'react';
import { X, Award, ShieldCheck, Zap, AlertTriangle, CheckCircle2, FileText, ChevronRight, Scale, Activity } from 'lucide-react';

interface SkyTruthBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkyTruthBenchmarkModal: React.FC<SkyTruthBenchmarkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-purple-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase font-mono tracking-wider">
                  SIH / DEFENSE EVALUATION PIVOT
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono">
                  TARGET RESCORE: 34.5 / 40 (+9.5 PTS)
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                SLICKTRACE 2.0 • STRATEGIC REDESIGN BENCHMARK
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-8 overflow-y-auto">
          
          {/* WINNING PITCH SCRIPT BOX */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl space-y-3 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-0" />
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest relative z-10">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>THE WINNING PITCH SCRIPT</span>
            </div>
            <p className="text-sm font-medium italic text-slate-200 leading-relaxed relative z-10">
              &quot;Existing tools like SkyTruth ask: &apos;Which vessel was near the slick?&apos; But in maritime law and defense intelligence, proximity is not proof. AIS is spoofed, ocean currents are chaotic, and deterministic tracks fail under scrutiny. <strong className="text-purple-300 font-bold">SLICKTRACE 2.0 is a Forensic Maritime Digital Twin.</strong> We do not simply rank suspects. We formulate competing causal hypotheses, propagate environmental uncertainty through hundreds of Monte Carlo counterfactual simulations, aggressively expose contradictory evidence, and forecast downstream ecological impact—delivering an auditable, court-admissible forensic case package.&quot;
            </p>
          </div>

          {/* SECTION 1: EVALUATOR SCORE BREAKDOWN & NOVELTY PROJECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-5 bg-purple-600 rounded-full" />
                1. EVALUATOR SCORE BREAKDOWN &amp; NOVELTY PROJECTION
              </h3>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                BENCHMARK: SKYTRUTH CERULEAN
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-mono font-extrabold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Dimension</th>
                    <th className="p-3 text-center">V1 Score</th>
                    <th className="p-3">Evaluator Feedback Context</th>
                    <th className="p-3 text-center">V2 Target</th>
                    <th className="p-3">Strategic Shift to Win Back Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">Novelty</td>
                    <td className="p-3 text-center font-mono font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30">3 / 10 ❌</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">SAR detection + AIS attribution operationalised by SkyTruth. Proximity ranking is not novel.</td>
                    <td className="p-3 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30">8.5 / 10 🚀</td>
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">Pivot from associative ML ranking to <strong className="text-purple-600 dark:text-purple-400">Abductive Causal Reasoning</strong>, Monte Carlo physics ensembles, and falsification testing.</td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">Impact</td>
                    <td className="p-3 text-center font-mono font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30">6 / 10 ⚠️</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">Score output is post-hoc and institutionally siloed; operational mitigation impact was unclear.</td>
                    <td className="p-3 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30">8.5 / 10 🚀</td>
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">Add <strong className="text-indigo-600 dark:text-indigo-400">Forward Risk Forecasting (+6h to +48h)</strong> intersecting ecological &amp; economic assets + legal-grade evidence packages.</td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">Technical Feasibility</td>
                    <td className="p-3 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30">8 / 10 ✅</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">Solid foundation. Functional pipeline, clean architectural modularity recognized.</td>
                    <td className="p-3 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30">8.5 / 10 ✅</td>
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">Maintain existing core infrastructure; wrap deterministic modules in stochastic simulations.</td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">Appropriateness</td>
                    <td className="p-3 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30">8 / 10 ✅</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">Directly addresses problem statement needs; evaluator demanded SkyTruth transparency.</td>
                    <td className="p-3 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30">9.0 / 10 ✅</td>
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">Acknowledge SkyTruth as upstream baseline; position SLICKTRACE as downstream forensic twin.</td>
                  </tr>

                  <tr className="bg-purple-50/80 dark:bg-purple-950/40 font-bold">
                    <td className="p-3 text-purple-900 dark:text-purple-200 font-extrabold">TOTAL SCORE</td>
                    <td className="p-3 text-center font-mono font-black text-slate-700 dark:text-slate-300">25 / 40 (Accept)</td>
                    <td className="p-3 text-purple-800 dark:text-purple-300 italic">Bottom-quartile acceptance tier.</td>
                    <td className="p-3 text-center font-mono font-black text-purple-700 dark:text-purple-300 text-sm">34.5 / 40 (Winner)</td>
                    <td className="p-3 text-purple-900 dark:text-purple-200">Moves candidate straight into top-tier national winner consideration.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: DIRECT BENCHMARK: SLICKTRACE 2.0 VS. SKYTRUTH / CERULEAN */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-5 bg-indigo-600 rounded-full" />
              3. DIRECT BENCHMARK: SLICKTRACE 2.0 VS. SKYTRUTH / CERULEAN
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-mono font-extrabold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Capability Dimension</th>
                    <th className="p-3 bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">SkyTruth Cerulean (Status Quo)</th>
                    <th className="p-3 bg-purple-600 text-white font-black">SLICKTRACE 2.0 (Forensic Twin)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">Primary Paradigm</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Associative spatial-temporal proximity matching.</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20">Abductive causal hypothesis testing &amp; physics simulation.</td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">Trajectory Modeling</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Deterministic Lagrangian single-track drift.</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20">Monte Carlo ensemble perturbation (200–500 iterations).</td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">Evidence Paradigm</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Confirmatory correlation score (0–100%).</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20">Dual-ledger: Explicit Supporting vs. Contradictory evidence.</td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">AIS Reliability Handling</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Blackout/Dark detection flagged as gaps.</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20">Kinematic Spoofing Engine (physics-violating jump detection).</td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">Forward Projection</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Historical observation tracking only.</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20">+6h to +48h forward coastal &amp; ecological impact forecasting.</td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">Auditability / Provenance</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Platform database records.</td>
                    <td className="p-3 font-bold text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20">Cryptographic SHA-256 chain-of-custody case dossier.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 4: PRIORITY IMPLEMENTATION MATRIX */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-600 rounded-full" />
              4. PRIORITY IMPLEMENTATION MATRIX
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-rose-50/80 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-600 text-white font-mono uppercase">MUST BUILD</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Multi-Hypothesis Engine</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Solves Novelty (eliminates commodity ranking).</p>
              </div>

              <div className="bg-rose-50/80 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-600 text-white font-mono uppercase">MUST BUILD</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Monte Carlo Counterfactuals</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Transforms simulation into rigorous physics testing.</p>
              </div>

              <div className="bg-rose-50/80 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-600 text-white font-mono uppercase">MUST BUILD</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Forward Impact Trajectory</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Directly targets the 6/10 Impact evaluator gap.</p>
              </div>

              <div className="bg-amber-50/80 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-600 text-white font-mono uppercase">HIGH VALUE</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Negative Evidence Ledger</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Demonstrates investigator-grade neutrality.</p>
              </div>

              <div className="bg-amber-50/80 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-600 text-white font-mono uppercase">HIGH VALUE</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Forensic Provenance (SHA-256)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Secures defense agency &amp; NTRO interest.</p>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 opacity-75">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-500 text-white font-mono uppercase">DEPAY</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">LLM Copilot / Generic NLP</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Judges view simple LLM wrappers as novelty negative.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 rounded-b-3xl flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">
            SLICKTRACE 2.0 • Forensic Maritime Digital Twin
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 transition-all"
          >
            Close Benchmark Reference
          </button>
        </div>

      </div>
    </div>
  );
};
