import React, { useState } from 'react';
import { Cpu, AlertCircle, Bookmark, ClipboardList, CheckCircle, Copy, Check } from 'lucide-react';
import { DifferentialDiagnosis, RecommendedOrder } from '../types/clinical';

interface GemmaDiagnosticCardProps {
  intakeBrief: readonly string[];
  redFlags: readonly string[];
  differentials: readonly DifferentialDiagnosis[];
  recommendedOrders: readonly RecommendedOrder[];
  dischargeNote: string;
  isGrounded: boolean;
  onOpenEvidence: (citationId: string) => void;
}

export const GemmaDiagnosticCard: React.FC<GemmaDiagnosticCardProps> = ({
  intakeBrief,
  redFlags,
  differentials,
  recommendedOrders,
  dischargeNote,
  isGrounded,
  onOpenEvidence
}) => {
  const [copiedEhr, setCopiedEhr] = useState(false);

  const handleCopyEhr = () => {
    const textToCopy = `=== PULSEGEMMA TRIAGE BRIEF ===
Snapshot: ${intakeBrief.join(' ')}
Red Flags: ${redFlags.join('; ')}
Differentials: ${differentials.map(d => `${d.conditionName} (${d.probabilityLevel})`).join(', ')}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedEhr(true);
    setTimeout(() => setCopiedEhr(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-rose-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Grounded Decision Support Synthesis
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy to EHR Action */}
          <button
            onClick={handleCopyEhr}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedEhr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedEhr ? 'Copied EHR' : 'Copy Brief'}</span>
          </button>

          {isGrounded ? (
            <span className="px-2 py-1 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Grounded
            </span>
          ) : (
            <span className="px-2 py-1 text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg">
              ⚠️ Audit
            </span>
          )}
        </div>
      </div>

      {/* 5-Second Clinical Intake Brief */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Bookmark className="w-4 h-4 text-rose-400" />
          <span>5-Second Clinical Intake Snapshot</span>
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-200 font-sans">
          {intakeBrief.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-rose-400 font-mono font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency Red Flags */}
      {redFlags.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3 space-y-2">
          <h3 className="text-xs font-bold text-rose-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Emergency Red Flag Alerts</span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {redFlags.map((rf, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-200 text-xs font-semibold border border-rose-500/40">
                🚨 {rf}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grounded Differential Diagnostic Rationales */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-sky-400" />
          <span>Evidence-Backed Differential Diagnostics</span>
        </h3>

        <div className="space-y-2">
          {differentials.map((diff, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">{diff.conditionName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  diff.probabilityLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {diff.probabilityLevel} SUSPICION
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">{diff.clinicalRationale}</p>

              {/* Clickable Ground-Truth Citations */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-900">
                <span className="text-[10px] text-slate-500 font-mono">CPG Evidence:</span>
                {diff.citationIds.map((cid, cidx) => (
                  <button
                    key={cidx}
                    onClick={() => onOpenEvidence(cid)}
                    className="px-2.5 py-0.5 rounded-md bg-sky-500/15 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-[10px] font-mono transition cursor-pointer"
                  >
                    🔗 [{cid}]
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Immediate Protocol Orders */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
          Recommended Stat Protocol Orders
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recommendedOrders.map((ord, idx) => (
            <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{ord.orderName}</span>
                <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                  {ord.urgency}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{ord.reasoning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Multilingual Patient Discharge Instruction */}
      {dischargeNote && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Native Language Patient Instructions
          </span>
          <p className="text-xs text-slate-300 italic">{dischargeNote}</p>
        </div>
      )}

    </div>
  );
};
