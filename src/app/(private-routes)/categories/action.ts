'use server'

import { getSession } from '@/lib/auth'
import { categoryService } from '@/sdk/category'

export async function getCategories(supplierOrgId?: string) {
  const { user } = await getSession()
  try {
    const categories = await categoryService.getCategories({
      supplierOrgId: supplierOrgId || user?.organizationId,
    })
    return categories
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    throw error
  }
}
