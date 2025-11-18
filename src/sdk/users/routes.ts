import type { UserFilters } from './types'

export const usersRoutes = {
  list: (filters?: UserFilters) => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.roleId) params.append('roleId', filters.roleId)
    if (filters?.organizationId)
      params.append('organizationId', filters.organizationId)

    const queryString = params.toString()
    return `/users${queryString ? `?${queryString}` : ''}`
  },

  getById: (id: string) => `/users/${id}`,

  create: () => '/users',

  update: (id: string) => `/users/${id}`,

  delete: (id: string) => `/users/${id}`,

  updateStatus: (id: string) => `/users/${id}/status`,

  getPermissions: (id: string) => `/users/${id}/permissions`,
}
