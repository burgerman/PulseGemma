/**
 * Sample Medical Image Payloads (Data URIs) for testing Multimodal Vision & OCR Capabilities.
 */

// 1. 12-Lead ECG Strip Image (Data URI SVG)
export const SAMPLE_ECG_STEMI_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300" style="background-color: #0f172a;">
  <!-- Grid Background -->
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />
  
  <!-- ECG Calibration Box & Grid Lines -->
  <text x="20" y="30" fill="#f43f5e" font-family="monospace" font-size="14" font-weight="bold">12-LEAD ECG STRIP: LEAD II / III / aVF</text>
  <text x="450" y="30" fill="#e2e8f0" font-family="monospace" font-size="12">Paper Speed: 25mm/s</text>
  
  <!-- ECG Waveform with ST Elevation -->
  <path d="M 20 150 L 60 150 L 70 140 L 80 150 L 90 150 L 100 220 L 115 50 L 130 180 L 140 100 L 170 100 L 190 150 L 250 150 
           L 260 140 L 270 150 L 280 150 L 290 220 L 305 50 L 320 180 L 330 95 L 360 95 L 380 150 L 440 150
           L 450 140 L 460 150 L 470 150 L 480 220 L 495 50 L 510 180 L 520 95 L 550 95 L 570 150" 
        fill="none" stroke="#f43f5e" stroke-width="3.5" stroke-linejoin="round" />
        
  <!-- ST Elevation Highlight Box -->
  <rect x="130" y="80" width="50" height="50" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" stroke-width="2" stroke-dasharray="4" />
  <text x="135" y="72" fill="#f43f5e" font-family="monospace" font-size="11" font-weight="bold">ST ELEVATION (+3mm)</text>
</svg>
`)}`;

// 2. Chest X-Ray Scan Image (Data URI SVG)
export const SAMPLE_CHEST_XRAY_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350" viewBox="0 0 600 350" style="background-color: #020617;">
  <!-- X-Ray Lung Fields Outline -->
  <path d="M 180 80 Q 140 140 150 260 Q 220 280 260 220 C 270 180 240 100 180 80 Z" fill="#1e293b" stroke="#475569" stroke-width="2"/>
  <path d="M 420 80 Q 460 140 450 260 Q 380 280 340 220 C 330 180 360 100 420 80 Z" fill="#1e293b" stroke="#475569" stroke-width="2"/>
  
  <!-- Spine & Mediastinum Contour -->
  <rect x="285" y="40" width="30" height="270" fill="#334155" rx="5"/>
  <path d="M 285 140 Q 240 180 285 230 Z" fill="#475569" />
  
  <!-- Pneumonia Focal Opacity in Right Lower Lobe -->
  <ellipse cx="400" cy="220" rx="35" ry="25" fill="rgba(255,255,255,0.65)" filter="blur(3px)" />
  
  <!-- Annotations & ROI Target -->
  <rect x="350" y="180" width="90" height="75" fill="rgba(168,85,247,0.15)" stroke="#a855f7" stroke-width="2" stroke-dasharray="4" />
  <text x="355" y="172" fill="#c084fc" font-family="monospace" font-size="11" font-weight="bold">RLL CONSOLIDATION</text>
  <text x="20" y="30" fill="#94a3b8" font-family="monospace" font-size="14" font-weight="bold">CHEST X-RAY PA VIEW (DICOM)</text>
</svg>
`)}`;

// 3. Printed Lab Sheet Photo (Data URI SVG)
export const SAMPLE_LAB_SHEET_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350" viewBox="0 0 600 350" style="background-color: #0f172a;">
  <rect x="30" y="20" width="540" height="310" fill="#f8fafc" rx="8" stroke="#cbd5e1" stroke-width="2"/>
  
  <!-- Header Text -->
  <text x="50" y="55" fill="#0f172a" font-family="sans-serif" font-size="16" font-weight="bold">EMERGENCY DEPARTMENT STAT LAB REPORT</text>
  <line x1="50" y1="65" x2="550" y2="65" stroke="#94a3b8" stroke-width="1.5"/>
  
  <!-- Table Header -->
  <text x="50" y="90" fill="#475569" font-family="monospace" font-size="12" font-weight="bold">TEST NAME</text>
  <text x="220" y="90" fill="#475569" font-family="monospace" font-size="12" font-weight="bold">RESULT</text>
  <text x="340" y="90" fill="#475569" font-family="monospace" font-size="12" font-weight="bold">UNITS</text>
  <text x="440" y="90" fill="#475569" font-family="monospace" font-size="12" font-weight="bold">REFERENCE</text>
  
  <!-- Row 1: Cardiac Troponin I (CRITICAL) -->
  <rect x="45" y="105" width="510" height="35" fill="rgba(225,29,72,0.1)" rx="4"/>
  <text x="50" y="127" fill="#be123c" font-family="monospace" font-size="13" font-weight="bold">TROPONIN I (STAT)</text>
  <text x="220" y="127" fill="#be123c" font-family="monospace" font-size="14" font-weight="bold">0.85 *CRIT*</text>
  <text x="340" y="127" fill="#0f172a" font-family="monospace" font-size="13">ng/mL</text>
  <text x="440" y="127" fill="#64748b" font-family="monospace" font-size="13">0.00 - 0.04</text>

  <!-- Row 2: Serum Potassium (CRITICAL) -->
  <rect x="45" y="150" width="510" height="35" fill="rgba(225,29,72,0.1)" rx="4"/>
  <text x="50" y="172" fill="#be123c" font-family="monospace" font-size="13" font-weight="bold">POTASSIUM (K+)</text>
  <text x="220" y="172" fill="#be123c" font-family="monospace" font-size="14" font-weight="bold">6.8 *CRIT*</text>
  <text x="340" y="172" fill="#0f172a" font-family="monospace" font-size="13">mEq/L</text>
  <text x="440" y="172" fill="#64748b" font-family="monospace" font-size="13">3.5 - 5.0</text>

  <!-- Row 3: Blood Lactate -->
  <text x="50" y="217" fill="#0f172a" font-family="monospace" font-size="13">LACTATE ARTERIAL</text>
  <text x="220" y="217" fill="#d97706" font-family="monospace" font-size="13" font-weight="bold">4.2 HIGH</text>
  <text x="340" y="217" fill="#0f172a" font-family="monospace" font-size="13">mmol/L</text>
  <text x="440" y="217" fill="#64748b" font-family="monospace" font-size="13">0.5 - 2.0</text>
</svg>
`)}`;
