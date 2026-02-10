import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');
const currencySchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{3}$/, 'Currency must be a 3-letter code');

const taxConfigSchema = z
  .object({
    cgst: z.number().min(0).optional(),
    sgst: z.number().min(0).optional(),
    serviceTax: z.number().min(0).optional(),
    inclusiveOrExclusive: z.enum(['inclusive', 'exclusive']).optional()
  })
  .strict();

const tipConfigSchema = z
  .object({
    enabled: z.boolean().optional(),
    defaultPercentOptions: z.array(z.number().min(0).max(100)).optional()
  })
  .strict();

const paymentConfigSchema = z
  .object({
    cashEnabled: z.boolean().optional(),
    onlineEnabled: z.boolean().optional(),
    provider: z.enum(['stripe', 'razorpay']).optional()
  })
  .strict();

const contactSchema = z
  .object({
    phone: z.string().trim().min(5).max(20).optional(),
    email: z.string().trim().email().optional(),
    website: z.string().trim().url().optional()
  })
  .strict();

const addressSchema = z
  .object({
    line1: z.string().trim().max(150).optional(),
    line2: z.string().trim().max(150).optional(),
    city: z.string().trim().max(80).optional(),
    state: z.string().trim().max(80).optional(),
    country: z.string().trim().max(80).optional(),
    postalCode: z.string().trim().max(20).optional()
  })
  .strict();

export const createRestaurantBodySchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    slug: z.string().trim().min(2).max(120).optional(),
    logoUrl: z.string().trim().url().optional(),
    contact: contactSchema.optional(),
    address: addressSchema.optional(),
    currency: currencySchema.optional(),
    taxConfig: taxConfigSchema.optional(),
    tipConfig: tipConfigSchema.optional(),
    paymentConfig: paymentConfigSchema.optional(),
    isActive: z.boolean().optional()
  })
  .strict();

export const updateRestaurantBodySchema = createRestaurantBodySchema
  .partial()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required for update.'
  });

export const restaurantIdParamSchema = z
  .object({
    restaurantId: objectIdSchema
  })
  .strict();

export const restaurantSlugParamSchema = z
  .object({
    slug: z.string().trim().min(2).max(120)
  })
  .strict();

export const listRestaurantsQuerySchema = z
  .object({
    includeInactive: z.coerce.boolean().optional().default(false),
    search: z.string().trim().min(1).max(100).optional()
  })
  .strict();
