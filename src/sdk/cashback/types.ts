import type { CashbackTransaction, CashbackWallet } from '@/types'

export interface GetCashbackWalletResponse {
  data: CashbackWallet
}

export interface GetCashbackTransactionsResponse {
  data: CashbackTransaction[]
}
