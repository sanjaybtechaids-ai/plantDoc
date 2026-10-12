'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '@/data/mockData';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import {
  ShoppingBag,
  Search,
  Filter,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [comparingProducts, setComparingProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['All', 'Organic Pesticide', 'Fungicide', 'Fertilizer', 'Soil & Care', 'Equipment'];

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const catQuery = selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : '';
        const res = await fetch(`/api/products/recommendations${catQuery}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (e) {
        console.warn('Could not fetch products from backend, using catalog:', e);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.whyRecommended && product.whyRecommended.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleCompare = (id: string) => {
    setComparingProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Botanical Health Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight mt-1">
            Recommended Products
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Vetted botanical remedies, organic soil nutrients, bio-fungicides, and sanitizing pruning gear.
          </p>
        </div>

        {comparingProducts.length > 0 && (
          <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <span>Comparing ({comparingProducts.length} items)</span>
            <button
              onClick={() => setComparingProducts([])}
              className="text-neutral-500 hover:text-neutral-900 underline ml-1"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2 bg-white rounded-2xl border border-emerald-950/10 shadow-xs">
        <div className="flex flex-wrap items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-emerald-950 hover:bg-emerald-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isComparing={comparingProducts.includes(product.id)}
            onToggleCompare={toggleCompare}
          />
        ))}
      </div>

      <p className="text-xs text-neutral-400 text-center pt-2">
        *Verified products from database catalog. Real purchase URLs are supplied by vetted partners.
      </p>
    </div>
  );
}
