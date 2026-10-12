import { NextRequest } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { errorResponse, successResponse } from '@/lib/validation/api';
import { TOMATO_MONITORING_HISTORY } from '@/data/mockData';


export async function GET() {
  const authUser = await getAuthenticatedUser();
  const supabase = getAdminSupabase();

  if (supabase && authUser) {
    try {
      const { data, error } = await supabase
        .from('plant_monitoring')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return successResponse(data);
      }
    } catch (err) {
      console.warn('Error fetching monitoring records from Supabase:', err);
    }
  }

  return successResponse(TOMATO_MONITORING_HISTORY);
}
