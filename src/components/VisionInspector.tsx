import React, { useState } from 'react';
import { Eye, FileText, Image as ImageIcon, Scan, CheckCircle, ZoomIn } from 'lucide-react';
import { MedicalImagePayload } from '../types/clinical';

interface VisionInspectorProps {
  image?: MedicalImagePayload;
  visionFindings: readonly string[];
}

export const VisionInspector: React.FC<VisionInspectorProps> = ({
  image,
  visionFindings
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Gemma Multimodal Vision & Image OCR Inspector
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
            IMAGE TENSOR ACTIVE
          </span>
        </div>
      </div>

      {image ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Medical Image Display Panel */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 relative overflow-hidden">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1 font-bold text-purple-300">
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> {image.category}
              </span>
              <span className="truncate max-w-[160px]">{image.title}</span>
            </div>

            {/* Canvas / Base64 Preview */}
            <div className="w-full h-44 bg-slate-900 rounded-lg border border-purple-500/30 flex flex-col items-center justify-center relative overflow-hidden group">
              {image.base64Data ? (
                <img
                  src={image.base64Data}
                  alt={image.title}
                  className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-3 text-center">
                  <Scan className="w-10 h-10 text-purple-400/70 animate-pulse mb-2" />
                  <p className="text-xs font-mono font-bold text-purple-300">{image.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Simulated DICOM / Image Tensor Stream</p>
                </div>
              )}
              
              {/* ROI Bounding Box Visual Overlay */}
              <div className="absolute inset-4 border-2 border-dashed border-purple-500/60 rounded pointer-events-none flex items-start justify-between p-1.5 bg-purple-500/5">
                <span className="bg-purple-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow">
                  ROI Feature Detected
                </span>
                <span className="text-[9px] font-mono text-purple-300 bg-slate-950/80 px-1 rounded">
                  Gemma Vision Target
                </span>
              </div>

              {/* Zoom Controls Overlay */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-1.5 rounded bg-slate-950/80 text-purple-300 hover:text-white border border-slate-700 transition cursor-pointer"
                  title="Toggle Image Zoom"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Status: <strong className="text-emerald-400">Processed by Node 3</strong></span>
              {image.fileSizeMb && <span>Size: {image.fileSizeMb} MB</span>}
            </div>
          </div>

          {/* Vision Extraction Findings */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Extracted Radiologic & OCR Findings</span>
              </h3>

              {visionFindings.length > 0 ? (
                <ul className="space-y-2 font-sans">
                  {visionFindings.map((finding, idx) => (
                    <li key={idx} className="text-xs text-slate-200 bg-slate-900/90 p-2.5 rounded-lg border border-purple-500/20 flex items-start gap-2 shadow-sm">
                      <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic font-mono">
                  No vision artifacts loaded. Select an emergency case with X-Ray or Lab Sheet scans above.
                </p>
              )}
            </div>

            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-purple-300">
              ⚡ Multimodal Tensor payload forwarded directly to Node 5 Clinical Synthesizer.
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-2">
          <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs font-mono text-slate-400">No medical image loaded for this patient.</p>
        </div>
      )}

    </div>
  );
};
