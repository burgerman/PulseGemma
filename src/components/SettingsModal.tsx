import React, { useState, useEffect } from 'react';
import { X, Settings, Cpu, RefreshCw, CheckCircle, Key, Sparkles, ShieldCheck } from 'lucide-react';
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
            <h2 className="text-sm font-bold text-white font-mono">Local MedGemma & VLM Settings</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Local MedGemma 1.5 Edge Feature Highlight */}
        <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Pure Local Edge Model (MedGemma 1.5)</span>
            </label>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              100% Offline
            </span>
          </div>

          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Run medical imaging & triage 100% locally via Ollama with zero cloud API dependencies:
          </p>

          <button
            onClick={() => onSelectModel('hf.co/unsloth/medgemma-1.5-4b-it-GGUF:Q8_0')}
            className={`w-full p-2.5 rounded-lg border text-left font-mono text-xs transition flex items-center justify-between ${
              selectedModel === 'hf.co/unsloth/medgemma-1.5-4b-it-GGUF:Q8_0'
                ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <span>hf.co/unsloth/medgemma-1.5-4b-it-GGUF:Q8_0</span>
            {selectedModel === 'hf.co/unsloth/medgemma-1.5-4b-it-GGUF:Q8_0' && <CheckCircle className="w-4 h-4 text-white" />}
          </button>
        </div>

        {/* Optional Cloud VLM Vision API Key Configuration */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-purple-300 font-mono flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Optional Cloud VLM API (Gemini ER 2)</span>
            </label>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Hybrid Mode
            </span>
          </div>

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

        {/* Installed Ollama Models List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
              Installed Ollama Models
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

          <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-none">
            {installedModels.map((m) => (
              <div
                key={m}
                onClick={() => onSelectModel(m)}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                  selectedModel === m 
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-md' 
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold truncate">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{m}</span>
                </div>

                {selectedModel === m && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
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
