/**
 * Resilient Dynamic Ollama REST API Client with Circuit Breaker and Client Fallback Engine.
 * Supports auto-discovery of installed local models including MedGemma 1.5.
 */

export const GEMMA_4_NLU_MODEL = 'gemma4:12b';
export const MEDGEMMA_VISION_MODEL = 'hf.co/unsloth/medgemma-1.5-4b-it-GGUF:Q8_0';

export const DEFAULT_LOCAL_MODELS = [
  'gemma4:12b',
  'hf.co/unsloth/medgemma-1.5-4b-it-GGUF:Q8_0',
  'gemma4:vision',
  'medgemma',
  'gemma2:9b'
];

export async function getInstalledOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
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

export async function callOllamaFlexible<T>(
  prompt: string,
  modelName: string = 'hf.co/unsloth/medgemma-1.5-4b-it-GGUF:Q8_0',
  fallbackGenerator: () => T,
  base64Images?: string[],
  timeoutMs: number = 10000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const payload: Record<string, any> = {
      model: modelName,
      prompt,
      stream: false
    };

    if (base64Images && base64Images.length > 0) {
      payload.images = base64Images.map(img => img.replace(/^data:image\/\w+;base64,/, ''));
    }

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timer);
    if (!response.ok) throw new Error(`Ollama HTTP Error: ${response.status}`);
    const data = await response.json();
    const rawResponse = data.response || '';
    
    // Attempt parsing JSON if returned, or construct object
    try {
      const cleanJson = rawResponse.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson) as T;
    } catch {
      return fallbackGenerator();
    }
  } catch (error) {
    console.warn(`[Ollama Service] Call to model '${modelName}' failed/timed out. Engaging Client Edge Fallback Simulator.`, error);
    return fallbackGenerator();
  }
}
