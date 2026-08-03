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
    : `Patient reports ${chiefComplaint.toLowerCase()} (${location}, severity: ${severity}/10).`;

  const doctorQuickSummaryFallback = `Patient presents with ${chiefComplaint.toLowerCase()} located at ${location.toLowerCase()} (rated ${severity}/10 pain). Key associated signs include ${associated.join(', ') || 'acute distress'}. Immediate physician evaluation recommended.`;

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

  // 2. Call Local Gemma 4 Model via Ollama for High-Precision Speech NLU & Doctor Summary Generation
  const prompt = `You are an expert Triage Clinical NLU AI powered by Gemma 4.
Your objective is to accurately capture the patient's oral complaints from their spoken speech-to-text transcript and generate a quick, precise, and clinically insightful summary for doctor review.

PATIENT TRANSCRIPT: "${rawTranscript}"
DETECTED LANGUAGE CODE: ${languageCode}

INSTRUCTIONS:
1. Translate non-English patient complaints into clear medical English.
2. Extract key clinical concepts: chief complaint, anatomical location, pain quality, 1-10 severity score, onset timing, and associated signs.
3. Formulate a 2-sentence "doctorQuickSummary":
   - Sentence 1: Concise presentation of the primary symptom, anatomical location, severity, and character.
   - Sentence 2: Key associated red-flag symptoms and immediate clinical concern for attending physician review.

Return ONLY a valid JSON object adhering strictly to this schema:
{
  "chiefComplaint": "string (e.g. Acute Substernal Chest Pain)",
  "anatomicalLocation": "string (e.g. Left Anterior Chest)",
  "painQuality": "string (e.g. Pressure / Crushing)",
  "severityScore1To10": number,
  "onsetHoursAgo": number,
  "associatedSymptoms": ["string"],
  "detectedLanguage": "${languageCode}",
  "translatedEnglishSummary": "Full English translation summary of patient words",
  "doctorQuickSummary": "2-sentence high-yield clinical summary tailored for attending physician review"
}`;

  return await callOllamaFlexible<ExtractedSymptomEntity>(
    prompt,
    modelName,
    () => fallbackResult,
    undefined,
    50000,
    {
      num_ctx: 1024,
      num_predict: 384,
      temperature: 0.1
    }
  );
}

