export type SeverityLevel = 'healthy' | 'mild' | 'moderate' | 'severe' | 'critical';
export type CertaintyLevel = 'confirmed' | 'likely' | 'possible' | 'uncertain';

export interface AffectedArea {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  radius: number; // percentage
  severity: 'mild' | 'moderate' | 'severe';
  label: string;
  description?: string;
  relativePosition?: string;
}

export interface Disease {
  id: string;
  name: string;
  scientificName: string;
  severity: 'mild' | 'moderate' | 'severe';
  confidence: number;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  affectedPlantTypes: string[];
  description: string;
}

export interface NaturalTreatment {
  id: string;
  name: string;
  purpose: string;
  howToUse: string;
  frequency: string;
  safetyNote: string;
  productLink?: string;
  image?: string;
  price: number;
}

export interface ChemicalTreatment {
  id: string;
  name: string;
  activeIngredient: string;
  purpose: string;
  application: string;
  precautions: string;
  productLink?: string;
  price: number;
}

export interface TreatmentPlan {
  immediateActions: string[];
  naturalTreatments: NaturalTreatment[];
  chemicalTreatments: ChemicalTreatment[];
  prevention?: string[];
  careInstructions?: string;
}

export interface NutrientLevel {
  nitrogen: 'deficient' | 'adequate' | 'excess';
  phosphorus: 'deficient' | 'adequate' | 'excess';
  potassium: 'deficient' | 'adequate' | 'excess';
  micronutrients: 'low' | 'balanced' | 'high';
}

export interface FertilizerRecommendation {
  nutrientLevels?: NutrientLevel;
  recommendedFertilizer: {
    name: string;
    type: string;
    npk: string;
    purpose: string;
    applicationRate: string;
    productLink?: string;
    price: number;
    image?: string;
    organicAlternatives?: string[];
    warnings?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  category: 'Fungicide' | 'Organic Pesticide' | 'Fertilizer' | 'Soil & Care' | 'Equipment';
  rating: number;
  reviewsCount?: number;
  price: number;
  originalPrice?: number;
  whyRecommended?: string;
  demoUrl?: string;
  image?: string;
  imageUrl?: string;
  inStock?: boolean;
  purchaseUrl?: string | null;
  brand?: string;
  currency?: string;
}

export interface Diagnosis {
  id: string;
  plantId?: string;
  plantName: string;
  species?: string;
  date: string;
  imageUrl: string;
  plantIdentified: string;
  identificationConfidence: number;
  healthScore: number;
  disease: Disease;
  treatment: TreatmentPlan;
  fertilizer: FertilizerRecommendation;
  products: Product[];
  affectedAreas: AffectedArea[];
  userNotes?: string;
  symptomsObserved?: string;
  summary?: string;
  warnings?: string[];
  professionalAdvice?: string;
  aiModel?: string;
  createdAt?: string;
}
