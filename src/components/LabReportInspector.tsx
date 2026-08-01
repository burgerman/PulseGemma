import React, { useState } from 'react';
import { TestTube2, AlertTriangle, CheckCircle2, Plus, Filter } from 'lucide-react';
import { EvaluatedLabResult, LabCategory } from '../types/clinical';

interface LabReportInspectorProps {
  labAlerts: readonly EvaluatedLabResult[];
  onUpdateLabValue: (testId: string, val: number) => void;
}

export const LabReportInspector: React.FC<LabReportInspectorProps> = ({
  labAlerts,
  onUpdateLabValue
}) => {
  const [editingTestId, setEditingTestId] = useState<string>('TROPONIN_I');
  const [newValueInput, setNewValueInput] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<LabCategory | 'ALL'>('ALL');

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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
      
      {/* Header & Quick Value Adder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <TestTube2 className="w-5 h-5 text-rose-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Biomarker Panel & Reference Range Inspector
          </h2>
        </div>

        {/* Quick Value Adder Form */}
        <form onSubmit={handleAddOrUpdate} className="flex items-center gap-2">
          <select
            value={editingTestId}
            onChange={(e) => setEditingTestId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-mono focus:outline-none"
          >
            <option value="TROPONIN_I">Troponin I</option>
            <option value="POTASSIUM">Potassium (K+)</option>
            <option value="LACTATE">Lactate</option>
            <option value="GLUCOSE">Glucose</option>
            <option value="WBC">WBC Count</option>
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
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-rose-400 flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Set
          </button>
        </form>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-[11px]">
        <span className="text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3 text-slate-400" /> Category:
        </span>
        {(['ALL', 'CARDIAC', 'METABOLIC', 'BLOOD_GAS', 'HEMATOLOGY'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-2.5 py-0.5 rounded-md font-semibold transition cursor-pointer border ${
              activeCategoryFilter === cat
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lab Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
              <th className="py-2 px-2">Biomarker / Test</th>
              <th className="py-2 px-2">Measured Value</th>
              <th className="py-2 px-2">Reference Range</th>
              <th className="py-2 px-2">0ms Safety Status</th>
              <th className="py-2 px-2 w-32">Range Position</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredLabs.map((lab) => {
              const isCritical = lab.isCritical;
              const isAbnormal = lab.status !== 'NORMAL';

              return (
                <tr 
                  key={lab.testId} 
                  className={`hover:bg-slate-800/40 transition ${
                    isCritical ? 'bg-rose-950/20' : isAbnormal ? 'bg-amber-950/10' : ''
                  }`}
                >
                  <td className="py-2.5 px-2 font-medium text-white">
                    {lab.testName}
                  </td>

                  <td className="py-2.5 px-2 font-bold text-slate-100">
                    {lab.value} <span className="text-[10px] text-slate-400">{lab.unit}</span>
                  </td>

                  <td className="py-2.5 px-2 text-slate-400 text-[11px]">
                    {lab.referenceMin} - {lab.referenceMax} {lab.unit}
                  </td>

                  <td className="py-2.5 px-2">
                    {lab.status === 'CRITICAL_HIGH' || lab.status === 'CRITICAL_LOW' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 w-fit pulse-critical">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        {lab.status.replace('_', ' ')}
                      </span>
                    ) : lab.status === 'ABNORMAL_HIGH' || lab.status === 'ABNORMAL_LOW' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 w-fit inline-block">
                        ⚠️ {lab.status.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        NORMAL
                      </span>
                    )}
                  </td>

                  {/* Range Position Slider Visualization */}
                  <td className="py-2.5 px-2">
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCritical ? 'bg-rose-500' : isAbnormal ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
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
  );
};
