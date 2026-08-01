export interface AgentTool<TParams = unknown, TResult = unknown> {
  readonly name: string;
  readonly description: string;
  readonly schema: Record<string, unknown>;
  execute(params: TParams): Promise<TResult> | TResult;
}

export interface ToolExecutionRecord {
  readonly toolName: string;
  readonly timestamp: string;
  readonly paramsSnapshot: unknown;
  readonly resultSnapshot: unknown;
  readonly durationMs: number;
}
