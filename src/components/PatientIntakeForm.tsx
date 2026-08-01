import React, { useState } from 'react';
import { Mic, MicOff, Globe, User, Heart, Thermometer, Activity, Volume2 } from 'lucide-react';
import { PatientProfile, PatientVitals } from '../types/clinical';
import { webSpeechService } from '../services/webSpeechService';

interface PatientIntakeFormProps {
  patientProfile: PatientProfile;
  vitals: PatientVitals;
  rawTranscript: string;
  inputLanguage: string;
  onUpdateTranscript: (text: string) => void;
  onUpdateLanguage: (lang: string) => void;
  onUpdateVitals: (vitals: PatientVitals) => void;
}

export const PatientIntakeForm: React.FC<PatientIntakeFormProps> = ({
  patientProfile,
  vitals,
  rawTranscript,
  inputLanguage,
  onUpdateTranscript,
  onUpdateLanguage,
  onUpdateVitals
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
        language: inputLanguage === 'es' ? 'es-ES' : inputLanguage === 'zh' ? 'zh-CN' : 'en-US',
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

  const handleVitalChange = (key: keyof PatientVitals, value: number) => {
    onUpdateVitals({
      ...vitals,
      [key]: value
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
      
      {/* Patient Profile Snapshot Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{patientProfile.name}</h2>
            <p className="text-xs text-slate-400">
              {patientProfile.age}yo {patientProfile.gender} • <span className="font-mono text-slate-300">{patientProfile.mrn}</span>
            </p>
          </div>
        </div>

        {/* Allergy Tags */}
        <div className="flex flex-wrap gap-1">
          {patientProfile.allergies.map((allergy, idx) => (
            <span key={idx} className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              ⚠️ {allergy}
            </span>
          ))}
        </div>
      </div>

      {/* Multilingual Hands-Free Voice Dictation Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Volume2 className="w-4 h-4 text-rose-400" />
            <span>Bedside Symptom Dictation & Oral Intake</span>
          </label>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
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

        {/* Text Area + Voice Recording Action */}
        <div className="relative">
          <textarea
            value={rawTranscript}
            onChange={(e) => onUpdateTranscript(e.target.value)}
            placeholder="Speak or type patient chief complaint and symptom onset..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50 resize-none font-sans"
          />

          <button
            onClick={toggleRecording}
            className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isRecording 
                ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-950' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-rose-400" />}
            <span>{isRecording ? 'Listening...' : 'Dictate Voice'}</span>
          </button>
        </div>

        {speechError && (
          <p className="text-[11px] text-rose-400 font-mono">⚠️ {speechError}</p>
        )}
      </div>

      {/* Patient Vital Signs Entry Grid */}
      <div className="pt-2 border-t border-slate-800">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2 block">
          Patient Vital Signs
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          
          {/* Heart Rate */}
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-400" /> HR (bpm)
            </span>
            <input
              type="number"
              value={vitals.heartRate}
              onChange={(e) => handleVitalChange('heartRate', Number(e.target.value))}
              className="bg-transparent text-sm font-mono font-bold text-white focus:outline-none text-right"
            />
          </div>

          {/* Blood Pressure */}
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-400" /> BP (mmHg)
            </span>
            <div className="flex items-center justify-end font-mono text-sm font-bold text-white">
              <input
                type="number"
                value={vitals.systolicBP}
                onChange={(e) => handleVitalChange('systolicBP', Number(e.target.value))}
                className="bg-transparent w-10 text-right focus:outline-none"
              />
              <span>/</span>
              <input
                type="number"
                value={vitals.diastolicBP}
                onChange={(e) => handleVitalChange('diastolicBP', Number(e.target.value))}
                className="bg-transparent w-10 focus:outline-none"
              />
            </div>
          </div>

          {/* SpO2 */}
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-sky-400" /> SpO2 (%)
            </span>
            <input
              type="number"
              value={vitals.oxygenSaturation}
              onChange={(e) => handleVitalChange('oxygenSaturation', Number(e.target.value))}
              className="bg-transparent text-sm font-mono font-bold text-white focus:outline-none text-right"
            />
          </div>

          {/* Temp */}
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-orange-400" /> Temp (°C)
            </span>
            <input
              type="number"
              step="0.1"
              value={vitals.temperature}
              onChange={(e) => handleVitalChange('temperature', Number(e.target.value))}
              className="bg-transparent text-sm font-mono font-bold text-white focus:outline-none text-right"
            />
          </div>

          {/* Respiratory Rate */}
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-400" /> RR (/min)
            </span>
            <input
              type="number"
              value={vitals.respiratoryRate}
              onChange={(e) => handleVitalChange('respiratoryRate', Number(e.target.value))}
              className="bg-transparent text-sm font-mono font-bold text-white focus:outline-none text-right"
            />
          </div>

          {/* Pain Score */}
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-rose-500" /> Pain (0-10)
            </span>
            <input
              type="number"
              min="0"
              max="10"
              value={vitals.painScore}
              onChange={(e) => handleVitalChange('painScore', Number(e.target.value))}
              className="bg-transparent text-sm font-mono font-bold text-white focus:outline-none text-right"
            />
          </div>

        </div>
      </div>

    </div>
  );
};
