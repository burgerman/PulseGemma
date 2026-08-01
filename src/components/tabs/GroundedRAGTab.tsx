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
      
      {/* Feature Title Banner */}
      <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 border border-sky-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <span>Feature 4: Grounded CPG RAG & Evidence Engine</span>
              <span className="px-2 py-0.5 text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded font-sans">
                Verbatim Guidelines
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Retranslates clinical practice guidelines (AHA 2023 ACS, Surviving Sepsis 2021, ESI v4) into ground-truth evidence context.
            </p>
          </div>
        </div>
      </div>

      {/* Currently Retrieved Guidelines for Active Patient */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Retrieved CPG Passages for Active Patient (Node 4 RAG)</span>
          </h3>
          <span className="text-[11px] font-mono text-sky-400 font-bold">
            {retrievedGuidelines.length} Passages Matched
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {retrievedGuidelines.map((passage, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-xs border border-sky-500/30">
                    [{passage.citationId}]
                  </span>
                  <h4 className="text-xs font-bold text-white">{passage.sourceTitle}</h4>
                </div>

                <button
                  onClick={() => onOpenEvidenceModal(passage.citationId)}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-mono transition flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" /> Inspect
                </button>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                "{passage.text}"
              </p>

              <div className="flex flex-wrap gap-1 font-mono text-[10px] text-slate-500">
                <span>Keywords:</span>
                {passage.keywords.map((kw, kidx) => (
                  <span key={kidx} className="text-slate-400">#{kw}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines Knowledge Registry Browser */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Search Full Emergency Guidelines Knowledge Registry</span>
          </h3>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AHA, Sepsis, ESI guidelines..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 font-mono w-64"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredGuidelines.map((g, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400">[{g.citationId}]</span>
                <span className="text-[11px] font-mono text-slate-400">{g.section}</span>
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
