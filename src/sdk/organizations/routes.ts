import {
  Organization,
  OrganizationFilters,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  UpdateOrganizationStatusInput,
} from './types'

import { api } from '../client'

import type { User } from '@/types/user'

export const organizationsRoutes = {
  async getAll(filters?: OrganizationFilters): Promise<Organization[]> {
    const { data } = await api.get<{ data: Organization[] }>('/organizations', {
      params: filters,
    })
    return data.data
  },

  async getById(id: string): Promise<Organization> {
    const { data } = await api.get<{ data: Organization }>(
      `/organizations/${id}`,
    )
    return data.data
  },

  async create(input: CreateOrganizationInput): Promise<Organization> {
    const { data } = await api.post<{ data: Organization }>(
      '/organizations',
      input,
    )
    return data.data
  },

  async update(
    id: string,
    input: UpdateOrganizationInput,
  ): Promise<Organization> {
    const { data } = await api.put<{ data: Organization }>(
      `/organizations/${id}`,
      input,
    )
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/organizations/${id}`)
  },

  async updateStatus(
    id: string,
    input: UpdateOrganizationStatusInput,
  ): Promise<Organization> {
    const { data } = await api.patch<{ data: Organization }>(
      `/organizations/${id}/status`,
      input,
    )
    return data.data
  },

  async getUsers(id: string): Promise<User[]> {
    const { data } = await api.get<{ data: User[] }>(
      `/organizations/${id}/users`,
    )
    return data.data
  },
}
