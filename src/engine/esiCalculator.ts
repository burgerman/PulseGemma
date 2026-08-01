import { PatientVitals, ESICalculationResult, EvaluatedLabResult } from '../types/clinical';

/**
 * Deterministic ESI v4 Decision Tree Calculator.
 * Evaluates vital sign stability, critical lab alerts, and resource needs.
 */
export function calculateESILevel(
  vitals: PatientVitals,
  labAlerts: readonly EvaluatedLabResult[]
): ESICalculationResult {
  const hasCriticalLab = labAlerts.some(l => l.isCritical);

  // ESI Level 1: Immediate Life-Saving Intervention Required
  if (
    vitals.oxygenSaturation < 88 ||
    vitals.systolicBP < 80 ||
    vitals.heartRate > 150 ||
    vitals.heartRate < 40
  ) {
    return {
      esiLevel: 1,
      levelName: 'Immediate Resuscitation',
      color: '#DC2626', // Red 600
      ruleId: 'ESI_RULE_1',
      decisionRationale: 'Unstable vital signs requiring immediate airway, defibrillation, or hemodynamic resuscitation.'
    };
  }

  // ESI Level 2: High Risk / Severe Pain / Critical Lab Alert
  if (
    hasCriticalLab ||
    vitals.painScore >= 7 ||
    vitals.oxygenSaturation < 92 ||
    vitals.systolicBP < 90 ||
    vitals.temperature > 39.5
  ) {
    return {
      esiLevel: 2,
      levelName: 'Emergent / High Risk',
      color: '#EA580C', // Orange 600
      ruleId: 'ESI_RULE_2',
      decisionRationale: 'High-risk situation, critical laboratory alert (e.g. Troponin/Potassium leak), or severe pain score >= 7.'
    };
  }

  // ESI Level 3: Multiple Resources Required (Labs + Imaging) with Stable Vitals
  if (vitals.painScore >= 4 || vitals.temperature > 38.0 || labAlerts.length > 0) {
    return {
      esiLevel: 3,
      levelName: 'Urgent (Multiple Resources)',
      color: '#CA8A04', // Yellow 600
      ruleId: 'ESI_RULE_3',
      decisionRationale: 'Patient requires 2 or more ER resources (Labs + Imaging + Medications) with stable vital signs.'
    };
  }

  // ESI Level 4: One Resource Required
  if (vitals.painScore > 0) {
    return {
      esiLevel: 4,
      levelName: 'Less Urgent',
      color: '#2563EB', // Blue 600
      ruleId: 'ESI_RULE_4',
      decisionRationale: 'Patient requires 1 resource (e.g., single X-ray or simple prescription).'
    };
  }

  // ESI Level 5: Non-Urgent
  return {
    esiLevel: 5,
    levelName: 'Non-Urgent',
    color: '#059669', // Emerald 600
    ruleId: 'ESI_RULE_5',
    decisionRationale: 'Patient requires exam or prescription refill only with zero ER resources needed.'
  };
}
