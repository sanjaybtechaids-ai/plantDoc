'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Scan,
  Sprout,
  Activity,
  History,
  Pill,
  ShoppingBag,
  MessageSquareText,
  BellRing,
  Settings,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { usePlantContext } from '@/context/PlantContext';

export function Sidebar() {
  const pathname = usePathname();
  const { unreadAlertCount, plants, selectedPlant } = usePlantContext();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      label: 'Plant Scanner',
      href: '/scan',
      icon: Scan,
      highlight: true
    },
    {
      label: 'AI Plant Doctor Chat',
      href: '/chat',
      icon: MessageSquareText,
      badge: 'AI'
    },
    {
      label: 'My Plants',
      href: '/plants',
      icon: Sprout,
      badge: plants.length.toString()
    },
    {
      label: 'Daily Monitoring',
      href: '/monitoring',
      icon: Activity,
      badge: 'Daily'
    },
    {
      label: 'Diagnosis History',
      href: '/diagnosis',
      icon: History,
      badge: null
    },
    {
      label: 'Treatment Guides',
      href: '/treatments',
      icon: Pill,
      badge: null
    },
    {
      label: 'Products & Nutrition',
      href: '/products',
      icon: ShoppingBag,
      badge: null
    },
    {
      label: 'Plant Alerts',
      href: '/alerts',
      icon: BellRing,
      badge: unreadAlertCount > 0 ? unreadAlertCount.toString() : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white/90 border-r border-emerald-950/10 min-h-[calc(100vh-53px)] p-4 shrink-0 justify-between">
      <div className="space-y-6">
        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-900/15'
                    : item.highlight
                    ? 'text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/50'
                    : 'text-neutral-700 hover:text-emerald-950 hover:bg-emerald-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-emerald-700'
                        : 'text-neutral-500 group-hover:text-emerald-700'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor ||
                      (isActive
                        ? 'bg-emerald-800 text-white'
                        : 'bg-emerald-100 text-emerald-800')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Streak and Care Summary Card */}
      <div className="mt-6 pt-4 border-t border-emerald-950/10 space-y-3">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Monitoring Streak
            </span>
            <span className="text-xs font-bold text-emerald-100">
              {selectedPlant?.streakDays || 14} Days
            </span>
          </div>
          <p className="text-[11px] text-emerald-200/80 mt-1.5 leading-relaxed">
            Active plant: <span className="font-semibold text-white">{selectedPlant?.name || 'Roma Tomato'}</span>
          </p>
          <div className="mt-2.5 pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[10px] text-emerald-300/80">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              AI Sentinel Active
            </span>
            <span>Score: {selectedPlant?.healthScore || 72}%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
