'use server'

import { revalidateTag } from 'next/cache'

import { ordersService } from '@/sdk/orders'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'
import { OrderStatus } from '@/utils/enums'

interface UpdateOrderStatusParams {
  orderId: string
  newStatus: OrderStatus
  note?: string
}

export async function updateOrderStatusAction({
  orderId,
  newStatus,
  note,
}: UpdateOrderStatusParams) {
  await ordersService.updateOrderStatus(orderId, newStatus, note)

  revalidateTag(CACHE_TAGS.ORDERS.LIST, { expire: 0 })
}
