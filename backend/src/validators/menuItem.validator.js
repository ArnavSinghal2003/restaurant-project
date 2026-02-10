import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

const modifierOptionSchema = z
  .object({
    name: z.string().trim().min(1).max(60),
    priceDelta: z.number().optional().default(0),
    isDefault: z.boolean().optional().default(false)
  })
  .strict();

const modifierGroupSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    required: z.boolean().optional().default(false),
    minSelect: z.number().int().min(0).optional().default(0),
    maxSelect: z.number().int().min(1).optional().default(1),
    options: z.array(modifierOptionSchema).optional().default([])
  })
  .strict();

const timeRuleSchema = z
  .object({
    label: z.string().trim().max(80).optional(),
    startTime: z.string().trim().max(10).optional(),
    endTime: z.string().trim().max(10).optional(),
    daysOfWeek: z.array(z.number().int().min(0).max(6)).optional().default([]),
    priceOverride: z.number().min(0).optional()
  })
  .strict();

export const restaurantIdParamSchema = z
  .object({
    restaurantId: objectIdSchema
  })
  .strict();

export const menuItemIdParamSchema = z
  .object({
    restaurantId: objectIdSchema,
    menuItemId: objectIdSchema
  })
  .strict();

export const createMenuItemBodySchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().max(600).optional(),
    category: z.string().trim().min(1).max(80),
    price: z.number().min(0),
    imageUrl: z.string().trim().url().optional(),
    dietaryTags: z.array(z.string().trim().min(1).max(30)).optional().default([]),
    modifiers: z.array(modifierGroupSchema).optional().default([]),
    isAvailable: z.boolean().optional(),
    inventoryCount: z.number().int().min(0).optional(),
    timeRules: z.array(timeRuleSchema).optional().default([]),
    sortOrder: z.number().int().optional().default(0)
  })
  .strict();

export const updateMenuItemBodySchema = createMenuItemBodySchema
  .partial()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required for update.'
  });

export const updateAvailabilityBodySchema = z
  .object({
    isAvailable: z.boolean()
  })
  .strict();

export const listMenuItemsQuerySchema = z
  .object({
    includeUnavailable: z.coerce.boolean().optional().default(false),
    category: z.string().trim().min(1).max(80).optional(),
    search: z.string().trim().min(1).max(100).optional()
  })
  .strict();
