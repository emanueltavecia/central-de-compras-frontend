import { UserRole } from '@/utils/enums'

export interface RouteItem {
  route: string
  name: string
  roles?: UserRole[]
  submenu?: RouteItem[]
}

export interface RoutePermission {
  [key: string]: RouteItem
}
