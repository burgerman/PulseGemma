import React from 'react';
import { ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { EvaluatedLabResult } from '../types/clinical';

interface DeterministicBannerProps {
  esiResult?: unknown;
  labAlerts: readonly EvaluatedLabResult[];
  qSofaScore: number;
}

export const DeterministicBanner: React.FC<DeterministicBannerProps> = ({
  labAlerts,
  qSofaScore
}) => {
  const criticalCount = labAlerts.filter(l => l.isCritical).length;
  const abnormalCount = labAlerts.filter(l => !l.isCritical && l.status !== 'NORMAL').length;

  return (
    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              100% Deterministic Safety Engine Active
            </span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
              0ms Latency • 0% Model Guesswork
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Numerical thresholds and ESI triage logic are computed strictly by client TypeScript code before LLM synthesis.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono self-end md:self-auto">
        <div className="flex items-center gap-1.5 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Labs Checked: <strong>{labAlerts.length}</strong></span>
        </div>
        {criticalCount > 0 && (
          <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold">
            🔴 {criticalCount} Critical Panic
          </span>
        )}
        {abnormalCount > 0 && (
          <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold">
            🟡 {abnormalCount} Abnormal
          </span>
        )}
        {qSofaScore >= 2 && (
          <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-400" />
            qSOFA: {qSofaScore}/3
          </span>
        )}
      </div>
    </div>
  );
};
