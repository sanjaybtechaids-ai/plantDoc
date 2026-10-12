import React from 'react';

interface HealthScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function HealthScoreGauge({
  score,
  size = 'md',
  showLabel = true,
  className = ''
}: HealthScoreGaugeProps) {
  // Clamp score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Determine color and status
  let strokeColor = '#15803d'; // Green
  let bgColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let label = 'Healthy';

  if (normalizedScore < 50) {
    strokeColor = '#ef4444'; // Red
    bgColor = 'text-rose-700 bg-rose-50 border-rose-200';
    label = 'Critical';
  } else if (normalizedScore < 80) {
    strokeColor = '#f59e0b'; // Amber
    bgColor = 'text-amber-700 bg-amber-50 border-amber-200';
    label = 'Needs Attention';
  }

  const dimensions = {
    sm: { size: 64, stroke: 6, fontSize: 'text-base', labelSize: 'text-[10px]' },
    md: { size: 100, stroke: 9, fontSize: 'text-2xl', labelSize: 'text-xs' },
    lg: { size: 140, stroke: 12, fontSize: 'text-4xl', labelSize: 'text-sm' }
  }[size];

  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg
          width={dimensions.size}
          height={dimensions.size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke="#e2e8e3"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Animated score circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-bold tracking-tight text-neutral-800 ${dimensions.fontSize}`}>
            {normalizedScore}
          </span>
          <span className="text-[10px] uppercase font-semibold text-neutral-400">/ 100</span>
        </div>
      </div>

      {showLabel && (
        <span
          className={`mt-2 px-2.5 py-0.5 rounded-full font-medium border ${dimensions.labelSize} ${bgColor}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
