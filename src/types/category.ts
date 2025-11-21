export interface Category {
  id: string
  name: string
  parentId?: string
  description?: string
  createdAt: string
  supplierOrgId: string
}

export interface CategoryFilters {
  parentId?: string
  supplierOrgId?: string
}
