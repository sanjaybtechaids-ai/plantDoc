'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { usePlantContext } from '@/context/PlantContext';
import { HealthScoreGauge } from '@/components/common/HealthScoreGauge';
import { HealthTrendChart } from '@/components/monitoring/HealthTrendChart';
import {
  Sun,
  Droplets,
  Sprout,
  MapPin,
  Calendar,
  Layers,
  Flame,
  Scan,
  Activity,
  MessageSquareText,
  AlertTriangle,
  ArrowLeft,
  Clock
} from 'lucide-react';

export default function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { plants, setSelectedPlant, monitoringEntries } = usePlantContext();

  const plant = plants.find((p) => p.id === resolvedParams.id) || plants[0];

  if (!plant) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-neutral-800">Plant Not Found</h2>
        <Link href="/plants" className="text-xs font-semibold text-emerald-700 underline">
          Back to all plants
        </Link>
      </div>
    );
  }

  const handleScanPlant = () => {
    setSelectedPlant(plant);
    router.push('/scan');
  };

  const handleMonitorPlant = () => {
    setSelectedPlant(plant);
    router.push('/monitoring');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <Link
          href="/plants"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Plants</span>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={plant.image}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {plant.type}
              </span>
              <span className="text-xs text-neutral-400">
                Planted: {plant.plantingDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
              {plant.name}
            </h1>
            <p className="text-xs sm:text-sm font-mono text-neutral-500 italic">
              {plant.species}
            </p>

            <div className="flex items-center gap-3 text-xs text-neutral-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {plant.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                {plant.streakDays} Day Streak
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleScanPlant}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm shadow-emerald-900/20 transition-all"
          >
            <Scan className="w-4 h-4 text-emerald-200" />
            <span>Scan Plant</span>
          </button>

          <button
            onClick={handleMonitorPlant}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 transition-all"
          >
            <Activity className="w-4 h-4 text-emerald-700" />
            <span>Monitor</span>
          </button>

          <Link
            href={`/chat?issue=${encodeURIComponent(plant.name)}`}
            className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-colors"
            title="Ask AI about this plant"
          >
            <MessageSquareText className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics & Agronomic Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Health Status Card */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Overall Health Condition
          </span>
          <HealthScoreGauge score={plant.healthScore} size="lg" />
          <p className="text-xs text-neutral-500 max-w-xs">
            Last optical inspection: <strong className="text-neutral-800">{plant.lastScanDate}</strong>
          </p>
        </div>

        {/* Botanical Care Specs */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-emerald-950">
            Environmental & Soil Specifications
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
              <span className="text-neutral-400 flex items-center gap-1 font-semibold text-[10px] uppercase">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Sunlight
              </span>
              <p className="font-bold text-neutral-800">{plant.sunlight}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
              <span className="text-neutral-400 flex items-center gap-1 font-semibold text-[10px] uppercase">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                Watering
              </span>
              <p className="font-bold text-neutral-800">{plant.wateringFrequency}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
              <span className="text-neutral-400 flex items-center gap-1 font-semibold text-[10px] uppercase">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Pot Size
              </span>
              <p className="font-bold text-neutral-800">{plant.potSize || '12-inch Pot'}</p>
            </div>

            <div className="col-span-2 sm:col-span-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
              <span className="text-neutral-400 font-semibold text-[10px] uppercase">
                Soil Substrate
              </span>
              <p className="font-medium text-neutral-800">{plant.soilType}</p>
            </div>
          </div>

          {plant.notes && (
            <div className="pt-2 text-xs text-neutral-600 border-t border-neutral-100">
              <strong className="text-neutral-800">Field Notes:</strong> {plant.notes}
            </div>
          )}
        </div>
      </div>

      {/* Embedded Health Trend Chart */}
      <HealthTrendChart entries={monitoringEntries} plantName={plant.name} />
    </div>
  );
}
