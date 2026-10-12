import { NextRequest } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { errorResponse, successResponse } from '@/lib/validation/api';
import { TOMATO_DIAGNOSIS } from '@/data/mockData';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authUser = await getAuthenticatedUser();
  const supabase = getAdminSupabase();

  if (supabase) {
    try {
      let query = supabase.from('plant_diagnoses').select('*').eq('id', id);
      if (authUser) {
        query = query.eq('user_id', authUser.id);
      }
      const { data, error } = await query.single();
      if (!error && data) {
        return successResponse(data);
      }
    } catch (err) {
      console.warn('Could not query diagnosis from Supabase:', err);
    }
  }

  if (id === TOMATO_DIAGNOSIS.id || id.includes('diag')) {
    return successResponse(TOMATO_DIAGNOSIS);
  }

  return errorResponse('DIAGNOSIS_NOT_FOUND', 'Diagnosis record not found.', 404);
}
