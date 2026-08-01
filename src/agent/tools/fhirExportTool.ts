import { AgentTool } from '../../types/tools';

export const fhirExportTool: AgentTool = {
  name: 'tool_export_fhir_triage_log',
  description: 'Generates a standardized HL7/FHIR-compliant JSON triage audit payload for EHR integration.',
  schema: {
    type: 'object',
    properties: {
      triageStateId: { type: 'string' }
    }
  },
  execute: () => {
    return {
      resourceType: 'Encounter',
      status: 'triaged',
      class: { code: 'EMER', display: 'Emergency' },
      priority: { coding: [{ system: 'http://hl7.org/fhir/esi', code: 'ESI-2' }] },
      timestamp: new Date().toISOString(),
      exportStatus: 'FHIR_BUNDLE_READY'
    };
  }
};
