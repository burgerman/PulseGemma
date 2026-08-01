import { TriageState, PipelineTraceLog } from '../types/agent';
import { PatientProfile, PatientVitals, MedicalImagePayload } from '../types/clinical';

export function createInitialState(
  patientProfile: PatientProfile,
  vitals: PatientVitals,
  rawLabs: Record<string, number>,
  rawTranscript?: string,
  inputLanguage: string = 'en',
  image?: MedicalImagePayload
): TriageState {
  const now = new Date().toISOString();
  const traceId = `TRACE-${Date.now()}`;

  const initialTraceLog: PipelineTraceLog = {
    traceId,
    patientId: patientProfile.id,
    startTime: now,
    totalDurationMs: 0,
    nodeTraces: [],
    finalValidationPassed: false
  };

  return {
    id: `TRIAGE-${Date.now()}`,
    timestamp: now,
    patientProfile,
    inputs: {
      rawTranscript,
      inputLanguage,
      vitals,
      rawLabs,
      image
    },
    currentStep: 'IDLE',
    traceLog: initialTraceLog
  };
}
