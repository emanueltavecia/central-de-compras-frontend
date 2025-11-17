'use server'

import { revalidateTag } from 'next/cache'

import { getSession } from '@/lib/auth/session'
import { ordersService } from '@/sdk/orders'
import type { Order } from '@/types'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'
import type { CreateOrderInput } from '@/utils/schemas/orders'

export async function getOrders(): Promise<Order[]> {
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
    const { user } = await getSession()

    if (!user?.organizationId) {
      return {
        success: false,
        error: 'Usuário não está associado a uma organização.',
      }
    }

    const orderData = {
      ...data,
      storeOrgId: user.organizationId,
    }

    const order = await ordersService.createOrder(
      orderData as CreateOrderInput & { storeOrgId: string },
    )
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
