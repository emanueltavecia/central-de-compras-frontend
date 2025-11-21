'use server'

import { cookies } from 'next/headers'

import { getSession } from '../auth'

import {
  Organization,
  OrganizationFilters,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  UpdateOrganizationStatusInput,
} from '@/sdk/organizations/types'
import type { User } from '@/types/user'
import { COOKIE_NAMES } from '@/utils/constants/cookie-names'
import { UserRole } from '@/utils/enums'
import { getErrorMessage } from '@/utils/error-messages'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAMES.AUTH.TOKEN)?.value

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const fullUrl = `${API_URL}${url}`
  console.log('Fetching:', fullUrl)

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'Erro desconhecido' }))
    console.error('API Error:', {
      url: fullUrl,
      status: response.status,
      error,
    })
    throw new Error(getErrorMessage(error))
  }

  return response.json()
}

export async function getAllOrganizations(
  filters?: OrganizationFilters,
): Promise<Organization[]> {
  const { user } = await getSession()
  if (user?.role.name === UserRole.SUPPLIER) {
    return []
  }
  const params = new URLSearchParams()
  if (filters?.type) params.append('type', filters.type)
  if (filters?.active !== undefined)
    params.append('active', String(filters.active))

  const queryString = params.toString()
  const url = `/organizations${queryString ? `?${queryString}` : ''}`

  const response = await fetchWithAuth(url)
  return response.data
}

export async function getOrganizationById(id: string): Promise<Organization> {
  const response = await fetchWithAuth(`/organizations/${id}`)
  return response.data
}

export async function createOrganization(
  input: CreateOrganizationInput,
): Promise<Organization> {
  const response = await fetchWithAuth('/organizations', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return response.data
}

export async function updateOrganization(
  id: string,
  input: UpdateOrganizationInput,
): Promise<Organization> {
  const response = await fetchWithAuth(`/organizations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
  return response.data
}

export async function deleteOrganization(
  id: string,
): Promise<{ message: string }> {
  const response = await fetchWithAuth(`/organizations/${id}`, {
    method: 'DELETE',
  })
  return response
}

export async function updateOrganizationStatus(
  id: string,
  input: UpdateOrganizationStatusInput,
): Promise<Organization> {
  const response = await fetchWithAuth(`/organizations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
  return response.data
}

export async function getOrganizationUsers(id: string): Promise<User[]> {
  const response = await fetchWithAuth(`/organizations/${id}/users`)
  return response.data
}
