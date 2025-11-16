import { RoutePermission } from './types'

import { PermissionName } from '@/utils/enums'

export const ROUTE_PERMISSIONS: RoutePermission = {
  dashboard: {
    name: 'Dashboard',
    route: '/dashboard',
  },
  campaigns: {
    name: 'Campanhas',
    route: '/campaigns',
    permissions: [PermissionName.MANAGE_CAMPAIGNS],
  },
  orders: {
    name: 'Pedidos',
    route: '/orders',
    permissions: [PermissionName.VIEW_ORDERS],
  },
  organizations: {
    name: 'Organizações',
    route: '/organizations',
  },
  paymentConditions: {
    name: 'Condições de Pagamento',
    route: '/payment-conditions',
    permissions: [PermissionName.MANAGE_CONDITIONS],
  },
  products: {
    name: 'Produtos',
    route: '/products',
    permissions: [PermissionName.MANAGE_PRODUCTS],
  },
  categories: {
    name: 'Categorias',
    route: '/categories',
  },
}
