ESI v4 Deterministic Triage Engine
# 📋 Implementation Plan: ESI v4 Deterministic Triage Engine

> **Module Location:** `src/engine/esiTriageEngine.ts`  
> **Primary Goal:** Implement a 100% deterministic, 0ms-latency client-side triage calculator adhering strictly to ESI v4 flowchart rules.

---

## 🎯 Architectural Purpose

The ESI v4 Triage Engine operates as a **zero-hallucination, client-side decision tree**. It processes incoming patient vitals and clinical indicators to output a validated Emergency Severity Index (ESI) classification (Levels 1 through 5) before passing the structured result to local Gemma models for grounded reasoning and UI presentation.

---

## 📐 Step-by-Step Implementation Guide


```

[ Input Received ]
│
▼
[ Step A: Life Threat? ] ──(Yes)──> 🔴 ESI Level 1
│ (No)
▼
[ Step B: High Risk / Distress? ] ──(Yes)──> 🟠 ESI Level 2
│ (No)
▼
[ Step C: Resource Count? ]
├── (0 Resources) ──────────> 🔵 ESI Level 5
├── (1 Resource) ───────────> 🟢 ESI Level 4
└── (2+ Resources)
│
▼
[ Step D: Danger Vitals? ]
├── (Yes) ────────> 🟠 ESI Level 2 (Uptriaged)
└── (No) ─────────> 🟡 ESI Level 3

```

### Phase 1: Data Contract Definition
Establish strict TypeScript interfaces to handle raw patient inputs and standardized outputs.

* **1.1. Patient Vitals Interface (`PatientVitals`)**
  * Define optional fields for continuous metrics: `heartRate`, `respiratoryRate`, `oxygenSaturation`, and `systolicBP`.
  * Define a required field for patient `age` (used for age-adjusted danger zone evaluation).

* **1.2. Triage Input Payload (`ESIPatientInput`)**
  * Map Step A boolean: `isUnresponsiveOrDying`.
  * Map Step B boolean: `isHighRiskOrConfused`.
  * Map Step C resource counter: `estimatedResourcesCount` (integer range 0 to 2+).
  * Embed the `PatientVitals` interface for Step D evaluation.

* **1.3. Evaluation Result Output (`ESIEvaluationResult`)**
  * Define `esiLevel` as a literal type union (`1 | 2 | 3 | 4 | 5`).
  * Define UI color codes (`RED`, `ORANGE`, `YELLOW`, `GREEN`, `BLUE`).
  * Include descriptive string properties: `levelTitle` and `rationale`.
  * Include a boolean flag: `isVitalSignWarning` to signal vital-based uptriaging.

---

### Phase 2: Core Algorithm Development

Create the `ESITriageEngine` class with two core static methods following the official ESI v4 decision sequence.

* **2.1. Vital Signs Danger Zone Evaluator (`isVitalInDangerZone`)**
  * Evaluate absolute threshold: Trigger danger flag if `oxygenSaturation` is below **92%** regardless of age.
  * Evaluate adult thresholds (Age $\ge$ 18): Trigger danger flag if `heartRate > 100` bpm or `respiratoryRate > 20` breaths/min.
  * Evaluate pediatric thresholds (e.g., Age 1–8): Trigger danger flag if `heartRate > 140` bpm or `respiratoryRate > 30` breaths/min.

* **2.2. Decision Tree Evaluator (`evaluateESI`)**
  * **Step A Execution:** Check `isUnresponsiveOrDying`. Return **ESI Level 1 (RED)** immediately if true.
  * **Step B Execution:** Check `isHighRiskOrConfused`. Return **ESI Level 2 (ORANGE)** if true.
  * **Step C Execution:** Evaluate `estimatedResourcesCount`:
    * If `0` $\rightarrow$ Return **ESI Level 5 (BLUE)**.
    * If `1` $\rightarrow$ Return **ESI Level 4 (GREEN)**.
    * If `2+` $\rightarrow$ Proceed to Step D.
  * **Step D Execution:** Pass vitals to `isVitalInDangerZone()`:
    * If danger vitals present $\rightarrow$ Uptriage to **ESI Level 2 (ORANGE)** with `isVitalSignWarning = true`.
    * If vitals stable $\rightarrow$ Return **ESI Level 3 (YELLOW)**.

---

### Phase 3: Cross-Module Integration

* **3.1. Upstream Pipeline Integration (Daniel's Translation Engine)**
  * Extract clinical indicators from Daniel's translated English text output.
  * Map extracted findings directly to `isHighRiskOrConfused` and `estimatedResourcesCount` fields.

* **3.2. Downstream Pipeline Integration (Gemma Grounded Reasoning)**
  * Pass the output object (`ESIEvaluationResult`) into Gemma's context payload.
  * Configure Gemma's prompt to attach official clinical guideline citations matching the calculated ESI Level.
  * Render the result on the clinician dashboard using the designated `colorCode` and `rationale`.

---

## 🤖 System Prompt for Local Gemma Integration

Use this prompt when providing the calculated ESI result to your local Gemma model for dashboard synthesis:

> **Role:** You are an Edge Clinical Triage Assistant operating strictly under Emergency Severity Index (ESI v4) guidelines.
>
> **Task:** Synthesize the patient intake assessment and explain the assigned ESI triage classification for the attending physician.
>
> **Provided Context:**
> * **Calculated ESI Level:** `{esiLevel}` (`{levelTitle}`)
> * **Clinical Rationale:** `{rationale}`
> * **Extracted Vitals:** `{vitals_json}`
> * **Official Guideline Citation:** `[AHA/ACEP ESI v4 Guidelines - Section 3.2]`
>
> **Instructions:**
> 1. Summarize the intake assessment for the ER doctor in **3 concise bullet points**.
> 2. Cite the exact provided guideline reference for the assigned triage level.
> 3. Highlight any critical vital sign warnings or acute risk factors.
> 4. **DO NOT** make up diagnostic claims or prescribe treatments outside the provided context.

---

## 🧪 Verification & Testing Checklist

- [ ] **Unit Test 1:** Verify Step A returns ESI Level 1 when `isUnresponsiveOrDying` is true.
- [ ] **Unit Test 2:** Verify Step B returns ESI Level 2 for high-risk presentations with stable vitals.
- [ ] **Unit Test 3:** Verify Step C correctly assigns Level 5 (0 resources) and Level 4 (1 resource).
- [ ] **Unit Test 4:** Verify Step D successfully uptriages a 2-resource patient from Level 3 to Level 2 when SpO2 drops below 92%.
- [ ] **Unit Test 5:** Verify pediatric heart rate thresholds correctly trigger Step D uptriaging for child profiles.

```