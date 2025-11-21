'use server'

import { cookies } from 'next/headers'

import { DashboardStats } from '@/sdk/stats/types'
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

export async function getDashboardStats(): Promise<DashboardStats> {
  const result = await fetchWithAuth('/stats')
  return result.data
}
