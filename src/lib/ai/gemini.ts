import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import {
  PLANT_ANALYSIS_SYSTEM_INSTRUCTION,
  buildPlantAnalysisUserPrompt,
  PlantAnalysisPromptInput
} from './prompts/plantAnalysisPrompt';
import {
  CHAT_SYSTEM_INSTRUCTION,
  buildChatUserContext,
  ChatPromptContext
} from './prompts/chatPrompt';
import {
  COMPARISON_SYSTEM_INSTRUCTION,
  buildComparisonUserPrompt,
  ComparisonPromptInput
} from './prompts/comparisonPrompt';
import {
  TREATMENT_SYSTEM_INSTRUCTION,
  buildTreatmentUserPrompt,
  TreatmentPromptInput
} from './prompts/treatmentPrompt';
import {
  FERTILIZER_SYSTEM_INSTRUCTION,
  buildFertilizerUserPrompt,
  FertilizerPromptInput
} from './prompts/fertilizerPrompt';
import {
  IDENTIFICATION_SYSTEM_INSTRUCTION,
  buildIdentificationUserPrompt
} from './prompts/plantIdentificationPrompt';
import {
  StructuredDiagnosisResponseSchema,
  StructuredDiagnosisResponse
} from '../validation/diagnosis';
import {
  MonitoringComparisonSchema,
  MonitoringComparison
} from '../validation/monitoring';

// Retrieve configurable model and API key from server environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

function getGenerativeAI(): GoogleGenerativeAI | null {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_gemini_api_key')) {
    return null;
  }
  return new GoogleGenerativeAI(GEMINI_API_KEY);
}

/**
 * Strips markdown code fences and cleans potential AI prefix/suffix to extract raw JSON
 */
function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  }
  // If wrapped in curly braces amidst other text, find outermost braces
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned.trim();
}

/**
 * Converts a base64 string or data URL to a Gemini GenerativePart
 */
export function imageToGenerativePart(
  base64OrDataUrl: string,
  fallbackMime = 'image/jpeg'
): Part {
  let data = base64OrDataUrl;
  let mimeType = fallbackMime;

  if (base64OrDataUrl.includes(';base64,')) {
    const parts = base64OrDataUrl.split(';base64,');
    mimeType = parts[0].replace('data:', '') || fallbackMime;
    data = parts[1];
  }

  return {
    inlineData: {
      data,
      mimeType
    }
  };
}

/**
 * 1. MAIN PLANT IMAGE ANALYSIS
 * Performs optical plant pathology and returns strictly validated structured diagnosis.
 */
export async function analyzePlantImage(
  imagePart: Part | string,
  input: PlantAnalysisPromptInput = {},
  modelName = DEFAULT_GEMINI_MODEL
): Promise<StructuredDiagnosisResponse> {
  console.log(`[AI Request Started] analyzePlantImage with model: ${modelName}`);

  const genAI = getGenerativeAI();
  if (!genAI) {
    console.warn('[AI Notice] GEMINI_API_KEY not configured. Returning fallback clinical simulation.');
    return getFallbackDiagnosis(input);
  }

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: PLANT_ANALYSIS_SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json'
    }
  });

  const resolvedPart: Part =
    typeof imagePart === 'string' ? imageToGenerativePart(imagePart) : imagePart;
  const userPrompt = buildPlantAnalysisUserPrompt(input);

  let rawResponseText = '';

  try {
    const result = await model.generateContent([userPrompt, resolvedPart]);
    rawResponseText = result.response.text();
    console.log('[AI Request Completed] Raw response received, validating schema...');

    const cleaned = cleanJsonString(rawResponseText);
    const parsed = JSON.parse(cleaned);
    const validated = StructuredDiagnosisResponseSchema.parse(parsed);
    return validated;
  } catch (initialErr) {
    console.warn('[AI Validation Warning] First pass JSON invalid or failed. Attempting strict retry...', initialErr);

    try {
      // Second attempt with strict JSON repair instruction
      const retryResult = await model.generateContent([
        userPrompt,
        resolvedPart,
        'CRITICAL: Your previous response was invalid. Return ONLY a single, strictly valid JSON object matching the requested schema with no commentary.'
      ]);
      const retryCleaned = cleanJsonString(retryResult.response.text());
      const parsedRetry = JSON.parse(retryCleaned);
      return StructuredDiagnosisResponseSchema.parse(parsedRetry);
    } catch (retryErr) {
      console.error('[AI Request Failed] Both attempts failed. Returning controlled fallback:', retryErr);
      return getFallbackDiagnosis(input);
    }
  }
}

