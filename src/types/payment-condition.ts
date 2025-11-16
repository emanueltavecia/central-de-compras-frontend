import { PaymentMethod } from '@/utils/enums'

export interface PaymentCondition {
  id: string
  supplierOrgId: string
  name?: string
  paymentTermDays?: number
  paymentMethod: PaymentMethod
  notes?: string
  active?: boolean
  createdAt: string
}

export interface PaymentConditionFilters {
  status?: boolean
  name?: string
  supplierOrgId?: string
  createdAt?: string
}

export interface UpdatePaymentConditionStatus {
  active: boolean
}
