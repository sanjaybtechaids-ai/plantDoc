'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlantContext } from '@/context/PlantContext';
import { PlantCard } from '@/components/plants/PlantCard';
import { AddPlantModal } from '@/components/plants/AddPlantModal';
import {
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Scan,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  BellRing
} from 'lucide-react';

export default function DashboardPage() {
  const { plants, settings, alerts, setSelectedPlant } = usePlantContext();
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);

  // Statistics
  const totalMonitored = 12; // or plants.length for dynamic
  const healthyCount = 8;
  const needAttentionCount = 3;
  const criticalCount = 1;
  const streakDays = 14;

  const urgentAlerts = alerts.filter(a => !a.read).slice(0, 2);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            Good morning, {settings.userName}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Let&apos;s keep your plants healthy today. Continuous surveillance active.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddPlantOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-emerald-950/15 hover:border-emerald-600 hover:bg-emerald-50 text-emerald-950 text-xs font-semibold shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>Add Plant</span>
          </button>

          <Link
            href="/scan"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm shadow-emerald-900/20 active:scale-98 transition-all"
          >
            <Scan className="w-4 h-4 text-emerald-200" />
            <span>Scan Plant</span>
          </Link>
        </div>
      </div>

      {/* Urgent Alerts Notification Ribbon */}
      {urgentAlerts.length > 0 && (
        <div className="space-y-2">
          {urgentAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                alert.type === 'critical'
                  ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                  : alert.type === 'improvement'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BellRing className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <strong className="font-semibold">{alert.title}:</strong>{' '}
                  <span className="text-neutral-700">{alert.message}</span>
                </div>
              </div>

              <Link
                href={alert.actionUrl || '/alerts'}
                className="text-xs font-bold text-emerald-800 hover:underline shrink-0"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Plants Monitored */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-emerald-950/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Plants Monitored
            </span>
            <Sprout className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950">
            {totalMonitored}
          </div>
          <span className="text-[10px] text-neutral-400 block">Across 3 greenhouse zones</span>
        </div>

        {/* Healthy */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-emerald-950/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Healthy
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {healthyCount}
          </div>
          <span className="text-[10px] text-emerald-700 block font-medium">Optimal chlorophyll</span>
        </div>

        {/* Need Attention */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-emerald-950/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Need Attention
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {needAttentionCount}
          </div>
          <span className="text-[10px] text-amber-700 block font-medium">Early blight, mites</span>
        </div>

        {/* Critical */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-emerald-950/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Critical
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600">
            {criticalCount}
          </div>
          <span className="text-[10px] text-rose-700 block font-medium">Powdery mildew rose</span>
        </div>

        {/* Monitoring Streak */}
        <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Monitoring Streak
            </span>
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {streakDays} <span className="text-xs font-normal text-emerald-300">Days</span>
          </div>
          <span className="text-[10px] text-emerald-300 block">Daily photo streak active</span>
        </div>
      </div>

      {/* Today's Plant Health Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-emerald-950 tracking-tight">
              Today&apos;s Plant Health
            </h2>
            <p className="text-xs text-neutral-500">
              Active surveillance overview across your botanical collection.
            </p>
          </div>

          <Link
            href="/plants"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>View All ({plants.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Plant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </div>

      {/* Add Plant Modal */}
      {isAddPlantOpen && (
        <AddPlantModal onClose={() => setIsAddPlantOpen(false)} />
      )}
    </div>
  );
}
