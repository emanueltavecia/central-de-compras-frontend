import { CashbackReferenceType, CashbackTransactionType } from '@/utils/enums'

export interface CashbackWallet {
  id?: string
  organizationId?: string
  availableBalance?: number
  totalEarned?: number
  totalUsed?: number
  createdAt?: string
  updatedAt?: string
}

export interface CashbackTransaction {
  id?: string
  cashbackWalletId?: string
  orderId?: string
  type?: CashbackTransactionType
  amount?: number
  referenceId?: string
  referenceType?: CashbackReferenceType
  description?: string
  createdAt?: string
}

export interface CashbackFilters {
  organizationId?: string
  orderId?: string
}
