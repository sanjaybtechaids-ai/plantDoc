import { NextRequest } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { CreatePlantSchema } from '@/lib/validation/plant';
import { errorResponse, successResponse } from '@/lib/validation/api';
import { INITIAL_PLANTS } from '@/data/mockData';
import { Plant } from '@/types';


export async function GET() {
  const authUser = await getAuthenticatedUser();
  const supabase = getAdminSupabase();

  if (supabase && authUser) {
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mappedPlants: Plant[] = data.map((row) => ({
          id: row.id,
          userId: row.user_id,
          name: row.name,
          species: row.species || '',
          type: 'Garden Variety',
          plantingDate: row.planting_date,
          location: row.location || 'Home / Balcony',
          potSize: row.pot_size,
          sunlight: row.sunlight || 'Bright Indirect',
          wateringFrequency: row.watering_frequency || 'Every 2-3 days',
          soilType: row.soil_type || 'Potting mix',
          notes: row.notes,
          image: row.image_url || '/images/plants/tomato-blight.jpg',
          imageUrl: row.image_url,
          healthScore: 85,
          status: 'healthy',
          lastScanDate: 'Today',
          streakDays: 1,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
        return successResponse(mappedPlants);
      }
    } catch (err) {
      console.warn('Could not query plants from Supabase:', err);
    }
  }

  // Fallback to active catalog plants
  return successResponse(INITIAL_PLANTS);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreatePlantSchema.safeParse(body);

    if (!validated.success) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Invalid plant parameters provided.',
        400,
        validated.error.format()
      );
    }

    const plantData = validated.data;
    const authUser = await getAuthenticatedUser();
    const supabase = getAdminSupabase();
    const newId = `plant-${Date.now()}`;

    const newPlant: Plant = {
      id: newId,
      userId: authUser?.id,
      name: plantData.name,
      species: plantData.species || 'Unknown species',
      type: 'Botanical specimen',
      plantingDate: plantData.plantingDate || new Date().toISOString().split('T')[0],
      location: plantData.location || 'Balcony / Window',
      potSize: plantData.potSize || '10-inch Pot',
      sunlight: plantData.sunlight || 'Bright Indirect',
      wateringFrequency: plantData.wateringFrequency || 'Every 2 days',
      soilType: plantData.soilType || 'Standard potting soil',
      notes: plantData.notes || '',
      image: plantData.imageUrl || '/images/plants/tomato-blight.jpg',
      imageUrl: plantData.imageUrl,
      healthScore: 90,
      status: 'healthy',
      lastScanDate: 'Today',
      streakDays: 1,
      createdAt: new Date().toISOString()
    };

    if (supabase && authUser) {
      try {
        const { data, error } = await supabase
          .from('plants')
          .insert({
            user_id: authUser.id,
            name: plantData.name,
            species: plantData.species,
            planting_date: plantData.plantingDate,
            location: plantData.location,
            pot_size: plantData.potSize,
            sunlight: plantData.sunlight,
            watering_frequency: plantData.wateringFrequency,
            soil_type: plantData.soilType,
            notes: plantData.notes,
            image_url: plantData.imageUrl
          })
          .select()
          .single();

        if (!error && data) {
          newPlant.id = data.id;
        }
      } catch (err) {
        console.warn('Could not persist plant to Supabase:', err);
      }
    }

    return successResponse(newPlant, 201);
  } catch (error) {
    console.error('[API Error] POST /api/plants failed:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to register new plant.', 500);
  }
}
