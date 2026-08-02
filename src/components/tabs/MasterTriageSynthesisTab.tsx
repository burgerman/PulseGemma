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
    <div className="space-y-4 max-w-4xl mx-auto font-sans">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 font-sans">Master Triage Brief</h2>
            <p className="text-xs text-slate-400">Intake snapshot & differential report</p>
          </div>
        </div>

        <button
          onClick={handleCopyEhr}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          {copiedEhr ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
          <span>{copiedEhr ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* ESI Classification Card */}
      {esiResult && (
        <div 
          className="p-3.5 rounded-xl border flex items-center justify-between shadow-xs bg-white"
          style={{ borderColor: `${esiResult.color}40` }}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5" style={{ color: esiResult.color }} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: esiResult.color }}>
                ESI Level {esiResult.esiLevel}: {esiResult.levelName}
              </span>
              <p className="text-xs text-slate-600 mt-0.5">{esiResult.decisionRationale}</p>
            </div>
          </div>
        </div>
      )}

      {/* Intake Brief */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Bookmark className="w-3.5 h-3.5 text-red-500" />
          <span>Intake Brief</span>
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {intakeBrief.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-red-500 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Red Flags */}
      {redFlags.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
          <h3 className="text-xs font-bold text-red-600 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Red Flags</span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {redFlags.map((rf, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-white text-red-700 text-xs font-semibold border border-red-200 shadow-xs">
                🚨 {rf}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Differential Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-800 tracking-wider flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5 text-sky-500" />
            <span>Differential Diagnostics</span>
          </h3>

          {isGrounded ? (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Grounded
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded">
              ⚠️ Audit
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {differentials.map((diff, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 font-sans">{diff.conditionName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  diff.probabilityLevel === 'HIGH' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-200 text-slate-700'
                }`}>
                  {diff.probabilityLevel}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">{diff.clinicalRationale}</p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400">CPG:</span>
                {diff.citationIds.map((cid, cidx) => (
                  <button
                    key={cidx}
                    onClick={() => onOpenEvidence(cid)}
                    className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 text-[10px] border border-sky-200 transition cursor-pointer hover:bg-sky-100 font-medium"
                  >
                    [{cid}]
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Orders */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 tracking-wider border-b border-slate-100 pb-2">
          Recommended Orders
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recommendedOrders.map((ord, idx) => (
            <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{ord.orderName}</span>
                <span className="text-[9px] font-bold text-red-600 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded">
                  {ord.urgency}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{ord.reasoning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Note */}
      {dischargeNote && (
        <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1 shadow-xs">
          <span className="text-[10px] text-slate-400 block font-medium">
            Patient Instructions
          </span>
          <p className="text-xs text-slate-700 italic">{dischargeNote}</p>
        </div>
      )}

    </div>
  );
};

