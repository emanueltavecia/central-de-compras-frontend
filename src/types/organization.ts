import { Address } from './address'

import { OrgType } from '@/utils/enums'

export interface Organization {
  id: string
  type: OrgType
  legalName: string
  tradeName?: string
  taxId?: string
  phone?: string
  email?: string
  website?: string
  address?: Address[]
  createdBy?: string
  createdAt: string
  active?: boolean
}

export interface OrganizationFilters {
  type?: OrgType
  active?: boolean
}

export interface UpdateOrganizationStatus {
  active: boolean
}
