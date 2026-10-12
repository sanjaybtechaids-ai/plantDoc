'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlantContext } from '@/context/PlantContext';
import {
  BellRing,
  AlertTriangle,
  Flame,
  TrendingUp,
  Check,
  Trash2,
  Calendar,
  ExternalLink
} from 'lucide-react';

export default function AlertsPage() {
  const { alerts, markAlertRead, dismissAlert } = usePlantContext();
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'reminder' | 'improvement'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'all') return true;
    return a.type === filter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
          <BellRing className="w-4 h-4 text-emerald-600" />
          <span>Notification & Incident Desk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight mt-1">
          Plant Health Alerts
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Automated disease warnings, daily check-in reminders, and recovery milestone achievements.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-emerald-950/10 shadow-xs">
        {(['all', 'critical', 'warning', 'reminder', 'improvement'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filter === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-neutral-600 hover:text-emerald-950 hover:bg-emerald-50'
            }`}
          >
            {cat} ({cat === 'all' ? alerts.length : alerts.filter((a) => a.type === cat).length})
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const typeBadge = {
            critical: {
              border: 'border-rose-200 bg-rose-50/70',
              text: 'text-rose-950',
              badge: 'bg-rose-100 text-rose-800',
              icon: AlertTriangle,
              iconColor: 'text-rose-600'
            },
            warning: {
              border: 'border-amber-200 bg-amber-50/70',
              text: 'text-amber-950',
              badge: 'bg-amber-100 text-amber-800',
              icon: AlertTriangle,
              iconColor: 'text-amber-600'
            },
            reminder: {
              border: 'border-blue-200 bg-blue-50/70',
              text: 'text-blue-950',
              badge: 'bg-blue-100 text-blue-800',
              icon: Calendar,
              iconColor: 'text-blue-600'
            },
            improvement: {
              border: 'border-emerald-200 bg-emerald-50/70',
              text: 'text-emerald-950',
              badge: 'bg-emerald-100 text-emerald-800',
              icon: TrendingUp,
              iconColor: 'text-emerald-600'
            }
          }[alert.type];

          const IconComponent = typeBadge.icon;

          return (
            <div
              key={alert.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                typeBadge.border
              } ${alert.read ? 'opacity-70 bg-white border-neutral-200' : ''}`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                    alert.type === 'critical'
                      ? 'bg-rose-100'
                      : alert.type === 'warning'
                      ? 'bg-amber-100'
                      : alert.type === 'reminder'
                      ? 'bg-blue-100'
                      : 'bg-emerald-100'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${typeBadge.iconColor}`} />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${typeBadge.badge}`}>
                      {alert.type}
                    </span>
                    <span className="text-xs font-semibold text-neutral-800">
                      {alert.plantName}
                    </span>
                    <span className="text-[11px] text-neutral-400">• {alert.timestamp}</span>
                  </div>

                  <h3 className="font-extrabold text-sm text-neutral-900 leading-snug">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed max-w-xl">
                    {alert.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {alert.actionUrl && (
                  <Link
                    href={alert.actionUrl}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold border border-neutral-200 flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}

                {!alert.read && (
                  <button
                    onClick={() => markAlertRead(alert.id)}
                    className="p-2 rounded-xl text-emerald-800 hover:bg-emerald-100 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Dismiss notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200">
            <p className="text-xs text-neutral-400 font-medium">No alerts under this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
