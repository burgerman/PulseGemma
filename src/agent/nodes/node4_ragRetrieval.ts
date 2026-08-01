import { GuidelinePassage } from '../../types/agent';
import { toolRegistry } from '../tools';

/**
 * Node 4: Ground-Truth RAG Retrieval Agent.
 * Matches symptoms & lab alerts against emergency Clinical Practice Guidelines (CPGs).
 */
export async function executeNode4_RAGRetrieval(
  symptomKeywords: string[],
  labAlerts: string[]
): Promise<GuidelinePassage[]> {
  const queryKeywords = [...symptomKeywords, ...labAlerts];

  const passages = (await toolRegistry.executeTool('tool_query_knowledge_base', {
    queryKeywords
  })) as GuidelinePassage[];

  return passages || [];
}
