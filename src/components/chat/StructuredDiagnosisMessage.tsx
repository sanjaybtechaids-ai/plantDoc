'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Leaf,
  FlaskConical,
  Clock,
  ArrowRight
} from 'lucide-react';

interface StructuredDiagnosisCardProps {
  card: {
    diseaseName: string;
    confidence: number;
    severity: 'mild' | 'moderate' | 'severe';
    symptoms: string[];
    immediateActions: string[];
    naturalTreatment: string;
    chemicalTreatment: string;
    nextCheck: string;
  };
}

export function StructuredDiagnosisMessage({ card }: StructuredDiagnosisCardProps) {
  const severityBadge = {
    mild: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    moderate: 'bg-orange-100 text-orange-800 border-orange-200',
    severe: 'bg-rose-100 text-rose-800 border-rose-200'
  }[card.severity];

  return (
    <div className="mt-3 p-4 sm:p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-neutral-900 shadow-sm space-y-4 max-w-xl">
      {/* Title & Severity Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-200/60">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
            Diagnostic Assessment
          </span>
          <h4 className="text-base font-extrabold text-emerald-950 mt-0.5">
            {card.diseaseName}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border ${severityBadge}`}>
            Severity: {card.severity}
          </span>
          <span className="text-xs font-bold text-emerald-800">
            {card.confidence}% Conf.
          </span>
        </div>
      </div>

      {/* What I Found */}
      <div className="space-y-1.5 text-xs">
        <h5 className="font-bold text-emerald-950 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          What I Found (Visual Indicators):
        </h5>
        <ul className="space-y-1 pl-1 text-neutral-700">
          {card.symptoms.map((s, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What You Should Do */}
      <div className="space-y-1.5 text-xs">
        <h5 className="font-bold text-emerald-950 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          What You Should Do (Immediate Protocol):
        </h5>
        <ol className="space-y-1 pl-1 text-neutral-700">
          {card.immediateActions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-bold text-emerald-800 text-[11px] shrink-0">
                {idx + 1}.
              </span>
              <span>{action}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Recommended Treatment Split */}
      <div className="p-3 rounded-2xl bg-white border border-emerald-100 text-xs space-y-2">
        <div className="flex items-start gap-2">
          <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-950">Natural / Organic:</strong>{' '}
            <span className="text-neutral-700">{card.naturalTreatment}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-1 border-t border-neutral-100">
          <FlaskConical className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-neutral-900">Chemical Alternative:</strong>{' '}
            <span className="text-neutral-700">{card.chemicalTreatment}</span>
          </div>
        </div>
      </div>

      {/* Next Check Footer */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-semibold">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Next Check: {card.nextCheck}</span>
        </div>

        <Link
          href="/scan"
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
        >
          <span>Open Full Scanner</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
