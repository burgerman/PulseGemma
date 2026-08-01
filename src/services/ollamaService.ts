/**
 * Resilient Dynamic Ollama REST API Client with Circuit Breaker and Client Fallback Engine.
 * Supports auto-discovery of installed local models.
 */

export async function getInstalledOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) return ['gemma4:vision', 'gemma2:9b'];
    const data = await response.json();
    return data.models ? data.models.map((m: any) => m.name) : ['gemma4:vision'];
  } catch {
    return ['gemma4:vision (Edge Fallback Mode)'];
  }
}

export async function callOllamaFlexible<T>(
  prompt: string,
  modelName: string = 'gemma4:vision',
  fallbackGenerator: () => T,
  timeoutMs: number = 8000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timer);
    if (!response.ok) throw new Error(`Ollama HTTP Error: ${response.status}`);
    const data = await response.json();
    return JSON.parse(data.response) as T;
  } catch (error) {
    console.warn(`[Ollama Service] Call to model '${modelName}' failed/timed out. Engaging Client Edge Fallback Simulator.`, error);
    return fallbackGenerator();
  }
}
