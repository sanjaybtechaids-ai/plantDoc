'use client';

import React from 'react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Star, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isComparing?: boolean;
  onToggleCompare?: (id: string) => void;
}

export function ProductCard({
  product,
  isComparing = false,
  onToggleCompare
}: ProductCardProps) {
  const hasPurchaseUrl = Boolean(
    product.purchaseUrl || (product.demoUrl && !product.demoUrl.includes('example.com'))
  );
  const purchaseLink = product.purchaseUrl || (hasPurchaseUrl ? product.demoUrl : null);

  return (
    <div
      className={`bg-white rounded-3xl p-5 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group ${
        isComparing ? 'ring-2 ring-emerald-600 border-emerald-600' : 'border-emerald-950/10'
      }`}
    >
      <div className="space-y-3">
        {/* Product image */}
        <div className="aspect-4/3 rounded-2xl overflow-hidden bg-neutral-100 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image || product.imageUrl || '/images/products/bio-fertilizer.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
            {product.category}
          </span>
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 text-neutral-900 text-[10px] font-bold shadow-xs">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{product.rating}</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
            {product.brand || 'Verified Agricultural Supply'}
          </div>
          <h3 className="font-extrabold text-sm text-emerald-950 leading-snug mt-0.5">
            {product.name}
          </h3>
          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 mt-2 text-[11px] text-emerald-900 leading-relaxed">
            <strong className="text-emerald-950">Why recommended:</strong>{' '}
            {product.whyRecommended}
          </div>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xl font-black text-emerald-950">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          <span
            className={`text-[10px] font-semibold ml-auto flex items-center gap-1 ${
              product.inStock !== false ? 'text-emerald-700' : 'text-neutral-500'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            {product.inStock !== false ? 'Available' : 'Out of stock'}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-2 border-t border-neutral-100 grid grid-cols-2 gap-2">
        {onToggleCompare && (
          <button
            type="button"
            onClick={() => onToggleCompare(product.id)}
            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
              isComparing
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {isComparing ? 'Selected' : 'Compare'}
          </button>
        )}

        {purchaseLink ? (
          <a
            href={purchaseLink}
            target="_blank"
            rel="noreferrer"
            className={`${
              onToggleCompare ? '' : 'col-span-2'
            } py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs`}
          >
            <span>View Product</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <div
            className={`${
              onToggleCompare ? '' : 'col-span-2'
            } py-2 px-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-500 text-xs font-medium text-center flex items-center justify-center gap-1`}
          >
            <AlertCircle className="w-3 h-3 text-neutral-400" />
            <span>Product link unavailable</span>
          </div>
        )}
      </div>
    </div>
  );
}
