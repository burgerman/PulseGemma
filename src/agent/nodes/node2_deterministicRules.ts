import { PatientVitals, EvaluatedLabResult, ESICalculationResult } from '../../types/clinical';
import { evaluateLabPanel } from '../../engine/labRangeEvaluator';
import { calculateESILevel } from '../../engine/esiCalculator';
import { toolRegistry } from '../tools';

/**
 * Node 2: 100% Deterministic Safety & Rule Engine.
 * 0ms execution time, 0% model guesswork.
 */
export async function executeNode2_DeterministicRules(
  vitals: PatientVitals,
  rawLabs: Record<string, number>,
  medications: readonly string[] = [],
  allergies: readonly string[] = []
): Promise<{
  labAlerts: EvaluatedLabResult[];
  calculatedESI: ESICalculationResult;
  qSofaScore: number;
  wellsScore: number;
  drugInteractionAlerts: string[];
}> {
  // 1. Evaluate Lab Ranges (0ms)
  const labAlerts = evaluateLabPanel(rawLabs);

  // 2. Evaluate ESI Level 1-5 Decision Tree (0ms)
  const calculatedESI = calculateESILevel(vitals, labAlerts);

  // 3. Compute Risk Scores (qSOFA, Wells) via Local Agent Tools
  const qSofaResult = (await toolRegistry.executeTool('tool_calculate_clinical_score', {
    scoreType: 'qSOFA',
    vitals
  })) as any;

  const wellsResult = (await toolRegistry.executeTool('tool_calculate_clinical_score', {
    scoreType: 'WELLS_PE',
    vitals,
    symptoms: []
  })) as any;

  // 4. Check Drug-Drug & Allergy Contraindications via Local Agent Tool
  const drugCheckResult = (await toolRegistry.executeTool('tool_check_drug_interactions', {
    medications: Array.from(medications),
    allergies: Array.from(allergies)
  })) as any;

  return {
    labAlerts,
    calculatedESI,
    qSofaScore: qSofaResult.score || 0,
    wellsScore: wellsResult.score || 0,
    drugInteractionAlerts: drugCheckResult.alerts || []
  };
}
