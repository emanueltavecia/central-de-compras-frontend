'use server'

import { cacheTag, revalidateTag } from 'next/cache'

import { ordersService } from '@/sdk/orders'
import type { Order } from '@/types'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'
import type { CreateOrderInput } from '@/utils/schemas/orders'

export async function getOrders(): Promise<Order[]> {
  'use cache'
  cacheTag(CACHE_TAGS.ORDERS.LIST)

  try {
    const orders = await ordersService.getOrders({})
    return orders
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    throw error
  }
}

export async function createOrder(
  data: CreateOrderInput,
): Promise<{ success: boolean; error?: string; order?: Order }> {
  try {
    const order = await ordersService.createOrder(data)
    revalidateTag(CACHE_TAGS.ORDERS.LIST, { expire: 0 })

    return { success: true, order }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return {
      success: false,
      error: 'Erro ao criar pedido. Tente novamente.',
    }
  }
}
