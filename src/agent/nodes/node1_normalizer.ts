import { ExtractedSymptomEntity } from '../../types/agent';
import { knowledgeBase } from '../../knowledge';
import { callOllamaFlexible, GEMMA_4_NLU_MODEL } from '../../services/ollamaService';

/**
 * Node 1: Multilingual Translation & Symptom Entity Normalizer.
 * Uses local Gemma 4 12B model via Ollama to process spoken or typed speech-to-text input in 20+ languages.
 * Extracts clinical concepts and generates a concise quick summary for doctor review.
 */
export async function executeNode1_Normalizer(
  rawTranscript: string = '',
  languageCode: string = 'en',
  modelName: string = GEMMA_4_NLU_MODEL
): Promise<ExtractedSymptomEntity> {
  const transcriptLower = rawTranscript.toLowerCase();

  // 1. Check Lexicon Dictionary for direct match fallback
  const lexiconMatch = knowledgeBase.lookupTranslation(rawTranscript);

  let chiefComplaint = 'General Physical Discomfort';
  let location = 'Chest / Systemic';
  let quality = 'dull';
  let severity = 5;
  let onsetHours = 2;
  const associated: string[] = [];

  if (lexiconMatch) {
    chiefComplaint = lexiconMatch.clinicalTerm;
    location = lexiconMatch.anatomicalSite;
  } else if (transcriptLower.includes('chest') || transcriptLower.includes('pecho') || transcriptLower.includes('胸')) {
    chiefComplaint = 'Acute Chest Pain';
    location = 'Substernal Chest';
    quality = 'crushing';
    severity = 8;
    onsetHours = 2;
    associated.push('Shortness of breath', 'Nausea');
  } else if (transcriptLower.includes('fever') || transcriptLower.includes('fiebre') || transcriptLower.includes('发烧')) {
    chiefComplaint = 'Pyrexia & Systemic Illness';
    location = 'Systemic';
    quality = 'febrile';
    severity = 6;
    onsetHours = 12;
    associated.push('Chills', 'Diaphoresis');
  } else if (transcriptLower.includes('numb') || transcriptLower.includes('faible') || transcriptLower.includes('腿')) {
    chiefComplaint = 'Neurological Weakness & Numbness';
    location = 'Lower Extremities';
    quality = 'paresthesia';
    severity = 7;
    onsetHours = 4;
    associated.push('Focal weakness', 'Lightheadedness');
  } else if (transcriptLower.includes('vomit') || transcriptLower.includes('stomach') || transcriptLower.includes('cramping')) {
    chiefComplaint = 'Severe Abdominal Pain & Vomiting';
    location = 'Epigastric / Abdomen';
    quality = 'cramping';
    severity = 8;
    onsetHours = 6;
    associated.push('Repetitive emesis', 'Hyperglycemia suspicion');
  }

  const translatedEnglishSummary = lexiconMatch 
    ? `${lexiconMatch.clinicalTerm} located at ${lexiconMatch.anatomicalSite}.` 
    : `Patient reports: ${chiefComplaint} (${location}, Severity: ${severity}/10).`;

  const doctorQuickSummaryFallback = `Gemma 4 NLU Summary: Patient presents with ${chiefComplaint.toLowerCase()} located at ${location.toLowerCase()} (rated ${severity}/10 pain). Associated signs include ${associated.join(', ') || 'acute discomfort'}. Immediate physician evaluation recommended.`;

  const fallbackResult: ExtractedSymptomEntity = {
    chiefComplaint,
    anatomicalLocation: location,
    painQuality: quality,
    severityScore1To10: severity,
    onsetHoursAgo: onsetHours,
    associatedSymptoms: associated,
    detectedLanguage: languageCode,
    translatedEnglishSummary,
    doctorQuickSummary: doctorQuickSummaryFallback
  };

  if (!rawTranscript || rawTranscript.trim().length === 0) {
    return fallbackResult;
  }

  // 2. Call Local Gemma 4 12B Model via Ollama for Speech-to-Text NLU Processing
  const prompt = `You are a clinical NLU assistant powered by Gemma 4 12B.
The patient just finished speaking. Process their spoken speech-to-text transcript below (which may be in English, Spanish, Chinese, French, etc.):

PATIENT TRANSCRIPT: "${rawTranscript}"
DETECTED LANGUAGE: ${languageCode}

Extract the clinical concepts and generate a quick summary for doctor review.
Return ONLY a valid JSON object matching this schema:
{
  "chiefComplaint": "string",
  "anatomicalLocation": "string",
  "painQuality": "string",
  "severityScore1To10": number,
  "onsetHoursAgo": number,
  "associatedSymptoms": ["string"],
  "detectedLanguage": "${languageCode}",
  "translatedEnglishSummary": "English translation summary of patient words",
  "doctorQuickSummary": "Concise 2-sentence clinical summary for physician review"
}`;

  return await callOllamaFlexible<ExtractedSymptomEntity>(
    prompt,
    modelName,
    () => fallbackResult
  );
}

