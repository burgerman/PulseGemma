import { PatientProfile, PatientVitals, MedicalImagePayload } from '../types/clinical';

export interface PresetEmergencyCase {
  readonly id: string;
  readonly title: string;
  readonly categoryBadge: string;
  readonly description: string;
  readonly patientProfile: PatientProfile;
  readonly vitals: PatientVitals;
  readonly rawLabs: Record<string, number>;
  readonly rawTranscript: string;
  readonly inputLanguage: string;
  readonly image?: MedicalImagePayload;
}

export const PRESET_EMERGENCY_CASES: PresetEmergencyCase[] = [
  {
    id: 'CASE_1_ACS_CHEST_PAIN',
    title: 'Acute Coronary Syndrome (ACS) / Chest Pain',
    categoryBadge: 'ESI LEVEL 2 - HIGH RISK',
    description: '58yo male with crushing substernal chest pressure radiating to left arm and elevated Cardiac Troponin I.',
    patientProfile: {
      id: 'PATIENT_101',
      name: 'Robert Vance',
      age: 58,
      gender: 'MALE',
      mrn: 'MRN-8849201',
      allergies: ['Penicillin (Anaphylaxis)'],
      pastMedicalHistory: ['Hypertension', 'Hyperlipidemia', 'CABG 2018'],
      activeMedications: ['Aspirin 81mg', 'Atorvastatin 40mg', 'Lisinopril 20mg']
    },
    vitals: {
      heartRate: 108,
      systolicBP: 154,
      diastolicBP: 94,
      oxygenSaturation: 95,
      temperature: 37.1,
      respiratoryRate: 22,
      painScore: 8
    },
    rawLabs: {
      TROPONIN_I: 0.85,
      BNP: 320,
      D_DIMER: 450,
      POTASSIUM: 4.6,
      SODIUM: 139,
      GLUCOSE: 142,
      WBC: 9.8
    },
    rawTranscript: 'I started having this heavy crushing weight on my chest about 2 hours ago. It radiates down my left arm and I feel really sweaty and lightheaded.',
    inputLanguage: 'en',
    image: {
      id: 'IMG_ECG_STEMI',
      title: '12-Lead ECG Strip (Anterior STEMI)',
      category: 'ECG_STRIP',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'CASE_2_SEVERE_SEPSIS',
    title: 'Severe Sepsis / Septic Shock',
    categoryBadge: 'ESI LEVEL 1 - CRITICAL',
    description: '67yo female with high fever, severe dyspnea, elevated blood lactate (4.2 mmol/L), and low blood pressure.',
    patientProfile: {
      id: 'PATIENT_102',
      name: 'Elena Rostova',
      age: 67,
      gender: 'FEMALE',
      mrn: 'MRN-4930129',
      allergies: ['Sulfa Drugs'],
      pastMedicalHistory: ['Type 2 Diabetes', 'Chronic Kidney Disease Stage 3'],
      activeMedications: ['Metformin 500mg', 'Warfarin 5mg']
    },
    vitals: {
      heartRate: 124,
      systolicBP: 88,
      diastolicBP: 54,
      oxygenSaturation: 89,
      temperature: 39.4,
      respiratoryRate: 28,
      painScore: 6
    },
    rawLabs: {
      LACTATE: 4.2,
      WBC: 18.5,
      CREATININE: 2.4,
      PH: 7.28,
      HCO3: 16,
      POTASSIUM: 5.8
    },
    rawTranscript: 'Tengo mucha fiebre y no puedo respirar bien desde la mañana. Me siento muy débil y confundida.',
    inputLanguage: 'es',
    image: {
      id: 'IMG_XRAY_PNEUMONIA',
      title: 'Chest X-Ray (Right Lower Lobe Opacity)',
      category: 'XRAY',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'CASE_3_HYPERKALEMIA',
    title: 'Severe Acute Hyperkalemia',
    categoryBadge: 'ESI LEVEL 2 - CRITICAL LAB',
    description: '62yo male with end-stage renal disease presenting with muscle weakness and critical Serum Potassium (K+ = 6.8 mEq/L).',
    patientProfile: {
      id: 'PATIENT_103',
      name: 'Marcus Chen',
      age: 62,
      gender: 'MALE',
      mrn: 'MRN-1940293',
      allergies: ['Contrast Dye'],
      pastMedicalHistory: ['End-Stage Renal Disease (ESRD)', 'Diabetes Mellitus'],
      activeMedications: ['Sevelamer 800mg', 'Insulin Glargine']
    },
    vitals: {
      heartRate: 52,
      systolicBP: 104,
      diastolicBP: 62,
      oxygenSaturation: 96,
      temperature: 36.8,
      respiratoryRate: 18,
      painScore: 4
    },
    rawLabs: {
      POTASSIUM: 6.8,
      SODIUM: 132,
      CREATININE: 5.2,
      HCO3: 17,
      GLUCOSE: 210,
      TROPONIN_I: 0.02
    },
    rawTranscript: '感觉全身上下都没力气，尤其是两条腿发麻。今天早上没能去做血液透析。',
    inputLanguage: 'zh',
    image: {
      id: 'IMG_LAB_PRINT',
      title: 'Printed Lab Report Photo (Critical K+ Alert)',
      category: 'LAB_SHEET_PHOTO',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'CASE_4_DKA',
    title: 'Diabetic Ketoacidosis (DKA)',
    categoryBadge: 'ESI LEVEL 2 - METABOLIC',
    description: '24yo female with Type 1 Diabetes, severe abdominal pain, nausea, blood glucose 380 mg/dL, and pH 7.22.',
    patientProfile: {
      id: 'PATIENT_104',
      name: 'Chloe Miller',
      age: 24,
      gender: 'FEMALE',
      mrn: 'MRN-7739102',
      allergies: ['None'],
      pastMedicalHistory: ['Type 1 Diabetes Mellitus'],
      activeMedications: ['Insulin Lispro', 'Insulin Degludec']
    },
    vitals: {
      heartRate: 116,
      systolicBP: 112,
      diastolicBP: 74,
      oxygenSaturation: 98,
      temperature: 37.6,
      respiratoryRate: 26,
      painScore: 7
    },
    rawLabs: {
      GLUCOSE: 380,
      PH: 7.22,
      HCO3: 12,
      POTASSIUM: 4.8,
      SODIUM: 134,
      LACTATE: 2.1
    },
    rawTranscript: 'I have intense cramping stomach pain and I keep throwing up. My blood sugar sensor is reading HI and I ran out of insulin cartridges yesterday.',
    inputLanguage: 'en'
  }
];
