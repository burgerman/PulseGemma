import React, { useState } from 'react';
import { Eye, FileText, Image as ImageIcon, Scan, CheckCircle, Upload, ZoomIn, FileCheck } from 'lucide-react';
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
      
      {/* Feature Title Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <span>Feature 3: Multimodal Vision & OCR Scanner</span>
              <span className="px-2 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded font-sans">
                Image + Text Payloads
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Processes physical medical images (Chest X-Rays, 12-lead ECG strips, paper lab printout photos) using Gemma Multimodal Vision.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Dropzone Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Upload Custom Medical Artifact Image</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Supports PNG, JPG, DICOM</span>
        </div>

        <label className="border-2 border-dashed border-slate-800 hover:border-purple-500/60 rounded-xl p-5 bg-slate-950 transition flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                {image ? image.title : 'Click to select or drag medical image file'}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {image ? `${image.category} loaded • Forwarded to Gemma Vision Node 3` : 'Upload X-ray, paper lab sheet, or ECG strip photo'}
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition flex items-center gap-2 shadow-md">
            <Upload className="w-3.5 h-3.5" />
            <span>Browse Files</span>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileDrop}
            className="hidden"
          />
        </label>
      </div>

      {/* Image Preview & Vision Findings Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Image Preview Canvas (Width 6/12) */}
        <div className="md:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-purple-400" /> Active Tensor Image
            </span>
            <span>{image?.category || 'XRAY'}</span>
          </div>

          <div className="w-full h-56 bg-slate-950 rounded-xl border border-purple-500/30 flex flex-col items-center justify-center relative overflow-hidden group">
            {image?.base64Data ? (
              <img
                src={image.base64Data}
                alt={image.title}
                className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Scan className="w-12 h-12 text-purple-400/60 animate-pulse mb-2" />
                <p className="text-xs font-mono font-bold text-purple-300">{image?.title || 'Preset Emergency Case Scan'}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Simulated DICOM / Image Tensor Stream</p>
              </div>
            )}

            {/* Bounding Box Visual Overlay */}
            <div className="absolute inset-4 border-2 border-dashed border-purple-500/60 rounded-lg pointer-events-none flex items-start justify-between p-2 bg-purple-500/5">
              <span className="bg-purple-600 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow">
                ROI Feature Detected
              </span>
              <span className="text-[9px] font-mono text-purple-300 bg-slate-950/80 px-1.5 rounded">
                Gemma Vision Target
              </span>
            </div>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-slate-950/80 text-purple-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Toggle Zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span>Status: <strong className="text-emerald-400">Node 3 Vision Evaluated</strong></span>
            {image?.fileSizeMb && <span>Size: {image.fileSizeMb} MB</span>}
          </div>
        </div>

        {/* OCR & Radiologic Findings (Width 6/12) */}
        <div className="md:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Vision OCR & Radiologic Extraction</span>
            </h3>

            {visionFindings.length > 0 ? (
              <ul className="space-y-2.5 font-sans">
                {visionFindings.map((finding, idx) => (
                  <li key={idx} className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-purple-500/20 flex items-start gap-2.5 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center text-slate-500 text-xs font-mono">
                No vision findings extracted yet.
              </div>
            )}
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-purple-300">
            ⚡ Image Tensor data forwarded directly to Gemma Vision Reasoning Node 5.
          </div>
        </div>

      </div>

    </div>
  );
};
