import { LoginResponse } from './types'

import { api } from '@/sdk'
import { AUTH_ROUTES } from '@/sdk/auth/routes'
import type { LoginFormData } from '@/utils/schemas/login'

export const authService = {
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
      const { data } = await api.post<LoginResponse>(
        AUTH_ROUTES.LOGIN,
        credentials,
      )
      return data
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      throw error
    }
  },

  async me(): Promise<LoginResponse['user']> {
    try {
      const { data } = await api.get<LoginResponse['user']>(AUTH_ROUTES.ME)
      return data
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      throw error
    }
  },
}
