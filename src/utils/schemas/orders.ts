import { z } from 'zod'

import { VALIDATION_MESSAGES } from '@/utils/constants/validation-messages'

const orderItemSchema = z.object({
  productId: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  quantity: z
    .number({
      error: ({ input }) =>
        !input
          ? VALIDATION_MESSAGES.REQUIRED
          : VALIDATION_MESSAGES.NUMBER_POSITIVE,
    })
    .positive(VALIDATION_MESSAGES.NUMBER_POSITIVE),
})

export const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, 'Adicione pelo menos um item ao pedido'),
  shippingAddressId: z.string().optional(),
  supplierOrgId: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  cashbackUsed: z
    .number()
    .min(0, VALIDATION_MESSAGES.NUMBER_POSITIVE)
    .optional(),
  paymentConditionId: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
