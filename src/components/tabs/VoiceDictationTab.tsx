import React, { useState } from 'react';
import { Mic, MicOff, Globe, Volume2, Sparkles, FileText } from 'lucide-react';
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
  { label: '🫀 Chest Pain (ES)', lang: 'es', text: 'Tengo un dolor muy fuerte en el pecho que se me va al brazo izquierdo.' },
  { label: '🔥 High Fever (ZH)', lang: 'zh', text: '发高烧39.5度，呼吸非常困难，头晕发冷。' },
  { label: '⚡ Numbness (FR)', lang: 'fr', text: 'Je me sens tres faible et mes jambes sont engourdies.' },
  { label: '🤮 DKA Nausea (EN)', lang: 'en', text: 'Severe cramping stomach pain, vomiting repeatedly, blood sugar HI.' }
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

  const toggleRecording = () => {
    if (isRecording) {
      webSpeechService.stopListening();
      setIsRecording(false);
    } else {
      webSpeechService.startListening({
        language: inputLanguage === 'es' ? 'es-ES' : inputLanguage === 'zh' ? 'zh-CN' : inputLanguage === 'fr' ? 'fr-FR' : 'en-US',
        onResult: (transcript) => {
          onUpdateTranscript(transcript);
        },
        onError: () => {
          setIsRecording(false);
        }
      });
      setIsRecording(true);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">Hands-Free Voice Dictation & NLU</h2>
            <p className="text-xs text-slate-400">Real-time oral symptom capture in 20+ languages</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={inputLanguage}
            onChange={(e) => onUpdateLanguage(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="en">English (en)</option>
            <option value="es">Spanish (es)</option>
            <option value="zh">Chinese (zh)</option>
            <option value="fr">French (fr)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left Box: Oral Dictation Input (Width 7/12) */}
        <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
          
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] font-mono">
            <span className="text-slate-500 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
            </span>
            {QUICK_PRESETS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => { onUpdateLanguage(qp.lang); onUpdateTranscript(qp.text); }}
                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 transition cursor-pointer"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Textarea & Record Button */}
          <div className="relative">
            <textarea
              value={rawTranscript}
              onChange={(e) => onUpdateTranscript(e.target.value)}
              placeholder="Speak or type patient chief complaint..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50 resize-none font-sans"
            />

            <button
              onClick={toggleRecording}
              className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md ${
                isRecording 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-rose-400" />}
              <span>{isRecording ? 'Listening...' : 'Dictate'}</span>
            </button>
          </div>

        </div>

        {/* Right Box: Clean NLU Entity Card (Width 5/12) */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span>NLU Extracted Clinical Concept</span>
            </h3>

            {normalizedSymptoms ? (
              <div className="space-y-2 mt-3 font-sans">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Chief Complaint</span>
                  <p className="text-xs font-bold text-white mt-0.5">{normalizedSymptoms.chiefComplaint}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Location</span>
                    <p className="text-xs font-semibold text-slate-300 mt-0.5">{normalizedSymptoms.anatomicalLocation}</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Pain Severity</span>
                    <p className="text-xs font-mono font-bold text-rose-400 mt-0.5">{normalizedSymptoms.severityScore1To10} / 10</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-mono italic mt-3">Dictate symptoms to view clinical extraction.</p>
            )}
          </div>

          <div className="bg-slate-950 p-2 rounded-lg text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Patient: {patientProfile.name}</span>
            <span className="text-rose-400 font-bold">{inputLanguage.toUpperCase()}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
