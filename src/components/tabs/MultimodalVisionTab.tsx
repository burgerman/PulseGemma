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
    <div className="space-y-4 max-w-4xl mx-auto font-sans">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Medical Image Scanner</h2>
            <p className="text-xs text-slate-400">X-Rays, ECG strips, & Lab printouts</p>
          </div>
        </div>

        <label className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
          <input type="file" accept="image/*" onChange={handleFileDrop} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Image Display Box */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 border-b border-slate-100 pb-2">
            <span className="font-bold text-purple-600 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-purple-500" /> {image?.category || 'XRAY'}
            </span>
            <span className="truncate max-w-[140px] text-slate-600">{image?.title || 'Scan'}</span>
          </div>

          <div className="w-full h-48 bg-slate-50 rounded-xl border border-purple-200 flex flex-col items-center justify-center relative overflow-hidden">
            {image?.base64Data ? (
              <img
                src={image.base64Data}
                alt={image.title}
                className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-3 text-center">
                <Scan className="w-8 h-8 text-purple-300 animate-pulse mb-1" />
                <p className="text-xs font-bold text-purple-700">{image?.title || 'Emergency Case Scan'}</p>
              </div>
            )}

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-2.5 right-2.5 p-1 rounded bg-white/90 text-purple-600 hover:bg-white border border-purple-200 cursor-pointer shadow-xs transition"
              title="Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Status: Evaluated</span>
            {image?.fileSizeMb && <span>Size: {image.fileSizeMb} MB</span>}
          </div>
        </div>

        {/* Vision Findings */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Extracted Image Findings</span>
            </h3>

            {visionFindings.length > 0 ? (
              <ul className="space-y-2 mt-3 text-xs font-sans">
                {visionFindings.map((finding, idx) => (
                  <li key={idx} className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-purple-100 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic mt-3">No findings extracted.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

