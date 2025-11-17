'use server'

import { getSession } from '@/lib/auth'
import { cashbackService } from '@/sdk/cashback'

async function fetchCashbackWallet(organizationId: string) {
  const wallet = await cashbackService.getWallet(organizationId)
  return wallet
}

async function fetchCashbackTransactions(organizationId: string) {
  const transactions = await cashbackService.getTransactions(organizationId)
  return transactions
}

export async function getCashbackWallet() {
  const { user } = await getSession()

  if (!user?.organizationId) {
    throw new Error('Organization ID not found')
  }

  return fetchCashbackWallet(user.organizationId)
}

export async function getCashbackTransactions() {
  const { user } = await getSession()

  if (!user?.organizationId) {
    throw new Error('Organization ID not found')
  }

  return fetchCashbackTransactions(user.organizationId)
}
