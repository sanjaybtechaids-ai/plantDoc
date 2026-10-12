'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlantContext } from '@/context/PlantContext';
import { HealthScoreGauge } from '@/components/common/HealthScoreGauge';
import {
  History,
  Filter,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function DiagnosisHistoryPage() {
  const { diagnoses, plants } = usePlantContext();
  const [severityFilter, setSeverityFilter] = useState<'all' | 'mild' | 'moderate' | 'severe' | 'healthy'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDiagnoses = diagnoses.filter((diag) => {
    const matchesFilter =
      severityFilter === 'all'
        ? true
        : severityFilter === 'healthy'
        ? diag.healthScore >= 80
        : diag.disease.severity === severityFilter;

    const matchesSearch =
      diag.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diag.disease.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
          <History className="w-4 h-4 text-emerald-600" />
          <span>Clinical Pathology Archive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight mt-1">
          Diagnosis History
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Complete archive of past computer vision scans, pathogen diagnoses, and prescriptive regimens.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-white rounded-2xl border border-emerald-950/10 shadow-xs">
        {/* Severity Filters */}
        <div className="flex flex-wrap items-center gap-1">
          {(['all', 'mild', 'moderate', 'severe', 'healthy'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                severityFilter === sev
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-emerald-950 hover:bg-emerald-50'
              }`}
            >
              {sev === 'all' ? 'All Scans' : sev}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search plant or disease..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>
      </div>

      {/* History Items List / Cards */}
      <div className="space-y-4">
        {filteredDiagnoses.map((diag) => {
          const isHealthy = diag.healthScore >= 80;

          return (
            <div
              key={diag.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-950/10 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                {/* Specimen thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-200 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={diag.imageUrl}
                    alt={diag.plantName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                    {diag.identificationConfidence}% ID
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{diag.date}</span>
                    <span>•</span>
                    <span className="font-semibold text-neutral-700">{diag.plantName}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                    {diag.disease.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isHealthy
                          ? 'bg-emerald-100 text-emerald-800'
                          : diag.disease.severity === 'severe'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {diag.disease.severity} Severity
                    </span>
                    <span className="text-neutral-500 text-[11px]">
                      AI Confidence: <strong className="text-neutral-800">{diag.disease.confidence}%</strong>
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-500 line-clamp-1 max-w-lg">
                    Primary action: {diag.treatment.immediateActions[0] || 'Observe healthy foliage.'}
                  </p>
                </div>
              </div>

              {/* Health Score & Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Score
                  </span>
                  <HealthScoreGauge score={diag.healthScore} size="sm" showLabel={false} />
                </div>

                <Link
                  href={`/diagnosis/${diag.id}`}
                  className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}

        {filteredDiagnoses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200 space-y-2">
            <History className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-medium text-neutral-600">No diagnoses match your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
