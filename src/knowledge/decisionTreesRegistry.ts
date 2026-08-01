export interface ESIRuleDefinition {
  readonly id: string;
  readonly name: string;
  readonly level: 1 | 2 | 3 | 4 | 5;
  readonly description: string;
}

export const ESI_RULES: ESIRuleDefinition[] = [
  {
    id: 'ESI_RULE_1',
    name: 'Immediate Life-Saving Intervention Required',
    level: 1,
    description: 'Patient requires immediate airway management, defibrillation, or immediate hemodynamic resuscitation.'
  },
  {
    id: 'ESI_RULE_2',
    name: 'High Risk / Severe Pain / Altered Mental Status',
    level: 2,
    description: 'Patient is in a high-risk situation, confused/lethargic, or experiencing severe pain/distress (Pain Score >= 7 or Critical Lab Alert).'
  },
  {
    id: 'ESI_RULE_3',
    name: 'Multiple Resources Required + Stable Vitals',
    level: 3,
    description: 'Patient requires 2 or more ER resources (Labs + X-ray + IV fluids) with stable vital signs.'
  },
  {
    id: 'ESI_RULE_4',
    name: 'One Resource Required',
    level: 4,
    description: 'Patient requires 1 simple resource (e.g. single X-ray or simple wound suture).'
  },
  {
    id: 'ESI_RULE_5',
    name: 'No Resources Required',
    level: 5,
    description: 'Patient requires physical examination or prescription refill only.'
  }
];
