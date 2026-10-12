'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { MonitoringEntry } from '@/types';
import { TrendingUp, Award } from 'lucide-react';

interface HealthTrendChartProps {
  entries: MonitoringEntry[];
  plantName?: string;
}

export function HealthTrendChart({ entries, plantName = 'Roma Tomato' }: HealthTrendChartProps) {
  const chartData = entries.map((entry) => ({
    name: entry.dayLabel,
    score: entry.healthScore,
    date: entry.date,
    change: entry.change
  }));

  const initialScore = entries[0]?.healthScore || 50;
  const currentScore = entries[entries.length - 1]?.healthScore || initialScore;
  const totalGain = currentScore - initialScore;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="font-bold text-base text-emerald-950">
              Plant Health Recovery Trend
            </h3>
          </div>
          <p className="text-xs text-neutral-500">
            {plantName} • Daily visual symptom severity progression
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{totalGain}% Recovery</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>5 Days Monitored</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-64 sm:h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f2" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[40, 100]}
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-neutral-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-neutral-700">
                      <p className="font-bold text-emerald-300">{data.name} ({data.date})</p>
                      <p className="font-extrabold text-sm">Health Score: {data.score}/100</p>
                      {data.change !== 0 && (
                        <p className="text-[11px] text-emerald-400 font-medium">
                          Change: +{data.change} points vs prior check
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#15803d"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scoreColor)"
              dot={{ r: 4, fill: '#15803d', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#16a34a', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between text-xs text-neutral-500">
        <span>Target wellness threshold: <strong>85%</strong></span>
        <span className="text-emerald-700 font-semibold">
          Your plant is responding well to early blight pruning and foliar neem care.
        </span>
      </div>
    </div>
  );
}
