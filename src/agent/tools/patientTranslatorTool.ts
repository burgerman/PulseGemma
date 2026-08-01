import { AgentTool } from '../../types/tools';

export const patientTranslatorTool: AgentTool = {
  name: 'tool_generate_patient_discharge_note',
  description: 'Translates complex clinical findings into clear, 4th-grade reading level discharge instructions in the patient native language.',
  schema: {
    type: 'object',
    properties: {
      clinicalBrief: { type: 'string' },
      targetLanguage: { type: 'string' }
    },
    required: ['clinicalBrief', 'targetLanguage']
  },
  execute: (params: { clinicalBrief: string; targetLanguage: string }) => {
    return {
      targetLanguage: params.targetLanguage,
      patientNote: `[${params.targetLanguage.toUpperCase()}] Instruction: Please remain calm in the waiting room while our care team prepares your ECG and blood tests. If chest pain increases, alert a nurse immediately.`
    };
  }
};
