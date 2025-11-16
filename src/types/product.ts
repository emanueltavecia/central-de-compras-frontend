export interface Product {
  id: string
  supplierOrgId: string
  categoryId?: string
  name: string
  description?: string
  unit?: string
  basePrice: number
  availableQuantity?: number
  active?: boolean
  createdBy?: string
  createdAt: string
}

export interface ProductFilters {
  status?: boolean
  description?: string
  name?: string
  categoryId?: string
  supplierOrgId?: string
}

export interface UpdateProductStatus {
  active: boolean
}
