'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Diagnosis,
  NaturalTreatment,
  ChemicalTreatment,
  Product
} from '@/types';
import { ImageAnalysisOverlay } from './ImageAnalysisOverlay';
import { HealthScoreGauge } from '@/components/common/HealthScoreGauge';
import { DisclaimerBanner } from '@/components/common/DisclaimerBanner';
import {
  ShieldAlert,
  AlertTriangle,
  Leaf,
  FlaskConical,
  Sprout,
  ShoppingBag,
  Activity,
  MessageSquareText,
  BookmarkCheck,
  ChevronRight,
  ExternalLink,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { usePlantContext } from '@/context/PlantContext';
import { formatCurrency } from '@/lib/utils';

interface VisualAnalysisResultProps {
  diagnosis: Diagnosis;
  onResetScan?: () => void;
}

export function VisualAnalysisResult({
  diagnosis,
  onResetScan
}: VisualAnalysisResultProps) {
  const router = useRouter();
  const { addMonitoringEntry, addPlant, updatePlant, selectedPlant } = usePlantContext();

  const [activeTab, setActiveTab] = useState<'treatments' | 'fertilizer' | 'products' | 'disease_info'>('treatments');
  const [monitoringStarted, setMonitoringStarted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleStartMonitoring = () => {
    addMonitoringEntry({
      plantId: selectedPlant?.id || 'plant-tomato-01',
      dayLabel: 'Day 5 (Today)',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      imageUrl: diagnosis.imageUrl,
      healthScore: diagnosis.healthScore,
      previousScore: 68,
      change: +6,
      status: 'improving',
      symptoms: diagnosis.disease.symptoms.slice(0, 2),
      treatmentUsed: 'Initial AI scan logged. Scheduled foliar neem oil treatment.',
      aiNotes: `Baseline established for ${diagnosis.disease.name}. Daily tracking active.`
    });
    setMonitoringStarted(true);
    setTimeout(() => {
      router.push('/monitoring');
    }, 800);
  };

  const handleSaveToPlants = () => {
    setIsSaved(true);
    if (selectedPlant) {
      updatePlant(selectedPlant.id, {
        healthScore: diagnosis.healthScore,
        currentIssue: diagnosis.disease.name,
        lastScanDate: 'Today'
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
              AI Diagnostic Report
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              ID: {diagnosis.id} • {diagnosis.date}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            {diagnosis.plantIdentified}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed">
            Botanical identification confidence: <strong className="text-emerald-700">{diagnosis.identificationConfidence}%</strong>. Symptoms match <strong className="text-neutral-900">{diagnosis.disease.name}</strong> pattern.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleStartMonitoring}
            disabled={monitoringStarted}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs font-semibold shadow-sm shadow-emerald-900/20 transition-all"
          >
            <Activity className="w-4 h-4 text-emerald-200" />
            <span>{monitoringStarted ? 'Tracking Enabled!' : 'Start Daily Monitoring'}</span>
          </button>

          <Link
            href={`/chat?issue=${encodeURIComponent(diagnosis.disease.name)}`}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-semibold transition-all"
          >
            <MessageSquareText className="w-4 h-4 text-emerald-700" />
            <span>Consult Doctor AI</span>
          </Link>

          {onResetScan && (
            <button
              onClick={onResetScan}
              className="px-3 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-medium transition-colors"
            >
              Scan New Plant
            </button>
          )}
        </div>
      </div>

      {/* Main Split: Left Visual Specimen & Right Diagnostic Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Overlay & Heatmap */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Visual Analysis Segmentation
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {diagnosis.affectedAreas.length} Lesions Mapped
            </span>
          </div>

          <ImageAnalysisOverlay
            imageUrl={diagnosis.imageUrl}
            affectedAreas={diagnosis.affectedAreas}
            plantName={diagnosis.plantIdentified}
          />
        </div>

        {/* Right Column: Disease Severity, Confidence & Score */}
        <div className="lg:col-span-6 space-y-4">
          {/* Key Metrics Overview Card */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-950/10 shadow-sm">
            <div className="grid grid-cols-3 gap-3 divide-x divide-neutral-100 text-center">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Health Score
                </span>
                <div className="mt-1">
                  <HealthScoreGauge score={diagnosis.healthScore} size="sm" showLabel={false} />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center px-2">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Primary Issue
                </span>
                <span className="mt-2 text-sm sm:text-base font-extrabold text-neutral-900 leading-tight">
                  {diagnosis.disease.name}
                </span>
                <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                  {diagnosis.disease.severity}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center px-2">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  AI Confidence
                </span>
                <span className="mt-2 text-xl font-extrabold text-emerald-700">
                  {diagnosis.disease.confidence}%
                </span>
                <span className="text-[10px] text-neutral-500 font-medium mt-0.5">
                  High Probability
                </span>
              </div>
            </div>
          </div>

          {/* Pathogen & Symptoms Synopsis */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Symptoms Identified
              </h4>
              <span className="text-[11px] font-mono text-neutral-400">
                {diagnosis.disease.scientificName}
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {diagnosis.disease.description}
            </p>

            <div className="space-y-1.5 pt-1">
              {diagnosis.disease.symptoms.map((symptom, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-snug">{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Immediate Action Box */}
          <div className="bg-emerald-900 text-white p-5 rounded-3xl shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Immediate Steps (Next 2 Hours)
            </h4>
            <div className="space-y-2 text-xs leading-relaxed text-emerald-100">
              {diagnosis.treatment.immediateActions.slice(0, 2).map((action, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-800 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for In-depth Treatment, Fertilizer & Products */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('treatments')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'treatments'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>Recommended Treatment Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('fertilizer')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'fertilizer'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            <span>Nutritional Plan & Fertilizers</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Recommended Products ({diagnosis.products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('disease_info')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'disease_info'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Pathogen Profile & Causes</span>
          </button>
        </div>

        {/* TAB 1: Treatments Plan */}
        {activeTab === 'treatments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Immediate Actions */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                Comprehensive Immediate Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {diagnosis.treatment.immediateActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Natural / Organic Treatments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    Natural & Organic Treatment Options
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Eco-friendly botanical bio-fungicides and natural soil restorers.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Recommended First Line
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {diagnosis.treatment.naturalTreatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className="bg-white p-5 rounded-3xl border border-emerald-950/10 shadow-sm hover:border-emerald-600/40 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        🌿
                      </div>
                      <h4 className="font-bold text-xs text-emerald-950 group-hover:text-emerald-700 transition-colors">
                        {treatment.name}
                      </h4>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {treatment.purpose}
                      </p>

                      <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-[11px] text-neutral-600">
                        <div>
                          <strong className="text-neutral-800">How to use:</strong> {treatment.howToUse}
                        </div>
                        <div>
                          <strong className="text-neutral-800">Frequency:</strong> {treatment.frequency}
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900 text-[10px]">
                          <strong>Safety:</strong> {treatment.safetyNote}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-950">
                        {formatCurrency(treatment.price)}
                      </span>
                      <a
                        href={treatment.productLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>Buy Demo Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chemical Treatment Options with strict warning */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-blue-600" />
                    Chemical Treatment Options
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Use when biological measures fail and disease progression threatens crop loss.
                  </p>
                </div>
              </div>

              {/* Chemical Caution Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-950">Mandatory Safety & Compliance Notice</p>
                  <p className="text-amber-800 leading-relaxed text-[11px] sm:text-xs">
                    Chemical treatments are not guaranteed cures. Follow the manufacturer product label, wear personal protective equipment (gloves, goggles), and adhere to regional agricultural environmental regulations. Avoid overuse to prevent resistance development.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diagnosis.treatment.chemicalTreatments.map((chemical) => (
                  <div
                    key={chemical.id}
                    className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Active: {chemical.activeIngredient}
                        </span>
                        <span className="font-bold text-xs text-neutral-900">
                          {formatCurrency(chemical.price)}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-neutral-900">{chemical.name}</h4>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {chemical.purpose}
                      </p>

                      <div className="pt-2 border-t border-neutral-100 space-y-1 text-[11px] text-neutral-600">
                        <div>
                          <strong className="text-neutral-800">Application:</strong> {chemical.application}
                        </div>
                        <div className="p-2 rounded-lg bg-rose-50 text-rose-900 text-[10px]">
                          <strong>Precautions:</strong> {chemical.precautions}
                        </div>
                      </div>
                    </div>

                    <a
                      href={chemical.productLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View Chemical Product</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Fertilizer & Nutrition */}
        {activeTab === 'fertilizer' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  Suspected Plant Nutrient Breakdown
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Visual chlorosis markers analyzed against tissue deficiency charts.
                </p>
              </div>

              {/* Nutrient Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Nitrogen */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-950">Nitrogen (N)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      Deficient
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-amber-200/60 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[35%]" />
                  </div>
                  <p className="text-[10px] text-amber-800 leading-tight">
                    Lower leaf yellowing indicates mobile nitrogen remobilization.
                  </p>
                </div>

                {/* Phosphorus */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-950">Phosphorus (P)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      Adequate
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-emerald-200/60 overflow-hidden">
                    <div className="h-full bg-emerald-600 w-[78%]" />
                  </div>
                  <p className="text-[10px] text-emerald-800 leading-tight">
                    Root energy and blossom development are well-supplied.
                  </p>
                </div>

                {/* Potassium */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-950">Potassium (K)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      Needs Attention
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-amber-200/60 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[42%]" />
                  </div>
                  <p className="text-[10px] text-amber-800 leading-tight">
                    Crucial for plant immune defenses against fungal cell wall penetration.
                  </p>
                </div>

                {/* Micronutrients */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-950">Micronutrients</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      Balanced
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-emerald-200/60 overflow-hidden">
                    <div className="h-full bg-emerald-600 w-[70%]" />
                  </div>
                  <p className="text-[10px] text-emerald-800 leading-tight">
                    Iron, Magnesium, and Zinc levels in optimal range.
                  </p>
                </div>
              </div>

              {/* Recommended Fertilizer Card */}
              <div className="p-5 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/80">
                    Recommended Formulation
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    {diagnosis.fertilizer.recommendedFertilizer.name}
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {diagnosis.fertilizer.recommendedFertilizer.purpose}
                  </p>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Dosage: {diagnosis.fertilizer.recommendedFertilizer.applicationRate}
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                  <span className="text-xl font-black text-emerald-400">
                    {formatCurrency(diagnosis.fertilizer.recommendedFertilizer.price)}
                  </span>
                  <a
                    href={diagnosis.fertilizer.recommendedFertilizer.productLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5"
                  >
                    <span>View Product</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Recommended Products Marketplace */}
        {activeTab === 'products' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {diagnosis.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-emerald-950/10 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div className="space-y-3">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                        {product.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-emerald-950 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                        {product.whyRecommended}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                      <span>★ {product.rating}</span>
                      <span className="text-neutral-400 font-normal">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between mt-3">
                    <span className="font-extrabold text-sm text-emerald-950">
                      {formatCurrency(product.price)}
                    </span>
                    {(product.purchaseUrl || (product.demoUrl && !product.demoUrl.includes('example.com'))) ? (
                      <a
                        href={product.purchaseUrl || product.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>Buy Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-medium bg-neutral-100 px-2 py-1 rounded-lg">
                        Product link unavailable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-neutral-400 text-center">
              *Product links are provided for demonstration purposes. Check local agricultural retailers for stock.
            </p>
          </div>
        )}

        {/* TAB 4: Pathogen Profile */}
        {activeTab === 'disease_info' && (
          <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Etiology & Epidemiology
              </span>
              <h3 className="text-xl font-extrabold text-emerald-950 mt-1">
                {diagnosis.disease.name} ({diagnosis.disease.scientificName})
              </h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                {diagnosis.disease.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider">
                  Environmental Triggers & Causes
                </h4>
                <ul className="space-y-2 text-xs text-neutral-700">
                  {diagnosis.disease.causes.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider">
                  Long-term Cultural Prevention
                </h4>
                <ul className="space-y-2 text-xs text-neutral-700">
                  {diagnosis.disease.prevention.map((prev, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{prev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Safety Compliance Footer */}
      <DisclaimerBanner variant="full" />
    </div>
  );
}
