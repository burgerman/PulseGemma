import React, { useState } from 'react';
import { ShieldCheck, Heart, Thermometer, Activity, TestTube2, AlertTriangle, CheckCircle2, Plus, Filter, Zap } from 'lucide-react';
import { PatientVitals, EvaluatedLabResult, LabCategory, ESICalculationResult } from '../../types/clinical';

interface DeterministicLabTabProps {
  vitals: PatientVitals;
  labAlerts: readonly EvaluatedLabResult[];
  esiResult?: ESICalculationResult;
  qSofaScore: number;
  wellsScore: number;
  drugAlerts: readonly string[];
  onUpdateVitals: (vitals: PatientVitals) => void;
  onUpdateLabValue: (testId: string, val: number) => void;
}

export const DeterministicLabTab: React.FC<DeterministicLabTabProps> = ({
  vitals,
  labAlerts,
  esiResult,
  qSofaScore,
  wellsScore,
  drugAlerts,
  onUpdateVitals,
  onUpdateLabValue
}) => {
  const [editingTestId, setEditingTestId] = useState<string>('TROPONIN_I');
  const [newValueInput, setNewValueInput] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<LabCategory | 'ALL'>('ALL');

  const handleVitalChange = (key: keyof PatientVitals, value: number) => {
    onUpdateVitals({
      ...vitals,
      [key]: value
    });
  };

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newValueInput);
    if (!isNaN(val)) {
      onUpdateLabValue(editingTestId, val);
      setNewValueInput('');
    }
  };

  const filteredLabs = activeCategoryFilter === 'ALL'
    ? labAlerts
    : labAlerts.filter(l => l.category === activeCategoryFilter);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">Deterministic Range Checker & Rules</h2>
            <p className="text-xs text-slate-400">0ms client calculation • 0% model guesswork</p>
          </div>
        </div>

        {esiResult && (
          <span 
            className="px-3 py-1 rounded-lg text-xs font-black font-mono border"
            style={{
              backgroundColor: `${esiResult.color}15`,
              borderColor: `${esiResult.color}40`,
              color: esiResult.color
            }}
          >
            ESI LEVEL {esiResult.esiLevel}
          </span>
        )}
      </div>

      {/* Vital Signs Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Vital Signs & Risk Scores</span>
          </h3>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-400" /> qSOFA: {qSofaScore}/3
            </span>
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
              Wells: {wellsScore}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* Heart Rate */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <Heart className="w-3 h-3 text-rose-400" /> HR
            </span>
            <input
              type="number"
              value={vitals.heartRate}
              onChange={(e) => handleVitalChange('heartRate', Number(e.target.value))}
              className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none text-right"
            />
          </div>

          {/* Blood Pressure */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <Activity className="w-3 h-3 text-amber-400" /> BP
            </span>
            <div className="flex items-center justify-end font-mono text-xs font-bold text-white">
              <input
                type="number"
                value={vitals.systolicBP}
                onChange={(e) => handleVitalChange('systolicBP', Number(e.target.value))}
                className="bg-transparent w-8 text-right focus:outline-none"
              />
              <span>/</span>
              <input
                type="number"
                value={vitals.diastolicBP}
                onChange={(e) => handleVitalChange('diastolicBP', Number(e.target.value))}
                className="bg-transparent w-8 focus:outline-none"
              />
            </div>
          </div>

          {/* SpO2 */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <Activity className="w-3 h-3 text-sky-400" /> SpO2
            </span>
            <input
              type="number"
              value={vitals.oxygenSaturation}
              onChange={(e) => handleVitalChange('oxygenSaturation', Number(e.target.value))}
              className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none text-right"
            />
          </div>

          {/* Temp */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <Thermometer className="w-3 h-3 text-orange-400" /> Temp
            </span>
            <input
              type="number"
              step="0.1"
              value={vitals.temperature}
              onChange={(e) => handleVitalChange('temperature', Number(e.target.value))}
              className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none text-right"
            />
          </div>

          {/* RR */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <Activity className="w-3 h-3 text-purple-400" /> RR
            </span>
            <input
              type="number"
              value={vitals.respiratoryRate}
              onChange={(e) => handleVitalChange('respiratoryRate', Number(e.target.value))}
              className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none text-right"
            />
          </div>

          {/* Pain */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <Activity className="w-3 h-3 text-rose-500" /> Pain
            </span>
            <input
              type="number"
              min="0"
              max="10"
              value={vitals.painScore}
              onChange={(e) => handleVitalChange('painScore', Number(e.target.value))}
              className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none text-right"
            />
          </div>
        </div>
      </div>

      {/* Drug Interaction Alerts */}
      {drugAlerts.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-3 space-y-1">
          {drugAlerts.map((da, idx) => (
            <p key={idx} className="text-xs text-rose-200 font-mono">⚠️ {da}</p>
          ))}
        </div>
      )}

      {/* Lab Results Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <TestTube2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Biomarker Panel
            </h3>
          </div>

          <form onSubmit={handleAddOrUpdate} className="flex items-center gap-2">
            <select
              value={editingTestId}
              onChange={(e) => setEditingTestId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-mono focus:outline-none"
            >
              <option value="TROPONIN_I">Troponin I</option>
              <option value="POTASSIUM">Potassium</option>
              <option value="LACTATE">Lactate</option>
              <option value="GLUCOSE">Glucose</option>
              <option value="WBC">WBC</option>
              <option value="D_DIMER">D-Dimer</option>
              <option value="PH">Arterial pH</option>
            </select>

            <input
              type="number"
              step="0.01"
              placeholder="Val"
              value={newValueInput}
              onChange={(e) => setNewValueInput(e.target.value)}
              className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none"
            />

            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-emerald-400 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> Filter:
          </span>
          {(['ALL', 'CARDIAC', 'METABOLIC', 'BLOOD_GAS', 'HEMATOLOGY'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2 py-0.5 rounded font-semibold cursor-pointer border ${
                activeCategoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2 px-2">Biomarker</th>
                <th className="py-2 px-2">Measured</th>
                <th className="py-2 px-2">Normal Range</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2 w-28">Deviation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLabs.map((lab) => {
                const isCritical = lab.isCritical;
                const isAbnormal = lab.status !== 'NORMAL';

                return (
                  <tr key={lab.testId} className={isCritical ? 'bg-rose-950/20' : isAbnormal ? 'bg-amber-950/10' : ''}>
                    <td className="py-2 px-2 font-bold text-white">{lab.testName}</td>
                    <td className="py-2 px-2 font-bold">{lab.value} <span className="text-[10px] text-slate-400">{lab.unit}</span></td>
                    <td className="py-2 px-2 text-slate-400">{lab.referenceMin} - {lab.referenceMax}</td>
                    <td className="py-2 px-2">
                      {isCritical ? (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> CRITICAL
                        </span>
                      ) : isAbnormal ? (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded w-fit inline-block">
                          ABNORMAL
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> NORMAL
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : isAbnormal ? 'bg-amber-400' : 'bg-emerald-500'}`}
                          style={{ width: `${lab.deviationPercentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
