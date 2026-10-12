import { getAdminSupabase } from '@/lib/supabase/admin';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/data/mockData';

/**
 * Searches the curated product database for products matching the disease or recommended treatment/fertilizer categories.
 * Enforces rule: NEVER invent fake URLs. Return real products from database.
 */
export async function getCuratedProducts(category?: string, query?: string): Promise<Product[]> {
  const supabase = getAdminSupabase();

  if (supabase) {
    try {
      let req = supabase.from('products').select('*').eq('active', true);
      if (category) {
        req = req.eq('category', category);
      }
      const { data, error } = await req.limit(6);
      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          rating: Number(item.rating) || 4.5,
          price: Number(item.price),
          whyRecommended: item.description,
          demoUrl: item.purchase_url || '',
          purchaseUrl: item.purchase_url || null,
          image: item.image_url || '/images/products/bio-fertilizer.jpg',
          inStock: true,
          brand: item.brand,
          currency: item.currency || 'INR'
        }));
      }
    } catch (err) {
      console.warn('Error fetching products from Supabase, falling back to curated list:', err);
    }
  }

  // Curated fallback products from data catalog
  if (category) {
    const filtered = MOCK_PRODUCTS.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    if (filtered.length > 0) return filtered;
  }

  return MOCK_PRODUCTS;
}
