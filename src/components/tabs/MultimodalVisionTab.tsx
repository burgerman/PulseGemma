import React, { useState } from 'react';
import { Eye, FileText, Image as ImageIcon, Scan, CheckCircle, Upload, ZoomIn } from 'lucide-react';
import { MedicalImagePayload } from '../../types/clinical';

interface MultimodalVisionTabProps {
  image?: MedicalImagePayload;
  visionFindings: readonly string[];
  onUploadImage: (image: MedicalImagePayload) => void;
}

export const MultimodalVisionTab: React.FC<MultimodalVisionTabProps> = ({
  image,
  visionFindings,
  onUploadImage
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onUploadImage({
          id: `UPLOAD_${Date.now()}`,
          title: file.name,
          category: file.name.toLowerCase().includes('xray') ? 'XRAY' : file.name.toLowerCase().includes('ecg') ? 'ECG_STRIP' : 'LAB_SHEET_PHOTO',
          base64Data: base64,
          timestamp: new Date().toISOString(),
          fileName: file.name,
          fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2))
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">Multimodal Vision & OCR Scanner</h2>
            <p className="text-xs text-slate-400">Gemma Vision parsing for X-Rays, ECG strips, & Lab Printouts</p>
          </div>
        </div>

        <label className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Image</span>
          <input type="file" accept="image/*" onChange={handleFileDrop} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Image Display Box (Width 6/12) */}
        <div className="md:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-bold text-purple-300 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> {image?.category || 'XRAY'}
            </span>
            <span className="truncate max-w-[140px]">{image?.title || 'Scan'}</span>
          </div>

          <div className="w-full h-48 bg-slate-950 rounded-xl border border-purple-500/30 flex flex-col items-center justify-center relative overflow-hidden group">
            {image?.base64Data ? (
              <img
                src={image.base64Data}
                alt={image.title}
                className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-3 text-center">
                <Scan className="w-10 h-10 text-purple-400/60 animate-pulse mb-1" />
                <p className="text-xs font-mono font-bold text-purple-300">{image?.title || 'Preset Emergency Case Scan'}</p>
                <p className="text-[10px] text-slate-500 font-mono">Image Tensor Loaded</p>
              </div>
            )}

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-2.5 right-2.5 p-1 rounded bg-slate-950/80 text-purple-300 hover:text-white border border-slate-700 cursor-pointer"
              title="Toggle Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Status: <strong className="text-emerald-400">Node 3 Evaluated</strong></span>
            {image?.fileSizeMb && <span>Size: {image.fileSizeMb} MB</span>}
          </div>
        </div>

        {/* Vision Extraction Findings (Width 6/12) */}
        <div className="md:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Extracted Radiologic & OCR Findings</span>
            </h3>

            {visionFindings.length > 0 ? (
              <ul className="space-y-2 mt-3 font-sans">
                {visionFindings.map((finding, idx) => (
                  <li key={idx} className="text-xs text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-purple-500/20 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic font-mono mt-3">No vision findings extracted.</p>
            )}
          </div>

          <div className="bg-slate-950 p-2 rounded-lg text-[10px] font-mono text-purple-300">
            ⚡ Image Tensor payload forwarded to Gemma Reasoner.
          </div>
        </div>

      </div>

    </div>
  );
};
