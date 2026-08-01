import { NodeTraceRecord, PipelineTraceLog } from '../types/agent';

export class PipelineDebugger {
  private static instance: PipelineDebugger;
  private traceHistory: PipelineTraceLog[] = [];

  private constructor() {}

  public static getInstance(): PipelineDebugger {
    if (!PipelineDebugger.instance) {
      PipelineDebugger.instance = new PipelineDebugger();
    }
    return PipelineDebugger.instance;
  }

  public recordNodeTrace(currentLog: PipelineTraceLog, record: NodeTraceRecord): PipelineTraceLog {
    const updatedTraces = [...currentLog.nodeTraces, record];
    const totalMs = updatedTraces.reduce((sum, r) => sum + r.durationMs, 0);

    const updatedLog: PipelineTraceLog = {
      ...currentLog,
      totalDurationMs: totalMs,
      nodeTraces: updatedTraces
    };

    return updatedLog;
  }

  public saveFinalTrace(log: PipelineTraceLog): void {
    this.traceHistory.push(log);
  }

  public getTraceHistory(): readonly PipelineTraceLog[] {
    return this.traceHistory;
  }
}

export const pipelineDebugger = PipelineDebugger.getInstance();
