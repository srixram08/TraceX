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
    <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-lg shadow-purple-900/5 space-y-4 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 flex items-center justify-center font-bold border border-purple-200/60 shadow-xs">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900 font-sans">
              EXPLAINABLE AI (XAI)
            </h3>
            <p className="text-[11px] font-mono text-slate-500 font-medium">
              Forensic Attribution Rationale
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-extrabold px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-200/80">
          High Confidence
        </span>
      </div>

      {/* Target Vessel Rationale Card */}
      <div className="bg-gradient-to-r from-purple-50/90 to-indigo-50/70 p-4 rounded-2xl border border-purple-100 shadow-2xs">
        <span className="text-[10px] font-mono text-purple-700 uppercase font-extrabold tracking-wider block mb-1">
          DECISION SUPPORT REASONING
        </span>
        <h4 className="text-sm font-extrabold text-slate-900 font-sans">
          Why {vessel.name} Ranked #{vessel.rank}
        </h4>
        <p className="text-xs text-slate-600 font-mono mt-1">
          Overall Attributed Score: <strong className="text-purple-700 font-extrabold">{vessel.score.overall}%</strong>
        </p>
      </div>

      {/* Deductive Insights List with High-Contrast Dark Text */}
      <div className="space-y-3 pt-1">
        {vessel.explainableInsights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs font-mono text-slate-800 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{insight}</span>
          </div>
        ))}
      </div>

      {/* Legal Constraint Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs font-mono text-amber-950 space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
          <Scale className="w-4 h-4 text-amber-700 shrink-0" />
          <span>IMPORTANT LEGAL CONSTRAINT</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-700">
          TraceX is a maritime forensic decision-support system. A candidate ranking is investigative evidence, not a unilateral declaration of legal liability. Final conclusions remain with authorized human investigators.
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-500 text-[11px] font-medium">Model: Multi-Vector Bayesian Fusion</span>
        <button
          onClick={onOpenReport}
          className="text-purple-700 font-extrabold hover:text-purple-900 transition-colors flex items-center gap-1.5 text-[11px]"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Audit Report</span>
        </button>
      </div>

    </div>
  );
};
