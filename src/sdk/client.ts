'use server'

import { cookies } from 'next/headers'

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { logout } from '@/lib/auth'
import { ErrorResponse, ValidationError } from '@/types'
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
  async (originalError: AxiosError) => {
    const originalRequest =
      originalError.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

    if (originalError.response?.status === 401) {
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

    const errorData = originalError.response?.data as ErrorResponse

    const firstValidationError = (
      errorData?.error as {
        validationErrors: ValidationError[]
      }
    )?.validationErrors?.[0]

    const error = {
      ...originalError,
      message: firstValidationError
        ? `${firstValidationError?.field}: ${firstValidationError?.message}`
        : errorData?.message || originalError.message,
    }

    return Promise.reject(error)
  },
)
