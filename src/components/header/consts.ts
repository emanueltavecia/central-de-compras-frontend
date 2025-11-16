import { RoutePermission } from './types'

import { UserRole } from '@/utils/enums'

export const ROUTE_PERMISSIONS: RoutePermission = {
  dashboard: {
    name: 'Dashboard',
    route: '/dashboard',
  },
  campaigns: {
    name: 'Campanhas',
    route: '/campaigns',
    roles: [UserRole.SUPPLIER],
  },
  cashback: {
    name: 'Cashback',
    route: '/cashback',
    roles: [UserRole.STORE],
    submenu: [
      {
        name: 'Carteira',
        route: '/cashback/wallet',
        roles: [UserRole.STORE],
      },
      {
        name: 'Transações',
        route: '/cashback/transactions',
        roles: [UserRole.STORE],
      },
    ],
  },
  orders: {
    name: 'Pedidos',
    route: '/orders',
    roles: [UserRole.STORE, UserRole.SUPPLIER],
  },
  organizations: {
    name: 'Organizações',
    route: '/organizations',
    roles: [UserRole.ADMIN],
  },
  paymentConditions: {
    name: 'Condições de Pagamento',
    route: '/payment-conditions',
    roles: [UserRole.SUPPLIER],
  },
  products: {
    name: 'Produtos',
    route: '/products',
    roles: [UserRole.SUPPLIER],
  },
}
