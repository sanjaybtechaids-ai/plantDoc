export type PlantStatus = 'healthy' | 'attention' | 'critical';
export type SunlightType = 'Full Sun' | 'Partial Shade' | 'Bright Indirect' | 'Low Light';

export interface Plant {
  id: string;
  userId?: string;
  name: string;
  species: string;
  type?: string;
  plantingDate?: string;
  location?: string;
  potSize?: string;
  sunlight?: SunlightType;
  wateringFrequency?: string;
  soilType?: string;
  notes?: string;
  image?: string;
  imageUrl?: string;
  healthScore: number;
  status: PlantStatus;
  lastScanDate?: string;
  streakDays?: number;
  currentIssue?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlantMetadataInput {
  name?: string;
  type?: string;
  species?: string;
  location?: string;
  age?: string;
  symptoms?: string;
  plantId?: string;
}
