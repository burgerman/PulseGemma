# 🤖 Local Agentic Orchestrator & Workflow Implementation Plan
### PulseGemma: Grounded Edge-AI Clinical Triage Engine

> **"A multi-agent, event-driven local orchestration pipeline powered by a Local Tool Calling Execution Layer and a Unified Knowledge Base Data Layer, combining Gemma 4's advanced reasoning with 100% grounded deterministic safety controls."**

---

## 🛠️ 1. Local Tool Calling Execution Layer (`src/agent/tools/*`)

To make the agentic workflow robust, smart, and extensible, **PulseGemma** equips Gemma 4 and the sub-agent nodes with a suite of **Local Executable Tools**. Instead of relying on parametric memory or guessing, Gemma 4 calls local client-side tool functions deterministically.

```
                              ┌────────────────────────────────────────────────────────┐
                              │           GEMMA 4 REASONING & AGENT NODES              │
                              └───────────────────────────┬────────────────────────────┘
                                                          │
                                                          ▼ (Function Calling / Tool Execution)
                              ┌────────────────────────────────────────────────────────┐
                              │            LOCAL TOOL EXECUTOR REGISTRY                │
                              │                (src/agent/tools/index.ts)              │
                              └───────────────────────────┬────────────────────────────┘
                                                          │
       ┌──────────────────────┬───────────────────────────┼───────────────────────────┬──────────────────────┐
       ▼                      ▼                           ▼                           ▼                      ▼
┌──────────────┐     ┌─────────────────┐         ┌──────────────────┐        ┌──────────────────┐   ┌────────────────┐
│ Tool 1:      │     │ Tool 2:         │         │ Tool 3:          │        │ Tool 4:          │   │ Tool 5:        │
│ Query KB     │     │ Clinical Score  │         │ Drug Interaction │        │ Age-Adjusted     │   │ FHIR Audit     │
│ Guidelines   │     │ Calculator      │         │ & Allergy Check  │        │ Vitals Check     │   │ Logger / Export│
└──────┬───────┘     └────────┬────────┘         └────────┬─────────┘        └────────┬─────────┘   └───────┬────────┘
       │                      │                           │                           │                     │
───────┴──────────────────────┴───────────────────────────┴───────────────────────────┴─────────────────────┴────────
                                                          │
                                                          ▼
                              ┌────────────────────────────────────────────────────────┐
                              │            UNIFIED KNOWLEDGE BASE DATA LAYER           │
                              └────────────────────────────────────────────────────────┘
```

### Registered Local Agent Tools:

| Tool Name | Parameters | Execution Type | Purpose |
| :--- | :--- | :--- | :--- |
| **`tool_query_knowledge_base`** | `{ queryKeywords, category }` | Deterministic RAG Query | Dynamically fetches verbatim clinical practice guideline passages (AHA, Sepsis, ESI v4) from `UnifiedKnowledgeBase`. |
| **`tool_calculate_clinical_score`** | `{ scoreType: 'qSOFA' \| 'WELLS_PE' \| 'TIMI_ACS', inputs }` | 100% Pure Code | Delegates mathematical score calculation (qSOFA, Wells PE, TIMI) to local TypeScript code to eliminate LLM arithmetic errors. |
| **`tool_check_drug_interactions`** | `{ activeMedications, patientAllergies }` | Deterministic Lookup | Cross-checks active medications against allergy profiles and flags high-risk pharmacological contraindications (e.g. *Warfarin + NSAIDs*, *Sildenafil + Nitrates*). |
| **`tool_validate_age_adjusted_vitals`** | `{ ageYears, vitals }` | Range Calculator | Adjusts vital sign normal/abnormal thresholds based on patient age (e.g., pediatric heart rate of 130 bpm is normal for infants, but tachycardia for adults). |
| **`tool_generate_patient_discharge_note`** | `{ clinicalBrief, targetLanguage }` | Multilingual NLU | Translates complex clinical findings into clear, 4th-grade reading level discharge instructions in the patient's native language. |
| **`tool_export_fhir_triage_log`** | `{ triageAssessment }` | JSON Format Builder | Generates a standardized HL7/FHIR-compliant JSON triage audit payload for EHR integration. |

---

## 🧠 2. Leveraging Gemma 4's Advanced Reasoning & Tool Calling

PulseGemma maximizes **Gemma 4's high-level reasoning, complex natural language understanding (NLU), and tool calling capabilities** while enforcing strict grounding over the `UnifiedKnowledgeBase`:

