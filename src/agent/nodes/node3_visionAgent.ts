import { MedicalImagePayload } from '../../types/clinical';
import { callCloudVlmApi } from '../../services/vlmApiService';
import { MEDGEMMA_VISION_MODEL } from '../../services/ollamaService';

/**
 * Node 3: MedGemma 1.5 Medical Vision & OCR Specialist Node.
 * Uses MedGemma 1.5 (or Cloud VLM API fallback) to parse X-rays, 
 * 12-lead ECG strips, and paper lab sheet photos.
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
    return { ocrExtractedLabs: {}, visionFindings: [], vlmModelUsed: MEDGEMMA_VISION_MODEL };
  }

  const result = await callCloudVlmApi(image, vlmApiKey);

  return {
    ocrExtractedLabs: result.ocrExtractedLabs,
    visionFindings: result.visionFindings,
    vlmModelUsed: result.vlmModelUsed || MEDGEMMA_VISION_MODEL
  };
}
