import { OrderStatus } from '@/utils/enums'

export interface OrderStatusHistory {
  id: string
  orderId: string
  previousStatus?: OrderStatus
  newStatus: OrderStatus
  changedBy?: string
  note?: string
  createdAt: string
}
