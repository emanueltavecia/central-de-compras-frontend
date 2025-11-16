import { ORDERS_ROUTES } from './routes'

import { api } from '../client'

import type { Order, OrderFilters } from '@/types'
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

  async createOrder(params: CreateOrderInput): Promise<Order> {
    const { data } = await api.post(ORDERS_ROUTES.BASE, params)
    return data.data
  },
}
