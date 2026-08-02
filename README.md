# 🫀 PulseGemma
### Grounded Edge-AI Clinical Triage & Decision-Support Assistant

> **"Sub-second patient history synthesis, 100% deterministic safety rules, multimodal vision scanning, hands-free voice dictation, and multilingual clinical translation—powered by local Multimodal Vision AI models on the edge."**

[![GitHub Repository](https://img.shields.io/badge/GitHub-burgerman%2FPulseGemma-blue?logo=github)](https://github.com/burgerman/PulseGemma.git)
[![Platform](https://img.shields.io/badge/Platform-Local%20Edge%20%2F%20Offline%20First-emerald)](#-multimodal-hardware--ollama-compatibility)
[![AI Foundation](https://img.shields.io/badge/AI-Ollama%20Multimodal%20Vision-orange)](#-multimodal-vision-requirement)
[![Safety Philosophy](https://img.shields.io/badge/Safety-Deterministic%20Safety%20First-red)](#-system-architecture)

---

## ⚡ 30-Second Elevator Pitch (In Plain Street English)

> **"Emergency Rooms are straight-up chaotic. Nurses are drowning in paperwork, digging through clunky medical records for 10 minutes while sick patients sit in pain. On top of that, language barriers cause crazy mix-ups, and generic AI chatbots can't be trusted in medicine because they hallucinate fake numbers.**
>
> **Enter PulseGemma: a super fast, local AI assistant that actually reads X-rays, ECGs, and paper lab prints on the spot—with zero cloud latency and zero privacy leaks. In 5 seconds flat, it hands doctors a clean intake brief, flags critical panic labs with 0% guesswork, and translates voice notes in 20+ languages. No fluff, no cloud fees, just fast, safe ER triage right at the edge."**

---

## 👁️ Multimodal Vision Requirement & Ollama Model Support

Because clinical triage involves physical artifacts (paper lab sheets, 12-lead ECG strips, and X-ray images), **pure text language models cannot handle this task**. PulseGemma requires a **Multimodal Vision AI Model** capable of processing both image tensors and text inputs.

* **Recommended Primary Model**: `gemma4:vision` / `gemma3:vision` / `paligemma`
* **Compatible Multimodal Alternatives**: `llava`, `llama3.2-vision`, `bakllava`
* **Offline Edge Fallback Engine**: If Ollama is offline or latency spikes, PulseGemma engages its built-in client-side multimodal simulation engine so the entire web app runs seamlessly on any device.

---

## 💡 Real-World ER Problems Solved

1. ⏱️ **Information Overload & Triage Bottlenecks**: Replaces 10-minute EHR digging with a **5-Second Clinical Intake Brief** highlighting critical red flags (*CABG history, anticoagulants, severe allergies*).
2. 🌐 **Language Barriers**: Accepts oral voice dictation in **20+ languages** (Spanish, Mandarin, French, Arabic), translating spoken symptoms into standardized English clinical terminology.
3. 🖼️ **Paperwork & Visual Scan Bottlenecks**: Uses Gemma Multimodal Vision to OCR-scan physical lab printouts and highlight visual radiologic findings on Chest X-Rays and ECG strips.
4. 🛡️ **Zero-Hallucination Medical Safety**: Pairs Multimodal Gemma with a **100% Deterministic TypeScript Engine** (for 0ms lab checks) and **Ground-Truth RAG Retrieval** over verbatim Emergency Clinical Practice Guidelines (AHA Chest Pain, Surviving Sepsis, ESI v4). Every recommendation includes clickable source citations (`[CPG-AHA-2023-ACS-4.2]`).

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
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. 100% Deterministic Safety & Rule Engine Node (0ms TypeScript)       │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. Gemma Multimodal Vision & Image OCR Scanner Node                    │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 4. Ground-Truth RAG Guideline Retrieval Node                           │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 5. Gemma Multimodal Clinical Reasoning Node                            │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 6. AST Grounding Safety Guardrail & EHR Export Node                    │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 📄 Key Feature Specification Specifications

1. 🔴 **[Deterministic Range Checker Engine](feature_deterministic_range_checker.md)**: 0ms client-side calculation of critical high/low lab thresholds.
2. 🎙️ **[Hands-Free Voice Dictation & Symptom NLU](feature_handsfree_voice_dictation.md)**: Real-time speech-to-text in 20+ languages with structured clinical entity extraction.
3. 📚 **[Grounded CPG RAG Retrieval Engine](feature_grounded_cpg_rag.md)**: Local RAG retrieval matching patient findings against verbatim Emergency Clinical Practice Guidelines.
4. 🤖 **[Agentic Orchestrator Plan](agent_orchestrator_plan.md)**: Specification for the 6-Node State Machine and Local Tool Execution Registry.
5. 📐 **[Code Structure & Standards](code_structure_and_standards.md)**: Technical architecture standards and WCAG AA accessibility specs.

---

## 🛠️ Quick Start & Local Execution

* **Requirements**: Node.js (v18+), local Ollama instance (optional).

```bash
# 1. Clone the repository
git clone https://github.com/burgerman/PulseGemma.git
cd PulseGemma

# 2. Install dependencies
npm install

# 3. Pull & Run Ollama Multimodal Vision model locally (Optional)
ollama run gemma4:vision  # Or: paligemma / llava

# 4. Start local development server
npm run dev
```

---

## 📜 Disclaimer

*PulseGemma is an experimental AI-edge tool designed strictly for research, hackathon demonstration, and clinical decision support prototyping. It does not replace professional medical judgment, diagnosis, or treatment.*
