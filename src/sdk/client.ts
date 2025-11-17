import axios from 'axios'

import { logout } from '@/lib/auth'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function clearAuthToken() {
  delete api.defaults.headers.common.Authorization
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout()
    }

    return Promise.reject(error)
  },
)
