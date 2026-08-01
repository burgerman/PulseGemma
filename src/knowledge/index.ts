import { ReferenceRange } from '../types/clinical';
import { GuidelinePassage } from '../types/agent';
import { LAB_RANGES_REGISTRY } from './labRangesRegistry';
import { ESI_RULES, ESIRuleDefinition } from './decisionTreesRegistry';
import { GUIDELINES_REGISTRY } from './guidelinesRegistry';
import { MULTILINGUAL_LEXICON, LexiconTranslationEntry } from './multilingualLexicon';

/**
 * Unified Knowledge Base Data Layer (Single Source of Truth)
 * Serves deterministic reference ranges, CPG guidelines, ESI decision rules,
 * and multilingual clinical lexicons across all sub-agent nodes.
 */
export class UnifiedKnowledgeBase {
  private static instance: UnifiedKnowledgeBase;

  private constructor() {}

  public static getInstance(): UnifiedKnowledgeBase {
    if (!UnifiedKnowledgeBase.instance) {
      UnifiedKnowledgeBase.instance = new UnifiedKnowledgeBase();
    }
    return UnifiedKnowledgeBase.instance;
  }

  // 1. Reference Ranges & Panic Limits
  public getLabThresholds(testId: string): ReferenceRange | undefined {
    return LAB_RANGES_REGISTRY[testId.toUpperCase()];
  }

  public getAllLabThresholds(): Record<string, ReferenceRange> {
    return LAB_RANGES_REGISTRY;
  }

  // 2. Decision Tree Rules
  public getESIRules(): ESIRuleDefinition[] {
    return ESI_RULES;
  }

  // 3. Clinical Practice Guidelines (RAG Search)
  public searchGuidelines(queryTokens: string[]): GuidelinePassage[] {
    if (!queryTokens || queryTokens.length === 0) {
      return GUIDELINES_REGISTRY.slice(0, 3);
    }

    const searchSet = queryTokens.map(t => t.toLowerCase());

    const scored = GUIDELINES_REGISTRY.map(passage => {
      let score = 0;
      passage.keywords.forEach(kw => {
        if (searchSet.some(st => st.includes(kw.toLowerCase()) || kw.toLowerCase().includes(st))) {
          score += 2;
        }
      });
      return { passage, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.passage);
  }

  public getGuidelineById(citationId: string): GuidelinePassage | undefined {
    return GUIDELINES_REGISTRY.find(g => g.citationId === citationId);
  }

  // 4. Multilingual Lexicon Lookup
  public lookupTranslation(phrase: string): LexiconTranslationEntry | undefined {
    const cleaned = phrase.trim().toLowerCase();
    return MULTILINGUAL_LEXICON[cleaned];
  }
}

export const knowledgeBase = UnifiedKnowledgeBase.getInstance();
