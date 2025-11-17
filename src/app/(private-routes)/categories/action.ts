'use server'

import { cacheTag } from 'next/cache'

import { categoryService } from '@/sdk/category'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'

export async function getCategories() {
  'use cache'
  cacheTag(CACHE_TAGS.CATEGORIES.LIST)

  try {
    const categories = await categoryService.getCategories({})
    return categories
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    throw error
  }
}
