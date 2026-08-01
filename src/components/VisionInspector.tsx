import React from 'react';
import { Eye, FileText, Image as ImageIcon, Scan, CheckCircle } from 'lucide-react';
import { MedicalImagePayload } from '../types/clinical';

interface VisionInspectorProps {
  image?: MedicalImagePayload;
  visionFindings: readonly string[];
}

export const VisionInspector: React.FC<VisionInspectorProps> = ({
  image,
  visionFindings
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Gemma Multimodal Vision Inspector
          </h2>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
          IMAGE + TEXT TENSOR
        </span>
      </div>

      {image ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Medical Image Display Panel */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> {image.category}
              </span>
              <span>{image.title}</span>
            </div>

            {/* Canvas / Image Simulation Card */}
            <div className="w-full h-32 bg-slate-900 rounded-md border border-purple-500/20 flex flex-col items-center justify-center p-3 text-center relative group">
              <Scan className="w-8 h-8 text-purple-400/60 animate-pulse mb-1" />
              <p className="text-xs font-mono font-bold text-purple-300">{image.title}</p>
              <p className="text-[10px] text-slate-500 font-mono">Simulated DICOM / Image Tensor Stream</p>
              
              {/* Bounding Box Visual Overlay */}
              <div className="absolute inset-4 border border-dashed border-purple-500/40 rounded pointer-events-none flex items-start justify-end p-1">
                <span className="bg-purple-600 text-white text-[9px] font-mono px-1 rounded">ROI Detected</span>
              </div>
            </div>
          </div>

          {/* Vision Extraction Findings */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Vision Findings & OCR Extraction</span>
            </h3>

            {visionFindings.length > 0 ? (
              <ul className="space-y-1.5 font-sans">
                {visionFindings.map((finding, idx) => (
                  <li key={idx} className="text-xs text-slate-200 bg-slate-900/80 p-2 rounded border border-slate-800 flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
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

        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 text-center space-y-2">
          <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs font-mono text-slate-400">No medical image loaded for this patient.</p>
        </div>
      )}

    </div>
  );
};
