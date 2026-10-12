import { NextRequest } from 'next/server';
import { comparePlantImages } from '@/lib/ai/gemini';
import { errorResponse, successResponse } from '@/lib/validation/api';


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ plantId: string }> }
) {
  const { plantId } = await params;

  try {
    const body = await req.json();
    const { previousImage, currentImage, previousHealthScore, plantName } = body;

    if (!previousImage || !currentImage) {
      return errorResponse('MISSING_IMAGES', 'Both previous and current images are required for comparison.', 400);
    }

    const comparison = await comparePlantImages(
      previousImage,
      currentImage,
      {
        plantName: plantName || 'Monitored Plant',
        previousHealthScore: previousHealthScore || 68,
        previousDiagnosis: 'Active foliar recovery'
      }
    );

    return successResponse(comparison);
  } catch (error) {
    console.error('[API Error] /api/monitoring/[plantId]/compare failed:', error);
    return errorResponse('COMPARISON_FAILED', 'Failed to compare plant images.', 500);
  }
}
