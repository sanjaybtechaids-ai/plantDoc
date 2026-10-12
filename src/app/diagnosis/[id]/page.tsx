'use client';

import React, { use, Suspense } from 'react';
import Link from 'next/link';
import { usePlantContext } from '@/context/PlantContext';
import { VisualAnalysisResult } from '@/components/scanner/VisualAnalysisResult';
import { ArrowLeft, Printer, Share2 } from 'lucide-react';

export default function DiagnosisDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { diagnoses } = usePlantContext();

  const diagnosis =
    diagnoses.find((d) => d.id === resolvedParams.id) || diagnoses[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top back navigation and utility actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/diagnosis"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Diagnosis History</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {diagnosis ? (
        <VisualAnalysisResult diagnosis={diagnosis} />
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200">
          <p className="text-sm font-semibold text-neutral-700">Diagnosis report not found.</p>
          <Link href="/scan" className="text-xs text-emerald-700 underline mt-2 inline-block">
            Run a new scan
          </Link>
        </div>
      )}
    </div>
  );
}
