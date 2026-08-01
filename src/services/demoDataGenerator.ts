import { PatientProfile, PatientVitals, MedicalImagePayload } from '../types/clinical';

export interface DemoDataSet {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly patientProfile: PatientProfile;
  readonly vitals: PatientVitals;
  readonly rawLabs: Record<string, number>;
  readonly rawTranscript: string;
  readonly inputLanguage: string;
  readonly image?: MedicalImagePayload;
}

export const DEMO_DATA_SETS: DemoDataSet[] = [
  {
    id: 'DEMO_STEMI',
    name: '🫀 Demo 1: ACS Chest Pain (Spanish)',
    category: 'CARDIAC EMERGENCY',
    description: 'Demonstrates Spanish voice dictation, Troponin I panic limit check, 12-lead ECG STEMI scan, and AHA 2023 guideline RAG grounding.',
    patientProfile: {
      id: 'DEMO_P1',
      name: 'Carlos Mendoza',
      age: 56,
      gender: 'MALE',
      mrn: 'MRN-DEMO-01',
      allergies: ['Penicillin (Anaphylaxis)'],
      pastMedicalHistory: ['Hypertension', 'Type 2 Diabetes'],
      activeMedications: ['Aspirin 81mg', 'Metformin 500mg']
    },
    vitals: {
      heartRate: 112,
      systolicBP: 158,
      diastolicBP: 96,
      oxygenSaturation: 94,
      temperature: 37.0,
      respiratoryRate: 22,
      painScore: 9
    },
    rawLabs: {
      TROPONIN_I: 0.92,
      BNP: 340,
      D_DIMER: 480,
      POTASSIUM: 4.4,
      SODIUM: 138,
      GLUCOSE: 156
    },
    rawTranscript: 'Tengo un dolor sordo y muy fuerte en el centro del pecho que se extiende hacia el cuello y el brazo izquierdo.',
    inputLanguage: 'es',
    image: {
      id: 'IMG_ECG_DEMO',
      title: '12-Lead ECG Strip (Anterior STEMI)',
      category: 'ECG_STRIP',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'DEMO_SEPSIS',
    name: '🔥 Demo 2: Severe Septic Shock (Chinese)',
    category: 'INFECTIOUS EMERGENCY',
    description: 'Demonstrates Chinese oral symptom dictation, qSOFA score = 3, Blood Lactate = 4.2 mmol/L, Chest X-Ray lobar pneumonia scan, and Surviving Sepsis 2021 RAG grounding.',
    patientProfile: {
      id: 'DEMO_P2',
      name: 'Li Wei',
      age: 68,
      gender: 'FEMALE',
      mrn: 'MRN-DEMO-02',
      allergies: ['Sulfa Drugs'],
      pastMedicalHistory: ['COPD', 'Hypertension'],
      activeMedications: ['Tiotropium Bromide', 'Amlodipine 5mg']
    },
    vitals: {
      heartRate: 128,
      systolicBP: 84,
      diastolicBP: 50,
      oxygenSaturation: 88,
      temperature: 39.6,
      respiratoryRate: 30,
      painScore: 7
    },
    rawLabs: {
      LACTATE: 4.2,
      WBC: 19.2,
      CREATININE: 2.6,
      PH: 7.26,
      HCO3: 15
    },
    rawTranscript: '发高烧39.6度，呼吸急促咳嗽，头晕浑身发冷，站都站不稳。',
    inputLanguage: 'zh',
    image: {
      id: 'IMG_XRAY_DEMO',
      title: 'Chest X-Ray (Lobar Consolidation)',
      category: 'XRAY',
      timestamp: new Date().toISOString()
    }
  }
];
