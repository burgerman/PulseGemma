import React from 'react';
import { Activity, ShieldCheck, Cpu, Settings, Bug, Stethoscope, RefreshCw, LayoutGrid, Target, Volume2, ShieldAlert, Eye, BookOpen, FileCheck } from 'lucide-react';
import { ESICalculationResult } from '../types/clinical';
import { PRESET_EMERGENCY_CASES } from '../services/mockDataService';

export type FeatureTabKey = 'VOICE_DICTATION' | 'DETERMINISTIC_LABS' | 'MULTIMODAL_VISION' | 'GROUNDED_RAG' | 'TRIAGE_SYNTHESIS';
export type ViewLayoutMode = 'MODULAR_GRID' | 'SINGLE_FOCUS';

interface HeaderProps {
  calculatedESI?: ESICalculationResult;
  selectedCaseId: string;
  selectedModel: string;
  isPipelineRunning: boolean;
  activeFeatureTab: FeatureTabKey;
  layoutMode: ViewLayoutMode;
  visibleModules: Record<FeatureTabKey, boolean>;
  onSelectFeatureTab: (tab: FeatureTabKey) => void;
  onChangeLayoutMode: (mode: ViewLayoutMode) => void;
  onToggleModuleVisibility: (tab: FeatureTabKey) => void;
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
  activeFeatureTab,
  layoutMode,
  visibleModules,
  onSelectFeatureTab,
  onChangeLayoutMode,
  onToggleModuleVisibility,
  onSelectCase,
  onOpenSettings,
  onOpenDebugger,
  onRunTriage
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Top Row: Brand, ESI Badge & System Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/60 ring-2 ring-rose-500/30">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white font-mono">PulseGemma</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-mono">
                  MODULAR EDGE CDS
                </span>
              </div>
              <p className="text-xs text-slate-400">Modular Component-Oriented Clinical Architecture</p>
            </div>
          </div>

          {/* ESI Badge & Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            
            {/* Layout Mode Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono text-xs">
              <button
                onClick={() => onChangeLayoutMode('MODULAR_GRID')}
                className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  layoutMode === 'MODULAR_GRID' 
                    ? 'bg-slate-800 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Modular Multi-Card Dashboard View"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Modular Grid</span>
              </button>

              <button
                onClick={() => onChangeLayoutMode('SINGLE_FOCUS')}
                className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  layoutMode === 'SINGLE_FOCUS' 
                    ? 'bg-slate-800 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Focused Single Feature View"
              >
                <Target className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Single Focus</span>
              </button>
            </div>

            {/* Calculated ESI Badge */}
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
                <span>ESI LEVEL {calculatedESI.esiLevel}</span>
              </div>
            )}

            {/* Ollama Connection & Settings */}
            <button
              onClick={onOpenSettings}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
              title="Configure Ollama Model"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{selectedModel}</span>
              <Settings className="w-3 h-3 text-slate-400" />
            </button>

            {/* Trace Debugger */}
            <button
              onClick={onOpenDebugger}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
              title="Pipeline Trace Debugger"
            >
              <Bug className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono">Trace</span>
            </button>

            {/* Execute Triage Pipeline */}
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

        {/* Middle Row: Emergency Case Selector Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
            <Stethoscope className="w-3.5 h-3.5 text-rose-400" /> Test Case Presets:
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

        {/* Bottom Row: Feature Tabs & Modular Visibility Toggles */}
        {layoutMode === 'SINGLE_FOCUS' ? (
          <nav className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none font-mono text-xs gap-1">
            <button
              onClick={() => onSelectFeatureTab('VOICE_DICTATION')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                activeFeatureTab === 'VOICE_DICTATION' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" /> 1. Voice Dictation
            </button>

            <button
              onClick={() => onSelectFeatureTab('DETERMINISTIC_LABS')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                activeFeatureTab === 'DETERMINISTIC_LABS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> 2. Range Checker
            </button>

            <button
              onClick={() => onSelectFeatureTab('MULTIMODAL_VISION')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                activeFeatureTab === 'MULTIMODAL_VISION' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> 3. Vision Scanner
            </button>

            <button
              onClick={() => onSelectFeatureTab('GROUNDED_RAG')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                activeFeatureTab === 'GROUNDED_RAG' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> 4. Grounded RAG
            </button>

            <button
              onClick={() => onSelectFeatureTab('TRIAGE_SYNTHESIS')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                activeFeatureTab === 'TRIAGE_SYNTHESIS' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" /> 5. Triage Brief
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto scrollbar-none">
            <span className="text-slate-400 font-bold px-2 flex items-center gap-1 shrink-0">
              <LayoutGrid className="w-3.5 h-3.5 text-amber-400" /> Active Modules:
            </span>

            {([
              { key: 'VOICE_DICTATION', label: '🎙️ Voice & NLU' },
              { key: 'DETERMINISTIC_LABS', label: '⚡ Range Checker' },
              { key: 'MULTIMODAL_VISION', label: '👁️ Vision Scanner' },
              { key: 'GROUNDED_RAG', label: '📚 Grounded RAG' },
              { key: 'TRIAGE_SYNTHESIS', label: '🩺 Triage Brief' }
            ] as const).map(mod => (
              <button
                key={mod.key}
                onClick={() => onToggleModuleVisibility(mod.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border shrink-0 ${
                  visibleModules[mod.key] 
                    ? 'bg-slate-800 text-slate-200 border-slate-700 shadow-sm' 
                    : 'bg-slate-950 text-slate-600 border-slate-900 opacity-60'
                }`}
              >
                {visibleModules[mod.key] ? '✓ ' : '✗ '}{mod.label}
              </button>
            ))}
          </div>
        )}

      </div>
    </header>
  );
};
