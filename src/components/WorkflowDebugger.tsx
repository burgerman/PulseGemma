import React, { useState } from 'react';
import { X, Bug, CheckCircle, Clock, AlertTriangle, ChevronRight, FileJson } from 'lucide-react';
import { PipelineTraceLog, NodeTraceRecord } from '../types/agent';

interface WorkflowDebuggerProps {
  isOpen: boolean;
  traceLog?: PipelineTraceLog;
  onClose: () => void;
}

export const WorkflowDebugger: React.FC<WorkflowDebuggerProps> = ({
  isOpen,
  traceLog,
  onClose
}) => {
  const [selectedNode, setSelectedNode] = useState<NodeTraceRecord | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-slate-900 border-l border-slate-800 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
      
      <div className="space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              6-Node Agentic Pipeline Trace Log
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trace Metadata Overview */}
        {traceLog ? (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <div>
              <span className="text-slate-500">Trace ID: </span>
              <span className="text-amber-400 font-bold">{traceLog.traceId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Total Latency: <strong>{traceLog.totalDurationMs} ms</strong></span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-mono italic">No pipeline trace recorded yet. Run a triage case to view step logs.</p>
        )}

        {/* Node Execution Trace Cards */}
        {traceLog && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
              Pipeline Execution Sequence
            </h3>

            <div className="space-y-2">
              {traceLog.nodeTraces.map((record, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedNode(record)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedNode?.nodeId === record.nodeId 
                      ? 'bg-slate-800 border-amber-500/50 shadow-md' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold flex items-center justify-center text-slate-300">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">{record.nodeName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{record.nodeId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-amber-400 font-semibold">
                      {record.durationMs} ms
                    </span>
                    {record.status === 'SUCCESS' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Node Snapshot Viewer */}
        {selectedNode && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <FileJson className="w-4 h-4" /> Node Payload Snapshot: {selectedNode.nodeName}
              </span>
              <span>{selectedNode.durationMs} ms</span>
            </div>

            <div className="max-h-48 overflow-y-auto font-mono text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800 whitespace-pre-wrap">
              {JSON.stringify(selectedNode.outputSnapshot, null, 2)}
            </div>
          </div>
        )}

      </div>

      <div className="pt-4 border-t border-slate-800 text-center">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer"
        >
          Close Trace Debugger
        </button>
      </div>

    </div>
  );
};
