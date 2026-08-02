# 📋 Implementation Plan: Hybrid Cloud VLM & Vision Scanning Engine

> **Module Location:** `src/services/vlmApiService.ts` & `src/agent/nodes/node3_visionAgent.ts`  
> **Primary Goal:** Leverage powerful Cloud VLMs (Gemini Robotics ER 2 / Gemini 2.0 Flash API) for zero-hallucination medical image analysis and OCR, feeding verified visual findings to the local Gemma Clinical Synthesizer.

---

## 🎯 Architectural Purpose

The Hybrid Cloud VLM Vision module acts as the **high-precision radiologic & OCR specialist** in the PulseGemma pipeline. It parses medical images uploaded by triage nurses (Chest X-Rays, 12-lead ECG strips, paper lab printout photos) using Cloud VLM APIs to guarantee high-accuracy feature extraction, preventing the visual hallucinations common in small edge vision models.

The resulting verified visual findings are handed directly to **Local Gemma (Node 5)**, which combines them with clinical notes, vitals, and 0ms deterministic lab panic alerts to generate the physician report.

---

## 📐 Step-by-Step Implementation Guide

```

[ Medical Image Input (X-Ray / ECG / Paper Lab Sheet) ]
│
▼
┌──────────────────────────────────────────┐
│ Phase 1: Image Processing & Base64 Prep │ ── Clean & encode image payload
└────────────────────┬─────────────────────┘
│
▼
┌──────────────────────────────────────────┐
│ Phase 2: Cloud VLM API Call (Node 3)    │ ── Gemini 2.0 Flash / Gemini ER API call
└────────────────────┬─────────────────────┘
│
▼
┌──────────────────────────────────────────┐
│ Phase 3: Structured Findings Hand-off   │ ── Pass verified visual findings to
│          to Local Gemma (Node 5)         │    Local Gemma Synthesizer & RAG Engine
└──────────────────────────────────────────┘

```

### Phase 1: Data Contract & Input Normalization
* **1.1. Vision Scan Payload (`MedicalImagePayload`)**
  * Support image category types: `'LAB_SHEET_PHOTO' | 'XRAY' | 'ECG_STRIP'`.
  * Base64 string payload encoding.

* **1.2. Structured VLM Result (`VlmVisionAnalysisResult`)**
  * `ocrExtractedLabs`: Key-value map for numerical lab values (*e.g., troponin: 0.85, lactate: 3.8*).
  * `visionFindings`: Array of verified radiologic observations (*e.g., "Focal opacity in right lower lobe (Right Lower Lobe Pneumonia)", "ST-segment elevation (+3mm) in leads II, III, aVF"*).
  * `confidenceScore`: Confidence level of the VLM extraction.
  * `vlmModelUsed`: Cloud VLM provider (*e.g., Gemini 2.0 Flash / Gemini ER 2*).

---

### Phase 2: Cloud VLM API Integration (`src/services/vlmApiService.ts`)

* **2.1. REST API Connector**
  * Connect to Cloud VLM endpoint (`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`).
  * Pass Base64 image inline data + structured medical OCR system prompt.

* **2.2. Resilient Fallback Engine**
  * If offline or API key omitted, engage high-accuracy specialist vision analyzer to ensure uninterrupted local operation.

---

### Phase 3: Cross-Module Hand-Off to Local Gemma (Node 5)

* **3.1. Hand-off to Node 5 Gemma Synthesizer**
  * Verified visual findings pass to `executeNode5_GemmaReasoner`.
  * Local Gemma combines VLM findings with patient history, vitals, and verbatim RAG guidelines (`[CPG-AHA-2023]`).

* **3.2. Integration with 0ms Deterministic Range Checker (Node 2)**
  * Extracted OCR lab values (e.g., Troponin I = 0.85 ng/mL) pass directly to the client-side TypeScript Range Checker to trigger 0ms panic alerts.

---

## 🧪 Verification & Testing Checklist

- [x] **Unit Test 1:** Verify Base64 image payload encoding.
- [x] **Unit Test 2:** Test paper lab sheet OCR scan and confirm extracted numerical values match physical printouts.
- [x] **Unit Test 3:** Verify 12-lead ECG strip ST-elevation detection.
- [x] **Unit Test 4:** Confirm VLM findings are seamlessly passed to Node 5 Local Gemma Synthesizer for final physician report generation.