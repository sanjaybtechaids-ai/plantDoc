import { z } from 'zod';

export const SunlightEnum = z.enum([
  'Full Sun',
  'Partial Shade',
  'Bright Indirect',
  'Low Light'
]);

export const CreatePlantSchema = z.object({
  name: z.string().min(1, 'Plant name is required').max(100),
  species: z.string().max(100).optional().default(''),
  plantingDate: z.string().optional(),
  location: z.string().max(100).optional().default('Indoor / Garden'),
  potSize: z.string().max(50).optional(),
  sunlight: SunlightEnum.optional().default('Bright Indirect'),
  wateringFrequency: z.string().max(100).optional().default('Every 2-3 days'),
  soilType: z.string().max(100).optional().default('Standard potting mix'),
  notes: z.string().max(1000).optional().default(''),
  imageUrl: z.string().optional()
});

export const UpdatePlantSchema = CreatePlantSchema.partial().extend({
  healthScore: z.number().min(0).max(100).optional(),
  status: z.enum(['healthy', 'attention', 'critical']).optional(),
  currentIssue: z.string().optional()
});

export type CreatePlantInput = z.infer<typeof CreatePlantSchema>;
export type UpdatePlantInput = z.infer<typeof UpdatePlantSchema>;
