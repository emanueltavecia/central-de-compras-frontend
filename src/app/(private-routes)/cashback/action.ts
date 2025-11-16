'use server'

import { cacheTag } from 'next/cache'

import { getSession } from '@/lib/auth'
import { cashbackService } from '@/sdk/cashback'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'

async function fetchCashbackWallet(organizationId: string) {
  'use cache'
  cacheTag(CACHE_TAGS.CASHBACK.WALLET)

  const wallet = await cashbackService.getWallet(organizationId)
  return wallet
}

async function fetchCashbackTransactions(organizationId: string) {
  'use cache'
  cacheTag(CACHE_TAGS.CASHBACK.TRANSACTIONS)

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
