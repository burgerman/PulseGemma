import { AgentTool } from '../../types/tools';

export const drugInteractionTool: AgentTool = {
  name: 'tool_check_drug_interactions',
  description: 'Cross-checks active patient medications against allergy profiles and flags high-risk pharmacological contraindications.',
  schema: {
    type: 'object',
    properties: {
      medications: { type: 'array', items: { type: 'string' } },
      allergies: { type: 'array', items: { type: 'string' } }
    },
    required: ['medications', 'allergies']
  },
  execute: (params: { medications: string[]; allergies: string[] }) => {
    const alerts: string[] = [];
    const meds = (params.medications || []).map(m => m.toLowerCase());
    const allergies = (params.allergies || []).map(a => a.toLowerCase());

    // Allergy checks
    if (allergies.some(a => a.includes('penicillin')) && meds.some(m => m.includes('amoxicillin') || m.includes('penicillin'))) {
      alerts.push('CRITICAL ALLERGY CONTRAINDICATION: Active Penicillin Allergy matched with prescribed Beta-Lactam!');
    }

    // High-risk drug-drug interactions
    if (meds.some(m => m.includes('warfarin')) && meds.some(m => m.includes('aspirin') || m.includes('ibuprofen'))) {
      alerts.push('HIGH DRUG INTERACTION: Warfarin + NSAID/Aspirin increases severe bleeding risk!');
    }

    if (meds.some(m => m.includes('sildenafil')) && meds.some(m => m.includes('nitroglycerin') || m.includes('nitrate'))) {
      alerts.push('CRITICAL CONTRAINDICATION: PDE5 Inhibitor + Nitrates causes fatal hypotension!');
    }

    return { hasAlerts: alerts.length > 0, alerts };
  }
};
