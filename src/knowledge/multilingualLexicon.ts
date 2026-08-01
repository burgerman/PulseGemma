export interface LexiconTranslationEntry {
  readonly rawPhrase: string;
  readonly languageCode: string;
  readonly clinicalTerm: string;
  readonly anatomicalSite: string;
  readonly category: 'PAIN' | 'BREATHING' | 'NEURO' | 'GI' | 'GENERAL';
}

export const MULTILINGUAL_LEXICON: Record<string, LexiconTranslationEntry> = {
  // Spanish (es)
  'dolor de pecho': {
    rawPhrase: 'dolor de pecho',
    languageCode: 'es',
    clinicalTerm: 'Acute Chest Pain',
    anatomicalSite: 'Substernal / Left Chest',
    category: 'PAIN'
  },
  'falta de aire': {
    rawPhrase: 'falta de aire',
    languageCode: 'es',
    clinicalTerm: 'Dyspnea / Shortness of Breath',
    anatomicalSite: 'Respiratory System',
    category: 'BREATHING'
  },
  'fiebre alta': {
    rawPhrase: 'fiebre alta',
    languageCode: 'es',
    clinicalTerm: 'High Pyrexia / Hyperthermia',
    anatomicalSite: 'Systemic',
    category: 'GENERAL'
  },
  'elefante en el pecho': {
    rawPhrase: 'elefante en el pecho',
    languageCode: 'es',
    clinicalTerm: 'Crushing Substernal Chest Pressure',
    anatomicalSite: 'Anterior Chest',
    category: 'PAIN'
  },

  // Chinese (zh)
  '胸痛': {
    rawPhrase: '胸痛',
    languageCode: 'zh',
    clinicalTerm: 'Chest Pain',
    anatomicalSite: 'Precordial Chest',
    category: 'PAIN'
  },
  '呼吸困难': {
    rawPhrase: '呼吸困难',
    languageCode: 'zh',
    clinicalTerm: 'Severe Dyspnea',
    anatomicalSite: 'Respiratory System',
    category: 'BREATHING'
  },
  '头晕': {
    rawPhrase: '头晕',
    languageCode: 'zh',
    clinicalTerm: 'Presyncope / Lightheadedness',
    anatomicalSite: 'Neurological',
    category: 'NEURO'
  },

  // French (fr)
  'douleur thoracique': {
    rawPhrase: 'douleur thoracique',
    languageCode: 'fr',
    clinicalTerm: 'Thoracic Pain',
    anatomicalSite: 'Chest Wall',
    category: 'PAIN'
  },
  'difficulte a respirer': {
    rawPhrase: 'difficulte a respirer',
    languageCode: 'fr',
    clinicalTerm: 'Respiratory Distress',
    anatomicalSite: 'Lungs',
    category: 'BREATHING'
  }
};
