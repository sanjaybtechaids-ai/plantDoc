import { NextRequest } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { UpdatePlantSchema } from '@/lib/validation/plant';
import { errorResponse, successResponse } from '@/lib/validation/api';
import { INITIAL_PLANTS } from '@/data/mockData';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authUser = await getAuthenticatedUser();
  const supabase = getAdminSupabase();

  if (supabase && authUser) {
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('id', id)
        .eq('user_id', authUser.id)
        .single();

      if (!error && data) {
        return successResponse(data);
      }
    } catch (err) {
      console.warn('Could not fetch plant from Supabase:', err);
    }
  }

  const fallback = INITIAL_PLANTS.find((p) => p.id === id);
  if (fallback) {
    return successResponse(fallback);
  }

  return errorResponse('PLANT_NOT_FOUND', 'The requested plant does not exist.', 404);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const validated = UpdatePlantSchema.safeParse(body);

    if (!validated.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid update parameters.', 400, validated.error.format());
    }

    const updates = validated.data;
    const authUser = await getAuthenticatedUser();
    const supabase = getAdminSupabase();

    if (supabase && authUser) {
      const { data, error } = await supabase
        .from('plants')
        .update({
          name: updates.name,
          species: updates.species,
          location: updates.location,
          notes: updates.notes,
          sunlight: updates.sunlight,
          watering_frequency: updates.wateringFrequency,
          soil_type: updates.soilType,
          pot_size: updates.potSize,
          image_url: updates.imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', authUser.id)
        .select()
        .single();

      if (!error && data) {
        return successResponse(data);
      }
    }

    return successResponse({ id, ...updates });
  } catch (error) {
    console.error('[API Error] PATCH /api/plants/[id] failed:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to update plant details.', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authUser = await getAuthenticatedUser();
  const supabase = getAdminSupabase();

  if (supabase && authUser) {
    try {
      await supabase.from('plants').delete().eq('id', id).eq('user_id', authUser.id);
    } catch (err) {
      console.warn('Error deleting plant from Supabase:', err);
    }
  }

  return successResponse({ deleted: true, id });
}
