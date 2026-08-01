import { GuidelinePassage } from '../types/agent';

export const GUIDELINES_REGISTRY: readonly GuidelinePassage[] = [
  {
    citationId: 'CPG-AHA-2023-ACS-4.2',
    sourceTitle: 'AHA/ACC 2023 Guidelines for Evaluation of Acute Chest Pain',
    section: 'Section 4.2: High-Sensitivity Cardiac Troponin Triage',
    text: 'Patients presenting with acute chest pain and elevated Cardiac Troponin I > 0.04 ng/mL or ST-segment deviations require immediate 12-lead ECG, telemetry monitoring, and urgent cardiology consultation for suspected Acute Coronary Syndrome.',
    keywords: ['troponin', 'chest pain', 'myocardial infarction', 'acs', 'stemi', 'cardiac', 'ecg']
  },
  {
    citationId: 'CPG-SEPSIS-2021-REC-2.1',
    sourceTitle: 'Surviving Sepsis Campaign International Guidelines 2021',
    section: 'Section 2.1: Sepsis Screening & Lactate Protocol',
    text: 'For patients with suspected infection and qSOFA score >= 2 (systolic BP <= 100 mmHg, respiratory rate >= 22 breaths/min, altered mental status) or serum lactate > 2.0 mmol/L, administer 30 mL/kg IV crystalloid fluid resuscitation within 3 hours and obtain blood cultures prior to broad-spectrum antimicrobial therapy.',
    keywords: ['sepsis', 'lactate', 'qsofa', 'fever', 'hypotension', 'wbc', 'infection', 'bacteremia']
  },
  {
    citationId: 'CPG-ESI-V4-TRIAGE-MANUAL',
    sourceTitle: 'Emergency Severity Index (ESI) v4 Implementation Handbook',
    section: 'Chapter 2: ESI Level 2 High-Risk Criteria',
    text: 'ESI Level 2 includes patients in high-risk situations (e.g. active chest pain, stroke symptoms, acute severe headache, systemic infection risk, severe pain score >= 7, or critical lab alerts). These patients must be placed in a treatment area immediately.',
    keywords: ['esi', 'triage', 'level 2', 'high risk', 'critical lab', 'severe pain']
  },
  {
    citationId: 'CPG-ACEP-HYPERKALEMIA-2022',
    sourceTitle: 'ACEP Clinical Policy: Acute Hyperkalemia Management',
    section: 'Section 3: Emergency Potassium Management',
    text: 'Serum potassium (K+) >= 6.0 mEq/L constitutes a medical emergency. Immediate 12-lead ECG is required to assess for peaked T-waves or QRS widening. Administer IV Calcium Gluconate for cardiac membrane stabilization, followed by Insulin + Dextrose for intracellular potassium shift.',
    keywords: ['potassium', 'hyperkalemia', 'k+', 'peaked t-waves', 'calcium gluconate', 'insulin']
  },
  {
    citationId: 'CPG-ADA-DKA-PROTOCOL-2023',
    sourceTitle: 'ADA Emergency Management of Diabetic Ketoacidosis (DKA)',
    section: 'Section 1: DKA Diagnostic Criteria & Initial Fluids',
    text: 'DKA is characterized by blood glucose > 250 mg/dL, arterial pH < 7.30, serum bicarbonate < 18 mEq/L, and elevated anion gap. Initial emergency management requires aggressive IV normal saline hydration and continuous regular insulin infusion once potassium is >= 3.3 mEq/L.',
    keywords: ['dka', 'diabetic ketoacidosis', 'glucose', 'ph', 'bicarbonate', 'hco3', 'anion gap', 'insulin']
  }
];
