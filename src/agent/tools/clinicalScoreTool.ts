import { AgentTool } from '../../types/tools';
import { calculateQSOFA, calculateWellsScore } from '../../engine/riskScoreCalculator';
import { PatientVitals } from '../../types/clinical';

export const clinicalScoreTool: AgentTool = {
  name: 'tool_calculate_clinical_score',
  description: 'Delegates mathematical clinical score calculation (qSOFA for Sepsis, Wells for PE) to 100% pure TypeScript code.',
  schema: {
    type: 'object',
    properties: {
      scoreType: { type: 'string', enum: ['qSOFA', 'WELLS_PE'] },
      vitals: { type: 'object' }
    },
    required: ['scoreType', 'vitals']
  },
  execute: (params: { scoreType: string; vitals: PatientVitals; symptoms?: string[] }) => {
    if (params.scoreType === 'qSOFA') {
      const score = calculateQSOFA(params.vitals);
      return { scoreType: 'qSOFA', score, interpretation: score >= 2 ? 'HIGH RISK FOR SEPSIS' : 'LOW RISK' };
    }
    if (params.scoreType === 'WELLS_PE') {
      const score = calculateWellsScore(params.vitals, params.symptoms || []);
      return { scoreType: 'WELLS_PE', score, interpretation: score >= 3 ? 'HIGH PROBABILITY PE' : 'MODERATE/LOW' };
    }
    throw new Error(`Unsupported score type: ${params.scoreType}`);
  }
};
