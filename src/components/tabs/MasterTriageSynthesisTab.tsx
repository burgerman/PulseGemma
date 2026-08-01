import React, { useState } from 'react';
import { AlertCircle, Bookmark, ClipboardList, CheckCircle, Copy, Check, ShieldCheck, Stethoscope } from 'lucide-react';
import { DifferentialDiagnosis, RecommendedOrder, ESICalculationResult } from '../../types/clinical';

interface MasterTriageSynthesisTabProps {
  intakeBrief: readonly string[];
  redFlags: readonly string[];
  differentials: readonly DifferentialDiagnosis[];
  recommendedOrders: readonly RecommendedOrder[];
  dischargeNote: string;
  isGrounded: boolean;
  esiResult?: ESICalculationResult;
  onOpenEvidence: (citationId: string) => void;
}

export const MasterTriageSynthesisTab: React.FC<MasterTriageSynthesisTabProps> = ({
  intakeBrief,
  redFlags,
  differentials,
  recommendedOrders,
  dischargeNote,
  isGrounded,
  esiResult,
  onOpenEvidence
}) => {
  const [copiedEhr, setCopiedEhr] = useState(false);

  const handleCopyEhr = () => {
    const textToCopy = `=== PULSEGEMMA TRIAGE BRIEF ===
ESI Level: ESI-${esiResult?.esiLevel || 2} (${esiResult?.levelName || 'Emergent'})
Snapshot: ${intakeBrief.join(' ')}
Red Flags: ${redFlags.join('; ')}
Differentials: ${differentials.map(d => `${d.conditionName} (${d.probabilityLevel})`).join(', ')}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedEhr(true);
    setTimeout(() => setCopiedEhr(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">Master Triage Synthesis & Decision Brief</h2>
            <p className="text-xs text-slate-400">5-second intake snapshot, grounded differentials, & EHR export</p>
          </div>
        </div>

        <button
          onClick={handleCopyEhr}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
        >
          {copiedEhr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copiedEhr ? 'Copied' : 'Copy Brief'}</span>
        </button>
      </div>

      {/* ESI Classification Card */}
      {esiResult && (
        <div 
          className="p-3.5 rounded-xl border flex items-center justify-between shadow-md"
          style={{
            backgroundColor: `${esiResult.color}15`,
            borderColor: `${esiResult.color}40`
          }}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5" style={{ color: esiResult.color }} />
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: esiResult.color }}>
                Calculated ESI Level {esiResult.esiLevel}: {esiResult.levelName}
              </span>
              <p className="text-xs text-slate-300 font-sans mt-0.5">{esiResult.decisionRationale}</p>
            </div>
          </div>
        </div>
      )}

      {/* 5-Second Intake Brief */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-lg">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <Bookmark className="w-3.5 h-3.5 text-rose-400" />
          <span>5-Second Clinical Intake Brief</span>
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-200 font-sans">
          {intakeBrief.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-rose-400 font-mono font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Red Flags */}
      {redFlags.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3 space-y-2">
          <h3 className="text-xs font-bold text-rose-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-400" />
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

      {/* Grounded Differential Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5 text-sky-400" />
            <span>Evidence-Backed Differential Diagnostics</span>
          </h3>

          {isGrounded ? (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Grounded
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded">
              ⚠️ Audit
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {differentials.map((diff, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">{diff.conditionName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  diff.probabilityLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {diff.probabilityLevel} SUSPICION
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">{diff.clinicalRationale}</p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-mono">CPG:</span>
                {diff.citationIds.map((cid, cidx) => (
                  <button
                    key={cidx}
                    onClick={() => onOpenEvidence(cid)}
                    className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 text-[10px] font-mono transition cursor-pointer"
                  >
                    🔗 [{cid}]
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Stat Orders */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-lg">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
          Stat Protocol Orders
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recommendedOrders.map((ord, idx) => (
            <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{ord.orderName}</span>
                <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                  {ord.urgency}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{ord.reasoning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Native Language Patient Note */}
      {dischargeNote && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Native Language Patient Instructions
          </span>
          <p className="text-xs text-slate-300 italic">{dischargeNote}</p>
        </div>
      )}

    </div>
  );
};