```
                       ┌────────────────────────────────────────────────────────┐
                       │          GEMMA 4 ADVANCED REASONING ENGINES            │
                       └───────────────────────────┬────────────────────────────┘
                                                   │
         ┌─────────────────────────────────────────┼─────────────────────────────────────────┐
         ▼                                         ▼                                         ▼
┌───────────────────────────┐           ┌───────────────────────────┐           ┌───────────────────────────┐
│ 1. Multilingual NLU &     │           │ 2. Cross-Modal Synthesis  │           │ 3. Grounded Differential  │
│ Symptom Normalization     │           │ (Labs + Vitals + Vision)  │           │ Diagnostic Reasoning      │
│ • Translates 20+ languages│           │ • Synthesizes 5-sec brief │           │ • Explains clinical logic │
│ • Maps colloquial phrases │           │ • Correlates lab anomalies│           │ • Invokes local tools     │
│   to clinical terminology │           │   with physical symptoms  │           │   for exact calculations  │
└────────┬──────────────────┘           └─────────────┬─────────────┘           └─────────────┬─────────────┘
         │                                            │                                       │
─────────┴────────────────────────────────────────────┴───────────────────────────────────────┴─────────────
                                                   │ (Strict Grounding Barrier)
                                                   ▼
                       ┌────────────────────────────────────────────────────────┐
                       │    UNIFIED KNOWLEDGE BASE & DETERMINISTIC GUARD        │
                       │    - All inputs/thresholds checked by 0ms TypeScript   │
                       │    - All AI reasoning bound to retrieved CPG passages  │
                       └────────────────────────────────────────────────────────┘
```

---

## 🏛️ 3. Unified Knowledge Base Architecture

All nodes in PulseGemma draw ground-truth context from a single, centralized data layer: the **`UnifiedKnowledgeBase`**. No node relies on isolated parametric memory for clinical thresholds.

```
                               ┌─────────────────────────────────────────┐
                               │     UNIFIED KNOWLEDGE BASE DATA LAYER   │
                               │        (src/knowledge/index.ts)         │
                               └────────────────────┬────────────────────┘
                                                    │
         ┌──────────────────────┬───────────────────┼───────────────────┬──────────────────────┐
         ▼                      ▼                   ▼                   ▼                      ▼
┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐  ┌─────────────────┐  ┌──────────────────┐
│ Clinical Practice│  │ Lab Reference    │  │ ESI v4 & Risk  │  │ Drug & Allergy  │  │ Multilingual     │
│ Guidelines (CPGs)│  │ Threshold Store  │  │ Decision Trees │  │ Interaction DB  │  │ Clinical Lexicon │
│ (AHA, Sepsis)    │  │ (Critical Ranges)│  │ (qSOFA, Wells) │  │ (Contraindicat.)│  │ (SNOMED/UMLS)    │
└────────┬─────────┘  └────────┬─────────┘  └───────┬────────┘  └────────┬────────┘  └────────┬─────────┘
```

---

## 🔄 4. End-to-End Orchestrator Workflow Lifecycle

Below is the explicit 6-step state machine sequence executed by `Orchestrator.ts` for every triage assessment:

