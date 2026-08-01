# Orchestrator MVP — Hackathon Scope (5 hours)

This is the **scoped-down** version of `agent_orchestrator_plan.md`, built for the hackathon demo.
Only **Node 1** and **Node 2** are implemented. Everything else in the full architecture
(vision OCR, RAG, drug interactions, FHIR export, debugger UI) is future work — noted but not built.

---

## Pipeline

```
Patient Input (text)
      ↓
Orchestrator.ts (calls nodes in sequence)
      ↓
Node 1: node1_normalizer.ts  →  Gemma translate + structure
      ↓
Node 2: node2_safetyValidator.ts  →  Deterministic lab range check
      ↓
Final Payload  →  UI renders color-coded result
```

---

## File structure

```
src/
  agent/
    Orchestrator.ts
    nodes/
      node1_normalizer.ts
      node2_safetyValidator.ts
  knowledge/
    labThresholds.ts
```

---

## Node 1: `node1_normalizer.ts`
Translates patient input (any language) into structured English medical data via Gemma.

**Prompt:**
```
You are a clinical intake assistant. The patient wrote the following message,
possibly in a language other than English.

1. Detect the language.
2. Translate it into clear English.
3. Extract these fields if present: chief_complaint, symptom_duration,
   severity (mild/moderate/severe), location_on_body, associated_symptoms.
4. Flag red-flag terms (chest pain, difficulty breathing, severe bleeding,
   confusion, one-sided weakness) as "urgent_flag": true.

Respond ONLY in this JSON format:
{
  "detected_language": "",
  "translated_text": "",
  "chief_complaint": "",
  "symptom_duration": "",
  "severity": "",
  "location_on_body": "",
  "associated_symptoms": [],
  "urgent_flag": false
}

Patient message: "{input}"
```

---

## Node 2: `node2_safetyValidator.ts`
Deterministic lab threshold check — no AI, pure code, instant.

```typescript
const thresholds = {
  troponin: { high: 0.04, unit: "ng/mL" },
  potassium: { low: 3.5, high: 5.0, unit: "mEq/L" },
  lactate: { high: 2.0, unit: "mmol/L" }
};

function checkRange(test: string, value: number) {
  const t = thresholds[test];
  if (!t) return { status: "unknown" };
  if (t.high !== undefined && value > t.high) return { status: "high", severity: "critical" };
  if (t.low !== undefined && value < t.low) return { status: "low", severity: "critical" };
  return { status: "normal", severity: "none" };
}
```

---

## Orchestrator: `Orchestrator.ts`
Calls Node 1, then Node 2, merges results. No event system or state machine needed at this scope.

```typescript
async function runTriagePipeline(
  patientInput: string,
  labs?: { test: string; value: number }[]
) {
  const normalized = await node1_normalizer(patientInput); // Gemma call
  const safetyResult = labs ? labs.map(l => checkRange(l.test, l.value)) : null;

  return {
    ...normalized,
    labFlags: safetyResult
  };
}
```

---

## Timeline (~2.75 hrs, leaves buffer)

| Time | Task |
|---|---|
| 0:00–0:20 | Gemma API key confirmed, project scaffolding matches structure above |
| 0:20–0:50 | Build `node1_normalizer.ts` |
| 0:50–1:10 | Build `node2_safetyValidator.ts` |
| 1:10–1:30 | Build `Orchestrator.ts` to call both in sequence |
| 1:30–2:00 | Frontend form → Orchestrator → display combined result |
| 2:00–2:20 | Storage + urgent_flag/lab-flag styling |
| 2:20–2:45 | Buffer for bugs, demo polish |

---

## Explicitly NOT built in this scope
- Node 3 (Vision OCR)
- Node 4 (RAG / knowledge base retrieval)
- Node 5 (full clinical reasoning + citations)
- Node 6 (grounding validator + FHIR export)
- `PipelineDebugger` / `WorkflowDebugger.tsx`
- Drug interaction / allergy checking
- Age-adjusted vitals

These remain in `agent_orchestrator_plan.md` as the long-term architecture.
