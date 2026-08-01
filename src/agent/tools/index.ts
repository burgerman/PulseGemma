import { AgentTool } from '../../types/tools';
import { kbQueryTool } from './kbQueryTool';
import { clinicalScoreTool } from './clinicalScoreTool';
import { drugInteractionTool } from './drugInteractionTool';
import { ageVitalsTool } from './ageVitalsTool';
import { patientTranslatorTool } from './patientTranslatorTool';
import { fhirExportTool } from './fhirExportTool';

export class LocalToolRegistry {
  private static instance: LocalToolRegistry;
  private tools: Map<string, AgentTool> = new Map();

  private constructor() {
    this.registerTool(kbQueryTool);
    this.registerTool(clinicalScoreTool);
    this.registerTool(drugInteractionTool);
    this.registerTool(ageVitalsTool);
    this.registerTool(patientTranslatorTool);
    this.registerTool(fhirExportTool);
  }

  public static getInstance(): LocalToolRegistry {
    if (!LocalToolRegistry.instance) {
      LocalToolRegistry.instance = new LocalToolRegistry();
    }
    return LocalToolRegistry.instance;
  }

  public registerTool(tool: AgentTool): void {
    this.tools.set(tool.name, tool);
  }

  public getTool(name: string): AgentTool | undefined {
    return this.tools.get(name);
  }

  public getAllTools(): AgentTool[] {
    return Array.from(this.tools.values());
  }

  public async executeTool(name: string, params: unknown): Promise<unknown> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Local Tool '${name}' not found in registry.`);
    }
    return await tool.execute(params);
  }
}

export const toolRegistry = LocalToolRegistry.getInstance();
