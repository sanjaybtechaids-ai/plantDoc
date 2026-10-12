import { NextRequest } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { successResponse } from '@/lib/validation/api';
import { TOMATO_MONITORING_HISTORY } from '@/data/mockData';
import { MonitoringEntry } from '@/types';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ plantId: string }> }
) {
  const { plantId } = await params;
  const authUser = await getAuthenticatedUser();
  const supabase = getAdminSupabase();

  if (supabase && authUser) {
    try {
      const { data, error } = await supabase
        .from('plant_monitoring')
        .select('*')
        .eq('plant_id', plantId)
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        const mappedEntries: MonitoringEntry[] = data.map((row, index) => ({
          id: row.id,
          plantId: row.plant_id,
          dayLabel: `Day ${index + 1}`,
          date: new Date(row.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          imageUrl: row.image_url,
          healthScore: row.health_score,
          previousScore: row.previous_health_score,
          change: row.health_score_change,
          status: row.improvement_status || 'stable',
          symptoms: row.ai_comparison?.persistentSymptoms || ['Lesions monitored'],
          treatmentUsed: row.notes || 'Routine care applied',
          aiNotes: row.ai_comparison?.summary || 'Daily foliar surveillance check completed.'
        }));
        return successResponse(mappedEntries);
      }
    } catch (err) {
      console.warn('Error querying plant monitoring history from Supabase:', err);
    }
  }

  // Fallback to initial tomato monitoring history
  return successResponse(TOMATO_MONITORING_HISTORY);
}
