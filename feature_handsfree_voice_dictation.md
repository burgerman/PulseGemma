# 🎙️ Feature Specification: Hands-Free Voice Dictation & Multilingual NLU
### PulseGemma Bedside Communication Feature

> **"Real-time speech-to-text in 20+ languages with Gemma 4 structured clinical parameter extraction."**

---

## 📋 1. Problem & Clinical Objective

Triage nurses and emergency department patients often face physical barriers during intake: nurses dictating while performing procedures, or non-English speaking patients unable to complete written forms.

This feature provides **hands-free bedside oral symptom dictation** using browser-native Web Speech API and leverages **Gemma 4 Multilingual NLU** to convert natural spoken language in 20+ languages into structured clinical entities.

---

## 🏗️ 2. Module Architecture & File Locations

```
PulseGemma/src/
├── services/webSpeechService.ts      # Web Speech API wrapper with fallback handlers
├── agent/nodes/node1_normalizer.ts   # Gemma 4 Multilingual NLU symptom extractor
└── components/PatientIntakeForm.tsx  # Voice recording panel & waveform UI
```

---

## 📐 3. Web Speech API Integration (`src/services/webSpeechService.ts`)

```typescript
export interface VoiceDictationOptions {
  language: string; // ISO Code (e.g. 'en-US', 'es-ES', 'zh-CN', 'ar-SA')
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
}

export class WebSpeechService {
  private recognition: any = null;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  public startListening(options: VoiceDictationOptions): void {
    if (!this.recognition) {
      options.onError('Web Speech API not supported in this browser. Falling back to text mode.');
      return;
    }

    this.recognition.lang = options.language;
    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      options.onResult(finalTranscript || interimTranscript, !!finalTranscript);
    };

    this.recognition.onerror = (event: any) => options.onError(event.error);
    this.recognition.start();
  }

  public stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
```

---

## 🧠 4. Gemma 4 Symptom NLU Extractor (`src/agent/nodes/node1_normalizer.ts`)

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

### Prompt Schema Enforced on Gemma 4:
> *"You are an emergency medical NLU parser. Extract clinical entities from the spoken transcript below. Translate non-English text to standard English clinical terms. Output JSON strictly matching the ExtractedSymptomEntity schema."*

---

## 🎨 5. UI Component Behavior (`src/components/PatientIntakeForm.tsx`)

- **Language Selector Dropdown**: 20+ supported languages (English, Spanish, Mandarin, Cantonese, Arabic, Vietnamese, Tagalog, Hindi, French, Russian, etc.).
- **Live Audio Waveform**: Visual canvas animation showing mic activity while listening.
- **Transcript Preview**: Displays real-time spoken text with auto-populated clinical fields (*Location, Severity 1-10, Onset*).

---

## 🧪 6. Verification & Test Plan

1. **Multilingual Test Cases**:
   - Audio input in Spanish: *"Me duele el pecho muy fuerte desde hace dos horas y tengo náuseas"* $\rightarrow$ Extracted: Chief Complaint = Chest Pain, Location = Substernal, Onset = 2h, Associated = Nausea.
2. **Speech API Fallback**:
   - Test seamless fallback to manual text typing if microphone access is blocked.
