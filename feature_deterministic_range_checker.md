# 🔴 Feature Specification: Deterministic Range Checker Engine
### PulseGemma Core Safety Feature

> **"0ms client-side calculation of critical high/low lab thresholds with 0% model hallucination risk."**

---

## 📋 1. Problem & Clinical Objective

In emergency medicine, delayed recognition of acute laboratory anomalies (e.g. Troponin leak in acute coronary syndrome, severe hyperkalemia leading to arrhythmias, or acute lactic acidosis in sepsis) can lead to cardiac arrest or septic shock. 

Language models operate on statistical probabilities and must **never** be trusted to calculate numerical thresholds. The **Deterministic Range Checker Engine** provides sub-millisecond, client-side calculation of lab status using hardcoded mathematical rules, guaranteeing **100% mathematical accuracy and zero hallucination**.

---

## 🏗️ 2. Module Architecture & File Locations

```
PulseGemma/src/
├── types/clinical.ts                 # ReferenceRange & EvaluatedLabResult schemas
├── knowledge/labRangesRegistry.ts    # Centralized reference ranges & panic limits
├── engine/labRangeEvaluator.ts       # 100% Pure mathematical evaluator function
└── components/LabReportInspector.tsx # Interactive UI table & visual range sliders
```

---

## 📐 3. Technical Data Schemas (`src/types/clinical.ts`)

```typescript
export type LabStatus = 
  | 'CRITICAL_HIGH' 
  | 'CRITICAL_LOW' 
  | 'ABNORMAL_HIGH' 
  | 'ABNORMAL_LOW' 
  | 'NORMAL';

export interface ReferenceRange {
  readonly testId: string;
  readonly testName: string;
  readonly category: 'CARDIAC' | 'METABOLIC' | 'HEMATOLOGY' | 'BLOOD_GAS' | 'INFLAMMATORY';
  readonly unit: string;
  readonly normalMin: number;
  readonly normalMax: number;
  readonly criticalMin?: number; // Triggers Panic Red Alert
  readonly criticalMax?: number; // Triggers Panic Red Alert
}

export interface EvaluatedLabResult {
  readonly testId: string;
  readonly testName: string;
  readonly category: string;
  readonly value: number;
  readonly unit: string;
  readonly status: LabStatus;
  readonly isCritical: boolean;
  readonly referenceMin: number;
  readonly referenceMax: number;
  readonly deviationPercentage: number; // For UI range slider positioning (0-100%)
}
```

---

## ⚙️ 4. Pure Evaluator Implementation (`src/engine/labRangeEvaluator.ts`)

```typescript
import { ReferenceRange, EvaluatedLabResult, LabStatus } from '../types/clinical';
import { LAB_RANGES_REGISTRY } from '../knowledge/labRangesRegistry';

/**
 * Evaluates a numerical laboratory value deterministically against clinical reference ranges.
 * @param testId Unique lab test identifier (e.g. 'TROPONIN_I', 'POTASSIUM', 'LACTATE')
 * @param value Measured lab result value
 * @returns EvaluatedLabResult containing status badges and deviation position
 * @clinical_safety 100% Pure mathematical code. Zero LLM involvement.
 */
export function evaluateLabValue(testId: string, value: number): EvaluatedLabResult {
  const range = LAB_RANGES_REGISTRY[testId];
  if (!range) {
    throw new Error(`Unknown lab test ID: ${testId}`);
  }

  let status: LabStatus = 'NORMAL';
  let isCritical = false;

  // 1. Check Panic Critical Thresholds
  if (range.criticalMax !== undefined && value >= range.criticalMax) {
    status = 'CRITICAL_HIGH';
    isCritical = true;
  } else if (range.criticalMin !== undefined && value <= range.criticalMin) {
    status = 'CRITICAL_LOW';
    isCritical = true;
  } 
  // 2. Check Standard Abnormal Thresholds
  else if (value > range.normalMax) {
    status = 'ABNORMAL_HIGH';
  } else if (value < range.normalMin) {
    status = 'ABNORMAL_LOW';
  }

  // 3. Compute position percentage for UI slider rendering (0% to 100%)
  const span = range.normalMax - range.normalMin;
  const deviation = Math.min(Math.max(((value - range.normalMin) / span) * 50 + 25, 0), 100);

  return {
    testId,
    testName: range.testName,
    category: range.category,
    value,
    unit: range.unit,
    status,
    isCritical,
    referenceMin: range.normalMin,
    referenceMax: range.normalMax,
    deviationPercentage: Math.round(deviation)
  };
}
```

---

## 🎨 5. UI Component Behavior (`src/components/LabReportInspector.tsx`)

- **Visual Badges**:
  - `CRITICAL_HIGH` / `CRITICAL_LOW`: Pulsing Red Badge (`#DC2626`) with text tag `[CRITICAL HIGH]`.
  - `ABNORMAL_HIGH` / `ABNORMAL_LOW`: Amber Badge (`#D97706`) with text tag `[HIGH]` / `[LOW]`.
  - `NORMAL`: Soft Emerald Badge (`#059669`) with text tag `[NORMAL]`.
- **Interactive Slider**:
  - Renders a horizontal gradient bar with a pin indicator positioned at `deviationPercentage`.

---

## 🧪 6. Verification & Test Plan

1. **Unit Test Boundaries**:
   - `Troponin I = 0.05 ng/mL` $\rightarrow$ `CRITICAL_HIGH` (Critical Limit = 0.04).
   - `Potassium = 2.5 mEq/L` $\rightarrow$ `CRITICAL_LOW` (Critical Limit = 2.8).
   - `Potassium = 4.2 mEq/L` $\rightarrow$ `NORMAL`.
2. **Performance SLA**:
   - Execution time for evaluating a panel of 20 lab values MUST be `< 1ms`.
