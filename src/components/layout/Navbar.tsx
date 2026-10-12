'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sprout,
  Scan,
  Bell,
  Search,
  Check,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  X
} from 'lucide-react';
import { usePlantContext } from '@/context/PlantContext';

export function Navbar() {
  const router = useRouter();
  const {
    plants,
    selectedPlant,
    setSelectedPlant,
    alerts,
    unreadAlertCount,
    markAlertRead
  } = usePlantContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-950/10 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-emerald-950 flex items-center gap-1.5">
                Plant Doctor
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wider">
                  AI
                </span>
              </span>
              <span className="text-[11px] text-emerald-700/80 font-medium hidden sm:inline">
                Clinical Botany & Care
              </span>
            </div>
          </Link>

          {/* Plant Selector Dropdown */}
          <div className="relative ml-2 sm:ml-4 hidden md:block">
            <button
              onClick={() => setShowPlantDropdown(!showPlantDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200/70 rounded-lg transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-w-[120px] truncate">
                {selectedPlant ? selectedPlant.name : 'Select Plant'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
            </button>

            {showPlantDropdown && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white border border-emerald-100 rounded-xl shadow-xl shadow-emerald-950/5 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowPlantDropdown(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-semibold text-emerald-600/90 uppercase tracking-wider">
                  Active Monitored Plants
                </div>
                {plants.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-emerald-50/80 text-emerald-950 transition-colors"
                  >
                    <span className="font-medium truncate">{plant.name}</span>
                    {selectedPlant?.id === plant.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
                <div className="border-t border-emerald-50 mt-1 pt-1">
                  <Link
                    href="/plants"
                    className="flex items-center px-3 py-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-medium"
                  >
                    + Manage All Plants
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-md hidden lg:flex items-center relative"
        >
          <Search className="w-4 h-4 text-emerald-600/70 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search symptoms (e.g., yellow spots, neem oil, blight)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-20 py-2 text-xs rounded-full border border-emerald-900/15 bg-emerald-50/30 hover:bg-emerald-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-emerald-950 placeholder-emerald-800/40 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-2.5 py-1 text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-full transition-colors flex items-center gap-1 shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-emerald-200" />
            Ask AI
          </button>
        </form>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Scan Primary CTA */}
          <Link
            href="/scan"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-semibold shadow-sm shadow-emerald-900/20 transition-all"
          >
            <Scan className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">Scan Plant</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
              className="relative p-2 rounded-lg text-emerald-800/80 hover:text-emerald-950 hover:bg-emerald-50 border border-emerald-900/10 transition-colors focus:outline-none"
              title="Alerts and Reminders"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {showAlertsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-emerald-100 rounded-2xl shadow-xl shadow-emerald-950/10 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-50">
                  <span className="font-semibold text-xs text-emerald-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Plant Health Alerts
                  </span>
                  <Link
                    href="/alerts"
                    onClick={() => setShowAlertsDropdown(false)}
                    className="text-[11px] text-emerald-700 hover:underline font-medium"
                  >
                    View All ({alerts.length})
                  </Link>
                </div>

                <div className="divide-y divide-emerald-50 max-h-72 overflow-y-auto mt-1">
                  {alerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      className={`py-2 px-1 text-xs hover:bg-emerald-50/50 rounded-lg transition-colors ${
                        !alert.read ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-emerald-950 text-[12px]">
                            {alert.title}
                          </p>
                          <p className="text-[11px] text-emerald-800/80 mt-0.5 line-clamp-2 leading-relaxed">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-emerald-600/70">
                            <span>{alert.plantName}</span>
                            <span>•</span>
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                        {!alert.read && (
                          <button
                            onClick={() => markAlertRead(alert.id)}
                            className="p-1 text-emerald-600 hover:text-emerald-900"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <Link
            href="/settings"
            className="flex items-center gap-2 pl-1 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-300 flex items-center justify-center text-xs font-bold text-emerald-900 group-hover:ring-2 group-hover:ring-emerald-600/40 transition-all">
              SL
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-emerald-950 leading-tight">
                Dr. Sarah Lin
              </span>
              <span className="text-[10px] text-emerald-700/80">Botanist</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
