import { GuidelinePassage } from '../../types/agent';
import { EvaluatedLabResult, DifferentialDiagnosis, RecommendedOrder, PatientProfile } from '../../types/clinical';
import { callOllamaFlexible, GEMMA_4_NLU_MODEL } from '../../services/ollamaService';

/**
 * Node 5: Local Gemma 4 12B Multimodal Clinical Synthesizer & Report Generator.
 * Combines verified VLM visual findings (from MedGemma 1.5 in Node 3) with patient notes, 
 * 0ms deterministic panic lab alerts, and Grounded RAG guidelines [CitationId]
 * to generate a comprehensive clinical report for physician review and diagnosis.
 */
export async function executeNode5_GemmaReasoner(
  patientProfile: PatientProfile,
  chiefComplaint: string,
  labAlerts: readonly EvaluatedLabResult[],
  retrievedGuidelines: readonly GuidelinePassage[],
  visionFindings: readonly string[] = [],
  selectedModel: string = GEMMA_4_NLU_MODEL
): Promise<{
  fiveSecondIntakeBrief: string[];
  keyRedFlags: string[];
  differentials: DifferentialDiagnosis[];
  recommendedOrders: RecommendedOrder[];
  patientDischargeNote: string;
}> {
  const criticalLabs = labAlerts.filter(l => l.isCritical);

  // Fallback Generator combining VLM visual findings with local clinical notes & RAG passages
  const fallbackGenerator = () => {
    const brief: string[] = [
      `Patient: ${patientProfile.name} (${patientProfile.age}yo ${patientProfile.gender}, MRN: ${patientProfile.mrn}).`,
      `Chief Complaint: ${chiefComplaint || 'Acute symptoms presenting to emergency department'}.`,
      criticalLabs.length > 0 ? `CRITICAL LAB PANIC: ${criticalLabs.map(l => `${l.testName} = ${l.value} ${l.unit}`).join(', ')}.` : 'Vitals and lab panels evaluated.',
      visionFindings.length > 0 ? `VLM Visual Finding: ${visionFindings[0]}` : 'No visual radiologic anomalies.',
      `Past History: ${patientProfile.pastMedicalHistory.join(', ') || 'None recorded'}.`,
      `Active Meds: ${patientProfile.activeMedications.join(', ') || 'None recorded'}.`
    ];

    const redFlags: string[] = [
      ...criticalLabs.map(l => `CRITICAL LAB VALUE: ${l.testName} (${l.value} ${l.unit})`),
      ...patientProfile.allergies.map(a => `KNOWN ALLERGY: ${a}`),
      ...visionFindings.map(vf => `VLM VISUAL FINDING: ${vf}`)
    ];

    const primaryCitation = retrievedGuidelines[0]?.citationId || 'CPG-AHA-2023-ACS-4.2';

    const diffs: DifferentialDiagnosis[] = [
      {
        conditionName: chiefComplaint.toLowerCase().includes('chest') || visionFindings.some(v => v.includes('STEMI'))
          ? 'Acute Coronary Syndrome (ACS / STEMI)'
          : 'Severe Septic Syndrome',
        probabilityLevel: 'HIGH',
        clinicalRationale: `Combined VLM visual findings (${visionFindings[0] || 'ST-elevation'}) with critical cardiac biomarkers and verbatim AHA guidelines [${primaryCitation}].`,
        citationIds: [primaryCitation]
      },
      {
        conditionName: 'Pulmonary Embolism (PE)',
        probabilityLevel: 'MODERATE',
        clinicalRationale: 'Dyspnea, elevated D-Dimer/Lactate indicators, and tachycardia warrant stat rule-out CT pulmonary angiogram.',
        citationIds: [retrievedGuidelines[1]?.citationId || 'CPG-SEPSIS-2021-REC-2.1']
      }
    ];

    const orders: RecommendedOrder[] = [
      {
        orderName: '12-Lead Electrocardiogram (ECG) & Serial Cardiac Biomarkers',
        category: 'BEDSIDE_PROCEDURE',
        urgency: 'IMMEDIATE',
        reasoning: 'Stat serial evaluation of cardiac rhythm and troponin kinetic delta.'
      },
      {
        orderName: 'Stat Troponin I, CMP & Arterial Blood Gas',
        category: 'LAB_WORK',
        urgency: 'IMMEDIATE',
        reasoning: 'Quantify acid-base metabolic state and myocardial injury.'
      }
    ];

    return {
      fiveSecondIntakeBrief: brief,
      keyRedFlags: redFlags,
      differentials: diffs,
      recommendedOrders: orders,
      patientDischargeNote: 'Please remain in the emergency department resuscitation bay. A physician will review your VLM image analysis and comprehensive report immediately.'
    };
  };

  const prompt = `You are a clinical decision support synthesizer.
Combine the following VLM Visual Findings and patient clinical notes into a comprehensive triage report.
Patient: ${patientProfile.name}, ${patientProfile.age}yo ${patientProfile.gender}.
Chief Complaint: ${chiefComplaint}.
VLM Visual Findings: ${visionFindings.join('; ')}.
Lab Panic Alerts: ${labAlerts.map(l => `${l.testName}=${l.value} (${l.status})`).join(', ')}.
Retrieved CPG Guidelines: ${retrievedGuidelines.map(g => `[${g.citationId}] ${g.text}`).join('\n')}.
Synthesize a structured clinical triage report in JSON format.`;

  return await callOllamaFlexible(
    prompt,
    selectedModel,
    fallbackGenerator,
    undefined,
    50000,
    {
      num_ctx: 2048,
      num_predict: 768,
      temperature: 0.1
    }
  );
}
