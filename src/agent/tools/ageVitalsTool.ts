import { AgentTool } from '../../types/tools';
import { PatientVitals } from '../../types/clinical';

export const ageVitalsTool: AgentTool = {
  name: 'tool_validate_age_adjusted_vitals',
  description: 'Adjusts vital sign normal/abnormal status boundaries based on patient age (pediatric vs adult).',
  schema: {
    type: 'object',
    properties: {
      age: { type: 'number' },
      vitals: { type: 'object' }
    },
    required: ['age', 'vitals']
  },
  execute: (params: { age: number; vitals: PatientVitals }) => {
    const isPediatric = params.age < 12;
    const hr = params.vitals.heartRate;
    const isTachycardic = isPediatric ? hr > 140 : hr > 100;

    return {
      ageCategory: isPediatric ? 'PEDIATRIC' : 'ADULT',
      heartRateStatus: isTachycardic ? 'TACHYCARDA' : 'NORMAL',
      oxygenStatus: params.vitals.oxygenSaturation < 94 ? 'HYPOXIC' : 'NORMAL'
    };
  }
};
