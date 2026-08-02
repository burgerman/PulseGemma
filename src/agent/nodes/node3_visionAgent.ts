import { MedicalImagePayload } from '../../types/clinical';
import { callCloudVlmApi } from '../../services/vlmApiService';

/**
 * Node 3: Cloud VLM Vision Analysis & OCR Agent.
 * Uses high-precision Vision-Language Models (e.g. Gemini 2.0 Flash / Gemini ER via API)
 * to analyze X-rays, paper lab printouts, and 12-lead ECG strips without hallucination.
 */
export async function executeNode3_VisionAgent(
  image?: MedicalImagePayload,
  vlmApiKey?: string
): Promise<{
  ocrExtractedLabs: Record<string, number>;
  visionFindings: string[];
  vlmModelUsed?: string;
}> {
  if (!image) {
    return { ocrExtractedLabs: {}, visionFindings: [] };
  }

  const result = await callCloudVlmApi(image, vlmApiKey);

  return {
    ocrExtractedLabs: result.ocrExtractedLabs,
    visionFindings: result.visionFindings,
    vlmModelUsed: result.vlmModelUsed
  };
}
