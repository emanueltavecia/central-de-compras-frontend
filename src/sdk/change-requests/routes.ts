import type { ChangeRequestFilters } from './types'

const BASE_URL = '/change-requests'

export const changeRequestsRoutes = {
  list: (filters?: ChangeRequestFilters) => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.organizationId)
      params.append('organizationId', filters.organizationId)
    if (filters?.userId) params.append('userId', filters.userId)
    const queryString = params.toString()
    return `${BASE_URL}${queryString ? `?${queryString}` : ''}`
  },
  pendingCount: (organizationId?: string) => {
    const params = new URLSearchParams()
    if (organizationId) params.append('organizationId', organizationId)
    const queryString = params.toString()
    return `${BASE_URL}/pending-count${queryString ? `?${queryString}` : ''}`
  },
  getById: (id: string) => `${BASE_URL}/${id}`,
  create: () => BASE_URL,
  review: (id: string) => `${BASE_URL}/${id}/review`,
  delete: (id: string) => `${BASE_URL}/${id}`,
}
