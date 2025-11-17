'use server'

import { cookies } from 'next/headers'

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { logout } from '@/lib/auth'
import { COOKIE_NAMES } from '@/utils/constants/cookie-names'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function setAuthToken(token: string) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`
}

export async function clearAuthToken() {
  delete api.defaults.headers.common.Authorization
}

async function getTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAMES.AUTH.TOKEN)?.value || null
    return token
  } catch {
    return null
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401) {
      if (
        originalRequest.method?.toLowerCase() === 'get' &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true

        const token = await getTokenFromCookies()
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      }

      logout()
    }

    return Promise.reject(error)
  },
)
