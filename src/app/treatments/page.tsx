'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Pill,
  Leaf,
  FlaskConical,
  AlertTriangle,
  ExternalLink,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Droplet
} from 'lucide-react';
import { DisclaimerBanner } from '@/components/common/DisclaimerBanner';
import { formatCurrency } from '@/lib/utils';

export default function TreatmentsPage() {
  const [treatmentType, setTreatmentType] = useState<'all' | 'organic' | 'chemical'>('all');

  // Interactive dilution calculator state
  const [dilutionWaterLiters, setDilutionWaterLiters] = useState(2);
  const [dosageRatePerLiter, setDosageRatePerLiter] = useState(5); // ml per liter (e.g. neem oil)

  const calculatedProductMl = dilutionWaterLiters * dosageRatePerLiter;

  const treatments = [
    {
      id: 'treat-01',
      name: 'Cold-Pressed Botanical Neem Oil (Azadirachtin)',
      category: 'organic',
      targetDiseases: ['Early Blight', 'Powdery Mildew', 'Spider Mites', 'Aphids'],
      howItWorks: 'Disrupts fungal spore cell membranes and deters chewing insect feeding behavior.',
      dosage: '5 ml neem oil + 2 ml organic surfactant soap per 1 liter water.',
      frequency: 'Every 5 to 7 days during active infestation.',
      safetyCaution: 'Do not spray under harsh direct afternoon sunlight to prevent foliar lens scorch.',
      price: 299,
      demoLink: 'https://example.com/products/organic-neem-oil'
    },
    {
      id: 'treat-02',
      name: 'Trichoderma Harzianum Bio-Inoculant',
      category: 'organic',
      targetDiseases: ['Root Rot', 'Fusarium Wilt', 'Damping Off', 'Rhizoctonia'],
      howItWorks: 'Beneficial antagonist fungus that physically parasitizes and outcompetes pathogenic root fungi.',
      dosage: '10g powder per 5 liters water as a root soil drench.',
      frequency: 'Every 14 to 21 days during growth season.',
      safetyCaution: 'Organic biological inoculant. Safe for pollinators, bees, and earthworms.',
      price: 320,
      demoLink: 'https://example.com/products/trichoderma-bio-fungus'
    },
    {
      id: 'treat-03',
      name: 'Potassium Bicarbonate Eco-Fungicide',
      category: 'organic',
      targetDiseases: ['Powdery Mildew', 'Black Spot', 'Leaf Blight'],
      howItWorks: 'Shifts foliar surface pH to alkaline (pH 8.5+), rapidly desiccating fungal mycelium.',
      dosage: '4g per 1 liter water with 1 drop spreader-sticker.',
      frequency: 'Once weekly following rain or humid spells.',
      safetyCaution: 'Spot test on 1 leaf 24 hours prior to full spray.',
      price: 180,
      demoLink: 'https://example.com/products/bio-fertilizer'
    },
    {
      id: 'treat-04',
      name: 'Copper Octanoate (Copper Soap Fungicide)',
      category: 'chemical',
      targetDiseases: ['Late Blight', 'Early Blight', 'Anthracnose', 'Bacterial Spot'],
      howItWorks: 'Denatures fungal and bacterial respiratory enzymes on plant surfaces.',
      dosage: '10 ml liquid concentrate per 1 liter water.',
      frequency: 'Every 7 to 10 days before forecasted rain.',
      safetyCaution: 'Wear goggles and nitrile gloves. Observe 24-hour pre-harvest interval.',
      price: 380,
      demoLink: 'https://example.com/products/copper-fungicide'
    },
    {
      id: 'treat-05',
      name: 'Chlorothalonil 75% WP Broad Spectrum',
      category: 'chemical',
      targetDiseases: ['Leaf Blights', 'Stem Rust', 'Fruit Rot'],
      howItWorks: 'Multi-site contact protectant that prevents spore germination.',
      dosage: '1.5 g powder per 1 liter water.',
      frequency: 'Maximum 3 applications per agricultural season.',
      safetyCaution: 'Toxic to aquatic organisms. Do not spray near open water bodies or during bee forage hours.',
      price: 420,
      demoLink: 'https://example.com/products/copper-fungicide'
    }
  ];

  const filtered = treatments.filter((t) => {
    if (treatmentType === 'all') return true;
    return t.category === treatmentType;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
          <Pill className="w-4 h-4 text-emerald-600" />
          <span>Botanical Therapeutics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight mt-1">
          Treatment Protocols & Safety
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Evidence-based organic bio-pesticides, cultural sanitary procedures, and controlled chemical interventions.
        </p>
      </div>

      {/* Mandatory Safety Notice */}
      <DisclaimerBanner variant="full" />

      {/* Dilution Calculator Widget */}
      <div className="p-6 rounded-3xl bg-emerald-900 text-white shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-300" />
          <h3 className="font-bold text-base text-white">
            Interactive Spray Dilution & Dosage Calculator
          </h3>
        </div>
        <p className="text-xs text-emerald-200/80 leading-relaxed max-w-2xl">
          Quickly compute the exact active ingredient concentration needed for your spray tank volume without accidental leaf-burning overdose.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-emerald-950/70 p-3.5 rounded-2xl border border-emerald-800/60 space-y-1.5">
            <label className="text-[11px] font-semibold text-emerald-300">
              Sprayer Tank Water Volume (Liters)
            </label>
            <input
              type="number"
              min={0.5}
              max={20}
              step={0.5}
              value={dilutionWaterLiters}
              onChange={(e) => setDilutionWaterLiters(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-emerald-700/60 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-bold"
            />
          </div>

          <div className="bg-emerald-950/70 p-3.5 rounded-2xl border border-emerald-800/60 space-y-1.5">
            <label className="text-[11px] font-semibold text-emerald-300">
              Prescribed Rate (ml or g per Liter)
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={dosageRatePerLiter}
              onChange={(e) => setDosageRatePerLiter(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-emerald-700/60 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-bold"
            />
          </div>

          <div className="bg-emerald-800/80 p-3.5 rounded-2xl border border-emerald-700 flex flex-col justify-center items-center text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
              Exact Measure Needed
            </span>
            <div className="text-2xl font-black text-emerald-100 mt-1">
              {calculatedProductMl} ml / grams
            </div>
            <span className="text-[10px] text-emerald-300 mt-0.5">
              Mix with {dilutionWaterLiters}L lukewarm water
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-emerald-950/10 shadow-xs max-w-md">
        <button
          onClick={() => setTreatmentType('all')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
            treatmentType === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-neutral-600 hover:text-emerald-950'
          }`}
        >
          All Formulations ({treatments.length})
        </button>

        <button
          onClick={() => setTreatmentType('organic')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors ${
            treatmentType === 'organic'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-neutral-600 hover:text-emerald-950'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>Organic</span>
        </button>

        <button
          onClick={() => setTreatmentType('chemical')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors ${
            treatmentType === 'chemical'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-neutral-600 hover:text-emerald-950'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
          <span>Chemical</span>
        </button>
      </div>

      {/* Treatments Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-950/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    item.category === 'organic'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {item.category}
                </span>

                <span className="font-bold text-xs text-neutral-800">
                  {formatCurrency(item.price)}
                </span>
              </div>

              <h3 className="font-bold text-sm text-emerald-950 leading-snug">
                {item.name}
              </h3>

              <div className="flex flex-wrap gap-1">
                {item.targetDiseases.map((d, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {item.howItWorks}
              </p>

              <div className="space-y-1.5 text-[11px] pt-2 border-t border-neutral-100 text-neutral-600">
                <p>
                  <strong className="text-neutral-800">Dosage:</strong> {item.dosage}
                </p>
                <p>
                  <strong className="text-neutral-800">Frequency:</strong> {item.frequency}
                </p>
                <div
                  className={`p-2.5 rounded-xl text-[10px] leading-relaxed ${
                    item.category === 'organic'
                      ? 'bg-emerald-50 text-emerald-900'
                      : 'bg-rose-50 text-rose-900'
                  }`}
                >
                  <strong>Safety:</strong> {item.safetyCaution}
                </div>
              </div>
            </div>

            <a
              href={item.demoLink}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Product Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
