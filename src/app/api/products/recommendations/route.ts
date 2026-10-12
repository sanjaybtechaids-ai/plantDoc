import { NextRequest } from 'next/server';
import { getCuratedProducts } from '@/lib/services/productService';
import { successResponse } from '@/lib/validation/api';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const diagnosis = searchParams.get('diagnosis') || undefined;
  const query = searchParams.get('q') || diagnosis || undefined;

  const products = await getCuratedProducts(category, query);

  return successResponse(products);
}
