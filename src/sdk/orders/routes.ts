export const ORDERS_ROUTES = {
  BASE: '/orders',
  BY_ID: (id: string) => `/orders/${id}`,
  CALCULATE: '/orders/calculate',
  UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
}
