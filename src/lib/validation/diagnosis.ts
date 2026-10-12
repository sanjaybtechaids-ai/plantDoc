import { z } from 'zod';

export const SeverityEnum = z.enum(['healthy', 'mild', 'moderate', 'severe', 'critical']);
export const CertaintyEnum = z.enum(['confirmed', 'likely', 'possible', 'uncertain']);

export const PlantIdentificationSchema = z.object({
  name: z.string().default('Unknown Plant'),
  species: z.string().default('Unknown species'),
  confidence: z.number().min(0).max(100).default(0)
});

export const AffectedAreaSchema = z.object({
  description: z.string(),
  severity: z.string().default('moderate'),
  relativePosition: z.string().default('central leaf')
});

export const NaturalTreatmentOptionSchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    purpose: z.string().optional(),
    howToUse: z.string().optional(),
    frequency: z.string().optional(),
    safetyNote: z.string().optional()
  })
]);

export const ChemicalTreatmentOptionSchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    activeIngredient: z.string().optional(),
    purpose: z.string().optional(),
    application: z.string().optional(),
    precautions: z.string().optional()
  })
]);

export const FertilizerRecommendationSchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    type: z.string().optional(),
    npk: z.string().optional(),
    purpose: z.string().optional(),
    applicationRate: z.string().optional()
  })
]);

export const StructuredDiagnosisResponseSchema = z.object({
  plant: PlantIdentificationSchema,
  analysis: z.object({
    healthScore: z.number().min(0).max(100),
    severity: SeverityEnum,
    summary: z.string(),
    symptoms: z.array(z.string()).default([]),
    affectedParts: z.array(z.string()).default([]),
    possibleCauses: z.array(z.string()).default([])
  }),
  diagnosis: z.object({
    name: z.string(),
    confidence: z.number().min(0).max(100).default(50),
    certainty: CertaintyEnum.default('possible'),
    description: z.string(),
    visualEvidence: z.array(z.string()).default([])
  }),
  visualAnalysis: z.object({
    affectedAreas: z.array(AffectedAreaSchema).default([])
  }),
  treatment: z.object({
    immediateActions: z.array(z.string()).default([]),
    naturalOptions: z.array(NaturalTreatmentOptionSchema).default([]),
    chemicalOptions: z.array(ChemicalTreatmentOptionSchema).default([])
  }),
  fertilizer: z.object({
    suspectedNeeds: z.array(z.string()).default([]),
    recommendations: z.array(FertilizerRecommendationSchema).default([])
  }),
  prevention: z.array(z.string()).default([]),
  monitoring: z.object({
    nextCheckHours: z.number().default(24),
    instructions: z.string().default('Check plant again tomorrow.'),
    photoGuidance: z.string().optional().default('Take photo in natural indirect light.')
  }),
  warnings: z.array(z.string()).default([]),
  professionalAdvice: z.string().default('Consult a local agricultural extension specialist for severe infestations.')
});

export type StructuredDiagnosisResponse = z.infer<typeof StructuredDiagnosisResponseSchema>;
