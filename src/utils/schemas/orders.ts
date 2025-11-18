import { z } from 'zod'

import { VALIDATION_MESSAGES } from '@/utils/constants/validation-messages'

const orderItemSchema = z.object({
  productId: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  quantity: z
    .number({ required_error: VALIDATION_MESSAGES.REQUIRED })
    .positive(VALIDATION_MESSAGES.NUMBER_POSITIVE),
})

export const createOrderSchema = z.object({
  storeOrgId: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  items: z
    .array(orderItemSchema)
    .min(1, 'Adicione pelo menos um item ao pedido'),
  shippingCost: z.number().optional(),
  shippingAddressId: z.string().optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
