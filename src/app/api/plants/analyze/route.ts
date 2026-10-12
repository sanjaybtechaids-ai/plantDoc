import { NextRequest } from 'next/server';
import { analyzePlantImage } from '@/lib/ai/gemini';
import { uploadPlantImageToStorage, getAdminSupabase } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { getCuratedProducts } from '@/lib/services/productService';
import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE_BYTES,
  errorResponse,
  successResponse
} from '@/lib/validation/api';
import { Diagnosis, AffectedArea, Product } from '@/types';


export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let fileBuffer: Buffer | null = null;
    let mimeType = 'image/jpeg';
    let plantId: string | undefined;
    let plantName: string | undefined;
    let species: string | undefined;
    let symptoms: string | undefined;
    let originalDataUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const imageEntry = formData.get('image');
      plantId = (formData.get('plantId') as string) || undefined;
      plantName = (formData.get('plantName') as string) || undefined;
      species = (formData.get('species') as string) || undefined;
      symptoms = (formData.get('symptoms') as string) || undefined;

      if (!imageEntry) {
        return errorResponse('MISSING_IMAGE', 'An image is required for plant analysis.', 400);
      }

      if (typeof imageEntry === 'string') {
        // Base64 or URL passed as form data string
        if (imageEntry.startsWith('data:')) {
          originalDataUrl = imageEntry;
          const match = imageEntry.match(/^data:([^;]+);base64,(.*)$/);
          if (match) {
            mimeType = match[1];
            fileBuffer = Buffer.from(match[2], 'base64');
          }
        }
      } else if (imageEntry instanceof Blob) {
        mimeType = imageEntry.type || 'image/jpeg';
        if (imageEntry.size > MAX_FILE_SIZE_BYTES) {
          return errorResponse(
            'FILE_TOO_LARGE',
            'Image exceeds the maximum allowed size of 10 MB.',
            400
          );
        }
        if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
          return errorResponse(
            'INVALID_IMAGE',
            `Unsupported format (${mimeType}). Please upload a JPEG, PNG, or WebP image.`,
            400
          );
        }
        const arrayBuffer = await imageEntry.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
      }
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      plantId = body.plantId;
      plantName = body.plantName;
      species = body.species;
      symptoms = body.symptoms;

      if (!body.image) {
        return errorResponse('MISSING_IMAGE', 'An image is required for plant analysis.', 400);
      }

      originalDataUrl = body.image;
      if (body.image.startsWith('data:')) {
        const match = body.image.match(/^data:([^;]+);base64,(.*)$/);
        if (match) {
          mimeType = match[1];
          fileBuffer = Buffer.from(match[2], 'base64');
        }
      } else {
        // Raw base64 string
        fileBuffer = Buffer.from(body.image, 'base64');
      }
    } else {
      return errorResponse('INVALID_CONTENT_TYPE', 'Request must be multipart/form-data or application/json.', 400);
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return errorResponse('INVALID_IMAGE', 'Please upload a valid, non-empty plant image.', 400);
    }

    if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
      return errorResponse('FILE_TOO_LARGE', 'Image exceeds the maximum allowed size of 10 MB.', 400);
    }

    // Authenticated user if available
    const authUser = await getAuthenticatedUser();
    const userId = authUser?.id || 'guest-grower';

    // 1. Upload to Supabase Storage if configured
    let storedImageUrl = originalDataUrl || `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    const storageResult = await uploadPlantImageToStorage(
      fileBuffer,
      `scan-${Date.now()}`,
      mimeType,
      userId,
      plantId || 'unassigned'
    );
    if (storageResult?.publicUrl) {
      storedImageUrl = storageResult.publicUrl;
      console.log('[Storage Success] Image stored at:', storageResult.path);
    }

    // 2. Perform Gemini AI Optical Plant Analysis
    const base64Data = fileBuffer.toString('base64');
    const aiResult = await analyzePlantImage(
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      },
      {
        plantName,
        species,
        symptoms
      }
    );

    // 3. Look up real, curated products matching the diagnosis and treatment category
    const recommendedCategory =
      aiResult.analysis.severity === 'healthy'
        ? 'Fertilizer'
        : aiResult.diagnosis.name.toLowerCase().includes('mildew') || aiResult.diagnosis.name.toLowerCase().includes('blight')
        ? 'Fungicide'
        : 'Organic Pesticide';
    const curatedProducts: Product[] = await getCuratedProducts(recommendedCategory);

    // 4. Map affected areas to coordinates for visual overlay
    const affectedAreas: AffectedArea[] = (aiResult.visualAnalysis?.affectedAreas || []).map(
      (area, idx) => {
        const positions: Record<string, { x: number; y: number }> = {
          'upper-left': { x: 30, y: 25 },
          'upper-right': { x: 70, y: 25 },
          'center': { x: 50, y: 50 },
          'lower-left': { x: 32, y: 68 },
          'lower-right': { x: 68, y: 68 },
          'margin': { x: 52, y: 38 }
        };
        const posKey = Object.keys(positions).find((k) =>
          area.relativePosition?.toLowerCase().includes(k)
        );
        const coords = posKey ? positions[posKey] : { x: 45 + (idx % 3) * 10, y: 35 + (idx % 3) * 12 };

        return {
          id: `area-${idx + 1}`,
          x: coords.x,
          y: coords.y,
          radius: area.severity === 'severe' ? 9 : area.severity === 'moderate' ? 8 : 7,
          severity: (area.severity as 'mild' | 'moderate' | 'severe') || 'moderate',
          label: area.description || 'Observed foliar symptom',
          description: area.description,
          relativePosition: area.relativePosition
        };
      }
    );

    const diagnosisId = `diag-${Date.now()}`;
    const finalDiagnosis: Diagnosis = {
      id: diagnosisId,
      plantId,
      plantName: aiResult.plant.name || plantName || 'Identified Specimen',
      species: aiResult.plant.species || species || 'Botanical Specimen',
      date: 'Just now',
      imageUrl: storedImageUrl,
      plantIdentified: `${aiResult.plant.name} (${aiResult.plant.species})`,
      identificationConfidence: aiResult.plant.confidence || 90,
      healthScore: aiResult.analysis.healthScore,
      disease: {
        id: `disease-${Date.now()}`,
        name: aiResult.diagnosis.name,
        scientificName: aiResult.diagnosis.name,
        severity: (aiResult.analysis.severity === 'critical' ? 'severe' : aiResult.analysis.severity) as 'mild' | 'moderate' | 'severe',
        confidence: aiResult.diagnosis.confidence,
        description: aiResult.diagnosis.description,
        symptoms: aiResult.analysis.symptoms,
        causes: aiResult.analysis.possibleCauses,
        prevention: aiResult.prevention,
        affectedPlantTypes: aiResult.analysis.affectedParts
      },
      treatment: {
        immediateActions: aiResult.treatment.immediateActions,
        naturalTreatments: aiResult.treatment.naturalOptions.map((opt, i) => {
          if (typeof opt === 'string') {
            return {
              id: `nat-${i}`,
              name: opt,
              purpose: 'Botanical remediation',
              howToUse: 'Apply as foliar spray in morning/dusk.',
              frequency: 'Every 5 to 7 days',
              safetyNote: 'Do not spray in direct midday sun.',
              price: 349
            };
          }
          return {
            id: `nat-${i}`,
            name: opt.name,
            purpose: opt.purpose || 'Botanical remediation',
            howToUse: opt.howToUse || 'Apply as foliar spray in morning/dusk.',
            frequency: opt.frequency || 'Every 5 to 7 days',
            safetyNote: opt.safetyNote || 'Do not spray in direct midday sun.',
            price: 349
          };
        }),
        chemicalTreatments: aiResult.treatment.chemicalOptions.map((opt, i) => {
          if (typeof opt === 'string') {
            return {
              id: `chem-${i}`,
              name: opt,
              activeIngredient: opt,
              purpose: 'Foliar disease suppression',
              application: 'Follow exact label instructions.',
              precautions: 'Wear gloves and eye protection.',
              price: 599
            };
          }
          return {
            id: `chem-${i}`,
            name: opt.name,
            activeIngredient: opt.activeIngredient || opt.name,
            purpose: opt.purpose || 'Foliar disease suppression',
            application: opt.application || 'Follow exact label instructions.',
            precautions: opt.precautions || 'Wear gloves and eye protection.',
            price: 599
          };
        })
      },
      fertilizer: {
        nutrientLevels: {
          nitrogen: 'adequate',
          phosphorus: 'adequate',
          potassium: aiResult.fertilizer.suspectedNeeds.some((n) => n.toLowerCase().includes('potassium')) ? 'deficient' : 'adequate',
          micronutrients: 'balanced'
        },
        recommendedFertilizer: {
          name: typeof aiResult.fertilizer.recommendations[0] === 'object'
            ? aiResult.fertilizer.recommendations[0].name
            : 'Balanced Organic Bio-Fertilizer 4-3-3',
          type: 'Organic nutrition',
          npk: typeof aiResult.fertilizer.recommendations[0] === 'object'
            ? aiResult.fertilizer.recommendations[0].npk || '4-3-3'
            : '4-3-3',
          purpose: 'Reinforces foliar cell walls and sustained immune vigor.',
          applicationRate: 'Apply monthly during active growth.',
          productLink: '/products',
          price: 449,
          image: '/images/products/organic-fertilizer.jpg'
        }
      },
      products: curatedProducts,
      affectedAreas,
      userNotes: symptoms || 'Optical diagnostic scan',
      symptomsObserved: aiResult.analysis.summary,
      summary: aiResult.analysis.summary,
      warnings: aiResult.warnings,
      professionalAdvice: aiResult.professionalAdvice
    };

    // 5. Persist Diagnosis to Supabase if database is available
    const supabaseAdmin = getAdminSupabase();
    if (supabaseAdmin && authUser) {
      try {
        await supabaseAdmin.from('plant_diagnoses').insert({
          id: diagnosisId.startsWith('diag-') ? undefined : diagnosisId,
          plant_id: plantId || null,
          user_id: authUser.id,
          image_url: storedImageUrl,
          plant_name: finalDiagnosis.plantName,
          species: finalDiagnosis.species,
          health_score: finalDiagnosis.healthScore,
          severity: aiResult.analysis.severity,
          diagnosis_name: finalDiagnosis.disease.name,
          diagnosis_confidence: finalDiagnosis.disease.confidence,
          certainty: aiResult.diagnosis.certainty,
          summary: aiResult.analysis.summary,
          symptoms: aiResult.analysis.symptoms,
          affected_parts: aiResult.analysis.affectedParts,
          possible_causes: aiResult.analysis.possibleCauses,
          visual_analysis: aiResult.visualAnalysis,
          immediate_actions: aiResult.treatment.immediateActions,
          natural_treatments: aiResult.treatment.naturalOptions,
          chemical_treatments: aiResult.treatment.chemicalOptions,
          fertilizer_recommendations: aiResult.fertilizer,
          prevention: aiResult.prevention,
          warnings: aiResult.warnings,
          professional_advice: aiResult.professionalAdvice,
          ai_model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
        });
        console.log('[Supabase Success] Diagnosis saved to PostgreSQL database.');
      } catch (dbErr) {
        console.warn('Could not save diagnosis to Supabase table:', dbErr);
      }
    }

    return successResponse(finalDiagnosis);
  } catch (error) {
    console.error('[API Error] /api/plants/analyze failed:', error);
    return errorResponse(
      'ANALYSIS_FAILED',
      'Plant Doctor AI encountered an error analyzing this plant image. Please try again with a clear photo.',
      500
    );
  }
}
