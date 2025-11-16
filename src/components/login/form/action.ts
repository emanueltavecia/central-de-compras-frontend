'use server'

import { createSession } from '@/lib/auth/session'
import { authService } from '@/sdk/auth'
import { setAuthToken } from '@/sdk/client'
import type { LoginFormData } from '@/utils/schemas/login'

interface LoginActionResponse {
  isSuccess: boolean
  error?: string
}

export async function login(
  credentials: LoginFormData,
): Promise<LoginActionResponse> {
  try {
    const response = await authService.login(credentials)
    await createSession(response.token, response.user)
    setAuthToken(response.token)

    return {
      isSuccess: true,
    }
  } catch (error) {
    console.error('Erro no login:', error)

    if (error && typeof error === 'object' && 'message' in error) {
      return {
        isSuccess: false,
        error: (error as { message: string }).message,
      }
    }

    return {
      isSuccess: false,
      error: 'Erro inesperado ao fazer login. Tente novamente.',
    }
  }
}
