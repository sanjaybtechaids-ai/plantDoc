import { NextRequest } from 'next/server';
import { generateFertilizerRecommendations } from '@/lib/ai/gemini';
import { FertilizerRequestSchema, errorResponse, successResponse } from '@/lib/validation/api';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = FertilizerRequestSchema.safeParse(body);

    if (!validated.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid fertilizer parameters.', 400, validated.error.format());
    }

    const recommendations = await generateFertilizerRecommendations(validated.data);
    return successResponse(recommendations);
  } catch (error) {
    console.error('[API Error] /api/fertilizers/recommend failed:', error);
    return errorResponse('FERTILIZER_ERROR', 'Failed to generate fertilizer guidance.', 500);
  }
}
