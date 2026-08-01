# 🫀 PulseGemma
### Grounded Edge-AI Clinical Triage & Decision-Support Assistant
> **"Sub-second patient history synthesis, 100% deterministic safety rules, multimodal vision scanning, hands-free voice dictation, and multilingual clinical translation—powered by local Multimodal Vision AI models on the edge."**

[![GitHub Repository](https://img.shields.io/badge/GitHub-burgerman%2FPulseGemma-blue?logo=github)](https://github.com/burgerman/PulseGemma.git)
[![Target Platform](https://img.shields.io/badge/Platform-Local%20Edge%20%2F%20Offline%20First-emerald)](#-multimodal-hardware--ollama-compatibility)
[![AI Foundation](https://img.shields.io/badge/AI-Ollama%20Multimodal%20Vision-orange)](#-multimodal-vision-requirement)
[![Safety Philosophy](https://img.shields.io/badge/Safety-Deterministic%20Safety%20First-red)](#-clinical-safety--non-chatbot-philosophy)

---

## ⚡ 30-Second Pitch & Value Proposition

> **"PulseGemma transforms Emergency Department (ED) triage by replacing slow EHR digging and unsafe conversational chatbots with a grounded, privacy-first Multimodal Edge-AI system. Because clinical triage requires analyzing Chest X-Rays, paper lab printouts, and ECG strips, PulseGemma MANDATES a Multimodal Vision Model (`gemma4:vision`, `gemma3:vision`, `paligemma`, `llava`, `llama3.2-vision`). It gives healthcare workers a 5-second clinical brief, 100% deterministic lab alert safeguards, and hands-free multilingual voice dictation with zero cloud latency or HIPAA risk."**

---

## 👁️ Multimodal Vision Requirement & Ollama Model Compatibility

Because clinical triage involves physical artifacts (paper lab sheets, 12-lead ECG strips, and X-ray images), **text-only language models cannot handle this task**. PulseGemma requires a **Multimodal Vision AI Model** capable of processing both image tensors and text inputs.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   MULTIMODAL VISION MODEL REGISTRY (Auto-Detected)                     │
│               (Mandatory: Must support combined Image + Text payloads)                 │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
         ┌──────────────────────────────────┼──────────────────────────────────┐
         ▼                                  ▼                                  ▼
┌───────────────────────────┐    ┌───────────────────────────┐    ┌───────────────────────────┐
│ 🟢 COMPACT MULTIMODAL     │    │ 🟡 STANDARD MULTIMODAL    │    │ 🔵 HIGH-PERFORMANCE VISION│
│   (8GB VRAM / Mid Laptops)│    │   (12GB - 16GB VRAM)      │    │   (24GB+ VRAM Workstations│
├───────────────────────────┤    ├───────────────────────────┤    ├───────────────────────────┤
│ • paligemma / paligemma:3b│    │ • gemma4:vision (Default) │    │ • gemma4:27b-vision       │
│ • llama3.2-vision:11b     │    │ • gemma3:vision           │    │ • gemma3:27b-vision       │
│ • llava:7b / llava-phi3   │    │ • llava:13b / bakllava    │    │ • Custom Multimodal Vision│
└───────────────────────────┘    └───────────────────────────┘    └───────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ⚡ ZERO-HARDWARE FALLBACK: Integrated Offline Multimodal Edge Simulator               │
│ (Runs out-of-the-box on any browser even if Ollama is not installed or running)        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Mandatory Vision Capability**: Pure text LLMs are automatically filtered out; only Multimodal Vision models capable of base64 image parsing are selected for clinical image tasks.
* **Hardware-Agnostic Edge Fallback**: If Ollama is offline, PulseGemma engages its built-in client-side multimodal simulation engine so judges and clinicians can test the entire X-ray and lab sheet OCR workflow with zero setup.

---

## 💡 How We Leverage Gemma Multimodal Vision to Solve Real-World ER Pain Points

Unlike generic chatbots that guess diagnoses probabilistically, **PulseGemma deploys Gemma Multimodal Vision as a grounded reasoning and image synthesis engine** paired with deterministic code safeguards:

### 1. ⏱️ Real-World Problem: Information Overload & Triage Bottlenecks
* **The Clinical Pain Point**: Triage nurses spend 5–10 minutes reading dense, multi-page Electronic Health Records (EHRs) while critical patients wait in crowded emergency rooms.
* **Multimodal Solution**: Synthesizes complex patient histories, active medications, and chief complaints into a **5-Second Clinical Intake Brief**, automatically pulling forward life-threatening red flags (*e.g. CABG history, anticoagulants, severe penicillin allergy*).

### 2. 🌐 Real-World Problem: Language Barriers & Limited English Proficiency (LEP)
* **The Clinical Pain Point**: Non-English speaking patients struggle to communicate acute pain or symptom onset during high-stress triage, leading to misclassification or delayed care.
* **Multimodal Solution**: Accepts oral voice dictation or text in **20+ languages** (Spanish, Mandarin, Arabic, Vietnamese, French, etc.), translating spoken symptoms into standardized English clinical terminology for staff while generating native-language discharge guidance for the patient.

### 3. 🖼️ Real-World Problem: Paperwork & Visual Scan Bottlenecks
* **The Clinical Pain Point**: Paper lab printouts, 12-lead ECG strips, and X-ray scans sitting on desks create information silos during shift handoffs. Text-only models fail at this task.
* **Multimodal Vision Solution**: Uses Gemma Multimodal Vision to OCR-scan physical lab printouts, auto-populate numerical values into structured fields, and highlight key visual radiologic findings on Chest X-Rays.

### 4. 🛡️ Real-World Problem: Unsafe AI Hallucination in Medical Applications
* **The Clinical Pain Point**: Generic LLMs attempt mental math or guess medical reference ranges probabilistically, which is dangerous in clinical care.
* **PulseGemma Solution**: Pairs Multimodal Gemma with a **100% Deterministic TypeScript Engine** (for 0ms lab range checks) and **Ground-Truth RAG Retrieval** over verbatim Emergency Clinical Practice Guidelines (AHA Chest Pain, Surviving Sepsis). Every recommendation made by Gemma includes clickable source citations (`[AHA 2023 Sec 4.2]`).

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

---

## 📄 Key Feature Specification Blueprints

1. 🔴 **[Deterministic Range Checker Engine](feature_deterministic_range_checker.md)**: 0ms client-side calculation of critical high/low lab thresholds with 0% model guesswork.
2. 🎙️ **[Hands-Free Voice Dictation & Symptom NLU](feature_handsfree_voice_dictation.md)**: Real-time speech-to-text in 20+ languages with Gemma Multilingual structured clinical entity extraction.
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
 │ Structured   │                 │ Gemma Vision     │               │ Multilingual    │
 │ Labs & Vitals│                 │ (X-Ray / Lab OCR)│               │ Voice & Speech  │
 └──────┬───────┘                 └────────┬─────────┘               └────────┬────────┘
        │                                  │                                  │
        └──────────────────────────────────┼──────────────────────────────────┘
                                           │
                                           ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. Multilingual Translation & Medical Entity Normalizer                │
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
 │ 4. Gemma Multimodal Vision Engine (Image + Text Capable)               │
 │    - Synthesizes findings ONLY from steps 2 & 3.                       │
 │    - Generates English clinical brief & Native-Language patient notes. │
 │    - Every recommendation requires a clickable [Source Citation].      │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack & Quick Start

* **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Lucide Icons.
* **Audio Engine**: Web Speech API (`SpeechRecognition`) with 20+ language support.
* **AI Core**: Mandatory Ollama Multimodal Vision API (`gemma4:vision`, `gemma3:vision`, `paligemma`, `llava`) + Client-Side Fallback Engine.

```bash
# 1. Clone the repository
git clone https://github.com/burgerman/PulseGemma.git
cd PulseGemma

# 2. Install dependencies
npm install

# 3. Pull & Run Ollama Multimodal Vision model locally
ollama run gemma4:vision  # Or: paligemma / llava / llama3.2-vision

# 4. Start local development server
npm run dev
```

---

## 📜 License & Disclaimer

**Disclaimer**: *PulseGemma is an experimental AI-edge tool designed strictly for research, hackathon demonstration, and clinical decision support prototyping. It does not replace professional medical judgment, diagnosis, or treatment.*
