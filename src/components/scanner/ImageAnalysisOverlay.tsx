'use client';

import React, { useState } from 'react';
import { AffectedArea } from '@/types';
import { Eye, Layers, Flame, Info, Sparkles } from 'lucide-react';

interface ImageAnalysisOverlayProps {
  imageUrl: string;
  affectedAreas: AffectedArea[];
  plantName?: string;
}

export type ViewMode = 'original' | 'ai_analysis' | 'affected_areas' | 'heatmap';

export function ImageAnalysisOverlay({
  imageUrl,
  affectedAreas,
  plantName = 'Tomato'
}: ImageAnalysisOverlayProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('ai_analysis');
  const [activeArea, setActiveArea] = useState<AffectedArea | null>(null);

  return (
    <div className="space-y-3">
      {/* View Mode Switcher Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center p-1 bg-neutral-100 rounded-xl border border-neutral-200 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'original'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Original
          </button>
          <button
            type="button"
            onClick={() => setViewMode('ai_analysis')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'ai_analysis'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            AI Analysis
          </button>
          <button
            type="button"
            onClick={() => setViewMode('affected_areas')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'affected_areas'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3 h-3 text-amber-600" />
            Affected Areas
          </button>
          <button
            type="button"
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'heatmap'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-600" />
            Heatmap
          </button>
        </div>

        <span className="text-[11px] text-neutral-500 font-medium hidden sm:inline">
          Mode: <strong className="text-neutral-800 capitalize">{viewMode.replace('_', ' ')}</strong>
        </span>
      </div>

      {/* Image Container with Overlays */}
      <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-neutral-950 border border-emerald-950/20 shadow-md select-none group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={plantName}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Heatmap Layer */}
        {viewMode === 'heatmap' && (
          <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-85 transition-opacity duration-300">
            <svg className="w-full h-full">
              <defs>
                <radialGradient id="heatGrad1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatGrad2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
              </defs>
              {affectedAreas.map((area) => (
                <circle
                  key={`heat-${area.id}`}
                  cx={`${area.x}%`}
                  cy={`${area.y}%`}
                  r={`${area.radius * 2.5}%`}
                  fill="url(#heatGrad1)"
                  className="animate-pulse"
                />
              ))}
            </svg>
          </div>
        )}

        {/* AI Analysis / Affected Areas Vector Overlay */}
        {(viewMode === 'ai_analysis' || viewMode === 'affected_areas') && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {affectedAreas.map((area) => {
              const strokeColor =
                area.severity === 'severe'
                  ? '#ef4444'
                  : area.severity === 'moderate'
                  ? '#f97316'
                  : '#eab308';

              const fillColor =
                area.severity === 'severe'
                  ? 'rgba(239, 68, 68, 0.25)'
                  : area.severity === 'moderate'
                  ? 'rgba(249, 115, 22, 0.25)'
                  : 'rgba(234, 179, 8, 0.25)';

              return (
                <g
                  key={area.id}
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setActiveArea(area)}
                  onMouseLeave={() => setActiveArea(null)}
                >
                  {/* Pulsing ring */}
                  <circle
                    cx={`${area.x}%`}
                    cy={`${area.y}%`}
                    r={`${area.radius * 1.3}%`}
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    fill="transparent"
                    className="animate-pulse"
                  />
                  {/* Bounding lesion area */}
                  <circle
                    cx={`${area.x}%`}
                    cy={`${area.y}%`}
                    r={`${area.radius}%`}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    fill={fillColor}
                  />
                  {/* Center reticle dot */}
                  <circle
                    cx={`${area.x}%`}
                    cy={`${area.y}%`}
                    r="3.5"
                    fill="#ffffff"
                    stroke={strokeColor}
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* Floating tooltip on hover */}
        {activeArea && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-3 bg-neutral-900/90 text-white text-xs px-3 py-1.5 rounded-xl border border-neutral-700 shadow-xl backdrop-blur-md"
            style={{ left: `${activeArea.x}%`, top: `${activeArea.y}%` }}
          >
            <p className="font-semibold text-[11px] text-emerald-300">
              {activeArea.label}
            </p>
            <p className="text-[10px] text-neutral-300 capitalize">
              Severity: {activeArea.severity}
            </p>
          </div>
        )}

        {/* Top-right mode tag */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white border border-white/10 uppercase tracking-wide">
          {viewMode === 'original'
            ? 'Raw Capture'
            : viewMode === 'heatmap'
            ? 'Pathogen Density Heatmap'
            : 'AI Lesion Segmentation'}
        </div>
      </div>

      {/* Severity Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-white border border-neutral-200 text-xs">
        <div className="flex items-center gap-1.5 text-neutral-500 font-medium">
          <Info className="w-3.5 h-3.5" />
          <span>Pathogen Scale:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Healthy
          </span>
          <span className="flex items-center gap-1 text-yellow-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            Mild concern
          </span>
          <span className="flex items-center gap-1 text-orange-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            Moderate
          </span>
          <span className="flex items-center gap-1 text-rose-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Severe
          </span>
        </div>
      </div>

      {/* Safety notice disclaimer */}
      <p className="text-[11px] text-neutral-400 text-center leading-normal">
        *Visual overlays represent AI analysis predictions based on leaf surface discoloration, not guaranteed laboratory pathology.
      </p>
    </div>
  );
}
