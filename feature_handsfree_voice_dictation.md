# 🎙️ Feature Specification: Hands-Free Voice Dictation & Multilingual NLU
### PulseGemma Bedside Communication Feature (Gemma 4 12B)

> **"Real-time speech-to-text in 20+ languages with Gemma 4 12B structured clinical parameter extraction."**

---

## 📋 1. Problem & Clinical Objective

Triage nurses and emergency department patients often face physical barriers during intake: nurses dictating while performing procedures, or non-English speaking patients unable to complete written forms.

This feature provides **hands-free bedside oral symptom dictation** using browser-native Web Speech API and leverages **Ollama Gemma 4 12B Multilingual NLU** to convert natural spoken language in 20+ languages into structured clinical entities.

---

## 🏗️ 2. Module Architecture & File Locations

```
PulseGemma/src/
├── services/webSpeechService.ts      # Web Speech API wrapper with fallback handlers
├── agent/nodes/node1_normalizer.ts   # Gemma 4 12B Multilingual NLU symptom extractor
└── components/PatientIntakeForm.tsx  # Voice recording panel & waveform UI
```

---

## 🧠 3. Gemma 4 12B Symptom NLU Extractor (`src/agent/nodes/node1_normalizer.ts`)

Converts spoken audio transcripts in any language into standardized clinical fields:

```typescript
export interface ExtractedSymptomEntity {
  readonly chiefComplaint: string;
  readonly anatomicalLocation: string;
  readonly painQuality: string; // 'crushing' | 'sharp' | 'dull' | 'throbbing' | 'burning'
  readonly severityScore1To10: number;
  readonly onsetHoursAgo: number;
  readonly associatedSymptoms: readonly string[];
  readonly detectedLanguage: string;
  readonly translatedEnglishSummary: string;
}
```

### Prompt Schema Enforced on Gemma 4 12B (`gemma4:12b`):
> *"You are an emergency medical NLU parser powered by Gemma 4 12B. Extract clinical entities from the spoken transcript below. Translate non-English text to standard English clinical terms. Output JSON strictly matching the ExtractedSymptomEntity schema."*
