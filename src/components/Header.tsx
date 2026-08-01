import React from 'react';
import { Activity, ShieldCheck, Cpu, Settings, Bug, Stethoscope, RefreshCw, Volume2, ShieldAlert, Eye, BookOpen, FileCheck } from 'lucide-react';
import { ESICalculationResult } from '../types/clinical';
import { PRESET_EMERGENCY_CASES } from '../services/mockDataService';

export type FeatureTabKey = 'VOICE_DICTATION' | 'DETERMINISTIC_LABS' | 'MULTIMODAL_VISION' | 'GROUNDED_RAG' | 'TRIAGE_SYNTHESIS';

interface HeaderProps {
  calculatedESI?: ESICalculationResult;
  selectedCaseId: string;
  selectedModel: string;
  isPipelineRunning: boolean;
  activeFeatureTab: FeatureTabKey;
  onSelectFeatureTab: (tab: FeatureTabKey) => void;
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
  onSelectFeatureTab,
  onSelectCase,
  onOpenSettings,
  onOpenDebugger,
  onRunTriage
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Top Row: Brand, ESI Level Badge & System Actions */}
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
                  MULTIMODAL EDGE CDS
                </span>
              </div>
              <p className="text-xs text-slate-400">Component-Oriented Multimodal Triage Architecture</p>
            </div>
          </div>

          {/* ESI Badge & Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            
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
                <span>ESI LEVEL {calculatedESI.esiLevel}: {calculatedESI.levelName.toUpperCase()}</span>
              </div>
            )}

            {/* Ollama Connection & Settings */}
            <button
              onClick={onOpenSettings}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
              title="Configure Ollama Endpoint"
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
            <Stethoscope className="w-3.5 h-3.5 text-rose-400" /> Test Presets:
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

        {/* Bottom Row: Independent Single-Responsibility Feature Tabs */}
        <nav className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none font-mono text-xs gap-1">
          
          <button
            onClick={() => onSelectFeatureTab('VOICE_DICTATION')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              activeFeatureTab === 'VOICE_DICTATION'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-white" />
            <span>1. Voice Dictation</span>
          </button>

          <button
            onClick={() => onSelectFeatureTab('DETERMINISTIC_LABS')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              activeFeatureTab === 'DETERMINISTIC_LABS'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
            <span>2. Range Checker (0ms)</span>
          </button>

          <button
            onClick={() => onSelectFeatureTab('MULTIMODAL_VISION')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              activeFeatureTab === 'MULTIMODAL_VISION'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            <span>3. Vision Scanner</span>
          </button>

          <button
            onClick={() => onSelectFeatureTab('GROUNDED_RAG')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              activeFeatureTab === 'GROUNDED_RAG'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-white" />
            <span>4. Grounded CPG RAG</span>
          </button>

          <button
            onClick={() => onSelectFeatureTab('TRIAGE_SYNTHESIS')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              activeFeatureTab === 'TRIAGE_SYNTHESIS'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-white" />
            <span>5. Master Triage Brief</span>
          </button>

        </nav>

      </div>
    </header>
  );
};
