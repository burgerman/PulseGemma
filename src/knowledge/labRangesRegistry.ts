import { ReferenceRange } from '../types/clinical';

export const LAB_RANGES_REGISTRY: Record<string, ReferenceRange> = {
  // Cardiac Markers
  TROPONIN_I: {
    testId: 'TROPONIN_I',
    testName: 'Cardiac Troponin I',
    category: 'CARDIAC',
    unit: 'ng/mL',
    normalMin: 0.00,
    normalMax: 0.04,
    criticalMax: 0.04
  },
  BNP: {
    testId: 'BNP',
    testName: 'B-Type Natriuretic Peptide (BNP)',
    category: 'CARDIAC',
    unit: 'pg/mL',
    normalMin: 0,
    normalMax: 100,
    criticalMax: 400
  },
  D_DIMER: {
    testId: 'D_DIMER',
    testName: 'D-Dimer Quantitative',
    category: 'CARDIAC',
    unit: 'ng/mL FEU',
    normalMin: 0,
    normalMax: 500,
    criticalMax: 1000
  },

  // Metabolic Panel
  POTASSIUM: {
    testId: 'POTASSIUM',
    testName: 'Serum Potassium (K+)',
    category: 'METABOLIC',
    unit: 'mEq/L',
    normalMin: 3.5,
    normalMax: 5.0,
    criticalMin: 2.8,
    criticalMax: 6.0
  },
  SODIUM: {
    testId: 'SODIUM',
    testName: 'Serum Sodium (Na+)',
    category: 'METABOLIC',
    unit: 'mEq/L',
    normalMin: 135,
    normalMax: 145,
    criticalMin: 120,
    criticalMax: 155
  },
  GLUCOSE: {
    testId: 'GLUCOSE',
    testName: 'Blood Glucose',
    category: 'METABOLIC',
    unit: 'mg/dL',
    normalMin: 70,
    normalMax: 110,
    criticalMin: 50,
    criticalMax: 250
  },
  CREATININE: {
    testId: 'CREATININE',
    testName: 'Serum Creatinine',
    category: 'METABOLIC',
    unit: 'mg/dL',
    normalMin: 0.6,
    normalMax: 1.2,
    criticalMax: 3.0
  },

  // Blood Gas & Inflammation
  LACTATE: {
    testId: 'LACTATE',
    testName: 'Blood Lactate',
    category: 'BLOOD_GAS',
    unit: 'mmol/L',
    normalMin: 0.5,
    normalMax: 2.0,
    criticalMax: 4.0
  },
  PH: {
    testId: 'PH',
    testName: 'Arterial pH',
    category: 'BLOOD_GAS',
    unit: '',
    normalMin: 7.35,
    normalMax: 7.45,
    criticalMin: 7.20,
    criticalMax: 7.60
  },
  HCO3: {
    testId: 'HCO3',
    testName: 'Bicarbonate (HCO3-)',
    category: 'BLOOD_GAS',
    unit: 'mEq/L',
    normalMin: 22,
    normalMax: 28,
    criticalMin: 15,
    criticalMax: 35
  },

  // Hematology
  WBC: {
    testId: 'WBC',
    testName: 'White Blood Cell Count (WBC)',
    category: 'HEMATOLOGY',
    unit: 'k/µL',
    normalMin: 4.5,
    normalMax: 11.0,
    criticalMin: 2.0,
    criticalMax: 20.0
  },
  HEMOGLOBIN: {
    testId: 'HEMOGLOBIN',
    testName: 'Hemoglobin (Hgb)',
    category: 'HEMATOLOGY',
    unit: 'g/dL',
    normalMin: 12.0,
    normalMax: 17.5,
    criticalMin: 7.0
  },
  PLATELETS: {
    testId: 'PLATELETS',
    testName: 'Platelet Count',
    category: 'HEMATOLOGY',
    unit: 'k/µL',
    normalMin: 150,
    normalMax: 450,
    criticalMin: 50
  }
};
