import React, { useState, useEffect } from 'react';
import { X, Settings, Cpu, RefreshCw, CheckCircle, WifiOff, Key, Sparkles } from 'lucide-react';
import { getInstalledOllamaModels } from '../services/ollamaService';

interface SettingsModalProps {
  isOpen: boolean;
  selectedModel: string;
  vlmApiKey?: string;
  onSelectModel: (model: string) => void;
  onUpdateVlmApiKey?: (key: string) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  selectedModel,
  vlmApiKey = '',
  onSelectModel,
  onUpdateVlmApiKey,
  onClose
}) => {
  const [installedModels, setInstalledModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>(vlmApiKey);

  const fetchModels = async () => {
    setIsLoading(true);
    const models = await getInstalledOllamaModels();
    setInstalledModels(models);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchModels();
      setApiKeyInput(vlmApiKey);
    }
  }, [isOpen, vlmApiKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white font-mono">Hybrid Architecture & VLM Settings</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud VLM Vision API Key Configuration */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-purple-300 font-mono flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Cloud VLM Specialist (Node 3 Vision)</span>
            </label>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Gemini ER 2 / Flash
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Eliminates edge vision hallucinations by delegating medical image analysis (X-Rays, ECGs, Lab printouts) to Cloud VLM APIs.
          </p>

          <div className="relative">
            <Key className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value);
                onUpdateVlmApiKey?.(e.target.value);
              }}
              placeholder="Paste Gemini VLM API Key (Optional)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 font-mono"
            />
          </div>
        </div>

        {/* Local Gemma Synthesizer & Ollama Model List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
              Local Gemma Clinical Synthesizer (Node 5)
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

        {/* Hybrid Architecture Summary */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1 font-sans">
          <p className="font-bold text-slate-200 font-mono">Hybrid Architecture Flow:</p>
          <p className="text-[11px] leading-relaxed">
            1. <strong>Cloud VLM</strong> extracts accurate radiologic & OCR findings from images.<br/>
            2. <strong>Local Gemma</strong> combines VLM visual findings with vitals, 0ms lab alerts, and local RAG guidelines into a comprehensive doctor report.
          </p>
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
