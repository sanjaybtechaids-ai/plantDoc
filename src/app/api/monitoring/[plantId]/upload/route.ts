import { NextRequest } from 'next/server';
import { comparePlantImages } from '@/lib/ai/gemini';
import { uploadPlantImageToStorage, getAdminSupabase } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { errorResponse, successResponse, MAX_FILE_SIZE_BYTES } from '@/lib/validation/api';
import { MonitoringEntry, ImageComparisonResult } from '@/types';
import { TOMATO_MONITORING_HISTORY } from '@/data/mockData';


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ plantId: string }> }
) {
  const { plantId } = await params;

  try {
    const contentType = req.headers.get('content-type') || '';
    let fileBuffer: Buffer | null = null;
    let mimeType = 'image/jpeg';
    let userNotes = '';
    let originalDataUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const imageEntry = formData.get('image');
      userNotes = (formData.get('notes') as string) || '';

      if (!imageEntry) {
        return errorResponse('MISSING_IMAGE', "Please upload today's plant photo for comparison.", 400);
      }

      if (imageEntry instanceof Blob) {
        if (imageEntry.size > MAX_FILE_SIZE_BYTES) {
          return errorResponse('FILE_TOO_LARGE', 'Image exceeds 10 MB limit.', 400);
        }
        mimeType = imageEntry.type || 'image/jpeg';
        fileBuffer = Buffer.from(await imageEntry.arrayBuffer());
      } else if (typeof imageEntry === 'string') {
        originalDataUrl = imageEntry;
        if (imageEntry.startsWith('data:')) {
          const match = imageEntry.match(/^data:([^;]+);base64,(.*)$/);
          if (match) {
            mimeType = match[1];
            fileBuffer = Buffer.from(match[2], 'base64');
          }
        }
      }
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      userNotes = body.notes || '';
      if (!body.image) {
        return errorResponse('MISSING_IMAGE', "Please provide today's photo.", 400);
      }
      originalDataUrl = body.image;
      if (body.image.startsWith('data:')) {
        const match = body.image.match(/^data:([^;]+);base64,(.*)$/);
        if (match) {
          mimeType = match[1];
          fileBuffer = Buffer.from(match[2], 'base64');
        }
      } else {
        fileBuffer = Buffer.from(body.image, 'base64');
      }
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return errorResponse('INVALID_IMAGE', 'Please provide a valid image buffer or data URL.', 400);
    }

    const authUser = await getAuthenticatedUser();
    const userId = authUser?.id || 'guest-grower';

    // 1. Find previous monitoring record
    let previousScore = 68;
    let previousImagePart: string = TOMATO_MONITORING_HISTORY[TOMATO_MONITORING_HISTORY.length - 1]?.imageUrl || '';
    const supabaseAdmin = getAdminSupabase();

    if (supabaseAdmin) {
      try {
        const { data: latestRecord } = await supabaseAdmin
          .from('plant_monitoring')
          .select('*')
          .eq('plant_id', plantId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (latestRecord) {
          previousScore = latestRecord.health_score;
          previousImagePart = latestRecord.image_url;
        }
      } catch (err) {
        console.warn('Could not query prior record from Supabase, using baseline:', err);
      }
    }

    // 2. Upload today's image to Supabase Storage
    let storedImageUrl = originalDataUrl || `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    const storageResult = await uploadPlantImageToStorage(
      fileBuffer,
      `monitoring-${Date.now()}`,
      mimeType,
      userId,
      plantId
    );
    if (storageResult?.publicUrl) {
      storedImageUrl = storageResult.publicUrl;
    }

    // 3. Ask Gemini Vision to compare sequential images
    const currentBase64 = fileBuffer.toString('base64');
    const comparison: ImageComparisonResult = await comparePlantImages(
      previousImagePart.startsWith('data:') || previousImagePart.length > 500
        ? previousImagePart
        : currentBase64, // If prior image was mock path, compare with current
      currentBase64,
      {
        plantName: 'Monitored Plant',
        previousHealthScore: previousScore,
        previousDiagnosis: 'Active foliar recovery'
      }
    );

    const calculatedChange = comparison.change || (comparison.currentHealthScore - previousScore);
    const newEntryId = `mon-${Date.now()}`;

    const newMonitoringEntry: MonitoringEntry = {
      id: newEntryId,
      plantId,
      dayLabel: `Day Check-in`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      imageUrl: storedImageUrl,
      healthScore: comparison.currentHealthScore,
      previousScore,
      change: calculatedChange,
      status: comparison.status,
      symptoms: comparison.persistentSymptoms.length > 0 ? comparison.persistentSymptoms : comparison.newSymptoms,
      treatmentUsed: userNotes || 'Applied daily cultural check-in and moisture management.',
      aiNotes: comparison.summary
    };

    // 4. Save monitoring record in Supabase
    if (supabaseAdmin && authUser) {
      try {
        await supabaseAdmin.from('plant_monitoring').insert({
          plant_id: plantId.startsWith('plant-') ? undefined : plantId,
          user_id: authUser.id,
          image_url: storedImageUrl,
          health_score: comparison.currentHealthScore,
          previous_health_score: previousScore,
          health_score_change: calculatedChange,
          severity: comparison.currentHealthScore >= 80 ? 'healthy' : comparison.currentHealthScore >= 60 ? 'moderate' : 'severe',
          improvement_status: comparison.status,
          diagnosis_name: 'Longitudinal Follow-up',
          notes: userNotes,
          ai_comparison: comparison
        });
      } catch (dbErr) {
        console.warn('Could not persist monitoring record to Supabase:', dbErr);
      }
    }

    return successResponse({
      entry: newMonitoringEntry,
      comparison,
      healthScore: comparison.currentHealthScore,
      previousHealthScore: previousScore,
      change: calculatedChange,
      status: comparison.status
    });
  } catch (error) {
    console.error('[API Error] /api/monitoring/[plantId]/upload failed:', error);
    return errorResponse(
      'MONITORING_UPLOAD_FAILED',
      'Failed to process daily plant health check-in.',
      500
    );
  }
}
