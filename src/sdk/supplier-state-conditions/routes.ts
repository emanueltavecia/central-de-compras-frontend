export const SUPPLIER_STATE_CONDITIONS_ROUTES = {
  GET_CONDITIONS: '/supplier-state-conditions',
  CREATE_CONDITION: '/supplier-state-conditions',
  UPDATE_CONDITION: (id: string) => `/supplier-state-conditions/${id}`,
  DELETE_CONDITION: (id: string) => `/supplier-state-conditions/${id}`,
} as const
