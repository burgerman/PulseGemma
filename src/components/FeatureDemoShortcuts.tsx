import React from 'react';
import { Volume2, ShieldAlert, Eye, BookOpen, FileCheck, CheckCircle2 } from 'lucide-react';
import { FeatureTabKey } from './Header';

interface FeatureDemoShortcutsProps {
  activeTab: FeatureTabKey;
  onSelectTab: (tab: FeatureTabKey) => void;
  onQuickDemoRun: (tab: FeatureTabKey) => void;
  isPipelineRunning: boolean;
}

export const FeatureDemoShortcuts: React.FC<FeatureDemoShortcutsProps> = ({
  activeTab,
  onQuickDemoRun,
  isPipelineRunning
}) => {
  const SHORTCUTS: { key: FeatureTabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'VOICE_DICTATION', label: 'Voice NLU Dictation', icon: <Volume2 className="w-4 h-4 text-rose-500" /> },
    { key: 'DETERMINISTIC_LABS', label: '0ms Range Checker', icon: <ShieldAlert className="w-4 h-4 text-emerald-500" /> },
    { key: 'MULTIMODAL_VISION', label: 'Vision OCR Scanner', icon: <Eye className="w-4 h-4 text-purple-500" /> },
    { key: 'GROUNDED_RAG', label: 'Grounded CPG RAG', icon: <BookOpen className="w-4 h-4 text-sky-500" /> },
    { key: 'TRIAGE_SYNTHESIS', label: 'Master Triage Brief', icon: <FileCheck className="w-4 h-4 text-amber-500" /> }
  ];

  return (
    <div className="space-y-4">
      {/* 1-Click Feature Demo Shortcuts Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold text-slate-800 font-sans flex items-center justify-between">
            <span>1-Click Feature Demo Shortcuts</span>
          </h3>
        </div>

        <div className="space-y-2 font-mono">
          {SHORTCUTS.map(sc => {
            const isActive = activeTab === sc.key;
            return (
              <button
                key={sc.key}
                onClick={() => onQuickDemoRun(sc.key)}
                disabled={isPipelineRunning}
                className={`w-full p-2.5 rounded-lg border text-sm font-bold font-sans transition flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-slate-200 text-slate-900 border-slate-300 shadow-inner'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {sc.icon}
                  <span>{sc.label}</span>
                </div>
                {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* System Execution Telemetry Status Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2 font-sans">
        <h4 className="text-xs font-bold text-slate-500 tracking-wider border-b border-slate-100 pb-1.5">
          System Status
        </h4>

        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Voice NLU Dictation</span>
            <span className="text-emerald-600 font-bold">READY</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">0ms Range Checker</span>
            <span className="text-emerald-600 font-bold">ACTIVE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Vision OCR Scanner</span>
            <span className="text-purple-600 font-bold">ACTIVE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Grounded CPG RAG</span>
            <span className="text-sky-600 font-bold">READY</span>
          </div>
        </div>

        <div className="pt-3 mt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
          <span>Sync: <strong className="text-slate-800">8:19:5k</strong></span>
          <span>Latency: <strong className="text-emerald-600">55.2 ms</strong></span>
        </div>
      </div>

    </div>
  );
};
