import { z } from 'zod'

import { VALIDATION_MESSAGES } from '@/utils/constants/validation-messages'
import { PaymentMethod } from '@/utils/enums'

export const paymentConditionSchema = z.object({
  name: z.string().optional(),
  paymentTermDays: z
    .number()
    .min(0, VALIDATION_MESSAGES.NUMBER_MIN(0))
    .optional()
    .nullable(),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: VALIDATION_MESSAGES.REQUIRED }),
  }),
  notes: z.string().optional(),
})

export type PaymentConditionFormInput = z.infer<typeof paymentConditionSchema>
