import { Role } from './role'

import { UserAccountStatus } from '@/utils/enums'

export interface User {
  id: string
  email: string
  fullName?: string
  phone?: string
  roleId: string
  role: Role
  organizationId: string
  status?: UserAccountStatus
  createdBy?: string
  createdAt: string
}
