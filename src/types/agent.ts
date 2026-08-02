import { 
  PatientVitals, 
  EvaluatedLabResult, 
  ESICalculationResult, 
  DifferentialDiagnosis, 
  RecommendedOrder, 
  MedicalImagePayload,
  PatientProfile
} from './clinical';

export type PipelineStep = 
  | 'IDLE' 
  | 'NORMALIZING' 
  | 'CHECKING_RULES' 
  | 'VISION_PARSING' 
  | 'RETRIEVING_RAG' 
  | 'REASONING' 
  | 'VALIDATING' 
  | 'COMPLETE' 
  | 'ERROR';

export interface ExtractedSymptomEntity {
  readonly chiefComplaint: string;
  readonly anatomicalLocation: string;
  readonly painQuality: string;
  readonly severityScore1To10: number;
  readonly onsetHoursAgo: number;
  readonly associatedSymptoms: readonly string[];
  readonly detectedLanguage: string;
  readonly translatedEnglishSummary: string;
  readonly doctorQuickSummary?: string;
}

export interface GuidelinePassage {
  readonly citationId: string;
  readonly sourceTitle: string;
  readonly section: string;
  readonly text: string;
  readonly keywords: readonly string[];
}

export interface NodeTraceRecord {
  readonly nodeId: string;
  readonly nodeName: string;
  readonly status: 'PENDING' | 'SUCCESS' | 'SKIPPED' | 'ERROR';
  readonly startTimeMs: number;
  readonly durationMs: number;
  readonly inputSnapshot: unknown;
  readonly outputSnapshot: unknown;
  readonly errorDetails?: string;
}

export interface PipelineTraceLog {
  readonly traceId: string;
  readonly patientId: string;
  readonly startTime: string;
  readonly totalDurationMs: number;
  readonly nodeTraces: readonly NodeTraceRecord[];
  readonly finalValidationPassed: boolean;
}

export interface TriageState {
  readonly id: string;
  readonly timestamp: string;
  readonly patientProfile: PatientProfile;
  
  // Raw Inputs
  readonly inputs: {
    readonly rawTranscript?: string;
    readonly inputLanguage: string;
    readonly vitals: PatientVitals;
    readonly rawLabs: Record<string, number>;
    readonly image?: MedicalImagePayload;
  };

  // Node Execution Outputs
  readonly node1_normalizedSymptoms?: ExtractedSymptomEntity;
  readonly node2_deterministicResults?: {
    readonly labAlerts: readonly EvaluatedLabResult[];
    readonly calculatedESI: ESICalculationResult;
    readonly qSofaScore: number;
    readonly wellsScore: number;
    readonly drugInteractionAlerts: readonly string[];
  };
  readonly node3_visionResults?: {
    readonly ocrExtractedLabs: Record<string, number>;
    readonly visionFindings: readonly string[];
  };
  readonly node4_retrievedGuidelines?: readonly GuidelinePassage[];
  readonly node5_gemmaSynthesis?: {
    readonly fiveSecondIntakeBrief: readonly string[];
    readonly keyRedFlags: readonly string[];
    readonly differentials: readonly DifferentialDiagnosis[];
    readonly recommendedOrders: readonly RecommendedOrder[];
    readonly patientDischargeNote: string;
  };
  readonly node6_validationState?: {
    readonly isGrounded: boolean;
    readonly verifiedCitationIds: readonly string[];
    readonly redactedClaims: readonly string[];
  };

  // Pipeline Status & Trace
  readonly currentStep: PipelineStep;
  readonly traceLog: PipelineTraceLog;
  readonly error?: string;
}
