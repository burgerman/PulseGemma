> ⚠️ **Superseded:** This document has been restructured into `orchestrator-mvp-plan.md`,
> which aligns with the project's orchestrator architecture (Node 1 / Node 2 naming).
> Kept here for reference only — build against `orchestrator-mvp-plan.md`.

# Clinical Triage Hackathon — Implementation Plan

**Project:** Homecare pre-diagnosis app that translates and structures patient symptom descriptions, then checks lab values against safe clinical ranges.

**Team size:** 3
**Time budget:** 5 hours total
**AI model:** Gemma API

---

## Feature 1: Multilingual Clinical Translation

### What it does
Takes a patient's symptom description in any language (text now, voice-ready later) and converts it into structured, standardized English medical data that healthcare workers can act on instantly.

### Data flow
```
Patient input (text box)
      ↓
Frontend form
      ↓
Backend endpoint: POST /api/translate-intake
      ↓
Single Gemma API call (translate + structure in one prompt)
      ↓
JSON response → saved to DB → shown in worker-facing view
```

### Tech stack
| Layer | Choice |
|---|---|
| Backend | Node/Express or Python/Flask |
| Frontend | HTML/JS or React — textarea + submit button |
| Storage | SQLite or JSON file |
| AI | Gemma API |

### Core prompt
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

### Timeline (~2 hours)
| Time | Task |
|---|---|
| 0:00–0:20 | Backend route set up, Gemma API key confirmed working |
| 0:20–0:50 | Test prompt with 4–5 sample inputs, tune until JSON is reliable |
| 0:50–1:20 | Wire frontend form → backend → display structured result |
| 1:20–1:40 | Add storage — save each submission to SQLite/JSON |
| 1:40–2:00 | Add red banner styling for `urgent_flag: true` |

### Demo test inputs
- Spanish: "Me duele mucho el pecho desde ayer, no puedo respirar bien"
- French: "J'ai mal à la tête depuis trois jours"
- Broken English: "stomach hurt bad two day, no eat"

### Risk to watch
Gemma may wrap JSON in markdown fences — strip those and use try/catch before parsing so a bad response doesn't break the live demo.

---

## Feature 2: Deterministic Range Checker

### What it does
Instantly flags lab values that fall outside safe clinical ranges (e.g. Troponin, Potassium, Lactate). No AI involved — pure deterministic math, so it's 100% reliable and instant (0ms).

### Data flow
```
Lab value input (test name + number)
      ↓
Backend endpoint: POST /api/check-range
      ↓
Compare value against threshold table (no API call)
      ↓
JSON response: { status: "normal" | "high" | "low", severity }
      ↓
Display green/yellow/red result in UI
```

### Tech stack
| Layer | Choice |
|---|---|
| Backend | Same Express/Flask server as Feature 1 — just a new route |
| Frontend | Simple form (test name dropdown + value input) |
| Storage | Optional — can log to same DB as Feature 1 |
| AI | None needed |

### Core logic
```javascript
const thresholds = {
  troponin: { high: 0.04, unit: "ng/mL" },
  potassium: { low: 3.5, high: 5.0, unit: "mEq/L" },
  lactate: { high: 2.0, unit: "mmol/L" }
};

function checkRange(test, value) {
  const t = thresholds[test];
  if (!t) return { status: "unknown" };
  if (t.high !== undefined && value > t.high) return { status: "high", severity: "critical" };
  if (t.low !== undefined && value < t.low) return { status: "low", severity: "critical" };
  return { status: "normal", severity: "none" };
}
```

### Timeline (~45 min)
| Time | Task |
|---|---|
| 0:00–0:10 | Add threshold table + `checkRange()` function to backend |
| 0:10–0:20 | Build API route `/api/check-range` that calls the function |
| 0:20–0:35 | Frontend form: dropdown for test name, number input for value |
| 0:35–0:45 | Color-code result (green/yellow/red) and display |

### Demo test inputs
- Troponin: 0.08 → should flag "high, critical"
- Potassium: 4.2 → should show "normal"
- Lactate: 3.5 → should flag "high, critical"

### Risk to watch
None really — no external API dependency. Good one to build first for an early win.

---

## Combined System Notes

Both features can share:
- The same Express/Flask server (different routes: `/api/translate-intake`, `/api/check-range`)
- The same database/storage file
- The same frontend app (different tabs or sections in one UI)

**Suggested build order:** Feature 2 first (fastest, no external dependency, early confidence win) → Feature 1 second (core AI feature, needs more debugging time).

---

*This document is structured so additional features (e.g. ESI Triage Engine) can be appended below using the same template: What it does → Data flow → Tech stack → Core logic → Timeline → Test inputs → Risk to watch.*
