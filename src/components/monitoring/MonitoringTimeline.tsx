'use client';

import React from 'react';
import { MonitoringEntry } from '@/types';
import { HealthScoreGauge } from '@/components/common/HealthScoreGauge';
import { CheckCircle2, TrendingUp, Sparkles, Calendar, Pill } from 'lucide-react';

interface MonitoringTimelineProps {
  entries: MonitoringEntry[];
}

export function MonitoringTimeline({ entries }: MonitoringTimelineProps) {
  // Sort reverse chronological or forward chronological (forward is great for narrative progression)
  const sortedEntries = [...entries];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-emerald-950">
            Daily Monitoring Progression Log
          </h3>
          <p className="text-xs text-neutral-500">
            Chronological inspection cards recorded via daily camera check-ins.
          </p>
        </div>
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {entries.length} Check-ins Logged
        </span>
      </div>

      <div className="space-y-4">
        {sortedEntries.map((entry, index) => {
          const isLatest = index === sortedEntries.length - 1;

          return (
            <div
              key={entry.id}
              className={`p-5 rounded-3xl border transition-all ${
                isLatest
                  ? 'bg-emerald-50/40 border-emerald-300 shadow-sm'
                  : 'bg-white border-emerald-950/10 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isLatest
                        ? 'bg-emerald-700 text-white'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {entry.dayLabel}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{entry.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-neutral-500">Score:</span>
                    <span className="font-extrabold text-sm text-neutral-900">
                      {entry.healthScore}%
                    </span>
                  </div>

                  {entry.change !== 0 && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        entry.change > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {entry.change > 0 ? `+${entry.change}` : entry.change}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 items-center">
                {/* Specimen image thumbnail */}
                <div className="md:col-span-3">
                  <div className="aspect-4/3 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.imageUrl}
                      alt={entry.dayLabel}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 left-2 text-[10px] text-white font-mono">
                      Log #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Detected symptoms & Treatment */}
                <div className="md:col-span-5 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-neutral-900 block mb-1">
                      Visual Symptoms Noted:
                    </span>
                    <ul className="space-y-1 text-neutral-600">
                      {entry.symptoms.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-1">
                    <span className="font-bold text-neutral-900 flex items-center gap-1 text-[11px]">
                      <Pill className="w-3.5 h-3.5 text-emerald-700" />
                      Treatment Applied:
                    </span>
                    <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                      {entry.treatmentUsed}
                    </p>
                  </div>
                </div>

                {/* AI Diagnostic Notes */}
                <div className="md:col-span-4 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-900">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>AI Observation</span>
                  </div>
                  <p className="text-[11px] text-neutral-700 leading-relaxed italic">
                    &ldquo;{entry.aiNotes}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
