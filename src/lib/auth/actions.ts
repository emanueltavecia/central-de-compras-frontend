'use server'

import { cookies } from 'next/headers'

import type { User } from '@/types/user'
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
    throw new Error(getErrorMessage(error))
  }

  return response.json()
}

export async function getProfile(): Promise<User> {
  const result = await fetchWithAuth('/auth/profile')
  const user = result.data
  return {
    ...user,
    profileImage: user.profileImage || user.profileImageUrl || undefined,
  } as User
}
