import { PermissionName } from '@/utils/enums'

export interface RoutePermission {
  [key: string]: {
    route: string
    name: string
    permissions?: PermissionName[]
  }
}
