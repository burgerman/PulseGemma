# 🤖 Local Agentic Orchestrator & Workflow Implementation Plan
### PulseGemma: Grounded Edge-AI Clinical Triage Engine (Hybrid VLM & Local Gemma)

> **"A multi-agent, event-driven orchestration pipeline powered by a Cloud VLM Specialist (Node 3: Gemini ER 2 / Flash) for zero-hallucination medical image analysis, a 100% Deterministic Safety Engine (Node 2) for 0ms lab math checks, and a Local Gemma Synthesizer (Node 5) for comprehensive clinical triage reports."**

---

## 🛠️ 1. Local Tool Calling Execution Layer (`src/agent/tools/*`)

To make the agentic workflow robust, smart, and extensible, **PulseGemma** equips the Multimodal AI Engine and sub-agent nodes with a suite of **Local Executable Tools**. Instead of relying on parametric memory or guessing, the AI engine calls local client-side tool functions deterministically.

```
                               ┌────────────────────────────────────────────────────────┐
                               │    MULTIMODAL REASONING & AGENT NODES (1 TO 6)         │
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

## 👁️ 2. Hybrid Cloud VLM Specialist + Local Gemma Synthesizer Architecture

PulseGemma uses a **Hybrid Cloud VLM + Local Gemma Synthesizer Design** to eliminate vision hallucinations while preserving edge speed and data privacy:

```
                       ┌────────────────────────────────────────────────────────┐
                       │     NODE 3: CLOUD VLM VISION ANALYSIS SPECIALIST       │
                       │             (Gemini ER 2 / Flash API)                  │
                       │ • High-accuracy radiologic OCR (X-Rays, ECGs, Labs)   │
                       └───────────────────────────┬────────────────────────────┘
                                                   │ (Structured Visual Findings)
                                                   ▼
                       ┌────────────────────────────────────────────────────────┐
                       │     NODE 5: LOCAL GEMMA CLINICAL SYNTHESIZER           │
                       │ • Combines VLM visual findings with patient vitals,    │
                       │   0ms panic lab alerts, and local RAG guidelines       │
                       │   into a comprehensive doctor report.                  │
                       └───────────────────────────┬────────────────────────────┘
                                                   │
                                                   ▼
                       ┌────────────────────────────────────────────────────────┐
                       │    UNIFIED KNOWLEDGE BASE & DETERMINISTIC GUARD        │
                       │    - All lab math checked by 0ms TypeScript            │
                       │    - All recommendations bound to CPG citations        │
                       └────────────────────────────────────────────────────────┘
```

---

## 🏛️ 3. Unified Knowledge Base Architecture

All nodes in PulseGemma draw ground-truth context from a single, centralized data layer: the **`UnifiedKnowledgeBase`**. No node relies on isolated parametric memory for clinical thresholds.

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
  │  Step 1    │ Node 1: Multilingual NLU Normalization
  │            │ • Speech-to-text in 20+ languages -> Translate to English
  │            │ • Multimodal NLU maps colloquial phrases to SNOMED clinical concepts
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
  │  Step 3    │ Node 3: Cloud VLM Image Analysis Specialist (Gemini ER 2 / Flash)
  │            │ • Zero-hallucination radiologic OCR (X-Rays, 12-lead ECGs, paper lab printouts)
  │            │ • Output verified structured visual findings
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
  │  Step 5    │ Node 5: Local Gemma Multimodal Clinical Synthesizer & Report Generator
  │            │ • Combines Node 3 VLM visual findings with Node 1 NLU, Node 2 0ms lab alerts,
  │              and Node 4 RAG guideline passages
  │            │ • Generates 5-Second Brief + Grounded Differentials with [Citations]
  │            │ • Invoke Local Tool: tool_generate_patient_discharge_note
  └─────┬──────┘
        │
        ▼
  ┌────────────┐
  │  Step 6    │ Node 6: Grounding Safety Validator & Audit Guardrail
  │            │ • Verify all generated citations exist in UnifiedKnowledgeBase
  │            │ • Invoke Local Tool: tool_export_fhir_triage_log
  │            │ • Confirm zero ungrounded claims -> Emit final Decision Support Payload & Copy to EHR
  └─────┬──────┘
        │
        ▼
  ┌────────────┐
  │  Complete  │ UI Renders Color-Coded Triage Brief + Debug Execution Log
  └────────────┘
```

---

## 🛠️ 5. Workflow Debugging & Audit Architecture

To enable total transparency, review, and step-by-step debugging, the orchestrator includes a dedicated **`PipelineDebugger`** service storing timestamped execution trace logs for every node.

---

## 📁 6. File-by-File Implementation Checklist

### Local Agent Tool Execution Registry (`src/agent/tools/*`)
- `src/agent/tools/index.ts` (Master Tool Execution Registry dispatching function calls)
- `src/agent/tools/kbQueryTool.ts` (`tool_query_knowledge_base`)
- `src/agent/tools/clinicalScoreTool.ts` (`tool_calculate_clinical_score`)
- `src/agent/tools/drugInteractionTool.ts` (`tool_check_drug_interactions`)
- `src/agent/tools/ageVitalsTool.ts` (`tool_validate_age_adjusted_vitals`)
- `src/agent/tools/patientTranslatorTool.ts` (`tool_generate_patient_discharge_note`)
- `src/agent/tools/fhirExportTool.ts` (`tool_export_fhir_triage_log`)

### Core Architecture Modules (`src/*`)
- `src/knowledge/index.ts` (Unified Knowledge Base Data Layer)
- `src/agent/Orchestrator.ts` (Master Workflow Coordinator executing Hybrid Cloud VLM + Local Gemma pipeline)
- `src/agent/PipelineDebugger.ts` (Debugger Service)
- `src/agent/nodes/node1_normalizer.ts` through `node6_safetyValidator.ts`
- `src/services/vlmApiService.ts` (Cloud VLM API Integration Service)
- `src/components/WorkflowDebugger.tsx` (UI Debugger Drawer)
