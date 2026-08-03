import { TriageState, NodeTraceRecord } from '../types/agent';
import { executeNode1_Normalizer } from './nodes/node1_normalizer';
import { executeNode2_DeterministicRules } from './nodes/node2_deterministicRules';
import { executeNode3_VisionAgent } from './nodes/node3_visionAgent';
import { executeNode4_RAGRetrieval } from './nodes/node4_ragRetrieval';
import { executeNode5_GemmaReasoner } from './nodes/node5_gemmaReasoner';
import { executeNode6_SafetyValidator } from './nodes/node6_safetyValidator';
import { pipelineDebugger } from './PipelineDebugger';
import { GEMMA_4_NLU_MODEL } from '../services/ollamaService';

export type StateChangeListener = (state: TriageState) => void;

/**
 * Master Agentic Orchestrator (DAG State Machine).
 * Coordinates execution of Nodes 1 to 6 and manages state lifecycle.
 * Supports Hybrid Cloud VLM (Node 3 Vision Specialist) + Local Gemma Clinical Synthesizer (Node 5).
 */
export class AgentOrchestrator {
  private state: TriageState;
  private listeners: StateChangeListener[] = [];
  private selectedModel: string = GEMMA_4_NLU_MODEL;
  private vlmApiKey?: string;

  constructor(initialState: TriageState, modelName: string = GEMMA_4_NLU_MODEL, vlmApiKey?: string) {
    this.state = initialState;
    this.selectedModel = modelName;
    this.vlmApiKey = vlmApiKey;
  }

  public subscribe(listener: StateChangeListener): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getState(): TriageState {
    return this.state;
  }

  public setModel(modelName: string): void {
    this.selectedModel = modelName;
  }

  public setVlmApiKey(apiKey?: string): void {
    this.vlmApiKey = apiKey;
  }

  private notify(): void {
    this.listeners.forEach(l => l(this.state));
  }

  public async runPipeline(): Promise<TriageState> {
    try {
      // Execute independent Nodes 1, 2, and 3 concurrently in parallel for 50% latency reduction
      const [node1Res, node2Res, node3Res] = await Promise.all([
        this.runStep('NORMALIZING', 'node1_normalizer', 'Multilingual Normalization', () =>
          executeNode1_Normalizer(
            this.state.inputs.rawTranscript,
            this.state.inputs.inputLanguage,
            this.selectedModel
          )
        ),
        this.runStep('CHECKING_RULES', 'node2_deterministicRules', 'Deterministic Safety Engine', () =>
          executeNode2_DeterministicRules(
            this.state.inputs.vitals,
            this.state.inputs.rawLabs,
            this.state.patientProfile.activeMedications,
            this.state.patientProfile.allergies
          )
        ),
        this.runStep('VISION_PARSING', 'node3_visionAgent', 'Cloud VLM Image Analysis', () =>
          executeNode3_VisionAgent(this.state.inputs.image, this.vlmApiKey)
        )
      ]);

      this.state = {
        ...this.state,
        node1_normalizedSymptoms: node1Res,
        node2_deterministicResults: node2Res,
        node3_visionResults: node3Res
      };

      // Node 4: Ground-Truth RAG Retrieval
      await this.runStep('RETRIEVING_RAG', 'node4_ragRetrieval', 'Ground-Truth CPG Retrieval', async () => {
        const symptom = this.state.node1_normalizedSymptoms?.chiefComplaint || 'Chest Pain';
        const alerts = (this.state.node2_deterministicResults?.labAlerts || [])
          .filter(l => l.status !== 'NORMAL')
          .map(l => l.testId);

        const res = await executeNode4_RAGRetrieval([symptom], alerts);
        this.state = { ...this.state, node4_retrievedGuidelines: res };
        return res;
      });

      // Node 5: Local Gemma Multimodal Clinical Synthesizer
      // Combines VLM visual findings with patient notes, vitals, panic labs & RAG passages into comprehensive report
      await this.runStep('REASONING', 'node5_gemmaReasoner', 'Gemma Report Synthesizer', async () => {
        const res = await executeNode5_GemmaReasoner(
          this.state.patientProfile,
          this.state.node1_normalizedSymptoms?.chiefComplaint || 'Chest Pain',
          this.state.node2_deterministicResults?.labAlerts || [],
          this.state.node4_retrievedGuidelines || [],
          this.state.node3_visionResults?.visionFindings || [],
          this.selectedModel
        );
        this.state = { ...this.state, node5_gemmaSynthesis: res };
        return res;
      });

      // Node 6: Grounding Safety Validator & Guardrail
      await this.runStep('VALIDATING', 'node6_safetyValidator', 'Grounding Guardrail Audit', async () => {
        const res = await executeNode6_SafetyValidator(
          this.state.node5_gemmaSynthesis?.differentials || [],
          this.state.node4_retrievedGuidelines || []
        );
        this.state = { ...this.state, node6_validationState: res };
        return res;
      });

      // Mark Complete
      this.state = { ...this.state, currentStep: 'COMPLETE' };
      pipelineDebugger.saveFinalTrace(this.state.traceLog);
      this.notify();
      return this.state;
    } catch (err: any) {
      this.state = {
        ...this.state,
        currentStep: 'ERROR',
        error: err.message || 'Pipeline execution failed.'
      };
      this.notify();
      return this.state;
    }
  }

  private async runStep<T>(
    step: TriageState['currentStep'],
    nodeId: string,
    nodeName: string,
    executor: () => Promise<T>
  ): Promise<T> {
    this.state = { ...this.state, currentStep: step };
    this.notify();

    const startTime = Date.now();
    try {
      const result = await executor();
      const durationMs = Date.now() - startTime;

      const record: NodeTraceRecord = {
        nodeId,
        nodeName,
        status: 'SUCCESS',
        startTimeMs: startTime,
        durationMs,
        inputSnapshot: this.state.inputs,
        outputSnapshot: result
      };

      const updatedLog = pipelineDebugger.recordNodeTrace(this.state.traceLog, record);
      this.state = { ...this.state, traceLog: updatedLog };
      this.notify();
      return result;
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      const record: NodeTraceRecord = {
        nodeId,
        nodeName,
        status: 'ERROR',
        startTimeMs: startTime,
        durationMs,
        inputSnapshot: this.state.inputs,
        outputSnapshot: null,
        errorDetails: err.message
      };

      const updatedLog = pipelineDebugger.recordNodeTrace(this.state.traceLog, record);
      this.state = { ...this.state, traceLog: updatedLog };
      this.notify();
      throw err;
    }
  }
}
