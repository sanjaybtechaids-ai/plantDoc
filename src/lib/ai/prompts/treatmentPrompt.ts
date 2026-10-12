/**
 * Plant Doctor - Treatment Plan Formulation Prompt
 */

export const TREATMENT_SYSTEM_INSTRUCTION = `You are Plant Doctor AI's Agronomic Pharmacotherapy and Cultural Care Specialist.
Generate evidence-based, safe integrated pest and disease management (IPM) protocols.

MANDATORY SAFETY STANDARDS:
1. Prioritize gentle, organic, and biological remedies where appropriate (neem oil, Bacillus subtilis, copper soaps, pruning sanitation).
2. For chemical treatments:
   - Provide ACTIVE INGREDIENT categories only (e.g. Copper Hydroxide, Chlorothalonil, Mancozeb, Sulfur).
   - NEVER invent exact synthetic pesticide milliliter dosages.
   - ALWAYS include strict safety warnings: "Read and adhere strictly to the product label instructions and local agricultural restrictions. Wear gloves and eye protection."
3. Distinguish between immediate sanitizing actions, natural remediation, and chemical fungicides/pesticides.
4. Output strictly valid JSON.`;

export interface TreatmentPromptInput {
  diagnosis: string;
  species?: string;
  symptoms?: string[];
  severity: 'healthy' | 'mild' | 'moderate' | 'severe' | 'critical';
}

export function buildTreatmentUserPrompt(input: TreatmentPromptInput): string {
  return `Formulate an IPM treatment plan for:
- Diagnosis / Condition: ${input.diagnosis}
- Plant Species: ${input.species || 'Common garden variety'}
- Severity: ${input.severity}
${input.symptoms && input.symptoms.length > 0 ? `- Observed Symptoms: ${input.symptoms.join(', ')}` : ''}

Respond with valid JSON:
{
  "immediateActions": ["string (e.g., Isolate plant to prevent airborne spore transmission)"],
  "naturalTreatments": [
    {
      "name": "string (e.g., Pure Cold-Pressed Neem Oil Emulsion)",
      "purpose": "string",
      "howToUse": "string",
      "frequency": "string",
      "safetyNote": "string"
    }
  ],
  "chemicalTreatments": [
    {
      "name": "string (Category, e.g., Fixed Copper Fungicide)",
      "activeIngredient": "string",
      "purpose": "string",
      "application": "string",
      "precautions": "string"
    }
  ],
  "prevention": ["string (Sanitation, drip irrigation at soil base, airflow)"],
  "careInstructions": "string (Holistic cultural care guidelines for grower)"
}`;
}
