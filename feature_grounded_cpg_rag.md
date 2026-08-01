# 📚 Feature Specification: Grounded CPG RAG Retrieval Engine
### PulseGemma Evidence & Auditability Feature (Gemma 4 12B)

> **"Local RAG retrieval matching patient findings against verbatim Emergency Clinical Practice Guidelines with 100% auditable clickable citations for Gemma 4 12B reasoning."**

---

## 📋 1. Problem & Clinical Objective

Generic AI models risk patient safety by generating ungrounded clinical claims. The **Grounded CPG RAG Retrieval Engine** constrains **Gemma 4 12B's reasoning** to verbatim local emergency Clinical Practice Guidelines (CPGs) from **AHA 2023 Acute Chest Pain, Surviving Sepsis Campaign 2021, ESI v4 Handbook, and ACEP Protocols**.

Every diagnostic recommendation emitted by Gemma 4 12B **must** include an interactive, auditable citation ID tag (`[CPG-AHA-2023-ACS-4.2]`).

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

## 🛠️ 3. Local Agent Tool Integration (`src/agent/tools/kbQueryTool.ts`)

Gemma 4 12B can dynamically invoke `tool_query_knowledge_base` during reasoning:

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

## 🧪 4. Verification & Audit Guardrail

1. **AST Citation Check (Node 6)**:
   - Node 6 parses Gemma 4 12B's generated JSON. If any generated citation ID does not exist in `guidelinesRegistry.ts`, Node 6 flags it as an *Ungrounded Claim* and redacts it before rendering.
