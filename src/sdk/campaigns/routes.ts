export const CAMPAIGNS_ROUTES = {
  GET_CAMPAIGNS: '/campaigns',
  CREATE_CAMPAIGN: '/campaigns',
  UPDATE_CAMPAIGN: (id: string) => `/campaigns/${id}`,
  UPDATE_CAMPAIGN_STATUS: (id: string) => `/campaigns/${id}/status`,
  DELETE_CAMPAIGN: (id: string) => `/campaigns/${id}`,
} as const
