export enum OrgType {
  CENTRAL = 'central',
  STORE = 'store',
  SUPPLIER = 'supplier',
  TELEVENDAS = 'televendas',
}

export interface Organization {
  id: string
  type: OrgType
  legalName: string
  tradeName?: string
  taxId?: string
  phone?: string
  email?: string
  website?: string
  active?: boolean
  createdBy?: string
  createdAt: string
}

export interface OrganizationFilters {
  type?: OrgType
  active?: boolean
}

export interface CreateOrganizationInput {
  type: OrgType
  legalName: string
  tradeName?: string
  taxId?: string
  phone?: string
  email?: string
  website?: string
}

export interface UpdateOrganizationInput {
  type: OrgType
  legalName?: string
  tradeName?: string
  taxId?: string
  phone?: string
  email?: string
  website?: string
}

export interface UpdateOrganizationStatusInput {
  active: boolean
}
