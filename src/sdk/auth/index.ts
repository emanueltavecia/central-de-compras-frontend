import { LoginResponse } from './types'

import { api } from '@/sdk'
import { AUTH_ROUTES } from '@/sdk/auth/routes'
import { SuccessResponse } from '@/types/request'
import { User } from '@/types/user'
import type { LoginFormData } from '@/utils/schemas/login'

export const authService = {
  async login(credentials: LoginFormData): Promise<LoginResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.post<LoginResponse>(AUTH_ROUTES.LOGIN, credentials)
      return data
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      throw error
    }
  },

  async me(): Promise<User> {
    try {
      const {
        data: { data },
      } = await api.get<SuccessResponse<User>>(AUTH_ROUTES.ME)
      return data
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      throw error
    }
  },
}
