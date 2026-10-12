'use client';

import React, { useState } from 'react';
import { usePlantContext } from '@/context/PlantContext';
import {
  Settings,
  Bell,
  Clock,
  Shield,
  Sliders,
  Sparkles,
  Download,
  RotateCcw,
  Check,
  User,
  Leaf
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings } = usePlantContext();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
    triggerSaveBanner();
  };

  const handleSelect = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
    triggerSaveBanner();
  };

  const triggerSaveBanner = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'plant_doctor_settings_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>Preferences & System Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight mt-1">
            Application Settings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Configure daily monitoring schedules, AI sensitivity, and notification delivery.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>Saved!</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* User Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <User className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-emerald-950">Botanist Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Full Name</label>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) => {
                  updateSettings({ userName: e.target.value });
                  triggerSaveBanner();
                }}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => {
                  updateSettings({ email: e.target.value });
                  triggerSaveBanner();
                }}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>
          </div>
        </div>

        {/* Daily Monitoring Reminders */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Bell className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-emerald-950">
              Surveillance & Reminder Notifications
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-neutral-900">Enable Daily Photo Reminders</p>
                <p className="text-neutral-500 text-[11px]">
                  Receive notification alerts to upload angle-matched follow-up photos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('dailyReminder')}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.dailyReminder ? 'bg-emerald-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                    settings.dailyReminder ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <div>
                <p className="font-bold text-neutral-900">Daily Reminder Time</p>
                <p className="text-neutral-500 text-[11px]">
                  Optimal time to inspect outdoor and balcony foliage.
                </p>
              </div>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => handleSelect('reminderTime', e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 focus:outline-none text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* AI Model Analysis Settings */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-emerald-950">
              AI Vision & Diagnostic Calibration
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-neutral-900">Organic & Bio-Remedy First Bias</p>
                <p className="text-neutral-500 text-[11px]">
                  Prioritize neem, trichoderma, and biological agents before displaying chemicals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('organicFirst')}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.organicFirst ? 'bg-emerald-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                    settings.organicFirst ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <div>
                <p className="font-bold text-neutral-900">AI Pathology Sensitivity Mode</p>
                <p className="text-neutral-500 text-[11px]">
                  Controls lesion segmentation threshold stringency.
                </p>
              </div>
              <select
                value={settings.aiSensitivity}
                onChange={(e) => handleSelect('aiSensitivity', e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 focus:outline-none bg-white text-xs font-semibold"
              >
                <option value="standard">Standard (Balanced)</option>
                <option value="high">High Sensitivity (Early Flecks)</option>
                <option value="expert">Expert Agronomic (Deep RAG)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <div>
                <p className="font-bold text-neutral-900">Measurement Units</p>
                <p className="text-neutral-500 text-[11px]">
                  For tank water volumes, dosage calculations, and temperature.
                </p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl">
                <button
                  onClick={() => handleSelect('units', 'metric')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    settings.units === 'metric'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Metric (ml / °C)
                </button>
                <button
                  onClick={() => handleSelect('units', 'imperial')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    settings.units === 'imperial'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Imperial (oz / °F)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management & Compliance */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Shield className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-emerald-950">Data & Security</h3>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-neutral-900">Export Diagnostic History & Plants</p>
              <p className="text-neutral-500 text-[11px]">
                Download a complete JSON record for offline botanical records.
              </p>
            </div>

            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
