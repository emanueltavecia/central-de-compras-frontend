'use server'

import { authService } from '@/sdk/auth'
import type { LoginFormData } from '@/utils/schemas/login'

interface LoginActionResponse {
  isSuccess: boolean
  error?: string
  data?: {
    token: string
    user: {
      id: string
      name: string
      email: string
    }
  }
}

export async function login(
  credentials: LoginFormData,
): Promise<LoginActionResponse> {
  try {
    const response = await authService.login(credentials)

    // Aqui você pode salvar o token no cookie ou sessão
    // Por exemplo, usando cookies do Next.js:
    // cookies().set('auth-token', response.token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 60 * 60 * 24 * 7, // 7 dias
    // })

    return {
      isSuccess: true,
      data: response,
    }
  } catch (error) {
    console.error('Erro no login:', error)

    // Type guard para AuthError
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
