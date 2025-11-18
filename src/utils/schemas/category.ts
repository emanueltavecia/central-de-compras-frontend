import { z } from 'zod'

import { VALIDATION_MESSAGES } from '../constants/validation-messages'

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .min(3, VALIDATION_MESSAGES.TEXT_MIN_LENGTH(3)),
  description: z.string().optional(),
  parentId: z.string().optional(),
})

export type CategoryFormData = z.infer<typeof categorySchema>
