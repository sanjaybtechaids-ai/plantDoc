import {
  Diagnosis,
  Plant,
  MonitoringEntry,
  ChatMessage,
  Product,
  ImageComparisonResult,
  TreatmentPlan,
  FertilizerRecommendation,
  PlantMetadataInput
} from '@/types';

/**
 * Standard API error extractor
 */
async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || json.success === false) {
    const errorMsg = json?.error?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return json.data as T;
}

/**
 * 1. POST /api/plants/analyze
 * Analyzes plant image using Gemini Vision and Supabase backend.
 */
export async function analyzePlant(
  image: string | Blob | File,
  metadata?: PlantMetadataInput,
  options?: { onProgressStep?: (stepIndex: number, stepLabel: string) => void }
): Promise<Diagnosis> {
  const steps = [
    'Image received & validated',
    'Uploading image to secure storage',
    'Gemini Optical Agronomy analyzing tissue pathology',
    'Classifying disease and estimating health score',
    'Curating IPM treatment and nutrition recommendations'
  ];

  if (options?.onProgressStep) {
    options.onProgressStep(0, steps[0]);
  }

  const formData = new FormData();

  if (typeof image !== 'string') {
    formData.append('image', image);
  } else {
    // If base64 data string
    formData.append('image', image);
  }

  if (metadata?.name) formData.append('plantName', metadata.name);
  if (metadata?.species) formData.append('species', metadata.species);
  if (metadata?.symptoms) formData.append('symptoms', metadata.symptoms);
  if (metadata?.plantId) formData.append('plantId', metadata.plantId);

  // Micro progress indicator ticks for rich UX
  let stepIdx = 1;
  const progressInterval = setInterval(() => {
    if (stepIdx < steps.length - 1 && options?.onProgressStep) {
      options.onProgressStep(stepIdx, steps[stepIdx]);
      stepIdx++;
    }
  }, 900);

  try {
    const res = await fetch('/api/plants/analyze', {
      method: 'POST',
      body: formData
    });

    clearInterval(progressInterval);

    if (options?.onProgressStep) {
      options.onProgressStep(steps.length - 1, steps[steps.length - 1]);
    }

    const diagnosis = await handleResponse<Diagnosis>(res);
    return diagnosis;
  } catch (error) {
    clearInterval(progressInterval);
    throw error;
  }
}

/**
 * 2. POST /api/chat
 * Sends message and optional image attachment to Plant Doctor AI chatbot.
 */
export async function sendChatMessage(
  message: string,
  imageAttachment?: string,
  plantId?: string
): Promise<ChatMessage> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      image: imageAttachment,
      plantId
    })
  });

  return handleResponse<ChatMessage>(res);
}

/**
 * 3. POST /api/plants
 * Creates a new plant entry in the user's garden.
 */
export async function createPlant(plant: Partial<Plant>): Promise<Plant> {
  const res = await fetch('/api/plants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: plant.name,
      species: plant.species,
      plantingDate: plant.plantingDate,
      location: plant.location,
      potSize: plant.potSize,
      sunlight: plant.sunlight,
      wateringFrequency: plant.wateringFrequency,
      soilType: plant.soilType,
      notes: plant.notes,
      imageUrl: plant.image || plant.imageUrl
    })
  });

  return handleResponse<Plant>(res);
}

/**
 * 4. GET /api/plants
 * Retrieves all plants belonging to the user.
 */
export async function getPlants(): Promise<Plant[]> {
  const res = await fetch('/api/plants');
  return handleResponse<Plant[]>(res);
}

/**
 * 5. GET /api/plants/[id]
 * Retrieves single plant details.
 */
export async function getPlant(id: string): Promise<Plant> {
  const res = await fetch(`/api/plants/${id}`);
  return handleResponse<Plant>(res);
}

/**
 * 6. GET /api/diagnosis/[id]
 * Retrieves past diagnosis report.
 */
export async function getDiagnosis(id: string): Promise<Diagnosis> {
  const res = await fetch(`/api/diagnosis/${id}`);
  return handleResponse<Diagnosis>(res);
}

/**
 * 7. GET /api/monitoring/[plantId]
 * Retrieves full longitudinal monitoring history for a plant.
 */
export async function getMonitoringHistory(plantId: string): Promise<MonitoringEntry[]> {
  const res = await fetch(`/api/monitoring/${plantId}`);
  return handleResponse<MonitoringEntry[]>(res);
}

/**
 * 8. POST /api/monitoring/[plantId]/upload
 * Uploads today's check-in photo and calculates health score delta.
 */
export async function uploadMonitoringImage(
  plantId: string,
  image: string | Blob | File,
  notes?: string
): Promise<{
  entry: MonitoringEntry;
  comparison: ImageComparisonResult;
  healthScore: number;
  change: number;
  status: string;
}> {
  const formData = new FormData();
  if (typeof image !== 'string') {
    formData.append('image', image);
  } else {
    formData.append('image', image);
  }
  if (notes) formData.append('notes', notes);

  const res = await fetch(`/api/monitoring/${plantId}/upload`, {
    method: 'POST',
    body: formData
  });

  return handleResponse(res);
}

/**
 * 9. POST /api/monitoring/[plantId]/compare
 * Compares two plant images sequentially.
 */
export async function comparePlant(
  plantId: string,
  previousImage: string,
  currentImage: string,
  previousHealthScore = 68
): Promise<ImageComparisonResult> {
  const res = await fetch(`/api/monitoring/${plantId}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      previousImage,
      currentImage,
      previousHealthScore
    })
  });

  return handleResponse<ImageComparisonResult>(res);
}

/**
 * 10. POST /api/treatments/recommend
 */
export async function getTreatments(
  diagnosis: string,
  severity = 'moderate',
  species?: string
): Promise<TreatmentPlan> {
  const res = await fetch('/api/treatments/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      diagnosis,
      severity,
      species
    })
  });

  return handleResponse<TreatmentPlan>(res);
}

/**
 * 11. POST /api/fertilizers/recommend
 */
export async function getFertilizers(
  plantType?: string,
  species?: string,
  diagnosis?: string
): Promise<FertilizerRecommendation> {
  const res = await fetch('/api/fertilizers/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plantType,
      species,
      diagnosis
    })
  });

  return handleResponse<FertilizerRecommendation>(res);
}

/**
 * 12. GET /api/products/recommendations
 */
export async function getProducts(category?: string, diagnosis?: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (diagnosis) params.set('diagnosis', diagnosis);

  const res = await fetch(`/api/products/recommendations?${params.toString()}`);
  return handleResponse<Product[]>(res);
}
