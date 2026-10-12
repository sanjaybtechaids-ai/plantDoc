import { z } from 'zod';
import { SeverityEnum } from './diagnosis';

export const ImprovementStatusEnum = z.enum(['improving', 'stable', 'declining', 'uncertain']);

export const MonitoringComparisonSchema = z.object({
  previousHealthScore: z.number().min(0).max(100),
  currentHealthScore: z.number().min(0).max(100),
  change: z.number(),
  status: ImprovementStatusEnum,
  resolvedSymptoms: z.array(z.string()).default([]),
  newSymptoms: z.array(z.string()).default([]),
  persistentSymptoms: z.array(z.string()).default([]),
  summary: z.string(),
  recommendation: z.string(),
  nextCheckHours: z.number().optional().default(24)
});

export const CreateMonitoringEntrySchema = z.object({
  plantId: z.string().uuid().or(z.string().min(1)),
  imageUrl: z.string().min(1, 'Image URL is required'),
  healthScore: z.number().min(0).max(100),
  previousHealthScore: z.number().min(0).max(100).optional(),
  healthScoreChange: z.number().optional().default(0),
  severity: SeverityEnum.optional().default('mild'),
  improvementStatus: ImprovementStatusEnum.optional().default('stable'),
  diagnosisName: z.string().optional().default('Routine Check-in'),
  notes: z.string().max(1000).optional().default('')
});

export const MonitoringReminderSchema = z.object({
  plantId: z.string().min(1),
  reminderTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, 'Time format must be HH:MM or HH:MM:SS'),
  timezone: z.string().default('UTC'),
  enabled: z.boolean().default(true)
});

export type MonitoringComparison = z.infer<typeof MonitoringComparisonSchema>;
export type CreateMonitoringEntryInput = z.infer<typeof CreateMonitoringEntrySchema>;
export type MonitoringReminderInput = z.infer<typeof MonitoringReminderSchema>;
