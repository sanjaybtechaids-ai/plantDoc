'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Plant,
  Diagnosis,
  MonitoringEntry,
  AlertItem,
  UserSettings
} from '@/types';
import {
  INITIAL_PLANTS,
  TOMATO_DIAGNOSIS,
  TOMATO_MONITORING_HISTORY,
  INITIAL_ALERTS,
  INITIAL_SETTINGS
} from '@/data/mockData';
import {
  analyzePlantImage,
  PlantMetadataInput
} from '@/services/api';

interface PlantContextType {
  plants: Plant[];
  selectedPlant: Plant | null;
  setSelectedPlant: (plant: Plant | null) => void;
  diagnoses: Diagnosis[];
  latestDiagnosis: Diagnosis | null;
  setLatestDiagnosis: (diagnosis: Diagnosis | null) => void;
  monitoringEntries: MonitoringEntry[];
  addMonitoringEntry: (entry: Omit<MonitoringEntry, 'id'>) => void;
  alerts: AlertItem[];
  unreadAlertCount: number;
  markAlertRead: (id: string) => void;
  dismissAlert: (id: string) => void;
  addPlant: (plant: Omit<Plant, 'id'>) => Plant;
  updatePlant: (id: string, updates: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  scanPlant: (
    imageUrl: string,
    metadata?: PlantMetadataInput,
    onProgress?: (stepIndex: number, stepLabel: string) => void
  ) => Promise<Diagnosis>;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export function PlantProvider({ children }: { children: React.ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(INITIAL_PLANTS[0]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([TOMATO_DIAGNOSIS]);
  const [latestDiagnosis, setLatestDiagnosis] = useState<Diagnosis | null>(TOMATO_DIAGNOSIS);
  const [monitoringEntries, setMonitoringEntries] = useState<MonitoringEntry[]>(TOMATO_MONITORING_HISTORY);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [settings, setSettings] = useState<UserSettings>(INITIAL_SETTINGS);

  // Sync with backend API on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const plantsRes = await fetch('/api/plants');
        const plantsJson = await plantsRes.json();
        if (plantsJson.success && Array.isArray(plantsJson.data) && plantsJson.data.length > 0) {
          setPlants(plantsJson.data);
          setSelectedPlant(plantsJson.data[0]);
        }
      } catch (e) {
        console.warn('Backend sync initial check:', e);
      }
    }
    loadBackendData();
  }, []);

  // Sync monitoring when selected plant changes
  useEffect(() => {
    if (!selectedPlant?.id) return;
    async function loadMonitoring() {
      try {
        const res = await fetch(`/api/monitoring/${selectedPlant?.id}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setMonitoringEntries(json.data);
        }
      } catch (e) {
        console.warn('Monitoring sync error:', e);
      }
    }
    loadMonitoring();
  }, [selectedPlant?.id]);

  // Read unread alerts count
  const unreadAlertCount = alerts.filter(a => !a.read).length;

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const addPlant = (newPlantData: Omit<Plant, 'id'>): Plant => {
    const createdPlant: Plant = {
      ...newPlantData,
      id: `plant-${Date.now()}`
    };
    setPlants(prev => [createdPlant, ...prev]);
    setSelectedPlant(createdPlant);

    // Persist to backend API
    fetch('/api/plants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlantData)
    }).catch(err => console.warn('Could not persist plant to backend:', err));

    return createdPlant;
  };

  const updatePlant = (id: string, updates: Partial<Plant>) => {
    setPlants(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    if (selectedPlant?.id === id) {
      setSelectedPlant(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deletePlant = (id: string) => {
    setPlants(prev => prev.filter(p => p.id !== id));
    if (selectedPlant?.id === id) {
      setSelectedPlant(plants.find(p => p.id !== id) || null);
    }
  };

  const addMonitoringEntry = (entry: Omit<MonitoringEntry, 'id'>) => {
    const newEntry: MonitoringEntry = {
      ...entry,
      id: `mon-${Date.now()}`
    };
    setMonitoringEntries(prev => [...prev, newEntry]);

    // Update plant health score and last scan
    if (entry.plantId) {
      updatePlant(entry.plantId, {
        healthScore: entry.healthScore,
        lastScanDate: 'Today',
        streakDays: (selectedPlant?.streakDays || 1) + 1
      });
    }
  };

  const scanPlant = async (
    imageUrl: string,
    metadata?: PlantMetadataInput,
    onProgress?: (stepIndex: number, stepLabel: string) => void
  ): Promise<Diagnosis> => {
    const diagnosisResult = await analyzePlantImage(imageUrl, metadata, {
      onProgressStep: onProgress
    });

    setDiagnoses(prev => [diagnosisResult, ...prev]);
    setLatestDiagnosis(diagnosisResult);

    // If matches selected plant, update its health score
    if (selectedPlant) {
      updatePlant(selectedPlant.id, {
        healthScore: diagnosisResult.healthScore,
        lastScanDate: 'Just now',
        status: diagnosisResult.healthScore >= 80 ? 'healthy' : diagnosisResult.healthScore >= 50 ? 'attention' : 'critical',
        currentIssue: diagnosisResult.disease.name
      });
    }

    return diagnosisResult;
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <PlantContext.Provider
      value={{
        plants,
        selectedPlant,
        setSelectedPlant,
        diagnoses,
        latestDiagnosis,
        setLatestDiagnosis,
        monitoringEntries,
        addMonitoringEntry,
        alerts,
        unreadAlertCount,
        markAlertRead,
        dismissAlert,
        addPlant,
        updatePlant,
        deletePlant,
        scanPlant,
        settings,
        updateSettings
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}

export function usePlantContext() {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlantContext must be used within a PlantProvider');
  }
  return context;
}
