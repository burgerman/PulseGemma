import React, { useState } from 'react';
import { BookOpen, Search, ShieldCheck, ExternalLink } from 'lucide-react';
import { GuidelinePassage } from '../../types/agent';
import { GUIDELINES_REGISTRY } from '../../knowledge/guidelinesRegistry';

interface GroundedRAGTabProps {
  retrievedGuidelines: readonly GuidelinePassage[];
  onOpenEvidenceModal: (citationId: string) => void;
}

export const GroundedRAGTab: React.FC<GroundedRAGTabProps> = ({
  retrievedGuidelines,
  onOpenEvidenceModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuidelines = GUIDELINES_REGISTRY.filter(g => 
    g.sourceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 font-sans">Guidelines RAG</h2>
            <p className="text-xs text-slate-400">Verbatim CPG evidence passages</p>
          </div>
        </div>

        <span className="text-xs font-sans text-sky-700 font-bold bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 shadow-sm">
          {retrievedGuidelines.length} Passages Matched
        </span>
      </div>

      {/* Matched Passages */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <ShieldCheck className="w-4 h-4 text-sky-500" />
          <span>Active Patient CPG Evidence Context</span>
        </h3>

        <div className="space-y-2.5">
          {retrievedGuidelines.map((passage, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-sky-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-sans font-bold text-xs border border-sky-200">
                    [{passage.citationId}]
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 font-sans">{passage.sourceTitle}</h4>
                </div>

                <button
                  onClick={() => onOpenEvidenceModal(passage.citationId)}
                  className="px-2 py-0.5 rounded bg-white text-sky-600 text-[11px] font-sans border border-slate-200 shadow-sm transition hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" /> Inspect
                </button>
              </div>

              <p className="text-xs text-slate-700 font-sans leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                "{passage.text}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines Browser */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
            Emergency Guidelines Registry Browser
          </h3>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guidelines..."
              className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 font-sans w-52"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredGuidelines.map((g, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-bold text-sky-600">[{g.citationId}]</span>
                <span className="text-[10px] text-slate-500">{g.section}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">{g.sourceTitle}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">{g.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
