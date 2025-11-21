export const PRODUCTS_ROUTES = {
  BASE: '/products',
  BY_ID: (id: string) => `/products/${id}`,
  STATUS: (id: string) => `/products/${id}/status`,
}