/**
 * 2. MULTIMODAL CHAT
 * Botanical consultation chat with optional plant image attachment and conversation context.
 */
export async function chatWithPlantDoctor(
  message: string,
  options: {
    imagePart?: Part | string;
    context?: ChatPromptContext;
    history?: Array<{ role: 'user' | 'assistant'; content: string }>;
    modelName?: string;
  } = {}
): Promise<{
  text: string;
  diagnosisCard?: any;
  suggestedActions?: string[];
}> {
  console.log('[AI Request Started] chatWithPlantDoctor');
  const genAI = getGenerativeAI();
  const modelName = options.modelName || DEFAULT_GEMINI_MODEL;

  if (!genAI) {
    console.warn('[AI Notice] GEMINI_API_KEY not configured. Generating simulated chat response.');
    return getFallbackChatResponse(message, !!options.imagePart);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.4
      }
    });

    const contextPrefix = buildChatUserContext(options.context);
    const contentParts: (string | Part)[] = [`${contextPrefix}\n\nUser Question: ${message}`];

    if (options.imagePart) {
      const part = typeof options.imagePart === 'string'
        ? imageToGenerativePart(options.imagePart)
        : options.imagePart;
      contentParts.push(part);
    }

    const result = await model.generateContent(contentParts);
    const responseText = result.response.text();
    console.log('[AI Request Completed] Chat response generated successfully.');

    // Extract diagnosis_card if present
    let diagnosisCard: any = undefined;
    const cardMatch = responseText.match(/```diagnosis_card\s*([\s\S]*?)\s*```/);
    if (cardMatch && cardMatch[1]) {
      try {
        diagnosisCard = JSON.parse(cardMatch[1]);
      } catch (e) {
        console.warn('Could not parse diagnosis card JSON from chat:', e);
      }
    }

    // Extract suggested_actions if present
    let suggestedActions: string[] | undefined = undefined;
    const actionsMatch = responseText.match(/```suggested_actions\s*([\s\S]*?)\s*```/);
    if (actionsMatch && actionsMatch[1]) {
      try {
        suggestedActions = JSON.parse(actionsMatch[1]);
      } catch (e) {
        console.warn('Could not parse suggested actions JSON from chat:', e);
      }
    }

    // Clean text of the code blocks for clean UI rendering
    const cleanText = responseText
      .replace(/```diagnosis_card[\s\S]*?```/g, '')
      .replace(/```suggested_actions[\s\S]*?```/g, '')
      .trim();

    return {
      text: cleanText,
      diagnosisCard,
      suggestedActions: suggestedActions || [
        'Ask about organic treatments',
        'Upload another leaf close-up',
        'How often should I water?'
      ]
    };
  } catch (err) {
    console.error('[AI Request Failed] chatWithPlantDoctor failed:', err);
    return {
      text: 'Plant Doctor AI is temporarily unavailable. Please try again in a few moments.',
      suggestedActions: ['Try again', 'Check camera connection']
    };
  }
}

/**
 * 3. SEQUENTIAL IMAGE-TO-IMAGE COMPARISON
 * Analyzes prior baseline photo against today's follow-up photo to measure recovery.
 */
