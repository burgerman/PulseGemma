import { EvaluatedLabResult, LabStatus } from '../types/clinical';
import { knowledgeBase } from '../knowledge';

/**
 * Pure 100% deterministic mathematical evaluation of lab values.
 * 0ms latency, 0% model guesswork.
 */
export function evaluateLabValue(testId: string, value: number): EvaluatedLabResult {
  const range = knowledgeBase.getLabThresholds(testId);
  
  if (!range) {
    return {
      testId,
      testName: testId,
      category: 'METABOLIC',
      value,
      unit: '',
      status: 'NORMAL',
      isCritical: false,
      referenceMin: 0,
      referenceMax: 100,
      deviationPercentage: 50
    };
  }

  let status: LabStatus = 'NORMAL';
  let isCritical = false;

  // 1. Critical Panic Limits
  if (range.criticalMax !== undefined && value >= range.criticalMax) {
    status = 'CRITICAL_HIGH';
    isCritical = true;
  } else if (range.criticalMin !== undefined && value <= range.criticalMin) {
    status = 'CRITICAL_LOW';
    isCritical = true;
  } 
  // 2. Standard Abnormal Thresholds
  else if (value > range.normalMax) {
    status = 'ABNORMAL_HIGH';
  } else if (value < range.normalMin) {
    status = 'ABNORMAL_LOW';
  }

  // 3. UI Range Position Slider calculation (0 to 100%)
  const span = range.normalMax - range.normalMin || 1;
  const rawOffset = ((value - range.normalMin) / span) * 50 + 25;
  const deviationPercentage = Math.min(Math.max(Math.round(rawOffset), 5), 95);

  return {
    testId,
    testName: range.testName,
    category: range.category,
    value,
    unit: range.unit,
    status,
    isCritical,
    referenceMin: range.normalMin,
    referenceMax: range.normalMax,
    deviationPercentage
  };
}

export function evaluateLabPanel(rawLabs: Record<string, number>): EvaluatedLabResult[] {
  return Object.entries(rawLabs).map(([testId, val]) => evaluateLabValue(testId, val));
}
