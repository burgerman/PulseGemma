# 🫀 PulseGemma
### Grounded Hybrid VLM & Local Edge-AI Clinical Triage Assistant

> **"Sub-second patient history synthesis, 100% deterministic safety rules, hybrid Cloud VLM image analysis, hands-free voice dictation, and multilingual clinical translation—powered by local Gemma AI models on the edge."**

[![GitHub Repository](https://img.shields.io/badge/GitHub-burgerman%2FPulseGemma-blue?logo=github)](https://github.com/burgerman/PulseGemma.git)
[![Architecture](https://img.shields.io/badge/Architecture-Hybrid%20Cloud%20VLM%20%2B%20Local%20Gemma-emerald)](#-hybrid-cloud-vlm--local-gemma-architecture)
[![Safety Philosophy](https://img.shields.io/badge/Safety-0ms%20Deterministic%20Rules%20First-red)](#-system-architecture--6-node-dag-workflow)
[![UI Layout](https://img.shields.io/badge/UI-Modular%20Grid%20%2F%20Single%20Focus-purple)](#-modular-ui--feature-demo-shortcuts)

---

## ⚡ Project Description

> **"Emergency Rooms are straight-up chaotic, and overcrowding right here in Ontario. Nurses are drowning in paperwork, digging through clunky medical records for 10 minutes while sick patients sit in pain. On top of that, language barriers cause crazy mix-ups, and generic edge AI models can hallucinate fake numbers when reading medical images.**
>
> **Enter PulseGemma: a smart hybrid system. It pairs a high-precision Cloud VLM Specialist (like Gemini 3.6 Flash / Gemini Robotics ER 2) to handle visual X-Ray, ECG, and lab printout scanning without hallucination, with a fast Local Gemma Model on the edge that combines those visual findings with clinical notes, vitals, 0ms lab alerts, and guideline passages. In 5 seconds flat, it hands doctors a clean, comprehensive triage report with zero model guesswork on medical math. No fluff, no cloud fees for local synthesis, just fast, safe ER triage right at the edge."**

---

## 💡 Hybrid Cloud-VLM & Local Gemma Architecture

To eliminate edge vision hallucinations while preserving local data privacy and low latency, PulseGemma uses a **Hybrid Cloud-VLM + Local Gemma Architecture**:

1. 👁️ **Cloud VLM Specialist (Node 3: Vision Analysis)**:
   - Uses high-accuracy Vision-Language Models (e.g., Gemini 3.6 Flash / Gemini Robotics ER 2 via API) for zero-hallucination radiologic analysis of X-Rays, 12-lead ECG strips, and printed paper lab sheets.
2. 🤖 **Local Edge Synthesizer (Node 5: Gemma Reasoner)**:
   - Takes the verified visual findings from Node 3, combines them locally with patient vitals, 0ms deterministic lab panic alerts, and local Grounded RAG guideline passages (`[CPG-AHA-2023]`), and generates the final comprehensive report for physician review.
3. 🛡️ **100% Deterministic Safety Engine (Node 2: 0ms Rules)**:
   - Never relies on an LLM for medical math. Pure TypeScript client logic evaluates panic lab limits (*Troponin I > 0.04 ng/mL, K+ > 5.5 mEq/L, Lactate > 2.0 mmol/L*), qSOFA, Wells PE, and ESI v4 triage decision trees in **0 milliseconds**.

---

## 🏛️ System Architecture & 6-Node Agentic DAG Workflow

```
                  ┌─────────────────────────────────────────────────┐
                  │                 PATIENT INPUTS                  │
                  │ (Voice Audio / Vitals / Labs / X-Rays / ECGs)   │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. Multilingual NLU & Symptom Normalizer Node                          │
 │    • Speech-to-text in 20+ languages -> SNOMED clinical concepts.     │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. 100% Deterministic Safety & Rule Engine Node (0ms TypeScript)       │
 │    • Evaluates panic lab limits & ESI v4 decision tree (Levels 1 - 5).  │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. Cloud VLM Image Analysis Specialist Node (Gemini ER 2 / Flash API) │
 │    • Zero-hallucination radiologic OCR (X-Rays, ECGs, paper lab sheets)│
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 4. Ground-Truth RAG Guideline Retrieval Node                           │
 │    • Fetches verbatim CPG passages (AHA 2023, Surviving Sepsis 2021).  │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 5. Local Gemma Multimodal Clinical Synthesizer & Report Generator Node │
 │    • Combines VLM visual findings + clinical notes + RAG guidelines.   │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 6. AST Grounding Safety Guardrail & EHR Export Node                    │
 │    • Audits citations -> Exports FHIR-compliant summary & copy to EHR. │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 🎛️ Modular UI & Feature Demo Shortcuts

PulseGemma features a flexible **Component-Oriented UI Architecture**:

* 🧩 **Modular Grid Dashboard**: Displays all active feature modules side-by-side in a multi-card clinical grid layout.
* 🎯 **Single Focus View**: Isolates 1 feature module for deep focused task execution.
* 🚀 **1-Click Feature Demo Shortcuts**: Header dropdown (`Feature Demos`) offering 1-click automated demo runs for:
  1. `🎙️ 1. Voice NLU Dictation (Spanish)`
  2. `⚡ 2. 0ms Range Checker (Troponin & K+ Panic)`
  3. `👁️ 3. Vision OCR Scanner (12-Lead ECG & X-Ray)`
  4. `📚 4. Grounded CPG RAG (AHA Guideline)`
  5. `🩺 5. Master Triage Brief & EHR Copy`

---

## 🚀 Built-In Emergency Department Demo Test Suite

PulseGemma includes 4 pre-configured clinical test scenarios in the top header bar:

1. 🫀 **ACS Chest Pain (STEMI / Spanish)**: Spoken Spanish transcript, Cardiac Troponin I = `0.85 ng/mL` (PANIC), 12-lead ECG STEMI scan, ESI Level 2.
2. 🔥 **Severe Septic Shock (Chinese)**: Spoken Chinese transcript, BP `88/54`, Lactate = `4.2 mmol/L`, qSOFA = 3, Chest X-Ray lobar pneumonia scan, ESI Level 1.
3. ⚡ **Acute ESRD Hyperkalemia (French)**: Spoken French transcript, Serum Potassium K+ = `6.8 mEq/L` (PANIC), paper lab report photo, ESI Level 2.
4. 🩸 **Diabetic Ketoacidosis (DKA / English)**: English transcript, Blood Glucose = `380 mg/dL`, pH `7.22`, HCO3 `12 mEq/L`, ESI Level 2.

---

## 📄 Feature Specification Blueprints

1. 🔴 **[Deterministic Range Checker Engine](feature_deterministic_range_checker.md)**: 0ms client-side calculation of critical high/low lab thresholds.
2. 🎙️ **[Hands-Free Voice Dictation & Symptom NLU](feature_handsfree_voice_dictation.md)**: Real-time speech-to-text in 20+ languages with structured clinical entity extraction.
3. 📚 **[Grounded CPG RAG Retrieval Engine](feature_grounded_cpg_rag.md)**: Local RAG retrieval matching patient findings against verbatim Emergency Clinical Practice Guidelines.
4. 🤖 **[Agentic Orchestrator Plan](agent_orchestrator_plan.md)**: Specification for the 6-Node State Machine and Local Tool Execution Registry.
5. 📐 **[Code Structure & Standards](code_structure_and_standards.md)**: Technical architecture standards and WCAG AA accessibility specs.
6. 🏆 **[3-Minute Pitch Script & Presentation Guide](PITCH_DEMO_SCRIPT.md)**: Complete presenter script and 4-act demo walkthrough.

---

## 🛠️ Quick Start & Local Execution

* **Requirements**: Node.js (v18+), local Ollama instance (optional).

```bash
# 1. Clone the repository
git clone https://github.com/burgerman/PulseGemma.git
cd PulseGemma

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

---

## 📜 Disclaimer

*PulseGemma is an experimental AI tool designed strictly for research, hackathon demonstration, and clinical decision support prototyping. It does not replace professional medical judgment, diagnosis, or treatment.*
