import React from 'react';
import { Activity, ShieldCheck, Cpu, Settings, Bug, Stethoscope, RefreshCw } from 'lucide-react';
import { ESICalculationResult } from '../types/clinical';
import { PRESET_EMERGENCY_CASES } from '../services/mockDataService';

interface HeaderProps {
  calculatedESI?: ESICalculationResult;
  selectedCaseId: string;
  selectedModel: string;
  isPipelineRunning: boolean;
  onSelectCase: (caseId: string) => void;
  onOpenSettings: () => void;
  onOpenDebugger: () => void;
  onRunTriage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  calculatedESI,
  selectedCaseId,
  selectedModel,
  isPipelineRunning,
  onSelectCase,
  onOpenSettings,
  onOpenDebugger,
  onRunTriage
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Triage Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-950/50">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-mono">PulseGemma</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                EDGE CDS v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Grounded Edge-AI Triage & Decision-Support System</p>
          </div>
        </div>

        {/* ESI Status Badge & Controls */}
        <div className="flex items-center flex-wrap gap-3">
          
          {/* ESI Badge Display */}
          {calculatedESI && (
            <div 
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border shadow-sm"
              style={{
                backgroundColor: `${calculatedESI.color}15`,
                borderColor: `${calculatedESI.color}40`,
                color: calculatedESI.color
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ESI LEVEL {calculatedESI.esiLevel}: {calculatedESI.levelName.toUpperCase()}</span>
            </div>
          )}

          {/* Preset Emergency Case Loader */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <Stethoscope className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={selectedCaseId}
              onChange={(e) => onSelectCase(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none pr-2 cursor-pointer"
            >
              {PRESET_EMERGENCY_CASES.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Model & Connection Badge */}
          <button
            onClick={onOpenSettings}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
            title="Configure Ollama Model & Endpoint"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>{selectedModel}</span>
            <Settings className="w-3 h-3 text-slate-400 ml-1" />
          </button>

          {/* Debugger Button */}
          <button
            onClick={onOpenDebugger}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
            title="Open Pipeline Debugger Drawer"
          >
            <Bug className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Trace Log</span>
          </button>

          {/* Run Triage Pipeline Action */}
          <button
            onClick={onRunTriage}
            disabled={isPipelineRunning}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-rose-900/30 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPipelineRunning ? 'animate-spin' : ''}`} />
            <span>{isPipelineRunning ? 'Running Triage...' : 'Execute Triage'}</span>
          </button>

        </div>
      </div>
    </header>
  );
};
