export const PAYMENT_CONDITIONS_ROUTES = {
  GET_PAYMENT_CONDITIONS: '/payment-conditions',
  CREATE_PAYMENT_CONDITION: '/payment-conditions',
  UPDATE_PAYMENT_CONDITION: (id: string) => `/payment-conditions/${id}`,
  UPDATE_PAYMENT_CONDITION_STATUS: (id: string) =>
    `/payment-conditions/${id}/status`,
  DELETE_PAYMENT_CONDITION: (id: string) => `/payment-conditions/${id}`,
} as const
