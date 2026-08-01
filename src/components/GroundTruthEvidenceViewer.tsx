import React from 'react';
import { X, BookOpen, ShieldCheck } from 'lucide-react';
import { GuidelinePassage } from '../types/agent';
import { knowledgeBase } from '../knowledge';

interface GroundTruthEvidenceViewerProps {
  citationId: string | null;
  onClose: () => void;
}

export const GroundTruthEvidenceViewer: React.FC<GroundTruthEvidenceViewerProps> = ({
  citationId,
  onClose
}) => {
  if (!citationId) return null;

  const passage: GuidelinePassage | undefined = knowledgeBase.getGuidelineById(citationId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono">Ground-Truth Evidence Verification</h2>
              <p className="text-xs text-sky-400 font-mono">[{citationId}]</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {passage ? (
          <div className="space-y-4">
            
            {/* Source Title & Section */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{passage.sourceTitle}</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verbatim Guideline
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{passage.section}</p>
            </div>

            {/* Verbatim CPG Text Passage */}
            <div className="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-2">
              <span className="text-[10px] font-mono uppercase text-sky-400 font-bold tracking-wider block">
                Verbatim Clinical Practice Guideline Excerpt
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                "{passage.text}"
              </p>
            </div>

            {/* Keyword Match Tags */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Clinical Keywords:</span>
              <div className="flex flex-wrap gap-1">
                {passage.keywords.map((kw, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-2">
            <p className="text-xs text-rose-400 font-mono">Citation ID '{citationId}' not found in registry.</p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition cursor-pointer"
          >
            Close Evidence Window
          </button>
        </div>

      </div>
    </div>
  );
};
