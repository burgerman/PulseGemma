import React, { useState } from 'react';
import { Mic, MicOff, Globe, Volume2, Sparkles, AlertCircle, Languages, FileText } from 'lucide-react';
import { PatientProfile } from '../../types/clinical';
import { ExtractedSymptomEntity } from '../../types/agent';
import { webSpeechService } from '../../services/webSpeechService';

interface VoiceDictationTabProps {
  patientProfile: PatientProfile;
  rawTranscript: string;
  inputLanguage: string;
  normalizedSymptoms?: ExtractedSymptomEntity;
  onUpdateTranscript: (text: string) => void;
  onUpdateLanguage: (lang: string) => void;
}

const QUICK_PRESETS = [
  { label: '🫀 Chest Pain (Spanish)', lang: 'es', text: 'Tengo un dolor muy fuerte en el pecho que se me va al brazo izquierdo y me siento mareado.' },
  { label: '🔥 High Fever & Dyspnea (Chinese)', lang: 'zh', text: '发高烧39.5度，呼吸非常困难，头晕发冷。' },
  { label: '⚡ Leg Numbness & Weakness (French)', lang: 'fr', text: 'Je me sens tres faible et mes jambes sont engourdies.' },
  { label: '🤮 Abdominal Pain & Vomiting (English)', lang: 'en', text: 'Severe cramping stomach pain, vomiting repeatedly, blood sugar reading HI.' }
];

export const VoiceDictationTab: React.FC<VoiceDictationTabProps> = ({
  patientProfile,
  rawTranscript,
  inputLanguage,
  normalizedSymptoms,
  onUpdateTranscript,
  onUpdateLanguage
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const toggleRecording = () => {
    if (isRecording) {
      webSpeechService.stopListening();
      setIsRecording(false);
    } else {
      setSpeechError(null);
      webSpeechService.startListening({
        language: inputLanguage === 'es' ? 'es-ES' : inputLanguage === 'zh' ? 'zh-CN' : inputLanguage === 'fr' ? 'fr-FR' : 'en-US',
        onResult: (transcript) => {
          onUpdateTranscript(transcript);
        },
        onError: (err) => {
          setSpeechError(err);
          setIsRecording(false);
        }
      });
      setIsRecording(true);
    }
  };

  const handleApplyPreset = (text: string, lang: string) => {
    onUpdateLanguage(lang);
    onUpdateTranscript(text);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      
      {/* Feature Title Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-md">
            <Volume2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <span>Feature 1: Hands-Free Voice Dictation & Multilingual NLU</span>
              <span className="px-2 py-0.5 text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded font-sans">
                20+ Languages
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Captures bedside oral patient dictation, translating non-English symptoms into standardized English SNOMED clinical terms.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left Box: Oral Dictation Input & Controls (Width 7/12) */}
        <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-rose-400" />
              <span>Input Language & Dictation</span>
            </label>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
              <Globe className="w-4 h-4 text-slate-400" />
              <select
                value={inputLanguage}
                onChange={(e) => onUpdateLanguage(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="en">English (en-US)</option>
                <option value="es">Spanish (es-ES)</option>
                <option value="zh">Chinese (zh-CN)</option>
                <option value="fr">French (fr-FR)</option>
                <option value="ar">Arabic (ar-SA)</option>
              </select>
            </div>
          </div>

          {/* Quick Preset Dictation Phrases */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Test Multilingual Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PRESETS.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(qp.text, qp.lang)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 transition cursor-pointer"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area & Voice Recording Action */}
          <div className="relative">
            <textarea
              value={rawTranscript}
              onChange={(e) => onUpdateTranscript(e.target.value)}
              placeholder="Click 'Start Dictating' or type patient symptoms..."
              rows={5}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50 resize-none font-sans leading-relaxed"
            />

            <button
              onClick={toggleRecording}
              className={`absolute bottom-4 right-4 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-lg ${
                isRecording 
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-950 ring-2 ring-rose-500/50' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-rose-400" />}
              <span>{isRecording ? 'Listening Live...' : 'Start Dictating'}</span>
            </button>
          </div>

          {/* Audio Stream Visualizer Bar */}
          {isRecording && (
            <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs font-mono text-rose-300 font-bold flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 animate-bounce" /> Audio Stream Live ({inputLanguage.toUpperCase()})
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-5 bg-rose-500 animate-pulse rounded-full" />
                <span className="w-1.5 h-7 bg-rose-400 animate-pulse delay-75 rounded-full" />
                <span className="w-1.5 h-4 bg-rose-500 animate-pulse delay-150 rounded-full" />
                <span className="w-1.5 h-6 bg-rose-400 animate-pulse delay-100 rounded-full" />
              </div>
            </div>
          )}

          {speechError && (
            <p className="text-xs text-rose-400 font-mono flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {speechError}
            </p>
          )}

        </div>

        {/* Right Box: NLU Entity Extraction Result (Width 5/12) */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-rose-400" />
              <span>NLU Extracted Clinical Entities (Node 1)</span>
            </h3>

            {normalizedSymptoms ? (
              <div className="space-y-2.5 font-sans">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Chief Complaint</span>
                  <p className="text-xs font-bold text-white">{normalizedSymptoms.chiefComplaint}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Anatomical Site</span>
                    <p className="text-xs font-semibold text-slate-200">{normalizedSymptoms.anatomicalLocation}</p>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Pain Severity</span>
                    <p className="text-xs font-mono font-bold text-rose-400">{normalizedSymptoms.severityScore1To10} / 10</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">English Clinical Summary</span>
                  <p className="text-xs text-slate-300 italic">{normalizedSymptoms.translatedEnglishSummary}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center text-slate-500 text-xs font-mono">
                Dictate or type symptoms to view real-time NLU extraction.
              </div>
            )}
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Patient: {patientProfile.name}</span>
            <span className="text-rose-400 font-bold">{inputLanguage.toUpperCase()}</span>
          </div>

        </div>

      </div>

    </div>
  );
};
