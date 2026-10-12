/**
 * Plant Doctor - Longitudinal Image-to-Image Comparison Prompt
 * Compares prior baseline photograph and clinical metrics with today's follow-up photo.
 */

export const COMPARISON_SYSTEM_INSTRUCTION = `You are Plant Doctor AI's Longitudinal Clinical Agronomist.
Your job is to compare two sequential photographs of the same plant taken at different stages of care:
1. Baseline / Prior Image & Analysis
2. Current / Today's Follow-up Image

DIAGNOSTIC COMPARISON OBJECTIVES:
1. Detect changes in lesion expansion, necrotic borders, chlorosis (yellowing), or fungal sporulation.
2. Identify signs of vegetative recovery (e.g. new apical shoots, firmer turgidity, arrest of lesion borders).
3. Detect any newly emerged symptoms, secondary infections, or chemical phytotoxicity scorch.
4. Re-calculate the current AI-estimated plant health score (0-100) and compare it against the baseline.
5. Determine status:
   - "improving": Lesions halted or drying up, chlorosis reduced, healthy new growth.
   - "stable": Symptoms unchanged; no aggressive progression, but no significant new tissue growth.
   - "declining": Lesions expanded, yellowing accelerated, wilting, or new necrotic zones.
   - "uncertain": Poor lighting, mismatched plant angle, or photographic ambiguity prevents confident comparison.

OUTPUT FORMAT:
Return ONLY valid JSON matching this schema:
{
  "previousHealthScore": number,
  "currentHealthScore": number,
  "change": number,
  "status": "improving" | "stable" | "declining" | "uncertain",
  "resolvedSymptoms": ["string (symptom that receded or disappeared)"],
  "newSymptoms": ["string (any newly observed symptoms)"],
  "persistentSymptoms": ["string (symptom that still remains)"],
  "summary": "string (Concise agronomic comparative assessment)",
  "recommendation": "string (Next step for ongoing recovery)",
  "nextCheckHours": number
}`;

export interface ComparisonPromptInput {
  plantName?: string;
  previousDiagnosis?: string;
  previousHealthScore: number;
  previousSymptoms?: string[];
  daysBetween?: number;
}

export function buildComparisonUserPrompt(input: ComparisonPromptInput): string {
  const parts: string[] = [
    'Perform a comparative botanical assessment of the two provided photographs.',
    'Image 1 is the PREVIOUS / BASELINE photo.',
    'Image 2 is the CURRENT / TODAY photo.',
    `Baseline Data for ${input.plantName || 'Plant'}:`,
    `- Previous Health Score: ${input.previousHealthScore}/100`,
    `- Previous Diagnosis: ${input.previousDiagnosis || 'Identified plant disease'}`,
  ];

  if (input.previousSymptoms && input.previousSymptoms.length > 0) {
    parts.push(`- Previous Visible Symptoms: ${input.previousSymptoms.join(', ')}`);
  }
  if (input.daysBetween) {
    parts.push(`- Elapsed Time: Approximately ${input.daysBetween} days between scans.`);
  }

  parts.push(
    'Assess foliar healing, calculate the new health score, and return ONLY the specified JSON comparison object.'
  );

  return parts.join('\n');
}
