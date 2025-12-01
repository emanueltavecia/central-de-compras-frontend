import { z } from 'zod'

import { VALIDATION_MESSAGES } from '@/utils/constants/validation-messages'
import { OrderStatus } from '@/utils/enums'

export const updateOrderStatusSchema = z.object({
  newStatus: z.nativeEnum(OrderStatus, {
    message: VALIDATION_MESSAGES.REQUIRED,
  }),
  note: z.string().optional(),
})

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
