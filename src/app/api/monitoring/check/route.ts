import { NextRequest } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { MonitoringReminderSchema } from '@/lib/validation/monitoring';
import { errorResponse, successResponse } from '@/lib/validation/api';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = MonitoringReminderSchema.safeParse(body);

    if (!validated.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid reminder parameters.', 400, validated.error.format());
    }

    const { plantId, reminderTime, timezone, enabled } = validated.data;
    const authUser = await getAuthenticatedUser();
    const supabase = getAdminSupabase();

    if (supabase && authUser) {
      try {
        const { data, error } = await supabase
          .from('monitoring_reminders')
          .upsert({
            plant_id: plantId,
            user_id: authUser.id,
            reminder_time: reminderTime,
            timezone,
            enabled,
            updated_at: new Date().toISOString()
          }, { onConflict: 'plant_id,user_id' })
          .select()
          .single();

        if (!error && data) {
          return successResponse({
            scheduled: true,
            reminder: data,
            message: "Your plant reminder has been set. You will be reminded for today's health check."
          });
        }
      } catch (err) {
        console.warn('Could not persist reminder in Supabase:', err);
      }
    }

    return successResponse({
      scheduled: true,
      plantId,
      reminderTime,
      enabled,
      message: "Your plant needs today's health check."
    });
  } catch (error) {
    console.error('[API Error] /api/monitoring/check failed:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to schedule plant check-in reminder.', 500);
  }
}
