'use client';

import React from 'react';
import { Check, Loader2, Sparkles, Sprout } from 'lucide-react';

interface AIScanningModalProps {
  currentStepIndex: number;
  imageUrl?: string;
}

export function AIScanningModal({ currentStepIndex, imageUrl }: AIScanningModalProps) {
  const steps = [
    'Image received & validated',
    'Plant detected: Solanum lycopersicum (Tomato)',
    'Visual symptoms identified: 5 lesions detected',
    'Comparing disease patterns against agronomic model',
    'Preparing personalized treatment and nutrition plan'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden space-y-6">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header & animated scanner graphic */}
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden border border-emerald-500/40 shadow-inner flex items-center justify-center bg-black">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Scanning in progress"
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <Sprout className="w-8 h-8 text-emerald-400" />
            )}

            {/* Glowing laser scanning line */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scan-laser" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              Plant Doctor is examining your plant...
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Neural network cross-referencing botanical pathogen taxonomy.
            </p>
          </div>
        </div>

        {/* Step-by-step progress checklist */}
        <div className="space-y-3 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step}
                className={`flex items-center gap-3 text-xs transition-opacity duration-200 ${
                  isCompleted
                    ? 'text-emerald-300 font-medium'
                    : isCurrent
                    ? 'text-white font-semibold'
                    : 'text-neutral-500'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    isCompleted
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : isCurrent
                      ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/60'
                      : 'border border-neutral-700 text-neutral-600'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <span className="truncate">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
