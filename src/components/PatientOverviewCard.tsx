import React from 'react';
import { User, Calendar, Heart, Activity, Thermometer, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PatientProfile, PatientVitals, ESICalculationResult } from '../types/clinical';
import { PRESET_EMERGENCY_CASES } from '../services/mockDataService';

interface PatientOverviewCardProps {
  patientProfile: PatientProfile;
  vitals: PatientVitals;
  esiResult?: ESICalculationResult;
  selectedCaseId?: string;
  onSelectCase?: (caseId: string) => void;
}

export const PatientOverviewCard: React.FC<PatientOverviewCardProps> = ({
  patientProfile,
  vitals,
  esiResult,
  selectedCaseId,
  onSelectCase
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
      
      {/* Top Header & Emergency Case Selector */}
      <div className="space-y-3 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-400">
            Patient Context & Triage
          </h2>
          {esiResult && (
            <span 
              className="px-2.5 py-1 rounded-lg text-xs font-bold border font-sans"
              style={{
                backgroundColor: `${esiResult.color}15`,
                borderColor: `${esiResult.color}40`,
                color: esiResult.color
              }}
            >
              ESI {esiResult.esiLevel}: {esiResult.levelName}
            </span>
          )}
        </div>

        {onSelectCase && (
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500 block">Preset Emergency Case</label>
            <select
              value={selectedCaseId}
              onChange={(e) => onSelectCase(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
            >
              {PRESET_EMERGENCY_CASES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Patient Profile Card */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-sm">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{patientProfile.name}</h3>
            <p className="text-xs text-slate-500">
              {patientProfile.age} yrs • {patientProfile.gender} • ID: #{patientProfile.id}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60 flex justify-between text-xs text-slate-500 font-sans">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Arrival: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-100 font-mono">
            MRN: {patientProfile.mrn}
          </span>
        </div>
      </div>

      {/* Vitals Summary Grid */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
          Vital Signs
        </h4>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          
          {/* Heart Rate */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Heart className="w-3.5 h-3.5 text-red-500" /> Heart Rate
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-bold text-slate-800">{vitals.heartRate}</span>
              <span className="text-[10px] text-slate-400">bpm</span>
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Activity className="w-3.5 h-3.5 text-amber-500" /> Blood Pressure
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-bold text-slate-800">{vitals.systolicBP}/{vitals.diastolicBP}</span>
              <span className="text-[10px] text-slate-400">mmHg</span>
            </div>
          </div>

          {/* SpO2 */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" /> Oxygen (SpO2)
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className={`text-base font-bold ${vitals.oxygenSaturation < 95 ? 'text-red-600' : 'text-slate-800'}`}>
                {vitals.oxygenSaturation}%
              </span>
              <span className="text-[10px] text-slate-400">%</span>
            </div>
          </div>

          {/* Temp */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Thermometer className="w-3.5 h-3.5 text-orange-500" /> Temp
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-bold text-slate-800">{vitals.temperature}°F</span>
              <span className="text-[10px] text-slate-400">Oral</span>
            </div>
          </div>

          {/* Resp Rate */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Activity className="w-3.5 h-3.5 text-purple-500" /> Resp. Rate
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-bold text-slate-800">{vitals.respiratoryRate}</span>
              <span className="text-[10px] text-slate-400">/min</span>
            </div>
          </div>

          {/* Pain Score */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Pain Score
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className={`text-base font-bold ${vitals.painScore >= 7 ? 'text-red-600' : 'text-slate-800'}`}>
                {vitals.painScore} / 10
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

