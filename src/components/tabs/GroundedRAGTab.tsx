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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">Grounded CPG RAG & Evidence Engine</h2>
            <p className="text-xs text-slate-400">Verbatim Clinical Practice Guidelines (AHA 2023 ACS, Sepsis, ESI v4)</p>
          </div>
        </div>

        <span className="text-xs font-mono text-sky-400 font-bold bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
          {retrievedGuidelines.length} Passages Matched
        </span>
      </div>

      {/* Matched Passages */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>Active Patient CPG Evidence Context</span>
        </h3>

        <div className="space-y-2.5">
          {retrievedGuidelines.map((passage, idx) => (
            <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-xs border border-sky-500/30">
                    [{passage.citationId}]
                  </span>
                  <h4 className="text-xs font-bold text-white">{passage.sourceTitle}</h4>
                </div>

                <button
                  onClick={() => onOpenEvidenceModal(passage.citationId)}
                  className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 text-[11px] font-mono transition flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" /> Inspect
                </button>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                "{passage.text}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines Browser */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Emergency Guidelines Registry Browser
          </h3>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guidelines..."
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 font-mono w-52"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredGuidelines.map((g, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-sky-400">[{g.citationId}]</span>
                <span className="text-[10px] text-slate-500">{g.section}</span>
              </div>
              <h4 className="text-xs font-bold text-white">{g.sourceTitle}</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{g.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
