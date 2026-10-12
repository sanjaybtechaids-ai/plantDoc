'use client';

import React, { useState } from 'react';
import { usePlantContext } from '@/context/PlantContext';
import { ImageComparisonSlider } from '@/components/monitoring/ImageComparisonSlider';
import { HealthTrendChart } from '@/components/monitoring/HealthTrendChart';
import { MonitoringTimeline } from '@/components/monitoring/MonitoringTimeline';
import { DailyCheckinModal } from '@/components/monitoring/DailyCheckinModal';
import {
  Activity,
  Camera,
  Calendar,
  Sparkles,
  Flame,
  TrendingUp,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function MonitoringPage() {
  const { selectedPlant, monitoringEntries } = usePlantContext();
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);

  const plantName = selectedPlant?.name || 'Roma Tomato';
  const latestEntry = monitoringEntries[monitoringEntries.length - 1];
  const firstEntry = monitoringEntries[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Daily Check-in Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Continuous Longitudinal Surveillance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            Plant Monitoring: {plantName}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Tracking disease remission, cellular regeneration, and foliar recovery day by day.
          </p>
        </div>

        <button
          onClick={() => setIsCheckinModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all"
        >
          <Camera className="w-4 h-4 text-emerald-200" />
          <span>Upload Today&apos;s Photo</span>
        </button>
      </div>

      {/* Daily Check-in Alert Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-850 to-teal-950 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Day 5 Check-in Due</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Your {plantName} needs a health check today.
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
            Take the photo from approximately the <span className="underline font-semibold text-white">same angle and distance</span> for better optical comparison against early blight lesions.
          </p>
        </div>

        <button
          onClick={() => setIsCheckinModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 text-xs font-extrabold shadow-sm active:scale-98 transition-all shrink-0 flex items-center gap-2"
        >
          <Camera className="w-4 h-4 text-emerald-700" />
          <span>Complete Check-in</span>
        </button>
      </div>

      {/* Continuous Image Monitoring: Before vs Today Slider */}
      <ImageComparisonSlider
        beforeImage={firstEntry?.imageUrl || '/images/plants/tomato-blight.jpg'}
        afterImage={latestEntry?.imageUrl || '/images/plants/tomato-blight.jpg'}
        beforeScore={firstEntry?.healthScore || 54}
        afterScore={latestEntry?.healthScore || 74}
        beforeLabel="Day 1 Initial Infection"
        afterLabel="Day 5 Today (Remission)"
      />

      {/* Health Trend Recharts Graph */}
      <HealthTrendChart
        entries={monitoringEntries}
        plantName={plantName}
      />

      {/* Detailed Chronological Progression Log */}
      <MonitoringTimeline entries={monitoringEntries} />

      {/* Daily Checkin Modal */}
      {isCheckinModalOpen && (
        <DailyCheckinModal
          onClose={() => setIsCheckinModalOpen(false)}
          plantName={plantName}
        />
      )}
    </div>
  );
}
