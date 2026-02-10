import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

export const restaurantIdParamSchema = z
  .object({
    restaurantId: objectIdSchema
  })
  .strict();

export const tableIdParamSchema = z
  .object({
    restaurantId: objectIdSchema,
    tableId: objectIdSchema
  })
  .strict();

export const createTableBodySchema = z
  .object({
    tableNumber: z.string().trim().min(1).max(20),
    capacity: z.number().int().min(1).max(100).optional(),
    qrToken: z.string().trim().min(8).max(255).optional(),
    isActive: z.boolean().optional()
  })
  .strict();

export const updateTableBodySchema = createTableBodySchema
  .partial()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required for update.'
  });

export const listTablesQuerySchema = z
  .object({
    includeInactive: z.coerce.boolean().optional().default(false)
  })
  .strict();