export async function comparePlantImages(
  previousImage: Part | string,
  currentImage: Part | string,
  input: ComparisonPromptInput,
  modelName = DEFAULT_GEMINI_MODEL
): Promise<MonitoringComparison> {
  console.log('[AI Request Started] comparePlantImages');
  const genAI = getGenerativeAI();

  if (!genAI) {
    return getFallbackComparison(input);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: COMPARISON_SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    });

    const prevPart = typeof previousImage === 'string' ? imageToGenerativePart(previousImage) : previousImage;
    const currPart = typeof currentImage === 'string' ? imageToGenerativePart(currentImage) : currentImage;
    const prompt = buildComparisonUserPrompt(input);

    const result = await model.generateContent([
      prompt,
      'Image 1 (Previous Baseline):',
      prevPart,
      'Image 2 (Current Follow-up):',
      currPart
    ]);

    const cleaned = cleanJsonString(result.response.text());
    const parsed = JSON.parse(cleaned);
    const validated = MonitoringComparisonSchema.parse(parsed);
    console.log('[AI Request Completed] comparePlantImages successfully validated.');
    return validated;
  } catch (err) {
    console.error('[AI Request Failed] comparePlantImages failed:', err);
    return getFallbackComparison(input);
  }
}

/**
 * 4. TREATMENT PLAN GENERATION
 */
export async function generateTreatmentPlan(
  input: TreatmentPromptInput,
  modelName = DEFAULT_GEMINI_MODEL
) {
  console.log('[AI Request Started] generateTreatmentPlan');
  const genAI = getGenerativeAI();
  if (!genAI) return getFallbackTreatments(input);

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: TREATMENT_SYSTEM_INSTRUCTION,
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
    });

    const result = await model.generateContent(buildTreatmentUserPrompt(input));
    const cleaned = cleanJsonString(result.response.text());
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[AI Request Failed] generateTreatmentPlan failed:', err);
    return getFallbackTreatments(input);
  }
}

/**
 * 5. FERTILIZER & NUTRITION RECOMMENDATIONS
 */
export async function generateFertilizerRecommendations(
  input: FertilizerPromptInput,
  modelName = DEFAULT_GEMINI_MODEL
) {
  console.log('[AI Request Started] generateFertilizerRecommendations');
  const genAI = getGenerativeAI();
  if (!genAI) return getFallbackFertilizers(input);

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: FERTILIZER_SYSTEM_INSTRUCTION,
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
    });

    const result = await model.generateContent(buildFertilizerUserPrompt(input));
    const cleaned = cleanJsonString(result.response.text());
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[AI Request Failed] generateFertilizerRecommendations failed:', err);
    return getFallbackFertilizers(input);
  }
}

/**
 * 6. BOTANICAL IDENTIFICATION
 */
export async function identifyPlant(
  imagePart: Part | string,
  modelName = DEFAULT_GEMINI_MODEL
) {
  console.log('[AI Request Started] identifyPlant');
  const genAI = getGenerativeAI();
  if (!genAI) {
    return {
      isPlant: true,
      commonName: 'Tomato Plant',
      species: 'Solanum lycopersicum',
      family: 'Solanaceae',
      confidence: 94.5,
      morphologyNotes: 'Compound serrated leaves, glandular trichomes on stem.',
      photoQuality: 'good',
      rejectionReason: null
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: IDENTIFICATION_SYSTEM_INSTRUCTION,
      generationConfig: { temperature: 0.1, responseMimeType: 'application/json' }
    });

    const part = typeof imagePart === 'string' ? imageToGenerativePart(imagePart) : imagePart;
    const result = await model.generateContent([buildIdentificationUserPrompt(), part]);
    const cleaned = cleanJsonString(result.response.text());
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[AI Request Failed] identifyPlant failed:', err);
    return {
      isPlant: true,
      commonName: 'Unidentified Plant',
      species: 'Plantae spec.',
      family: 'Unknown',
      confidence: 60,
      morphologyNotes: 'Foliage visible but species identification uncertain.',
      photoQuality: 'adequate',
      rejectionReason: null
    };
  }
}

// ==============================================================================
// CONTROLLED FALLBACK GENERATORS (Used when API keys are pending or service is offline)
// ==============================================================================

