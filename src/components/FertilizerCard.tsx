'use client';

import React from 'react';
import { FertilizerRecommendation, NutrientLevel } from '@/types';
import { Sprout, Sparkles, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface FertilizerCardProps {
  fertilizer: FertilizerRecommendation;
  suspectedNeeds?: string[];
}

export function FertilizerCard({ fertilizer, suspectedNeeds = [] }: FertilizerCardProps) {
  const { recommendedFertilizer, nutrientLevels } = fertilizer;

  return (
    <div className="space-y-6">
      {/* Disclaimer on photographic nutrient analysis */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-950 font-semibold">Nutrient Analysis Note:</strong> Soil or tissue testing is necessary for definitive nutrient verification. Visual foliar indicators are flagged as <span className="underline font-semibold">possible nutrient concerns</span>.
        </p>
      </div>

      {/* Suspected Needs / Nutrient Concerns */}
      {suspectedNeeds.length > 0 && (
        <div className="p-5 rounded-3xl bg-white border border-emerald-950/10 space-y-3 shadow-xs">
          <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Possible Nutrient Concerns</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {suspectedNeeds.map((need, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium"
              >
                {need}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Fertilizer Card */}
      {recommendedFertilizer && (
        <div className="p-6 rounded-3xl bg-white border border-emerald-950/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                {recommendedFertilizer.type || 'Foliar & Soil Feed'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-emerald-950 mt-1">
                {recommendedFertilizer.name}
              </h3>
            </div>
            {recommendedFertilizer.npk && (
              <div className="px-3 py-1.5 rounded-2xl bg-emerald-950 text-white font-mono font-bold text-xs tracking-wider self-start sm:self-auto">
                NPK {recommendedFertilizer.npk}
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {recommendedFertilizer.purpose}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <div>
              <strong className="text-neutral-900 block mb-0.5">Application Rate:</strong>
              <span className="text-neutral-600">{recommendedFertilizer.applicationRate}</span>
            </div>
            {recommendedFertilizer.organicAlternatives && (
              <div>
                <strong className="text-neutral-900 block mb-0.5">Organic Alternatives:</strong>
                <span className="text-neutral-600">
                  {recommendedFertilizer.organicAlternatives.join(', ')}
                </span>
              </div>
            )}
          </div>

          {recommendedFertilizer.warnings && (
            <div className="text-[11px] text-amber-800 bg-amber-50/80 p-3 rounded-2xl border border-amber-200/80 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{recommendedFertilizer.warnings}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
