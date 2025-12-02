import { ORDERS_ROUTES } from './routes'

import { api } from '../client'

import type {
  Order,
  OrderCalculationRequest,
  OrderCalculationResponse,
  OrderFilters,
  SuccessResponse,
} from '@/types'
import { OrderStatus } from '@/utils/enums'
import type { CreateOrderInput } from '@/utils/schemas/orders'

export const ordersService = {
  async getOrders(params?: OrderFilters): Promise<Order[]> {
    const { data } = await api.get(ORDERS_ROUTES.BASE, {
      params,
    })
    return data.data
  },

  async getOrderById(id: string): Promise<Order> {
    const { data } = await api.get(ORDERS_ROUTES.BY_ID(id))
    return data.data
  },

  async createOrder(
    params: CreateOrderInput & { storeOrgId: string },
  ): Promise<Order> {
    const { data } = await api.post(ORDERS_ROUTES.BASE, params)
    return data.data
  },

  async calculateOrder(
    params: OrderCalculationRequest,
  ): Promise<OrderCalculationResponse> {
    const { data } = await api.post<SuccessResponse<OrderCalculationResponse>>(
      ORDERS_ROUTES.CALCULATE,
      params,
    )
    return data.data
  },

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    note?: string,
  ): Promise<Order> {
    const { data } = await api.patch(ORDERS_ROUTES.UPDATE_STATUS(id), {
      newStatus: status,
      note,
    })
    return data.data
  },
}
