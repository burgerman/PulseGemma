# 🏆 PulseGemma: Complete Pitch & System Workflow Demo Script

> **"Sub-second patient history synthesis, 100% deterministic safety rules, multimodal vision scanning, hands-free voice dictation, and multilingual clinical translation—powered by local Multimodal Vision AI models on the edge."**

---

## 🏛️ System Overview & 6-Node Agentic Workflow Architecture

```
                  ┌─────────────────────────────────────────────────┐
                  │                 PATIENT INPUTS                  │
                  │ (Voice Audio / Vitals / Labs / X-Rays / ECGs)   │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. Multilingual NLU & Symptom Normalizer Node                          │
 │    • Translates 20+ languages -> Maps colloquial phrases to SNOMED.   │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. 100% Deterministic Safety & Rule Engine Node (0ms TypeScript)       │
 │    • Evaluates panic lab limits & ESI v4 decision tree (Levels 1 - 5).  │
 │    • Executes Local Tools: qSOFA, Wells PE, Drug Interaction Checks.   │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. Gemma Multimodal Vision & Image OCR Scanner Node                    │
 │    • Parses image tensors (Chest X-Rays, 12-lead ECGs, paper lab sheet)│
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
 │ 5. Gemma Multimodal Clinical Reasoning Node                            │
 │    • Synthesizes 5-Second Brief & Grounded Differentials [Citations].  │
 └──────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 6. AST Grounding Safety Guardrail & EHR Export Node                    │
 │    • Audits citations -> Exports HL7/FHIR compliant triage audit log.  │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## ⏱️ Pitch Timeline (Total Time: ~3:30)

| Phase | Time | Goal | Action in App |
| :--- | :---: | :--- | :--- |
| **1. Hook & Problem** | 0:00 - 0:35 | Frame real-world ER triage bottlenecks & unsafe AI hallucination risks. | Show main PulseGemma header & ESI Level Badge. |
| **2. System & Workflow Overview** | 0:35 - 1:15 | Explain the 6-Node Agentic DAG Pipeline & Local Tool Execution Layer. | Click **`Trace`** Debugger button to show live 6-node sequence. |
| **3. Act 1: Multilingual Voice Intake** | 1:15 - 1:45 | Demonstrate hands-free oral voice dictation in Spanish/Chinese. | Click **`1. Voice Dictation`** tab $\rightarrow$ Apply Spanish preset. |
| **4. Act 2: 0ms Deterministic Safety** | 1:45 - 2:15 | Prove 0% LLM hallucination risk with 100% TypeScript rule engine. | Click **`2. Range Checker`** tab $\rightarrow$ Show Troponin panic alert. |
| **5. Act 3: Multimodal Vision Scanner** | 2:15 - 2:45 | Showcase Gemma Multimodal Vision parsing X-rays & ECG strips. | Click **`3. Vision Scanner`** tab $\rightarrow$ Show ECG STEMI scan. |
| **6. Act 4: Grounded Brief & EHR Export**| 2:45 - 3:15 | Demonstrate verbatim CPG RAG citations & 1-click EHR export. | Click **`5. Triage Brief`** tab $\rightarrow$ Click `[CPG-AHA-2023]` & Copy Brief. |
| **7. Impact & Closing** | 3:15 - 3:30 | Emphasize 100% local edge privacy, hardware flexibility, & zero HIPAA risk. | Show Ollama Model Selector & 100% Offline Status. |

---

## 🎙️ Word-for-Word Presenter Script

### 1. The Hook & Real-World Problem (0:00 - 0:35)
> *"Judges, every single day, overcrowded Emergency Rooms face a life-or-death bottleneck. Triage nurses spend up to 10 minutes digging through dense Electronic Health Records while critical chest pain or septic shock patients wait in crowded waiting rooms."*
>
> *"To make matters worse, language barriers cause frequent misdiagnoses, and generic AI chatbots are too unsafe to use because they hallucinate medical math."*
>
> *"Meet **PulseGemma**: a grounded, privacy-first Edge-AI Clinical Triage Assistant built with local Multimodal Vision AI models."*

---

### 2. System Architecture & 6-Node Workflow Overview (0:35 - 1:15)
*(Action: Click `Trace` Debugger button in top header bar to open the live pipeline sequence)*

> *"Architecturally, PulseGemma is NOT a simple chatbot. It is a **6-Node Agentic DAG State Machine** powered by a central **Unified Knowledge Base** and a **Local Tool Execution Layer**."*
>
> *"When a patient arrives, Node 1 normalizes multilingual voice inputs. Node 2 passes vitals through a **100% Deterministic Safety Engine** in 0 milliseconds. Node 3 processes physical medical images using Gemma Vision. Node 4 performs RAG retrieval over emergency clinical practice guidelines. Node 5 synthesizes the clinical brief, and Node 6 audits every citation to guarantee 100% grounded safety before exporting FHIR-compliant triage logs."*

---

### 3. Act 1: Multilingual Hands-Free Voice Dictation (1:15 - 1:45)
*(Action: Click `🫀 ACS Chest Pain` preset in header $\rightarrow$ Click `1. Voice Dictation` tab)*

> *"Let’s see this workflow in action. A non-English speaking patient arrives at the ER."*
>
> *"The patient speaks in Spanish: **'Tengo un dolor muy fuerte en el pecho que se me va al brazo izquierdo.'***"
>
> *"Instantly, Node 1 maps the colloquial Spanish phrase to standardized English SNOMED clinical entities: **Acute Chest Pain located at Substernal Chest with a Pain Severity of 9 out of 10.**"*

---

### 4. Act 2: 100% Deterministic Safety Engine (1:45 - 2:15)
*(Action: Click `2. Range Checker` tab)*

> *"How do we guarantee clinical safety? We NEVER ask an LLM to guess medical numbers."*
>
> *"Here in Tab 2, our **100% Deterministic Safety Engine** evaluates laboratory biomarkers in **0 milliseconds** using pure TypeScript client code."*
>
> *"Look at the Cardiac Troponin I reading: **0.85 ng/mL**. The engine instantly flags a **CRITICAL PANIC HIGH** status badge and evaluates our ESI v4 Decision Tree, classifying the patient as **ESI Level 2: Emergent High Risk**—with ZERO model guesswork."*

---

### 5. Act 3: Multimodal Vision & OCR Scanner (2:15 - 2:45)
*(Action: Click `3. Vision Scanner` tab)*

> *"Because clinical triage involves physical artifacts like paper lab printouts and 12-lead ECGs, pure text models fail at this task. PulseGemma mandates a **Multimodal Vision AI Model** (`gemma4:vision`, `paligemma`, `llava`)."*
>
> *"Look at this 12-lead ECG strip photo. Gemma Vision OCRs the image tensor, detects the region of interest, and highlights **ST-segment elevation (+3mm) in Leads II, III, and aVF**, confirming an acute STEMI pattern."*

---

### 6. Act 4: Grounded CPG RAG & 1-Click EHR Export (2:45 - 3:15)
*(Action: Click `5. Triage Brief` tab $\rightarrow$ Click `🔗 [CPG-AHA-2023-ACS-4.2]` citation link)*

> *"Finally, Node 5 synthesizes a **5-Second Clinical Intake Brief** for the ER physician."*
>
> *"Every single recommendation made by PulseGemma is strictly grounded against verbatim Emergency Clinical Practice Guidelines. Notice this clickable citation tag **[CPG-AHA-2023-ACS-4.2]**. Clicking it opens the verbatim AHA Chest Pain guideline passage, verifying zero hallucination."*
>
> *"With one click on **'Copy Brief to EHR'**, the nurse pastes the structured brief directly into Epic or Cerner."*

---

### 7. The Impact & Closing (3:15 - 3:30)
*(Action: Click Settings gear icon to show `gemma4:vision` local model tag)*

> *"PulseGemma runs 100% locally on the edge via local Ollama models or our built-in offline simulator. That means **ZERO cloud latency, ZERO cloud API fees, and ZERO HIPAA data leakage**."*
>
> *"PulseGemma turns 10 minutes of EHR digging into a 5-second grounded clinical brief—saving lives at the edge. Thank you!"*
