import React, { useState } from 'react';
import { ShieldCheck, Cpu, Settings, Bug, RefreshCw, LayoutGrid, Target, Volume2, ShieldAlert, Eye, BookOpen, FileCheck, Play, ChevronDown, Sparkles, Stethoscope } from 'lucide-react';
import { ESICalculationResult } from '../types/clinical';
import { PRESET_EMERGENCY_CASES } from '../services/mockDataService';
import { PulseGemmaLogo } from './PulseGemmaLogo';

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
  onQuickDemoRun: (featureKey?: FeatureTabKey) => void;
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
  onRunTriage,
  onQuickDemoRun
}) => {
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);

  const FEATURE_DEMOS: { key: FeatureTabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'VOICE_DICTATION', label: '🎙️ 1. Voice NLU Dictation (Spanish)', icon: <Volume2 className="w-3.5 h-3.5 text-rose-400" /> },
    { key: 'DETERMINISTIC_LABS', label: '⚡ 2. 0ms Range Checker (Troponin Panic)', icon: <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> },
    { key: 'MULTIMODAL_VISION', label: '👁️ 3. Vision OCR Scanner (12-Lead ECG)', icon: <Eye className="w-3.5 h-3.5 text-purple-400" /> },
    { key: 'GROUNDED_RAG', label: '📚 4. Grounded CPG RAG (AHA Guideline)', icon: <BookOpen className="w-3.5 h-3.5 text-sky-400" /> },
    { key: 'TRIAGE_SYNTHESIS', label: '🩺 5. Master Triage Brief & EHR Copy', icon: <FileCheck className="w-3.5 h-3.5 text-amber-400" /> }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-2 shadow-xl">
      <div className="max-w-7xl mx-auto space-y-2">
        
        {/* Top Row: Custom User Logo, Quick Feature Demo Dropdown, ESI Badge & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          
          {/* Custom User Logo */}
          <PulseGemmaLogo height="h-6" />

          {/* ESI Badge & System Actions */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Quick Feature Demo Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
                disabled={isPipelineRunning}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/50 transition cursor-pointer ring-2 ring-rose-500/30 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current text-amber-300 animate-spin" />
                <span>Feature Demos</span>
                <ChevronDown className="w-3 h-3 text-rose-200" />
              </button>

              {isDemoMenuOpen && (
                <div className="absolute left-0 mt-1 w-64 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 font-mono text-xs space-y-1">
                  <div className="px-2 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-900 flex items-center gap-1">
                    <Play className="w-3 h-3 text-rose-400" /> 1-Click Feature Demo Runs
                  </div>
                  {FEATURE_DEMOS.map(demo => (
                    <button
                      key={demo.key}
                      onClick={() => {
                        onQuickDemoRun(demo.key);
                        setIsDemoMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 transition cursor-pointer"
                    >
                      {demo.icon}
                      <span className="truncate">{demo.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Layout Mode Switcher */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 font-mono text-xs">
              <button
                onClick={() => onChangeLayoutMode('MODULAR_GRID')}
                className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition cursor-pointer ${
                  layoutMode === 'MODULAR_GRID' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Modular Multi-Card Dashboard View"
              >
                <LayoutGrid className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Modular Grid</span>
              </button>

              <button
                onClick={() => onChangeLayoutMode('SINGLE_FOCUS')}
                className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition cursor-pointer ${
                  layoutMode === 'SINGLE_FOCUS' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Focused Single Feature View"
              >
                <Target className="w-3 h-3 text-rose-400" />
                <span className="hidden sm:inline">Single Focus</span>
              </button>
            </div>

            {/* Calculated ESI Badge */}
            {calculatedESI && (
              <div 
                className="px-2 py-0.5 rounded text-[11px] font-black flex items-center gap-1 border shadow-sm font-mono transition-all"
                style={{
                  backgroundColor: `${calculatedESI.color}20`,
                  borderColor: `${calculatedESI.color}50`,
                  color: calculatedESI.color
                }}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>ESI {calculatedESI.esiLevel}</span>
              </div>
            )}

            {/* Ollama Connection & Settings */}
            <button
              onClick={onOpenSettings}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1 transition cursor-pointer"
              title="Configure Ollama Model"
            >
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">{selectedModel}</span>
              <Settings className="w-3 h-3 text-slate-400" />
            </button>

            {/* Trace Debugger */}
            <button
              onClick={onOpenDebugger}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1 transition cursor-pointer"
              title="Pipeline Trace Debugger"
            >
              <Bug className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline font-mono">Trace</span>
            </button>

            {/* Execute Triage Pipeline */}
            <button
              onClick={onRunTriage}
              disabled={isPipelineRunning}
              className="px-3 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isPipelineRunning ? 'animate-spin' : ''}`} />
              <span>{isPipelineRunning ? 'Triaging...' : 'Re-Run'}</span>
            </button>

          </div>

        </div>

        {/* Middle Row: Emergency Case Selector Presets */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
            <Stethoscope className="w-3 h-3 text-rose-400" /> Case Presets:
          </span>

          {PRESET_EMERGENCY_CASES.map(c => {
            const isSelected = c.id === selectedCaseId;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCase(c.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium shrink-0 transition cursor-pointer flex items-center gap-1 border ${
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
          <nav className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 overflow-x-auto scrollbar-none font-mono text-xs gap-1">
            <button
              onClick={() => onSelectFeatureTab('VOICE_DICTATION')}
              className={`px-2.5 py-0.5 rounded font-bold flex items-center gap-1 transition cursor-pointer shrink-0 ${
                activeFeatureTab === 'VOICE_DICTATION' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-3 h-3" /> 1. Voice Dictation
            </button>

            <button
              onClick={() => onSelectFeatureTab('DETERMINISTIC_LABS')}
              className={`px-2.5 py-0.5 rounded font-bold flex items-center gap-1 transition cursor-pointer shrink-0 ${
                activeFeatureTab === 'DETERMINISTIC_LABS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3 h-3" /> 2. Range Checker
            </button>

            <button
              onClick={() => onSelectFeatureTab('MULTIMODAL_VISION')}
              className={`px-2.5 py-0.5 rounded font-bold flex items-center gap-1 transition cursor-pointer shrink-0 ${
                activeFeatureTab === 'MULTIMODAL_VISION' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3" /> 3. Vision Scanner
            </button>

            <button
              onClick={() => onSelectFeatureTab('GROUNDED_RAG')}
              className={`px-2.5 py-0.5 rounded font-bold flex items-center gap-1 transition cursor-pointer shrink-0 ${
                activeFeatureTab === 'GROUNDED_RAG' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3 h-3" /> 4. Grounded RAG
            </button>

            <button
              onClick={() => onSelectFeatureTab('TRIAGE_SYNTHESIS')}
              className={`px-2.5 py-0.5 rounded font-bold flex items-center gap-1 transition cursor-pointer shrink-0 ${
                activeFeatureTab === 'TRIAGE_SYNTHESIS' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-3 h-3" /> 5. Triage Brief
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 font-mono text-[11px] overflow-x-auto scrollbar-none">
            <span className="text-slate-400 font-bold px-1.5 flex items-center gap-1 shrink-0">
              <LayoutGrid className="w-3 h-3 text-amber-400" /> Active Modules:
            </span>

            {([
              { key: 'VOICE_DICTATION', label: '🎙️ Voice' },
              { key: 'DETERMINISTIC_LABS', label: '⚡ Ranges' },
              { key: 'MULTIMODAL_VISION', label: '👁️ Vision' },
              { key: 'GROUNDED_RAG', label: '📚 RAG' },
              { key: 'TRIAGE_SYNTHESIS', label: '🩺 Brief' }
            ] as const).map(mod => (
              <button
                key={mod.key}
                onClick={() => onToggleModuleVisibility(mod.key)}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer border shrink-0 ${
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
