import { User } from './user'

import { OrderStatus } from '@/utils/enums'

export interface OrderStatusHistory {
  id: string
  orderId: string
  previousStatus?: OrderStatus
  newStatus: OrderStatus
  changedBy?: User
  note?: string
  createdAt: string
}
