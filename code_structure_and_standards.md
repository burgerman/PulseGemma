# 📐 PulseGemma: Production-Grade Code Structure & Coding Standards
### Architecture Blueprint & Developer Engineering Guidelines

> **"Production-ready TypeScript & React architecture for clinical-grade edge applications: zero implicit type casting, mandatory Multimodal Vision model support, local tool execution registry, pure deterministic functions, circuit-breaker resilience, and WCAG AA accessible UI design."**

---

## 📂 1. Directory Tree & Code Structure

```
PulseGemma/
├── index.html                           # Entry HTML with meta tags & Google Fonts
├── package.json                         # Dependencies & npm scripts
├── tsconfig.json                        # Strict TypeScript configuration
├── vite.config.ts                       # Vite bundler config with path aliases (@/*)
├── README.md                            # Executive overview & project blueprint (Multimodal Vision)
├── agent_orchestrator_plan.md           # 6-Node agentic pipeline & tool execution specification
├── code_structure_and_standards.md      # Production coding standards (THIS FILE)
├── feature_deterministic_range_checker.md # Feature 1 Spec
├── feature_handsfree_voice_dictation.md   # Feature 2 Spec
├── feature_grounded_cpg_rag.md            # Feature 3 Spec
│
└── src/
    ├── main.tsx                         # React 18 application mount
    ├── App.tsx                          # Core App Layout & Router
    │
    ├── types/                           # Strict TypeScript Contracts
    │   ├── clinical.ts                  # Patient, Vitals, Labs, ESI, & Guideline types
    │   ├── agent.ts                     # TriageState, NodeTrace, & Pipeline interfaces
    │   ├── tools.ts                     # Local Tool Registry schema definitions
    │   └── knowledge.ts                 # Reference Range & CPG Registry interfaces
    │
    ├── knowledge/                       # Unified Knowledge Base Data Layer
    │   ├── index.ts                     # Master UnifiedKnowledgeBase class
    │   ├── labRangesRegistry.ts         # Deterministic lab ranges & panic thresholds
    │   ├── decisionTreesRegistry.ts     # ESI v4, qSOFA, & Wells score algorithms
    │   ├── guidelinesRegistry.ts        # Verbatim CPGs (AHA, Sepsis, ESI v4)
    │   └── multilingualLexicon.ts       # 20+ language clinical term translation map
    │
    ├── engine/                          # Deterministic Rule Calculators (100% Pure Code)
    │   ├── labRangeEvaluator.ts         # Sub-millisecond range status checker
    │   ├── esiCalculator.ts             # ESI v4 decision tree evaluator
    │   └── riskScoreCalculator.ts       # qSOFA, Wells PE, & TIMI ACS scoring
    │
    ├── agent/                           # Multi-Agent Orchestrator Pipeline
    │   ├── Orchestrator.ts              # Master pipeline coordinator (State Machine)
    │   ├── PipelineDebugger.ts          # Debugger service & trace logger
    │   ├── state.ts                     # State factory & mutation helpers
    │   ├── tools/                       # Local Executable Agent Tools
    │   │   ├── index.ts                 # Tool execution registry dispatcher
    │   │   ├── kbQueryTool.ts           # tool_query_knowledge_base
    │   │   ├── clinicalScoreTool.ts     # tool_calculate_clinical_score
    │   │   ├── drugInteractionTool.ts   # tool_check_drug_interactions
    │   │   ├── ageVitalsTool.ts         # tool_validate_age_adjusted_vitals
    │   │   ├── patientTranslatorTool.ts # tool_generate_patient_discharge_note
    │   │   └── fhirExportTool.ts        # tool_export_fhir_triage_log
    │   └── nodes/                       # Pipeline Execution Nodes
    │       ├── node1_normalizer.ts      # Multilingual Translation & NLU Node
    │       ├── node2_deterministicRules.ts# Deterministic Safety Check Node
    │       ├── node3_visionAgent.ts     # Multimodal Vision OCR & Radiologic Feature Node
    │       ├── node4_ragRetrieval.ts    # Ground-Truth RAG Retrieval Node
    │       ├── node5_gemmaReasoner.ts   # Multimodal Reasoning Node
    │       └── node6_safetyValidator.ts # AST Grounding Safety Guardrail Node
    │
    ├── services/                        # Edge AI & Speech Integration
    │   ├── ollamaService.ts             # Multimodal Vision Ollama API client + Circuit Breaker
    │   ├── webSpeechService.ts          # Browser Web Speech API wrapper
    │   └── mockDataService.ts           # Pre-loaded ER Emergency Test Cases
    │
    └── components/                      # UI Component Hierarchy
        ├── Header.tsx                   # Top Bar with ESI Badge & Status Toggles
        ├── DeterministicBanner.tsx      # 100% Deterministic Rule Check Banner
        ├── PatientIntakeForm.tsx        # Voice Dictation + Text Input Panel
        ├── LabReportInspector.tsx       # Lab Values & Critical Badge Table
        ├── VisionInspector.tsx          # Medical Image Viewer (X-Ray / Lab Sheet)
        ├── GemmaDiagnosticCard.tsx      # Grounded Decision Support Output Card
        ├── GroundTruthEvidenceViewer.tsx# Guideline Passages & Clickable Citations
        ├── WorkflowDebugger.tsx         # Slide-Over Pipeline Execution Debugger
        └── SettingsModal.tsx            # Ollama Endpoint & Model Selector
```

---

## ⚙️ 2. Production Coding Standards

### 👁️ Rule A: Mandatory Multimodal Vision Model Requirement

Because clinical triage processes physical medical images (Chest X-Rays, paper lab sheet OCR, ECG strips), **pure text language models cannot execute these tasks**. The service layer MUST validate that the selected local Ollama model supports image payload inputs (`images: [base64String]`):

```typescript
// ✅ PRODUCTION STANDARD (Multimodal Vision Model Call & Circuit Breaker)
export async function callOllamaMultimodalVision<T>(
  prompt: string,
  base64Images: string[] = [],
  modelName: string = 'gemma4:vision',
  fallbackGenerator: () => T,
  timeoutMs: number = 10000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const payload: Record<string, unknown> = {
      model: modelName,
      prompt,
      stream: false
    };

    // Attach base64 image array for Multimodal Vision models
    if (base64Images.length > 0) {
      payload.images = base64Images;
    }

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!response.ok) throw new Error(`Ollama Vision HTTP Error: ${response.status}`);
    const data = await response.json();
    return JSON.parse(data.response) as T;
  } catch (error) {
    console.warn(`[Ollama Multimodal Vision] Call to ${modelName} failed/timed out. Engaging Client Edge Vision Fallback Engine.`, error);
    return fallbackGenerator();
  }
}
```

---

### 🎨 Rule B: ER High-Contrast UI & Accessibility (WCAG AA)

- **Color Tokens (`src/styles/tokens.css`)**:
  - `CRITICAL_HIGH`: `#DC2626` (Red 600 - High Contrast)
  - `WARNING`: `#D97706` (Amber 600)
  - `NORMAL`: `#059669` (Emerald 600)
  - `BACKGROUND_DARK`: `#0F172A` (Slate 900)
- **Accessibility Requirements**:
  - All interactive buttons MUST have explicit `aria-label` attributes.
  - Color BADGES must never rely on color alone—they MUST include a text status tag (e.g. `[CRITICAL HIGH]`).
  - Keyboard navigation MUST support `Tab`, `Space`, and `Enter` keys.
