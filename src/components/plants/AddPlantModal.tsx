'use client';

import React, { useState } from 'react';
import { X, Sprout, Upload, Sparkles, Check } from 'lucide-react';
import { usePlantContext } from '@/context/PlantContext';
import { Plant } from '@/types';

interface AddPlantModalProps {
  onClose: () => void;
}

export function AddPlantModal({ onClose }: AddPlantModalProps) {
  const { addPlant } = usePlantContext();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [type, setType] = useState('Vegetable');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('South Balcony Garden');
  const [potSize, setPotSize] = useState('12-inch Terracotta');
  const [sunlight, setSunlight] = useState<'Full Sun' | 'Partial Shade' | 'Bright Indirect' | 'Low Light'>('Full Sun');
  const [wateringFrequency, setWateringFrequency] = useState('Every 2 days');
  const [soilType, setSoilType] = useState('Well-draining potting soil with compost');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState('/images/plants/tomato-blight.jpg');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPlant({
      name,
      species: species || 'Cultivated specimen',
      type,
      plantingDate,
      location,
      potSize,
      sunlight,
      wateringFrequency,
      soilType,
      notes,
      image,
      healthScore: 88,
      status: 'healthy',
      lastScanDate: 'Just created',
      streakDays: 1
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-950/10 space-y-4 p-6 sm:p-7 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-emerald-950">
                Create New Plant Profile
              </h3>
              <p className="text-[11px] text-neutral-500">
                Enables ongoing daily disease surveillance and nutrition tracking.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Plant Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Roma Tomato, Sweet Basil"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Botanical Species (Latin name)
              </label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g., Solanum lycopersicum"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 italic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Plant Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 bg-white"
              >
                <option value="Vegetable">Vegetable</option>
                <option value="Fruit Tree">Fruit Tree</option>
                <option value="Indoor Foliage">Indoor Foliage</option>
                <option value="Flowering Shrub">Flowering Shrub</option>
                <option value="Herb / Medicinal">Herb / Medicinal</option>
                <option value="Succulent">Succulent</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Sunlight Needs
              </label>
              <select
                value={sunlight}
                onChange={(e) => setSunlight(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 bg-white"
              >
                <option value="Full Sun">Full Sun (6+ hrs)</option>
                <option value="Partial Shade">Partial Shade</option>
                <option value="Bright Indirect">Bright Indirect</option>
                <option value="Low Light">Low Light</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Planting Date
              </label>
              <input
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 bg-white"
              >
              </input>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Balcony, Patio"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Pot / Container Size
              </label>
              <input
                type="text"
                value={potSize}
                onChange={(e) => setPotSize(e.target.value)}
                placeholder="e.g., 12-inch terracotta"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Watering Frequency
              </label>
              <input
                type="text"
                value={wateringFrequency}
                onChange={(e) => setWateringFrequency(e.target.value)}
                placeholder="e.g., Every 2 days"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Soil Type & Substrate
            </label>
            <input
              type="text"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              placeholder="e.g., Chunky aroid mix, loamy compost blend"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Initial Notes / Known History
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Bought from nursery last week, pruned lower sucker stems..."
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 resize-none"
            />
          </div>

          {/* Quick Photo Selection */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1.5">
              Select Profile Photo
            </label>
            <div className="flex gap-2">
              {[
                { url: '/images/plants/tomato-blight.jpg', label: 'Tomato' },
                { url: '/images/plants/monstera-healthy.jpg', label: 'Monstera' },
                { url: '/images/plants/rose-mildew.jpg', label: 'Rose' }
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.url}
                  onClick={() => setImage(opt.url)}
                  className={`flex-1 p-1 rounded-xl border-2 transition-all ${
                    image === opt.url
                      ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={opt.url}
                    alt={opt.label}
                    className="w-full h-14 object-cover rounded-lg"
                  />
                  <span className="block text-[10px] text-center mt-1 font-semibold text-neutral-700">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-900/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Plant Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
