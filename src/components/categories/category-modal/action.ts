'use server'

import { revalidateTag } from 'next/cache'

import { categoryService } from '@/sdk/category'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'
import type { CategoryFormData } from '@/utils/schemas/category'

export async function createCategory(data: CategoryFormData) {
  try {
    await categoryService.createCategory(data)
    revalidateTag(CACHE_TAGS.CATEGORIES.LIST, { expire: 0 })
    return { isSuccess: true }
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return {
      isSuccess: false,
      error: 'Erro ao criar categoria. Tente novamente.',
    }
  }
}

export async function updateCategory(id: string, data: CategoryFormData) {
  try {
    await categoryService.updateCategory(id, data)
    revalidateTag(CACHE_TAGS.CATEGORIES.LIST, { expire: 0 })
    return { isSuccess: true }
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error)
    return {
      isSuccess: false,
      error: 'Erro ao atualizar categoria. Tente novamente.',
    }
  }
}

export async function deleteCategory(id: string) {
  try {
    await categoryService.deleteCategory(id)
    revalidateTag(CACHE_TAGS.CATEGORIES.LIST, { expire: 0 })
    return { isSuccess: true }
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return {
      isSuccess: false,
      error: 'Erro ao excluir categoria. Tente novamente.',
    }
  }
}