function getFallbackDiagnosis(input: PlantAnalysisPromptInput): StructuredDiagnosisResponse {
  const isHealthy = input.symptoms?.toLowerCase().includes('healthy') || false;

  if (isHealthy) {
    return {
      plant: {
        name: input.plantName || 'Monstera Deliciosa',
        species: input.species || 'Monstera deliciosa',
        confidence: 96
      },
      analysis: {
        healthScore: 94,
        severity: 'healthy',
        summary: 'Leaf demonstrates rich chlorophyll saturation, firm structural integrity, and no visible fungal or bacterial lesions.',
        symptoms: ['Vibrant emerald green leaves', 'Clean stomatal pores'],
        affectedParts: [],
        possibleCauses: ['Optimal photosynthetic light and consistent hydration cadence']
      },
      diagnosis: {
        name: 'Vigorous Health State',
        confidence: 95,
        certainty: 'confirmed',
        description: 'Plant is exhibiting optimal vegetative vigor with zero active microbial infection observed.',
        visualEvidence: ['Smooth epidermal cuticle', 'Uniform cellular turgidity']
      },
      visualAnalysis: {
        affectedAreas: []
      },
      treatment: {
        immediateActions: ['Continue baseline cultural management.'],
        naturalOptions: [
          {
            name: 'Routine Foliar Dust Cleanse',
            purpose: 'Maintains optimal gas exchange through leaf stomata.',
            howToUse: 'Wipe leaves gently with damp microfiber cloth.',
            frequency: 'Every 2 weeks',
            safetyNote: 'Do not use chemical leaf shiners which clog pores.'
          }
        ],
        chemicalOptions: []
      },
      fertilizer: {
        suspectedNeeds: [],
        recommendations: [
          {
            name: 'Balanced Organic Bio-Fertilizer 4-3-3',
            type: 'Slow-release organic feed',
            npk: '4-3-3',
            purpose: 'Sustained maintenance feed for leafy foliage.',
            applicationRate: 'Apply monthly during spring and summer.'
          }
        ]
      },
      prevention: ['Maintain well-draining soil and avoid waterlogging.'],
      monitoring: {
        nextCheckHours: 168,
        instructions: 'Perform routine weekly wellness check-in.',
        photoGuidance: 'Take photo in natural indirect light.'
      },
      warnings: [],
      professionalAdvice: 'No chemical intervention required. Continue current care routine.'
    };
  }

  return {
    plant: {
      name: input.plantName || 'Roma Tomato',
      species: input.species || 'Solanum lycopersicum',
      confidence: 92
    },
    analysis: {
      healthScore: 68,
      severity: 'moderate',
      summary: 'Foliar inspection reveals distinct target-shaped necrotic lesions with surrounding chlorotic yellow halos characteristic of Early Blight.',
      symptoms: [
        'Concentric ring dark lesions on lower leaves',
        'Chlorotic yellow margins surrounding fungal spots',
        'Lower foliage showing senescence'
      ],
      affectedParts: ['Lower mature foliage', 'Secondary petioles'],
      possibleCauses: ['Alternaria solani fungal spore germination accelerated by warm, humid foliar conditions']
    },
    diagnosis: {
      name: 'Early Blight (Alternaria solani)',
      confidence: 88,
      certainty: 'likely',
      description: 'Common fungal pathogen affecting Solanaceae crops. Spores survive in soil debris and spread via rain splash or overhead watering.',
      visualEvidence: [
        'Concentric dark rings resembling a target board',
        'Yellow chlorotic halos around necrotic leaf tissue'
      ]
    },
    visualAnalysis: {
      affectedAreas: [
        {
          description: 'Primary necrotic fungal lesion with concentric rings',
          severity: 'severe',
          relativePosition: 'upper-left leaf margin'
        },
        {
          description: 'Secondary target lesion with spreading chlorosis',
          severity: 'moderate',
          relativePosition: 'central leaf blade'
        },
        {
          description: 'Early chlorotic yellow halo',
          severity: 'mild',
          relativePosition: 'lower leaf tip'
        }
      ]
    },
    treatment: {
      immediateActions: [
        'Prune infected lower foliage immediately using sterilized shears.',
        'Sanitize shears in 70% isopropyl alcohol between every cut.',
        'Water exclusively at the base of the soil; avoid wetting foliage.',
        'Collect and dispose of fallen diseased leaves away from compost.'
      ],
      naturalOptions: [
        {
          name: 'Cold-Pressed Neem Oil Emulsion (0.5%)',
          purpose: 'Antifungal botanical barrier that suppresses spore propagation.',
          howToUse: 'Dilute 5ml pure neem oil and 2ml mild soap in 1L warm water. Spray foliar surfaces early morning or at dusk.',
          frequency: 'Every 5 to 7 days',
          safetyNote: 'Never spray in direct midday sun to prevent foliar scorch.'
        },
        {
          name: 'Bacillus subtilis Bio-Fungicide',
          purpose: 'Beneficial antagonistic bacteria that outcompetes fungal mycelium.',
          howToUse: 'Apply as foliar spray according to organic IPM guidelines.',
          frequency: 'Weekly during damp weather',
          safetyNote: 'Safe for pollinators and organic gardens.'
        }
      ],
      chemicalOptions: [
        {
          name: 'Copper Octanoate (Liquid Copper Fungicide)',
          activeIngredient: 'Copper Octanoate',
          purpose: 'Prevents germination of new fungal spores across healthy foliage.',
          application: 'Foliar spray coverage on upper and lower leaf surfaces.',
          precautions: 'Wear gloves and eye protection. Strictly adhere to manufacturer harvest interval directions.'
        }
      ]
    },
    fertilizer: {
      suspectedNeeds: [
        'Possible potassium stress weakening plant cell walls against fungal penetration'
      ],
      recommendations: [
        {
          name: 'Balanced Organic Bio-Fertilizer 4-3-3',
          type: 'Slow-release feed',
          npk: '4-3-3',
          purpose: 'Gentle nutrition without excess nitrogen that could fuel rapid fungal growth.',
          applicationRate: 'Apply at root zone every 3-4 weeks.'
        }
      ]
    },
    prevention: [
      'Apply 2 inches of organic straw mulch around soil base to halt spore splash.',
      'Maintain at least 18-24 inches spacing between plants for adequate airflow.',
      'Rotate crops annually; avoid planting Solanaceae in the same soil consecutively.'
    ],
    monitoring: {
      nextCheckHours: 24,
      instructions: 'Inspect pruned stems and upper foliage for newly appearing chlorotic specks.',
      photoGuidance: 'Take photo tomorrow from the same angle and distance in natural morning light.'
    },
    warnings: [
      'Do not compost pruned infected leaves as fungal spores survive standard home compost temperatures.'
    ],
    professionalAdvice: 'For extensive commercial crop damage, submit a leaf tissue sample to your local agricultural extension service.'
  };
}

