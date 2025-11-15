import { PermissionName } from '@/utils/enums'

export interface Permission {
  id: string
  name: PermissionName
  description?: string
}
