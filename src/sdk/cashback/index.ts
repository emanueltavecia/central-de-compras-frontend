import type {
  GetCashbackTransactionsResponse,
  GetCashbackWalletResponse,
} from './types'
import { cashbackRoutes } from './routes'

import { api } from '@/sdk/client'

export const cashbackService = {
  async getWallet(organizationId: string) {
    const response = await api.get<GetCashbackWalletResponse>(
      cashbackRoutes.getWallet(organizationId),
    )
    return response.data
  },

  async getTransactions(organizationId: string) {
    const response = await api.get<GetCashbackTransactionsResponse>(
      cashbackRoutes.getTransactions(organizationId),
    )
    return response.data
  },
}
