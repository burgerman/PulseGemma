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
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 font-sans">Lab Rules & Ranges</h2>
            <p className="text-xs text-slate-400">Panic limits & risk scores</p>
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
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Vital Signs & Risk Scores</span>
          </h3>

          <div className="flex items-center gap-2 text-xs font-sans">
            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-500" /> qSOFA: {qSofaScore}/3
            </span>
            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-bold">
              Wells: {wellsScore}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* Heart Rate */}
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-sans font-medium">
              <Heart className="w-3 h-3 text-red-500" /> HR
            </span>
            <input
              type="number"
              value={vitals.heartRate}
              onChange={(e) => handleVitalChange('heartRate', Number(e.target.value))}
              className="bg-transparent text-xs font-sans font-bold text-slate-800 focus:outline-none text-right"
            />
          </div>

          {/* Blood Pressure */}
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-sans font-medium">
              <Activity className="w-3 h-3 text-amber-500" /> BP
            </span>
            <div className="flex items-center justify-end font-sans text-xs font-bold text-slate-800">
              <input
                type="number"
                value={vitals.systolicBP}
                onChange={(e) => handleVitalChange('systolicBP', Number(e.target.value))}
                className="bg-transparent w-8 text-right focus:outline-none"
              />
              <span className="text-slate-400">/</span>
              <input
                type="number"
                value={vitals.diastolicBP}
                onChange={(e) => handleVitalChange('diastolicBP', Number(e.target.value))}
                className="bg-transparent w-8 focus:outline-none"
              />
            </div>
          </div>

          {/* SpO2 */}
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-sans font-medium">
              <Activity className="w-3 h-3 text-sky-500" /> SpO2
            </span>
            <input
              type="number"
              value={vitals.oxygenSaturation}
              onChange={(e) => handleVitalChange('oxygenSaturation', Number(e.target.value))}
              className="bg-transparent text-xs font-sans font-bold text-slate-800 focus:outline-none text-right"
            />
          </div>

          {/* Temp */}
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-sans font-medium">
              <Thermometer className="w-3 h-3 text-orange-500" /> Temp
            </span>
            <input
              type="number"
              step="0.1"
              value={vitals.temperature}
              onChange={(e) => handleVitalChange('temperature', Number(e.target.value))}
              className="bg-transparent text-xs font-sans font-bold text-slate-800 focus:outline-none text-right"
            />
          </div>

          {/* RR */}
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-sans font-medium">
              <Activity className="w-3 h-3 text-purple-500" /> RR
            </span>
            <input
              type="number"
              value={vitals.respiratoryRate}
              onChange={(e) => handleVitalChange('respiratoryRate', Number(e.target.value))}
              className="bg-transparent text-xs font-sans font-bold text-slate-800 focus:outline-none text-right"
            />
          </div>

          {/* Pain */}
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-sans font-medium">
              <Activity className="w-3 h-3 text-red-600" /> Pain
            </span>
            <input
              type="number"
              min="0"
              max="10"
              value={vitals.painScore}
              onChange={(e) => handleVitalChange('painScore', Number(e.target.value))}
              className="bg-transparent text-xs font-sans font-bold text-slate-800 focus:outline-none text-right"
            />
          </div>
        </div>
      </div>

      {/* Drug Interaction Alerts */}
      {drugAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1">
          {drugAlerts.map((da, idx) => (
            <p key={idx} className="text-xs text-red-700 font-sans font-medium">⚠️ {da}</p>
          ))}
        </div>
      )}

      {/* Lab Results Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <TestTube2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
              Biomarker Panel
            </h3>
          </div>

          <form onSubmit={handleAddOrUpdate} className="flex items-center gap-2">
            <select
              value={editingTestId}
              onChange={(e) => setEditingTestId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-sans focus:outline-none"
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
              className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-emerald-600 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 font-sans text-[11px]">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> Filter:
          </span>
          {(['ALL', 'CARDIAC', 'METABOLIC', 'BLOOD_GAS', 'HEMATOLOGY'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2 py-0.5 rounded font-semibold cursor-pointer border ${
                activeCategoryFilter === cat
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="py-2 px-2">Biomarker</th>
                <th className="py-2 px-2">Measured</th>
                <th className="py-2 px-2">Normal Range</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2 w-28">Deviation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLabs.map((lab) => {
                const isCritical = lab.isCritical;
                const isAbnormal = lab.status !== 'NORMAL';

                return (
                  <tr key={lab.testId} className={isCritical ? 'bg-red-50' : isAbnormal ? 'bg-amber-50' : ''}>
                    <td className="py-2 px-2 font-bold text-slate-800">{lab.testName}</td>
                    <td className="py-2 px-2 font-bold text-slate-800">{lab.value} <span className="text-[10px] text-slate-500 font-normal">{lab.unit}</span></td>
                    <td className="py-2 px-2 text-slate-500">{lab.referenceMin} - {lab.referenceMax}</td>
                    <td className="py-2 px-2">
                      {isCritical ? (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 rounded flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> CRITICAL
                        </span>
                      ) : isAbnormal ? (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 rounded w-fit inline-block">
                          ABNORMAL
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> NORMAL
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-300">
                        <div 
                          className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isAbnormal ? 'bg-amber-400' : 'bg-emerald-500'}`}
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
