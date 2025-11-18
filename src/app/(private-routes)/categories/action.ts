'use server'

import { categoryService } from '@/sdk/category'

export async function getCategories() {
  try {
    const categories = await categoryService.getCategories({})
    return categories
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    throw error
  }
}
