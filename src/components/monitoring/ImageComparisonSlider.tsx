'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, TrendingUp } from 'lucide-react';

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeScore: number;
  afterScore: number;
  beforeLabel?: string;
  afterLabel?: string;
}

export function ImageComparisonSlider({
  beforeImage,
  afterImage,
  beforeScore,
  afterScore,
  beforeLabel = 'Day 1 (Initial Infection)',
  afterLabel = 'Day 5 (Today - Recovering)'
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'sideBySide'>('slider');

  const delta = afterScore - beforeScore;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
            Continuous Visual Comparison
          </h3>
          <p className="text-xs text-neutral-500">
            Compare past lesion density against today’s leaf specimen.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-neutral-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'slider'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Interactive Slider
          </button>
          <button
            onClick={() => setViewMode('sideBySide')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'sideBySide'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Side by Side
          </button>
        </div>
      </div>

      {/* Delta Metric Bar */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-medium text-emerald-950">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Health Score Progress:</span>
          <span className="font-bold text-neutral-600">{beforeScore}</span>
          <span>→</span>
          <span className="font-extrabold text-emerald-800 text-sm">{afterScore}</span>
        </div>

        <span className="px-2.5 py-0.5 rounded-full font-bold text-xs bg-emerald-600 text-white shadow-xs">
          {delta >= 0 ? `+${delta} Improving` : `${delta} Declining`}
        </span>
      </div>

      {/* Comparison Display */}
      {viewMode === 'slider' ? (
        <div className="relative aspect-16/10 rounded-2xl overflow-hidden select-none border border-neutral-200 bg-neutral-950 group">
          {/* After image (background) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterImage}
            alt={afterLabel}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Before image (clipped by slider) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beforeImage}
              alt={beforeLabel}
              className="absolute inset-0 max-w-none w-full h-full object-cover"
            />
          </div>

          {/* Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-emerald-900 shadow-lg flex items-center justify-center font-bold text-xs border border-emerald-300 pointer-events-auto">
              ↔
            </div>
          </div>

          {/* Floating Labels */}
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-[11px] font-semibold backdrop-blur-xs">
            {beforeLabel} ({beforeScore}%)
          </span>
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-emerald-300 text-[11px] font-semibold backdrop-blur-xs">
            {afterLabel} ({afterScore}%)
          </span>

          {/* Native range input for slider handle control */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            aria-label="Image comparison slider"
          />
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="aspect-4/3 rounded-2xl overflow-hidden border border-neutral-200 relative bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beforeImage} alt={beforeLabel} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold">
                Initial Scan
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-700">{beforeLabel}</span>
              <span className="font-bold text-amber-700">{beforeScore}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="aspect-4/3 rounded-2xl overflow-hidden border border-emerald-300 relative bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={afterImage} alt={afterLabel} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200 text-[10px] font-semibold">
                Today
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-950">{afterLabel}</span>
              <span className="font-bold text-emerald-700">{afterScore}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
