'use client';

import React, { useState } from 'react';
import { usePlantContext } from '@/context/PlantContext';
import { PlantCard } from '@/components/plants/PlantCard';
import { AddPlantModal } from '@/components/plants/AddPlantModal';
import { Sprout, Plus, Filter, LayoutGrid, List } from 'lucide-react';

export default function PlantsPage() {
  const { plants } = usePlantContext();
  const [filter, setFilter] = useState<'all' | 'healthy' | 'attention' | 'critical'>('all');
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);

  const filteredPlants = plants.filter((plant) => {
    if (filter === 'all') return true;
    return plant.status === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            My Plants Collection
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage your monitored botanical specimens, track recovery milestones, and schedule scans.
          </p>
        </div>

        <button
          onClick={() => setIsAddPlantOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm shadow-emerald-900/20 active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plant</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white rounded-2xl border border-emerald-950/10 shadow-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            All Plants ({plants.length})
          </button>

          <button
            onClick={() => setFilter('healthy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'healthy'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            Healthy ({plants.filter(p => p.status === 'healthy').length})
          </button>

          <button
            onClick={() => setFilter('attention')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'attention'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            Needs Attention ({plants.filter(p => p.status === 'attention').length})
          </button>

          <button
            onClick={() => setFilter('critical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'critical'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            Critical ({plants.filter(p => p.status === 'critical').length})
          </button>
        </div>

        <span className="text-xs text-neutral-400 font-medium px-2">
          Showing {filteredPlants.length} specimen{filteredPlants.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Plant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200 space-y-3">
          <Sprout className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="font-bold text-sm text-neutral-700">No plants match this filter</h3>
          <p className="text-xs text-neutral-400">Try selecting another filter or add a new plant.</p>
        </div>
      )}

      {/* Add Plant Modal */}
      {isAddPlantOpen && (
        <AddPlantModal onClose={() => setIsAddPlantOpen(false)} />
      )}
    </div>
  );
}
