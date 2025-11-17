import { z } from 'zod'

import { VALIDATION_MESSAGES } from '@/utils/constants/validation-messages'

export const createProductFormSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  description: z.string().optional(),
  unit: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  basePrice: z
    .number({ required_error: VALIDATION_MESSAGES.REQUIRED })
    .positive(VALIDATION_MESSAGES.NUMBER_POSITIVE),
  availableQuantity: z
    .number({ required_error: VALIDATION_MESSAGES.REQUIRED })
    .nonnegative(VALIDATION_MESSAGES.NUMBER_POSITIVE),
  categoryId: z.string().optional(),
})

export const createProductSchema = createProductFormSchema.extend({
  supplierOrgId: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
})

export const updateProductSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  description: z.string().optional(),
  unit: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  basePrice: z
    .number({ required_error: VALIDATION_MESSAGES.REQUIRED })
    .positive(VALIDATION_MESSAGES.NUMBER_POSITIVE),
  availableQuantity: z
    .number({ required_error: VALIDATION_MESSAGES.REQUIRED })
    .nonnegative(VALIDATION_MESSAGES.NUMBER_POSITIVE),
  categoryId: z.string().optional(),
  active: z.boolean(),
  supplierOrgId: z.string().optional(),
})

export type CreateProductFormInput = z.infer<typeof createProductFormSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
