import { PatientVitals } from '../types/clinical';

/**
 * Pure 100% deterministic calculation of qSOFA (Sepsis) score.
 * qSOFA criteria (0 to 3 points):
 * 1. Systolic BP <= 100 mmHg (+1)
 * 2. Respiratory Rate >= 22 breaths/min (+1)
 * 3. Altered Mental Status / High Pain Distress (+1)
 */
export function calculateQSOFA(vitals: PatientVitals): number {
  let score = 0;
  if (vitals.systolicBP <= 100) score += 1;
  if (vitals.respiratoryRate >= 22) score += 1;
  if (vitals.painScore >= 8 || vitals.temperature >= 39.0) score += 1;
  return score;
}

/**
 * Pure 100% deterministic calculation of Wells PE score.
 */
export function calculateWellsScore(vitals: PatientVitals, symptoms: readonly string[]): number {
  let score = 0;
  if (vitals.heartRate > 100) score += 1.5;
  if (vitals.oxygenSaturation < 92) score += 1.5;
  if (symptoms.some(s => s.toLowerCase().includes('hemoptysis') || s.toLowerCase().includes('coughing blood'))) score += 1.0;
  return score;
}
