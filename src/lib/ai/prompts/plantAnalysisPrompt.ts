/**
 * Plant Doctor - Optical Agronomy & Plant Pathology Analysis Prompt
 * Enforces rigorous observation vs hypothesis separation, strict JSON schemas,
 * and ethical agricultural disclaimers.
 */

export const PLANT_ANALYSIS_SYSTEM_INSTRUCTION = `You are Plant Doctor AI, an advanced AI-assisted botanical diagnostic and plant health analysis system.
You analyze visible plant symptoms from photographs using agricultural pathology and optical agronomy standards.

CRITICAL OPERATIONAL RULES:
1. Distinguish strictly between:
   - "confirmed" visual observation (clearly visible features like lesions, yellowing, pests, fenestrations)
   - "likely" diagnosis (symptoms closely match known pathogens or stress patterns)
   - "possible" diagnosis (symptoms are ambiguous or could correspond to multiple etiologies)
   - "uncertain" result (image quality is insufficient, or plant is unclear)
2. NEVER claim 100% certainty from a photograph alone. Always acknowledge biological variance.
3. NEVER fabricate evidence, symptoms, or diagnostic details. If no plant or leaf is visible, state it clearly.
4. NEVER fabricate brand names, store links, or external product URLs.
5. NEVER claim that any fertilizer, chemical, or organic product is guaranteed to cure a disease.
6. When recommending chemical treatments:
   - Provide chemical active ingredient / category ONLY (e.g., copper octanoate, chlorothalonil, sulfur spray).
   - NEVER prescribe lethal or toxic off-label chemical dosages.
   - Always instruct the grower to follow local regulations and official product label directions.
7. Fertilizer recommendations:
   - Note that nutrient deficiencies cannot be definitively confirmed without soil/tissue tests.
   - State them as "Possible nutrient concerns".
8. Severity must be EXACTLY one of: "healthy", "mild", "moderate", "severe", "critical".
9. Health score must be an integer between 0 and 100:
   - 0–30: Critical (extensive decay, wilting, systemic collapse)
   - 31–50: Poor (severe chlorosis, advanced sporulation, spreading lesions)
   - 51–70: Needs Attention (moderate lesions, mild nutrient stress, leaf spot)
   - 71–85: Good (minor cosmetic blemishes, vigorous growth otherwise)
   - 86–100: Healthy (vibrant foliage, intact stomata, optimal chlorophyll)
10. Monitoring guidance intervals:
   - Critical: 12-24 hours
   - Severe: 24 hours
   - Moderate: 24-48 hours
   - Mild: 48-72 hours
   - Healthy: 168 hours (7 days)

OUTPUT FORMAT:
You MUST respond ONLY with a single valid JSON object adhering precisely to the schema provided. Do not prepend markdown formatting other than pure json if asked.`;

export interface PlantAnalysisPromptInput {
  plantName?: string;
  species?: string;
  symptoms?: string;
  previousDiagnosis?: string;
  previousHealthScore?: number;
}

export function buildPlantAnalysisUserPrompt(input: PlantAnalysisPromptInput): string {
  const parts: string[] = [
    'Analyze the supplied plant image.',
    'Follow these step-by-step diagnostic procedures:',
    '1. First, determine whether a plant is actually visible in the photograph.',
    '2. Identify the plant common name and botanical species if recognizable.',
    '3. Describe only visually observable symptoms on leaves, stems, or fruits.',
    '4. Determine potential biotic pathogens (fungal, bacterial, viral, pests) or abiotic stressors (water, light, temperature).',
    '5. Assign an AI-estimated plant health score (0-100) and severity rating.',
    '6. Provide visual analysis highlighting affected leaf regions with relative positions (e.g. "upper-left leaf", "lower stem margin", "central leaf blade").',
    '7. Outline immediate triage actions, natural/organic treatment options, and chemical treatment categories.',
    '8. Identify possible nutrient concerns (N, P, K, micronutrients) and fertilizer category recommendations.',
    '9. Provide actionable prevention advice and next check-in monitoring schedule.'
  ];

  if (input.plantName || input.species) {
    parts.push(`Grower-provided plant info: ${[input.plantName, input.species].filter(Boolean).join(' - ')}`);
  }
  if (input.symptoms) {
    parts.push(`Grower-reported observed symptoms: "${input.symptoms}"`);
  }
  if (input.previousDiagnosis) {
    parts.push(`Previous diagnostic history: "${input.previousDiagnosis}" (Previous health score: ${input.previousHealthScore ?? 'unknown'})`);
  }

  parts.push(`
Respond with a JSON object strictly matching this schema:
{
  "plant": {
    "name": "string (Common name, or 'Unknown Plant')",
    "species": "string (Botanical genus & species, or 'Unknown')",
    "confidence": number (0 to 100)
  },
  "analysis": {
    "healthScore": number (0 to 100 integer),
    "severity": "healthy" | "mild" | "moderate" | "severe" | "critical",
    "summary": "string (Clear 2-3 sentence overview of the diagnosis)",
    "symptoms": ["string (Observed visual symptom 1)", "string (Observed symptom 2)"],
    "affectedParts": ["string (e.g., lower leaves, stems, apical shoot)"],
    "possibleCauses": ["string (e.g., fungal spore germination in high humidity)"]
  },
  "diagnosis": {
    "name": "string (Primary disease or health condition name, e.g., 'Early Blight (Alternaria solani)' or 'Vigorous Health')",
    "confidence": number (0 to 100),
    "certainty": "confirmed" | "likely" | "possible" | "uncertain",
    "description": "string (Detailed pathological explanation)",
    "visualEvidence": ["string (Specific visual proof in photo)"]
  },
  "visualAnalysis": {
    "affectedAreas": [
      {
        "description": "string (e.g., Concentric dark necrotic ring)",
        "severity": "mild" | "moderate" | "severe",
        "relativePosition": "string (e.g., upper-left leaf, lower margin, center leaf blade)"
      }
    ]
  },
  "treatment": {
    "immediateActions": ["string (Immediate step, e.g., isolate plant, prune infected tissue)"],
    "naturalOptions": [
      {
        "name": "string (e.g., Cold-Pressed Neem Oil Emulsion)",
        "purpose": "string",
        "howToUse": "string",
        "frequency": "string",
        "safetyNote": "string"
      }
    ],
    "chemicalOptions": [
      {
        "name": "string (Active ingredient category, e.g., Copper Octanoate Fungicide)",
        "activeIngredient": "string",
        "purpose": "string",
        "application": "string",
        "precautions": "string (Always follow manufacturer label and local guidelines)"
      }
    ]
  },
  "fertilizer": {
    "suspectedNeeds": ["string (Possible nutrient concern, e.g., Possible nitrogen deficiency)"],
    "recommendations": [
      {
        "name": "string (Fertilizer category, e.g., Balanced Organic NPK 4-3-3)",
        "type": "string",
        "npk": "string",
        "purpose": "string",
        "applicationRate": "string"
      }
    ]
  },
  "prevention": ["string (Long-term preventive cultural practices)"],
  "monitoring": {
    "nextCheckHours": number (e.g., 24),
    "instructions": "string (What grower should inspect next)",
    "photoGuidance": "string (Photo guidance, e.g., Take matching angle in natural morning light)"
  },
  "warnings": ["string (Crucial safety or crop preservation warnings)"],
  "professionalAdvice": "string (Agricultural extension caveat)"
}`);

  return parts.join('\n\n');
}
