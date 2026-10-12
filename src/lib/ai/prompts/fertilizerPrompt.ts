/**
 * Plant Doctor - Plant Nutrition & Fertilizer Recommendation Prompt
 */

export const FERTILIZER_SYSTEM_INSTRUCTION = `You are Plant Doctor AI's Soil Fertility and Botanical Nutritionist.
Provide balanced, ecologically responsible plant nutrition recommendations.

NUTRITIONAL ANALYSIS PRINCIPLES:
1. NEVER claim a specific nutrient deficiency is 100% confirmed from a photograph alone.
   Always label findings as: "Possible nutrient concern based on visual foliar patterns."
2. Analyze potential concerns across:
   - Nitrogen (N) - general leaf chlorosis or stunted vegetative growth
   - Phosphorus (P) - purplish underleaf discolouration or weak root establishment
   - Potassium (K) - marginal leaf necrosis and weakened resistance to pathogens
   - Micronutrients (Fe, Mg, Ca, Zn) - interveinal chlorosis, blossom end rot
3. Caution growers: During active pathogen infestation, avoid high-nitrogen fertilizers which stimulate soft, succulent tissue susceptible to fungal penetration.
4. Output strictly valid JSON.`;

export interface FertilizerPromptInput {
  plantType?: string;
  species?: string;
  symptoms?: string[];
  diagnosis?: string;
}

export function buildFertilizerUserPrompt(input: FertilizerPromptInput): string {
  return `Generate nutritional and fertilizer guidance for:
- Plant / Species: ${input.species || input.plantType || 'Garden Foliage'}
${input.diagnosis ? `- Current Health Condition: ${input.diagnosis}` : ''}
${input.symptoms && input.symptoms.length > 0 ? `- Visible Symptoms: ${input.symptoms.join(', ')}` : ''}

Respond with valid JSON:
{
  "nutrientConcerns": [
    {
      "nutrient": "string (e.g., Potassium / K)",
      "concernLevel": "Possible nutrient concern",
      "visualIndication": "string (e.g., Yellowing along outer leaf margins)"
    }
  ],
  "recommendedFertilizer": {
    "name": "string (e.g., Balanced Organic Bio-Fertilizer 4-3-3)",
    "fertilizerType": "string (e.g., Slow-release organic feed)",
    "npkCategory": "string (e.g., 4-3-3 or 10-10-10)",
    "purpose": "string",
    "applicationConsiderations": "string (e.g., Apply at base of root zone, water thoroughly)",
    "organicAlternatives": ["string (e.g., Vermicompost, Kelp meal, Bone meal)"],
    "warnings": "string (e.g., Do not over-apply while plant is under heat stress)"
  }
}`;
}
