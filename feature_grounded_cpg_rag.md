# 📚 Feature Specification: Grounded CPG RAG Retrieval Engine
### PulseGemma Evidence & Auditability Feature

> **"Local RAG retrieval matching patient findings against verbatim Emergency Clinical Practice Guidelines with 100% auditable clickable citations."**

---

## 📋 1. Problem & Clinical Objective

Generic AI models risk patient safety by generating ungrounded clinical claims. The **Grounded CPG RAG Retrieval Engine** constrains Gemma 4's reasoning to verbatim local emergency Clinical Practice Guidelines (CPGs) from **AHA 2023 Acute Chest Pain, Surviving Sepsis Campaign 2021, ESI v4 Handbook, and ACEP Protocols**.

Every diagnostic recommendation emitted by Gemma 4 **must** include an interactive, auditable citation ID tag (`[CPG-AHA-2023-ACS-4.2]`).

---

## 🏗️ 2. Module Architecture & File Locations

```
PulseGemma/src/
├── knowledge/guidelinesRegistry.ts          # Centralized verbatim CPG passage store
├── agent/nodes/node4_ragRetrieval.ts        # In-memory BM25 / Vector retriever node
├── agent/tools/kbQueryTool.ts               # Local tool_query_knowledge_base implementation
└── components/GroundTruthEvidenceViewer.tsx # Interactive evidence viewer UI card
```

---

## 📐 3. Guideline Schema & Search Engine (`src/agent/nodes/node4_ragRetrieval.ts`)

```typescript
export interface GuidelinePassage {
  readonly citationId: string; // e.g. 'CPG-AHA-2023-ACS-4.2'
  readonly sourceTitle: string; // e.g. 'AHA/ACC 2023 Guidelines for Acute Chest Pain'
  readonly section: string;
  readonly text: string;
  readonly keywords: readonly string[];
}

/**
 * Retrieves verbatim guideline passages relevant to patient presentation.
 * @param symptomKeywords Array of normalized symptom keywords
 * @param labAlerts Array of active lab alerts (e.g. 'TROPONIN_HIGH', 'LACTATE_CRITICAL')
 * @param topK Maximum number of passages to return (default 3)
 * @returns Array of matching GuidelinePassage objects
 */
export function retrieveRelevantGuidelines(
  symptomKeywords: readonly string[],
  labAlerts: readonly string[],
  topK: number = 3
): GuidelinePassage[] {
  const allGuidance = GUIDELINES_REGISTRY;
  const searchTokens = [...symptomKeywords, ...labAlerts].map(k => k.toLowerCase());

  // Rank passages based on keyword overlap score
  const scoredPassages = allGuidance.map(passage => {
    let score = 0;
    passage.keywords.forEach(keyword => {
      if (searchTokens.some(token => token.includes(keyword.toLowerCase()))) {
        score += 1;
      }
    });
    return { passage, score };
  });

  return scoredPassages
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.passage);
}
```

---

## 🛠️ 4. Local Agent Tool Integration (`src/agent/tools/kbQueryTool.ts`)

Gemma 4 can dynamically invoke `tool_query_knowledge_base` during reasoning:

```typescript
export const kbQueryTool: AgentTool = {
  name: 'tool_query_knowledge_base',
  description: 'Queries verified emergency clinical practice guidelines for ground-truth passages.',
  schema: {
    type: 'object',
    properties: {
      queryKeywords: { type: 'array', items: { type: 'string' } },
      category: { type: 'string' }
    },
    required: ['queryKeywords']
  },
  execute: async (params: { queryKeywords: string[] }) => {
    return retrieveRelevantGuidelines(params.queryKeywords, []);
  }
};
```

---

## 🎨 5. UI Evidence Viewer & Citation Modal (`src/components/GroundTruthEvidenceViewer.tsx`)

- **Interactive Badges**: Renders clickable citation badges (e.g. `[CPG-AHA-2023-ACS-4.2]`) next to every AI recommendation.
- **Evidence Modal**: Clicking any citation opens a side drawer displaying:
  - Source Title (e.g. *AHA/ACC 2023 Acute Chest Pain Guidelines*)
  - Section & Page Number
  - Verbatim Guideline Paragraph
  - Matching Patient Trigger Flags

---

## 🧪 6. Verification & Audit Guardrail

1. **AST Citation Check (Node 6)**:
   - Node 6 parses Gemma 4's generated JSON. If any generated citation ID does not exist in `guidelinesRegistry.ts`, Node 6 flags it as an *Ungrounded Claim* and redacts it before rendering.
