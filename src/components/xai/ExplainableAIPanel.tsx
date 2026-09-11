import React from 'react';
import { Sparkles, CheckCircle2, FileText, Scale } from 'lucide-react';
import { Vessel, Incident } from '../../types';

interface ExplainableAIPanelProps {
  vessel: Vessel;
  incident: Incident;
  onOpenReport: () => void;
}

export const ExplainableAIPanel: React.FC<ExplainableAIPanelProps> = ({
  vessel,
  incident,
  onOpenReport,
}) => {
  return (
    <div className="bg-[#040e16]/95 backdrop-blur-md p-6 rounded-3xl border border-[#0e3344] shadow-2xl space-y-4 font-sans text-slate-100 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#0f3243]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-300 flex items-center justify-center font-bold border border-purple-500/40 shadow-xs">
            <Sparkles className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-white font-sans">
              EXPLAINABLE AI (XAI)
            </h3>
            <p className="text-[11px] font-mono text-cyan-300/70 font-medium">
              Forensic Attribution Rationale
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-extrabold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
          High Confidence
        </span>
      </div>

      {/* Target Vessel Rationale Card */}
      <div className="bg-[#061824] p-4 rounded-2xl border border-[#133c50] shadow-md">
        <span className="text-[10px] font-mono text-purple-400 uppercase font-extrabold tracking-wider block mb-1">
          DECISION SUPPORT REASONING
        </span>
        <h4 className="text-sm font-extrabold text-white font-sans">
          Why {vessel.name} Ranked #{vessel.rank}
        </h4>
        <p className="text-xs font-mono text-slate-300 mt-1">
          Overall Attributed Score: <strong className="text-emerald-400 font-extrabold">{vessel.score.overall}%</strong>
        </p>
      </div>

      {/* Deductive Insights List */}
      <div className="space-y-2.5 pt-1">
        {vessel.explainableInsights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs font-mono text-slate-200 bg-[#061824] p-3 rounded-xl border border-[#133c50]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{insight}</span>
          </div>
        ))}
      </div>

      {/* Legal Constraint Notice */}
      <div className="p-4 rounded-2xl bg-[#1c1406] border border-amber-800/60 text-xs font-mono text-amber-200 space-y-1.5 shadow-md">
        <div className="flex items-center gap-2 font-bold text-amber-300 text-xs">
          <Scale className="w-4 h-4 text-amber-400 shrink-0" />
          <span>IMPORTANT LEGAL CONSTRAINT</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-300">
          TraceX is a maritime forensic decision-support system. A candidate ranking is investigative evidence, not a unilateral declaration of legal liability. Final conclusions remain with authorized human investigators.
        </p>
      </div>

      <div className="pt-3 border-t border-[#0f3243] flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 text-[11px] font-medium">Model: Multi-Vector Bayesian Fusion</span>
        <button
          onClick={onOpenReport}
          className="text-purple-400 font-extrabold hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-[11px]"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Audit Report</span>
        </button>
      </div>

    </div>
  );
};
