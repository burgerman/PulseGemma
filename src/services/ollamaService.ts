/**
 * Resilient Dynamic Ollama REST API Client with Circuit Breaker and Client Fallback Engine.
 * Supports auto-discovery of installed local models including MedGemma 1.5.
 */

export const GEMMA_4_NLU_MODEL = '4skl/gemma4-12b-mtp:latest';
export const MEDGEMMA_VISION_MODEL = 'hf.co/unsloth/medgemma-1.5-4b-it-GGUF:Q8_0';

export const DEFAULT_LOCAL_MODELS = [
  '4skl/gemma4-12b-mtp:latest',
  '4skl/gemma4-12b-mtp',
  'hf.co/unsloth/medgemma-1.5-4b-it-GGUF:Q8_0',
  'gemma4:12b',
  'gemma4:vision',
  'medgemma',
  'gemma2:9b'
];

const OLLAMA_PROXY = '/api/ollama';
const OLLAMA_DIRECT = 'http://127.0.0.1:11434';

export async function getInstalledOllamaModels(): Promise<string[]> {
  try {
    let response = await fetch(`${OLLAMA_PROXY}/api/tags`).catch(() => fetch(`${OLLAMA_DIRECT}/api/tags`));
    if (!response.ok) return DEFAULT_LOCAL_MODELS;
    const data = await response.json();
    const installed = data.models ? data.models.map((m: any) => m.name) : [];
    
    // Combine installed models with default recommendations without duplicates
    const combined = Array.from(new Set([...installed, ...DEFAULT_LOCAL_MODELS]));
    return combined;
  } catch {
    return DEFAULT_LOCAL_MODELS.map(m => `${m} (Edge Mode)`);
  }
}

export interface OllamaOptions {
  num_ctx?: number;
  num_predict?: number;
  temperature?: number;
  top_p?: number;
  repeat_penalty?: number;
  num_thread?: number;
}

export async function callOllamaFlexible<T>(
  prompt: string,
  modelName: string = MEDGEMMA_VISION_MODEL,
  fallbackGenerator: () => T,
  base64Images?: string[],
  timeoutMs: number = 50000,
  options?: OllamaOptions
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const payload: Record<string, any> = {
      model: modelName,
      prompt,
      stream: false,
      options: {
        num_ctx: options?.num_ctx ?? 2048,
        num_predict: options?.num_predict ?? 384,
        temperature: options?.temperature ?? 0.1,
        top_p: options?.top_p ?? 0.9,
        repeat_penalty: options?.repeat_penalty ?? 1.1,
        num_thread: options?.num_thread ?? 8
      }
    };

    if (base64Images && base64Images.length > 0) {
      payload.images = base64Images.map(img => img.replace(/^data:image\/\w+;base64,/, ''));
    }

    let response = await fetch(`${OLLAMA_PROXY}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    }).catch(() => fetch(`${OLLAMA_DIRECT}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    }));

    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      
      // If 400 error and model name doesn't contain :tag, retry with :latest tag
      if (response.status === 400 && !modelName.includes(':')) {
        const fallbackModel = `${modelName}:latest`;
        payload.model = fallbackModel;
        
        const retryRes = await fetch(`${OLLAMA_PROXY}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => fetch(`${OLLAMA_DIRECT}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }));

        if (retryRes && retryRes.ok) {
          const retryData = await retryRes.json();
          const cleanJson = (retryData.response || '').replace(/```json|```/g, '').trim();
          return JSON.parse(cleanJson) as T;
        }
      }

      throw new Error(`Ollama HTTP Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const rawResponse = data.response || '';

    // Attempt robust parsing of JSON from raw model output
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : rawResponse.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson) as T;
    } catch {
      return fallbackGenerator();
    }
  } catch {
    return fallbackGenerator();
  }
}
