import { Organization } from './organization'
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
  organization?: Organization
  status?: UserAccountStatus
  createdBy?: string
  createdAt: string
  profileImage?: string
}
