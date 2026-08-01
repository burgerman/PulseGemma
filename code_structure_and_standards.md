# 📐 PulseGemma: Production-Grade Code Structure & Coding Standards
### Architecture Blueprint & Developer Engineering Guidelines

> **"Production-ready TypeScript & React architecture for clinical-grade edge applications: zero implicit type casting, local tool execution registry, pure deterministic functions, circuit-breaker resilience, and WCAG AA accessible UI design."**

---

## 📂 1. Directory Tree & Code Structure

```
PulseGemma/
├── index.html                           # Entry HTML with meta tags & Google Fonts
├── package.json                         # Dependencies & npm scripts
├── tsconfig.json                        # Strict TypeScript configuration
├── vite.config.ts                       # Vite bundler config with path aliases (@/*)
├── README.md                            # Executive overview & project blueprint
├── agent_orchestrator_plan.md           # 6-Node agentic pipeline & tool execution specification
├── code_structure_and_standards.md      # Production coding standards (THIS FILE)
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
    │       ├── node3_visionAgent.ts     # Gemma Vision OCR & Radiologic Feature Node
    │       ├── node4_ragRetrieval.ts    # Ground-Truth RAG Retrieval Node
    │       ├── node5_gemmaReasoner.ts   # Gemma 4 Clinical Reasoning Node
    │       └── node6_safetyValidator.ts # AST Grounding Safety Guardrail Node
    │
    ├── services/                        # Edge AI & Speech Integration
    │   ├── ollamaService.ts             # Ollama REST API client + Circuit Breaker
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

### 🛡️ Rule A: Strict Type Safety (No `any`, No Implicit Casting)

```typescript
// ❌ UNACCEPTABLE (Weak, unsafe code)
function processLab(data: any) {
  return data.val > 0.04 ? "CRITICAL" : "OK";
}

// ✅ PRODUCTION STANDARD (Strict types, explicit contracts)
export type LabStatus = 'CRITICAL_HIGH' | 'CRITICAL_LOW' | 'ABNORMAL_HIGH' | 'ABNORMAL_LOW' | 'NORMAL';

export interface EvaluatedLabResult {
  readonly testId: string;
  readonly testName: string;
  readonly value: number;
  readonly unit: string;
  readonly status: LabStatus;
  readonly referenceMin: number;
  readonly referenceMax: number;
  readonly isCritical: boolean;
}

export function evaluateLabValue(
  testId: string,
  value: number,
  range: ReferenceRange
): EvaluatedLabResult {
  // Deterministic calculation logic...
}
```

- **Rule A1**: `tsconfig.json` MUST enforce `"strict": true`, `"noImplicitAny": true`, `"noUnusedLocals": true`.
- **Rule A2**: All data models MUST use `readonly` properties for state snapshots to prevent unintended mutations.

---

### ⚛️ Rule B: Immutability & Pure Functional Engine

- **Pure Rule Engine**: Functions inside `src/engine/` MUST be **pure mathematical functions** with no side effects, DOM access, or network calls.
- **Immutable State Updates**: State updates in `Orchestrator.ts` MUST create new state object references:

```typescript
// ✅ PRODUCTION STANDARD (Immutable State Transition)
this.state = {
  ...this.state,
  currentStep: 'CHECKING_RULES',
  node2_deterministicResults: Object.freeze(evaluatedPayload),
};
this.notifyListeners();
```

---

### 🛠️ Rule C: Local Tool Execution Interface

- Every local tool in `src/agent/tools/` MUST implement a unified interface:

```typescript
export interface AgentTool<TParams = any, TResult = any> {
  readonly name: string;
  readonly description: string;
  readonly schema: Record<string, unknown>;
  execute(params: TParams): Promise<TResult> | TResult;
}
```

---

### 🔌 Rule D: Resilient Edge API Integration & Circuit Breakers

- Network calls to Ollama (`http://localhost:11434`) MUST be wrapped in a **Circuit Breaker** pattern with a configurable timeout (default 8000ms).
- If Ollama is offline or times out, the system MUST gracefully fall back to the built-in offline simulator without crashing the UI.

```typescript
// ✅ PRODUCTION STANDARD (Circuit Breaker & Fallback)
export async function callOllamaWithFallback<T>(
  prompt: string,
  fallbackGenerator: () => T,
  timeoutMs: number = 8000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gemma2', prompt, stream: false }),
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!response.ok) throw new Error(`Ollama HTTP Error: ${response.status}`);
    const data = await response.json();
    return JSON.parse(data.response) as T;
  } catch (error) {
    console.warn('[Ollama API] Connection failed or timed out. Engaging Edge Fallback Simulator.', error);
    return fallbackGenerator();
  }
}
```

---

### 🎨 Rule E: ER High-Contrast UI & Accessibility (WCAG AA)

In an Emergency Room, visibility under harsh fluorescent lighting is critical:

- **Color Tokens (`src/styles/tokens.css`)**:
  - `CRITICAL_HIGH`: `#DC2626` (Red 600 - High Contrast)
  - `WARNING`: `#D97706` (Amber 600)
  - `NORMAL`: `#059669` (Emerald 600)
  - `BACKGROUND_DARK`: `#0F172A` (Slate 900)
- **Accessibility Requirements**:
  - All interactive buttons MUST have explicit `aria-label` attributes.
  - Color BADGES must never rely on color alone—they MUST include a text status tag (e.g. `[CRITICAL HIGH]`).
  - Keyboard navigation MUST support `Tab`, `Space`, and `Enter` keys.

---

### 📝 Rule F: Documentation & Inline Comments

- All public functions and classes MUST feature JSDoc comments explaining parameters, return values, and clinical safety considerations.