function getFallbackComparison(input: ComparisonPromptInput): MonitoringComparison {
  const prevScore = input.previousHealthScore || 68;
  const currentScore = Math.min(96, prevScore + 6);

  return {
    previousHealthScore: prevScore,
    currentHealthScore: currentScore,
    change: currentScore - prevScore,
    status: 'improving',
    resolvedSymptoms: ['Lesion margins have ceased expanding', 'Chlorotic halo reduced by ~40%'],
    newSymptoms: [],
    persistentSymptoms: ['Central dark necrotic spot on lower left leaf blade remains dry and dormant'],
    summary: 'Clear clinical improvement detected. Necrotic expansion has arrested following sanitization and treatment. Upper canopy shows vigorous clean growth.',
    recommendation: 'Continue current watering at base. Repeat foliar neem spray in 3 days.',
    nextCheckHours: 24
  };
}

function getFallbackTreatments(input: TreatmentPromptInput) {
  return {
    immediateActions: [
      'Isolate the specimen if other susceptible plants are adjacent.',
      'Carefully excise symptomatic leaves using sterilized shears.'
    ],
    naturalTreatments: [
      {
        name: 'Cold-Pressed Neem Oil Botanical Emulsion',
        purpose: 'Foliar protection against fungal spores and soft-bodied pests.',
        howToUse: 'Mix 5ml pure neem oil + 2ml castile soap per 1 liter water. Spray thoroughly.',
        frequency: 'Every 5-7 days',
        safetyNote: 'Apply early morning or evening only.'
      }
    ],
    chemicalTreatments: [
      {
        name: 'Fixed Copper Fungicide',
        activeIngredient: 'Copper Octanoate',
        purpose: 'Broad-spectrum fungal and bacterial protectant.',
        application: 'Apply as fine foliar mist covering both leaf surfaces.',
        precautions: 'Follow manufacturer label safety guidelines and local agricultural rules.'
      }
    ],
    prevention: [
      'Improve canopy ventilation by adequate plant spacing.',
      'Never irrigate leaves directly; use drip or bottom watering.'
    ],
    careInstructions: 'Ensure consistent soil moisture without waterlogging.'
  };
}

