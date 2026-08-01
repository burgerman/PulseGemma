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
      
      {/* Feature Title Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span>Master Triage Synthesis & EHR Export</span>
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-sans">
                  Decision Support Card
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Grounded clinical brief, ESI decision tree classification, differential diagnostics, and stat orders.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyEhr}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-slate-200 flex items-center gap-2 transition cursor-pointer shadow-md"
          >
            {copiedEhr ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copiedEhr ? 'Copied Brief' : 'Copy Brief to EHR'}</span>
          </button>
        </div>
      </div>

      {/* ESI Decision Tree Result Card */}
      {esiResult && (
        <div 
          className="p-4 rounded-2xl border flex items-center justify-between shadow-lg"
          style={{
            backgroundColor: `${esiResult.color}15`,
            borderColor: `${esiResult.color}40`
          }}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6" style={{ color: esiResult.color }} />
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: esiResult.color }}>
                Calculated ESI Level {esiResult.esiLevel}: {esiResult.levelName}
              </span>
              <p className="text-xs text-slate-300 mt-0.5 font-sans">{esiResult.decisionRationale}</p>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400">Rule: {esiResult.ruleId}</span>
        </div>
      )}

      {/* 5-Second Clinical Intake Brief */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bookmark className="w-4 h-4 text-rose-400" />
          <span>5-Second Clinical Intake Brief</span>
        </h3>
        <ul className="space-y-2 text-xs text-slate-200 font-sans">
          {intakeBrief.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-rose-400 font-mono font-bold text-sm">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency Red Flags */}
      {redFlags.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4 space-y-2.5 shadow-lg">
          <h3 className="text-xs font-bold text-rose-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Emergency Red Flag Alerts</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {redFlags.map((rf, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-200 text-xs font-bold border border-rose-500/40">
                🚨 {rf}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grounded Differential Diagnostic Rationales */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-sky-400" />
            <span>Evidence-Backed Differential Diagnostics</span>
          </h3>

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

        <div className="space-y-3">
          {differentials.map((diff, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono text-sm">{diff.conditionName}</span>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                  diff.probabilityLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {diff.probabilityLevel} SUSPICION
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">{diff.clinicalRationale}</p>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-900">
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-3">
          Recommended Stat Protocol Orders
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendedOrders.map((ord, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
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

      {/* Multilingual Discharge Instructions */}
      {dischargeNote && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Native Language Patient Instructions
          </span>
          <p className="text-xs text-slate-300 italic">{dischargeNote}</p>
        </div>
      )}

    </div>
  );
};
