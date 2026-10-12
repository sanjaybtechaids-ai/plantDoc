import { z } from 'zod';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  plantId: z.string().optional(),
  conversationId: z.string().optional(),
  image: z.string().optional()
});

export const TreatmentRequestSchema = z.object({
  diagnosis: z.string().min(1, 'Diagnosis name is required'),
  species: z.string().optional(),
  symptoms: z.array(z.string()).optional().default([]),
  severity: z.enum(['healthy', 'mild', 'moderate', 'severe', 'critical']).default('moderate')
});

export const FertilizerRequestSchema = z.object({
  plantType: z.string().optional(),
  species: z.string().optional(),
  symptoms: z.array(z.string()).optional().default([]),
  diagnosis: z.string().optional()
});

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function successResponse<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown
) {
  return Response.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {})
      }
    },
    { status }
  );
}
