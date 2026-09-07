import React from 'react';
import { ShieldCheck, Lock, Key, Copy, ExternalLink, Hash, Database, Cpu } from 'lucide-react';
import { CryptographicProvenance } from '../../types';

interface CryptographicProvenanceBadgeProps {
  provenance?: CryptographicProvenance;
}

export const CryptographicProvenanceBadge: React.FC<CryptographicProvenanceBadgeProps> = ({ provenance }) => {
  if (!provenance) return null;

  return (
    <div className="bg-slate-900 text-slate-100 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-purple-300 tracking-wider flex items-center gap-2">
              Cryptographic Forensic Chain of Custody
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                COURT ADMISSIBLE
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-sans font-medium">
              Merkle Tree audit envelope hash for 100% bit-for-bit legal reproduction in tribunal proceedings.
            </p>
          </div>
        </div>

        <a
          href={provenance.blockchainVerificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 text-[11px] font-bold transition-all"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verify Merkle Root</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* HASH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
        
        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
            <Hash className="w-3 h-3 text-indigo-400" />
            Raw SAR Scene Hash (SHA-256)
          </span>
          <div className="text-slate-300 break-all font-mono font-medium bg-slate-900 px-2 py-1 rounded border border-slate-800">
            {provenance.sarSceneHashSHA256}
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
            <Database className="w-3 h-3 text-blue-400" />
            AIS Telemetry Ingestion Hash
          </span>
          <div className="text-slate-300 break-all font-mono font-medium bg-slate-900 px-2 py-1 rounded border border-slate-800">
            {provenance.aisIngestionHashSHA256}
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
            <Cpu className="w-3 h-3 text-purple-400" />
            Oceanic HYCOM/ERA5 Data Slice Hash
          </span>
          <div className="text-slate-300 break-all font-mono font-medium bg-slate-900 px-2 py-1 rounded border border-slate-800">
            {provenance.oceanicModelSliceHash}
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
            <Key className="w-3 h-3 text-emerald-400" />
            Merkle Root Hash (NTRO Seal)
          </span>
          <div className="text-emerald-400 break-all font-mono font-bold bg-slate-900 px-2 py-1 rounded border border-emerald-900/60">
            {provenance.merkleRootHash}
          </div>
        </div>

      </div>

    </div>
  );
};
