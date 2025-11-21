import { DashboardStats } from './types'

import { api } from '@/sdk'
import { SuccessResponse } from '@/types/request'

export const statsService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const {
        data: { data },
      } = await api.get<SuccessResponse<DashboardStats>>('/stats')
      return data
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw error
    }
  },
}