```
  ┌────────────┐
  │  Step 0    │ Patient Inputs Arrive (Voice Dictation / Vitals / Labs / Images)
  └─────┬──────┘
        │
        ▼
  ┌────────────┐
  │  Step 1    │ Node 1: Multilingual Gemma 4 Normalization
  │            │ • Interpret language (e.g. 'es') -> Translate to English
  │            │ • Gemma 4 maps colloquial phrases to SNOMED clinical concepts
  └─────┬──────┘
        │
        ▼
  ┌────────────┐
  │  Step 2    │ Node 2: 100% Deterministic Safety & Rule Engine (0ms TypeScript)
  │            │ • Query UnifiedKnowledgeBase.getLabThresholds() for High/Low/Critical badges
  │            │ • Query UnifiedKnowledgeBase.getDecisionTreeRule() for ESI v4 (Levels 1-5)
  │            │ • Invoke Local Tool: tool_calculate_clinical_score (qSOFA, Wells PE)
  │            │ • Invoke Local Tool: tool_check_drug_interactions (Warfarin + NSAIDs)
  └─────┬──────┘
        │
        ▼
  ┌────────────┐
  │  Step 3    │ Node 3: Gemma Vision OCR & Radiologic Feature Agent
  │            │ • If medical image present -> Call Ollama Vision API
  │            │ • Extract paper lab sheet values & X-Ray visual findings
  └─────┬──────┘
        │
        ▼
  ┌────────────┐
  │  Step 4    │ Node 4: Ground-Truth RAG Retrieval Agent
  │            │ • Invoke Local Tool: tool_query_knowledge_base with symptoms + lab alerts
  │            │ • Retrieve exact CPG passages (AHA Chest Pain, Sepsis Protocols)
  └─────┬──────┘
        │
        ▼
  ┌────────────┐
  │  Step 5    │ Node 5: Gemma 4 Clinical Reasoning & Citation Engine
  │            │ • Gemma 4 synthesizes multi-source data strictly using CPG passages
  │            │ • Generates 5-Second Brief + Grounded Differentials with [Citations]
  │            │ • Invoke Local Tool: tool_generate_patient_discharge_note
  └─────┬──────┘
        │
        ▼
  ┌────────────┐
  │  Step 6    │ Node 6: Grounding Safety Validator & Audit Guardrail
  │            │ • Verify all generated citations exist in UnifiedKnowledgeBase
  │            │ • Invoke Local Tool: tool_export_fhir_triage_log
  │            │ • Confirm zero ungrounded claims -> Emit final Decision Support Payload
  └─────┬──────┘
        │
        ▼
  ┌────────────┐
  │  Complete  │ UI Renders Color-Coded Triage Brief + Debug Execution Log
  └────────────┘
```

---

## 🛠️ 5. Workflow Debugging & Audit Architecture

To enable total transparency, review, and step-by-step debugging, the orchestrator includes a dedicated **`PipelineDebugger`** service:

### 1. Execution Trace Logging (`PipelineTraceLog`)
Every execution run produces a detailed debug trace capturing timestamped inputs, outputs, tool execution calls, and latencies for each node.

### 2. Interactive UI Workflow Debugger Panel (`WorkflowDebugger.tsx`)
A dedicated slide-over panel on the UI allows clinicians and developers to inspect intermediate state snapshots, tool call arguments, and citation maps across all 6 steps.

---

## 📁 6. File-by-File Implementation Checklist

### Local Agent Tool Execution Registry (`src/agent/tools/*`)

#### [NEW] [src/agent/tools/index.ts](file:///d:/Clinical%20Triage/src/agent/tools/index.ts)
- Master Local Tool Execution Registry dispatching function calls.

#### [NEW] [src/agent/tools/kbQueryTool.ts](file:///d:/Clinical%20Triage/src/agent/tools/kbQueryTool.ts)
- Tool implementation for `tool_query_knowledge_base`.

#### [NEW] [src/agent/tools/clinicalScoreTool.ts](file:///d:/Clinical%20Triage/src/agent/tools/clinicalScoreTool.ts)
- Tool implementation for `tool_calculate_clinical_score` (qSOFA, Wells, TIMI).

#### [NEW] [src/agent/tools/drugInteractionTool.ts](file:///d:/Clinical%20Triage/src/agent/tools/drugInteractionTool.ts)
- Tool implementation for `tool_check_drug_interactions`.

#### [NEW] [src/agent/tools/ageVitalsTool.ts](file:///d:/Clinical%20Triage/src/agent/tools/ageVitalsTool.ts)
- Tool implementation for `tool_validate_age_adjusted_vitals`.

#### [NEW] [src/agent/tools/patientTranslatorTool.ts](file:///d:/Clinical%20Triage/src/agent/tools/patientTranslatorTool.ts)
- Tool implementation for `tool_generate_patient_discharge_note`.

#### [NEW] [src/agent/tools/fhirExportTool.ts](file:///d:/Clinical%20Triage/src/agent/tools/fhirExportTool.ts)
- Tool implementation for `tool_export_fhir_triage_log`.

---

### Core Architecture Files
- **`src/knowledge/index.ts`** (Unified Knowledge Base Data Layer)
- **`src/agent/Orchestrator.ts`** (Master Workflow Coordinator)
- **`src/agent/PipelineDebugger.ts`** (Debugger Service)
- **`src/agent/nodes/node1_normalizer.ts`** through **`node6_safetyValidator.ts`**
- **`src/components/WorkflowDebugger.tsx`** (UI Debugger Drawer)
