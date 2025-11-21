import type {
  SupplierStateCondition,
  SupplierStateConditionFilters,
} from '@/types'

export interface GetSupplierStateConditionsParams
  extends SupplierStateConditionFilters {}

export interface GetSupplierStateConditionsResponse {
  data: SupplierStateCondition[]
}

export interface CreateSupplierStateConditionBody {
  supplierOrgId: string
  state: string
  cashbackPercent?: number
  paymentTermDays?: number
  unitPriceAdjustment?: number
  effectiveFrom?: string
  effectiveTo?: string
}

export interface CreateSupplierStateConditionResponse {
  data: SupplierStateCondition
}

export interface UpdateSupplierStateConditionBody {
  supplierOrgId: string
  state: string
  cashbackPercent?: number
  paymentTermDays?: number
  unitPriceAdjustment?: number
  effectiveFrom?: string
  effectiveTo?: string
}

export interface UpdateSupplierStateConditionResponse {
  data: SupplierStateCondition
}

export interface DeleteSupplierStateConditionResponse {
  message: string
}
