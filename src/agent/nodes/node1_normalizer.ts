import { ExtractedSymptomEntity } from '../../types/agent';
import { knowledgeBase } from '../../knowledge';

/**
 * Node 1: Multilingual Translation & Symptom Entity Normalizer.
 * Maps non-English spoken or typed symptoms to standard English clinical entities.
 */
export async function executeNode1_Normalizer(
  rawTranscript: string = '',
  languageCode: string = 'en'
): Promise<ExtractedSymptomEntity> {
  const transcriptLower = rawTranscript.toLowerCase();

  // 1. Check Lexicon Dictionary for direct match
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
  }

  const translatedEnglishSummary = lexiconMatch 
    ? `${lexiconMatch.clinicalTerm} located at ${lexiconMatch.anatomicalSite}.` 
    : `Patient reports: ${chiefComplaint} (Severity: ${severity}/10).`;

  return {
    chiefComplaint,
    anatomicalLocation: location,
    painQuality: quality,
    severityScore1To10: severity,
    onsetHoursAgo: onsetHours,
    associatedSymptoms: associated,
    detectedLanguage: languageCode,
    translatedEnglishSummary
  };
}
