import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_url')) {
    // Return lightweight fallback client for graceful degradation when keys are not configured yet
    return createSupabaseClient('https://placeholder-project.supabase.co', 'placeholder-anon-key');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
