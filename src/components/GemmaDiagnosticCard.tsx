import React from 'react';
import { Cpu, AlertCircle, Bookmark, ClipboardList, CheckCircle } from 'lucide-react';
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
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-rose-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Grounded Edge-AI Decision Support Synthesis
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {isGrounded ? (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Grounded Evidence Verified
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded">
              ⚠️ Audit Required
            </span>
          )}
        </div>
      </div>

      {/* 5-Second Clinical Intake Brief */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Bookmark className="w-4 h-4 text-rose-400" />
          <span>5-Second Clinical Intake Snapshot</span>
        </h3>
        <ul className="space-y-1 text-xs text-slate-200 font-sans">
          {intakeBrief.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-rose-400 font-mono">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Emergency Red Flags */}
      {redFlags.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-lg p-3 space-y-2">
          <h3 className="text-xs font-bold text-rose-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Emergency Red Flag Alerts</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {redFlags.map((rf, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-200 text-xs font-semibold border border-rose-500/40">
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
          <span>Evidence-Backed Differential Diagnostic Support</span>
        </h3>

        <div className="space-y-2">
          {differentials.map((diff, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">{diff.conditionName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  diff.probabilityLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {diff.probabilityLevel} SUSPICION
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans">{diff.clinicalRationale}</p>

              {/* Clickable Ground-Truth Citations */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-mono">CPG Evidence:</span>
                {diff.citationIds.map((cid, cidx) => (
                  <button
                    key={cidx}
                    onClick={() => onOpenEvidence(cid)}
                    className="px-2 py-0.5 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-[10px] font-mono transition cursor-pointer"
                  >
                    🔗 [{cid}]
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Immediate Clinical Protocol Orders */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
          Recommended Stat Clinical Protocol Orders
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recommendedOrders.map((ord, idx) => (
            <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
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

      {/* Multilingual Patient Discharge / Waiting Room Note */}
      {dischargeNote && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Native Language Patient Instructions
          </span>
          <p className="text-xs text-slate-300 italic">{dischargeNote}</p>
        </div>
      )}

    </div>
  );
};
