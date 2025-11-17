'use server'

import { cookies } from 'next/headers'

import { changeRequestsRoutes } from '@/sdk/change-requests/routes'
import type {
  ChangeRequest,
  ChangeRequestFilters,
  CreateChangeRequestInput,
  ReviewChangeRequestInput,
} from '@/sdk/change-requests/types'
import { COOKIE_NAMES } from '@/utils/constants/cookie-names'
import { getErrorMessage } from '@/utils/error-messages'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAMES.AUTH.TOKEN)?.value

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let error
    try {
      error = await response.json()
      console.error('Erro do backend:', error)
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta:', parseError)
      console.error(
        'Status:',
        response.status,
        'StatusText:',
        response.statusText,
      )
      error = { message: `Erro ${response.status}: ${response.statusText}` }
    }
    throw new Error(getErrorMessage(error))
  }

  return response.json()
}

export async function getAllChangeRequests(
  filters?: ChangeRequestFilters,
): Promise<ChangeRequest[]> {
  const result = await fetchWithAuth(changeRequestsRoutes.list(filters))
  return result.data || []
}

export async function getPendingCount(
  organizationId?: string,
): Promise<number> {
  const result = await fetchWithAuth(
    changeRequestsRoutes.pendingCount(organizationId),
  )
  return result.data?.count || 0
}

export async function getChangeRequestById(
  id: string,
): Promise<ChangeRequest | null> {
  try {
    const result = await fetchWithAuth(changeRequestsRoutes.getById(id))
    return result.data || null
  } catch {
    return null
  }
}

export async function createChangeRequest(
  data: CreateChangeRequestInput,
): Promise<ChangeRequest> {
  const result = await fetchWithAuth(changeRequestsRoutes.create(), {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return result.data
}

export async function reviewChangeRequest(
  id: string,
  data: ReviewChangeRequestInput,
): Promise<ChangeRequest> {
  const result = await fetchWithAuth(changeRequestsRoutes.review(id), {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return result.data
}

export async function deleteChangeRequest(id: string): Promise<void> {
  await fetchWithAuth(changeRequestsRoutes.delete(id), {
    method: 'DELETE',
  })
}