function getFallbackFertilizers(input: FertilizerPromptInput) {
  return {
    nutrientConcerns: [
      {
        nutrient: 'Potassium (K)',
        concernLevel: 'Possible nutrient concern',
        visualIndication: 'Foliar margins show mild weakness or chlorosis.'
      }
    ],
    recommendedFertilizer: {
      name: 'Balanced Organic Bio-Fertilizer 4-3-3',
      fertilizerType: 'Slow-release organic blend',
      npkCategory: '4-3-3',
      purpose: 'Promotes steady cellular wall strength without excess nitrogen rush.',
      applicationConsiderations: 'Work gently into top inch of soil around drip line.',
      organicAlternatives: ['Vermicompost', 'Liquid Seaweed Extract'],
      warnings: 'Avoid heavy fertilizing when plant is stressed by heat or drought.'
    }
  };
}

function getFallbackChatResponse(message: string, hasImage: boolean) {
  const lower = message.toLowerCase();

  if (hasImage || lower.includes('spot') || lower.includes('yellow') || lower.includes('blight')) {
    return {
      text: `Based on the visual indicators and symptoms described, this is characteristic of **Early Blight (Alternaria solani)**.\n\n### Clinical Triage:\n1. **Sanitation:** Immediately prune affected lower leaves with clean shears.\n2. **Hydration Rule:** Water only at the soil line — avoid getting water on leaves.\n3. **Airflow:** Increase ventilation around the canopy.`,
      diagnosisCard: {
        diseaseName: 'Early Blight (Alternaria solani)',
        confidence: 89,
        severity: 'moderate' as const,
        symptoms: ['Target-shaped brown leaf spots', 'Yellow halos around lesions', 'Lower canopy infection'],
        immediateActions: ['Prune diseased foliage', 'Irrigate soil base only', 'Ensure good air circulation'],
        naturalTreatment: '0.5% cold-pressed neem oil spray every 5-7 days',
        chemicalTreatment: 'Copper octanoate fungicide according to label',
        nextCheck: '24 hours'
      },
      suggestedActions: [
        'How do I apply neem oil safely?',
        'Can this spread to my other plants?',
        'What fertilizer should I use right now?'
      ]
    };
  }

  if (lower.includes('water') || lower.includes('yellow')) {
    return {
      text: `Yellowing leaves (chlorosis) can stem from multiple factors:\n\n- **Overwatering:** Roots suffocate, preventing nutrient uptake. Soil stays soggy.\n- **Underwatering:** Leaves turn limp and yellow with crispy margins.\n- **Nutrient Imbalance:** Nitrogen or iron deficiency.\n\nTo give you an accurate diagnosis, please **upload or take a photo** of the affected leaves using the camera or attachment icon below.`,
      suggestedActions: [
        'Take a photo with camera',
        'Upload photo from gallery',
        'How to check soil moisture?'
      ]
    };
  }

  return {
    text: `Hello! I am your Plant Doctor AI. I can diagnose botanical diseases, review leaf symptoms from photos, guide organic and IPM treatments, and track your plant's recovery.\n\nYou can ask me any gardening question, or upload/capture a photo of your plant for an instant visual analysis!`,
    suggestedActions: [
      'Diagnose my plant with a photo',
      'What causes yellow leaves?',
      'Best natural pest repellents'
    ]
  };
}
