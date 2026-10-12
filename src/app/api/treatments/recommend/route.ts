import { NextRequest } from 'next/server';
import { generateTreatmentPlan } from '@/lib/ai/gemini';
import { TreatmentRequestSchema, errorResponse, successResponse } from '@/lib/validation/api';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = TreatmentRequestSchema.safeParse(body);

    if (!validated.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid treatment request.', 400, validated.error.format());
    }

    const plan = await generateTreatmentPlan(validated.data);
    return successResponse(plan);
  } catch (error) {
    console.error('[API Error] /api/treatments/recommend failed:', error);
    return errorResponse('TREATMENT_ERROR', 'Failed to generate treatment recommendations.', 500);
  }
}
