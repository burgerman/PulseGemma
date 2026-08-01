import { AgentTool } from '../../types/tools';
import { knowledgeBase } from '../../knowledge';

export const kbQueryTool: AgentTool = {
  name: 'tool_query_knowledge_base',
  description: 'Queries verified emergency clinical practice guidelines (AHA, Sepsis, ESI v4) for ground-truth evidence passages.',
  schema: {
    type: 'object',
    properties: {
      queryKeywords: { type: 'array', items: { type: 'string' } }
    },
    required: ['queryKeywords']
  },
  execute: (params: any) => {
    const keywords = params.queryKeywords || [];
    return knowledgeBase.searchGuidelines(keywords);
  }
};
