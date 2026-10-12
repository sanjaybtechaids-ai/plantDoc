'use client';

import React from 'react';
import Link from 'next/link';
import {
  Scan,
  MessageSquareText,
  Sparkles,
  ShieldCheck,
  Activity,
  CheckCircle2,
  ArrowRight,
  Leaf,
  FlaskConical,
  Flame,
  SearchCheck,
  Stethoscope
} from 'lucide-react';
import { DisclaimerBanner } from '@/components/common/DisclaimerBanner';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-20 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-bold tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Next-Gen Agricultural Computer Vision</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-emerald-950 tracking-tight leading-[1.1]">
            Your AI-powered <br />
            <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
              plant doctor
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Upload a photo, understand what&apos;s affecting your plant, and get personalized organic & chemical care recommendations with continuous daily recovery tracking.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/scan"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-950/20 active:scale-98 transition-all flex items-center justify-center gap-2 group"
            >
              <Scan className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>Scan My Plant</span>
            </Link>

            <Link
              href="/chat"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-emerald-50/60 text-emerald-950 font-bold text-sm sm:text-base border border-emerald-950/15 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <MessageSquareText className="w-5 h-5 text-emerald-700" />
              <span>Ask Plant Doctor AI</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs font-medium text-neutral-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              No signup required to scan
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              94% Pathology accuracy
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Daily recovery tracking
            </span>
          </div>
        </div>

        {/* Visual Plant Health Feature Showcase Card */}
        <div className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl border border-emerald-950/10 shadow-xl overflow-hidden p-6 sm:p-8">
          <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-emerald-950">
                  Comprehensive Diagnostic Ecosystem
                </h3>
                <p className="text-xs text-neutral-500">
                  Real-time specimen breakdown: Roma Tomato (Solanum lycopersicum)
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4 Multi-faceted Showcase Quadrants */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
            {/* 1. Healthy Plant Standard */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-3">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/plants/monstera-healthy.jpg"
                  alt="Healthy specimen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Healthy Benchmark
                </span>
                <h4 className="font-bold text-xs text-emerald-950 mt-1">
                  Chlorophyll Density 96%
                </h4>
                <p className="text-[11px] text-neutral-600 mt-1">
                  Intact vascular cell walls, zero active fungal mycelium.
                </p>
              </div>
            </div>

            {/* 2. Disease Detection */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/plants/tomato-blight.jpg"
                  alt="Diseased specimen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Pathogen Identified
                </span>
                <h4 className="font-bold text-xs text-neutral-900 mt-1">
                  Early Blight (Alternaria)
                </h4>
                <p className="text-[11px] text-neutral-600 mt-1">
                  Concentric necrotic rings with chlorotic yellow haloes detected.
                </p>
              </div>
            </div>

            {/* 3. AI Analysis */}
            <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-emerald-400">
                    Neural Vision
                  </span>
                  <span className="text-xs font-bold text-emerald-400">94% Conf.</span>
                </div>
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>Health Score:</span>
                    <span className="text-white font-bold">72/100</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>Lesions Mapped:</span>
                    <span className="text-white font-bold">5 hotspots</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>Severity:</span>
                    <span className="text-amber-400 font-bold">Moderate</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 text-[10px] text-neutral-400">
                Segmented via multi-scale bounding filters.
              </div>
            </div>

            {/* 4. Treatment Recommendation */}
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Dual Treatment
                </span>
                <h4 className="font-bold text-xs text-emerald-950">
                  Targeted Interventions
                </h4>
                <div className="space-y-1.5 text-[11px] text-neutral-600">
                  <p>• <strong>Organic:</strong> Cold-pressed Neem Oil 0.5%</p>
                  <p>• <strong>Nutrition:</strong> NPK 10-10-10 feed</p>
                  <p>• <strong>Sanitation:</strong> Prune lower 12&quot; foliage</p>
                </div>
              </div>

              <Link
                href="/scan"
                className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] text-center block transition-colors"
              >
                Scan This Specimen
              </Link>
            </div>
          </div>
        </div>

        {/* Simple 3-step explanation */}
        <div className="mt-20 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
              How Plant Doctor Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Three precise steps from first symptom to full plant recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-base text-emerald-950">
                Upload or Capture
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Take a photo using your phone or webcam, or drag & drop existing images of affected leaves.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-base text-emerald-950">
                AI Analyzes
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Neural networks identify the plant variety, detect fungal/bacterial pathogens, and highlight affected regions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-base text-emerald-950">
                Follow Personalized Treatment
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Follow actionable immediate steps, organic and chemical remedies, and track recovery daily.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="mt-16 max-w-3xl mx-auto">
          <DisclaimerBanner variant="full" />
        </div>
      </section>
    </div>
  );
}
