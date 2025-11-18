import { z } from 'zod'

import { VALIDATION_MESSAGES } from '@/utils/constants/validation-messages'

export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .max(120, VALIDATION_MESSAGES.TEXT_MAX_LENGTH(120)),
  taxId: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  phone: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  email: z
    .string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .min(1, VALIDATION_MESSAGES.REQUIRED),
  website: z
    .string()
    .url(VALIDATION_MESSAGES.URL_INVALID)
    .optional()
    .or(z.literal('')),
})

export type OrganizationInput = z.infer<typeof organizationSchema>
