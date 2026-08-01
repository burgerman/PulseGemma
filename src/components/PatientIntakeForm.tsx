import React, { useState } from 'react';
import { Mic, MicOff, Globe, User, Heart, Thermometer, Activity, Volume2, Sparkles, Upload, FileImage, AlertCircle } from 'lucide-react';
import { PatientProfile, PatientVitals, MedicalImagePayload } from '../types/clinical';
import { webSpeechService } from '../services/webSpeechService';

interface PatientIntakeFormProps {
  patientProfile: PatientProfile;
  vitals: PatientVitals;
  rawTranscript: string;
  inputLanguage: string;
  currentImage?: MedicalImagePayload;
  onUpdateTranscript: (text: string) => void;
  onUpdateLanguage: (lang: string) => void;
  onUpdateVitals: (vitals: PatientVitals) => void;
  onUploadImage?: (image: MedicalImagePayload) => void;
}

const QUICK_SYMPTOM_TAGS = [
  { label: '🫀 Chest Pain', text: 'Patient reports severe crushing chest pain radiating to left arm.' },
  { label: '🫁 Dyspnea', text: 'Shortness of breath with respiratory distress.' },
  { label: '🔥 High Fever', text: 'Fever of 39.2°C with chills and diaphoresis.' },
  { label: '⚡ Hyperkalemia Muscle Fatigue', text: 'Severe leg numbness and muscle weakness.' },
  { label: '🤮 DKA Nausea', text: 'Abdominal pain, persistent vomiting, blood sugar HI.' }
];

export const PatientIntakeForm: React.FC<PatientIntakeFormProps> = ({
  patientProfile,
  vitals,
  rawTranscript,
  inputLanguage,
  currentImage,
  onUpdateTranscript,
  onUpdateLanguage,
  onUpdateVitals,
  onUploadImage
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

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onUploadImage({
          id: `UPLOAD_${Date.now()}`,
          title: file.name,
          category: file.name.toLowerCase().includes('xray') ? 'XRAY' : file.name.toLowerCase().includes('ecg') ? 'ECG_STRIP' : 'LAB_SHEET_PHOTO',
          base64Data: base64,
          timestamp: new Date().toISOString(),
          fileName: file.name,
          fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2))
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
      
      {/* Patient Profile Snapshot Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-sm">
            <User className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">{patientProfile.name}</h2>
              <span className="text-xs text-slate-400 font-mono">({patientProfile.age}yo {patientProfile.gender})</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">MRN: <span className="text-slate-200">{patientProfile.mrn}</span></p>
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

      {/* Multilingual Hands-Free Voice Dictation & Symptom Input */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Volume2 className="w-4 h-4 text-rose-400" />
            <span>Oral Symptom Intake & Voice Dictation</span>
          </label>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-md border border-slate-800 text-xs font-mono">
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

        {/* One-Click Quick Symptom Preset Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Quick Symptoms:
          </span>
          {QUICK_SYMPTOM_TAGS.map((st, idx) => (
            <button
              key={idx}
              onClick={() => onUpdateTranscript(st.text)}
              className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 transition cursor-pointer"
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Text Area + Real-Time Voice Recording Animation */}
        <div className="relative">
          <textarea
            value={rawTranscript}
            onChange={(e) => onUpdateTranscript(e.target.value)}
            placeholder="Speak or type patient chief complaint and symptom onset..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50 resize-none font-sans"
          />

          {/* Voice Mic Button */}
          <button
            onClick={toggleRecording}
            className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md ${
              isRecording 
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-950 ring-2 ring-rose-500/50' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-rose-400" />}
            <span>{isRecording ? 'Listening...' : 'Dictate Voice'}</span>
          </button>
        </div>

        {/* Live Audio Visualizer Waveform Bar */}
        {isRecording && (
          <div className="bg-rose-950/30 border border-rose-500/30 rounded-lg p-2 flex items-center justify-between">
            <span className="text-[10px] font-mono text-rose-300 font-bold flex items-center gap-1">
              <Volume2 className="w-3 h-3 animate-bounce" /> Audio Stream Live ({inputLanguage.toUpperCase()})
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-4 bg-rose-500 animate-pulse rounded-full" />
              <span className="w-1.5 h-6 bg-rose-400 animate-pulse delay-75 rounded-full" />
              <span className="w-1.5 h-3 bg-rose-500 animate-pulse delay-150 rounded-full" />
              <span className="w-1.5 h-5 bg-rose-400 animate-pulse delay-100 rounded-full" />
            </div>
          </div>
        )}

        {speechError && (
          <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {speechError}
          </p>
        )}
      </div>

      {/* Patient Vital Signs Grid */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block">
          Patient Vital Signs & Physical Indicators
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          
          {/* Heart Rate */}
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
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
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
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
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
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
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
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
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
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
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
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

      {/* Multimodal Medical Image File Upload Dropzone */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block">
          Multimodal Image Scanner Input (X-Ray / Lab Sheet / ECG)
        </label>

        <div className="relative border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-xl p-3 bg-slate-950 transition flex items-center justify-between gap-3 group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileImage className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                {currentImage ? currentImage.title : 'Upload or Drag Medical Image File'}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                {currentImage ? `${currentImage.category} • Ready for Gemma Vision OCR` : 'PNG, JPG, DICOM supported'}
              </p>
            </div>
          </div>

          <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-mono font-semibold border border-slate-700 cursor-pointer flex items-center gap-1.5 transition">
            <Upload className="w-3.5 h-3.5" />
            <span>Select File</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileDrop}
              className="hidden"
            />
          </label>
        </div>
      </div>

    </div>
  );
};
