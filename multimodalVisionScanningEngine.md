Multimodal Vision Scanning Engine

# 📋 Implementation Plan: Multimodal Vision Scanning Engine

> **Module Location:** `src/vision/visionScanner.ts` (or `src/vision/visionScanner.py`)  
> **Primary Goal:** Enable local OCR and visual analysis of physical medical documents (Chest X-Rays, printed paper lab results, ECG strips) using Gemma Vision models.

---

## 🎯 Architectural Purpose

The Multimodal Vision Scanning module acts as the **physical-to-digital bridge** in the PulseGemma pipeline. It parses images uploaded by triage nurses or clinicians, extracts structured data (e.g., lab panel values, vital readings, radiologic findings), and standardizes them into structured JSON format to feed directly into the downstream ESI Engine and Decision-Support Dashboard.

---

## 📐 Step-by-Step Implementation Guide


```

[ Physical Document / Scan (Image) ]
│
▼
┌──────────────────────────────────────────┐
│ Phase 1: Image Processing & Preprocessing│ ── Resize, compress, & convert to Base64 / Tensor
└────────────────────┬─────────────────────┘
│
▼
┌──────────────────────────────────────────┐
│ Phase 2: Gemma Vision OCR & Extraction   │ ── Extract structured JSON (Lab ranges / Findings)
└────────────────────┬─────────────────────┘
│
▼
┌──────────────────────────────────────────┐
│ Phase 3: Pipeline Data Normalization     │ ── Feed extracted lab values to Deterministic Engine
└──────────────────────────────────────────┘

```

### Phase 1: Data Contract & Input Normalization
Establish strict interfaces to handle uploaded image files and output structured JSON formats.

* **1.1. Vision Scan Request Payload (`VisionScanInput`)**
  * Support image file input types: Base64 string, Blob, or URL.
  * Define document classification types: `'LAB_PRINTOUT' | 'XRAY_SCAN' | 'ECG_STRIP' | 'GENERAL_DOCUMENT'`.

* **1.2. Structured Extraction Result (`VisionScanResult`)**
  * Define `documentType`: Identified document class.
  * Define `extractedLabs`: Key-value map for numerical lab values (e.g., `troponin: 0.08`, `lactate: 2.1`, `wbc: 11.5`).
  * Define `visualFindings`: Array of observed clinical findings (e.g., `"Infiltrate right lower lobe"`, `"ST-segment elevation in Lead II"`).
  * Define `confidenceScore`: Confidence level of the OCR extraction.

---

### Phase 2: Gemma Vision Model Integration

Integrate the Gemma Vision API endpoint (via Ollama or vLLM edge server).

* **2.1. Local Edge API Connector**
  * Connect to the local multimodal endpoint (`http://localhost:11434/api/generate` with model `gemma4-vision` or `paligemma`).
  * Implement base64 image payload encoding to prevent high latency during file transfer.

* **2.2. Error Handling & Fallback**
  * Implement image resolution check (flag warning if image is too blurry/unreadable).
  * Fallback to manual numeric entry if OCR confidence falls below safe clinical thresholds ($<85\%$).

---

### Phase 3: Cross-Module Integration

* **3.1. Integration with Deterministic Lab Range Checker**
  * Extracted lab values (e.g., Troponin, Lactate, Potassium) pass directly to the client-side TypeScript Range Checker.
  * Trigger immediate alert flags if values fall outside standard reference ranges.

* **3.2. Integration with ESI Engine**
  * Critical visual findings (e.g., pneumothorax on X-ray, acute ECG changes) automatically set the `isHighRiskOrConfused` or `isUnresponsiveOrDying` flag to true, triggering Step A or Step B uptriaging in the ESI Engine.

---

## 🤖 System Prompt for Gemma Vision Model

Use this prompt when sending image payloads to your local Gemma Vision model:

> **Role:** You are an expert Clinical Vision OCR & Radiology Assistant.
>
> **Task:** Analyze the provided medical image (Chest X-Ray, Lab Printout, or ECG strip). Extract all readable numerical clinical data and visual observations into a strict, standardized JSON format.
>
> **Instructions:**
> 1. Identify the document type (`LAB_PRINTOUT`, `XRAY_SCAN`, `ECG_STRIP`).
> 2. For lab printouts: Extract all test names, numerical values, units, and reference flags (High/Low).
> 3. For X-Ray / ECG scans: Briefly list key anatomical/visual findings in clear medical terminology.
> 4. **Do NOT** output conversational filler. Return **ONLY valid JSON**.
>
> **Required JSON Structure:**
> ```json
> {
>   "document_type": "LAB_PRINTOUT",
>   "extracted_labs": {
>     "troponin_i": { "value": 0.42, "unit": "ng/mL", "flag": "HIGH" },
>     "potassium": { "value": 3.8, "unit": "mEq/L", "flag": "NORMAL" },
>     "lactate": { "value": 3.1, "unit": "mmol/L", "flag": "HIGH" }
>   },
>   "visual_findings": [
>     "Document indicates elevated Troponin I above clinical baseline.",
>     "Lactate level mildly elevated suggesting hypoperfusion."
>   ],
>   "ocr_confidence": "HIGH"
> }
> ```

---

## 🧪 Verification & Testing Checklist

- [ ] **Unit Test 1:** Verify image uploader successfully encodes JPEG/PNG files to Base64.
- [ ] **Unit Test 2:** Test paper lab printout scan and confirm extracted numerical values match the physical printout.
- [ ] **Unit Test 3:** Verify extracted abnormal lab values (e.g., high Troponin) automatically trigger red alerts in the UI.
- [ ] **Unit Test 4:** Verify unreadable/blurry images return a low-confidence flag prompting the user for manual entry.

``