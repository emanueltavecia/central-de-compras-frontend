import { Permission } from './permission'

import { UserRole } from '@/utils/enums'

export interface Role {
  id: string
  name: UserRole
  description?: string
  createdAt: string
  permissions: Permission[]
}
