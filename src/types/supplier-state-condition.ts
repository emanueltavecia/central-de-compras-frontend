export interface SupplierStateCondition {
  id: string
  supplierOrgId: string
  state: string
  cashbackPercent?: number
  paymentTermDays?: number
  unitPriceAdjustment?: number
  effectiveFrom?: string
  effectiveTo?: string
  createdAt: string
}

export interface SupplierStateConditionFilters {
  supplierOrgId?: string
  state?: string
}

export interface SupplierStateParams {
  supplierOrgId: string
  state: string
}
