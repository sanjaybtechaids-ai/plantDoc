'use client';

import React from 'react';
import Link from 'next/link';
import { Plant } from '@/types';
import { HealthScoreGauge } from '@/components/common/HealthScoreGauge';
import { Flame, Clock, Scan, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePlantContext } from '@/context/PlantContext';

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const { setSelectedPlant } = usePlantContext();

  const statusBadge = {
    healthy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    attention: 'bg-amber-100 text-amber-800 border-amber-200',
    critical: 'bg-rose-100 text-rose-800 border-rose-200'
  }[plant.status];

  return (
    <div className="bg-white rounded-3xl border border-emerald-950/10 shadow-sm hover:shadow-md hover:border-emerald-600/30 transition-all overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Plant Photo & Status Overlay */}
        <div className="relative aspect-16/10 bg-neutral-900 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={plant.image}
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Status Badge */}
          <span
            className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-xs ${statusBadge}`}
          >
            {plant.status === 'attention' ? 'Needs Attention' : plant.status}
          </span>

          {/* Streak Indicator */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 text-amber-400 text-xs font-bold backdrop-blur-xs">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{plant.streakDays}d</span>
          </div>

          {/* Plant Name and Species on image */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h4 className="font-extrabold text-base leading-tight drop-shadow-sm">
              {plant.name}
            </h4>
            <p className="text-[11px] text-neutral-300 font-mono italic truncate">
              {plant.species}
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Health Score
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-emerald-950">
                  {plant.healthScore}%
                </span>
                <span className="text-xs text-neutral-500">
                  {plant.healthScore >= 80 ? 'Optimal' : plant.healthScore >= 50 ? 'Suboptimal' : 'Critical'}
                </span>
              </div>
            </div>

            <HealthScoreGauge score={plant.healthScore} size="sm" showLabel={false} />
          </div>

          {/* Current Issue if any */}
          {plant.currentIssue ? (
            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-medium truncate">{plant.currentIssue}</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">No active infections detected</span>
            </div>
          )}

          {/* Last scanned & Location */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400" />
              Last check: {plant.lastScanDate}
            </span>
            <span className="truncate max-w-[120px]">{plant.location}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2">
        <Link
          href="/scan"
          onClick={() => setSelectedPlant(plant)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold transition-colors"
        >
          <Scan className="w-3.5 h-3.5 text-emerald-700" />
          <span>Scan Again</span>
        </Link>

        <Link
          href={`/plants/${plant.id}`}
          onClick={() => setSelectedPlant(plant)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
