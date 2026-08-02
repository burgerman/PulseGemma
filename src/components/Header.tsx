import React from 'react';
import { ShieldCheck, Settings, Bug, RefreshCw } from 'lucide-react';
import { ESICalculationResult } from '../types/clinical';

export type FeatureTabKey = 'VOICE_DICTATION' | 'DETERMINISTIC_LABS' | 'MULTIMODAL_VISION' | 'GROUNDED_RAG' | 'TRIAGE_SYNTHESIS';

interface HeaderProps {
  calculatedESI?: ESICalculationResult;
  selectedCaseId: string;
  selectedModel: string;
  isPipelineRunning: boolean;
  onOpenSettings: () => void;
  onOpenDebugger: () => void;
  onRunTriage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  calculatedESI,
  isPipelineRunning,
  onOpenSettings,
  onOpenDebugger,
  onRunTriage
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Brand Identity & Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/PulseGemma.png" 
            alt="PulseGemma Logo" 
            className="h-8 w-auto object-contain" 
          />
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-800 font-sans tracking-tight">PulseGemma</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              Triage
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          
          {/* ESI Badge */}
          {calculatedESI && (
            <div 
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border"
              style={{
                backgroundColor: `${calculatedESI.color}10`,
                borderColor: `${calculatedESI.color}30`,
                color: calculatedESI.color
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ESI {calculatedESI.esiLevel}</span>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={onRunTriage}
            disabled={isPipelineRunning}
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-sans text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPipelineRunning ? 'animate-spin' : ''}`} />
            <span>{isPipelineRunning ? 'Analyzing...' : 'Analyze'}</span>
          </button>

          <div className="h-4 w-px bg-slate-200" />

          {/* Settings & Debugger Icons */}
          <button
            onClick={onOpenDebugger}
            title="Telemetry Debugger"
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
          >
            <Bug className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-500" />
          </button>

        </div>

      </div>
    </header>
  );
};
