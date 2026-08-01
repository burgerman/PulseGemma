import React, { useState, useEffect } from 'react';
import { X, Settings, Cpu, RefreshCw, CheckCircle, WifiOff } from 'lucide-react';
import { getInstalledOllamaModels } from '../services/ollamaService';

interface SettingsModalProps {
  isOpen: boolean;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  selectedModel,
  onSelectModel,
  onClose
}) => {
  const [installedModels, setInstalledModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchModels = async () => {
    setIsLoading(true);
    const models = await getInstalledOllamaModels();
    setInstalledModels(models);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchModels();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white font-mono">Ollama Model & Hardware Settings</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Auto-Discovery List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
              Installed Ollama Vision Models
            </span>
            <button
              onClick={fetchModels}
              disabled={isLoading}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Models</span>
            </button>
          </div>

          <div className="space-y-2">
            {installedModels.length > 0 ? (
              installedModels.map((m) => (
                <div
                  key={m}
                  onClick={() => onSelectModel(m)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                    selectedModel === m 
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-md' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs font-bold">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>{m}</span>
                  </div>

                  {selectedModel === m && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              ))
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3 text-slate-400 text-xs font-mono">
                <WifiOff className="w-5 h-5 text-amber-400" />
                <span>Ollama service not detected at http://localhost:11434. Client Edge Simulator active.</span>
              </div>
            )}
          </div>
        </div>

        {/* Model Presets Hint */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1 font-sans">
          <p className="font-bold text-slate-200 font-mono">Recommended Vision Models:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            <li><code className="text-emerald-400">gemma4:vision</code> (Recommended Primary Vision Model)</li>
            <li><code className="text-emerald-400">paligemma</code> / <code className="text-emerald-400">llava</code> (Lightweight Multimodal)</li>
          </ul>
        </div>

        {/* Save & Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition cursor-pointer"
          >
            Save & Apply Settings
          </button>
        </div>

      </div>
    </div>
  );
};
