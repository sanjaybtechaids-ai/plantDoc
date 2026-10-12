'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface HealthScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function getHealthScoreCategory(score: number): {
  label: string;
  category: 'Critical' | 'Poor' | 'Needs Attention' | 'Good' | 'Healthy';
  color: string;
  bgLight: string;
  borderColor: string;
} {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  if (safeScore <= 30) {
    return {
      label: 'Critical Condition',
      category: 'Critical',
      color: 'text-rose-600',
      bgLight: 'bg-rose-50',
      borderColor: 'border-rose-200'
    };
  }
  if (safeScore <= 50) {
    return {
      label: 'Poor Health',
      category: 'Poor',
      color: 'text-amber-600',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-200'
    };
  }
  if (safeScore <= 70) {
    return {
      label: 'Needs Attention',
      category: 'Needs Attention',
      color: 'text-yellow-600',
      bgLight: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    };
  }
  if (safeScore <= 85) {
    return {
      label: 'Good Condition',
      category: 'Good',
      color: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    };
  }
  return {
    label: 'Healthy & Vibrant',
    category: 'Healthy',
    color: 'text-teal-600',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-200'
  };
}

export function HealthScore({ score, size = 'md', showLabel = true }: HealthScoreProps) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const { category, color, bgLight, borderColor } = getHealthScoreCategory(safeScore);

  const radius = size === 'lg' ? 44 : size === 'md' ? 32 : 22;
  const strokeWidth = size === 'lg' ? 8 : size === 'md' ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-flex items-center justify-center">
        <svg
          className={`transform -rotate-90 ${
            size === 'lg' ? 'w-24 h-24' : size === 'md' ? 'w-18 h-18' : 'w-12 h-12'
          }`}
        >
          {/* Background circle */}
          <circle
            cx={size === 'lg' ? 48 : size === 'md' ? 36 : 24}
            cy={size === 'lg' ? 48 : size === 'md' ? 36 : 24}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-neutral-100"
            fill="transparent"
          />
          {/* Active progress */}
          <circle
            cx={size === 'lg' ? 48 : size === 'md' ? 36 : 24}
            cy={size === 'lg' ? 48 : size === 'md' ? 36 : 24}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000 ease-out`}
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-black ${
              size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-base' : 'text-xs'
            } text-neutral-900`}
          >
            {safeScore}
          </span>
          <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-tighter">
            /100
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${bgLight} ${color} border ${borderColor}`}>
              {category}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">
            AI-estimated plant health score
          </p>
        </div>
      )}
    </div>
  );
}
