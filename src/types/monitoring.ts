export type MonitoringStatus = 'improving' | 'stable' | 'declining' | 'uncertain';

export interface MonitoringEntry {
  id: string;
  plantId: string;
  dayLabel: string;
  date: string;
  imageUrl: string;
  healthScore: number;
  previousScore: number;
  change: number;
  status: MonitoringStatus;
  symptoms: string[];
  treatmentUsed: string;
  aiNotes: string;
  createdAt?: string;
}

export interface ImageComparisonResult {
  previousHealthScore: number;
  currentHealthScore: number;
  change: number;
  status: MonitoringStatus;
  resolvedSymptoms: string[];
  newSymptoms: string[];
  persistentSymptoms: string[];
  summary: string;
  recommendation: string;
  nextCheckHours?: number;
}

export interface MonitoringReminder {
  id?: string;
  plantId: string;
  userId?: string;
  reminderTime: string;
  timezone: string;
  enabled: boolean;
  lastRemindedAt?: string;
}
