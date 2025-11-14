'use server'

import { revalidateTag } from 'next/cache'

import { CACHE_TAGS } from '@/utils/constants/cache-tags'

export async function dashboardAction() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  revalidateTag(CACHE_TAGS.DASHBOARD.DATA, { expire: 0 })
}
