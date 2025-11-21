'use server'

import { revalidateTag } from 'next/cache'

import { getSession } from '@/lib/auth/session'
import { ordersService } from '@/sdk/orders'
import type {
  ErrorResponse,
  Order,
  OrderCalculationRequest,
  OrderCalculationResponse,
} from '@/types'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'
import { UserRole } from '@/utils/enums'
import { getErrorMessage } from '@/utils/error-messages'
import type { CreateOrderInput } from '@/utils/schemas/orders'

export async function getOrders(): Promise<Order[]> {
  try {
    const { user } = await getSession()
    const supplierOrgId =
      user?.role.name === UserRole.SUPPLIER ? user.organizationId : undefined
    const storeOrgId =
      user?.role.name === UserRole.STORE ? user.organizationId : undefined
    const orders = await ordersService.getOrders({
      supplierOrgId,
      storeOrgId,
    })
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
      error: getErrorMessage(error as ErrorResponse) || 'Erro ao criar pedido.',
    }
  }
}

export async function calculateOrder(
  params: Omit<OrderCalculationRequest, 'storeOrgId'>,
): Promise<{
  success: boolean
  error?: string
  calculation?: OrderCalculationResponse
}> {
  try {
    const { user } = await getSession()

    if (!user?.organizationId) {
      return {
        success: false,
        error: 'Usuário não está associado a uma organização.',
      }
    }

    const calculation = await ordersService.calculateOrder({
      ...params,
      storeOrgId: user.organizationId,
      storeState: user.organization?.address?.[0]?.state,
    })

    return { success: true, calculation }
  } catch (error) {
    console.error('Erro ao calcular pedido:', error)
    return {
      success: false,
      error: 'Erro ao calcular pedido.',
    }
  }
}
