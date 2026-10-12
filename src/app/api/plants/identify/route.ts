import { NextRequest } from 'next/server';
import { identifyPlant } from '@/lib/ai/gemini';
import { errorResponse, successResponse, MAX_FILE_SIZE_BYTES } from '@/lib/validation/api';


export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let base64Image = '';
    let mimeType = 'image/jpeg';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const imageEntry = formData.get('image');
      if (!imageEntry) {
        return errorResponse('MISSING_IMAGE', 'Image file is required for botanical identification.', 400);
      }
      if (imageEntry instanceof Blob) {
        if (imageEntry.size > MAX_FILE_SIZE_BYTES) {
          return errorResponse('FILE_TOO_LARGE', 'Image exceeds 10 MB limit.', 400);
        }
        mimeType = imageEntry.type || 'image/jpeg';
        const buffer = Buffer.from(await imageEntry.arrayBuffer());
        base64Image = buffer.toString('base64');
      } else if (typeof imageEntry === 'string') {
        base64Image = imageEntry;
      }
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      if (!body.image) {
        return errorResponse('MISSING_IMAGE', 'Image is required for botanical identification.', 400);
      }
      base64Image = body.image;
    } else {
      return errorResponse('INVALID_CONTENT_TYPE', 'Request must be multipart/form-data or application/json.', 400);
    }

    const identification = await identifyPlant({
      inlineData: {
        data: base64Image.includes(';base64,') ? base64Image.split(';base64,')[1] : base64Image,
        mimeType
      }
    });

    return successResponse(identification);
  } catch (error) {
    console.error('[API Error] /api/plants/identify failed:', error);
    return errorResponse('IDENTIFICATION_FAILED', 'Unable to complete botanical identification.', 500);
  }
}
