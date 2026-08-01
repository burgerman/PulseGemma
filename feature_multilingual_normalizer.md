# 🌐 Feature Specification: Multilingual Normalizer Engine
### PulseGemma Node 1 — Patient Intake Translation & Structuring

> **"Sub-second translation and clinical structuring of patient-reported symptoms in 20+ languages, grounded through local Gemma reasoning — zero manual transcription required."**

---

## 📋 1. Problem & Clinical Objective

In homecare and emergency settings, patients frequently describe symptoms in their native language, using colloquial phrasing rather than clinical terminology. Healthcare workers without translation support either lose critical detail, delay care while sourcing an interpreter, or misinterpret severity due to language barriers.

Unlike deterministic numerical checks, translation and clinical structuring require **natural language understanding** — this is the one node in the pipeline where Gemma's reasoning is appropriate and necessary, rather than a risk. The **Multilingual Normalizer Engine** converts raw patient input (any language, spoken or typed) into structured, standardized English medical data in a single pass, while flagging red-flag terms for immediate escalation.

---

## 🏗️ 2. Module Architecture & File Locations

```
PulseGemma/src/
├── types/agent.ts                    # NormalizedIntake schema
├── services/ollamaService.ts         # Local Ollama (gemma2:2b) client
├── agent/nodes/node1_normalizer.ts   # Node 1 pipeline function
└── components/PatientIntakeForm.tsx  # Voice/text input panel & result display
```

---

## 📐 3. Technical Data Schemas (`src/types/agent.ts`)

```typescript
export interface NormalizedIntake {
  readonly detectedLanguage: string;
  readonly translatedText: string;
  readonly chiefComplaint: string;
  readonly symptomDuration: string;
  readonly severity: 'mild' | 'moderate' | 'severe' | '';
  readonly locationOnBody: string;
  readonly associatedSymptoms: readonly string[];
  readonly urgentFlag: boolean;
}
```

---

## ⚙️ 4. Node Implementation (`src/agent/nodes/node1_normalizer.ts`)

```typescript
import { callOllama } from '../../services/ollamaService';
import { NormalizedIntake } from '../../types/agent';

/**
 * Translates and structures raw patient input into standardized clinical fields.
 * @param patientInput Raw patient-reported symptom description, any language.
 * @returns NormalizedIntake containing translation, structured fields, and urgency flag.
 * @clinical_safety Uses Gemma reasoning for language/NLU tasks only. All numerical
 * or threshold-based safety checks are deferred to Node 2 (deterministic, zero LLM).
 */
export async function node1_normalizer(patientInput: string): Promise<NormalizedIntake> {
  const prompt = `You are a clinical intake assistant. The patient wrote the following message,
possibly in a language other than English.

1. Detect the language.
2. Translate it into clear English.
3. Extract these fields if present: chief_complaint, symptom_duration,
   severity (mild/moderate/severe), location_on_body, associated_symptoms.
4. Flag red-flag terms (chest pain, difficulty breathing, severe bleeding,
   confusion, one-sided weakness) as "urgent_flag": true.

Respond ONLY in this JSON format:
{
  "detected_language": "",
  "translated_text": "",
  "chief_complaint": "",
  "symptom_duration": "",
  "severity": "",
  "location_on_body": "",
  "associated_symptoms": [],
  "urgent_flag": false
}

Patient message: "${patientInput}"`;

  const result = await callOllama(prompt);
  return result as NormalizedIntake;
}
```

---

## 🎨 5. UI Component Behavior (`src/components/PatientIntakeForm.tsx`)

- **Input Panel**: Text area (voice dictation deferred to a later node/feature) accepting free-text patient input in any language.
- **Result Card**:
  - Displays `translatedText` as the primary readable summary.
  - Renders `chiefComplaint`, `symptomDuration`, `severity`, `locationOnBody`, and `associatedSymptoms` as labeled fields.
  - `detectedLanguage` shown as a small badge (e.g. `[ES]`, `[FR]`).
- **Urgent Flag Banner**:
  - `urgentFlag: true` → Pulsing Red Banner (`#DC2626`) with text tag `[URGENT — ESCALATE]`.
  - `urgentFlag: false` → No banner shown.

---

## 🧪 6. Verification & Test Plan

1. **Language Coverage Tests**:
   - Spanish: `"Me duele mucho el pecho desde ayer, no puedo respirar bien"` → `detected_language: "es"`, `urgent_flag: true` (chest pain + breathing difficulty).
   - French: `"J'ai mal à la tête depuis trois jours"` → `detected_language: "fr"`, `urgent_flag: false`.
   - Broken English: `"stomach hurt bad two day, no eat"` → `chief_complaint: "stomach pain"`, `symptom_duration: "2 days"`.
2. **Malformed Output Handling**:
   - If Gemma wraps output in markdown fences or returns invalid JSON, `ollamaService.ts` MUST strip fences and throw a caught, loggable error rather than crashing the UI.
3. **Performance SLA**:
   - End-to-end call (Ollama inference + parse) SHOULD complete in `< 3s` on local `gemma2:2b` for a single patient message.
