export type LabCategory = 'CARDIAC' | 'METABOLIC' | 'HEMATOLOGY' | 'BLOOD_GAS' | 'INFLAMMATORY';

export type LabStatus = 'CRITICAL_HIGH' | 'CRITICAL_LOW' | 'ABNORMAL_HIGH' | 'ABNORMAL_LOW' | 'NORMAL';

export interface ReferenceRange {
  readonly testId: string;
  readonly testName: string;
  readonly category: LabCategory;
  readonly unit: string;
  readonly normalMin: number;
  readonly normalMax: number;
  readonly criticalMin?: number;
  readonly criticalMax?: number;
}

export interface EvaluatedLabResult {
  readonly testId: string;
  readonly testName: string;
  readonly category: LabCategory;
  readonly value: number;
  readonly unit: string;
  readonly status: LabStatus;
  readonly isCritical: boolean;
  readonly referenceMin: number;
  readonly referenceMax: number;
  readonly deviationPercentage: number;
}

export interface PatientVitals {
  readonly heartRate: number;         // bpm
  readonly systolicBP: number;        // mmHg
  readonly diastolicBP: number;       // mmHg
  readonly oxygenSaturation: number;  // %
  readonly temperature: number;       // °C
  readonly respiratoryRate: number;   // breaths/min
  readonly painScore: number;         // 0 - 10 scale
}

export interface MedicalImagePayload {
  readonly id: string;
  readonly title: string;
  readonly category: 'XRAY' | 'LAB_SHEET_PHOTO' | 'ECG_STRIP';
  readonly base64Data?: string;
  readonly sampleUrl?: string;
  readonly timestamp: string;
  readonly fileName?: string;
  readonly fileSizeMb?: number;
}

export type ESILevel = 1 | 2 | 3 | 4 | 5;

export interface ESICalculationResult {
  readonly esiLevel: ESILevel;
  readonly levelName: 'Immediate Resuscitation' | 'Emergent / High Risk' | 'Urgent (Multiple Resources)' | 'Less Urgent' | 'Non-Urgent';
  readonly color: string;
  readonly ruleId: string;
  readonly decisionRationale: string;
}

export interface DifferentialDiagnosis {
  readonly conditionName: string;
  readonly probabilityLevel: 'HIGH' | 'MODERATE' | 'LOW';
  readonly clinicalRationale: string;
  readonly citationIds: readonly string[];
}

export interface RecommendedOrder {
  readonly orderName: string;
  readonly category: 'STAT_IMAGING' | 'LAB_WORK' | 'BEDSIDE_PROCEDURE' | 'MEDICATION';
  readonly urgency: 'IMMEDIATE' | 'PRIORITY' | 'ROUTINE';
  readonly reasoning: string;
}

export interface PatientProfile {
  readonly id: string;
  readonly name: string;
  readonly age: number;
  readonly gender: 'MALE' | 'FEMALE';
  readonly mrn: string;
  readonly allergies: readonly string[];
  readonly pastMedicalHistory: readonly string[];
  readonly activeMedications: readonly string[];
}
