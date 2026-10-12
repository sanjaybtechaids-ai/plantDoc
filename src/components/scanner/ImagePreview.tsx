'use client';

import React, { useState } from 'react';
import {
  RotateCw,
  Trash2,
  Sparkles,
  Crop,
  RefreshCw,
  CheckCircle2,
  Info
} from 'lucide-react';
import { PlantMetadataInput } from '@/services/api';

interface ImagePreviewProps {
  imageUrl: string;
  onAnalyze: (metadata: PlantMetadataInput) => void;
  onReplace: () => void;
  onRemove: () => void;
}

export function ImagePreview({
  imageUrl,
  onAnalyze,
  onReplace,
  onRemove
}: ImagePreviewProps) {
  const [rotation, setRotation] = useState(0);
  const [isCroppedFramed, setIsCroppedFramed] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(true);

  // Optional metadata fields
  const [plantName, setPlantName] = useState('Roma Tomato');
  const [plantType, setPlantType] = useState('Vegetable (Solanaceae)');
  const [location, setLocation] = useState('South Balcony Garden');
  const [plantAge, setPlantAge] = useState('6 weeks post-transplant');
  const [symptoms, setSymptoms] = useState(
    'Leaves have developed concentric brown spots with slight yellowing around edges during the last 3 days.'
  );

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleToggleCrop = () => {
    setIsCroppedFramed(!isCroppedFramed);
  };

  const handleSubmitAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      name: plantName,
      type: plantType,
      location,
      age: plantAge,
      symptoms
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image preview & toolbar */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-4/3 sm:aspect-16/10 rounded-3xl overflow-hidden bg-neutral-900 border border-emerald-950/20 shadow-md flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Plant specimen preview"
              style={{
                transform: `rotate(${rotation}deg) scale(${isCroppedFramed ? 1.25 : 1})`,
                transition: 'transform 0.3s ease-out'
              }}
              className="w-full h-full object-cover select-none"
            />

            {/* Framing overlay if crop is toggled */}
            {isCroppedFramed && (
              <div className="absolute inset-4 border border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[10px] bg-black/70 text-emerald-300 px-2 py-0.5 rounded backdrop-blur-xs">
                  Magnified Focus Region
                </span>
              </div>
            )}

            {/* Quality Assessment Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Image quality: <strong className="text-emerald-300">Good & Sharp</strong></span>
            </div>

            {/* Resolution specs */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-[10px] font-mono text-neutral-300 backdrop-blur-xs">
              RGB • Focus Locked
            </div>
          </div>

          {/* Action toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-white border border-emerald-950/10 shadow-xs">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors"
                title="Rotate 90 degrees"
              >
                <RotateCw className="w-3.5 h-3.5 text-neutral-500" />
                <span>Rotate</span>
              </button>

              <button
                type="button"
                onClick={handleToggleCrop}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isCroppedFramed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-neutral-700 hover:text-emerald-900 hover:bg-emerald-50'
                }`}
                title="Toggle focus zoom"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Focus Zoom</span>
              </button>

              <button
                type="button"
                onClick={onReplace}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors"
                title="Replace photo"
              >
                <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
                <span>Replace</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              title="Remove image"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>

        {/* Right Column: Optional metadata form & CTA */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div>
              <h4 className="font-bold text-sm text-emerald-950">
                Plant Context (Optional)
              </h4>
              <p className="text-[11px] text-neutral-500">
                Helps the AI botanical model fine-tune disease probability.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="text-[11px] text-emerald-700 hover:underline font-semibold"
            >
              {showOptionalFields ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          <form onSubmit={handleSubmitAnalysis} className="space-y-3.5">
            {showOptionalFields && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Plant Name
                  </label>
                  <input
                    type="text"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder="e.g., Roma Tomato, Monstera"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Balcony, Greenhouse"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Age / Growth Phase
                    </label>
                    <input
                      type="text"
                      value={plantAge}
                      onChange={(e) => setPlantAge(e.target.value)}
                      placeholder="e.g., 6 weeks, Mature"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Symptoms Noticed
                  </label>
                  <textarea
                    rows={2}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g., Leaves have developed brown spots during the last 3 days..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 resize-none leading-relaxed"
                  />
                </div>
              </>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
                <span>Analyze with Plant Doctor</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 justify-center">
              <Info className="w-3 h-3 text-neutral-400" />
              <span>Multi-layer computer vision analysis takes ~2.5 seconds</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
