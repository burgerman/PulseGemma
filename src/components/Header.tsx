import React from 'react';
import { Activity, ShieldCheck, Cpu, Settings, Bug, Stethoscope, RefreshCw, LayoutGrid, Eye, Volume2, TestTube } from 'lucide-react';
import { ESICalculationResult } from '../types/clinical';
import { PRESET_EMERGENCY_CASES } from '../services/mockDataService';

interface HeaderProps {
  calculatedESI?: ESICalculationResult;
  selectedCaseId: string;
  selectedModel: string;
  isPipelineRunning: boolean;
  activeViewTab: 'DASHBOARD' | 'INTAKE' | 'VISION' | 'EVIDENCE';
  hasVoiceInput: boolean;
  hasLabsInput: boolean;
  hasVisionInput: boolean;
  onChangeViewTab: (tab: 'DASHBOARD' | 'INTAKE' | 'VISION' | 'EVIDENCE') => void;
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
  activeViewTab,
  hasVoiceInput,
  hasLabsInput,
  hasVisionInput,
  onChangeViewTab,
  onSelectCase,
  onOpenSettings,
  onOpenDebugger,
  onRunTriage
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Top Row: Brand, ESI Badge, Connection & Core Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand & Triage Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/60 ring-2 ring-rose-500/30">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white font-mono">PulseGemma</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  MULTIMODAL EDGE CDS
                </span>
              </div>
              <p className="text-xs text-slate-400">Grounded AI Clinical Triage & Decision Support</p>
            </div>
          </div>

          {/* Multimodal Active Indicators + Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            
            {/* Live Multimodal Payload Status Pills */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-mono">
              <span className={`flex items-center gap-1 ${hasVoiceInput ? 'text-rose-400 font-bold' : 'text-slate-600'}`}>
                <Volume2 className="w-3 h-3" /> Voice
              </span>
              <span className="text-slate-700">•</span>
              <span className={`flex items-center gap-1 ${hasLabsInput ? 'text-emerald-400 font-bold' : 'text-slate-600'}`}>
                <TestTube className="w-3 h-3" /> Labs
              </span>
              <span className="text-slate-700">•</span>
              <span className={`flex items-center gap-1 ${hasVisionInput ? 'text-purple-400 font-bold' : 'text-slate-600'}`}>
                <Eye className="w-3 h-3" /> Vision
              </span>
            </div>

            {/* ESI Badge Display */}
            {calculatedESI && (
              <div 
                className="px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-2 border shadow-md font-mono transition-all"
                style={{
                  backgroundColor: `${calculatedESI.color}20`,
                  borderColor: `${calculatedESI.color}50`,
                  color: calculatedESI.color
                }}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ESI LEVEL {calculatedESI.esiLevel}: {calculatedESI.levelName.toUpperCase()}</span>
              </div>
            )}

            {/* Model Selector Button */}
            <button
              onClick={onOpenSettings}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
              title="Configure Local Ollama Model"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{selectedModel}</span>
              <Settings className="w-3 h-3 text-slate-400" />
            </button>

            {/* Debugger Button */}
            <button
              onClick={onOpenDebugger}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
              title="Pipeline Execution Trace Debugger"
            >
              <Bug className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono">Trace</span>
            </button>

            {/* Execute Triage Pipeline Action */}
            <button
              onClick={onRunTriage}
              disabled={isPipelineRunning}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/50 transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPipelineRunning ? 'animate-spin' : ''}`} />
              <span>{isPipelineRunning ? 'Triaging...' : 'Run Triage'}</span>
            </button>

          </div>

        </div>

        {/* Bottom Row: Quick Emergency Case Preset Pills & Layout Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          
          {/* Preset Emergency Case Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
              <Stethoscope className="w-3.5 h-3.5 text-rose-400" /> Case Presets:
            </span>

            {PRESET_EMERGENCY_CASES.map(c => {
              const isSelected = c.id === selectedCaseId;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCase(c.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium shrink-0 transition cursor-pointer flex items-center gap-1.5 border ${
                    isSelected 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold shadow-sm' 
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{c.title.split('/')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Ergonomic Workspace View Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto shrink-0 font-mono">
            <button
              onClick={() => onChangeViewTab('DASHBOARD')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeViewTab === 'DASHBOARD' 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-rose-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onChangeViewTab('INTAKE')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeViewTab === 'INTAKE' 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Guided Intake</span>
            </button>

            <button
              onClick={() => onChangeViewTab('VISION')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeViewTab === 'VISION' 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>Vision Scanner</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
