import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function createServerSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_url')) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      }
    }
  });
}

/**
 * Helper to safely extract authenticated user id in API routes.
 * If Supabase is unconfigured or user is not logged in, returns null or fallback guest id.
 */
export async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error('Auth verification error:', err);
    return null;
  }
}
