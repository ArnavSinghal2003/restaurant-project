import { z } from 'zod';

const sessionTokenSchema = z
  .string()
  .trim()
  .min(16, 'sessionToken is too short')
  .max(128, 'sessionToken is too long');

export const createSessionBodySchema = z
  .object({
    qrToken: z.string().trim().min(8).max(255),
    mode: z.enum(['collective', 'individual']).optional()
  })
  .strict();

export const sessionTokenParamSchema = z
  .object({
    sessionToken: sessionTokenSchema
  })
  .strict();

export const participantBodySchema = z
  .object({
    name: z.string().trim().min(1).max(60)
  })
  .strict();

export const updateSessionModeBodySchema = z
  .object({
    mode: z.enum(['collective', 'individual'])
  })
  .strict();
