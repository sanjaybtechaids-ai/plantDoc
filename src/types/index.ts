export * from './plant';
export * from './diagnosis';
export * from './monitoring';
export * from './chat';

export interface AlertItem {
  id: string;
  plantId: string;
  plantName: string;
  type: 'critical' | 'warning' | 'reminder' | 'improvement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface UserSettings {
  userName: string;
  email: string;
  notificationsEnabled: boolean;
  dailyReminder: boolean;
  reminderTime: string;
  units: 'metric' | 'imperial';
  aiSensitivity: 'standard' | 'high' | 'expert';
  organicFirst: boolean;
  cameraResolution: '720p' | '1080p' | '4k';
  autoSaveScans: boolean;
}
