import { OrderItem } from './order-item'

import { OrderStatus } from '@/utils/enums'

export interface Order {
  id: string
  storeOrgId: string
  supplierOrgId: string
  status?: OrderStatus
  placedAt: string
  shippingAddressId?: string
  subtotalAmount?: number
  shippingCost?: number
  adjustments?: number
  totalAmount?: number
  totalCashback?: number
  cashbackUsed?: number
  appliedSupplierStateConditionId?: string
  paymentConditionId?: string
  createdBy?: string
  createdAt: string
  items: OrderItem[]
}

export interface OrderFilters {
  storeOrgId?: string
  supplierOrgId?: string
  status?: OrderStatus
  placedAtFrom?: string
  placedAtTo?: string
  createdBy?: string
}
