import { z } from 'zod'

import { VALIDATION_MESSAGES } from '../constants/validation-messages'

export const loginSchema = z.object({
  email: z.email({
    error: ({ input }) =>
      !input ? VALIDATION_MESSAGES.REQUIRED : VALIDATION_MESSAGES.EMAIL_INVALID,
  }),
  password: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH(6)),
})

export type LoginFormData = z.infer<typeof loginSchema>
