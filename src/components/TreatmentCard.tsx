'use client';

import React from 'react';
import { NaturalTreatment, ChemicalTreatment } from '@/types';
import { ShieldCheck, AlertTriangle, Leaf, FlaskConical, Clock, Sparkles } from 'lucide-react';

interface TreatmentCardProps {
  immediateActions?: string[];
  naturalTreatments: NaturalTreatment[];
  chemicalTreatments: ChemicalTreatment[];
}

export function TreatmentCard({
  immediateActions = [],
  naturalTreatments = [],
  chemicalTreatments = []
}: TreatmentCardProps) {
  return (
    <div className="space-y-6">
      {/* Immediate Triage Actions */}
      {immediateActions.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200/80 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Immediate Triage Actions</span>
          </div>
          <ul className="space-y-2">
            {immediateActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-amber-950 font-medium">
                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Natural & Organic Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Natural & Biological Remedies</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {naturalTreatments.map((nat) => (
            <div
              key={nat.id || nat.name}
              className="p-5 rounded-3xl bg-white border border-emerald-950/10 shadow-xs space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Botanical Organic
                  </span>
                  <h4 className="text-sm font-bold text-emerald-950 mt-1.5">{nat.name}</h4>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">{nat.purpose}</p>

              <div className="space-y-1.5 text-[11px] bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                <div className="text-neutral-700">
                  <strong className="text-neutral-900">Application:</strong> {nat.howToUse}
                </div>
                <div className="flex items-center gap-1.5 text-neutral-600 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{nat.frequency}</span>
                </div>
              </div>

              {nat.safetyNote && (
                <div className="text-[10px] text-amber-800 bg-amber-50/60 p-2 rounded-xl border border-amber-200/60 leading-relaxed">
                  <strong>Note:</strong> {nat.safetyNote}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chemical Treatment Categories */}
      {chemicalTreatments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
            <FlaskConical className="w-4 h-4 text-teal-600" />
            <span>Chemical Treatment Categories (Targeted IPM)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chemicalTreatments.map((chem) => (
              <div
                key={chem.id || chem.name}
                className="p-5 rounded-3xl bg-white border border-teal-950/10 shadow-xs space-y-3"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    Active Ingredient: {chem.activeIngredient}
                  </span>
                  <h4 className="text-sm font-bold text-teal-950 mt-1.5">{chem.name}</h4>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">{chem.purpose}</p>

                <div className="text-[11px] bg-neutral-50 p-3 rounded-2xl border border-neutral-100 text-neutral-700 leading-relaxed">
                  <strong className="text-neutral-900">Application:</strong> {chem.application}
                </div>

                <div className="text-[10px] text-rose-800 bg-rose-50/60 p-2.5 rounded-xl border border-rose-200/60 leading-relaxed flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Mandatory Precautions:</strong> {chem.precautions || 'Follow product label directions strictly and adhere to local agricultural guidelines.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
