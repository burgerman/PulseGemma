import React, { useState } from 'react';
import { Mic, MicOff, Globe, Volume2, Sparkles, FileText, Zap, CheckCircle2 } from 'lucide-react';
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
  onProcessTranscript?: () => void;
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
  onUpdateLanguage,
  onProcessTranscript
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleManualProcess = async () => {
    if (onProcessTranscript && rawTranscript.trim()) {
      setIsProcessing(true);
      try {
        await onProcessTranscript();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto font-sans">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Voice Dictation & NLU</h2>
            <p className="text-xs text-slate-400">Speak or type patient symptoms for instant doctor summary</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={inputLanguage}
            onChange={(e) => onUpdateLanguage(e.target.value)}
            className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="zh">Chinese</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Box: Oral Dictation Input (Width 6/12) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs flex flex-col justify-between">
          
          <div className="space-y-3">
            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
                <Sparkles className="w-3 h-3 text-amber-500" /> Presets:
              </span>
              {QUICK_PRESETS.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => { 
                    onUpdateLanguage(qp.lang); 
                    onUpdateTranscript(qp.text); 
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shrink-0 transition cursor-pointer text-xs font-medium"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={rawTranscript}
              onChange={(e) => onUpdateTranscript(e.target.value)}
              placeholder="Type or speak patient chief complaint..."
              rows={5}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 resize-none font-sans"
            />

            {/* Buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleManualProcess}
                disabled={isProcessing || !rawTranscript}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>{isProcessing ? 'Summarizing...' : 'Summarize'}</span>
              </button>

              <button
                onClick={toggleRecording}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-red-500" />}
                <span>{isRecording ? 'Stop' : 'Dictate'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Box: Doctor Summary & Extracted Concepts (Width 6/12) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            
            {/* Box Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>Doctor Summary</span>
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">
                Patient: {patientProfile.name}
              </span>
            </div>

            {normalizedSymptoms ? (
              <div className="space-y-3 font-sans">
                
                {/* Doctor Quick Summary Card */}
                <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-200/60 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-teal-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Summary Review</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5">
                    {normalizedSymptoms.doctorQuickSummary || normalizedSymptoms.translatedEnglishSummary || 'Speech data processed.'}
                  </p>
                </div>

                {/* Structured Concepts Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 col-span-2">
                    <span className="text-[10px] text-slate-400 block font-medium">Chief Complaint</span>
                    <p className="font-bold text-slate-800 mt-0.5">{normalizedSymptoms.chiefComplaint}</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-medium">Location</span>
                    <p className="font-semibold text-slate-700 mt-0.5">{normalizedSymptoms.anatomicalLocation}</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-medium">Severity</span>
                    <p className="font-bold text-red-600 mt-0.5">{normalizedSymptoms.severityScore1To10} / 10</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 font-sans italic text-xs">
                Dictate or type symptoms to generate summary.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

