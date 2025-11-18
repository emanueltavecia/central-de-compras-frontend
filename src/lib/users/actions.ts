'use server'

import { cookies } from 'next/headers'

import { createSession } from '@/lib/auth'
import { usersRoutes } from '@/sdk/users/routes'
import type {
  User,
  UserFilters,
  CreateUserInput,
  UpdateUserInput,
  UpdateUserStatusInput,
} from '@/sdk/users/types'
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
    const error = await response
      .json()
      .catch(() => ({ message: 'Erro desconhecido' }))
    console.error('User API Error:', { url, status: response.status, error })
    throw new Error(getErrorMessage(error))
  }

  return response.json()
}

export async function getAllUsers(filters?: UserFilters): Promise<User[]> {
  const result = await fetchWithAuth(usersRoutes.list(filters))
  return result.data || []
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await fetchWithAuth(usersRoutes.getById(id))
    return result.data || null
  } catch {
    return null
  }
}

export async function createUser(data: CreateUserInput): Promise<User> {
  const result = await fetchWithAuth(usersRoutes.create(), {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return result.data
}

export async function updateUser(
  id: string,
  data: UpdateUserInput,
): Promise<User> {
  const result = await fetchWithAuth(usersRoutes.update(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  try {
    const profile = await fetchWithAuth('/auth/profile')
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAMES.AUTH.TOKEN)?.value
    if (token && profile.data) {
      await createSession(token, profile.data)
    }
  } catch (err) {
    console.error('Failed to update session after user update:', err)
  }

  return result.data
}

export async function deleteUser(id: string): Promise<void> {
  await fetchWithAuth(usersRoutes.delete(id), {
    method: 'DELETE',
  })
}

export async function updateUserStatus(
  id: string,
  data: UpdateUserStatusInput,
): Promise<User> {
  const result = await fetchWithAuth(usersRoutes.updateStatus(id), {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return result.data
}
