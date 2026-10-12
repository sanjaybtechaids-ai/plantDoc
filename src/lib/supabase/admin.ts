import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function getAdminSupabase() {
  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    supabaseUrl.includes('your_supabase_url') ||
    serviceRoleKey.includes('your_service_role_key')
  ) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Uploads an image buffer or file into Supabase Storage under:
 * plant-images/{userId}/{plantId}/{timestamp}.jpg
 */
export async function uploadPlantImageToStorage(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  contentType: string,
  userId = 'anonymous-user',
  plantId = 'unassigned'
): Promise<{ path: string; publicUrl: string } | null> {
  const adminClient = getAdminSupabase();
  if (!adminClient) {
    console.warn('[Supabase Admin] Supabase credentials not configured. Skipping remote storage upload.');
    return null;
  }

  const timestamp = Date.now();
  const cleanExtension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const filePath = `${userId}/${plantId}/${timestamp}.${cleanExtension}`;

  try {
    const { data, error } = await adminClient.storage
      .from('plant-images')
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error('[Supabase Storage Upload Error]:', error.message);
      return null;
    }

    // Generate signed URL (expires in 1 year for persistent app viewing)
    const { data: signedData, error: signError } = await adminClient.storage
      .from('plant-images')
      .createSignedUrl(data.path, 60 * 60 * 24 * 365);

    if (signError || !signedData?.signedUrl) {
      const { data: publicUrlData } = adminClient.storage
        .from('plant-images')
        .getPublicUrl(data.path);
      return { path: data.path, publicUrl: publicUrlData.publicUrl };
    }

    return { path: data.path, publicUrl: signedData.signedUrl };
  } catch (err) {
    console.error('[Supabase Storage Exception]:', err);
    return null;
  }
}
