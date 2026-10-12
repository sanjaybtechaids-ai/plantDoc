import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';


export async function GET() {
  const geminiConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    !process.env.GEMINI_API_KEY.includes('your_gemini_api_key')
  );

  let databaseStatus = 'disconnected';
  const supabase = getAdminSupabase();

  if (supabase) {
    try {
      const { error } = await supabase.from('products').select('id').limit(1);
      databaseStatus = error ? 'unreachable' : 'connected';
    } catch {
      databaseStatus = 'error';
    }
  } else {
    databaseStatus = 'local_mode';
  }

  return NextResponse.json({
    status: 'ok',
    service: 'Plant Doctor API',
    ai: geminiConfigured ? 'configured' : 'pending_configuration',
    database: databaseStatus
  });
}
