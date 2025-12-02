export interface DashboardAdminStats {
  totalStores: number
  totalSuppliers: number
  totalUsers: number
}

export interface DashboardSupplierStats {
  activeCampaigns: number
  activeSupplierStateConditions: number
  activeOrders: number
  activePaymentConditions: number
  activeProducts: number
}

export interface DashboardStoreStats {
  placedOrders: number
  confirmedOrders: number
  shippedOrders: number
  cashbackBalance: number
}

export type DashboardStats =
  | DashboardAdminStats
  | DashboardSupplierStats
  | DashboardStoreStats
