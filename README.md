# 🫀 PulseGemma
### Grounded Edge-AI Clinical Triage & Decision-Support Assistant
> **"Sub-second patient history synthesis, 100% deterministic safety rules, multimodal vision scanning, hands-free voice dictation, and multilingual clinical translation—powered by local Gemma 4 12B models on the edge."**

[![GitHub Repository](https://img.shields.io/badge/GitHub-burgerman%2FPulseGemma-blue?logo=github)](https://github.com/burgerman/PulseGemma.git)
[![Target Platform](https://img.shields.io/badge/Platform-Local%20Edge%20%2F%20Offline%20First-emerald)](#-architecture-overview)
[![AI Foundation](https://img.shields.io/badge/AI-Ollama%20%2B%20Gemma%204%2012B-orange)](#-grounded-ai--gemma-integration)
[![Safety Philosophy](https://img.shields.io/badge/Safety-Deterministic%20Safety%20First-red)](#-clinical-safety--non-chatbot-philosophy)

---

## 📋 Executive Overview

In emergency medical settings, **seconds save lives, but information overload paralyzes clinicians**. Emergency Department (ED) nurses and physicians are routinely swamped with multi-page Electronic Health Records (EHRs), complex lab panels, radiology notes, paper printouts, and language barriers—all while needing to assign accurate **Emergency Severity Index (ESI)** triage scores under severe time pressure.

**PulseGemma** is a production-grade, edge-deployed clinical assistant built for healthcare workers. Powered locally by **Ollama Gemma 4 12B**, PulseGemma rejects the unsafe "probabilistic chatbot" approach. Instead, it pairs **100% deterministic client-side rule engines** (for reference ranges and validated clinical scoring) with **grounded language, vision, and translation AI** operating strictly over authoritative clinical practice guidelines (CPGs) and patient data.

---

## 🎯 Dual Core Pillars

```
                               ┌─────────────────────────────────────────┐
                               │           PulseGemma Platform           │
                               └────────────────────┬────────────────────┘
                                                    │
                   ┌────────────────────────────────┴────────────────────────────────┐
                   ▼                                                                 ▼
┌─────────────────────────────────────┐                           ┌─────────────────────────────────────┐
│             PILLAR 1                │                           │             PILLAR 2                │
│    Instant Patient History &        │                           │  Deterministic Triage & Clinical    │
│        Triage Summarizer            │                           │     Decision-Support Assistant      │
├─────────────────────────────────────┤                           ├─────────────────────────────────────┤
│ • 5-Second EHR Intake Brief         │                           │ • ESI v4 Decision Tree Engine       │
│ • Key Red Flags & Allergy Alerts    │                           │ • Deterministic Lab Range Checker   │
│ • Active Meds & Drug Interaction    │                           │ • qSOFA / Wells / TIMI Calculators  │
│ • Multimodal Vision Lab Sheet OCR   │                           │ • Evidence-Backed Differentials     │
│ • Multilingual Patient Voice Input  │                           │ • Clickable Guideline Citations     │
│ • Real-Time Clinical Translation    │                           │ • Native-Language Patient Discharge │
└─────────────────────────────────────┘                           └─────────────────────────────────────┘
```

### Pillar 1: Instant Patient History & Triage Summarizer
- **5-Second EHR Intake Brief**: Transforms complex past medical records into a clean, 5-point clinical snapshot for incoming shift staff.
- **Red Flag Extractor**: Pulls forward critical risk factors (e.g. *History of CABG*, *Current Anticoagulant Use*, *Anaphylactic Penicillin Allergy*).
- **Multimodal Lab Sheet OCR (Gemma 4 Vision)**: Allows nurses to snap a photo of paper lab printouts or ECG strips, extracting structured data into the digital intake flow.
- **Multilingual Voice & Oral Symptom Intake**: Enables patients with Limited English Proficiency (LEP) to speak or type in their native language (Spanish, Mandarin, Cantonese, Arabic, Vietnamese, Tagalog, Hindi, French, etc.). Gemma 4 12B automatically translates spoken symptoms into standardized English clinical terminology for medical staff, and can output patient instructions back in their native language.

### Pillar 2: Deterministic Triage & Decision-Support Assistant
- **0% Hallucination Safety Engine**: Hardcoded TypeScript algorithms evaluate numerical reference ranges (Troponin, Lactate, Potassium, WBC) and validated scoring systems (qSOFA for Sepsis, Wells Score for PE) with zero model guesswork.
- **ESI v4 Flowchart Engine**: Evaluates patient vitals and chief complaints against ESI level criteria (Levels 1–5), reducing human error under pressure.
- **Grounded Guideline Correlation (RAG)**: Cross-references patient presentation against local clinical practice guidelines (AHA Chest Pain Protocol, Surviving Sepsis Campaign) with **direct, clickable citations**.

---

## 📄 Key Feature Specification Blueprints

1. 🔴 **[Deterministic Range Checker Engine](feature_deterministic_range_checker.md)**: 0ms client-side calculation of critical high/low lab thresholds with 0% model guesswork.
2. 🎙️ **[Hands-Free Voice Dictation & Symptom NLU](feature_handsfree_voice_dictation.md)**: Real-time speech-to-text in 20+ languages with Gemma 4 12B structured clinical entity extraction.
3. 📚 **[Grounded CPG RAG Retrieval Engine](feature_grounded_cpg_rag.md)**: Local RAG retrieval matching patient findings against verbatim Emergency Clinical Practice Guidelines (AHA, Sepsis, ESI v4).

---

## 🏛️ System Architecture

```
                  ┌─────────────────────────────────────────────────┐
                  │                 PATIENT INPUTS                  │
                  └────────────────────────┬────────────────────────┘
                                           │
        ┌──────────────────────────────────┼──────────────────────────────────┐
        ▼                                  ▼                                  ▼
 ┌──────────────┐                 ┌──────────────────┐               ┌─────────────────┐
 │ Structured   │                 │ Gemma 4 Vision   │               │ Multilingual    │
 │ Labs & Vitals│                 │ (X-Ray / Lab OCR)│               │ Voice & Speech  │
 └──────┬───────┘                 └────────┬─────────┘               └────────┬────────┘
        │                                  │                                  │
        └──────────────────────────────────┼──────────────────────────────────┘
                                           │
                                           ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. Multilingual Translation & Medical Entity Normalizer (Gemma 4 12B)  │
 │    - Translates non-English symptoms to English clinical terms.        │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. 100% Deterministic Rule Engine (TypeScript Client Code)              │
 │    - Evaluates lab ranges, ESI v4 Decision Tree, & qSOFA Sepsis score.  │
 │    - Zero model involved; 0ms latency, 0% chance of hallucination.     │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │ (Deterministic Flags & Scores)
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. Ground-Truth Knowledge Store (Verified Clinical Guidelines)          │
 │    - Verbatim CPGs: AHA Chest Pain Guidelines, Surviving Sepsis, ESI v4.│
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │ (Strict Guideline Context)
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 4. Gemma 4 12B Edge Reasoning Engine                                   │
 │    - Synthesizes findings ONLY from steps 2 & 3.                       │
 │    - Generates English clinical brief & Native-Language patient notes. │
 │    - Every recommendation requires a clickable [Source Citation].      │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Clinical Safety & Non-Chatbot Philosophy

Healthcare applications must not be built as conversational chatbots. Language models operate on statistical next-token probabilities, which is fundamentally unsafe when determining medical dosages, triage urgency, or critical lab thresholds.

**PulseGemma enforces a strict safety boundary**:
1. **Hard Mathematical Facts**: Calculated strictly by deterministic code (TypeScript).
2. **Grounded Reasoning**: Gemma 4 12B is restricted to organizing and explaining facts derived from step 1 and retrieved ground-truth guidelines.
3. **Human-in-the-Loop Governance**: Formatted as **Clinical Decision Support (CDS)**—the final clinical judgment always rests with the attending healthcare professional.

---

## 🛠️ Tech Stack & Prerequisites

* **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Lucide Icons.
* **Audio Engine**: Web Speech API (`SpeechRecognition`) with multilingual language selection (20+ languages).
* **Translation Core**: Gemma 4 12B Multilingual NLU for medical term normalization.
* **Deterministic Engine**: Custom TypeScript Clinical Calculators (qSOFA, Wells, TIMI, ESI v4).
* **AI Core**: Ollama local API (`gemma4:12b`) with fallback offline engine.

### Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/burgerman/PulseGemma.git
cd PulseGemma

# 2. Install dependencies
npm install

# 3. Pull & Run Ollama Gemma 4 12B locally
ollama run gemma4:12b

# 4. Start local development server
npm run dev
```

---

## 📜 License & Disclaimer

**Disclaimer**: *PulseGemma is an experimental AI-edge tool designed strictly for research, hackathon demonstration, and clinical decision support prototyping. It does not replace professional medical judgment, diagnosis, or treatment.*
